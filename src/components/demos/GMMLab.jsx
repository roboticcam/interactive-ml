import { useEffect, useMemo, useRef, useState } from "react";
import { sampleData, eStep, mStep, logLik, sigmaEllipse } from "../../lib/gmm.js";
import { useT } from "../../i18n/LangContext.jsx";

// The notes' GMM example, live: three 2-D clusters, EM stepped by hand.
// E-step colours every point by its responsibilities (RGB mix); M-step moves
// the means and re-shapes the 2σ covariance ellipses; ℓ(Θ|X) only ever rises.
const TRUE = [
  { mu: [-2.4, -1.2], A: [[0.9, 0.25], [0.25, 0.5]] },
  { mu: [2.2, -1.6], A: [[0.6, -0.3], [-0.3, 0.8]] },
  { mu: [0.1, 2.1], A: [[1.0, 0.1], [0.1, 0.45]] },
];
const COLORS = [[225, 29, 72], [37, 99, 235], [5, 150, 105]]; // rose, blue, emerald
const K = 3;

// Deliberately poor initialization so convergence is visible.
const INIT = [
  { alpha: 1 / 3, mu: [-0.9, 0.4], Sigma: [[1.4, 0], [0, 1.4]] },
  { alpha: 1 / 3, mu: [0.2, -0.6], Sigma: [[1.4, 0], [0, 1.4]] },
  { alpha: 1 / 3, mu: [0.9, 0.7], Sigma: [[1.4, 0], [0, 1.4]] },
];

const W = 560, H = 400;
const sx = (x) => W / 2 + x * 62;
const sy = (y) => H / 2 - y * 55;

export default function GMMLab() {
  const t = useT();
  const pts = useMemo(() => sampleData(TRUE, 60, 11), []);
  const [model, setModel] = useState(INIT);
  const [resp, setResp] = useState(() => eStep(pts, INIT));
  const [iter, setIter] = useState(0);
  const [phase, setPhase] = useState("init"); // init | e | m
  const [hist, setHist] = useState(() => [logLik(pts, INIT)]);
  const [playing, setPlaying] = useState(false);
  const timer = useRef();

  const doE = () => { setResp(eStep(pts, model)); setPhase("e"); };
  const doM = () => {
    const r = phase === "e" ? resp : eStep(pts, model);
    const m2 = mStep(pts, r, K);
    setModel(m2); setResp(eStep(pts, m2)); setPhase("m");
    setIter((i) => i + 1);
    setHist((h) => [...h, logLik(pts, m2)]);
  };
  const reset = () => {
    setModel(INIT); setResp(eStep(pts, INIT)); setIter(0); setPhase("init");
    setHist([logLik(pts, INIT)]); setPlaying(false);
  };

  // Auto-play alternates E and M using refs so the interval closure stays fresh
  // and no state updater carries side effects (StrictMode-safe).
  const modelRef = useRef(model);
  const onE = useRef(true);
  useEffect(() => { modelRef.current = model; }, [model]);
  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      if (onE.current) {
        setResp(eStep(pts, modelRef.current));
        setPhase("e");
      } else {
        const r = eStep(pts, modelRef.current);
        const m2 = mStep(pts, r, K);
        modelRef.current = m2;
        setModel(m2);
        setResp(eStep(pts, m2));
        setPhase("m");
        setIter((i) => i + 1);
        setHist((h) => [...h, logLik(pts, m2)]);
      }
      onE.current = !onE.current;
    }, 700);
    return () => clearInterval(timer.current);
  }, [playing, pts]);
  useEffect(() => { if (iter >= 24) setPlaying(false); }, [iter]);

  const ll = hist[hist.length - 1];
  const colour = (i) => {
    const r = resp[i];
    const c = [0, 1, 2].map((ch) => Math.round(r[0] * COLORS[0][ch] + r[1] * COLORS[1][ch] + r[2] * COLORS[2][ch]));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  };

  // mini log-likelihood chart
  const llPath = useMemo(() => {
    if (hist.length < 2) return "";
    const mn = Math.min(...hist), mx = Math.max(...hist);
    const nx = (i) => 8 + (i / Math.max(hist.length - 1, 1)) * 150;
    const ny = (v) => 44 - ((v - mn) / Math.max(mx - mn, 1e-9)) * 36;
    return hist.map((v, i) => `${i ? "L" : "M"} ${nx(i).toFixed(1)} ${ny(v).toFixed(1)}`).join(" ");
  }, [hist]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={doE} className="rounded-lg border border-accent bg-white px-3 py-1.5 text-[13px] font-semibold text-accent hover:bg-indigo-50">
          {t("em.lab.estep")}
        </button>
        <button onClick={doM} className="rounded-lg border border-accent bg-accent px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">
          {t("em.lab.mstep")}
        </button>
        <button onClick={() => setPlaying((p) => !p)} className="rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted hover:border-accent">
          {playing ? "❚❚" : "▶"} {t("em.lab.auto")}
        </button>
        <button onClick={reset} className="rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] text-muted hover:border-accent">
          {t("em.lab.reset")}
        </button>
        <span className="ml-2 font-mono text-[12.5px] text-faint">
          g = {iter} · {phase === "e" ? t("em.lab.afterE") : phase === "m" ? t("em.lab.afterM") : t("em.lab.initial")}
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="max-w-full rounded-xl border border-line bg-white" style={{ width: W }}>
          {pts.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={3.2} fill={colour(i)} fillOpacity={0.75} />
          ))}
          {model.map((m, l) => {
            const e = sigmaEllipse(m.Sigma);
            const col = `rgb(${COLORS[l][0]},${COLORS[l][1]},${COLORS[l][2]})`;
            return (
              <g key={l} style={{ transition: "all 0.5s ease" }}>
                <ellipse
                  cx={sx(m.mu[0])} cy={sy(m.mu[1])}
                  rx={e.rx * 62} ry={e.ry * 55}
                  transform={`rotate(${-e.deg} ${sx(m.mu[0])} ${sy(m.mu[1])})`}
                  fill="none" stroke={col} strokeWidth={2} strokeDasharray="6 4" opacity={0.85}
                  style={{ transition: "all 0.5s ease" }}
                />
                <circle cx={sx(m.mu[0])} cy={sy(m.mu[1])} r={6} fill={col} stroke="#fff" strokeWidth={2}
                  style={{ transition: "all 0.5s ease" }} />
                <text x={sx(m.mu[0]) + 10} y={sy(m.mu[1]) - 8} fontSize={12} fontWeight={700} fill={col}>
                  μ{l + 1} · α={m.alpha.toFixed(2)}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="min-w-[190px]">
          <div className="rounded-xl border border-line bg-panel p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-faint">{t("em.lab.loglik")}</div>
            <div className="mt-1 font-mono text-[17px] font-bold text-accent">{ll.toFixed(1)}</div>
            <svg viewBox="0 0 166 50" className="mt-2 w-full">
              <path d={llPath} fill="none" stroke="#4f46e5" strokeWidth={2} />
            </svg>
            <div className="mt-1 text-[11.5px] text-faint">{t("em.lab.monotone")}</div>
          </div>
          <p className="mt-3 max-w-[220px] text-[12.5px] leading-relaxed text-muted">{t("em.lab.legend")}</p>
        </div>
      </div>
    </div>
  );
}
