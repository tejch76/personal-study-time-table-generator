"""
Script to generate a professional PowerPoint presentation for:
StudyFlow – Personal Study Timetable Generator
"""

import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck(filename="StudyFlow_Presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    C_BG_DARK    = RGBColor(19, 19, 43)      # #13132b deep navy dark
    C_BG_LIGHT   = RGBColor(240, 244, 255)   # #f0f4ff light canvas
    C_PURPLE     = RGBColor(108, 99, 255)    # #6c63ff primary
    C_PURPLE_LT  = RGBColor(237, 233, 255)   # #ede9ff
    C_BLUE       = RGBColor(59, 158, 218)    # #3b9eda
    C_BLUE_LT    = RGBColor(219, 239, 254)   # #dbeffe
    C_TEXT_DARK  = RGBColor(30, 27, 75)      # #1e1b4b
    C_TEXT_MUTED = RGBColor(100, 116, 139)   # slate gray
    C_TEXT_WHITE = RGBColor(255, 255, 255)
    C_CARD_BG    = RGBColor(255, 255, 255)
    C_CARD_BORDER= RGBColor(226, 232, 240)
    C_GREEN      = RGBColor(16, 185, 129)
    C_ORANGE     = RGBColor(249, 115, 22)

    def add_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category="STUDYFLOW PROJECT OVERVIEW"):
        # Header banner text
        cat_box = slide.shapes.add_textbox(Inches(0.9), Inches(0.45), Inches(11.5), Inches(0.35))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        tf_cat.margin_left = tf_cat.margin_right = tf_cat.margin_top = tf_cat.margin_bottom = 0
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.name = "Calibri"
        p_cat.font.size = Pt(10.5)
        p_cat.font.bold = True
        p_cat.font.color.rgb = C_PURPLE

        title_box = slide.shapes.add_textbox(Inches(0.9), Inches(0.75), Inches(11.5), Inches(0.65))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_right = tf_t.margin_top = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.name = "Calibri"
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = C_TEXT_DARK

    def add_card(slide, x, y, w, h, bg_color=C_CARD_BG, border_color=C_CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.2)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: Title Slide (Dark Indigo Theme)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, C_BG_DARK)

    # Accent decorative bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), Inches(1.5), Inches(0.12), Inches(4.2))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_PURPLE
    bar.line.fill.background()

    # Project Tag Badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.25), Inches(1.5), Inches(3.2), Inches(0.42))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(45, 43, 90)
    badge.line.fill.background()
    tb_b = badge.text_frame
    p_b = tb_b.paragraphs[0]
    p_b.text = "PERSONAL PRODUCTIVITY WEB APP"
    p_b.font.name = "Calibri"
    p_b.font.size = Pt(10.5)
    p_b.font.bold = True
    p_b.font.color.rgb = C_BLUE
    p_b.alignment = PP_ALIGN.CENTER

    # Main Title
    t_box = s1.shapes.add_textbox(Inches(1.25), Inches(2.1), Inches(10.8), Inches(1.4))
    tf = t_box.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "StudyFlow"
    p1.font.name = "Calibri"
    p1.font.size = Pt(54)
    p1.font.bold = True
    p1.font.color.rgb = C_TEXT_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Personal Study Timetable Generator & Focus Suite"
    p2.font.name = "Calibri"
    p2.font.size = Pt(22)
    p2.font.color.rgb = RGBColor(203, 213, 225)
    p2.space_before = Pt(8)

    # Description & Key Pillars
    desc_box = s1.shapes.add_textbox(Inches(1.25), Inches(3.8), Inches(10.5), Inches(1.2))
    tf_d = desc_box.text_frame
    tf_d.word_wrap = True
    p_d = tf_d.paragraphs[0]
    p_d.text = (
        "A lightweight, client-side web application designed to eliminate scheduling friction, "
        "prevent timetable overlaps, facilitate Pomodoro study blocks, and track study milestones.\n"
        "Built purely with HTML5, CSS3, and JavaScript — zero backend required."
    )
    p_d.font.name = "Calibri"
    p_d.font.size = Pt(14)
    p_d.font.color.rgb = RGBColor(148, 163, 184)

    # Tech Stack Pill Chips
    techs = ["HTML5", "CSS3 Custom Properties", "Vanilla JS (ES6+)", "LocalStorage Persistence", "Responsive UI", "Dark / Light Mode"]
    chip_x = Inches(1.25)
    for t in techs:
        c_w = Inches(1.5 + len(t) * 0.04)
        chip = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, chip_x, Inches(5.3), c_w, Inches(0.38))
        chip.fill.solid()
        chip.fill.fore_color.rgb = RGBColor(31, 30, 69)
        chip.line.color.rgb = C_PURPLE
        chip.line.width = Pt(1)
        tb_c = chip.text_frame
        p_c = tb_c.paragraphs[0]
        p_c.text = t
        p_c.font.name = "Calibri"
        p_c.font.size = Pt(10)
        p_c.font.color.rgb = C_TEXT_WHITE
        p_c.alignment = PP_ALIGN.CENTER
        chip_x += c_w + Inches(0.18)

    # =========================================================================
    # SLIDE 2: Problem Statement & Solution
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2, C_BG_LIGHT)
    add_header(s2, "Problem Statement & Solution Overview", "Executive Summary")

    # Left Card: The Challenge
    add_card(s2, Inches(0.9), Inches(1.65), Inches(5.6), Inches(5.2))
    accent_bar1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.65), Inches(5.6), Inches(0.15))
    accent_bar1.fill.solid()
    accent_bar1.fill.fore_color.rgb = C_ORANGE
    accent_bar1.line.fill.background()

    tb_p = s2.shapes.add_textbox(Inches(1.2), Inches(1.95), Inches(5.0), Inches(4.7))
    tf_p = tb_p.text_frame
    tf_p.word_wrap = True

    p = tf_p.paragraphs[0]
    p.text = "THE PROBLEM"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = C_ORANGE

    p = tf_p.add_paragraph()
    p.text = "Students Face Daily Scheduling Chaos"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(14)

    problems = [
        ("Conflicting Time Slots", "Manual planners frequently result in overlapping commitments and unmanageable study hours."),
        ("Lack of Built-In Timers", "Students switch between separate schedule notes and timer apps, leading to digital distraction."),
        ("No Habit Accountability", "Without real-time streak tracking or subject distribution charts, study consistency wanes."),
        ("Overcomplicated Software", "Most productivity tools require mandatory accounts, subscriptions, and heavy cloud overhead.")
    ]
    for title, desc in problems:
        p = tf_p.add_paragraph()
        p.text = f"•  {title}: "
        p.font.bold = True
        p.font.size = Pt(12.5)
        p.font.color.rgb = C_TEXT_DARK
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_MUTED

    # Right Card: The Solution
    add_card(s2, Inches(6.8), Inches(1.65), Inches(5.6), Inches(5.2))
    accent_bar2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.65), Inches(5.6), Inches(0.15))
    accent_bar2.fill.solid()
    accent_bar2.fill.fore_color.rgb = C_PURPLE
    accent_bar2.line.fill.background()

    tb_s = s2.shapes.add_textbox(Inches(7.1), Inches(1.95), Inches(5.0), Inches(4.7))
    tf_s = tb_s.text_frame
    tf_s.word_wrap = True

    p = tf_s.paragraphs[0]
    p.text = "THE STUDYFLOW SOLUTION"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = C_PURPLE

    p = tf_s.add_paragraph()
    p.text = "An Integrated, Autonomous Study Suite"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(14)

    solutions = [
        ("Automated Overlap Detection", "Intelligent validation prevents conflicting sessions before they are saved to the timetable."),
        ("Dynamic Chronological Generator", "Arranges subjects automatically in sequence and inserts smart rest breaks."),
        ("Integrated Pomodoro Focus Timer", "Custom focus/break durations with direct subject assignment and automated logging."),
        ("Zero Friction & 100% Private", "Runs completely in the browser; all timetable data stays private in LocalStorage.")
    ]
    for title, desc in solutions:
        p = tf_s.add_paragraph()
        p.text = f"✔  {title}: "
        p.font.bold = True
        p.font.size = Pt(12.5)
        p.font.color.rgb = C_PURPLE
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 3: Key Modules & Functional Architecture
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3, C_BG_LIGHT)
    add_header(s3, "Application Architecture: 5 Core Modules", "System Design")

    modules = [
        ("1. Dashboard", "Live Metrics & Overview", C_PURPLE, [
            "Real-time greeting & clock",
            "Total subjects counter",
            "Daily planned study hours",
            "Completed sessions & streaks",
            "Today's dynamic progress bar"
        ]),
        ("2. Subjects", "Input & Validation Engine", C_BLUE, [
            "Unlimited subject addition",
            "Modal popup creation/editing",
            "Start & end time selection",
            "Live duration auto-sync",
            "Overlap conflict prevention"
        ]),
        ("3. Timetable", "Chronological Scheduler", C_GREEN, [
            "Clean Table View & Timeline",
            "Automated break insertion",
            "Inline edit & delete actions",
            "Single-click regeneration",
            "Print-ready CSS formatting"
        ]),
        ("4. Study Timer", "Pomodoro Focus Suite", C_ORANGE, [
            "SVG circular ring countdown",
            "Focus, Short, Long break modes",
            "Start, Pause, Resume, Reset",
            "Direct subject association",
            "Automatic session recording"
        ]),
        ("5. Progress", "Analytics & History", RGBColor(139, 92, 246), [
            "Total study time metric",
            "Subject-wise time breakdown",
            "Filterable history logs",
            "35-day activity heat calendar",
            "Real-time completion %"
        ]),
    ]

    card_w = Inches(2.26)
    card_gap = Inches(0.18)
    start_x = Inches(0.9)

    for i, (m_title, m_sub, m_col, feats) in enumerate(modules):
        cur_x = start_x + i * (card_w + card_gap)
        add_card(s3, cur_x, Inches(1.65), card_w, Inches(5.2))

        # Top color tag
        top_tag = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cur_x, Inches(1.65), card_w, Inches(0.12))
        top_tag.fill.solid()
        top_tag.fill.fore_color.rgb = m_col
        top_tag.line.fill.background()

        tb = s3.shapes.add_textbox(cur_x + Inches(0.15), Inches(1.9), card_w - Inches(0.3), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = m_title
        p.font.bold = True
        p.font.size = Pt(15)
        p.font.color.rgb = C_TEXT_DARK

        p = tf.add_paragraph()
        p.text = m_sub
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(14)

        for feat in feats:
            p = tf.add_paragraph()
            p.text = f"• {feat}"
            p.font.size = Pt(11)
            p.font.color.rgb = C_TEXT_DARK
            p.space_before = Pt(6)

    # =========================================================================
    # SLIDE 4: Subject Management & Overlap Prevention
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4, C_BG_LIGHT)
    add_header(s4, "Subject Management & Overlap Prevention Engine", "Core Scheduling Engine")

    # Left: The Modal & Features
    add_card(s4, Inches(0.9), Inches(1.65), Inches(5.6), Inches(5.2))
    tb_m = s4.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(5.0), Inches(4.7))
    tf_m = tb_m.text_frame
    tf_m.word_wrap = True

    p = tf_m.paragraphs[0]
    p.text = "INTERACTIVE MODAL POPUP FORM"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = C_PURPLE

    p = tf_m.add_paragraph()
    p.text = "Add & Edit Subject Workflow"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(12)

    fields = [
        ("Subject Name", "Max 50 chars, duplicate-name check prevents identical subjects."),
        ("Custom Start & End Times", "Interactive time pickers for granular scheduling control."),
        ("Bidirectional Auto-Sync", "Adjusting start/end times automatically calculates duration; adjusting duration adjusts end time."),
        ("Priority Tiers", "High, Medium, Low priority tags with styled badges."),
        ("Break & Color Customization", "Post-session rest duration and custom hex palette picker.")
    ]
    for f_name, f_desc in fields:
        p = tf_m.add_paragraph()
        p.text = f"✔ {f_name}: "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_DARK
        p.space_before = Pt(6)
        run = p.add_run()
        run.text = f_desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_MUTED

    # Right: Overlap Mathematical Algorithm
    add_card(s4, Inches(6.8), Inches(1.65), Inches(5.6), Inches(5.2))
    tb_a = s4.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.0), Inches(4.7))
    tf_a = tb_a.text_frame
    tf_a.word_wrap = True

    p = tf_a.paragraphs[0]
    p.text = "CONFLICT-FREE ALGORITHM"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = C_BLUE

    p = tf_a.add_paragraph()
    p.text = "Mathematical Overlap Prevention"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(12)

    p = tf_a.add_paragraph()
    p.text = "Mathematical Condition for Session Collision:"
    p.font.bold = True
    p.font.size = Pt(12.5)
    p.font.color.rgb = C_TEXT_DARK

    # Code / Formula Box
    formula_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(3.1), Inches(5.0), Inches(0.75))
    formula_box.fill.solid()
    formula_box.fill.fore_color.rgb = RGBColor(237, 233, 255)
    formula_box.line.color.rgb = C_PURPLE
    tf_fb = formula_box.text_frame
    p_fb = tf_fb.paragraphs[0]
    p_fb.text = "Collision = (Start_A < End_B)  AND  (Start_B < End_A)"
    p_fb.font.name = "Consolas"
    p_fb.font.size = Pt(13)
    p_fb.font.bold = True
    p_fb.font.color.rgb = C_PURPLE
    p_fb.alignment = PP_ALIGN.CENTER

    tb_a2 = s4.shapes.add_textbox(Inches(7.1), Inches(4.0), Inches(5.0), Inches(2.6))
    tf_a2 = tb_a2.text_frame
    tf_a2.word_wrap = True

    steps = [
        ("Time Normalization", "Converts HH:MM strings into total integer minutes from midnight (0–1439)."),
        ("Pre-Save Validation", "Every new or edited subject is tested against all active subjects in memory."),
        ("Inline Error Banners", "Explains the exact conflicting subject and time slot without breaking user flow.")
    ]
    for s_title, s_desc in steps:
        p = tf_a2.add_paragraph()
        p.text = f"• {s_title}: "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_DARK
        p.space_before = Pt(6)
        run = p.add_run()
        run.text = s_desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 5: Timetable Generator & Output Views
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5, C_BG_LIGHT)
    add_header(s5, "Timetable Engine: Table, Timeline & Print", "Schedule Generation")

    # 3 Cards
    col_w = Inches(3.68)
    col_gap = Inches(0.24)

    # Card 1: Chronological Engine
    add_card(s5, Inches(0.9), Inches(1.65), col_w, Inches(5.2))
    tb_c1 = s5.shapes.add_textbox(Inches(1.1), Inches(1.9), col_w - Inches(0.4), Inches(4.7))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True

    p = tf_c1.paragraphs[0]
    p.text = "GENERATION ENGINE"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = C_PURPLE

    p = tf_c1.add_paragraph()
    p.text = "Chronological Arranger"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(10)

    p = tf_c1.add_paragraph()
    p.text = (
        "1. Chronological Sorting:\n"
        "All user-added subjects are ordered by start time automatically.\n\n"
        "2. Break Interval Insertion:\n"
        "The engine calculates time gaps between sessions and inserts designated rest periods.\n\n"
        "3. Live Synchronization:\n"
        "Adding or editing a subject automatically updates the active schedule."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED

    # Card 2: Dual Views
    add_card(s5, Inches(0.9) + col_w + col_gap, Inches(1.65), col_w, Inches(5.2))
    tb_c2 = s5.shapes.add_textbox(Inches(1.1) + col_w + col_gap, Inches(1.9), col_w - Inches(0.4), Inches(4.7))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True

    p = tf_c2.paragraphs[0]
    p.text = "USER PRESENTATION"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = C_BLUE

    p = tf_c2.add_paragraph()
    p.text = "Table & Timeline Views"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(10)

    p = tf_c2.add_paragraph()
    p.text = (
        "• Clean Table View:\n"
        "Tabular display showing subject name, priority badge, 12-hour AM/PM times, duration, and breaks.\n\n"
        "• Visual Timeline View:\n"
        "Vertical chronological timeline connecting sessions with color-coded connector nodes.\n\n"
        "• Inline Actions:\n"
        "Instant edit or remove directly from the generated schedule."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED

    # Card 3: Print Optimization
    add_card(s5, Inches(0.9) + (col_w + col_gap) * 2, Inches(1.65), col_w, Inches(5.2))
    tb_c3 = s5.shapes.add_textbox(Inches(1.1) + (col_w + col_gap) * 2, Inches(1.9), col_w - Inches(0.4), Inches(4.7))
    tf_c3 = tb_c3.text_frame
    tf_c3.word_wrap = True

    p = tf_c3.paragraphs[0]
    p.text = "PHYSICAL EXPORT"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = C_GREEN

    p = tf_c3.add_paragraph()
    p.text = "Print-Ready Layout"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(10)

    p = tf_c3.add_paragraph()
    p.text = (
        "• Dedicated @media print CSS:\n"
        "Hides navigation sidebars, controls, topbars, and buttons upon printing.\n\n"
        "• High-Contrast Print Styling:\n"
        "Clean white background, sharp typography, and bordered table rows.\n\n"
        "• PDF Generation:\n"
        "Users can export to crisp PDF or paper via standard browser print dialog."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 6: Study Timer & Pomodoro Engine
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6, C_BG_LIGHT)
    add_header(s6, "Integrated Pomodoro Study Timer", "Focus Engine")

    # Left: Timer Mechanics
    add_card(s6, Inches(0.9), Inches(1.65), Inches(5.6), Inches(5.2))
    tb_t1 = s6.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(5.0), Inches(4.7))
    tf_t1 = tb_t1.text_frame
    tf_t1.word_wrap = True

    p = tf_t1.paragraphs[0]
    p.text = "TIMER CAPABILITIES"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = C_PURPLE

    p = tf_t1.add_paragraph()
    p.text = "Focus Intervals & Controls"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(10)

    timer_points = [
        ("SVG Circular Countdown", "Dynamic animated ring displaying elapsed percentage via stroke-dashoffset."),
        ("Multi-Mode Support", "Seamlessly switch between Focus (25m), Short Break (5m), and Long Break (15m)."),
        ("Comprehensive Controls", "Start, Pause, Resume, Reset, and Skip to Next Mode."),
        ("Subject Linking", "Dropdown selector allows attributing focus sessions directly to specific subjects."),
        ("Custom Duration Settings", "Inputs allow user-defined session lengths (1–120 mins).")
    ]
    for t_title, t_desc in timer_points:
        p = tf_t1.add_paragraph()
        p.text = f"✔  {t_title}: "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_DARK
        p.space_before = Pt(6)
        run = p.add_run()
        run.text = t_desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_MUTED

    # Right: Automated Session Logging Flow
    add_card(s6, Inches(6.8), Inches(1.65), Inches(5.6), Inches(5.2))
    tb_t2 = s6.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.0), Inches(4.7))
    tf_t2 = tb_t2.text_frame
    tf_t2.word_wrap = True

    p = tf_t2.paragraphs[0]
    p.text = "DATA PIPELINE"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = C_BLUE

    p = tf_t2.add_paragraph()
    p.text = "Automated Progress Logging"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(10)

    steps_timer = [
        ("Session Completion Trigger", "When the timer hits 00:00, the system automatically creates a timestamped session record."),
        ("LocalStorage Storage", "Records duration, subject ID, date, and mode into persistent storage."),
        ("Dashboard Progress Bar Update", "Today's completion bar immediately advances toward daily target."),
        ("Subject Breakdown Refresh", "Increments the total focused hours attributed to that specific course."),
        ("Streak Increment", "Maintains active daily streak when at least one study session is completed per day.")
    ]
    for s_num, (s_head, s_body) in enumerate(steps_timer, 1):
        p = tf_t2.add_paragraph()
        p.text = f"{s_num}. {s_head}: "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_DARK
        p.space_before = Pt(6)
        run = p.add_run()
        run.text = s_body
        run.font.bold = False
        run.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 7: Progress Analytics & Data Persistence
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7, C_BG_LIGHT)
    add_header(s7, "Progress Analytics & LocalStorage Architecture", "Data & Metrics")

    # 4 metric cards
    w_card = Inches(5.6)
    h_card = Inches(2.45)

    # Metric Card 1: Subject-Wise Progress
    add_card(s7, Inches(0.9), Inches(1.65), w_card, h_card)
    tb_m1 = s7.shapes.add_textbox(Inches(1.15), Inches(1.8), w_card - Inches(0.4), h_card - Inches(0.3))
    tf_m1 = tb_m1.text_frame
    tf_m1.word_wrap = True
    p = tf_m1.paragraphs[0]
    p.text = "Subject-Wise Study Distribution"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = C_PURPLE
    p = tf_m1.add_paragraph()
    p.text = (
        "• Calculates cumulative study minutes per subject.\n"
        "• Visual progress bars show relative distribution across subjects.\n"
        "• Highlights areas needing additional focus time."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED
    p.space_before = Pt(6)

    # Metric Card 2: Activity Calendar
    add_card(s7, Inches(6.8), Inches(1.65), w_card, h_card)
    tb_m2 = s7.shapes.add_textbox(Inches(7.05), Inches(1.8), w_card - Inches(0.4), h_card - Inches(0.3))
    tf_m2 = tb_m2.text_frame
    tf_m2.word_wrap = True
    p = tf_m2.paragraphs[0]
    p.text = "35-Day Activity Calendar"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = C_BLUE
    p = tf_m2.add_paragraph()
    p.text = (
        "• GitHub-style 5-week visual activity calendar.\n"
        "• Days with completed study sessions are highlighted in primary purple.\n"
        "• Current day marker with real-time day streak indicator."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED
    p.space_before = Pt(6)

    # Metric Card 3: Session History
    add_card(s7, Inches(0.9), Inches(4.35), w_card, h_card)
    tb_m3 = s7.shapes.add_textbox(Inches(1.15), Inches(4.5), w_card - Inches(0.4), h_card - Inches(0.3))
    tf_m3 = tb_m3.text_frame
    tf_m3.word_wrap = True
    p = tf_m3.paragraphs[0]
    p.text = "Filterable Session History"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = C_GREEN
    p = tf_m3.add_paragraph()
    p.text = (
        "• Chronological history of completed focus sessions.\n"
        "• Interactive dropdown filter (Last 7 Days, 14 Days, 30 Days, All Time).\n"
        "• Shows daily aggregated minutes and individual session counts."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED
    p.space_before = Pt(6)

    # Metric Card 4: LocalStorage Architecture
    add_card(s7, Inches(6.8), Inches(4.35), w_card, h_card)
    tb_m4 = s7.shapes.add_textbox(Inches(7.05), Inches(4.5), w_card - Inches(0.4), h_card - Inches(0.3))
    tf_m4 = tb_m4.text_frame
    tf_m4.word_wrap = True
    p = tf_m4.paragraphs[0]
    p.text = "Resilient LocalStorage Architecture"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = C_ORANGE
    p = tf_m4.add_paragraph()
    p.text = (
        "• Single source of truth state object serialized to JSON.\n"
        "• Backward-compatible recovery checking legacy storage keys.\n"
        "• Reset All confirmation modal with instant data purge option."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED
    p.space_before = Pt(6)

    # =========================================================================
    # SLIDE 8: UI/UX & Responsive Design System
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8, C_BG_LIGHT)
    add_header(s8, "UI/UX Design System & Responsive Layout", "Front-End Engineering")

    col_w = Inches(3.68)
    col_gap = Inches(0.24)

    # Column 1: Color Palette
    add_card(s8, Inches(0.9), Inches(1.65), col_w, Inches(5.2))
    tb_u1 = s8.shapes.add_textbox(Inches(1.1), Inches(1.9), col_w - Inches(0.4), Inches(4.7))
    tf_u1 = tb_u1.text_frame
    tf_u1.word_wrap = True

    p = tf_u1.paragraphs[0]
    p.text = "DESIGN SYSTEM"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = C_PURPLE

    p = tf_u1.add_paragraph()
    p.text = "Blue & Purple Theme"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(10)

    p = tf_u1.add_paragraph()
    p.text = (
        "• Primary Purple (#6c63ff):\n"
        "Signature branding color representing focus, creativity, and wisdom.\n\n"
        "• Sky Blue (#3b9eda):\n"
        "Complementary accent for timing indicators and active highlights.\n\n"
        "• Deep Indigo & Slate:\n"
        "High-contrast text hierarchy ensuring accessibility on all displays."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED

    # Column 2: Dark & Light Mode
    add_card(s8, Inches(0.9) + col_w + col_gap, Inches(1.65), col_w, Inches(5.2))
    tb_u2 = s8.shapes.add_textbox(Inches(1.1) + col_w + col_gap, Inches(1.9), col_w - Inches(0.4), Inches(4.7))
    tf_u2 = tb_u2.text_frame
    tf_u2.word_wrap = True

    p = tf_u2.paragraphs[0]
    p.text = "ACCESSIBILITY"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = C_BLUE

    p = tf_u2.add_paragraph()
    p.text = "Dark & Light Mode"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(10)

    p = tf_u2.add_paragraph()
    p.text = (
        "• CSS Variable Switching:\n"
        "HTML attribute [data-theme='dark'] swaps backgrounds, text, and borders.\n\n"
        "• Dual Toggle Placement:\n"
        "Accessible from both the bottom sidebar and top navigation bar.\n\n"
        "• Persistent Preference:\n"
        "Theme choice persists in LocalStorage across browser restarts."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED

    # Column 3: Mobile & Breakpoints
    add_card(s8, Inches(0.9) + (col_w + col_gap) * 2, Inches(1.65), col_w, Inches(5.2))
    tb_u3 = s8.shapes.add_textbox(Inches(1.1) + (col_w + col_gap) * 2, Inches(1.9), col_w - Inches(0.4), Inches(4.7))
    tf_u3 = tb_u3.text_frame
    tf_u3.word_wrap = True

    p = tf_u3.paragraphs[0]
    p.text = "RESPONSIVENESS"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = C_GREEN

    p = tf_u3.add_paragraph()
    p.text = "Mobile-First Layout"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(10)

    p = tf_u3.add_paragraph()
    p.text = (
        "• Off-Canvas Sidebar Drawer:\n"
        "Slides smoothly on mobile with backdrop-blur overlay.\n\n"
        "• Adaptive CSS Grids:\n"
        "Stat cards, timetable, and subjects scale seamlessly from 4 columns to 1.\n\n"
        "• Touch-Friendly Targets:\n"
        "All buttons and action icons sized for easy mobile interaction."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 9: Technical Debugging & Problem Resolution
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9, C_BG_LIGHT)
    add_header(s9, "Engineering Fix: The 'Hidden Section' Specificity Bug", "Code Quality & Verification")

    add_card(s9, Inches(0.9), Inches(1.65), Inches(11.5), Inches(5.2))

    tb_fix = s9.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(10.9), Inches(4.7))
    tf_fix = tb_fix.text_frame
    tf_fix.word_wrap = True

    p = tf_fix.paragraphs[0]
    p.text = "BUG DIAGNOSIS & ARCHITECTURAL SOLUTION"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = C_PURPLE

    p = tf_fix.add_paragraph()
    p.text = "Resolving the Blank Subjects Page Issue"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(14)

    fix_points = [
        ("Root Cause Analysis",
         "The HTML sections contained the utility class 'hidden'. In style.css, '.hidden' was styled with 'display: none !important;'. "
         "When switchSection() set element.style.display = 'block', the CSS '!important' rule overrode inline styles, causing the Subjects view to render completely blank."),
        ("The Architectural Fix",
         "1. Removed the conflicting 'hidden' class from all <section class='page-section'> elements in index.html.\n"
         "2. Updated switchSection() in script.js to explicitly clean both inline display properties and classes.\n"
         "3. Decoupled CSS section states: .page-section handles 'display: none' by default, while .page-section.active-page handles 'display: block' cleanly."),
        ("Verification & Regression Testing",
         "• Automated syntax check via Node.js compiler: Zero syntax errors.\n"
         "• Automated DOM integration test: Verified all 38 required element IDs and modal triggers.\n"
         "• Verified all 5 pages render without blank screens or display collisions.")
    ]

    for f_title, f_body in fix_points:
        p = tf_fix.add_paragraph()
        p.text = f"✔ {f_title}:"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = C_TEXT_DARK
        p.space_before = Pt(8)

        p2 = tf_fix.add_paragraph()
        p2.text = f_body
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = C_TEXT_MUTED
        p2.space_before = Pt(2)

    # =========================================================================
    # SLIDE 10: Conclusion & Future Roadmap
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10, C_BG_DARK)

    # Accent decorative bar
    bar = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), Inches(1.5), Inches(0.12), Inches(4.5))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_BLUE
    bar.line.fill.background()

    tb_end = s10.shapes.add_textbox(Inches(1.25), Inches(1.5), Inches(10.8), Inches(4.5))
    tf_end = tb_end.text_frame
    tf_end.word_wrap = True

    p = tf_end.paragraphs[0]
    p.text = "PROJECT SUMMARY & ROADMAP"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = C_BLUE

    p = tf_end.add_paragraph()
    p.text = "StudyFlow: Ready for Everyday Study Productivity"
    p.font.bold = True
    p.font.size = Pt(26)
    p.font.color.rgb = C_TEXT_WHITE
    p.space_after = Pt(16)

    deliverables = [
        ("100% Client-Side Independence", "Zero server requirements, zero subscription fees, instantaneous load times."),
        ("Robust Overlap Handling", "Mathematical conflict prevention protects students from scheduling chaos."),
        ("Complete Habit Lifecycle", "Plan -> Schedule -> Focus -> Track all within a unified interface.")
    ]
    for d_title, d_desc in deliverables:
        p = tf_end.add_paragraph()
        p.text = f"✔  {d_title}: "
        p.font.bold = True
        p.font.size = Pt(14)
        p.font.color.rgb = C_PURPLE_LT
        p.space_before = Pt(6)
        run = p.add_run()
        run.text = d_desc
        run.font.bold = False
        run.font.color.rgb = RGBColor(148, 163, 184)

    p = tf_end.add_paragraph()
    p.text = "\nFuture Roadmap:"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = C_TEXT_WHITE
    p.space_before = Pt(10)

    p = tf_end.add_paragraph()
    p.text = "• Google Calendar / iCal export integration   • Audio alerts for Pomodoro timer   • Cloud sync with WebDAV"
    p.font.size = Pt(12.5)
    p.font.color.rgb = C_BLUE_LT

    prs.save(filename)
    print(f"[SUCCESS] Successfully created PowerPoint presentation: {filename}")

if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "StudyFlow_Presentation.pptx"
    create_deck(out_file)
