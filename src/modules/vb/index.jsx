import { Chapter, Sub } from "../../components/Section.jsx";
import { Prose, Callout, DemoCard, Eyebrow } from "../../components/ui.jsx";
import { MB } from "../../components/Math.jsx";
import { Rich } from "../../i18n/rich.jsx";
import { useT, LanguageSwitcher } from "../../i18n/LangContext.jsx";
import ModuleShell from "../../components/ModuleShell.jsx";

import ELBOSeesaw from "../../components/demos/ELBOSeesaw.jsx";
import NormalGammaCAVI from "../../components/demos/NormalGammaCAVI.jsx";
import MeanFieldEllipse from "../../components/demos/MeanFieldEllipse.jsx";

const P = ({ t, k }) => <Prose><Rich>{t(k)}</Rich></Prose>;

// ─────────────────────────────────────────────────────────────────────────────
function Motivation() {
  const t = useT();
  return (
    <Chapter id="vb-motivation" num={1} title={t("vb.ch1.title")} paper={{ sec: "1", page: 4 }} lead={t("vb.ch1.lead")}>
      <P t={t} k="vb.ch1.p1" />
      <MB>{"p(\\mathbf{z} \\mid \\mathbf{x}) = \\frac{\\overbrace{p(\\mathbf{x} \\mid \\mathbf{z})}^{\\text{known}}\\;\\overbrace{p(\\mathbf{z})}^{\\text{known}}}{\\underbrace{\\int_{\\mathbf{z}'} p(\\mathbf{x}\\mid\\mathbf{z}')\\,p(\\mathbf{z}')\\,\\mathrm{d}\\mathbf{z}'}_{\\text{intractable}}}"}</MB>
      <P t={t} k="vb.ch1.p2" />
      <Callout kind="key"><Rich>{t("vb.ch1.callout")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Elbo() {
  const t = useT();
  return (
    <Chapter id="vb-elbo" num={2} title={t("vb.ch2.title")} paper={{ sec: "2", page: 6 }} lead={t("vb.ch2.lead")}>
      <P t={t} k="vb.ch2.p1" />
      <MB>{"\\log p(\\mathbf{x}) = \\log \\mathbb{E}_{\\mathbf{z}\\sim q}\\!\\left[\\frac{p(\\mathbf{x},\\mathbf{z})}{q(\\mathbf{z})}\\right] \\;\\ge\\; \\mathbb{E}_{\\mathbf{z}\\sim q}\\!\\left[\\log\\frac{p(\\mathbf{x},\\mathbf{z})}{q(\\mathbf{z})}\\right] = \\text{ELBO}(q)"}</MB>
      <P t={t} k="vb.ch2.p2" />
      <MB>{"\\log p(\\mathbf{x}) = \\underbrace{\\int q(\\mathbf{z})\\log\\frac{p(\\mathbf{x},\\mathbf{z})}{q(\\mathbf{z})}\\,\\mathrm{d}\\mathbf{z}}_{\\text{ELBO}(q)\\;\\text{— computable}} + \\underbrace{\\int q(\\mathbf{z})\\log\\frac{q(\\mathbf{z})}{p(\\mathbf{z}\\mid\\mathbf{x})}\\,\\mathrm{d}\\mathbf{z}}_{\\mathrm{KL}(q\\,\\|\\,p)\\;\\ge\\;0\\;\\text{— not computable}}"}</MB>
      <DemoCard title={t("vb.ch2.demo.title")} subtitle={t("vb.ch2.demo.sub")}>
        <ELBOSeesaw />
      </DemoCard>
      <Callout kind="key"><Rich>{t("vb.ch2.callout")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function MeanField() {
  const t = useT();
  return (
    <Chapter id="vb-meanfield" num={3} title={t("vb.ch3.title")} paper={{ sec: "3", page: 8 }} lead={t("vb.ch3.lead")}>
      <P t={t} k="vb.ch3.p1" />
      <MB>{"q(\\mathbf{z}) = \\prod_{i=1}^{M} q_i(z_i)"}</MB>
      <P t={t} k="vb.ch3.p2" />
      <MB>{"\\text{ELBO}(q_j) = -\\,\\mathrm{KL}\\Big(q_j(z_j)\\,\\Big\\|\\,\\exp\\big(\\mathbb{E}_{\\mathbf{z}\\setminus z_j}[\\log p(\\mathbf{x},\\mathbf{z})]\\big)\\Big) + \\text{const}"}</MB>
      <P t={t} k="vb.ch3.p3" />
      <MB>{"\\log q_j^*(z_j) = \\mathbb{E}_{\\mathbf{z}\\setminus z_j}\\big[\\log p(\\mathbf{x},\\mathbf{z})\\big] + \\text{const}"}</MB>
      <Sub id="vb-cavi" kicker="3.1">{t("vb.ch3.h.cavi")}</Sub>
      <P t={t} k="vb.ch3.p4" />
      <MB>{"q_1^{(t)} \\leftarrow \\exp\\big(\\mathbb{E}_{q_2^{(t-1)} q_3^{(t-1)}}[\\log p]\\big), \\quad q_2^{(t)} \\leftarrow \\exp\\big(\\mathbb{E}_{q_1^{(t)} q_3^{(t-1)}}[\\log p]\\big), \\quad q_3^{(t)} \\leftarrow \\exp\\big(\\mathbb{E}_{q_1^{(t)} q_2^{(t)}}[\\log p]\\big)"}</MB>
      <Callout kind="note" title={t("vb.ch3.callout.label")}><Rich>{t("vb.ch3.callout")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function NormalGamma() {
  const t = useT();
  return (
    <Chapter id="vb-normalgamma" num={4} title={t("vb.ch4.title")} paper={{ sec: "4", page: 11 }} lead={t("vb.ch4.lead")}>
      <P t={t} k="vb.ch4.p1" />
      <MB>{"p(\\mathcal{D}\\mid\\mu,\\tau) = \\Big(\\tfrac{\\tau}{2\\pi}\\Big)^{n/2}\\exp\\Big(-\\tfrac{\\tau}{2}\\sum_i (x_i-\\mu)^2\\Big), \\quad p(\\mu\\mid\\tau) = \\mathcal{N}(\\mu_0, (\\lambda_0\\tau)^{-1}), \\quad p(\\tau) = \\text{Gamma}(a_0, b_0)"}</MB>
      <P t={t} k="vb.ch4.p2" />
      <MB>{"q_\\mu^*(\\mu) = \\mathcal{N}\\Big(\\tfrac{n\\bar{x}+\\lambda_0\\mu_0}{n+\\lambda_0},\\; \\big[\\mathbb{E}_{q_\\tau}[\\tau](n+\\lambda_0)\\big]^{-1}\\Big) \\qquad q_\\tau^*(\\tau) = \\text{Gamma}(a_n, b_n)"}</MB>
      <P t={t} k="vb.ch4.p3" />
      <MB>{"\\mathbb{E}_{q_\\tau}[\\tau] = \\frac{a_n}{b_n}, \\qquad \\mathbb{E}_{q_\\mu}[\\mu^2] = \\frac{1}{\\mathbb{E}[\\tau](n+\\lambda_0)} + \\mathbb{E}[\\mu]^2"}</MB>
      <DemoCard title={t("vb.ch4.demo.title")} subtitle={t("vb.ch4.demo.sub")}>
        <NormalGammaCAVI />
      </DemoCard>
      <Callout kind="key"><Rich>{t("vb.ch4.callout")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function ExpFam() {
  const t = useT();
  return (
    <Chapter id="vb-expfam" num={5} title={t("vb.ch5.title")} paper={{ sec: "6", page: 20 }} lead={t("vb.ch5.lead")}>
      <P t={t} k="vb.ch5.p1" />
      <MB>{"h(x)\\,\\exp\\big(T(x)^\\top\\eta - A(\\eta)\\big), \\qquad \\mathcal{N}(x;\\mu,\\sigma^2): \\; T(x)=[x,\\;x^2], \\;\\; \\eta = \\Big[\\tfrac{\\mu}{\\sigma^2},\\; -\\tfrac{1}{2\\sigma^2}\\Big]"}</MB>
      <P t={t} k="vb.ch5.p2" />
      <MB>{"\\eta_j = \\mathbb{E}_{q(\\mathbf{z}\\setminus z_j)}\\big[\\eta_{\\text{post}}(\\mathbf{z}\\setminus z_j)\\big]"}</MB>
      <Sub id="vb-2dgauss" kicker="5.1">{t("vb.ch5.h.2d")}</Sub>
      <P t={t} k="vb.ch5.p3" />
      <DemoCard title={t("vb.ch5.demo.title")} subtitle={t("vb.ch5.demo.sub")}>
        <MeanFieldEllipse />
      </DemoCard>
      <Sub id="vb-lda" kicker="5.2">{t("vb.ch5.h.lda")}</Sub>
      <P t={t} k="vb.ch5.p4" />
      <MB>{"\\phi_{d,n}^{k} \\propto e^{\\Psi(\\gamma_{d,k}) + \\Psi(\\lambda_{k,w_{d,n}}) - \\Psi(\\sum_v \\lambda_{k,v})}, \\qquad \\gamma_d = \\alpha + \\sum_n \\phi_{d,n}, \\qquad \\lambda_k = \\xi + \\sum_{d,n} w_{d,n}\\phi^k_{d,n}"}</MB>
      <Callout kind="key"><Rich>{t("vb.ch5.callout")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Exercise({ n }) {
  const t = useT();
  return (
    <details className="group my-3 rounded-xl border border-line bg-white open:border-indigo-200 open:bg-indigo-50/40">
      <summary className="cursor-pointer list-none px-5 py-3.5 text-[15px] leading-relaxed text-ink/85 marker:content-none">
        <span className="mr-2 font-mono text-[12px] font-bold text-accent">{n}.</span>
        <Rich>{t("vb.ex." + n + ".q")}</Rich>
        <span className="ml-2 text-[12px] font-semibold text-accent group-open:hidden">{t("em.ex.show")}</span>
      </summary>
      <div className="border-t border-indigo-100 px-5 py-3.5 text-[14.5px] leading-relaxed text-muted">
        <Rich>{t("vb.ex." + n + ".a")}</Rich>
      </div>
    </details>
  );
}

function Exercises() {
  const t = useT();
  return (
    <Chapter id="vb-exercises" num={6} title={t("vb.ch6.title")} lead={t("vb.ch6.lead")}>
      {[1, 2, 3, 4].map((n) => <Exercise key={n} n={n} />)}
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function VBHero() {
  const t = useT();
  return (
    <header className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute left-1/3 top-10 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>
      <div className="px-8 py-16 md:px-14 lg:py-20">
        <div className="mb-4 flex items-center gap-3">
          <Eyebrow>{t("vb.hero.eyebrow")}</Eyebrow>
          <span className="lg:hidden"><LanguageSwitcher /></span>
        </div>
        <h1 className="mt-2 max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-ink md:text-6xl">
          {t("vb.hero.title")}{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">{t("vb.hero.titleAccent")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/70">{t("vb.hero.lead")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#vb-motivation" className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            {t("vb.hero.cta1")}
          </a>
          <a href="#vb-normalgamma" className="rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-muted transition hover:border-accent hover:text-ink">
            {t("vb.hero.cta2")}
          </a>
        </div>
      </div>
    </header>
  );
}

export const VB_CHAPTERS = [
  { id: "vb-motivation", num: 1, Body: Motivation, subs: [] },
  { id: "vb-elbo", num: 2, Body: Elbo, subs: [] },
  { id: "vb-meanfield", num: 3, Body: MeanField, subs: ["vb-cavi"] },
  { id: "vb-normalgamma", num: 4, Body: NormalGamma, subs: [] },
  { id: "vb-expfam", num: 5, Body: ExpFam, subs: ["vb-2dgauss", "vb-lda"] },
  { id: "vb-exercises", num: 6, Body: Exercises, subs: [] },
];

export default function VBModule({ section }) {
  return (
    <ModuleShell
      chapters={VB_CHAPTERS}
      labels={{
        kicker: "vb.sidebar.kicker",
        title: "vb.sidebar.title",
        subtitle: "vb.sidebar.subtitle",
        readpaper: "ui.sidebar.readpaper",
        nav: (id) => "vb.nav." + id,
        sub: (id) => "vb.sub." + id,
      }}
      pdf="vb.pdf"
      paperTitleKey="vb.paper.title"
      Hero={VBHero}
      footerKeys={["vb.footer"]}
      section={section}
      moduleRoute="#/m/vb"
    />
  );
}
