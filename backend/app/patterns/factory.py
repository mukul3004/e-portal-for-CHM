"""
=============================================================================
GANG OF FOUR (GoF) CREATIONAL PATTERN: FACTORY METHOD / ABSTRACT FACTORY
Project: Case Management Hearing e-Portal (Order XV-A CPC)
Module: backend.app.patterns.factory
=============================================================================
Defines an interface for creating a Case Management Order (CMO) decree,
but lets subclasses or specialized creators decide which specific procedural
decree and statutory discovery schedule to instantiate based on Case Category.
"""

from abc import ABC, abstractmethod
from datetime import date, timedelta
from typing import List, Dict, Any, Optional
import uuid


class CaseManagementDecree(ABC):
    """
    Abstract Product: Represents a standardized statutory Case Management Decree
    prescribed under Order XV-A Rule 2 of the Code of Civil Procedure, 1908.
    """
    def __init__(self, case_id: str, case_number: str, title: str, judge_name: str, base_date: Optional[date] = None):
        self.case_id = case_id
        self.case_number = case_number
        self.title = title
        self.judge_name = judge_name
        self.base_date = base_date or date.today()
        self.decree_id = f"CMO-{uuid.uuid4().hex[:8].upper()}"

    @property
    @abstractmethod
    def category_name(self) -> str:
        """Name of the legal category."""
        pass

    @property
    @abstractmethod
    def statutory_act(self) -> str:
        """Governing procedural statute."""
        pass

    @property
    @abstractmethod
    def witness_quota_plaintiff(self) -> int:
        """Strict witness cap for plaintiff to curtail trial delay."""
        pass

    @property
    @abstractmethod
    def witness_quota_defendant(self) -> int:
        """Strict witness cap for defendant."""
        pass

    @abstractmethod
    def generate_procedural_timetable(self) -> List[Dict[str, Any]]:
        """Generates enforceable statutory discovery deadlines."""
        pass

    @abstractmethod
    def generate_framed_issues(self) -> List[str]:
        """Formulates primary triable issues for the trial stage."""
        pass

    def export_decree(self) -> Dict[str, Any]:
        """Assembles the complete Order XV-A legal decree bundle."""
        deadlines = self.generate_procedural_timetable()
        issues = self.generate_framed_issues()
        return {
            "decree_id": self.decree_id,
            "case_id": self.case_id,
            "case_number": self.case_number,
            "title": self.title,
            "category": self.category_name,
            "governing_statute": self.statutory_act,
            "order_date": self.base_date.isoformat(),
            "presiding_judge": self.judge_name,
            "witness_caps": {
                "plaintiff": self.witness_quota_plaintiff,
                "defendant": self.witness_quota_defendant,
                "rule": "Order XV-A Rule 2(c) Witness Examination Limit"
            },
            "discovery_deadlines": deadlines,
            "framed_issues": issues,
            "penal_provisions": "Failure to adhere to discovery timetables incurs immediate preclusion of evidence under Rule 3.",
            "status": "ISSUED_ORDER_XV_A"
        }


# ---------------------------------------------------------------------------
# CONCRETE PRODUCTS
# ---------------------------------------------------------------------------

class CommercialContractDecree(CaseManagementDecree):
    """Concrete Product: Commercial Dispute governed by Commercial Courts Act, 2015."""
    @property
    def category_name(self) -> str:
        return "Commercial Contract Dispute"

    @property
    def statutory_act(self) -> str:
        return "Commercial Courts Act, 2015 & CPC Order XV-A Rule 2"

    @property
    def witness_quota_plaintiff(self) -> int:
        return 2

    @property
    def witness_quota_defendant(self) -> int:
        return 2

    def generate_procedural_timetable(self) -> List[Dict[str, Any]]:
        return [
            {
                "task": "Filing of Affidavits in Lieu of Examination-in-Chief (PW-1 & PW-2)",
                "due_date": (self.base_date + timedelta(days=15)).isoformat(),
                "statutory_days": 15,
                "strict_compliance": True
            },
            {
                "task": "Inspection of Original Digital Records & Section 65B Electronic Certificates",
                "due_date": (self.base_date + timedelta(days=30)).isoformat(),
                "statutory_days": 30,
                "strict_compliance": True
            },
            {
                "task": "Cross-Examination of Plaintiff Witnesses before Court Commissioner",
                "due_date": (self.base_date + timedelta(days=45)).isoformat(),
                "statutory_days": 45,
                "strict_compliance": True
            },
            {
                "task": "Filing of Written Arguments and Case Citations (Commercial Bench)",
                "due_date": (self.base_date + timedelta(days=60)).isoformat(),
                "statutory_days": 60,
                "strict_compliance": True
            }
        ]

    def generate_framed_issues(self) -> List[str]:
        return [
            "Whether there exists a binding and enforceable commercial agreement between the parties?",
            "Whether the defendant committed a material breach of performance under Clause 12?",
            "Whether the plaintiff is entitled to damages and interest as claimed under Section 34 CPC?"
        ]


