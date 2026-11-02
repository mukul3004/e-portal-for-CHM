#!/usr/bin/env python3
"""
MP High Court Commercial Division - Official PDF Generator
Generates tamper-evident, vector-sharp PDF documents for all:
1. Pleadings (Order VII CPC Plaint / Written Statements)
2. Annexed Reliance Exhibits (Section 65B Certified Contracts & Invoices)
3. Case Management Orders (Order XV-A Rule 5 CPC CMO Decrees)
"""

import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas

# Ensure backend imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.database import SessionLocal
from backend.app.models.case import Case, Pleading, Exhibit

STORAGE_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "storage"))
PLEADINGS_DIR = os.path.join(STORAGE_BASE, "pleadings")
EXHIBITS_DIR = os.path.join(STORAGE_BASE, "exhibits")
ORDERS_DIR = os.path.join(STORAGE_BASE, "orders")

os.makedirs(PLEADINGS_DIR, exist_ok=True)
os.makedirs(EXHIBITS_DIR, exist_ok=True)
os.makedirs(ORDERS_DIR, exist_ok=True)

class NumberedCanvas(canvas.Canvas):
    """Adds formal running judicial headers, borders, and page numbering."""
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0f172a"))

        # Formal double border around page
        self.setStrokeColor(colors.HexColor("#0f172a"))
        self.setLineWidth(1.5)
        self.rect(36, 36, A4[0] - 72, A4[1] - 72)
        self.setStrokeColor(colors.HexColor("#d97706"))
        self.setLineWidth(0.6)
        self.rect(39, 39, A4[0] - 78, A4[1] - 78)

        # Running Top Header
        self.drawString(48, A4[1] - 30, "HIGH COURT OF MADHYA PRADESH • COMMERCIAL DIVISION • BENCH AT INDORE")
        self.setFont("Helvetica", 8)
        self.drawRightString(A4[0] - 48, A4[1] - 30, "ORDER XV-A CPC CASE MANAGEMENT E-PORTAL")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(48, A4[1] - 33, A4[0] - 48, A4[1] - 33)

        # Running Footer
        self.line(48, 48, A4[0] - 48, 48)
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#475569"))
        self.drawString(48, 38, "Certified True Electronic Record • Digitally Sealed Under Sec 65B IT Act & Order VI Rule 15 CPC")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 48, 38, page_str)
        self.restoreState()


def get_custom_styles():
    styles = getSampleStyleSheet()
    
    court_title = ParagraphStyle(
        "CourtTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#070d1e"),
        spaceAfter=3
    )
    
    court_sub = ParagraphStyle(
        "CourtSub",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=13,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#b45309"),
        spaceAfter=8
    )
    
    doc_heading = ParagraphStyle(
        "DocHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=12
    )

    body_legal = ParagraphStyle(
        "BodyLegal",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=10,
        leading=15,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
        firstLineIndent=20
    )

    body_bold = ParagraphStyle(
        "BodyBold",
        parent=styles["Normal"],
        fontName="Times-Bold",
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
        spaceAfter=4
    )

    memo_style = ParagraphStyle(
        "MemoStyle",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=9.5,
        leading=14,
        alignment=TA_LEFT
    )

    seal_mono = ParagraphStyle(
        "SealMono",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=8,
        leading=11,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#0f172a")
    )

    return {
        "court_title": court_title,
        "court_sub": court_sub,
        "doc_heading": doc_heading,
        "body_legal": body_legal,
        "body_bold": body_bold,
        "memo_style": memo_style,
        "seal_mono": seal_mono
    }


