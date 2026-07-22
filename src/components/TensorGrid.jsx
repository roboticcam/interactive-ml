import { motion } from "framer-motion";

// Map a value in [min,max] to an indigo→white→amber-ish heat, or a mono blue.
function heat(v, min, max, scheme = "blue") {
  if (max === min) return scheme === "blue" ? "rgba(79,70,229,0.14)" : "rgba(79,70,229,0.14)";
  const t = Math.max(0, Math.min(1, (v - min) / (max - min)));
  if (scheme === "prob") {
    // white -> indigo for attention weights (0..1)
    return `rgba(79,70,229,${0.08 + 0.82 * t})`;
  }
  if (scheme === "diverging") {
    // negative -> rose, positive -> indigo, centered at 0
    const a = Math.min(1, Math.abs(v) / Math.max(Math.abs(min), Math.abs(max), 1e-6));
    return v >= 0 ? `rgba(79,70,229,${0.1 + 0.7 * a})` : `rgba(225,29,72,${0.1 + 0.7 * a})`;
  }
  return `rgba(37,99,235,${0.08 + 0.5 * t})`;
}

function fmt(v, decimals) {
  if (v === "-inf" || v === -Infinity) return "-∞";
  if (typeof v !== "number") return String(v);
  if (Number.isInteger(v) && decimals === undefined) return String(v);
  return v.toFixed(decimals ?? 2);
}

// matrix: number[][] (or values like "-inf")
// highlight: {rows?:number[], cols?:number[], cells?:[r,c][]}
export default function TensorGrid({
  matrix,
  rowLabels,
  colLabels,
  caption,
  scheme = "blue",
  decimals,
  highlight = {},
  cellSize = 44,
  showValues = true,
  dimBadge,
  animateKey,
}) {
  const rows = matrix.length;
  const cols = rows ? matrix[0].length : 0;
  const flat = matrix.flat().filter((v) => typeof v === "number" && isFinite(v));
  const min = flat.length ? Math.min(...flat) : 0;
  const max = flat.length ? Math.max(...flat) : 1;

  const hlRows = new Set(highlight.rows || []);
  const hlCols = new Set(highlight.cols || []);
  const hlCells = new Set((highlight.cells || []).map(([r, c]) => r + ":" + c));

  return (
    <div className="inline-block">
      {dimBadge ? (
        <div className="mb-1.5 font-mono text-[11px] font-semibold text-faint">{dimBadge}</div>
      ) : null}
      <div className="inline-flex flex-col">
        <div className="flex">
          {rowLabels ? <div style={{ width: 34 }} /> : null}
          {colLabels ? (
            <div className="flex">
              {colLabels.map((cl, c) => (
                <div
                  key={c}
                  style={{ width: cellSize }}
                  className={
                    "pb-1 text-center font-mono text-[11px] " +
                    (hlCols.has(c) ? "font-bold text-accent" : "text-faint")
                  }
                >
                  {cl}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {matrix.map((row, r) => (
          <div key={r} className="flex items-center">
            {rowLabels ? (
              <div
                style={{ width: 34 }}
                className={
                  "pr-1.5 text-right font-mono text-[11px] " +
                  (hlRows.has(r) ? "font-bold text-accent" : "text-faint")
                }
              >
                {rowLabels[r]}
              </div>
            ) : null}
            {row.map((v, c) => {
              const active =
                hlRows.has(r) || hlCols.has(c) || hlCells.has(r + ":" + c);
              const isInf = v === "-inf" || v === -Infinity;
              return (
                <motion.div
                  key={c}
                  layout
                  initial={animateKey ? { opacity: 0, scale: 0.6 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.28, delay: (r * cols + c) * 0.006 }}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: isInf ? "rgba(15,23,42,0.9)" : heat(v, min, max, scheme),
                  }}
                  className={
                    "m-[2px] flex items-center justify-center rounded-md border text-[12px] font-medium tabular-nums transition-all " +
                    (active
                      ? "border-accent ring-2 ring-accent/40 text-ink"
                      : "border-line text-ink/80") +
                    (isInf ? " text-slate-300" : "")
                  }
                >
                  {showValues ? fmt(v, decimals) : ""}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      {caption ? <div className="mt-2 text-[12.5px] text-faint">{caption}</div> : null}
    </div>
  );
}
