import { useMemo } from "react";

// Tiny, dependency-free Python highlighter. Not a full parser — a pragmatic
// tokenizer that colours the constructs that appear in the paper's listings
// (defs, keywords, strings, comments, numbers, torch calls). Good enough for
// study code, and zero bundle cost.
const KEYWORDS = new Set([
  "def", "class", "return", "if", "else", "elif", "for", "while", "in", "not",
  "and", "or", "is", "None", "True", "False", "import", "from", "as", "with",
  "assert", "lambda", "yield", "self", "super", "pass", "break", "continue",
  "float", "int", "range",
]);

const BUILTINS = new Set([
  "torch", "nn", "F", "Tensor", "Module", "Linear", "Dropout", "softmax",
  "tril", "ones", "view", "transpose", "split", "size", "masked_fill",
  "unsqueeze", "squeeze", "cat", "matmul", "reshape", "arange", "exp", "sum",
  "max", "outer", "cos", "sin", "stack", "einsum", "sqrt", "mean", "cumsum",
]);

function tokenizeLine(line) {
  const tokens = [];
  let i = 0;
  const n = line.length;
  const push = (cls, text) => tokens.push({ cls, text });

  while (i < n) {
    const ch = line[i];

    // comment
    if (ch === "#") {
      push("comment", line.slice(i));
      break;
    }
    // string
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && line[j] !== ch) j++;
      push("string", line.slice(i, Math.min(j + 1, n)));
      i = j + 1;
      continue;
    }
    // number
    if (/[0-9]/.test(ch) && (i === 0 || !/[A-Za-z_]/.test(line[i - 1]))) {
      let j = i;
      while (j < n && /[0-9._]/.test(line[j])) j++;
      push("number", line.slice(i, j));
      i = j;
      continue;
    }
    // identifier / keyword
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const after = line.slice(j).match(/^\s*\(/);
      if (KEYWORDS.has(word)) push("kw", word);
      else if (BUILTINS.has(word)) push("builtin", word);
      else if (after) push("fn", word);
      else push("plain", word);
      i = j;
      continue;
    }
    // operator / punctuation
    push("op", ch);
    i++;
  }
  return tokens;
}

const CLS = {
  comment: "text-emerald-400/80 italic",
  string: "text-amber-300",
  number: "text-orange-300",
  kw: "text-violet-300 font-medium",
  builtin: "text-sky-300",
  fn: "text-indigo-200",
  op: "text-slate-400",
  plain: "text-slate-100",
};

export default function Code({ children, label, className = "" }) {
  const lines = useMemo(() => String(children).replace(/\n$/, "").split("\n"), [children]);
  return (
    <div className={"my-5 overflow-hidden rounded-xl border border-slate-800 bg-[#0b1020] shadow-sm " + className}>
      {label ? (
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-xs text-slate-400">{label}</span>
        </div>
      ) : null}
      <pre className="thin-scroll overflow-x-auto px-4 py-3.5 font-mono text-[13.5px] leading-relaxed">
        <code>
          {lines.map((line, li) => (
            <div key={li} className="min-h-[1.4em]">
              {tokenizeLine(line).map((t, ti) => (
                <span key={ti} className={CLS[t.cls] || CLS.plain}>
                  {t.text}
                </span>
              ))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

// Inline monospaced code chip.
export function C({ children }) {
  return (
    <code className="rounded-md border border-line bg-panel px-1.5 py-0.5 font-mono text-[0.85em] text-indigo-700">
      {children}
    </code>
  );
}
