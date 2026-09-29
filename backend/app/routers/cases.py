import random
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case, CaseStatus, Pleading
from backend.app.models.admissions import AdmissionsChecklist, AdmissionItem
from backend.app.schemas.case import CaseCreate, CaseResponse, PleadingCreate, PleadingResponse
from backend.app.security.jwt_auth import get_current_user
from backend.app.security.rbac import require_roles

router = APIRouter(prefix="/cases", tags=["Case Docket & Ingestion"])

def generate_cnr_number() -> str:
    """Generate mock 16-digit official Indian e-Courts CNR number (e.g. MPIN010012342026)."""
    random_digits = "".join([str(random.randint(0, 9)) for _ in range(8)])
    return f"MPIN01{random_digits}2026"

@router.post("/", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
def file_case(
    payload: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleType.ADVOCATE, RoleType.CLERK))
):
    """[CMH-202] Ingest new commercial case filing, generate 16-digit CNR, and initialize admissions matrix."""
    cnr = generate_cnr_number()

    # Find defendant counsel if email is provided
    defendant_id = None
    if payload.defendant_counsel_email:
        def_counsel = db.query(User).filter(User.email == payload.defendant_counsel_email).first()
        if def_counsel:
            defendant_id = def_counsel.id

    new_case = Case(
        cnr_number=cnr,
        case_title=payload.case_title,
        case_type=payload.case_type,
        claim_valuation=payload.claim_valuation,
        status=CaseStatus.PRE_CMH,
        court_hall_id=payload.court_hall_id,
        plaintiff_counsel_id=current_user.id if current_user.role == RoleType.ADVOCATE else None,
        defendant_counsel_id=defendant_id
    )
    db.add(new_case)
    db.flush()

    # Automatically create the pre-trial Admissions & Denials Checklist for this case
    checklist = AdmissionsChecklist(case_id=new_case.id)
    db.add(checklist)
    db.flush()

    # Seed 3 default standard dispute averments for demonstration
    seed_statements = [
        "Execution and validity of the Commercial Master Services Agreement dated 15 Jan 2026.",
        "Receipt of invoices #INV-2026-089 totalling INR 45,00,000/- for delivered goods.",
        "Acknowledgment of delivery consignment signed on docket receipt #DR-9921."
    ]
    for idx, stmt in enumerate(seed_statements, start=1):
        item = AdmissionItem(
            checklist_id=checklist.id,
            statement_index=idx,
            factual_statement=stmt
        )
        db.add(item)

    db.commit()
    db.refresh(new_case)
    return new_case

@router.get("/", response_model=List[CaseResponse])
def list_cases(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all registered case dockets."""
    cases = db.query(Case).order_by(Case.filing_date.desc()).all()
    return cases

@router.get("/{cnr_number}", response_model=CaseResponse)
def get_case_by_cnr(cnr_number: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch electronic docket by 16-digit CNR number."""
    case = db.query(Case).filter(Case.cnr_number == cnr_number).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Case with CNR '{cnr_number}' not found.")
    return case

@router.post("/{case_id}/pleadings", response_model=PleadingResponse, status_code=status.HTTP_201_CREATED)
def record_pleading(
    case_id: str,
    payload: PleadingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleType.ADVOCATE, RoleType.CLERK))
):
    """[CMH-202] Register electronic pleading with cryptographic SHA-256 hash."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found.")

    pleading = Pleading(
        case_id=case.id,
        pleading_type=payload.pleading_type,
        filed_by_id=current_user.id,
        file_storage_url=payload.file_storage_url,
        sha256_checksum=payload.sha256_checksum,
        is_scrutinized=True
    )
    db.add(pleading)
    db.commit()
    db.refresh(pleading)
    return pleading
