# Sequence Diagram: Pre-Trial Case Management Hearing (Order XV-A CPC)

**Academic Framework:** Major Project (BTCS706N) - Semester VII  
**Institution:** Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore  
**Department:** Computer Science and Engineering  
**Team ID:** SVVV-CSE-2026-MP-14  
**Project Guide:** Prof. Shweta Pandey  

---

## 🖼️ Print-Ready Diagram Image

> [!TIP]
> **High-Resolution Vector SVG**: [Download Sequence_Diagram.svg](file:///Users/mukulbhamgare/Desktop/case-management-eportal/diagrams/Sequence_Diagram.svg)  
> **Print-Ready PNG Image**: [Download Sequence_Diagram.png](file:///Users/mukulbhamgare/Desktop/case-management-eportal/diagrams/Sequence_Diagram.png)  
> **Full Printable UML Book (HTML)**: [Open Printable_UML_Book.html](file:///Users/mukulbhamgare/Desktop/case-management-eportal/diagrams/Printable_UML_Book.html)

<div align="center">
  <img src="Sequence_Diagram.png" alt="Sequence Diagram - Pre-Trial Case Management Hearing" width="85%" style="border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" />
</div>

---

## 1. Visual Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Adv as Advocate (Plaintiff/Def.)
    actor Clerk as Registry Clerk
    actor Judge as Hon'ble Presiding Judge
    participant UI as Frontend UI (React 19 SPA)
    participant API as FastAPI Gateway & Auth Guard
    participant Matrix as Admissions Matrix Engine (Order XI R4)
    participant Sched as Clash Detection & Scheduler Engine
    participant Treas as Cyber Treasury MP e-Challan API
    participant CMO as Automated CMO Generation Engine
    participant DB as Relational DB (SQLAlchemy)
    participant Audit as Audit Trail & Vault (SHA-256)

    %% Phase 1
    rect rgb(240, 248, 255)
    note over Adv, DB: Phase 1: Authentication & Pre-Trial Admission Filing
    Adv->>UI: Login with Bar Council Credentials
    UI->>API: POST /api/v1/auth/login
    API->>DB: Verify Credentials & RBAC Roles
    DB-->>API: User Data (Advocate MP/4821)
    API-->>UI: 200 OK + JWT Bearer Token
    Adv->>UI: Navigate to Active Case & Open Admissions Matrix
    UI->>API: GET /api/v1/cases/{case_id}/matrix
    API->>DB: Query Statements of Plaint & Written Statement
    DB-->>API: 10 Assertion Items & Evidentiary Exhibits
    API-->>UI: 200 OK (Admissions Matrix DTO)
    Adv->>UI: Mark Status (ADMITTED / DENIED / REQUIRES_PROOF)
    UI->>API: POST /api/v1/cases/{case_id}/admissions
    API->>Matrix: Compute Admitted vs Triable Ratios
    Matrix->>DB: Persist Admission Records & SHA-256 Hashes
    Matrix->>Audit: Record Immutable Event (ADMISSIONS_FILED)
    Audit->>DB: Insert AuditLog Row
    API-->>UI: 200 OK (Matrix Updated: 6 Admitted, 4 Triable Issues)
    end

    %% Phase 2
    rect rgb(254, 249, 231)
    note over Adv, Treas: Phase 2: Cyber Treasury MP Fee Verification
    Adv->>UI: Enter e-Challan Reference Number (CRN)
    UI->>API: POST /api/v1/echallan/verify
    API->>Treas: Validate CRN with MP Cyber Treasury Gateway
    Treas-->>API: 200 OK (Status: PAID, Bank: SBI Cyber Treasury, ₹12,500)
    API->>DB: Update Case Fee Status (Verified = True)
    API-->>UI: 200 OK (e-Challan Verified & SHA-256 Sealed)
    end

    %% Phase 3
    rect rgb(232, 248, 245)
    note over Judge, Sched: Phase 3: Clash-Free CMH Hearing Scheduling
    Judge->>UI: Initiate First CMH Scheduling (Order XV-A Rule 1 CPC)
    UI->>API: POST /api/v1/hearings/schedule-cmh
    API->>Sched: Run Conflict-Detection Algorithm
    Sched->>DB: Query Advocate Courtroom Clashes across Benches
    DB-->>Sched: Slot Available (Court Hall 4, 11:30 AM IST)
    Sched-->>API: Conflict-Free Hearing Slot Confirmed
    API->>DB: Insert Hearing Record & WebRTC Room Credentials
    API-->>UI: 200 OK (CMH Scheduled: 2026-11-12 11:30 AM)
    end

    %% Phase 4
    rect rgb(253, 237, 236)
    note over Judge, CMO: Phase 4: Virtual CMH & Automated Case Management Order (CMO)
    Judge->>UI: Convene Virtual Hearing Session (WebRTC Split-Screen)
    UI->>API: Real-time Signaling & Media Exchange
    Judge->>UI: Review Narrowed Issues & Order Trial Timetable
    UI->>CMO: Generate Draft CMO (Order XV-A Rule 2 CPC)
    CMO->>Matrix: Pull Formulated Admitted Facts & Narrowed Issues
    Matrix-->>CMO: 4 Disputed Triable Issues for Examination
    CMO-->>UI: Draft CMO Timetable (Inspection, Interrogatories, Witnesses)
    Judge->>UI: Digitally Sign & Seal CMO (Judicial DSC)
    UI->>API: POST /api/v1/cmo/issue
    API->>CMO: Compile Official PDF/A Case Management Order
    CMO->>Audit: Compute Document SHA-256 Cryptographic Stamp
    Audit->>DB: Store Sealed CMO with Hash & Timestamp
    API-->>UI: 201 Created (CMO Sealed & Active)
    end

    %% Phase 5
    rect rgb(245, 245, 245)
    note over API, Clerk: Phase 5: Multi-Party Notification & Discovery Countdown
    API->>UI: Broadcast WebSocket Event (CMO_ISSUED)
    API->>Audit: Log Audit Event (FIRST_CMH_CONCLUDED)
    UI-->>Adv: Real-Time Notification & Downloadable Sealed CMO
    UI-->>Clerk: Cause List & Registry Docket Updated
    end
```

---

## 2. Interaction Overview & Statutory CPC Compliance

This Sequence Diagram captures the dynamic lifecycle interaction of the **Commercial Court Case Management e-Portal** pursuant to the statutory provisions of **Order XV-A and Order XI of the Code of Civil Procedure (CPC), 1908**, as amended by the **Commercial Courts Act, 2015**:

1. **Phase 1: Pre-Trial Admission & Denial (Order XI Rule 4 CPC)**
   - Advocates access the automated Admissions & Denials Matrix to record responses to opposing assertions before the first Case Management Hearing.
   - The system prevents frivolous denials by requiring documentary proof references, and cryptographically signs each entry.

2. **Phase 2: Commercial Court Fee Verification (MP Cyber Treasury)**
   - Integrates with the Madhya Pradesh Cyber Treasury system via secure REST APIs to verify e-Challan payments in real-time, preventing registry delays.

3. **Phase 3: Clash-Free Hearing Scheduling (Order XV-A Rule 1 CPC)**
   - The scheduling engine checks cross-bench calendars (Jabalpur, Indore, Gwalior) to eliminate advocate scheduling conflicts before locking hearing slots.

4. **Phase 4: Virtual Hearing & Automated CMO Issuance (Order XV-A Rule 2 CPC)**
   - The Presiding Judge reviews admitted facts versus triable issues during the WebRTC virtual hearing.
   - The Automated CMO Engine instantly generates the legally binding Case Management Order setting strict discovery and witness examination deadlines.

5. **Phase 5: Discovery Countdown & Tamper-Proof Audit Trail**
   - Active discovery countdown daemons track compliance with the statutory 15-day document inspection limit.
   - All state transitions are logged with SHA-256 cryptographic hashes for full judicial auditability.
