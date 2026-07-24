import { useState } from "react";
import { useT } from "../../i18n/LangContext.jsx";

// The notes' 1-D responsibility figure, live: two weighted Gaussians; slide the
// point x and watch p(l|x) renormalize. Mirrors Fig. "responsibilities".
const W = 520, H = 260;
const XMIN = -3.5, XMAX = 5.5;
const sx = (x) => ((x - XMIN) / (XMAX - XMIN)) * (W - 30) + 15;
const comp = [
  { alpha: 0.4, mu: 0, s2: 2, color: "#e11d48" },   // red: 0.4·N(0,2)
  { alpha: 0.6, mu: 3, s2: 0.5, color: "#2563eb" }, // blue: 0.6·N(3,0.5)
];
const pdf = (x, c) => (c.alpha / Math.sqrt(2 * Math.PI * c.s2)) * Math.exp(-((x - c.mu) ** 2) / (2 * c.s2));
const sy = (v) => H - 30 - v * 620;

export default function ResponsibilityDemo() {
  const t = useT();
  const [x, setX] = useState(1.6);
  const w = comp.map((c) => pdf(x, c));
  const s = w[0] + w[1];
  const r = w.map((v) => v / s);

  const curve = (c) =>
    Array.from({ length: 140 }, (_, i) => {
      const xx = XMIN + ((XMAX - XMIN) * i) / 139;
      return `${i ? "L" : "M"} ${sx(xx).toFixed(1)} ${sy(pdf(xx, c)).toFixed(1)}`;
    }).join(" ");

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="max-w-full rounded-xl border border-line bg-white" style={{ width: W }}>
        <line x1={10} y1={H - 30} x2={W - 10} y2={H - 30} stroke="#e2e8f0" />
        {comp.map((c, i) => (
          <path key={i} d={curve(c)} fill="none" stroke={c.color} strokeWidth={2} />
        ))}
        {/* stems at x */}
        {comp.map((c, i) => (
          <line key={"s" + i} x1={sx(x)} y1={H - 30} x2={sx(x)} y2={sy(pdf(x, c))} stroke={c.color} strokeWidth={3} opacity={0.85} />
        ))}
        <circle cx={sx(x)} cy={H - 30} r={5} fill="#0f172a" />
        <text x={sx(x) + 8} y={H - 12} fontSize={12.5} fontWeight={700} fill="#0f172a">x = {x.toFixed(2)}</text>
        <text x={sx(-2.6)} y={sy(pdf(0, comp[0])) - 8} fontSize={12} fill="#e11d48">α₁𝒩(0, 2)</text>
        <text x={sx(3.35)} y={sy(pdf(3, comp[1])) - 8} fontSize={12} fill="#2563eb">α₂𝒩(3, 0.5)</text>
      </svg>

      <div className="min-w-[220px]">
        <label className="mb-1 block text-[13px] font-medium text-muted">{t("em.resp.slider")}</label>
        <input type="range" min={-3} max={5} step={0.02} value={x} onChange={(e) => setX(+e.target.value)} className="w-full accent-indigo-600" />
        <div className="mt-4 space-y-2">
          {r.map((v, l) => (
            <div key={l}>
              <div className="mb-0.5 flex justify-between font-mono text-[12px]">
                <span style={{ color: comp[l].color }}>p(l={l + 1} | x, Θ)</span>
                <span className="font-bold text-ink">{v.toFixed(3)}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full transition-all duration-200" style={{ width: `${v * 100}%`, background: comp[l].color }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-[240px] text-[12.5px] leading-relaxed text-faint">{t("em.resp.caption")}</p>
      </div>
    </div>
  );
}
