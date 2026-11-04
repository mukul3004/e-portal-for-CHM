#!/usr/bin/env python3
"""
Generate institutional Microsoft Word (.docx) dossier for SVVV CSE Major Project (BTCS706N)
Weekly Progress Reports (Weeks 01 to 08).
Conforms strictly to institutional guidelines:
- Removed evaluation scheme boilerplate
- Team members each on a separate line
- Table on Page 1
- Key Challenge callout box on Page 2
- Signatures and 4 university authority footers on Page 2
- Strict 2-page pagination per week (16 pages total)
"""

import re
from bs4 import BeautifulSoup
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def set_cell_shading(cell, color_hex):
    """Set background color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=60, bottom=60, left=100, right=100):
    """Set inner cell padding in dxa (1 pt = 20 dxa)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="64748B", sz="4", val="single"):
    """Set uniform borders on a table."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_callout_box_borders(table, border_color="F87171", left_border_color="DC2626"):
    """Set callout box borders: thick left border, thin others."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>'
        f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{left_border_color}"/>'
        f'<w:right w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_running_subhead_borders(table):
    """Set running subhead bottom border."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:bottom w:val="single" w:sz="12" w:space="0" w:color="1E3A8A"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_footer_top_border(table):
    """Set footer top border."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_inline_runs(paragraph, element, base_color=None, base_size=Pt(9.2)):
    """Convert HTML inline tags (strong, em, code) into formatted runs."""
    for child in element.contents:
        if isinstance(child, str):
            text = child
            if text:
                run = paragraph.add_run(text)
                run.font.name = "Times New Roman"
                run.font.size = base_size
                if base_color:
                    run.font.color.rgb = base_color
        elif child.name in ['strong', 'b']:
            run = paragraph.add_run(child.get_text())
            run.bold = True
            run.font.name = "Times New Roman"
            run.font.size = base_size
            if base_color:
                run.font.color.rgb = base_color
        elif child.name in ['em', 'i']:
            run = paragraph.add_run(child.get_text())
            run.italic = True
            run.font.name = "Times New Roman"
            run.font.size = base_size
            if base_color:
                run.font.color.rgb = base_color
        elif child.name == 'code':
            run = paragraph.add_run(child.get_text())
            run.font.name = "Courier New"
            run.font.size = Pt(8.5)
            run.font.color.rgb = RGBColor(15, 23, 42)
        elif child.name == 'span':
            cls = child.get('class', [])
            c_rgb = RGBColor(30, 58, 138) if 'highlight-badge' in cls else base_color
            run = paragraph.add_run(child.get_text())
            run.font.name = "Times New Roman"
            run.font.size = base_size
            if 'highlight-badge' in cls:
                run.bold = True
            if c_rgb:
                run.font.color.rgb = c_rgb
        else:
            add_inline_runs(paragraph, child, base_color, base_size)

