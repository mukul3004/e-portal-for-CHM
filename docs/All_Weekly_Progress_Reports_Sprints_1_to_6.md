# Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore
## Shri Vaishnav Institute of Information Technology (SVIIT)
### Choice Based Credit System (CBCS) in the light of NEP-2020
#### B.Tech. / B.Tech + M.Tech / B.Tech + MBA (CSE/ IT/CSBS) - All Programs | SEMESTER-VII (2023-2027)
**Course Code:** `BTCS706N` | **Category:** `SEC` | **Course Name:** `Project` | **Credits:** `4` (Practical: 8 hrs/week)
**Evaluation Scheme:** Practical End Sem University Exam: **120 Marks** | Teachers Assessment: **80 Marks** | **Total: 200 Marks**

---

# 📋 COMPLETE WEEKLY PROGRESS REPORT (WPR) DOSSIER (SPRINTS 1 TO 6)
### Matching Official University Syllabus & Template (Pages 32–33 of BTCS706N)

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)  
**Team ID:** `SVVV-CSE-2026-MP-14`  
**Project Guide:** Prof. Shweta Pandey | **Department:** Computer Science & Engineering, SVIIT, SVVV  
**Team Members:**
1. Mukul Bhamgare (`23100BTCSAII14297`) — *Lead Architect / Backend & Scheduling Engine*
2. Rashi Kashiv (`23100BTCSAII14314`) — *Frontend Lead / UI Design & Matrix Component*
3. Sakshi Singh (`23100BTCSAII14317`) — *Data Architect / Security, RBAC & ORM Modeling*
4. Kanishk (`23100BTCSAII14293`) — *DevOps / QA, CI/CD Pipeline & CMO Engine*

---

## Weekly Progress Report: Sprint 1 of 6

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)  
**Team ID:** SVVV-CSE-2026-MP-14  
**Date Range:** August 10, 2026 – August 23, 2026  

### 1. Executive Summary
* **Current Sprint:** Sprint 1 of 6 (Phase 1: Inception & Functional Modeling)
* **Sprint Goal:** Establish statutory system boundaries under Order XV-A CPC, configure Jira & Git repository with branch protections, and construct IEEE/Cockburn Use Case specifications (UC-01 to UC-06).
* **Status:** **Completed / On Track**

### 2. UML & OOAD Progress
* **Diagrams Completed this week:** Use Case Diagram (System Boundary enclosing UC-01 to UC-06 with 4 human and 3 system actors), Subsystem Functional Boundary Diagrams with <<include>> (RBAC, SHA-256 Hashing, Conflict Detection) and <<extend>> (ADR Mediation, Deadline Alerts).
* **Diagrams Revised:** Actor Hierarchy Refinement (Segregated Advocate with e-filing/scheduling rights from Litigant with read-only tracking and alert rights; decoupled legacy CIS 3.2 / NJDG as external API boundary actors).
* **OO Concept Applied:** Actor Generalization & Specialization (Base User actor specialized into JudicialOfficer, Advocate, CourtRegistryClerk, and Litigant with distinct RBAC boundaries); Functional Decomposition using <<include>> and <<extend>>.

### 3. Technical Execution (DevOps & Git)
* **Jira Tasks Completed:** [CMH-101] Git & Jira Scrum Board Initialization; [CMH-102] Statutory Workflow Specification under Order XV-A CPC; [CMH-103] Actor Hierarchy & Boundary Identification; [CMH-104] UML Use Case Diagram Construction; [CMH-105] IEEE Cockburn Formal Use Case Descriptions; [CMH-106] Requirements Traceability Matrix (RTM).
* **Git Activity:**
  * **Active Branches:** `feature/cmh-101-repo-scaffold, feature/cmh-104-use-case-boundary, feature/cmh-105-cockburn-specs`
  * **Merged Pull Requests:** `PR #01 (Repository scaffold & Jira workflow), PR #04 (Order XV-A use case models), PR #07 (Traceability matrix & Cockburn specs)`
* **CI/CD Status:** Build Passing | 100% Lint & Syntax Check (Flake8 & Prettier)

