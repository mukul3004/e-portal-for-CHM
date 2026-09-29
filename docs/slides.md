% Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases
% Final Year Major Project (BTCS706N / BTIT706N)
% Shri Vaishnav Institute of Information Technology (SVIIT), SVVV, Indore

# Slide 1: Project Overview

**Topic:** Development of an e-Portal for Facilitating Case Management Hearing of Various Types of Cases

**Domain:** E-Governance, Judicial Informatics & Web Engineering

**Context:** Digitalizing Pre-Trial Conferences (PTC) for Civil, Commercial, and Specialized Disputes

- **Course:** B.Tech Major Project (BTCS706N / BTIT706N)
- **Institution:** Shri Vaishnav Institute of Information Technology (SVIIT), SVVV, Indore
- **Academic Session:** 2026 – 2027
- **Target Presentation:** Review & Evaluation Panel (September 2026)

# Slide 2: Problem Domain

**What is a Case Management Hearing (CMH)?**

- A mandatory procedural proceeding between the Judge and legal counsels held **prior to trial**.
- Internationally recognized as a **"Pre-Trial Conference" (PTC)** (e.g., US Federal Rule 16, UK CPR Part 29, Order XV-A CPC India).

**Why is it Important?**

- **Narrow the Dispute:** Separates admitted facts from contested questions of law and fact.
- **Establish Binding Timetables:** Fixes strict schedules for document inspection, witness lists, and trial dates.
- **Explore Early Settlement:** Diverts suitable cases to Alternative Dispute Resolution (ADR / Mediation).
- **Reduces Trial Duration:** Eliminates routine adjournments before court bench hours begin.

# Slide 3: Existing Scenario

**1. Manual Paper-Based Procedures:**
- Case files, pleadings, and interrogatories are physically transported between registries and courtrooms.
- Hearing notices and summons rely on physical delivery, causing weeks of administrative latency.

**2. Existing Digital Systems (eCourts & CIS 3.2):**
- Platforms like India eCourts and CIS primarily function as **post-event tracking dockets**.
- They record case metadata, upload cause lists, and store final orders, but lack pre-trial conference mechanics.

**3. Coordination Realities:**
- Advocates manage overlapping cases across multiple court halls without centralized clash detection.
- Case Management Orders (CMO) are dictated and typed manually, leading to delays in order issuance.

# Slide 4: Problem Identification

**Key Procedural Bottlenecks:**

- **Fragmented Information:** Pleadings, witness affidavits, and discovery documents are scattered across files and emails.
- **Scheduling Difficulties:** Cross-courtroom date clashes lead to frequent advocate absences and automatic adjournments.
- **Inefficient Document Management:** Lack of a centralized repository where opposing parties can inspect each other's evidence.
- **Lack of Deadline Tracking:** No automated alert mechanism when a party misses a discovery or compliance deadline.
- **Communication Gaps:** Litigants and junior advocates frequently miss email notices or physical summons.
- **Stalled Case Progression:** Research shows that **45% to 55% of court time is consumed by routine procedural matters**.

# Slide 5: Existing Systems Analysis

- **eCourts Mission Mode Project (India):**
  - *Strengths:* Digitized 18,000+ courtrooms; established National Judicial Data Grid (NJDG).
  - *Limitation:* Functions as an informational registry; lacks interactive pre-trial conference tools.
- **Case Information System (CIS 3.2):**
  - *Strengths:* Standardized case registration, cause lists, and daily case statuses.
  - *Limitation:* Built for clerical data entry; no collaborative workspace for counsels and judges.
- **Commercial Court Order XV-A Framework:**
  - *Strengths:* Statutorily mandates Case Management Hearings for commercial disputes.
  - *Limitation:* Lacks a dedicated, automated digital platform to enforce and track compliance.
- **Generic Video Conferencing (Zoom / VC):**
  - *Strengths:* Enabled remote hearings.
  - *Limitation:* Standalone video with zero docket integration, no digital evidence viewer, and no automated order generation.