def main():
    print("Reading HTML file...")
    with open('docs/Printable_Weekly_Progress_Reports_Weeks_1_to_8.html', 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    sheets = soup.find_all('div', class_='page-sheet')
    total_sheets = len(sheets)
    print(f"Total page sheets detected: {total_sheets}")
    assert total_sheets == 16, f"Expected 16 page sheets, found {total_sheets}"

    doc = docx.Document()

    # Configure A4 Portrait and tight margins for strict 2-page per week layout
    for section in doc.sections:
        section.top_margin = Inches(0.40)
        section.bottom_margin = Inches(0.40)
        section.left_margin = Inches(0.55)
        section.right_margin = Inches(0.55)
        section.page_width = Inches(8.27)   # A4
        section.page_height = Inches(11.69) # A4

    # Configure Normal Style
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(9.2)
    font.color.rgb = RGBColor(0, 0, 0)
    style.paragraph_format.line_spacing = 1.15
    style.paragraph_format.space_before = Pt(0)
    style.paragraph_format.space_after = Pt(2.5)

    weeks_count = total_sheets // 2

    for w in range(weeks_count):
        week_num = w + 1
        p1 = sheets[w * 2]
        p2 = sheets[w * 2 + 1]
        print(f"Generating Week {week_num:02d}...")

        # -------------------------------------------------------------
        # PAGE 1 OF 2
        # -------------------------------------------------------------
        # 1. Header
        univ_header = p1.find('div', class_='univ-header')
        u_p1 = doc.add_paragraph()
        u_p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        u_p1.paragraph_format.space_after = Pt(1)
        r = u_p1.add_run("SHRI VAISHNAV VIDYAPEETH VISHWAVIDYALAYA, INDORE")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)

        u_p2 = doc.add_paragraph()
        u_p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        u_p2.paragraph_format.space_after = Pt(1)
        r = u_p2.add_run("Department of Computer Science & Engineering | Major Project (BTCS706N)")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)

        u_p3 = doc.add_paragraph()
        u_p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        u_p3.paragraph_format.space_after = Pt(5)
        r = u_p3.add_run(f"Weekly Progress Report — Week {week_num:02d}")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.color.rgb = RGBColor(30, 58, 138) # Dark Navy

        # 2. Metadata Box Table (1 cell, bordered and shaded)
        meta_grid = p1.find('div', class_='meta-grid')
        meta_table = doc.add_table(rows=1, cols=1)
        meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        meta_cell = meta_table.cell(0, 0)
        meta_cell.width = Inches(7.17)
        set_cell_shading(meta_cell, "F8FAFC")
        set_cell_margins(meta_cell, top=60, bottom=60, left=100, right=100)
        set_table_borders(meta_table, color="CBD5E1", sz="4", val="single")

        # Extract meta items
        meta_rows = meta_grid.find_all('div', class_='meta-row')
        for idx, m_row in enumerate(meta_rows):
            lbl = m_row.find('span', class_='meta-label').get_text(strip=True)
            if idx == 0:
                p = meta_cell.paragraphs[0]
            else:
                p = meta_cell.add_paragraph()
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(1.5)
            p.paragraph_format.line_spacing = 1.15

            r_lbl = p.add_run(f"{lbl} ")
            r_lbl.bold = True
            r_lbl.font.name = "Times New Roman"
            r_lbl.font.size = Pt(8.8)
            r_lbl.font.color.rgb = RGBColor(15, 23, 42)

            # Check if this is the team members row
            member_list = m_row.find('div', class_='team-member-list')
            if member_list:
                items = member_list.find_all('div', class_='team-member-item')
                for m_idx, m_item in enumerate(items):
                    if m_idx == 0:
                        add_inline_runs(p, m_item, base_size=Pt(8.8))
                    else:
                        sub_p = meta_cell.add_paragraph()
                        sub_p.paragraph_format.left_indent = Inches(1.15)
                        sub_p.paragraph_format.space_before = Pt(0)
                        sub_p.paragraph_format.space_after = Pt(1.5)
                        sub_p.paragraph_format.line_spacing = 1.15
                        add_inline_runs(sub_p, m_item, base_size=Pt(8.8))
            else:
                val_elem = m_row.find('span', class_='meta-val')
                if val_elem:
                    add_inline_runs(p, val_elem, base_size=Pt(8.8))

        doc.add_paragraph().paragraph_format.space_after = Pt(2)

        # 3. Section 1: Executive Summary
        s1_title = doc.add_paragraph()
        s1_title.paragraph_format.space_before = Pt(4)
        s1_title.paragraph_format.space_after = Pt(2)
        r = s1_title.add_run("1. EXECUTIVE SUMMARY")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(15, 23, 42)

        # Bullets for Section 1
        s1_ul = p1.find_all('ul', class_='bullet-list')[0]
        for li in s1_ul.find_all('li', recursive=False):
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            add_inline_runs(p, li, base_size=Pt(8.8))

        # 4. Section 2: UML & OOAD Progress
        s2_title = doc.add_paragraph()
        s2_title.paragraph_format.space_before = Pt(4)
        s2_title.paragraph_format.space_after = Pt(2)
        r = s2_title.add_run("2. UML & OBJECT-ORIENTED DESIGN PROGRESS")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(15, 23, 42)

        s2_ul = p1.find_all('ul', class_='bullet-list')[1]
        for li in s2_ul.find_all('li', recursive=False):
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            add_inline_runs(p, li, base_size=Pt(8.8))

        # 5. Technical Table on Page 1
        t_caption = p1.find('div', class_='table-sub-caption')
        if t_caption:
            cap_p = doc.add_paragraph()
            cap_p.paragraph_format.space_before = Pt(4)
            cap_p.paragraph_format.space_after = Pt(2)
            r = cap_p.add_run(t_caption.get_text(strip=True))
            r.bold = True
            r.font.name = "Times New Roman"
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(51, 65, 85)

        html_table = p1.find('table', class_='content-table')
        if html_table:
            rows = html_table.find_all('tr')
            num_rows = len(rows)
            num_cols = len(rows[0].find_all(['th', 'td']))

            t = doc.add_table(rows=num_rows, cols=num_cols)
            t.alignment = WD_TABLE_ALIGNMENT.CENTER
            set_table_borders(t, color="64748B", sz="4", val="single")

            # Column widths mapping based on columns count
            if num_cols == 4:
                col_widths = [Inches(1.6), Inches(1.3), Inches(1.8), Inches(2.47)]
            elif num_cols == 5:
                col_widths = [Inches(1.2), Inches(1.5), Inches(1.3), Inches(1.6), Inches(1.57)]
            else:
                col_widths = [Inches(7.17 / num_cols)] * num_cols

            for r_idx, r_elem in enumerate(rows):
                cells = r_elem.find_all(['th', 'td'])
                is_header = bool(r_elem.find('th'))
                row_obj = t.rows[r_idx]
                
                # Prevent row split across pages
                trPr = row_obj._tr.get_or_add_trPr()
                trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
                if is_header:
                    trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

                for c_idx, c_elem in enumerate(cells):
                    cell_obj = row_obj.cells[c_idx]
                    cell_obj.width = col_widths[c_idx] if c_idx < len(col_widths) else Inches(1.0)
                    set_cell_margins(cell_obj, top=40, bottom=40, left=60, right=60)
                    
                    if is_header:
                        set_cell_shading(cell_obj, "F1F5F9")
                    
                    p = cell_obj.paragraphs[0]
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(0)
                    p.paragraph_format.line_spacing = 1.12
                    
                    add_inline_runs(p, c_elem, base_size=Pt(7.8))
                    if is_header:
                        for run in p.runs:
                            run.bold = True

        # End of Page 1 -> Add explicit Page Break!
        doc.add_page_break()

        # -------------------------------------------------------------
        # PAGE 2 OF 2
        # -------------------------------------------------------------
        # 1. Running Subhead Table
        subhead_div = p2.find('div', class_='running-subhead')
        if subhead_div:
            sub_spans = subhead_div.find_all('span')
            left_text = sub_spans[0].get_text(strip=True) if len(sub_spans) > 0 else ""
            right_text = sub_spans[1].get_text(strip=True) if len(sub_spans) > 1 else ""

            sh_table = doc.add_table(rows=1, cols=2)
            sh_table.alignment = WD_TABLE_ALIGNMENT.CENTER
            sh_c1 = sh_table.cell(0, 0)
            sh_c2 = sh_table.cell(0, 1)
            sh_c1.width = Inches(5.0)
            sh_c2.width = Inches(2.17)
            set_running_subhead_borders(sh_table)
            set_cell_margins(sh_c1, top=20, bottom=30, left=0, right=40)
            set_cell_margins(sh_c2, top=20, bottom=30, left=40, right=0)

            p_l = sh_c1.paragraphs[0]
            p_l.paragraph_format.space_before = Pt(0)
            p_l.paragraph_format.space_after = Pt(0)
            r = p_l.add_run(left_text.upper())
            r.bold = True
            r.font.name = "Times New Roman"
            r.font.size = Pt(8)
            r.font.color.rgb = RGBColor(30, 58, 138)

            p_r = sh_c2.paragraphs[0]
            p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            p_r.paragraph_format.space_before = Pt(0)
            p_r.paragraph_format.space_after = Pt(0)
            r = p_r.add_run(right_text.upper())
            r.bold = True
            r.font.name = "Times New Roman"
            r.font.size = Pt(8)
            r.font.color.rgb = RGBColor(30, 58, 138)

        doc.add_paragraph().paragraph_format.space_after = Pt(2)

        # 2. Section 3: Technical Execution (DevOps & Git Activity)
        s3_title = doc.add_paragraph()
        s3_title.paragraph_format.space_before = Pt(4)
        s3_title.paragraph_format.space_after = Pt(2)
        r = s3_title.add_run("3. TECHNICAL EXECUTION (DEVOPS & GIT ACTIVITY)")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(15, 23, 42)

        s3_ul = p2.find_all('ul', class_='bullet-list')[0]
        for li in s3_ul.find_all('li', recursive=False):
            # Check if this li contains sub-bullet ul
            sub_ul = li.find('ul', class_='sub-bullet')
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(1.5)
            p.paragraph_format.line_spacing = 1.15

            # Copy text preceding the sub-ul
            if sub_ul:
                temp_li = BeautifulSoup(str(li), 'html.parser').find('li')
                temp_li.find('ul', class_='sub-bullet').decompose()
                add_inline_runs(p, temp_li, base_size=Pt(8.8))
                for sub_li in sub_ul.find_all('li'):
                    sub_p = doc.add_paragraph(style='List Bullet 2')
                    sub_p.paragraph_format.left_indent = Inches(0.45)
                    sub_p.paragraph_format.space_before = Pt(0)
                    sub_p.paragraph_format.space_after = Pt(1)
                    sub_p.paragraph_format.line_spacing = 1.12
                    add_inline_runs(sub_p, sub_li, base_size=Pt(8.5))
            else:
                add_inline_runs(p, li, base_size=Pt(8.8))

        # 3. Section 4: Testing Summary & Quality Assurance
        s4_title = doc.add_paragraph()
        s4_title.paragraph_format.space_before = Pt(4)
        s4_title.paragraph_format.space_after = Pt(2)
        r = s4_title.add_run("4. TESTING SUMMARY & QUALITY ASSURANCE")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(15, 23, 42)

        s4_ul = p2.find_all('ul', class_='bullet-list')[1]
        for li in s4_ul.find_all('li', recursive=False):
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(1.5)
            p.paragraph_format.line_spacing = 1.15
            add_inline_runs(p, li, base_size=Pt(8.8))

        # 4. Key Bug Identified / Challenge Box
        c_box = p2.find('div', class_='challenge-box')
        if c_box:
            cb_table = doc.add_table(rows=1, cols=1)
            cb_table.alignment = WD_TABLE_ALIGNMENT.CENTER
            cb_cell = cb_table.cell(0, 0)
            cb_cell.width = Inches(7.17)
            set_cell_shading(cb_cell, "FEF2F2")
            set_callout_box_borders(cb_table, border_color="F87171", left_border_color="DC2626")
            set_cell_margins(cb_cell, top=60, bottom=60, left=100, right=100)

            title_elem = c_box.find('div', class_='challenge-title')
            p_top = cb_cell.paragraphs[0]
            p_top.paragraph_format.space_before = Pt(0)
            p_top.paragraph_format.space_after = Pt(2)
            r = p_top.add_run(title_elem.get_text(strip=True))
            r.bold = True
            r.font.name = "Times New Roman"
            r.font.size = Pt(9)
            r.font.color.rgb = RGBColor(153, 27, 27) # Dark Red

            for p_elem in c_box.find_all('p'):
                cb_p = cb_cell.add_paragraph()
                cb_p.paragraph_format.space_before = Pt(0)
                cb_p.paragraph_format.space_after = Pt(1.5)
                cb_p.paragraph_format.line_spacing = 1.15
                add_inline_runs(cb_p, p_elem, base_size=Pt(8.5))

        doc.add_paragraph().paragraph_format.space_after = Pt(2)

        # 5. Section 5: Goals for Next Week
        s5_title = doc.add_paragraph()
        s5_title.paragraph_format.space_before = Pt(4)
        s5_title.paragraph_format.space_after = Pt(2)
        r = s5_title.add_run("5. GOALS FOR NEXT WEEK")
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(15, 23, 42)

        s5_ul = p2.find_all('ul', class_='bullet-list')[2]
        for li in s5_ul.find_all('li', recursive=False):
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(1.5)
            p.paragraph_format.line_spacing = 1.15
            add_inline_runs(p, li, base_size=Pt(8.8))

        doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # 6. Signatures Block
        sig_table = doc.add_table(rows=1, cols=2)
        sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(sig_table, color="FFFFFF", sz="0", val="none") # Borderless
        s_c1 = sig_table.cell(0, 0)
        s_c2 = sig_table.cell(0, 1)
        s_c1.width = Inches(3.58)
        s_c2.width = Inches(3.58)
        set_cell_margins(s_c1, top=80, bottom=40, left=40, right=40)
        set_cell_margins(s_c2, top=80, bottom=40, left=40, right=40)

        # Left signature
        p_sig1 = s_c1.paragraphs[0]
        p_sig1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sig1.paragraph_format.space_after = Pt(1)
        r_line = p_sig1.add_run("_________________________________________")
        r_line.font.name = "Times New Roman"
        r_line.font.size = Pt(9)
        p_sig1_txt = s_c1.add_paragraph()
        p_sig1_txt.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sig1_txt.paragraph_format.space_after = Pt(0)
        r1 = p_sig1_txt.add_run("Project Guide Signature\n")
        r1.bold = True
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(8.8)
        r2 = p_sig1_txt.add_run("(Prof. Shweta Pandey)")
        r2.font.name = "Times New Roman"
        r2.font.size = Pt(8)

        # Right signature
        p_sig2 = s_c2.paragraphs[0]
        p_sig2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sig2.paragraph_format.space_after = Pt(1)
        r_line = p_sig2.add_run("_________________________________________")
        r_line.font.name = "Times New Roman"
        r_line.font.size = Pt(9)
        p_sig2_txt = s_c2.add_paragraph()
        p_sig2_txt.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sig2_txt.paragraph_format.space_after = Pt(0)
        r1 = p_sig2_txt.add_run("Project In-charge Signature\n")
        r1.bold = True
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(8.8)
        r2 = p_sig2_txt.add_run("(Department of CSE/IT, SVIIT)")
        r2.font.name = "Times New Roman"
        r2.font.size = Pt(8)

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

        # 7. Official Footers Table (4 columns)
        f_table = doc.add_table(rows=1, cols=4)
        f_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_footer_top_border(f_table)
        f_col_width = Inches(7.17 / 4.0)
        f_data = [
            ("Chairperson", "Board of Studies\nShri Vaishnav Vidyapeeth\nVishwavidyalaya, Indore"),
            ("Chairperson", "Faculty of Studies\nShri Vaishnav Vidyapeeth\nVishwavidyalaya, Indore"),
            ("Controller of Examination", "Shri Vaishnav Vidyapeeth\nVishwavidyalaya, Indore"),
            ("Registrar", "Shri Vaishnav Vidyapeeth\nVishwavidyalaya, Indore"),
        ]

        for fc_idx, (title, sub) in enumerate(f_data):
            cell = f_table.cell(0, fc_idx)
            cell.width = f_col_width
            set_cell_margins(cell, top=60, bottom=40, left=20, right=20)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.05
            
            r_title = p.add_run(f"{title}\n")
            r_title.bold = True
            r_title.font.name = "Times New Roman"
            r_title.font.size = Pt(7.2)
            
            r_sub = p.add_run(sub)
            r_sub.font.name = "Times New Roman"
            r_sub.font.size = Pt(6.5)

        # Add page break between weeks (except after the last week)
        if week_num < weeks_count:
            doc.add_page_break()

    out_path = 'docs/All_Weekly_Progress_Reports_Weeks_1_to_8.docx'
    print(f"Saving generated document to {out_path}...")
    doc.save(out_path)
    print("Document successfully created and saved!")

if __name__ == '__main__':
    main()

