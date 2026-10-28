# Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore
## Shri Vaishnav Institute of Information Technology (SVIIT)
### Department of Computer Science & Engineering
---
# MAJOR PROJECT (BTCS706N) COURSEWORK SPECIFICATION
## Jira Sprint & Product Backlog Specification
### Matching the Official SVVV 7th Semester B.Tech Major Project Syllabus & Evaluation Table

* **Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)
* **Course Code:** `BTCS706N` (SEC Project, 8 Credits, 200 Marks Total: 120 Practical End Sem + 80 Teacher Assessment)
* **Academic Year:** 2026 – 2027
* **Project Guide:** Prof. Shweta Pandey
* **Team ID:** `SVVV-CSE-2026-MP-14`
* **Team Members:**
  1. **Mukul Bhamgare** (`23100BTCSAII14297`) — *Lead Architect / Backend & Scheduling Engine*
  2. **Rashi Kashiv** (`23100BTCSAII14314`) — *Frontend Lead / UI Design & Matrix Component*
  3. **Sakshi Singh** (`23100BTCSAII14317`) — *Data Architect / Security, RBAC & ORM Modeling*
  4. **Kanishk** (`23100BTCSAII14293`) — *DevOps / QA, CI/CD Pipeline & CMO Engine*

---

## 1. Executive Alignment with University Syllabus (BTCS706N)

