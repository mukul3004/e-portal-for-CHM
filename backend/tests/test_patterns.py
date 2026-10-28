"""
=============================================================================
UNIT TEST SUITE: GANG OF FOUR (GoF) DESIGN PATTERNS
Project: Case Management Hearing e-Portal (Order XV-A CPC)
Course: SVVV B.Tech CSE Semester-VII Major Project (BTCS706N)
=============================================================================
Validates:
  1. Creational: Singleton Pattern (JudicialVaultSingleton, DatabaseConnectionPoolSingleton)
  2. Creational: Factory Method Pattern (CMODecreeFactory, Concrete Creators, DecreeFactoryProvider)
  3. Behavioral: Strategy Pattern (StrictBenchSlottingStrategy, FlexibleBufferSlottingStrategy,
     VirtualHybridSlottingStrategy, ClashDetectionContext)
=============================================================================
"""

import threading
from datetime import date, time, timedelta
import pytest
from sqlalchemy.orm import Session

from backend.app.patterns.singleton import (
    JudicialVaultSingleton,
    DatabaseConnectionPoolSingleton
)
from backend.app.patterns.factory import (
    CommercialContractDecree,
    ChequeBounceDecree,
    SummarySuitDecree,
    ArbitrationEnforcementDecree,
    GeneralCivilDecree,
    CommercialDecreeFactory,
    ChequeBounceDecreeFactory,
    SummarySuitDecreeFactory,
    ArbitrationDecreeFactory,
    GeneralCivilDecreeFactory,
    DecreeFactoryProvider
)
from backend.app.patterns.strategy import (
    StrictBenchSlottingStrategy,
    FlexibleBufferSlottingStrategy,
    VirtualHybridSlottingStrategy,
    ClashDetectionContext
)
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case, CaseStatus, CaseType
from backend.app.models.schedule import CMHSession, CourtRoom, SessionStatus


# ===========================================================================
# 1. SINGLETON PATTERN TESTS
# ===========================================================================

def test_judicial_vault_singleton_identity():
    """Verify that multiple invocations return the exact same memory instance."""
    JudicialVaultSingleton.reset_instance()
    v1 = JudicialVaultSingleton.get_instance()
    v2 = JudicialVaultSingleton()
    v3 = JudicialVaultSingleton.get_instance()

    assert v1 is v2
    assert v2 is v3
    assert v1.vault_id == v2.vault_id


