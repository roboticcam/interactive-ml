import { useState } from "react";
import { motion } from "framer-motion";

// Illustrates why generation caches K and V: appending a token adds exactly ONE
// new row to the (masked) QKᵀ matrix — the new query against all past keys. No
// new column appears, because the causal mask zeros the upper triangle.
const TOKENS = ["The", "cat", "sat", "on", "the", "mat"];

export default function KVCacheDemo() {
  const [t, setT] = useState(3); // current sequence length

  const grow = () => setT((n) => Math.min(TOKENS.length, n + 1));
  const reset = () => setT(3);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <button onClick={grow} disabled={t >= TOKENS.length}
          className="rounded-lg border border-accent bg-accent px-3 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">
          + generate token
        </button>
        <button onClick={reset} className="rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] text-muted">reset</button>
        <span className="ml-2 font-mono text-[13px] text-faint">T = {t}</span>
      </div>

      <div className="flex flex-wrap items-start gap-8">
        <div>
          <div className="mb-2 text-[13px] text-faint">masked scores QKᵀ &nbsp;<span className="font-mono">(T × T)</span></div>
          <div className="inline-flex flex-col">
            {/* column header */}
            <div className="flex">
              <div className="w-10" />
              {TOKENS.slice(0, t).map((tok, j) => (
                <div key={j} className="w-11 pb-1 text-center font-mono text-[10px] text-faint">{tok}</div>
              ))}
            </div>
            {TOKENS.slice(0, t).map((tok, i) => {
              const isNew = i === t - 1;
              return (
                <motion.div key={i} className="flex items-center"
                  initial={isNew ? { opacity: 0, x: -12 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                  <div className="w-10 pr-1 text-right font-mono text-[10px] text-faint">{tok}</div>
                  {TOKENS.slice(0, t).map((_, j) => {
                    const masked = j > i;
                    return (
                      <div key={j}
                        className={"m-[2px] flex h-9 w-9 items-center justify-center rounded-md border text-[10px] font-mono " +
                          (masked ? "border-slate-200 bg-slate-100 text-slate-300"
                            : isNew ? "border-accent bg-indigo-100 text-accent ring-2 ring-accent/40"
                            : "border-line bg-indigo-50/60 text-ink/70")}>
                        {masked ? "" : `q${i}k${j}`}
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="max-w-xs">
          <div className="rounded-xl border border-line bg-panel p-4 text-[14px] leading-relaxed text-muted">
            The new token contributes just the <span className="font-semibold text-accent">highlighted bottom row</span>:
            its query <span className="font-mono">q{t - 1}</span> against <em>every</em> past key. To form that row
            you need all previous <span className="font-mono">k</span>’s; to turn the row into an output you need all
            previous <span className="font-mono">v</span>’s.
            <div className="mt-3 rounded-lg bg-white px-3 py-2 font-mono text-[12.5px] text-ink">
              cache K, V → recompute nothing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
