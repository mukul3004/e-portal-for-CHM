from datetime import date, time
from typing import List, Tuple, Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.app.patterns.strategy import (
    SchedulingStrategy,
    StrictBenchSlottingStrategy,
    FlexibleBufferSlottingStrategy,
    VirtualHybridSlottingStrategy,
    ClashDetectionContext
)

class ClashDetectionEngine:
    """
    Algorithmic Conflict-Detection Engine (Order XV-A CMH Scheduler).
    Utilizes the GoF Strategy Pattern to dynamically switch between:
      1. StrictBenchSlottingStrategy (default in-person zero overlap)
      2. FlexibleBufferSlottingStrategy (inter-hall transit buffer)
      3. VirtualHybridSlottingStrategy (virtual courtroom mode)
    """

    @classmethod
    def get_strategy_by_name(cls, strategy_name: str = "strict", buffer_minutes: int = 15) -> SchedulingStrategy:
        name = (strategy_name or "strict").lower()
        if "buffer" in name or "flex" in name:
            return FlexibleBufferSlottingStrategy(buffer_minutes=buffer_minutes)
        elif "virt" in name or "hybrid" in name or "vc" in name:
            return VirtualHybridSlottingStrategy()
        return StrictBenchSlottingStrategy()

    @staticmethod
    def check_conflict(
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        start_time: time,
        end_time: time,
        court_hall_id: str,
        strategy_name: str = "strict",
        buffer_minutes: int = 15,
        is_virtual: bool = False
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        """
        Scans all scheduled CMH sessions on hearing_date for overlapping time intervals
        delegating to the selected GoF SchedulingStrategy.
        Returns: (has_conflict, message, conflicting_counsel_bar_id, conflicting_court_hall)
        """
        strat = ClashDetectionEngine.get_strategy_by_name(strategy_name, buffer_minutes)
        context = ClashDetectionContext(strat)
        return context.execute_conflict_check(
            db=db,
            advocate_bar_ids=advocate_bar_ids,
            hearing_date=hearing_date,
            start_time=start_time,
            end_time=end_time,
            court_hall_id=court_hall_id,
            is_virtual=is_virtual
        )

    @staticmethod
    def recommend_slot(
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        duration_minutes: int = 30,
        court_hall_id: str = "Court Hall 01",
        strategy_name: str = "strict"
    ) -> Optional[Dict[str, Any]]:
        """Recommends an alternative conflict-free hearing window."""
        strat = ClashDetectionEngine.get_strategy_by_name(strategy_name)
        context = ClashDetectionContext(strat)
        return context.recommend_slot(
            db=db,
            advocate_bar_ids=advocate_bar_ids,
            hearing_date=hearing_date,
            duration_minutes=duration_minutes,
            court_hall_id=court_hall_id
        )