class ChequeBounceDecree(CaseManagementDecree):
    """Concrete Product: Dishonour of Cheque under Section 138 Negotiable Instruments Act."""
    @property
    def category_name(self) -> str:
        return "Cheque Bounce (Sec 138 NI Act)"

    @property
    def statutory_act(self) -> str:
        return "Negotiable Instruments Act, 1881 (Sec 138-143) & Fast-Track CMH Rules"

    @property
    def witness_quota_plaintiff(self) -> int:
        return 1

    @property
    def witness_quota_defendant(self) -> int:
        return 1

    def generate_procedural_timetable(self) -> List[Dict[str, Any]]:
        return [
            {
                "task": "Production of Certified Bank Memo and Returned Cheque Memo",
                "due_date": (self.base_date + timedelta(days=7)).isoformat(),
                "statutory_days": 7,
                "strict_compliance": True
            },
            {
                "task": "Verification of Statutory Demand Notice & Postal Dispatch Receipts",
                "due_date": (self.base_date + timedelta(days=14)).isoformat(),
                "statutory_days": 14,
                "strict_compliance": True
            },
            {
                "task": "Cross-examination of Complainant on Defense of Stolen / Lost Cheque",
                "due_date": (self.base_date + timedelta(days=28)).isoformat(),
                "statutory_days": 28,
                "strict_compliance": True
            }
        ]

    def generate_framed_issues(self) -> List[str]:
        return [
            "Whether the cheque was drawn towards discharge of a legally enforceable debt or liability?",
            "Whether the statutory notice was duly served within the mandatory 30-day window under Sec 138(b)?",
            "Whether the statutory presumption under Section 139 NI Act stands rebutted by the accused?"
        ]


class SummarySuitDecree(CaseManagementDecree):
    """Concrete Product: Summary Suit under Order XXXVII CPC for liquidated debt."""
    @property
    def category_name(self) -> str:
        return "Summary Suit (Order XXXVII CPC)"

    @property
    def statutory_act(self) -> str:
        return "Code of Civil Procedure, 1908 (Order XXXVII Rules 1-3)"

    @property
    def witness_quota_plaintiff(self) -> int:
        return 1

    @property
    def witness_quota_defendant(self) -> int:
        return 1

    def generate_procedural_timetable(self) -> List[Dict[str, Any]]:
        return [
            {
                "task": "Adjudication of Summons for Judgment and Leave to Defend Application",
                "due_date": (self.base_date + timedelta(days=10)).isoformat(),
                "statutory_days": 10,
                "strict_compliance": True
            },
            {
                "task": "Conditional Deposit of Disputed Liquidated Amount into Court Registry",
                "due_date": (self.base_date + timedelta(days=21)).isoformat(),
                "statutory_days": 21,
                "strict_compliance": True
            }
        ]

    def generate_framed_issues(self) -> List[str]:
        return [
            "Whether the defendant discloses a bona fide triable defense entitling unconditional leave to defend?",
            "Whether the plaintiff is entitled to an immediate decree for the liquidated sum of debt?"
        ]


class ArbitrationEnforcementDecree(CaseManagementDecree):
    """Concrete Product: Section 34/36 Arbitration and Conciliation Act, 1996."""
    @property
    def category_name(self) -> str:
        return "Arbitration Award Challenge / Enforcement"

    @property
    def statutory_act(self) -> str:
        return "Arbitration and Conciliation Act, 1996 (Sections 34 & 36)"

    @property
    def witness_quota_plaintiff(self) -> int:
        return 0  # Record-based review only

    @property
    def witness_quota_defendant(self) -> int:
        return 0

    def generate_procedural_timetable(self) -> List[Dict[str, Any]]:
        return [
            {
                "task": "Submission of Certified Arbitral Record and Stamped Original Award",
                "due_date": (self.base_date + timedelta(days=15)).isoformat(),
                "statutory_days": 15,
                "strict_compliance": True
            },
            {
                "task": "Written Outline of Submissions on Patent Illegality & Public Policy grounds",
                "due_date": (self.base_date + timedelta(days=30)).isoformat(),
                "statutory_days": 30,
                "strict_compliance": True
            }
        ]

    def generate_framed_issues(self) -> List[str]:
        return [
            "Whether the arbitral award violates the Fundamental Policy of Indian Law or Public Policy?",
            "Whether the award suffers from patent illegality appearing on the face of the arbitral record?"
        ]


