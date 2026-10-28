import random
from typing import List, Optional
from datetime import datetime, date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case, CaseStatus, Pleading, Exhibit
from backend.app.models.admissions import AdmissionsChecklist, AdmissionItem
from backend.app.models.schedule import CMHSession, SessionStatus
from backend.app.models.order import CaseManagementOrder, DiscoveryDeadline, DeadlineStatus
from backend.app.patterns.factory import DecreeFactoryProvider
from backend.app.patterns.singleton import JudicialVaultSingleton
from backend.app.schemas.case import (
    CaseCreate,
    CaseResponse,
    PleadingCreate,
    PleadingResponse,
    ExhibitResponse,
    CaseSearchResult,
    CaseDetailResponse,
    StakeholderSummary,
    HearingRecord,
    CMORecord,
    DiscoveryDeadlineRecord,
    TimelineMilestone
)
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

def get_next_hearing_info(case: Case, db: Session, ref_date: Optional[date] = None):
    """Calculates live next hearing date, formatted string, relative badge, and purpose."""
    if ref_date is None:
        ref_date = date.today()

    session = (
        db.query(CMHSession)
        .filter(CMHSession.case_id == case.id)
        .filter(CMHSession.status == SessionStatus.SCHEDULED)
        .order_by(CMHSession.hearing_date.asc(), CMHSession.start_time.asc())
        .first()
    )
    if not session:
        session = (
            db.query(CMHSession)
            .filter(CMHSession.case_id == case.id)
            .filter(CMHSession.hearing_date >= ref_date)
            .order_by(CMHSession.hearing_date.asc(), CMHSession.start_time.asc())
            .first()
        )

    if session:
        h_date = session.hearing_date
        diff = (h_date - ref_date).days if hasattr(h_date, 'strftime') else 0
        date_iso = h_date.isoformat() if hasattr(h_date, 'isoformat') else str(h_date)
        date_formatted = h_date.strftime("%d %b %Y") if hasattr(h_date, 'strftime') else str(h_date)

        if diff < 0:
            rel = f"Past ({abs(diff)}d ago)"
        elif diff == 0:
            rel = "Today (Live Session)"
        elif diff == 1:
            rel = "Tomorrow"
        elif 2 <= diff <= 7:
            rel = f"Next Week ({h_date.strftime('%a')}, in {diff}d)"
        elif 8 <= diff <= 14:
            rel = f"In 2 Weeks (in {diff}d)"
        elif 15 <= diff <= 35:
            rel = f"Next Month ({h_date.strftime('%b %d')})"
        elif 36 <= diff <= 65:
            rel = f"In 2 Months ({h_date.strftime('%b %Y')})"
        else:
            rel = f"Scheduled ({date_formatted})"

        if case.status == CaseStatus.CMH_SCHEDULED:
            purpose = "Order XV-A Case Management Hearing"
        elif case.status == CaseStatus.PRE_CMH:
            purpose = "Pleadings Scrutiny & Admission Matrix Review"
        elif case.status == CaseStatus.CMO_ISSUED:
            purpose = "Discovery Compliance & Witness Quota Review"
        elif case.status == CaseStatus.FILED:
            purpose = "Summons Returnable & Preliminary Appearance"
        else:
            purpose = "Pre-Trial Case Management Conference"

        start_str = session.start_time.strftime("%H:%M") if hasattr(session.start_time, 'strftime') else str(session.start_time)
        end_str = session.end_time.strftime("%H:%M") if hasattr(session.end_time, 'strftime') else str(session.end_time)
        time_slot = f"{start_str} - {end_str}"
        hall = session.court_hall_id or case.court_hall_id or "Court Hall 04"

        return {
            "next_hearing_date": date_iso,
            "next_hearing_formatted": date_formatted,
            "next_hearing_purpose": purpose,
            "next_hearing_relative": rel,
            "next_hearing_time": time_slot,
            "next_hearing_hall": hall
        }
    else:
        if case.status == CaseStatus.DISPOSED:
            return {
                "next_hearing_date": None,
                "next_hearing_formatted": "Disposed / Concluded",
                "next_hearing_purpose": "Proceedings Concluded (Decree Sealed)",
                "next_hearing_relative": "No Further Hearings",
                "next_hearing_time": None,
                "next_hearing_hall": None
            }
        elif case.status == CaseStatus.CMO_ISSUED:
            target_date = ref_date + timedelta(days=21)
            return {
                "next_hearing_date": target_date.isoformat(),
                "next_hearing_formatted": target_date.strftime("%d %b %Y"),
                "next_hearing_purpose": "Discovery Compliance & Trial Timetable",
                "next_hearing_relative": f"Next Month ({target_date.strftime('%b %d')})",
                "next_hearing_time": "11:30 - 12:15",
                "next_hearing_hall": case.court_hall_id or "Court Hall 04"
            }
        else:
            target_date = ref_date + timedelta(days=7)
            return {
                "next_hearing_date": target_date.isoformat(),
                "next_hearing_formatted": target_date.strftime("%d %b %Y"),
                "next_hearing_purpose": "Order XV-A CMH Allocation & Scrutiny",
                "next_hearing_relative": f"Next Week ({target_date.strftime('%a')})",
                "next_hearing_time": "10:30 - 11:15",
                "next_hearing_hall": case.court_hall_id or "Court Hall 04"
            }

