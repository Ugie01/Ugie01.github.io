"""Build a compact, print-ready PDF from the current portfolio site."""
from __future__ import annotations

from html import escape
from io import BytesIO
from pathlib import Path
import json
import subprocess
from tempfile import TemporaryDirectory

from lxml import html
from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab.platypus import (
    Flowable,
    HRFlowable,
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


site = Path(__file__).resolve().parent.parent
output = site / "assets" / "Lee_Myungwook_Robot_SW_Portfolio.pdf"
scratch_context = TemporaryDirectory(prefix="portfolio-pdf-", dir=site / "assets")
scratch = Path(scratch_context.name)

pdfmetrics.registerFont(TTFont("Malgun", r"C:\Windows\Fonts\malgun.ttf"))
pdfmetrics.registerFont(TTFont("MalgunBold", r"C:\Windows\Fonts\malgunbd.ttf"))

ink = colors.HexColor("#171717")
muted = colors.HexColor("#666666")
line = colors.HexColor("#D8D8D8")
paper = colors.HexColor("#F4F4F4")
content_width = A4[0] - 80

styles = {
    "title": ParagraphStyle("title", fontName="MalgunBold", fontSize=28, leading=34, textColor=ink, spaceAfter=7),
    "cover_title": ParagraphStyle("cover_title", fontName="MalgunBold", fontSize=38, leading=46, textColor=ink, spaceAfter=8),
    "subtitle": ParagraphStyle("subtitle", fontName="Malgun", fontSize=11, leading=16, textColor=muted, spaceAfter=11),
    "meta": ParagraphStyle("meta", fontName="Malgun", fontSize=9.6, leading=14, textColor=muted, spaceAfter=10),
    "heading": ParagraphStyle("heading", fontName="MalgunBold", fontSize=12, leading=16, textColor=ink, spaceBefore=7, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Malgun", fontSize=10, leading=14.5, textColor=ink, spaceAfter=4),
    "small": ParagraphStyle("small", fontName="Malgun", fontSize=9.2, leading=13.2, textColor=ink, spaceAfter=3),
    "bullet": ParagraphStyle("bullet", fontName="Malgun", fontSize=9.3, leading=13.2, textColor=ink, leftIndent=11, firstLineIndent=-11, spaceAfter=2),
    "label": ParagraphStyle("label", fontName="MalgunBold", fontSize=9.2, leading=12.5, textColor=muted, spaceAfter=3),
}


def clean(value: str) -> str:
    return " ".join(value.split())


def paragraph(value: str, style: str = "body") -> Paragraph:
    return Paragraph(escape(clean(value)), styles[style])


def text_at(node, xpath: str) -> str:
    match = node.xpath(xpath)
    return clean(match[0].text_content()) if match else ""


def image_flow(path: Path, max_width: float, max_height: float):
    if path.suffix.lower() == ".svg":
        png = scratch / (path.stem + ".png")
        subprocess.run([
            r"C:\Users\dbdna\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe",
            "-e", "const sharp=require(process.argv[1]); sharp(process.argv[2],{density:180}).png().toFile(process.argv[3]).catch(e=>{console.error(e);process.exit(1)})",
            r"C:\Users\dbdna\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\sharp",
            str(path), str(png),
        ], check=True)
        path = png
    with PILImage.open(path) as source:
        source = source.convert("RGB")
        ratio = min(max_width / source.width, max_height / source.height)
        width, height = source.width * ratio, source.height * ratio
        # JPEG is used only as the PDF's internal image format.
        jpeg = scratch / (path.stem + ".jpg")
        source.save(jpeg, format="JPEG", quality=83, optimize=True)
    return Image(str(jpeg), width=width, height=height)


class CroppedImage(Flowable):
    """Show an exact region of an original image without creating altered media."""

    def __init__(self, path: Path, crop: tuple[int, int, int, int], max_width: float, max_height: float):
        super().__init__()
        self.path = path
        self.crop = crop
        x, y, w, h = crop
        with PILImage.open(path) as source:
            assert 0 <= x < source.width and 0 <= y < source.height
            assert x + w <= source.width and y + h <= source.height
        self.scale = min(max_width / w, max_height / h)
        self.width = w * self.scale
        self.height = h * self.scale

    def wrap(self, avail_width, avail_height):
        return self.width, self.height

    def draw(self):
        x, y, w, h = self.crop
        with PILImage.open(self.path) as source:
            source_width, source_height = source.size
            image = ImageReader(source.convert("RGB"))
        self.canv.saveState()
        clip = self.canv.beginPath()
        clip.rect(0, 0, self.width, self.height)
        self.canv.clipPath(clip, stroke=0, fill=0)
        self.canv.drawImage(
            image,
            -x * self.scale,
            -(source_height - y - h) * self.scale,
            width=source_width * self.scale,
            height=source_height * self.scale,
        )
        self.canv.restoreState()


def page_furniture(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(line)
    canvas.setLineWidth(0.6)
    canvas.line(40, A4[1] - 35, A4[0] - 40, A4[1] - 35)
    canvas.setFont("MalgunBold", 8)
    canvas.setFillColor(ink)
    canvas.drawString(40, A4[1] - 28, "UGIE.  /  ROBOT SOFTWARE PORTFOLIO")
    canvas.setFont("Malgun", 7.5)
    canvas.setFillColor(muted)
    canvas.drawString(40, 24, "이명욱  |  Robot Software Engineer")
    canvas.drawRightString(A4[0] - 40, 24, f"{doc.page:02d}")
    canvas.restoreState()


story = []
home = html.fromstring((site / "index.html").read_text(encoding="utf-8"))
story += [Spacer(1, 20), paragraph("이명욱", "cover_title"), paragraph("Robot Software Engineer", "subtitle")]
portrait = site / "assets" / "portfolio-images" / "portrait.webp"
if portrait.exists():
    cover_intro = Table(
        [[
            [paragraph("AMR | Embedded | FMS", "heading"), *[paragraph(p.text_content()) for p in home.xpath('//p[contains(@class,"about-copy")]')]],
            image_flow(portrait, 138, 165),
        ]],
        colWidths=[content_width - 150, 150],
    )
    cover_intro.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 8)]))
    story.append(cover_intro)
