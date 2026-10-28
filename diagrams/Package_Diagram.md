# Package Diagram: Modular Architecture of Case Management e-Portal

**Academic Framework:** Major Project (BTCS706N) - Semester VII  
**Institution:** Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore  
**Department:** Computer Science and Engineering  
**Team ID:** SVVV-CSE-2026-MP-14  
**Project Guide:** Prof. Shweta Pandey  

---

## 1. Visual Mermaid Package Diagram

```mermaid
graph TB
    %% ==========================================
    %% 1. BACKEND PACKAGES
    %% ==========================================
    subgraph Pkg_Backend ["backend: FastAPI REST & ASGI Micro-Architecture"]
        subgraph Core ["backend.core"]
            C_Config["config.py (Settings & Environment)"]
            C_DB["database.py (SQLAlchemy 2.0 Engine & Sessions)"]
            C_Sec["security.py (Bcrypt Hashing & JWT Bearer)"]
            C_Hash["hasher.py (SHA-256 Document Integrity)"]
        end

        subgraph Models ["backend.models (Domain ORM Entities)"]
            M_Case["case.py (Case, CommercialCategory, Stage)"]
            M_User["user.py (User, RoleEnum, AdvocateProfile)"]
            M_Admin["admission.py (AdmissionItem, AdmissionStatus)"]
            M_CMO["cmo.py (CaseManagementOrder, DiscoveryTimetable)"]
            M_Pay["echallan.py (EChallanPayment, FeeHead)"]
            M_Hear["hearing.py (CourtHearing, CauseListEntry)"]
            M_Audit["audit.py (AuditLog, CryptographicHashLedger)"]
        end

        subgraph Schemas ["backend.schemas (Pydantic DTO Validation)"]
            S_Case["case_schema.py (Create, Update, Response)"]
            S_Admin["admission_schema.py (Submit, BulkUpdate)"]
            S_CMO["cmo_schema.py (IssueRequest, TimetableDTO)"]
            S_Pay["echallan_schema.py (VerificationRequest)"]
            S_Auth["auth_schema.py (Token, UserLogin)"]
        end

        subgraph Services ["backend.services (Judicial Business Logic)"]
            Serv_Clash["clash_service.py (Cross-Bench Clash Detection)"]
            Serv_Frame["issue_service.py (Automated Issue Narrowing)"]
            Serv_Treas["treasury_service.py (Cyber Treasury Gateway)"]
            Serv_PDF["pdf_service.py (ReportLab PDF/A Decree Builder)"]
            Serv_Dead["deadline_service.py (Statutory Countdown Daemon)"]
        end

        subgraph Routers ["backend.api.v1 (REST Controllers)"]
            R_Auth["auth.py (/api/v1/auth)"]
            R_Case["cases.py (/api/v1/cases)"]
            R_Admin["admissions.py (/api/v1/cases/{id}/admissions)"]
            R_CMO["cmo.py (/api/v1/cmo)"]
            R_Cal["calendar.py (/api/v1/calendar)"]
            R_Pay["echallan.py (/api/v1/echallan)"]
            R_WS["virtual_court.py (/ws/courtroom)"]
        end

        subgraph Tests ["backend.tests (PyTest Suites)"]
            T_Suite["test_cases.py, test_admissions.py, test_cmo.py, test_echallan.py"]
        end
    end

    %% ==========================================
    %% 2. FRONTEND PACKAGES
    %% ==========================================
    subgraph Pkg_Frontend ["frontend.src: React 19 Client Architecture"]
        subgraph Components ["frontend.components"]
            Comp_Dash["JudicialDashboard.jsx"]
            Comp_Bar["AdvocatePortal.jsx"]
            Comp_Matrix["AdmissionsMatrixView.jsx"]
            Comp_Cal["CauseListCalendar.jsx"]
            Comp_RTC["WebRTCVirtualCourtroom.jsx"]
            Comp_Pay["EChallanVerifier.jsx"]
            Comp_CMO["SealedCMODownloader.jsx"]
        end

        subgraph Client_Services ["frontend.services"]
            CS_API["apiClient.js (Axios / Fetch with Bearer Interceptor)"]
            CS_WS["websocketManager.js (Live Sync)"]
            CS_RTC["webrtcController.js (Audio/Video Streams)"]
        end

        subgraph Context ["frontend.context"]
            Ctx_Auth["AuthContext.jsx"]
            Ctx_Lang["LanguageContext.jsx"]
        end

        subgraph i18n ["frontend.i18n"]
            Lexicon["translations.js (Bilingual Hindi-English Legal Lexicon)"]
        end
    end

    %% Internal Dependencies
    Routers -->|validates request DTOs| Schemas
    Routers -->|executes business rules| Services
    Routers -->|auth guards & sessions| Core
    Services -->|queries & updates| Models
    Models -->|declarative base| Core
    Tests -->|exercises endpoints| Routers

    Components -->|calls network APIs| Client_Services
    Components -->|consumes global state| Context
    Components -->|renders dual language| i18n

    %% Tier boundary
    Client_Services -.->|HTTP/1.1 REST & WSS TLS 1.3| Routers
```

---

## 2. Package Separation & Architectural Principles

### 1. High Cohesion & Loose Coupling
- The system strictly adheres to the **Layered Architecture pattern** and **Dependency Inversion Principle (DIP)**:
  - Route controllers (`backend.api.v1`) contain zero database queries; they delegate validation to `backend.schemas` and business logic to `backend.services`.
  - Database access is isolated within `backend.models` via SQLAlchemy 2.0 ORM mappers.

### 2. Statutory Legal Separation of Concerns
- The `AdmissionsMatrixModel` is kept cleanly segregated from the `CaseManagementOrderModel`.
- While admissions (Order XI Rule 4 CPC) are collaboratively contributed by opposing advocates, the Case Management Order (Order XV-A Rule 2 CPC) can only be generated and sealed through the judicial role authorization guard (`JudgeAuthGuard`).

### 3. Asynchronous Daemon Decoupling
- The `deadline_service.py` runs as an asynchronous background worker independent of the HTTP request-response cycle, continuously tracking statutory discovery expiry dates and firing WebSocket and email events when compliance windows near termination.

### 4. Client-Side Component Modularity
- The React 19 frontend organizes components by judicial user journeys:
  - `JudicialDashboard`: Dedicated to judicial officer docket control, admissions review, and digital signing.
  - `AdvocatePortal`: Focused on admission/denial uploads, exhibit referencing, and e-Challan fee tracking.
  - `WebRTCVirtualCourtroom`: Encapsulates WebRTC media stream handling and split-screen video display.
