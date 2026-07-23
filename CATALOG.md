# CATALOG — Prof Richard Xu's ML Course (Phase 0 inventory)

**Status: APPROVED (2026-07-23) with decisions:** pilots = **EM (3.2), MCMC (3.5), VB (3.3)**;
NN tracks **merged** (1.5 `foundation_neural_network.tex` is the single NN module; `deep_learning/neural_networks.tex`
becomes supplementary within it); *thin* sources **folded into neighbours** (measure theory→0.3 appendix,
dim-reduction→1.6, ADMM→2.2, covering numbers→7.3, stability→7.1); exclusions **confirmed**.
Net: **62 modules** after folds (canonical list = `src/modules/registry.js`). Order remains editable by Richard at any time. Corpus scanned: 245 `.tex` (228 under `Presentations/`,
17 under `HKBU/MATH3836/latex_notes/`) + 1 PPTX. Rules applied: article-class preferred over Beamer;
Beamer only when it's the sole version; duplicates/conflicts/backups dropped; talks & research drafts
excluded. **Bold** = module primary source. `(B)` = beamer-only topic. *thin* = short source, consider
merging. Paths are relative to `Presentations/` unless prefixed `M38:` (= `HKBU/MATH3836/latex_notes/`).

## Proposed curriculum (≈50 modules in 10 parts — trim/reorder as you wish)

### Part 0 — Getting Started
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 0.1 | What is AI/ML/DL? | **data_science/ai_ml_dl.tex** (B) | 797 | Intro-level opener |
| 0.2 | Mathematics supplement | **M38: math_supplement.tex** | 633 | + drop cheat-sheet (75) |
| 0.3 | Probability & estimation | **estimation/probability.tex** (B) | 1255 | merge estimation/statistics.tex (561) |
| 0.4 | Bayesian basics | **em/em_notes.tex** | 1314 | overlaps estimation/bayesian.tex (B) — subsume |
| 0.5 | Measure theory | **measure_theory/measure_theory.tex** | 314 | *thin* — appendix candidate |

### Part I — Statistical ML (MATH3836 Data Mining track; `foundation_*` series is canonical)
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 1.1 | Bayesian classification & belief nets | **M38: foundation_simple_bayes.tex** | 1253 | Topic_4.tex (2012) + Topic_4_B (B) subsumed |
| 1.2 | Model evaluation | **M38: foundation_model_evaluation.tex** | 757 | |
| 1.3 | Decision trees | **M38: foundation_decision_tree.tex** | 1296 | Topic_5 subsumed |
| 1.4 | Regression & PageRank | **M38: foundation_regression.tex** | 885 | deep_learning/regression.tex (B,1401) = advanced complement |
| 1.5 | Neural-network essentials | **M38: foundation_neural_network.tex** | 3650 | largest M38 file; Topic_6/7 subsumed |
| 1.6 | Unsupervised learning | **M38: foundation_unsupervised.tex** | 1384 | Topic_8 / ml_foundation.tex subsumed |
| 1.7 | Dimension reduction | **M38: dim_reduction.tex** | 395 | *thin*; legacy beamer dup dropped |
| 1.8 | Recommender systems | **M38: foundation_recommender.tex** | 1237 | data_science/recommendation.tex (B) subsumed |

### Part II — Optimization
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 2.1 | Gradient descent fundamentals | **optimization/gradient_desend_fundamental.tex** | 8044 | biggest doc in corpus — likely 2–3 web modules |
| 2.2 | Duality | **optimization/dual.tex** | 2059 | ⚠ diff against `dual (1).tex` (2228) first |
| 2.3 | Conjugate gradient | **optimization/conjugate.tex** | 1231 | |
| 2.4 | ADMM convergence | **optimization/admm_convergence.tex** | 279 | *thin* |
| 2.5 | Convexity, Lipschitz & general opt. | **optimization/Lipschitz.tex** (B) | 664 | merge convex.tex (237), optimization.tex (476), 3learning: optimization_short (386) |
| 2.6 | Linear models & SVM | **optimization/linear_svm.tex** (B) | 864 | |
| 2.7 | Implicit bias of GD | **optimization/gradient_desend copy.tex** | 4753 | rename on copy; distinct content despite filename |