@router.get("/", response_model=List[CaseResponse])
def list_cases(db: Session = Depends(get_db)):
    """List all registered case dockets enriched with live next hearing dates and purpose."""
    cases = db.query(Case).order_by(Case.filing_date.desc()).all()
    results = []
    for c in cases:
        next_info = get_next_hearing_info(c, db)
        c_dict = CaseResponse.model_validate(c).model_dump()
        c_dict.update(next_info)
        results.append(CaseResponse(**c_dict))
    return results

@router.get("/search", response_model=List[CaseSearchResult])
def search_cases(
    q: Optional[str] = Query(None, description="Search query: CNR number, case title, or court hall"),
    case_type: Optional[str] = Query(None, description="Filter by case type"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by case status"),
    db: Session = Depends(get_db)
):
    """Search registered court dockets across CNR number, case title, and court hall with live next hearing details."""
    query = db.query(Case)
    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Case.cnr_number.ilike(term),
                Case.case_title.ilike(term),
                Case.court_hall_id.ilike(term),
                Case.id == q.strip()
            )
        )
    if case_type and case_type.strip():
        query = query.filter(Case.case_type == case_type.strip())
    if status_filter and status_filter.strip():
        query = query.filter(Case.status == status_filter.strip())

    cases = query.order_by(Case.filing_date.desc()).limit(30).all()
    results = []
    for c in cases:
        next_info = get_next_hearing_info(c, db)
        c_dict = CaseSearchResult.model_validate(c).model_dump()
        c_dict.update(next_info)
        results.append(CaseSearchResult(**c_dict))
    return results

