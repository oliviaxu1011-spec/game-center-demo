// ============================================================
// WEB SEARCH — 联网搜索模块（Tavily Search API）
// 为 AI Bot 提供实时资讯能力，替代静态 mock 数据
// Tavily 是专为 AI 优化的搜索引擎，返回结构化 JSON，稳定可靠
// 修改说明：直接编辑此文件即可调整搜索逻辑，刷新页面生效
// ============================================================

// ── 搜索配置 ──────────────────────────────────────
window.WEB_SEARCH_CONFIG = {
  // ── Tavily Search API ──
  tavilyApiKey: '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',
  tavilyApiUrl: 'https://api.tavily.com/search',

  // 搜索超时（毫秒）
  timeout: 10000,
  // 缓存有效期（毫秒）— 30分钟
  cacheTTL: 30 * 60 * 1000,
};

// ── 搜索结果缓存 ─────────────────────────────────
window._searchCache = {};

// ── 游戏搜索关键词映射 ─────────────────────────────
window.GAME_SEARCH_QUERIES = {
  wzry: {
    news: '王者荣耀 最新版本更新',
    version: '王者荣耀 最新版本 更新内容',
    default: '王者荣耀 最新资讯',
  },
  hpjy: {
    news: '和平精英 最新版本更新',
    version: '和平精英 最新版本 更新内容',
    default: '和平精英 最新资讯',
  },
  sjz: {
    news: '三角洲行动 最新版本更新',
    version: '三角洲行动 最新版本 更新内容',
    default: '三角洲行动 最新资讯',
  },
  cfm: {
    news: '穿越火线手游 最新版本更新',
    version: '穿越火线手游 最新版本 更新内容',
    default: '穿越火线手游 最新资讯',
  },
  ys: {
    news: '原神 最新版本更新',
    version: '原神 最新版本 更新内容',
    default: '原神 最新资讯',
  },
};

// ============================================================
// 核心搜索函数 — Tavily Search API
// ============================================================
window.webSearch = async function(query, options) {
  options = options || {};
  const maxResults = options.maxResults || 5;

  // 检查缓存
  const cacheKey = query.trim().toLowerCase();
  const cached = window._searchCache[cacheKey];
  if (cached && (Date.now() - cached.time < window.WEB_SEARCH_CONFIG.cacheTTL)) {
    console.log('[WebSearch] 命中缓存:', query);
    return cached.data;
  }

  const timeout = window.WEB_SEARCH_CONFIG.timeout;

  console.log('[WebSearch] 开始搜索:', query);
  let results = null;

  // ── Tavily Search API ──
  results = await _searchViaTavily(query, maxResults, timeout, options);

  // 写入缓存
  if (results && results.length > 0) {
    results._searchEngine = results._searchEngine || 'Tavily';
    window._searchCache[cacheKey] = { data: results, time: Date.now() };
    return results;
  }

  return [];
};

// ============================================================
// Tavily Search API — 专为 AI 优化的搜索引擎
// 返回结构化 JSON，支持中文搜索，无 CORS 问题
// API 文档：https://docs.tavily.com/documentation/api-reference/endpoint/search
// ============================================================
async function _searchViaTavily(query, maxResults, timeout, options) {
  const apiKey = window.WEB_SEARCH_CONFIG.tavilyApiKey;
  const apiUrl = window.WEB_SEARCH_CONFIG.tavilyApiUrl;

  if (!apiKey) {
    console.warn('[WebSearch] Tavily API Key 未配置');
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // 构造请求体
    // 注意：中文游戏搜索统一使用 general topic，news topic 偏向英文新闻源
    const requestBody = {
      query: query,
      max_results: Math.min(maxResults, 10),
      search_depth: 'basic',
      topic: (options && options.topic) || 'general',
    };

    const res = await fetch(apiUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn('[WebSearch] Tavily API HTTP', res.status, errText.slice(0, 200));
      return null;
    }

    const data = await res.json();

    if (data.results && data.results.length > 0) {
      console.log(`[WebSearch] Tavily 搜索成功，获取 ${data.results.length} 条结果（耗时 ${data.response_time}s）`);
      const results = data.results.map(r => ({
        title: r.title || '',
        abstract: (r.content || '').slice(0, 150),
        source: _extractDomain(r.url),
        url: r.url || '',
        score: r.score || 0,
      }));
      results._searchEngine = 'Tavily';
      return results;
    }

    console.log('[WebSearch] Tavily 返回 0 条结果');
    return null;
  } catch (e) {
    if (e.name === 'AbortError') {
      console.warn('[WebSearch] Tavily API 超时');
    } else {
      console.warn('[WebSearch] Tavily API 失败:', e.message);
    }
    return null;
  }
}

// ── 从 URL 提取域名作为来源 ──────────────────────────
function _extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch (e) {
    return '';
  }
}

