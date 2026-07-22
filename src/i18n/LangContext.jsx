import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STRINGS } from "./strings.js";

// Three locales; English is the default and the fallback for any missing key.
export const LANGS = [
  { id: "en", label: "EN", name: "English" },
  { id: "zhHans", label: "简", name: "简体中文" },
  { id: "zhHant", label: "繁", name: "繁體中文" },
];
const VALID = new Set(LANGS.map((l) => l.id));
const KEY = "transformer-study-lang";

const LangCtx = createContext({ lang: "en", setLang: () => {}, t: (k) => k });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved && VALID.has(saved)) return saved;
      // Reasonable first-visit guess from the browser, still defaulting to en.
      const nav = (navigator.language || "").toLowerCase();
      if (nav.startsWith("zh")) return /hant|tw|hk|mo/.test(nav) ? "zhHant" : "zhHans";
    } catch {}
    return "en";
  });

  const setLang = (id) => {
    if (!VALID.has(id)) return;
    setLangState(id);
    try { localStorage.setItem(KEY, id); } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : lang === "zhHant" ? "zh-Hant" : "zh-Hans";
  }, [lang]);

  // t(key): returns the string for the active language, falling back to English,
  // then to the key itself (so missing keys are visible, not blank).
  const t = useMemo(() => {
    return (key) => {
      const entry = STRINGS[key];
      if (!entry) return key;
      return entry[lang] ?? entry.en ?? key;
    };
  }, [lang]);

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
export const useT = () => useContext(LangCtx).t;

export function LanguageSwitcher({ className = "" }) {
  const { lang, setLang } = useLang();
  return (
    <div className={"inline-flex rounded-lg border border-line bg-white p-0.5 " + className}>
      {LANGS.map((l) => (
        <button
          key={l.id}
          onClick={() => setLang(l.id)}
          className={
            "rounded-md px-2.5 py-1 text-[12px] font-semibold transition " +
            (lang === l.id ? "bg-accent text-white" : "text-muted hover:text-ink")
          }
          aria-pressed={lang === l.id}
          title={l.name}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
