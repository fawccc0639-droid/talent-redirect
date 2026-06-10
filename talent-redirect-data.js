/**
 * ============================================================
 *  Talent Redirection Router — 核心数据层
 *  高价值淘汰候选人 · 自动重定向路由
 *  用途：为后续匹配引擎提供结构化候选人与岗位池数据
 * ============================================================
 */

// ======================= 1. 候选人全维画像 =======================
// 核心设计原则：打破传统关键词匹配，采用多维能力评分体系，
// 将硬技能、跨界潜能、商业素养统一纳入同一框架。

const candidateProfile = {
  // --- 元信息 ---
  id: "CAND-2026-0042",
  createdAt: "2026-06-10T08:30:00Z",
  status: "ELIMINATED", // 原岗位已淘汰，待重定向

  // --- 基本信息 ---
  basic: {
    name: "陈逸凡",
    originRole: "前端开发",
    originDept: "技术研发中心-平台前端组",
    eliminatedBy: "INTERVIEW_ROUND_3", // 第3轮面试淘汰
    eliminatedReason: "React/Vue 熟练度未达该岗急招要求",
    // 注意：淘汰理由局限于"原岗位匹配度"，不代表候选人无价值
  },

  // --- 核心硬实力标签（技术栈 + 领域） ---
  hardSkills: [
    { skill: "WebGL / Three.js",          score: 95, level: "EXPERT"      },
    { skill: "Canvas / 图形渲染",          score: 88, level: "ADVANCED"    },
    { skill: "GLSL / Shader 着色器",       score: 82, level: "ADVANCED"    },
    { skill: "React / Vue",               score: 75, level: "INTERMEDIATE"},
    { skill: "前端工程化 (Webpack/Vite)",   score: 72, level: "INTERMEDIATE"},
    { skill: "数据结构与算法",              score: 70, level: "INTERMEDIATE"},
    { skill: "TypeScript",                score: 78, level: "INTERMEDIATE"},
  ],

  // --- 跨界 / 商业潜能特征 ---
  // 这是本系统的核心创新点：捕捉候选人"非本职但高价值"的跨界能力
  crossDomain: [
    { skill: "财务估值 / DDM 模型",         score: 85, level: "ADVANCED" },
    { skill: "结构化叙事 / PPT 设计",       score: 90, level: "EXPERT"   },
    { skill: "行业数据分析",                score: 80, level: "ADVANCED" },
    { skill: "金融科技业务理解",             score: 83, level: "ADVANCED" },
    { skill: "可视化叙事 (Data Storytelling)", score: 88, level: "ADVANCED" },
  ],

  // --- 元能力维度（通用素质） ---
  metaAbilities: {
    learningAgility:   88, // 学习敏锐度
    structuredThinking: 85, // 结构化思维
    cognitiveFlexibility: 82, // 认知灵活性（适应新领域）
    collaboration:      76,
  },

  // --- 附加信息 ---
  education: {
    degree: "本科",
    major: "计算机科学与技术",
    minor: "金融学（辅修）", // 解释了金融类跨界能力来源
  },
  experience: {
    totalYears: 4,
    relevantSummary: "3年前端 + 1年FinTech产品技术顾问",
  },
};

// ======================= 2. 活跃在招岗位池 =======================
// 覆盖 3 个不同部门，需求维度差异显著，适合展示重定向路由的
// "人岗新匹配"而非"传统关键词匹配"的优势。