As prescribed in the **SVVV B.Tech Semester-VII Major Project Syllabus Table (Pages 23–32)**, the project lifecycle is structured into **5 Academic Phases** spanning **12 Weeks**, mapped directly to **Six 2-Week Agile Sprints** on Jira:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        SVVV BTCS706N SYLLABUS TO JIRA SPRINT MAPPING                                   │
├─────────┬──────────────────────┬─────────────┬─────────────────────────────────┬───────────────────────┤
│ Phase   │ Syllabus Milestone   │ Weeks       │ Jira Sprint                     │ Focus Deliverables    │
├─────────┼──────────────────────┼─────────────┼─────────────────────────────────┼───────────────────────┤
│ Phase 1 │ Planning & Reqmts    │ Weeks 1–2   │ Sprint 1: Inception & Modeling  │ Vision, Boundary, UC  │
│ Phase 2 │ OO Analysis (OOA)    │ Weeks 3–4   │ Sprint 2: Static & Dynamic OOA  │ Object & Activity Dia │
│ Phase 3 │ OO Design (OOD)      │ Weeks 5–6   │ Sprint 3: Interaction & Design  │ Sequence, Class, Pkg  │
│ Phase 3 │ System Architecture  │ Week 7      │ Sprint 4: Architecture & Core   │ Component & Deploy    │
│ Phase 4 │ Implementation/CI-CD │ Weeks 8–10  │ Sprint 5: Full-Stack & Pipeline │ GitHub Actions & APIs │
│ Phase 5 │ Testing & Deployment │ Weeks 11–12 │ Sprint 6: QA, Cloud & Defense   │ PyTest, Live URL, Viva│
└─────────┴──────────────────────┴─────────────┴─────────────────────────────────┴───────────────────────┘
```

---

## 2. Jira Project Configuration & Hierarchy

* **Project Name:** `e-Portal for Case Management Hearing (Order XV-A CPC)`
* **Project Key:** `CMH`
* **Board Type:** Jira Scrum Board (2-Week Iterations)
* **Estimation Statistic:** Story Points (Fibonacci Scale: 1, 2, 3, 5, 8, 13)
* **Total Product Backlog Story Points:** 108 Story Points

### 2.1 Jira Epics Breakdown (Syllabus Structure Alignment)

| Epic Key | Epic Name | Syllabus Phase Reference | Owner | Target Timeline |
| :--- | :--- | :--- | :--- | :---: |
| **`CMH-EPIC-1`** | **Requirements & System Boundary** | Phase 1 (Weeks 1–2) | Mukul B. | Sprint 1 |
| **`CMH-EPIC-2`** | **Object-Oriented Analysis & Domain Models** | Phase 2 (Weeks 3–4) | Sakshi S. | Sprint 2 |
| **`CMH-EPIC-3`** | **Admissions & Denials Matrix Engine** | Phase 3 (Weeks 5–6) | Rashi K. | Sprint 3 |
| **`CMH-EPIC-4`** | **Conflict-Free Courtroom Scheduling** | Phase 3 (Weeks 6–7) | Mukul B. | Sprint 4 |
| **`CMH-EPIC-5`** | **CI/CD, In-Browser WebRTC & Orders** | Phase 4 (Weeks 8–10) | Kanishk | Sprint 5 |
| **`CMH-EPIC-6`** | **Automated Testing, Deployment & Viva** | Phase 5 (Weeks 11–12) | All Members | Sprint 6 |

---

## 3. Official University Definition of Done (DoD) Checklist

Per the **SVVV Major Project Syllabus (Page 30)**, a Jira ticket is marked **"DONE"** only when all four mandatory conditions are satisfied:

1. **Design & Modeling:**
   * Any change in code structure is mapped back to the Class Diagram.
   * Complex procedural logic is validated against the Sequence / Activity Diagram.
   * Classes and functions are documented using standard docstrings.
2. **Code Quality & Standards:**
   * Strict adherence to Object-Oriented SOLID principles; no "God Classes".
   * Zero hardcoded credentials or database URLs; strictly managed via `.env`.
   * Mandatory Git Pull Request (PR) peer review with at least one approval.
3. **Testing & CI/CD Pipeline:**
   * Unit test suite exists with passing assertions (`pytest`).
   * GitHub Actions CI/CD pipeline is Green (Passing).
   * Zero regressions in core docket or authentication flows.
4. **Integration & Traceability:**
   * Feature branch merged into `develop` branch without merge conflicts.
   * Jira issue transitioned to "Done" with logged time and PR link.

---

## 4. Comprehensive Jira Sprint & Backlog Breakdown

### SPRINT 1 (Weeks 1–2): Inception, Requirements Analysis & Functional Modeling
* **Syllabus Goal:** Define scope, set up Jira & Git, identify Actors and Use Cases, construct Use Case Diagram & Descriptions.
* **Sprint Goal:** Establish system boundaries under Order XV-A CPC, configure Jira & Git repository with branch protections, and construct IEEE/Cockburn Use Case specifications (UC-01 to UC-06).
* **Sprint Velocity:** 16 Story Points | **Status:** Completed (Sprint 1)

| Jira ID | Type | Epic | Summary & User Story | Acceptance Criteria (Gherkin Format) | Points | Assignee |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **CMH-101** | `Task` | `EPIC-1` | **Git & Jira Scrum Board Initialization**<br>*As an* Engineering Team,<br>*We want* standard branch rules and Jira Scrum board,<br>*So that* team collaboration complies with syllabus. | **Given** the GitHub repository `e-portal-for-CHM`,<br>**When** repository rules are set,<br>**Then** direct commits to `main` and `develop` are blocked, requiring PR approvals. | 2 | Mukul B. |
| **CMH-102** | `Story` | `EPIC-1` | **Statutory Workflow Specification under Order XV-A**<br>*As a* System Analyst,<br>*I want to* map CPC Order XV-A procedural rules,<br>*So that* system states model commercial court requirements. | **Given** the Commercial Courts Act 2015,<br>**When** rules are analyzed,<br>**Then** statutory limits (4-week CMH window, 15-day admission window) are formalized into system constraints. | 3 | Mukul B. |
| **CMH-103** | `Story` | `EPIC-1` | **Actor Hierarchy & Boundary Identification**<br>*As an* Architect,<br>*I want to* delineate human & system actors,<br>*So that* external boundaries are strictly defined. | **Given** court interactions,<br>**When** actors are classified,<br>**Then** 4 human actors (Judge, Advocate, Clerk, Litigant) and 3 system daemons (Scheduling, Alerts, SHA-256) are isolated. | 3 | Sakshi S. |
| **CMH-104** | `Story` | `EPIC-1` | **UML Use Case Diagram Construction**<br>*As a* Designer,<br>*I want to* model use case relations with include/extend,<br>*So that* functional boundaries are diagrammed. | **Given** 6 primary use cases (UC-01 to UC-06),<br>**When** relations are drawn,<br>**Then** `<<include>>` (Auth, Hash, Clash-check) and `<<extend>>` (ADR mediation, Alerts) are modeled in Mermaid & PlantUML. | 3 | Rashi K. |
| **CMH-105** | `Story` | `EPIC-1` | **IEEE Cockburn Formal Use Case Descriptions**<br>*As a* Technical Writer,<br>*I want* exhaustive Cockburn specifications,<br>*So that* pre-conditions, main flows, and exceptions are clear. | **Given** Use Cases UC-01 through UC-06,<br>**When** specifications are drafted,<br>**Then** each use case includes Actor, Pre/Post-conditions, Main Success Scenario, and Alternative Flows. | 3 | Kanishk |
| **CMH-106** | `Task` | `EPIC-1` | **Requirements Traceability Matrix (RTM)**<br>*As a* QA Lead,<br>*I want* a bi-directional RTM,<br>*So that* statutory CPC rules map directly to Jira tickets. | **Given** 6 legal mandates from Order XV-A,<br>**When** mapped to tickets,<br>**Then** every statutory rule maps to at least one Jira User Story and Test Verification Method. | 2 | Sakshi S. |

---

### SPRINT 2 (Weeks 3–4): Object-Oriented Analysis (Static & Dynamic Modeling)
* **Syllabus Goal:** Understand the "What" of the system. Construct Object Diagram (data snapshot), Domain Model Class Diagram (multiplicities without methods), and Activity Diagram (complex workflows).
* **Sprint Goal:** Model domain entities, relations (1:1, 1:N, M:N), runtime instance snapshots, and Activity workflows for pre-trial fact crystallization.
* **Sprint Velocity:** 19 Story Points | **Status:** Completed (Sprint 2)

| Jira ID | Type | Epic | Summary & User Story | Acceptance Criteria (Gherkin Format) | Points | Assignee |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **CMH-201** | `Story` | `EPIC-2` | **Role-Based Access Control (RBAC) & JWT Security**<br>*As a* Court User,<br>*I want to* authenticate securely with JWT tokens,<br>*So that* unauthorized users cannot access docket files. | **Given** valid credentials and OTP,<br>**When** `POST /api/v1/auth/login` is executed,<br>**Then** a signed JWT payload with role (`ROLE_JUDGE`, `ROLE_ADVOCATE`, `ROLE_CLERK`) is returned within 300ms. | 3 | Sakshi S. |
| **CMH-202** | `Story` | `EPIC-2` | **Docket Ingestion & SHA-256 Integrity Service**<br>*As an* Advocate,<br>*I want* petition PDFs hashed with SHA-256,<br>*So that* uploaded pleadings are tamper-proof. | **Given** an uploaded PDF/A petition,<br>**When** file upload completes,<br>**Then** the backend computes a 64-char hexadecimal SHA-256 hash stored in the docket database table. | 3 | Mukul B. |
| **CMH-203** | `Story` | `EPIC-2` | **Initial Class Diagram (Domain Model)**<br>*As an* Architect,<br>*I want to* model domain entities and multiplicities,<br>*So that* data relationships are structurally defined. | **Given** core court entities,<br>**When** domain diagram is generated,<br>**Then** classes `Case`, `Pleading`, `AdmissionsMatrix`, `HearingSlot`, `CMO` reflect 1:1, 1:N, and M:N multiplicity without methods. | 3 | Sakshi S. |
| **CMH-204** | `Story` | `EPIC-2` | **UML Object Diagram (Runtime Dispute Snapshot)**<br>*As an* Analyst,<br>*I want to* model an active case snapshot,<br>*So that* live memory instance attributes are verified. | **Given** active dispute `MPIN010012342026`,<br>**When** object diagram is rendered,<br>**Then** concrete instances for `Judge:Sharma`, `Case:MP-2026`, `AdmitMatrix:v2` display populated runtime values. | 3 | Rashi K. |
| **CMH-205** | `Story` | `EPIC-2` | **UML Activity Diagram (Order XV-A Workflow)**<br>*As a* Systems Modeler,<br>*I want to* model pre-trial state transitions,<br>*So that* decision branches and concurrency are visualized. | **Given** case filing to CMO issuance,<br>**When** activity diagram is evaluated,<br>**Then** parallel swimlanes for Judge, Advocate, and Clerk depict fork/join synchronizations for admissions and scheduling. | 4 | Kanishk |
| **CMH-206** | `Story` | `EPIC-2` | **Relational Schema & Seed Corpus (100+ Indian Cases)**<br>*As a* Database Engineer,<br>*I want* SQLite/MySQL models with real case data,<br>*So that* pre-trial workflows can be simulated realistically. | **Given** verified Indian High Court & District Court records,<br>**When** database seed runs,<br>**Then** 100+ real case records with valid 16-character CNR numbers populate the database cleanly. | 3 | Mukul B. |

---

### SPRINT 3 (Weeks 5–6): Object-Oriented Design & Interaction Modeling
* **Syllabus Goal:** Define the "How". Construct Sequence Diagrams, Detailed Class Diagram (SOLID, design patterns, methods), and Package Diagram (subsystem tiering).
* **Sprint Goal:** Implement the Admissions & Denials Matrix state machine, Sequence Diagrams for synchronous/asynchronous flows, and Package Diagram mapping to folder layout.
* **Sprint Velocity:** 20 Story Points | **Status:** Completed (Sprint 3)

| Jira ID | Type | Epic | Summary & User Story | Acceptance Criteria (Gherkin Format) | Points | Assignee |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **CMH-301** | `Story` | `EPIC-3` | **UML Sequence Diagram: Pre-Trial Admissions Flow**<br>*As a* Software Designer,<br>*I want to* model message calls between actors & services,<br>*So that* invocation order and database transactions are clear. | **Given** the admissions reconciliation flow,<br>**When** sequence diagram is drawn,<br>**Then** lifelines for Advocate, API Router, MatrixService, and Database show exact method invocations and async locks. | 3 | Mukul B. |
| **CMH-302** | `Story` | `EPIC-3` | **UML Package Diagram (4-Tier Architecture)**<br>*As an* Architect,<br>*I want* a Package Diagram matching folder layout,<br>*So that* architectural separation of concerns is maintained. | **Given** project code layout,<br>**When** package diagram is drafted,<br>**Then** Presentation, API Routers, Service Logic, Domain Models, and Infrastructure packages map 1:1 to directory paths. | 3 | Kanishk |
| **CMH-303** | `Story` | `EPIC-3` | **UML Detailed Class Diagram with Design Patterns**<br>*As a* Lead Developer,<br>*I want* full class specifications with patterns,<br>*So that* OOP principles (Factory, Strategy, Observer) are implemented. | **Given** system classes,<br>**When** detailed diagram is authored,<br>**Then** visibility (`+`, `-`, `#`), parameter types, and patterns (CMO Factory, Clash Strategy) are explicitly depicted. | 5 | Sakshi S. |
| **CMH-304** | `Story` | `EPIC-3` | **Admissions & Denials Matrix State Machine**<br>*As an* Advocate,<br>*I want to* mark claims as Admitted, Denied, or Proof Required,<br>*So that* undisputed facts automatically lock. | **Given** opposing statements of claim,<br>**When** advocate selects 'Admit' or 'Deny',<br>**Then** mutual admissions lock into the permanent record, and disputed claims populate the Issues Dossier. | 5 | Rashi K. |
| **CMH-305** | `Story` | `EPIC-3` | **Judge Admissions Review & Crystallization Dossier**<br>*As a* Judicial Officer,<br>*I want to* view a crystallized summary of admissions,<br>*So that* bench time focuses strictly on triable questions. | **Given** concluded admissions matrices,<br>**When** Judge opens case docket,<br>**Then** green badge displays settled facts and amber badge isolates contested points of dispute. | 4 | Rashi K. |

