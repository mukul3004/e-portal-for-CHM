import random
import hashlib
from decimal import Decimal
from typing import List, Optional
from datetime import datetime, date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy import or_
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case, CaseType, CaseStatus, Pleading, Exhibit
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
    TimelineMilestone,
    FinalVerdictRecord
)
from backend.app.security.jwt_auth import get_current_user
from backend.app.security.rbac import require_roles

router = APIRouter(prefix="/cases", tags=["Case Docket & Ingestion"])

def generate_cnr_number() -> str:
    """Generate mock 16-digit official Indian e-Courts CNR number (e.g. MPIN010012342026)."""
    random_digits = "".join([str(random.randint(0, 9)) for _ in range(8)])
    return f"MPIN01{random_digits}2026"

@router.post("/seed-dataset", status_code=status.HTTP_200_OK)
@router.get("/seed-dataset", status_code=status.HTTP_200_OK)
def trigger_seed_dataset(db: Session = Depends(get_db)):
    """Seed or refresh the commercial dispute dataset from Excel."""
    from scripts.seed_from_excel import seed_cases
    from scripts.make_dates_live import make_dates_live
    seed_cases()
    make_dates_live()
    count = db.query(Case).count()
    return {"status": "SUCCESS", "message": f"Successfully seeded {count} cases into database."}

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

