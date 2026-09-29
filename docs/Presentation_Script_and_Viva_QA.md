# SVVV Major Project - Presentation I: 3-Member Speaking Script & Panel Viva Q&A Guide

**Project Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases  
**Institution:** Department of Computer Science & Engineering / IT, Shri Vaishnav Institute of Information Technology (SVIIT), SVVV, Indore  
**Project Guide:** Prof. Shweta Pandey  
**Presented by:**
- **Member 1 (Mukul Bhamgare - `23100BTCSAII14297`):** Slides 1 to 6 *(Foundation, Problem Domain & Research Context)*
- **Member 2 (Rashi Kashiv - `23100BTCSAII14314`):** Slides 7 to 11 *(Solution Domain, Innovation, Comparison & Architecture)*
- **Member 3 (Sakshi Singh - `23100BTCSAII14317` / Kanishk - `23100BTCSAII14293`):** Slides 12 to 17 *(Tech Stack, Real-World Impact, Outcomes & Conclusion)*

---

## Presentation Strategy & Time Budget (Total: ~10 to 12 Minutes)
- **Member 1 (Slides 1–6):** ~3.5 Minutes
- **Member 2 (Slides 7–11):** ~3.5 Minutes
- **Member 3 (Slides 12–17):** ~3.5 Minutes
- **Panel Viva Q&A:** ~5 Minutes

---

# PART 1: SPEAKING SCRIPT (SLIDE-BY-SLIDE)

```
================================================================================
MEMBER 1: FOUNDATION & PROBLEM DOMAIN (SLIDES 1 TO 6)
================================================================================
```

### SLIDE 1: Title Slide
* **Slide Title:** Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases
* **What to Say:**
  > "Respected panel members and teachers, good morning.  
  > Today, our team is presenting our Major Project-I titled **'Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases'**.  
  > This project is being carried out under the valuable guidance of **Prof. Shweta Pandey**.  
  > Our team members are Mukul Bhamgare, Rashi Kashiv, Sakshi Singh, and Kanishk."
* **Pro Tip:** Look at the panel with confidence, smile, and stand straight.

---

### SLIDE 2: Presentation Outline
* **Slide Title:** Presentation Outline
* **What to Say:**
  > "Our presentation is structured into six key sections:  
  > First, the Synopsis Overview and Abstract with research background.  
  > Second, the Problem Domain and gaps in current court portals.  
  > Third, our Proposed Solution Domain and system innovation.  
  > Fourth, System Architecture with nine modular components.  
  > Fifth, Software and Hardware requirements.  
  > And finally, Real-World Impact, Expected Outcomes, and Academic References."
* **Pro Tip:** Keep this slide under 20 seconds. It shows you have a structured roadmap.

---

### SLIDE 3: Synopsis Overview
* **Slide Title:** Synopsis Overview
* **What to Say:**
  > "To understand why this project is needed:  
  > Right now, over **53 million cases** are pending in Indian courts. Nearly **50% of court time** is wasted on routine paperwork, missing notices, and repeated date postponements.  
  > A **Case Management Hearing (CMH)** is a pre-trial meeting where the judge and lawyers meet *before* trial to agree on undisputed facts and set fixed deadlines.  
  > However, existing court websites only act as passive noticeboards. There is no online collaborative tool for pre-trial case management.  
  > Our system solves this by providing a dedicated pre-trial portal with an online fact checklist, clash-free lawyer scheduling, and instant automated court orders."
* **Key Takeaway:** Emphasize the contrast between "passive noticeboard" and "active workspace".

---

### SLIDE 4: Abstract
* **Slide Title:** Abstract (Research Base & Problem Formulation)
* **What to Say:**
  > "Our project is backed by high-impact empirical research.  
  > A 2024 landmark study published by **Cambridge University Press**, conducted by researchers from **IISc Bangalore and NLSIU across 1,775 district courts**, proved an eye-opening fact:  
  > Simply appointing more judges does *not* reduce case backlog.  
  > Instead, poor case management is the real culprit: **over 50% of civil cases get stuck for over a year—a median of 394 days—just waiting for basic appearances and procedural dates.**  
  > Our e-Portal directly tackles this pre-trial stagnation under **Order XV-A of the Code of Civil Procedure (CPC)**.  
  > We implement this using a modern stack: React.js, Python FastAPI, MySQL 8.0, and WebRTC."
* **Key Takeaway:** Quote the IISc Bangalore / Cambridge 2024 finding and the "394 days" figure clearly.

---

