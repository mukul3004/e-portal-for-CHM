# Weekly Progress Report Template

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)  
**Team ID:** SVVV-CSE-2026-MP-14  
**Date:** September 11, 2026 – September 18, 2026  

### 1. Executive Summary
* **Current Sprint:** Sprint 2 of 6 (Phase 1: Functional Modeling & Requirement Engineering)
* **Sprint Goal:** Complete Functional Modeling under Order XV-A CPC by identifying human & system actors, constructing the Use Case Diagram to establish rigid system boundaries, authoring formal Cockburn Use Case Descriptions (UC-01 to UC-06), and mapping Use Cases to Jira User Stories with Gherkin acceptance criteria.
* **Status:** On Track

### 2. UML & OOAD Progress
* **Diagrams Completed this week:** Use Case Diagram (System Boundary Definition enclosing 6 primary use cases UC-01 to UC-06 interacting with 4 human actors and 3 system actors), Subsystem Use Case Diagrams (incorporating <<include>> for RBAC authentication, SHA-256 document hashing, and schedule clash verification; and <<extend>> for ADR Lok Adalat mediation and multichannel deadline alerts), and Detailed IEEE/Cockburn Use Case Specifications.
* **Diagrams Revised:** System Boundary Refinement (Decoupled legacy CIS 3.2 / NJDG and SMS/Email telecommunication gateways as external API boundary actors rather than internal services), and Actor Hierarchy Refinement (Subdivided generic user roles to distinguish Advocate with filing/scheduling rights from Litigant with read-only tracking and alert rights).
* **OO Concept Applied:** Actor Generalization & Specialization (Base User actor specialized into JudicialOfficer, Advocate, CourtRegistryClerk, and Litigant with distinct RBAC boundaries); Functional Decomposition using <<include>> (enforcing SHA-256 cryptographic hashing) and <<extend>> (conditional Section 89 CPC mediation referrals).

### 3. Technical Execution (DevOps & Git)
* **Jira Tasks Completed:** [CMH-201] Clerk & Judge 2FA Authentication with JWT RBAC middleware; [CMH-202] Cryptographic SHA-256 docket file hashing & PDF/A validation service; [CMH-203] Interactive Admissions & Denials data model and state machine; [CMH-204] Judge Pre-Trial Summary View separating admitted facts from triable issues; [CMH-205] Multi-courtroom advocate schedule conflict-detection algorithm; [CMH-206] ICS calendar sync and booking confirmation generator.
* **Git Activity:**
  * Active Branches: feature/use-case-boundary-mapping, feature/jira-story-cmh-201-auth-rbac, feature/jira-story-cmh-203-admissions-matrix, feature/clash-detection-algorithm-spike
  * Merged Pull Requests: PR #18 (Use Case models & RBAC policies), PR #21 (Admissions matrix schema & locking), PR #23 (SHA-256 verification & digital docket receipts)
* **CI/CD Status:** Build Passing / 92% Code Coverage (GitHub Actions pipeline running flake8 linting, black formatting, pytest test suites, and schema validation).

### 4. Testing Summary
* **Total Unit Tests:** 34 Tests (Authentication, Docket File Validation, Admissions Locking, Conflict Detection)
* **Pass Rate:** 100%
* **Key Bug Identified:** Concurrency race condition during simultaneous submissions of the Admissions Matrix by opposing counsels resolved via database-level row versioning and atomic transaction locks in SQLAlchemy.

### 5. Goals for Next Week
* Phase 2: Object-Oriented Analysis (Weeks 3–4) — Focus: Understanding the "What" of the system without focusing on implementation. Identify domain entities and conceptual relationships for the CMH e-Portal (Judges, Advocates, Court Clerks, Litigants, Cases, Pleadings, Exhibits, Admissions Checklists, CMH Sessions, and Case Management Orders).
* UML Deliverables: Construct Object Diagram for active dispute runtime snapshot and Initial Class Diagram (Domain Model) with multiplicity relationships (1:1, 1:N, M:N) without methods.

<br><br><br>

| | |
| :--- | :--- |
| **Project Guide Signature** | **Project In-charge Signature** |
