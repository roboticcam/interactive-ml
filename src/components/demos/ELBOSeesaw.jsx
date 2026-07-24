import { useMemo, useState } from "react";
import { normPdf } from "../../lib/vb.js";
import { useT } from "../../i18n/LangContext.jsx";

// log p(x) = ELBO(q) + KL(q‖p): the evidence is a fixed pie. Slide q's mean and
// spread against a fixed bimodal posterior; the stacked bar re-splits but its
// total never moves.
const W = 470, H = 210;
const Z = [-4.5, 4.5];
const zx = (z) => ((z - Z[0]) / (Z[1] - Z[0])) * (W - 20) + 10;
// Fixed "true posterior": mixture of two Gaussians (unnormalized weights known).
const P = (z) => 0.62 * normPdf(z, -1.3, 0.7) + 0.38 * normPdf(z, 1.6, 0.55);

// Numeric integrals on a grid (fine enough for teaching).
const GRID = Array.from({ length: 421 }, (_, i) => Z[0] + (i * (Z[1] - Z[0])) / 420);
const DZ = (Z[1] - Z[0]) / 420;
// Pretend evidence: p(x,z) = C · P(z) with C chosen so log p(x) = 1.0 nats (fixed pie).
const LOGPX = 1.0;

export default function ELBOSeesaw() {
  const t = useT();
  const [m, setM] = useState(0.2);
  const [sd, setSd] = useState(1.6);

  const { elbo, kl } = useMemo(() => {
    let klv = 0;
    for (const z of GRID) {
      const q = normPdf(z, m, sd);
      if (q < 1e-12) continue;
      klv += q * Math.log(q / Math.max(P(z), 1e-300)) * DZ;
    }
    return { elbo: LOGPX - klv, kl: klv };
  }, [m, sd]);

  const qCurve = GRID.filter((_, i) => i % 3 === 0).map((z, i) => `${i ? "L" : "M"} ${zx(z).toFixed(1)} ${(H - 24 - normPdf(z, m, sd) * 200).toFixed(1)}`).join(" ");
  const pCurve = GRID.filter((_, i) => i % 3 === 0).map((z, i) => `${i ? "L" : "M"} ${zx(z).toFixed(1)} ${(H - 24 - P(z) * 200).toFixed(1)}`).join(" ");

  const total = Math.abs(elbo) + kl;
  const elboFrac = Math.max(elbo, 0) / (Math.max(elbo, 0) + kl || 1);

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="max-w-full rounded-xl border border-line bg-white" style={{ width: W }}>
        <line x1={10} y1={H - 24} x2={W - 10} y2={H - 24} stroke="#e2e8f0" />
        <path d={pCurve} fill="none" stroke="#0f172a" strokeWidth={2} />
        <path d={qCurve} fill="none" stroke="#4f46e5" strokeWidth={2.5} />
        <text x={zx(-1.4)} y={30} fontSize={12} fill="#0f172a">p(z|x)</text>
        <text x={zx(m) + 6} y={44} fontSize={12} fontWeight={700} fill="#4f46e5">q(z)</text>
      </svg>

      <div className="min-w-[230px]">
        <label className="mb-1 block text-[13px] font-medium text-muted">E[z] under q = {m.toFixed(2)}</label>
        <input type="range" min={-3} max={3} step={0.05} value={m} onChange={(e) => setM(+e.target.value)} className="w-full accent-indigo-600" />
        <label className="mb-1 mt-3 block text-[13px] font-medium text-muted">sd(q) = {sd.toFixed(2)}</label>
        <input type="range" min={0.35} max={2.6} step={0.05} value={sd} onChange={(e) => setSd(+e.target.value)} className="w-full accent-indigo-600" />

        {/* fixed pie bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between font-mono text-[11.5px] text-faint">
            <span>log p(x) = {LOGPX.toFixed(2)} ({t("vb.seesaw.fixed")})</span>
          </div>
          <div className="flex h-6 w-full overflow-hidden rounded-lg ring-1 ring-line">
            <div className="flex items-center justify-center bg-indigo-500 text-[10.5px] font-bold text-white transition-all duration-200" style={{ width: `${elboFrac * 100}%` }}>
              ELBO {elbo.toFixed(2)}
            </div>
            <div className="flex items-center justify-center bg-rose-400 text-[10.5px] font-bold text-white transition-all duration-200" style={{ width: `${(1 - elboFrac) * 100}%` }}>
              KL {kl.toFixed(2)}
            </div>
          </div>
        </div>
        <p className="mt-3 max-w-[250px] text-[12.5px] leading-relaxed text-muted">{t("vb.seesaw.legend")}</p>
      </div>
    </div>
  );
}