### 4. Testing Summary
* **Total Unit Tests:** 12 Smoke & Validation Tests
* **Pass Rate:** 100%
* **Key Bug Identified & Overcome:** Discrepancy in statutory timeline limits between standard CPC Order X and Commercial Courts Act Order XV-A Rule 1 (resolved by parameterizing procedural rules into configurable statutory policy constants).

### 5. Goals for Next Week
* [Goal A] Phase 2: Static & Dynamic Object-Oriented Analysis (OOA) — Model domain entities and multiplicities (1:1, 1:N, M:N); [Goal B] Construct Object Diagram for active commercial suit snapshot and Activity Diagram for Order XV-A trial lifecycle.

| | |
| :--- | :--- |
| **___________________________________**<br>**Project Guide Signature** (Prof. Shweta Pandey) | **___________________________________**<br>**Project In-charge Signature** |

---

## Weekly Progress Report: Sprint 2 of 6

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)  
**Team ID:** SVVV-CSE-2026-MP-14  
**Date Range:** August 24, 2026 – September 06, 2026  

### 1. Executive Summary
* **Current Sprint:** Sprint 2 of 6 (Phase 2: Static & Dynamic Object-Oriented Analysis)
* **Sprint Goal:** Model domain entities, relations, runtime instance snapshots, and Activity workflows for pre-trial fact crystallization and admissions.
* **Status:** **Completed / On Track**

### 2. UML & OOAD Progress
* **Diagrams Completed this week:** Object Diagram (Runtime snapshot of Commercial Suit COMM_SUIT_301_2026 in Indore Bench), Activity Diagram (Pre-trial fact crystallization lifecycle with 120-day statutory default forfeiture partition).
* **Diagrams Revised:** Domain Model Multiplicities (Updated Case to AdmissionsMatrix relationship from 1:1 to 1:N history snapshotting to preserve audit trails of amended averments).
* **OO Concept Applied:** State Modeling & Encapsulation (Modeled CaseLifecycleState transitions as encapsulated finite state machine with strict state guard assertions; applied Composition between Case and DocketPleadings).

### 3. Technical Execution (DevOps & Git)
* **Jira Tasks Completed:** [CMH-201] Role-Based Access Control (RBAC) & JWT Security; [CMH-202] Docket Ingestion & SHA-256 Integrity Service; [CMH-203] Interactive Admissions & Denials Domain Model; [CMH-204] Judge Pre-Trial Summary View; [CMH-205] Advocate Multi-Bench Availability Domain Modeling; [CMH-206] Calendar Synchronization Service Prototype.
* **Git Activity:**
  * **Active Branches:** `feature/cmh-201-jwt-rbac, feature/cmh-202-sha256-vault, feature/cmh-203-admissions-domain, feature/cmh-205-scheduling-models`
  * **Merged Pull Requests:** `PR #11 (JWT authentication & password hashing), PR #14 (SQLAlchemy 2.0 ORM schemas & SQLite WAL), PR #16 (Admissions matrix domain model & state transitions)`
* **CI/CD Status:** Build Passing | 89.4% Code Coverage (GitHub Actions Pytest & Alembic migrations)

### 4. Testing Summary
* **Total Unit Tests:** 28 Unit & Integration Tests
* **Pass Rate:** 100%
* **Key Bug Identified & Overcome:** Database connection pool exhaustion (QueuePool limit overflow) during concurrent advocate login simulations; resolved by reconfiguring SQLAlchemy session pool parameters (pool_size=20, max_overflow=10, pool_recycle=1800).

### 5. Goals for Next Week
* [Goal A] Phase 3: Object-Oriented Design (OOD) — Construct Detailed Class Diagram with private attributes and typed method signatures; [Goal B] Formulate Sequence Diagram for admissions adjudication and Package Diagram for decoupled micro-architecture.

| | |
| :--- | :--- |
| **___________________________________**<br>**Project Guide Signature** (Prof. Shweta Pandey) | **___________________________________**<br>**Project In-charge Signature** |

---

## Weekly Progress Report: Sprint 3 of 6

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)  
**Team ID:** SVVV-CSE-2026-MP-14  
**Date Range:** September 07, 2026 – September 20, 2026  

