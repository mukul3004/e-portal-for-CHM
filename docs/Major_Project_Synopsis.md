# Major Project Synopsis
### on
## DEVELOPMENT OF E-PORTAL FOR FACILITATING CASE MANAGEMENT HEARING OF VARIOUS TYPES OF CASES

*In partial fulfillment of requirements for the degree of*  
### BACHELOR OF TECHNOLOGY  
### IN  
### COMPUTER SCIENCE & ENGINEERING  

\vspace{1cm}

**Submitted by:**  
1. Mukul Bhamgare [University Roll Number: 23100BTCSAII14297]  
2. Rashi Kashiv [University Roll Number: 23100BTCSAII14314]  
3. Sakshi Singh [University Roll Number: 23100BTCSAII14317]  
4. Kanishk [University Roll Number: 23100BTCSAII14293]  

\vspace{1cm}

**Under the guidance of:**  
### PROF. SHWETA PANDEY  

\vspace{1.5cm}

**DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING**  
**SHRI VAISHNAV INSTITUTE OF INFORMATION TECHNOLOGY**  
**SHRI VAISHNAV VIDYAPEETH VISHWAVIDYALAYA, INDORE**  
**JUL-DEC-2026**

---

\newpage

## Abstract

Judicial delay and massive case pendency represent critical structural challenges in the administration of justice. In India, data from the National Judicial Data Grid (NJDG) confirms that over 53 million cases remain pending across courts. While nationwide initiatives, such as the e-Courts Mission Mode Project and Case Information System (CIS), have successfully digitized case dockets and enabled virtual hearing links, empirical research reveals that basic administrative computerization alone does not reduce case duration. Recent computational studies across 1,775 Indian district courts published by Cambridge University Press (2024) establish that increasing judge strength does not significantly reduce disposal times; rather, administrative case management—specifically resolving the fact that over 50% of cases remain stalled in preliminary "appearance" and "awaiting" stages for upwards of 394 median days—is the vital determinant of court performance.

To resolve these procedural bottlenecks, this project proposes the design and development of an integrated e-Portal for Facilitating Case Management Hearings (CMH), statutorily mandated under Order XV-A of the Code of Civil Procedure (CPC). The proposed platform serves as an interactive pre-trial collaborative workbench uniting Judges, Legal Counsels, and Court Clerks. Core architectural modules include an interactive Admissions & Denials Matrix to settle undisputed facts online, an algorithmic conflict-free hearing scheduler to prevent advocate double-booking across courtrooms, an in-browser WebRTC virtual courtroom, and an automated Case Management Order (CMO) generation engine with SHA-256 cryptographic verification. By automating pre-trial procedures, the portal aims to eliminate up to 50% of preliminary delay before formal trials begin.

---

## 1. INTRODUCTION

The constitutional canon *"justice delayed is justice denied"* underscores a growing governance crisis. In the Indian judicial landscape, systemic delays lead to commercial uncertainty, financial strain on litigants, and erosion of public trust in legal institutions. To modernize court operations, the e-Courts Mission Mode Project has computerized over 18,700 court complexes, digitized billions of document pages, and introduced virtual hearing tools [1], [2]. 

However, contemporary empirical scholarship demonstrates that existing court portals (such as `ecourts.gov.in`, CIS 3.2, and state portals like `mphc.gov.in`) function strictly as passive, post-event noticeboards. They allow lawyers and citizens to view case statuses or download static cause list PDFs, but offer no collaborative software tools to actively manage pre-trial workflows [2]. Empirical findings by Ojha & Dubey (2026) establish that routine procedural matters—including scheduling clashes, unorganized evidence discovery, and repeated pass-overs—consume **45% to 55% of active courtroom bench time** [2]. 

To eliminate this procedural overhead, modern procedural codes (such as Order XV-A CPC and Rule 16 FRCP) mandate **Case Management Hearings (CMH)**, known globally as Pre-Trial Conferences [2], [3]. The CMH requires the judge and legal counsels to convene *prior to trial* to frame core disputed issues, discard admitted facts, limit witnesses, and fix binding discovery timetables. Despite statutory mandates, the absence of a dedicated pre-trial digital platform forces courts to conduct these hearings through physical paper files and oral arguments. This project develops an end-to-end CMH e-Portal to digitally operationalize pre-trial case flow management.

---

## 2. PROBLEM DOMAIN

