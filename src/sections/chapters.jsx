import { Chapter, Sub } from "../components/Section.jsx";
import { Prose, Callout, DemoCard, ShapePill } from "../components/ui.jsx";
import Code, { C } from "../components/Code.jsx";
import { M, MB } from "../components/Math.jsx";

import AttentionFlow from "../components/anim/AttentionFlow.jsx";
import UnsqueezeDemo from "../components/demos/UnsqueezeDemo.jsx";
import AttentionLab from "../components/demos/AttentionLab.jsx";
import SplitHeadsDemo from "../components/demos/SplitHeadsDemo.jsx";
import RoPEDemo from "../components/demos/RoPEDemo.jsx";
import OnlineSoftmaxDemo from "../components/demos/OnlineSoftmaxDemo.jsx";
import KVCacheDemo from "../components/demos/KVCacheDemo.jsx";
import BeamSearchDemo from "../components/demos/BeamSearchDemo.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 1 — Dot-Product Attention
function DPA() {
  return (
    <Chapter id="dpa" num={1} title="Dot-Product Attention" paper={{ sec: "1", page: 2 }} lead="Attention is a soft, differentiable lookup: a query asks every key “how relevant are you?”, and the answer is a weighted average of the values.">
      <Sub id="dpa-single" kicker="1.1">A single query</Sub>
      <Prose>
        The mechanism from <em>“Attention Is All You Need”</em> (Vaswani et al., 2017) starts with one query row
        vector <M>{"\\q"}</M>, a stack of keys <M>{"\\K"}</M>, and a stack of values <M>{"\\V"}</M>. Every token
        is written as a <strong>row</strong>, a convention we keep throughout.
      </Prose>
      <MB>{"\\q \\in \\mathbb{R}^{1\\times d_k}, \\quad \\K \\in \\mathbb{R}^{m\\times d_k}, \\quad \\V \\in \\mathbb{R}^{m\\times d_v}"}</MB>
      <Prose>
        Dot the query against every key, softmax the scores into weights, and blend the values:
      </Prose>
      <MB>{"A(\\q,\\K,\\V) \\equiv \\sm(\\q\\K^\\top)\\,\\V = \\sum_{i=1}^m \\underbrace{\\frac{\\exp[\\q\\k_i^\\top]}{\\sum_j \\exp[\\q\\k_j^\\top]}}_{a_i}\\,\\v_i \\;\\in \\mathbb{R}^{d_v}"}</MB>
      <Callout kind="key">
        The output is a <strong>convex combination of value vectors</strong>. The query never appears in the
        output directly — it only decides <em>how much</em> of each value to take.
      </Callout>

      <Sub id="dpa-sdpa" kicker="1.2">Scaling: why the <M>{"\\sqrt{d_k}"}</M>?</Sub>
      <Prose>
        As <M>{"d_k"}</M> grows, the variance of <M>{"\\q\\k^\\top"}</M> grows with it. Large logits make{" "}
        <M>{"\\exp(\\cdot)"}</M> explode, so softmax becomes <em>peaky</em> — almost one-hot. Recall the
        cross-entropy gradient:
      </Prose>
      <MB>{"\\frac{\\partial \\mathcal{C}(\\mathbf z)}{\\partial \\mathbf z} = (\\mathbf p - \\mathbf y)"}</MB>
      <Prose>
        A saturated <M>{"\\mathbf p"}</M> pushes most gradient entries to zero — the layer stops learning. The fix
        is to shrink the logits back down before the softmax:
      </Prose>
      <MB>{"A(\\Q,\\K,\\V) = \\sm\\!\\left(\\frac{\\Q\\K^\\top}{\\sqrt{d_k}}\\right)\\V"}</MB>
      <Callout kind="note" title="Try it">
        In the <strong>Attention Lab</strong> below (Chapter 2), toggle “scale by 1/√dₖ” off and step to the
        softmax stage — watch a single cell in each row swallow all the weight.
      </Callout>

      <Sub id="dpa-seq2seq" kicker="1.3">Where it came from: seq2seq</Sub>
      <Prose>
        Attention predates the Transformer. In Bahdanau-style seq2seq, the decoder state is the query and the
        encoder states are <em>both</em> keys and values, producing a per-step <strong>context vector</strong>:
      </Prose>
      <MB>{"\\q \\equiv \\h_i,\\quad \\k_i = \\v_i = \\z_i \\;\\Rightarrow\\; A(\\h_i, \\Z, \\Z) = c_i"}</MB>

      <Sub id="dpa-multi" kicker="1.4">Many queries at once</Sub>
      <Prose>
        Stack <M>{"n"}</M> queries into a matrix <M>{"\\Q"}</M> and the whole thing becomes two matmuls and a
        row-wise softmax. When <M>{"m=n"}</M> (self-attention) the score matrix <M>{"\\Q\\K^\\top"}</M> is square.
      </Prose>
      <MB>{"\\O = \\sm(\\Q\\K^\\top)\\V = \\A\\V \\in \\mathbb{R}^{n\\times d_v}"}</MB>

      <DemoCard title="Attention flow" subtitle="Each query token fans weighted edges to the keys it attends to — causally.">
        <AttentionFlow />
      </DemoCard>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 2 — Multi-Head Self-Attention
function MHA() {
  return (
    <Chapter id="mha" num={2} title="Multi-Head Self-Attention" paper={{ sec: "2", page: 4 }} lead="Self-attention makes Q, K, V all functions of the same input X. Multiple heads let the model look for several kinds of relationship in parallel.">
      <Prose>
        Self-attention sets <M>{"\\Q=\\X\\W_Q,\\ \\K=\\X\\W_K,\\ \\V=\\X\\W_V"}</M> with <M>{"m=n=T"}</M>. For{" "}
        <M>{"h"}</M> heads we slice the model dimension into <M>{"h"}</M> blocks of size <M>{"d_h"}</M>, run SDPA
        independently in each, then concatenate and mix:
      </Prose>
      <MB>{"\\Y = \\underbrace{\\text{concat}(\\O_1,\\dots,\\O_h)}_{T\\times \\dm}\\,\\underbrace{\\W_O}_{\\dm\\times \\dm}, \\qquad d_h\\times h = \\dm"}</MB>

      <Sub id="mha-lab" kicker="2.1">The Attention Lab</Sub>
      <Prose>
        Every step of scaled dot-product attention, on a real 4-token sequence. Step through the pipeline and
        flip the scaling / causal-mask switches to see exactly what each line of code does to the tensors.
      </Prose>
      <DemoCard title="Scaled Dot-Product Attention, step by step" subtitle="Q·Kᵀ → scale → mask → softmax → ·V">
        <AttentionLab />
      </DemoCard>

      <Sub id="mha-init" kicker="2.2">The module and its buffers</Sub>
      <Prose>
        One fused <C>nn.Linear</C> produces Q, K and V together, and a lower-triangular mask is precomputed once
        and broadcast over every batch and head.
      </Prose>
      <Code label="CausalSelfAttention.__init__">{`def __init__(self, d_model: int, n_heads: int, dropout: float, max_seq_len: int):
    super().__init__()
    assert d_model % n_heads == 0
    self.n_heads = n_heads
    self.head_dim = d_model // n_heads      # per-head dimensionality

    # One projection produces query, key and value in a single matmul
    self.qkv = nn.Linear(d_model, 3 * d_model)
    self.proj = nn.Linear(d_model, d_model) # after concatenating heads
    self.attn_dropout = nn.Dropout(dropout)
    self.resid_dropout = nn.Dropout(dropout)`}</Code>
      <Code label="causal mask (1, 1, T, T)">{`mask = torch.tril(torch.ones(max_seq_len, max_seq_len))
mask = mask.view(1, 1, max_seq_len, max_seq_len)`}</Code>

      <Callout kind="note" title="Why (1, 1, T, T)?">
        The two leading singleton axes exist purely to <strong>broadcast</strong> the same mask across the batch
        (<M>{"B"}</M>) and head (<M>{"h"}</M>) dimensions of the <ShapePill>(B, h, T, T)</ShapePill> score tensor.
        That is exactly what <C>unsqueeze</C> does — try it:
      </Callout>
      <DemoCard title="torch.unsqueeze" subtitle="Insert a length-1 axis and watch the shape change." tone="accent">
        <UnsqueezeDemo />
      </DemoCard>

      <Sub id="mha-forward" kicker="2.3">The forward pass, tensor by tensor</Sub>
      <Prose>
        1 — Project to a fused QKV, then split the channel axis into three equal pieces:
      </Prose>
      <Code label="forward() · project">{`B, T, C = x.size()             # batch, time, channels
qkv = self.qkv(x)              # (B, T, 3C)
q, k, v = qkv.split(C, dim=2)  # each (B, T, C)`}</Code>
      <Prose>2 — Reshape each of Q, K, V so every head is its own <M>{"(T, d_h)"}</M> matrix:</Prose>
      <Code label="forward() · split heads">{`def reshape_heads(t):
    # (B, T, C) -> (B, n_heads, T, head_dim)
    return t.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)

q = reshape_heads(q); k = reshape_heads(k); v = reshape_heads(v)`}</Code>
      <DemoCard title="Splitting the channel axis into heads" subtitle="view() regroups columns; transpose() makes each head independent.">
        <SplitHeadsDemo />
      </DemoCard>
      <Prose>3 — Scores, scale, causal mask, softmax, then the value-weighted sum:</Prose>
      <Code label="forward() · attention">{`att = q @ k.transpose(-2, -1)                    # (B, h, T, T)
att = att / (self.head_dim ** 0.5)               # scale
att = att.masked_fill(self.mask[:, :, :T, :T] == 0, float('-inf'))
att = F.softmax(att, dim=-1)
att = self.attn_dropout(att)
y = att @ v                                      # (B, h, T, head_dim)`}</Code>
      <Prose>
        4 — Merge the heads back together. <C>transpose</C> only relabels axes, so <C>contiguous()</C> must
        physically reorder memory before <C>view</C> can collapse <M>{"h\\times d_h"}</M> back into{" "}
        <M>{"C"}</M>:
      </Prose>
      <Code label="forward() · merge + project">{`y = y.transpose(1, 2).contiguous().view(B, T, C)  # concat heads
y = self.resid_dropout(self.proj(y))
return y`}</Code>
      <Callout kind="warn" title="A classic bug">
        Skipping <C>.contiguous()</C> after a <C>transpose</C> raises a runtime error on <C>view</C>: the axes
        were swapped in metadata but the bytes never moved.
      </Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 3 — The Full Model
function FullModel() {
  return (
    <Chapter id="model" num={3} title="From Block to Language Model" paper={{ sec: "2.1.3", page: 10 }} lead="Wrap attention in a pre-norm residual block, stack it, add embeddings and an LM head — and you can sample text.">
      <Sub id="model-block" kicker="3.1">The Transformer block</Sub>
      <Prose>
        Pre-LayerNorm before each sub-layer, residual connections around both. The residual form{" "}
        <M>{"x = x + f(x)"}</M> is what keeps gradients flowing through deep stacks.
      </Prose>
      <Code label="TransformerBlock">{`class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, d_ff, dropout, max_seq_len):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = CausalSelfAttention(d_model, n_heads, dropout, max_seq_len)
        self.ln2 = nn.LayerNorm(d_model)
        self.mlp = nn.Sequential(
            nn.Linear(d_model, d_ff), nn.GELU(), nn.Dropout(dropout),
            nn.Linear(d_ff, d_model), nn.Dropout(dropout),
        )
    def forward(self, x):
        x = x + self.attn(self.ln1(x))   # attention sub-layer + residual
        x = x + self.mlp(self.ln2(x))    # MLP sub-layer + residual
        return x`}</Code>
      <Callout kind="note" title="GELU">
        <M>{"\\text{GELU}(x) = x\\,\\Phi(x)"}</M> — the input scaled by the probability a standard normal falls
        below it. Smoother than ReLU, with gradient everywhere.
      </Callout>

      <Sub id="model-lm" kicker="3.2">The language model</Sub>
      <Prose>
        Token embeddings plus positional embeddings, a stack of blocks, a final norm, and a linear head to
        vocabulary logits. The positions are built with the same <C>unsqueeze(0)</C> broadcast trick:
      </Prose>
      <Code label="TransformerLM.forward (core)">{`pos = torch.arange(0, T, device=idx.device).unsqueeze(0)  # (1, T)
x = self.token_emb(idx) + self.pos_emb(pos)               # broadcast over batch
x = self.drop(x)
for blk in self.blocks:
    x = blk(x)
logits = self.lm_head(self.ln_f(x))                       # (B, T, vocab)
if targets is not None:
    loss = F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1))`}</Code>
      <Callout kind="key">
        <C>F.cross_entropy</C> wants <M>{"(\\text{predictions}, \\text{classes})"}</M>, so the{" "}
        <M>{"(B,T,\\text{vocab})"}</M> logits are flattened to <M>{"(B\\!\\cdot\\!T, \\text{vocab})"}</M>. This
        per-token loss is exactly the token-level objective we revisit under distillation.
      </Callout>

      <Sub id="model-gen" kicker="3.3">Sampling</Sub>
      <Code label="generate()">{`@torch.no_grad()
def generate(self, idx, max_new_tokens):
    for _ in range(max_new_tokens):
        idx_cond = idx[:, -self.config.max_seq_len:]   # crop to context window
        logits, _ = self(idx_cond)
        logits = logits[:, -1, :]                      # last position only
        probs = F.softmax(logits, dim=-1)
        next_id = torch.multinomial(probs, num_samples=1)  # stochastic, not greedy
        idx = torch.cat((idx, next_id), dim=1)
    return idx`}</Code>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 4 — Cross-Attention & KV Caching
function CrossKV() {
  return (
    <Chapter id="kvcache" num={4} title="Cross-Attention & the KV Cache" paper={{ sec: "3.1", page: 14 }} lead="Let K, V and Q come from different sources and you get cross-attention. Notice that generation only ever adds one row — and the KV cache falls out for free.">
      <Sub id="cross" kicker="4.1">Cross-attention</Sub>
      <Prose>
        Same math, different sources: keys and values come from one stream, queries from another. Text-to-image
        diffusion uses text as <M>{"\\K,\\V"}</M> and image tokens as <M>{"\\Q"}</M>; a translation decoder
        attends from the target sequence into the encoded source.
      </Prose>

      <Sub id="kv" kicker="4.2">Why cache K and V</Sub>
      <Prose>
        Append a token during generation and the score matrix gains exactly one new row: the new query against
        every past key. No new column appears — the causal mask already zeroed the upper triangle. Forming that
        row needs all past <M>{"\\k"}</M>’s; turning it into an output needs all past <M>{"\\v"}</M>’s. So cache
        them.
      </Prose>
      <DemoCard title="Generation adds one row at a time" subtitle="Press “generate” and watch what actually needs recomputing.">
        <KVCacheDemo />
      </DemoCard>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 5 — MLA
function MLA() {
  return (
    <Chapter id="mla" num={5} title="Multi-Head Latent Attention" paper={{ sec: "3.2", page: 15 }} lead="DeepSeek's trick: don't cache full K and V — cache a small shared latent, and up-project per head. The KV cache shrinks dramatically.">
      <Prose>
        Compress <M>{"\\X"}</M> once into a shared low-rank latent, then let each head up-project it into its own
        keys and values:
      </Prose>
      <MB>{"\\C_{KV} = \\X\\,\\W_{\\downarrow KV}\\in\\mathbb{R}^{T\\times 576}, \\quad \\K^{(i)} = \\C_{KV}\\W_{\\uparrow K}^{(i)},\\quad \\V^{(i)} = \\C_{KV}\\W_{\\uparrow V}^{(i)}"}</MB>
      <Prose>
        The latent is shared across <em>all</em> heads and by both K and V, so only <M>{"\\C_{KV}"}</M> is cached
        instead of full per-head K/V. With <M>{"\\dm=7168"}</M> the latent is just 576-dimensional.
      </Prose>
      <Sub id="mla-absorb" kicker="5.1">The absorption trick</Sub>
      <Prose>
        Because matmuls associate, the query and up-projection matrices can be merged into one matrix computed
        once at inference:
      </Prose>
      <MB>{"\\Q^{(i)}\\K^{(i)\\top} = \\X\\big(\\W_Q^{(i)}\\W_{\\uparrow K}^{(i)\\top}\\big)\\C_{KV}^\\top"}</MB>
      <Callout kind="warn" title="Common confusion">
        Merging <M>{"\\W_Q^{(i)}\\W_{\\uparrow K}^{(i)\\top}"}</M> is a <em>parameter</em> optimization — it lives
        in memory always. It is <strong>not</strong> the KV cache. The cache stores the activation{" "}
        <M>{"\\C_{KV}"}</M> across time steps.
      </Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 6 — RoPE
function RoPE() {
  return (
    <Chapter id="rope" num={6} title="Rotary Position Embeddings" paper={{ sec: "3.3", page: 18 }} lead="Instead of adding a position vector, rotate each 2-D feature pair by an angle set by the token's position. Dot products then depend only on relative position.">
      <Prose>
        RoPE (Su et al., 2024) assigns each pair of features a frequency and rotates the pair by{" "}
        <M>{"t\\cdot\\text{freq}"}</M> at position <M>{"t"}</M>. Low-index pairs spin fast, high-index pairs
        slowly — a smooth multi-scale clock.
      </Prose>
      <Code label="RotaryEmbedding.forward">{`i = torch.arange(0, self.head_dim, 2)
freqs = 1.0 / (self.rope_theta ** (i / self.head_dim))   # (head_dim/2,)
pos = torch.arange(x.shape[2])                           # (T,)
angles = torch.outer(pos, freqs)                         # (T, head_dim/2)
cos = torch.cos(angles).unsqueeze(0).unsqueeze(0)        # (1,1,T,hd/2)
sin = torch.sin(angles).unsqueeze(0).unsqueeze(0)
x_even, x_odd = x[..., 0::2], x[..., 1::2]
x_even_new = x_even * cos - x_odd * sin                  # 2-D rotation
x_odd_new  = x_even * sin + x_odd * cos
x_rot = torch.stack([x_even_new, x_odd_new], -1).flatten(-2, -1)`}</Code>
      <Prose>
        Each pair undergoes an ordinary 2-D rotation. The magic: the score between a rotated query at position{" "}
        <M>{"m"}</M> and rotated key at position <M>{"n"}</M> depends only on the gap <M>{"m-n"}</M>.
      </Prose>
      <DemoCard title="Rotation carries relative position" subtitle="Move both tokens together — the dot product is unchanged.">
        <RoPEDemo />
      </DemoCard>
      <Sub id="rope-decoupled" kicker="6.1" paper={{ sec: "3.4", page: 22 }}>Decoupled RoPE</Sub>
      <Prose>
        RoPE breaks MLA’s absorption trick — a position-dependent rotation can’t be folded into a single fixed
        matrix. DeepSeek’s fix splits each query/key into a large <em>non-RoPE</em> part (absorbed as before) and
        a small <em>RoPE</em> part of dimension <M>{"d_h^R"}</M> that carries position. At inference you cache the
        latent <M>{"\\C_{KV}"}</M> plus the tiny rotated key part.
      </Prose>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 7 — Lightning Indexer
function Indexer() {
  return (
    <Chapter id="indexer" num={7} title="The Lightning Indexer" paper={{ sec: "3.5", page: 24 }} lead="At long context you can't afford to attend to everything. A cheap ReLU-based scorer decides which past keys are worth the full attention.">
      <Prose>
        DeepSeek’s lightning indexer scores each past key <M>{"s"}</M> against the current query <M>{"t"}</M>
        using a small number of index heads and a <em>ReLU</em> — not a softmax — for throughput:
      </Prose>
      <MB>{"I_{t,s} = \\sum_{j=1}^{H_I} w_{t,j}^I\\cdot \\text{ReLU}\\big(\\q_{t,j}^I\\cdot \\k_s^I\\big)"}</MB>
      <Prose>
        There are <M>{"H_I = 64"}</M> index heads (fewer than the main heads), the key <M>{"\\k_s^I"}</M> is{" "}
        <strong>shared across all index heads</strong>, and <M>{"w_{t,j}^I"}</M> is a learnable scalar. ReLU keeps
        it FP8-friendly.
      </Prose>
      <Callout kind="note" title="Orthogonal projection">
        Low-precision values concentrate (e.g. <M>{"[0.01, 0.98, \\dots]"}</M>). An orthogonal <M>{"U"}</M>
        preserves the dot product — <M>{"(U\\q)^\\top(U\\k)=\\q^\\top\\k"}</M> — while spreading the values out so
        they quantize cleanly.
      </Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 8 — FlashAttention
function Flash() {
  return (
    <Chapter id="flash" num={8} title="FlashAttention & Online Softmax" paper={{ sec: "4", page: 25 }} lead="Softmax normally needs three passes over the logits. FlashAttention fuses them into one streaming pass — and never materializes the T×T attention matrix.">
      <Prose>
        The stable softmax makes three passes: find the max, sum the shifted exponentials, normalize. The{" "}
        <strong>online</strong> version keeps a running max and a running denominator, retro-correcting the
        denominator whenever the max jumps:
      </Prose>
      <MB>{"d_i = d_{i-1}\\,e^{\\,m_{i-1}-m_i} + e^{\\,x_i - m_i}"}</MB>
      <DemoCard title="Online softmax, one streaming pass" subtitle="Step through the stream and watch the running max + denominator update.">
        <OnlineSoftmaxDemo />
      </DemoCard>
      <Sub id="flash-attn" kicker="8.1" paper={{ sec: "4.3", page: 27 }}>Online attention</Sub>
      <Prose>
        The same rescale trick carries the value-weighted output <M>{"\\o = \\sum_i a_i \\v_i"}</M> online too, so
        the entire attention output is produced in a single fused loop:
      </Prose>
      <MB>{"\\o_i = \\o_{i-1}\\cdot\\frac{d_{i-1}}{d_i}\\,e^{\\,m_i-m_{i-1}} \\;+\\; \\frac{e^{\\,x_i-m_i}}{d_i}\\,\\v_i"}</MB>
      <Callout kind="key">
        Never storing the <M>{"T\\times T"}</M> scores is what makes attention <em>memory-linear</em> in sequence
        length — the whole point of FlashAttention.
      </Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 9 — Hyper-Connections
function HyperConn() {
  return (
    <Chapter id="mhc" num={9} title="Manifold-Constrained Hyper-Connections" paper={{ sec: "5", page: 29 }} lead="Generalize the single residual skip to several parallel streams that aggregate, transform, and re-mix — while keeping gradients stable.">
      <Prose>
        With <M>{"n"}</M> streams stacked into <M>{"\\X_l\\in\\mathbb{R}^{n\\times d}"}</M>, learned matrices
        aggregate them to one stream, run the (expensive) network once, expand back to <M>{"n"}</M>, and mix:
      </Prose>
      <MB>{"\\x_{l+1} = \\mathbf{H}_l^{\\text{res}}\\,\\x_l + \\mathbf{H}_l^{\\text{post}}\\,F_{W_l}\\!\\big(\\mathbf{H}_l^{\\text{pre}}\\,\\x_l\\big)"}</MB>
      <Prose>
        Setting every <M>{"\\mathbf H"}</M> to the identity recovers the ordinary residual block{" "}
        <M>{"\\x_{l+1}=\\x_l+F_{W_l}(\\x_l)"}</M> exactly.
      </Prose>
      <Sub id="mhc-doubly" kicker="9.1" paper={{ sec: "5.2", page: 32 }}>Why doubly stochastic</Sub>
      <Prose>
        Unrolling replaces the gradient-preserving identity with a product{" "}
        <M>{"\\prod \\mathbf{H}^{\\text{res}}"}</M>. Forcing each <M>{"\\mathbf{H}^{\\text{res}}"}</M> to be{" "}
        <strong>doubly stochastic</strong> (rows and columns sum to 1, spectral norm 1) keeps the product
        well-behaved — the product of two doubly stochastic matrices is again doubly stochastic. The
        Sinkhorn–Knopp algorithm enforces it.
      </Prose>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ch. 10 — Knowledge Distillation
function Distill() {
  return (
    <Chapter id="distill" num={10} title="Knowledge Distillation" paper={{ sec: "6", page: 34 }} lead="Train a small student to imitate a big teacher. Do you match the teacher token-by-token, or sentence-by-sentence? The choice changes everything.">
      <Sub id="distill-token" kicker="10.1">Token-level</Sub>
      <Prose>
        At every position, match the teacher’s full vocabulary distribution given the ground-truth prefix. This
        is dense supervision carrying “dark knowledge” — which wrong tokens were nearly right:
      </Prose>
      <MB>{"\\mathcal{L}_{\\text{tok}} = -\\sum_{t=1}^T\\sum_{k\\in V} p(y_t{=}k\\mid y_{<t},x)\\,\\log q(y_t{=}k\\mid y_{<t},x;\\theta)"}</MB>
      <Prose>Ordinary cross-entropy is just the special case where the teacher <M>{"p"}</M> is one-hot.</Prose>
      <Sub id="distill-sent" kicker="10.2" paper={{ sec: "6.3", page: 35 }}>Sentence-level</Sub>
      <Prose>
        Matching whole sentences is a sum over <M>{"|V|^T"}</M> sequences — hopeless. So approximate the teacher
        by a point mass at its mode <M>{"\\hat y"}</M> (found by beam search) and train with plain cross-entropy:
      </Prose>
      <MB>{"\\mathcal{L}_{\\text{sent}} \\approx -\\log q(\\hat y\\mid x;\\theta), \\qquad \\hat y \\approx \\arg\\max_y p(y\\mid x)"}</MB>
      <Prose>
        The paper’s toy example (<M>{"V=\\{a,b\\},\\ T=2"}</M>) shows why <strong>beam search, not greedy</strong>:
        greedy locks onto the locally-best first token and misses the global mode.
      </Prose>
      <DemoCard title="Greedy vs. beam search" subtitle="Toggle the decoder and see which sentence each one commits to.">
        <BeamSearchDemo />
      </DemoCard>
      <Callout kind="key">
        Token-level = dense soft signal on the true prefix. Sentence-level = sparse hard signal on the teacher’s
        own output, which is easier to fit (it picks one mode of a multi-modal target) and matches how the
        student decodes at inference. In practice, combine them.
      </Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ordered manifest — drives both rendering and the sidebar nav.
export const CHAPTERS = [
  { id: "dpa", num: 1, label: "Dot-Product Attention", Body: DPA,
    subs: [["dpa-single", "Single query"], ["dpa-sdpa", "Scaling √dₖ"], ["dpa-seq2seq", "seq2seq origins"], ["dpa-multi", "Many queries"]] },
  { id: "mha", num: 2, label: "Multi-Head Attention", Body: MHA,
    subs: [["mha-lab", "Attention Lab"], ["mha-init", "The module"], ["mha-forward", "forward() walkthrough"]] },
  { id: "model", num: 3, label: "The Full Model", Body: FullModel,
    subs: [["model-block", "Transformer block"], ["model-lm", "Language model"], ["model-gen", "Sampling"]] },
  { id: "kvcache", num: 4, label: "Cross-Attn & KV Cache", Body: CrossKV,
    subs: [["cross", "Cross-attention"], ["kv", "KV cache"]] },
  { id: "mla", num: 5, label: "Latent Attention (MLA)", Body: MLA,
    subs: [["mla-absorb", "Absorption trick"]] },
  { id: "rope", num: 6, label: "Rotary Embeddings", Body: RoPE,
    subs: [["rope-decoupled", "Decoupled RoPE"]] },
  { id: "indexer", num: 7, label: "Lightning Indexer", Body: Indexer, subs: [] },
  { id: "flash", num: 8, label: "FlashAttention", Body: Flash,
    subs: [["flash-attn", "Online attention"]] },
  { id: "mhc", num: 9, label: "Hyper-Connections", Body: HyperConn,
    subs: [["mhc-doubly", "Doubly stochastic"]] },
  { id: "distill", num: 10, label: "Knowledge Distillation", Body: Distill,
    subs: [["distill-token", "Token-level"], ["distill-sent", "Sentence-level"]] },
];
