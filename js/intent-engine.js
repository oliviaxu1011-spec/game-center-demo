// ============================================================
// INTENT ENGINE v2 — 模糊语义识别
// 包含：编辑距离、谐音纠错、游戏/英雄检测、意图识别、时间解析
// 修改说明：直接编辑此文件即可调整识别逻辑，刷新页面生效
// ============================================================

// ── 数据引用（来自 data/ 目录） ─────────────────────────────
window.ENGINE_INTENTS     = window.DATA_INTENTS || [];
window.ENGINE_TYPO_MAP    = window.DATA_TYPO_MAP || {};
window.ENGINE_ABBR_MAP    = window.DATA_ABBR_MAP || {};
window.ENGINE_GAMES       = window.DATA_GAMES || {};
window.ENGINE_HERO_DB     = window.DATA_HERO_DB || {};
window.ENGINE_DEFAULT_GAME = window.ENGINE_GAMES[window.DATA_DEFAULT_GAME_ID || 'wzry']
  || window.ENGINE_GAMES.wzry
  || { id:'wzry', name:'王者荣耀', icon:'⚔️', emoji:'👑', color:'#c9a227', gradient:'', keywords:[] };

// ============================================================
// 模糊匹配工具函数
// ============================================================

// 编辑距离（Levenshtein），用于容错匹配（错别字、谐音字）
window.editDistance = function(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const dp = Array.from({length:a.length+1}, ()=>Array(b.length+1).fill(0));
  for (let i=0;i<=a.length;i++) dp[i][0]=i;
  for (let j=0;j<=b.length;j++) dp[0][j]=j;
  for (let i=1;i<=a.length;i++){
    for (let j=1;j<=b.length;j++){
      dp[i][j] = Math.min(
        dp[i-1][j]+1, dp[i][j-1]+1,
        dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1)
      );
    }
  }
  return dp[a.length][b.length];
};

// 纠错预处理
window.correctTypos = function(text) {
  let t = text;
  for (const [wrong, right] of Object.entries(window.ENGINE_TYPO_MAP)) {
    if (t.includes(wrong)) t = t.replace(wrong, right);
  }
  return t;
};

// ============================================================
// GAME / HERO DETECTION
// ============================================================

window.detectHero = function(text, game) {
  if (!game) return null;
  const db = window.ENGINE_HERO_DB[game.id];
  if (!db) return null;
  const t = text.toLowerCase();
  for (const hero of db) {
    for (const alias of hero.aliases) {
      if (t.includes(alias.toLowerCase())) return hero;
    }
  }
  return null;
};

// 也支持从文本中同时识别游戏和英雄（未指定游戏时遍历所有游戏）
window.detectHeroAcrossGames = function(text) {
  const t = text.toLowerCase();
  for (const [gameId, heroes] of Object.entries(window.ENGINE_HERO_DB)) {
    for (const hero of heroes) {
      for (const alias of hero.aliases) {
        if (t.includes(alias.toLowerCase())) {
          return { hero, game: window.ENGINE_GAMES[gameId] };
        }
      }
    }
  }
  return null;
};

window.detectGame = function(text) {
  const t = text.toLowerCase();
  for (const [key, game] of Object.entries(window.ENGINE_GAMES)) {
    for (const kw of game.keywords) {
      if (t.includes(kw.toLowerCase())) return game;
    }
  }
  return null; // 未识别到具体游戏
};

