import { useState } from "react";

// The paper's toy example: V={a,b}, T=2. Teacher conditionals give 4 sentence
// probabilities. Greedy takes the locally-best first token (a) and misses the
// global mode (ba). Sentence-level distillation trains on the beam-search mode.
const P1 = { a: 0.6, b: 0.4 };
const P2 = { a: { a: 0.5, b: 0.5 }, b: { a: 0.9, b: 0.1 } };
const LEAVES = [
  { seq: "aa", p: 0.6 * 0.5 },
  { seq: "ab", p: 0.6 * 0.5 },
  { seq: "ba", p: 0.4 * 0.9 },
  { seq: "bb", p: 0.4 * 0.1 },
];
const MODE = "ba";

export default function BeamSearchDemo() {
  const [mode, setMode] = useState("beam"); // "greedy" | "beam"
  const greedyFirst = P1.a >= P1.b ? "a" : "b";
  const greedySeq = greedyFirst + (P2[greedyFirst].a >= P2[greedyFirst].b ? "a" : "b");

  const isGreedy = mode === "greedy";
  const chosen = isGreedy ? greedySeq : MODE;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setMode("greedy")}
          className={"rounded-lg border px-3 py-1.5 text-[13px] font-medium " + (isGreedy ? "border-rose-400 bg-rose-50 text-rose-700" : "border-line bg-white text-muted")}>
          greedy decode
        </button>
        <button onClick={() => setMode("beam")}
          className={"rounded-lg border px-3 py-1.5 text-[13px] font-medium " + (!isGreedy ? "border-accent bg-indigo-50 text-accent" : "border-line bg-white text-muted")}>
          beam search (width 2)
        </button>
      </div>

      <svg viewBox="0 0 520 240" className="w-full max-w-[560px]">
        {/* root */}
        <circle cx={40} cy={120} r={16} fill="#0f172a" />
        <text x={40} y={124} textAnchor="middle" fontSize={11} fill="#fff">x</text>

        {/* level 1 nodes */}
        {["a", "b"].map((tok, i) => {
          const y = i === 0 ? 60 : 180;
          const onGreedyPath = isGreedy && tok === greedyFirst;
          const dim = isGreedy && tok !== greedyFirst;
          return (
            <g key={tok} opacity={dim ? 0.3 : 1}>
              <line x1={56} y1={120} x2={204} y2={y} stroke={onGreedyPath ? "#e11d48" : "#cbd5e1"} strokeWidth={onGreedyPath ? 3 : 1.5} />
              <text x={130} y={(120 + y) / 2 - 6} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#64748b">{P1[tok].toFixed(1)}</text>
              <circle cx={220} cy={y} r={16} fill={tok === "a" ? "#6366f1" : "#14b8a6"} />
              <text x={220} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">{tok}</text>
            </g>
          );
        })}

        {/* leaves */}
        {LEAVES.map((leaf, idx) => {
          const parent = leaf.seq[0];
          const py = parent === "a" ? 60 : 180;
          const y = 30 + idx * 60;
          const chosenLeaf = leaf.seq === chosen;
          const dim = isGreedy && leaf.seq[0] !== greedyFirst;
          return (
            <g key={leaf.seq} opacity={dim ? 0.25 : 1}>
              <line x1={236} y1={py} x2={404} y2={y} stroke={chosenLeaf ? (isGreedy ? "#e11d48" : "#4f46e5") : "#e2e8f0"} strokeWidth={chosenLeaf ? 3 : 1.5} />
              <rect x={404} y={y - 16} width={104} height={32} rx={8}
                fill={chosenLeaf ? (isGreedy ? "#fee2e2" : "#eef2ff") : "#f8fafc"}
                stroke={chosenLeaf ? (isGreedy ? "#e11d48" : "#4f46e5") : "#e2e8f0"} strokeWidth={chosenLeaf ? 2 : 1} />
              <text x={420} y={y + 4} fontSize={13} fontWeight={700} fontFamily="monospace" fill="#0f172a">{leaf.seq}</text>
              <text x={470} y={y + 4} fontSize={12} fontFamily="monospace" fill={leaf.seq === MODE ? "#4f46e5" : "#64748b"} fontWeight={leaf.seq === MODE ? 700 : 400}>
                {leaf.p.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className={"mt-4 rounded-xl border px-5 py-4 " + (isGreedy ? "border-rose-200 bg-rose-50/70" : "border-indigo-200 bg-indigo-50/60")}>
        {isGreedy ? (
          <p className="text-[14.5px] leading-relaxed text-ink/85">
            Greedy grabs <span className="font-mono font-semibold">a</span> first (0.6 &gt; 0.4) and is then stuck on{" "}
            <span className="font-mono font-semibold">{greedySeq}</span> at probability{" "}
            <span className="font-mono">0.30</span>. It never discovers that the weaker prefix{" "}
            <span className="font-mono">b</span> leads to the global mode.
          </p>
        ) : (
          <p className="text-[14.5px] leading-relaxed text-ink/85">
            Beam width 2 keeps <span className="font-mono">a</span> and <span className="font-mono">b</span>, expands both,
            and returns <span className="font-mono font-semibold text-accent">ba</span> at{" "}
            <span className="font-mono">0.36</span> — the true mode. Sentence-level distillation then trains the
            student with plain cross-entropy on <span className="font-mono">ŷ = ba</span>.
          </p>
        )}
      </div>
    </div>
  );
}