class GeneralCivilDecree(CaseManagementDecree):
    """Concrete Product: Standard Order XV-A Rule 2 CPC Civil Litigation."""
    @property
    def category_name(self) -> str:
        return "Civil Suit / Regular Proceeding"

    @property
    def statutory_act(self) -> str:
        return "Code of Civil Procedure, 1908 (Order XV-A Rules 1-5)"

    @property
    def witness_quota_plaintiff(self) -> int:
        return 3

    @property
    def witness_quota_defendant(self) -> int:
        return 3

    def generate_procedural_timetable(self) -> List[Dict[str, Any]]:
        return [
            {
                "task": "Filing of Affidavits in Lieu of Examination-in-Chief",
                "due_date": (self.base_date + timedelta(days=30)).isoformat(),
                "statutory_days": 30,
                "strict_compliance": True
            },
            {
                "task": "Production & Inspection of Original Documents and Notice to Admit",
                "due_date": (self.base_date + timedelta(days=45)).isoformat(),
                "statutory_days": 45,
                "strict_compliance": True
            },
            {
                "task": "Conclusion of Oral Evidence and Witness Depositions",
                "due_date": (self.base_date + timedelta(days=75)).isoformat(),
                "statutory_days": 75,
                "strict_compliance": True
            }
        ]

    def generate_framed_issues(self) -> List[str]:
        return [
            "Whether the suit is maintainable in its present form and within limitation?",
            "Whether the plaintiff establishes a prima facie cause of action for the relief sought?",
            "To what relief, if any, is the plaintiff entitled?"
        ]


# ---------------------------------------------------------------------------
# GoF ABSTRACT CREATOR AND FACTORY METHOD IMPLEMENTATIONS
# ---------------------------------------------------------------------------

class CMODecreeFactory(ABC):
    """
    Abstract Creator: Declares the factory method that returns an object of type
    CaseManagementDecree. Subclasses override this method to specify concrete products.
    """
    @abstractmethod
    def create_decree(
        self,
        case_id: str,
        case_number: str,
        title: str,
        judge_name: str,
        base_date: Optional[date] = None
    ) -> CaseManagementDecree:
        """GoF Factory Method."""
        pass


class CommercialDecreeFactory(CMODecreeFactory):
    def create_decree(self, case_id: str, case_number: str, title: str, judge_name: str, base_date: Optional[date] = None) -> CaseManagementDecree:
        return CommercialContractDecree(case_id, case_number, title, judge_name, base_date)


class ChequeBounceDecreeFactory(CMODecreeFactory):
    def create_decree(self, case_id: str, case_number: str, title: str, judge_name: str, base_date: Optional[date] = None) -> CaseManagementDecree:
        return ChequeBounceDecree(case_id, case_number, title, judge_name, base_date)


class SummarySuitDecreeFactory(CMODecreeFactory):
    def create_decree(self, case_id: str, case_number: str, title: str, judge_name: str, base_date: Optional[date] = None) -> CaseManagementDecree:
        return SummarySuitDecree(case_id, case_number, title, judge_name, base_date)


class ArbitrationDecreeFactory(CMODecreeFactory):
    def create_decree(self, case_id: str, case_number: str, title: str, judge_name: str, base_date: Optional[date] = None) -> CaseManagementDecree:
        return ArbitrationEnforcementDecree(case_id, case_number, title, judge_name, base_date)


class GeneralCivilDecreeFactory(CMODecreeFactory):
    def create_decree(self, case_id: str, case_number: str, title: str, judge_name: str, base_date: Optional[date] = None) -> CaseManagementDecree:
        return GeneralCivilDecree(case_id, case_number, title, judge_name, base_date)


# ---------------------------------------------------------------------------
# FACTORY REGISTRY & PROVIDER (Client Entrypoint)
# ---------------------------------------------------------------------------

class DecreeFactoryProvider:
    """
    Central dispatcher that maps dynamic Case Category strings to the appropriate
    GoF Concrete Factory Creator.
    """
    _factories: Dict[str, CMODecreeFactory] = {
        "commercial": CommercialDecreeFactory(),
        "contract": CommercialDecreeFactory(),
        "cheque bounce": ChequeBounceDecreeFactory(),
        "sec 138": ChequeBounceDecreeFactory(),
        "summary": SummarySuitDecreeFactory(),
        "order xxxvii": SummarySuitDecreeFactory(),
        "arbitration": ArbitrationDecreeFactory(),
        "civil": GeneralCivilDecreeFactory(),
    }

    @classmethod
    def get_factory(cls, case_category: str) -> CMODecreeFactory:
        """Returns the specialized concrete factory for the given category."""
        norm = case_category.lower()
        for key, factory in cls._factories.items():
            if key in norm:
                return factory
        return GeneralCivilDecreeFactory()

    @classmethod
    def create_decree_for_case(
        cls,
        case_category: str,
        case_id: str,
        case_number: str,
        title: str,
        judge_name: str,
        base_date: Optional[date] = None
    ) -> Dict[str, Any]:
        """Convenience method combining factory resolution and decree generation."""
        factory = cls.get_factory(case_category)
        decree_product = factory.create_decree(
            case_id=case_id,
            case_number=case_number,
            title=title,
            judge_name=judge_name,
            base_date=base_date
        )
        return decree_product.export_decree()