story += [Spacer(1, 12), HRFlowable(width="100%", color=line, thickness=0.7), paragraph("사용 기술", "heading")]

skills = home.xpath('//section[@id="skills"]//article[contains(@class,"skill-group")]')
skill_cells = []
for skill in skills:
    name = text_at(skill, ".//h3")
    details = [" | ".join(clean(part) for part in p.itertext() if clean(part)) for p in skill.xpath(".//p")]
    skill_cells.append([paragraph(name, "heading"), *[paragraph(item, "small") for item in details]])
while len(skill_cells) < 4:
    skill_cells.append([])
skill_table = Table([[skill_cells[0], skill_cells[1]], [skill_cells[2], skill_cells[3]]], colWidths=[content_width / 2] * 2)
skill_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), paper), ("BOX", (0, 0), (-1, -1), 0.5, line), ("INNERGRID", (0, 0), (-1, -1), 0.5, line), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
story += [skill_table, Spacer(1, 9), paragraph("학력 및 현재 과정", "heading")]
for article in home.xpath('//section[@id="about"]//div[contains(@class,"education")]//article'):
    story.append(paragraph(f'{text_at(article, ".//span")} | {text_at(article, ".//h3")}  |  {text_at(article, ".//p")}', "small"))
project_items = json.loads((site / "content" / "projects.json").read_text(encoding="utf-8"))
project_names = [item["name"] for item in project_items]
project_by_slug = {item["id"]: item for item in project_items}
story += [Spacer(1, 8), paragraph("프로젝트", "heading"), paragraph(" | ".join(project_names), "small"), paragraph("GitHub / Ugie01", "heading"), Paragraph('<link href="https://github.com/Ugie01" color="#294a7d">github.com/Ugie01</link>', styles["small"]), PageBreak()]


