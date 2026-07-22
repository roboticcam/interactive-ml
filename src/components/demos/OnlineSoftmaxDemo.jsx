import { useState } from "react";
import Code from "../Code.jsx";

// Streams the online-softmax fused loop from FlashAttention:
//   m_i = max(m_{i-1}, x_i)
//   d_i = d_{i-1} * exp(m_{i-1} - m_i) + exp(x_i - m_i)
// The user steps element-by-element and watches the running max + denominator
// (and the rescale factor that corrects the denominator when the max jumps).
const X = [1.0, 3.5, 2.0, 5.0, 4.0];

function trace(upto) {
  let m = -Infinity;
  let d = 0;
  const rows = [];
  for (let i = 0; i < upto; i++) {
    const xi = X[i];
    const mPrev = m;
    const dPrev = d;
    const mNew = Math.max(mPrev, xi);
    const rescale = mPrev === -Infinity ? 0 : Math.exp(mPrev - mNew);
    const dNew = dPrev * (mPrev === -Infinity ? 1 : Math.exp(mPrev - mNew)) + Math.exp(xi - mNew);
    rows.push({ i, xi, mPrev, mNew, dPrev, dNew, rescale, bumped: mNew > mPrev && mPrev !== -Infinity });
    m = mNew;
    d = dNew;
  }
  return rows;
}

export default function OnlineSoftmaxDemo() {
  const [step, setStep] = useState(1);
  const rows = trace(step);
  const last = rows[rows.length - 1];

  return (
    <div>
      <Code label="one fused pass">{`m = -inf; d = 0
for i in range(N):
    m_new = max(m, x[i])
    d = d * exp(m - m_new) + exp(x[i] - m_new)
    m = m_new`}</Code>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-[13px] text-muted">stream index i:</span>
        {X.map((x, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            className={
              "flex h-11 w-11 flex-col items-center justify-center rounded-lg border font-mono text-[12px] transition " +
              (i < step ? "border-accent bg-indigo-50 text-ink" : "border-line bg-white text-faint") +
              (i === step - 1 ? " ring-2 ring-accent/40" : "")
            }
          >
            <span className="text-[9px] text-faint">x{i}</span>
            {x.toFixed(1)}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto thin-scroll">
        <table className="min-w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-left text-faint">
              <th className="px-3 py-1.5 font-medium">i</th>
              <th className="px-3 py-1.5 font-medium">xᵢ</th>
              <th className="px-3 py-1.5 font-medium">running max mᵢ</th>
              <th className="px-3 py-1.5 font-medium">rescale e^(mₚᵣₑᵥ−mᵢ)</th>
              <th className="px-3 py-1.5 font-medium">denominator dᵢ</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {rows.map((r) => (
              <tr key={r.i} className={r.i === step - 1 ? "bg-indigo-50/70" : ""}>
                <td className="px-3 py-1.5">{r.i}</td>
                <td className="px-3 py-1.5">{r.xi.toFixed(1)}</td>
                <td className="px-3 py-1.5 font-semibold text-ink">
                  {r.mNew.toFixed(2)} {r.bumped && <span className="ml-1 text-[11px] font-normal text-rose-500">↑ new max</span>}
                </td>
                <td className={"px-3 py-1.5 " + (r.bumped ? "text-rose-500" : "text-faint")}>
                  {r.rescale ? r.rescale.toFixed(3) : "—"}
                </td>
                <td className="px-3 py-1.5 font-semibold text-accent">{r.dNew.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[14px] text-muted">
        When a new element beats the running max, every term accumulated so far was exponentiated against the{" "}
        <em>old</em> max. The factor{" "}
        <span className="font-mono text-rose-500">e^(m_prev − m_new)</span> retro-corrects the whole denominator
        in O(1) — so a single streaming pass yields the exact softmax, never storing all {X.length} logits.
        {last && (
          <span className="mt-2 block font-mono text-[13px] text-faint">
            after i={last.i}: m={last.mNew.toFixed(2)}, d={last.dNew.toFixed(3)}
          </span>
        )}
      </p>
    </div>
  );
}
