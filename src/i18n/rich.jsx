import { M } from "../components/Math.jsx";
import { C } from "../components/Code.jsx";

// Renders a lightweight markup string as React nodes so that translatable prose
// can live as a single flat string per language while math/code stay shared:
//
//   $ ... $      inline KaTeX (with the paper's \q \K \V … macros)
//   **bold**     <strong>
//   *italic*     <em>
//   `code`       inline code chip
//   [text](url)  external link
//
// Author content strings with these tokens; do NOT nest tokens (e.g. no math
// inside bold). Backslashes in $math$ must be escaped for JS strings (\\).
const PATTERNS = [
  { re: /^\$([^$]+)\$/, node: (m, k) => <M key={k}>{m[1]}</M> },
  { re: /^\*\*([^*]+)\*\*/, node: (m, k) => <strong key={k} className="font-semibold text-ink">{m[1]}</strong> },
  { re: /^`([^`]+)`/, node: (m, k) => <C key={k}>{m[1]}</C> },
  { re: /^\*([^*]+)\*/, node: (m, k) => <em key={k}>{m[1]}</em> },
  {
    re: /^\[([^\]]+)\]\(([^)]+)\)/,
    node: (m, k) => (
      <a key={k} href={m[2]} target="_blank" rel="noreferrer" className="text-accent underline decoration-line underline-offset-2 hover:text-indigo-700">
        {m[1]}
      </a>
    ),
  },
];

export function Rich({ children }) {
  const text = String(children ?? "");
  const nodes = [];
  let i = 0, key = 0, buf = "";
  const flush = () => { if (buf) { nodes.push(buf); buf = ""; } };
  while (i < text.length) {
    const rest = text.slice(i);
    let matched = false;
    for (const p of PATTERNS) {
      const m = rest.match(p.re);
      if (m) { flush(); nodes.push(p.node(m, "n" + key++)); i += m[0].length; matched = true; break; }
    }
    if (!matched) { buf += text[i]; i++; }
  }
  flush();
  return <>{nodes}</>;
}
