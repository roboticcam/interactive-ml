import { useState } from "react";
import { useT } from "../../i18n/LangContext.jsx";

// Jensen's inequality on φ(x) = −log x: the chord between (x₁,φ(x₁)) and
// (x₂,φ(x₂)) always sits above the curve. Drag t to slide along the chord.
const W = 460, H = 300;
const X0 = 0.28, X1 = 4.6; // domain
const sx = (x) => 40 + ((x - X0) / (X1 - X0)) * (W - 60);
const phi = (x) => -Math.log(x);
const sy = (v) => 40 + ((1.35 - v) / 2.75) * (H - 70);

export default function JensenDemo() {
  const t = useT();
  const [tt, setT] = useState(0.5);
  const [x1, setX1] = useState(0.55);
  const [x2, setX2] = useState(3.9);

  const xm = (1 - tt) * x1 + tt * x2;            // (1−t)x₁ + t x₂
  const chordY = (1 - tt) * phi(x1) + tt * phi(x2); // (1−t)φ(x₁) + tφ(x₂)
  const curveY = phi(xm);                        // φ((1−t)x₁ + t x₂)
  const gap = chordY - curveY;

  const curve = Array.from({ length: 120 }, (_, i) => {
    const x = X0 + ((X1 - X0) * i) / 119;
    return `${i ? "L" : "M"} ${sx(x).toFixed(1)} ${sy(phi(x)).toFixed(1)}`;
  }).join(" ");

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="max-w-full rounded-xl border border-line bg-white" style={{ width: W }}>
        <path d={curve} fill="none" stroke="#0f172a" strokeWidth={2} />
        {/* chord */}
        <line x1={sx(x1)} y1={sy(phi(x1))} x2={sx(x2)} y2={sy(phi(x2))} stroke="#4f46e5" strokeWidth={2} strokeDasharray="6 4" />
        {/* endpoints */}
        {[x1, x2].map((x, i) => (
          <circle key={i} cx={sx(x)} cy={sy(phi(x))} r={5} fill="#0f172a" />
        ))}
        {/* vertical gap */}
        <line x1={sx(xm)} y1={sy(chordY)} x2={sx(xm)} y2={sy(curveY)} stroke="#e11d48" strokeWidth={2} />
        <circle cx={sx(xm)} cy={sy(chordY)} r={5.5} fill="#4f46e5" />
        <circle cx={sx(xm)} cy={sy(curveY)} r={5.5} fill="#059669" />
        <text x={sx(xm) + 9} y={sy(chordY) - 6} fontSize={12} fontWeight={700} fill="#4f46e5">(1−t)φ(x₁)+tφ(x₂)</text>
        <text x={sx(xm) + 9} y={sy(curveY) + 16} fontSize={12} fontWeight={700} fill="#059669">φ((1−t)x₁+tx₂)</text>
        <text x={W - 105} y={sy(phi(X1)) - 10} fontSize={13} fill="#0f172a" fontStyle="italic">φ(x) = −log x</text>
      </svg>

      <div className="min-w-[220px]">
        <label className="mb-1 block text-[13px] font-medium text-muted">t = {tt.toFixed(2)}</label>
        <input type="range" min={0} max={1} step={0.01} value={tt} onChange={(e) => setT(+e.target.value)} className="w-full accent-indigo-600" />
        <label className="mb-1 mt-3 block text-[13px] font-medium text-muted">x₁ = {x1.toFixed(2)}</label>
        <input type="range" min={0.3} max={2} step={0.01} value={x1} onChange={(e) => setX1(+e.target.value)} className="w-full accent-indigo-600" />
        <label className="mb-1 mt-3 block text-[13px] font-medium text-muted">x₂ = {x2.toFixed(2)}</label>
        <input type="range" min={2.2} max={4.5} step={0.01} value={x2} onChange={(e) => setX2(+e.target.value)} className="w-full accent-indigo-600" />
        <div className="mt-4 rounded-xl border border-line bg-panel px-4 py-3 font-mono text-[13px]">
          <span className="text-indigo-600">{chordY.toFixed(3)}</span>
          <span className="mx-1 text-faint">−</span>
          <span className="text-emerald-600">{curveY.toFixed(3)}</span>
          <span className="mx-1 text-faint">=</span>
          <span className="font-bold text-rose-600">{gap.toFixed(3)} ≥ 0</span>
        </div>
        <p className="mt-2 max-w-[240px] text-[12.5px] leading-relaxed text-faint">{t("em.jensen.caption")}</p>
      </div>
    </div>
  );
}
