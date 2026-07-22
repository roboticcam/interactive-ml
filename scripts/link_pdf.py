#!/usr/bin/env python3
"""Stamp bidirectional back-links into transformer.pdf.

For each of the 10 sections it finds the heading on its page and adds a clickable
"OPEN IN APP" badge linking to the matching app anchor, plus a page-1 banner
linking to the app home. Run it whenever the paper is recompiled so page numbers
and headings stay in sync.

    pip install pymupdf        # (use a venv)
    python scripts/link_pdf.py --src ../transformer.pdf --out public/transformer.pdf

Anchors must match the section ids in src/sections/chapters.jsx.
"""
import argparse
import fitz  # PyMuPDF

BASE = "https://roboticcam.github.io/interactive-ml/"

# (1-indexed page, distinctive heading text on that page, app anchor)
SECTIONS = [
    (2, "Dot-Product Attention", "dpa"),
    (4, "Multi-head Attention", "mha"),
    (10, "TransformerBlock", "model"),
    (14, "caching", "kvcache"),
    (15, "Multi-head latent attention", "mla"),
    (18, "Rotary Embedding", "rope"),
    (24, "Indexer", "indexer"),
    (25, "Flash Attention", "flash"),
    (29, "Hyper-Connections", "mhc"),
    (34, "Knowledge Distillation", "distill"),
]

INDIGO = (0.309, 0.275, 0.898)  # #4f46e5
LABEL = "OPEN IN APP"
FS = 7.5


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default="../transformer.pdf")
    ap.add_argument("--out", default="public/transformer.pdf")
    ap.add_argument("--base", default=BASE)
    args = ap.parse_args()

    doc = fitz.open(args.src)
    added = 0
    for page1, needle, anchor in SECTIONS:
        page = doc[page1 - 1]
        rects = page.search_for(needle)
        if not rects:
            print(f"  NOT FOUND: '{needle}' on page {page1} ({anchor})")
            continue
        r = min(rects, key=lambda R: R.y0)  # topmost occurrence = the heading
        uri = args.base + "#" + anchor
        tw = fitz.get_text_length(LABEL, fontname="helv", fontsize=FS)
        pad = 4
        x0 = r.x1 + 10
        if x0 + tw + 2 * pad > page.rect.width - 6:
            x0 = page.rect.width - 6 - tw - 2 * pad
        badge = fitz.Rect(x0, r.y0 - 1, x0 + tw + 2 * pad, r.y1 + 1)
        page.draw_rect(badge, color=INDIGO, fill=INDIGO, width=0)
        page.insert_text((x0 + pad, r.y1 - 1.5), LABEL, fontsize=FS, fontname="helv", color=(1, 1, 1))
        page.insert_link({"kind": fitz.LINK_URI, "from": badge, "uri": uri})
        added += 1
        print(f"  linked p{page1:>2} '{needle}' -> {uri}")

    p0 = doc[0]
    W = p0.rect.width
    btxt = "Interactive study companion  —  click to open in your browser"
    bfs = 9.5
    btw = fitz.get_text_length(btxt, fontname="helv", fontsize=bfs)
    bx0 = (W - btw) / 2 - 12
    banner = fitz.Rect(bx0, 16, bx0 + btw + 24, 34)
    p0.draw_rect(banner, color=INDIGO, fill=INDIGO, width=0)
    p0.insert_text((bx0 + 12, 28.5), btxt, fontsize=bfs, fontname="helv", color=(1, 1, 1))
    p0.insert_link({"kind": fitz.LINK_URI, "from": banner, "uri": args.base})

    doc.save(args.out, deflate=True, garbage=3)
    print(f"Added {added}/{len(SECTIONS)} section links + banner -> {args.out}")


if __name__ == "__main__":
    main()
