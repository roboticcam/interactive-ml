// Minimal tensor helpers for the in-browser demos. Everything is plain JS
// arrays — enough to reproduce the paper's small worked examples faithfully.

export function matmul(A, B) {
  const n = A.length, k = A[0].length, m = B[0].length;
  const out = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += A[i][t] * B[t][j];
      out[i][j] = s;
    }
  return out;
}

export function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}

export function scale(A, s) {
  return A.map((row) => row.map((v) => (typeof v === "number" ? v * s : v)));
}

// Row-wise softmax; supports "-inf" sentinels (treated as 0 mass).
export function softmaxRows(A) {
  return A.map((row) => {
    const nums = row.map((v) => (v === "-inf" || v === -Infinity ? -Infinity : v));
    const mx = Math.max(...nums.filter((v) => isFinite(v)));
    const exps = nums.map((v) => (isFinite(v) ? Math.exp(v - mx) : 0));
    const sum = exps.reduce((a, b) => a + b, 0) || 1;
    return exps.map((e) => e / sum);
  });
}

// Apply a lower-triangular causal mask (positions j>i become "-inf").
export function causalMask(A) {
  return A.map((row, i) => row.map((v, j) => (j > i ? "-inf" : v)));
}

export function round(A, d = 2) {
  return A.map((row) => row.map((v) => (typeof v === "number" ? +v.toFixed(d) : v)));
}

// Deterministic pseudo-values so demos are stable across renders (no Math.random).
export function seeded(rows, cols, seed = 1) {
  const out = [];
  let s = seed * 9301 + 49297;
  for (let i = 0; i < rows; i++) {
    const r = [];
    for (let j = 0; j < cols; j++) {
      s = (s * 9301 + 49297) % 233280;
      r.push(+(((s / 233280) * 2 - 1) * 1.6).toFixed(2));
    }
    out.push(r);
  }
  return out;
}