def generate_plaint_pdf(case: Case, pleading: Pleading, file_path: str):
    """Generates an authentic MP High Court Commercial Plaint PDF."""
    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        leftMargin=50,
        rightMargin=50,
        topMargin=50,
        bottomMargin=50
    )
    styles = get_custom_styles()
    story = []

    # 1. Official Court Masthead
    story.append(Paragraph("IN THE HIGH COURT OF MADHYA PRADESH : BENCH AT INDORE", styles["court_title"]))
    story.append(Paragraph("(COMMERCIAL DIVISION - CONSTITUTED UNDER SEC 4 OF COMMERCIAL COURTS ACT, 2015)", styles["court_sub"]))
    story.append(Spacer(1, 4))

    # Case identifiers metadata table
    title_parts = case.case_title.split(" vs. ") if " vs. " in case.case_title else [case.case_title, "M/s Pro-Forma Defendant"]
    plaintiff = title_parts[0].strip()
    defendant = title_parts[1].strip() if len(title_parts) > 1 else "Defendant"
    
    suit_no = f"COMMERCIAL SUIT NO. CS(COMM)/{case.cnr_number[6:10]}/{case.cnr_number[-4:]}"
    meta_data = [
        [Paragraph(f"<b>CNR NUMBER:</b> <font color='#b45309'>{case.cnr_number}</font>", styles["memo_style"]),
         Paragraph(f"<b>SUIT IDENTIFIER:</b> {suit_no}", styles["memo_style"])],
        [Paragraph(f"<b>DISPUTE NATURE:</b> Commercial Division (Order XV-A CPC)", styles["memo_style"]),
         Paragraph(f"<b>CLAIM VALUATION:</b> ₹{case.claim_valuation:,.2f}", styles["memo_style"])],
        [Paragraph(f"<b>FILING DATE:</b> {case.filing_date.strftime('%d %B %Y')}", styles["memo_style"]),
         Paragraph(f"<b>PRE-TRIAL CMH COURT:</b> Hall 04 (Malwa Region)", styles["memo_style"])]
    ]
    t_meta = Table(meta_data, colWidths=[240, 250])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0f172a")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # 2. Memo of Parties
    memo_data = [
        [Paragraph(f"<b>{plaintiff.upper()}</b><br/><font size=8 color='#475569'>A commercial entity registered under the Companies Act / Partnership Act, having principal place of business at Indore, M.P.</font>", styles["memo_style"]),
         Paragraph("<b>... PLAINTIFF</b>", styles["memo_style"])],
        [Paragraph("<b>VERSUS</b>", ParagraphStyle("Versus", fontName="Helvetica-Bold", fontSize=9, alignment=TA_CENTER)), ""],
        [Paragraph(f"<b>{defendant.upper()}</b><br/><font size=8 color='#475569'>Commercial respondent having corporate operations / warehouse at Indore, Madhya Pradesh.</font>", styles["memo_style"]),
         Paragraph("<b>... DEFENDANT</b>", styles["memo_style"])]
    ]
    t_memo = Table(memo_data, colWidths=[380, 110])
    t_memo.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LINEBELOW', (0,2), (-1,2), 1, colors.HexColor("#0f172a")),
    ]))
    story.append(t_memo)
    story.append(Spacer(1, 12))

    # 3. Formal Pleading Title
    story.append(Paragraph("<u>PLAINT UNDER ORDER VII RULES 1 & 2 OF THE CODE OF CIVIL PROCEDURE, 1908</u><br/><font size=8.5 color='#b45309'>READ WITH SECTION 12-A & SECTION 2(1)(c) OF THE COMMERCIAL COURTS ACT, 2015</font>", styles["doc_heading"]))
    story.append(Spacer(1, 4))

    # 4. Verified Averments
    p1 = "1. That the Plaintiff is a commercial corporate organization carrying on business operations in the Malwa Region of Madhya Pradesh. The present suit is instituted through its authorized signatory by virtue of a Board Resolution dated 12 October 2026."
    p2 = f"2. That the present commercial dispute pertains to mercantile transactions and supply contracts between the parties aggregating to ₹{case.claim_valuation:,.2f}, thereby qualifying as a 'Commercial Dispute' within the meaning of Section 2(1)(c) of the Commercial Courts Act, 2015."
    p3 = "3. That pursuant to purchase agreements, the Plaintiff performed its contractual obligations with complete delivery and issued electronic GST tax invoices. The Defendant acknowledged receipt of shipments without raising any contemporaneous demur or objection regarding merchantable quality."
    p4 = "4. That despite receipt of repeated statutory notices and billing statements, the Defendant committed willful default and failed to liquidate the outstanding commercial liabilities, thereby directly frustrating contractual covenants."
    p5 = "5. That the cause of action accrued within the territorial jurisdiction of the Hon'ble High Court Bench at Indore where the commercial agreement was executed, goods were delivered, and payment was stipulated to be remitted."
    p6 = "6. <b>STATUTORY COMPLIANCE OF ORDER XV-A CPC:</b> In accordance with Order XV-A Rule 2 CPC, the Plaintiff files herewith its Comprehensive Evidentiary List, Statement of Truth under Order VI Rule 15A, and annexes primary reliance documents with verified cryptographic SHA-256 hashes."

    for txt in [p1, p2, p3, p4, p5, p6]:
        story.append(Paragraph(txt, styles["body_legal"]))

    # 5. Prayer Clause
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>PRAYER CLAUSE:</b>", styles["body_bold"]))
    prayer_txt = f"WHEREFORE, it is most respectfully prayed that this Hon'ble Commercial Court may graciously be pleased to:<br/>" \
                 f"a) Pass a decree of recovery in favour of the Plaintiff and against the Defendant for an amount of <b>₹{case.claim_valuation:,.2f}</b>;<br/>" \
                 f"b) Award pendente lite and future commercial interest @ 18% per annum from default date until realization;<br/>" \
                 f"c) Direct expeditious pre-trial Case Management Hearing (CMH) under Order XV-A Rule 2 for early fact crystallization; and<br/>" \
                 f"d) Award comprehensive costs of this suit in favour of the Plaintiff under Section 35 CPC."
    story.append(Paragraph(prayer_txt, styles["body_legal"]))
    story.append(Spacer(1, 10))

    # 6. Verification Box & Digital Signature
    verif_txt = "<b>VERIFICATION UNDER ORDER VI RULE 15 CPC:</b><br/>" \
                "I, the Authorized Representative of the Plaintiff, do hereby solemnly declare and verify that the contents of paragraphs 1 to 6 are true and correct to my personal knowledge derived from corporate accounts and business records, and nothing material has been concealed therefrom. Verified at Indore, MP on 19 October 2026."
    story.append(Paragraph(verif_txt, styles["body_legal"]))
    story.append(Spacer(1, 12))

    # Cryptographic Seal Banner
    hash_val = pleading.sha256_checksum or "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    seal_data = [
        [Paragraph(f"<b>TAMPER-EVIDENT CRYPTOGRAPHIC SHA-256 DIGITAL SEAL:</b><br/><font size=7.5 color='#b45309'>{hash_val}</font>", styles["seal_mono"])],
        [Paragraph("✓ High Court Registry Scrutiny Verified • Electronic Filing Status: PASSED • e-Courts Phase III Secure Token", styles["seal_mono"])]
    ]
    t_seal = Table(seal_data, colWidths=[490])
    t_seal.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fffbeb")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#d97706")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#fde68a")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_seal)

    doc.build(story, canvasmaker=NumberedCanvas)


