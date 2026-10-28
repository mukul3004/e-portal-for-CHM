# e-Portal for Facilitating Case Management Hearing (CMH) of Various Types of Cases

[![CI/CD Pipeline](https://github.com/mukul3004/e-portal-for-CHM/actions/workflows/ci.yml/badge.svg)](https://github.com/mukul3004/e-portal-for-CHM/actions/workflows/ci.yml)
[![PyTest Status](https://img.shields.io/badge/PyTest-7%20Passed-brightgreen)](https://github.com/mukul3004/e-portal-for-CHM)
[![Vite Build](https://img.shields.io/badge/Vite%208.3-Compiled%20Clean-blue)](https://github.com/mukul3004/e-portal-for-CHM)
[![Git Branching](https://img.shields.io/badge/Git%20Workflow-Main%20%7C%20Develop%20%7C%20Feature-orange)](https://github.com/mukul3004/e-portal-for-CHM)

> **Specialized Judicial Workflow Platform under Order XV-A of the Code of Civil Procedure (CPC) & Commercial Courts Act, 2015**

**Department of Computer Science & Engineering, SVIIT, SVVV, Indore**  
**Course:** Major Project (2025–2026) | **Course Code:** `BTCS706N` | **Team ID:** `SVVV-CSE-2026-MP-14`  
**Project Guide:** Prof. Shweta Pandey  

**Team Members:**
1. **Mukul Bhamgare** (`23100BTCSAII14297`) - *Team Lead & Full-Stack Architect*
2. **Rashi Kashiv** (`23100BTCSAII14314`) - *Frontend & UI/UX Specialist*
3. **Sakshi Singh** (`23100BTCSAII14317`) - *Backend & Database Engineer*
4. **Kanishk** (`23100BTCSAII14293`) - *QA & Compliance Analyst*

---

## 🏛️ Executive Summary

The **Case Management Hearing (CMH) e-Portal** modernizes judicial administration for Indian commercial and civil court proceedings under **Order XV-A of the Code of Civil Procedure (CPC)** (inserted by the Commercial Courts Act, 2015).

Traditional commercial litigation in India is often plagued by procedural delays, trial date clashes for advocates across multiple benches, and unfocused trials. The CMH e-Portal addresses these bottlenecks by:
1. **Accelerating Admissions & Denials (Rule 1)**: Automated digital matrix to isolate admitted facts from contentious issues prior to trial.
2. **Clash-Free Multi-Bench Scheduling (Rule 2)**: Real-time advocate and courtroom conflict resolution engine.
3. **Structured Case Management Orders (Rule 3)**: Formats binding discovery timetables, witness quotas, and trial timelines with cryptographic SHA-256 integrity.
4. **Real Indian Case Intelligence**: Sourced exclusively from genuine Indian judicial databases (Indian Kanoon, eCourts India, NJDG, High Court of MP - Indore Bench).

---

## 🚀 Key Implemented Features

### 1. Admissions & Denials Matrix
* Structured table of factual averments categorized by Plaint Paragraph, Averment Text, Plaintiff Initial Position, and Defendant Response.
* Interactive verification controls: `ADMITTED`, `DENIED`, `NOT_ADMITTED_WANT_OF_KNOWLEDGE`.
* Live Readiness Score calculation and state-locking mechanism before judicial hearing.

### 2. Conflict-Free Hearing Scheduler
* Real-time slot conflict detection preventing double-booking of advocates across different courtrooms/benches.
* Integrated WebRTC judicial room identifiers.

### 3. Enforceable Case Management Order (CMO) Sheet
* Summary of undisputed facts, framed judicial issues, and strict witness quotas (Plaintiff & Defendant).
* Binding discovery and cross-examination deadlines.
* SHA-256 cryptographic seal and verifiable QR digital verification stub.

### 4. Comprehensive Case Dossier & 16-Digit CNR Search
* Real-time search by Case Title or 16-character eCourts CNR number (e.g., `MPHC010045212024`).
* Step-by-step judicial timeline milestone tracker (Filing $\to$ Pleadings $\to$ Admissions $\to$ CMH Hearing $\to$ CMO Sealed).

### 5. Multi-Role Judicial Persona Switcher
* **Hon\'ble Commercial Court Judge**: Issue CMOs, frame issues, adjudicate admissions.
* **Plaintiff Counsel**: Submit averments, upload Plaint with SHA-256 integrity, propose dates.
* **Defendant Counsel**: Respond to admissions, submit Written Statement of Defence.
* **Court Master / Clerk**: Schedule hearings and verify bench availability.
* **Public / Litigant View**: Docket status, court orders, and case feed.

---

## 📋 8-Point Enhancement Roadmap (Sprint 2 & 3)

1. **AI Document Feature Extraction**: Automated extraction of Dates, What Happened, and Legal Reasoning ("Why") from uploaded commercial plaints and orders.
2. **16-Digit CNR & Case Search**: Fast lookup with validation matching Indian eCourts alphanumeric format.
3. **Multi-Role RBAC**: Granular permissions for Judges, Advocates, Registry Clerks, and Citizens.
4. **Multiple Case Categories**:
   * Commercial Disputes (Commercial Courts Act, 2015)
   * Civil Suits (Order XV-A CPC)
   * Cheque Bounce (Sec 138, Negotiable Instruments Act, 1881)
   * Arbitration & Conciliation Petitions (1996 Act)
   * High-Value Commercial Contract Suits
5. **Headline-Driven Case Newsfeed**: Real-time judicial updates and case summaries presented in high-readability cards.
6. **Citizen/Client Sorting**: Browse cases filtered by "Trending" (public interest / high valuation) and "Dates" (recent filing / next hearing).
7. **100+ Real Indian Court Cases Dataset**: Verified corpus sourced strictly from Indian Kanoon, eCourts Services, and MP High Court records.
8. **Structured e-Filing Workflow**: Guided multi-step docket lodgment with fee validation and exhibit checksums.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Lucide Icons, Custom Judicial Dark/Light Theme |
| **Backend** | FastAPI (Python 3.13), Uvicorn, Pydantic v2 |
| **Database** | SQLite 3 with SQLAlchemy 2.0 ORM |
| **Security** | JWT (HS256) Role-Based Access Control, SHA-256 Evidence Hashing |
| **Testing** | Pytest, FastAPI TestClient, Starlette |

---

## 🐳 1-Command Docker Deployment (Production & Evaluation)

The portal provides production-grade Docker containerization for instant, zero-configuration evaluation:

```bash
# Clone and start with Docker Compose
git clone https://github.com/mukul3004/e-portal-for-CHM.git
cd case-management-eportal
docker compose up --build -d
```

* **Frontend Web Portal**: [http://localhost](http://localhost) (or [http://localhost:5173](http://localhost:5173))
* **FastAPI Backend & Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **System Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
* Detailed Guide: [docs/Docker_Deployment_Guide.md](docs/Docker_Deployment_Guide.md)

---

## 💻 Local Manual Setup & Quickstart

### Prerequisites
* Python 3.11+
* Node.js 18+ & npm

### 1. Clone Repository
```bash
git clone https://github.com/mukul3004/e-portal-for-CHM.git
cd e-portal-for-CHM
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server (FastAPI + Uvicorn)
python run.py
```
* Backend API runs on: `http://localhost:8000`
* Swagger Interactive Docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
* Frontend runs on: `http://localhost:5173`

### 4. Running Backend Automated Tests
```bash
source .venv/bin/activate
PYTHONPATH=. pytest backend/tests/test_api.py -v
```

---

## 📁 Repository Directory Layout

```
case-management-eportal/
├── README.md                                  <- Project Overview & Setup Instructions
├── requirements.txt                           <- Python dependencies
├── run.py                                     <- Backend entrypoint script
├── cmh_portal.db                              <- Local development SQLite database
├── backend/
│   ├── app/
│   │   ├── main.py                            <- FastAPI application instance & routing
│   │   ├── core/                              <- Config & database engine
│   │   ├── models/                            <- SQLAlchemy ORM models (Case, User, CMO, etc.)
│   │   ├── schemas/                           <- Pydantic validation schemas
│   │   ├── routers/                           <- API endpoints (cases, admissions, cmh, cmo, auth)
│   │   ├── security/                          <- JWT authentication & password hashing
│   │   └── services/                          <- Clash detection & admissions engine
│   └── tests/                                 <- Pytest test suite
├── frontend/
│   ├── src/
│   │   ├── App.jsx                            <- Interactive Judicial Single-Page App
│   │   ├── App.css                            <- Judicial component styling
│   │   ├── index.css                          <- Typography & base tokens
│   │   └── main.jsx                           <- React DOM entry point
│   └── package.json                           <- Node.js dependencies & scripts
├── docs/                                      <- Project reports, synopsis, review paper
└── diagrams/                                  <- Complete 7-tier UML diagrams (PlantUML & Markdown)
```

---

## 🏛️ Comprehensive UML Architecture Specification (SVVV Phase 2 & 3)

> [!IMPORTANT]
> **📄 University Print-Ready A4 PDF Dossier (100% Calibrated for A4 Hardcopy)**:  
> * **[Download Complete 8-Page A4 PDF Dossier](diagrams/SVVV_UML_Architecture_Dossier_A4.pdf)** — Formatted with official SVVV university cover page, SVIIT department header, team credentials, and all 7 diagrams centered on individual A4 pages with zero overflow.
> * **[Interactive HTML Print Dossier](diagrams/Printable_UML_Book.html)** — Open in browser and click the floating **"🖨️ Print Entire UML Book (Cmd + P)"** button.

The project includes complete PlantUML source code (`.puml`), print-ready A4 PDFs (`.pdf`), high-resolution print images (`.png` / `.svg`), and interactive Mermaid Markdown documentation (`.md`) covering all 7 standard UML structural and behavioral views:

| # | UML Diagram Type | Print-Ready A4 PDF | High-Res Visuals | PlantUML Source | Markdown & Spec | Focus & Statutory Scope |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Activity Diagram** | [A4 PDF](diagrams/Activity_Diagram_A4.pdf) | [PNG](diagrams/Activity_Diagram.png) / [SVG](diagrams/Activity_Diagram.svg) | [Source](diagrams/Activity_Diagram.puml) | [Activity_Diagram.md](diagrams/Activity_Diagram.md) | Order XV-A pre-trial lifecycle, 120-day default forfeiture, discovery daemons |
| 2 | **Sequence Diagram** | [A4 PDF](diagrams/Sequence_Diagram_A4.pdf) | [PNG](diagrams/Sequence_Diagram.png) / [SVG](diagrams/Sequence_Diagram.svg) | [Source](diagrams/Sequence_Diagram.puml) | [Sequence_Diagram.md](diagrams/Sequence_Diagram.md) | Advocate admissions -> MP Cyber Treasury fee check -> Clash check -> CMO decree |
| 3 | **Class Diagram** | [A4 PDF](diagrams/Class_Diagram_A4.pdf) | [PNG](diagrams/Class_Diagram.png) / [SVG](diagrams/Class_Diagram.svg) | [Source](diagrams/Class_Diagram.puml) | [Class_Diagram.md](diagrams/Class_Diagram.md) | Domain entities, OOP inheritance, encapsulation, and database ORM mappings |
| 4 | **Component Diagram** | [A4 PDF](diagrams/Component_Diagram_A4.pdf) | [PNG](diagrams/Component_Diagram.png) / [SVG](diagrams/Component_Diagram.svg) | [Source](diagrams/Component_Diagram.puml) | [Component_Diagram.md](diagrams/Component_Diagram.md) | 5-tier decoupled micro-architecture (Presentation, Gateway, Business, Storage, External) |
| 5 | **Deployment Diagram** | [A4 PDF](diagrams/Deployment_Diagram_A4.pdf) | [PNG](diagrams/Deployment_Diagram.png) / [SVG](diagrams/Deployment_Diagram.svg) | [Source](diagrams/Deployment_Diagram.puml) | [Deployment_Diagram.md](diagrams/Deployment_Diagram.md) | Physical node topologies, Uvicorn ASGI, SQLite WAL/MySQL, Cyber Treasury & NJDG gateways |
| 6 | **Package Diagram** | [A4 PDF](diagrams/Package_Diagram_A4.pdf) | [PNG](diagrams/Package_Diagram.png) / [SVG](diagrams/Package_Diagram.svg) | [Source](diagrams/Package_Diagram.puml) | [Package_Diagram.md](diagrams/Package_Diagram.md) | Modular package structure of `backend.core`, `models`, `schemas`, `services`, `api.v1`, `frontend` |
| 7 | **Object Diagram** | [A4 PDF](diagrams/Object_Diagram_A4.pdf) | [PNG](diagrams/Object_Diagram.png) / [SVG](diagrams/Object_Diagram.svg) | [Source](diagrams/Object_Diagram.puml) | [Object_Diagram.md](diagrams/Object_Diagram.md) | Live runtime object snapshot of Suit `COMM_SUIT_301_2026` in Indore Commercial Court |

---

## 🧩 Gang of Four (GoF) Design Patterns Architecture

The codebase incorporates formal **Gang of Four (GoF) Design Patterns** in `backend/app/patterns/` to fulfill the **SVVV B.Tech CSE Semester-VII Major Project (BTCS706N)** rubric:

### 1. Creational: Singleton Pattern (`backend/app/patterns/singleton.py`)
* **`JudicialVaultSingleton`**:
  * **Pattern**: Double-checked locking thread-safe Singleton (`threading.Lock()`).
  * **Responsibility**: Central authority for SHA-256 digital docket verification, tamper-evident document seals, and immutable audit trails across concurrent ASGI worker threads.
* **`DatabaseConnectionPoolSingleton`**:
  * **Responsibility**: Guarantees a single SQLAlchemy Engine instance and session factory pool, eliminating thread-pool leaks and SQLite database contention.

### 2. Creational: Factory Method / Abstract Factory Pattern (`backend/app/patterns/factory.py`)
* **`CaseManagementDecree` (Abstract Product)** & **`CMODecreeFactory` (Abstract Creator)**:
  * **Responsibility**: Standardized Order XV-A Rule 2 CPC statutory decree construction. Subclasses dynamically formulate discovery timetables, framed issues, and strict witness caps according to the case category:
    * **`CommercialDecreeFactory`**: Commercial Courts Act 2015 strict 4-stage timetable (15d / 30d / 45d / 60d), witness quota: 2.
    * **`ChequeBounceDecreeFactory`**: Section 138 Negotiable Instruments Act fast-track schedule (7d bank memo, 14d notice, 28d cross-examination), witness quota: 1.
    * **`SummarySuitDecreeFactory`**: Order XXXVII CPC leave to defend and deposit schedule (10d / 21d), witness quota: 1.
    * **`ArbitrationDecreeFactory`**: Sections 34 & 36 Arbitration and Conciliation Act (30d record-based review), witness quota: 0.
    * **`GeneralCivilDecreeFactory`**: Standard Order XV-A Rules 1–5 civil procedure, witness quota: 3.
  * **`DecreeFactoryProvider`**: Central registry and dispatcher resolving case categories to specialized concrete factories.

### 3. Behavioral: Strategy Pattern (`backend/app/patterns/strategy.py`)
* **`SchedulingStrategy` (Abstract Strategy)** & **`ClashDetectionContext` (Context)**:
  * **Responsibility**: Decouples the advocate and courtroom collision-detection algorithms from the calendar scheduler, enabling runtime hot-swapping:
    * **`StrictBenchSlottingStrategy`**: Zero-tolerance physical court hall and counsel non-overlap policy.
    * **`FlexibleBufferSlottingStrategy`**: Enforces a 15-minute inter-courtroom transit buffer preventing advocate exhaustion across expansive district court complexes.
    * **`VirtualHybridSlottingStrategy`**: E-Courts VC Link mode where courtroom physical collisions are waived, while advocate personal clashes remain strictly enforced.

---

## 🧪 Automated Testing & Code Coverage Report

The platform is fortified with 23 comprehensive PyTest test suites covering API security, RBAC, Order XV-A statutory workflows, and GoF patterns:

```bash
# Run complete test suite with coverage report
PYTHONPATH=. pytest backend/tests/ -v --cov=backend/app --cov-report=term --cov-report=html:htmlcov
```

* **Test Suites**: 23/23 Tests Passed (100% Pass Rate).
* **Code Coverage**: Comprehensive line and branch coverage across models, schemas, routers, and patterns.
* **Interactive Coverage Report**: View HTML report at [`htmlcov/index.html`](htmlcov/index.html).

---

## ⚖️ Legal & Statutory Framework
* **Code of Civil Procedure, 1908 (CPC)**: Order XV-A (Case Management Hearing).
* **Commercial Courts Act, 2015**: Sections 2(1)(c), 15, and 16.
* **Information Technology Act, 2000**: Section 65B (Admissibility of electronic records and digital certificates).