def test_judicial_vault_multithreaded_concurrency():
    """Verify thread-safety and double-checked locking under high concurrent load."""
    JudicialVaultSingleton.reset_instance()
    instances = []

    def worker():
        inst = JudicialVaultSingleton.get_instance()
        instances.append(inst)

    threads = [threading.Thread(target=worker) for _ in range(30)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert len(instances) == 30
    first = instances[0]
    for inst in instances:
        assert inst is first


def test_judicial_vault_sha256_and_tamper_detection():
    """Verify cryptographic sealing, immutable audit recording, and tamper detection."""
    vault = JudicialVaultSingleton.get_instance()
    doc_id = "DOC-SEC-138-001"
    original_data = b"Case Order XV-A Rule 2 Statutory Discovery Order: Verified."
    tampered_data = b"Case Order XV-A Rule 2 Statutory Discovery Order: TAMPERED."

    reg = vault.register_certified_document(
        document_id=doc_id,
        case_id="CASE-123",
        document_type="ORDER_XV_A_DECREE",
        raw_bytes=original_data,
        signatory_bar_or_judge_id="MP/4412/2012"
    )

    assert len(reg["sha256_digest"]) == 64
    assert reg["document_id"] == doc_id

    # Test valid integrity check
    check_ok = vault.verify_document_integrity(doc_id, original_data)
    assert check_ok["verified"] is True
    assert check_ok["tampered"] is False

    # Test tampered bytes check
    check_fail = vault.verify_document_integrity(doc_id, tampered_data)
    assert check_fail["verified"] is False
    assert check_fail["tampered"] is True


def test_database_connection_pool_singleton():
    """Verify DatabaseConnectionPoolSingleton maintains single engine and session generator."""
    pool1 = DatabaseConnectionPoolSingleton.get_instance()
    pool2 = DatabaseConnectionPoolSingleton()

    assert pool1 is pool2
    assert pool1.engine is pool2.engine

    session = pool1.get_session()
    assert session is not None
    session.close()


# ===========================================================================
# 2. FACTORY PATTERN TESTS
# ===========================================================================

def test_cmo_factory_commercial():
    """Verify Commercial Decree Factory produces Commercial Courts Act 2015 schedule."""
    factory = CommercialDecreeFactory()
    decree = factory.create_decree(
        case_id="case-comm-01",
        case_number="COM/2026/001",
        title="Tata Consultancy Services vs Tech Vendor",
        judge_name="Hon'ble Justice Verma"
    )

    data = decree.export_decree()
    assert data["category"] == "Commercial Contract Dispute"
    assert "Commercial Courts Act, 2015" in data["governing_statute"]
    assert data["witness_caps"]["plaintiff"] == 2
    assert data["witness_caps"]["defendant"] == 2
    assert len(data["discovery_deadlines"]) == 4
    assert len(data["framed_issues"]) >= 3


def test_cmo_factory_cheque_bounce():
    """Verify Cheque Bounce Factory produces fast-track Section 138 NI Act deadlines."""
    factory = ChequeBounceDecreeFactory()
    decree = factory.create_decree(
        case_id="case-ni-01",
        case_number="SCC/138/2026/004",
        title="HDFC Bank vs Rohit Agro Ltd",
        judge_name="Hon'ble Magistrate Sharma"
    )

    data = decree.export_decree()
    assert data["category"] == "Cheque Bounce (Sec 138 NI Act)"
    assert "Negotiable Instruments Act, 1881" in data["governing_statute"]
    assert data["witness_caps"]["plaintiff"] == 1
    assert data["witness_caps"]["defendant"] == 1
    # Check 7-day bank memo deadline
    first_deadline = data["discovery_deadlines"][0]
    assert first_deadline["statutory_days"] == 7
    assert "Bank Memo" in first_deadline["task"]


def test_cmo_factory_arbitration_zero_witness():
    """Verify Arbitration Award Challenge sets 0 oral witnesses (record review only)."""
    factory = ArbitrationDecreeFactory()
    decree = factory.create_decree(
        case_id="case-arb-01",
        case_number="ARB/34/2026/09",
        title="L&T vs Metro Rail Corp",
        judge_name="Hon'ble Presiding Arbitral Judge"
    )

    data = decree.export_decree()
    assert data["witness_caps"]["plaintiff"] == 0
    assert data["witness_caps"]["defendant"] == 0
    assert any("Arbitral Record" in d["task"] for d in data["discovery_deadlines"])


def test_decree_factory_provider_dynamic_resolution():
    """Verify central provider dynamically maps string categories to specialized factories."""
    assert isinstance(DecreeFactoryProvider.get_factory("Commercial Contract"), CommercialDecreeFactory)
    assert isinstance(DecreeFactoryProvider.get_factory("Cheque Bounce Sec 138"), ChequeBounceDecreeFactory)
    assert isinstance(DecreeFactoryProvider.get_factory("Summary Suit Order 37"), SummarySuitDecreeFactory)
    assert isinstance(DecreeFactoryProvider.get_factory("Arbitration Enforcement"), ArbitrationDecreeFactory)
    assert isinstance(DecreeFactoryProvider.get_factory("Unknown Civil Dispute"), GeneralCivilDecreeFactory)

    bundle = DecreeFactoryProvider.create_decree_for_case(
        case_category="Summary Suit",
        case_id="cid-99",
        case_number="SS/2026/11",
        title="Debt Recovery Suit",
        judge_name="Justice Gupta"
    )
    assert bundle["category"] == "Summary Suit (Order XXXVII CPC)"
    assert bundle["status"] == "ISSUED_ORDER_XV_A"


# ===========================================================================
# 3. STRATEGY PATTERN TESTS
# ===========================================================================

@pytest.fixture
def test_schedule_data(db_session: Session):
    """Seeds test advocate, court room, case and scheduled session."""
    import uuid
    uid = uuid.uuid4().hex[:6]
    adv1 = User(
        email=f"adv.verma.{uid}@highcourt.gov.in",
        password_hash="pw",
        full_name="Advocate R. K. Verma",
        role=RoleType.ADVOCATE,
        bar_council_id=f"MP/{uid}/2010"
    )
    adv2 = User(
        email=f"adv.shukla.{uid}@highcourt.gov.in",
        password_hash="pw",
        full_name="Advocate P. Shukla",
        role=RoleType.ADVOCATE,
        bar_council_id=f"MP/{uid}/2015"
    )
    judge = User(
        email=f"judge.{uid}@mpcourt.gov.in",
        password_hash="pw",
        full_name="Hon'ble Trial Judge",
        role=RoleType.JUDGE
    )
    db_session.add_all([adv1, adv2, judge])
    db_session.commit()

    case = Case(
        cnr_number=f"MPHC0100{uid.upper()}26",
        case_title="Sample Testing Dispute",
        case_type=CaseType.COMMERCIAL,
        claim_valuation=500000.0,
        judge_id=judge.id,
        plaintiff_counsel_id=adv1.id,
        defendant_counsel_id=adv2.id,
        status=CaseStatus.CMH_SCHEDULED
    )
    db_session.add(case)
    db_session.commit()

    # Create scheduled session: 11:00 AM to 12:00 PM in Court Hall 01
    hearing_d = date(2026, 11, 20)
    session = CMHSession(
        case_id=case.id,
        judge_id=judge.id,
        hearing_date=hearing_d,
        start_time=time(11, 0),
        end_time=time(12, 0),
        court_hall_id="Court Hall 01",
        status=SessionStatus.SCHEDULED
    )
    db_session.add(session)
    db_session.commit()

    return {
        "adv1_bar": adv1.bar_council_id,
        "adv2_bar": adv2.bar_council_id,
        "hearing_date": hearing_d,
        "court_hall": "Court Hall 01",
        "case_id": case.id
    }


def test_strict_bench_slotting_strategy(db_session: Session, test_schedule_data):
    """Verify strict strategy detects both courtroom hall collision and counsel collision."""
    d = test_schedule_data
    strategy = StrictBenchSlottingStrategy()

    # 1. Direct courtroom hall collision (11:30 - 12:30 in Court Hall 01)
    conflict, msg, bar, hall = strategy.check_conflict(
        db=db_session,
        advocate_bar_ids=["MP/OTHER/2020"],
        hearing_date=d["hearing_date"],
        start_time=time(11, 30),
        end_time=time(12, 30),
        court_hall_id="Court Hall 01"
    )
    assert conflict is True
    assert "Court Hall 'Court Hall 01' is already booked" in msg

    # 2. Advocate collision in a different court hall (Court Hall 02)
    conflict2, msg2, bar2, hall2 = strategy.check_conflict(
        db=db_session,
        advocate_bar_ids=[d["adv1_bar"]],
        hearing_date=d["hearing_date"],
        start_time=time(11, 15),
        end_time=time(11, 45),
        court_hall_id="Court Hall 02"
    )
    assert conflict2 is True
    assert bar2 == d["adv1_bar"]
    assert "Scheduling Collision" in msg2

    # 3. No collision (non-overlapping afternoon slot 14:00 - 15:00)
    conflict3, _, _, _ = strategy.check_conflict(
        db=db_session,
        advocate_bar_ids=[d["adv1_bar"]],
        hearing_date=d["hearing_date"],
        start_time=time(14, 0),
        end_time=time(15, 0),
        court_hall_id="Court Hall 01"
    )
    assert conflict3 is False


def test_flexible_buffer_slotting_strategy(db_session: Session, test_schedule_data):
    """Verify flexible buffer strategy flags transit violations within 15 minutes of adjacent session."""
    d = test_schedule_data
    buffer_strategy = FlexibleBufferSlottingStrategy(buffer_minutes=15)

    # Session is in Court Hall 01 from 11:00 to 12:00.
    # New slot proposed at 12:05 to 12:35 in Court Hall 03 (only 5 min gap, violates 15 min buffer)
    conflict, msg, bar, hall = buffer_strategy.check_conflict(
        db=db_session,
        advocate_bar_ids=[d["adv1_bar"]],
        hearing_date=d["hearing_date"],
        start_time=time(12, 5),
        end_time=time(12, 35),
        court_hall_id="Court Hall 03"
    )
    assert conflict is True
    assert "inter-hall transit buffer" in msg

    # Slot with sufficient 30-min gap (12:30 to 13:00) passes cleanly
    conflict_ok, _, _, _ = buffer_strategy.check_conflict(
        db=db_session,
        advocate_bar_ids=[d["adv1_bar"]],
        hearing_date=d["hearing_date"],
        start_time=time(12, 30),
        end_time=time(13, 0),
        court_hall_id="Court Hall 03"
    )
    assert conflict_ok is False


def test_virtual_hybrid_slotting_strategy(db_session: Session, test_schedule_data):
    """Verify virtual strategy waives physical courtroom collision, but preserves counsel clash."""
    d = test_schedule_data
    virtual_strategy = VirtualHybridSlottingStrategy()

    # Proposed slot at 11:15 - 11:45 in Court Hall 01 with unrelated counsel
    conflict_hall, _, _, _ = virtual_strategy.check_conflict(
        db=db_session,
        advocate_bar_ids=["MP/UNRELATED/2022"],
        hearing_date=d["hearing_date"],
        start_time=time(11, 15),
        end_time=time(11, 45),
        court_hall_id="Court Hall 01",
        is_virtual=True
    )
    # Court hall collision waived for virtual sessions
    assert conflict_hall is False

    # But if the same advocate is double booked, virtual strategy flags conflict
    conflict_counsel, msg, bar, _ = virtual_strategy.check_conflict(
        db=db_session,
        advocate_bar_ids=[d["adv1_bar"]],
        hearing_date=d["hearing_date"],
        start_time=time(11, 15),
        end_time=time(11, 45),
        court_hall_id="Court Hall 01",
        is_virtual=True
    )
    assert conflict_counsel is True
    assert "already appearing in another virtual or physical hearing" in msg


def test_clash_detection_context_runtime_swapping(db_session: Session, test_schedule_data):
    """Verify GoF Strategy Context hot-swapping changes scheduling behavior at runtime."""
    d = test_schedule_data

    # Context initialized with Strict
    context = ClashDetectionContext(StrictBenchSlottingStrategy())
    assert isinstance(context.strategy, StrictBenchSlottingStrategy)

    # In Strict mode, same court hall at 11:15 is a conflict
    c1, _, _, _ = context.execute_conflict_check(
        db=db_session,
        advocate_bar_ids=["MP/DIFFERENT/1234"],
        hearing_date=d["hearing_date"],
        start_time=time(11, 15),
        end_time=time(11, 45),
        court_hall_id="Court Hall 01"
    )
    assert c1 is True

    # Hot-swap to Virtual Hybrid Strategy at runtime
    context.set_strategy(VirtualHybridSlottingStrategy())
    assert isinstance(context.strategy, VirtualHybridSlottingStrategy)

    # In Virtual mode, same courtroom hall is now allowed
    c2, _, _, _ = context.execute_conflict_check(
        db=db_session,
        advocate_bar_ids=["MP/DIFFERENT/1234"],
        hearing_date=d["hearing_date"],
        start_time=time(11, 15),
        end_time=time(11, 45),
        court_hall_id="Court Hall 01",
        is_virtual=True
    )
    assert c2 is False


def test_strategy_recommend_slot(db_session: Session, test_schedule_data):
    """Verify strategy automatically finds the next open slot during court working hours."""
    d = test_schedule_data
    context = ClashDetectionContext(StrictBenchSlottingStrategy())

    recommendation = context.recommend_slot(
        db=db_session,
        advocate_bar_ids=[d["adv1_bar"]],
        hearing_date=d["hearing_date"],
        duration_minutes=30,
        court_hall_id="Court Hall 01"
    )

    assert recommendation is not None
    assert recommendation["hearing_date"] == d["hearing_date"].isoformat()
    assert recommendation["court_hall_id"] == "Court Hall 01"
    # Court starts at 10:30, so 10:30-11:00 should be the first free slot before 11:00 session
    assert recommendation["recommended_start"] == "10:30:00"
    assert recommendation["recommended_end"] == "11:00:00"


# ===========================================================================
# 4. API ENDPOINT INTEGRATION TESTS
# ===========================================================================

def test_api_get_scheduling_strategies(client):
    """Verify GET /api/v1/schedule/strategies returns available GoF strategies."""
    resp = client.get("/api/v1/schedule/strategies")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 3
    ids = [s["id"] for s in data]
    assert "strict" in ids
    assert "buffered" in ids
    assert "virtual" in ids


def test_api_recommend_slot(client, test_schedule_data):
    """Verify POST /api/v1/schedule/recommend-slot computes alternative conflict-free window."""
    d = test_schedule_data
    payload = {
        "hearing_date": d["hearing_date"].isoformat(),
        "court_hall_id": "Court Hall 01",
        "duration_minutes": 30,
        "strategy": "strict",
        "advocate_bar_ids": [d["adv1_bar"]]
    }
    resp = client.post("/api/v1/schedule/recommend-slot", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["court_hall_id"] == "Court Hall 01"
    assert "recommended_start" in data
    assert "recommended_end" in data


def test_api_generate_cmo_order(client, test_schedule_data):
    """Verify POST /api/v1/cases/{case_id}/generate-cmo builds category-specific decree via Factory & Vault."""
    d = test_schedule_data

    # Log in as Judge using seeded judge credentials
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "judge.sharma@svvv-courts.gov.in",
        "password": "Judge@2026"
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Generate Order XV-A Rule 2 Case Management Order
    cmo_resp = client.post(f"/api/v1/cases/{d['case_id']}/generate-cmo", headers=headers)
    assert cmo_resp.status_code == 200
    cmo_data = cmo_resp.json()

    assert "decree_id" in cmo_data
    assert cmo_data["status"] == "ISSUED_ORDER_XV_A"
    assert "sha256_digest" in cmo_data
    assert len(cmo_data["sha256_digest"]) == 64
    assert "discovery_deadlines" in cmo_data
    assert len(cmo_data["discovery_deadlines"]) > 0
    assert "witness_caps" in cmo_data


def test_api_patterns_catalog_endpoint(client):
    """Verify GET /api/v1/patterns/catalog returns formal GoF catalog."""
    resp = client.get("/api/v1/patterns/catalog")
    assert resp.status_code == 200
    data = resp.json()
    assert data["academic_framework"] == "SVVV B.Tech CSE Semester-VII (BTCS706N)"
    assert len(data["patterns_implemented"]) == 3


def test_api_singleton_vault_status_endpoint(client):
    """Verify GET /api/v1/patterns/singleton/vault-status confirms identical memory pointers."""
    resp = client.get("/api/v1/patterns/singleton/vault-status")
    assert resp.status_code == 200
    data = resp.json()
    assert data["single_instance_verified"] is True
    assert data["status"] == "HEALTHY_SINGLETON_INVARIANCE_CONFIRMED"


def test_api_factory_cmo_preview_endpoint(client):
    """Verify POST /api/v1/patterns/factory/cmo-preview instantiates decrees dynamically."""
    payload = {
        "case_type": "ARBITRATION_PETITION",
        "case_number": "ARB_PET_99_2026",
        "case_title": "Narmada Infra v. State of MP",
        "judge_name": "Hon'ble Justice Alok Verma"
    }
    resp = client.post("/api/v1/patterns/factory/cmo-preview", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["factory_used"] == "ArbitrationDecreeFactory"
    assert data["product_instantiated"] == "ArbitrationEnforcementDecree"
    assert data["witness_caps"]["plaintiff_maximum"] == 0


def test_api_strategy_simulate_clash_endpoint(client):
    """Verify POST /api/v1/patterns/strategy/simulate-clash executes chosen strategy."""
    payload = {
        "strategy_type": "strict",
        "advocate_bar_id": "MP/14297/2026",
        "hearing_date": date.today().isoformat(),
        "start_time": "14:00:00",
        "end_time": "14:30:00",
        "court_hall_id": "HALL_04",
        "is_virtual": False
    }
    resp = client.post("/api/v1/patterns/strategy/simulate-clash", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["active_strategy_name"] == "Strict Bench Slotting Strategy"
    assert "collision_result" in data