---

### SPRINT 4 (Weeks 7–8): System Architecture & Core Engine Implementation
* **Syllabus Goal:** Construct Component & Deployment Diagrams. Implement core project-specific logic (Scheduling Engine, WebSockets/WebRTC) using feature branches.
* **Sprint Goal:** Build the cross-courtroom conflict-detection algorithm, deliver Component & Deployment diagrams, and integrate calendar sync (.ics).
* **Sprint Velocity:** 19 Story Points | **Status:** Completed (Sprint 4)

| Jira ID | Type | Epic | Summary & User Story | Acceptance Criteria (Gherkin Format) | Points | Assignee |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **CMH-401** | `Story` | `EPIC-4` | **UML Component Diagram (Module Decoupling)**<br>*As an* Architect,<br>*I want to* diagram physical software components,<br>*So that* interfaces between UI, API, DB, and WebRTC are clear. | **Given** system modules,<br>**When** component diagram is constructed,<br>**Then** 9 decoupled components with provided/required ports and dependencies are visualized. | 3 | Mukul B. |
| **CMH-402** | `Story` | `EPIC-4` | **UML Deployment Diagram (Hardware / Cloud Nodes)**<br>*As a* DevOps Engineer,<br>*I want* a deployment diagram mapping runtime nodes,<br>*So that* server execution and protocol flows are documented. | **Given** hosting infrastructure,<br>**When** deployment diagram is authored,<br>**Then** Client Web Browser, ASGI Application Server, Database Server, and WebRTC Media Gateway are modeled. | 3 | Kanishk |
| **CMH-403** | `Story` | `EPIC-4` | **Algorithmic Conflict-Free Scheduling Engine**<br>*As a* Court Master / Clerk,<br>*I want* the system to detect advocate schedule clashes,<br>*So that* hearings are scheduled without double-booking. | **Given** counsels' Bar IDs across courtrooms,<br>**When** slot is selected,<br>**Then** `ClashDetectionEngine` checks concurrent courtroom rosters and flags overlaps with zero false negatives. | 5 | Mukul B. |
| **CMH-404** | `Story` | `EPIC-4` | **Automated Calendar Sync (.ICS) & Timetable API**<br>*As an* Advocate,<br>*I want to* export hearing schedules to Google/Outlook,<br>*So that* hearing summons synchronize with personal calendars. | **Given** a confirmed CMH booking,<br>**When** confirmation payload is generated,<br>**Then** standard RFC-5545 `.ics` file is generated and attached with virtual hearing room link. | 3 | Kanishk |
| **CMH-405** | `Story` | `EPIC-4` | **Section 89 CPC Mediation Referral Branch**<br>*As a* Judge,<br>*I want to* refer cases to mediation with 1-click,<br>*So that* ADR is facilitated before trial per Section 89 CPC. | **Given** an open CMH session,<br>**When** Judge selects 'Refer to Mediation',<br>**Then** status updates to `ADR_MEDIATION` and trial countdown clocks freeze for 30 statutory days. | 3 | Rashi K. |
| **CMH-406** | `Story` | `EPIC-4` | **In-Browser WebRTC Virtual Courtroom Module**<br>*As a* Judicial Officer,<br>*I want* in-browser split-screen video conferencing,<br>*So that* hearings occur alongside live case exhibits. | **Given** a scheduled hearing time,<br>**When** room is launched,<br>**Then** WebRTC stream activates side-by-side with interactive evidence checklist. | 2 | Rashi K. |

