import { useState } from "react";

// Shows RoPE's core idea: rotate a 2-D feature pair by an angle proportional to
// token position. The dot product between a rotated query at position m and a
// rotated key at position n depends only on (m - n) — relative position.
const R = 96;
const CX = 120;
const CY = 120;
const THETA = 0.6; // radians per position step (exaggerated for visibility)

function vec(angleBase, pos) {
  const a = angleBase + pos * THETA;
  return { x: CX + R * Math.cos(a), y: CY - R * Math.sin(a), a };
}

function Arrow({ from, to, color, label }) {
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={3} markerEnd={`url(#arrow-${color.replace("#", "")})`} />
      <text x={to.x + (to.x > CX ? 6 : -6)} y={to.y - 6} fill={color} fontSize={13} fontWeight={700} textAnchor={to.x > CX ? "start" : "end"}>
        {label}
      </text>
    </g>
  );
}

export default function RoPEDemo() {
  const [m, setM] = useState(4); // query position
  const [n, setN] = useState(1); // key position
  const qBase = 0.35; // intrinsic query angle
  const kBase = 0.15; // intrinsic key angle
  const q = vec(qBase, m);
  const k = vec(kBase, n);
  const center = { x: CX, y: CY };
  // dot product of unit vectors = cos of angle between = cos((qBase-kBase)+(m-n)θ)
  const rel = qBase - kBase + (m - n) * THETA;
  const dot = Math.cos(rel);

  return (
    <div className="flex flex-wrap items-center gap-8">
      <svg width={240} height={240} className="shrink-0">
        <defs>
          {["4f46e5", "0d9488"].map((c) => (
            <marker key={c} id={`arrow-${c}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={`#${c}`} />
            </marker>
          ))}
        </defs>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeWidth={1.5} />
        <line x1={CX - R - 8} y1={CY} x2={CX + R + 8} y2={CY} stroke="#f1f5f9" strokeWidth={1} />
        <line x1={CX} y1={CY - R - 8} x2={CX} y2={CY + R + 8} stroke="#f1f5f9" strokeWidth={1} />
        {/* angle arc between vectors */}
        <path
          d={describeArc(CX, CY, 38, -(kBase + n * THETA), -(qBase + m * THETA))}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="3 3"
        />
        <Arrow from={center} to={q} color="#4f46e5" label={`q (pos ${m})`} />
        <Arrow from={center} to={k} color="#0d9488" label={`k (pos ${n})`} />
      </svg>

      <div className="min-w-[240px]">
        <label className="mb-1 block text-[13px] font-medium text-muted">query position m = {m}</label>
        <input type="range" min={0} max={8} value={m} onChange={(e) => setM(+e.target.value)} className="w-full accent-indigo-600" />
        <label className="mb-1 mt-4 block text-[13px] font-medium text-muted">key position n = {n}</label>
        <input type="range" min={0} max={8} value={n} onChange={(e) => setN(+e.target.value)} className="w-full accent-teal-600" />

        <div className="mt-5 rounded-xl border border-line bg-panel p-4">
          <div className="font-mono text-[13px] text-muted">
            relative offset <span className="font-semibold text-ink">m − n = {m - n}</span>
          </div>
          <div className="mt-1 font-mono text-[13px] text-muted">
            q̃·k̃ ∝ cos(θ·(m−n) + Δ) = <span className="font-semibold text-accent">{dot.toFixed(3)}</span>
          </div>
          <div className="mt-2 text-[12.5px] leading-relaxed text-faint">
            Slide both positions by the same amount — the score is unchanged. The dot product depends only
            on the <span className="font-semibold text-ink">gap</span> between tokens, never their absolute
            positions.
          </div>
        </div>
      </div>
    </div>
  );
}

// SVG arc helper (angles in radians, screen coords).
function describeArc(cx, cy, r, a0, a1) {
  const p0 = { x: cx + r * Math.cos(a0), y: cy + r * Math.sin(a0) };
  const p1 = { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) };
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} ${sweep} ${p1.x} ${p1.y}`;
}
