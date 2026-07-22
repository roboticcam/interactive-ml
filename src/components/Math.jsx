import katex from "katex";
import { useMemo } from "react";

// Shorthand macros matching the paper's bold-vector notation.
const MACROS = {
  "\\q": "\\mathbf{q}", "\\k": "\\mathbf{k}", "\\v": "\\mathbf{v}",
  "\\x": "\\mathbf{x}", "\\h": "\\mathbf{h}", "\\z": "\\mathbf{z}",
  "\\a": "\\mathbf{a}", "\\y": "\\mathbf{y}", "\\o": "\\mathbf{o}",
  "\\Q": "\\mathbf{Q}", "\\K": "\\mathbf{K}", "\\V": "\\mathbf{V}",
  "\\X": "\\mathbf{X}", "\\Z": "\\mathbf{Z}", "\\A": "\\mathbf{A}",
  "\\O": "\\mathbf{O}", "\\Y": "\\mathbf{Y}", "\\W": "\\mathbf{W}",
  "\\C": "\\mathbf{C}", "\\dm": "d_{\\text{model}}", "\\sm": "\\text{softmax}",
};

export function M({ children }) {
  const html = useMemo(
    () => katex.renderToString(String(children), { throwOnError: false, displayMode: false, macros: MACROS }),
    [children]
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// Display math block. Pass the LaTeX body as a string child.
export function MB({ children }) {
  const html = useMemo(
    () => katex.renderToString(String(children), { throwOnError: false, displayMode: true, macros: MACROS }),
    [children]
  );
  return <div className="katex-display-wrap thin-scroll" dangerouslySetInnerHTML={{ __html: html }} />;
}
