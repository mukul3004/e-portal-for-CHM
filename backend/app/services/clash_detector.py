from datetime import date, time
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from backend.app.models.schedule import CMHSession, SessionStatus
from backend.app.models.case import Case
from backend.app.models.user import User

class ClashDetectionEngine:
    """
    Algorithmic Conflict-Detection Engine (Order XV-A CMH Scheduler).
    Checks advocate rosters across all court halls to eliminate double-booking.
    """

    @staticmethod
    def check_conflict(
        db: Session,
        advocate_bar_ids: List[str],
        hearing_date: date,
        start_time: time,
        end_time: time,
        court_hall_id: str
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        """
        Scans all scheduled CMH sessions on hearing_date for overlapping time intervals.
        Returns: (has_conflict, message, conflicting_counsel_bar_id, conflicting_court_hall)
        """
        # Find user IDs associated with these Bar Council IDs
        advocates = db.query(User).filter(User.bar_council_id.in_(advocate_bar_ids)).all()
        advocate_ids = [adv.id for adv in advocates]
        bar_id_map = {adv.id: adv.bar_council_id for adv in advocates}

        # Query all active scheduled sessions on this date
        active_sessions = db.query(CMHSession).join(Case, CMHSession.case_id == Case.id).filter(
            CMHSession.hearing_date == hearing_date,
            CMHSession.status == SessionStatus.SCHEDULED
        ).all()

        for session in active_sessions:
            # Check for time interval overlap: max(start1, start2) < min(end1, end2)
            has_time_overlap = (session.start_time < end_time) and (session.end_time > start_time)
            if not has_time_overlap:
                continue

            # Check if court hall is already occupied
            if session.court_hall_id == court_hall_id:
                return (
                    True,
                    f"Court Hall '{court_hall_id}' is already booked between {session.start_time} and {session.end_time}.",
                    None,
                    court_hall_id
                )

            # Check if any counsel in the request is booked in another courtroom hall
            session_case = session.case
            if session_case:
                involved_counsels = [session_case.plaintiff_counsel_id, session_case.defendant_counsel_id]
                for counsel_id in involved_counsels:
                    if counsel_id in advocate_ids:
                        bar_id = bar_id_map.get(counsel_id, "Unknown Bar ID")
                        return (
                            True,
                            f"Scheduling Collision: Advocate [{bar_id}] is already appearing in Court Hall '{session.court_hall_id}' from {session.start_time} to {session.end_time}.",
                            bar_id,
                            session.court_hall_id
                        )

        return False, None, None, None