### SLIDE 5: Problem Domain
* **Slide Title:** Problem Domain (Understanding What CMH Is and Why It Matters)
* **What to Say:**
  > "What exactly is a Case Management Hearing?  
  > In civil litigation under Order XV-A CPC, before a judge starts hearing witnesses, both sides must hold a pre-trial conference.  
  > The goal is to filter out agreed facts, limit unnecessary witnesses, set strict timelines for discovery, and explore early settlement via mediation.  
  > When done right, CMH can save up to **50% of bench time**.  
  > But today, judges and lawyers still handle this using heavy physical paper bundles and static PDF cause lists. This causes severe date clashes and months of delay."
* **Key Takeaway:** Clarify that CMH happens *before* the trial to save trial time.

---

### SLIDE 6: Problem in Existing System
* **Slide Title:** Problem in Existing System (6 Core Inefficiencies)
* **What to Say:**
  > "When we analyzed current court portals like `mphc.gov.in` and eCourts, we found 6 critical bottlenecks:  
  > 1. **Scattered Information:** Petitions and orders are in separate silos.  
  > 2. **Lawyer Schedule Clashes:** Daily cause lists are published without cross-courtroom checks. If a lawyer has two hearings at 11 AM in Court 3 and Court 7, one case is automatically postponed.  
  > 3. **Manual Fact Checking:** Judges spend hours manually sorting paper affidavits just to see which documents are admitted.  
  > 4. **No Deadline Tracking:** No automated system tracks 14-day discovery countdowns.  
  > 5. **Slow Paper Summons:** Physical notices take weeks or get lost.  
  > 6. **Disconnected Video Calls:** Current virtual hearings use standard Zoom links with no direct connection to case dockets."
* **Handover to Member 2:**  
  > *"To explain how our e-Portal systematically solves each of these 6 problems, I now hand over the presentation to my teammate, [Member 2 / Rashi]."*

---

```
================================================================================
MEMBER 2: SOLUTION DOMAIN, INNOVATION & ARCHITECTURE (SLIDES 7 TO 11)
================================================================================
```

### SLIDE 7: Solution Domain
* **Slide Title:** Solution Domain (Our Proposed e-Portal)
* **What to Say:**
  > "Thank you, [Member 1].  
  > Good morning, respected panel. Our solution transforms court technology from a **'Passive Noticeboard'** into an **'Active Collaborative Workspace'**.  
  > While current websites only tell users what happened in the past, our e-Portal helps judges and lawyers actively resolve pre-trial bottlenecks before they enter the courtroom.  
  > We deliver four main technical solutions:  
  > 1. An **Online Admissions & Denials Matrix** where lawyers check off agreed facts online.  
  > 2. A **Smart Clash-Free Calendar** that automatically cross-checks advocate schedules across all courtrooms.  
  > 3. An **In-Browser Video Courtroom** with live evidence files on-screen.  
  > 4. And a **One-Click Case Management Order Generator** that outputs signed judicial orders in seconds."
* **Key Takeaway:** Emphasize the four pillars clearly.

---

### SLIDE 8: Purpose of the Project / Innovativeness and Usefulness
* **Slide Title:** Purpose / Innovativeness & Real-World Usefulness
* **What to Say:**
  > "The core purpose of our project is to eliminate the 45% to 55% procedural delay and clear the 394-day pre-trial stagnation.  
  > Our key innovations are:  
  > - It is the **first dedicated pre-trial CMH platform tailored to Indian procedural law**.  
  > - It features an **interactive, live digital fact checklist** with SHA-256 tamper-proof file integrity.  
  > - It includes an **automated schedule conflict detector**.  
  > For society and the judiciary, this saves up to half of in-court hearing time, enforces strict trial timetables, and drastically lowers legal expenses for common citizens."
* **Key Takeaway:** Highlighting SHA-256 document security and Order XV-A legal compliance.

---

### SLIDE 9: An Improvement Over Existing System (Comparison Table)
* **Slide Title:** An Improvement Over Existing System
* **What to Say:**
  > "Here is a direct comparison between existing portals like `mphc.gov.in` or eCourts and our CMH e-Portal:  
  > - In role: Existing portals are passive noticeboards; ours is an active workflow tool.  
  > - In fact checking: Today, lawyers file 100-page paper affidavits; in our portal, they use a structured online checklist.  
  > - In hearing dates: Courts currently print static PDF cause lists; our smart calendar detects advocate double-booking in real-time.  
  > - In virtual hearings: Existing courts use isolated Zoom or Webex links; we integrate video calling directly inside the browser alongside the case docket.  
  > - And in court orders: Stenographers currently take days to type and scan orders; our engine generates signed Case Management Orders immediately."
* **Key Takeaway:** Run down the table rows briskly and clearly.

---

