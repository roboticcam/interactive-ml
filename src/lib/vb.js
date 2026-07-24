// Math helpers for the VB module's demos: 1-D normal / gamma densities, the
// Normal-Gamma CAVI fixed point from the notes, and the 2-D mean-field CAVI.

export const normPdf = (x, mu, sd) =>
  Math.exp(-((x - mu) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));

// log Γ via Lanczos (good enough for plotting).
export function lgamma(z) {
  const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < 8; i++) x += g[i] / (z + i + 1);
  const t = z + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

export const gammaPdf = (x, a, b) => // shape a, rate b
  x <= 0 ? 0 : Math.exp(a * Math.log(b) + (a - 1) * Math.log(x) - b * x - lgamma(a));

// ── Normal-Gamma example (notes §4) ──────────────────────────────────────────
// Deterministic dataset ~ N(muTrue, 1/tauTrue), seeded.
export function vbData(n = 24, muTrue = 1.2, tauTrue = 1.6, seed = 5) {
  let s = seed * 9301 + 49297;
  const unif = () => ((s = (s * 9301 + 49297) % 233280), s / 233280);
  const out = [];
  for (let i = 0; i < n; i++) {
    let u = 0, v = 0;
    while (u === 0) u = unif();
    while (v === 0) v = unif();
    out.push(muTrue + Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) / Math.sqrt(tauTrue));
  }
  return out;
}

// Exact posterior parameters (conjugate Normal-Gamma).
export function exactPosterior(data, mu0, lambda0, a0, b0) {
  const n = data.length;
  const xbar = data.reduce((a, b) => a + b, 0) / n;
  const ss = data.reduce((a, x) => a + (x - xbar) ** 2, 0);
  return {
    muN: (lambda0 * mu0 + n * xbar) / (lambda0 + n),
    lambdaN: lambda0 + n,
    aN: a0 + n / 2,
    bN: b0 + 0.5 * (ss + (lambda0 * n * (xbar - mu0) ** 2) / (lambda0 + n)),
  };
}

// One CAVI fixed-point update (the notes' update()): returns new {muQ, precQ, aN, bN}.
export function caviStep(state, data, mu0, lambda0, a0, b0) {
  const n = data.length;
  const xbar = data.reduce((a, b) => a + b, 0) / n;
  const sumx2 = data.reduce((a, x) => a + x * x, 0);
  const lambdaN = lambda0 + n;
  const muN = (lambda0 * mu0 + n * xbar) / lambdaN;
  const aN = a0 + n / 2;
  const Etau = state.aN / state.bN;                    // E_qτ[τ] from previous q
  const Emu2 = 1 / (Etau * lambdaN) + muN * muN;       // E_qμ[μ²]
  const bN = b0 + 0.5 * (sumx2 + lambda0 * mu0 * mu0 + lambdaN * Emu2
      - 2 * (n * xbar + lambda0 * mu0) * muN);
  return { muQ: muN, precQ: (aN / bN) * lambdaN, aN, bN };
}

// ── 2-D Gaussian mean-field CAVI (notes §6.3) ───────────────────────────────
// One sweep of the coupled mean updates; variances are the fixed conditionals.
export function cavi2dStep(q, mu, Sigma) {
  const [[s11, s12], [, s22]] = [Sigma[0], Sigma[1]];
  const m1 = mu[0] + (s12 / s22) * (q.m2 - mu[1]);   // uses freshest E[z2]
  const m2 = mu[1] + (s12 / s11) * (m1 - mu[0]);
  return { m1, m2, v1: s11 - (s12 * s12) / s22, v2: s22 - (s12 * s12) / s11 };
}