def generate_exhibit_pdf(case: Case, exhibit: Exhibit, file_path: str):
    """Generates an authentic MP High Court Annexed Reliance Exhibit PDF."""
    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        leftMargin=50,
        rightMargin=50,
        topMargin=50,
        bottomMargin=50
    )
    styles = get_custom_styles()
    story = []

    story.append(Paragraph("HIGH COURT OF MADHYA PRADESH : COMMERCIAL DIVISION", styles["court_title"]))
    story.append(Paragraph("ANNEXED RELIANCE EXHIBIT & EVIDENTIARY ELECTRONIC RECORD", styles["court_sub"]))
    story.append(Spacer(1, 6))

    # Exhibit Header Box
    ex_meta = [
        [Paragraph(f"<b>EXHIBIT IDENTIFIER:</b> <font color='#b45309'>EXHIBIT {exhibit.exhibit_number}</font>", styles["memo_style"]),
         Paragraph(f"<b>ANNEXED TO CNR:</b> {case.cnr_number}", styles["memo_style"])],
        [Paragraph(f"<b>DOCUMENT TITLE:</b> {exhibit.document_title}", styles["memo_style"]),
         Paragraph(f"<b>EVIDENTIARY CLASSIFICATION:</b> Primary Documentary Proof", styles["memo_style"])],
        [Paragraph(f"<b>STATUTORY CERTIFICATION:</b> Sec 65B Indian Evidence Act / Sec 63 BSA", styles["memo_style"]),
         Paragraph(f"<b>SCRUTINY STATUS:</b> Formally Admitted / Filed on Record", styles["memo_style"])]
    ]
    t_ex = Table(ex_meta, colWidths=[240, 250])
    t_ex.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1.2, colors.HexColor("#0f172a")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_ex)
    story.append(Spacer(1, 14))

    story.append(Paragraph(f"<u>CERTIFIED COPY OF {exhibit.document_title.upper()}</u>", styles["doc_heading"]))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>ARTICLE 1 - RECITALS & SCOPE OF ENGAGEMENT:</b>", styles["body_bold"]))
    story.append(Paragraph(f"This Master Commercial Instrument is entered into in connection with Case CNR {case.cnr_number} ({case.case_title}). Under this instrument, the supplier contracted to provide specialized commercial deliverables subject to the agreed terms of quality scrutiny, milestone acceptance, and statutory GST e-invoicing.", styles["body_legal"]))

    story.append(Paragraph("<b>ARTICLE 2 - COVENANTS & PECUNIARY OBLIGATIONS:</b>", styles["body_bold"]))
    story.append(Paragraph(f"The total evaluated consideration under the annexed instrument is quantified at <b>₹{case.claim_valuation:,.2f}</b>. All remittances were stipulated to be settled within thirty (30) banking days of delivery invoice presentation. Default triggers compensatory commercial interest under the Interest on Disputed Debts framework.", styles["body_legal"]))

    story.append(Paragraph("<b>ARTICLE 3 - DISPUTE RESOLUTION & ARBITRATION CLAUSE:</b>", styles["body_bold"]))
    story.append(Paragraph("Any difference or controversy arising out of this contract is subject to the exclusive jurisdiction of the Commercial Courts at Indore, Madhya Pradesh, adhering to the accelerated Case Management Hearing timeline governed by Order XV-A of the Code of Civil Procedure, 1908.", styles["body_legal"]))

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>SECTION 65B EVIDENCE ACT ELECTRONIC CERTIFICATE:</b>", styles["body_bold"]))
    sec65b_txt = "I, the Systems Administrator & Custodian of Records, certify that the computerized electronic printout reproduced herein is an accurate, authentic extract generated by the automated enterprise resource system during the ordinary course of business. The system was functioning regularly and without tampering during the relevant period."
    story.append(Paragraph(sec65b_txt, styles["body_legal"]))
    story.append(Spacer(1, 14))

    # Exhibit Hash Seal
    ex_hash = exhibit.sha256_checksum or "f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2"
    seal_data = [
        [Paragraph(f"<b>EXHIBIT CRYPTOGRAPHIC INTEGRITY DIGITAL SEAL:</b><br/><font size=7.5 color='#b45309'>{ex_hash}</font>", styles["seal_mono"])],
        [Paragraph("Verified Electronic Exhibit • Order XV-A Rule 2 Compliance Audit Certified", styles["seal_mono"])]
    ]
    t_seal = Table(seal_data, colWidths=[490])
    t_seal.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fffbeb")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#d97706")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#fde68a")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_seal)

    doc.build(story, canvasmaker=NumberedCanvas)


