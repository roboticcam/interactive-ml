import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

// Animated matrix multiplication C = A · B, drawn in the canonical layout:
//
//            [ B (k×n) ]
//   [ A (m×k) ] [ C (m×n) ]
//
// A playhead walks each output cell (i,j); it lights up row i of A and column j
// of B and accumulates the dot product term-by-term into C[i][j]. This makes the
// "row dot column → one output cell" structure of a matmul physically visible.

const CELL = 40;
const LBL = 30;

function fmt(v) {
  if (typeof v !== "number") return v;
  return (Math.round(v * 100) / 100).toFixed(2);
}

function heat(v, min, max) {
  if (max === min) return "rgba(79,70,229,0.14)";
  const a = Math.min(1, Math.abs(v) / Math.max(Math.abs(min), Math.abs(max), 1e-6));
  return v >= 0 ? `rgba(79,70,229,${0.12 + 0.6 * a})` : `rgba(225,29,72,${0.12 + 0.6 * a})`;
}

function matmul(A, B) {
  const m = A.length, k = A[0].length, n = B[0].length;
  const C = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += A[i][t] * B[t][j];
      C[i][j] = s;
    }
  return C;
}

function Matrix({ M, rowLabels, colLabels, stateOf, badge }) {
  return (
    <div>
      {badge ? <div className="mb-1 font-mono text-[11px] font-semibold text-faint">{badge}</div> : null}
      <div className="inline-flex flex-col">
        {colLabels ? (
          <div className="flex">
            {rowLabels ? <div style={{ width: LBL }} /> : null}
            {colLabels.map((c, ci) => (
              <div key={ci} style={{ width: CELL + 4 }} className="pb-1 text-center font-mono text-[10px] text-faint">{c}</div>
            ))}
          </div>
        ) : null}
        {M.map((row, ri) => (
          <div key={ri} className="flex items-center">
            {rowLabels ? (
              <div style={{ width: LBL }} className="pr-1 text-right font-mono text-[10px] text-faint">{rowLabels[ri]}</div>
            ) : null}
            {row.map((v, ci) => {
              const st = stateOf(ri, ci);
              return (
                <motion.div
                  key={ci}
                  animate={{ scale: st.pulse ? [1, 1.08, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: CELL, height: CELL, background: st.bg }}
                  className={"m-[2px] flex items-center justify-center rounded-md border text-[11px] font-medium tabular-nums transition-colors " + st.cls}
                >
                  {st.show ? fmt(v) : ""}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MatMulViz({
  A, B,
  aRowLabels, bColLabels,
  aBadge, bBadge, cBadge,
  caption,
  speed = 650,
}) {
  const C = useMemo(() => matmul(A, B), [A, B]);
  const m = A.length, k = A[0].length, n = B[0].length;
  const total = m * n * k;

  const [p, setP] = useState(0); // term-granular playhead in [0, total]
  const [playing, setPlaying] = useState(true);
  const timer = useRef();

  useEffect(() => { setP(0); setPlaying(true); }, [A, B]);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setP((prev) => {
        if (prev + 1 >= total) { setPlaying(false); return total; }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(timer.current);
  }, [playing, total, speed]);

  const done = p >= total;
  const activeCell = done ? m * n : Math.floor(p / k);
  const term = done ? 0 : p % k;
  const i = Math.floor(activeCell / n);
  const j = activeCell % n;

  const flat = C.flat();
  const min = Math.min(...flat), max = Math.max(...flat);

  const partial = useMemo(() => {
    if (done) return 0;
    let s = 0;
    for (let t = 0; t <= term; t++) s += A[i][t] * B[t][j];
    return s;
  }, [p, done]);

  // Per-matrix cell state.
  const stateA = (ri, ci) => {
    const inRow = !done && ri === i;
    const isTerm = inRow && ci === term;
    return {
      show: true,
      pulse: isTerm,
      bg: isTerm ? "rgba(79,70,229,0.22)" : inRow ? "rgba(79,70,229,0.08)" : "#fff",
      cls: isTerm ? "border-accent ring-2 ring-accent/50 text-ink" : inRow ? "border-indigo-200 text-ink" : "border-line text-ink/70",
    };
  };
  const stateB = (ri, ci) => {
    const inCol = !done && ci === j;
    const isTerm = inCol && ri === term;
    return {
      show: true,
      pulse: isTerm,
      bg: isTerm ? "rgba(13,148,136,0.22)" : inCol ? "rgba(13,148,136,0.08)" : "#fff",
      cls: isTerm ? "border-teal-500 ring-2 ring-teal-400/50 text-ink" : inCol ? "border-teal-200 text-ink" : "border-line text-ink/70",
    };
  };
  const stateC = (ri, ci) => {
    const idx = ri * n + ci;
    const completed = done || idx < activeCell;
    const active = !done && idx === activeCell;
    return {
      show: completed || active,
      pulse: active,
      bg: completed ? heat(C[ri][ci], min, max) : active ? "rgba(79,70,229,0.10)" : "#fff",
      cls: active
        ? "border-accent ring-2 ring-accent/60 text-accent font-semibold"
        : completed
        ? "border-line text-ink/80"
        : "border-dashed border-line text-transparent",
    };
  };

  // C needs a partial value in the active cell; substitute it in.
  const Cdisplay = C.map((row, ri) => row.map((v, ci) => (!done && ri * n + ci === activeCell ? partial : v)));

  return (
    <div>
      {/* controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setPlaying((x) => !x)} className="rounded-lg border border-accent bg-accent px-3 py-1.5 text-[13px] font-semibold text-white">
          {playing ? "❚❚ pause" : done ? "↻ replay" : "▶ play"}
        </button>
        <button onClick={() => { setP(Math.max(0, (activeCell - 1) * k)); setPlaying(false); }} className="rounded-md border border-line px-2.5 py-1 text-[13px] text-muted hover:border-accent">‹ cell</button>
        <button onClick={() => { setP(Math.min(total, (activeCell + 1) * k)); setPlaying(false); }} className="rounded-md border border-line px-2.5 py-1 text-[13px] text-muted hover:border-accent">cell ›</button>
        <button onClick={() => { setP(0); setPlaying(false); }} className="rounded-md border border-line px-2.5 py-1 text-[13px] text-muted hover:border-accent">reset</button>
        <span className="ml-1 text-[12.5px] text-faint">
          {done ? "complete" : `output cell (${i}, ${j}) · term ${term + 1}/${k}`}
        </span>
      </div>

      {/* canonical matmul grid */}
      <div className="inline-grid" style={{ gridTemplateColumns: "auto auto", gap: 18 }}>
        <div />
        <Matrix M={B} colLabels={bColLabels} stateOf={stateB} badge={bBadge} />
        <Matrix M={A} rowLabels={aRowLabels} stateOf={stateA} badge={aBadge} />
        <Matrix M={Cdisplay} stateOf={stateC} badge={cBadge} />
      </div>

      {/* live dot-product equation */}
      <div className="mt-4 rounded-xl border border-line bg-panel px-4 py-3 font-mono text-[13px]">
        {done ? (
          <span className="text-muted">All {m * n} output cells computed — each one a row · column dot product.</span>
        ) : (
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span className="text-faint">C[{i}][{j}]</span>
            <span className="text-faint">=</span>
            {Array.from({ length: k }, (_, t) => (
              <span key={t} className={"rounded px-1 " + (t < term ? "text-ink/60" : t === term ? "bg-indigo-100 font-semibold text-accent" : "text-faint/50")}>
                {t > 0 ? "+ " : ""}
                <span className="text-accent">{fmt(A[i][t])}</span>
                ·
                <span className="text-teal-600">{fmt(B[t][j])}</span>
              </span>
            ))}
            <span className="text-faint">=</span>
            <span className="font-semibold text-ink">{fmt(partial)}</span>
          </div>
        )}
      </div>
      {caption ? <p className="mt-3 text-[13.5px] text-muted">{caption}</p> : null}
    </div>
  );
}
