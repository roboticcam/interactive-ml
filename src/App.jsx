import { useEffect, useState } from "react";
import { CHAPTERS } from "./sections/chapters.jsx";
import { Eyebrow } from "./components/ui.jsx";
import { PaperProvider, PaperRef, usePaper } from "./components/Paper.jsx";
import { Rich } from "./i18n/rich.jsx";
import { useT, LanguageSwitcher } from "./i18n/LangContext.jsx";
import { useHashRoute } from "./lib/router.js";
import Home from "./pages/Home.jsx";
import ModuleStub from "./pages/ModuleStub.jsx";
import EMModule from "./modules/em/index.jsx";
import { getModule } from "./modules/registry.js";

// Anchors that belong to the Transformer module — legacy links (#dpa …, incl.
// the PDF's "OPEN IN APP" badges) get redirected to #/m/transformer/<anchor>.
const TRANSFORMER_IDS = new Set(CHAPTERS.flatMap((c) => [c.id, ...(c.subs || [])]));

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

function Sidebar({ active }) {
  const t = useT();
  const { isOpen, close } = usePaper();
  return (
    <aside className="hidden lg:flex lg:w-[300px] lg:shrink-0 lg:flex-col lg:border-r lg:border-line lg:bg-panel">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="flex items-start justify-between gap-2 px-7 pb-2 pt-7">
          <a href="#/m/transformer" className="block">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">{t("ui.sidebar.kicker")}</div>
            <div className="mt-1 text-[19px] font-extrabold leading-tight tracking-tight text-ink">{t("ui.sidebar.title")}</div>
            <div className="text-[13px] text-faint">{t("ui.sidebar.subtitle")}</div>
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
            <PaperRef page={1} className="w-full justify-center py-2 text-[13px]">{t("ui.sidebar.readpaper")}</PaperRef>
          )}
        </div>
        <nav className="thin-scroll flex-1 overflow-y-auto px-4 pb-10">
          {CHAPTERS.map((c) => {
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
                  <span className="truncate">{t("nav." + c.id)}</span>
                </a>
                {isActive && c.subs?.length ? (
                  <div className="ml-6 mt-0.5 flex flex-col border-l border-line pl-3">
                    {c.subs.map((sid) => (
                      <a
                        key={sid}
                        href={`#${sid}`}
                        className={"rounded px-2 py-1 text-[12.5px] transition " + (active === sid ? "font-semibold text-accent" : "text-faint hover:text-muted")}
                      >
                        {t("sub." + sid)}
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

function Hero() {
  const t = useT();
  return (
    <header id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute left-1/3 top-10 h-64 w-64 rounded-full bg-teal-200/30 blur-3xl" />
      </div>
      <div className="px-8 py-16 md:px-14 lg:py-20">
        <div className="mb-4 flex items-center gap-3">
          <Eyebrow>{t("ui.hero.eyebrow")}</Eyebrow>
          <span className="lg:hidden"><LanguageSwitcher /></span>
        </div>
        <h1 className="mt-2 max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-ink md:text-6xl">
          {t("ui.hero.title")}{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
            {t("ui.hero.titleAccent")}
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/70">{t("ui.hero.lead")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#dpa" className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            {t("ui.hero.cta1")}
          </a>
          <a href="#flash" className="rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-muted transition hover:border-accent hover:text-ink">
            {t("ui.hero.cta2")}
          </a>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-faint">
          <span>{t("ui.hero.stat1")}</span>
          <span className="text-line">·</span>
          <span>{t("ui.hero.stat2")}</span>
          <span className="text-line">·</span>
          <span>{t("ui.hero.stat3")}</span>
        </div>
      </div>
    </header>
  );
}

function TransformerModule({ section }) {
  const t = useT();
  const ids = CHAPTERS.flatMap((c) => [c.id, ...(c.subs || [])]);
  const active = useScrollSpy(ids);

  // Deep-link scroll: #/m/transformer/<section>.
  useEffect(() => {
    if (!section) {
      window.scrollTo({ top: 0 });
      return;
    }
    requestAnimationFrame(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [section]);

  return (
    <PaperProvider>
      <div className="flex min-h-screen">
        <ProgressBar />
        <Sidebar active={active} />
        <main className="min-w-0 flex-1">
          <Hero />
          <div className="mx-auto max-w-3xl px-6 pb-32 md:px-10">
            <div className="space-y-4">
              {CHAPTERS.map(({ id, Body }) => (
                <Body key={id} />
              ))}
            </div>
            <footer className="mt-20 space-y-2 border-t border-line pt-8 text-[13px] leading-relaxed text-faint">
              <p><Rich>{t("ui.footer.1")}</Rich></p>
              <p><Rich>{t("ui.footer.2")}</Rich></p>
            </footer>
          </div>
        </main>
      </div>
    </PaperProvider>
  );
}

export default function App() {
  const route = useHashRoute();

  // Legacy anchors (#dpa …) → module route, keeping PDF back-links working.
  useEffect(() => {
    if (route.legacy && TRANSFORMER_IDS.has(route.legacy)) {
      window.location.replace("#/m/transformer/" + route.legacy);
    } else if (route.legacy === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [route.legacy]);

  const seg = route.seg || [];
  if (seg[0] === "m" && seg[1] === "transformer") {
    return <TransformerModule section={seg[2]} />;
  }
  if (seg[0] === "m" && seg[1] === "em") {
    return <EMModule section={seg[2]} />;
  }
  if (seg[0] === "m" && seg[1] && getModule(seg[1])) {
    // Not-yet-live modules get a status landing page (never a dead click).
    return <ModuleStub id={seg[1]} />;
  }
  if (route.legacy && TRANSFORMER_IDS.has(route.legacy)) {
    // Render the module immediately while the redirect happens (no flash).
    return <TransformerModule section={route.legacy} />;
  }
  return <Home />;
}