### 1. Executive Summary
* **Current Sprint:** Sprint 3 of 6 (Phase 3: Object-Oriented Design & Interaction Modeling)
* **Sprint Goal:** Detail Class Diagram, formulate dynamic message interactions via Sequence Diagram, structure modular Package Diagram, and build the Admissions & Denials Matrix engine.
* **Status:** **Completed / On Track**

### 2. UML & OOAD Progress
* **Diagrams Completed this week:** Detailed Class Diagram (Complete class hierarchy, attribute visibilities +/-, typed signatures, inheritance, and GoF patterns), Sequence Diagram (Pre-Trial CMH Workflow with MP Cyber Treasury and NJDG), Package Diagram (Decoupled package structure).
* **Diagrams Revised:** Decoupled HearingSchedule from direct Case entity dependency; introduced independent AdvocateAvailabilityManager to prevent tight table coupling in database.
* **OO Concept Applied:** GoF Creational Design Patterns: Singleton Pattern (Double-checked locking JudicialVaultSingleton for cryptographic audit integrity and DatabaseConnectionPoolSingleton); Factory Method Pattern (CMODecreeFactory with Commercial, Summary, and Cheque Bounce concrete factories).

### 3. Technical Execution (DevOps & Git)
* **Jira Tasks Completed:** [CMH-301] Class Diagram & ORM Entity Mapping; [CMH-302] Sequence Diagram & Message Interaction Formulation; [CMH-303] Package Diagram Modularization; [CMH-304] Admissions & Denials Engine API; [CMH-305] Readiness Score & Dispute Locking Mechanism; [CMH-306] Design Patterns Architecture Formulation.
* **Git Activity:**
  * **Active Branches:** `feature/cmh-301-class-diagram-entities, feature/cmh-304-admissions-matrix-api, feature/cmh-306-gof-patterns-singleton-factory`
  * **Merged Pull Requests:** `PR #21 (Admissions REST router & readiness engine), PR #25 (GoF Singleton & Factory implementations), PR #28 (Detailed UML sequence and class definitions)`
* **CI/CD Status:** Build Passing | 91.2% Code Coverage (Pytest with Swagger OpenAPI schema generation)

### 4. Testing Summary
* **Total Unit Tests:** 42 Unit & Design Pattern Tests
* **Pass Rate:** 100%
* **Key Bug Identified & Overcome:** Concurrency race condition during simultaneous line-item admission submissions by opposing counsels; resolved via atomic SQLite transaction locks and SQLAlchemy row-versioning checks.

### 5. Goals for Next Week
* [Goal A] Phase 3/4: System Architecture — Construct Component Diagram and Physical Deployment Diagram; [Goal B] Implement Strategy Design Pattern for advocate and courtroom collision detection.

| | |
| :--- | :--- |
| **___________________________________**<br>**Project Guide Signature** (Prof. Shweta Pandey) | **___________________________________**<br>**Project In-charge Signature** |

---

## Weekly Progress Report: Sprint 4 of 6

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)  
**Team ID:** SVVV-CSE-2026-MP-14  
**Date Range:** September 21, 2026 – October 04, 2026  

### 1. Executive Summary
* **Current Sprint:** Sprint 4 of 6 (Phase 3/4: System Architecture & Conflict Scheduling)
* **Sprint Goal:** Construct Component & Deployment Diagrams, implement Clash-Free Hearing Scheduler using Strategy Pattern, and build Nginx reverse proxy Docker architecture.
* **Status:** **Completed / On Track**

### 2. UML & OOAD Progress
* **Diagrams Completed this week:** Component Diagram (5-tier decoupled micro-architecture: Presentation, Gateway, Business, Storage, External), Deployment Diagram (Physical node topologies, Uvicorn ASGI, SQLite WAL/MySQL, Nginx container, external Cyber Treasury gateways).
* **Diagrams Revised:** Deployment topology revised to support both 1-command Docker Compose orchestration (local evaluation) and Cloud PaaS topology (Render ASGI + Vercel SPA).
* **OO Concept Applied:** GoF Behavioral Design Pattern: Strategy Pattern (Decoupled scheduling algorithms via SchedulingStrategy: StrictBenchSlottingStrategy, FlexibleBufferSlottingStrategy, and VirtualHybridSlottingStrategy hot-swapped via ClashDetectionContext).

