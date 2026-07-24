import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../i18n/LangContext.jsx";

// Base-aware so it resolves under the Pages sub-path ("/interactive-ml/") in
// production and "/" in local dev.
// Default paper; PaperProvider can override per module via the pdf prop.
const DEFAULT_PDF = "transformer.pdf";
const PaperCtx = createContext({ open: () => {} });
export const usePaper = () => useContext(PaperCtx);

// Provider + the slide-in drawer that embeds the source PDF at a given page.
export function PaperProvider({ children, pdf = DEFAULT_PDF, titleKey = "ui.paper.title" }) {
  const t = useT();
  const [state, setState] = useState(null); // { page, sec }
  const open = useCallback((page, sec) => setState({ page, sec }), []);
  const close = useCallback(() => setState(null), []);
  const PDF_URL = import.meta.env.BASE_URL + pdf;
  const src = state ? `${PDF_URL}#page=${state.page}&view=FitH` : PDF_URL;

  // Escape returns to the app while the drawer is open.
  useEffect(() => {
    if (!state) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close]);

  // An "OPEN IN APP" link clicked in the embedded PDF loads the app inside the
  // drawer iframe, which posts this message (see index.html). Close the drawer
  // and scroll the real app to that section — no reload, no nested app.
  useEffect(() => {
    const onMsg = (e) => {
      const d = e && e.data;
      if (!d || d.source !== "pdf-open-app") return;
      close();
      const id = (d.hash || "").replace(/^#/, "");
      if (id) {
        history.replaceState(null, "", "#" + id);
        requestAnimationFrame(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [close]);

  // Clicking a sidebar chapter (any hash change) closes the drawer so the reader
  // lands on that section — the nav stays live beside the open PDF.
  useEffect(() => {
    if (!state) return;
    const onHash = () => close();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [state, close]);

  return (
    <PaperCtx.Provider value={{ open, close, isOpen: !!state }}>
      {children}
      <AnimatePresence>
        {state && (
          // Covers the whole reading area but leaves the left nav (300px) visible
          // and usable; slides in from the right. No backdrop — nothing to dim.
          <motion.aside
            className="fixed inset-y-0 left-0 right-0 z-[71] flex flex-col bg-white shadow-2xl lg:left-[300px]"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-2.5">
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{t("ui.paper.eyebrow")}</div>
                <div className="text-[14px] font-semibold text-ink">
                  {state.sec ? `§${state.sec} · ` : ""}{t("ui.paper.page")} {state.page}
                  <span className="ml-2 font-normal text-faint">{t(titleKey)}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={src} target="_blank" rel="noreferrer"
                  className="rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-muted hover:border-accent hover:text-ink"
                >
                  {t("ui.paper.newtab")}
                </a>
                <button
                  onClick={close}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-lg text-muted hover:border-accent hover:text-ink"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <iframe key={state.page} src={src} title="Transformer paper" className="min-h-0 flex-1 bg-slate-100" />
          </motion.aside>
        )}
      </AnimatePresence>
    </PaperCtx.Provider>
  );
}

// A citation pill. `page` is required; `sec` and children are optional labels.
export function PaperRef({ page, sec, children, className = "" }) {
  const { open } = usePaper();
  const t = useT();
  return (
    <button
      onClick={() => open(page, sec)}
      className={
        "inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-[12px] font-medium text-accent transition hover:border-accent hover:bg-indigo-100 " +
        className
      }
      data-tip={t("ui.paper.tip")}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      {children || (sec ? `${t("ui.paper.ref")} §${sec}` : t("ui.paper.ref"))}
      <span className="text-indigo-400">· p.{page}</span>
    </button>
  );
}
