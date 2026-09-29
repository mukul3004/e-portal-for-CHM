# SVVV Department of Computer Science & Engineering
## Major Project - Weekly Progress Report

---

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases  
**Team ID:** SVVV-CSE-2026-MP-14  
**Date:** August 30, 2026 – September 05, 2026  
**Project Guide:** Prof. Shweta Pandey  
**Team Members:**  
1. Mukul Bhamgare (`23100BTCSAII14297`)  
2. Rashi Kashiv (`23100BTCSAII14314`)  
3. Sakshi Singh (`23100BTCSAII14317`)  
4. Kanishk (`23100BTCSAII14293`)  

---

### 1. Executive Summary
* **Current Sprint:** Sprint 2 of 6 *(Architecture, OOAD & Core Backend Prototyping)*
* **Sprint Goal:** Finalize UML diagrams (Sequence & Component diagrams), set up the MySQL 8.0 relational database with SQLAlchemy ORM, and configure the FastAPI asynchronous boilerplate with JWT role-based authentication.
* **Status:** **On Track** (All milestone targets for Sprint 2 reached within planned sprint timeline; preparation for Presentation-I completed).

---

### 2. UML & OOAD Progress
* **Diagrams Completed this week:**
  * **Component Diagram:** Mapped the decoupling of the 9 system modules (Client UI, API Gateway, CMH Management Engine, Smart Scheduling Service, Document Vault, and Notification Service).
  * **Sequence Diagram (Pre-Trial CMH Workflow):** Modeled synchronous and asynchronous message exchanges between Advocate, Court Clerk, Judge, Conflict-Detection Engine, and Case Management Order (CMO) PDF Generator.
  * **Package Diagram:** Structured package hierarchy separating Domain Models, Data Access Layers (DAL), Services/Business Logic, and Presentation Controllers.
* **Diagrams Revised:**
  * **Class Diagram Revised:** Refactored the `HearingSchedule` entity to decouple it from direct `Case` entity dependencies. Introduced an independent `AdvocateAvailabilityManager` to allow multi-courtroom conflict detection without tight database table coupling.
* **OO Concept Applied:**
  * **Strategy Design Pattern:** Implemented for the `ClashDetectionEngine` to allow switching between slot-based collision algorithms and calendar-interval conflict checks.
  * **Factory Method Pattern:** Implemented for the `DocumentGenerator` interface to instantiate distinct court order templates (`CMO_Order_XV_A`, `Summons_Notice`, `Adjournment_Memo`).
  * **Interface Inheritance / Abstraction:** Applied an abstract base class `NotificationService` inherited by `SMSNotificationService`, `EmailNotificationService`, and `WebSocketPushService` for loose coupling.

---

### 3. Technical Execution (DevOps & Git)
* **Jira Tasks Completed:**
  * [CMH-101] Finalize Software Requirements Specification (SRS) for Order XV-A CPC compliance.
  * [CMH-104] Configure FastAPI application structure with asynchronous ASGI routing and Swagger UI `/docs`.
  * [CMH-108] Design MySQL 8.0 relational schemas for `Users`, `Cases`, `Dockets`, and `AdmissionsMatrix`.
  * [CMH-112] Implement JWT-based Role-Based Access Control (RBAC) middleware for Judges, Advocates, and Clerks.
  * [CMH-115] Set up Docker Compose configuration for local dev environment (FastAPI backend + MySQL + Redis).
* **Git Activity:**
  * **Active Branches:**
    * `feature/cmh-fastapi-backend-core`
    * `feature/mysql-sqlalchemy-schema-order-xva`
    * `feature/admissions-matrix-json-model`
    * `feature/smart-scheduling-conflict-check`
  * **Merged Pull Requests:**
    * `PR #11:` Initial FastAPI application scaffold, environment configuration, and health check API.
    * `PR #14:` SQLAlchemy 2.0 ORM database models, Alembic migration scripts, and seed data.
    * `PR #16:` Security module with PyJWT token issuance, password hashing (bcrypt), and role validation.
* **CI/CD Status:** **Build Passing** | **89.4% Code Coverage** (Automated GitHub Actions pipeline running `flake8` linting, `black` code formatting, and `pytest` test suites on every pull request).

---

### 4. Testing Summary
* **Total Unit Tests:** 28 Unit & Integration Tests
* **Pass Rate:** **100%** (28 passed, 0 failed, 0 skipped)
* **Key Bug Identified:**
  * *Bug Description:* Encountered a database connection pool exhaustion (`TimeoutError: QueuePool limit of size 5 overflow 10 reached`) during concurrent API load testing on the advocate conflict-checking endpoint.
  * *Resolution:* Reconfigured SQLAlchemy `async_sessionmaker` with explicit connection pool parameters (`pool_size=20`, `max_overflow=10`, `pool_recycle=1800`) and ensured proper `async with` context-managed database session disposal across all asynchronous route dependencies.

---

### 5. Goals for Next Week (Sprint 3)
* **Goal A:** Develop and expose REST API endpoints for the interactive **Admissions & Denials Matrix** (handling line-by-line Admit, Deny, and Partial acceptance of documents with SHA-256 checksum verification).
* **Goal B:** Build the frontend prototype in **React.js + Tailwind CSS** integrating **FullCalendar.js** to visually render the conflict-free courtroom timetable and connect it to the scheduling API.
* **Goal C:** Conduct sprint review with Project Guide (**Prof. Shweta Pandey**) and rehearse Presentation-I viva questions with the team.
