import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.app.database import Base

class CaseType(str, enum.Enum):
    COMMERCIAL = "COMMERCIAL_DISPUTE"
    CIVIL_RECOVERY = "CIVIL_RECOVERY"
    ARBITRATION = "ARBITRATION_PETITION"
    CONTRACT = "CONTRACT_DISPUTE"

class CaseStatus(str, enum.Enum):
    FILED = "FILED"
    PRE_CMH = "PENDING_CMH_PREPARATION"
    CMH_SCHEDULED = "CMH_SCHEDULED"
    CMH_IN_PROGRESS = "CMH_IN_PROGRESS"
    CMO_ISSUED = "CMO_ISSUED_TRIAL_ACTIVE"
    DISPOSED = "DISPOSED"

class Case(Base):
    __tablename__ = "cases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cnr_number = Column(String(16), unique=True, index=True, nullable=False)
    case_title = Column(String(255), nullable=False)
    case_type = Column(Enum(CaseType), default=CaseType.COMMERCIAL)
    claim_valuation = Column(Numeric(15, 2), default=0.00)
    status = Column(Enum(CaseStatus), default=CaseStatus.FILED)
    court_hall_id = Column(String(50), nullable=True)
    
    # Counsel / Parties mapping
    judge_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    plaintiff_counsel_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    defendant_counsel_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    filing_date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    pleadings = relationship("Pleading", back_populates="case", cascade="all, delete-orphan")
    checklist = relationship("AdmissionsChecklist", back_populates="case", uselist=False, cascade="all, delete-orphan")

class PleadingType(str, enum.Enum):
    PLAINT = "PLAINT"
    WRITTEN_STATEMENT = "WRITTEN_STATEMENT"
    REJOINDER = "REJOINDER"

class Pleading(Base):
    __tablename__ = "pleadings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False)
    pleading_type = Column(Enum(PleadingType), nullable=False)
    filed_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    file_storage_url = Column(String(500), nullable=False)
    sha256_checksum = Column(String(64), nullable=False)
    is_scrutinized = Column(Boolean, default=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="pleadings")
    exhibits = relationship("Exhibit", back_populates="pleading", cascade="all, delete-orphan")

class Exhibit(Base):
    __tablename__ = "exhibits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    pleading_id = Column(String(36), ForeignKey("pleadings.id"), nullable=False)
    exhibit_number = Column(String(20), nullable=False)
    document_title = Column(String(255), nullable=False)
    is_reliance_document = Column(Boolean, default=True)
    file_storage_url = Column(String(500), nullable=False)
    sha256_checksum = Column(String(64), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    pleading = relationship("Pleading", back_populates="exhibits")
