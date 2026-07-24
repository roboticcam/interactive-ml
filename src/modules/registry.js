// The course manifest — mirrors CATALOG.md (approved 2026-07-23, ~45 modules).
// status: "live" (built) | "pilot" (in production) | "planned".
// Titles carry their own translations (data, not UI chrome — kept out of the
// i18n string catalog on purpose). `src` = primary LaTeX source (see CATALOG.md).

export const PARTS = [
  { id: "p0", en: "Part 0 · Getting Started", hans: "第 0 部分 · 入门", hant: "第 0 部分 · 入門" },
  { id: "p1", en: "Part I · Statistical Machine Learning", hans: "第 I 部分 · 统计机器学习", hant: "第 I 部分 · 統計機器學習" },
  { id: "p2", en: "Part II · Optimization", hans: "第 II 部分 · 优化", hant: "第 II 部分 · 最佳化" },
  { id: "p3", en: "Part III · Probabilistic Inference", hans: "第 III 部分 · 概率推断", hant: "第 III 部分 · 機率推斷" },
  { id: "p4", en: "Part IV · Bayesian Nonparametrics", hans: "第 IV 部分 · 贝叶斯非参数", hant: "第 IV 部分 · 貝氏非參數" },
  { id: "p5", en: "Part V · Deep Learning", hans: "第 V 部分 · 深度学习", hant: "第 V 部分 · 深度學習" },
  { id: "p6", en: "Part VI · Differential-Equation Methods", hans: "第 VI 部分 · 微分方程方法", hant: "第 VI 部分 · 微分方程方法" },
  { id: "p7", en: "Part VII · Machine Learning Theory", hans: "第 VII 部分 · 机器学习理论", hant: "第 VII 部分 · 機器學習理論" },
  { id: "p8", en: "Part VIII · Reinforcement Learning", hans: "第 VIII 部分 · 强化学习", hant: "第 VIII 部分 · 強化學習" },
  { id: "p9", en: "Part IX · Applications", hans: "第 IX 部分 · 应用", hant: "第 IX 部分 · 應用" },
];

