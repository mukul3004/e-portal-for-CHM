from typing import List
from backend.app.models.admissions import AdmissionItem, StanceType, ItemResolutionStatus

class AdmissionsMatrixEngine:
    """
    Admissions & Denials Matrix State Machine (Order XV-A Rule 2).
    Evaluates item resolutions and calculates pre-trial readiness score.
    """

    @staticmethod
    def evaluate_item(item: AdmissionItem) -> ItemResolutionStatus:
        """
        Determines the evidentiary status based on Plaintiff and Defendant stances.
        """
        # If either side is still pending, resolution remains pending
        if item.plaintiff_stance == StanceType.PENDING or item.defendant_stance == StanceType.PENDING:
            return ItemResolutionStatus.PENDING

        # Both sides admit execution or contents -> Undisputed fact
        admitted_stances = {StanceType.ADMIT_CONTENTS, StanceType.ADMIT_EXECUTION}
        if item.plaintiff_stance in admitted_stances and item.defendant_stance in admitted_stances:
            return ItemResolutionStatus.UNDISPUTED_FACT

        # If either side denies -> Contested triable issue
        if item.plaintiff_stance == StanceType.DENY or item.defendant_stance == StanceType.DENY:
            return ItemResolutionStatus.CONTESTED_ISSUE

        return ItemResolutionStatus.PENDING

    @staticmethod
    def calculate_readiness(items: List[AdmissionItem]) -> float:
        """
        Calculates percentage of settled/categorized items (0.0 to 100.0).
        """
        if not items:
            return 0.0
        resolved_count = sum(1 for it in items if it.resolution_status != ItemResolutionStatus.PENDING)
        return round((resolved_count / len(items)) * 100.0, 1)