### Problem Statement:
Existing judicial administration suffers from severe procedural friction during pre-trial proceedings. Empirical evidence proves that over 50% of lower court dockets stall in preliminary "appearance" and "awaiting" stages for a median of 394 days [4]. Cause lists are published in courtroom silos, leading to uncoordinated scheduling where advocates are double-booked across multiple benches, causing repeated adjournments. Furthermore, counsels exchange voluminous physical affidavits for admissions and denials of documents, forcing judges to spend valuable bench hours sorting undisputed claims. Court directions lack automated compliance tracking, delaying discovery schedules by months.

### Objectives of Proposed Work:
1. To design and implement a secure, multi-role web portal (Judge, Advocate, Clerk, Litigant) for pre-trial Case Management Hearings.
2. To develop an interactive **Admissions & Denials Matrix** allowing opposing counsels to settle undisputed facts online prior to hearing day.
3. To engineer a **Conflict-Free Hearing Scheduler** that detects advocate availability across courtrooms and prevents calendar clashes.
4. To build an automated **Case Management Order (CMO)** PDF generation engine with SHA-256 cryptographic integrity verification.
5. To implement automated multi-channel push notifications (SMS/Email) for discovery deadlines and compliance countdowns.

---

## 3. SOLUTION DOMAIN

The proposed solution is an **Interactive Case Management Hearing e-Portal**, transforming judicial platforms from passive informational noticeboards into proactive procedural workflow engines. The architecture comprises four core technological pillars:

```
[ FRONTEND TIER: React.js (Vite) + Tailwind CSS + FullCalendar.js ]
                               │
                    (REST APIs / WebSockets)
                               ▼
[ BACKEND API GATEWAY: Python 3.11+ (FastAPI) ]
  ├── Role-Based Access Control Engine (JWT + bcrypt)
  ├── Conflict-Free Hearing Scheduling Engine
  ├── Interactive Admissions & Denials Matrix Service
  └── Automated CMO PDF Generator (Jinja2 + WeasyPrint)
                               │
             ┌─────────────────┴─────────────────┐
             ▼                                   ▼
[ RELATIONAL DATABASE ]                [ REAL-TIME COMMUNICATION ]
MySQL 8.0+ (ACID Engine)               WebRTC / Jitsi Meet SDK
(Dockets, Checklists, Audit Logs)      (In-Browser Virtual Hearing Room)
```

1. **Pre-Trial Fact Crystallization (Admissions Matrix):** Opposing legal counsels access an asynchronous digital checklist. Each factual claim in the plaint can be marked as *Admitted*, *Denied*, or *Requiring Proof*. Admitted claims are automatically committed to the permanent record as settled, while contested claims are dynamically compiled into the formal "List of Issues" for trial, slashing in-court argument time by up to 50%.
2. **Conflict-Free Algorithmic Scheduling:** Rather than generating isolated daily cause lists, the scheduling engine checks advocate commitments across all connected courtrooms. It allocates non-conflicting hearing slots, directly eliminating the primary driver of procedural adjournments.
3. **In-Browser WebRTC Virtual Courtroom:** Remote CMH proceedings take place inside the browser using embedded WebRTC / Jitsi Meet SDK. The video interface is directly linked to the live case docket, witness list, and evidence viewer, eliminating window toggling.
4. **Automated Order Generation & Compliance Engine:** Following the hearing, the system compiles agreed discovery deadlines, witness limits, and trial dates into an official HTML template, rendering a digitally signed **Case Management Order (CMO PDF)**. Automated background workers track compliance countdowns and issue automated SMS/email alerts before deadlines expire.

---

## 4. SYSTEM DOMAIN

### Software Specifications:
* **Operating System:** macOS (Apple Silicon ARM64) / Linux Ubuntu 22.04 LTS / Windows 11
* **Frontend Technologies:** React.js (Vite), Tailwind CSS, FullCalendar.js, Lucide-React
* **Backend Framework:** Python 3.11+, FastAPI (Asynchronous ASGI), Pydantic v2 validation, Uvicorn server
* **Database Engine:** MySQL 8.0+ Community Server (ACID compliant, relational schema with native JSON support), SQLAlchemy 2.0 ORM, PyMySQL
* **Real-Time Communication:** WebRTC / Jitsi Meet Web SDK, WebSockets (FastAPI native)
* **Document & Cryptographic Engine:** Jinja2 Template Engine, WeasyPrint / ReportLab (PDF compiler), Python `hashlib` (SHA-256), PyJWT, Passlib (bcrypt)

### Hardware Specifications:
* **Development Machine:** Apple MacBook M4 (16 GB Unified Memory, 512 GB SSD)
* **Server Environment:** Minimum Quad-Core CPU @ 2.5 GHz, 8 GB RAM (16 GB recommended), 100 GB SSD, 100 Mbps dedicated network bandwidth.
* **Client Devices:** Any standard PC, Mac, Laptop, iPad, or Smartphone with modern web browser (Chrome, Safari, Edge) and 2 Mbps internet connection.

