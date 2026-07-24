// 2-D Gaussian-mixture EM, implemented exactly as in the notes: responsibilities
// (E-step) then closed-form alpha / mu / Sigma updates (M-step). Deterministic
// seeded data so demos are stable across renders.

// Park–Miller-ish seeded uniform, then Box–Muller for normals.
export function makeRng(seed = 1) {
  let s = (seed * 9301 + 49297) % 233280;
  const unif = () => ((s = (s * 9301 + 49297) % 233280), s / 233280);
  const norm = () => {
    let u = 0, v = 0;
    while (u === 0) u = unif();
    while (v === 0) v = unif();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  return { unif, norm };
}

// Sample n points from each of the given components {mu:[x,y], A:[[a,b],[c,d]]}
// (A is a shaping matrix; Sigma = A Aᵀ).
export function sampleData(components, nPer, seed = 7) {
  const rng = makeRng(seed);
  const pts = [];
  components.forEach((c, ci) => {
    for (let i = 0; i < nPer; i++) {
      const z0 = rng.norm(), z1 = rng.norm();
      pts.push({
        x: c.mu[0] + c.A[0][0] * z0 + c.A[0][1] * z1,
        y: c.mu[1] + c.A[1][0] * z0 + c.A[1][1] * z1,
        src: ci,
      });
    }
  });
  return pts;
}

const det2 = (S) => S[0][0] * S[1][1] - S[0][1] * S[1][0];
const inv2 = (S) => {
  const d = det2(S);
  return [[S[1][1] / d, -S[0][1] / d], [-S[1][0] / d, S[0][0] / d]];
};

export function gauss2(p, mu, Sigma) {
  const d = det2(Sigma);
  if (d <= 1e-12) return 0;
  const I = inv2(Sigma);
  const dx = p.x - mu[0], dy = p.y - mu[1];
  const q = dx * (I[0][0] * dx + I[0][1] * dy) + dy * (I[1][0] * dx + I[1][1] * dy);
  return Math.exp(-0.5 * q) / (2 * Math.PI * Math.sqrt(d));
}

// One E-step: responsibilities r[i][l] = alpha_l N(x_i|mu_l,Sigma_l) / sum_s ...
export function eStep(pts, model) {
  return pts.map((p) => {
    const w = model.map((m) => m.alpha * gauss2(p, m.mu, m.Sigma));
    const s = w.reduce((a, b) => a + b, 0) || 1e-300;
    return w.map((v) => v / s);
  });
}

// One M-step: closed-form alpha, mu, Sigma from the notes' summary formulas.
export function mStep(pts, r, k) {
  const n = pts.length;
  const model = [];
  for (let l = 0; l < k; l++) {
    const Nl = pts.reduce((a, _, i) => a + r[i][l], 0) || 1e-12;
    const mu = [
      pts.reduce((a, p, i) => a + p.x * r[i][l], 0) / Nl,
      pts.reduce((a, p, i) => a + p.y * r[i][l], 0) / Nl,
    ];
    let sxx = 0, sxy = 0, syy = 0;
    pts.forEach((p, i) => {
      const dx = p.x - mu[0], dy = p.y - mu[1];
      sxx += dx * dx * r[i][l];
      sxy += dx * dy * r[i][l];
      syy += dy * dy * r[i][l];
    });
    // small ridge keeps Sigma positive-definite when a component collapses
    const Sigma = [[sxx / Nl + 1e-4, sxy / Nl], [sxy / Nl, syy / Nl + 1e-4]];
    model.push({ alpha: Nl / n, mu, Sigma });
  }
  return model;
}

export function logLik(pts, model) {
  return pts.reduce((a, p) => {
    const s = model.reduce((b, m) => b + m.alpha * gauss2(p, m.mu, m.Sigma), 0);
    return a + Math.log(Math.max(s, 1e-300));
  }, 0);
}

// Ellipse parameters (2-sigma contour) from a 2x2 covariance: eigen-decompose.
export function sigmaEllipse(Sigma, nSigma = 2) {
  const a = Sigma[0][0], b = Sigma[0][1], c = Sigma[1][1];
  const tr = a + c, dd = Math.sqrt(Math.max(0, ((a - c) / 2) ** 2 + b * b));
  const l1 = tr / 2 + dd, l2 = tr / 2 - dd;
  const angle = Math.atan2(l1 - a, b === 0 ? 1e-12 : b); // eigenvector [b, λ1−a] angle
  return {
    rx: nSigma * Math.sqrt(Math.max(l1, 1e-9)),
    ry: nSigma * Math.sqrt(Math.max(l2, 1e-9)),
    deg: (angle * 180) / Math.PI,
  };
}
