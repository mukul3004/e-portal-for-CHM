from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from backend.app.models.case import CaseType, CaseStatus, PleadingType

class CaseCreate(BaseModel):
    case_title: str
    case_type: CaseType = CaseType.COMMERCIAL
    claim_valuation: Decimal
    court_hall_id: Optional[str] = "HALL_04"
    defendant_counsel_email: Optional[str] = None

class PleadingCreate(BaseModel):
    pleading_type: PleadingType
    file_storage_url: str
    sha256_checksum: str

class ExhibitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    exhibit_number: str
    document_title: str
    file_storage_url: str
    sha256_checksum: str
    uploaded_at: datetime

class PleadingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pleading_type: PleadingType
    filed_by_id: str
    file_storage_url: str
    sha256_checksum: str
    is_scrutinized: bool
    submitted_at: datetime
    exhibits: List[ExhibitResponse] = []

class CaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    cnr_number: str
    case_title: str
    case_type: CaseType
    claim_valuation: Decimal
    status: CaseStatus
    court_hall_id: Optional[str]
    judge_id: Optional[str]
    plaintiff_counsel_id: Optional[str]
    defendant_counsel_id: Optional[str]
    filing_date: datetime
    pleadings: List[PleadingResponse] = []
