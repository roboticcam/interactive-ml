import { useState } from "react";
import { motion } from "framer-motion";
import Code from "../Code.jsx";
import { ShapePill } from "../ui.jsx";

// Visualizes reshape_heads: (B,T,C) --view--> (B,T,h,head_dim) --transpose--> (B,h,T,head_dim).
// We fix B=1, T=3, d_model=8, h=2, head_dim=4 and colour columns by head.
const T = 3;
const H = 2;
const HEAD_DIM = 4;
const D_MODEL = H * HEAD_DIM;
const TOKENS = ["x₁", "x₂", "x₃"];
const HEAD_COLORS = ["#4f46e5", "#0d9488"]; // indigo, teal

function Cell({ label, color, faded }) {
  return (
    <div
      className="m-[2px] flex h-9 w-11 items-center justify-center rounded-md border font-mono text-[11px]"
      style={{
        borderColor: color,
        background: color + (faded ? "14" : "22"),
        color: "#0f172a",
      }}
    >
      {label}
    </div>
  );
}

export default function SplitHeadsDemo() {
  const [split, setSplit] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setSplit(false)}
          className={"rounded-lg border px-3 py-1.5 text-[13px] font-medium " + (!split ? "border-accent bg-accent text-white" : "border-line bg-white text-muted")}
        >
          fused (B, T, C)
        </button>
        <span className="text-faint">→</span>
        <button
          onClick={() => setSplit(true)}
          className={"rounded-lg border px-3 py-1.5 text-[13px] font-medium " + (split ? "border-accent bg-accent text-white" : "border-line bg-white text-muted")}
        >
          per-head (B, h, T, head_dim)
        </button>
      </div>

      <Code label="reshape_heads">{`t.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)`}</Code>

      <div className="mt-4">
        {!split ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-[13px] text-faint">
              one matrix, heads interleaved along the channel axis <ShapePill>(T=3, C=8)</ShapePill>
            </div>
            {TOKENS.map((tok, r) => (
              <div key={r} className="flex items-center">
                <div className="w-8 pr-1 text-right font-mono text-[11px] text-faint">{tok}</div>
                {Array.from({ length: D_MODEL }, (_, c) => {
                  const head = Math.floor(c / HEAD_DIM);
                  return <Cell key={c} label={c} color={HEAD_COLORS[head]} />;
                })}
              </div>
            ))}
            <div className="mt-2 flex gap-6 pl-8 text-[12px]">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: HEAD_COLORS[0] }} /> head 0 = cols 0–3</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: HEAD_COLORS[1] }} /> head 1 = cols 4–7</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-8">
            {Array.from({ length: H }, (_, head) => (
              <motion.div key={head} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: head * 0.12 }}>
                <div className="mb-2 flex items-center gap-2 text-[13px]" style={{ color: HEAD_COLORS[head] }}>
                  <span className="font-semibold">head {head}</span> <ShapePill>(T=3, dₕ=4)</ShapePill>
                </div>
                {TOKENS.map((tok, r) => (
                  <div key={r} className="flex items-center">
                    <div className="w-8 pr-1 text-right font-mono text-[11px] text-faint">{tok}</div>
                    {Array.from({ length: HEAD_DIM }, (_, c) => (
                      <Cell key={c} label={head * HEAD_DIM + c} color={HEAD_COLORS[head]} />
                    ))}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-[14px] text-muted">
        <span className="font-semibold text-ink">view</span> reinterprets the flat channel axis as{" "}
        <span className="font-mono">(h, head_dim)</span> with no data movement;{" "}
        <span className="font-semibold text-ink">transpose(1, 2)</span> then swaps the head and time axes so
        every head is an independent <span className="font-mono">(T, head_dim)</span> matrix — ready for a
        batched <span className="font-mono">Q Kᵀ</span>.
      </p>
    </div>
  );
}
