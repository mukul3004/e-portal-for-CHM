#!/usr/bin/env python3
"""
Generates the Official SVVV SVIIT 6-Sprint Weekly Progress Report (WPR) Dossier
as a high-resolution, print-ready A4 PDF document strictly matching
Pages 32-33 of the BTCS706N Major Project Syllabus.
"""

import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOCS_DIR = os.path.join(WORKSPACE_DIR, "docs")
DOWNLOADS_DIR = os.path.expanduser("~/Downloads")

OUTPUT_PDF_DOCS = os.path.join(DOCS_DIR, "All_Weekly_Progress_Reports_Sprints_1_to_6.pdf")
OUTPUT_PDF_DOWNLOADS = os.path.join(DOWNLOADS_DIR, "All_Weekly_Progress_Reports_Sprints_1_to_6.pdf")

# Import the SPRINT_REPORTS data from generate_all_weekly_reports
sys.path.insert(0, os.path.dirname(__file__))
from generate_all_weekly_reports import SPRINT_REPORTS

class UniversityReportCanvas(canvas.Canvas):
    """Running header, formal border, and page counter."""
    def __init__(self, *args, **kwargs):
        super(UniversityReportCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(UniversityReportCanvas, self).showPage()
        super(UniversityReportCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Border
        self.setStrokeColor(colors.HexColor("#0f172a"))
        self.setLineWidth(1.2)
        self.rect(36, 36, A4[0] - 72, A4[1] - 72)
        self.setStrokeColor(colors.HexColor("#d97706"))
        self.setLineWidth(0.5)
        self.rect(39, 39, A4[0] - 78, A4[1] - 78)

        # Header
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#0f172a"))
        self.drawString(48, A4[1] - 28, "SHRI VAISHNAV VIDYAPEETH VISHWAVIDYALAYA • SVIIT • DEPT OF CSE")
        self.setFont("Helvetica", 7.5)
        self.drawRightString(A4[0] - 48, A4[1] - 28, "BTCS706N MAJOR PROJECT DOSSIER")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(48, A4[1] - 31, A4[0] - 48, A4[1] - 31)

        # Footer
        self.line(48, 48, A4[0] - 48, 48)
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(48, 38, "Team ID: SVVV-CSE-2026-MP-14 • Guide: Prof. Shweta Pandey")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 48, 38, page_str)
        self.restoreState()


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PDF_DOCS,
        pagesize=A4,
        leftMargin=46,
        rightMargin=46,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    univ_title = ParagraphStyle(
        "UnivTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=2
    )

    inst_title = ParagraphStyle(
        "InstTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=13,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#b45309"),
        spaceAfter=2
    )

    dept_title = ParagraphStyle(
        "DeptTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#475569"),
        spaceAfter=8
    )

    sprint_banner = ParagraphStyle(
        "SprintBanner",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#ffffff")
    )

    section_hdr = ParagraphStyle(
        "SectionHdr",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=5,
        spaceAfter=2
    )

    body_txt = ParagraphStyle(
        "BodyTxt",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=8,
        leading=11.5,
        alignment=TA_JUSTIFY,
        spaceAfter=3
    )

    table_cell = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1e293b")
    )

    table_cell_bold = ParagraphStyle(
        "TableCellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0f172a")
    )

    sig_style = ParagraphStyle(
        "SigStyle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#0f172a")
    )

    foot_auth_style = ParagraphStyle(
        "FootAuthStyle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=6.5,
        leading=8.5,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#475569")
    )

    story = []

    for idx, r in enumerate(SPRINT_REPORTS):
        # 1. University Header on Each Sprint Report
        story.append(Paragraph("SHRI VAISHNAV VIDYAPEETH VISHWAVIDYALAYA, INDORE", univ_title))
        story.append(Paragraph("Shri Vaishnav Institute of Information Technology (SVIIT) • Dept. of CSE", inst_title))
        story.append(Paragraph("B.Tech. CSE Semester-VII (2026–2027) | BTCS706N Major Project (Practical 8 hrs/wk • 200 Marks)", dept_title))

        # Sprint Header Table Banner
        header_table_data = [
            [Paragraph(f"<b>WEEKLY PROGRESS REPORT — {r['sprint_title'].upper()}</b>", sprint_banner)],
            [Paragraph(f"<font size=7.5><b>Dates:</b> {r['dates']} &nbsp;&nbsp;|&nbsp;&nbsp; <b>Team ID:</b> SVVV-CSE-2026-MP-14 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Guide:</b> Prof. Shweta Pandey &nbsp;&nbsp;|&nbsp;&nbsp; <b>Status:</b> <b>{r['status']}</b></font>", ParagraphStyle("SubBanner", alignment=TA_CENTER, fontName="Helvetica", textColor=colors.HexColor("#ffffff")))]
        ]
        t_banner = Table(header_table_data, colWidths=[500])
        t_banner.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0f172a")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ]))
        story.append(t_banner)
        story.append(Spacer(1, 4))

        # Meta Info Table
        meta_data = [
            [Paragraph("<b>Project Title:</b>", table_cell_bold),
             Paragraph("Development of e-Portal for Facilitating Case Management Hearing of Various Types of Cases (Order XV-A CPC)", table_cell)],
            [Paragraph("<b>Team Members:</b>", table_cell_bold),
             Paragraph("1. Mukul Bhamgare (Lead Architect) &nbsp;&nbsp; 2. Rashi Kashiv (Frontend Lead)<br/>3. Sakshi Singh (Data Architect) &nbsp;&nbsp; 4. Kanishk (DevOps / QA)", table_cell)],
            [Paragraph("<b>Sprint Goal:</b>", table_cell_bold),
             Paragraph(r['goal'], table_cell)],
        ]
        t_meta = Table(meta_data, colWidths=[90, 410])
        t_meta.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor("#cbd5e1")),
            ('INNERGRID', (0,0), (-1,-1), 0.4, colors.HexColor("#e2e8f0")),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t_meta)
        story.append(Spacer(1, 4))

        # 2. UML & OOAD Progress
        story.append(Paragraph("<b>1. UML & OOAD Engineering Progress</b>", section_hdr))
        u1 = f"• <b>Diagrams Completed:</b> {r['diagrams_completed']}"
        u2 = f"• <b>Diagrams Revised:</b> {r['diagrams_revised']}"
        u3 = f"• <b>OO Concepts & Design Patterns:</b> {r['oo_concept']}"
        for txt in [u1, u2, u3]:
            story.append(Paragraph(txt, body_txt))

        # 3. Technical Execution
        story.append(Paragraph("<b>2. Technical Execution (DevOps, Git & Jira)</b>", section_hdr))
        t1 = f"• <b>Jira Sprint Backlog:</b> {r['jira_tasks']}"
        t2 = f"• <b>Git Feature Branches:</b> <font name='Courier'>{r['git_branches']}</font>"
        t3 = f"• <b>Peer-Reviewed Pull Requests:</b> {r['git_prs']}"
        t4 = f"• <b>CI/CD Pipeline Status:</b> {r['ci_status']}"
        for txt in [t1, t2, t3, t4]:
            story.append(Paragraph(txt, body_txt))

        # 4. Testing Summary
        story.append(Paragraph("<b>3. Automated Testing & Defect Tracking</b>", section_hdr))
        q1 = f"• <b>Total Tests / Pass Rate:</b> <b>{r['total_tests']}</b> (Pass Rate: <b>{r['pass_rate']}</b>)"
        q2 = f"• <b>Key Bug Identified & Overcome:</b> {r['key_bug']}"
        for txt in [q1, q2]:
            story.append(Paragraph(txt, body_txt))

        # 5. Goals for Next Sprint
        story.append(Paragraph("<b>4. Goals for Next Week / Sprint</b>", section_hdr))
        story.append(Paragraph(f"• {r['goals_next']}", body_txt))
        story.append(Spacer(1, 6))

        # 6. Signature Block
        sig_data = [
            [Paragraph("____________________________________<br/><b>Project Guide Signature</b><br/>(Prof. Shweta Pandey)", sig_style),
             Paragraph("____________________________________<br/><b>Project In-charge Signature</b><br/>(Department of CSE, SVIIT)", sig_style)]
        ]
        t_sig = Table(sig_data, colWidths=[250, 250])
        t_sig.setStyle(TableStyle([
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_sig)
        story.append(Spacer(1, 4))

        # Institutional Authorities Footer Block (Syllabus page 32/33)
        auth_data = [
            [Paragraph("<b>Chairperson</b><br/>Board of Studies, SVVV", foot_auth_style),
             Paragraph("<b>Chairperson</b><br/>Faculty of Studies, SVVV", foot_auth_style),
             Paragraph("<b>Controller of Examination</b><br/>SVVV, Indore", foot_auth_style),
             Paragraph("<b>Registrar</b><br/>SVVV, Indore", foot_auth_style)]
        ]
        t_auth = Table(auth_data, colWidths=[125, 125, 125, 125])
        t_auth.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor("#e2e8f0")),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ]))
        story.append(t_auth)

        # PageBreak between Sprints
        if idx < len(SPRINT_REPORTS) - 1:
            story.append(PageBreak())

    doc.build(story, canvasmaker=UniversityReportCanvas)
    print(f"Generated PDF Dossier: {OUTPUT_PDF_DOCS}")

    # Also save to Downloads if folder exists
    if os.path.exists(DOWNLOADS_DIR):
        import shutil
        shutil.copy2(OUTPUT_PDF_DOCS, OUTPUT_PDF_DOWNLOADS)
        print(f"Saved copy to Downloads: {OUTPUT_PDF_DOWNLOADS}")

if __name__ == "__main__":
    build_pdf()

