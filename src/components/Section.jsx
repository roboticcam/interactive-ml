import { Eyebrow } from "./ui.jsx";
import { PaperRef } from "./Paper.jsx";

// A chapter wrapper: anchored, with an eyebrow + big title, matching the deck
// aesthetic (generous whitespace, tracking-tight display type). `paper` = {sec, page}
// renders a citation pill that opens the source PDF at that page.
export function Chapter({ id, num, eyebrow, title, lead, paper, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-14 first:border-t-0 first:pt-0">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Eyebrow>{eyebrow || `Chapter ${num}`}</Eyebrow>
        {paper ? <PaperRef page={paper.page} sec={paper.sec} /> : null}
      </div>
      <h2 className="text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-ink">{title}</h2>
      {lead ? <p className="mt-4 max-w-2xl text-xl leading-relaxed text-ink/70">{lead}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

// Subsection heading with its own anchor for deep links. Optional `paper` pill.
export function Sub({ id, children, kicker, paper }) {
  return (
    <h3 id={id} className="scroll-mt-24 mb-3 mt-12 flex flex-wrap items-baseline gap-3 text-2xl font-bold tracking-tight text-ink">
      {kicker ? <span className="font-mono text-sm font-semibold text-accent">{kicker}</span> : null}
      {children}
      {paper ? <span className="self-center"><PaperRef page={paper.page} sec={paper.sec} /></span> : null}
    </h3>
  );
}