---

### SPRINT 5 (Weeks 9–10): CI/CD Automation, Full-Stack Integration & Automated Orders
* **Syllabus Goal:** Configure GitHub Actions CI/CD pipeline, integrate React frontend with FastAPI backend, and develop automated Case Management Order (CMO) engine.
* **Sprint Goal:** Establish automated CI/CD pipeline triggering on every PR, connect React 19 UI with role-based personas, and generate signed CMO PDF orders with QR verification.
* **Sprint Velocity:** 18 Story Points | **Status:** Active / In-Review (Sprint 5)

| Jira ID | Type | Epic | Summary & User Story | Acceptance Criteria (Gherkin Format) | Points | Assignee |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **CMH-501** | `Task` | `EPIC-5` | **CI/CD Pipeline Setup (GitHub Actions)**<br>*As a* Developer,<br>*I want* automated linting, test execution, and schema checks,<br>*So that* broken code cannot be merged into `develop`. | **Given** any Pull Request to `develop`,<br>**When** commit is pushed,<br>**Then** GitHub Actions runs `flake8`, `black --check`, and `pytest` with mandatory pass status. | 3 | Kanishk |
| **CMH-502** | `Story` | `EPIC-5` | **Automated Case Management Order (CMO) PDF Engine**<br>*As a* Judge,<br>*I want to* generate a standardized CMO PDF in 1 click,<br>*So that* binding trial timetables and framed issues are sealed. | **Given** concluded hearing parameters,<br>**When** Judge clicks 'Approve & Issue CMO',<br>**Then** a styled PDF/A order with verification QR code is compiled and stored within 5 seconds. | 5 | Mukul B. |
| **CMH-503** | `Story` | `EPIC-5` | **React 19 Judicial Dashboard & Role Switcher**<br>*As a* User,<br>*I want* a clean, role-specific UI (Judge, Counsel, Clerk),<br>*So that* my dashboard presents only relevant actions. | **Given** authenticated user persona,<br>**When** dashboard loads,<br>**Then** Judge sees cause list & CMO controls; Advocate sees pleadings & admissions; Litigant sees read-only timeline. | 4 | Rashi K. |
| **CMH-504** | `Story` | `EPIC-5` | **16-Digit CNR Search & Filter Engine**<br>*As a* Litigant or Advocate,<br>*I want to* look up cases by 16-character CNR number,<br>*So that* case docket history and orders are found instantly. | **Given** CNR alphanumeric string (e.g., `MPHC010045212024`),<br>**When** search is entered,<br>**Then** complete dossier timeline and exhibits load in under 200 ms. | 3 | Sakshi S. |
| **CMH-505** | `Story` | `EPIC-5` | **Statutory Compliance Countdown Daemon**<br>*As a* Litigant,<br>*I want* automated countdown reminders for discovery,<br>*So that* statutory evidence deadlines are not missed. | **Given** an issued CMO timetable,<br>**When** remaining time reaches `T-7`, `T-3`, or `T-1` days,<br>**Then** multi-channel notification payloads (SMS/Email/In-App) are dispatched. | 3 | Kanishk |