### SLIDE 10: System Domain
* **Slide Title:** System Domain (The 9 Core Modules)
* **What to Say:**
  > "Our system architecture is organized into nine specialized modules:  
  > 1. **User Management:** Role-Based Access Control for Judges, Lawyers, Clerks, and Litigants.  
  > 2. **Case Management:** Digital case filing with metadata and SHA-256 document hashes.  
  > 3. **CMH Management:** The pre-trial workspace for admissions and framing issues.  
  > 4. **Smart Scheduling:** The conflict-free calendar engine.  
  > 5. **Document Management:** Centralized digital evidence repository.  
  > 6. **Notifications:** Automated SMS and email reminder service.  
  > 7. **Case Timeline:** Visual step-by-step progress tracking for litigants.  
  > 8. **Reports & Analytics:** Judicial dashboards tracking disposal rates and delays.  
  > 9. **Audit Logs:** Immutable activity tracking to ensure judicial integrity."
* **Key Takeaway:** Shows comprehensive engineering and thought behind the portal.

---

### SLIDE 11: Methodology to be Adopted / Planning of Work
* **Slide Title:** Methodology to be Adopted / Planning of Work
* **What to Say:**
  > "We are adopting an **Agile development methodology** split into 8 clear phases:  
  > Phase 1 covers requirement engineering based on Order XV-A CPC.  
  > Phase 2 establishes our relational database schemas in MySQL.  
  > Phase 3 implements high-speed asynchronous REST APIs in FastAPI.  
  > Phase 4 builds responsive dashboards using React.js and Tailwind CSS.  
  > Phase 5 integrates WebRTC video rooms and WebSockets for real-time sync.  
  > Phase 6 integrates the PDF order generation engine.  
  > Phases 7 and 8 focus on end-to-end security testing, performance tuning, and user evaluation."
* **Handover to Member 3:**  
  > *"Now, I hand over to [Member 3 / Sakshi / Kanishk] to present our Software and Hardware requirements, Real-World Impact, and Expected Outcomes."*

---

```
================================================================================
MEMBER 3: TECH STACK, REAL-WORLD IMPACT & OUTCOMES (SLIDES 12 TO 17)
================================================================================
```

### SLIDE 12: Software Requirements
* **Slide Title:** Software Requirement
* **What to Say:**
  > "Thank you, [Member 2].  
  > Respected panel, to ensure high speed, scalability, and security, we selected an enterprise-grade technology stack:  
  > - **On the Frontend:** We use **React.js with Tailwind CSS** for a fast, responsive interface, and **FullCalendar.js** for interactive hearing views.  
  > - **On the Backend:** We chose **Python 3.11 with FastAPI**. FastAPI provides asynchronous request handling, automatic Pydantic data validation, and built-in interactive Swagger API documentation.  
  > - **For the Database:** We selected **MySQL 8.0** with SQLAlchemy ORM. MySQL ensures strict ACID transaction compliance for legal records, combined with native JSON support for flexible fact-checklists.  
  > - **For Real-Time & Security:** We use **WebRTC** for peer-to-peer video hearings, **WebSockets** for live updates, **WeasyPrint** for PDF order generation, and **JWT with SHA-256** for authentication and tamper-proof evidence verification."
* **Key Takeaway:** Emphasize *why* FastAPI and MySQL were chosen (async speed and ACID compliance).

---

### SLIDE 13: Hardware Requirements
* **Slide Title:** Hardware Requirement
* **What to Say:**
  > "Our hardware specifications are split into three tiers:  
  > 1. **Development Environment:** Apple MacBook M4 Apple Silicon with 16 GB Unified Memory and 512 GB SSD, utilizing Docker and modern IDEs.  
  > 2. **Hosting Server:** A standard Quad-Core 2.5 GHz cloud or on-premise server with 8 GB to 16 GB RAM, 100 GB SSD, and an Nginx reverse proxy with SSL termination.  
  > 3. **End-User Client:** Any standard PC, laptop, iPad, or smartphone with a basic 2 Mbps internet connection, webcam, and modern browser like Chrome or Safari. No heavy local software installation is required."
* **Key Takeaway:** Highlights that the system is lightweight and accessible even on basic user hardware.

---

### SLIDE 14: Application Domain
* **Slide Title:** Application Domain (Where and Who Will Use It?)
* **What to Say:**
  > "Our e-Portal is designed for wide application across the Indian judicial hierarchy:  
  > - **Target Courts:** Commercial Courts where pre-trial Case Management is mandated by law, District Civil Courts where 80% of backlog exists, and specialized Tribunals like DRT and Consumer Forums.  
  > - **Target Users:** Judges, Advocates, Court Registry Clerks, and Citizens/Litigants.  
  > - **Case Types Handled:** Commercial and business disputes, contract breaches, loan recovery suits, property title matters, and arbitration proceedings."
