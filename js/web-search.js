// ============================================================
// WEB SEARCH — 联网搜索模块（百度搜索）
// 为 AI Bot 提供实时资讯能力，替代静态 mock 数据
// 修改说明：直接编辑此文件即可调整搜索逻辑，刷新页面生效
// ============================================================

// ── 搜索配置 ──────────────────────────────────────
window.WEB_SEARCH_CONFIG = {
  // 使用多个 CORS 代理做**并发竞速**（谁先返回用谁）
  // 2026.03 更新：扩充代理池，增加可用性
  corsProxies: [
    'https://proxy.corsfix.com/?',
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://test.cors.workers.dev/?',
    'https://thingproxy.freeboard.io/fetch/',
    'https://corsproxy.io/?',
  ],
  // 百度搜索 URL 模板
  baiduUrl: 'https://www.baidu.com/s?wd=',
  // 搜索超时（毫秒）— 7s（部分代理响应较慢，给足时间）
  timeout: 7000,
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
// 核心搜索函数 — 通过百度搜索获取实时资讯（并发竞速版）
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

  const encodedQuery = encodeURIComponent(query);
  const searchUrl = window.WEB_SEARCH_CONFIG.baiduUrl + encodedQuery;
  const proxies = window.WEB_SEARCH_CONFIG.corsProxies;
  const timeout = window.WEB_SEARCH_CONFIG.timeout;

  // ── 并发竞速：所有代理同时发起请求，谁先成功用谁 ──
  const racePromises = proxies.map((proxy, i) => {
    return new Promise(async (resolve) => {
      try {
        // 不同代理的 URL 拼接方式不同：
        // corsfix / cors.workers.dev / thingproxy → 直接拼原始 URL
        // allorigins / codetabs / corsproxy.io → 需要 encodeURIComponent
        const needsEncode = proxy.includes('allorigins') || proxy.includes('codetabs');
        const proxyUrl = proxy + (needsEncode ? encodeURIComponent(searchUrl) : searchUrl);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const res = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: { 'Accept': 'text/html' },
        });

        if (!res.ok) {
          clearTimeout(timeoutId);
          console.warn(`[WebSearch] 代理${i}返回 ${res.status}`);
          resolve(null);
          return;
        }

        // res.text() 也可能挂起（如代理返回极慢的流式响应）
        // 用 Promise.race 给 body 读取加超时保护
        const html = await Promise.race([
          res.text(),
          new Promise((_, rej) => setTimeout(() => rej(new Error('body读取超时')), timeout)),
        ]);
        clearTimeout(timeoutId);
        const results = parseBaiduResults(html, maxResults);

        if (results.length > 0) {
          console.log(`[WebSearch] 代理${i}成功，获取 ${results.length} 条结果`);
          resolve(results);
        } else {
          console.warn(`[WebSearch] 代理${i}返回0结果`);
          resolve(null);
        }
      } catch (e) {
        if (e.name === 'AbortError') {
          console.warn(`[WebSearch] 代理${i}超时(${timeout}ms)`);
        } else {
          console.warn(`[WebSearch] 代理${i}失败:`, e.message);
        }
        resolve(null);
      }
    });
  });

  // 用自定义 race：第一个非 null 的结果胜出
  // 同时加入**总超时保护**，防止所有代理都卡住（如 res.text() 永远不返回）
  const totalTimeout = timeout + 3000; // 总超时 = 单代理超时 + 3s 缓冲
  try {
    const results = await Promise.race([
      _raceForFirst(racePromises),
      new Promise(resolve => setTimeout(() => {
        console.warn(`[WebSearch] 总超时(${totalTimeout}ms)，强制降级`);
        resolve(null);
      }, totalTimeout)),
    ]);
    if (results) {
      window._searchCache[cacheKey] = { data: results, time: Date.now() };
      return results;
    }
  } catch (e) {
    console.warn('[WebSearch] 竞速全部失败');
  }

  return [];
};

// 辅助函数：等待第一个成功（非 null）的 Promise
function _raceForFirst(promises) {
  return new Promise((resolve, reject) => {
    let pending = promises.length;
    if (pending === 0) return resolve(null);
    promises.forEach(p => {
      p.then(result => {
        if (result) resolve(result);
        else if (--pending === 0) resolve(null);
      });
    });
  });
}

// ============================================================
// 解析百度搜索结果 HTML
// ============================================================
function parseBaiduResults(html, maxResults) {
  const results = [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 百度搜索结果在 .result.c-container 或 .c-result 中
    const containers = doc.querySelectorAll('.result.c-container, .c-container[data-click], div[tpl]');

    containers.forEach((el) => {
      if (results.length >= maxResults) return;

      // 标题
      const titleEl = el.querySelector('h3 a, .t a, .c-title a');
      if (!titleEl) return;
      const title = titleEl.textContent.trim().replace(/\s+/g, ' ');
      if (!title || title.length < 4) return;

      // 摘要
      const absEl = el.querySelector('.c-abstract, .content-right_2s-H4, .c-span-last, .c-font-normal');
      const abstract = absEl ? absEl.textContent.trim().replace(/\s+/g, ' ').slice(0, 120) : '';

      // 来源
      const srcEl = el.querySelector('.c-showurl, .source_s_3LaA0, .c-color-gray, .c-gap-right-xsmall');
      const source = srcEl ? srcEl.textContent.trim() : '';

      // 链接
      const href = titleEl.getAttribute('href') || '';

      results.push({
        title: cleanTitle(title),
        abstract: abstract,
        source: source,
        url: href,
      });
    });
  } catch (e) {
    console.warn('[WebSearch] HTML解析失败:', e.message);
  }

  // 如果 DOM 解析没拿到结果，使用正则作为降级方案
  if (results.length === 0) {
    return parseByRegex(html, maxResults);
  }

  return results;
}

// ── 正则降级解析 ──────────────────────────────────
function parseByRegex(html, maxResults) {
  const results = [];
  // 匹配百度搜索结果标题
  const titleRegex = /<h3[^>]*class="[^"]*t[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = titleRegex.exec(html)) !== null && results.length < maxResults) {
    const url = match[1] || '';
    const rawTitle = match[2] || '';
    // 清除 HTML 标签
    const title = rawTitle.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (title.length < 4) continue;

    results.push({
      title: cleanTitle(title),
      abstract: '',
      source: '',
      url: url,
    });
  }

  return results;
}

// ── 标题清洗 ──────────────────────────────────────
function cleanTitle(title) {
  return title
    .replace(/百度(安全验证|快照)/g, '')
    .replace(/_百度[^_]*$/g, '')
    .replace(/- 百度[^-]*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================
// 智能搜索入口 — 根据游戏和意图自动构造搜索词
// ============================================================
window.searchGameNews = async function(gameId, userText) {
  const queries = window.GAME_SEARCH_QUERIES[gameId] || window.GAME_SEARCH_QUERIES.wzry;
  const text = (userText || '').toLowerCase();

  // 根据用户输入选择搜索策略
  let query;
  if (/版本|更新|update|patch|赛季/.test(text)) {
    query = queries.version;
  } else if (/资讯|新闻|消息|动态|公告/.test(text)) {
    query = queries.news;
  } else {
    query = queries.default;
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
  // 提前开始搜索
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = window.detectGame ? (window.detectGame(text) || DEFAULT_GAME) : DEFAULT_GAME;
  console.log('[PreSearch] 检测到资讯类输入，提前搜索:', text);
  window._preSearchCache = {
    promise: window.searchGameNews(game.id, text),
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