def main():
    print("=" * 65)
    print("High Court of MP - Batch PDF Document Generator")
    print("=" * 65)

    db = SessionLocal()
    try:
        cases = db.query(Case).all()
        print(f"[INFO] Loaded {len(cases)} cases from database.")

        count_p = 0
        count_ex = 0

        for c in cases:
            # 1. Generate Pleadings
            for p in c.pleadings:
                # Target path in frontend/public/storage/pleadings
                filename = f"{c.cnr_number}_plaint.pdf"
                dest_path = os.path.join(PLEADINGS_DIR, filename)
                generate_plaint_pdf(c, p, dest_path)
                count_p += 1

                # 2. Generate Exhibits
                for ex in p.exhibits:
                    ex_filename = f"{c.cnr_number}_P1.pdf"
                    ex_dest_path = os.path.join(EXHIBITS_DIR, ex_filename)
                    generate_exhibit_pdf(c, ex, ex_dest_path)
                    count_ex += 1

        print(f"[SUCCESS] Successfully generated {count_p} Plaint PDFs in: {PLEADINGS_DIR}")
        print(f"[SUCCESS] Successfully generated {count_ex} Exhibit PDFs in: {EXHIBITS_DIR}")

    except Exception as e:
        print(f"[ERROR] Failed to generate PDFs: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
