import { useEffect, useMemo, useRef, useState } from "react";
import { normPdf, gammaPdf, vbData, exactPosterior, caviStep } from "../../lib/vb.js";
import { useT } from "../../i18n/LangContext.jsx";

// The notes' §4 Normal-Gamma example, live: heatmap of the TRUE posterior
// p(μ,τ|D) with the mean-field q_μ(μ)q_τ(τ) marginals overlaid; step CAVI and
// watch the factorised approximation lock onto the joint.
const W = 480, H = 340, PADL = 54, PADB = 40;
const MU = [0.4, 2.0], TAU = [0.2, 3.4]; // plot ranges
const PRIORS = { mu0: 0, lambda0: 1, a0: 2, b0: 1 };

const px = (mu) => PADL + ((mu - MU[0]) / (MU[1] - MU[0])) * (W - PADL - 10);
const py = (tau) => (H - PADB) - ((tau - TAU[0]) / (TAU[1] - TAU[0])) * (H - PADB - 10);

export default function NormalGammaCAVI() {
  const t = useT();
  const data = useMemo(() => vbData(), []);
  const exact = useMemo(() => exactPosterior(data, PRIORS.mu0, PRIORS.lambda0, PRIORS.a0, PRIORS.b0), [data]);
  // Deliberately bad start: q_τ far too diffuse.
  const init = { muQ: 0.6, precQ: 2, aN: PRIORS.a0, bN: PRIORS.b0 * 6 };
  const [q, setQ] = useState(init);
  const [iter, setIter] = useState(0);
  const canvasRef = useRef(null);

  const step = () => {
    setQ((s) => caviStep(s, data, PRIORS.mu0, PRIORS.lambda0, PRIORS.a0, PRIORS.b0));
    setIter((i) => i + 1);
  };
  const reset = () => { setQ(init); setIter(0); };

  // True posterior heatmap: N(μ | μN, (λN τ)^-1) · Gamma(τ | aN, bN) — painted once.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    const NX = 130, NY = 100;
    let max = 0;
    const vals = [];
    for (let iy = 0; iy < NY; iy++) {
      for (let ix = 0; ix < NX; ix++) {
        const mu = MU[0] + ((MU[1] - MU[0]) * ix) / (NX - 1);
        const tau = TAU[0] + ((TAU[1] - TAU[0]) * iy) / (NY - 1);
        const v = normPdf(mu, exact.muN, 1 / Math.sqrt(exact.lambdaN * tau)) * gammaPdf(tau, exact.aN, exact.bN);
        vals.push(v);
        if (v > max) max = v;
      }
    }
    for (let iy = 0; iy < NY; iy++) {
      for (let ix = 0; ix < NX; ix++) {
        const v = vals[iy * NX + ix] / max;
        if (v < 0.01) continue;
        const mu = MU[0] + ((MU[1] - MU[0]) * ix) / (NX - 1);
        const tau = TAU[0] + ((TAU[1] - TAU[0]) * iy) / (NY - 1);
        ctx.fillStyle = `rgba(79,70,229,${0.85 * v})`;
        ctx.fillRect(px(mu), py(tau) - (H - PADB - 10) / NY, (W - PADL - 10) / NX + 1, (H - PADB - 10) / NY + 1);
      }
    }
  }, [exact]);

  // q marginals as curves along the axes.
  const muCurve = useMemo(() => {
    const sd = 1 / Math.sqrt(q.precQ);
    let d = "";
    for (let i = 0; i <= 100; i++) {
      const mu = MU[0] + ((MU[1] - MU[0]) * i) / 100;
      const v = normPdf(mu, q.muQ, sd);
      const y = (H - PADB) - Math.min(v * 26, 86);
      d += `${i ? "L" : "M"} ${px(mu).toFixed(1)} ${y.toFixed(1)} `;
    }
    return d;
  }, [q]);
  const tauCurve = useMemo(() => {
    let d = "";
    for (let i = 0; i <= 100; i++) {
      const tau = TAU[0] + ((TAU[1] - TAU[0]) * i) / 100;
      const v = gammaPdf(tau, q.aN, q.bN);
      const x = PADL + Math.min(v * 34, 90);
      d += `${i ? "L" : "M"} ${x.toFixed(1)} ${py(tau).toFixed(1)} `;
    }
    return d;
  }, [q]);

  const Etau = q.aN / q.bN;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={step} className="rounded-lg border border-accent bg-accent px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">
          {t("vb.cavi.step")}
        </button>
        <button onClick={reset} className="rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] text-muted hover:border-accent">
          {t("vb.cavi.reset")}
        </button>
        <span className="ml-2 font-mono text-[12.5px] text-faint">t = {iter}</span>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <div className="relative rounded-xl border border-line bg-white" style={{ width: W, maxWidth: "100%" }}>
          <canvas ref={canvasRef} width={W} height={H} className="block max-w-full" />
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
            <path d={muCurve} fill="none" stroke="#e11d48" strokeWidth={2.5} />
            <path d={tauCurve} fill="none" stroke="#059669" strokeWidth={2.5} />
            <line x1={px(q.muQ)} y1={10} x2={px(q.muQ)} y2={H - PADB} stroke="#e11d48" strokeWidth={1} strokeDasharray="4 4" opacity={0.7} />
            <line x1={PADL} y1={py(Etau)} x2={W - 10} y2={py(Etau)} stroke="#059669" strokeWidth={1} strokeDasharray="4 4" opacity={0.7} />
            <text x={W - 14} y={H - PADB + 16} textAnchor="end" fontSize={12} fill="#64748b">μ</text>
            <text x={PADL - 26} y={18} fontSize={12} fill="#64748b">τ</text>
            <text x={px(q.muQ) + 5} y={24} fontSize={11.5} fontWeight={700} fill="#e11d48">q_μ(μ)</text>
            <text x={PADL + 96} y={py(Etau) - 6} fontSize={11.5} fontWeight={700} fill="#059669">q_τ(τ)</text>
          </svg>
        </div>

        <div className="min-w-[210px]">
          <div className="rounded-xl border border-line bg-panel p-4 font-mono text-[12.5px] leading-relaxed">
            <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-faint">q(μ, τ) = q_μ(μ) q_τ(τ)</div>
            <div><span className="text-rose-600">E[μ]</span> = {q.muQ.toFixed(3)}</div>
            <div><span className="text-rose-600">prec(q_μ)</span> = {q.precQ.toFixed(2)}</div>
            <div><span className="text-emerald-600">a_n</span> = {q.aN.toFixed(2)} · <span className="text-emerald-600">b_n</span> = {q.bN.toFixed(2)}</div>
            <div><span className="text-emerald-600">E[τ] = a_n/b_n</span> = {Etau.toFixed(3)}</div>
          </div>
          <p className="mt-3 max-w-[240px] text-[12.5px] leading-relaxed text-muted">{t("vb.cavi.legend")}</p>
        </div>
      </div>
    </div>
  );
}
