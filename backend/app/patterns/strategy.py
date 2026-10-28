"""
=============================================================================
GANG OF FOUR (GoF) BEHAVIORAL PATTERN: STRATEGY
Project: Case Management Hearing e-Portal (Order XV-A CPC)
Module: backend.app.patterns.strategy
=============================================================================
Defines a family of scheduling algorithms, encapsulates each one, and makes
them interchangeable. Strategy lets the clash detection algorithm vary
independently from the clients that use it.
"""

from abc import ABC, abstractmethod
from datetime import date, time, datetime, timedelta
from typing import List, Tuple, Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models.schedule import CMHSession, SessionStatus
from backend.app.models.case import Case
from backend.app.models.user import User


class SchedulingStrategy(ABC):
    """
    Abstract Strategy: Common interface for all clash detection and
    hearing slot validation algorithms.
    """
    @property
    @abstractmethod
    def strategy_name(self) -> str:
        """Name of the scheduling strategy."""
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """Detailed procedural explanation."""
        pass

    @abstractmethod
    def check_conflict(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        start_time: time,
        end_time: time,
        court_hall_id: str,
        is_virtual: bool = False
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        """
        Executes collision detection.
        Returns: (has_conflict, diagnostic_message, conflicting_counsel_bar_id, conflicting_court_hall)
        """
        pass

    @abstractmethod
    def recommend_alternative_slot(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        duration_minutes: int,
        court_hall_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Recommends the next earliest open window on hearing_date without clashes.
        """
        pass


# ---------------------------------------------------------------------------
# CONCRETE STRATEGY 1: STRICT BENCH SLOTTING (Standard In-Person Zero Tolerance)
# ---------------------------------------------------------------------------

class StrictBenchSlottingStrategy(SchedulingStrategy):
    """
    Concrete Strategy 1: Strict Physical Courtroom Slotting.
    Strictly forbids both courtroom hall double-booking and counsel overlap.
    Standard requirement for District and Commercial Court physical benches.
    """
    @property
    def strategy_name(self) -> str:
        return "Strict Bench Slotting Strategy"

    @property
    def description(self) -> str:
        return "Zero-tolerance non-overlap policy for physical courtroom benches and advocate appearances."

    def check_conflict(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        start_time: time,
        end_time: time,
        court_hall_id: str,
        is_virtual: bool = False
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        advocates = db.query(User).filter(User.bar_council_id.in_(advocate_bar_ids)).all() if advocate_bar_ids else []
        advocate_ids = [adv.id for adv in advocates]
        bar_id_map = {adv.id: adv.bar_council_id for adv in advocates}

        active_sessions = db.query(CMHSession).join(Case, CMHSession.case_id == Case.id).filter(
            CMHSession.hearing_date == hearing_date,
            CMHSession.status == SessionStatus.SCHEDULED
        ).all()

        for session in active_sessions:
            # Overlap condition: max(start1, start2) < min(end1, end2)
            has_time_overlap = (session.start_time < end_time) and (session.end_time > start_time)
            if not has_time_overlap:
                continue

            # Check court hall collision
            if session.court_hall_id == court_hall_id:
                return (
                    True,
                    f"[Strict Strategy] Court Hall '{court_hall_id}' is already booked between {session.start_time} and {session.end_time}.",
                    None,
                    court_hall_id
                )

            # Check advocate collision
            session_case = session.case if getattr(session, "case", None) else db.query(Case).filter(Case.id == session.case_id).first()
            if session_case and advocate_ids:
                involved_counsels = [session_case.plaintiff_counsel_id, session_case.defendant_counsel_id]
                for counsel_id in involved_counsels:
                    if counsel_id in advocate_ids:
                        bar_id = bar_id_map.get(counsel_id, "Unknown Bar ID")
                        return (
                            True,
                            f"[Strict Strategy] Scheduling Collision: Advocate [{bar_id}] is already appearing in Court Hall '{session.court_hall_id}' from {session.start_time} to {session.end_time}.",
                            bar_id,
                            session.court_hall_id
                        )

        return False, None, None, None

    def recommend_alternative_slot(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        duration_minutes: int,
        court_hall_id: str
    ) -> Optional[Dict[str, Any]]:
        # Scan slots between 10:30 AM and 16:30 PM (Court Working Hours)
        court_start = datetime.combine(hearing_date, time(10, 30))
        court_end = datetime.combine(hearing_date, time(16, 30))
        delta = timedelta(minutes=duration_minutes)

        current = court_start
        while current + delta <= court_end:
            slot_start = current.time()
            slot_end = (current + delta).time()
            conflict, _, _, _ = self.check_conflict(
                db, advocate_bar_ids, hearing_date, slot_start, slot_end, court_hall_id
            )
            if not conflict:
                return {
                    "hearing_date": hearing_date.isoformat(),
                    "recommended_start": slot_start.strftime("%H:%M:%S"),
                    "recommended_end": slot_end.strftime("%H:%M:%S"),
                    "court_hall_id": court_hall_id,
                    "strategy": self.strategy_name
                }
            current += timedelta(minutes=15)
        return None


# ---------------------------------------------------------------------------
# CONCRETE STRATEGY 2: FLEXIBLE BUFFER SLOTTING (Inter-Bench Transit Buffer)
# ---------------------------------------------------------------------------

class FlexibleBufferSlottingStrategy(SchedulingStrategy):
    """
    Concrete Strategy 2: Multi-Bench Transit Buffer.
    Inserts a mandatory transition window (default 15 minutes) between hearings in
    different court halls so advocates can physically move between court complexes.
    """
    def __init__(self, buffer_minutes: int = 15):
        self.buffer_minutes = buffer_minutes

    @property
    def strategy_name(self) -> str:
        return f"Flexible Buffer Slotting Strategy ({self.buffer_minutes}m Transit)"

    @property
    def description(self) -> str:
        return f"Applies a {self.buffer_minutes}-minute inter-hall travel buffer to prevent back-to-back advocate exhaustion."

    def check_conflict(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        start_time: time,
        end_time: time,
        court_hall_id: str,
        is_virtual: bool = False
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        advocates = db.query(User).filter(User.bar_council_id.in_(advocate_bar_ids)).all() if advocate_bar_ids else []
        advocate_ids = [adv.id for adv in advocates]
        bar_id_map = {adv.id: adv.bar_council_id for adv in advocates}

        active_sessions = db.query(CMHSession).join(Case, CMHSession.case_id == Case.id).filter(
            CMHSession.hearing_date == hearing_date,
            CMHSession.status == SessionStatus.SCHEDULED
        ).all()

        for session in active_sessions:
            # Direct hall check (no buffer needed for same hall, just strict non-overlap)
            if session.court_hall_id == court_hall_id:
                if (session.start_time < end_time) and (session.end_time > start_time):
                    return (
                        True,
                        f"[Buffer Strategy] Court Hall '{court_hall_id}' is occupied from {session.start_time} to {session.end_time}.",
                        None,
                        court_hall_id
                    )

            # Counsel check with buffer margin applied
            session_case = session.case if getattr(session, "case", None) else db.query(Case).filter(Case.id == session.case_id).first()
            if session_case and advocate_ids:
                involved = [session_case.plaintiff_counsel_id, session_case.defendant_counsel_id]
                for counsel_id in involved:
                    if counsel_id in advocate_ids:
                        bar_id = bar_id_map.get(counsel_id, "Unknown Bar ID")
                        
                        # Apply buffer to session window
                        sess_dt_start = datetime.combine(hearing_date, session.start_time) - timedelta(minutes=self.buffer_minutes)
                        sess_dt_end = datetime.combine(hearing_date, session.end_time) + timedelta(minutes=self.buffer_minutes)
                        req_dt_start = datetime.combine(hearing_date, start_time)
                        req_dt_end = datetime.combine(hearing_date, end_time)

                        if (sess_dt_start.time() < req_dt_end.time()) and (sess_dt_end.time() > req_dt_start.time()):
                            return (
                                True,
                                f"[Buffer Strategy] Advocate [{bar_id}] has an adjacent session in Court Hall '{session.court_hall_id}' ({session.start_time}-{session.end_time}). Violates required {self.buffer_minutes}-min inter-hall transit buffer.",
                                bar_id,
                                session.court_hall_id
                            )

        return False, None, None, None

    def recommend_alternative_slot(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        duration_minutes: int,
        court_hall_id: str
    ) -> Optional[Dict[str, Any]]:
        court_start = datetime.combine(hearing_date, time(10, 30))
        court_end = datetime.combine(hearing_date, time(16, 30))
        delta = timedelta(minutes=duration_minutes)

        current = court_start
        while current + delta <= court_end:
            slot_start = current.time()
            slot_end = (current + delta).time()
            conflict, _, _, _ = self.check_conflict(
                db, advocate_bar_ids, hearing_date, slot_start, slot_end, court_hall_id
            )
            if not conflict:
                return {
                    "hearing_date": hearing_date.isoformat(),
                    "recommended_start": slot_start.strftime("%H:%M:%S"),
                    "recommended_end": slot_end.strftime("%H:%M:%S"),
                    "court_hall_id": court_hall_id,
                    "strategy": self.strategy_name
                }
            current += timedelta(minutes=15)
        return None


# ---------------------------------------------------------------------------
# CONCRETE STRATEGY 3: VIRTUAL HYBRID SLOTTING (Video Conferencing Mode)
# ---------------------------------------------------------------------------

class VirtualHybridSlottingStrategy(SchedulingStrategy):
    """
    Concrete Strategy 3: Virtual Courtroom / Hybrid VC Hearing Mode.
    Court hall physical collisions are disregarded (since multiple VC streams or
    links can be concurrently open), but counsel personal clashes remain strictly checked.
    """
    @property
    def strategy_name(self) -> str:
        return "Virtual Hybrid Slotting Strategy"

    @property
    def description(self) -> str:
        return "E-Courts VC Link mode: courtroom physical hall collision waived, counsel personal clash enforced."

    def check_conflict(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        start_time: time,
        end_time: time,
        court_hall_id: str,
        is_virtual: bool = True
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        advocates = db.query(User).filter(User.bar_council_id.in_(advocate_bar_ids)).all() if advocate_bar_ids else []
        advocate_ids = [adv.id for adv in advocates]
        bar_id_map = {adv.id: adv.bar_council_id for adv in advocates}

        active_sessions = db.query(CMHSession).join(Case, CMHSession.case_id == Case.id).filter(
            CMHSession.hearing_date == hearing_date,
            CMHSession.status == SessionStatus.SCHEDULED
        ).all()

        for session in active_sessions:
            has_time_overlap = (session.start_time < end_time) and (session.end_time > start_time)
            if not has_time_overlap:
                continue

            # Note: Court hall collision is waived in Virtual mode
            # However, counsel double-booking remains an absolute conflict
            session_case = session.case if getattr(session, "case", None) else db.query(Case).filter(Case.id == session.case_id).first()
            if session_case and advocate_ids:
                involved = [session_case.plaintiff_counsel_id, session_case.defendant_counsel_id]
                for counsel_id in involved:
                    if counsel_id in advocate_ids:
                        bar_id = bar_id_map.get(counsel_id, "Unknown Bar ID")
                        return (
                            True,
                            f"[Virtual Strategy] Counsel [{bar_id}] is already appearing in another virtual or physical hearing session ({session.start_time} - {session.end_time}).",
                            bar_id,
                            session.court_hall_id
                        )

        return False, None, None, None

    def recommend_alternative_slot(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        duration_minutes: int,
        court_hall_id: str
    ) -> Optional[Dict[str, Any]]:
        court_start = datetime.combine(hearing_date, time(10, 30))
        court_end = datetime.combine(hearing_date, time(16, 30))
        delta = timedelta(minutes=duration_minutes)

        current = court_start
        while current + delta <= court_end:
            slot_start = current.time()
            slot_end = (current + delta).time()
            conflict, _, _, _ = self.check_conflict(
                db, advocate_bar_ids, hearing_date, slot_start, slot_end, court_hall_id, is_virtual=True
            )
            if not conflict:
                return {
                    "hearing_date": hearing_date.isoformat(),
                    "recommended_start": slot_start.strftime("%H:%M:%S"),
                    "recommended_end": slot_end.strftime("%H:%M:%S"),
                    "court_hall_id": court_hall_id,
                    "strategy": self.strategy_name
                }
            current += timedelta(minutes=15)
        return None


# ---------------------------------------------------------------------------
# STRATEGY CONTEXT (Client Interface)
# ---------------------------------------------------------------------------

class ClashDetectionContext:
    """
    GoF Strategy Context: Maintains a reference to one of the concrete Strategy objects
    and delegates clash-detection execution to it. Allows runtime policy switching.
    """
    def __init__(self, strategy: Optional[SchedulingStrategy] = None):
        self._strategy: SchedulingStrategy = strategy or StrictBenchSlottingStrategy()

    @property
    def strategy(self) -> SchedulingStrategy:
        return self._strategy

    def set_strategy(self, strategy: SchedulingStrategy) -> None:
        """Dynamically hot-swap the scheduling strategy at runtime."""
        self._strategy = strategy

    def execute_conflict_check(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        start_time: time,
        end_time: time,
        court_hall_id: str,
        is_virtual: bool = False
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        """Delegates conflict evaluation to current active strategy."""
        return self._strategy.check_conflict(
            db=db,
            advocate_bar_ids=advocate_bar_ids,
            hearing_date=hearing_date,
            start_time=start_time,
            end_time=end_time,
            court_hall_id=court_hall_id,
            is_virtual=is_virtual
        )

    def recommend_slot(
        self,
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        duration_minutes: int,
        court_hall_id: str
    ) -> Optional[Dict[str, Any]]:
        """Delegates recommendation generation to current active strategy."""
        return self._strategy.recommend_alternative_slot(
            db=db,
            advocate_bar_ids=advocate_bar_ids,
            hearing_date=hearing_date,
            duration_minutes=duration_minutes,
            court_hall_id=court_hall_id
        )