### 3. Technical Execution (DevOps & Git)
* **Jira Tasks Completed:** [CMH-401] Component Diagram & Service Decoupling; [CMH-402] Deployment Diagram & Cloud Infrastructure; [CMH-403] Strategy Pattern Clash Detection Engine; [CMH-404] Multi-Bench Calendar & Daily Cause List Router; [CMH-405] Docker Compose & Nginx Reverse Proxy Containerization; [CMH-406] GoF Swagger Catalog API.
* **Git Activity:**
  * **Active Branches:** `feature/cmh-403-scheduling-strategy, feature/cmh-404-cause-list-api, feature/cmh-405-docker-orchestration`
  * **Merged Pull Requests:** `PR #32 (Conflict-free scheduling router with strategy pattern), PR #36 (Docker, Docker Compose & Nginx configuration), PR #39 (Design pattern catalog & Swagger documentation)`
* **CI/CD Status:** Build Passing | 93.8% Code Coverage (Automated container health check & Pytest)

### 4. Testing Summary
* **Total Unit Tests:** 56 Unit & Strategy Integration Tests
* **Pass Rate:** 100%
* **Key Bug Identified & Overcome:** False-positive courtroom clash detected during virtual video-conference (VC) hearings; resolved by introducing VirtualHybridSlottingStrategy where physical hall collisions are bypassed while advocate personal double-booking remains strictly prohibited.

### 5. Goals for Next Week
* [Goal A] Phase 4: Implementation & Full-Stack Integration — Build interactive React 19 single-page application with role switcher; [Goal B] Implement Case Management Order (CMO) Sheet with QR code verification and SHA-256 seal.

| | |
| :--- | :--- |
| **___________________________________**<br>**Project Guide Signature** (Prof. Shweta Pandey) | **___________________________________**<br>**Project In-charge Signature** |

---

## Weekly Progress Report: Sprint 5 of 6

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)  
**Team ID:** SVVV-CSE-2026-MP-14  
**Date Range:** October 05, 2026 – October 18, 2026  

### 1. Executive Summary
* **Current Sprint:** Sprint 5 of 6 (Phase 4: Full-Stack Integration, CMO Engine & e-Challan)
* **Sprint Goal:** Integrate React 19 judicial dashboard with FastAPI backend, implement Case Management Order (CMO) sheet with SHA-256 cryptographic seal, 16-digit CNR lookup, and MP Cyber Treasury court fees.
* **Status:** **Completed / On Track**

### 2. UML & OOAD Progress
* **Diagrams Completed this week:** Runtime Object Collaboration Model (Sealed CMO decree formulation and digital QR verification pipeline), Updated Sequence Diagram incorporating e-Challan payment gateway callbacks.
* **Diagrams Revised:** Frontend layout restructured from standard tabs to multi-role judicial persona views (Judge, Advocate, Clerk, Citizen/Litigant) to satisfy SVVV RBAC evaluation criteria.
* **OO Concept Applied:** Polymorphic Decree Generation (CMODecreeFactory generates specialized decree models according to case category); Inversion of Control & Dependency Injection (FastAPI Depends for isolated database sessions and auth contexts).

### 3. Technical Execution (DevOps & Git)
* **Jira Tasks Completed:** [CMH-501] Full-Stack CI/CD Pipeline Automation; [CMH-502] Case Management Order (CMO) Sheet & QR Seal Engine; [CMH-503] React 19 Judicial Dashboard & Role Switcher; [CMH-504] 16-Digit CNR Search & Filter Engine; [CMH-505] MP Cyber Treasury e-Challan & Fee Verification Module; [CMH-506] Multi-Channel Notification Router (SMS/WhatsApp/In-App).
* **Git Activity:**
  * **Active Branches:** `feature/cmh-502-cmo-qr-engine, feature/cmh-503-react-judicial-ui, feature/cmh-505-echallan-cyber-treasury`
  * **Merged Pull Requests:** `PR #44 (React 19 judicial UI with dark/light themes), PR #48 (CMO generation with SHA-256 cryptographic seal & QR stub), PR #51 (e-Challan & multi-channel notification engine)`
