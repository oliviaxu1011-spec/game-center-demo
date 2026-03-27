// ============================================================
// 搜索代理 Cloudflare Worker
// 部署到 Cloudflare Workers（免费，每天 10 万次请求）
// 功能：代理百度/Bing 搜索请求，解析 HTML 返回结构化 JSON
// ============================================================

// ── 允许的来源（可按需修改）──
const ALLOWED_ORIGINS = ['*']; // 生产环境建议改为你的域名

// ── CORS 响应头 ──
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

// ── 入口 ──
export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin')) });
    }

    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';

    // 路由：/search?q=关键词&engine=baidu|bing&max=5
    if (url.pathname === '/search') {
      return handleSearch(url, origin);
    }

    // 健康检查
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', time: new Date().toISOString() }), {
        headers: corsHeaders(origin),
      });
    }

    return new Response(JSON.stringify({
      error: 'Not Found',
      usage: '/search?q=关键词&engine=baidu|bing|auto&max=5',
    }), { status: 404, headers: corsHeaders(origin) });
  },
};

// ============================================================
// 搜索处理
// ============================================================
async function handleSearch(url, origin) {
  const query = url.searchParams.get('q');
  if (!query) {
    return new Response(JSON.stringify({ error: '缺少搜索参数 q' }), {
      status: 400, headers: corsHeaders(origin),
    });
  }

  const engine = (url.searchParams.get('engine') || 'auto').toLowerCase();
  const maxResults = Math.min(parseInt(url.searchParams.get('max') || '5'), 10);

  let results = null;
  let usedEngine = '';

  try {
    if (engine === 'baidu') {
      results = await searchBaidu(query, maxResults);
      usedEngine = 'baidu';
    } else if (engine === 'bing') {
      results = await searchBing(query, maxResults);
      usedEngine = 'bing';
    } else {
      // auto 模式：百度优先，失败降级到 Bing
      results = await searchBaidu(query, maxResults);
      usedEngine = 'baidu';
      if (!results || results.length === 0) {
        results = await searchBing(query, maxResults);
        usedEngine = 'bing';
      }
    }
  } catch (e) {
    // 主引擎失败，尝试备用
    if (usedEngine === 'baidu' || engine === 'auto') {
      try {
        results = await searchBing(query, maxResults);
        usedEngine = 'bing';
      } catch (e2) {
        // 全部失败
      }
    }
  }

  const response = {
    query: query,
    engine: usedEngine,
    results: results || [],
    count: results ? results.length : 0,
    time: new Date().toISOString(),
  };

  return new Response(JSON.stringify(response), {
    headers: corsHeaders(origin),
  });
}

// ============================================================
// 百度搜索
// ============================================================
async function searchBaidu(query, maxResults) {
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://www.baidu.com/s?wd=${encodedQuery}&rn=${maxResults + 3}&ie=utf-8`;

  const res = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
    redirect: 'follow',
  });

  if (!res.ok) throw new Error(`Baidu HTTP ${res.status}`);
  const html = await res.text();
  return parseBaiduHTML(html, maxResults);
}

function parseBaiduHTML(html, maxResults) {
  const results = [];

  // 方法1: 正则提取搜索结果
  // 百度搜索结果在 class="result c-container" 或 class="c-container" 的 div 中
  // 标题在 <h3> 标签中的 <a> 链接
  const blockRegex = /<div[^>]*class="[^"]*result[^"]*c-container[^"]*"[^>]*>[\s\S]*?(?=<div[^>]*class="[^"]*result[^"]*c-container|$)/gi;
  const blocks = html.match(blockRegex) || [];

  for (const block of blocks) {
    if (results.length >= maxResults) break;

    // 提取标题和链接
    const titleMatch = block.match(/<h3[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!titleMatch) continue;

    const url = titleMatch[1] || '';
    const title = titleMatch[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (!title || title.length < 4) continue;

    // 过滤百度安全验证等无效结果
    if (/百度安全验证|百度快照/.test(title)) continue;

    // 提取摘要
    let abstract = '';
    const absMatch = block.match(/<span[^>]*class="[^"]*content-right[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      || block.match(/<div[^>]*class="[^"]*c-abstract[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      || block.match(/<span[^>]*class="[^"]*c-font-normal[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    if (absMatch) {
      abstract = absMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 150);
    }

    // 提取来源
    let source = '';
    const srcMatch = block.match(/<span[^>]*class="[^"]*c-showurl[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      || block.match(/<span[^>]*class="[^"]*c-color-gray[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    if (srcMatch) {
      source = srcMatch[1].replace(/<[^>]*>/g, '').trim();
    }

    results.push({
      title: cleanTitle(title),
      abstract: abstract,
      source: source,
      url: url,
    });
  }

  // 如果正则方法没有结果，用更宽松的正则
  if (results.length === 0) {
    const h3Regex = /<h3[^>]*class="[^"]*t[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = h3Regex.exec(html)) !== null && results.length < maxResults) {
      const url = match[1] || '';
      const title = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      if (title.length < 4 || /百度安全验证/.test(title)) continue;

      results.push({
        title: cleanTitle(title),
        abstract: '',
        source: '',
        url: url,
      });
    }
  }

  return results;
}

// ============================================================
// Bing 搜索
// ============================================================
async function searchBing(query, maxResults) {
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://cn.bing.com/search?q=${encodedQuery}&count=${maxResults + 3}&ensearch=0&cc=cn&setlang=zh-CN`;

  const res = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
    redirect: 'follow',
  });

  if (!res.ok) throw new Error(`Bing HTTP ${res.status}`);
  const html = await res.text();
  return parseBingHTML(html, maxResults);
}

function parseBingHTML(html, maxResults) {
  const results = [];

  // Bing 搜索结果在 <li class="b_algo"> 中
  const blockRegex = /<li class="b_algo"[^>]*>([\s\S]*?)<\/li>/gi;
  let blockMatch;

  while ((blockMatch = blockRegex.exec(html)) !== null && results.length < maxResults) {
    const block = blockMatch[1];

    // 提取标题和链接
    const titleMatch = block.match(/<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!titleMatch) continue;

    const url = titleMatch[1];
    const title = titleMatch[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (!title || title.length < 4) continue;

    // 提取摘要
    let abstract = '';
    const descMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
      || block.match(/<div[^>]*class="[^"]*b_caption[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (descMatch) {
      abstract = descMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 150);
    }

    // 提取来源（从 URL 中提取域名）
    let source = '';
    try {
      source = new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {}

    results.push({
      title: title,
      abstract: abstract,
      source: source,
      url: url,
    });
  }

  return results;
}

// ── 标题清洗 ──
function cleanTitle(title) {
  return title
    .replace(/百度(安全验证|快照)/g, '')
    .replace(/_百度[^_]*$/g, '')
    .replace(/- 百度[^-]*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
