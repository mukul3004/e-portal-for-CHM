from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from backend.app.models.admissions import StanceType, ItemResolutionStatus

class AdmissionItemCreate(BaseModel):
    statement_index: int
    factual_statement: str
    exhibit_ref_id: Optional[str] = None

class AdmissionItemUpdate(BaseModel):
    item_id: str
    stance: StanceType
    statutory_denial_reason: Optional[str] = None

class AdmissionItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    statement_index: int
    factual_statement: str
    exhibit_ref_id: Optional[str]
    plaintiff_stance: StanceType
    defendant_stance: StanceType
    statutory_denial_reason: Optional[str]
    resolution_status: ItemResolutionStatus

class AdmissionsChecklistResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_id: str
    version_id: int
    readiness_score: float
    is_locked: bool
    plaintiff_submitted_at: Optional[datetime]
    defendant_submitted_at: Optional[datetime]
    items: List[AdmissionItemResponse] = []
