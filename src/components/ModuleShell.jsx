import { useEffect, useState } from "react";
import { PaperProvider, PaperRef, usePaper } from "./Paper.jsx";
import { Rich } from "../i18n/rich.jsx";
import { useT, LanguageSwitcher } from "../i18n/LangContext.jsx";

// Generic module page shell: progress bar, scroll-spy sidebar, per-module PDF
// drawer, hero slot, chapter stream, footer. Every course module renders
// through this — module-specific bits arrive as props.
//   chapters: [{ id, num, Body, subs: [id] }]
//   labels:   { kicker, title, subtitle, readpaper, nav(id), sub(id) } — i18n keys / fns
//   pdf:      public/ filename for the drawer; paperTitleKey for its header
//   Hero:     component rendered above the chapters
//   footerKeys: [i18n keys]

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids.join(",")]);
  return active;
}

function ProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent">
      <div className="h-full bg-accent transition-[width] duration-150" style={{ width: p + "%" }} />
    </div>
  );
}

function Sidebar({ active, chapters, labels, moduleRoute }) {
  const t = useT();
  const { isOpen, close } = usePaper();
  return (
    <aside className="hidden lg:flex lg:w-[300px] lg:shrink-0 lg:flex-col lg:border-r lg:border-line lg:bg-panel">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="flex items-start justify-between gap-2 px-7 pb-2 pt-7">
          <a href={moduleRoute} className="block">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">{t(labels.kicker)}</div>
            <div className="mt-1 text-[19px] font-extrabold leading-tight tracking-tight text-ink">{t(labels.title)}</div>
            <div className="text-[13px] text-faint">{t(labels.subtitle)}</div>
          </a>
          <LanguageSwitcher />
        </div>
        <div className="px-7 pb-3">
          <a href="#/" className="text-[12.5px] font-medium text-muted hover:text-accent">⌂ {t("ui.module.allmodules")}</a>
        </div>
        <div className="px-6 pb-4">
          {isOpen ? (
            <button
              onClick={close}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <span className="text-base leading-none">←</span> {t("ui.paper.back")}
            </button>
          ) : (
            <PaperRef page={1} className="w-full justify-center py-2 text-[13px]">{t(labels.readpaper)}</PaperRef>
          )}
        </div>
        <nav className="thin-scroll flex-1 overflow-y-auto px-4 pb-10">
          {chapters.map((c) => {
            const isActive = active === c.id || c.subs?.some((s) => s === active);
            return (
              <div key={c.id} className="mb-0.5">
                <a
                  href={`#${c.id}`}
                  className={
                    "nav-link group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] transition " +
                    (isActive ? "bg-white font-semibold text-ink shadow-sm" : "text-muted hover:bg-white/60")
                  }
                >
                  <span className={"flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold " + (isActive ? "bg-accent text-white" : "bg-white text-faint ring-1 ring-line")}>
                    {c.num}
                  </span>
                  <span className="truncate">{t(labels.nav(c.id))}</span>
                </a>
                {isActive && c.subs?.length ? (
                  <div className="ml-6 mt-0.5 flex flex-col border-l border-line pl-3">
                    {c.subs.map((sid) => (
                      <a
                        key={sid}
                        href={`#${sid}`}
                        className={"rounded px-2 py-1 text-[12.5px] transition " + (active === sid ? "font-semibold text-accent" : "text-faint hover:text-muted")}
                      >
                        {t(labels.sub(sid))}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default function ModuleShell({ chapters, labels, pdf, paperTitleKey, Hero, footerKeys, section, moduleRoute }) {
  const t = useT();
  const ids = chapters.flatMap((c) => [c.id, ...(c.subs || [])]);
  const active = useScrollSpy(ids);

  // Deep-link scroll: #/m/<module>/<section>.
  useEffect(() => {
    if (!section) {
      window.scrollTo({ top: 0 });
      return;
    }
    // Deferred: the legacy-anchor redirect swaps the hash right after this
    // effect, and a hash swap cancels an in-flight smooth scroll. Waiting lets
    // the URL settle so one uninterrupted scroll runs. A follow-up check jumps
    // instantly if the animation was cancelled for any reason.
    const id = setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    const verify = setTimeout(() => {
      const el = document.getElementById(section);
      if (el && Math.abs(el.getBoundingClientRect().top) > 150) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }, 1100);
    return () => { clearTimeout(id); clearTimeout(verify); };
  }, [section]);

  return (
    <PaperProvider pdf={pdf} titleKey={paperTitleKey}>
      <div className="flex min-h-screen">
        <ProgressBar />
        <Sidebar active={active} chapters={chapters} labels={labels} moduleRoute={moduleRoute} />
        <main className="min-w-0 flex-1">
          <Hero />
          <div className="mx-auto max-w-3xl px-6 pb-32 md:px-10">
            <div className="space-y-4">
              {chapters.map(({ id, Body }) => (
                <Body key={id} />
              ))}
            </div>
            <footer className="mt-20 space-y-2 border-t border-line pt-8 text-[13px] leading-relaxed text-faint">
              {footerKeys.map((k) => (
                <p key={k}><Rich>{t(k)}</Rich></p>
              ))}
            </footer>
          </div>
        </main>
      </div>
    </PaperProvider>
  );
}
