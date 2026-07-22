import { Eyebrow } from "./ui.jsx";
import { PaperRef } from "./Paper.jsx";
import { Rich } from "../i18n/rich.jsx";
import { useT } from "../i18n/LangContext.jsx";

// A chapter wrapper: anchored, with an eyebrow + big title, matching the deck
// aesthetic. `title`/`lead` are markup strings (translatable); `paper` = {sec,
// page} renders a citation pill that opens the source PDF at that page.
export function Chapter({ id, num, eyebrow, title, lead, paper, children }) {
  const t = useT();
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-14 first:border-t-0 first:pt-0">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Eyebrow>{eyebrow || `${t("ui.chapter")} ${num}`}</Eyebrow>
        {paper ? <PaperRef page={paper.page} sec={paper.sec} /> : null}
      </div>
      <h2 className="text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-ink"><Rich>{title}</Rich></h2>
      {lead ? <p className="mt-4 max-w-2xl text-xl leading-relaxed text-ink/70"><Rich>{lead}</Rich></p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

// Subsection heading with its own anchor for deep links. Optional `paper` pill.
export function Sub({ id, children, kicker, paper }) {
  return (
    <h3 id={id} className="scroll-mt-24 mb-3 mt-12 flex flex-wrap items-baseline gap-3 text-2xl font-bold tracking-tight text-ink">
      {kicker ? <span className="font-mono text-sm font-semibold text-accent">{kicker}</span> : null}
      <span><Rich>{children}</Rich></span>
      {paper ? <span className="self-center"><PaperRef page={paper.page} sec={paper.sec} /></span> : null}
    </h3>
  );
}