### Part III — Probabilistic Inference
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 3.1 | Graphical models | **estimation/intermediate_graphical.tex** | 829 | |
| 3.2 | EM algorithm | **em/intermediate_em.tex** | 1411 | em.tex (B) subsumed. **Pilot candidate** |
| 3.3 | Variational Bayes | **vb/intermediate_vb.tex** | 2555 | vi/vb_with_examples/variational subsumed. **Pilot candidate** |
| 3.4 | VB: modern examples & normalizing flows | **vb/vb_nf.tex** | 1966 | backups/nf.tex (B) subsumed |
| 3.5 | Markov chains & MCMC | **monte_carlo/intermediate_mcmc.tex** | 3286 | + stochastic_matrices (B) + intro_monte_carlo (B) as intro chapters. **Pilot candidate** |
| 3.6 | Particle filter / SMC | **particle/particle_filter.tex** (B) | 1038 | monte_carlo/particle_filter.tex (B) subsumed |
| 3.7 | State-space models | **dynamics/intermediate_ssm.tex** | 1571 | dynamic_model (B) subsumed |
| 3.8 | Variance reduction (control variates) | **1current_topics/variance_reduction.tex** | 2304 | + 2ProbDL2019/variance_reduction (B) |
| 3.9 | Rao-Blackwellization | **1current_topics/rao_blackwell1.tex** | 1562 | beamer twin subsumed |
| 3.10 | Reparameterization & softmax tricks | **deep_learning/reparameterization.tex** (B) | 1145 | + 2ProbDL2019 softmax ×2 (B), REINFORCE note (141) |

### Part IV — Bayesian Nonparametrics (beamer-only suite, except DPP)
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 4.1 | Dirichlet processes & BNP inference | **non_parametrics/non_parametrics.tex** (B) | 1924 | |
| 4.2 | BNP extensions (HDP …) | **non_parametrics/non_parametrics_extensions.tex** (B) | 1721 | |
| 4.3 | Completely random measures | **non_parametrics/random_measure.tex** (B) | 1596 | |
| 4.4 | BNP graph models | **non_parametrics/BNP_GRAPH.tex** (B) | 2556 | |
| 4.5 | Determinantal point processes | **dpp/dpp_new.tex** | 1913 | dpp.tex (B) + 1current dup subsumed |

### Part V — Deep Learning
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 5.1 | NN learning basics | **deep_learning/neural_networks.tex** (B) | 1573 | decide overlap vs 1.5 |
| 5.2 | CNNs & beyond | **deep_learning/cnn_beyond.tex** (B) | 1802 | |
| 5.3 | Word2Vec & softmax approx. | **tutorials/week4/w2v lecture/word_vector.tex** (B) | 954 | 2 shorter dups subsumed |
| 5.4 | Mathematics of NLP | **deep_learning/intermediate_nlp.tex** | 1665 | deep_nlp (B) subsumed |
| 5.5 | **Transformer — DONE** | transformer/transformer.tex | 2242 | live module; deep_learning copy superseded |
| 5.6 | GANs | **2ProbDL2019/intermediate_gan.tex** | 2964 | GAN.tex (B,3168), gan.tex (334), GAN-math deck (ode_old, 3650) as extra chapters |
| 5.7 | Survey of generative models | **vb/generative_models.tex** | 2372 | |
| 5.8 | RBM & contrastive divergence | **deep_learning/rbm_cd.tex** (B) | 1023 | |
| 5.9 | Graph neural networks | **1current_topics/graph_cnn.tex** | 2194 | deep_learning beamer subsumed |
| 5.10 | Bayesian deep learning | **monte_carlo/bayesian_inference_deep_learning.tex** (B) | 2803 | near-dup _machine_learning dropped |

### Part VI — Differential-Equation Methods
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 6.1 | Neural ODE & adjoint | **differential_equation/neuralODE.tex** | 1060 | beamer twin subsumed |
| 6.2 | SDEs & diffusion models | **differential_equation/sde_ito.tex** | 1601 | + sde.tex (B) intro chapter |