export const MODULES = [
  // Part 0
  { id: "ai-overview", part: "p0", status: "planned", src: "data_science/ai_ml_dl.tex", en: "What is AI / ML / DL?", hans: "什么是 AI / ML / DL？", hant: "什麼是 AI / ML / DL？" },
  { id: "math-supplement", part: "p0", status: "planned", src: "M38:math_supplement.tex", en: "Mathematics Supplement", hans: "数学补充", hant: "數學補充" },
  { id: "probability", part: "p0", status: "planned", src: "estimation/probability.tex", en: "Probability & Estimation", hans: "概率与估计", hant: "機率與估計" },
  { id: "bayesian-basics", part: "p0", status: "planned", src: "em/em_notes.tex", en: "Bayesian Basics", hans: "贝叶斯基础", hant: "貝氏基礎" },
  // Part I
  { id: "bayes-classification", part: "p1", status: "planned", src: "M38:foundation_simple_bayes.tex", en: "Bayesian Classification & Belief Nets", hans: "贝叶斯分类与信念网络", hant: "貝氏分類與信念網路" },
  { id: "model-evaluation", part: "p1", status: "planned", src: "M38:foundation_model_evaluation.tex", en: "Model Evaluation", hans: "模型评估", hant: "模型評估" },
  { id: "decision-trees", part: "p1", status: "planned", src: "M38:foundation_decision_tree.tex", en: "Decision Trees", hans: "决策树", hant: "決策樹" },
  { id: "regression", part: "p1", status: "planned", src: "M38:foundation_regression.tex", en: "Regression & PageRank", hans: "回归与 PageRank", hant: "迴歸與 PageRank" },
  { id: "nn-essentials", part: "p1", status: "planned", src: "M38:foundation_neural_network.tex", en: "Neural-Network Essentials", hans: "神经网络精要", hant: "神經網路精要" },
  { id: "unsupervised", part: "p1", status: "planned", src: "M38:foundation_unsupervised.tex", en: "Unsupervised Learning & Dimension Reduction", hans: "无监督学习与降维", hant: "非監督式學習與降維" },
  { id: "recommenders", part: "p1", status: "planned", src: "M38:foundation_recommender.tex", en: "Recommender Systems", hans: "推荐系统", hant: "推薦系統" },
  // Part II
  { id: "gradient-descent", part: "p2", status: "planned", src: "optimization/gradient_desend_fundamental.tex", en: "Gradient Descent Fundamentals", hans: "梯度下降基础", hant: "梯度下降基礎" },
  { id: "duality", part: "p2", status: "planned", src: "optimization/dual.tex", en: "Duality & ADMM", hans: "对偶理论与 ADMM", hant: "對偶理論與 ADMM" },
  { id: "conjugate-gradient", part: "p2", status: "planned", src: "optimization/conjugate.tex", en: "Conjugate Gradient", hans: "共轭梯度", hant: "共軛梯度" },
  { id: "convexity", part: "p2", status: "planned", src: "optimization/Lipschitz.tex", en: "Convexity & Lipschitz", hans: "凸性与 Lipschitz", hant: "凸性與 Lipschitz" },
  { id: "svm", part: "p2", status: "planned", src: "optimization/linear_svm.tex", en: "Linear Models & SVM", hans: "线性模型与 SVM", hant: "線性模型與 SVM" },
  { id: "implicit-bias", part: "p2", status: "planned", src: "optimization/gradient_desend copy.tex", en: "Implicit Bias of Gradient Descent", hans: "梯度下降的隐式偏置", hant: "梯度下降的隱式偏置" },
  // Part III
  { id: "graphical-models", part: "p3", status: "planned", src: "estimation/intermediate_graphical.tex", en: "Graphical Models", hans: "概率图模型", hant: "機率圖模型" },
  { id: "em", part: "p3", status: "live", src: "em/intermediate_em.tex", en: "The EM Algorithm", hans: "EM 算法", hant: "EM 演算法" },
  { id: "vb", part: "p3", status: "pilot", src: "vb/intermediate_vb.tex", en: "Variational Bayes", hans: "变分贝叶斯", hant: "變分貝氏" },
  { id: "vb-flows", part: "p3", status: "planned", src: "vb/vb_nf.tex", en: "VB: Flows & Modern Examples", hans: "变分贝叶斯：流模型与现代实例", hant: "變分貝氏：流模型與現代實例" },
  { id: "mcmc", part: "p3", status: "pilot", src: "monte_carlo/intermediate_mcmc.tex", en: "Markov Chains & MCMC", hans: "马尔可夫链与 MCMC", hant: "馬可夫鏈與 MCMC" },
  { id: "particle-filter", part: "p3", status: "planned", src: "particle/particle_filter.tex", en: "Particle Filters & SMC", hans: "粒子滤波与序贯蒙特卡罗", hant: "粒子濾波與循序蒙地卡羅" },
  { id: "state-space", part: "p3", status: "planned", src: "dynamics/intermediate_ssm.tex", en: "State-Space Models", hans: "状态空间模型", hant: "狀態空間模型" },
  { id: "variance-reduction", part: "p3", status: "planned", src: "1current_topics/variance_reduction.tex", en: "Variance Reduction", hans: "方差缩减", hant: "變異數縮減" },
  { id: "rao-blackwell", part: "p3", status: "planned", src: "1current_topics/rao_blackwell1.tex", en: "Rao-Blackwellization", hans: "Rao-Blackwell 化", hant: "Rao-Blackwell 化" },
  { id: "reparameterization", part: "p3", status: "planned", src: "deep_learning/reparameterization.tex", en: "Reparameterization Tricks", hans: "重参数化技巧", hant: "重參數化技巧" },
  // Part IV
  { id: "dirichlet-process", part: "p4", status: "planned", src: "non_parametrics/non_parametrics.tex", en: "Dirichlet Processes", hans: "狄利克雷过程", hant: "狄利克雷過程" },
  { id: "bnp-extensions", part: "p4", status: "planned", src: "non_parametrics/non_parametrics_extensions.tex", en: "BNP Extensions & HDP", hans: "BNP 扩展与 HDP", hant: "BNP 擴展與 HDP" },
  { id: "random-measures", part: "p4", status: "planned", src: "non_parametrics/random_measure.tex", en: "Completely Random Measures", hans: "完全随机测度", hant: "完全隨機測度" },
  { id: "bnp-graphs", part: "p4", status: "planned", src: "non_parametrics/BNP_GRAPH.tex", en: "BNP Graph Models", hans: "BNP 图模型", hant: "BNP 圖模型" },
  { id: "dpp", part: "p4", status: "planned", src: "dpp/dpp_new.tex", en: "Determinantal Point Processes", hans: "行列式点过程", hant: "行列式點過程" },
  // Part V
  { id: "cnn", part: "p5", status: "planned", src: "deep_learning/cnn_beyond.tex", en: "CNNs & Beyond", hans: "卷积神经网络与进展", hant: "卷積神經網路與進展" },
  { id: "word2vec", part: "p5", status: "planned", src: "tutorials/week4/w2v lecture/word_vector.tex", en: "Word2Vec & Softmax Approximation", hans: "Word2Vec 与 softmax 近似", hant: "Word2Vec 與 softmax 近似" },
  { id: "nlp-math", part: "p5", status: "planned", src: "deep_learning/intermediate_nlp.tex", en: "Mathematics of NLP", hans: "自然语言处理的数学", hant: "自然語言處理的數學" },
  { id: "transformer", part: "p5", status: "live", src: "transformer/transformer.tex", en: "The Transformer", hans: "Transformer", hant: "Transformer" },
  { id: "gan", part: "p5", status: "planned", src: "2ProbDL2019/intermediate_gan.tex", en: "Generative Adversarial Networks", hans: "生成对抗网络", hant: "生成對抗網路" },
  { id: "generative-models", part: "p5", status: "planned", src: "vb/generative_models.tex", en: "Survey of Generative Models", hans: "生成模型综述", hant: "生成模型綜述" },
  { id: "rbm", part: "p5", status: "planned", src: "deep_learning/rbm_cd.tex", en: "RBM & Contrastive Divergence", hans: "受限玻尔兹曼机与对比散度", hant: "受限玻爾茲曼機與對比散度" },
  { id: "gnn", part: "p5", status: "planned", src: "1current_topics/graph_cnn.tex", en: "Graph Neural Networks", hans: "图神经网络", hant: "圖神經網路" },
  { id: "bayesian-dl", part: "p5", status: "planned", src: "monte_carlo/bayesian_inference_deep_learning.tex", en: "Bayesian Deep Learning", hans: "贝叶斯深度学习", hant: "貝氏深度學習" },
  // Part VI
  { id: "neural-ode", part: "p6", status: "planned", src: "differential_equation/neuralODE.tex", en: "Neural ODE & the Adjoint Method", hans: "神经常微分方程与伴随方法", hant: "神經常微分方程與伴隨方法" },
  { id: "diffusion", part: "p6", status: "planned", src: "differential_equation/sde_ito.tex", en: "SDEs & Diffusion Models", hans: "随机微分方程与扩散模型", hant: "隨機微分方程與擴散模型" },
  // Part VII
  { id: "mlt-intro", part: "p7", status: "planned", src: "3learning:1.introduction.tex", en: "Introduction to ML Theory", hans: "机器学习理论导论", hant: "機器學習理論導論" },
  { id: "concentration", part: "p7", status: "planned", src: "3learning:2.concentration_inequality.tex", en: "Concentration Inequalities", hans: "集中不等式", hant: "集中不等式" },
  { id: "rademacher", part: "p7", status: "planned", src: "3learning:3.rademarcher.tex", en: "Rademacher Complexity & Covering", hans: "Rademacher 复杂度与覆盖数", hant: "Rademacher 複雜度與覆蓋數" },
  { id: "ntk", part: "p7", status: "planned", src: "3learning:4.ntk.tex", en: "Neural Tangent Kernel", hans: "神经正切核", hant: "神經正切核" },
  { id: "pac-bayes", part: "p7", status: "planned", src: "3learning:5.pac_bayes.tex", en: "PAC-Bayes", hans: "PAC-贝叶斯", hant: "PAC-貝氏" },
  { id: "rkhs", part: "p7", status: "planned", src: "3learning:6.rkhs.tex", en: "RKHS & Gaussian Processes", hans: "再生核希尔伯特空间与高斯过程", hant: "再生核希爾伯特空間與高斯過程" },
  { id: "jl-lemma", part: "p7", status: "planned", src: "1current_topics/j_l_lemma.tex", en: "Johnson–Lindenstrauss Lemma", hans: "Johnson–Lindenstrauss 引理", hant: "Johnson–Lindenstrauss 引理" },
  { id: "random-matrix", part: "p7", status: "planned", src: "1current_topics/random_matrix.tex", en: "Random Matrix Theory", hans: "随机矩阵理论", hant: "隨機矩陣理論" },
  { id: "implicit-reg", part: "p7", status: "planned", src: "1current_topics/paper_details.tex", en: "Implicit Regularization", hans: "隐式正则化", hant: "隱式正則化" },
  { id: "compression-bounds", part: "p7", status: "planned", src: "1current_topics/stronger_generalization_bounds_deep_nets_compression.tex", en: "Generalization via Compression", hans: "基于压缩的泛化界", hant: "基於壓縮的泛化界" },
  { id: "infinite-width", part: "p7", status: "planned", src: "infinite_width/ntk_init_nngp.tex", en: "Infinite-Width Networks (NNGP/NTK)", hans: "无限宽神经网络（NNGP/NTK）", hant: "無限寬神經網路（NNGP/NTK）" },
  // Part VIII
  { id: "policy-gradient", part: "p8", status: "planned", src: "reinforcement/intermediate_policy_gradient.tex", en: "Policy Gradient Mathematics", hans: "策略梯度的数学", hant: "策略梯度的數學" },
  { id: "dqn", part: "p8", status: "planned", src: "reinforcement/dqn.tex", en: "Deep RL & DQN", hans: "深度强化学习与 DQN", hant: "深度強化學習與 DQN" },
  { id: "mcts", part: "p8", status: "planned", src: "reinforcement/mcts.tex", en: "MCTS & Games", hans: "蒙特卡洛树搜索与游戏", hant: "蒙地卡羅樹搜尋與遊戲" },
  // Part IX
  { id: "cv-3d", part: "p9", status: "planned", src: "computer_vision/intermediate_cv_3d.tex", en: "3D Computer Vision", hans: "三维计算机视觉", hant: "三維電腦視覺" },
  { id: "modern-cv", part: "p9", status: "planned", src: "M38-2025:modern_computer_vision.pptx", en: "Modern Computer Vision", hans: "现代计算机视觉", hant: "現代電腦視覺" },
  { id: "data-analytics", part: "p9", status: "planned", src: "data_science/data_analytics_glanced.tex", en: "Data Analytics in Industry", hans: "行业数据分析", hant: "產業資料分析" },
  { id: "ml-journalism", part: "p9", status: "planned", src: "data_science/journalsim_topcis.tex", en: "ML for Social Networks & Journalism", hans: "社交网络与新闻中的机器学习", hant: "社群網路與新聞中的機器學習" },
  { id: "prob-meets-dl", part: "p9", status: "planned", src: "2ProbDL2019/deecamp_2019.tex", en: "When Probability Meets Deep Learning", hans: "当概率遇上深度学习", hant: "當機率遇上深度學習" },
];

export const moduleTitle = (m, lang) => (lang === "zhHans" ? m.hans : lang === "zhHant" ? m.hant : m.en);
export const partTitle = (p, lang) => (lang === "zhHans" ? p.hans : lang === "zhHant" ? p.hant : p.en);
export const getModule = (id) => MODULES.find((m) => m.id === id);