---

### SPRINT 6 (Weeks 11–12): Testing, Cloud Deployment, Final Documentation & Viva
* **Syllabus Goal:** Execute unit and integration testing, host project on live URL, ensure error handling stability, compile final technical report, and deliver oral demo.
* **Sprint Goal:** Achieve >90% test coverage with PyTest, deploy portal to cloud staging/production, benchmark performance, and deliver complete academic submission package.
* **Sprint Velocity:** 16 Story Points | **Status:** Backlog / Ready for Sprint 6

| Jira ID | Type | Epic | Summary & User Story | Acceptance Criteria (Gherkin Format) | Points | Assignee |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **CMH-601** | `Task` | `EPIC-6` | **Automated Unit & Integration Test Suites**<br>*As a* QA Engineer,<br>*I want* comprehensive test suites across backend endpoints,<br>*So that* code coverage exceeds 90% and regressions are prevented. | **Given** all REST API routes,<br>**When** `pytest --cov` runs,<br>**Then** test suite passes 100% with minimum 90% statement coverage across services. | 3 | Kanishk |
| **CMH-602** | `Story` | `EPIC-6` | **Negative Path & Concurrency Stress Testing**<br>*As a* Security Tester,<br>*I want to* test simultaneous admissions submissions,<br>*So that* race conditions and invalid state transitions fail safely. | **Given** concurrent opposing counsel requests,<br>**When** simultaneous submissions occur,<br>**Then** row-level database locking prevents data corruption, returning HTTP 409 safely. | 3 | Sakshi S. |
| **CMH-603** | `Task` | `EPIC-6` | **Cloud Staging & Production Deployment**<br>*As a* DevOps Engineer,<br>*I want* the system hosted on a publicly accessible URL,<br>*So that* evaluation panel can inspect live functionality. | **Given** production build artifacts,<br>**When** deployed to cloud environment,<br>**Then** frontend and backend respond over HTTPS with sub-second response latency. | 3 | Mukul B. |
| **CMH-604** | `Story` | `EPIC-6` | **System Usability Scale (SUS) & Performance Benchmark**<br>*As an* Analyst,<br>*I want* empirical evaluation against traditional court delays,<br>*So that* real efficiency gains (bench hours saved) are validated. | **Given** user evaluation by advocates,<br>**When** SUS questionnaire is compiled,<br>**Then** system achieves SUS score >80 and CMO generation latency <5 seconds. | 2 | Rashi K. |
| **CMH-605** | `Task` | `EPIC-6` | **Academic Dossier & Manuscript Finalization**<br>*As a* Project Team,<br>*I want* complete IEEE-grade coursework reports & papers,<br>*So that* BTCS706N lab manual and synopsis guidelines are fulfilled. | **Given** completed project artifacts,<br>**When** documentation is compiled,<br>**Then** Final Project Report, Manuscript I (Review Paper), and Manuscript II (Implementation Paper) are submission-ready. | 3 | All Members |
| **CMH-606** | `Task` | `EPIC-6` | **Viva Voce Defense & Live Examiner Demo Kit**<br>*As a* Project Team,<br>*I want* slide decks and scripted demonstration workflows,<br>*So that* oral presentation to examiners is executed seamlessly. | **Given** the final evaluation panel,<br>**When** project is defended,<br>**Then** team presents slide deck, answers viva legal/OOAD questions, and conducts a 2-minute live case demonstration. | 2 | All Members |

