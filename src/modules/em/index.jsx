import { Chapter, Sub } from "../../components/Section.jsx";
import { Prose, Callout, DemoCard, Eyebrow } from "../../components/ui.jsx";
import { MB } from "../../components/Math.jsx";
import { Rich } from "../../i18n/rich.jsx";
import { useT, LanguageSwitcher } from "../../i18n/LangContext.jsx";
import ModuleShell from "../../components/ModuleShell.jsx";

import GMMLab from "../../components/demos/GMMLab.jsx";
import JensenDemo from "../../components/demos/JensenDemo.jsx";
import ResponsibilityDemo from "../../components/demos/ResponsibilityDemo.jsx";

const P = ({ t, k }) => <Prose><Rich>{t(k)}</Rich></Prose>;
const IMG = (name) => import.meta.env.BASE_URL + "em/" + name;

// ─────────────────────────────────────────────────────────────────────────────
function Motivation() {
  const t = useT();
  return (
    <Chapter id="em-motivation" num={1} title={t("em.ch1.title")} paper={{ sec: "1", page: 1 }} lead={t("em.ch1.lead")}>
      <P t={t} k="em.ch1.p1" />
      <div className="my-5 flex flex-wrap gap-4">
        <img src={IMG("gmm_data_3_mixtures.jpg")} alt="3-mixture data" className="w-[46%] min-w-[260px] rounded-xl border border-line" />
        <img src={IMG("gmm_result_3_mixtures.jpg")} alt="GMM fit" className="w-[46%] min-w-[260px] rounded-xl border border-line" />
      </div>
      <P t={t} k="em.ch1.p2" />
      <MB>{"p(x) = \\sum_{l=1}^{k} \\alpha_l\\, \\mathcal{N}(x \\mid \\mu_l, \\Sigma_l), \\qquad \\sum_{l=1}^{k} \\alpha_l = 1"}</MB>
      <P t={t} k="em.ch1.p3" />
      <MB>{"\\Theta_{\\text{MLE}} = \\arg\\max_{\\Theta} \\sum_{i=1}^{n} \\log \\sum_{l=1}^{k} \\alpha_l\\, \\mathcal{N}(x_i \\mid \\mu_l, \\Sigma_l)"}</MB>
      <Callout kind="warn" title={t("em.ch1.callout.label")}><Rich>{t("em.ch1.callout")}</Rich></Callout>
      <P t={t} k="em.ch1.p4" />
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Preliminaries() {
  const t = useT();
  return (
    <Chapter id="em-jensen" num={2} title={t("em.ch2.title")} paper={{ sec: "2", page: 3 }} lead={t("em.ch2.lead")}>
      <P t={t} k="em.ch2.p1" />
      <MB>{"\\phi\\big((1-t)x_1 + t x_2\\big) \\le (1-t)\\,\\phi(x_1) + t\\,\\phi(x_2), \\qquad t \\in [0,1]"}</MB>
      <DemoCard title={t("em.ch2.demo.title")} subtitle={t("em.ch2.demo.sub")}>
        <JensenDemo />
      </DemoCard>
      <P t={t} k="em.ch2.p2" />
      <MB>{"\\phi\\Big(\\mathbb{E}[f(x)]\\Big) \\le \\mathbb{E}\\big[\\phi(f(x))\\big] \\quad (\\phi \\text{ convex}), \\qquad \\log\\big(\\mathbb{E}[f(x)]\\big) \\ge \\mathbb{E}\\big[\\log f(x)\\big]"}</MB>
      <Callout kind="key"><Rich>{t("em.ch2.callout")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Algorithm() {
  const t = useT();
  return (
    <Chapter id="em-algorithm" num={3} title={t("em.ch3.title")} paper={{ sec: "3", page: 4 }} lead={t("em.ch3.lead")}>
      <P t={t} k="em.ch3.p1" />
      <MB>{"\\Theta^{(g+1)} = \\arg\\max_{\\Theta} \\left( \\int_Z \\log\\big(p(X, Z \\mid \\Theta)\\big)\\, p(Z \\mid X, \\Theta^{(g)}) \\,\\mathrm{d}Z \\right)"}</MB>
      <P t={t} k="em.ch3.p2" />
      <MB>{"\\log p(X \\mid \\Theta^{(g+1)}) \\;\\ge\\; \\log p(X \\mid \\Theta^{(g)}) \\qquad \\forall g"}</MB>
      <Callout kind="note" title={t("em.ch3.callout.label")}><Rich>{t("em.ch3.callout")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Convergence() {
  const t = useT();
  return (
    <Chapter id="em-convergence" num={4} title={t("em.ch4.title")} paper={{ sec: "4", page: 5 }} lead={t("em.ch4.lead")}>
      <P t={t} k="em.ch4.p1" />
      <MB>{"\\mathcal{L}(\\Theta \\mid X) = \\underbrace{\\int_Z \\log\\Big(\\tfrac{p(X,Z\\mid\\Theta)}{q(Z)}\\Big) q(Z)\\,\\mathrm{d}Z}_{\\text{ELBO}(\\Theta,\\,q)} + \\underbrace{\\int_Z \\log\\Big(\\tfrac{q(Z)}{p(Z\\mid X,\\Theta)}\\Big) q(Z)\\,\\mathrm{d}Z}_{\\mathrm{KL}\\left(q \\,\\|\\, p(Z\\mid X,\\Theta)\\right)\\; \\ge\\; 0}"}</MB>
      <Sub id="em-step1" kicker="4.1">{t("em.ch4.h.step1")}</Sub>
      <P t={t} k="em.ch4.p2" />
      <MB>{"q^*(\\cdot) = \\arg\\max_q \\,\\text{ELBO}(\\Theta^{(g)}, q) = p(Z \\mid X, \\Theta^{(g)}) \\;\\implies\\; \\text{ELBO}(\\Theta^{(g)}, q^*) = \\mathcal{L}(\\Theta^{(g)} \\mid X)"}</MB>
      <Sub id="em-step2" kicker="4.2">{t("em.ch4.h.step2")}</Sub>
      <P t={t} k="em.ch4.p3" />
      <MB>{"\\mathcal{L}(\\Theta \\mid X) = \\underbrace{\\int_Z \\log\\big(p(Z, X \\mid \\Theta)\\big)\\, p(Z\\mid X, \\Theta^{(g)}) \\mathrm{d}Z}_{Q(\\Theta \\mid \\Theta^{(g)})} \\; \\underbrace{- \\int_Z \\log\\big(p(Z \\mid X, \\Theta)\\big)\\, p(Z\\mid X, \\Theta^{(g)}) \\mathrm{d}Z}_{H(\\Theta \\mid \\Theta^{(g)})}"}</MB>
      <P t={t} k="em.ch4.p4" />
      <MB>{"\\mathcal{L}(\\Theta^{(g+1)}\\mid X) = Q(\\Theta^{(g+1)} \\mid \\Theta^{(g)}) + H(\\Theta^{(g+1)} \\mid \\Theta^{(g)}) \\;\\ge\\; Q(\\Theta^{(g)} \\mid \\Theta^{(g)}) + H(\\Theta^{(g)} \\mid \\Theta^{(g)}) = \\mathcal{L}(\\Theta^{(g)}\\mid X)"}</MB>
      <Callout kind="key"><Rich>{t("em.ch4.callout")}</Rich></Callout>
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function GMMExample() {
  const t = useT();
  return (
    <Chapter id="em-gmm" num={5} title={t("em.ch5.title")} paper={{ sec: "5", page: 8 }} lead={t("em.ch5.lead")}>
      <P t={t} k="em.ch5.p1" />
      <MB>{"p(X, Z \\mid \\Theta) = \\prod_{i=1}^{n} \\alpha_{z_i} \\mathcal{N}(x_i \\mid \\mu_{z_i}, \\Sigma_{z_i}), \\qquad p(Z \\mid X, \\Theta) = \\prod_{i=1}^{n} \\frac{\\alpha_{z_i} \\mathcal{N}(x_i \\mid \\mu_{z_i}, \\Sigma_{z_i})}{\\sum_{l=1}^{k} \\alpha_l \\mathcal{N}(x_i \\mid \\mu_l, \\Sigma_l)}"}</MB>

      <Sub id="em-resp" kicker="5.1" paper={{ sec: "5.3", page: 9 }}>{t("em.ch5.h.resp")}</Sub>
      <P t={t} k="em.ch5.p2" />
      <MB>{"p(l \\mid x_i, \\Theta^{(g)}) = \\frac{\\alpha_l\\, \\mathcal{N}(x_i \\mid \\mu_l, \\Sigma_l)}{\\sum_{s=1}^{k} \\alpha_s\\, \\mathcal{N}(x_i \\mid \\mu_s, \\Sigma_s)}"}</MB>
      <DemoCard title={t("em.ch5.demo1.title")} subtitle={t("em.ch5.demo1.sub")}>
        <ResponsibilityDemo />
      </DemoCard>

      <Sub id="em-updates" kicker="5.2" paper={{ sec: "5.6", page: 13 }}>{t("em.ch5.h.updates")}</Sub>
      <P t={t} k="em.ch5.p3" />
      <MB>{"\\alpha_l^{(g+1)} = \\frac{1}{n} \\sum_{i=1}^{n} p(l \\mid x_i, \\Theta^{(g)}) \\qquad \\mu_l^{(g+1)} = \\frac{\\sum_i x_i\\, p(l \\mid x_i, \\Theta^{(g)})}{\\sum_i p(l \\mid x_i, \\Theta^{(g)})}"}</MB>
      <MB>{"\\Sigma_l^{(g+1)} = \\frac{\\sum_i [x_i - \\mu_l^{(g+1)}][x_i - \\mu_l^{(g+1)}]^{\\top}\\, p(l \\mid x_i, \\Theta^{(g)})}{\\sum_i p(l \\mid x_i, \\Theta^{(g)})}"}</MB>
      <P t={t} k="em.ch5.p4" />

      <Sub id="em-lab" kicker="5.3">{t("em.ch5.h.lab")}</Sub>
      <DemoCard title={t("em.ch5.demo2.title")} subtitle={t("em.ch5.demo2.sub")}>
        <GMMLab />
      </DemoCard>
      <Callout kind="key"><Rich>{t("em.ch5.callout")}</Rich></Callout>
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
        <Rich>{t("em.ex." + n + ".q")}</Rich>
        <span className="ml-2 text-[12px] font-semibold text-accent group-open:hidden">{t("em.ex.show")}</span>
      </summary>
      <div className="border-t border-indigo-100 px-5 py-3.5 text-[14.5px] leading-relaxed text-muted">
        <Rich>{t("em.ex." + n + ".a")}</Rich>
      </div>
    </details>
  );
}

function Exercises() {
  const t = useT();
  return (
    <Chapter id="em-exercises" num={6} title={t("em.ch6.title")} paper={{ sec: "6", page: 15 }} lead={t("em.ch6.lead")}>
      {[1, 2, 3, 4, 5].map((n) => <Exercise key={n} n={n} />)}
    </Chapter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function EMHero() {
  const t = useT();
  return (
    <header className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute left-1/3 top-10 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>
      <div className="px-8 py-16 md:px-14 lg:py-20">
        <div className="mb-4 flex items-center gap-3">
          <Eyebrow>{t("em.hero.eyebrow")}</Eyebrow>
          <span className="lg:hidden"><LanguageSwitcher /></span>
        </div>
        <h1 className="mt-2 max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-ink md:text-6xl">
          {t("em.hero.title")}{" "}
          <span className="bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">{t("em.hero.titleAccent")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/70">{t("em.hero.lead")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#em-motivation" className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            {t("em.hero.cta1")}
          </a>
          <a href="#em-lab" className="rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-muted transition hover:border-accent hover:text-ink">
            {t("em.hero.cta2")}
          </a>
        </div>
      </div>
    </header>
  );
}

export const EM_CHAPTERS = [
  { id: "em-motivation", num: 1, Body: Motivation, subs: [] },
  { id: "em-jensen", num: 2, Body: Preliminaries, subs: [] },
  { id: "em-algorithm", num: 3, Body: Algorithm, subs: [] },
  { id: "em-convergence", num: 4, Body: Convergence, subs: ["em-step1", "em-step2"] },
  { id: "em-gmm", num: 5, Body: GMMExample, subs: ["em-resp", "em-updates", "em-lab"] },
  { id: "em-exercises", num: 6, Body: Exercises, subs: [] },
];

export default function EMModule({ section }) {
  return (
    <ModuleShell
      chapters={EM_CHAPTERS}
      labels={{
        kicker: "em.sidebar.kicker",
        title: "em.sidebar.title",
        subtitle: "em.sidebar.subtitle",
        readpaper: "ui.sidebar.readpaper",
        nav: (id) => "em.nav." + id,
        sub: (id) => "em.sub." + id,
      }}
      pdf="em.pdf"
      paperTitleKey="em.paper.title"
      Hero={EMHero}
      footerKeys={["em.footer"]}
      section={section}
      moduleRoute="#/m/em"
    />
  );
}
