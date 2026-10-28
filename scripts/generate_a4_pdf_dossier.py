#!/usr/bin/env python3
"""
SVVV B.Tech CSE Semester-VII Major Project (BTCS706N)
UML Architecture Dossier - Print-Perfect A4 PDF Generator
Team ID: SVVV-CSE-2026-MP-14 | Guide: Prof. Shweta Pandey
"""

import os
from PIL import Image, ImageDraw, ImageFont

# Standard A4 Dimensions at 300 DPI
A4_WIDTH = 2480
A4_HEIGHT = 3508

FONT_HELVETICA = "/System/Library/Fonts/Helvetica.ttc"
FONT_ARIAL = "/Library/Fonts/Arial.ttf"

def get_font(size, bold=False):
    try:
        # Index 1 is often Helvetica-Bold in macOS Helvetica.ttc
        idx = 1 if bold else 0
        return ImageFont.truetype(FONT_HELVETICA, size, index=idx)
    except Exception:
        try:
            return ImageFont.truetype(FONT_ARIAL, size)
        except Exception:
            return ImageFont.load_default()

def create_cover_page():
    page = Image.new("RGB", (A4_WIDTH, A4_HEIGHT), color=(255, 255, 255))
    draw = ImageDraw.Draw(page)

    # Decorative Border
    margin = 80
    draw.rectangle([margin, margin, A4_WIDTH - margin, A4_HEIGHT - margin], outline=(30, 58, 138), width=8)
    draw.rectangle([margin + 16, margin + 16, A4_WIDTH - margin - 16, A4_HEIGHT - margin - 16], outline=(249, 115, 22), width=3)

    # University Header
    font_univ = get_font(52, bold=True)
    font_inst = get_font(38, bold=True)
    font_dept = get_font(32, bold=False)

    text_univ = "SHRI VAISHNAV VIDYAPEETH VISHWAVIDYALAYA, INDORE"
    text_inst = "Shri Vaishnav Institute of Information Technology (SVIIT)"
    text_dept = "Department of Computer Science & Engineering"

    y = 280
    draw.text((A4_WIDTH // 2, y), text_univ, fill=(15, 23, 42), font=font_univ, anchor="mm")
    y += 75
    draw.text((A4_WIDTH // 2, y), text_inst, fill=(71, 85, 105), font=font_inst, anchor="mm")
    y += 60
    draw.text((A4_WIDTH // 2, y), text_dept, fill=(100, 116, 139), font=font_dept, anchor="mm")

    # Orange Accent Divider
    y += 70
    draw.line([(A4_WIDTH // 2) - 200, y, (A4_WIDTH // 2) + 200, y], fill=(249, 115, 22), width=6)

    # Project Title Block
    y += 180
    font_sub_top = get_font(34, bold=True)
    draw.text((A4_WIDTH // 2, y), "MAJOR PROJECT (BTCS706N) COURSEWORK REPORT", fill=(249, 115, 22), font=font_sub_top, anchor="mm")

    y += 110
    font_title = get_font(56, bold=True)
    draw.text((A4_WIDTH // 2, y), "UML ARCHITECTURE & SYSTEM DESIGN DOSSIER", fill=(30, 58, 138), font=font_title, anchor="mm")

    y += 85
    font_proj = get_font(38, bold=True)
    draw.text((A4_WIDTH // 2, y), "e-Portal for Case Management Hearing of Commercial Suits", fill=(15, 23, 42), font=font_proj, anchor="mm")
    
    y += 55
    font_stat = get_font(30, bold=False)
    draw.text((A4_WIDTH // 2, y), "(Governed by Order XV-A of Code of Civil Procedure, 1908 & Commercial Courts Act, 2015)", fill=(71, 85, 105), font=font_stat, anchor="mm")

    # Metadata Box
    y += 160
    box_x0 = 300
    box_x1 = A4_WIDTH - 300
    box_y0 = y
    box_y1 = y + 720
    draw.rectangle([box_x0, box_y0, box_x1, box_y1], fill=(248, 250, 252), outline=(203, 213, 225), width=3)

    font_box_h = get_font(32, bold=True)
    font_box_v = get_font(28, bold=False)
    font_box_b = get_font(28, bold=True)

    items = [
        ("ACADEMIC SESSION:", "2026 – 2027 (Semester VII B.Tech CSE)"),
        ("TEAM IDENTIFIER:", "SVVV-CSE-2026-MP-14"),
        ("PROJECT GUIDE:", "Prof. Shweta Pandey"),
        ("EVALUATION SCOPE:", "UML Structural & Behavioral Views (30% Rubric Weightage)"),
        ("DELIVERABLES:", "Activity, Sequence, Class, Component, Deployment, Package, Object"),
        ("INTEGRITY SECURITY:", "SHA-256 Cryptographic Hash & Digital Signature Certified")
    ]

    iy = box_y0 + 70
    for label, val in items:
        draw.text((box_x0 + 60, iy), label, fill=(100, 116, 139), font=font_box_h)
        draw.text((box_x0 + 460, iy), val, fill=(15, 23, 42), font=font_box_b)
        iy += 100

    # Team Members Footer Box
    y = box_y1 + 100
    font_team_h = get_font(30, bold=True)
    font_team = get_font(26, bold=False)

    draw.text((A4_WIDTH // 2, y), "DEVELOPMENT TEAM MEMBERS (MP-14)", fill=(30, 58, 138), font=font_team_h, anchor="mm")
    y += 50
    team_members = [
        "Mukul Bhamgare (23100BTCSAII14297) - Lead Architect / Backend & Scheduling Engine",
        "Rashi Kashiv (23100BTCSAII14314) - Frontend Lead / UI Design & Matrix Component",
        "Sakshi Singh (23100BTCSAII14317) - Data Architect / Security & ORM Modeling",
        "Kanishk (23100BTCSAII14293) - DevOps / QA, CI/CD Pipeline & CMO Engine"
    ]
    for tm in team_members:
        draw.text((A4_WIDTH // 2, y), tm, fill=(51, 65, 85), font=font_team, anchor="mm")
        y += 45

    # Bottom Date
    draw.text((A4_WIDTH // 2, A4_HEIGHT - 130), "INDORE, MADHYA PRADESH • OCTOBER 2026", fill=(148, 163, 184), font=get_font(24, bold=True), anchor="mm")

    return page

def create_diagram_page(num, title, subtitle, image_path, highlights, page_num, total_pages=8):
    page = Image.new("RGB", (A4_WIDTH, A4_HEIGHT), color=(255, 255, 255))
    draw = ImageDraw.Draw(page)

    margin_x = 90
    margin_top = 80
    margin_bottom = 80

    # Top Header Strip
    draw.rectangle([margin_x, margin_top, A4_WIDTH - margin_x, margin_top + 10], fill=(30, 58, 138))
    
    font_inst_top = get_font(22, bold=True)
    draw.text((margin_x, margin_top + 20), "SHRI VAISHNAV VIDYAPEETH VISHWAVIDYALAYA • B.TECH CSE MAJOR PROJECT (BTCS706N)", fill=(100, 116, 139), font=font_inst_top)
    
    # Diagram Main Title
    font_num_title = get_font(38, bold=True)
    draw.text((margin_x, margin_top + 60), f"{num}. {title}", fill=(15, 23, 42), font=font_num_title)
    
    font_sub = get_font(24, bold=False)
    draw.text((margin_x, margin_top + 112), subtitle, fill=(71, 85, 105), font=font_sub)

    draw.line([margin_x, margin_top + 155, A4_WIDTH - margin_x, margin_top + 155], fill=(226, 232, 240), width=2)

    # Available Image Area
    img_area_top = margin_top + 175
    img_area_bottom = A4_HEIGHT - 540  # reserve 540px for highlights box and footer
    max_w = A4_WIDTH - (2 * margin_x) - 40
    max_h = img_area_bottom - img_area_top

    # Draw border around diagram area
    draw.rectangle([margin_x, img_area_top, A4_WIDTH - margin_x, img_area_bottom], fill=(250, 250, 250), outline=(226, 232, 240), width=2)

    # Load and scale diagram image
    if os.path.exists(image_path):
        diagram_img = Image.open(image_path)
        orig_w, orig_h = diagram_img.size
        
        # Calculate aspect-ratio preserving scaling factor
        scale = min(max_w / orig_w, max_h / orig_h)
        new_w = int(orig_w * scale)
        new_h = int(orig_h * scale)

        resized_img = diagram_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Center the diagram
        paste_x = margin_x + ((A4_WIDTH - 2 * margin_x) - new_w) // 2
        paste_y = img_area_top + (max_h - new_h) // 2
        
        page.paste(resized_img, (paste_x, paste_y))

    # Bottom Highlights Box
    box_y0 = img_area_bottom + 25
    box_y1 = A4_HEIGHT - margin_bottom - 60
    draw.rectangle([margin_x, box_y0, A4_WIDTH - margin_x, box_y1], fill=(248, 250, 252), outline=(203, 213, 225), width=2)

    # Highlights Header
    font_box_h = get_font(24, bold=True)
    draw.text((margin_x + 30, box_y0 + 20), "ARCHITECTURAL & STATUTORY CPC HIGHLIGHTS:", fill=(30, 58, 138), font=font_box_h)

    # Highlight Bullet Points
    font_bullet = get_font(21, bold=False)
    by = box_y0 + 60
    for bullet in highlights:
        draw.text((margin_x + 35, by), "•", fill=(249, 115, 22), font=get_font(24, bold=True))
        draw.text((margin_x + 65, by), bullet, fill=(51, 65, 85), font=font_bullet)
        by += 38

    # Bottom Footer Strip
    footer_y = A4_HEIGHT - margin_bottom - 20
    draw.line([margin_x, footer_y - 15, A4_WIDTH - margin_x, footer_y - 15], fill=(226, 232, 240), width=2)

    font_footer = get_font(20, bold=False)
    draw.text((margin_x, footer_y), "Team ID: SVVV-CSE-2026-MP-14 • Project Guide: Prof. Shweta Pandey", fill=(100, 116, 139), font=font_footer)
    
    font_page = get_font(20, bold=True)
    draw.text((A4_WIDTH - margin_x, footer_y), f"Page {page_num} of {total_pages}", fill=(15, 23, 42), font=font_page, anchor="ra")

    return page

def main():
    print("Generating Print-Ready A4 PDF Dossier for SVVV Major Project...")
    pages = []

    # 1. Cover Page
    print("Creating A4 Cover Page...")
    cover = create_cover_page()
    pages.append(cover)

    # 2. Activity Diagram
    print("Creating A4 Activity Diagram Page...")
    p1 = create_diagram_page(
        num=1,
        title="UML Activity Diagram",
        subtitle="Order XV-A CPC Pre-Trial Case Management Lifecycle & Decision Nodes",
        image_path="diagrams/Activity_Diagram.png",
        highlights=[
            "Strict Statutory Limitation: Enforces mandatory 120-day maximum for Written Statements (Order VIII Rule 1 CPC).",
            "Order XI Rule 4 Matrix: Parallel itemized filing of statements of admissions and denials with documentary exhibits.",
            "Statutory Rule 2 Timetable: Discovery inspection (<=15d), interrogatories (<=15d), witness affidavits (<=15d).",
            "Continuous Cross-Examination: Fixes day-to-day continuous trial dates to eliminate non-statutory adjournments."
        ],
        page_num=2
    )
    pages.append(p1)

    # 3. Sequence Diagram
    print("Creating A4 Sequence Diagram Page...")
    p2 = create_diagram_page(
        num=2,
        title="UML Sequence Diagram",
        subtitle="Pre-Trial Case Management Hearing (CMH) & Multi-Party Interaction Flow",
        image_path="diagrams/Sequence_Diagram.png",
        highlights=[
            "Advocate Authentication: Bar Council credentials verified with RBAC JWT bearer tokens.",
            "Cyber Treasury MP: Real-time verification of Challan Reference Number (CRN) for commercial court fees.",
            "Clash-Free Scheduling: Cross-bench detection algorithms query advocate availability before slot reservation.",
            "Cryptographic Decree Sealing: Final Case Management Order stamped with SHA-256 seal and Judicial DSC."
        ],
        page_num=3
    )
    pages.append(p2)

    # 4. Class Diagram
    print("Creating A4 Class Diagram Page...")
    p3 = create_diagram_page(
        num=3,
        title="UML Class Diagram",
        subtitle="Domain Object-Oriented Architecture, Encapsulation, and ORM Entities",
        image_path="diagrams/Class_Diagram.png",
        highlights=[
            "Role Inheritance: Abstract User base class specialized into Judge, Advocate, Clerk, and Litigant domain models.",
            "Data Encapsulation: Strict private attributes for password hashes and DSC keys with public verification contracts.",
            "Statutory Associations: Case maintains 1:N AdmissionMatrix, 1:1 CaseManagementOrder, and 1:1 EChallanPayment.",
            "SQLAlchemy 2.0 ORM: Maps domain entities to relational tables with foreign keys and database constraints."
        ],
        page_num=4
    )
    pages.append(p3)

    # 5. Component Diagram
    print("Creating A4 Component Diagram Page...")
    p4 = create_diagram_page(
        num=4,
        title="UML Component Diagram",
        subtitle="5-Tier Decoupled Judicial Architecture & Micro-Engine Interface Contracts",
        image_path="diagrams/Component_Diagram.png",
        highlights=[
            "Presentation Tier: React 19 Single Page App with Tailwind CSS, FullCalendar grid, and WebRTC courtroom.",
            "Security & Gateway Tier: Asynchronous FastAPI ASGI gateway with rate limiting and JWT auth middleware.",
            "Business Logic Tier: 9 decoupled services (Admissions Matrix, Clash Engine, CMO Builder, Countdown Daemon).",
            "Persistence & Gateways: SQLite WAL / MySQL database, encrypted document vault, Cyber Treasury, and NJDG."
        ],
        page_num=5
    )
    pages.append(p4)

    # 6. Deployment Diagram
    print("Creating A4 Deployment Diagram Page...")
    p5 = create_diagram_page(
        num=5,
        title="UML Deployment Diagram",
        subtitle="Hardware Node Topology, Execution Environments, and Secure Protocols",
        image_path="diagrams/Deployment_Diagram.png",
        highlights=[
            "Client Devices: Browser execution environment running React 19 SPA over TLS 1.3 HTTPS and WSS protocols.",
            "Web Ingress Node: NGINX reverse proxy providing SSL termination and protective DDoS rate limiting.",
            "Application Server Node: Ubuntu 24.04 LTS host running Python 3.11 with Uvicorn ASGI on port 8000.",
            "Storage & External Nodes: POSIX file vault for PDF/A exhibits, connecting to MP Treasury and India Post APIs."
        ],
        page_num=6
    )
    pages.append(p5)

    # 7. Package Diagram
    print("Creating A4 Package Diagram Page...")
    p6 = create_diagram_page(
        num=6,
        title="UML Package Diagram",
        subtitle="Modular Package Decomposition & Layered Architectural Separation",
        image_path="diagrams/Package_Diagram.png",
        highlights=[
            "Layered Separation: Routers (api.v1) handle HTTP, Schemas validate DTOs, Services enforce business logic.",
            "Domain Models (models): Cleanly separated domain ORM entities with zero coupling to HTTP request handlers.",
            "Asynchronous Workers: Countdown daemon executes independently of the request-response cycle.",
            "Frontend Modularity: Client components cleanly decoupled into UI views, context providers, and API services."
        ],
        page_num=7
    )
    pages.append(p6)

    # 8. Object Diagram
    print("Creating A4 Object Diagram Page...")
    p7 = create_diagram_page(
        num=7,
        title="UML Object Diagram",
        subtitle="Runtime Instance Snapshot: Commercial Suit COMM_SUIT_301_2026 (Indore Bench)",
        image_path="diagrams/Object_Diagram.png",
        highlights=[
            "Live Suit Instance: Case MPHC010048212026 (Malwa Agro Tech v. Narmada Bio-Energy, Specified Value: ₹45 Lakhs).",
            "Judicial Actors: Hon'ble Justice Arun Mishra (Judge), Adv. Himanshu Bawaniya (Plff), Adv. Ragini Sharma (Def).",
            "Admissions State: Commercial contract marked ADMITTED; technical specs conformity marked DENIED triable issue.",
            "Statutory Timetable: CMO/IND/2026/04 with mandatory discovery inspection deadline and SHA-256 seal."
        ],
        page_num=8
    )
    pages.append(p7)

    # Save Unified 8-Page A4 PDF
    output_pdf = "diagrams/SVVV_UML_Architecture_Dossier_A4.pdf"
    pages[0].save(
        output_pdf,
        "PDF",
        resolution=300.0,
        save_all=True,
        append_images=pages[1:]
    )
    print(f"✓ Saved Unified 8-Page A4 PDF: {output_pdf}")

    # Also save individual 1-page A4 PDFs for quick individual printing
    single_pages = [
        ("Activity_Diagram_A4.pdf", p1),
        ("Sequence_Diagram_A4.pdf", p2),
        ("Class_Diagram_A4.pdf", p3),
        ("Component_Diagram_A4.pdf", p4),
        ("Deployment_Diagram_A4.pdf", p5),
        ("Package_Diagram_A4.pdf", p6),
        ("Object_Diagram_A4.pdf", p7)
    ]
    for fname, p in single_pages:
        p_path = os.path.join("diagrams", fname)
        p.save(p_path, "PDF", resolution=300.0)
        print(f"✓ Saved Single-Page A4 PDF: {p_path}")

if __name__ == "__main__":
    main()

