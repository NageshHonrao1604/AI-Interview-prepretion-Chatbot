from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.platypus.flowables import HRFlowable, Flowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.units import inch, cm, mm

# Register Liberation Sans as Arial (metric-compatible)
BASE = "/usr/share/fonts/truetype/liberation/"
pdfmetrics.registerFont(TTFont("Arial", BASE + "LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", BASE + "LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Italic", BASE + "LiberationSans-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Arial-BoldItalic", BASE + "LiberationSans-BoldItalic.ttf"))
pdfmetrics.registerFontFamily("Arial",
    normal="Arial", bold="Arial-Bold",
    italic="Arial-Italic", boldItalic="Arial-BoldItalic")

# Exact values from original PDF analysis
BLUE       = colors.HexColor("#2c5f8a")
BLACK      = colors.HexColor("#1a1a1a")
PURE_BLACK = colors.HexColor("#000000")
FS         = 13        # font size (all text is 13pt in original)
LH         = 14.95     # line height matching original
LEFT_M     = 36
RIGHT_M    = 36
TOP_M      = 27
BOT_M      = 36

OUTPUT = "/mnt/user-data/outputs/Nagesh_Honrao_Resume.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=LEFT_M,
    rightMargin=RIGHT_M,
    topMargin=TOP_M,
    bottomMargin=BOT_M,
)

# ── Styles (all 13pt Arial, matching original exactly) ────────────────────
S = lambda **kw: ParagraphStyle("x", fontName="Arial", fontSize=FS,
                                 leading=LH, textColor=PURE_BLACK,
                                 spaceAfter=0, spaceBefore=0, **kw)

name_s     = S(fontName="Arial-Bold", fontSize=FS, textColor=BLACK,
               alignment=TA_CENTER, spaceAfter=2)
contact_s  = S(alignment=TA_CENTER, spaceAfter=4)
section_s  = S(fontName="Arial-Bold", textColor=BLUE, spaceBefore=8, spaceAfter=2)
normal_s   = S(spaceAfter=0)
bullet_s   = S(leftIndent=9, firstLineIndent=0, spaceAfter=0)
proj_s     = S(fontName="Arial-Bold", spaceBefore=10, spaceAfter=1)

def hr_line():
    return HRFlowable(width="100%", thickness=1,
                      color=BLUE, spaceAfter=3, spaceBefore=0, vAlign='MIDDLE')

def section(title):
    return [Paragraph(title, section_s), hr_line()]

def normal(text):
    return Paragraph(text, normal_s)

def skill(label, value):
    return Paragraph(f'<b>{label}</b> {value}', normal_s)

def bullet(text):
    return Paragraph(f'\u2022\u200b{text}', bullet_s)

def gap(h=6):
    return Spacer(1, h)

# ── Story ─────────────────────────────────────────────────────────────────
story = []

# Name
story.append(Paragraph("Nagesh Honrao", name_s))

# Contact line
story.append(Paragraph(
    'Pune, Maharashtra  |  +91-9860790286  |  nageshhonrao111@gmail.com  |  '
    '<font color="#2c5f8a">GitHub</font>  |  '
    '<font color="#2c5f8a">LinkedIn</font>',
    contact_s))

# ── Professional Summary
story += section("PROFESSIONAL SUMMARY")
story.append(normal(
    "Passionate Computer Engineering student with strong skills in programming, web "
    "development, and backend systems. Experienced in building secure and optimized solutions "
    "with real-world projects. Eager to grow, take responsibility, and contribute to "
    "organizational success. "))
story.append(gap(8))

# ── Technical Skills
story += section("TECHNICAL SKILLS")
story.append(skill("Programming Languages:", "C, C++, Java, Object-Oriented Programming"))
story.append(skill("Web Technologies:", "HTML5, CSS3, JavaScript, React.js"))
story.append(skill("Databases:", "MySQL, MongoDB"))
story.append(skill("Tools &amp; IDEs:", "Git, GitHub, Visual Studio Code, IntelliJ IDEA"))
story.append(gap(8))

# ── Education
story += section("EDUCATION")
story.append(Paragraph(
    '<b>Bachelor of Engineering \u2013 Computer Engineering </b>'
    'CGPA: 7.50 ', normal_s))
story.append(normal("Savitribai Phule Pune University, Pune  |  Expected 2027 "))
story.append(gap(2))
story.append(Paragraph('<b>Higher Secondary Certificate (HSC) </b>83% ', normal_s))
story.append(normal("Maharashtra State Board  |  2023 "))
story.append(gap(2))
story.append(Paragraph('<b>Secondary School Certificate (SSC) </b>80% ', normal_s))
story.append(normal("Maharashtra State Board  |  2021 "))
story.append(gap(8))

# ── Technical Projects
story += section("TECHNICAL PROJECTS")
story.append(Paragraph(
    '<b>EduTrack \u2013 Classroom &amp; Student Management Portal</b>'
    '  |  Java, Spring Boot, MongoDB, REST APIs ', proj_s))
story.append(bullet("Developed backend services for managing student records and batch operations. "))
story.append(bullet("Implemented RESTful CRUD APIs with NoSQL database integration. "))
story.append(bullet("Improved data access efficiency using optimized database queries. "))
story.append(gap(4))
story.append(Paragraph(
    '<b>AI-Powered Interview Preparation Chatbot</b>'
    '  |  React.js, MongoDB, AI NLP ', proj_s))
story.append(bullet("Developed an AI-powered chatbot that conducts mock interviews and provides instant feedback using NLP. "))
story.append(bullet("Built backend using Python for natural language processing and response evaluation of interview answers. "))
story.append(bullet("Designed a React.js chat interface; used MongoDB to store questions, responses, and performance results. "))
story.append(gap(8))

# ── Certificates
story += section("CERTIFICATES")
story.append(Paragraph('<b>JAVA Certificate of Completion</b>', normal_s))
story.append(gap(3))
story.append(bullet("Proficient in Java programming with a strong understanding of Object-Oriented Programming (OOP) concepts such as inheritance, polymorphism, abstraction, and encapsulation."))
story.append(bullet("Familiar with multithreading and its implementation for concurrent task execution."))
story.append(bullet("Experienced in developing console-based and GUI applications."))
story.append(bullet("Eager to expand knowledge in other core Java areas like collections, exception handling, and file I/O to develop efficient and scalable applications."))

doc.build(story)
print("Done.")