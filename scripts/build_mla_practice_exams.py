#!/usr/bin/env python3
"""Build the AWS MLA-C01 practice exam bank the quiz runner reads.

Input  : scripts/data/aws_mla_practice_exams.json — the raw scrape, one entry
         per practice test, each with 65 questions.
Output : public/exams/practice/<slug>.json  — one file per test, fetched on
                                              demand by MlaPracticeExams.jsx.
         src/data/mlaPracticeExams.js       — the manifest (titles, counts,
                                              domain splits) the landing screen
                                              renders before anything is
                                              fetched.

Question and explanation bodies keep their HTML, because the corpus leans on
lists, inline code and architecture diagrams that plain text loses. The HTML is
run through a whitelist first (see SafeHtml) so the runner can render it with
dangerouslySetInnerHTML without trusting the scrape.

Usage: python3 scripts/build_mla_practice_exams.py
"""

import json
import os
import re
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "scripts", "data", "aws_mla_practice_exams.json")
OUT_DIR = os.path.join(ROOT, "public", "exams", "practice")
MANIFEST = os.path.join(ROOT, "src", "data", "mlaPracticeExams.js")

# The real MLA-C01: 65 scored questions, 130 minutes, scaled 100–1000, 720 to
# pass. The runner's exam mode uses a 210-minute clock instead, which is what
# this bank is configured for.
EXAM_MINUTES = 210
SCALE_MIN, SCALE_MAX, SCALE_PASS = 100, 1000, 720

ALLOWED_TAGS = {
    "p", "br", "strong", "b", "em", "i", "u", "code", "pre",
    "ul", "ol", "li", "blockquote", "a", "img", "span",
    "table", "thead", "tbody", "tr", "th", "td",
}
ALLOWED_ATTRS = {"a": {"href", "title"}, "img": {"src", "alt"}}
VOID_TAGS = {"br", "img"}


class SafeHtml(HTMLParser):
    """Keep a small formatting subset; drop every other tag but its text.

    Unknown tags are unwrapped rather than removed so no prose is lost, and
    only http(s) URLs survive on href/src — that is what rules out javascript:
    and data: payloads.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip_depth += 1
            return
        if self.skip_depth or tag not in ALLOWED_TAGS:
            return
        kept = []
        for name, value in attrs:
            if name not in ALLOWED_ATTRS.get(tag, set()) or not value:
                continue
            if name in ("href", "src") and not re.match(r"^https?://", value.strip(), re.I):
                continue
            kept.append(f' {name}="{escape_attr(value.strip())}"')
        close = "/" if tag in VOID_TAGS else ""
        self.out.append(f"<{tag}{''.join(kept)}{close}>")

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip_depth = max(0, self.skip_depth - 1)
            return
        if self.skip_depth or tag not in ALLOWED_TAGS or tag in VOID_TAGS:
            return
        self.out.append(f"</{tag}>")

    def handle_data(self, data):
        if not self.skip_depth:
            self.out.append(data.replace("<", "&lt;").replace(">", "&gt;"))

    def value(self):
        return re.sub(r"\n{3,}", "\n\n", "".join(self.out)).strip()


def escape_attr(value):
    return value.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def clean_html(raw, fallback=""):
    if not raw:
        # No HTML for this field — wrap the plain-text twin in paragraphs so the
        # runner always gets the same shape back.
        paragraphs = [p.strip() for p in (fallback or "").split("\n\n") if p.strip()]
        return "".join(f"<p>{escape_text(p)}</p>" for p in paragraphs)
    parser = SafeHtml()
    parser.feed(raw)
    parser.close()
    return parser.value()


def escape_text(value):
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")


def slugify(index):
    return f"mla-c01-practice-{index}"


def short_title(title):
    """'Practice Test #1 - Full Exam - AWS Certified …' → 'Practice Test 1'."""
    match = re.search(r"Practice Test\s*#?(\d+)", title)
    return f"Practice Test {match.group(1)}" if match else title.split(" - ")[0].strip()


def build_question(raw):
    letters = sorted(raw.get("options", {}).keys())
    options = [
        {"key": letter, "text": raw["options"][letter]}
        for letter in letters
    ]
    correct = [a.strip().upper() for a in raw.get("correct_answers") or []]
    return {
        "id": raw.get("question_id"),
        "number": raw.get("question_number"),
        "domain": raw.get("section") or "General",
        # multi-select questions ask for two or three answers; the runner
        # switches to checkboxes on this flag rather than on option count.
        "multi": len(correct) > 1 or raw.get("assessment_type") == "multi-select",
        "promptHtml": clean_html(raw.get("question_html"), raw.get("question_text")),
        "promptText": (raw.get("question_text") or "").strip(),
        "options": options,
        "correct": correct,
        "correctText": raw.get("correct_answers_text") or [],
        "explanationHtml": clean_html(raw.get("explanation_html"), raw.get("explanation_text")),
    }


def main():
    with open(SOURCE, encoding="utf-8") as handle:
        source = json.load(handle)

    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = []

    for index, exam in enumerate(source, start=1):
        questions = [build_question(q) for q in exam["questions"]]
        slug = slugify(index)

        domains = {}
        for question in questions:
            domains[question["domain"]] = domains.get(question["domain"], 0) + 1

        payload = {
            "slug": slug,
            "title": short_title(exam["title"]),
            "fullTitle": exam["title"],
            "questions": questions,
        }
        with open(os.path.join(OUT_DIR, f"{slug}.json"), "w", encoding="utf-8") as handle:
            json.dump(payload, handle, ensure_ascii=False, separators=(",", ":"))

        manifest.append({
            "slug": slug,
            "title": short_title(exam["title"]),
            "fullTitle": exam["title"],
            "questionCount": len(questions),
            "multiSelectCount": sum(1 for q in questions if q["multi"]),
            "domains": [
                {"name": name, "count": count}
                for name, count in sorted(domains.items(), key=lambda kv: -kv[1])
            ],
        })

    body = json.dumps(manifest, indent=2, ensure_ascii=False)
    with open(MANIFEST, "w", encoding="utf-8") as handle:
        handle.write(
            "// Generated by scripts/build_mla_practice_exams.py — do not edit by hand.\n"
            "//\n"
            "// The landing screen needs titles, counts and domain splits before any\n"
            "// question body is fetched, so those live here; the questions themselves are\n"
            "// in public/exams/practice/<slug>.json and load when a test is opened.\n\n"
            f"export const MLA_EXAM_MINUTES = {EXAM_MINUTES};\n"
            f"export const MLA_SCORE_MIN = {SCALE_MIN};\n"
            f"export const MLA_SCORE_MAX = {SCALE_MAX};\n"
            f"export const MLA_PASSING_SCORE = {SCALE_PASS};\n\n"
            'export const MLA_CERTIFICATION = {\n'
            '  code: "MLA-C01",\n'
            '  name: "AWS Certified Machine Learning Engineer – Associate",\n'
            '};\n\n'
            f"export const MLA_PRACTICE_EXAMS = {body};\n\n"
            "export const MLA_EXAM_BY_SLUG = MLA_PRACTICE_EXAMS.reduce((acc, exam) => {\n"
            "  acc[exam.slug] = exam;\n"
            "  return acc;\n"
            "}, {});\n"
        )

    total = sum(entry["questionCount"] for entry in manifest)
    print(f"Wrote {len(manifest)} practice tests ({total} questions) to {OUT_DIR}")
    print(f"Wrote manifest to {MANIFEST}")


if __name__ == "__main__":
    main()
