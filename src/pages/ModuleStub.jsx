import { getModule, moduleTitle, PARTS, partTitle } from "../modules/registry.js";
import { useLang, useT, LanguageSwitcher } from "../i18n/LangContext.jsx";
import { Eyebrow } from "../components/ui.jsx";

// Landing page for modules that are not live yet — gives every card on the
// content page somewhere real to go, with status + what's coming.
export default function ModuleStub({ id }) {
  const t = useT();
  const { lang } = useLang();
  const m = getModule(id);
  if (!m) {
    window.location.replace("#/");
    return null;
  }
  const part = PARTS.find((p) => p.id === m.part);
  const pilot = m.status === "pilot";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <div className="mb-10 flex items-center justify-between">
          <a href="#/" className="text-[13.5px] font-medium text-muted hover:text-accent">← {t("ui.module.allmodules")}</a>
          <LanguageSwitcher />
        </div>

        <Eyebrow className="mb-3">{part ? partTitle(part, lang) : ""}</Eyebrow>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink">{moduleTitle(m, lang)}</h1>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13.5px] font-semibold" style={{
            borderColor: pilot ? "#fcd34d" : "#e2e8f0",
            background: pilot ? "#fffbeb" : "#f8fafc",
            color: pilot ? "#b45309" : "#64748b",
          }}>
          {pilot ? "🛠 " : "🗓 "}{pilot ? t("ui.status.pilot") : t("ui.status.planned")}
        </div>

        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted">
          {pilot ? t("ui.stub.pilot") : t("ui.stub.planned")}
        </p>

        <div className="mt-8 rounded-xl border border-line bg-panel px-5 py-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-faint">{t("ui.stub.source")}</div>
          <div className="mt-1 font-mono text-[13.5px] text-ink/80">{m.src}</div>
        </div>

        <div className="mt-10">
          <a href="#/m/transformer" className="rounded-xl bg-accent px-5 py-3 text-[14.5px] font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            {t("ui.stub.trylive")}
          </a>
        </div>
      </div>
    </div>
  );
}