### Part VII — Machine Learning Theory (the 3learning_theory_course sequence, all article)
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 7.1 | Introduction to ML theory | **3learning: 1.introduction.tex** | 993 | _live variant subsumed |
| 7.2 | Concentration inequalities | **3learning: 2.concentration_inequality.tex** | 2202 | + concentration.tex (1874), azuma_convex_gd (490) |
| 7.3 | Rademacher complexity | **3learning: 3.rademarcher.tex** | 2264 | + 1current vector_rade (731) |
| 7.4 | Covering numbers | **3learning: 3.a.cover_number.tex** | 422 | *thin* — chapter of 7.3? |
| 7.5 | NTK (theory-course view) | **3learning: 4.ntk.tex** | 2133 | |
| 7.6 | PAC-Bayes | **3learning: 5.pac_bayes.tex** | 1018 | + 1current pac_learning (1228) |
| 7.7 | RKHS & Gaussian processes | **3learning: 6.rkhs.tex** | 2100 | 1current rkhs (853) subsumed |
| 7.8 | Stability | **3learning: 7.stability.tex** | 217 | *thin* |
| 7.9 | Johnson–Lindenstrauss lemma | **1current_topics/j_l_lemma.tex** | 1475 | |
| 7.10 | Random matrix theory | **1current_topics/random_matrix.tex** | 989 | |
| 7.11 | Implicit regularization (matrix factorization) | **1current_topics/paper_details.tex** | 2113 | |
| 7.12 | Generalization bounds via compression | **1current_topics/stronger_generalization_bounds…tex** | 791 | |
| 7.13 | Infinite-width deep dive (NNGP/NTK) | **infinite_width/ntk_init_nngp.tex** | 2469 | + ntk_training, notes_linearized, over-param notes, dynamical_isometry; ⚠ diff backup (3989) first |

### Part VIII — Reinforcement Learning
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 8.1 | Policy gradient mathematics | **reinforcement/intermediate_policy_gradient.tex** | 2099 | 3 older/conflicted variants dropped |
| 8.2 | Deep RL & DQN | **reinforcement/dqn.tex** (B) | 2089 | shareTex/dqn (1615) as alt |
| 8.3 | MCTS & games | **reinforcement/mcts.tex** (B) | 929 | |

### Part IX — Applications
| # | Module | Primary source | Lines | Notes |
|---|--------|----------------|-------|-------|
| 9.1 | 3D computer vision math | **computer_vision/intermediate_cv_3d.tex** | 2352 | 3 beamer decks as chapters |
| 9.2 | Modern computer vision | **M38 2025: modern_computer_vision.pptx** | — | special-case ingestion |
| 9.3 | Data analytics in industry | **data_science/data_analytics_glanced.tex** (B) | 1815 | data_analytics (B,849) subsumed |
| 9.4 | ML for social networks & journalism | **data_science/journalsim_topcis.tex** | 1762 | |
| 9.5 | Probability meets DL (deeCamp) | **2ProbDL2019/deecamp_2019.tex** (B) | 4446 | deeCamp2018 decks (2449+2436) overlap — subsume |

## Excluded (whole categories — confirm)
- **Research talks/papers/drafts:** copula_dp series, MMSB papers, csiro talks, proposals,
  research_idea_1..14, "proposed ideas", academic_talks, github, industry (except crypto — off-topic
  anyway), others/ misc notes.
- **Backups/conflicts/fragments:** all "conflicted copy"/backup/dup files (≈25), tikz fragments,
  templates, ToC files, byte-identical mis-named dups (`vb/dynamical_isometry.tex`, `sde_old.tex`).
- **No-tex folders:** python, Python_tutorials, matlab, papers, start-up, PPT Research Notes.

## Coverage reconciliation
245 tex = 50 module primaries + ~45 subsumed-into-module sources + ~60 talks/research excluded +
~40 backups/conflicts/fragments/templates + ~50 non-substantive (tiny/admin/scratch). Every file was
classified by one of three inventory agents (logs retained); nothing was skipped.

## Questions for Richard (answer on this file or in chat)
1. **Order/trim:** happy with the 10-part order? Any modules to drop or merge?
2. **Two NN tracks:** keep 1.5 (M38 foundations) AND 5.1 (beamer basics) or merge?
3. ***thin* modules** (0.5, 1.7, 2.4, 7.4, 7.8): standalone short modules, or fold into neighbours?
4. **Pilots:** I propose **EM (3.2), MCMC (3.5), VB (3.3)** — article-class classics with PDFs. OK?
5. **Exclusions:** confirm the excluded categories above.