for slug in ["fms", "gosung", "aiming", "tracking", "vip", "plc"]:
    document = html.fromstring((site / "projects" / f"{slug}.html").read_text(encoding="utf-8"))
    title = text_at(document, '//header[contains(@class,"detail-header")]//h1')
    summary = text_at(document, '//p[contains(@class,"detail-summary")]')
    meta_nodes = document.xpath('//p[contains(@class,"detail-meta")]')
    meta = " | ".join(clean(part) for part in meta_nodes[0].itertext() if clean(part)) if meta_nodes else ""
    tags = [clean(item.text_content()) for item in document.xpath('//header[contains(@class,"detail-header")]//ul[contains(@class,"tags")]/li')]
    overview = text_at(document, '(//div[contains(@class,"detail-main")]/section)[1]/p[not(@class)]')
    role = text_at(document, '//div[contains(@class,"role-callout")]/strong')
    bullets = [clean(item.text_content()) for item in document.xpath('//ul[contains(@class,"implementation-list")]/li')]
    flow = [text_at(item, "./span[last()]") for item in document.xpath('//ol[contains(@class,"system-flow")]/li')]
    team = text_at(document, '//p[contains(@class,"external-copy")]')
    case = document.xpath('//div[contains(@class,"case-grid")]/div')
    problem = text_at(case[0], ".//p") if case else ""
    result = text_at(case[1], './/p[not(contains(@class,"limitation"))]') if len(case) > 1 else ""
    limitation = text_at(case[1], './/p[contains(@class,"limitation")]') if len(case) > 1 else ""

    story += [paragraph(title, "title"), paragraph(summary, "subtitle"), paragraph(meta + "   |   " + " / ".join(tags), "meta"), paragraph("확인 결과  |  " + project_by_slug[slug]["highlight"], "label")]
    gallery = document.xpath('//div[contains(@class,"detail-gallery")]/figure')
    if slug == "tracking":
        media = site / "assets" / "portfolio-images"
        state_pictures = [
            [CroppedImage(media / "tracking-normal.webp", (0, 0, 1200, 897), 158, 105), paragraph("정상", "label")],
            [CroppedImage(media / "tracking-danger.png", (800, 310, 1280, 960), 158, 105), paragraph("위험", "label")],
            [CroppedImage(media / "tracking-fall.png", (800, 310, 1280, 960), 158, 105), paragraph("낙상", "label")],
        ]
        distance_pictures = [
            [CroppedImage(media / "tracking-distance.png", (103, 338, 750, 566), 240, 170), paragraph("가로 자세: 가로와 세로 점유율 중 큰 값", "label")],
            [CroppedImage(media / "tracking-distance.png", (1022, 338, 750, 566), 240, 170), paragraph("세로 자세: 박스 높이의 화면 점유율", "label")],
        ]
        for heading, pictures, columns in [
            ("상황 판단", state_pictures, 3),
            ("자세에 따른 거리 유지", distance_pictures, 2),
        ]:
            picture_table = Table([pictures], colWidths=[content_width / columns] * columns)
            picture_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
            if heading == "상황 판단":
                story += [paragraph(heading, "heading"), picture_table]
            else:
                tracking_distance_table = picture_table
    else:
        cover = project_by_slug[slug]["coverImage"]
        pictures = [[image_flow(site / "assets" / "portfolio-images" / cover["src"], 162, 115), paragraph("대표 이미지", "label")]]
        for figure in gallery:
            sources = figure.xpath(".//img/@src")
            if not sources:
                continue
            path = (site / "projects" / sources[0]).resolve()
            if path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".svg"}:
                continue
            pictures.append([image_flow(path, 162, 115), paragraph(text_at(figure, ".//figcaption"), "label")])
        if pictures:
            picture_table = Table([pictures[:3]], colWidths=[content_width / 3] * 3)
            picture_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
            story += [picture_table, Spacer(1, 3)]
    story += [paragraph("목표와 구현", "heading"), paragraph(overview)]
    role_box = Table([[paragraph("담당 역할", "label"), paragraph(role, "small")]], colWidths=[74, content_width - 74])
    role_box.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), paper), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
    story += [Spacer(1, 3), role_box, paragraph("내가 구현한 일", "heading")]
    for bullet in bullets:
        story.append(paragraph("•  " + bullet, "bullet"))
    if slug == "tracking":
        story += [
            PageBreak(),
            paragraph("Tracking Patrol Robot", "title"),
            paragraph("자세에 따른 거리 유지", "subtitle"),
            tracking_distance_table,
            Spacer(1, 7),
            paragraph("낙상 상태는 바운딩 박스의 가로와 세로 점유율 중 큰 값에 별도 정지와 후진 기준을 적용합니다. 서 있는 대상은 박스 높이의 화면 점유율을 사용합니다.", "small"),
        ]
    if flow:
        story += [paragraph("시스템 구조와 흐름", "heading"), paragraph("  →  ".join(flow), "small")]
    if team:
        story += [paragraph("협업 범위", "heading"), paragraph(team, "small")]
    if problem or result:
        story += [paragraph("문제 해결과 결과", "heading"), paragraph(problem, "small"), paragraph(result, "small")]
    if limitation:
        story += [paragraph("검증 범위와 한계", "heading"), paragraph(limitation, "small")]
    story.append(PageBreak())

document = SimpleDocTemplate(
    str(output), pagesize=A4, leftMargin=40, rightMargin=40, topMargin=48, bottomMargin=42,
    title="이명욱 | Robot Software Engineer Portfolio", author="이명욱",
)
document.build(story, onFirstPage=page_furniture, onLaterPages=page_furniture)
scratch_context.cleanup()
print(output)