---

## 5. Team Velocity & Burndown Summary

```
Total Project Capacity: 108 Story Points
-----------------------------------------------------------------------------------------
Sprint 1: 16 SP  (Phase 1: Inception & Functional Modeling)        [COMPLETED]
Sprint 2: 19 SP  (Phase 2: Object-Oriented Analysis & Schemas)       [COMPLETED]
Sprint 3: 20 SP  (Phase 3: Object-Oriented Design & Matrix Engine)   [COMPLETED]
Sprint 4: 19 SP  (Phase 3/4: Architecture & Conflict Scheduling)     [COMPLETED]
Sprint 5: 18 SP  (Phase 4: Full-Stack Integration & CMO Engine)      [IN PROGRESS / 85%]
Sprint 6: 16 SP  (Phase 5: Testing, Cloud Deployment & Viva Defense) [READY FOR FINAL SPRINT]
-----------------------------------------------------------------------------------------
Average Velocity: 18.0 Story Points / Sprint
Target Completion Date: End of Semester (November 2026)
```

---

## 6. Git Branching & Commit Conventions (Syllabus Requirement)

Per the **Syllabus Git Strategy (Page 26)**, team members adhere to:
* `main`: Protected production branch; only receives automated releases from `develop`.
* `develop`: Integration branch; all feature branches merge here via reviewed Pull Requests.
* `feature/<jira-id>-<short-description>`: Branch created for each individual Jira ticket.
  * Example: `feature/CMH-201-jwt-auth-rbac`
  * Example: `feature/CMH-304-admissions-matrix-state-machine`
  * Example: `feature/CMH-403-clash-detection-engine`