// ============================================================
// 意图识别核心函数
// ============================================================
window.detectIntent = function(text) {
  const INTENTS  = window.ENGINE_INTENTS;
  const ABBR_MAP = window.ENGINE_ABBR_MAP;

  // ── Step 0: 预处理 ──────────────────────────────
  let t = text.toLowerCase();
  const tCorrected = window.correctTypos(t); // 谐音纠错
  const tClean = tCorrected.replace(/[？?！!。，,、~…\s]+/g, ''); // 去除标点空格

  let best = null, bestScore = 0;
  const scores = [];

  INTENTS.forEach(intent => {
    let score = 0;

    // ── Step 1: 精确关键词匹配 ─────────────────────
    intent.keywords.forEach(kw => {
      const kwL = kw.toLowerCase();
      if (tCorrected.includes(kwL) || tClean.includes(kwL)) score += 2;
    });

    // 强关键词额外 +3（总计 +5）
    if (intent.strongKeywords) {
      intent.strongKeywords.forEach(kw => {
        const kwL = kw.toLowerCase();
        if (tCorrected.includes(kwL) || tClean.includes(kwL)) score += 3;
      });
    }

    // ── Step 2: 正则模式匹配（自然语言句式）──────────
    if (intent.patterns) {
      let patternHits = 0;
      intent.patterns.forEach(re => {
        if (re.test(tCorrected) || re.test(t)) patternHits++;
      });
      score += patternHits * 4;
    }

    // ── Step 3: 拼音简写识别 ─────────────────────────
    for (const [abbr, meaning] of Object.entries(ABBR_MAP)) {
      if (tClean === abbr || t.trim() === abbr) {
        const targetIntent = INTENTS.find(i => i.keywords.some(k => k.includes(meaning)));
        if (targetIntent && targetIntent.id === intent.id) score += 8;
      }
    }

    // ── Step 4: 编辑距离近似匹配（容错2字内）─────────
    if (score === 0 && intent.strongKeywords) {
      intent.strongKeywords.forEach(kw => {
        if (kw.length >= 2) {
          for (let i = 0; i <= tCorrected.length - kw.length; i++) {
            const seg = tCorrected.slice(i, i + kw.length + 1);
            const dist = window.editDistance(seg, kw);
            if (dist <= 1 && kw.length >= 2) score += 2;
          }
        }
      });
    }

    scores.push({ id: intent.id, label: intent.label, score });
    if (score > bestScore) { bestScore = score; best = intent; }
  });

  if (bestScore === 0) return null;

  // 使用对数曲线让置信度更合理
  const confidence = Math.min(95, Math.round(55 + 20 * Math.log2(bestScore)));

  // ── 置信度分级 ──────────────────────────────────
  const level = bestScore >= 4 ? 'strong' : bestScore <= 2 ? 'weak' : 'medium';

  // 检查第2名的分数，如果与最高分差距很小，说明有歧义
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const secondBest = sortedScores.length > 1 ? sortedScores[1] : { score: 0 };
  const ambiguous = bestScore > 0 && secondBest.score > 0 && (bestScore - secondBest.score) <= 2;

  return {
    ...best,
    confidence,
    rawScore: bestScore,
    level,
    ambiguous,
    allScores: scores,
    secondIntent: ambiguous ? sortedScores[1] : null,
  };
};

// ============================================================
// 时间范围解析器 — 从用户文本中提取时间意图
// ============================================================
window.parseTimeRange = function(text) {
  const t = text;
  if (/昨天|昨日|yesterday/.test(t))          return { label:'昨日',      days:1,  tag:'yesterday' };
  if (/今天|今日|today/.test(t))               return { label:'今日',      days:1,  tag:'today' };
  if (/上一把|上局|刚才|这把|最近一把/.test(t)) return { label:'最近一局',  days:0,  tag:'last_match' };
  if (/本周|这周|最近一周|7天|七天/.test(t))   return { label:'本周',      days:7,  tag:'week' };
  if (/上周/.test(t))                          return { label:'上周',      days:14, tag:'last_week' };
  if (/本月|这个月|30天|三十天/.test(t))       return { label:'本月',      days:30, tag:'month' };
  if (/最近三天|近三天|3天/.test(t))           return { label:'近3日',     days:3,  tag:'3days' };
  if (/最近|近期/.test(t))                     return { label:'近7日',     days:7,  tag:'recent' };
  return null;
};

// ============================================================
// 多轮对话上下文记忆
// ============================================================
window.chatHistory = [];
window.MAX_HISTORY = 6;

window.addToHistory = function(role, content) {
  window.chatHistory.push({ role, content });
  if (window.chatHistory.length > window.MAX_HISTORY) window.chatHistory.shift();
};

window.getLastIntent = function() {
  for (let i = window.chatHistory.length - 1; i >= 0; i--) {
    if (window.chatHistory[i]._intentId) return window.chatHistory[i]._intentId;
  }
  return null;
};
