import hashlib
import random
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.echallan import EChallan, ChallanStatus, HeadOfAccount
from backend.app.models.case import Case
from backend.app.schemas.echallan import CreateChallanRequest, PayChallanRequest, EChallanResponse

router = APIRouter(prefix="/echallan", tags=["Cyber Treasury & Judicial e-Challan"])

def generate_challan_number() -> str:
    rnd = random.randint(100000, 999999)
    return f"MP-CH-2026-{rnd}"

def generate_txn_ref() -> str:
    rnd = "".join(random.choices("0123456789ABCDEF", k=10))
    return f"CYBER-MP-{rnd}"

def calculate_sha256_receipt(challan: EChallan, txn_ref: str, paid_at_str: str) -> str:
    raw = f"{challan.challan_number}|{challan.amount:.2f}|{challan.payer_name}|{challan.head_of_account}|{txn_ref}|{paid_at_str}|MP_HIGH_COURT_TREASURY"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

@router.get("/calculate-fee")
def calculate_court_fee(claim_valuation: float = Query(..., gt=0)):
    """
    Computes statutory ad-valorem court fees for commercial suits under MP Court Fees Act.
    - Base fee for Commercial Disputes (Order XV-A CPC):
      - Up to ₹10 Lakhs: 2.5% (Min ₹10,000)
      - ₹10 Lakhs to ₹50 Lakhs: ₹25,000 + 1.8% of excess over ₹10L
      - ₹50 Lakhs to ₹1 Crore: ₹97,000 + 1.2% of excess over ₹50L
      - Above ₹1 Crore: ₹1,57,000 + 0.8% of excess over ₹1Cr (Max ₹3,00,000)
    """
    val = claim_valuation
    if val <= 1000000:
        fee = max(10000.0, val * 0.025)
    elif val <= 5000000:
        fee = 25000.0 + (val - 1000000) * 0.018
    elif val <= 10000000:
        fee = 97000.0 + (val - 5000000) * 0.012
    else:
        fee = min(300000.0, 157000.0 + (val - 10000000) * 0.008)

    process_fee = 1500.0
    advocate_welfare_stamp = 500.0
    total = round(fee + process_fee + advocate_welfare_stamp, 2)

    return {
        "claim_valuation": val,
        "ad_valorem_court_fee": round(fee, 2),
        "process_serving_fee": process_fee,
        "advocate_welfare_stamp": advocate_welfare_stamp,
        "total_payable_fee": total,
        "act_schedule": "Madhya Pradesh Court Fees & Suits Valuation Act (Commercial Division Rules 2026)"
    }

@router.post("/generate", response_model=EChallanResponse, status_code=status.HTTP_201_CREATED)
def generate_challan(payload: CreateChallanRequest, db: Session = Depends(get_db)):
    """Generates an official Cyber Treasury e-Challan for court fees or commercial litigation."""
    # If case_id provided, verify case and pull CNR if missing
    cnr = payload.cnr_number
    if payload.case_id:
        case = db.query(Case).filter(Case.id == payload.case_id).first()
        if case and not cnr:
            cnr = case.cnr_number

    challan_num = generate_challan_number()
    # Check collision (rare)
    while db.query(EChallan).filter(EChallan.challan_number == challan_num).first():
        challan_num = generate_challan_number()

    challan = EChallan(
        id=str(uuid.uuid4()),
        challan_number=challan_num,
        case_id=payload.case_id,
        cnr_number=cnr,
        payer_name=payload.payer_name,
        payer_email=payload.payer_email,
        payer_role=payload.payer_role or "ADVOCATE",
        head_of_account=payload.head_of_account or HeadOfAccount.COURT_FEES.value,
        bench_id=payload.bench_id or "BENCH_INDORE_COMM_01",
        court_hall_id=payload.court_hall_id or "HALL_04",
        amount=round(payload.amount, 2),
        payment_mode=payload.payment_mode or "SBI_EPAY",
        status=ChallanStatus.PENDING,
        created_at=datetime.utcnow()
    )
    db.add(challan)
    db.commit()
    db.refresh(challan)
    return challan

@router.post("/{challan_id}/pay", response_model=EChallanResponse)
def pay_challan(challan_id: str, payload: PayChallanRequest, db: Session = Depends(get_db)):
    """Simulates online payment through Cyber Treasury MP / SBI e-Pay and seals receipt with SHA-256 hash."""
    challan = db.query(EChallan).filter(
        (EChallan.id == challan_id) | (EChallan.challan_number == challan_id)
    ).first()
    if not challan:
        raise HTTPException(status_code=404, detail="e-Challan not found.")

    if challan.status == ChallanStatus.PAID:
        return challan

    now = datetime.utcnow()
    txn_ref = generate_txn_ref()
    bank_ref = f"SBI-MP-{random.randint(10000000, 99999999)}"
    paid_at_str = now.isoformat()
    receipt_hash = calculate_sha256_receipt(challan, txn_ref, paid_at_str)

    challan.status = ChallanStatus.PAID
    challan.transaction_ref = txn_ref
    challan.bank_ref = bank_ref
    challan.payment_mode = payload.payment_mode or "SBI_EPAY"
    challan.receipt_sha256 = receipt_hash
    challan.paid_at = now

    db.commit()
    db.refresh(challan)
    return challan

@router.get("/verify/{challan_number_or_hash}", response_model=EChallanResponse)
def verify_challan(challan_number_or_hash: str, db: Session = Depends(get_db)):
    """Public verification gateway for Court Clerks and Registry to authenticate fee receipts."""
    query = challan_number_or_hash.strip()
    challan = db.query(EChallan).filter(
        (EChallan.challan_number == query) |
        (EChallan.receipt_sha256 == query) |
        (EChallan.transaction_ref == query) |
        (EChallan.id == query)
    ).first()
    if not challan:
        raise HTTPException(status_code=404, detail="e-Challan receipt not found in Cyber Treasury database.")
    return challan

@router.get("/", response_model=List[EChallanResponse])
@router.get("/list", response_model=List[EChallanResponse])
def list_challans(
    status_filter: Optional[str] = None,
    cnr: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Lists recent e-Challans with optional filters."""
    q = db.query(EChallan)
    if status_filter:
        q = q.filter(EChallan.status == status_filter.upper())
    if cnr:
        q = q.filter(EChallan.cnr_number.ilike(f"%{cnr}%"))
    return q.order_by(EChallan.created_at.desc()).limit(limit).all()
