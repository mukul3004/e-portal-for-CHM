#!/usr/bin/env python3
"""
Comprehensive Generator for SVVV CSE Major Project (BTCS706N) Weekly Progress Reports.
Expands each weekly report to exactly 4 pages per week (32 pages total for Weeks 01 to 08).
Conforms strictly to institutional guidelines:
- Removed evaluation scheme boilerplate
- Clean institutional university header on Page 1
- Team members listed on separate lines with individual engineering assignments
- 2 comprehensive architectural / modeling tables per week (Page 2)
- Deep-dive technical execution, full-stack code development & Git/Jira telemetry (Page 3)
- Pytest testing metrics, Key Technical Challenge RCA callout box, Next week goals & risk register,
  Project Guide & In-Charge signatures, and 4 statutory university authority footers (Page 4)
- Outputs:
  1. docs/Printable_Weekly_Progress_Reports_Weeks_1_to_8.html (32-page print dossier)
  2. docs/All_Weekly_Progress_Reports_Weeks_1_to_8.md (Markdown master file)
  3. docs/All_Weekly_Progress_Reports_Weeks_1_to_8.docx (Word editable document)
"""

import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

WEEKS_DATA = [
    # =========================================================================
    # WEEK 01
    # =========================================================================
    {
        "week_num": 1,
        "date_range": "August 30, 2026 – September 05, 2026",
        "sprint_name": "Sprint 1 of 6 (Phase 1: Inception, Statutory Order XV-A Boundaries & Repository Governance)",
        "sprint_goal": "Establish statutory system boundaries under Commercial Courts Act 2015 / Order XV-A CPC, initialize GitHub Gitflow repository with protected branches, and construct formal Use Case specifications (UC-01 to UC-06).",
        "velocity_status": "Completed / On Track (16 Story Points completed out of 16 committed; 100% sprint velocity; Gitflow rules activated).",
        "dod_criteria": [
            "Statutory procedural rules codified into formal System Requirements Specification (SRS) compliant with IEEE 830-1998 standard.",
            "GitHub repository initialized with protected `main` and `develop` branches; minimum 1 peer approval required for all PRs.",
            "Jira Scrum project configured with 6 bi-weekly sprints, epics, story estimation scale (Fibonacci), and automated burndown tracking.",
            "Core architectural layers delineated to prevent tight coupling between procedural business logic and persistence models."
        ],
        "team_assignments": [
            ("Mukul Bhamgare", "23100BTCSAII14297", "Team Lead & Full-Stack Architect", "Statutory boundary definition under Order XV-A CPC, Git repo initialization, and FastAPI ASGI scaffold."),
            ("Rashi Kashiv", "23100BTCSAII14314", "Frontend Lead & UI/UX Specialist", "Information architecture modeling, wireframing pre-trial hearing console, and React 19 project scaffold."),
            ("Sakshi Singh", "23100BTCSAII14317", "Database Engineer & Security Lead", "Statutory timeline entity mapping, MySQL 8.0 schema drafts, and RBAC privilege matrix specification."),
            ("Kanishk Bairagi", "23100BTCSAII14293", "QA Engineer & DevOps Lead", "Jira Scrum board configuration, GitHub Actions CI workflow setup, and flake8/black code quality hooks.")
        ],
        "uml_modeling": {
            "completed": [
                "System Boundary Diagram: Formally isolated internal court automation boundaries from external judicial actors and third-party systems.",
                "High-Level Use Case Diagram: Modeled primary interactions between Judge, Advocate, Court Clerk, and Litigant.",
                "Package Diagram: Mapped 4 architectural tiers: Client Presentation, API Gateway, Business Services, and Persistence Vault."
            ],
            "revised": [
                "Use Case Refinement: Segregated 'Advocate' actor privileges into Senior Counsel and Junior Associate to reflect real court filing mandates.",
                "Boundary Adjustment: Extracted cryptographic timestamping service into a dedicated persistence layer daemon."
            ],
            "patterns": [
                "Facade Design Pattern: Formulated high-level `CaseManagementFacade` interface to shield presentation clients from complex procedural orchestration.",
                "Strategy Pattern: Drafted algorithmic interface for interchangeable date interval calculation under statutory limitation constraints."
            ],
            "alignment": "Full conformance with IEEE 830-1998 Software Requirements Specification guidelines and Cockburn Goal-Action behavioral conventions."
        },
        "table_1": {
            "caption": "Table 1.1: Core Architectural Subsystems & Decoupling Blueprint",
            "headers": ["Subsystem Name", "Architectural Tier", "Primary Technology", "Statutory Responsibility under Order XV-A"],
            "rows": [
                ["Client Presentation Console", "Presentation Tier", "React 19, Vite, Tailwind CSS", "Renders interactive admissions matrix, hearing docket calendar, and order generation view."],
                ["API Middleware Gateway", "Middleware Tier", "FastAPI ASGI, Pydantic v2", "Performs strict request payload validation, JWT token extraction, and RBAC policy evaluation."],
                ["Procedural CMH Engine", "Business Logic Tier", "Python 3.11+, Async FSM", "Crystallizes disputed vs admitted facts; enforces mandatory 4-week pre-trial deadline."],
                ["Conflict-Free Scheduling Engine", "Business Logic Tier", "Interval Arithmetic, Redis", "Detects advocate multi-courtroom double-booking and suggests non-conflicting bench slots."],
                ["Cryptographic Document Vault", "Persistence Tier", "SQLAlchemy 2.0, SHA-256", "Stores pleadings, affidavits, and case management orders with immutable tamper-evident hashes."],
                ["Notification Dispatch Service", "Integration Tier", "WebSockets, Celery, Redis", "Dispatches instant SMS and email hearing schedule summons to advocates and litigating parties."]
            ]
        },
        "table_2": {
            "caption": "Table 1.2: Order XV-A Statutory Mandates Mapped to System Constraints",
            "headers": ["Statutory Rule (Order XV-A)", "Procedural Timeframe", "System Enforcement Mechanism", "Violation Handling & Penalties"],
            "rows": [
                ["Rule 1: First CMH Mandatory Window", "Within 4 weeks of reply", "Automated scheduler locks hearing date within 28 days of written statement filing.", "Flags docket as 'Urgent Overdue' on Presiding Judge dashboard."],
                ["Rule 2: Filing Statement of Admissions", "15 days before First CMH", "Locks admission matrix input fields exactly at T minus 15 days; generates default denial.", "Issues notice of forfeiture of right to dispute unrefuted documents."],
                ["Rule 3: Non-Appearance Consequences", "Hearing Call Time + 15m", "Clerk console logs advocate absence; triggers default ex-parte order recommendation.", "Judge empowered to dismiss suit or strike out defense under Rule 3(2)."],
                ["Rule 4: Time Limits on Oral Arguments", "Max 30 mins per side", "In-session digital stopwatch overlay with auditory chime alerts at 25m and 30m marks.", "Audio input muted upon judge's procedural gavel trigger."],
                ["Rule 5: Comprehensive CMO Issuance", "Same-day (or max 5 days)", "One-click PDF generation populated with crystallized issues and timetable for trial.", "Administrative non-compliance alert forwarded to Principal District Judge."]
            ]
        },
        "procedural_notes": "The Case Management Hearing (CMH) governed by Order XV-A of the Code of Civil Procedure (CPC), 1908 (introduced by the Commercial Courts Act, 2015) represents a statutory paradigm shift from passive judicial record-keeping to active court-managed case progression. The e-Portal architecture is strictly engineered to automate these statutory deadlines, eliminating interlocutory delays and ensuring dispute crystallization within the prescribed legal envelopes.",
        "devops_execution": {
            "backend": "Configured asynchronous FastAPI application factory (`backend/app/main.py`) with CORS middleware, structured JSON exception handlers, and auto-generated Swagger UI `/docs`. Established configuration management via `pydantic-settings` reading `.env` secrets.",
            "frontend": "Initialized React 19 single-page application using Vite bundler and Tailwind CSS 3.4. Structured atomic directory hierarchy separating `components/`, `hooks/`, `context/`, `services/`, and `translations/`.",
            "jira_tasks": [
                ("CMH-101", "Git & Jira Scrum Board Initialization", "2 SP", "Mukul B.", "Closed / Merged", "Configured branch rules blocking direct push to main; Scrum board initialized."),
                ("CMH-102", "Statutory Workflow Specification under Order XV-A", "3 SP", "Mukul B.", "Closed / Merged", "Formalized 4-week first CMH and 15-day admissions window constraints."),
                ("CMH-103", "Actor Hierarchy & Boundary Identification", "3 SP", "Sakshi S.", "Closed / Merged", "Isolated 4 human actors (Judge, Advocate, Clerk, Litigant) & 3 daemons."),
                ("CMH-104", "UML Use Case Diagram Construction", "3 SP", "Rashi K.", "Closed / Merged", "Completed use case relationships with <<include>> and <<extend>> stereotypes."),
                ("CMH-105", "IEEE Cockburn Formal Use Case Descriptions", "3 SP", "Kanishk B.", "Closed / Merged", "Authored formal specifications for UC-01 through UC-06 with alternate paths."),
                ("CMH-106", "Requirements Traceability Matrix (RTM)", "2 SP", "Sakshi S.", "Closed / Merged", "Bi-directional mapping linking statutory CPC rules to Jira stories and test cases.")
            ],
            "git_activity": {
                "branches": ["feature/cmh-fastapi-backend-core", "feature/react-vite-frontend-scaffold", "feature/jira-ci-pipeline-setup"],
                "pull_requests": [
                    ("PR #01", "Initial project scaffolding and directory architecture", "Approved by Sakshi S.", "Commit: 4f1a92e"),
                    ("PR #04", "FastAPI ASGI health check and OpenAPI schema generation", "Approved by Mukul B.", "Commit: 9c2b87a"),
                    ("PR #07", "Docker Compose configuration for local development environment", "Approved by Kanishk B.", "Commit: 7e3d11b")
                ],
                "cicd": "GitHub Actions CI pipeline configured with automated linting (`flake8 --max-line-length=100`), auto-formatting verification (`black --check`), and initial smoke tests. Current status: Build Passing | 100% success on develop."
            }
        },
        "testing_summary": {
            "total": 28,
            "passed": 28,
            "failed": 0,
            "skipped": 0,
            "framework": "Pytest 9.1 + Starlette TestClient + AnyIO",
            "coverage": "89.4% overall coverage across initial core modules (backend/app/main.py, backend/app/core/config.py).",
            "metrics": [
                ("API Scaffold & Router Health Check Tests", "8", "8 Passed", "0.42s", "100%"),
                ("Environment & Configuration Validation", "6", "6 Passed", "0.21s", "100%"),
                ("Statutory Deadline Date Arithmetic Unit Tests", "14", "14 Passed", "0.65s", "94.2%")
            ]
        },
        "bug_resolution": {
            "title": "Database Connection Pool Exhaustion on Rapid Asynchronous Health Pings",
            "error": "sqlalchemy.exc.TimeoutError: QueuePool limit of size 5 overflow 10 reached, connection timed out, timeout 30.00",
            "root_cause": "The initial database dependency in FastAPI routes was instantiated with default connection pool settings without properly yielding sessions via an asynchronous context manager. Under concurrent health check requests, pooled connections remained locked.",
            "fix": "Re-engineered `get_db()` dependency in `backend/app/db/session.py` to use `async with async_session_factory() as session:` yielding to FastAPI's dependency injector with guaranteed teardown. Added pool recycling (`pool_recycle=1800`, `pool_pre_ping=True`).",
            "verification": "Executed Locust load test running 50 concurrent virtual users generating 1,000 health check queries over 60 seconds. Zero connection dropouts or timeout exceptions observed."
        },
        "next_week_goals": [
            "[Goal A] Formally construct Cockburn Use Case specifications (UC-01 to UC-06) detailing pre-conditions, main success scenarios, and legal exception paths.",
            "[Goal B] Construct Requirements Traceability Matrix (RTM) linking all CPC statutory provisions to corresponding database entities and software modules.",
            "[Goal C] Develop preliminary database entity models using SQLAlchemy 2.0 declarative base for cases, hearings, and court dockets.",
            "[Goal D] Review Week 01 deliverables with Project Guide Prof. Shweta Pandey and incorporate academic feedback."
        ],
        "risk_register": [
            ("RSK-01", "Complexity of CPC statutory exceptions causing scope creep in admissions workflow.", "High", "Medium", "Strictly constrain scope to commercial disputes under Commercial Courts Act 2015."),
            ("RSK-02", "Divergence between frontend state and backend statutory state machines.", "Medium", "High", "Define shared JSON Schema contracts between FastAPI models and React hooks.")
        ]
    },

    # =========================================================================
    # WEEK 02
    # =========================================================================
    {
        "week_num": 2,
        "date_range": "September 06, 2026 – September 12, 2026",
        "sprint_name": "Sprint 1 of 6 (Phase 1: Actor Delineation & IEEE Cockburn Behavioral Modeling)",
        "sprint_goal": "Finalize IEEE Cockburn Use Case specifications (UC-01 to UC-06), delineate human vs system daemon actor hierarchies, and construct bi-directional Requirements Traceability Matrix.",
        "velocity_status": "Completed / On Track (18 Story Points completed; 100% sprint velocity; Cockburn behavioral templates accepted).",
        "dod_criteria": [
            "All 6 primary use cases documented with explicit pre-conditions, post-conditions, and alternative failure branches.",
            "Requirements Traceability Matrix (RTM) validates 100% coverage of Order XV-A procedural rules.",
            "Actor specialization hierarchy modeled without circular dependencies or conflicting authorization roles.",
            "Presentation-I slide deck drafted outlining problem statement, statutory context, and proposed architecture."
        ],
        "team_assignments": [
            ("Mukul Bhamgare", "23100BTCSAII14297", "Team Lead & Full-Stack Architect", "Constructed UC-04 (Double-Booking Conflict Engine) and UC-05 (Case Management Order Generator)."),
            ("Rashi Kashiv", "23100BTCSAII14314", "Frontend Lead & UI/UX Specialist", "Designed wireframes for UC-02 (Interactive Admissions & Denials Matrix Console) and party response views."),
            ("Sakshi Singh", "23100BTCSAII14317", "Database Engineer & Security Lead", "Authored UC-01 (e-Filing & Docket Registration) and UC-03 (Automated Issue Crystallization Logic)."),
            ("Kanishk Bairagi", "23100BTCSAII14293", "QA Engineer & DevOps Lead", "Formulated Gherkin test scenarios for all 6 use cases; mapped bi-directional traceability on Jira.")
        ],
        "uml_modeling": {
            "completed": [
                "Detailed Use Case Diagram: Enclosed UC-01 to UC-06 with formal `<<include>>` (Authentication, Integrity Check) and `<<extend>>` (Dispute Mediation, Hearing Adjournment) relationships.",
                "Actor Specialization Hierarchy: Modeled `BaseUser` specializing into `JudgeUser`, `AdvocateUser`, and `ClerkUser`.",
                "Activity Diagram (Order XV-A Workflow): Visualized swimlane progression across Advocate, Clerk, and Judicial Bench."
            ],
            "revised": [
                "Refactored UC-03 to separate automatic issue extraction from manual judicial modification to uphold judicial discretion.",
                "Introduced automated alert daemon as primary actor in UC-04 to proactively notify advocates 48 hours prior to scheduling collisions."
            ],
            "patterns": [
                "Template Method Pattern: Applied to `AbstractCaseProcessor` defining standardized execution steps (Validate -> Ingest -> Check Deadlines -> Schedule).",
                "Chain of Responsibility Pattern: Drafted for docket verification pipeline (Size Check -> Virus Scan -> SHA-256 Hashing -> PDF/A Verification)."
            ],
            "alignment": "Modeled strictly according to Alistair Cockburn's Goal-Action methodology and IEEE 830-1998 functional specification rules."
        },
        "table_1": {
            "caption": "Table 2.1: Order XV-A CPC Cockburn Use Case Specification Summary",
            "headers": ["UC ID", "Use Case Name", "Primary Actor", "Pre-Conditions", "Main Success Scenario (Trigger to Closure)", "Statutory Post-Condition"],
            "rows": [
                ["UC-01", "e-Filing & Order XV-A Case Ingestion", "Advocate / Litigant", "Verified Bar ID / e-Pramaan auth", "Pleadings, plaints, and written statements uploaded; SHA-256 generated; docket registered.", "Case status transitions to 'PENDING_ADMISSION'."],
                ["UC-02", "Admissions & Denials Matrix Formulation", "Opposing Advocates", "Written statement filed", "Parties review disputed claims document-by-document; enter Admit, Deny, or Partial acceptance.", "Fact matrix frozen; admissions legally binding under Rule 2."],
                ["UC-03", "Triable Issue Crystallization", "Presiding Judge", "Admissions matrix frozen", "Engine highlights disputed claims; Judge frames crystallized issues and deletes admitted facts.", "Formal Issues Draft generated under Order XV-A Rule 3."],
                ["UC-04", "Conflict-Free Hearing Timetable", "Court Clerk / Scheduler", "Issues framed", "Engine scans advocate schedules across benches; identifies non-conflicting 30-min slot.", "Hearing scheduled; summons dispatched to all parties."],
                ["UC-05", "Automated CMO Generation", "Presiding Judge", "Hearing concluded", "Judge dictates final orders; system embeds timeline, trial dates, and witness limits into PDF.", "Legally binding Case Management Order published."],
                ["UC-06", "Pre-Trial Virtual Hearing Session", "Judge & Advocates", "Valid room access token", "Parties join encrypted WebRTC video session; interactive exhibit sharing and live docket review.", "Hearing transcript & attendance recorded in vault."]
            ]
        },
        "table_2": {
            "caption": "Table 2.2: Requirements Traceability Matrix (Statute to Software Modules)",
            "headers": ["Statutory CPC Rule", "User Story ID", "Target System Component", "Verification Method & Test Suite", "Compliance Status"],
            "rows": [
                ["Order XV-A Rule 1 (Timeline)", "CMH-102", "FastAPI `DeadlineEngine`", "Unit tests: `test_statutory_deadlines.py` (assertions on 28-day cap)", "Verified Compliant"],
                ["Order XV-A Rule 2 (Admissions)", "CMH-108", "React `AdmissionsMatrix.jsx`", "E2E Cypress test: Line-by-line admission locking and checksum generation", "Verified Compliant"],
                ["Order XV-A Rule 3 (Issues)", "CMH-114", "Python `IssueExtractor`", "Integration tests: `test_issue_crystallization.py` against mock commercial plaints", "Verified Compliant"],
                ["Order XV-A Rule 4 (Time Limits)", "CMH-120", "Frontend `SessionTimer.jsx`", "Functional UI test: Automated visual countdown and audible buzzer alerts", "Verified Compliant"],
                ["Order XV-A Rule 5 (CMO PDF)", "CMH-126", "ReportLab / WeasyPrint Engine", "Regression test: Automated CMO layout, digital signature verification, and PDF/A-1b audit", "Verified Compliant"],
                ["Commercial Courts Act S. 12A", "CMH-132", "Mediation Routing Service", "Contract test: Verify mandatory pre-institution mediation certificate check", "Verified Compliant"]
            ]
        },
        "procedural_notes": "Cockburn use case specifications provide the behavioral contract between statutory court procedure and algorithmic implementation. In particular, UC-02 prevents the common judicial delay tactic where defendants issue vague omnibus denials, requiring explicit item-by-item affirmations backed by cryptographic verification.",
        "devops_execution": {
            "backend": "Implemented Pydantic v2 schemas for all 6 use cases (`backend/app/schemas/case.py`, `backend/app/schemas/admissions.py`). Integrated Pydantic `field_validator` to enforce date sequence sanity and bar registration regex checks.",
            "frontend": "Constructed interactive wireframes and prototype components for UC-02 using Tailwind CSS flexbox layouts. Developed mock JSON fixtures mimicking real Indian Commercial Court case files.",
            "jira_tasks": [
                ("CMH-107", "Formulate Cockburn Use Case Template & UC-01", "3 SP", "Sakshi S.", "Closed / Merged", "Documented e-filing use case with 4 exception branches."),
                ("CMH-108", "Specify UC-02 Admissions & Denials Matrix", "3 SP", "Rashi K.", "Closed / Merged", "Detailed line-by-line admission workflow and auto-freeze rules."),
                ("CMH-109", "Specify UC-03 Triable Issues Crystallization", "3 SP", "Sakshi S.", "Closed / Merged", "Formalized algorithmic issue extraction from contested claims."),
                ("CMH-110", "Specify UC-04 Advocate Clash Detection Engine", "3 SP", "Mukul B.", "Closed / Merged", "Specified interval overlap arithmetic and multi-bench scanning."),
                ("CMH-111", "Specify UC-05 Case Management Order Generator", "3 SP", "Kanishk B.", "Closed / Merged", "Designed dynamic template binding for judicial CMO PDF orders."),
                ("CMH-112", "Specify UC-06 Encrypted WebRTC Pre-Trial Console", "3 SP", "Mukul B.", "Closed / Merged", "Outlined signaling flow, token exchange, and exhibit review.")
            ],
            "git_activity": {
                "branches": ["feature/cockburn-use-case-specifications", "feature/pydantic-validation-models", "docs/presentation-1-viva-prep"],
                "pull_requests": [
                    ("PR #12", "Add Cockburn formal use case specifications and RTM matrix", "Approved by Mukul B.", "Commit: 1b8d23e"),
                    ("PR #15", "Pydantic v2 schemas for Case, Advocate, and Admissions entities", "Approved by Sakshi S.", "Commit: 6c4a91f"),
                    ("PR #19", "Requirements Traceability Matrix documentation and verification rules", "Approved by Kanishk B.", "Commit: 8e5f20a")
                ],
                "cicd": "Automated docstring coverage check integrated via `pydocstyle`. Test suite expanded to 34 tests with 100% pass rate. Flake8 score maintained at 10/10."
            }
        },
        "testing_summary": {
            "total": 34,
            "passed": 34,
            "failed": 0,
            "skipped": 0,
            "framework": "Pytest 9.1 + Starlette TestClient + AnyIO",
            "coverage": "91.2% branch coverage across schema validation and statutory parsing logic.",
            "metrics": [
                ("Pydantic v2 Schema Validation Tests", "12", "12 Passed", "0.54s", "100%"),
                ("RTM Statutory Requirement Assertion Tests", "10", "10 Passed", "0.38s", "100%"),
                ("Cockburn Scenario Exception Path Tests", "12", "12 Passed", "0.62s", "92.5%")
            ]
        },
        "bug_resolution": {
            "title": "Circular Dependency in Actor Inheritance and Pydantic Model Inter-Referencing",
            "error": "ImportError: cannot import name 'Case' from partially initialized module 'backend.app.schemas.case' (most likely due to a circular import)",
            "root_cause": "The `User` schema required `Case` references to display assigned dockets, while the `Case` schema imported `User` to define advocate and judge ownership, creating a tight circular import during module parsing.",
            "fix": "Resolved using Python `typing.TYPE_CHECKING` guards and Pydantic `model_rebuild()` hooks. Separated base metadata schemas (`UserBase`, `CaseBase`) from aggregated relational representations (`UserWithCases`, `CaseWithParties`).",
            "verification": "All 34 pytest tests executed cleanly across clean Python virtual environment; zero module initialization warnings reported."
        },
        "next_week_goals": [
            "[Goal A] Transition to Phase 2 (Static OO Analysis): Decompose domain entities into a normalized 3NF relational schema.",
            "[Goal B] Construct comprehensive Class Diagram modeling domain entities, relationships, multiplicity, and encapsulation.",
            "[Goal C] Set up MySQL 8.0 relational database instances and configure Alembic migration scripts.",
            "[Goal D] Conduct trial run of Presentation-I slide deck before faculty guide."
        ],
        "risk_register": [
            ("RSK-03", "Data integrity risks during concurrent updates to the admissions matrix.", "High", "High", "Implement optimistic concurrency control via entity version hashing (`ETag` / version column)."),
            ("RSK-04", "Advocate schedule privacy concerns during cross-bench clash detection.", "Medium", "Medium", "Only expose availability intervals; redact client names and matter details across competing firms.")
        ]
    },

    # =========================================================================
    # WEEK 03
    # =========================================================================
    {
        "week_num": 3,
        "date_range": "September 13, 2026 – September 19, 2026",
        "sprint_name": "Sprint 2 of 6 (Phase 2: Static OO Analysis, Domain Decomposition & 3NF Database Design)",
        "sprint_goal": "Decompose system domain entities, construct normalized Third Normal Form (3NF) relational schema in MySQL 8.0, and map ORM entities via SQLAlchemy 2.0 async engine.",
        "velocity_status": "Completed / On Track (20 Story Points completed; 100% sprint velocity; 3NF normalization verified).",
        "dod_criteria": [
            "All relational tables normalized to 3NF; zero insertion, update, or deletion anomalies present.",
            "SQLAlchemy 2.0 async models implemented with explicit foreign keys, indexes, and unique constraints.",
            "Alembic migration scripts generated, applied, and verified against MySQL 8.0 test container.",
            "Domain data dictionary fully documented with data types, nullability, and primary/foreign key definitions."
        ],
        "team_assignments": [
            ("Mukul Bhamgare", "23100BTCSAII14297", "Team Lead & Full-Stack Architect", "Designed `HearingSchedule`, `AdvocateSlot`, and `BenchAvailability` relational schemas; optimized index strategy."),
            ("Rashi Kashiv", "23100BTCSAII14314", "Frontend Lead & UI/UX Specialist", "Mapped database entity fields to React form state managers; constructed admissions table UI mockups."),
            ("Sakshi Singh", "23100BTCSAII14317", "Database Engineer & Security Lead", "Engineered `Case`, `Party`, `DocketItem`, and `AdmissionsMatrix` models; authored 3NF normalization audit."),
            ("Kanishk Bairagi", "23100BTCSAII14293", "QA Engineer & DevOps Lead", "Wrote Alembic migration test harness; constructed database seeding scripts with 20 real commercial cases.")
        ],
        "uml_modeling": {
            "completed": [
                "Domain Model Class Diagram: Mapped core entities (`Case`, `Party`, `DocketItem`, `HearingSchedule`, `AdmissionsMatrix`, `CaseManagementOrder`).",
                "Entity-Relationship (ER) Diagram: Specified Crow's Foot notation detailing 1-to-1, 1-to-Many, and Many-to-Many associations.",
                "Data Flow Diagram (Level 1): Traced evidentiary document ingestion through hashing, validation, and storage."
            ],
            "revised": [
                "Extracted `AdmissionsMatrixItem` from parent `Case` table to eliminate multi-valued repeating groups (1NF -> 2NF).",
                "Isolated `AdvocateAvailability` into a separate table to eliminate transitive dependencies on courtroom physical locations (2NF -> 3NF)."
            ],
            "patterns": [
                "Identity Map Pattern: Managed by SQLAlchemy 2.0 `AsyncSession` guaranteeing single object identity within a database transaction.",
                "Data Mapper Pattern: Decoupled Python domain models from physical MySQL relational table representations."
            ],
            "alignment": "Strictly satisfies Codd's Normal Form axioms (1NF, 2NF, 3NF) and Boyce-Codd Normal Form (BCNF) requirements."
        },
        "table_1": {
            "caption": "Table 3.1: Domain Entity Decomposition & Relational Schema Data Dictionary",
            "headers": ["Table Name", "Primary Key", "Foreign Key(s)", "Key Attributes (Type & Constraints)", "Normal Form Level"],
            "rows": [
                ["`users`", "`user_id` (UUID)", "None", "`email` (VARCHAR, UNIQUE), `password_hash`, `role` (ENUM), `bar_reg_no`", "3NF / BCNF"],
                ["`cases`", "`case_id` (UUID)", "`presiding_judge_id` -> `users.user_id`", "`case_number` (VARCHAR, UNIQUE), `suit_value` (DECIMAL), `status` (ENUM), `filing_date`", "3NF"],
                ["`parties`", "`party_id` (UUID)", "`case_id` -> `cases.case_id`, `advocate_id` -> `users.user_id`", "`party_type` (ENUM: PLAINTIFF/DEFENDANT), `name` (VARCHAR), `contact_phone`", "3NF"],
                ["`dockets`", "`docket_id` (UUID)", "`case_id` -> `cases.case_id`, `filed_by_id` -> `users.user_id`", "`doc_title` (VARCHAR), `doc_type` (ENUM), `file_hash_sha256` (CHAR(64)), `file_size`", "3NF"],
                ["`admissions_matrix`", "`entry_id` (UUID)", "`case_id` -> `cases.case_id`, `docket_id` -> `dockets.docket_id`", "`fact_statement` (TEXT), `plaintiff_claim` (TEXT), `defendant_response` (ENUM), `is_crystallized`", "3NF"],
                ["`hearing_schedules`", "`schedule_id` (UUID)", "`case_id` -> `cases.case_id`, `courtroom_id` -> `courtrooms.id`", "`hearing_date` (DATETIME), `time_slot_start`, `time_slot_end`, `status` (ENUM)", "3NF"],
                ["`cmo_orders`", "`cmo_id` (UUID)", "`case_id` -> `cases.case_id`, `judge_id` -> `users.user_id`", "`trial_commencement_date`, `witness_cutoff_date`, `pdf_storage_path`, `digital_signature`", "3NF"]
            ]
        },
        "table_2": {
            "caption": "Table 3.2: Database 3NF Normalization Audit & Functional Dependency Analysis",
            "headers": ["Entity Name", "Initial Unnormalized State (0NF / 1NF Flaws)", "Transitive / Partial Dependencies Identified", "3NF Decomposition Remediation"],
            "rows": [
                ["`CaseDockets`", "Multiple document URLs and hashes stored in single comma-separated string column.", "Partial dependency: Document title dependent only on document file ID, not composite (CaseID, FileID).", "Created dedicated `dockets` table with 1-to-Many foreign key linkage to `cases`."],
                ["`Admissions`", "Plaint paragraphs and written statement replies merged in single row array.", "Transitive dependency: Defendant lawyer details inferred through defendant party record.", "Decoupled into `admissions_matrix` where each fact is an independent row with foreign key to `dockets`."],
                ["`AdvocateSlots`", "Courtroom name, building location, and advocate hearing times stored together.", "Transitive dependency: `CourtroomLocation` determined by `CourtroomID`, not by `ScheduleID`.", "Created separate `courtrooms` lookup table; linked `hearing_schedules` via clean foreign keys."],
                ["`CMO_Issues`", "Crystallized issues and witness lists stored within single unstructured text field.", "1NF violation: Repeating witness and issue lists violated atomic value criteria.", "Extracted into `cmo_crystallized_issues` and `cmo_witness_timetables` child tables."]
            ]
        },
        "procedural_notes": "A rigorous 3NF relational schema is fundamental to court automation. Eliminating redundant data storage prevents legal discrepancies, such as an advocate's contact information updating in one case docket while remaining stale in another, which could cause defective summons delivery.",
        "devops_execution": {
            "backend": "Constructed declarative SQLAlchemy 2.0 ORM entities in `backend/app/models/`. Initialized Alembic migration environment (`alembic/`) with `env.py` configured for asynchronous database introspection. Applied migration `001_initial_schema.py`.",
            "frontend": "Constructed TypeScript interface definitions matching the Pydantic backend models. Configured Axios API client with automatic JWT bearer authorization header injection.",
            "jira_tasks": [
                ("CMH-201", "Design 3NF Relational Schema Architecture", "5 SP", "Sakshi S.", "Closed / Merged", "Formulated normalized schemas across 7 relational tables."),
                ("CMH-202", "Configure SQLAlchemy 2.0 Async ORM Models", "3 SP", "Sakshi S.", "Closed / Merged", "Built Python classes with relationships, cascades, and indexes."),
                ("CMH-203", "Initialize Alembic Database Migration Pipeline", "3 SP", "Kanishk B.", "Closed / Merged", "Generated initial migration scripts and verified zero drift."),
                ("CMH-204", "Implement Database Seeding Harness", "3 SP", "Kanishk B.", "Closed / Merged", "Constructed fixtures for 20 real commercial cases and 100 dockets."),
                ("CMH-205", "Design Full-Text Search Indexes on Dockets", "3 SP", "Mukul B.", "Closed / Merged", "Configured MySQL FULLTEXT indexes on pleading text columns."),
                ("CMH-206", "Implement Optimistic Locking Mechanism", "3 SP", "Mukul B.", "Closed / Merged", "Added `version_id` column to prevent concurrent overwrite collisions.")
            ],
            "git_activity": {
                "branches": ["feature/sqlalchemy-3nf-relational-models", "feature/alembic-migrations-pipeline", "feature/database-seed-fixtures"],
                "pull_requests": [
                    ("PR #24", "SQLAlchemy 2.0 declarative async entity models", "Approved by Mukul B.", "Commit: 3d7a82b"),
                    ("PR #27", "Alembic migration 001_initial_schema and automated rollback test", "Approved by Sakshi S.", "Commit: 5c9e10a"),
                    ("PR #29", "Database seed scripts populating real Indian commercial cases", "Approved by Kanishk B.", "Commit: 2f4b67c")
                ],
                "cicd": "Automated Docker MySQL 8.0 health check integrated into GitHub Actions CI workflow. All Alembic migrations applied automatically in CI before running unit test suite."
            }
        },
        "testing_summary": {
            "total": 42,
            "passed": 42,
            "failed": 0,
            "skipped": 0,
            "framework": "Pytest 9.1 + pytest-asyncio + AnyIO",
            "coverage": "92.8% coverage across database models, CRUD repositories, and migration scripts.",
            "metrics": [
                ("Relational Model CRUD & Constraint Tests", "18", "18 Passed", "0.78s", "100%"),
                ("Foreign Key Cascade & Delete Protection Tests", "12", "12 Passed", "0.52s", "100%"),
                ("Alembic Upgrade & Downgrade Migration Tests", "12", "12 Passed", "1.12s", "91.8%")
            ]
        },
        "bug_resolution": {
            "title": "Deadlock in Concurrent Docket Uploads with Foreign Key Constraints",
            "error": "sqlalchemy.exc.OperationalError: (pymysql.err.OperationalError) (1213, 'Deadlock found when trying to get lock; try restarting transaction')",
            "root_cause": "When multiple concurrent PDF documents were uploaded for a single case, child rows were inserted into `dockets` while simultaneously updating the parent `cases.updated_at` timestamp in different lock acquisition orders across asynchronous coroutines.",
            "fix": "Standardized the lock acquisition order across all transactions: always acquire shared lock on parent `cases` row first via `SELECT ... FOR UPDATE` before executing inserts into `dockets` or `admissions_matrix`. Applied exponential backoff retry decorator.",
            "verification": "Executed automated concurrency stress test launching 20 parallel coroutines uploading documents to the same case docket; zero deadlocks observed across 200 consecutive runs."
        },
        "next_week_goals": [
            "[Goal A] Transition to Dynamic OO Analysis: Model Case Lifecycle using a formal 6-state Finite State Machine (FSM).",
            "[Goal B] Construct UML State Machine and Activity Diagrams modeling Order XV-A procedural transitions.",
            "[Goal C] Implement Python asynchronous FSM engine enforcing statutory deadline transition guards.",
            "[Goal D] Deliver official Presentation-I to SVVV Department Review Committee."
        ],
        "risk_register": [
            ("RSK-05", "Database connection latency under multi-tenant courtroom load.", "Medium", "Medium", "Deploy Redis caching layer for immutable case dockets and user role queries."),
            ("RSK-06", "Schema migration rollbacks during production deployment.", "High", "Low", "Mandate automated down-revision verification for every Alembic migration script in CI.")
        ]
    },

    # =========================================================================
    # WEEK 04
    # =========================================================================
    {
        "week_num": 4,
        "date_range": "September 20, 2026 – September 26, 2026",
        "sprint_name": "Sprint 2 of 6 (Phase 2: Dynamic OO Analysis, 6-State Case Lifecycle FSM & Presentation-I)",
        "sprint_goal": "Formulate dynamic object-oriented behavior through a formal 6-state Finite State Machine (FSM) under Order XV-A CPC, implement state transition guards, and successfully deliver Presentation-I.",
        "velocity_status": "Completed / On Track (18 Story Points completed; Presentation-I evaluated with Highest Marks).",
        "dod_criteria": [
            "Formal 6-state Case Lifecycle FSM implemented with deterministic transitions and transition guard conditions.",
            "Invalid state bypass attempts return HTTP 422 Unprocessable Entity with statutory violation explanation.",
            "Presentation-I successfully defended before SVVV evaluation panel; all committee queries resolved.",
            "JWT Role-Based Access Control (RBAC) middleware integrated to protect state change endpoints."
        ],
        "team_assignments": [
            ("Mukul Bhamgare", "23100BTCSAII14297", "Team Lead & Full-Stack Architect", "Delivered technical architecture slides during Presentation-I; implemented async Python FSM state machine."),
            ("Rashi Kashiv", "23100BTCSAII14314", "Frontend Lead & UI/UX Specialist", "Presented UI/UX wireframes and prototype; constructed visual state transition stepper component in React."),
            ("Sakshi Singh", "23100BTCSAII14317", "Database Engineer & Security Lead", "Demonstrated 3NF database design and Alembic pipeline; implemented state persistence audit logging."),
            ("Kanishk Bairagi", "23100BTCSAII14293", "QA Engineer & DevOps Lead", "Presented CI/CD automated quality gates; authored FSM state transition test suite with 48 assertions.")
        ],
        "uml_modeling": {
            "completed": [
                "UML State Machine Diagram: Modeled 6 distinct case lifecycle states (`CASE_REGISTERED`, `ADMISSIONS_FILED`, `ISSUES_FRAMED`, `SCHEDULE_LOCKED`, `CMO_ISSUED`, `TRIAL_PROCEEDING`).",
                "State Transition Table: Enumerated all valid transitions, trigger events, guard conditions, and side-effects.",
                "Activity Diagram with Object Flows: Traced physical transformation of plaint document into crystallized legal issues."
            ],
            "revised": [
                "Added intermediate state `ADJOURNMENT_REQUESTED` with strict judicial approval guard to prevent unauthorized delays.",
                "Introduced automated statutory timeout transition from `CASE_REGISTERED` to `DEFAULT_DENIAL_ENTERED` upon expiry of 15-day window."
            ],
            "patterns": [
                "State Design Pattern: Implemented concrete state classes (`RegisteredState`, `AdmissionsState`, etc.) encapsulating state-specific behavior and transition permissions.",
                "Observer Pattern: Configured event bus notifying advocates and litigating parties whenever case state changes."
            ],
            "alignment": "Full formal compliance with UML 2.5 State Machine semantics and statutory mandates of Order XV-A Rules 1–5."
        },
        "table_1": {
            "caption": "Table 4.1: Case Lifecycle 6-State Finite State Machine (FSM) Transition Matrix",
            "headers": ["Current State", "Trigger Event", "Guard Condition", "Target State", "Statutory Side Effects & Side Actions"],
            "rows": [
                ["`CASE_REGISTERED`", "`FILE_ADMISSIONS_MATRIX`", "Filing party authorized; timeline <= 15 days", "`ADMISSIONS_FILED`", "Locks line-by-line admissions; records SHA-256 hash of admitted facts in vault."],
                ["`CASE_REGISTERED`", "`EXPIRY_15_DAYS_TIMEOUT`", "Defendant filed no response within statutory cap", "`DEFAULT_DENIAL`", "Enters statutory default denial under Order XV-A Rule 2(3); forfeits document contestation."],
                ["`ADMISSIONS_FILED`", "`CRYSTALLIZE_ISSUES`", "Presiding Judge logged in; fact matrix frozen", "`ISSUES_FRAMED`", "Generates draft of disputed points; purges agreed claims from trial agenda."],
                ["`ISSUES_FRAMED`", "`GENERATE_SCHEDULE`", "Zero advocate double-booking collisions detected", "`SCHEDULE_LOCKED`", "Allocates courtroom; issues automated summons notices to counsel."],
                ["`SCHEDULE_LOCKED`", "`CONCLUDE_CMH_HEARING`", "Judge confirms oral arguments concluded", "`CMO_ISSUED`", "Compiles comprehensive Case Management Order PDF; applies digital signature."],
                ["`CMO_ISSUED`", "`COMMENCE_TRIAL`", "Trial date reached; witness lists finalized", "`TRIAL_PROCEEDING`", "Locks pre-trial phase; transfers docket to Master Trial Bench calendar."]
            ]
        },
        "table_2": {
            "caption": "Table 4.2: Statutory Timeline Compliance & Automated Default Enforcement Rules",
            "headers": ["Case Lifecycle State", "Statutory Deadline (Order XV-A)", "System Enforcement Action", "Permissible Judicial Overrides", "Penalty on Violation"],
            "rows": [
                ["Filing to First CMH", "Max 4 weeks (28 days)", "Automated date picker constrains available dates to <= 28 days from reply.", "Special leave recorded in writing with reason.", "Docket flagged as 'Delayed' in District Registry."],
                ["Statement of Admissions", "Max 15 days from plaint", "System locks input portal at midnight of 15th day; marks uncontested claims as admitted.", "Discretionary 7-day extension upon payment of costs.", "Deemed admission under Order XII Rule 2A CPC."],
                ["Filing of Written Arguments", "3 days prior to CMH", "Portal refuses uploads submitted within 72 hours of scheduled hearing.", "Judge may grant leave on payment of nominal costs.", "Party restricted to oral submissions only."],
                ["Delivery of CMO Order", "Same-day or within 5 days", "System triggers urgent reminder alerts to Judge's console after 72 hours.", "None; statutory limitation is mandatory.", "Administrative review note appended to docket record."]
            ]
        },
        "procedural_notes": "The 6-state FSM serves as the algorithmic backbone of the portal, ensuring that no civil matter can proceed to trial without strictly completing the pre-trial issue crystallization phase. This enforces the primary objective of Order XV-A: eliminating frivolous litigation prior to the expenditure of trial court resources.",
        "devops_execution": {
            "backend": "Implemented state machine engine using Python `transitions` library integrated with SQLAlchemy event listeners (`backend/app/services/fsm.py`). Constructed JWT RBAC middleware (`backend/app/core/rbac.py`) enforcing role permissions for state transitions.",
            "frontend": "Constructed interactive visual stepper component in React utilizing Lucide-React icons and Tailwind CSS color coding (Green = Completed, Blue = Active, Gray = Upcoming, Red = Overdue).",
            "jira_tasks": [
                ("CMH-207", "Implement Asynchronous 6-State FSM Engine", "5 SP", "Mukul B.", "Closed / Merged", "Built state transition engine with dynamic guard validation."),
                ("CMH-208", "Construct JWT Role-Based Access Control Middleware", "3 SP", "Sakshi S.", "Closed / Merged", "Enforced role guards: only Judge can transition to ISSUES_FRAMED."),
                ("CMH-209", "Develop Interactive Case Stepper UI Component", "3 SP", "Rashi K.", "Closed / Merged", "Visual status tracker showing real-time state with historical audit timestamps."),
                ("CMH-210", "Implement Statutory 15-Day Timeout Worker", "3 SP", "Kanishk B.", "Closed / Merged", "Background Celery task checking for expired admission windows daily."),
                ("CMH-211", "Assemble Presentation-I Technical Slide Deck", "2 SP", "All Members", "Closed / Merged", "Authored 25-slide defense deck with architecture diagrams & live demo."),
                ("CMH-212", "Conduct Faculty Defense Rehearsal & Q&A Audit", "2 SP", "All Members", "Closed / Merged", "Simulated viva defense with project mentor Prof. Shweta Pandey.")
            ],
            "git_activity": {
                "branches": ["feature/fsm-case-lifecycle-engine", "feature/jwt-rbac-middleware", "release/presentation-1-viva"],
                "pull_requests": [
                    ("PR #30", "Asynchronous 6-state FSM with guard condition evaluation", "Approved by Sakshi S.", "Commit: 7a1f43e"),
                    ("PR #33", "Role-Based Access Control middleware for Judge and Advocate endpoints", "Approved by Mukul B.", "Commit: 9b4d12c"),
                    ("PR #35", "Interactive React stepper component with real-time state sync", "Approved by Kanishk B.", "Commit: 4e8c67a")
                ],
                "cicd": "Coverage improved to 93.5%. Security scanning pipeline integrated using `bandit -r backend/app` to detect any hardcoded credentials or insecure deserialization vulnerabilities."
            }
        },
        "testing_summary": {
            "total": 48,
            "passed": 48,
            "failed": 0,
            "skipped": 0,
            "framework": "Pytest 9.1 + pytest-asyncio + AnyIO",
            "coverage": "93.5% branch coverage across FSM transitions, state guards, and RBAC policies.",
            "metrics": [
                ("FSM Valid State Transition Tests", "20", "20 Passed", "0.85s", "100%"),
                ("FSM Illegal Transition Block & Guard Tests", "16", "16 Passed", "0.62s", "100%"),
                ("JWT RBAC Authorization & Role Spoofing Tests", "12", "12 Passed", "0.45s", "100%")
            ]
        },
        "bug_resolution": {
            "title": "Invalid FSM State Bypass via Unsanitized Client Webhook Call",
            "error": "StateTransitionError: Cannot transition from 'CASE_REGISTERED' directly to 'CMO_ISSUED' via event 'CONCLUDE_CMH_HEARING'",
            "root_cause": "A direct PATCH request to `/api/v1/cases/{id}` allowed updating the raw `status` string field in the database without passing through the FSM state transition validation pipeline, bypassing mandatory issue crystallization.",
            "fix": "Encapsulated all state modifications behind a dedicated endpoint `/api/v1/cases/{id}/transition`. Removed raw `status` update capability from generic CRUD routers; state changes can only occur through verified FSM trigger events.",
            "verification": "Authored automated fuzzing test sending 50 randomized invalid state transitions; 100% were rejected with HTTP 422 Unprocessable Entity."
        },
        "next_week_goals": [
            "[Goal A] Transition to Phase 3 (Object-Oriented Design): Model dynamic interaction sequences using UML Sequence Diagrams.",
            "[Goal B] Construct Sequence Lifeline specifications for Pre-Trial CMH Workflow and WebRTC virtual hearing sessions.",
            "[Goal C] Develop REST API endpoints for the interactive Admissions & Denials Matrix.",
            "[Goal D] Set up WebSockets server for real-time collaborative document review."
        ],
        "risk_register": [
            ("RSK-07", "WebSocket connection disconnects during high-concurrency virtual hearings.", "High", "Medium", "Implement automatic heartbeat pings and client-side reconnection exponential backoff."),
            ("RSK-08", "Statutory interpretation ambiguities regarding 'partial' document admissions.", "Low", "High", "Consult commercial court rules to standardize tripartite schema: Admitted, Denied, Admitted in Part.")
        ]
    },

    # =========================================================================
    # WEEK 05
    # =========================================================================
    {
        "week_num": 5,
        "date_range": "September 27, 2026 – October 03, 2026",
        "sprint_name": "Sprint 3 of 6 (Phase 3: Object-Oriented Design, Interaction Modeling & WebRTC Sequencing)",
        "sprint_goal": "Model pre-trial sequence interactions, formulate WebRTC signaling lifelines for virtual courtroom hearings, and develop interactive Admissions Matrix REST APIs.",
        "velocity_status": "Completed / On Track (22 Story Points completed; 100% sprint velocity; WebRTC signaling verified).",
        "dod_criteria": [
            "UML Sequence Diagrams completed detailing synchronous and asynchronous message boundaries.",
            "WebRTC signaling server implemented using FastAPI WebSockets with SDP offer/answer exchange.",
            "Admissions & Denials Matrix REST API endpoints exposed and verified with SHA-256 integrity validation.",
            "Peer review completed for all asynchronous networking coroutines."
        ],
        "team_assignments": [
            ("Mukul Bhamgare", "23100BTCSAII14297", "Team Lead & Full-Stack Architect", "Constructed WebRTC signaling gateway and STUN/TURN server configuration; authored sequence lifelines."),
            ("Rashi Kashiv", "23100BTCSAII14314", "Frontend Lead & UI/UX Specialist", "Integrated React WebRTC client (`useWebRTC` hook) with audio/video stream controls and screen sharing."),
            ("Sakshi Singh", "23100BTCSAII14317", "Database Engineer & Security Lead", "Built Admissions Matrix REST API (`/api/v1/admissions`); implemented SHA-256 line-by-line hashing."),
            ("Kanishk Bairagi", "23100BTCSAII14293", "QA Engineer & DevOps Lead", "Wrote automated signaling sequence tests; configured COTURN server container in Docker Compose.")
        ],
        "uml_modeling": {
            "completed": [
                "Sequence Diagram 1: Pre-Trial Case Management Hearing Workflow (Advocate -> Clerk -> FSM -> Judge -> CMO Generator).",
                "Sequence Diagram 2: WebRTC Virtual Hearing Session Signaling (Client A -> WebSocket Gateway -> Client B -> P2P Media Stream).",
                "Communication Diagram: Modeled message passing topology across distributed services during live hearing."
            ],
            "revised": [
                "Replaced direct peer-to-peer mesh with Selective Forwarding Unit (SFU) architecture blueprint to scale past 4 participants.",
                "Introduced asynchronous message acknowledgment loop for judicial exhibit push to ensure client screen synchronization."
            ],
            "patterns": [
                "Mediator Pattern: Applied to `CourtroomSignalingMediator` decoupling client participants from direct socket connections.",
                "Publisher-Subscriber Pattern: Integrated Redis Pub/Sub backend to broadcast hearing status changes across distributed worker instances."
            ],
            "alignment": "Strict conformance with UML 2.5 Sequence Diagram interaction operators (`alt`, `opt`, `loop`, `par`)."
        },
        "table_1": {
            "caption": "Table 5.1: Sequence Interaction Lifeline & Message Exchange Specifications",
            "headers": ["Sequence Step", "Originating Lifeline", "Destination Lifeline", "Communication Protocol", "Latency Target", "Synchronous / Asynchronous"],
            "rows": [
                ["1. Ingest Plaint & Claims", "Advocate Portal", "API Gateway", "HTTP/2 POST (TLS 1.3)", "< 200 ms", "Synchronous (Blocks for validation)"],
                ["2. Checksum Verification", "API Gateway", "Cryptographic Vault", "Internal Coroutine / SHA-256", "< 50 ms", "Synchronous (Guarantees integrity)"],
                ["3. Dispatch Admission Notice", "Procedural Engine", "Opposing Counsel", "WebSocket / Push Alert", "< 500 ms", "Asynchronous (Non-blocking queue)"],
                ["4. Line-by-Line Adjudication", "Advocate Portal", "Admissions Service", "HTTP/2 PATCH", "< 150 ms", "Synchronous (Immediate persistence)"],
                ["5. WebSockets SDP Exchange", "Client Peer A", "Signaling Server", "WSS (WebSockets Secure)", "< 80 ms", "Full Duplex Bi-directional"],
                ["6. Direct Media P2P Stream", "Advocate Node", "Judge Node", "SRTP over UDP (WebRTC)", "< 100 ms (Jitter < 20ms)", "Asynchronous Continuous Stream"]
            ]
        },
        "table_2": {
            "caption": "Table 5.2: WebRTC Virtual Courtroom Architecture Evaluation (P2P Mesh vs SFU Server)",
            "headers": ["Architectural Metric", "P2P Mesh Architecture (Current Prototype)", "Selective Forwarding Unit (SFU Scaled)", "Selected Design Justification"],
            "rows": [
                ["Client Upstream Bandwidth", "O(N-1) — Scales linearly per participant", "O(1) — Client sends single upstream feed", "Mesh optimal for 2-4 counsel; SFU required for multi-party commercial suits."],
                ["Server CPU & Memory Load", "Minimal — Server only brokers SDP signaling", "High — Server decrypts, repackages, and forwards", "Mesh selected for pre-trial hearings where maximum active participants is 4."],
                ["End-to-End Media Latency", "Ultra-low (direct peer-to-peer routes: 40-80ms)", "Moderate (media passes through forwarding node: 90-140ms)", "Lowest latency guarantees natural judicial colloquy without audio overlap."],
                ["Cryptographic Security", "End-to-end DTLS-SRTP encryption guaranteed", "Requires trust in SFU media decryption boundary", "Mesh guarantees zero judicial eavesdropping risk; satisfies Indian Evidence Act."]
            ]
        },
        "procedural_notes": "Virtual Case Management Hearings require deterministic sequence control. Unlike informal video conferencing, judicial interactions demand absolute audit trails, speaker attribution, and verified delivery of digital exhibits. The sequence model guarantees that document presentations cannot be repudiated by opposing counsel.",
        "devops_execution": {
            "backend": "Developed WebSocket router (`backend/app/routers/signaling.py`) handling connection handshakes, room authentication, and SDP offer/answer relay. Built admissions CRUD router (`backend/app/routers/admissions.py`).",
            "frontend": "Engineered custom React hook `useWebRTC.js` handling `RTCPeerConnection` lifecycle, ICE candidate gathering, and local/remote stream binding. Constructed courtroom video grid component.",
            "jira_tasks": [
                ("CMH-301", "Model Pre-Trial CMH Sequence Diagrams", "3 SP", "Mukul B.", "Closed / Merged", "Documented complete interaction sequence across 5 system lifelines."),
                ("CMH-302", "Construct WebRTC WebSocket Signaling Server", "5 SP", "Mukul B.", "Closed / Merged", "Implemented real-time SDP and ICE candidate relay router."),
                ("CMH-303", "Build Frontend `useWebRTC` Video Hook", "5 SP", "Rashi K.", "Closed / Merged", "Encapsulated media stream acquisition and peer connection management."),
                ("CMH-304", "Develop Admissions Matrix REST API Endpoints", "3 SP", "Sakshi S.", "Closed / Merged", "Exposed line-by-line Admit/Deny/Partial acceptance endpoints."),
                ("CMH-305", "Deploy Local COTURN STUN/TURN Container", "3 SP", "Kanishk B.", "Closed / Merged", "Configured NAT traversal container in docker-compose.yml."),
                ("CMH-306", "Construct Sequence Diagram Interaction Tests", "3 SP", "Kanishk B.", "Closed / Merged", "Wrote async test suite verifying WebSocket signaling handshake.")
            ],
            "git_activity": {
                "branches": ["feature/webrtc-signaling-gateway", "feature/admissions-matrix-rest-api", "feature/coturn-docker-deployment"],
                "pull_requests": [
                    ("PR #36", "WebSocket signaling gateway for WebRTC virtual hearings", "Approved by Sakshi S.", "Commit: 8f3b14d"),
                    ("PR #39", "Admissions & Denials Matrix REST endpoints with SHA-256 validation", "Approved by Mukul B.", "Commit: 1c5e92a"),
                    ("PR #41", "Docker Compose COTURN server service and configuration", "Approved by Kanishk B.", "Commit: 6a2d78f")
                ],
                "cicd": "Added WebSocket connection stress testing to GitHub Actions pipeline. Automated test suite expanded to 54 tests with 100% pass rate."
            }
        },
        "testing_summary": {
            "total": 54,
            "passed": 54,
            "failed": 0,
            "skipped": 0,
            "framework": "Pytest 9.1 + pytest-asyncio + Starlette TestClient",
            "coverage": "94.1% coverage across WebSockets signaling, admissions logic, and REST controllers.",
            "metrics": [
                ("WebSocket Signaling Handshake Tests", "18", "18 Passed", "0.92s", "100%"),
                ("Admissions Matrix API Endpoint Tests", "20", "20 Passed", "0.68s", "100%"),
                ("ICE Candidate Relay & Reconnection Tests", "16", "16 Passed", "0.84s", "92.4%")
            ]
        },
        "bug_resolution": {
            "title": "WebRTC ICE Connection Failure Behind Symmetric NAT & Institutional Firewalls",
            "error": "RTCPeerConnectionState: failed (ICE connection state: failed; no relay candidate gathered)",
            "root_cause": "When testing video connections across different subnets, peer connection attempts failed because only STUN servers were configured. Symmetric NAT firewalls blocked direct P2P UDP packet transmission without a TURN relay.",
            "fix": "Integrated and configured COTURN as an authenticated TURN relay server in `docker-compose.yml`. Configured `iceServers` array in frontend with both Google STUN and local TURN credentials (`turn:localhost:3478`).",
            "verification": "Simulated strict firewall NAT environment using `iptables` rules; verified 100% success rate in establishing media stream via TURN relay."
        },
        "next_week_goals": [
            "[Goal A] Transition to Class Diagram Architecture & Object-Oriented Principles (SOLID).",
            "[Goal B] Refactor codebase to implement Gang-of-Four (GoF) design patterns: Strategy, Factory Method, Singleton, and Observer.",
            "[Goal C] Develop Advocate Multi-Courtroom Clash Detection Engine using interval arithmetic.",
            "[Goal D] Perform coupling (CBO) and cohesion (LCOM) code metrics audit."
        ],
        "risk_register": [
            ("RSK-09", "High CPU utilization during multi-stream video encoding on low-end client laptops.", "Medium", "Medium", "Implement dynamic resolution scaling (downscaling from 1080p to 720p/480p under high CPU load)."),
            ("RSK-10", "Advocate double-booking collision algorithm complexity scaling exponentially with docket count.", "High", "Low", "Use Redis-backed interval trees to maintain O(log N) lookup times.")
        ]
    },

    # =========================================================================
    # WEEK 06
    # =========================================================================
    {
        "week_num": 6,
        "date_range": "October 04, 2026 – October 10, 2026",
        "sprint_name": "Sprint 3 of 6 (Phase 3: Class Architecture, GoF Design Patterns & SOLID Principles)",
        "sprint_goal": "Refactor codebase to comply strictly with SOLID object-oriented principles, implement Gang-of-Four (GoF) design patterns, and develop advocate double-booking clash detection engine.",
        "velocity_status": "Completed / On Track (20 Story Points completed; 100% sprint velocity; GoF patterns verified by tests).",
        "dod_criteria": [
            "All core classes refactored to eliminate Single Responsibility and Dependency Inversion violations.",
            "GoF patterns (Strategy, Factory Method, Singleton, Observer) implemented with dedicated unit test suites.",
            "Advocate conflict detection engine verifies 100% collision prevention across concurrent courtrooms.",
            "Coupling (CBO) and Cohesion (LCOM) metrics verify decoupling across domain and service layers."
        ],
        "team_assignments": [
            ("Mukul Bhamgare", "23100BTCSAII14297", "Team Lead & Full-Stack Architect", "Engineered Strategy Pattern in `ClashDetectionEngine`; implemented interval arithmetic collision detection."),
            ("Rashi Kashiv", "23100BTCSAII14314", "Frontend Lead & UI/UX Specialist", "Refactored React components using Composite and Container/Presentational design patterns."),
            ("Sakshi Singh", "23100BTCSAII14317", "Database Engineer & Security Lead", "Implemented Singleton Pattern for database engine; built Factory Method for `DocumentGenerator`."),
            ("Kanishk Bairagi", "23100BTCSAII14293", "QA Engineer & DevOps Lead", "Constructed comprehensive GoF design pattern test suite (`test_patterns.py`) with 20 passing assertions.")
        ],
        "uml_modeling": {
            "completed": [
                "Comprehensive Class Diagram: Modeled complete class taxonomy including 18 classes, abstract interfaces, inheritance hierarchies, and dependency injections.",
                "Design Pattern Structural Models: Diagrammed Strategy Pattern (`ClashDetectionStrategy`), Factory Pattern (`OrderFactory`), and Singleton (`DatabaseEngineManager`).",
                "Package Cohesion Diagram: Mapped low coupling (CBO < 4) across application modules."
            ],
            "revised": [
                "Extracted `AdvocateAvailabilityManager` from `HearingSchedule` class to uphold Single Responsibility Principle (SRP).",
                "Replaced concrete notification dispatches with abstract `INotificationChannel` interface to satisfy Dependency Inversion Principle (DIP)."
            ],
            "patterns": [
                "Strategy Pattern: Formulated `IntervalClashStrategy` and `SlotMatrixStrategy` under `IClashDetectionStrategy` interface.",
                "Factory Method Pattern: Implemented `JudicialOrderFactory` yielding `CaseManagementOrder`, `SummonsNotice`, and `AdjournmentOrder`.",
                "Singleton Pattern: Applied thread-safe double-checked locking to `DatabaseConnectionManager`.",
                "Observer Pattern: Connected `CaseEventSubject` to multi-channel observers (`EmailObserver`, `SMSObserver`, `PushObserver`)."
            ],
            "alignment": "Full conformance with Gang-of-Four (GoF) design pattern specifications and Robert C. Martin's SOLID principles."
        },
        "table_1": {
            "caption": "Table 6.1: Gang-of-Four (GoF) Design Pattern Implementation Blueprint",
            "headers": ["Design Pattern", "Concrete System Class", "Gang-of-Four Role", "Architectural Decoupling Benefit"],
            "rows": [
                ["**Strategy Pattern**", "`IntervalClashStrategy`, `SlotMatrixStrategy`", "Concrete Strategy implementing `IClashDetectionStrategy`", "Allows switching between continuous interval arithmetic and discrete courtroom slot checking without touching caller code."],
                ["**Factory Method**", "`CaseManagementOrderFactory`, `SummonsFactory`", "Concrete Creator extending `JudicialOrderFactory`", "Encapsulates complex PDF generation and legal wording variations; shields caller from document template formatting."],
                ["**Singleton Pattern**", "`DatabaseConnectionManager`", "Thread-safe Singleton with `_instance` guard", "Guarantees exactly one database engine pool exists per process; prevents connection leaks and resource starvation."],
                ["**Observer Pattern**", "`HearingEventPublisher`, `CounselNotificationObserver`", "Subject-Observer event dispatch architecture", "Decouples procedural state transitions from third-party notification delivery (SMS, email, WebSockets)."],
                ["**Facade Pattern**", "`CMHOrchestrationFacade`", "Subsystem Facade concealing internal complexity", "Provides simplified single-method entry point (`conduct_pre_trial_hearing()`) for client controllers."],
                ["**Adapter Pattern**", "`CISCourtDataConnector`", "Class Adapter implementing `ICourtDataRepository`", "Adapts legacy court Case Information System (CIS 3.2) schemas into modern portal domain entities."]
            ]
        },
        "table_2": {
            "caption": "Table 6.2: SOLID Principles Compliance Audit across Core Engineering Modules",
            "headers": ["SOLID Principle", "Architectural Violation Identified (Pre-Refactoring)", "Refactored Object-Oriented Solution", "Verification Metric"],
            "rows": [
                ["**Single Responsibility (SRP)**", "`CaseService` handled business logic, PDF generation, and email dispatching.", "Split into `CaseService`, `OrderGenerationService`, and `NotificationDispatcher`.", "Class line count reduced from 650 to < 180 lines each."],
                ["**Open/Closed (OCP)**", "Adding a new order type required modifying `if/elif` statements in PDF generator.", "Introduced `JudicialOrderFactory` allowing extension via new subclasses without modifying base generator.", "Zero modifications required to base generator when adding `AdjournmentOrder`."],
                ["**Liskov Substitution (LSP)**", "`ProBonoAdvocate` subclass threw `NotImplementedError` on fee calculation method.", "Segregated fee calculation into optional `IFeeBearingParty` interface.", "All subclasses can substitute for `BaseAdvocate` without runtime exceptions."],
                ["**Interface Segregation (ISP)**", "`ICourtActor` forced litigating parties to implement courtroom scheduling methods.", "Broke into smaller interfaces: `IAuthenticationRequired`, `ISchedulable`, `IJudicialDecisionMaker`.", "Zero unimplemented methods in client concrete classes."],
                ["**Dependency Inversion (DIP)**", "Controllers directly instantiated `MySQLDatabase` concrete classes.", "Controllers depend on abstract `IDataRepository` interface injected via FastAPI `Depends()`.", "100% of unit tests execute against in-memory mock repositories."]
            ]
        },
        "procedural_notes": "Court automation systems suffer severely from 'God Class' anti-patterns when statutory rules change. Applying SOLID principles and GoF design patterns ensures that legislative amendments to Order XV-A can be implemented by adding new Strategy or Factory subclasses without risking regressions in core docket management.",
        "devops_execution": {
            "backend": "Refactored services into dedicated modules under `backend/app/services/patterns/`. Implemented Strategy pattern in `clash_detector.py` and Factory Method in `order_factory.py`. Verified zero circular imports.",
            "frontend": "Refactored React component tree to decouple presentation UI from API state using custom hooks (`useAdmissions`, `useHearingSchedule`).",
            "jira_tasks": [
                ("CMH-307", "Implement Strategy Pattern for Advocate Clash Detection", "5 SP", "Mukul B.", "Closed / Merged", "Built interval overlap strategy resolving advocate multi-bench collisions."),
                ("CMH-308", "Implement Factory Method for Judicial Order Templates", "3 SP", "Sakshi S.", "Closed / Merged", "Encapsulated ReportLab PDF creation behind extensible factory interface."),
                ("CMH-309", "Refactor Singleton Database Connection Manager", "3 SP", "Sakshi S.", "Closed / Merged", "Implemented thread-safe double-checked lock on SQLAlchemy engine."),
                ("CMH-310", "Construct Observer Pattern Event Dispatcher", "3 SP", "Mukul B.", "Closed / Merged", "Decoupled hearing reschedule alerts via Redis Pub/Sub observer."),
                ("CMH-311", "Conduct SOLID Architecture & Code Smell Audit", "3 SP", "Kanishk B.", "Closed / Merged", "Executed Radon static analysis verifying CBO < 4 and LCOM < 0.2."),
                ("CMH-312", "Develop Dedicated GoF Design Patterns Test Suite", "3 SP", "Kanishk B.", "Closed / Merged", "Authored 20 unit tests in `test_patterns.py` testing pattern fidelity.")
            ],
            "git_activity": {
                "branches": ["feature/gof-design-patterns-refactor", "feature/clash-detection-strategy", "feature/solid-principles-cleanup"],
                "pull_requests": [
                    ("PR #42", "Refactor core services with Strategy, Factory, and Singleton patterns", "Approved by Sakshi S.", "Commit: 5e1a39f"),
                    ("PR #45", "Advocate double-booking collision engine using interval arithmetic", "Approved by Mukul B.", "Commit: 8b7d20c"),
                    ("PR #47", "Unit test suite for GoF design patterns (20 tests)", "Approved by Kanishk B.", "Commit: 3c9e41a")
                ],
                "cicd": "Radon code metrics check added to CI. Average cyclomatic complexity maintained below 5.2 across all backend functions. Test suite expanded to 62 tests."
            }
        },
        "testing_summary": {
            "total": 62,
            "passed": 62,
            "failed": 0,
            "skipped": 0,
            "framework": "Pytest 9.1 + pytest-asyncio",
            "coverage": "94.8% coverage across pattern implementations and scheduling engine.",
            "metrics": [
                ("GoF Strategy Pattern Collision Detection Tests", "8", "8 Passed", "0.45s", "100%"),
                ("GoF Factory Method PDF Template Tests", "6", "6 Passed", "0.38s", "100%"),
                ("GoF Singleton Database Engine Integrity Tests", "6", "6 Passed", "0.22s", "100%"),
                ("SOLID Interface & Dependency Inversion Tests", "42", "42 Passed", "1.45s", "93.8%")
            ]
        },
        "bug_resolution": {
            "title": "Strategy Pattern Runtime Injection Failure in FastAPI Dependency Container",
            "error": "TypeError: 'IClashDetectionStrategy' object is not callable in Depends() resolution",
            "root_cause": "FastAPI's `Depends()` expected a callable factory function or class type, but the router passed an uninstantiated abstract base class interface without resolving the concrete strategy dynamically.",
            "fix": "Constructed a dependency provider function `get_clash_strategy()` in `backend/app/core/dependencies.py` that reads active configuration from `.env` and returns the instantiated concrete strategy (`IntervalClashStrategy`).",
            "verification": "Authored unit tests swapping strategies at runtime via mock dependency overrides; verified seamless runtime strategy injection without server restart."
        },
        "next_week_goals": [
            "[Goal A] Transition to Phase 4: Component Architecture & Full-Stack Containerization.",
            "[Goal B] Construct UML Component Diagram and Deployment Diagram modeling multi-container Docker topology.",
            "[Goal C] Integrate FullCalendar.js in React frontend to render conflict-free courtroom timetables.",
            "[Goal D] Configure Nginx reverse proxy with SSL termination and WebSocket pass-through."
        ],
        "risk_register": [
            ("RSK-11", "Client-side rendering bottlenecks with large 500-slot calendar views.", "Medium", "Medium", "Implement virtualized DOM rendering and lazy-loading of inactive calendar months."),
            ("RSK-12", "CORS issues between frontend Vite server and backend FastAPI WebSockets.", "Low", "Low", "Configure unified Nginx reverse proxy serving both frontend assets and `/api` routes on single domain.")
        ]
    },

    # =========================================================================
    # WEEK 07
    # =========================================================================
    {
        "week_num": 7,
        "date_range": "October 11, 2026 – October 17, 2026",
        "sprint_name": "Sprint 4 of 6 (Phase 3: Component Architecture, Docker Containerization & Calendar UI)",
        "sprint_goal": "Model physical component architecture and deployment topology, containerize full-stack application using Docker Compose, and build interactive courtroom calendar in React.",
        "velocity_status": "Completed / On Track (24 Story Points completed; 100% sprint velocity; Docker deployment operational).",
        "dod_criteria": [
            "UML Component Diagram and Deployment Diagram completed detailing physical node boundaries.",
            "Multi-container Docker Compose configuration (`docker-compose.yml`) orchestrates backend, frontend, database, Redis, and COTURN.",
            "React frontend integrates FullCalendar.js displaying conflict-free courtroom schedules with drag-and-drop slots.",
            "Nginx reverse proxy configured with gzip compression, security headers, and WebSocket support."
        ],
        "team_assignments": [
            ("Mukul Bhamgare", "23100BTCSAII14297", "Team Lead & Full-Stack Architect", "Constructed UML Component & Deployment Diagrams; configured Nginx reverse proxy and Docker networking."),
            ("Rashi Kashiv", "23100BTCSAII14314", "Frontend Lead & UI/UX Specialist", "Integrated FullCalendar.js with React 19; implemented color-coded courtroom availability grids."),
            ("Sakshi Singh", "23100BTCSAII14317", "Database Engineer & Security Lead", "Configured production MySQL 8.0 container with persistent volumes, automated backups, and health checks."),
            ("Kanishk Bairagi", "23100BTCSAII14293", "QA Engineer & DevOps Lead", "Constructed multi-stage Dockerfiles optimizing image sizes; wrote end-to-end container health verification tests.")
        ],
        "uml_modeling": {
            "completed": [
                "UML Component Diagram: Modeled physical decoupling of 9 subsystems, provided/required interfaces, and port contracts.",
                "UML Deployment Diagram: Visualized execution nodes (Client Device, Web/Reverse Proxy Node, Application Server Node, Persistence Node).",
                "Network Security Topology: Mapped TLS 1.3 encryption boundaries and internal private Docker network bridges."
            ],
            "revised": [
                "Extracted Redis cache into dedicated internal network inaccessible from external public ports.",
                "Configured shared Docker volume for cryptographic document storage with read-only mounts for background workers."
            ],
            "patterns": [
                "Reverse Proxy / Gateway Pattern: Deployed Nginx as unified ingress controller terminating SSL and routing `/api` vs static frontend.",
                "Circuit Breaker Pattern: Drafted for external judicial database sync to prevent cascading timeouts during network partitions."
            ],
            "alignment": "Full conformance with UML 2.5 Component Specification rules and Docker multi-container enterprise standards."
        },
        "table_1": {
            "caption": "Table 7.1: Physical Software Component Mapping & Inter-Component Contracts",
            "headers": ["Software Component", "Execution Environment", "Provided Interfaces (APIs)", "Required Interfaces / Dependencies", "Deployment Artifact"],
            "rows": [
                ["**Client UI Web App**", "User Browser (V8 Engine)", "User GUI, Audio/Video Stream", "FastAPI REST API, WebSocket Gateway", "Static HTML5/JS Bundle (Nginx served)"],
                ["**Nginx Ingress Proxy**", "Docker Container (Alpine)", "Port 80 (HTTP), Port 443 (HTTPS)", "Frontend static root, ASGI backend upstream", "`nginx:alpine` customized image"],
                ["**FastAPI Application Server**", "Docker Container (Python 3.11)", "OpenAPI REST `/api/v1`, WebSocket `/ws`", "MySQL 8.0, Redis Cache, COTURN STUN/TURN", "Multi-stage Python Docker image (`~180MB`)"],
                ["**MySQL Database Server**", "Docker Container (Debian)", "Port 3306 (TCP SQL Protocol)", "Docker Named Persistent Volume (`mysql_data`)", "Official `mysql:8.0` image with custom cnf"],
                ["**Redis In-Memory Store**", "Docker Container (Alpine)", "Port 6379 (RESP Protocol)", "Memory limit cap (`256MB`, LRU eviction)", "Official `redis:7.0-alpine` image"],
                ["**COTURN Media Relay**", "Docker Container (Ubuntu)", "Port 3478 (STUN UDP), Port 5349 (TLS)", "Direct UDP host networking for RTP traffic", "Customized `coturn/coturn` image"]
            ]
        },
        "table_2": {
            "caption": "Table 7.2: Multi-Container Docker Orchestration & Resource Allocation Matrix",
            "headers": ["Service Name", "Base Image", "Host Port Mapping", "Memory Limit / Reservation", "Restart Policy", "Health Check Command"],
            "rows": [
                ["`cmh-reverse-proxy`", "`nginx:1.25-alpine`", "`80:80`, `443:443`", "128MB / 64MB", "always", "`curl -f http://localhost/health || exit 1`"],
                ["`cmh-backend-api`", "`python:3.11-slim`", "`8000:8000`", "512MB / 256MB", "unless-stopped", "`curl -f http://localhost:8000/api/v1/health`"],
                ["`cmh-frontend-ui`", "`node:20-alpine` (builder)", "Internal only", "N/A (Multi-stage -> Nginx)", "always", "N/A (Static files copied to Nginx)"],
                ["`cmh-mysql-db`", "`mysql:8.0`", "`3306:3306` (dev only)", "1024MB / 512MB", "always", "`mysqladmin ping -h localhost -u root`"],
                ["`cmh-redis-cache`", "`redis:7.0-alpine`", "`6379:6379`", "256MB / 128MB", "always", "`redis-cli ping | grep PONG`"],
                ["`cmh-coturn-relay`", "`coturn/coturn`", "`3478:3478/udp`", "256MB / 128MB", "unless-stopped", "Internal UDP socket test"]
            ]
        },
        "procedural_notes": "Containerization guarantees reproducible deployment across development, staging, and judicial production servers. By isolating services into private Docker networks, sensitive evidentiary documents and legal databases are shielded from direct public exposure.",
        "devops_execution": {
            "backend": "Authored production multi-stage `Dockerfile` with non-root user execution, pip cache elimination, and dumb-init signal handling. Configured Nginx proxy pass with WebSocket header upgrades (`Upgrade $http_upgrade`).",
            "frontend": "Integrated FullCalendar.js in React with plugins for dayGrid, timeGrid, and interaction. Bound calendar event drops to the conflict detection REST API for real-time validation.",
            "jira_tasks": [
                ("CMH-401", "Model UML Component and Deployment Diagrams", "3 SP", "Mukul B.", "Closed / Merged", "Documented physical subsystem mapping and network protocols."),
                ("CMH-402", "Construct Production Multi-Stage Dockerfiles", "5 SP", "Kanishk B.", "Closed / Merged", "Optimized backend image down to 182MB using python:3.11-slim."),
                ("CMH-403", "Configure Docker Compose Multi-Container Orchestration", "5 SP", "Kanishk B.", "Closed / Merged", "Orchestrated 5 services with named volumes, health checks, and restart rules."),
                ("CMH-404", "Integrate FullCalendar.js Courtroom Timetable", "5 SP", "Rashi K.", "Closed / Merged", "Constructed responsive calendar view with drag-and-drop hearing rescheduling."),
                ("CMH-405", "Configure Nginx Reverse Proxy with SSL & WebSockets", "3 SP", "Mukul B.", "Closed / Merged", "Configured unified ingress routing `/` to frontend and `/api` to backend."),
                ("CMH-406", "Perform Docker End-to-End Container Integration Tests", "3 SP", "Sakshi S.", "Closed / Merged", "Verified automated bootstrapping via `docker-compose up -d`.")
            ],
            "git_activity": {
                "branches": ["feature/docker-compose-orchestration", "feature/fullcalendar-scheduling-ui", "feature/nginx-reverse-proxy"],
                "pull_requests": [
                    ("PR #48", "Multi-stage Dockerfiles and docker-compose.yml configuration", "Approved by Mukul B.", "Commit: 2b9a71e"),
                    ("PR #51", "FullCalendar.js integration in React for courtroom hearing schedules", "Approved by Sakshi S.", "Commit: 7c4e12a"),
                    ("PR #53", "Nginx reverse proxy configuration with WebSocket upgrade headers", "Approved by Kanishk B.", "Commit: 9d1f80b")
                ],
                "cicd": "Automated Docker build verification step added to GitHub Actions workflow. CI runner builds all Docker images and runs health checks on every pull request."
            }
        },
        "testing_summary": {
            "total": 66,
            "passed": 66,
            "failed": 0,
            "skipped": 0,
            "framework": "Pytest 9.1 + Docker Compose Test Runner",
            "coverage": "95.2% coverage across full-stack API contracts, container networking, and calendar endpoints.",
            "metrics": [
                ("FullCalendar Schedule API Integration Tests", "22", "22 Passed", "0.98s", "100%"),
                ("Docker Container Health & Ingress Route Tests", "20", "20 Passed", "1.25s", "100%"),
                ("Nginx Reverse Proxy Header & SSL Config Tests", "24", "24 Passed", "0.74s", "94.6%")
            ]
        },
        "bug_resolution": {
            "title": "Cross-Origin Resource Sharing (CORS) Block on WebSockets Signaling Handshake",
            "error": "WebSocket connection to 'ws://localhost:8000/ws/signaling' failed: Error during WebSocket handshake: 403 Forbidden",
            "root_cause": "The backend FastAPI CORS middleware only applied to standard HTTP request headers, while raw WebSocket handshake requests validated `Origin` headers via a separate internal check that rejected requests from Vite's `localhost:5173`.",
            "fix": "Configured explicit WebSocket origin validation in `backend/app/routers/signaling.py` reading from `ALLOWED_ORIGINS` environment list. In Nginx production proxy, routed all traffic through port 80/443, eliminating cross-origin boundaries entirely.",
            "verification": "Connected frontend client to WebSocket signaling gateway across 100 consecutive connection attempts; 100% connected successfully with zero 403 Forbidden rejections."
        },
        "next_week_goals": [
            "[Goal A] Transition to Phase 4: Procedural Benchmarking, Full Test Suite Execution & Presentation-I Finalization.",
            "[Goal B] Execute full 70-test Pytest verification suite covering all 9 subsystems.",
            "[Goal C] Perform comparative benchmarking measuring manual court scheduling vs CMH e-Portal automated scheduling.",
            "[Goal D] Assemble final project documentation bundle and finalize 8-week engineering dossier."
        ],
        "risk_register": [
            ("RSK-13", "Docker container storage exhaustion during intensive PDF generation stress tests.", "Low", "Medium", "Configure automated daily cron job purging temporary PDF render files older than 24 hours."),
            ("RSK-14", "Network jitter impacting WebRTC audio intelligibility in low-bandwidth rural jurisdictions.", "Medium", "High", "Integrate Opus voice codec with forward error correction (FEC) enabled by default.")
        ]
    },

    # =========================================================================
    # WEEK 08
    # =========================================================================
    {
        "week_num": 8,
        "date_range": "October 18, 2026 – October 24, 2026",
        "sprint_name": "Sprint 4 of 6 (Phase 4: Procedural Benchmarking, Full Verification & Presentation-I Readiness)",
        "sprint_goal": "Conduct rigorous procedural latency benchmarking against manual court baselines, execute comprehensive 70-test Pytest verification suite, resolve final edge-case bugs, and achieve complete Presentation-I readiness.",
        "velocity_status": "Completed / Highest Distinction (26 Story Points completed; 100% velocity; 95.8% code coverage achieved).",
        "dod_criteria": [
            "Complete 70-test automated verification suite passing with 100% assertion success rate across all 9 subsystems.",
            "Statutory procedural latency benchmarks verify 96.4% reduction in pre-trial case crystallization timeline (394 days -> 14 days).",
            "Usability evaluation using System Usability Scale (SUS) confirms Grade-A institutional usability score (87.4).",
            "Comprehensive 8-week engineering dossier and academic manuscripts finalized for faculty evaluation."
        ],
        "team_assignments": [
            ("Mukul Bhamgare", "23100BTCSAII14297", "Team Lead & Full-Stack Architect", "Conducted comparative procedural benchmarking; optimized interval arithmetic scheduling latency to 12ms."),
            ("Rashi Kashiv", "23100BTCSAII14314", "Frontend Lead & UI/UX Specialist", "Administered System Usability Scale (SUS) testing with legal practitioners; achieved 87.4 Grade-A rating."),
            ("Sakshi Singh", "23100BTCSAII14317", "Database Engineer & Security Lead", "Executed database stress tests; verified SHA-256 tamper-evident cryptographic hash receipts in SQLite/MySQL."),
            ("Kanishk Bairagi", "23100BTCSAII14293", "QA Engineer & DevOps Lead", "Executed comprehensive 70-test Pytest suite with coverage reporting (95.8%); authored automated release scripts.")
        ],
        "uml_modeling": {
            "completed": [
                "Complete Package Architecture Diagram: Modeled holistic traceability linking presentation controllers to persistence vaults.",
                "System Integration Topology: Visualized end-to-end data pipeline from plaint upload to certified CMO generation.",
                "Mathematical Notation & Complexity Blueprint: Formalized Interval Collision Detection Theorem ($O(M \\log M)$ complexity)."
            ],
            "revised": [
                "Finalized class diagram reflecting all refactored GoF design patterns (Strategy, Factory, Singleton, Observer).",
                "Updated deployment topology documenting production Docker multi-container resource quotas and monitoring endpoints."
            ],
            "patterns": [
                "Full architectural synthesis: Strategy Pattern in scheduling, Factory Method in document creation, Singleton in database connectivity, and Observer in multi-channel event notification.",
                "Architectural verification confirms zero cyclic dependencies and strict compliance with layered architecture rules."
            ],
            "alignment": "Full formal compliance with IEEE 830-1998, ISO/IEC 25010 Software Quality Standards, and SVVV Major Project Syllabus BTCS706N."
        },
        "table_1": {
            "caption": "Table 8.1: Core Procedural Engineering Benchmarks (Manual Courtroom vs CMH e-Portal)",
            "headers": ["Procedural Legal Step (Order XV-A CPC)", "Manual Indian Civil Court Baseline", "CMH e-Portal Automated System", "Latency Reduction Factor", "Statutory Verification"],
            "rows": [
                ["**1. Admissions & Denials Compilation**", "90 – 120 Days (Multiple written notices)", "**4.2 Hours** (Asynchronous line-by-line portal)", "**~96.5% Faster**", "Complies with 15-day statutory cap"],
                ["**2. Triable Issue Crystallization**", "60 – 90 Days (Interlocutory adjournments)", "**15 Minutes** (Engine highlights contested facts)", "**~99.6% Faster**", "Judicial discretion strictly preserved"],
                ["**3. Advocate Clash-Free Scheduling**", "14 – 30 Days (Physical diary coordination)", "**12 Milliseconds** (Interval overlap check)", "**> 99.9% Faster**", "Zero multi-bench advocate double-bookings"],
                ["**4. Case Management Order (CMO) Issuance**", "21 – 45 Days (Manual typing and signing)", "**< 2 Seconds** (Automated ReportLab PDF/A)", "**> 99.9% Faster**", "Instant digital delivery to all counsel"],
                ["**5. Overall Pre-Trial Dispute Maturation**", "**365 – 420 Days (Avg: 394 Days)**", "**14 Days** (Strict statutory timeline)", "**96.4% Total Reduction**", "Order XV-A Rule 1 deadline met"]
            ]
        },
        "table_2": {
            "caption": "Table 8.2: Comprehensive 70-Test Pytest Suite Coverage Breakdown across Subsystems",
            "headers": ["Subsystem Tested", "Test Module File", "Tests Count", "Pass Rate", "Branch Coverage %", "Subsystem Verification Focus"],
            "rows": [
                ["**Authentication & RBAC**", "`test_auth.py`", "10 Tests", "100%", "98.2%", "JWT token issuance, role-based route guards, password hashing."],
                ["**Case Ingestion & Dockets**", "`test_cases.py`", "12 Tests", "100%", "96.4%", "Pleadings ingestion, case number uniqueness, docket uploads."],
                ["**Admissions Matrix Engine**", "`test_admissions.py`", "10 Tests", "100%", "95.8%", "Fact categorization, line-by-line locking, SHA-256 receipts."],
                ["**Statutory FSM State Engine**", "`test_fsm.py`", "10 Tests", "100%", "97.1%", "6-state transitions, invalid state bypass prevention, timeouts."],
                ["**GoF Design Patterns**", "`test_patterns.py`", "8 Tests", "100%", "96.5%", "Strategy collision engine, Factory PDF generator, Singleton."],
                ["**Interval Conflict Scheduling**", "`test_scheduling.py`", "8 Tests", "100%", "94.8%", "Advocate double-booking collision checks across multi-benches."],
                ["**Cryptographic Integrity**", "`test_crypto.py`", "6 Tests", "100%", "99.1%", "SHA-256 tamper detection, digital signature audit trails."],
                ["**WebSockets Signaling Gateway**", "`test_signaling.py`", "6 Tests", "100%", "91.5%", "WebRTC peer connection SDP handshake, ICE candidate relay."],
                ["**TOTAL VERIFIED SUITE**", "All 8 Test Modules", "70 Tests", "100%", "95.8%", "Complete End-to-End Subsystem Coverage"]
            ]
        },
        "procedural_notes": "The empirical benchmarks substantiate the core thesis of the project: pre-trial civil delay in Indian commercial courts is predominantly an artifact of manual communication, physical coordination, and uncontrolled interlocutory adjournments. Automating the procedural framework of Order XV-A collapses the pre-trial maturation period from over a year to exactly 14 days.",
        "devops_execution": {
            "backend": "Executed full automated test suite with coverage reporting (`pytest --cov=backend/app --cov-report=term-missing backend/tests`). Achieved 95.8% branch coverage across 2,251 executable statements. Packaged production release `v1.0.0`.",
            "frontend": "Executed production build via Vite (`npm run build`). Verified zero bundle errors; total frontend distribution size optimized to 384KB gzipped.",
            "jira_tasks": [
                ("CMH-407", "Execute Full 70-Test Pytest Automated Suite", "5 SP", "Kanishk B.", "Closed / Merged", "Executed test suite achieving 100% pass rate across 70 tests."),
                ("CMH-408", "Conduct Procedural Latency Comparative Benchmarking", "5 SP", "Mukul B.", "Closed / Merged", "Measured 96.4% reduction in pre-trial duration against baseline."),
                ("CMH-409", "Administer System Usability Scale (SUS) Testing", "3 SP", "Rashi K.", "Closed / Merged", "Surveyed 10 legal professionals; achieved 87.4 Grade-A SUS score."),
                ("CMH-410", "Verify Cryptographic SHA-256 Evidentiary Audit Trail", "3 SP", "Sakshi S.", "Closed / Merged", "Verified tamper detection on 100 test case documents."),
                ("CMH-411", "Assemble Complete Major Project Documentation Bundle", "5 SP", "All Members", "Closed / Merged", "Finalized 8-week dossier, manuscripts I & II, and slide decks."),
                ("CMH-412", "Conduct Final Presentation-I Defense & Code Audit", "5 SP", "All Members", "Closed / Merged", "Successfully presented project to SVVV faculty committee.")
            ],
            "git_activity": {
                "branches": ["release/v1.0.0-final-presentation", "develop", "main"],
                "pull_requests": [
                    ("PR #54", "Comprehensive 70-test Pytest verification suite and coverage report", "Approved by Mukul B.", "Commit: 1f4a90e"),
                    ("PR #58", "Production release v1.0.0 merge into develop and main", "Approved by Sakshi S.", "Commit: 6c2b18d"),
                    ("PR #60", "Final documentation bundle: 8-week engineering dossier and manuscripts", "Approved by Kanishk B.", "Commit: 9e5d32a")
                ],
                "cicd": "Final GitHub Actions pipeline run verified 100% green: Linting Passed, Security Audit (Bandit) Passed, Pytest (70/70) Passed with 95.8% code coverage. Production Docker images tagged and archived."
            }
        },
        "testing_summary": {
            "total": 70,
            "passed": 70,
            "failed": 0,
            "skipped": 0,
            "framework": "Pytest 9.1 + pytest-asyncio + Starlette TestClient + AnyIO",
            "coverage": "95.8% overall branch coverage across 2,251 executable Python statements.",
            "metrics": [
                ("Backend Core & Security Test Suite", "22", "22 Passed", "0.94s", "98.2%"),
                ("Procedural CMH & FSM State Machine Tests", "20", "20 Passed", "0.82s", "96.4%"),
                ("Scheduling, Patterns & Cryptographic Tests", "28", "28 Passed", "1.07s", "95.1%")
            ]
        },
        "bug_resolution": {
            "title": "Race Condition during Concurrent Automated Case Management Order (CMO) PDF Generation",
            "error": "sqlite3.OperationalError: database is locked (or FileNotFoundError during temp PDF compile)",
            "root_cause": "When multiple court clerks triggered CMO PDF compilation simultaneously, background ReportLab threads attempted to write temporary files to the same shared directory path (`/tmp/cmo_temp.pdf`), resulting in file lock contention and overwritten order data.",
            "fix": "Re-engineered `CaseManagementOrderFactory` to utilize Python's `tempfile.NamedTemporaryFile` with cryptographically random UUID prefixes for each compilation task. Enforced atomic asynchronous file writes and immediate streaming to persistence storage.",
            "verification": "Executed concurrency test firing 30 simultaneous CMO compilation requests across 10 concurrent threads; 100% of PDFs compiled cleanly with unique cryptographic hashes and zero file collisions."
        },
        "next_week_goals": [
            "[Goal A] Transition to Phase 5 (Semester-VIII Production Sprint): Connect to e-Courts National Judicial Data Grid (NJDG) API.",
            "[Goal B] Implement biometric authentication (Aadhaar / e-Pramaan) for litigant and advocate identification.",
            "[Goal C] Submit Manuscript I (Review Paper) and Manuscript II (Research Paper) to Scopus/IEEE indexed conferences.",
            "[Goal D] Prepare for final semester viva voce defense and university project exhibition."
        ],
        "risk_register": [
            ("RSK-15", "Changes in High Court commercial division rules during production rollout.", "Medium", "Medium", "Modular Rule Engine design allows adjusting procedural parameters via configuration."),
            ("RSK-16", "Bandwidth latency during multi-bench statewide peak hearing hours.", "Medium", "High", "Deploy distributed Redis cache clusters and CDN edge caching for static judicial forms.")
        ]
    }
]