# Slide 6: Literature Survey

- **Paper 1 (IEEE 2026 - Base Paper):**
  - *Tyagi et al.*, "Development of E-Portal for Case Management Hearing and Facilitation of Legal Proceedings." (DOI: `10.1109/IC3ECSBHI67834.2026.11468915`).
- **Paper 2 (ShodhKosh 2026 - Review Paper):**
  - *Ojha & Dubey*, "From Paper to Platform: Assessing the Role of E-Courts and Digital Reforms in Tackling Judicial Delay in India." (DOI: `10.29121/shodhkosh.v7.i5s.2026.7662`).
- **Paper 3 (Springer 2022):**
  - *Ahmed et al.*, "The Role of Digital Transformation in Fostering Transparency: An E-Court System Case Study." (DOI: `10.1007/978-3-031-15342-6_17`).
- **Paper 4 (Diponegoro Law Review 2023):**
  - *Latifiani et al.*, "Implementation of Simple, Fast and Low-Cost Principles in E-Summons with the E-Court System." (DOI: `10.14710/dilrev.8.1.2023.107-123`).
- **Paper 5 (Elsevier 2023):**
  - *Irani et al.*, "The Impact of Legacy Systems on Digital Transformation in European Public Administration." (DOI: `10.1016/j.giq.2022.101784`).

# Slide 7: Literature Comparison

| Author & Year | System Proposed | Key Features | Limitations Identified |
| :--- | :--- | :--- | :--- |
| **Tyagi et al. (IEEE 2026)** | CMH E-Portal | E-filing, video hearing, automated scheduling, alerts. | Lacks interactive fact admissions grid and dynamic CMO generator. |
| **Ojha & Dubey (2026)** | E-Courts Delay Study | NJDG empirical analysis, 45-55% delay proof. | Policy review only; no software engineering implementation. |
| **Ahmed et al. (Springer 2022)** | E-Court Management | RBAC, digital docketing, document repository. | Focuses on general trial docketing; lacks pre-trial mechanics. |
| **Latifiani et al. (2023)** | E-Summons Platform | Electronic notice delivery, bailiff automation. | Evaluated only summons delivery; lacks hearing integration. |
| **Irani et al. (Elsevier 2023)** | Public Sector Systems | Cloud transformation, legacy data migration. | Broad administrative study; not tailored to judicial hearings. |

# Slide 8: Research Gap

- **1. Absence of Pre-Trial Fact Crystallization:** No existing portal allows opposing advocates to jointly mark *Admissions and Denials* of allegations prior to entering court.
- **2. Disjointed Calendar Conflict Detection:** Scheduling tools allocate court slots without validating advocate commitments across other courtrooms.
- **3. Disconnected Virtual Hearings:** Video sessions occur on standalone platforms without real-time docket synchronization or synchronized exhibit viewing.
- **4. Manual Generation of Case Management Orders (CMO):** Lack of dynamic template engines to transform agreed hearing outcomes into legally binding, digitally signed order sheets.
- **5. Absence of Automated Pre-Trial Compliance Tracking:** No automated mechanism to monitor whether parties file witness lists and inspection affidavits within agreed deadlines.

# Slide 9: Proposed Solution

**An Integrated E-Portal for Case Management Hearings:**

- **Dedicated Pre-Trial Workbench:** A unified, secure portal connecting Judges, Petitioner Counsels, Respondent Counsels, and Court Clerks.
- **Interactive Dispute Narrowing:** Digital matrix allowing counsels to check off undisputed facts before hearing day, saving up to 50% of bench time.
- **Conflict-Free Scheduling Engine:** Checks advocate calendars across court dockets to eliminate scheduling clashes.
- **Integrated WebRTC Virtual Courtroom:** In-browser audio/video hearing room with synchronized exhibit presentation and digital attendance.
- **Automated CMO Engine:** Dynamically compiles the pre-trial order, embeds binding discovery deadlines, and applies cryptographic digital signatures.

