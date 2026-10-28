# Deployment Diagram: Case Management e-Portal Architecture

**Academic Framework:** Major Project (BTCS706N) - Semester VII  
**Institution:** Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore  
**Department:** Computer Science and Engineering  
**Team ID:** SVVV-CSE-2026-MP-14  
**Project Guide:** Prof. Shweta Pandey  

---

## 🖼️ Print-Ready Diagram Image

> [!TIP]
> **High-Resolution Vector SVG**: [Download Deployment_Diagram.svg](file:///Users/mukulbhamgare/Desktop/case-management-eportal/diagrams/Deployment_Diagram.svg)  
> **Print-Ready PNG Image**: [Download Deployment_Diagram.png](file:///Users/mukulbhamgare/Desktop/case-management-eportal/diagrams/Deployment_Diagram.png)  
> **Full Printable UML Book (HTML)**: [Open Printable_UML_Book.html](file:///Users/mukulbhamgare/Desktop/case-management-eportal/diagrams/Printable_UML_Book.html)

<div align="center">
  <img src="Deployment_Diagram.png" alt="Deployment Diagram - Physical Architecture" width="85%" style="border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" />
</div>

---

## 1. Visual Mermaid Deployment Diagram

```mermaid
graph TB
    %% ==========================================
    %% 1. CLIENT TIER
    %% ==========================================
    subgraph Client_Device ["Client Hardware Tier (Advocate / Judge / Clerk / Citizen)"]
        subgraph Web_Browser ["Modern Web Browser (Chrome 120+ / Edge / Safari)"]
            SPA["React 19 SPA (Vite Production Bundle)"]
            RTC["WebRTC MediaStream Client Engine"]
            Cal["FullCalendar Court Schedule Grid"]
        end
    end

    %% ==========================================
    %% 2. INGRESS & TLS
    %% ==========================================
    subgraph Ingress_Tier ["Web Ingress & Reverse Proxy Node"]
        Nginx["NGINX Reverse Proxy / TLS 1.3 Terminator\n(Port 443 HTTPS / Port 80 HTTP)"]
        SSL["TLS/SSL Digital Certificate\n(mp-highcourt.gov.in)"]
    end

    %% ==========================================
    %% 3. APPLICATION SERVER TIER
    %% ==========================================
    subgraph App_Server ["Application Server (Ubuntu 24.04 LTS / Port 8000)"]
        subgraph ASGI_Runtime ["Python 3.11 / Uvicorn ASGI Server"]
            API_Core["FastAPI REST Application Core\n(Order XV-A CPC Service Endpoints)"]
            WS_Hub["WebSocket Signaling & Real-time Hub"]
            CMO_Gen["Automated CMO PDF/A Engine"]
            Scheduler["Clash Detection & Multi-Bench Scheduler"]
            Deadlines["Statutory Discovery Deadline Monitor Daemon"]
            Hasher["SHA-256 Cryptographic Hash Sealer"]
        end
    end

    %% ==========================================
    %% 4. PERSISTENCE & DOCUMENT VAULT
    %% ==========================================
    subgraph Storage_Node ["Persistence & Storage Infrastructure Node"]
        DB[("Relational Database Engine\n(SQLite 3 WAL Mode / MySQL 8.0)\nTables: cases, users, admissions_matrix,\ncase_management_orders, echallan, audit_trail")]
        Vault[("Tamper-Proof Document Vault\n(/uploads/documents/)\nEncrypted Plaints, Exhibits, Sealed Decrees")]
    end

    %% ==========================================
    %% 5. EXTERNAL STATUTORY GATEWAYS
    %% ==========================================
    subgraph External_Gateways ["External Sovereign & Judicial Gateways"]
        Treasury["MP Cyber Treasury Portal API\n(mptreasury.gov.in - CRN Verification)"]
        eCourts["e-Courts CIS / NJDG Gateway\n(National Judicial Data Grid Sync)"]
        SpeedPost["India Post Speed Post Tracking API\n(Summons Dispatch & Delivery Status)"]
        SMS_Gate["Judicial SMS / SMTP Service\n(Hearing Alerts & Causelist Push)"]
    end

    %% ==========================================
    %% 6. DEVOPS CI/CD CLOUD
    %% ==========================================
    subgraph GitHub_Cloud ["GitHub Enterprise / Cloud Infrastructure"]
        Actions["GitHub Actions CI/CD Runner (ubuntu-latest)\n- Job 1: PyTest & Flake8\n- Job 2: Oxlint & Vite Dist\n- Job 3: Quality Verification Gate"]
    end

    %% Network Connections
    Web_Browser -->|HTTPS TLS 1.3 / WSS| Nginx
    Nginx -->|Reverse Proxy HTTP 8000 / WS| ASGI_Runtime
    ASGI_Runtime -->|SQLAlchemy 2.0 POSIX I/O| DB
    ASGI_Runtime -->|AES-256 File I/O| Vault

    API_Core -.->|REST / TLS| Treasury
    API_Core -.->|SOAP / JSON| eCourts
    API_Core -.->|REST API| SpeedPost
    API_Core -.->|SMPP / SMTP| SMS_Gate

    Actions -.->|Automated Webhook Deploy| App_Server
```

---

## 2. Infrastructure & Node Deployment Details

### Node 1: Client Hardware & Execution Environment
- **Hardware Profile:** Commercial Litigant PCs, Judge Laptops, Mobile Devices.
- **Client Execution:** Browser runtime executing React 19 SPA, Tailwind CSS utilities, WebRTC `RTCPeerConnection` for virtual courtroom hearing rooms, and WebSocket clients for live court board updates.

### Node 2: Web Ingress & TLS Termination Node
- **Operating Environment:** NGINX 1.24+ reverse proxy.
- **Security Protocols:** TLS 1.3 with strict `HSTS` headers, rate limiting (100 req/sec per IP to prevent DoS on filing windows), and CORS lockdown restricted to authorized judicial subdomains.

### Node 3: Asynchronous Application Server Node
- **Operating System:** Ubuntu 24.04 LTS (x86_64 / ARM64).
- **Runtime Environment:** Python 3.11 with `uvloop` high-throughput event loop and Uvicorn multi-worker ASGI server.
- **Core Micro-Engines:**
  - Automated CMO Generator with ReportLab / PDF/A compliant generation.
  - Multi-Bench Clash Detection Engine querying overlapping court appearances across Indore, Jabalpur, and Gwalior benches.
  - Discovery Deadline Daemon calculating statutory 15-day limits per Order XV-A Rule 3.

### Node 4: Persistence & Storage Tier
- **Database Architecture:** Relational DB with foreign key constraints, indexed on CNR Number, Case Number, Hearing Date, and Advocate Bar Registration Number.
- **Cryptographic Document Vault:** File system directory `/uploads/documents/` maintaining SHA-256 integrity checksums for every uploaded plaint, written statement, and evidentiary exhibit.

### Node 5: External Sovereign Infrastructure
- **MP Cyber Treasury (`mptreasury.gov.in`):** Real-time verification of Challan Reference Numbers (CRN) for commercial court fee compliance.
- **e-Courts CIS & NJDG:** Bi-directional sync with Case Information System (CIS 3.2).
- **India Post Speed Post Service:** Tracks physical summons delivery to ensure strict compliance with Order V Rule 9 CPC.
