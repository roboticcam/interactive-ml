import ZH_HANS from "./strings.zhHans.js";
import ZH_HANT from "./strings.zhHant.js";

// English is the source of truth. Prose values use the markup understood by
// <Rich>: $math$, **bold**, `code`, *italic*, [text](url). Keys are grouped by
// area (ui.*, nav.*, ch.<id>.*). The two Chinese maps override by key and fall
// back to English for anything missing.
export const EN = {
  // ── Chrome ────────────────────────────────────────────────────────────────
  "ui.sidebar.kicker": "Study Companion",
  "ui.sidebar.title": "The Transformer",
  "ui.sidebar.subtitle": "with PyTorch · Prof Richard Xu",
  "ui.sidebar.readpaper": "Read the full paper",
  "ui.interactive": "Interactive",
  "ui.chapter": "Chapter",

  "ui.hero.eyebrow": "An interactive study companion",
  "ui.hero.title": "The Transformer,",
  "ui.hero.titleAccent": "one tensor at a time.",
  "ui.hero.lead": "A hands-on walk through attention — from the single dot product to FlashAttention, MLA, RoPE and distillation. Every PyTorch operation is something you can poke, step through, and watch reshape live.",
  "ui.hero.cta1": "Start with attention →",
  "ui.hero.cta2": "Jump to FlashAttention",
  "ui.hero.stat1": "10 chapters",
  "ui.hero.stat2": "7 interactive labs",
  "ui.hero.stat3": "Based on “Transformer with PyTorch”",

  "ui.footer.1": "Built from `transformer.tex` by Prof Richard Xu. Interactive study companion — poke every tensor. Every chapter links back to the source PDF.",
  "ui.footer.2": "Animations are hand-built with SVG + framer-motion, inspired by the visual style of [3blue1brown](https://github.com/3b1b) — no manim or 3b1b assets are used.",

  "ui.callout.note": "Note",
  "ui.callout.key": "Key idea",
  "ui.callout.warn": "Watch out",

  "ui.paper.eyebrow": "The paper",
  "ui.paper.page": "page",
  "ui.paper.title": "Transformer with PyTorch",
  "ui.paper.newtab": "Open in new tab ↗",
  "ui.paper.tip": "Read this in the source paper",
  "ui.paper.ref": "Paper",
  "ui.paper.back": "Back to app",

  // ── Course home ───────────────────────────────────────────────────────────
  "ui.home.eyebrow": "An interactive machine-learning course",
  "ui.home.title": "Machine Learning, taught one tensor at a time.",
  "ui.home.lead": "Prof Richard Xu's lecture notes — from probability and optimization to deep learning, ML theory and modern architectures — rebuilt as interactive study companions with live math, hands-on labs, and the original PDFs one click away.",
  "ui.home.cta": "Start with the Transformer →",
  "ui.home.modules": "modules",
  "ui.home.inproduction": "in production",
  "ui.home.mysubject": "My subject",
  "ui.home.mysubjectHint": "tick modules to build your own subject",
  "ui.home.onlymine": "show only my picks",
  "ui.home.footer": "Notes, mathematics and course design by Prof Richard Xu (徐亦达). Interactive companions built from the original LaTeX sources.",
  "ui.status.live": "Live",
  "ui.status.pilot": "In production",
  "ui.status.planned": "Coming soon",
  "ui.module.allmodules": "All modules",
  "ui.stub.pilot": "This module is being built right now — the LaTeX notes have been proofread and the interactive companion is in production. Check back soon.",
  "ui.stub.planned": "This module is on the roadmap. It will be built from the lecture notes below, in the same interactive style as the live modules.",
  "ui.stub.source": "Source lecture notes",
  "ui.stub.trylive": "Try a live module: the Transformer →",

  // ── Nav (chapter + sub labels) ────────────────────────────────────────────
  "nav.dpa": "Dot-Product Attention",
  "nav.mha": "Multi-Head Attention",
  "nav.model": "The Full Model",
  "nav.kvcache": "Cross-Attn & KV Cache",
  "nav.mla": "Latent Attention (MLA)",
  "nav.rope": "Rotary Embeddings",
  "nav.indexer": "Lightning Indexer",
  "nav.flash": "FlashAttention",
  "nav.mhc": "Hyper-Connections",
  "nav.distill": "Knowledge Distillation",

  "sub.dpa-single": "Single query",
  "sub.dpa-sdpa": "Scaling √dₖ",
  "sub.dpa-seq2seq": "seq2seq origins",
  "sub.dpa-multi": "Many queries",
  "sub.mha-lab": "Attention Lab",
  "sub.mha-init": "The module",
  "sub.mha-forward": "forward() walkthrough",
  "sub.model-block": "Transformer block",
  "sub.model-lm": "Language model",
  "sub.model-gen": "Sampling",
  "sub.cross": "Cross-attention",
  "sub.kv": "KV cache",
  "sub.mla-absorb": "Absorption trick",
  "sub.rope-decoupled": "Decoupled RoPE",
  "sub.flash-attn": "Online attention",
  "sub.mhc-doubly": "Doubly stochastic",
  "sub.distill-token": "Token-level",
  "sub.distill-sent": "Sentence-level",

  // ── Ch.1 Dot-Product Attention ────────────────────────────────────────────
  "ch.dpa.title": "Dot-Product Attention",
  "ch.dpa.lead": "Attention is a soft, differentiable lookup: a query asks every key “how relevant are you?”, and the answer is a weighted average of the values.",
  "ch.dpa.h.single": "A single query",
  "ch.dpa.p1": "The mechanism from *“Attention Is All You Need”* (Vaswani et al., 2017) starts with one query row vector $\\q$, a stack of keys $\\K$, and a stack of values $\\V$. Every token is written as a **row**, a convention we keep throughout.",
  "ch.dpa.p2": "Dot the query against every key, softmax the scores into weights, and blend the values:",
  "ch.dpa.callout.key1": "The output is a **convex combination of value vectors**. The query never appears in the output directly — it only decides *how much* of each value to take.",
  "ch.dpa.h.sdpa": "Scaling: why the $\\sqrt{d_k}$?",
  "ch.dpa.p3": "As $d_k$ grows, the variance of $\\q\\k^\\top$ grows with it. Large logits make $\\exp(\\cdot)$ explode, so softmax becomes *peaky* — almost one-hot. Recall the cross-entropy gradient:",
  "ch.dpa.p4": "A saturated $\\mathbf p$ pushes most gradient entries to zero — the layer stops learning. The fix is to shrink the logits back down before the softmax:",
  "ch.dpa.callout.try": "In the **Attention Lab** below (Chapter 2), toggle “scale by 1/√dₖ” off and step to the softmax stage — watch a single cell in each row swallow all the weight.",
  "ch.dpa.callout.try.label": "Try it",
  "ch.dpa.h.seq2seq": "Where it came from: seq2seq",
  "ch.dpa.p5": "Attention predates the Transformer. In Bahdanau-style seq2seq, the decoder state is the query and the encoder states are *both* keys and values, producing a per-step **context vector**:",
  "ch.dpa.h.multi": "Many queries at once",
  "ch.dpa.p6": "Stack $n$ queries into a matrix $\\Q$ and the whole thing becomes two matmuls and a row-wise softmax. When $m=n$ (self-attention) the score matrix $\\Q\\K^\\top$ is square.",
  "ch.dpa.demo.flow.title": "Attention flow",
  "ch.dpa.demo.flow.sub": "Each query token fans weighted edges to the keys it attends to — causally.",

  // ── Ch.2 Multi-Head Self-Attention ────────────────────────────────────────
  "ch.mha.title": "Multi-Head Self-Attention",
  "ch.mha.lead": "Self-attention makes Q, K, V all functions of the same input X. Multiple heads let the model look for several kinds of relationship in parallel.",
  "ch.mha.p1": "Self-attention sets $\\Q=\\X\\W_Q,\\ \\K=\\X\\W_K,\\ \\V=\\X\\W_V$ with $m=n=T$. For $h$ heads we slice the model dimension into $h$ blocks of size $d_h$, run SDPA independently in each, then concatenate and mix:",
  "ch.mha.h.lab": "The Attention Lab",
  "ch.mha.p2": "Every step of scaled dot-product attention, on a real 4-token sequence. Step through the pipeline and flip the scaling / causal-mask switches to see exactly what each line of code does to the tensors.",
  "ch.mha.demo.lab.title": "Scaled Dot-Product Attention, step by step",
  "ch.mha.demo.lab.sub": "Q·Kᵀ → scale → mask → softmax → ·V",
  "ch.mha.h.init": "The module and its buffers",
  "ch.mha.p3": "One fused `nn.Linear` produces Q, K and V together, and a lower-triangular mask is precomputed once and broadcast over every batch and head.",
  "ch.mha.callout.why": "The two leading singleton axes exist purely to **broadcast** the same mask across the batch ($B$) and head ($h$) dimensions of the (B, h, T, T) score tensor. That is exactly what `unsqueeze` does — try it:",
  "ch.mha.callout.why.label": "Why (1, 1, T, T)?",
  "ch.mha.demo.unsq.title": "torch.unsqueeze",
  "ch.mha.demo.unsq.sub": "Insert a length-1 axis and watch the shape change.",
  "ch.mha.h.forward": "The forward pass, tensor by tensor",
  "ch.mha.p4": "1 — Project to a fused QKV, then split the channel axis into three equal pieces:",
  "ch.mha.p5": "2 — Reshape each of Q, K, V so every head is its own $(T, d_h)$ matrix:",
  "ch.mha.demo.heads.title": "Splitting the channel axis into heads",
  "ch.mha.demo.heads.sub": "view() regroups columns; transpose() makes each head independent.",
  "ch.mha.p6": "3 — Scores, scale, causal mask, softmax, then the value-weighted sum:",
  "ch.mha.p7": "4 — Merge the heads back together. `transpose` only relabels axes, so `contiguous()` must physically reorder memory before `view` can collapse $h\\times d_h$ back into $C$:",
  "ch.mha.callout.bug": "Skipping `.contiguous()` after a `transpose` raises a runtime error on `view`: the axes were swapped in metadata but the bytes never moved.",
  "ch.mha.callout.bug.label": "A classic bug",

  // ── Ch.3 Full Model ───────────────────────────────────────────────────────
  "ch.model.title": "From Block to Language Model",
  "ch.model.lead": "Wrap attention in a pre-norm residual block, stack it, add embeddings and an LM head — and you can sample text.",
  "ch.model.h.block": "The Transformer block",
  "ch.model.p1": "Pre-LayerNorm before each sub-layer, residual connections around both. The residual form $x = x + f(x)$ is what keeps gradients flowing through deep stacks.",
  "ch.model.callout.gelu": "$\\text{GELU}(x) = x\\,\\Phi(x)$ — the input scaled by the probability a standard normal falls below it. Smoother than ReLU, with gradient everywhere.",
  "ch.model.callout.gelu.label": "GELU",
  "ch.model.h.lm": "The language model",
  "ch.model.p2": "Token embeddings plus positional embeddings, a stack of blocks, a final norm, and a linear head to vocabulary logits. The positions are built with the same `unsqueeze(0)` broadcast trick:",
  "ch.model.callout.ce": "`F.cross_entropy` wants $(\\text{predictions}, \\text{classes})$, so the $(B,T,\\text{vocab})$ logits are flattened to $(B\\!\\cdot\\!T, \\text{vocab})$. This per-token loss is exactly the token-level objective we revisit under distillation.",
  "ch.model.h.gen": "Sampling",

  // ── Ch.4 Cross-Attention & KV Cache ───────────────────────────────────────
  "ch.kvcache.title": "Cross-Attention & the KV Cache",
  "ch.kvcache.lead": "Let K, V and Q come from different sources and you get cross-attention. Notice that generation only ever adds one row — and the KV cache falls out for free.",
  "ch.kvcache.h.cross": "Cross-attention",
  "ch.kvcache.p1": "Same math, different sources: keys and values come from one stream, queries from another. Text-to-image diffusion uses text as $\\K,\\V$ and image tokens as $\\Q$; a translation decoder attends from the target sequence into the encoded source.",
  "ch.kvcache.h.kv": "Why cache K and V",
  "ch.kvcache.p2": "Append a token during generation and the score matrix gains exactly one new row: the new query against every past key. No new column appears — the causal mask already zeroed the upper triangle. Forming that row needs all past $\\k$’s; turning it into an output needs all past $\\v$’s. So cache them.",
  "ch.kvcache.demo.title": "Generation adds one row at a time",
  "ch.kvcache.demo.sub": "Press “generate” and watch what actually needs recomputing.",

  // ── Ch.5 MLA ──────────────────────────────────────────────────────────────
  "ch.mla.title": "Multi-Head Latent Attention",
  "ch.mla.lead": "DeepSeek's trick: don't cache full K and V — cache a small shared latent, and up-project per head. The KV cache shrinks dramatically.",
  "ch.mla.p1": "Compress $\\X$ once into a shared low-rank latent, then let each head up-project it into its own keys and values:",
  "ch.mla.p2": "The latent is shared across *all* heads and by both K and V, so only $\\C_{KV}$ is cached instead of full per-head K/V. With $\\dm=7168$ the latent is just 576-dimensional.",
  "ch.mla.h.absorb": "The absorption trick",
  "ch.mla.p3": "Because matmuls associate, the query and up-projection matrices can be merged into one matrix computed once at inference:",
  "ch.mla.callout.confuse": "Merging $\\W_Q^{(i)}\\W_{\\uparrow K}^{(i)\\top}$ is a *parameter* optimization — it lives in memory always. It is **not** the KV cache. The cache stores the activation $\\C_{KV}$ across time steps.",
  "ch.mla.callout.confuse.label": "Common confusion",

  // ── Ch.6 RoPE ─────────────────────────────────────────────────────────────
  "ch.rope.title": "Rotary Position Embeddings",
  "ch.rope.lead": "Instead of adding a position vector, rotate each 2-D feature pair by an angle set by the token's position. Dot products then depend only on relative position.",
  "ch.rope.p1": "RoPE (Su et al., 2024) assigns each pair of features a frequency and rotates the pair by $t\\cdot\\text{freq}$ at position $t$. Low-index pairs spin fast, high-index pairs slowly — a smooth multi-scale clock.",
  "ch.rope.p2": "Each pair undergoes an ordinary 2-D rotation. The magic: the score between a rotated query at position $m$ and rotated key at position $n$ depends only on the gap $m-n$.",
  "ch.rope.demo.title": "Rotation carries relative position",
  "ch.rope.demo.sub": "Move both tokens together — the dot product is unchanged.",
  "ch.rope.h.decoupled": "Decoupled RoPE",
  "ch.rope.p3": "RoPE breaks MLA’s absorption trick — a position-dependent rotation can’t be folded into a single fixed matrix. DeepSeek’s fix splits each query/key into a large *non-RoPE* part (absorbed as before) and a small *RoPE* part of dimension $d_h^R$ that carries position. At inference you cache the latent $\\C_{KV}$ plus the tiny rotated key part.",

  // ── Ch.7 Lightning Indexer ────────────────────────────────────────────────
  "ch.indexer.title": "The Lightning Indexer",
  "ch.indexer.lead": "At long context you can't afford to attend to everything. A cheap ReLU-based scorer decides which past keys are worth the full attention.",
  "ch.indexer.p1": "DeepSeek’s lightning indexer scores each past key $s$ against the current query $t$ using a small number of index heads and a *ReLU* — not a softmax — for throughput:",
  "ch.indexer.p2": "There are $H_I = 64$ index heads (fewer than the main heads), the key $\\k_s^I$ is **shared across all index heads**, and $w_{t,j}^I$ is a learnable scalar. ReLU keeps it FP8-friendly.",
  "ch.indexer.callout.orth": "Low-precision values concentrate (e.g. $[0.01, 0.98, \\dots]$). An orthogonal $U$ preserves the dot product — $(U\\q)^\\top(U\\k)=\\q^\\top\\k$ — while spreading the values out so they quantize cleanly.",
  "ch.indexer.callout.orth.label": "Orthogonal projection",

  // ── Ch.8 FlashAttention ───────────────────────────────────────────────────
  "ch.flash.title": "FlashAttention & Online Softmax",
  "ch.flash.lead": "Softmax normally needs three passes over the logits. FlashAttention fuses them into one streaming pass — and never materializes the T×T attention matrix.",
  "ch.flash.p1": "The stable softmax makes three passes: find the max, sum the shifted exponentials, normalize. The **online** version keeps a running max and a running denominator, retro-correcting the denominator whenever the max jumps:",
  "ch.flash.demo.title": "Online softmax, one streaming pass",
  "ch.flash.demo.sub": "Step through the stream and watch the running max + denominator update.",
  "ch.flash.h.attn": "Online attention",
  "ch.flash.p2": "The same rescale trick carries the value-weighted output $\\o = \\sum_i a_i \\v_i$ online too, so the entire attention output is produced in a single fused loop:",
  "ch.flash.callout.key": "Never storing the $T\\times T$ scores is what makes attention *memory-linear* in sequence length — the whole point of FlashAttention.",

  // ── Ch.9 Hyper-Connections ────────────────────────────────────────────────
  "ch.mhc.title": "Manifold-Constrained Hyper-Connections",
  "ch.mhc.lead": "Generalize the single residual skip to several parallel streams that aggregate, transform, and re-mix — while keeping gradients stable.",
  "ch.mhc.p1": "With $n$ streams stacked into $\\X_l\\in\\mathbb{R}^{n\\times d}$, learned matrices aggregate them to one stream, run the (expensive) network once, expand back to $n$, and mix:",
  "ch.mhc.p2": "Setting every $\\mathbf H$ to the identity recovers the ordinary residual block $\\x_{l+1}=\\x_l+F_{W_l}(\\x_l)$ exactly.",
  "ch.mhc.h.doubly": "Why doubly stochastic",
  "ch.mhc.p3": "Unrolling replaces the gradient-preserving identity with a product $\\prod \\mathbf{H}^{\\text{res}}$. Forcing each $\\mathbf{H}^{\\text{res}}$ to be **doubly stochastic** (rows and columns sum to 1, spectral norm 1) keeps the product well-behaved — the product of two doubly stochastic matrices is again doubly stochastic. The Sinkhorn–Knopp algorithm enforces it.",

  // ── Ch.10 Knowledge Distillation ──────────────────────────────────────────
  "ch.distill.title": "Knowledge Distillation",
  "ch.distill.lead": "Train a small student to imitate a big teacher. Do you match the teacher token-by-token, or sentence-by-sentence? The choice changes everything.",
  "ch.distill.h.token": "Token-level",
  "ch.distill.p1": "At every position, match the teacher’s full vocabulary distribution given the ground-truth prefix. This is dense supervision carrying “dark knowledge” — which wrong tokens were nearly right:",
  "ch.distill.p2": "Ordinary cross-entropy is just the special case where the teacher $p$ is one-hot.",
  "ch.distill.h.sent": "Sentence-level",
  "ch.distill.p3": "Matching whole sentences is a sum over $|V|^T$ sequences — hopeless. So approximate the teacher by a point mass at its mode $\\hat y$ (found by beam search) and train with plain cross-entropy:",
  "ch.distill.p4": "The paper’s toy example ($V=\\{a,b\\},\\ T=2$) shows why **beam search, not greedy**: greedy locks onto the locally-best first token and misses the global mode.",
  "ch.distill.demo.title": "Greedy vs. beam search",
  "ch.distill.demo.sub": "Toggle the decoder and see which sentence each one commits to.",
  "ch.distill.callout.key": "Token-level = dense soft signal on the true prefix. Sentence-level = sparse hard signal on the teacher’s own output, which is easier to fit (it picks one mode of a multi-modal target) and matches how the student decodes at inference. In practice, combine them.",
};

// Compose { key: {en, zhHans, zhHant} } with English fallback for missing keys.
export const STRINGS = Object.fromEntries(
  Object.keys(EN).map((k) => [k, { en: EN[k], zhHans: ZH_HANS[k] ?? EN[k], zhHant: ZH_HANT[k] ?? EN[k] }])
);
