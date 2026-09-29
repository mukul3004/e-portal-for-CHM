import enum
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Date, DateTime, Enum, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from backend.app.database import Base

class DeadlineStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    DEFAULTED = "DEFAULTED"

class CaseManagementOrder(Base):
    __tablename__ = "case_management_orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), unique=True, nullable=False)
    judge_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow)
    
    # Serialized summaries
    undisputed_facts_summary = Column(Text, nullable=False)
    framed_issues_json = Column(Text, nullable=False)
    witness_quota_plaintiff = Column(Integer, default=2)
    witness_quota_defendant = Column(Integer, default=2)
    
    pdf_storage_url = Column(String(500), nullable=True)
    sha256_digest = Column(String(64), nullable=True)
    qr_verification_code = Column(String(255), nullable=True)
    is_digitally_signed = Column(Boolean, default=False)

    deadlines = relationship("DiscoveryDeadline", back_populates="order", cascade="all, delete-orphan")

class DiscoveryDeadline(Base):
    __tablename__ = "discovery_deadlines"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("case_management_orders.id"), nullable=False)
    task_description = Column(String(255), nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(Enum(DeadlineStatus), default=DeadlineStatus.PENDING)

    order = relationship("CaseManagementOrder", back_populates="deadlines")
