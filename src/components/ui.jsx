// Shared presentational building blocks. Same visual DNA as the SlideSmith
// "snow" palette: white canvas, slate ink, indigo accent, generous type.
import { useT } from "../i18n/LangContext.jsx";

export function Eyebrow({ children, className = "" }) {
  return (
    <div className={"text-xs font-semibold uppercase tracking-[0.2em] text-accent " + className}>{children}</div>
  );
}

export function Prose({ children, className = "" }) {
  return <p className={"text-[17px] leading-[1.75] text-muted " + className}>{children}</p>;
}

export function Lead({ children }) {
  return <p className="text-xl leading-relaxed text-ink/80">{children}</p>;
}

// A titled interactive/figure card that visually separates "play with this"
// content from the reading flow.
export function DemoCard({ title, subtitle, children, tone = "accent" }) {
  const t = useT();
  const bar = tone === "accent" ? "bg-accent" : "bg-emerald-500";
  return (
    <div className="my-7 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_0_rgba(15,23,42,0.03),0_12px_32px_-18px_rgba(15,23,42,0.25)]">
      <div className="flex items-start gap-3 border-b border-line bg-panel px-5 py-3.5">
        <div className={"mt-1 h-8 w-1.5 shrink-0 rounded-full " + bar} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">{t("ui.interactive")}</span>
          </div>
          <div className="text-[15px] font-semibold text-ink">{title}</div>
          {subtitle ? <div className="text-[13px] text-faint">{subtitle}</div> : null}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Callout({ children, kind = "note", title }) {
  const t = useT();
  const map = {
    note: { ring: "border-indigo-200", bg: "bg-indigo-50/60", dot: "text-accent", label: title || t("ui.callout.note") },
    key: { ring: "border-amber-200", bg: "bg-amber-50/70", dot: "text-amber-600", label: title || t("ui.callout.key") },
    warn: { ring: "border-rose-200", bg: "bg-rose-50/70", dot: "text-rose-600", label: title || t("ui.callout.warn") },
  };
  const s = map[kind] || map.note;
  return (
    <div className={"my-5 rounded-xl border " + s.ring + " " + s.bg + " px-5 py-4"}>
      <div className={"mb-1 text-xs font-bold uppercase tracking-[0.14em] " + s.dot}>{s.label}</div>
      <div className="text-[15.5px] leading-relaxed text-ink/85">{children}</div>
    </div>
  );
}

export function ShapePill({ children }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[12px] font-medium text-slate-100">
      {children}
    </span>
  );
}