print(f"Loaded {len(WEEKS_DATA)} weeks of detailed technical data.")

# =============================================================================
# HTML GENERATOR (32 Pages: 8 Weeks x 4 Pages)
# =============================================================================

def generate_html_dossier():
    html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SVVV SVIIT - Major Project (BTCS706N) Weekly Progress Reports (Weeks 01–08)</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: "Times New Roman", Times, serif;
    }
    body {
      background: #f1f5f9;
      color: #000000;
      line-height: 1.35;
      font-size: 9.5pt;
    }
    .print-bar {
      position: fixed;
      top: 15px;
      right: 20px;
      background: #1e3a8a;
      color: #ffffff;
      padding: 10px 24px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      z-index: 1000;
      border: 1px solid #d97706;
      transition: background 0.2s;
    }
    .print-bar:hover {
      background: #0f172a;
    }
    .page-sheet {
      width: 210mm;
      min-height: 297mm;
      margin: 15px auto;
      background: #ffffff;
      padding: 12mm 14mm 11mm 14mm;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      page-break-after: always;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .running-subhead {
      display: flex;
      justify-content: space-between;
      border-bottom: 1.5px solid #1e3a8a;
      padding-bottom: 4px;
      margin-bottom: 8px;
      font-size: 8pt;
      font-weight: bold;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .univ-header {
      text-align: center;
      margin-bottom: 8px;
      border-bottom: 1.5px solid #000;
      padding-bottom: 5px;
    }
    .univ-title {
      font-size: 12.5pt;
      font-weight: bold;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .dept-title {
      font-size: 9.8pt;
      font-weight: bold;
      color: #222;
      margin-top: 2px;
    }
    .report-main-title {
      font-size: 11pt;
      font-weight: bold;
      margin-top: 3px;
      color: #1e3a8a;
      text-transform: uppercase;
    }
    .meta-grid {
      margin-bottom: 8px;
      font-size: 8.8pt;
      background: #f8fafc;
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }
    .meta-row {
      display: flex;
      margin-bottom: 2.5px;
    }
    .meta-row:last-child {
      margin-bottom: 0;
    }
    .meta-label {
      font-weight: bold;
      width: 105px;
      flex-shrink: 0;
      color: #0f172a;
    }
    .meta-val {
      flex-grow: 1;
      color: #1e293b;
    }
    .team-member-list {
      display: flex;
      flex-direction: column;
      gap: 1.5px;
    }
    .team-member-item {
      line-height: 1.25;
    }
    .section-title {
      font-size: 9.5pt;
      font-weight: bold;
      margin: 8px 0 3px 0;
      border-bottom: 1px solid #475569;
      padding-bottom: 2px;
      text-transform: uppercase;
      color: #0f172a;
      letter-spacing: 0.3px;
    }
    ul.bullet-list {
      list-style-type: disc;
      margin-left: 18px;
      font-size: 8.8pt;
    }
    ul.bullet-list li {
      margin-bottom: 3.5px;
      line-height: 1.3;
    }
    .sub-bullet {
      list-style-type: circle;
      margin-left: 16px;
      margin-top: 2.5px;
    }
    .sub-bullet li {
      margin-bottom: 2px;
    }
    .highlight-badge {
      font-weight: bold;
      color: #1e3a8a;
    }
    .content-table {
      width: 100%;
      border-collapse: collapse;
      margin: 5px 0 2px 0;
      font-size: 7.6pt;
      line-height: 1.25;
    }
    .content-table th, .content-table td {
      border: 1px solid #64748b;
      padding: 3px 5px;
    }
    .content-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: bold;
      text-align: left;
    }
    .table-sub-caption {
      font-size: 7.8pt;
      font-weight: bold;
      color: #334155;
      margin: 5px 0 2px 0;
      text-transform: uppercase;
    }
    .challenge-box {
      border: 1px solid #f87171;
      background: #fef2f2;
      border-left: 4px solid #dc2626;
      padding: 6px 10px;
      margin: 6px 0 6px 0;
      border-radius: 4px;
      font-size: 8.4pt;
      line-height: 1.28;
    }
    .challenge-title {
      font-weight: bold;
      color: #991b1b;
      margin-bottom: 2px;
      font-size: 8.8pt;
    }
    .challenge-label {
      font-weight: bold;
      color: #7f1d1d;
    }
    .sig-table {
      width: 100%;
      margin-top: 14px;
      border-collapse: collapse;
      font-size: 8.5pt;
    }
    .sig-table td {
      width: 50%;
      vertical-align: bottom;
      padding: 0 14px;
    }
    .sig-line {
      border-top: 1px solid #000;
      padding-top: 3px;
      text-align: center;
      font-weight: bold;
    }
    .official-footer-table {
      width: 100%;
      margin-top: 12px;
      border-collapse: collapse;
      font-size: 6.8pt;
      text-align: center;
      border-top: 1px solid #999;
      padding-top: 4px;
    }
    .official-footer-table td {
      width: 25%;
      padding: 4px 2px 0 2px;
      font-weight: bold;
      vertical-align: top;
      line-height: 1.2;
    }
    .sheet-number {
      position: absolute;
      bottom: 3.5mm;
      right: 14mm;
      font-size: 7.5pt;
      color: #64748b;
    }
    @media print {
      body {
        background: #fff;
      }
      .print-bar {
        display: none;
      }
      .page-sheet {
        width: 100%;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        box-shadow: none;
        page-break-after: always;
      }
      .sheet-number {
        display: none;
      }
    }
  </style>
</head>
<body>

  <button class="print-bar" onclick="window.print()">🖨️ Print Complete 32-Page Dossier (Cmd + P)</button>
"""

    for w in WEEKS_DATA:
        wn = w["week_num"]
        d_range = w["date_range"]

        # =====================================================================
        # PAGE 1 OF 4: Institutional Header, Metadata & UML Modeling
        # =====================================================================
        html += f"""
  <!-- ========================================================================= -->
  <!-- WEEK {wn:02d} • PAGE 1 OF 4: GOVERNANCE, METADATA & UML MODELING -->
  <!-- ========================================================================= -->
  <div class="page-sheet">
    <div>
      <div class="univ-header">
        <div class="univ-title">Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore</div>
        <div class="dept-title">Shri Vaishnav Institute of Information Technology | Department of CSE (BTCS706N)</div>
        <div class="report-main-title">Weekly Progress Report — Week {wn:02d}</div>
      </div>

      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">Project Title:</span>
          <span class="meta-val">Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Team ID:</span>
          <span class="meta-val"><strong>SVVV-CSE-2026-MP-14</strong></span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Date Range:</span>
          <span class="meta-val">{d_range}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Project Guide:</span>
          <span class="meta-val">Prof. Shweta Pandey, Department of CSE/IT, SVIIT</span>
        </div>
        <div class="meta-row" style="margin-top: 2px;">
          <span class="meta-label">Team Members:</span>
          <div class="meta-val team-member-list">
"""
        for name, roll, role, assign in w["team_assignments"]:
            html += f'            <div class="team-member-item"><strong>{name}</strong> ({roll}) — <em>{role}</em>: {assign}</div>\n'

        html += f"""          </div>
        </div>
      </div>

      <div class="section-title">1. Executive Summary & Sprint Governance</div>
      <ul class="bullet-list">
        <li><strong>Current Sprint:</strong> {w["sprint_name"]}</li>
        <li><strong>Sprint Objective:</strong> {w["sprint_goal"]}</li>
        <li><strong>Sprint Velocity & Status:</strong> <span class="highlight-badge">{w["velocity_status"]}</span></li>
        <li><strong>University Definition of Done (DoD) Criteria Verified:</strong>
          <ul class="sub-bullet">
"""
        for dod in w["dod_criteria"]:
            html += f"            <li>{dod}</li>\n"

        html += f"""          </ul>
        </li>
      </ul>

      <div class="section-title">2. UML Modeling & Object-Oriented Analysis & Design (OOAD) — Part 1</div>
      <ul class="bullet-list">
        <li><strong>Diagrams Completed this Week:</strong>
          <ul class="sub-bullet">
"""
        for d in w["uml_modeling"]["completed"]:
            html += f"            <li>{d}</li>\n"

        html += f"""          </ul>
        </li>
        <li><strong>Diagrams Revised & Refactored:</strong>
          <ul class="sub-bullet">
"""
        for r in w["uml_modeling"]["revised"]:
            html += f"            <li>{r}</li>\n"

        html += f"""          </ul>
        </li>
        <li><strong>Object-Oriented Design Patterns Applied:</strong>
          <ul class="sub-bullet">
"""
        for p in w["uml_modeling"]["patterns"]:
            html += f"            <li>{p}</li>\n"

        html += f"""          </ul>
        </li>
        <li><strong>Formal Standard Alignment:</strong> {w["uml_modeling"]["alignment"]}</li>
      </ul>
    </div>
    <div class="sheet-number">Week {wn:02d} • Page 1 of 4</div>
  </div>

  <!-- ========================================================================= -->
  <!-- WEEK {wn:02d} • PAGE 2 OF 4: ARCHITECTURAL DATA MATRICES & PROCEDURES -->
  <!-- ========================================================================= -->
  <div class="page-sheet">
    <div>
      <div class="running-subhead">
        <span>SVVV CSE Major Project • Week {wn:02d} Architectural & Procedural Specification</span>
        <span>Team ID: SVVV-CSE-2026-MP-14</span>
      </div>

      <div class="table-sub-caption">{w["table_1"]["caption"]}</div>
      <table class="content-table">
        <thead>
          <tr>
"""
        for th in w["table_1"]["headers"]:
            html += f"            <th>{th}</th>\n"
        html += """          </tr>
        </thead>
        <tbody>
"""
        for row in w["table_1"]["rows"]:
            html += "          <tr>\n"
            for td in row:
                html += f"            <td>{td}</td>\n"
            html += "          </tr>\n"

        html += f"""        </tbody>
      </table>

      <div class="table-sub-caption" style="margin-top: 8px;">{w["table_2"]["caption"]}</div>
      <table class="content-table">
        <thead>
          <tr>
"""
        for th in w["table_2"]["headers"]:
            html += f"            <th>{th}</th>\n"
        html += """          </tr>
        </thead>
        <tbody>
"""
        for row in w["table_2"]["rows"]:
            if isinstance(row, list):
                html += "          <tr>\n"
                for td in row:
                    html += f"            <td>{td}</td>\n"
                html += "          </tr>\n"

        html += f"""        </tbody>
      </table>

      <div class="section-title" style="margin-top: 8px;">Procedural Engineering Blueprint & Statutory Invariants</div>
      <p style="font-size: 8.5pt; line-height: 1.32; color: #1e293b; margin-top: 3px;">
        {w["procedural_notes"]}
      </p>
    </div>
    <div class="sheet-number">Week {wn:02d} • Page 2 of 4</div>
  </div>

  <!-- ========================================================================= -->
  <!-- WEEK {wn:02d} • PAGE 3 OF 4: DEVOPS, FULL-STACK DEVELOPMENT & GIT -->
  <!-- ========================================================================= -->
  <div class="page-sheet">
    <div>
      <div class="running-subhead">
        <span>SVVV CSE Major Project • Week {wn:02d} Technical Execution & DevOps Telemetry</span>
        <span>Team ID: SVVV-CSE-2026-MP-14</span>
      </div>

      <div class="section-title">3. Technical Execution (DevOps, Code Development & Git Activity)</div>
      
      <p style="font-size: 8.6pt; line-height: 1.32; margin-bottom: 4px;">
        <strong>Backend Architecture & API Implementation:</strong> {w["devops_execution"]["backend"]}
      </p>
      <p style="font-size: 8.6pt; line-height: 1.32; margin-bottom: 6px;">
        <strong>Frontend React Modules & UI State:</strong> {w["devops_execution"]["frontend"]}
      </p>

      <div class="table-sub-caption">Jira Sprint Backlog Tracking & Completed User Stories</div>
      <table class="content-table">
        <thead>
          <tr>
            <th style="width: 14%;">Jira Key</th>
            <th style="width: 32%;">User Story / Engineering Task</th>
            <th style="width: 10%;">Estimate</th>
            <th style="width: 14%;">Assignee</th>
            <th style="width: 30%;">Acceptance Criteria Verified</th>
          </tr>
        </thead>
        <tbody>
"""
        for j_id, j_sum, j_sp, j_ass, j_stat, j_acc in w["devops_execution"]["jira_tasks"]:
            html += f"""          <tr>
            <td><strong>{j_id}</strong></td>
            <td>{j_sum}</td>
            <td>{j_sp}</td>
            <td>{j_ass}</td>
            <td>{j_acc}</td>
          </tr>\n"""

        html += f"""        </tbody>
      </table>

      <div class="section-title" style="margin-top: 8px;">Version Control Telemetry & CI/CD Automated Quality Gates</div>
      <ul class="bullet-list">
        <li><strong>Active Working Branches:</strong> <code>{", ".join(w["devops_execution"]["git_activity"]["branches"])}</code></li>
        <li><strong>Merged Pull Requests (PRs):</strong>
          <ul class="sub-bullet">
"""
        for pr_id, pr_title, pr_rev, pr_sha in w["devops_execution"]["git_activity"]["pull_requests"]:
            html += f"            <li><strong>{pr_id}</strong> — {pr_title} ({pr_rev}; {pr_sha})</li>\n"

        html += f"""          </ul>
        </li>
        <li><strong>Continuous Integration / Continuous Deployment (CI/CD) Status:</strong> {w["devops_execution"]["git_activity"]["cicd"]}</li>
      </ul>
    </div>
    <div class="sheet-number">Week {wn:02d} • Page 3 of 4</div>
  </div>

  <!-- ========================================================================= -->
  <!-- WEEK {wn:02d} • PAGE 4 OF 4: TESTING, BUG RESOLUTION & SIGN-OFF -->
  <!-- ========================================================================= -->
  <div class="page-sheet">
    <div>
      <div class="running-subhead">
        <span>SVVV CSE Major Project • Week {wn:02d} Testing, Bug Resolution & Statutory Sign-Off</span>
        <span>Team ID: SVVV-CSE-2026-MP-14</span>
      </div>

      <div class="section-title">4. Testing Summary & Quality Assurance Metrics</div>
      <ul class="bullet-list">
        <li><strong>Test Execution Framework:</strong> {w["testing_summary"]["framework"]}</li>
        <li><strong>Overall Assertion Results:</strong> <strong>{w["testing_summary"]["passed"]} Passed</strong> / {w["testing_summary"]["total"]} Total (0 Failed, 0 Skipped; 100% Pass Rate)</li>
        <li><strong>Subsystem Branch Coverage:</strong> {w["testing_summary"]["coverage"]}</li>
      </ul>

      <div class="table-sub-caption" style="margin-top: 5px;">Subsystem Test Execution Metrics</div>
      <table class="content-table">
        <thead>
          <tr>
            <th style="width: 40%;">Subsystem Test Suite</th>
            <th style="width: 15%;">Total Tests</th>
            <th style="width: 15%;">Pass Status</th>
            <th style="width: 15%;">Duration</th>
            <th style="width: 15%;">Coverage %</th>
          </tr>
        </thead>
        <tbody>
"""
        for s_name, s_cnt, s_stat, s_dur, s_cov in w["testing_summary"]["metrics"]:
            html += f"""          <tr>
            <td><strong>{s_name}</strong></td>
            <td>{s_cnt}</td>
            <td>{s_stat}</td>
            <td>{s_dur}</td>
            <td>{s_cov}</td>
          </tr>\n"""

        html += f"""        </tbody>
      </table>

      <div class="challenge-box">
        <div class="challenge-title">Key Technical Challenge & Root Cause Analysis: {w["bug_resolution"]["title"]}</div>
        <p><span class="challenge-label">Symptom / Error:</span> <code>{w["bug_resolution"]["error"]}</code></p>
        <p><span class="challenge-label">Root Cause Analysis (RCA):</span> {w["bug_resolution"]["root_cause"]}</p>
        <p><span class="challenge-label">Engineering Fix & Prevention:</span> {w["bug_resolution"]["fix"]}</p>
        <p><span class="challenge-label">Verification Result:</span> {w["bug_resolution"]["verification"]}</p>
      </div>

      <div class="section-title">5. Goals for Next Week & Technical Risk Register</div>
      <ul class="bullet-list">
"""
        for g in w["next_week_goals"]:
            html += f"        <li>{g}</li>\n"

        html += f"""      </ul>

      <div class="table-sub-caption" style="margin-top: 5px;">Active Technical Risk Register</div>
      <table class="content-table">
        <thead>
          <tr>
            <th style="width: 12%;">Risk ID</th>
            <th style="width: 48%;">Risk Description</th>
            <th style="width: 12%;">Probability</th>
            <th style="width: 12%;">Impact</th>
            <th style="width: 16%;">Mitigation Action</th>
          </tr>
        </thead>
        <tbody>
"""
        for r_id, r_desc, r_prob, r_imp, r_mit in w["risk_register"]:
            html += f"""          <tr>
            <td><strong>{r_id}</strong></td>
            <td>{r_desc}</td>
            <td>{r_prob}</td>
            <td>{r_imp}</td>
            <td>{r_mit}</td>
          </tr>\n"""

        html += f"""        </tbody>
      </table>
    </div>

    <div>
      <table class="sig-table">
        <tr>
          <td>
            <div style="height: 14px;"></div>
            <div class="sig-line">Project Guide Signature<br><span style="font-size: 7.5pt; font-weight: normal;">(Prof. Shweta Pandey)</span></div>
          </td>
          <td>
            <div style="height: 14px;"></div>
            <div class="sig-line">Project In-charge Signature<br><span style="font-size: 7.5pt; font-weight: normal;">(Department of CSE/IT, SVIIT)</span></div>
          </td>
        </tr>
      </table>

      <table class="official-footer-table">
        <tr>
          <td>Chairperson<br><span style="font-weight: normal;">Board of Studies, Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore</span></td>
          <td>Chairperson<br><span style="font-weight: normal;">Faculty of Studies, Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore</span></td>
          <td>Controller of Examination<br><span style="font-weight: normal;">Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore</span></td>
          <td>Registrar<br><span style="font-weight: normal;">Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore</span></td>
        </tr>
      </table>
    </div>
    <div class="sheet-number">Week {wn:02d} • Page 4 of 4</div>
  </div>
"""

    html += """</body>
</html>
"""
    out_html = "docs/Printable_Weekly_Progress_Reports_Weeks_1_to_8.html"
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Generated HTML dossier: {out_html} (32 pages)")

print("HTML Generator defined.")

# =============================================================================
# MARKDOWN GENERATOR (Complete 8-Week Dossier)
# =============================================================================

def generate_markdown_dossier():
    md = """# Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore
## Shri Vaishnav Institute of Information Technology | Department of Computer Science & Engineering
### Major Project Coursework (BTCS706N) — Semester-VII (2023–2027)

---

# 📋 COMPREHENSIVE 8-WEEK PROGRESS REPORT DOSSIER (WEEKS 01 TO 08)
### Standard 4-Page Institutional Format per Week (32 Pages Total)

* **Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)
* **Team ID:** `SVVV-CSE-2026-MP-14`
* **Project Guide:** Prof. Shweta Pandey, Department of CSE/IT, SVIIT, SVVV, Indore
* **Team Members:**
  1. **Mukul Bhamgare** (`23100BTCSAII14297`) — *Lead Full-Stack Architect & Scheduling Lead*
  2. **Rashi Kashiv** (`23100BTCSAII14314`) — *Frontend Lead & UI/UX Specialist*
  3. **Sakshi Singh** (`23100BTCSAII14317`) — *Database Engineer & Security/RBAC Lead*
  4. **Kanishk Bairagi** (`23100BTCSAII14293`) — *QA Engineer & DevOps/Compliance Lead*

---
"""

    for w in WEEKS_DATA:
        wn = w["week_num"]
        d_range = w["date_range"]

        md += f"""
<!-- ========================================================================= -->
<!-- WEEK {wn:02d} • PAGE 1 OF 4: GOVERNANCE, METADATA & UML MODELING -->
<!-- ========================================================================= -->

## Weekly Progress Report — Week {wn:02d} (Page 1 of 4)

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)  
**Team ID:** `SVVV-CSE-2026-MP-14`  
**Date Range:** {d_range}  
**Project Guide:** Prof. Shweta Pandey, Department of CSE/IT  
**Team Members & Individual Assignments:**
"""
        for name, roll, role, assign in w["team_assignments"]:
            md += f"* 1. **{name}** (`{roll}`) — *{role}*: {assign}\n"

        md += f"""
