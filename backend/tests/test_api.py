def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "Operational"

def test_login_judge(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "judge.sharma@svvv-courts.gov.in", "password": "Judge@2026"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "ROLE_JUDGE"

def test_login_advocate(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "adv.himanshu@barcouncil.org", "password": "Advocate@2026"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "ROLE_ADVOCATE"

def test_file_case_and_admissions(client):
    # Login advocate
    auth_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "adv.himanshu@barcouncil.org", "password": "Advocate@2026"}
    )
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # File case
    case_resp = client.post(
        "/api/v1/cases/",
        headers=headers,
        json={
            "case_title": "Apex Infotech Ltd. vs. Horizon Logistics Pvt. Ltd.",
            "case_type": "COMMERCIAL_DISPUTE",
            "claim_valuation": 4500000.00,
            "court_hall_id": "HALL_04",
            "defendant_counsel_email": "adv.verma@barcouncil.org"
        }
    )
    assert case_resp.status_code == 201
    case_data = case_resp.json()
    assert "cnr_number" in case_data
    case_id = case_data["id"]

    # Fetch admissions matrix
    matrix_resp = client.get(f"/api/v1/admissions/{case_id}", headers=headers)
    assert matrix_resp.status_code == 200
    matrix_data = matrix_resp.json()
    assert len(matrix_data["items"]) == 3

    # Mark admission on item 1
    item_id = matrix_data["items"][0]["id"]
    put_resp = client.put(
        f"/api/v1/admissions/items/{item_id}",
        headers=headers,
        json={"item_id": item_id, "stance": "ADMIT_CONTENTS"}
    )
    assert put_resp.status_code == 200
    updated_item = put_resp.json()
    assert updated_item["plaintiff_stance"] == "ADMIT_CONTENTS"

def test_daily_cause_list(client):
    response = client.get("/api/v1/schedule/cause-list")
    assert response.status_code == 200
    data = response.json()
    assert "total_items" in data
    assert "items" in data

def test_echallan_lifecycle(client):
    # 1. Calculate court fee
    calc_resp = client.get("/api/v1/echallan/calculate-fee?claim_valuation=4500000")
    assert calc_resp.status_code == 200
    fee_data = calc_resp.json()
    assert "total_payable_fee" in fee_data
    assert fee_data["total_payable_fee"] > 0

    # 2. Generate e-Challan
    gen_resp = client.post(
        "/api/v1/echallan/generate",
        json={
            "payer_name": "Adv. Himanshu Bawaniya",
            "payer_email": "adv.himanshu@barcouncil.org",
            "payer_role": "ADVOCATE",
            "amount": fee_data["total_payable_fee"],
            "head_of_account": "0030-02-103-01: Commercial Court Ad-Valorem Fee",
            "bench_id": "BENCH_INDORE_COMM_01",
            "court_hall_id": "HALL_04"
        }
    )
    assert gen_resp.status_code == 201
    challan = gen_resp.json()
    assert challan["status"] == "PENDING"
    assert challan["challan_number"].startswith("MP-CH-2026-")
    challan_id = challan["id"]

    # 3. Pay e-Challan
    pay_resp = client.post(
        f"/api/v1/echallan/{challan_id}/pay",
        json={"payment_mode": "SBI_EPAY", "bank_name": "State Bank of India"}
    )
    assert pay_resp.status_code == 200
    paid_challan = pay_resp.json()
    assert paid_challan["status"] == "PAID"
    assert paid_challan["receipt_sha256"] is not None
    assert len(paid_challan["receipt_sha256"]) == 64

    # 4. Verify e-Challan via SHA-256 receipt hash
    verify_resp = client.get(f"/api/v1/echallan/verify/{paid_challan['receipt_sha256']}")
    assert verify_resp.status_code == 200
    verified = verify_resp.json()
    assert verified["challan_number"] == challan["challan_number"]

def test_notifications_dispatch(client):
    # 1. Trigger notification dispatch
    resp = client.post("/api/v1/notifications/dispatch-hearing-alerts")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "SUCCESS"
    assert data["dispatched_count"] >= 0

    # 2. Get notifications
    get_resp = client.get("/api/v1/notifications/")
    assert get_resp.status_code == 200
    notifs = get_resp.json()
    assert isinstance(notifs, list)

    # 3. Check summary
    sum_resp = client.get("/api/v1/notifications/summary")
    assert sum_resp.status_code == 200
    summary = sum_resp.json()
    assert "unread_count" in summary
    assert "channel_breakdown" in summary