### Mandatory Commit Message Syntax:
```
[<JIRA-TICKET-ID>] <Imperative summary of change under 72 chars>

- Detailed bullet point explaining OOP principles applied
- Closes #<PR-number> or references related issue
```
*Example:*
```
[CMH-403] Implement cross-courtroom advocate clash detection algorithm

- Apply Strategy Pattern to evaluate overlapping court session windows
- Introduce ACID transaction row-level locks on bench reservation table
- Resolves #27 and passes all conflict verification test cases
```

---

## 7. Faculty & Guide Review Checkpoint Matrix

Per **SVVV BTCS706N Evaluation Rubric (Pages 28 & 31)**:

| Evaluation Component | Weightage | Target Jira Evidence | SVVV Rubric Checkpoint |
| :--- | :---: | :--- | :--- |
| **1. Analysis & Design** | **30%** | `CMH-104`, `CMH-203`, `CMH-204`, `CMH-205`, `CMH-301`, `CMH-303`, `CMH-401`, `CMH-402` | Do UML diagrams match actual source code classes, methods, and architecture? |
| **2. OO Implementation** | **25%** | `CMH-201`, `CMH-304`, `CMH-403`, `CMH-502` | Are SOLID principles, design patterns (Factory, Strategy), and clean separation used? |
| **3. DevOps & Tooling** | **20%** | `CMH-101`, `CMH-501`, GitHub PRs, Jira Board | Are tickets updated with logged hours? Are PRs peer-reviewed without mega-commits? |
| **4. Testing & Quality** | **15%** | `CMH-601`, `CMH-602`, PyTest Coverage Reports | Is there >90% test coverage with automated GitHub Actions passing green? |
| **5. Final Deployment** | **10%** | `CMH-603`, `CMH-604`, Public Demo URL | Is the application accessible on a live cloud URL with sub-second response times? |
| **TOTAL** | **100%** | **All 32 Jira Stories Across 6 Sprints** | **Full Compliance with University Coursework Table** |

---

*Authored by Team SVVV-CSE-2026-MP-14 for Submission to Prof. Shweta Pandey, Department of CSE, SVIIT, SVVV Indore.*