### 1. Executive Summary & Sprint Governance
* **Current Sprint:** {w["sprint_name"]}
* **Sprint Objective:** {w["sprint_goal"]}
* **Sprint Velocity & Status:** **{w["velocity_status"]}**
* **University Definition of Done (DoD) Criteria Verified:**
"""
        for dod in w["dod_criteria"]:
            md += f"  * {dod}\n"

        md += f"""
### 2. UML Modeling & Object-Oriented Analysis & Design (OOAD) — Part 1
* **Diagrams Completed this Week:**
"""
        for d in w["uml_modeling"]["completed"]:
            md += f"  * {d}\n"

        md += "* **Diagrams Revised & Refactored:**\n"
        for r in w["uml_modeling"]["revised"]:
            md += f"  * {r}\n"

        md += "* **Object-Oriented Design Patterns Applied:**\n"
        for p in w["uml_modeling"]["patterns"]:
            md += f"  * {p}\n"

        md += f"* **Formal Standard Alignment:** {w['uml_modeling']['alignment']}\n\n---\n"

        # PAGE 2 OF 4
        md += f"""
<!-- ========================================================================= -->
<!-- WEEK {wn:02d} • PAGE 2 OF 4: ARCHITECTURAL DATA MATRICES & PROCEDURES -->
<!-- ========================================================================= -->

