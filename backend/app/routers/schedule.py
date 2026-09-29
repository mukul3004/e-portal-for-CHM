from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case, CaseStatus
from backend.app.models.schedule import CMHSession, CourtRoom, SessionStatus
from backend.app.schemas.schedule import (
    SlotClashCheckRequest,
    ClashCheckResponse,
    BookSlotRequest,
    CMHSessionResponse
)
from backend.app.services.clash_detector import ClashDetectionEngine
from backend.app.security.jwt_auth import get_current_user
from backend.app.security.rbac import require_roles

router = APIRouter(prefix="/schedule", tags=["Smart Hearing Scheduling"])

@router.post("/check-clash", response_model=ClashCheckResponse)
def check_advocate_clash(
    payload: SlotClashCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    [CMH-205] Validates advocate availability across all courtrooms for proposed slot.
    Flags instant red collision alerts if any advocate is double-booked.
    """
    has_conflict, msg, counsel_bar_id, hall = ClashDetectionEngine.check_conflict(
        db=db,
        advocate_bar_ids=payload.advocate_bar_ids,
        hearing_date=payload.hearing_date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        court_hall_id=payload.court_hall_id
    )

    return ClashCheckResponse(
        has_conflict=has_conflict,
        conflict_message=msg,
        conflicting_counsel_bar_id=counsel_bar_id,
        conflicting_court_hall=hall
    )

@router.post("/book", response_model=CMHSessionResponse, status_code=status.HTTP_201_CREATED)
def book_cmh_slot(
    payload: BookSlotRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleType.CLERK, RoleType.JUDGE))
):
    """[CMH-206] Allocate conflict-free pre-trial CMH slot and generate WebRTC room."""
    case = db.query(Case).filter(Case.id == payload.case_id).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found.")

    # Ensure court room exists in db or seed default
    room = db.query(CourtRoom).filter(CourtRoom.hall_id == payload.court_hall_id).first()
    if not room:
        room = CourtRoom(hall_id=payload.court_hall_id, hall_name=f"Courtroom {payload.court_hall_id}")
        db.add(room)
        db.flush()

    # Collect advocate bar IDs
    bar_ids = []
    if case.plaintiff_counsel_id:
        p_counsel = db.query(User).filter(User.id == case.plaintiff_counsel_id).first()
        if p_counsel and p_counsel.bar_council_id:
            bar_ids.append(p_counsel.bar_council_id)
    if case.defendant_counsel_id:
        d_counsel = db.query(User).filter(User.id == case.defendant_counsel_id).first()
        if d_counsel and d_counsel.bar_council_id:
            bar_ids.append(d_counsel.bar_council_id)

    # Check for clash
    has_clash, clash_msg, _, _ = ClashDetectionEngine.check_conflict(
        db=db,
        advocate_bar_ids=bar_ids,
        hearing_date=payload.hearing_date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        court_hall_id=payload.court_hall_id
    )
    if has_clash:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=clash_msg)

    # Create session
    session = CMHSession(
        case_id=case.id,
        judge_id=case.judge_id or current_user.id,
        court_hall_id=payload.court_hall_id,
        hearing_date=payload.hearing_date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status=SessionStatus.SCHEDULED
    )
    case.status = CaseStatus.CMH_SCHEDULED
    db.add(session)
    db.commit()
    db.refresh(session)
    return session
