import { useState } from "react";
import TensorGrid from "../TensorGrid.jsx";
import Code from "../Code.jsx";
import { ShapePill } from "../ui.jsx";

// Demonstrates torch.unsqueeze: inserting a length-1 axis. The user picks the
// tensor and the dim; the resulting shape + grid update live.
const BASE = {
  "1D  [4]": { data: [1, 2, 3, 4], shape: [4] },
  "2D  [2,3]": { data: [[1, 2, 3], [4, 5, 6]], shape: [2, 3] },
};

function render1D(data, dim) {
  // dim 0 -> (1,n) row ; dim 1 -> (n,1) column
  if (dim === 0) return { matrix: [data], shape: [1, data.length] };
  return { matrix: data.map((v) => [v]), shape: [data.length, 1] };
}

export default function UnsqueezeDemo() {
  const [which, setWhich] = useState("1D  [4]");
  const [dim, setDim] = useState(0);
  const base = BASE[which];
  const is1D = base.shape.length === 1;
  const maxDim = base.shape.length; // unsqueeze allows dim in [0, ndim]
  const clampedDim = Math.min(dim, maxDim);

  let out;
  if (is1D) {
    out = render1D(base.data, clampedDim);
  } else {
    // 2D -> insert axis. We visualize by showing the new shape and keeping the
    // 2D grid (the inserted axis is length-1, so values are unchanged).
    const s = base.shape.slice();
    s.splice(clampedDim, 0, 1);
    out = { matrix: base.data, shape: s };
  }

  const inMatrix = is1D ? [base.data] : base.data;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-medium text-muted">tensor:</span>
        {Object.keys(BASE).map((k) => (
          <button
            key={k}
            onClick={() => { setWhich(k); setDim(0); }}
            className={
              "rounded-lg border px-3 py-1.5 font-mono text-[12.5px] transition " +
              (which === k ? "border-accent bg-accent text-white" : "border-line bg-white text-muted hover:border-accent/50")
            }
          >
            {k}
          </button>
        ))}
        <span className="ml-3 text-[13px] font-medium text-muted">dim:</span>
        {Array.from({ length: maxDim + 1 }, (_, d) => (
          <button
            key={d}
            onClick={() => setDim(d)}
            className={
              "h-9 w-9 rounded-lg border font-mono text-[13px] transition " +
              (clampedDim === d ? "border-accent bg-accent text-white" : "border-line bg-white text-muted hover:border-accent/50")
            }
          >
            {d}
          </button>
        ))}
      </div>

      <Code label="python">{`a = torch.tensor(${is1D ? "[" + base.data.join(", ") + "]" : JSON.stringify(base.data)})\nb = a.unsqueeze(dim=${clampedDim})`}</Code>

      <div className="mt-4 flex flex-wrap items-end gap-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[13px] text-faint">
            <span>input</span> <ShapePill>{"(" + base.shape.join(", ") + ")"}</ShapePill>
          </div>
          <TensorGrid matrix={inMatrix} scheme="blue" />
        </div>
        <div className="pb-4 text-3xl text-faint">→</div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-[13px] text-faint">
            <span>output</span> <ShapePill>{"(" + out.shape.join(", ") + ")"}</ShapePill>
          </div>
          <TensorGrid matrix={out.matrix} scheme="blue" animateKey={which + clampedDim} />
        </div>
      </div>
      <p className="mt-4 text-[14px] text-muted">
        <span className="font-semibold text-ink">unsqueeze</span> inserts a new axis of length&nbsp;1 at
        position <span className="font-mono text-accent">dim</span>. No data is copied — only the shape's
        metadata changes. This is exactly how the causal mask becomes{" "}
        <span className="font-mono">(1, 1, T, T)</span> so it can broadcast over{" "}
        <span className="font-mono">(B, h, T, T)</span>.
      </p>
    </div>
  );
}
