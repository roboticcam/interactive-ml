import { useEffect, useState } from "react";
import { CHAPTERS } from "./sections/chapters.jsx";
import { Eyebrow } from "./components/ui.jsx";
import { PaperProvider, PaperRef } from "./components/Paper.jsx";

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
  const activeChapter = CHAPTERS.find((c) => c.id === active) || (CHAPTERS.find((c) => c.subs?.some((s) => s[0] === active)));
  return (
    <aside className="hidden lg:flex lg:w-[300px] lg:shrink-0 lg:flex-col lg:border-r lg:border-line lg:bg-panel">
      <div className="sticky top-0 flex h-screen flex-col">
        <a href="#top" className="block px-7 pb-5 pt-8">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">Study Companion</div>
          <div className="mt-1 text-[19px] font-extrabold leading-tight tracking-tight text-ink">
            The Transformer
          </div>
          <div className="text-[13px] text-faint">with PyTorch · Richard Xu</div>
        </a>
        <div className="px-6 pb-4">
          <PaperRef page={1} className="w-full justify-center py-2 text-[13px]">Read the full paper</PaperRef>
        </div>
        <nav className="thin-scroll flex-1 overflow-y-auto px-4 pb-10">
          {CHAPTERS.map((c) => {
            const isActive = active === c.id || c.subs?.some((s) => s[0] === active);
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
                  <span className="truncate">{c.label}</span>
                </a>
                {isActive && c.subs?.length ? (
                  <div className="ml-6 mt-0.5 flex flex-col border-l border-line pl-3">
                    {c.subs.map(([sid, slabel]) => (
                      <a
                        key={sid}
                        href={`#${sid}`}
                        className={"rounded px-2 py-1 text-[12.5px] transition " + (active === sid ? "font-semibold text-accent" : "text-faint hover:text-muted")}
                      >
                        {slabel}
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
  return (
    <header id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute left-1/3 top-10 h-64 w-64 rounded-full bg-teal-200/30 blur-3xl" />
      </div>
      <div className="px-8 py-16 md:px-14 lg:py-20">
        <Eyebrow>An interactive study companion</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-ink md:text-6xl">
          The Transformer,{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
            one tensor at a time.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/70">
          A hands-on walk through attention — from the single dot product to FlashAttention, MLA, RoPE and
          distillation. Every PyTorch operation is something you can poke, step through, and watch reshape
          live.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#dpa" className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            Start with attention →
          </a>
          <a href="#flash" className="rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-muted transition hover:border-accent hover:text-ink">
            Jump to FlashAttention
          </a>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-faint">
          <span>10 chapters</span>
          <span className="text-line">·</span>
          <span>7 interactive labs</span>
          <span className="text-line">·</span>
          <span>Based on “Transformer with PyTorch”</span>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const ids = CHAPTERS.flatMap((c) => [c.id, ...(c.subs || []).map((s) => s[0])]);
  const active = useScrollSpy(ids);

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
            <footer className="mt-20 border-t border-line pt-8 text-[13px] leading-relaxed text-faint">
              Built from <span className="font-mono">transformer.tex</span> by Richard Xu. Interactive study
              companion — poke every tensor. Every chapter links back to the source PDF.
              <br />
              Animations are hand-built with SVG + framer-motion, inspired by the visual style of{" "}
              <a href="https://github.com/3b1b" target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2 hover:text-muted">
                3blue1brown
              </a>{" "}
              — no manim or 3b1b assets are used.
            </footer>
          </div>
        </main>
      </div>
    </PaperProvider>
  );
}
