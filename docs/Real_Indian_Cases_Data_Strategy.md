# Real Indian Court Cases Dataset Strategy

**Project:** Case Management Hearing (CMH) e-Portal  
**Statutory Domain:** Order XV-A CPC & Commercial Courts Act, 2015  
**Jurisdiction:** Republic of India (Commercial Divisions, High Courts, District Commercial Courts)

---

## 1. Compliance Mandate: Zero Synthetic / Fake Cases

Per project requirements, the system strictly relies on **authentic Indian judicial records**. Synthetic mock data or foreign case laws (US/UK) are inadmissible for this major project demonstration.

Every case ingested into `cmh_portal.db` must feature:
1. **Valid 16-Digit CNR Number** conforming to the eCourts alphanumeric specification (`[2 State][2 Dist][2 Est][6 Case Number][4 Year]`, e.g., `MPHC010045212024`).
2. **Authentic Indian Parties**: Real corporate entities, proprietorships, public undertakings, or individuals.
3. **Indian Legal Citations & Statutes**:
   - Order XV-A CPC (Case Management Hearing)
   - Commercial Courts Act, 2015 (Sec 2(1)(c), Sec 12A Pre-institution Mediation)
   - Section 138, Negotiable Instruments Act, 1881 (Cheque Dishonour)
   - Arbitration and Conciliation Act, 1996 (Sec 9, Sec 11, Sec 34)
   - Indian Contract Act, 1872 (Breach of Contract, Liquidated Damages)
4. **Verifiable Court Benches**:
   - High Court of Madhya Pradesh (Bench at Indore / Principal Seat Jabalpur)
   - District Commercial Court, Indore (Old High Court Building)
   - Delhi High Court (Commercial Division)
   - Bombay High Court (Commercial Appellate Division)

---

## 2. Approved Indian Legal Repositories

### A. Indian Kanoon (`https://indiankanoon.org/`)
* **Scope**: Largest searchable public repository of Indian Supreme Court, High Court, and Tribunal judgments.
* **Target Query Patterns**:
  - `"Order XV-A" commercial court`
  - `"case management hearing" "Commercial Courts Act"`
  - `"statement of admissions and denials" commercial suit`
  - `"Section 138" "Negotiable Instruments" Indore`
  - `"Section 34" "Arbitration and Conciliation Act" commercial division`
* **Data Fields Extracted**:
  - Court Name & Coram (Judge names)
  - Parties: Petitioner/Plaintiff vs. Respondent/Defendant
  - Case Number & Neutral Citation
  - Date of Judgment / Order
  - Ratio Decidendi & Framed Issues

### B. eCourts Services (`https://services.ecourts.gov.in/`)
* **Scope**: Official portal of the e-Committee, Supreme Court of India.
* **Target Services**:
  - Case Status by CNR Number
  - Daily Orders and Case History
  - Cause Lists of Commercial Courts

### C. National Judicial Data Grid (NJDG) (`https://njdg.ecourts.gov.in/`)
* **Scope**: Public judicial analytics platform tracking pending and disposed cases across 18,000+ courts.
* **Target Information**:
  - Commercial dispute case categories (Commercial Suit, Summary Suit, Execution Petition).
  - Age analysis and stage tracking (Pleadings, Evidence, Final Arguments).

### D. Madhya Pradesh High Court Portal (`https://mphc.gov.in/`)
* **Indore Bench Focus**:
  - Commercial Appeals (COMAP)
  - Arbitration Requests (ARBR)
  - First Appeals (FA) & Miscellaneous Appeals (MA)

---

## 3. Case Categorization Matrix for CMH Portal (100+ Dataset)

| Category Code | Subject Matter | Governing Act / Section | Sample Jurisdiction |
|---|---|---|---|
| `COMMERCIAL` | Construction & Infrastructure Disputes, Supply Agreements, Trademark Infringement | Commercial Courts Act, 2015 | Commercial Court, Indore |
| `CIVIL` | Specific Performance, Title Injunctions, Partition Suits | Specific Relief Act, 1963 / CPC Order XV-A | Civil Court Senior Division |
| `CHEQUE_BOUNCE` | High-Value Dishonour of Cheques between Enterprises | Section 138 & 141, NI Act, 1881 | Special Metropolitan Magistrate |
| `ARBITRATION` | Section 34 Challenge to Arbitral Award, Sec 9 Interim Relief | Arbitration & Conciliation Act, 1996 | High Court of MP (Indore Bench) |
| `CONTRACT` | Breach of Commercial Supply Contract, Bank Guarantee Injunction | Indian Contract Act, 1872 | Commercial Court Division |

---

## 4. Ingestion Schema & Verification Protocol

Each record in `scripts/seed_real_indian_cases.py` must populate:
```json
{
  "cnr_number": "MPHC010045212024",
  "case_title": "M/s Indore Infrastructure Ltd. v. MP Road Development Corp.",
  "case_type": "COMMERCIAL",
  "claim_valuation": 48500000.00,
  "court_hall_id": "Court Hall 3 - Commercial Bench",
  "filing_date": "2024-03-12",
  "status": "IN_PROGRESS",
  "ratio_summary": "Dispute regarding delayed milestone payments and liquidated damages under EPC contract.",
  "admitted_averments_count": 8,
  "denied_averments_count": 4,
  "verified_source": "Indian Kanoon / MP High Court e-Filing Record"
}
```
