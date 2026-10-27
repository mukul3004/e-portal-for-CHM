from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from backend.app.models.echallan import ChallanStatus

class CreateChallanRequest(BaseModel):
    case_id: Optional[str] = None
    cnr_number: Optional[str] = None
    payer_name: str
    payer_email: str
    payer_role: Optional[str] = "ADVOCATE"
    head_of_account: Optional[str] = "0030-02-103-01: Commercial Court Ad-Valorem Fee"
    bench_id: Optional[str] = "BENCH_INDORE_COMM_01"
    court_hall_id: Optional[str] = "HALL_04"
    amount: float
    payment_mode: Optional[str] = "SBI_EPAY"

class PayChallanRequest(BaseModel):
    payment_mode: Optional[str] = "SBI_EPAY"
    bank_name: Optional[str] = "State Bank of India"

class EChallanResponse(BaseModel):
    id: str
    challan_number: str
    case_id: Optional[str] = None
    cnr_number: Optional[str] = None
    payer_name: str
    payer_email: str
    payer_role: str
    head_of_account: str
    bench_id: str
    court_hall_id: str
    amount: float
    payment_mode: str
    status: ChallanStatus
    transaction_ref: Optional[str] = None
    bank_ref: Optional[str] = None
    receipt_sha256: Optional[str] = None
    created_at: datetime
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True