def generate_verdict_record(case: Case, cmo: Optional[CaseManagementOrder]) -> Optional[FinalVerdictRecord]:
    if case.status != CaseStatus.DISPOSED:
        return None
    
    parts = case.case_title.split(" vs. ") if " vs. " in case.case_title else case.case_title.split(" vs ")
    plaintiff = parts[0].strip() if len(parts) > 0 else "Plaintiff"
    defendant = parts[1].strip() if len(parts) > 1 else "Defendant"
    
    val_int = int(hashlib.md5(case.cnr_number.encode()).hexdigest(), 16)
    outcome_mode = val_int % 10
    
    disp_date = (cmo.order_date + timedelta(days=14)).strftime("%d %b %Y") if cmo and cmo.order_date else (case.filing_date + timedelta(days=60)).strftime("%d %b %Y")
    judge_name = case.judge.full_name if case.judge else "Hon'ble Justice Rajesh Sharma"
    court_bench = case.court_hall_id or "Indore Commercial Bench, Court Hall 04"
    digest = hashlib.sha256(f"VERDICT_{case.cnr_number}_{disp_date}".encode()).hexdigest()
    qr_code = f"DECREE_ORDER_XX_{case.cnr_number[:8]}"

    # Normalize case category string
    ctype = case.case_type.value if hasattr(case.case_type, "value") else str(case.case_type)
    cmo_date_str = cmo.order_date.strftime("%d %b %Y") if cmo and cmo.order_date else "2026"

    # -------------------------------------------------------------------------
    # OUTCOME MODE 0, 1, 2, 3: FULL DECREE FOR PLAINTIFF (DECREED_FOR_PLAINTIFF)
    # -------------------------------------------------------------------------
    if outcome_mode in (0, 1, 2, 3):
        decree_amt = case.claim_valuation

        if ctype in ("CHEQUE_BOUNCE_SEC138", "CHEQUE_BOUNCE"):
            title = "Cheque Dishonour Suit Decreed under Sec 138 NI Act with Penal Damages & Interest"
            statutory_law = "Negotiable Instruments Act, 1881 (Sections 138, 139 & 117) and Order XXXVII CPC"
            interest_rate = "18.0% per annum statutory interest under Section 117 of Negotiable Instruments Act, 1881"
            costs_awarded = "₹ 45,000 litigation expenses awarded under Section 357(3) CrPC / Section 35 CPC"
            operative_order = (
                f"The summary suit for dishonour of negotiable instrument is hereby DECREED in favour of the Complainant/Plaintiff ({plaintiff}) "
                f"and against the Defendant ({defendant}). The Defendant is directed to pay the cheque sum of ₹ {float(decree_amt):,.2f} "
                f"together with statutory interest at 18% p.a. from {case.filing_date.strftime('%d %b %Y')} until realization, plus litigation costs."
            )
            reasoning = [
                "Statutory Presumption under Section 139 NI Act: The Defendant admitted issuance and signature on the cheque in the pre-trial Order XV-A checklist, raising statutory presumption of legally enforceable debt.",
                "Failure of Evidentiary Rebuttal: Under Order VIII Rule 3A CPC, the Defendant's plea of lost/security cheque remained unsubstantiated with zero contemporaneous police or bank intimations.",
                "Dishonour Memo Validated: Bank return memo with reason 'Funds Insufficient' proved through certified electronic statements under Section 65B Indian Evidence Act.",
                "Compliance with Statutory Demand: Legal notice under Section 138(b) was duly served with postal tracking, yet Defendant defaulted on payment."
            ]
        elif ctype in ("ARBITRATION_PETITION", "ARBITRATION"):
            title = "Arbitration Enforcement Petition Allowed: Arbitral Award Upheld with Post-Award Interest"
            statutory_law = "Arbitration and Conciliation Act, 1996 (Sections 34 & 36) and Order XXI CPC"
            interest_rate = "Statutory post-award commercial interest at 2% higher than prevailing bank rate under Section 31(7)(b)"
            costs_awarded = "Arbitration and execution costs of ₹ 1,20,000 confirmed under Section 31A Arbitration Act"
            operative_order = (
                f"The Section 36 Arbitration Enforcement Petition is hereby ALLOWED. The domestic arbitral award is UPHELD "
                f"in favour of the Award-Holder ({plaintiff}) and shall be executed as a decree of this Court against the Judgment-Debtor ({defendant}) "
                f"in the sum of ₹ {float(decree_amt):,.2f} with statutory post-award interest."
            )
            reasoning = [
                "Narrow Scope of Judicial Review under Section 34: The arbitral award displays no patent illegality, perversity, or contravention of fundamental Indian public policy.",
                "Findings of Fact Crystallized: Pre-trial CMH verification confirmed that procedural due process and equal opportunity to present case were respected by the Arbitral Tribunal.",
                "Enforceability under Section 36: The limitation period for challenging the award has expired; the award has attained finality and is immediately executable as a court decree."
            ]
        elif ctype == "CIVIL_RECOVERY":
            title = "Summary Debt Recovery Suit Decreed under Order XXXVII CPC with Commercial Interest"
            statutory_law = "Order XXXVII Rules 1-3 CPC and Section 34 Code of Civil Procedure, 1908"
            interest_rate = "12.0% per annum commercial debt interest from default date until realization"
            costs_awarded = "₹ 60,000 court fees and advocate fee recovery under Section 35 CPC"
            operative_order = (
                f"The summary recovery suit under Order XXXVII CPC is hereby DECREED in favour of the Plaintiff ({plaintiff}) "
                f"against the Defendant ({defendant}). The Defendant shall pay the liquidated debt sum of ₹ {float(decree_amt):,.2f} "
                f"with 12% commercial interest from {case.filing_date.strftime('%d %b %Y')} until actual realization, plus costs."
            )
            reasoning = [
                "Liquidated Commercial Debt: Plaintiff proved debt through verified ledger statements, delivery challans, and acknowledged e-way bills.",
                "Rejection of Leave to Defend: Defendant's application disclosed no bona fide or triable defence, warranting an immediate Order XXXVII Rule 3(6) decree.",
                "Pre-trial Admissions: Crucial financial averments were left unrefuted in the Defendant's written submissions under Order XV-A."
            ]
        elif ctype in ("CONTRACT_DISPUTE", "CONTRACT"):
            title = "Suit for Breach of Contract Decreed: Liquidated Damages & Full Costs Awarded"
            statutory_law = "Indian Contract Act, 1872 (Section 73) read with Specific Relief Act, 1963 and Order XX CPC"
            interest_rate = "10.0% per annum contractual default interest from breach date until realization"
            costs_awarded = "₹ 75,000 legal costs awarded under Section 35 CPC"
            operative_order = (
                f"The suit for contractual breach is hereby DECREED in favour of the Plaintiff ({plaintiff}). "
                f"The Defendant ({defendant}) is held liable for material breach of service-level covenants and ordered to pay "
                f"₹ {float(decree_amt):,.2f} as liquidated damages and restitution with 10% interest within 60 days."
            )
            reasoning = [
                "Valid and Enforceable Contract: Both parties formally admitted execution of Master Service Agreement in pre-trial admissions.",
                "Material Breach Established: Default in deliverables and milestone delays proved through documented email trails and audit logs.",
                "Liquidated Damages under Section 74: The claimed amount represents a genuine pre-estimate of loss incurred by the Plaintiff."
            ]
        else:
            title = "Commercial Suit Decreed in Full with Interest & Costs"
            statutory_law = "Order XX Rules 6 & 7 CPC, Section 34 CPC, and Section 16 of the Commercial Courts Act, 2015"
            interest_rate = "9.0% per annum pendente lite and future commercial interest from filing date until realization"
            costs_awarded = "₹ 85,000 legal costs awarded under Section 35 CPC"
            operative_order = (
                f"The commercial suit is hereby DECREED in favour of the Plaintiff ({plaintiff}) "
                f"and against the Defendant ({defendant}). The Defendant is ordered to pay the principal sum of "
                f"₹ {float(decree_amt):,.2f} along with commercial interest at 9% per annum from {case.filing_date.strftime('%d %b %Y')} "
                f"until actual realization, plus taxable litigation costs within 60 days of this decree."
            )
            reasoning = [
                "Uncontroverted Order XV-A Admissions: The Defendant formally admitted execution of primary invoices in pre-trial checklist.",
                "Failure of Evidentiary Rebuttal: Under Order VIII Rule 3A CPC, evasive denials failed to rebut exhibits.",
                "Tamper-Evident SHA-256 Electronic Records: Digital delivery receipts verified under Section 65B Indian Evidence Act.",
                f"Triable Issues Adjudicated: Framed issues in the Case Management Order (CMO) dated {cmo_date_str} answered in favour of Plaintiff."
            ]

        return FinalVerdictRecord(
            verdict_type="DECREED_FOR_PLAINTIFF",
            verdict_title=title,
            winning_party=f"{plaintiff} (Plaintiff)",
            losing_party=f"{defendant} (Defendant)",
            decree_amount=decree_amt,
            interest_rate=interest_rate,
            costs_awarded=costs_awarded,
            judgment_date=disp_date,
            pronouncing_judge=judge_name,
            court_bench=court_bench,
            operative_order=operative_order,
            judicial_reasoning=reasoning,
            statutory_law=statutory_law,
            sha256_digest=digest,
            qr_verification_code=qr_code
        )

    # -------------------------------------------------------------------------
    # OUTCOME MODE 4, 5: DECREED IN PART (DECREED_IN_PART - 70-80% OF CLAIM)
    # -------------------------------------------------------------------------
    elif outcome_mode in (4, 5):
        partial_ratio = Decimal("0.75")
        decree_amt = Decimal(str(round(float(case.claim_valuation) * float(partial_ratio), 2)))

        if ctype in ("CHEQUE_BOUNCE_SEC138", "CHEQUE_BOUNCE"):
            title = "Cheque Dishonour Suit Decreed for Principal Cheque Sum; Excessive Penal Claim Disallowed"
            statutory_law = "Negotiable Instruments Act, 1881 (Sec 138/117) and Order XXXVII CPC"
            interest_rate = "9.0% per annum statutory interest on verified cheque debt"
            costs_awarded = "Proportionate costs of ₹ 30,000 awarded under Section 35 CPC"
            operative_order = (
                f"The suit is DECREED IN PART in favour of {plaintiff}. The Defendant ({defendant}) is ordered to pay the "
                f"adjudicated principal cheque amount of ₹ {float(decree_amt):,.2f} with 9% interest. The ancillary claim "
                f"for exorbitant compounding penalty is struck off as unsubstantiated."
            )
            reasoning = [
                "Principal Debt Established: Cheque presentation and bank dishonour verified through certified records.",
                "Severance of Inflated Claims: Uncontracted administrative penal surcharges claimed by Complainant were disallowed.",
                "Proportionate Relief: Defendant directed to satisfy principal debt within 45 days."
            ]
        elif ctype in ("ARBITRATION_PETITION", "ARBITRATION"):
            title = "Arbitral Award Severed & Partially Enforced under Section 34/36 with Modified Interest"
            statutory_law = "Arbitration and Conciliation Act, 1996 (Sections 34 & 36)"
            interest_rate = "Post-award interest modified to 9.0% per annum under Section 31(7)"
            costs_awarded = "Parties to bear their respective arbitral costs"
            operative_order = (
                f"The Section 34 challenge succeeds in part. Applying the statutory doctrine of severability, the principal award "
                f"of ₹ {float(decree_amt):,.2f} is UPHELD and made enforceable as a decree, whereas the 24% pre-award penal interest "
                f"is scaled down to reasonable commercial rate of 9% p.a."
            )
            reasoning = [
                "Severability of Award: Flawed findings on compounding interest separated from valid liability findings.",
                "Public Policy of India: Usurious compounding interest deemed contrary to Section 34 public policy standards.",
                "Substantial Enforcement: Award-Holder entitled to execute decree for verified sum."
            ]
        elif ctype == "CIVIL_RECOVERY":
            title = "Recovery Suit Decreed in Part for Verified Invoiced Sum; Late Surcharges Disallowed"
            statutory_law = "Order XXXVII Rules 1-3 CPC and Section 34 Code of Civil Procedure"
            interest_rate = "8.5% per annum commercial interest from due date until payment"
            costs_awarded = "Proportionate costs of ₹ 40,000 awarded"
            operative_order = (
                f"The recovery suit is DECREED IN PART. The Plaintiff ({plaintiff}) is awarded the verified invoiced sum of "
                f"₹ {float(decree_amt):,.2f} with 8.5% interest. The unverified late surcharge claims are dismissed for lack of documentary proof."
            )
            reasoning = [
                "Primary Debt Substantiated: Actual goods delivered were admitted in Order XV-A CMH matrix.",
                "Disputed Surcharges: Unilateral late fees lacked explicit written contractual backing.",
                "Partial Decree Passed: Enforceable against Defendant within 60 days."
            ]
        elif ctype in ("CONTRACT_DISPUTE", "CONTRACT"):
            title = "Contractual Breach Decreed in Part: Mitigated Direct Damages Awarded under Section 73"
            statutory_law = "Indian Contract Act, 1872 (Section 73) and Specific Relief Act, 1963"
            interest_rate = "9.0% per annum contractual default interest"
            costs_awarded = "₹ 50,000 proportionate legal costs"
            operative_order = (
                f"The suit is DECREED IN PART. Under Section 73 of the Indian Contract Act, Plaintiff ({plaintiff}) is entitled "
                f"to actual direct damages of ₹ {float(decree_amt):,.2f} resulting naturally from the breach. Consequential remote damages are disallowed."
            )
            reasoning = [
                "Duty to Mitigate Losses: Section 73 requires Plaintiff to mitigate damages upon receiving notice of breach.",
                "Direct Damages Awarded: Proven expenditure incurred in sourcing substitute performance allowed.",
                "Remote Speculative Profit Disallowed: Hadleys v. Baxendale rule applied."
            ]
        else:
            title = "Commercial Suit Decreed in Part (Exaggerated Claims Disallowed) with Proportionate Costs"
            statutory_law = "Order XX Rules 6 & 7 CPC, Section 34 CPC, and Section 16 of the Commercial Courts Act, 2015"
            interest_rate = "8.0% per annum commercial interest on decreed sum"
            costs_awarded = "₹ 55,000 proportionate costs awarded under Section 35 CPC"
            operative_order = (
                f"The commercial suit is hereby DECREED IN PART. The Plaintiff ({plaintiff}) has established liability for "
                f"delivered consignments amounting to ₹ {float(decree_amt):,.2f}. The speculative claim for anticipated business loss "
                f"is disallowed. Defendant shall pay ₹ {float(decree_amt):,.2f} with 8% p.a. interest within 60 days."
            )
            reasoning = [
                "Verified Commercial Invoices: Claims backed by acknowledged tax invoices admitted in CMH matrix.",
                "Disallowance of Speculative Relief: Loss of reputation and consequential damages not proved with cogent accounts.",
                "Proportionate Relief: Decree executable for substantiated sum."
            ]

        return FinalVerdictRecord(
            verdict_type="DECREED_IN_PART",
            verdict_title=title,
            winning_party=f"{plaintiff} (Plaintiff - Succeeded in Part)",
            losing_party=f"{defendant} (Defendant - Held Liable in Part)",
            decree_amount=decree_amt,
            interest_rate=interest_rate,
            costs_awarded=costs_awarded,
            judgment_date=disp_date,
            pronouncing_judge=judge_name,
            court_bench=court_bench,
            operative_order=operative_order,
            judicial_reasoning=reasoning,
            statutory_law=statutory_law,
            sha256_digest=digest,
            qr_verification_code=qr_code
        )

    # -------------------------------------------------------------------------
    # OUTCOME MODE 6, 7: SUIT DISMISSED (DEFENDANT WINS) (SUIT_DISMISSED)
    # -------------------------------------------------------------------------
    elif outcome_mode in (6, 7):
        if ctype in ("CHEQUE_BOUNCE_SEC138", "CHEQUE_BOUNCE"):
            title = "Section 138 NI Act Complaint Dismissed: Statutory Presumption Rebutted by Accused"
            statutory_law = "Negotiable Instruments Act, 1881 (Sections 138 & 139) and Section 255(1) CrPC"
            operative_order = (
                f"The complaint under Section 138 NI Act is hereby DISMISSED on merits. The Defendant ({defendant}) successfully "
                f"rebutted the statutory presumption under Section 139 NI Act by establishing that the cheque was issued as conditional security "
                f"for an unfulfilled transaction. Accused is exonerated."
            )
            reasoning = [
                "Rebuttal of Presumption on Preponderance of Probabilities: Defendant produced stop-payment bank instructions lodged prior to cheque date.",
                "Absence of Enforceable Debt: Underlying supply agreement was cancelled by mutual consent prior to presentation.",
                "Criminal Liability Negated: Essential ingredients under Section 138 NI Act not satisfied."
            ]
        elif ctype in ("ARBITRATION_PETITION", "ARBITRATION"):
            title = "Section 34 Petition Allowed: Arbitral Award Set Aside for Patent Illegality"
            statutory_law = "Arbitration and Conciliation Act, 1996 (Section 34) and Order XX Rule 5 CPC"
            operative_order = (
                f"The Section 34 petition filed by {defendant} is ALLOWED. The impugned arbitral award is SET ASIDE under "
                f"Section 34(2A) for patent illegality appearing on the face of the record and contravention of fundamental Indian public policy."
            )
            reasoning = [
                "Patent Illegality Established: Arbitrator rewrote unambiguous express terms of the commercial contract.",
                "Violation of Natural Justice: Relevant material exhibits tendered by Respondent were excluded without reasoned order.",
                "Award Incurably Defective: Non-compliance with Section 31(3) mandatory requirement of stated reasons."
            ]
        elif ctype == "CIVIL_RECOVERY":
            title = "Summary Debt Recovery Suit Dismissed: Claim Barred by Law of Limitation"
            statutory_law = "Limitation Act, 1963 (Section 3) and Order VII Rule 11 / Order XX CPC"
            operative_order = (
                f"The recovery suit is hereby DISMISSED. Under Section 3 of the Limitation Act, 1963, the claim instituted by "
                f"{plaintiff} is barred by limitation as no acknowledgment of debt occurred within the mandatory 3-year statutory window."
            )
            reasoning = [
                "Statutory Bar of Limitation: Cause of action arose over 4 years prior to filing; no valid Section 18 acknowledgment.",
                "Court Bound to Dismiss: Section 3 Limitation Act mandates dismissal even when limitation is not formally pleaded.",
                "Suit Not Maintainable: Unilateral invoices cannot revive time-barred claims."
            ]
        elif ctype in ("CONTRACT_DISPUTE", "CONTRACT"):
            title = "Suit for Contractual Breach Dismissed: Plaintiff Failed to Discharge Evidentiary Burden"
            statutory_law = "Specific Relief Act, 1963 (Section 16) and Order XX Rule 5 CPC"
            operative_order = (
                f"The suit for breach of contract is hereby DISMISSED on merits. The Plaintiff ({plaintiff}) failed to prove "
                f"readiness and willingness to perform essential reciprocal obligations under Section 16(c) of Specific Relief Act."
            )
            reasoning = [
                "Reciprocal Promises under Section 51 Contract Act: Plaintiff defaulted on primary advance payment obligation.",
                "Lack of Readiness and Willingness: Statutory test of continuous readiness not discharged by Plaintiff.",
                "No Actionable Breach by Defendant: Performance paused lawfully due to Plaintiff's antecedent non-performance."
            ]
        else:
            title = "Commercial Suit Dismissed for Failure to Establish Contractual Liability"
            statutory_law = "Order XX Rule 5 CPC & Section 16 Commercial Courts Act, 2015"
            operative_order = (
                f"The commercial suit is hereby DISMISSED on merits. The Plaintiff ({plaintiff}) has failed to substantiate "
                f"the alleged breach of contractual warranty against {defendant}. The interim applications stand disposed of, "
                f"and Plaintiff shall pay ₹ 35,000 costs to Defendant within 30 days."
            )
            reasoning = [
                "Failure to Discharge Burden of Proof: The Plaintiff failed to establish that supplied goods deviated from specifications.",
                "Barred by Limitation / Acquiescence: Consignments retained without lodging protest within contractual inspection window.",
                "Negative Finding on Triable Issues: Pivotal issues in Case Management Order answered in negative against Plaintiff."
            ]

        return FinalVerdictRecord(
            verdict_type="SUIT_DISMISSED",
            verdict_title=title,
            winning_party=f"{defendant} (Defendant - Exonerated)",
            losing_party=f"{plaintiff} (Plaintiff - Suit Dismissed)",
            decree_amount=Decimal("0.00"),
            interest_rate="Nil",
            costs_awarded="Plaintiff directed to pay ₹ 35,000 compensatory costs under Section 35A CPC",
            judgment_date=disp_date,
            pronouncing_judge=judge_name,
            court_bench=court_bench,
            operative_order=operative_order,
            judicial_reasoning=reasoning,
            statutory_law=statutory_law,
            sha256_digest=digest,
            qr_verification_code=qr_code
        )

    # -------------------------------------------------------------------------
    # OUTCOME MODE 8, 9: COMPROMISE / MEDIATION SETTLEMENT (SETTLED_VIA_ADR)
    # -------------------------------------------------------------------------
    else:
        settlement_amt = Decimal(str(round(float(case.claim_valuation) * 0.85, 2)))

        if ctype in ("CHEQUE_BOUNCE_SEC138", "CHEQUE_BOUNCE"):
            title = "Cheque Dishonour Dispute Compounded under Section 147 NI Act Upon Full Settlement"
            statutory_law = "Negotiable Instruments Act, 1881 (Section 147) and Order XXIII Rule 3 CPC"
            operative_order = (
                f"The dispute under Section 138 NI Act is hereby COMPOUNDED under Section 147 of the Negotiable Instruments Act "
                f"pursuant to mutual settlement. The Defendant ({defendant}) undertakes to pay the compromised sum of "
                f"₹ {float(settlement_amt):,.2f} in two bank installments to {plaintiff}. Proceedings stand closed."
            )
            reasoning = [
                "Statutory Compounding under Section 147: Supreme Court in Damodar S. Prabhu permits amicable compounding of NI Act disputes.",
                "Consent Settlement Executed: Mutual deed executed voluntarily by parties before Court Master.",
                "Final Discharge: Compromise constitutes complete satisfaction of underlying commercial liabilities."
            ]
        elif ctype in ("ARBITRATION_PETITION", "ARBITRATION"):
            title = "Arbitration Dispute Concluded by Consent Terms and Compromise Decree under Section 89 CPC"
            statutory_law = "Section 89 CPC, Order XXIII Rule 3 CPC, and Arbitration & Conciliation Act, 1996"
            operative_order = (
                f"Pursuant to amicable mediation before the High Court ADR Centre, parties have entered into binding consent terms. "
                f"The arbitral award challenge is DISPOSED OF as compromised. The Respondent ({defendant}) shall satisfy the agreed "
                f"compromised amount of ₹ {float(settlement_amt):,.2f} to {plaintiff} within 45 days."
            )
            reasoning = [
                "Alternative Dispute Resolution under Section 89 CPC: Referral to mediation resulted in comprehensive settlement.",
                "Lawful Consent Terms: Duly signed by authorized directors of both commercial entities.",
                "Full Satisfaction of Arbitral Award: Executable in terms of compromise decree."
            ]
        elif ctype == "CIVIL_RECOVERY":
            title = "Debt Restructuring & Mutual Settlement Decree Passed under Order XXIII Rule 3 CPC"
            statutory_law = "Section 89 CPC, Order XXIII Rule 3 CPC, and Section 16 Court Fees Act"
            operative_order = (
                f"A Compromise Decree under Order XXIII Rule 3 CPC is hereby passed in terms of the Debt Restructuring Agreement. "
                f"The Defendant ({defendant}) shall pay the compromised sum of ₹ {float(settlement_amt):,.2f} in three monthly installments "
                f"to {plaintiff}. In default of any installment, Plaintiff may execute decree for full principal sum."
            )
            reasoning = [
                "Mutual Restructuring: Commercial borrower and creditor arrived at restructured payment schedule during CMH.",
                "Default Clause Recorded: Protection against future default incorporated in compromise order.",
                "Court Fee Refund: 100% court fees refunded under Section 16 Court Fees Act."
            ]
        elif ctype in ("CONTRACT_DISPUTE", "CONTRACT"):
            title = "Contractual Dispute Amicably Settled via Court-Annexed Conciliation Centre"
            statutory_law = "Section 89 CPC, Order XXIII Rule 3 CPC, and Section 12A Commercial Courts Act"
            operative_order = (
                f"Pursuant to conciliation settlement, the contractual dispute stands resolved. The Defendant ({defendant}) "
                f"agrees to complete defective performance within 30 days and pay ₹ {float(settlement_amt):,.2f} as agreed restitution "
                f"to {plaintiff}. Formal Compromise Decree is drawn accordingly."
            )
            reasoning = [
                "Amicable Commercial Resolution: Preservation of long-term business relationship between commercial partners.",
                "Mutual Reciprocal Covenants: Both parties agreed to discharge remaining mutual performance obligations.",
                "Decree Executable: Binding upon both entities and their successors."
            ]
        else:
            title = "Compromise Decree Passed Upon Statutory Mediation Settlement (Sec 12A Commercial Courts Act)"
            statutory_law = "Section 89 CPC, Order XXIII Rule 3 CPC, and Section 12A Commercial Courts Act, 2015"
            operative_order = (
                f"Pursuant to the mediation agreement executed before the High Court Mediation & Conciliation Centre "
                f"under Section 89 CPC, a Compromise Decree is hereby drawn in terms of the memorandum of settlement. "
                f"The Defendant ({defendant}) undertakes to pay the agreed compromised sum of ₹ {float(settlement_amt):,.2f} "
                f"in three equal monthly installments to {plaintiff}."
            )
            reasoning = [
                "Voluntary Referral under Section 89 CPC: Dispute referred to court-annexed mediation following Pre-Trial CMH.",
                "Lawful Agreement under Order XXIII Rule 3 CPC: Terms lawful and signed by authorized representatives.",
                "Finality of Consent Decree: Complete discharge of all mutual claims and counter-claims."
            ]

        return FinalVerdictRecord(
            verdict_type="SETTLED_VIA_ADR",
            verdict_title=title,
            winning_party=f"Both Parties ({plaintiff} & {defendant} - Mutual Compromise)",
            losing_party="None (Consent Settlement)",
            decree_amount=settlement_amt,
            interest_rate="Waived under consent settlement terms",
            costs_awarded="Parties to bear their own costs; 100% court fees refunded under Section 16 Court Fees Act",
            judgment_date=disp_date,
            pronouncing_judge=judge_name,
            court_bench=court_bench,
            operative_order=operative_order,
            judicial_reasoning=reasoning,
            statutory_law=statutory_law,
            sha256_digest=digest,
            qr_verification_code=qr_code
        )