# Slide 10: Proposed Features & Modules

- **1. User Management & Security:** Role-Based Access Control (RBAC) for Judges, Advocates, Litigants, and Clerks with JWT authentication.
- **2. Case Management & Docketing:** Multi-case type handling (Civil, Commercial, Arbitration) with unique CNR tracking.
- **3. CMH Management:** Structured Case Management Statements (CMS) and witness count estimations.
- **4. Smart Hearing Scheduling:** Algorithmic clash-free hearing slot allocation.
- **5. Document Vault:** Secure storage for pleadings and evidence with SHA-256 integrity hashing.
- **6. Multi-Channel Notifications:** Automated alerts via SMS, Email, and in-portal notifications.
- **7. Case Timeline:** Visual interactive progress tracker showing past events and future deadlines.
- **8. Judicial Analytics & Reports:** Adjournment heatmaps, disposal metrics, and compliance tracking.
- **9. Audit Trail:** Immutable, timestamped activity records for judicial security.

# Slide 11: Feasibility Study

- **Technical Feasibility:**
  - Built with modern, mature open-source technologies: Python (FastAPI), React.js, and MySQL.
  - Requires only a standard web browser (Chrome, Edge, Firefox) with WebRTC support on client devices.
- **Operational Feasibility:**
  - Aligns with existing civil procedure rules (Order XV-A CPC) and standard court administration practices.
  - Clean, accessible UI minimizes training requirements for court staff and advocates.
- **Economic Feasibility:**
  - Zero proprietary licensing fees; built entirely on open-source libraries.
  - Drastically lowers travel, printing, and administrative overheads for courts and litigants.
- **Legal & Security Feasibility:**
  - Cryptographic document hashing guarantees tamper-proof records.
  - Compliant with Indian Information Technology (IT) Act and e-Courts Phase III security directives.

# Slide 12: Proposed System Workflow

1. **Secure Login (RBAC):** Users authenticate into role-specific dashboards.
2. **Case Registration & E-Filing:** Advocate files petition and uploads electronic evidence bundles.
3. **Clerk Verification:** Court clerk audits filings and confirms Case ID generation.
4. **Interactive Case Dashboard:** Central docket displays case status, filings, and upcoming milestones.
5. **CMH Preparation:** Counsels submit Case Management Statements (CMS) and witness lists.
6. **Smart Scheduling:** Portal analyzes advocate dockets and reserves conflict-free CMH slot.
7. **Admissions & Denials:** Opposing counsels mark agreed vs. contested facts online.
8. **Virtual / Hybrid CMH:** Judge conducts hearing via WebRTC with live exhibit sharing.
9. **Automated CMO Generation:** Server-side engine compiles binding order sheet with discovery timetable.
10. **Compliance Tracking:** System monitors discovery deadlines and triggers automated reminders.
11. **Next Hearing / Trial:** Calendar syncs trial dates for final trial readiness.
12. **Case Closure:** Final disposal recorded and archived in the judicial vault.

# Slide 13: Proposed Technology Stack

- **Frontend Interface:**
  - **React.js / Vite:** Responsive single-page application.
  - **Tailwind CSS & shadcn/ui:** Accessible, modern judicial UI components.
- **Backend API Gateway:**
  - **Python 3.11+ (FastAPI):** High-throughput asynchronous REST APIs with auto-generated Swagger documentation (`/docs`).
- **Database Layer:**
  - **MySQL 8.0+:** ACID-compliant relational docket storage with native JSON support for dynamic checklists.
  - **SQLAlchemy 2.0 & PyMySQL:** Type-safe Object-Relational Mapping.
- **Real-Time Communication & Video:**
  - **WebRTC / Jitsi Meet SDK:** Browser-based virtual hearing room.
  - **WebSockets:** Live attendance updates and instant notification dispatch.
- **Document & Order Engine:**
  - **Jinja2 + WeasyPrint / ReportLab:** Dynamic HTML-to-PDF compiler for Case Management Orders.

