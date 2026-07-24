import { useMemo, useState } from "react";
import { cavi2dStep } from "../../lib/vb.js";
import { useT } from "../../i18n/LangContext.jsx";

// The notes' §6.3 "Python time": approximate a correlated 2-D Gaussian with
// q(z1)q(z2). CAVI finds the means, but the product family can never tilt —
// mean-field's blind spot, visible.
const W = 440, H = 340, CX = W / 2, CY = H / 2, S = 78;
const MU = [0, 0];

function ellipsePath(cx, cy, rx, ry, rot = 0, n = 64) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (2 * Math.PI * i) / n;
    const x = rx * Math.cos(a), y = ry * Math.sin(a);
    const xr = x * Math.cos(rot) - y * Math.sin(rot);
    const yr = x * Math.sin(rot) + y * Math.cos(rot);
    d += `${i ? "L" : "M"} ${(cx + xr * S).toFixed(1)} ${(cy - yr * S).toFixed(1)} `;
  }
  return d + "Z";
}

export default function MeanFieldEllipse() {
  const t = useT();
  const [rho, setRho] = useState(0.8);
  const [q, setQ] = useState({ m1: -1.4, m2: 1.2, v1: 1, v2: 1 });
  const [iter, setIter] = useState(0);

  const Sigma = useMemo(() => [[1, rho], [rho, 1]], [rho]);

  // True 2σ ellipse of N(0, Σ): eigen of [[1,ρ],[ρ,1]] → axes along ±45°.
  const truePath = useMemo(() => {
    const l1 = 1 + rho, l2 = 1 - rho;
    return ellipsePath(CX, CY, 1.4 * Math.sqrt(Math.max(l1, 1e-4)), 1.4 * Math.sqrt(Math.max(l2, 1e-4)), Math.PI / 4);
  }, [rho]);

  const qPath = useMemo(
    () => ellipsePath(CX + q.m1 * S, CY - q.m2 * S, 1.4 * Math.sqrt(Math.max(q.v1, 1e-4)), 1.4 * Math.sqrt(Math.max(q.v2, 1e-4)), 0),
    [q]
  );

  const step = () => { setQ((s) => cavi2dStep(s, MU, Sigma)); setIter((i) => i + 1); };
  const reset = () => { setQ({ m1: -1.4, m2: 1.2, v1: 1, v2: 1 }); setIter(0); };

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="max-w-full rounded-xl border border-line bg-white" style={{ width: W }}>
        <line x1={10} y1={CY} x2={W - 10} y2={CY} stroke="#f1f5f9" />
        <line x1={CX} y1={10} x2={CX} y2={H - 10} stroke="#f1f5f9" />
        <path d={truePath} fill="rgba(79,70,229,0.07)" stroke="#4f46e5" strokeWidth={2} />
        <path d={qPath} fill="rgba(225,29,72,0.06)" stroke="#e11d48" strokeWidth={2} strokeDasharray="6 4" style={{ transition: "all 0.4s ease" }} />
        <circle cx={CX + q.m1 * S} cy={CY - q.m2 * S} r={4.5} fill="#e11d48" style={{ transition: "all 0.4s ease" }} />
        <text x={CX + 62} y={CY - 96} fontSize={12} fontWeight={700} fill="#4f46e5">p(z₁, z₂)</text>
        <text x={CX + q.m1 * S + 8} y={CY - q.m2 * S - 8} fontSize={12} fontWeight={700} fill="#e11d48" style={{ transition: "all 0.4s ease" }}>q(z₁)q(z₂)</text>
      </svg>

      <div className="min-w-[230px]">
        <div className="mb-3 flex flex-wrap gap-2">
          <button onClick={step} className="rounded-lg border border-accent bg-accent px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">
            {t("vb.mf.step")}
          </button>
          <button onClick={reset} className="rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] text-muted hover:border-accent">
            {t("vb.mf.reset")}
          </button>
          <span className="self-center font-mono text-[12.5px] text-faint">t = {iter}</span>
        </div>
        <label className="mb-1 block text-[13px] font-medium text-muted">{t("vb.mf.rho")} ρ = {rho.toFixed(2)}</label>
        <input type="range" min={-0.9} max={0.9} step={0.05} value={rho} onChange={(e) => { setRho(+e.target.value); reset(); }} className="w-full accent-indigo-600" />
        <div className="mt-3 rounded-xl border border-line bg-panel p-3 font-mono text-[12px] leading-relaxed">
          <div>E[z₁] = {q.m1.toFixed(3)} · E[z₂] = {q.m2.toFixed(3)}</div>
          <div>var(q₁) = {q.v1.toFixed(2)} · var(q₂) = {q.v2.toFixed(2)}</div>
        </div>
        <p className="mt-3 max-w-[250px] text-[12.5px] leading-relaxed text-muted">{t("vb.mf.legend")}</p>
      </div>
    </div>
  );
}