const activeJobPool = [
  // ---- 岗位 A：原部门急需型（候选人的原方向，但要求不同）----
  {
    id: "JOB-2026-0101",
    title: "高级前端开发（React）",
    department: "技术研发中心-平台前端组",
    urgency: "CRITICAL", // 急招
    requirementProfile: {
      // 岗位需求向量：本系统不依赖关键词，而是用能力维度 + 权重
      mustHave: [
        { skill: "React / Vue",           minScore: 85, weight: 0.45 },
        { skill: "TypeScript",            minScore: 80, weight: 0.20 },
        { skill: "前端工程化",             minScore: 75, weight: 0.20 },
        { skill: "数据结构与算法",          minScore: 70, weight: 0.15 },
      ],
      niceToHave: [],
      crossDomainBonus: false, // 该岗不需要跨界能力
      metaRequirement: {
        collaboration: 75,
      },
    },
    // 快速匹配预判（由系统计算填充，这里标注预期结果）
    _matchComment: "候选人在React/Vue维度(75)未达该岗硬门槛(85)，不适合重定向。",
  },

  // ---- 岗位 B：创新产品部 · 高复杂度、高斜杠需求 ----
  {
    id: "JOB-2026-0207",
    title: "数字资产可视化专家",
    department: "创新产品部-数字资产实验室",
    urgency: "HIGH",
    requirementProfile: {
      mustHave: [
        { skill: "WebGL / Three.js",      minScore: 90, weight: 0.35 },
        { skill: "Canvas / 图形渲染",      minScore: 80, weight: 0.20 },
        { skill: "金融科技业务理解",        minScore: 75, weight: 0.25 },
        { skill: "TypeScript",            minScore: 70, weight: 0.20 },
      ],
      niceToHave: [
        { skill: "财务估值 / DDM 模型",           bonusWeight: 0.10 },
        { skill: "可视化叙事 (Data Storytelling)", bonusWeight: 0.10 },
        { skill: "GLSL / Shader 着色器",           bonusWeight: 0.10 },
      ],
      crossDomainBonus: true, // 乐于接受跨界切入点
      metaRequirement: {
        learningAgility:      85,
        cognitiveFlexibility: 80,
      },
    },
    _matchComment: "候选人在WebGL(95)、FinTech业务理解(83)、可视化叙事(88)形成强三角匹配，推荐最高优先级重定向。",
  },

  // ---- 岗位 C：财富管理部 · 商科主线 ----
  {
    id: "JOB-2026-0315",
    title: "初级行业分析师（TMT方向）",
    department: "财富管理部-投研中心",
    urgency: "MEDIUM",
    requirementProfile: {
      mustHave: [
        { skill: "行业数据分析",               minScore: 75, weight: 0.30 },
        { skill: "结构化叙事 / PPT 设计",       minScore: 80, weight: 0.25 },
        { skill: "财务估值 / DDM 模型",         minScore: 70, weight: 0.25 },
        { skill: "金融科技业务理解",             minScore: 70, weight: 0.20 },
      ],
      niceToHave: [
        { skill: "前端开发基础", bonusWeight: 0.05 }, // 数据看板搭建能力加分
      ],
      crossDomainBonus: true,
      metaRequirement: {
        structuredThinking: 80,
        learningAgility:    80,
      },
    },
    _matchComment: "候选人在行业数据分析(80)、PPT结构化叙事(90)、财务估值(85)三项均超阈值，跨金融+技术背景是独特卖点。推荐重定向。",
  },

  // ---- 岗位 D：市场品牌部 · 意外匹配支线 ----
  {
    id: "JOB-2026-0409",
    title: "数据可视化设计师",
    department: "市场品牌部-创意中心",
    urgency: "LOW",
    requirementProfile: {
      mustHave: [
        { skill: "可视化叙事 (Data Storytelling)", minScore: 80, weight: 0.35 },
        { skill: "结构化叙事 / PPT 设计",            minScore: 85, weight: 0.30 },
        { skill: "Canvas / 图形渲染",               minScore: 70, weight: 0.20 },
        { skill: "行业数据分析",                     minScore: 70, weight: 0.15 },
      ],
      niceToHave: [
        { skill: "WebGL / Three.js", bonusWeight: 0.15 },
      ],
      crossDomainBonus: true,
      metaRequirement: {
        structuredThinking: 80,
      },
    },
    _matchComment: "候选人可视化叙事(88)、PPT设计(90)构成核心优势，WebGL属于锦上添花。适合作为备选推荐。",
  },
];

// ======================= 3. 初始化 / 导出 =======================

/**
 * 初始化函数：返回待匹配的候选人与岗位池。
 * 设计为异步函数，便于后续对接后端 API（目前为本地 mock）。
 * @returns {Promise<{ candidate: Object, jobs: Object[] }>}
 */
async function initTalentRedirectionData() {
  // 模拟网络延迟，预留后端置换空间
  console.log("[TRR] 初始化 Talent Redirection Router 数据层...");

  // 深拷贝防止外部污染
  const candidate = JSON.parse(JSON.stringify(candidateProfile));
  const jobs = JSON.parse(JSON.stringify(activeJobPool));

  console.log(`[TRR] ✓ 候选人画像已加载: ${candidate.basic.name} (${candidate.basic.originRole})`);
  console.log(`[TRR] ✓ 在招岗位池已加载: ${jobs.length} 个岗位`);
  jobs.forEach((j) => {
    console.log(`  - [${j.department}] ${j.title} (紧急度: ${j.urgency})`);
  });

  return { candidate, jobs };
}

// ======================= 导出 =======================
// 支持 ES Module 与 CommonJS 双模式
export { candidateProfile, activeJobPool, initTalentRedirectionData };

// 如果是 Node 环境 CommonJS 引用，也挂载到 module.exports
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    candidateProfile,
    activeJobPool,
    initTalentRedirectionData,
  };
}