* **Key Takeaway:** Connects the software directly to real court setups.

---

### SLIDE 15: Impact of the Work in the Real World
* **Slide Title:** Impact of the Work in the Real World
* **What to Say:**
  > "The real-world impact of our system directly addresses core national judicial challenges:  
  > 1. It **slashes pre-trial stagnation**, reducing the first-hearing delay from over 800 days down to under 30 days.  
  > 2. It **saves up to 50% of judge bench time** by eliminating arguments on uncontested documents.  
  > 3. It **saves citizens and businesses thousands of rupees** in travel costs and advocate fees for meaningless adjournment dates.  
  > 4. And by accelerating commercial dispute resolution, it improves the ease of doing business and restores public trust in the justice system."
* **Key Takeaway:** Focus on real societal and economic benefits.

---

### SLIDE 16: Expected Outcomes / Benefits
* **Slide Title:** Expected Outcomes / Benefits
* **What to Say:**
  > "At the conclusion of this project, we will deliver:  
  > - A fully operational, responsive **Case Management Hearing web portal**.  
  > - The interactive **Admissions & Denials matrix** and **conflict-free calendar**.  
  > - The **automated signed PDF court order generator**.  
  > - Complete SRS documentation and our IEEE-formatted academic manuscripts (Manuscript I: Review Paper, and Manuscript II: System Implementation).  
  > Measurable benefits include zero advocate schedule clashes, 50% faster pre-trial progression, and a 100% paperless workflow."
* **Key Takeaway:** Shows tangible, measurable deliverables.

---

### SLIDE 17: References & Conclusion
* **Slide Title:** References (Key Academic Papers)
* **What to Say:**
  > "Our project is grounded in peer-reviewed academic literature in standard IEEE format.  
  > Our primary base paper is the **2024 Cambridge University Press study by Aithala et al. (IISc Bangalore & NLSIU)** analyzing 1,775 courts.  
  > We also reference the **2026 e-Courts review study by Ojha & Dubey** analyzing 53 million pending cases on NJDG, and international case management research from IEEE and Springer.  
  > In conclusion, our e-Portal bridges statutory procedural law with modern software engineering to tackle India's judicial delay bottleneck.  
  > Thank you, respected panel. We are now happy to answer your questions."
* **Key Takeaway:** Crisp, scholarly conclusion opening the floor smoothly for viva Q&A.

---

# PART 2: PANEL VIVA QUESTIONS & MODEL ANSWERS

Below are the most critical questions panel members typically ask during Major Project-I viva at SVVV, categorized by member topic, along with concise, winning model answers.

---

## MEMBER 1: FOUNDATION, PROBLEM DOMAIN & RESEARCH

### Q1: What exactly is a Case Management Hearing (CMH)? How is it different from a regular trial hearing?
* **Model Answer:**
  > *"Sir/Ma'am, a regular trial hearing is where witnesses are cross-examined and final legal arguments occur.  
  > A Case Management Hearing (CMH) is an early pre-trial conference conducted under Order XV-A CPC. Its purpose is to filter out agreed facts before trial, resolve document disputes, set strict discovery deadlines, and explore mediation. It ensures that when the actual trial begins, zero court time is wasted on routine procedural arguments."*

### Q2: Why can't existing portals like eCourts Services or MP High Court portal (`mphc.gov.in`) do this?
* **Model Answer:**
  > *"Current portals like `mphc.gov.in` and eCourts are passive electronic noticeboards. They only display past case statuses, cause list PDFs, and uploaded orders.  
  > They have no interactive pre-trial workspace. They cannot let lawyers settle document admissions online, they cannot detect advocate schedule clashes across multiple courtrooms, and they do not automate pre-trial scheduling orders."*

### Q3: You mentioned an IISc Bangalore and Cambridge University study (2024). What did that study prove?
* **Model Answer:**
  > *"The 2024 study by Aithala et al., analyzing 1,775 district courts, empirically proved that merely adding more judges does not reduce court delays.  
  > They discovered that over 50% of cases in delayed courts are bottlenecked in preliminary 'appearance' and 'awaiting' stages for a median of 394 days. The paper concluded that the key driver of court speed is pre-trial case management and shortening the time to the first hearing."*

### Q4: What is Order XV-A of the Code of Civil Procedure (CPC)?
* **Model Answer:**
  > *"Order XV-A was introduced into the CPC by the Commercial Courts Act of 2015. It legally mandates that courts hold a Case Management Hearing within four weeks of filing written statements, establish a fixed trial timetable, limit witness examinations, and disallow routine adjournments without heavy penalties."*