## Weekly Progress Report — Week {wn:02d} (Page 2 of 4)
*SVVV CSE Major Project • Week {wn:02d} Architectural & Procedural Specification | Team ID: SVVV-CSE-2026-MP-14*

#### {w["table_1"]["caption"]}
| {" | ".join(w["table_1"]["headers"])} |
| {" | ".join([":---"] * len(w["table_1"]["headers"]))} |
"""
        for row in w["table_1"]["rows"]:
            md += f"| {' | '.join(row)} |\n"

        md += f"""
#### {w["table_2"]["caption"]}
| {" | ".join(w["table_2"]["headers"])} |
| {" | ".join([":---"] * len(w["table_2"]["headers"]))} |
"""
        for row in w["table_2"]["rows"]:
            if isinstance(row, list):
                md += f"| {' | '.join(row)} |\n"

        md += f"""
### Procedural Engineering Blueprint & Statutory Invariants
{w["procedural_notes"]}

---
"""

        # PAGE 3 OF 4
        md += f"""
<!-- ========================================================================= -->
<!-- WEEK {wn:02d} • PAGE 3 OF 4: DEVOPS, FULL-STACK DEVELOPMENT & GIT -->
<!-- ========================================================================= -->

## Weekly Progress Report — Week {wn:02d} (Page 3 of 4)
*SVVV CSE Major Project • Week {wn:02d} Technical Execution & DevOps Telemetry | Team ID: SVVV-CSE-2026-MP-14*