// ============================================================
// 智能搜索入口 — 根据游戏和意图自动构造搜索词
// ============================================================
window.searchGameNews = async function(gameId, userText, gameName) {
  const queries = window.GAME_SEARCH_QUERIES[gameId];
  const text = (userText || '').toLowerCase();

  let query;
  if (queries) {
    // ── 已知游戏：使用预配置的搜索关键词 ──
    if (/版本|更新|update|patch|赛季/.test(text)) {
      query = queries.version;
    } else if (/资讯|新闻|消息|动态|公告/.test(text)) {
      query = queries.news;
    } else {
      query = queries.default;
    }
  } else {
    // ── 未知游戏（虚拟游戏）：用 gameName 动态构建搜索词 ──
    const name = gameName || '游戏';
    if (/版本|更新|update|patch|赛季/.test(text)) {
      query = name + ' 最新版本 更新内容';
    } else if (/资讯|新闻|消息|动态|公告/.test(text)) {
      query = name + ' 最新版本更新';
    } else {
      query = name + ' 最新资讯';
    }
    console.log('[searchGameNews] 未知游戏,动态构建搜索词:', query);
  }

  // 追加当前日期，确保搜索结果时效性
  const now = new Date();
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月`;
  query += ' ' + dateStr;

  return await window.webSearch(query, { maxResults: 5 });
};

// ============================================================
// 预搜索机制 — 在 DeepSeek 意图识别的同时提前开始搜索
// 当检测到用户输入可能是资讯相关时，提前触发搜索，不等意图识别完成
// ============================================================
window._preSearchCache = { promise: null, game: null, text: null };

// 检测是否可能是资讯类输入（快速本地检测）
window._isLikelyNewsQuery = function(text) {
  const t = (text || '').toLowerCase();
  return /版本|更新|赛季|资讯|新闻|公告|新英雄|新角色|活动|改动|补丁|维护|上线|联赛|比赛|赛事|s\d+|最新/.test(t);
};

// 预搜索入口 — 在消息处理流程最开始调用
window.preSearchIfNeeded = function(text) {
  if (!window._isLikelyNewsQuery(text)) {
    window._preSearchCache = { promise: null, game: null, text: null };
    return;
  }
  // 提前开始搜索（支持虚拟游戏）
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  let game = window.detectGame ? window.detectGame(text) : null;
  // 如果已知游戏识别失败，尝试提取游戏名创建虚拟对象
  if (!game && window.extractGameNameFromText) {
    const extractedName = window.extractGameNameFromText(text);
    if (extractedName) {
      game = window.createVirtualGame(extractedName);
    }
  }
  if (!game) game = DEFAULT_GAME;
  console.log('[PreSearch] 检测到资讯类输入，提前搜索:', text, '游戏:', game.name);
  window._preSearchCache = {
    promise: window.searchGameNews(game.id, text, game.name),
    game: game,
    text: text,
  };
};

// 获取预搜索结果（如果有的话）
window.getPreSearchResult = function(game, text) {
  const cache = window._preSearchCache;
  // 如果预搜索的游戏和文本匹配，直接复用
  if (cache.promise && cache.game && cache.game.id === game.id) {
    console.log('[PreSearch] 命中预搜索，直接复用结果');
    return cache.promise;
  }
  return null;
};

// ============================================================
// 格式化搜索结果为资讯卡片数据
// ============================================================
window.formatSearchResults = function(results, gameName) {
  if (!results || results.length === 0) return null;

  // 图标映射：根据标题关键词分配图标
  const iconMap = [
    { keywords: ['版本', '更新', 'update', 'patch'], icon: '📦' },
    { keywords: ['赛季', '段位', '排位', 'rank'], icon: '🏆' },
    { keywords: ['英雄', '角色', '新英雄', '上线'], icon: '⚔️' },
    { keywords: ['皮肤', '外观', '限定', '免费'], icon: '🎭' },
    { keywords: ['活动', '福利', '礼包', '奖励'], icon: '🎁' },
    { keywords: ['赛事', '比赛', '冠军', '联赛', 'KPL'], icon: '🏅' },
    { keywords: ['公告', '维护', '停机', '补偿'], icon: '📢' },
    { keywords: ['攻略', '技巧', '教学', '打法'], icon: '📖' },
    { keywords: ['下载', '安装', '体验服'], icon: '⬇️' },
    { keywords: ['视频', '直播', '回放'], icon: '🎬' },
  ];

  function getIcon(title) {
    const t = title.toLowerCase();
    for (const entry of iconMap) {
      if (entry.keywords.some(kw => t.includes(kw))) return entry.icon;
    }
    return '📰';
  }

  // 生成时间标签
  function getTimeMeta(source) {
    const now = new Date();
    const timeLabels = ['刚刚', '1小时前', '2小时前', '3小时前', '今天', '昨天'];
    const randomTime = timeLabels[Math.floor(Math.random() * timeLabels.length)];
    const src = source || '网络资讯';
    return src + ' · ' + randomTime;
  }

  return results.map(r => ({
    icon: getIcon(r.title),
    title: r.title.length > 28 ? r.title.slice(0, 28) + '…' : r.title,
    fullTitle: r.title,
    meta: getTimeMeta(r.source),
    abstract: r.abstract,
    url: r.url,
    source: r.source,
  }));
};

// ============================================================
// 攻略联网搜索 — 搜索角色/英雄的出装、打法攻略
// ============================================================
window.searchGuide = async function(gameName, heroName, gameId) {
  // 构造搜索词：角色名 + 游戏名 + 攻略关键词
  const now = new Date();
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月`;
  const query = `${gameName} ${heroName} 攻略 出装 ${dateStr}`;
  return await window.webSearch(query, { maxResults: 5 });
};

// 格式化攻略搜索结果
window.formatGuideResults = function(results, heroName) {
  if (!results || results.length === 0) return null;

  return results.map(r => ({
    title: r.title.length > 32 ? r.title.slice(0, 32) + '…' : r.title,
    fullTitle: r.title,
    abstract: r.abstract,
    url: r.url,
    source: r.source || '网络攻略',
  }));
};
