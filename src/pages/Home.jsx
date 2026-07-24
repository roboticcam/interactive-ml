import { useEffect, useState } from "react";
import { PARTS, MODULES, moduleTitle, partTitle } from "../modules/registry.js";
import { useLang, useT, LanguageSwitcher } from "../i18n/LangContext.jsx";
import { Eyebrow } from "../components/ui.jsx";

const SUBJECT_KEY = "ml-course-my-subject";

function loadSubject() {
  try {
    const v = JSON.parse(localStorage.getItem(SUBJECT_KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function StatusChip({ status }) {
  const t = useT();
  if (status === "live")
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">{t("ui.status.live")}</span>;
  if (status === "pilot")
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">{t("ui.status.pilot")}</span>;
  return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-faint">{t("ui.status.planned")}</span>;
}

function ModuleCard({ m, num, picked, onPick }) {
  const { lang } = useLang();
  const live = m.status === "live";
  // Every card is clickable: live modules open the real module; the rest open a
  // status landing page (ModuleStub) — never a dead click.
  return (
    <a href={`#/m/${m.id}`} className="block">
      <div
        className={
          "group flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition hover:border-accent hover:shadow-md " +
          (live ? "border-line bg-white" : "border-line/70 bg-panel/60")
        }
      >
        <span className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold " + (live ? "bg-accent text-white" : "bg-white text-faint ring-1 ring-line")}>
          {num}
        </span>
        <span className={"min-w-0 flex-1 truncate text-[14.5px] group-hover:text-accent " + (live ? "font-semibold text-ink" : "text-muted")}>
          {moduleTitle(m, lang)}
        </span>
        <StatusChip status={m.status} />
        <input
          type="checkbox"
          checked={picked}
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onPick(m.id); }}
          onChange={() => {}}
          className="h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
          title="My subject"
        />
      </div>
    </a>
  );
}

export default function Home() {
  const t = useT();
  const { lang } = useLang();
  const [subject, setSubject] = useState(loadSubject);
  const [onlyMine, setOnlyMine] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(SUBJECT_KEY, JSON.stringify(subject)); } catch {}
  }, [subject]);

  const toggle = (id) =>
    setSubject((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const liveCount = MODULES.filter((m) => m.status === "live").length;
  const pilotCount = MODULES.filter((m) => m.status === "pilot").length;

  let num = 0;

  return (
    <div className="min-h-screen bg-white">
      {/* hero */}
      <header className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl px-6 py-14 md:px-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Eyebrow>{t("ui.home.eyebrow")}</Eyebrow>
            <LanguageSwitcher />
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-ink md:text-6xl">
            {t("ui.home.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-ink/70">{t("ui.home.lead")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#/m/transformer" className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              {t("ui.home.cta")}
            </a>
            <span className="text-[13.5px] text-faint">
              {MODULES.length} {t("ui.home.modules")} · {liveCount} {t("ui.status.live").toLowerCase()} · {pilotCount} {t("ui.home.inproduction")}
            </span>
          </div>
        </div>
      </header>

      {/* my subject bar */}
      <div className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-2.5 md:px-10">
          <div className="text-[13.5px] text-muted">
            <span className="font-semibold text-ink">{t("ui.home.mysubject")}</span>
            <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 font-mono text-[12px] text-accent">{subject.length}</span>
            <span className="ml-3 hidden text-faint sm:inline">{t("ui.home.mysubjectHint")}</span>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
            {t("ui.home.onlymine")}
          </label>
        </div>
      </div>

      {/* curriculum */}
      <main className="mx-auto max-w-5xl px-6 pb-24 md:px-10">
        {PARTS.map((p) => {
          const mods = MODULES.filter((m) => m.part === p.id).filter((m) => !onlyMine || subject.includes(m.id));
          if (!mods.length) return null;
          return (
            <section key={p.id} className="mt-10">
              <h2 className="mb-4 text-[15px] font-bold uppercase tracking-[0.14em] text-accent">{partTitle(p, lang)}</h2>
              <div className="grid gap-2 md:grid-cols-2">
                {mods.map((m) => {
                  num += 1;
                  return <ModuleCard key={m.id} m={m} num={MODULES.indexOf(m) + 1} picked={subject.includes(m.id)} onPick={toggle} />;
                })}
              </div>
            </section>
          );
        })}
        <footer className="mt-16 border-t border-line pt-6 text-[13px] leading-relaxed text-faint">
          {t("ui.home.footer")}
        </footer>
      </main>
    </div>
  );
}