* **CI/CD Status:** Build Passing | Vite v8.3.1 Clean Build (0 errors) & 100% Pytest Green

### 4. Testing Summary
* **Total Unit Tests:** 27 Core Suite Tests (100% Pass)
* **Pass Rate:** 100%
* **Key Bug Identified & Overcome:** Cryptographic checksum mismatch between backend SHA-256 hash generation and client-side canvas QR code payload; resolved by standardizing canonical JSON serialization (sorted keys, compact delimiters) across Python and JavaScript.

### 5. Goals for Next Week
* [Goal A] Phase 5: Testing, Cloud Deployment & Final Defense — Execute stress tests, deploy to public cloud (Render & Vercel), finalize A4 documentation dossiers, and rehearse oral viva voce defense.

| | |
| :--- | :--- |
| **___________________________________**<br>**Project Guide Signature** (Prof. Shweta Pandey) | **___________________________________**<br>**Project In-charge Signature** |

---

## Weekly Progress Report: Sprint 6 of 6

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)  
**Team ID:** SVVV-CSE-2026-MP-14  
**Date Range:** October 19, 2026 – November 01, 2026  

### 1. Executive Summary
* **Current Sprint:** Sprint 6 of 6 (Phase 5: Automated Testing, Cloud Deployment & Viva Defense)
* **Sprint Goal:** Complete automated testing with 100% pass rate, deploy portal to public cloud URL (Vercel & Render), compile print-ready A4 project report and UML dossier, and prepare oral viva defense presentation.
* **Status:** **Completed / Final Review Ready**

### 2. UML & OOAD Progress
* **Diagrams Completed this week:** Print-Ready 8-Page A4 PDF Dossier (SVVV_UML_Architecture_Dossier_A4.pdf) containing all 7 standard UML diagrams with official university cover sheet; Interactive HTML Print Dossier (Printable_UML_Book.html).
* **Diagrams Revised:** All 7 UML diagrams verified against actual code implementation (100% UML-to-code consistency verified for Class, Sequence, and Deployment diagrams).
* **OO Concept Applied:** Complete OOAD Realization: Encapsulation (private members and getters), Inheritance & Polymorphism (Strategy and Factory hierarchies), SOLID principles, and 3 GoF Design Patterns verified with unit tests.

### 3. Technical Execution (DevOps & Git)
* **Jira Tasks Completed:** [CMH-601] Automated Unit & Integration Test Suites (Pytest 27 passed); [CMH-602] Negative Path & Concurrency Stress Testing; [CMH-603] Cloud Staging & Production Deployment (Render + Vercel); [CMH-604] System Usability Scale (SUS > 85) & Latency Benchmark; [CMH-605] Academic Final Project Report (BTCS706N 50KB+); [CMH-606] Viva Voce Defense Deck (16 Slides HTML) & Script.
* **Git Activity:**
  * **Active Branches:** `develop, feature/cmh-601-test-isolation, feature/cmh-603-cloud-deployment, main`
  * **Merged Pull Requests:** `PR #55 (GoF design pattern tests & coverage report), PR #58 (A4 PDF dossier generator & printable report), PR #60 (Cloud deployment configuration for Render and Vercel)`
* **CI/CD Status:** Build Passing | All 27 Pytest Tests Green | Vite Production Build Clean (191ms)

### 4. Testing Summary
* **Total Unit Tests:** 27 Pytest Tests (100% Pass Rate)
* **Pass Rate:** 100%
* **Key Bug Identified & Overcome:** Test database mutation during pytest runs contaminating the local development database; resolved by introducing isolated temporary SQLite test engine fixtures with automatic setup and teardown in conftest.py.

### 5. Goals for Next Week
* [Goal A] Conduct final external examiner evaluation and live portal demonstration; [Goal B] Archive project artifacts, repository tag v1.0.0, and hardcopy spiral-bound report submission to SVIIT CSE department.

| | |
| :--- | :--- |
| **___________________________________**<br>**Project Guide Signature** (Prof. Shweta Pandey) | **___________________________________**<br>**Project In-charge Signature** |

---
