import { Chapter, Sub } from "../components/Section.jsx";
import { Prose, Callout, DemoCard } from "../components/ui.jsx";
import Code from "../components/Code.jsx";
import { MB } from "../components/Math.jsx";
import { Rich } from "../i18n/rich.jsx";
import { useT } from "../i18n/LangContext.jsx";

import AttentionFlow from "../components/anim/AttentionFlow.jsx";
import UnsqueezeDemo from "../components/demos/UnsqueezeDemo.jsx";
import AttentionLab from "../components/demos/AttentionLab.jsx";
import SplitHeadsDemo from "../components/demos/SplitHeadsDemo.jsx";
import RoPEDemo from "../components/demos/RoPEDemo.jsx";
import OnlineSoftmaxDemo from "../components/demos/OnlineSoftmaxDemo.jsx";
import KVCacheDemo from "../components/demos/KVCacheDemo.jsx";
import BeamSearchDemo from "../components/demos/BeamSearchDemo.jsx";

// Prose helper: renders a catalog key as a paragraph with inline markup.
const P = ({ t, k }) => <Prose><Rich>{t(k)}</Rich></Prose>;

// ─────────────────────────────────────────────────────────────────────────────
function DPA() {
  const t = useT();
  return (
    <Chapter id="dpa" num={1} title={t("ch.dpa.title")} paper={{ sec: "1", page: 2 }} lead={t("ch.dpa.lead")}>
      <Sub id="dpa-single" kicker="1.1">{t("ch.dpa.h.single")}</Sub>
      <P t={t} k="ch.dpa.p1" />
      <MB>{"\\q \\in \\mathbb{R}^{1\\times d_k}, \\quad \\K \\in \\mathbb{R}^{m\\times d_k}, \\quad \\V \\in \\mathbb{R}^{m\\times d_v}"}</MB>
      <P t={t} k="ch.dpa.p2" />
      <MB>{"A(\\q,\\K,\\V) \\equiv \\sm(\\q\\K^\\top)\\,\\V = \\sum_{i=1}^m \\underbrace{\\frac{\\exp[\\q\\k_i^\\top]}{\\sum_j \\exp[\\q\\k_j^\\top]}}_{a_i}\\,\\v_i \\;\\in \\mathbb{R}^{d_v}"}</MB>
      <Callout kind="key"><Rich>{t("ch.dpa.callout.key1")}</Rich></Callout>

      <Sub id="dpa-sdpa" kicker="1.2">{t("ch.dpa.h.sdpa")}</Sub>
      <P t={t} k="ch.dpa.p3" />
      <MB>{"\\frac{\\partial \\mathcal{C}(\\mathbf z)}{\\partial \\mathbf z} = (\\mathbf p - \\mathbf y)"}</MB>
      <P t={t} k="ch.dpa.p4" />
      <MB>{"A(\\Q,\\K,\\V) = \\sm\\!\\left(\\frac{\\Q\\K^\\top}{\\sqrt{d_k}}\\right)\\V"}</MB>
      <Callout kind="note" title={t("ch.dpa.callout.try.label")}><Rich>{t("ch.dpa.callout.try")}</Rich></Callout>

      <Sub id="dpa-seq2seq" kicker="1.3">{t("ch.dpa.h.seq2seq")}</Sub>
      <P t={t} k="ch.dpa.p5" />
      <MB>{"\\q \\equiv \\h_i,\\quad \\k_i = \\v_i = \\z_i \\;\\Rightarrow\\; A(\\h_i, \\Z, \\Z) = c_i"}</MB>

      <Sub id="dpa-multi" kicker="1.4">{t("ch.dpa.h.multi")}</Sub>
      <P t={t} k="ch.dpa.p6" />
      <MB>{"\\O = \\sm(\\Q\\K^\\top)\\V = \\A\\V \\in \\mathbb{R}^{n\\times d_v}"}</MB>

      <DemoCard title={t("ch.dpa.demo.flow.title")} subtitle={t("ch.dpa.demo.flow.sub")}>
        <AttentionFlow />
      </DemoCard>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function MHA() {
  const t = useT();
  return (
    <Chapter id="mha" num={2} title={t("ch.mha.title")} paper={{ sec: "2", page: 4 }} lead={t("ch.mha.lead")}>
      <P t={t} k="ch.mha.p1" />
      <MB>{"\\Y = \\underbrace{\\text{concat}(\\O_1,\\dots,\\O_h)}_{T\\times \\dm}\\,\\underbrace{\\W_O}_{\\dm\\times \\dm}, \\qquad d_h\\times h = \\dm"}</MB>

      <Sub id="mha-lab" kicker="2.1">{t("ch.mha.h.lab")}</Sub>
      <P t={t} k="ch.mha.p2" />
      <DemoCard title={t("ch.mha.demo.lab.title")} subtitle={t("ch.mha.demo.lab.sub")}>
        <AttentionLab />
      </DemoCard>

      <Sub id="mha-init" kicker="2.2">{t("ch.mha.h.init")}</Sub>
      <P t={t} k="ch.mha.p3" />
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
      <Callout kind="note" title={t("ch.mha.callout.why.label")}><Rich>{t("ch.mha.callout.why")}</Rich></Callout>
      <DemoCard title={t("ch.mha.demo.unsq.title")} subtitle={t("ch.mha.demo.unsq.sub")} tone="accent">
        <UnsqueezeDemo />
      </DemoCard>

      <Sub id="mha-forward" kicker="2.3">{t("ch.mha.h.forward")}</Sub>
      <P t={t} k="ch.mha.p4" />
      <Code label="forward() · project">{`B, T, C = x.size()             # batch, time, channels
qkv = self.qkv(x)              # (B, T, 3C)
q, k, v = qkv.split(C, dim=2)  # each (B, T, C)`}</Code>
      <P t={t} k="ch.mha.p5" />
      <Code label="forward() · split heads">{`def reshape_heads(t):
    # (B, T, C) -> (B, n_heads, T, head_dim)
    return t.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)

q = reshape_heads(q); k = reshape_heads(k); v = reshape_heads(v)`}</Code>
      <DemoCard title={t("ch.mha.demo.heads.title")} subtitle={t("ch.mha.demo.heads.sub")}>
        <SplitHeadsDemo />
      </DemoCard>
      <P t={t} k="ch.mha.p6" />
      <Code label="forward() · attention">{`att = q @ k.transpose(-2, -1)                    # (B, h, T, T)
att = att / (self.head_dim ** 0.5)               # scale
att = att.masked_fill(self.mask[:, :, :T, :T] == 0, float('-inf'))
att = F.softmax(att, dim=-1)
att = self.attn_dropout(att)
y = att @ v                                      # (B, h, T, head_dim)`}</Code>
      <P t={t} k="ch.mha.p7" />
      <Code label="forward() · merge + project">{`y = y.transpose(1, 2).contiguous().view(B, T, C)  # concat heads
y = self.resid_dropout(self.proj(y))
return y`}</Code>
      <Callout kind="warn" title={t("ch.mha.callout.bug.label")}><Rich>{t("ch.mha.callout.bug")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function FullModel() {
  const t = useT();
  return (
    <Chapter id="model" num={3} title={t("ch.model.title")} paper={{ sec: "2.1.3", page: 10 }} lead={t("ch.model.lead")}>
      <Sub id="model-block" kicker="3.1">{t("ch.model.h.block")}</Sub>
      <P t={t} k="ch.model.p1" />
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
      <Callout kind="note" title={t("ch.model.callout.gelu.label")}><Rich>{t("ch.model.callout.gelu")}</Rich></Callout>

      <Sub id="model-lm" kicker="3.2">{t("ch.model.h.lm")}</Sub>
      <P t={t} k="ch.model.p2" />
      <Code label="TransformerLM.forward (core)">{`pos = torch.arange(0, T, device=idx.device).unsqueeze(0)  # (1, T)
x = self.token_emb(idx) + self.pos_emb(pos)               # broadcast over batch
x = self.drop(x)
for blk in self.blocks:
    x = blk(x)
logits = self.lm_head(self.ln_f(x))                       # (B, T, vocab)
if targets is not None:
    loss = F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1))`}</Code>
      <Callout kind="key"><Rich>{t("ch.model.callout.ce")}</Rich></Callout>

      <Sub id="model-gen" kicker="3.3">{t("ch.model.h.gen")}</Sub>
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
function CrossKV() {
  const t = useT();
  return (
    <Chapter id="kvcache" num={4} title={t("ch.kvcache.title")} paper={{ sec: "3.1", page: 14 }} lead={t("ch.kvcache.lead")}>
      <Sub id="cross" kicker="4.1">{t("ch.kvcache.h.cross")}</Sub>
      <P t={t} k="ch.kvcache.p1" />
      <Sub id="kv" kicker="4.2">{t("ch.kvcache.h.kv")}</Sub>
      <P t={t} k="ch.kvcache.p2" />
      <DemoCard title={t("ch.kvcache.demo.title")} subtitle={t("ch.kvcache.demo.sub")}>
        <KVCacheDemo />
      </DemoCard>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function MLA() {
  const t = useT();
  return (
    <Chapter id="mla" num={5} title={t("ch.mla.title")} paper={{ sec: "3.2", page: 15 }} lead={t("ch.mla.lead")}>
      <P t={t} k="ch.mla.p1" />
      <MB>{"\\C_{KV} = \\X\\,\\W_{\\downarrow KV}\\in\\mathbb{R}^{T\\times 576}, \\quad \\K^{(i)} = \\C_{KV}\\W_{\\uparrow K}^{(i)},\\quad \\V^{(i)} = \\C_{KV}\\W_{\\uparrow V}^{(i)}"}</MB>
      <P t={t} k="ch.mla.p2" />
      <Sub id="mla-absorb" kicker="5.1">{t("ch.mla.h.absorb")}</Sub>
      <P t={t} k="ch.mla.p3" />
      <MB>{"\\Q^{(i)}\\K^{(i)\\top} = \\X\\big(\\W_Q^{(i)}\\W_{\\uparrow K}^{(i)\\top}\\big)\\C_{KV}^\\top"}</MB>
      <Callout kind="warn" title={t("ch.mla.callout.confuse.label")}><Rich>{t("ch.mla.callout.confuse")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function RoPE() {
  const t = useT();
  return (
    <Chapter id="rope" num={6} title={t("ch.rope.title")} paper={{ sec: "3.3", page: 18 }} lead={t("ch.rope.lead")}>
      <P t={t} k="ch.rope.p1" />
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
      <P t={t} k="ch.rope.p2" />
      <DemoCard title={t("ch.rope.demo.title")} subtitle={t("ch.rope.demo.sub")}>
        <RoPEDemo />
      </DemoCard>
      <Sub id="rope-decoupled" kicker="6.1" paper={{ sec: "3.4", page: 22 }}>{t("ch.rope.h.decoupled")}</Sub>
      <P t={t} k="ch.rope.p3" />
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Indexer() {
  const t = useT();
  return (
    <Chapter id="indexer" num={7} title={t("ch.indexer.title")} paper={{ sec: "3.5", page: 24 }} lead={t("ch.indexer.lead")}>
      <P t={t} k="ch.indexer.p1" />
      <MB>{"I_{t,s} = \\sum_{j=1}^{H_I} w_{t,j}^I\\cdot \\text{ReLU}\\big(\\q_{t,j}^I\\cdot \\k_s^I\\big)"}</MB>
      <P t={t} k="ch.indexer.p2" />
      <Callout kind="note" title={t("ch.indexer.callout.orth.label")}><Rich>{t("ch.indexer.callout.orth")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Flash() {
  const t = useT();
  return (
    <Chapter id="flash" num={8} title={t("ch.flash.title")} paper={{ sec: "4", page: 25 }} lead={t("ch.flash.lead")}>
      <P t={t} k="ch.flash.p1" />
      <MB>{"d_i = d_{i-1}\\,e^{\\,m_{i-1}-m_i} + e^{\\,x_i - m_i}"}</MB>
      <DemoCard title={t("ch.flash.demo.title")} subtitle={t("ch.flash.demo.sub")}>
        <OnlineSoftmaxDemo />
      </DemoCard>
      <Sub id="flash-attn" kicker="8.1" paper={{ sec: "4.3", page: 27 }}>{t("ch.flash.h.attn")}</Sub>
      <P t={t} k="ch.flash.p2" />
      <MB>{"\\o_i = \\o_{i-1}\\cdot\\frac{d_{i-1}}{d_i}\\,e^{\\,m_i-m_{i-1}} \\;+\\; \\frac{e^{\\,x_i-m_i}}{d_i}\\,\\v_i"}</MB>
      <Callout kind="key"><Rich>{t("ch.flash.callout.key")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function HyperConn() {
  const t = useT();
  return (
    <Chapter id="mhc" num={9} title={t("ch.mhc.title")} paper={{ sec: "5", page: 29 }} lead={t("ch.mhc.lead")}>
      <P t={t} k="ch.mhc.p1" />
      <MB>{"\\x_{l+1} = \\mathbf{H}_l^{\\text{res}}\\,\\x_l + \\mathbf{H}_l^{\\text{post}}\\,F_{W_l}\\!\\big(\\mathbf{H}_l^{\\text{pre}}\\,\\x_l\\big)"}</MB>
      <P t={t} k="ch.mhc.p2" />
      <Sub id="mhc-doubly" kicker="9.1" paper={{ sec: "5.2", page: 32 }}>{t("ch.mhc.h.doubly")}</Sub>
      <P t={t} k="ch.mhc.p3" />
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Distill() {
  const t = useT();
  return (
    <Chapter id="distill" num={10} title={t("ch.distill.title")} paper={{ sec: "6", page: 34 }} lead={t("ch.distill.lead")}>
      <Sub id="distill-token" kicker="10.1">{t("ch.distill.h.token")}</Sub>
      <P t={t} k="ch.distill.p1" />
      <MB>{"\\mathcal{L}_{\\text{tok}} = -\\sum_{t=1}^T\\sum_{k\\in V} p(y_t{=}k\\mid y_{<t},x)\\,\\log q(y_t{=}k\\mid y_{<t},x;\\theta)"}</MB>
      <P t={t} k="ch.distill.p2" />
      <Sub id="distill-sent" kicker="10.2" paper={{ sec: "6.3", page: 35 }}>{t("ch.distill.h.sent")}</Sub>
      <P t={t} k="ch.distill.p3" />
      <MB>{"\\mathcal{L}_{\\text{sent}} \\approx -\\log q(\\hat y\\mid x;\\theta), \\qquad \\hat y \\approx \\arg\\max_y p(y\\mid x)"}</MB>
      <P t={t} k="ch.distill.p4" />
      <DemoCard title={t("ch.distill.demo.title")} subtitle={t("ch.distill.demo.sub")}>
        <BeamSearchDemo />
      </DemoCard>
      <Callout kind="key"><Rich>{t("ch.distill.callout.key")}</Rich></Callout>
    </Chapter>
  );
}

// Ordered manifest — drives rendering and the sidebar nav. Labels come from the
// catalog (nav.<id> / sub.<sid>) at render time.
export const CHAPTERS = [
  { id: "dpa", num: 1, Body: DPA, subs: ["dpa-single", "dpa-sdpa", "dpa-seq2seq", "dpa-multi"] },
  { id: "mha", num: 2, Body: MHA, subs: ["mha-lab", "mha-init", "mha-forward"] },
  { id: "model", num: 3, Body: FullModel, subs: ["model-block", "model-lm", "model-gen"] },
  { id: "kvcache", num: 4, Body: CrossKV, subs: ["cross", "kv"] },
  { id: "mla", num: 5, Body: MLA, subs: ["mla-absorb"] },
  { id: "rope", num: 6, Body: RoPE, subs: ["rope-decoupled"] },
  { id: "indexer", num: 7, Body: Indexer, subs: [] },
  { id: "flash", num: 8, Body: Flash, subs: ["flash-attn"] },
  { id: "mhc", num: 9, Body: HyperConn, subs: ["mhc-doubly"] },
  { id: "distill", num: 10, Body: Distill, subs: ["distill-token", "distill-sent"] },
];