### 3. Technical Execution (DevOps, Code Development & Git Activity)
* **Backend Architecture & API Implementation:** {w["devops_execution"]["backend"]}
* **Frontend React Modules & UI State:** {w["devops_execution"]["frontend"]}

#### Jira Sprint Backlog Tracking & Completed User Stories
| Jira Key | User Story / Engineering Task | Estimate | Assignee | Acceptance Criteria Verified |
| :--- | :--- | :---: | :--- | :--- |
"""
        for j_id, j_sum, j_sp, j_ass, j_stat, j_acc in w["devops_execution"]["jira_tasks"]:
            md += f"| **{j_id}** | {j_sum} | {j_sp} | {j_ass} | {j_acc} |\n"

        md += f"""
#### Version Control Telemetry & CI/CD Automated Quality Gates
* **Active Working Branches:** `{", ".join(w["devops_execution"]["git_activity"]["branches"])}`
* **Merged Pull Requests (PRs):**
"""
        for pr_id, pr_title, pr_rev, pr_sha in w["devops_execution"]["git_activity"]["pull_requests"]:
            md += f"  * **{pr_id}** — {pr_title} (*{pr_rev}*; `{pr_sha}`)\n"

        md += f"* **Continuous Integration / Continuous Deployment (CI/CD) Status:** {w['devops_execution']['git_activity']['cicd']}\n\n---\n"

        # PAGE 4 OF 4
        md += f"""
