from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, time, datetime
from backend.app.models.schedule import SessionStatus

class SlotClashCheckRequest(BaseModel):
    advocate_bar_ids: List[str]
    hearing_date: date
    start_time: time
    end_time: time
    court_hall_id: str

class ClashCheckResponse(BaseModel):
    has_conflict: bool
    conflict_message: Optional[str] = None
    conflicting_counsel_bar_id: Optional[str] = None
    conflicting_court_hall: Optional[str] = None

class BookSlotRequest(BaseModel):
    case_id: str
    court_hall_id: str
    hearing_date: date
    start_time: time
    end_time: time

class CMHSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_id: str
    judge_id: str
    court_hall_id: str
    hearing_date: date
    start_time: time
    end_time: time
    webrtc_room_id: str
    status: SessionStatus
    created_at: datetime