@router.get("/", response_model=List[CaseResponse])
def list_cases(db: Session = Depends(get_db)):
    """List all registered case dockets enriched with live next hearing dates, purpose, and final verdict if disposed."""
    cases = db.query(Case).order_by(Case.filing_date.desc()).all()
    results = []
    for c in cases:
        next_info = get_next_hearing_info(c, db)
        c_dict = CaseResponse.model_validate(c).model_dump()
        c_dict.update(next_info)
        if c.status == CaseStatus.DISPOSED:
            cmo = db.query(CaseManagementOrder).filter(CaseManagementOrder.case_id == c.id).first()
            c_dict["verdict"] = generate_verdict_record(c, cmo)
        results.append(CaseResponse(**c_dict))
    return results

@router.get("/search", response_model=List[CaseSearchResult])
def search_cases(
    q: Optional[str] = Query(None, description="Search query: CNR number, case title, or court hall"),
    case_type: Optional[str] = Query(None, description="Filter by case type"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by case status"),
    db: Session = Depends(get_db)
):
    """Search registered court dockets across CNR number, case title, and court hall with live next hearing details and verdicts."""
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
        if c.status == CaseStatus.DISPOSED:
            cmo = db.query(CaseManagementOrder).filter(CaseManagementOrder.case_id == c.id).first()
            c_dict["verdict"] = generate_verdict_record(c, cmo)
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

    # Milestone 6: Final Judgment & Disposal
    if case.status == CaseStatus.DISPOSED:
        disp_date = cmo.order_date + timedelta(days=14) if cmo else case.filing_date + timedelta(days=60)
        timeline.append(TimelineMilestone(
            date=disp_date.strftime("%d %b %Y"),
            title="Final Judgment & Decree / Disposed",
            stage="DISPOSED",
            description="Trial concluded. Final decree pronounced under Order XX CPC / statutory dispute resolved. Proceedings officially disposed and closed.",
            status="COMPLETED"
        ))

    next_info = get_next_hearing_info(case, db)
    verdict_record = generate_verdict_record(case, cmo)
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
        verdict=verdict_record,
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

@router.get("/{identifier}/export-ics", summary="Export Case Management Order compliance deadlines as .ics iCalendar file")
def export_cmo_deadlines_ics(identifier: str, db: Session = Depends(get_db)):
    """
    Exports the statutory compliance deadlines and discovery timetable
    for the specified case in RFC 5545 iCalendar (.ics) format.
    Allows advocates to synchronize court deadlines directly into Google Calendar,
    Apple Calendar, Microsoft Outlook, or digital legal diaries.
    """
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

    cmo = db.query(CaseManagementOrder).filter(CaseManagementOrder.case_id == case.id).first()
    
    events = []
    base_date = cmo.order_date.date() if (cmo and cmo.order_date) else (case.filing_date.date() if case.filing_date else date.today())
    
    if cmo and cmo.deadlines:
        for idx, d in enumerate(cmo.deadlines):
            due = d.due_date if isinstance(d.due_date, (date, datetime)) else date.fromisoformat(str(d.due_date))
            next_day = due + timedelta(days=1)
            status_str = d.status.value if hasattr(d.status, 'value') else str(d.status)
            events.append({
                "uid": f"cmo-dl-{d.id}@{case.cnr_number}.mphc.gov.in",
                "summary": f"[Court Deadline] {d.task_description} - {case.cnr_number}",
                "description": f"Mandatory compliance deadline under Order XV-A Rule 6 CPC for {case.case_title} (CNR: {case.cnr_number}). Task: {d.task_description}. Status: {status_str}. Presiding Judge: Hon'ble Justice Rajesh Sharma, Commercial Court Bench at Indore.",
                "dtstart": due.strftime("%Y%m%d"),
                "dtend": next_day.strftime("%Y%m%d")
            })
    else:
        # Statutory standard discovery schedule under Order XV-A CPC
        d1 = base_date + timedelta(days=15)
        d2 = base_date + timedelta(days=30)
        d3 = base_date + timedelta(days=45)
        events = [
            {
                "uid": f"cmo-stat-1-{case.cnr_number}@mphc.gov.in",
                "summary": f"[Court Deadline] Filing of Witness Affidavits - {case.cnr_number}",
                "description": f"Mandatory submission of witness affidavits in lieu of examination-in-chief pursuant to Order XV-A Rule 6 CPC for {case.case_title} (CNR: {case.cnr_number}). Bench: Court Hall 04, Indore Bench.",
                "dtstart": d1.strftime("%Y%m%d"),
                "dtend": (d1 + timedelta(days=1)).strftime("%Y%m%d")
            },
            {
                "uid": f"cmo-stat-2-{case.cnr_number}@mphc.gov.in",
                "summary": f"[Court Deadline] Inspection of Original Documents - {case.cnr_number}",
                "description": f"Mandatory physical & electronic inspection of original discovery documents under Order XV-A Rule 3 CPC for {case.case_title} (CNR: {case.cnr_number}). Bench: Court Hall 04, Indore Bench.",
                "dtstart": d2.strftime("%Y%m%d"),
                "dtend": (d2 + timedelta(days=1)).strftime("%Y%m%d")
            },
            {
                "uid": f"cmo-stat-3-{case.cnr_number}@mphc.gov.in",
                "summary": f"[Court Hearing] Trial Commencement Date - {case.cnr_number}",
                "description": f"Commencement of Trial and Oral Examination of Witnesses under Order XV-A Rule 7 CPC for {case.case_title} (CNR: {case.cnr_number}). Presiding Judge: Hon'ble Justice Rajesh Sharma, Court Hall 04, Indore Bench.",
                "dtstart": d3.strftime("%Y%m%d"),
                "dtend": (d3 + timedelta(days=1)).strftime("%Y%m%d")
            }
        ]

    now_utc = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//High Court of Madhya Pradesh//Commercial Case Management System//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        f"X-WR-CALNAME:CMO Deadlines - {case.cnr_number}",
        "X-WR-TIMEZONE:Asia/Kolkata"
    ]
    for ev in events:
        lines.extend([
            "BEGIN:VEVENT",
            f"UID:{ev['uid']}",
            f"DTSTAMP:{now_utc}",
            f"DTSTART;VALUE=DATE:{ev['dtstart']}",
            f"DTEND;VALUE=DATE:{ev['dtend']}",
            f"SUMMARY:{ev['summary']}",
            f"DESCRIPTION:{ev['description']}",
            "LOCATION:Commercial Court Hall 04, Indore Bench, High Court of Madhya Pradesh",
            "STATUS:CONFIRMED",
            "CATEGORIES:COURT_DEADLINE,LEGAL,COMPLIANCE",
            "BEGIN:VALARM",
            "TRIGGER:-P1D",
            "ACTION:DISPLAY",
            f"DESCRIPTION:Court Compliance Deadline Reminder: {ev['summary']}",
            "END:VALARM",
            "END:VEVENT"
        ])
    lines.append("END:VCALENDAR")
    ics_text = "\r\n".join(lines) + "\r\n"

    return Response(
        content=ics_text,
        media_type="text/calendar; charset=utf-8",
        headers={
            "Content-Disposition": f'attachment; filename="CMO_Compliance_Deadlines_{case.cnr_number}.ics"'
        }
    )


