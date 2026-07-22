import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../i18n/LangContext.jsx";

// Base-aware so it resolves under the Pages sub-path ("/interactive-ml/") in
// production and "/" in local dev.
const PDF_URL = import.meta.env.BASE_URL + "transformer.pdf";
const PaperCtx = createContext({ open: () => {} });
export const usePaper = () => useContext(PaperCtx);

// Provider + the slide-in drawer that embeds the source PDF at a given page.
export function PaperProvider({ children }) {
  const t = useT();
  const [state, setState] = useState(null); // { page, sec }
  const open = useCallback((page, sec) => setState({ page, sec }), []);
  const close = useCallback(() => setState(null), []);
  const src = state ? `${PDF_URL}#page=${state.page}&view=FitH` : PDF_URL;

  return (
    <PaperCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-[720px] flex-col bg-white shadow-2xl"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{t("ui.paper.eyebrow")}</div>
                  <div className="text-[14px] font-semibold text-ink">
                    {state.sec ? `§${state.sec} · ` : ""}{t("ui.paper.page")} {state.page}
                    <span className="ml-2 font-normal text-faint">{t("ui.paper.title")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
          </>
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