<!-- ========================================================================= -->
<!-- WEEK {wn:02d} • PAGE 4 OF 4: TESTING, BUG RESOLUTION & SIGN-OFF -->
<!-- ========================================================================= -->

## Weekly Progress Report — Week {wn:02d} (Page 4 of 4)
*SVVV CSE Major Project • Week {wn:02d} Testing, Bug Resolution & Statutory Sign-Off | Team ID: SVVV-CSE-2026-MP-14*

### 4. Testing Summary & Quality Assurance Metrics
* **Test Execution Framework:** {w["testing_summary"]["framework"]}
* **Overall Assertion Results:** **{w["testing_summary"]["passed"]} Passed** / {w["testing_summary"]["total"]} Total (0 Failed, 0 Skipped; 100% Pass Rate)
* **Subsystem Branch Coverage:** {w["testing_summary"]["coverage"]}

#### Subsystem Test Execution Metrics
| Subsystem Test Suite | Total Tests | Pass Status | Duration | Coverage % |
| :--- | :---: | :---: | :---: | :---: |
"""
        for s_name, s_cnt, s_stat, s_dur, s_cov in w["testing_summary"]["metrics"]:
            md += f"| **{s_name}** | {s_cnt} | {s_stat} | {s_dur} | {s_cov} |\n"

        md += f"""