### Justification of System Elements:
Python FastAPI was selected over traditional frameworks due to its native asynchronous execution (`async/await`) and automated OpenAPI/Swagger documentation (`/docs`). MySQL 8.0 was chosen over NoSQL databases because court dockets are strictly relational, requiring absolute ACID compliance. WebRTC provides secure in-browser video conferencing without forcing users to install third-party applications like Zoom.

---

## 5. APPLICATION DOMAIN

### Scope and Applicability:
The e-Portal is designed for deployment across District & Sessions Courts, specialized Commercial Courts (under the Commercial Courts Act, 2015), and High Court Commercial Divisions. It covers commercial disputes, contract breaches, civil recovery suits, and arbitration petitions governed by Order XV-A of the Civil Procedure Code.

### Real-Life Impact on End Users:
* **For Judges:** Eliminates 45%–55% of bench time spent on clerical scrutiny and routine adjournments; automates order drafting.
* **For Legal Practitioners (Advocates):** Eliminates cross-courtroom schedule clashes, prevents trial-by-ambush, and enables online fact admission from chambers.
* **For Litigants & Citizens:** Drastically reduces litigation expenses and physical travel burdens for non-substantive call dates, ensuring predictable trial timetables.

---

## 6. EXPECTED OUTCOME

The expected outcomes of this project are:
1. A fully functional, responsive **e-Portal web application** with four role-based dashboards (Judge, Advocate, Clerk, Litigant).
2. An **Interactive Admissions & Denials Matrix** component enabling pre-trial fact narrowing.
3. An **Algorithmic Conflict-Free Scheduling Engine** eliminating cross-courtroom advocate double-booking.
4. An **In-Browser WebRTC Virtual Courtroom** integrated with live case records and exhibit viewers.
5. An **Automated CMO PDF Generation Engine** producing cryptographically verified procedural orders.
6. An **Automated Notification Gateway** transmitting real-time SMS/Email deadline countdown reminders.
7. Publication of **Manuscript I (Review Paper)** and **Manuscript II (Implementation Paper)**.

---

## 7. REFERENCES

1. K. Benyekhlef, E. Amar, and V. Callipel, "ICT-driven strategies for reforming access to justice mechanisms in developing countries," *The World Bank Legal Review*, vol. 6, no. 2, pp. 325–343, 2015. DOI: 10.1596/978-1-4648-0378-9_ch15.
2. L. Ojha and A. Dubey, "From Paper to Platform: Assessing the Role of E-Courts and Digital Reforms in Tackling Judicial Delay in India," *ShodhKosh: Journal of Visual and Performing Arts*, vol. 7, no. 5s, pp. 25–37, Apr. 2026. DOI: 10.29121/shodhkosh.v7.i5s.2026.7662.
3. L. Poshai and S. Vyas-Doorgapersad, "Digital justice delivery in Zimbabwe: Integrated electronic case management system adoption," *South African Journal of Information Management*, vol. 25, no. 1, pp. 1–11, Sep. 2023. DOI: 10.4102/sajim.v25i1.1695.
4. V. Aithala, A. Sachan, S. Sen, H. Payal, and C. Bhattacharya, "Decision time: illuminating performance in India's district courts," *Data & Policy (Cambridge University Press)*, vol. 6, p. e32, 2024. DOI: 10.1017/dap.2024.24. [Base Empirical Paper - IISc / NLSIU Study]
5. A. Tyagi, A. Jain, A. Tiwari, A. Chaudhary, and A. Jain, "Development of E-Portal for Case Management Hearing and Facilitation of Legal Proceedings," in *Proc. IEEE 2nd Int. Conf. on Cognitive Computing in Engineering, Communications, Sciences and Biomedical Health Informatics (IC3ECSBHI)*, Feb. 2026. DOI: 10.1109/IC3ECSBHI67834.2026.11468915. [Base Architecture Paper]
6. D. Latifiani et al., "Implementation of Simple, Fast and Low-Cost Principles in E-Summons with the E-Court System," *Diponegoro Law Review*, vol. 8, no. 1, pp. 107–123, Apr. 2023. DOI: 10.14710/dilrev.8.1.2023.107-123.
7. R. K. Ahmed, O. Ahmed, I. Pappel, A. Reitsakas, and D. Draheim, "The Role of Digital Transformation in Fostering Transparency: An E-Court System Case Study," in *Springer IFIP Advances in Information and Communication Technology*, vol. 660, pp. 219–230, Sep. 2022. DOI: 10.1007/978-3-031-15342-6_17.