@router.get("/dossier/{identifier}", response_model=CaseDetailResponse)
def get_case_dossier(identifier: str, db: Session = Depends(get_db)):
    """Fetch complete judicial case dossier including present status, past proceedings, timeline, pleadings, admissions, and CMO."""
    clean_id = identifier.strip()
    case = db.query(Case).filter(
        or_(
            Case.cnr_number == clean_id,
            Case.id == clean_id,
            Case.cnr_number.ilike(f"%{clean_id}%"),
            Case.case_title.ilike(f"%{clean_id}%")
        )
    ).first()

    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case record with identifier '{clean_id}' was not found in the court system."
        )

    # 1. Stakeholders
    judge_data = None
    if case.judge:
        judge_data = StakeholderSummary(
            id=case.judge.id,
            full_name=case.judge.full_name,
            email=case.judge.email,
            role=case.judge.role.value if hasattr(case.judge.role, 'value') else str(case.judge.role),
            bench_id=case.judge.bench_id,
            court_hall_id=case.judge.court_hall_id
        )

    plaintiff_counsel_data = None
    if case.plaintiff_counsel:
        plaintiff_counsel_data = StakeholderSummary(
            id=case.plaintiff_counsel.id,
            full_name=case.plaintiff_counsel.full_name,
            email=case.plaintiff_counsel.email,
            role=case.plaintiff_counsel.role.value if hasattr(case.plaintiff_counsel.role, 'value') else str(case.plaintiff_counsel.role),
            bar_council_id=case.plaintiff_counsel.bar_council_id
        )

    defendant_counsel_data = None
    if case.defendant_counsel:
        defendant_counsel_data = StakeholderSummary(
            id=case.defendant_counsel.id,
            full_name=case.defendant_counsel.full_name,
            email=case.defendant_counsel.email,
            role=case.defendant_counsel.role.value if hasattr(case.defendant_counsel.role, 'value') else str(case.defendant_counsel.role),
            bar_council_id=case.defendant_counsel.bar_council_id
        )

    # 2. Pleadings & Exhibits
    pleadings_data = []
    for p in case.pleadings:
        exhibits_data = []
        for ex in p.exhibits:
            exhibits_data.append(ExhibitResponse(
                id=ex.id,
                exhibit_number=ex.exhibit_number,
                document_title=ex.document_title,
                file_storage_url=ex.file_storage_url,
                sha256_checksum=ex.sha256_checksum,
                uploaded_at=ex.uploaded_at
            ))
        pleadings_data.append(PleadingResponse(
            id=p.id,
            pleading_type=p.pleading_type,
            filed_by_id=p.filed_by_id,
            file_storage_url=p.file_storage_url,
            sha256_checksum=p.sha256_checksum,
            is_scrutinized=p.is_scrutinized,
            submitted_at=p.submitted_at,
            exhibits=exhibits_data
        ))

    # 3. Admissions Matrix & Averments
    checklist_data = None
    if case.checklist:
        checklist_items = []
        for it in sorted(case.checklist.items, key=lambda x: x.statement_index):
            checklist_items.append({
                "id": it.id,
                "statement_index": it.statement_index,
                "factual_statement": it.factual_statement,
                "exhibit_ref_id": it.exhibit_ref_id,
                "plaintiff_stance": it.plaintiff_stance.value if hasattr(it.plaintiff_stance, 'value') else str(it.plaintiff_stance),
                "defendant_stance": it.defendant_stance.value if hasattr(it.defendant_stance, 'value') else str(it.defendant_stance),
                "statutory_denial_reason": it.statutory_denial_reason,
                "resolution_status": it.resolution_status.value if hasattr(it.resolution_status, 'value') else str(it.resolution_status),
            })
        checklist_data = {
            "id": case.checklist.id,
            "case_id": case.checklist.case_id,
            "version_id": case.checklist.version_id,
            "readiness_score": case.checklist.readiness_score,
            "is_locked": case.checklist.is_locked,
            "plaintiff_submitted_at": case.checklist.plaintiff_submitted_at,
            "defendant_submitted_at": case.checklist.defendant_submitted_at,
            "items": checklist_items
        }

    # 4. Hearings & CMH Sessions
    hearing_records = []
    sessions = db.query(CMHSession).filter(CMHSession.case_id == case.id).order_by(CMHSession.hearing_date.asc(), CMHSession.start_time.asc()).all()
    ref_d = date.today()
    for s in sessions:
        h_d = s.hearing_date
        diff = (h_d - ref_d).days if hasattr(h_d, 'strftime') else 0
        if s.status == SessionStatus.CONCLUDED:
            rel_badge = "Concluded"
            is_up = False
        elif diff < 0:
            rel_badge = f"{abs(diff)}d ago"
            is_up = False
        elif diff == 0:
            rel_badge = "Today"
            is_up = True
        elif 1 <= diff <= 7:
            rel_badge = f"Next Week ({h_d.strftime('%a')})"
            is_up = True
        elif 8 <= diff <= 14:
            rel_badge = f"In 2 Weeks (in {diff}d)"
            is_up = True
        elif 15 <= diff <= 45:
            rel_badge = f"Next Month ({h_d.strftime('%b %d')})"
            is_up = True
        else:
            rel_badge = "Scheduled"
            is_up = True

        purpose = "Order XV-A Pre-Trial Case Management Hearing"
        if case.status == CaseStatus.CMO_ISSUED:
            purpose = "Discovery Compliance & Witness Quota Review"
        elif case.status == CaseStatus.PRE_CMH:
            purpose = "Admissions Matrix Scrutiny & Pre-Trial Filtering"

        hearing_records.append(HearingRecord(
            id=s.id,
            hearing_date=s.hearing_date.isoformat() if hasattr(s.hearing_date, 'isoformat') else str(s.hearing_date),
            start_time=s.start_time.strftime("%H:%M") if hasattr(s.start_time, 'strftime') else str(s.start_time),
            end_time=s.end_time.strftime("%H:%M") if hasattr(s.end_time, 'strftime') else str(s.end_time),
            court_hall_id=s.court_hall_id,
            status=s.status.value if hasattr(s.status, 'value') else str(s.status),
            webrtc_room_id=s.webrtc_room_id,
            created_at=s.created_at,
            purpose=purpose,
            relative_badge=rel_badge,
            is_upcoming=is_up
        ))

    # 5. Case Management Order (CMO)
    cmo_record = None
    cmo = db.query(CaseManagementOrder).filter(CaseManagementOrder.case_id == case.id).first()
    if cmo:
        deadlines_records = []
        for d in cmo.deadlines:
            deadlines_records.append(DiscoveryDeadlineRecord(
                id=d.id,
                task_description=d.task_description,
                due_date=d.due_date.isoformat() if hasattr(d.due_date, 'isoformat') else str(d.due_date),
                status=d.status.value if hasattr(d.status, 'value') else str(d.status)
            ))
        cmo_record = CMORecord(
            id=cmo.id,
            order_date=cmo.order_date,
            undisputed_facts_summary=cmo.undisputed_facts_summary,
            framed_issues_json=cmo.framed_issues_json,
            witness_quota_plaintiff=cmo.witness_quota_plaintiff,
            witness_quota_defendant=cmo.witness_quota_defendant,
            pdf_storage_url=cmo.pdf_storage_url,
            sha256_digest=cmo.sha256_digest,
            qr_verification_code=cmo.qr_verification_code,
            is_digitally_signed=cmo.is_digitally_signed,
            deadlines=deadlines_records
        )

    # 6. Comprehensive Case Journey Timeline
    timeline = []
    
    # Milestone 1: Filing
    timeline.append(TimelineMilestone(
        date=case.filing_date.strftime("%d %b %Y"),
        title="Commercial Docket Ingested",
        stage="FILING",
        description=f"Electronic filing lodged. Allocated 16-digit CNR: {case.cnr_number}. Valuation: INR {float(case.claim_valuation):,.2f}",
        status="COMPLETED"
    ))

    # Milestone 2: Pleadings
    if case.pleadings:
        for p in case.pleadings:
            p_type_label = p.pleading_type.value if hasattr(p.pleading_type, 'value') else str(p.pleading_type).replace('_', ' ').title()
            timeline.append(TimelineMilestone(
                date=p.submitted_at.strftime("%d %b %Y"),
                title=f"{p_type_label} Lodged",
                stage="PLEADINGS",
                description=f"Digitally authenticated with SHA-256 seal: {p.sha256_checksum[:14]}... ({len(p.exhibits)} exhibits annexed)",
                status="COMPLETED"
            ))
    else:
        timeline.append(TimelineMilestone(
            date="In Progress",
            title="Pleadings & Discovery Stage",
            stage="PLEADINGS",
            description="Parties filing Plaint, Written Statement of Defence, and reliance exhibits.",
            status="ACTIVE"
        ))

    # Milestone 3: Admissions Matrix
    if case.checklist:
        resolved_count = sum(1 for it in case.checklist.items if (hasattr(it.resolution_status, 'value') and it.resolution_status.value != "PENDING") or (not hasattr(it.resolution_status, 'value') and str(it.resolution_status) != "PENDING"))
        total_items = len(case.checklist.items)
        timeline.append(TimelineMilestone(
            date=case.checklist.updated_at.strftime("%d %b %Y") if case.checklist.updated_at else case.filing_date.strftime("%d %b %Y"),
            title=f"Admissions & Denials Matrix ({'Locked' if case.checklist.is_locked else 'Active'})",
            stage="ADMISSIONS",
            description=f"Readiness Score: {int(case.checklist.readiness_score * 100)}% | {resolved_count}/{total_items} factual averments evaluated.",
            status="COMPLETED" if case.checklist.is_locked else "ACTIVE"
        ))

    # Milestone 4: CMH Sessions
    if sessions:
        for s in sessions:
            st = s.status.value if hasattr(s.status, 'value') else str(s.status)
            timeline.append(TimelineMilestone(
                date=s.hearing_date.strftime("%d %b %Y") if hasattr(s.hearing_date, 'strftime') else str(s.hearing_date),
                title=f"Case Management Hearing ({st})",
                stage="CMH_SESSION",
                description=f"Conducted in {s.court_hall_id} ({s.start_time.strftime('%H:%M') if hasattr(s.start_time, 'strftime') else str(s.start_time)} - {s.end_time.strftime('%H:%M') if hasattr(s.end_time, 'strftime') else str(s.end_time)}). WebRTC Room: {s.webrtc_room_id}",
                status="COMPLETED" if st == "CONCLUDED" else ("ACTIVE" if st in ["IN_PROGRESS", "SCHEDULED"] else "ADJOURNED")
            ))
    else:
        timeline.append(TimelineMilestone(
            date="Pending Schedule",
            title="Judicial Case Management Hearing (CMH)",
            stage="CMH_SESSION",
            description="Virtual courtroom hearing under Order XV-A CPC to narrow contested issues and fix trial dates.",
            status="PENDING"
        ))

    # Milestone 5: Case Management Order
    if cmo:
        timeline.append(TimelineMilestone(
            date=cmo.order_date.strftime("%d %b %Y"),
            title="Case Management Order (CMO) Sealed",
            stage="CMO_ISSUED",
            description=f"Issued by Presiding Judge with digital seal. Quotas: {cmo.witness_quota_plaintiff} plaintiff / {cmo.witness_quota_defendant} defence witnesses. {len(cmo.deadlines)} discovery deadlines bound.",
            status="COMPLETED"
        ))
    else:
        timeline.append(TimelineMilestone(
            date="Awaiting CMH",
            title="Final Case Management Order (CMO)",
            stage="CMO_ISSUED",
            description="Enforceable judicial order establishing binding deadlines, witness lists, and trial schedule.",
            status="PENDING"
        ))

    next_info = get_next_hearing_info(case, db)
    return CaseDetailResponse(
        id=case.id,
        cnr_number=case.cnr_number,
        case_title=case.case_title,
        case_type=case.case_type,
        claim_valuation=case.claim_valuation,
        status=case.status,
        court_hall_id=case.court_hall_id,
        filing_date=case.filing_date,
        judge=judge_data,
        plaintiff_counsel=plaintiff_counsel_data,
        defendant_counsel=defendant_counsel_data,
        pleadings=pleadings_data,
        checklist=checklist_data,
        hearings=hearing_records,
        cmo=cmo_record,
        timeline=timeline,
        **next_info
    )

