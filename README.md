# The Transformer — Interactive Study Companion

**Live:** https://roboticcam.github.io/interactive-ml/ (auto-deployed from `main` via GitHub Actions).


A hands-on study website built from `../transformer.tex` ("Transformer with PyTorch", Richard Xu).
It walks the whole modern attention stack — from a single dot product to FlashAttention, MLA, RoPE,
the lightning indexer, hyper-connections and knowledge distillation — and makes the PyTorch operations
something you can **poke, step through, and watch reshape live**.

Visual language mirrors the SlideSmith deck system (`vibe/ppt`): the *snow* palette (white canvas,
slate ink `#0f172a`, indigo accent `#4f46e5`), big tracking-tight display type, generous whitespace.

## Run

```bash
npm install
npm run dev      # http://localhost:5199
npm run build    # production bundle in dist/
```

## What's inside

Single-page reading experience with a scroll-spy sidebar, 10 chapters, and 7 interactive labs:

| Lab | Where | What it does |
| --- | --- | --- |
| **Attention flow** (3b1b-style) | Ch.1 | A query token fans weighted edges to the keys it attends to, sweeping causally through a sentence. |
| **Attention Lab** | Ch.2 | Step through Q·Kᵀ → scale → mask → softmax → ·V on a real 4-token sequence; toggle scaling & causal mask. |
| **torch.unsqueeze** | Ch.2 | Pick a tensor and a `dim`, watch the shape and grid change (ties to the `(1,1,T,T)` mask). |
| **Split heads** | Ch.2 | `view()` + `transpose()` regrouping the channel axis into independent per-head matrices. |
| **KV cache** | Ch.4 | "Generate" a token and see only one new row appear — why K/V get cached. |
| **RoPE rotation** | Ch.6 | Two vectors on a circle; slide positions and see the dot product depend only on the gap. |
| **Online softmax** | Ch.8 | Stream the FlashAttention fused loop; watch the running max + denominator rescale. |
| **Beam vs. greedy** | Ch.10 | The paper's toy distillation example — greedy misses the global mode that beam search finds. |

> Animations are hand-built with SVG + [framer-motion](https://www.framer.com/motion/), *inspired by*
> the visual style of [3blue1brown](https://github.com/3b1b). No `manim` or 3b1b assets are used.

## Languages

Trilingual — **English (default)**, **简体中文**, **繁體中文** — via the `EN / 简体 / 繁體`
switcher in the sidebar. Choice persists in `localStorage`; first visit guesses from the browser
but still defaults to English.

- `src/i18n/strings.js` holds the English catalog (source of truth); `strings.zhHans.js` /
  `strings.zhHant.js` override by key and fall back to English for anything missing.
- Prose values use a tiny markup rendered by `src/i18n/rich.jsx` — `$math$`, `` `code` ``,
  `**bold**`, `*italic*`, `[text](url)` — so translations stay flat strings while math/code stay shared.
- All narrative, nav, callouts, captions, and the PDF drawer translate. The **inside** of the
  interactive widgets (play/pause, tensor-shape badges, code) stays English by design — it's
  code-dense and reads cleaner uniform.

To add a language: add an entry to `LANGS` in `src/i18n/LangContext.jsx` and a matching override map.

## Referencing the source PDF

The paper (`transformer.pdf`) is served from `public/` and cited throughout:

- Every chapter heading has a **"📄 Paper §N · p.M" pill**; deeper subsections (Decoupled RoPE,
  online attention, doubly-stochastic, sentence-level distillation) have their own.
- Clicking a pill opens a **slide-in drawer** with the PDF embedded at that exact page
  (`#page=N`, via `components/Paper.jsx`), plus an "open in new tab" fallback.
- A persistent **"Read the full paper"** button sits in the sidebar.
- Page numbers come from `../transformer.toc` (the LaTeX table of contents) — update them there if
  the paper is recompiled and pagination shifts.

### Bidirectional cross-reference

The PDF links back too. `public/transformer.pdf` is post-processed (PyMuPDF; script kept out of the
repo) to stamp a clickable **"OPEN IN APP"** badge on each of the 10 section headings plus a page-1
banner, each pointing at the matching app anchor (`…/interactive-ml/#<section>`). So: app → PDF page
via the pills, and PDF → app section via the badges. Regenerate with `scripts/link_pdf.py`
(`pip install pymupdf`) whenever the paper is recompiled.

## Architecture

```
src/
  App.jsx                 hero + scroll-spy sidebar + reading pane + progress bar
  sections/chapters.jsx   all 10 chapters (data-driven manifest drives nav + render)
  components/
    Math.jsx              KaTeX wrapper with the paper's \q \K \V … macros
    Code.jsx              dependency-free Python highlighter
    TensorGrid.jsx        heat-mapped matrix renderer (powers every demo)
    Section.jsx, ui.jsx   Chapter/Sub headings, DemoCard, Callout, Eyebrow…
    demos/  anim/         the interactive labs
  lib/tensor.js           tiny matmul / softmax / causal-mask helpers (deterministic, seeded)
```

Adding a chapter = add a component + one entry to the `CHAPTERS` manifest in `sections/chapters.jsx`.
The sidebar, scroll-spy, and deep-link anchors update automatically.