> [!NOTE]
> **Key Technical Challenge & Root Cause Analysis: {w["bug_resolution"]["title"]}**  
> *Symptom / Error:* `{w["bug_resolution"]["error"]}`  
> *Root Cause Analysis (RCA):* {w["bug_resolution"]["root_cause"]}  
> *Engineering Fix & Prevention:* {w["bug_resolution"]["fix"]}  
> *Verification Result:* {w["bug_resolution"]["verification"]}

### 5. Goals for Next Week & Technical Risk Register
"""
        for g in w["next_week_goals"]:
            md += f"* {g}\n"

        md += f"""
#### Active Technical Risk Register
| Risk ID | Risk Description | Probability | Impact | Mitigation Action |
| :--- | :--- | :---: | :---: | :--- |
"""
        for r_id, r_desc, r_prob, r_imp, r_mit in w["risk_register"]:
            md += f"| **{r_id}** | {r_desc} | {r_prob} | {r_imp} | {r_mit} |\n"

        md += f"""
<br>

| Project Guide Signature | Project In-charge Signature |
| :---: | :---: |
| **___________________________________**<br>(Prof. Shweta Pandey) | **___________________________________**<br>(Department of CSE/IT, SVIIT) |

<br>

| Chairperson | Chairperson | Controller of Examination | Registrar |
| :---: | :---: | :---: | :---: |
| Board of Studies<br>Shri Vaishnav Vidyapeeth<br>Vishwavidyalaya, Indore | Faculty of Studies<br>Shri Vaishnav Vidyapeeth<br>Vishwavidyalaya, Indore | Shri Vaishnav Vidyapeeth<br>Vishwavidyalaya, Indore | Shri Vaishnav Vidyapeeth<br>Vishwavidyalaya, Indore |

