import enum
import uuid
from datetime import datetime, date, time
from sqlalchemy import Column, String, Integer, Date, Time, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class SessionStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    CONCLUDED = "CONCLUDED"
    ADJOURNED = "ADJOURNED"
    REFERRED_ADR = "REFERRED_ADR"

class CourtRoom(Base):
    __tablename__ = "courtrooms"

    hall_id = Column(String(50), primary_key=True)
    hall_name = Column(String(100), nullable=False)
    district = Column(String(100), default="Indore Commercial Court")
    max_daily_slots = Column(Integer, default=12)

class CMHSession(Base):
    __tablename__ = "cmh_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False)
    judge_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    court_hall_id = Column(String(50), ForeignKey("courtrooms.hall_id"), nullable=False)
    
    hearing_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    
    webrtc_room_id = Column(String(100), nullable=False, default=lambda: f"cmh-room-{uuid.uuid4().hex[:8]}")
    status = Column(Enum(SessionStatus), default=SessionStatus.SCHEDULED)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", foreign_keys=[case_id], overlaps="sessions")
