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
        json={"email": "adv.mukul@barcouncil.org", "password": "Advocate@2026"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "ROLE_ADVOCATE"

def test_file_case_and_admissions(client):
    # Login advocate
    auth_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "adv.mukul@barcouncil.org", "password": "Advocate@2026"}
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