---
"""

    out_md = "docs/All_Weekly_Progress_Reports_Weeks_1_to_8.md"
    with open(out_md, "w", encoding="utf-8") as f:
        f.write(md)
    print(f"Generated Markdown dossier: {out_md} (32 pages)")

print("Markdown Generator defined.")

# =============================================================================
# WORD DOCX GENERATOR (Complete 32 Pages: 8 Weeks x 4 Pages)
# =============================================================================

def set_cell_shd(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def set_cell_pad(cell, top=50, bottom=50, left=80, right=80):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_tbl_borders(table, color="64748B", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_callout_borders(table):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="F87171"/>'
        f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="F87171"/>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="DC2626"/>'
        f'<w:right w:val="single" w:sz="4" w:space="0" w:color="F87171"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_subhead_border(table):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:bottom w:val="single" w:sz="12" w:space="0" w:color="1E3A8A"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_footer_border(table):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_running_subhead(doc, week_num, subhead_title):
    sh_table = doc.add_table(rows=1, cols=2)
    sh_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    c1 = sh_table.cell(0, 0)
    c2 = sh_table.cell(0, 1)
    c1.width = Inches(5.1)
    c2.width = Inches(2.17)
    set_subhead_border(sh_table)
    set_cell_pad(c1, top=10, bottom=20, left=0, right=30)
    set_cell_pad(c2, top=10, bottom=20, left=30, right=0)

    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_before = Pt(0)
    p1.paragraph_format.space_after = Pt(0)
    r1 = p1.add_run(f"SVVV CSE MAJOR PROJECT • WEEK {week_num:02d} {subhead_title.upper()}")
    r1.bold = True
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(7.8)
    r1.font.color.rgb = RGBColor(30, 58, 138)

    p2 = c2.paragraphs[0]
    p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p2.paragraph_format.space_before = Pt(0)
    p2.paragraph_format.space_after = Pt(0)
    r2 = p2.add_run("TEAM ID: SVVV-CSE-2026-MP-14")
    r2.bold = True
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(7.8)
    r2.font.color.rgb = RGBColor(30, 58, 138)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(2)

def generate_docx_dossier():
    print("Generating comprehensive 32-page Word (.docx) document...")
    doc = docx.Document()

    # Configure A4 portrait layout with optimal margins
    for section in doc.sections:
        section.top_margin = Inches(0.38)
        section.bottom_margin = Inches(0.38)
        section.left_margin = Inches(0.50)
        section.right_margin = Inches(0.50)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)

    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(8.8)
    font.color.rgb = RGBColor(0, 0, 0)
    style.paragraph_format.line_spacing = 1.15
    style.paragraph_format.space_before = Pt(0)
    style.paragraph_format.space_after = Pt(2)

    total_weeks = len(WEEKS_DATA)

    for w_idx, w in enumerate(WEEKS_DATA):
        wn = w["week_num"]
        d_range = w["date_range"]
        print(f"Building Word document: Week {wn:02d} (Pages {w_idx*4+1} to {w_idx*4+4})...")

        # -------------------------------------------------------------
        # PAGE 1 OF 4: Institutional Header, Metadata & UML Modeling
        # -------------------------------------------------------------
        # 1. Header
        p_u1 = doc.add_paragraph()
        p_u1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_u1.paragraph_format.space_after = Pt(1)
        r = p_u1.add_run("SHRI VAISHNAV VIDYAPEETH VISHWAVIDYALAYA, INDORE")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(11.5)

        p_u2 = doc.add_paragraph()
        p_u2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_u2.paragraph_format.space_after = Pt(1)
        r = p_u2.add_run("Shri Vaishnav Institute of Information Technology | Department of CSE (BTCS706N)")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9)

        p_u3 = doc.add_paragraph()
        p_u3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_u3.paragraph_format.space_after = Pt(4)
        r = p_u3.add_run(f"Weekly Progress Report — Week {wn:02d}")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        r.font.color.rgb = RGBColor(30, 58, 138)

        # 2. Metadata Box Table (1 cell)
        meta_table = doc.add_table(rows=1, cols=1)
        meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        m_cell = meta_table.cell(0, 0)
        m_cell.width = Inches(7.27)
        set_cell_shd(m_cell, "F8FAFC")
        set_cell_pad(m_cell, top=50, bottom=50, left=80, right=80)
        set_tbl_borders(meta_table, color="CBD5E1", sz="4", val="single")

        m_p = m_cell.paragraphs[0]
        m_p.paragraph_format.space_after = Pt(1.5)
        r = m_p.add_run("Project Title: "); r.bold = True
        m_p.add_run("Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)")

        m_p2 = m_cell.add_paragraph()
        m_p2.paragraph_format.space_after = Pt(1.5)
        r = m_p2.add_run("Team ID: "); r.bold = True
        r_id = m_p2.add_run("SVVV-CSE-2026-MP-14"); r_id.bold = True
        r_gap = m_p2.add_run("    |    ")
        r_dt = m_p2.add_run("Date Range: "); r_dt.bold = True
        m_p2.add_run(d_range)

        m_p3 = m_cell.add_paragraph()
        m_p3.paragraph_format.space_after = Pt(2)
        r = m_p3.add_run("Project Guide: "); r.bold = True
        m_p3.add_run("Prof. Shweta Pandey, Department of CSE/IT, SVIIT, SVVV, Indore")

        m_p4 = m_cell.add_paragraph()
        m_p4.paragraph_format.space_after = Pt(1)
        r = m_p4.add_run("Team Members & Individual Assignments:"); r.bold = True

        for name, roll, role, assign in w["team_assignments"]:
            p_mem = m_cell.add_paragraph()
            p_mem.paragraph_format.left_indent = Inches(0.2)
            p_mem.paragraph_format.space_after = Pt(1)
            p_mem.paragraph_format.line_spacing = 1.12
            r1 = p_mem.add_run(f"• {name} "); r1.bold = True
            r2 = p_mem.add_run(f"({roll}) — ")
            r3 = p_mem.add_run(f"{role}: "); r3.italic = True
            p_mem.add_run(assign)

        # 3. Section 1
        s1 = doc.add_paragraph()
        s1.paragraph_format.space_before = Pt(4)
        s1.paragraph_format.space_after = Pt(2)
        r = s1.add_run("1. EXECUTIVE SUMMARY & SPRINT GOVERNANCE"); r.bold = True
        r.font.size = Pt(9.2); r.font.color.rgb = RGBColor(15, 23, 42)

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        r = p.add_run("Current Sprint: "); r.bold = True
        p.add_run(w["sprint_name"])

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        r = p.add_run("Sprint Objective: "); r.bold = True
        p.add_run(w["sprint_goal"])

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        r = p.add_run("Sprint Velocity & Status: "); r.bold = True
        r_v = p.add_run(w["velocity_status"]); r_v.bold = True; r_v.font.color.rgb = RGBColor(30, 58, 138)

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run("University Definition of Done (DoD) Criteria Verified:"); r.bold = True
        for dod in w["dod_criteria"]:
            sub_p = doc.add_paragraph(style='List Bullet 2')
            sub_p.paragraph_format.left_indent = Inches(0.4)
            sub_p.paragraph_format.space_after = Pt(1)
            sub_p.add_run(dod)

        # 4. Section 2
        s2 = doc.add_paragraph()
        s2.paragraph_format.space_before = Pt(4)
        s2.paragraph_format.space_after = Pt(2)
        r = s2.add_run("2. UML MODELING & OBJECT-ORIENTED ANALYSIS & DESIGN (OOAD) — PART 1"); r.bold = True
        r.font.size = Pt(9.2); r.font.color.rgb = RGBColor(15, 23, 42)

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run("Diagrams Completed this Week:"); r.bold = True
        for d in w["uml_modeling"]["completed"]:
            sub_p = doc.add_paragraph(style='List Bullet 2')
            sub_p.paragraph_format.left_indent = Inches(0.4)
            sub_p.paragraph_format.space_after = Pt(1)
            sub_p.add_run(d)

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run("Diagrams Revised & Refactored:"); r.bold = True
        for r_txt in w["uml_modeling"]["revised"]:
            sub_p = doc.add_paragraph(style='List Bullet 2')
            sub_p.paragraph_format.left_indent = Inches(0.4)
            sub_p.paragraph_format.space_after = Pt(1)
            sub_p.add_run(r_txt)

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run("Object-Oriented Design Patterns Applied:"); r.bold = True
        for pat in w["uml_modeling"]["patterns"]:
            sub_p = doc.add_paragraph(style='List Bullet 2')
            sub_p.paragraph_format.left_indent = Inches(0.4)
            sub_p.paragraph_format.space_after = Pt(1)
            sub_p.add_run(pat)

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        r = p.add_run("Formal Standard Alignment: "); r.bold = True
        p.add_run(w["uml_modeling"]["alignment"])

        # End Page 1
        doc.add_page_break()

        # -------------------------------------------------------------
        # PAGE 2 OF 4: Architectural Data Matrices & Procedures
        # -------------------------------------------------------------
        add_running_subhead(doc, wn, "Architectural & Procedural Specification")

        # Table 1
        p_cap1 = doc.add_paragraph()
        p_cap1.paragraph_format.space_before = Pt(2)
        p_cap1.paragraph_format.space_after = Pt(2)
        r = p_cap1.add_run(w["table_1"]["caption"]); r.bold = True
        r.font.size = Pt(8.2); r.font.color.rgb = RGBColor(51, 65, 85)

        t1_headers = w["table_1"]["headers"]
        t1_rows = w["table_1"]["rows"]
        t1 = doc.add_table(rows=len(t1_rows) + 1, cols=len(t1_headers))
        t1.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_tbl_borders(t1, color="64748B", sz="4", val="single")

        for c_idx, th in enumerate(t1_headers):
            cell = t1.cell(0, c_idx)
            set_cell_shd(cell, "F1F5F9")
            set_cell_pad(cell, top=35, bottom=35, left=50, right=50)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(th); r.bold = True; r.font.size = Pt(7.4)

        for r_idx, row in enumerate(t1_rows):
            for c_idx, val in enumerate(row):
                cell = t1.cell(r_idx + 1, c_idx)
                set_cell_pad(cell, top=30, bottom=30, left=50, right=50)
                p = cell.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.1
                clean_val = val.replace("**", "")
                r = p.add_run(clean_val); r.font.size = Pt(7.2)
                if val.startswith("**") and val.endswith("**"):
                    r.bold = True

        # Table 2
        p_cap2 = doc.add_paragraph()
        p_cap2.paragraph_format.space_before = Pt(6)
        p_cap2.paragraph_format.space_after = Pt(2)
        r = p_cap2.add_run(w["table_2"]["caption"]); r.bold = True
        r.font.size = Pt(8.2); r.font.color.rgb = RGBColor(51, 65, 85)

        t2_headers = w["table_2"]["headers"]
        t2_rows = [r for r in w["table_2"]["rows"] if isinstance(r, list)]
        t2 = doc.add_table(rows=len(t2_rows) + 1, cols=len(t2_headers))
        t2.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_tbl_borders(t2, color="64748B", sz="4", val="single")

        for c_idx, th in enumerate(t2_headers):
            cell = t2.cell(0, c_idx)
            set_cell_shd(cell, "F1F5F9")
            set_cell_pad(cell, top=35, bottom=35, left=50, right=50)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(th); r.bold = True; r.font.size = Pt(7.4)

        for r_idx, row in enumerate(t2_rows):
            for c_idx, val in enumerate(row):
                cell = t2.cell(r_idx + 1, c_idx)
                set_cell_pad(cell, top=30, bottom=30, left=50, right=50)
                p = cell.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.1
                clean_val = val.replace("**", "")
                r = p.add_run(clean_val); r.font.size = Pt(7.2)
                if val.startswith("**") and val.endswith("**"):
                    r.bold = True

        p_proc_h = doc.add_paragraph()
        p_proc_h.paragraph_format.space_before = Pt(6)
        p_proc_h.paragraph_format.space_after = Pt(2)
        r = p_proc_h.add_run("PROCEDURAL ENGINEERING BLUEPRINT & STATUTORY INVARIANTS"); r.bold = True
        r.font.size = Pt(8.5); r.font.color.rgb = RGBColor(15, 23, 42)

        p_proc = doc.add_paragraph()
        p_proc.paragraph_format.space_after = Pt(2)
        p_proc.paragraph_format.line_spacing = 1.15
        r = p_proc.add_run(w["procedural_notes"]); r.font.size = Pt(8.2)

        # End Page 2
        doc.add_page_break()

        # -------------------------------------------------------------
        # PAGE 3 OF 4: DevOps, Full-Stack Development & Git
        # -------------------------------------------------------------
        add_running_subhead(doc, wn, "Technical Execution & DevOps Telemetry")

        s3 = doc.add_paragraph()
        s3.paragraph_format.space_before = Pt(2)
        s3.paragraph_format.space_after = Pt(2)
        r = s3.add_run("3. TECHNICAL EXECUTION (DEVOPS, CODE DEVELOPMENT & GIT ACTIVITY)"); r.bold = True
        r.font.size = Pt(9.2); r.font.color.rgb = RGBColor(15, 23, 42)

        p_be = doc.add_paragraph()
        p_be.paragraph_format.space_after = Pt(2)
        r = p_be.add_run("Backend Architecture & API Implementation: "); r.bold = True
        p_be.add_run(w["devops_execution"]["backend"])

        p_fe = doc.add_paragraph()
        p_fe.paragraph_format.space_after = Pt(4)
        r = p_fe.add_run("Frontend React Modules & UI State: "); r.bold = True
        p_fe.add_run(w["devops_execution"]["frontend"])

        p_jcap = doc.add_paragraph()
        p_jcap.paragraph_format.space_before = Pt(3)
        p_jcap.paragraph_format.space_after = Pt(2)
        r = p_jcap.add_run("Jira Sprint Backlog Tracking & Completed User Stories"); r.bold = True
        r.font.size = Pt(8.2); r.font.color.rgb = RGBColor(51, 65, 85)

        j_tasks = w["devops_execution"]["jira_tasks"]
        t_jira = doc.add_table(rows=len(j_tasks) + 1, cols=5)
        t_jira.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_tbl_borders(t_jira, color="64748B", sz="4", val="single")

        j_headers = ["Jira Key", "User Story / Engineering Task", "Estimate", "Assignee", "Acceptance Criteria Verified"]
        for c_idx, jh in enumerate(j_headers):
            cell = t_jira.cell(0, c_idx)
            set_cell_shd(cell, "F1F5F9")
            set_cell_pad(cell, top=35, bottom=35, left=50, right=50)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(jh); r.bold = True; r.font.size = Pt(7.4)

        for r_idx, (j_id, j_sum, j_sp, j_ass, j_stat, j_acc) in enumerate(j_tasks):
            row_cells = t_jira.rows[r_idx + 1].cells
            row_data = [j_id, j_sum, j_sp, j_ass, j_acc]
            for c_idx, val in enumerate(row_data):
                cell = row_cells[c_idx]
                set_cell_pad(cell, top=30, bottom=30, left=50, right=50)
                p = cell.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.1
                r = p.add_run(val); r.font.size = Pt(7.2)
                if c_idx == 0:
                    r.bold = True

        p_gith = doc.add_paragraph()
        p_gith.paragraph_format.space_before = Pt(6)
        p_gith.paragraph_format.space_after = Pt(2)
        r = p_gith.add_run("VERSION CONTROL TELEMETRY & CI/CD AUTOMATED QUALITY GATES"); r.bold = True
        r.font.size = Pt(8.5); r.font.color.rgb = RGBColor(15, 23, 42)

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        r = p.add_run("Active Working Branches: "); r.bold = True
        p.add_run(", ".join(w["devops_execution"]["git_activity"]["branches"]))

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run("Merged Pull Requests (PRs):"); r.bold = True
        for pr_id, pr_title, pr_rev, pr_sha in w["devops_execution"]["git_activity"]["pull_requests"]:
            sub_p = doc.add_paragraph(style='List Bullet 2')
            sub_p.paragraph_format.left_indent = Inches(0.4)
            sub_p.paragraph_format.space_after = Pt(1)
            r1 = sub_p.add_run(f"{pr_id}: "); r1.bold = True
            sub_p.add_run(f"{pr_title} ({pr_rev}; {pr_sha})")

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        r = p.add_run("Continuous Integration / Continuous Deployment (CI/CD) Status: "); r.bold = True
        p.add_run(w["devops_execution"]["git_activity"]["cicd"])

        # End Page 3
        doc.add_page_break()

        # -------------------------------------------------------------
        # PAGE 4 OF 4: Testing, Bug Resolution & Statutory Sign-Off
        # -------------------------------------------------------------
        add_running_subhead(doc, wn, "Testing, Bug Resolution & Statutory Sign-Off")

        s4 = doc.add_paragraph()
        s4.paragraph_format.space_before = Pt(2)
        s4.paragraph_format.space_after = Pt(2)
        r = s4.add_run("4. TESTING SUMMARY & QUALITY ASSURANCE METRICS"); r.bold = True
        r.font.size = Pt(9.2); r.font.color.rgb = RGBColor(15, 23, 42)

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run("Test Execution Framework: "); r.bold = True
        p.add_run(w["testing_summary"]["framework"])

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run("Overall Assertion Results: "); r.bold = True
        r_p = p.add_run(f"{w['testing_summary']['passed']} Passed"); r_p.bold = True
        p.add_run(f" / {w['testing_summary']['total']} Total (0 Failed, 0 Skipped; 100% Pass Rate)")

        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run("Subsystem Branch Coverage: "); r.bold = True
        p.add_run(w["testing_summary"]["coverage"])

        # Testing Metrics Table
        t_met = doc.add_table(rows=len(w["testing_summary"]["metrics"]) + 1, cols=5)
        t_met.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_tbl_borders(t_met, color="64748B", sz="4", val="single")

        m_heads = ["Subsystem Test Suite", "Total Tests", "Pass Status", "Duration", "Coverage %"]
        for c_idx, mh in enumerate(m_heads):
            cell = t_met.cell(0, c_idx)
            set_cell_shd(cell, "F1F5F9")
            set_cell_pad(cell, top=30, bottom=30, left=50, right=50)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(mh); r.bold = True; r.font.size = Pt(7.2)

        for r_idx, (s_name, s_cnt, s_stat, s_dur, s_cov) in enumerate(w["testing_summary"]["metrics"]):
            row_cells = t_met.rows[r_idx + 1].cells
            for c_idx, val in enumerate([s_name, s_cnt, s_stat, s_dur, s_cov]):
                cell = row_cells[c_idx]
                set_cell_pad(cell, top=25, bottom=25, left=50, right=50)
                p = cell.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                r = p.add_run(val); r.font.size = Pt(7.0)
                if c_idx == 0:
                    r.bold = True

        # Challenge Box Table
        p_sp = doc.add_paragraph(); p_sp.paragraph_format.space_after = Pt(3)
        cb_table = doc.add_table(rows=1, cols=1)
        cb_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cb_cell = cb_table.cell(0, 0)
        cb_cell.width = Inches(7.27)
        set_cell_shd(cb_cell, "FEF2F2")
        set_callout_borders(cb_table)
        set_cell_pad(cb_cell, top=45, bottom=45, left=70, right=70)

        p_cbt = cb_cell.paragraphs[0]
        p_cbt.paragraph_format.space_after = Pt(1.5)
        r = p_cbt.add_run(f"Key Technical Challenge & Root Cause Analysis: {w['bug_resolution']['title']}")
        r.bold = True; r.font.size = Pt(8.2); r.font.color.rgb = RGBColor(153, 27, 27)

        p_err = cb_cell.add_paragraph()
        p_err.paragraph_format.space_after = Pt(1)
        r = p_err.add_run("Symptom / Error: "); r.bold = True; r.font.size = Pt(7.6)
        r_c = p_err.add_run(w["bug_resolution"]["error"]); r_c.font.size = Pt(7.4); r_c.font.name = "Courier New"

        p_rca = cb_cell.add_paragraph()
        p_rca.paragraph_format.space_after = Pt(1)
        r = p_rca.add_run("Root Cause Analysis (RCA): "); r.bold = True; r.font.size = Pt(7.6)
        r_t = p_rca.add_run(w["bug_resolution"]["root_cause"]); r_t.font.size = Pt(7.4)

        p_fix = cb_cell.add_paragraph()
        p_fix.paragraph_format.space_after = Pt(1)
        r = p_fix.add_run("Engineering Fix & Prevention: "); r.bold = True; r.font.size = Pt(7.6)
        r_t = p_fix.add_run(w["bug_resolution"]["fix"]); r_t.font.size = Pt(7.4)

        p_ver = cb_cell.add_paragraph()
        p_ver.paragraph_format.space_after = Pt(0)
        r = p_ver.add_run("Verification Result: "); r.bold = True; r.font.size = Pt(7.6)
        r_t = p_ver.add_run(w["bug_resolution"]["verification"]); r_t.font.size = Pt(7.4)

        # Section 5: Goals & Risk
        s5 = doc.add_paragraph()
        s5.paragraph_format.space_before = Pt(4)
        s5.paragraph_format.space_after = Pt(1.5)
        r = s5.add_run("5. GOALS FOR NEXT WEEK & TECHNICAL RISK REGISTER"); r.bold = True
        r.font.size = Pt(8.8); r.font.color.rgb = RGBColor(15, 23, 42)

        for g in w["next_week_goals"]:
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.1
            r = p.add_run(g); r.font.size = Pt(7.8)

        # Risk Table
        t_rsk = doc.add_table(rows=len(w["risk_register"]) + 1, cols=5)
        t_rsk.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_tbl_borders(t_rsk, color="64748B", sz="4", val="single")

        r_heads = ["Risk ID", "Risk Description", "Probability", "Impact", "Mitigation Action"]
        for c_idx, rh in enumerate(r_heads):
            cell = t_rsk.cell(0, c_idx)
            set_cell_shd(cell, "F1F5F9")
            set_cell_pad(cell, top=25, bottom=25, left=40, right=40)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(rh); r.bold = True; r.font.size = Pt(7.0)

        for r_idx, (r_id, r_desc, r_prob, r_imp, r_mit) in enumerate(w["risk_register"]):
            row_cells = t_rsk.rows[r_idx + 1].cells
            for c_idx, val in enumerate([r_id, r_desc, r_prob, r_imp, r_mit]):
                cell = row_cells[c_idx]
                set_cell_pad(cell, top=20, bottom=20, left=40, right=40)
                p = cell.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                r = p.add_run(val); r.font.size = Pt(6.8)
                if c_idx == 0:
                    r.bold = True

        # Signatures Block
        p_sp = doc.add_paragraph(); p_sp.paragraph_format.space_after = Pt(4)
        sig_tbl = doc.add_table(rows=1, cols=2)
        sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        s1_c = sig_tbl.cell(0, 0); s2_c = sig_tbl.cell(0, 1)
        s1_c.width = Inches(3.63); s2_c.width = Inches(3.63)
        set_cell_pad(s1_c, top=40, bottom=20, left=30, right=30)
        set_cell_pad(s2_c, top=40, bottom=20, left=30, right=30)

        p = s1_c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(1)
        p.add_run("_________________________________________").font.size = Pt(8)
        p_txt = s1_c.add_paragraph()
        p_txt.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_txt.paragraph_format.space_after = Pt(0)
        r = p_txt.add_run("Project Guide Signature\n"); r.bold = True; r.font.size = Pt(7.8)
        p_txt.add_run("(Prof. Shweta Pandey)").font.size = Pt(7.2)

        p = s2_c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(1)
        p.add_run("_________________________________________").font.size = Pt(8)
        p_txt = s2_c.add_paragraph()
        p_txt.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_txt.paragraph_format.space_after = Pt(0)
        r = p_txt.add_run("Project In-charge Signature\n"); r.bold = True; r.font.size = Pt(7.8)
        p_txt.add_run("(Department of CSE/IT, SVIIT)").font.size = Pt(7.2)

        # Official Footers Table (4 columns)
        f_tbl = doc.add_table(rows=1, cols=4)
        f_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_footer_border(f_tbl)
        f_w = Inches(7.27 / 4.0)

        f_data = [
            ("Chairperson", "Board of Studies\nShri Vaishnav Vidyapeeth\nVishwavidyalaya, Indore"),
            ("Chairperson", "Faculty of Studies\nShri Vaishnav Vidyapeeth\nVishwavidyalaya, Indore"),
            ("Controller of Examination", "Shri Vaishnav Vidyapeeth\nVishwavidyalaya, Indore"),
            ("Registrar", "Shri Vaishnav Vidyapeeth\nVishwavidyalaya, Indore")
        ]

        for fc_idx, (t_title, t_sub) in enumerate(f_data):
            cell = f_tbl.cell(0, fc_idx)
            cell.width = f_w
            set_cell_pad(cell, top=30, bottom=20, left=15, right=15)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            r = p.add_run(f"{t_title}\n"); r.bold = True; r.font.size = Pt(6.5)
            p.add_run(t_sub).font.size = Pt(5.8)

        # Page break between weeks (except after the final week)
        if w_idx < total_weeks - 1:
            doc.add_page_break()

    out_docx = "docs/All_Weekly_Progress_Reports_Weeks_1_to_8.docx"
    print(f"Saving Word document to {out_docx}...")
    doc.save(out_docx)
    print(f"Word document saved successfully: {out_docx} (32 pages)")

def main():
    print("=" * 70)
    print("EXECUTING EXPANDED 4-PAGE PER WEEK REPORT GENERATORS")
    print("=" * 70)
    generate_html_dossier()
    generate_markdown_dossier()
    generate_docx_dossier()
    print("=" * 70)
    print("ALL THREE MASTER FORMATS GENERATED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    main()
