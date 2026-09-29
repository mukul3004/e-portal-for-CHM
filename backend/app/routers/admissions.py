from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case
from backend.app.models.admissions import AdmissionsChecklist, AdmissionItem, StanceType, ItemResolutionStatus
from backend.app.schemas.admissions import AdmissionItemUpdate, AdmissionItemResponse, AdmissionsChecklistResponse
from backend.app.services.admissions_engine import AdmissionsMatrixEngine
from backend.app.security.jwt_auth import get_current_user

router = APIRouter(prefix="/admissions", tags=["Order XV-A Admissions & Denials Matrix"])

@router.get("/{case_id}", response_model=AdmissionsChecklistResponse)
def get_admissions_matrix(case_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """[CMH-203, CMH-204] Fetch live pre-trial Admissions & Denials Matrix for a case."""
    checklist = db.query(AdmissionsChecklist).filter(AdmissionsChecklist.case_id == case_id).first()
    if not checklist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admissions matrix not found for this case.")
    return checklist

@router.put("/items/{item_id}", response_model=AdmissionItemResponse)
def submit_stance(
    item_id: str,
    payload: AdmissionItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    [CMH-203] Advocate marks evidentiary stance (ADMIT_EXECUTION, ADMIT_CONTENTS, DENY).
    Automatically recalculates mutual admissions and updates readiness score.
    """
    item = db.query(AdmissionItem).filter(AdmissionItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admission statement item not found.")

    checklist = item.checklist
    if checklist.is_locked:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admissions matrix is already locked by the Court.")

    case = checklist.case
    # Check if current user is plaintiff counsel or defendant counsel
    is_plaintiff = (current_user.id == case.plaintiff_counsel_id) or (current_user.role == RoleType.JUDGE)
    is_defendant = (current_user.id == case.defendant_counsel_id) or (current_user.role == RoleType.JUDGE)

    if is_plaintiff and not is_defendant:
        item.plaintiff_stance = payload.stance
        checklist.plaintiff_submitted_at = datetime.utcnow()
    elif is_defendant and not is_plaintiff:
        item.defendant_stance = payload.stance
        checklist.defendant_submitted_at = datetime.utcnow()
    else:
        # Default fallback for testing or judge review
        item.plaintiff_stance = payload.stance
        item.defendant_stance = payload.stance

    if payload.statutory_denial_reason:
        item.statutory_denial_reason = payload.statutory_denial_reason

    # Evaluate resolution status via Admissions Engine
    item.resolution_status = AdmissionsMatrixEngine.evaluate_item(item)

    # Increment checklist version and update readiness score
    checklist.version_id += 1
    checklist.readiness_score = AdmissionsMatrixEngine.calculate_readiness(checklist.items)

    db.commit()
    db.refresh(item)
    return item

@router.post("/{case_id}/lock", response_model=AdmissionsChecklistResponse)
def lock_admissions_matrix(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """[CMH-204] Judge locks the matrix before CMH hearing, freezing undisputed facts."""
    checklist = db.query(AdmissionsChecklist).filter(AdmissionsChecklist.case_id == case_id).first()
    if not checklist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist not found.")

    checklist.is_locked = True
    checklist.version_id += 1
    db.commit()
    db.refresh(checklist)
    return checklist
