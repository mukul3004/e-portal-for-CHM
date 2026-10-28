# Object Diagram: Runtime Instance Snapshot (Order XV-A CPC)

**Academic Framework:** Major Project (BTCS706N) - Semester VII  
**Institution:** Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore  
**Department:** Computer Science and Engineering  
**Team ID:** SVVV-CSE-2026-MP-14  
**Project Guide:** Prof. Shweta Pandey  

---

## 🖼️ Print-Ready Diagram Image

> [!TIP]
> **High-Resolution Vector SVG**: [Download Object_Diagram.svg](file:///Users/mukulbhamgare/Desktop/case-management-eportal/diagrams/Object_Diagram.svg)  
> **Print-Ready PNG Image**: [Download Object_Diagram.png](file:///Users/mukulbhamgare/Desktop/case-management-eportal/diagrams/Object_Diagram.png)  
> **Full Printable UML Book (HTML)**: [Open Printable_UML_Book.html](file:///Users/mukulbhamgare/Desktop/case-management-eportal/diagrams/Printable_UML_Book.html)

<div align="center">
  <img src="Object_Diagram.png" alt="Object Diagram - Runtime Instance Snapshot" width="85%" style="border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" />
</div>

---

## 1. Visual Mermaid Object Diagram

```mermaid
graph TD
    %% ==========================================
    %% OBJECT INSTANCES
    %% ==========================================
    subgraph Instances ["Runtime Object State Snapshot: Suit COMM_SUIT_301_2026"]
        CaseObj["<u>caseInstance: Case</u><br/>id = 1<br/>cnr_number = 'MPHC010048212026'<br/>case_number = 'COMM_SUIT_301_2026'<br/>title = 'M/s Malwa Agro Tech Ltd. v. Narmada Bio-Energy Pvt. Ltd.'<br/>claim_amount = ₹45,00,000.00<br/>stage = 'ORDER_XVA_CMH_ACTIVE'<br/>bench = 'Indore Bench'<br/>court_hall = 'Court Room 4'"]

        JudgeObj["<u>judgeInstance: User</u><br/>id = 101<br/>name = 'Hon\'ble Justice Arun Mishra'<br/>role = 'JUDGE'<br/>bench = 'Indore Bench'<br/>dsc_fingerprint = 'SHA256:7a9f...3c81'"]

        AdvPlffObj["<u>plaintiffCounsel: User</u><br/>id = 201<br/>name = 'Adv. Himanshu Bawaniya'<br/>role = 'ADVOCATE'<br/>bar_registration = 'MP/4821/2012'<br/>party = 'Plaintiff'"]

        AdvDefObj["<u>defendantCounsel: User</u><br/>id = 202<br/>name = 'Adv. Ragini Sharma'<br/>role = 'ADVOCATE'<br/>bar_registration = 'MP/9102/2016'<br/>party = 'Defendant'"]

        Adm1Obj["<u>admissionItem1: AdmissionItem</u><br/>id = 501<br/>statement = 'Contract signed at Indore on 14 Jan 2025'<br/>status = 'ADMITTED'<br/>exhibit_ref = 'Exhibit P-1'<br/>sha256 = 'a3f5b...90de'"]

        Adm2Obj["<u>admissionItem2: AdmissionItem</u><br/>id = 502<br/>statement = 'Equipment conformed to technical specs'<br/>status = 'DENIED'<br/>exhibit_ref = 'Exhibit D-2 (Rejection Notice)'<br/>sha256 = 'f1c2d...45ab'"]

        CMOObj["<u>cmoInstance: CaseManagementOrder</u><br/>id = 801<br/>cmo_number = 'CMO/IND/2026/04'<br/>inspection_deadline = '2026-11-15 (<= 15d)'<br/>interrogatories_deadline = '2026-11-20 (<= 15d)'<br/>witness_affidavit_deadline = '2026-11-30 (<= 15d)'<br/>trial_commencement_date = '2026-12-08'<br/>is_digitally_signed = true<br/>seal_hash = '8e41bf...29cf'"]

        PayObj["<u>challanInstance: EChallanPayment</u><br/>id = 901<br/>crn = 'MPCT20261028XVA7819'<br/>amount = ₹12,500.00<br/>status = 'VERIFIED_PAID'<br/>bank = 'SBI Cyber Treasury MP'"]

        AuditObj["<u>auditInstance: AuditLog</u><br/>id = 1001<br/>event = 'CMO_DIGITALLY_SEALED'<br/>actor = 'Hon\'ble Justice Arun Mishra'<br/>timestamp = '2026-10-28 11:45:00 IST'"]
    end

    %% Object Links
    CaseObj ---|presided by| JudgeObj
    CaseObj ---|represented by| AdvPlffObj
    CaseObj ---|represented by| AdvDefObj
    CaseObj ---|contains item| Adm1Obj
    CaseObj ---|contains item| Adm2Obj
    CaseObj ---|governed by| CMOObj
    CaseObj ---|court fees paid| PayObj
    CMOObj -.->|recorded in| AuditObj
    CMOObj -.->|signed by| JudgeObj
```

---

## 2. Object State Analysis & Runtime Snapshot Interpretation

### 1. Concrete Case Snapshot
- The diagram models a live commercial dispute in the **High Court of Madhya Pradesh (Bench at Indore)**:
  - **Parties:** M/s Malwa Agro Tech Industries Ltd. (Plaintiff) vs Narmada Bio-Energy Equipments Pvt. Ltd. (Defendant).
  - **Claim Valuation:** ₹45,00,000 (Commercial dispute exceeding the Specified Value threshold of ₹3 Lakhs under Section 2(1)(i) of the Commercial Courts Act, 2015).
  - **Unique Judicial Identifiers:** 16-digit CNR Number `MPHC010048212026` linked with Court Room 4.

### 2. Multi-Actor Object Collaboration
- `JudgeObj` (`Hon'ble Justice Arun Mishra`): Holds judicial DSC cryptographic credentials to execute binding decrees.
- `AdvPlffObj` (`Adv. Himanshu Bawaniya`) and `AdvDefObj` (`Adv. Ragini Sharma`): Verified Bar Council practitioners registered with active roles.

### 3. Admission vs. Triable Issue Contrast
- `admissionItem1`: The commercial contract execution is marked **`ADMITTED`** with reference to Exhibit P-1. As an uncontested fact, no evidence will be recorded on this at trial, saving court time.
- `admissionItem2`: The conformity of goods to technical specifications is marked **`DENIED`** with reference to Exhibit D-2. This is formulated into a substantive triable issue in the Case Management Order.

### 4. Statutory Timetable Object (`cmoInstance`)
- Reflects the non-negotiable statutory timelines fixed under Order XV-A Rule 2 CPC:
  - Document Inspection: Within 15 days (`2026-11-15`)
  - Interrogatories: Within 15 days (`2026-11-20`)
  - Evidence Affidavits: Within 15 days (`2026-11-30`)
  - Continuous Cross-Examination Trial: Commencing `2026-12-08`
- Sealed with SHA-256 hash `8e41bf920c81...29cf` and cross-referenced in `auditInstance`.
