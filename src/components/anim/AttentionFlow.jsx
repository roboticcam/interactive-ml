import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { seeded, softmaxRows, matmul, transpose, causalMask, scale } from "../../lib/tensor.js";

// 3b1b-style flowing attention: pick a query token, watch weighted edges fan out
// to the (causally allowed) keys, thickness ∝ attention weight. Auto-sweeps.
const SENTENCE = ["The", "cat", "sat", "on", "the", "mat"];
const N = SENTENCE.length;
const DK = 4;

function computeWeights() {
  const Q = seeded(N, DK, 5);
  const K = seeded(N, DK, 9);
  const scores = scale(matmul(Q, transpose(K)), 1 / Math.sqrt(DK));
  return softmaxRows(causalMask(scores));
}

const WEIGHTS = computeWeights();
const W = 720;
const H = 210;
const TOP = 46;
const BOT = 168;

function xFor(i) {
  return (W / (N + 1)) * (i + 1);
}

export default function AttentionFlow() {
  const [q, setQ] = useState(N - 1);
  const [playing, setPlaying] = useState(true);
  const timer = useRef();

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => setQ((p) => (p + 1) % N), 1500);
    return () => clearInterval(timer.current);
  }, [playing]);

  const row = WEIGHTS[q];
  const maxW = Math.max(...row);

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted hover:border-accent"
        >
          {playing ? "❚❚ pause" : "▶ play"}
        </button>
        <span className="text-[13px] text-faint">query token — click a word below</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* query row (top) and key row (bottom) */}
        {SENTENCE.map((_, j) => {
          if (j > q) return null; // causal: no future keys
          const w = row[j];
          const t = w / maxW;
          return (
            <motion.path
              key={`${q}-${j}`}
              d={`M ${xFor(q)} ${TOP + 14} C ${xFor(q)} ${(TOP + BOT) / 2}, ${xFor(j)} ${(TOP + BOT) / 2}, ${xFor(j)} ${BOT - 14}`}
              stroke="#4f46e5"
              strokeWidth={1 + t * 9}
              strokeOpacity={0.15 + 0.6 * t}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: j * 0.05 }}
            />
          );
        })}

        {/* top: query tokens */}
        {SENTENCE.map((tok, i) => (
          <g key={"q" + i} className="cursor-pointer" onClick={() => { setPlaying(false); setQ(i); }}>
            <rect x={xFor(i) - 32} y={TOP - 16} width={64} height={30} rx={8}
              fill={i === q ? "#4f46e5" : "#eef2ff"} stroke={i === q ? "#4f46e5" : "#c7d2fe"} />
            <text x={xFor(i)} y={TOP + 4} textAnchor="middle" fontSize={14} fontWeight={600}
              fill={i === q ? "#ffffff" : "#4338ca"}>{tok}</text>
          </g>
        ))}

        {/* bottom: key tokens, opacity by weight */}
        {SENTENCE.map((tok, j) => {
          const allowed = j <= q;
          const t = allowed ? row[j] / maxW : 0;
          return (
            <g key={"k" + j}>
              <rect x={xFor(j) - 32} y={BOT - 16} width={64} height={30} rx={8}
                fill={allowed ? `rgba(13,148,136,${0.12 + 0.7 * t})` : "#f1f5f9"}
                stroke={allowed ? "#0d9488" : "#e2e8f0"} />
              <text x={xFor(j)} y={BOT + 4} textAnchor="middle" fontSize={14} fontWeight={600}
                fill={allowed ? "#0f172a" : "#cbd5e1"}>{tok}</text>
              {allowed && (
                <text x={xFor(j)} y={BOT + 30} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#0d9488">
                  {row[j].toFixed(2)}
                </text>
              )}
            </g>
          );
        })}

        <text x={12} y={TOP + 4} fontSize={11} fill="#94a3b8">query</text>
        <text x={12} y={BOT + 4} fontSize={11} fill="#94a3b8">keys</text>
      </svg>

      <AnimatePresence mode="wait">
        <motion.p
          key={q}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="mt-2 text-[14px] text-muted"
        >
          <span className="font-semibold text-ink">“{SENTENCE[q]}”</span> attends over positions 0–{q}
          {" "}(everything up to and including itself). Thicker edges carry more weight; future words are
          invisible to it.
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