# Slide 14: Work Completed Till Date

- [x] **Project Domain Finalized:** E-Governance & Judicial Informatics.
- [x] **Problem Domain Studied:** Pre-Trial Conferences & Case Flow Management guidelines.
- [x] **Initial Legal & Process Study Completed:** Commercial Courts Act (Order XV-A CPC) and eCourts Phase III vision.
- [x] **Existing E-Court Systems Studied:** CIS 3.2, NJDG, and virtual court procedures.
- [x] **Initial Literature Survey Completed:** 6 peer-reviewed papers reviewed and summarized.
- [x] **Existing System Features Identified:** Basic e-filing, cause list generation, and docket lookups.
- [x] **Initial Research Gap Identified:** Lack of pre-trial collaborative dispute narrowing and automated CMO generation.
- [x] **Proposed System Modules Identified:** 9 core functional modules mapped.
- [x] **Initial Feasibility Analysis Completed:** Technical, operational, economic, and legal viability confirmed.

# Slide 15: Future Work & Project Roadmap

```
[ Detailed Requirements (SRS & IEEE 830 Specification) ]
                         ↓
[ System Design (UML Class, Sequence & DFD Diagrams) ]
                         ↓
[ Database Design (Normalized MySQL Schema & ERD) ]
                         ↓
[ UI/UX Design (Figma Wireframes & User Journey) ]
                         ↓
[ Full-Stack Development (FastAPI + React + MySQL) ]
                         ↓
[ System Testing (Unit, Integration, Security & UAT) ]
                         ↓
[ Performance Evaluation (System Usability Scale - SUS) ]
                         ↓
[ Mandatory Research Papers (Manuscript I & II Submission) ]
```

# Slide 16: References (IEEE Format)

1. **A. Tyagi, A. Jain, A. Tiwari, A. Chaudhary, and A. Jain**, "Development of E-Portal for Case Management Hearing and Facilitation of Legal Proceedings," in *Proc. IEEE 2nd Int. Conf. on Cognitive Computing in Engineering, Communications, Sciences and Biomedical Health Informatics (IC3ECSBHI)*, Feb. 2026. **DOI: 10.1109/IC3ECSBHI67834.2026.11468915**.
2. **L. Ojha and A. Dubey**, "From Paper to Platform: Assessing the Role of E-Courts and Digital Reforms in Tackling Judicial Delay in India," *ShodhKosh: Journal of Visual and Performing Arts*, vol. 7, no. 5s, pp. 25–37, Apr. 2026. **DOI: 10.29121/shodhkosh.v7.i5s.2026.7662**.
3. **R. K. Ahmed, O. Ahmed, I. Pappel, A. Reitsakas, and D. Draheim**, "The Role of Digital Transformation in Fostering Transparency: An E-Court System Case Study," in *Springer IFIP Advances in Information and Communication Technology*, vol. 660, pp. 219–230, Sep. 2022. **DOI: 10.1007/978-3-031-15342-6_17**.
4. **D. Latifiani et al.**, "Implementation of Simple, Fast and Low-Cost Principles in E-Summons with the E-Court System," *Diponegoro Law Review*, vol. 8, no. 1, pp. 107–123, Apr. 2023. **DOI: 10.14710/dilrev.8.1.2023.107-123**.
5. **Z. Irani, R. M. Abril, V. Weerakkody, A. Omar, and U. Sivarajah**, "The Impact of Legacy Systems on Digital Transformation in European Public Administration: Lessons Learned from a Multi-Case Analysis," *Government Information Quarterly (Elsevier)*, vol. 40, no. 1, p. 101784, Jan. 2023. **DOI: 10.1016/j.giq.2022.101784**.
6. **J. Brinkema and J. M. Greenwood**, "E-Filing Case Management Services in the US Federal Courts: The Next Generation," *International Journal for Court Administration*, vol. 7, no. 1, pp. 3–12, 2015.
