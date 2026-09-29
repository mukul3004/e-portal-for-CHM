import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base

class StanceType(str, enum.Enum):
    PENDING = "PENDING"
    ADMIT_EXECUTION = "ADMIT_EXECUTION"
    ADMIT_CONTENTS = "ADMIT_CONTENTS"
    DENY = "DENY"

class ItemResolutionStatus(str, enum.Enum):
    PENDING = "PENDING"
    UNDISPUTED_FACT = "UNDISPUTED_FACT"
    CONTESTED_ISSUE = "CONTESTED_ISSUE"

class AdmissionsChecklist(Base):
    __tablename__ = "admissions_checklists"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), unique=True, nullable=False)
    version_id = Column(Integer, default=1, nullable=False)
    readiness_score = Column(Float, default=0.0)
    is_locked = Column(Boolean, default=False)
    
    plaintiff_submitted_at = Column(DateTime, nullable=True)
    defendant_submitted_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    case = relationship("Case", back_populates="checklist")
    items = relationship("AdmissionItem", back_populates="checklist", cascade="all, delete-orphan")

class AdmissionItem(Base):
    __tablename__ = "admission_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    checklist_id = Column(String(36), ForeignKey("admissions_checklists.id"), nullable=False)
    statement_index = Column(Integer, nullable=False)
    factual_statement = Column(Text, nullable=False)
    exhibit_ref_id = Column(String(36), nullable=True)
    
    plaintiff_stance = Column(Enum(StanceType), default=StanceType.PENDING)
    defendant_stance = Column(Enum(StanceType), default=StanceType.PENDING)
    statutory_denial_reason = Column(String(500), nullable=True)
    resolution_status = Column(Enum(ItemResolutionStatus), default=ItemResolutionStatus.PENDING)

    checklist = relationship("AdmissionsChecklist", back_populates="items")
