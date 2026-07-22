import { useMemo, useState } from "react";
import TensorGrid from "../TensorGrid.jsx";
import MatMulViz from "../MatMulViz.jsx";
import Code from "../Code.jsx";
import { matmul, transpose, scale, softmaxRows, causalMask, round, seeded } from "../../lib/tensor.js";

const TOKENS = ["The", "cat", "sat", "on"];
const DK = 3;

const STEPS = [
  { key: "qkv", label: "1 · Inputs Q, K, V", code: "q, k, v = x @ Wq, x @ Wk, x @ Wv" },
  { key: "scores", label: "2 · Scores = Q Kᵀ", code: "att = q @ k.transpose(-2, -1)   # (T, T)" },
  { key: "scaled", label: "3 · Scale by 1/√dₖ", code: "att = att / (head_dim ** 0.5)" },
  { key: "masked", label: "4 · Causal mask", code: "att = att.masked_fill(mask == 0, float('-inf'))" },
  { key: "weights", label: "5 · Softmax", code: "att = F.softmax(att, dim=-1)   # rows sum to 1" },
  { key: "out", label: "6 · Output = A V", code: "out = att @ v   # (T, dᵥ)" },
];

export default function AttentionLab() {
  const [step, setStep] = useState(0);
  const [useScale, setUseScale] = useState(true);
  const [useMask, setUseMask] = useState(true);

  const model = useMemo(() => {
    const Q = seeded(TOKENS.length, DK, 3);
    const K = seeded(TOKENS.length, DK, 7);
    const V = seeded(TOKENS.length, DK, 11);
    const scores = matmul(Q, transpose(K));
    const scaled = useScale ? scale(scores, 1 / Math.sqrt(DK)) : scores.map((r) => r.slice());
    const masked = useMask ? causalMask(scaled) : scaled;
    const weights = softmaxRows(masked);
    const out = matmul(weights, V);
    return { Q, K, V, scores, scaled, masked, weights, out };
  }, [useScale, useMask]);

  const cur = STEPS[step].key;

  return (
    <div>
      {/* Step rail */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(i)}
            className={
              "rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition " +
              (i === step ? "border-accent bg-accent text-white" : "border-line bg-white text-muted hover:border-accent/50")
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-[13.5px] text-muted">
          <input type="checkbox" checked={useScale} onChange={(e) => setUseScale(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
          scale by 1/√dₖ
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-[13.5px] text-muted">
          <input type="checkbox" checked={useMask} onChange={(e) => setUseMask(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
          causal mask
        </label>
        <div className="flex gap-1">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="rounded-md border border-line px-2.5 py-1 text-[13px] text-muted hover:border-accent">‹ prev</button>
          <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="rounded-md border border-line px-2.5 py-1 text-[13px] text-muted hover:border-accent">next ›</button>
        </div>
      </div>

      <Code label="forward()">{STEPS[step].code}</Code>

      <div className="mt-5 min-h-[220px]">
        {cur === "qkv" && (
          <div className="flex flex-wrap gap-8">
            <TensorGrid matrix={round(model.Q)} rowLabels={TOKENS} scheme="diverging" dimBadge="Q  (T=4, dₖ=3)" />
            <TensorGrid matrix={round(model.K)} rowLabels={TOKENS} scheme="diverging" dimBadge="K  (T=4, dₖ=3)" />
            <TensorGrid matrix={round(model.V)} rowLabels={TOKENS} scheme="diverging" dimBadge="V  (T=4, dᵥ=3)" />
          </div>
        )}
        {cur === "scores" && (
          <MatMulViz
            key="scores"
            A={round(model.Q)}
            B={round(transpose(model.K))}
            aRowLabels={TOKENS}
            bColLabels={TOKENS}
            aBadge="Q  (T=4, dₖ=3)"
            bBadge="Kᵀ  (dₖ=3, T=4)"
            cBadge="scores = Q Kᵀ  (T, T)"
            caption="Each score is query row i dotted with key column j — how much token i matches token j. Press play to watch every cell fill."
          />
        )}
        {cur === "scaled" && (
          <TensorGrid matrix={round(model.scaled)} rowLabels={TOKENS} colLabels={TOKENS} scheme="diverging"
            dimBadge={"scores / √dₖ  " + (useScale ? "(÷ √3)" : "(scaling OFF)")}
            caption={useScale ? "Shrinking the logits keeps softmax from becoming razor-sharp." : "Toggle scaling on to see the logits shrink toward 0."} />
        )}
        {cur === "masked" && (
          <TensorGrid matrix={round(model.masked)} rowLabels={TOKENS} colLabels={TOKENS} scheme="diverging"
            dimBadge={"causal mask  " + (useMask ? "(upper triangle → −∞)" : "(mask OFF)")}
            caption={useMask ? "Position i may only see keys j ≤ i. Future positions are set to −∞." : "Without the mask, every token sees the whole sequence (encoder-style)."} />
        )}
        {cur === "weights" && (
          <TensorGrid matrix={round(model.weights)} rowLabels={TOKENS} colLabels={TOKENS} scheme="prob"
            dimBadge="attention weights A = softmax(scores)" caption="Each row is a probability distribution over keys — it sums to 1." />
        )}
        {cur === "out" && (
          <MatMulViz
            key="out"
            A={round(model.weights)}
            B={round(model.V)}
            aRowLabels={TOKENS}
            bColLabels={["0", "1", "2"]}
            aBadge="A  (T=4, T=4)"
            bBadge="V  (T=4, dᵥ=3)"
            cBadge="output = A V  (T, dᵥ)"
            caption="Each output row is a weighted blend of value rows — attention row i dotted with each value column. The weights (a probability row) mix the values."
          />
        )}
      </div>
    </div>
  );
}
