import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey
from backend.app.database import Base

class ChallanStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    VERIFIED = "VERIFIED"

class HeadOfAccount(str, enum.Enum):
    COURT_FEES = "0030-02-103-01: Commercial Court Ad-Valorem Fee"
    PROCESS_FEES = "0030-02-103-02: Process / Summons Serving Fee"
    URGENT_LISTING = "0030-02-103-03: Urgent Listing Application Fee"
    CERTIFIED_COPY = "0030-02-103-04: Certified Copy / Docket Inspection Fee"
    ADR_CONCILIATION = "0030-02-103-05: Pre-Institution Mediation Administrative Fee"

class EChallan(Base):
    __tablename__ = "echallans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    challan_number = Column(String(50), unique=True, index=True, nullable=False)
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=True)
    cnr_number = Column(String(50), nullable=True, index=True)
    
    payer_name = Column(String(150), nullable=False)
    payer_email = Column(String(150), nullable=False)
    payer_role = Column(String(50), default="ADVOCATE")
    
    head_of_account = Column(String(100), default=HeadOfAccount.COURT_FEES.value)
    bench_id = Column(String(50), default="BENCH_INDORE_COMM_01")
    court_hall_id = Column(String(50), default="HALL_04")
    
    amount = Column(Float, nullable=False)
    payment_mode = Column(String(50), default="SBI_EPAY")
    status = Column(Enum(ChallanStatus), default=ChallanStatus.PENDING)
    
    transaction_ref = Column(String(100), nullable=True)
    bank_ref = Column(String(100), nullable=True)
    receipt_sha256 = Column(String(64), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    paid_at = Column(DateTime, nullable=True)