@router.get("/{cnr_number}", response_model=CaseResponse)
def get_case_by_cnr(cnr_number: str, db: Session = Depends(get_db)):
    """Fetch electronic docket by 16-digit CNR number with next hearing info."""
    case = db.query(Case).filter(Case.cnr_number == cnr_number).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Case with CNR '{cnr_number}' not found.")
    next_info = get_next_hearing_info(case, db)
    c_dict = CaseResponse.model_validate(case).model_dump()
    c_dict.update(next_info)
    return CaseResponse(**c_dict)

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

@router.post("/{case_id}/generate-cmo")
def generate_cmo_order(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleType.JUDGE, RoleType.CLERK))
):
    """
    [GoF Factory Pattern] Generates a formal Order XV-A Rule 2 Case Management Order
    and statutory discovery schedule dynamically tailored to the Case Category.
    """
    import json
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found.")

    judge_user = db.query(User).filter(User.id == case.judge_id).first() if case.judge_id else None
    judge_name = judge_user.full_name if judge_user else (current_user.full_name or "Hon'ble Presiding Judge")
    category_str = case.case_type.value if hasattr(case.case_type, "value") else str(case.case_type)

    # 1. Use GoF Factory Pattern to build category-specific decree
    decree_bundle = DecreeFactoryProvider.create_decree_for_case(
        case_category=category_str,
        case_id=case.id,
        case_number=case.cnr_number,
        title=case.case_title,
        judge_name=judge_name,
        base_date=date.today()
    )

    # 2. Use GoF Singleton Judicial Vault to compute SHA-256 seal
    vault = JudicialVaultSingleton.get_instance()
    decree_bytes = json.dumps(decree_bundle, sort_keys=True).encode("utf-8")
    sha256_seal = vault.compute_sha256(decree_bytes)

    # 3. Check for existing CMO and upsert
    existing_cmo = db.query(CaseManagementOrder).filter(CaseManagementOrder.case_id == case.id).first()
    if existing_cmo:
        db.delete(existing_cmo)
        db.commit()

    cmo = CaseManagementOrder(
        case_id=case.id,
        judge_id=current_user.id,
        order_date=datetime.utcnow(),
        undisputed_facts_summary=f"Statutory Order XV-A Rule 2 Decree issued for {decree_bundle['category']}. Governed by {decree_bundle['governing_statute']}.",
        framed_issues_json=json.dumps(decree_bundle["framed_issues"]),
        witness_quota_plaintiff=decree_bundle["witness_caps"]["plaintiff"],
        witness_quota_defendant=decree_bundle["witness_caps"]["defendant"],
        pdf_storage_url=f"/orders/{decree_bundle['decree_id']}.pdf",
        sha256_digest=sha256_seal,
        qr_verification_code=f"VERIFY:{decree_bundle['decree_id']}:{sha256_seal[:16]}",
        is_digitally_signed=True
    )
    db.add(cmo)
    db.flush()

    # 4. Insert statutory discovery deadlines
    for d_item in decree_bundle["discovery_deadlines"]:
        d_obj = DiscoveryDeadline(
            order_id=cmo.id,
            task_description=d_item["task"],
            due_date=date.fromisoformat(d_item["due_date"]),
            status=DeadlineStatus.PENDING
        )
        db.add(d_obj)

    db.commit()
    db.refresh(cmo)

    # Register in Judicial Vault
    vault.register_certified_document(
        document_id=cmo.id,
        case_id=case.id,
        document_type="CASE_MANAGEMENT_ORDER_RULE_2",
        raw_bytes=decree_bytes,
        signatory_bar_or_judge_id=current_user.email
    )

    decree_bundle["cmo_id"] = cmo.id
    decree_bundle["sha256_digest"] = sha256_seal
    decree_bundle["vault_id"] = vault.vault_id
    return decree_bundle

