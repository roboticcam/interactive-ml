# PROCESS — The Transformer Interactive Study Companion

A running log of how this site was built, the decisions made, and how to maintain it.

- **Source material:** `../transformer.tex` — *"Transformer with PyTorch"* by Prof Richard Xu (徐亦达).
- **Goal:** the best interactive study website for the Transformer — every PyTorch op is something you
  can poke, step through, and watch reshape live; 3blue1brown-style motion; same visual language as the
  `vibe/ppt` (SlideSmith) deck system.
- **Live:** https://roboticcam.github.io/interactive-ml/
- **Repo:** https://github.com/roboticcam/interactive-ml (this app at repo root, `main` branch).

## Stack

React 19 + Vite 7 + Tailwind 3 + KaTeX + framer-motion. No backend — a static SPA.
Dev: `npm run dev` (→ http://localhost:5199). Build: `npm run build`. Auto-deploys to GitHub Pages on push.

## Visual language

Mirrors SlideSmith's "snow" palette: white canvas, slate ink `#0f172a`, indigo accent `#4f46e5`,
big tracking-tight display type, generous whitespace (see `tailwind.config.js`).

## Architecture

```
src/
  App.jsx                  hero + scroll-spy sidebar + reading pane + progress bar + language switcher
  sections/chapters.jsx    all 10 chapters (data-driven CHAPTERS manifest drives nav + render)
  components/
    Section.jsx            Chapter/Sub headings (translatable, paper-ref pills)
    ui.jsx                 Prose, Callout, DemoCard, Eyebrow, ShapePill
    Math.jsx               KaTeX wrapper + the paper's \q \K \V … macros
    Code.jsx               dependency-free Python highlighter + inline code chip
    TensorGrid.jsx         heat-mapped matrix renderer (powers every demo)
    MatMulViz.jsx          animated matrix multiply (row·column dot product, term-by-term)
    Paper.jsx              PDF drawer (deep-link into the paper) + PaperRef pills
    demos/                 UnsqueezeDemo, AttentionLab, SplitHeadsDemo, RoPEDemo,
                           OnlineSoftmaxDemo, KVCacheDemo, BeamSearchDemo
    anim/AttentionFlow.jsx 3b1b-style flowing attention edges
  lib/tensor.js            tiny matmul / softmax / causal-mask helpers (deterministic, seeded)
  i18n/
    LangContext.jsx        provider + useT + LanguageSwitcher (EN default, localStorage-persisted)
    rich.jsx               renders $math$ / `code` / **bold** / *italic* / [link] markup
    strings.js             English catalog (source of truth, ~160 keys)
    strings.zhHans.js      Simplified Chinese overrides (fall back to EN)
    strings.zhHant.js      Traditional Chinese overrides
scripts/link_pdf.py        stamps the PDF's back-links (PyMuPDF)
.github/workflows/deploy.yml  build + deploy to GitHub Pages
public/transformer.pdf     the paper, with clickable back-links baked in
```

## Content

The full paper was digested (all sections, verbatim code listings, tensor shapes, the distillation
numerical example) and re-authored into 10 chapters:

1. Dot-Product Attention · 2. Multi-Head Self-Attention · 3. From Block to Language Model ·
4. Cross-Attention & KV Cache · 5. Multi-Head Latent Attention (MLA) · 6. Rotary Embeddings (RoPE) ·
7. Lightning Indexer · 8. FlashAttention & Online Softmax · 9. Hyper-Connections · 10. Knowledge Distillation.

### Interactive labs (7)

| Lab | Chapter | What it shows |
| --- | --- | --- |
| Attention flow (3b1b-style) | 1 | A query token fans weighted edges to the keys it attends to, causally. |
| Attention Lab | 2 | Q·Kᵀ → scale → mask → softmax → ·V on a real 4-token sequence; scaling/mask toggles. The matmul steps use the animated MatMulViz (row·column dot product). |
| torch.unsqueeze | 2 | Pick a tensor + `dim`; watch the shape and grid change. |
| Split heads | 2 | `view()` + `transpose()` regrouping the channel axis into per-head matrices. |
| KV cache | 4 | "Generate" a token — only one new row appears. |
| RoPE rotation | 6 | Two vectors on a circle; the dot product depends only on the position gap. |
| Online softmax | 8 | Stream the FlashAttention fused loop; running max + denominator rescale. |
| Beam vs. greedy | 10 | The paper's toy distillation example — greedy misses the global mode. |

## Feature log (chronological)

1. **Initial build** — scaffolded the Vite/React/Tailwind app in SlideSmith's aesthetic; digested the
   paper via a subagent; authored 10 chapters with KaTeX math, highlighted code, and the interactive labs.
2. **Animated matmul** — added `MatMulViz` so the `Q·Kᵀ` and `A·V` steps animate the row·column dot
   product term-by-term (aimed at undergrads who know linear algebra). A "row/column workbench" variant
   was tried and then rolled back to the in-place-highlight + equation-strip version on request.
3. **PDF reference (app → PDF)** — copied the paper into `public/`, mapped every section to its page via
   `../transformer.toc`, and added "📄 Paper §N · p.M" pills that open a drawer with the PDF at that page.
4. **3b1b clarification** — confirmed the animations are hand-built SVG + framer-motion *inspired by*
   3blue1brown; no manim / no 3b1b assets. Credit line added to footer + README.
5. **Multilingual** — EN (default) / 简体 / 繁體 via a sidebar switcher. Built the i18n framework, a
   `Rich` markup renderer (so prose stays flat strings while math/code stay shared), the English catalog,
   and parallel-agent translations. Interactive-widget internals intentionally stay English (code-dense).
6. **GitHub + Pages** — pushed to `roboticcam/interactive-ml`; set Vite `base` `/interactive-ml/` (build
   only), a Pages deploy workflow, enabled Pages, verified the live URL.
7. **Bidirectional PDF cross-reference** — `scripts/link_pdf.py` (PyMuPDF) stamps an "OPEN IN APP" badge
   on each of the 10 section headings + a page-1 banner, each linking to the matching app anchor. So:
   app → PDF page (pills), PDF → app section (badges).
8. **Drawer UX iterations** — (a) clearer return-to-app (lighter dim, Esc); (b) fixed "OPEN IN APP" links
   that were loading a nested app inside the drawer iframe (framed loads now message the parent to close +
   scroll, with a frame-break fallback); (c) drawer now fills the whole reading area, leaving the left nav
   visible and usable (click a chapter to close + jump); (d) moved "← Back to app" into the left nav.
9. **Author credit** — Prof Richard Xu / 徐亦达 (徐亦達) in the sidebar + footer, all three languages.
10. **Course expansion (Phase 0–1)** — per `complete.md`: inventoried all 245 `.tex` files across
    `Presentations/*` + `HKBU/MATH3836/latex_notes` (3 parallel agents + gap-fill), produced
    `CATALOG.md` (62 unique modules in 10 parts; approved with decisions: pilots EM/MCMC/VB, NN
    tracks merged, thin sources folded, exclusions confirmed). Built the multi-module course shell:
    hash router (`src/lib/router.js`), module registry with trilingual titles
    (`src/modules/registry.js`), course home with "My subject" picker (`src/pages/Home.jsx`),
    Transformer relocated to `#/m/transformer` with legacy-anchor redirects so the PDF back-links
    keep working. Full project plan: `~/.claude/plans/` (phases 0–4, /loop reserved for Phase 3).

## Key decisions

- **Study website, not a chat app** — took SlideSmith's *look*, not its chat mechanism.
- **Markup-in-strings for i18n** — `$math$`/`` `code` ``/`**bold**` inside flat translatable strings
  (via `rich.jsx`) rather than triplicating JSX. Keeps math/code shared and translations clean.
- **Widget internals stay English** — controls, tensor-shape badges, and code read cleaner uniform than
  half-translated; the narrative fully translates.
- **Seeded demo data** — deterministic pseudo-values (no `Math.random`), stable across renders.

## Maintenance

- **Recompiled the paper?** Re-run `scripts/link_pdf.py` (`pip install pymupdf` in a venv — Python is
  externally-managed) against the fresh `../transformer.pdf`, output to `public/transformer.pdf`. Update
  page numbers in `chapters.jsx` (`paper={{ sec, page }}`, source of truth = `../transformer.toc`) and the
  `SECTIONS` list in the script if pagination shifts.
- **Add a language:** add to `LANGS` in `i18n/LangContext.jsx` + a matching override map.
- **Add a chapter:** add a component + one entry to `CHAPTERS` in `sections/chapters.jsx`; nav/scroll-spy
  update automatically. Add its strings to `i18n/strings.js` (+ translations).

## Known caveats

- Several late UI tweaks were verified via clean build + successful Pages deploy but **not click-tested in
  a live browser** (the Chrome automation extension was disconnected during those rounds).
- Single-page `scroll-behavior: smooth` makes very long nav jumps (ch1 → ch10) slow; fine for linear reading.
- The author line printed *inside* `transformer.pdf` still comes from the LaTeX `\author{}` — changing it
  needs a recompile of the `.tex` (the app UI credit is already updated).
