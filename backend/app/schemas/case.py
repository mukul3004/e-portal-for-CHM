from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
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

class StakeholderSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    email: str
    role: str
    bar_council_id: Optional[str] = None
    bench_id: Optional[str] = None
    court_hall_id: Optional[str] = None

class HearingRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    hearing_date: Any
    start_time: Any
    end_time: Any
    court_hall_id: str
    status: str
    webrtc_room_id: str
    created_at: Optional[datetime] = None

class DiscoveryDeadlineRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    task_description: str
    due_date: Any
    status: str

class CMORecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_date: datetime
    undisputed_facts_summary: str
    framed_issues_json: str
    witness_quota_plaintiff: int
    witness_quota_defendant: int
    pdf_storage_url: Optional[str] = None
    sha256_digest: Optional[str] = None
    qr_verification_code: Optional[str] = None
    is_digitally_signed: bool = False
    deadlines: List[DiscoveryDeadlineRecord] = []

class TimelineMilestone(BaseModel):
    date: str
    title: str
    stage: str
    description: str
    status: str

class CaseDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    cnr_number: str
    case_title: str
    case_type: CaseType
    claim_valuation: Decimal
    status: CaseStatus
    court_hall_id: Optional[str]
    filing_date: datetime
    
    judge: Optional[StakeholderSummary] = None
    plaintiff_counsel: Optional[StakeholderSummary] = None
    defendant_counsel: Optional[StakeholderSummary] = None
    pleadings: List[PleadingResponse] = []
    checklist: Optional[Any] = None
    hearings: List[HearingRecord] = []
    cmo: Optional[CMORecord] = None
    timeline: List[TimelineMilestone] = []

class CaseSearchResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    cnr_number: str
    case_title: str
    case_type: CaseType
    claim_valuation: Decimal
    status: CaseStatus
    court_hall_id: Optional[str]
    filing_date: datetime