---

## MEMBER 2: SOLUTION ARCHITECTURE, INNOVATION & MODULES

### Q5: How does your digital "Admissions & Denials" matrix work?
* **Model Answer:**
  > *"In traditional litigation, lawyers file 100-page paper affidavits stating which documents they accept or deny, which takes hours for the judge to reconcile.  
  > In our portal, both parties receive a structured digital checklist for each piece of evidence (contracts, receipts, emails). Lawyers select 'Admit' or 'Deny' with specific reasons. Admitted facts are instantly locked and marked undisputed, while only genuinely denied items are transferred to the judge as issues for trial."*

### Q6: How will your scheduling algorithm prevent advocate double-booking?
* **Model Answer:**
  > *"Currently, each judge's court publishes its daily cause list independently, so an advocate often has two matters listed at 11:00 AM in two different halls.  
  > In our portal, advocate bar council IDs are linked to scheduled hearings. When a court clerk attempts to book a CMH slot, our backend scheduling algorithm checks the advocate's global calendar across all linked courtrooms and flags scheduling conflicts before confirming the time slot."*

### Q7: Why did you divide the system into 9 modules? What does the Case Management Order (CMO) module do?
* **Model Answer:**
  > *"The 9-module design enforces separation of concerns, role-based security, and scalability.  
  > The CMO module is critical: after the CMH conference, it automatically compiles the admitted facts, disputed issues, witness list, and evidence deadlines into an official, signed Case Management Order PDF using templated automation. This eliminates the multi-day delay of stenographer typing and manual vetting."*

### Q8: What development methodology are you following?
* **Model Answer:**
  > *"We are following an Agile Scrum methodology divided into two-week sprints.  
  > This allows us to iteratively develop and test core modules—starting with database schemas and REST APIs, progressing through the Admissions Matrix and scheduling logic, and finishing with WebRTC video and PDF generation."*

---

## MEMBER 3: TECH STACK, HARDWARE, IMPACT & OUTCOMES

### Q9: Why did you choose Python FastAPI over Django, Node.js, or PHP?
* **Model Answer:**
  > *"We selected FastAPI because it is built on ASGI (Starlette) and supports native Python `async/await`, delivering performance comparable to NodeJS and Go while retaining Python's rich ecosystem.  
  > Furthermore, FastAPI provides automatic Pydantic data validation—which is essential for validating complex legal case inputs—and automatically generates interactive Swagger/OpenAPI documentation at `/docs` for seamless frontend integration."*

### Q10: Why did you choose MySQL 8.0 instead of MongoDB or another NoSQL database?
* **Model Answer:**
  > *"Court records and judicial proceedings require strict ACID compliance, referential integrity, and relational foreign keys between cases, orders, hearings, and advocates.  
  > MySQL 8.0 provides this rock-solid relational guarantee while also supporting native JSON columns. This gives us the best of both worlds: strict relational integrity for core legal dockets, and flexible JSON storage for dynamic admissions checklists."*

### Q11: How will video conferencing work? Why not just use a Zoom or Google Meet link?
* **Model Answer:**
  > *"Third-party links like Zoom require users to leave the portal and do not allow synchronized interaction with case files.  
  > We integrate WebRTC using the open-source Jitsi Meet API directly inside the browser screen. This enables a split-screen interface where the judge can view the lawyer via video while simultaneously reviewing the verified evidence checklist and signing the order on the same page."*

### Q12: How will you measure or evaluate whether your e-Portal is actually successful?
* **Model Answer:**
  > *"We will evaluate our portal against four concrete metrics:  
  > 1. Average bench time spent on preliminary pre-trial conferences (benchmarked against manual court observations).  
  > 2. Zero advocate schedule clashes generated during automated scheduling tests.  
  > 3. Turnaround time for generating and signing Case Management Orders (target: under 60 seconds vs days manually).  
  > 4. User acceptance testing scores from practicing advocates and legal researchers."*

---

## QUICK TIPS FOR PRESENTATION DAY
1. **Coordination:** Member 1 stands on the left, Member 2 in the center, Member 3 on the right.
2. **Slide Transitions:** When handing over, clearly announce your teammate's name so the panel sees strong team synergy.
3. **Answering Questions:** Let the assigned member answer first. If another teammate wants to add a valid technical point, say: *"To add to what my teammate explained..."* politely.
4. **Confidence:** You have real Cambridge/IISc research citations and a legally sound architecture under Order XV-A CPC—stand tall and speak with pride!
