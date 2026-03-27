// ============================================================
// RESPONSE BUILDERS — 响应构建器
// 根据意图 ID 和用户文本，生成对应的回复（text + cardHtml）
// 修改说明：直接编辑此文件即可调整卡片展示内容，刷新页面生效
// ============================================================

// ── 通用 icon 渲染辅助函数（仅 AI 对话卡片使用）─────────
// 三级回退：iconUrl(在线) → iconLocal(本地) → emoji
// 兼容旧字段：如果对象仍带 iconImg，也能正常使用
window.renderGameIcon = function(obj, size, borderRadius, fontSize) {
  size = size || 36;
  borderRadius = borderRadius || 10;
  fontSize = fontSize || Math.round(size * 0.5);

  // 取图标源：优先在线 URL → 本地路径 → 旧 iconImg 兼容
  const urlSrc   = obj.iconUrl   || '';
  const localSrc = obj.iconLocal || '';
  const legacySrc = obj.iconImg  || obj.img || '';
  const primarySrc = urlSrc || localSrc || legacySrc;

  const emojiBg = obj.gradient || obj.bg || '#2a3060';
  const emojiHtml = `<span class="game-icon-emoji" style="display:flex;width:${size}px;height:${size}px;border-radius:${borderRadius}px;align-items:center;justify-content:center;font-size:${fontSize}px;background:${emojiBg}">${obj.icon || '🎮'}</span>`;

  if (!primarySrc) return emojiHtml;

  // 有在线 URL 且有本地路径 → 在线失败回退本地，本地再失败回退 emoji
  if (urlSrc && localSrc) {
    return `<img src="${urlSrc}" style="width:${size}px;height:${size}px;border-radius:${borderRadius}px;object-fit:cover;display:block" onerror="this.onerror=null;this.src='${localSrc}';var em=this.nextElementSibling;this.addEventListener('error',function(){this.style.display='none';em.style.display='flex'})" alt=""><span style="display:none;width:${size}px;height:${size}px;border-radius:${borderRadius}px;align-items:center;justify-content:center;font-size:${fontSize}px;background:${emojiBg}">${obj.icon || '🎮'}</span>`;
  }

  // 只有一个图片源（URL / 本地 / 旧字段）→ 失败回退 emoji
  return `<img src="${primarySrc}" style="width:${size}px;height:${size}px;border-radius:${borderRadius}px;object-fit:cover;display:block" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt=""><span style="display:none;width:${size}px;height:${size}px;border-radius:${borderRadius}px;align-items:center;justify-content:center;font-size:${fontSize}px;background:${emojiBg}">${obj.icon || '🎮'}</span>`;
};

// ── 🎮 功能 × 游戏 统一支持范围配置 ─────────────────────────
// 每个功能列出其支持的游戏 ID 列表
// 'ALL' 表示支持全部游戏（从 ENGINE_GAMES 动态获取）
// 'NONE' 表示不区分游戏（如日报/情绪）
// 具体数组 表示仅支持列出的游戏
// ─────────────────────────────────────────────────────────────
window.FEATURE_GAME_SCOPE = {
  welfare:   'ALL',                         // 福利：全部游戏
  record:    ['wzry', 'hpjy', 'sjz', 'hyrz', 'wwqy', 'aqtw', 'cfm'],  // 战绩：支持7款游戏
  match_query: ['wzry', 'sjz'],             // 对局查询：仅王者荣耀、三角洲行动
  replay:    ['wzry'],                       // 复盘：仅王者荣耀
  partner:   ['wzry', 'hpjy', 'sjz', 'cfm'], // 找搭子：王者荣耀、和平精英、三角洲、穿越火线
  news:      'ALL',                         // 资讯：全部游戏
  guide:     'ALL',                         // 攻略：全部游戏
  highlight: ['wzry', 'hpjy'],              // 高光：仅王者荣耀、和平精英
  download:  'ALL',                         // 下载：全部游戏
  skin:      'ALL',                         // 皮肤：全部游戏
  report:    ['wzry', 'hpjy', 'sjz'],              // 日报/周报：支持3款游戏
  emotion:   'NONE',                        // 情绪互动：不区分游戏
  reminder:  'ALL',                         // 提醒：全部游戏
  ranking:   ['wzry', 'hpjy', 'sjz'],       // 好友排行：支持3款游戏
};

// ── 辅助函数：获取游戏的商业化产品术语（皮肤/忍者/角色/武器等）────
// 每个游戏在 DATA_GAMES 中配置了 skinLabel 字段
// 未配置时默认返回"皮肤"
window.getGameSkinLabel = function(gameId) {
  var GAMES = window.ENGINE_GAMES || window.DATA_GAMES || {};
  var game = GAMES[gameId];
  return (game && game.skinLabel) || '皮肤';
};

// ── 辅助函数：获取某功能支持的游戏 ID 列表 ───────────────────
window.getFeatureSupportedGames = function(featureId) {
  const scope = window.FEATURE_GAME_SCOPE[featureId];
  if (scope === 'ALL') return Object.keys(window.ENGINE_GAMES || {});
  if (scope === 'NONE') return [];
  return scope || [];
};

// ── 辅助函数：判断某游戏是否支持某功能 ───────────────────────
window.isGameSupportedForFeature = function(gameId, featureId) {
  const scope = window.FEATURE_GAME_SCOPE[featureId];
  // 🔧 虚拟游戏（不在库中）特殊处理：只允许资讯和攻略（可联网搜索），
  //    其他功能（福利/战绩/搭子/皮肤等）需要本地数据，虚拟游戏没有 → 不支持
  if (typeof gameId === 'string' && gameId.startsWith('virtual_')) {
    // 资讯和攻略可以联网搜索，允许虚拟游戏使用
    const virtualAllowed = ['news', 'guide'];
    return virtualAllowed.includes(featureId);
  }
  if (scope === 'ALL') return true;
  if (scope === 'NONE') return true; // 不区分游戏的功能不做拦截
  return Array.isArray(scope) && scope.includes(gameId);
};

// ── 辅助函数：获取某功能追问时的游戏列表（用于 quickReplies）──
// 默认最多展示 3 个热门游戏，避免追问选项过多
window.getFeatureQuickReplyGames = function(featureId, maxCount) {
  maxCount = maxCount || 3;
  const supported = window.getFeatureSupportedGames(featureId);
  const GAMES = window.ENGINE_GAMES || {};
  // 热门排序优先级
  const hotOrder = ['wzry', 'hpjy', 'sjz', 'cfm', 'ys', 'hyrz', 'wwqy', 'aqtw', 'lkwg', 'nzwl'];
  const sorted = supported.sort((a, b) => {
    const ai = hotOrder.indexOf(a); const bi = hotOrder.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
  return sorted.slice(0, maxCount).map(id => GAMES[id]).filter(Boolean);
};

// ── 辅助函数：获取不支持时的友好提示文案 ─────────────────────
window.getUnsupportedGameTip = function(featureId, gameName, gameId) {
  const supported = window.getFeatureSupportedGames(featureId);
  const GAMES = window.ENGINE_GAMES || {};
  const names = supported.map(id => GAMES[id]?.name).filter(Boolean);
  const featureLabels = {
    replay: 'AI复盘', record: '战绩查询', match_query: '对局查询', partner: '找搭子',
    welfare: '福利', news: '资讯', guide: '攻略',
    highlight: '高光视频', download: '下载', skin: '商城',
    reminder: '提醒', ranking: '好友排行',
  };
  var label = featureLabels[featureId] || featureId;
  // 如果是 skin 功能且有游戏 ID，使用该游戏的商业化术语
  if (featureId === 'skin' && gameId) {
    label = window.getGameSkinLabel(gameId);
  }
  return `${label}目前支持 <strong>${names.join('、')}</strong>，${gameName}正在开发中 🛠️`;
};

// ── 通用追问构建辅助：功能完成后自动生成追问选项 ───────────────
// 用法：var qr = _buildAfterCompleteQR('record', game.name, ['replay', 'ranking', 'partner'], game.id);
// 返回：{ quickReplies, onQR, _displayMap } 或 null（无配置时）
// 🔧 第4个参数 gameId 可选：传入后会用 isGameSupportedForFeature 过滤，确保只推荐该游戏支持的功能
window._buildAfterCompleteQR = function(featureId, gameName, nextFeatureIds, gameId) {
  // 功能 → 对应 builder 的映射
  var featureBuilderMap = {
    welfare:     function(k) { return window.buildWelfareResponse(k); },
    record:      function(k) { return window.buildRecordResponse(k); },
    match_query: function(k) { return window.buildMatchQueryResponse(k); },
    replay:      function(k) { return window.buildReplayResponse(k); },
    partner:     function(k) { return window.buildPartnerResponse(k); },
    news:        function(k) { return window.buildNewsResponse(k); },
    guide:       function(k) { return window.buildGuideResponse(k); },
    highlight:   function(k) { return window.buildHighlightResponse(k); },
    download:    function(k) { return window.buildDownloadResponse(k); },
    skin:        function(k) { return window.buildSkinResponse(k); },
    report:      function(k) { return window.buildReportResponse(k); },
    reminder:    function(k) { return window.buildReminderResponse(k); },
    ranking:     function(k) { return window.buildRankingResponse(k); },
  };

  var featureWord = {
    welfare: '福利', record: '战绩', replay: '复盘', partner: '找搭子',
    news: '资讯', guide: '攻略', highlight: '高光', download: '',
    skin: '皮肤', report: '周报', reminder: '提醒', ranking: '好友排行',
    match_query: '对局',
  };

  // 🔧 辅助：检查某功能是否对当前游戏可用
  var isSupported = window.isGameSupportedForFeature || function() { return true; };
  var _canUse = function(fid) {
    return !gameId || isSupported(gameId, fid);
  };

  // ── 上下文去重：过滤掉对话中已经执行过的功能 ──────────────
  var usedIntents = {};
  (window.chatHistory || []).forEach(function(h) {
    if (h._intentId) usedIntents[h._intentId] = true;
  });
  // 当前功能自身也算已使用
  usedIntents[featureId] = true;

  // 从候选列表中移除已使用的功能 + 该游戏不支持的功能
  var filteredIds = nextFeatureIds.filter(function(fid) {
    return !usedIntents[fid] && _canUse(fid);
  });

  // 如果过滤后数量不足，从候补池中补充（排除已用 + 已在列表中的 + 不支持的）
  if (filteredIds.length < nextFeatureIds.length) {
    var allFeatures = ['welfare', 'record', 'replay', 'partner', 'news',
                       'guide', 'skin', 'ranking', 'highlight', 'reminder'];
    var inList = {};
    filteredIds.forEach(function(f) { inList[f] = true; });
    nextFeatureIds.forEach(function(f) { inList[f] = true; });

    for (var i = 0; i < allFeatures.length && filteredIds.length < 3; i++) {
      var candidate = allFeatures[i];
      if (!usedIntents[candidate] && !inList[candidate] && _canUse(candidate)) {
        filteredIds.push(candidate);
        inList[candidate] = true;
      }
    }
  }

  // 如果全部功能都用过了或都不支持，降级回原始列表中该游戏支持的功能
  if (filteredIds.length === 0) {
    filteredIds = nextFeatureIds.filter(function(fid) { return _canUse(fid); });
  }
  // 如果该游戏完全没有支持的追问功能，返回 null（不展示追问）
  if (filteredIds.length === 0) return null;

  var qrItems = buildQR_L2_afterComplete(featureId, gameName, filteredIds);
  if (!qrItems || qrItems.length === 0) return null;

  var resolved = resolveQR(qrItems, function(actionKey) {
    // 根据 actionKey 中的功能词找到对应的 builder
    for (var fid in featureWord) {
      var word = featureWord[fid];
      if (word && actionKey.endsWith(word)) {
        var builder = featureBuilderMap[fid];
        if (builder) return function() { return builder(actionKey); };
      }
    }
    // fallback: 默认走 record
    return function() { return window.buildRecordResponse(actionKey); };
  });

  return {
    quickReplies: resolved.quickReplies,
    onQR: resolved.onQR,
    _displayMap: resolved.displayMap,
  };
};

// ── 响应路由器（分发到各 build 函数）───────────────
window.buildResponse = function(intentId, userText) {
  const map = {
    welfare: window.buildWelfareResponse,
    record:  window.buildRecordResponse,
    match_query: window.buildMatchQueryResponse,
    replay:  window.buildReplayResponse,
    partner: window.buildPartnerResponse,
    news:    window.buildNewsResponse,
    guide:   window.buildGuideResponse,
    highlight: window.buildHighlightResponse,
    download:  window.buildDownloadResponse,
    skin:    window.buildSkinResponse,
    report:  window.buildReportResponse,
    emotion: window.buildEmotionResponse,
    reminder: window.buildReminderResponse,
    ranking:  window.buildRankingResponse,
  };
  const fn = map[intentId];
  return fn ? fn(userText) : null;
};

// ── 福利响应 ───────────────────────────────────────
window.buildWelfareResponse = function(text) {
  const game = detectGameWithContext(text);
  const showAll = text === '_all';
  if (game) {
    // 该游戏不支持福利 → 友好提示并引导
    if (!isGameSupportedForFeature(game.id, 'welfare')) {
      const qrGames = getFeatureQuickReplyGames('welfare', 2);
      const qrItems = buildQR_L2_suggest(qrGames, 'welfare', game.name, 'guide', game.id);
      const resolved = resolveQR(qrItems, function(key) {
        if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
        return function() { return window.buildWelfareResponse(key); };
      });
      return { text: getUnsupportedGameTip('welfare', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
    }
    const welfareByGame = window.MOCK_WELFARE_BY_GAME || {};
    const items = welfareByGame[game.id] || welfareByGame.wzry;
    // 追问：领完福利引导看战绩/逛皮肤/找搭子
    var welfareQR = _buildAfterCompleteQR('welfare', game.name, ['record', 'skin', 'partner'], game.id);
    var welfareResult = {
      text: `${game.name}今天有 <strong>${items.length}个福利</strong> 可以领，快去领吧！`,
      card: 'welfare_' + game.id,
      cardHtml: `
        <div class="result-card">
          <div class="result-card-header">🎁 今日可领福利 · ${game.name}</div>
          <div class="welfare-list">
            ${items.map(i=>`
              <div class="welfare-item">
                <div class="wi-icon ${i.cls}">${i.icon}</div>
                <div class="wi-info"><div class="wi-name">${i.name}</div><div class="wi-deadline">⏰ ${i.dl}</div></div>
                <button class="wi-action" onclick="${i.url ? `window.open('${i.url}','_blank')` : `showToast('正在跳转领取 ${i.name}...')`}">立即领取</button>
              </div>`).join('')}
          </div>
        </div>`
    };
    if (welfareQR) { welfareResult.quickReplies = welfareQR.quickReplies; welfareResult.onQR = welfareQR.onQR; welfareResult._displayMap = welfareQR._displayMap; }
    return welfareResult;
  }
  if (showAll) {
    return {
      text: '帮你汇总了 <strong>全部游戏的今日福利</strong> 🎉',
      card: 'welfare__all'
    };
  }
  const qrGames = getFeatureQuickReplyGames('welfare');
  const qrItems = buildQR_L1_selectGame(qrGames, 'welfare');
  const resolved = resolveQR(qrItems, function(key) {
    return function() { return window.buildWelfareResponse(key); };
  });
  return { text: '想看哪款游戏的福利呢？🎁 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
};

// ── 战绩响应 ───────────────────────────────────────
// 辅助：渲染数据总览卡片的单个格子
function _renderDataCell(cell) {
  if (!cell) return '<div class="record-data-card__cell"></div>';
  const valClass = cell.isText ? 'record-data-card__cell-value--text' : 'record-data-card__cell-value';
  return `<div class="record-data-card__cell"><span class="${valClass}">${cell.value}</span><span class="record-data-card__cell-label">${cell.label}</span></div>`;
}

// 辅助：各游戏数据总览卡片的主题色配置
const GAME_CARD_COLORS = {
  wzry: { bg:'rgba(255,174,0,0.25)',  border:'rgba(255,174,0,0.3)',  rankBg:'linear-gradient(135deg,#c9a227,#f0d060)' },       // 橙色
  hpjy: { bg:'rgba(139,90,43,0.20)',  border:'rgba(139,90,43,0.3)',  rankBg:'linear-gradient(135deg,#8b5a2b,#c4956a)' },       // 棕色
  sjz:  { bg:'rgba(46,139,87,0.20)',   border:'rgba(46,139,87,0.3)',  rankBg:'linear-gradient(135deg,#2e8b57,#5cb85c)' },       // 绿色
  hyrz: { bg:'rgba(220,53,53,0.20)',   border:'rgba(220,53,53,0.3)',  rankBg:'linear-gradient(135deg,#c0392b,#e74c3c)' },       // 红色
  wwqy: { bg:'rgba(128,0,255,0.18)',   border:'rgba(128,0,255,0.3)',  rankBg:'linear-gradient(135deg,#7b2ff7,#a855f7)' },       // 紫色
  aqtw: { bg:'rgba(80,80,80,0.22)',    border:'rgba(80,80,80,0.3)',   rankBg:'linear-gradient(135deg,#4a4a4a,#6b6b6b)' },       // 深灰色
  cfm:  { bg:'rgba(0,51,153,0.22)',    border:'rgba(0,51,153,0.3)',   rankBg:'linear-gradient(135deg,#003399,#1a6bff)' },       // 深蓝色
};

// 辅助：各游戏近期数据卡片的主题色配置
const GAME_RECENT_COLORS = {
  wzry: 'rgba(0,153,255,0.25)',       // 蓝色
  hpjy: 'rgba(139,90,43,0.22)',       // 棕色
  sjz:  'rgba(46,139,87,0.22)',       // 绿色
  hyrz: 'rgba(220,53,53,0.22)',       // 红色
  wwqy: 'rgba(128,0,255,0.20)',       // 紫色
  aqtw: 'rgba(80,80,80,0.24)',        // 深灰色
  cfm:  'rgba(0,51,153,0.24)',        // 深蓝色
};

// ── 对局查询响应（仅王者荣耀 + 三角洲行动）───────────────
window.buildMatchQueryResponse = function(text) {
  const range = parseTimeRange(text) || { label:'今日', days:0, tag:'today' };
  const game = detectGameWithContext(text);

  // 未指定游戏 → 反问用户（仅展示支持的游戏）
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('match_query');
    const qrItems = buildQR_L1_selectGame(qrGames, 'match_query');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildMatchQueryResponse(key); };
    });
    return { text: '你想查哪款游戏的对局记录？目前支持王者荣耀和三角洲行动 🎮', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 不支持的游戏 → 友好提示
  if (!isGameSupportedForFeature(game.id, 'match_query')) {
    var qrGames2 = getFeatureQuickReplyGames('match_query');
    var qrItems2 = buildQR_L2_suggest(qrGames2, 'match_query', game.name, 'record', game.id);
    var resolved2 = resolveQR(qrItems2, function(key) {
      if (key === game.name + '战绩') return function() { return window.buildRecordResponse(game.name + '战绩'); };
      // 降级场景：crossFeature 可能从 record 降级到 guide/news
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      if (key === game.name + '资讯') return function() { return window.buildNewsResponse(game.name + '资讯'); };
      return function() { return window.buildMatchQueryResponse(key); };
    });
    return { text: getUnsupportedGameTip('match_query', game.name), quickReplies: resolved2.quickReplies, onQR: resolved2.onQR, _displayMap: resolved2.displayMap };
  }

  // 从 mock 数据获取对局列表
  var mockData = window.MOCK_MATCH_QUERY || {};
  var gameData = mockData[game.id] || {};

  // ── 指定对局（last_match / nth_match）：从 today 数据中按序号取出 ──
  var isSpecificMatch = (range.tag === 'last_match' || range.tag === 'nth_match');
  var matchIndex = (range.matchIndex != null) ? range.matchIndex : 0;
  var matchData, matches, specificMatchInfo;

  if (isSpecificMatch) {
    // 指定对局时，从 today 数据取
    var todayData = gameData['today'] || { summary: '暂无数据', matches: [] };
    var allMatches = todayData.matches || [];
    if (matchIndex >= 0 && matchIndex < allMatches.length) {
      matches = [allMatches[matchIndex]];
      specificMatchInfo = { index: matchIndex, total: allMatches.length, found: true };
      matchData = { summary: todayData.summary, matches: matches };
    } else {
      // 序号超出范围 → 提示用户
      matches = [];
      specificMatchInfo = { index: matchIndex, total: allMatches.length, found: false };
      matchData = { summary: '暂无该局数据', matches: [] };
    }
  } else {
    matchData = gameData[range.tag] || gameData['today'] || { summary: '暂无数据', matches: [] };
    matches = matchData.matches || [];
    specificMatchInfo = null;
  }
  var isSjz = (game.id === 'sjz');

  // 构建对局列表 HTML
  var matchItemsHtml = matches.map(function(m) {
    // 头像区
    var avatarHtml = '<div class="mq-avatar-wrap">'
      + '<img class="mq-avatar" src="' + (m.heroImg || '') + '" alt="角色" onerror="this.style.background=\'#ddd\'">'
      + (m.heroLabel ? '<div class="mq-avatar-label">' + m.heroLabel + '</div>' : '')
      + '</div>';

    // 结果文字
    var resultCls = m.result === 'win' ? 'win' : 'lose';
    var resultHtml = '<div class="mq-result ' + resultCls + '">' + m.resultText + '</div>';

    // KDA / 击败+收获
    var kdaHtml;
    if (isSjz) {
      kdaHtml = '<div class="mq-kda">' + (m.killInfo || '') + ' /' + (m.lootInfo || '') + '</div>';
    } else {
      kdaHtml = '<div class="mq-kda">' + (m.kda || '') + '</div>';
    }

    // 标签
    var tagsHtml = '';
    if (m.tags && m.tags.length > 0) {
      tagsHtml = '<div class="mq-tags">' + m.tags.map(function(t) {
        var mvpIconSvg = t.isMVP ? '<svg class="mq-mvp-icon" viewBox="0 0 10 10" fill="none"><path d="M5 0L6.1 3.5H9.8L6.9 5.7L7.7 9.3L5 7.2L2.3 9.3L3.1 5.7L0.2 3.5H3.9L5 0Z" fill="#926100"/></svg>' : '';
        return '<span class="mq-tag ' + (t.type || 'gray') + '">' + mvpIconSvg + t.text + '</span>';
      }).join('') + '</div>';
    }

    // 时间 + 模式
    var metaHtml = '<div class="mq-meta"><span>' + (m.time || '') + '</span><span>' + (m.mode || '') + '</span></div>';

    // 箭头
    var arrowSvg = '<svg class="mq-arrow" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    return '<div class="mq-item" onclick="showToast(\'正在加载对局详情...\')">'
      + '<div class="mq-left">' + avatarHtml + '<div class="mq-text">' + resultHtml + kdaHtml + '</div></div>'
      + '<div class="mq-right"><div class="mq-right-content">' + tagsHtml + metaHtml + '</div>' + arrowSvg + '</div>'
      + '</div>';
  }).join('');

  // 卡片底部按钮
  var footerHtml = '';
  var safeGameName = game.name.replace(/'/g, "\\'");
  if (isSpecificMatch) {
    // 指定对局 → 按钮触发"今天全部对局"查询
    footerHtml = '<div class="mq-footer"><button class="mq-view-all-btn" onclick="processUserMessage(\'' + safeGameName + '今天对局\')"><span>查看今日全部对局</span></button></div>';
  } else {
    footerHtml = '<div class="mq-footer"><button class="mq-view-all-btn" onclick="showToast(\'正在加载完整对局记录...\')"><span>查看全部</span></button></div>';
  }

  var cardHtml = '<div class="mq-list">'
    + matchItemsHtml
    + footerHtml
    + '</div>';

  // 追问选项
  var qrItems3 = buildQR_L2_afterComplete('match_query', game.name, ['record', 'replay']);
  var resolved3 = resolveQR(qrItems3, function(key) {
    if (key === game.name + '战绩') return function() { return window.buildRecordResponse(game.name + '战绩'); };
    if (key === game.name + '复盘') return function() { return window.buildReplayResponse(game.name + '复盘'); };
    return function() { return window.buildRecordResponse(key); };
  });

  // 构建标题文案
  var titleText;
  if (isSpecificMatch && specificMatchInfo) {
    if (!specificMatchInfo.found) {
      // 序号超出范围
      titleText = 'Q仔今天共打了 <strong>' + specificMatchInfo.total + '</strong> 把' + game.name + '，没有找到第 ' + (specificMatchInfo.index + 1) + ' 把哦 🤔'
        + '<p class="mq-intro">可以试试说"上一把"或"今天对局"看看~</p>';
    } else {
      titleText = '这是Q仔 <strong>' + range.label + '</strong> 的' + game.name + '对局记录 📋';
    }
  } else {
    titleText = '这是Q仔 <strong>' + range.label + '</strong> 的' + game.name + '对局记录 📋'
      + '<p class="mq-intro">' + matchData.summary + '</p>';
  }

  return {
    text: titleText,
    cardHtml: (matches.length > 0) ? cardHtml : '',
    quickReplies: resolved3.quickReplies,
    onQR: resolved3.onQR,
    _displayMap: resolved3.displayMap,
  };
};

window.buildRecordResponse = function(text) {
  const GAMES = window.ENGINE_GAMES;
  const range = parseTimeRange(text) || { label:'近7日', days:7, tag:'week' };
  const game = detectGameWithContext(text);

  // 检测是否为"全部/完整战绩"查询 → 强制返回数据总览卡片
  const isFullQuery = /全部|完整|总|赛季|历史|累计|所有/.test(text);
  // 如果用户说"全部战绩"但 parseTimeRange 没匹配到长期时间段，手动修正
  if (isFullQuery && !['last_week', 'month'].includes(range.tag)) {
    range.label = '全部';
    range.tag = 'month'; // fallback 使用 month 数据
    range.days = 30;
  }

  // 未指定具体游戏 → 反问用户（从统一配置动态生成选项）
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('record');
    const qrItems = buildQR_L1_selectGame(qrGames, 'record');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildRecordResponse(key); };
    });
    return { text: '你想查哪款游戏的战绩呢？🎮 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 识别到了游戏，但该游戏不支持战绩查询 → 友好提示并引导
  if (!isGameSupportedForFeature(game.id, 'record')) {
    const qrGames = getFeatureQuickReplyGames('record', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'record', game.name, 'guide', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      return function() { return window.buildRecordResponse(key); };
    });
    return { text: getUnsupportedGameTip('record', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 指定了具体游戏 → 生成卡片数据
  const d = genRecordData(range, game);
  const gid = game.id;

  // ══════════════════════════════════════════════════════
  // 近期查询 → 仅支持 supportsRecentCard 的游戏使用 rank-card 风格
  // 不支持的游戏近期查询统一 fallback 到数据总览卡片（data-card）
  // ══════════════════════════════════════════════════════
  if (d.isRecentQuery && d.recentData && game.supportsRecentCard) {
    const r = d.recentData;
    const recentColor = GAME_RECENT_COLORS[gid] || GAME_RECENT_COLORS.wzry;

    const statsHtml = (r.stats || []).map(s => `
            <div class="record-rank-card__stat-item">
              <span class="record-rank-card__stat-value">${s.value}</span>
              <span class="record-rank-card__stat-label">${s.label}</span>
            </div>`).join('');

    const chart = r.chart || {};
    const chartLabels = chart.labels || [];
    const chartDates = chart.dates || [];
    const tagsHtml = (r.tags || []).map(t => `
              <div class="record-rank-card__tag">
                <div class="record-rank-card__tag-inner">
                  ${t.icon ? `<img class="record-rank-card__tag-icon" src="${t.icon}" alt="">` : ''}
                  <span class="record-rank-card__tag-text">${t.text}</span>
                </div>
                ${t.desc ? `<span class="record-rank-card__tag-desc">${t.desc}</span>` : ''}
              </div>`).join('');

    const recentCardHtml = `
      <div class="record-rank-card" style="background:${recentColor}">
        <div class="record-rank-card__bg">
          <img class="record-rank-card__bg-blur" src="${game.cardBg || 'game-tab-assets/card2-bg-blur-65580c.png'}" alt="">
        </div>
        <div class="record-rank-card__gradient-svg"></div>
        <div class="record-rank-card__content">
          <div class="record-rank-card__header">
            <span class="record-rank-card__title">${range.label}数据</span>
          </div>
          <div class="record-rank-card__stats">${statsHtml}
          </div>
          <div class="record-rank-card__chart">
            <div class="record-rank-card__chart-svg"><img src="${chart.img || ''}" alt="段位变化"></div>
            <div class="record-rank-card__chart-labels">
              ${chartLabels[0] ? `<span class="record-rank-card__chart-label record-rank-card__chart-label--1">${chartLabels[0]}</span>` : ''}
              ${chartLabels[1] ? `<span class="record-rank-card__chart-label record-rank-card__chart-label--2">${chartLabels[1]}</span>` : ''}
              ${chartLabels[2] ? `<span class="record-rank-card__chart-label record-rank-card__chart-label--3">${chartLabels[2]}</span>` : ''}
            </div>
            <div class="record-rank-card__chart-dates">
              ${chartDates.map(dd => `<span class="record-rank-card__chart-date">${dd}</span>`).join('')}
            </div>
            <div class="record-rank-card__chart-dot"></div>
          </div>
          <div class="record-rank-card__footer">
            <hr class="record-rank-card__divider">
            <div class="record-rank-card__tag-row">${tagsHtml}
            </div>
          </div>
        </div>
      </div>`;

    return {
      text: `这是Q仔 <strong>${range.label}</strong> 的${game.name}战绩 📊`,
      cardHtml: recentCardHtml,
      ...(_buildAfterCompleteQR('record', game.name, ['replay', 'ranking', 'partner'], game.id) || {}),
    };
  }

  // ══════════════════════════════════════════════════════
  // 全量查询 → 数据总览卡片（data-card 风格）
  // ══════════════════════════════════════════════════════
  const ov = d.overview;
  const colors = GAME_CARD_COLORS[gid] || GAME_CARD_COLORS.wzry;
  const cells = ov.cells || [];
  const rank = ov.rank || {};
  const rankIconHtml = rank.icon
    ? `<img class="record-data-card__rank-icon" src="${rank.icon}" alt="段位" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="display:none;width:58px;height:58px;border-radius:50%;background:${colors.rankBg};align-items:center;justify-content:center;font-size:28px">🏆</span>`
    : `<span style="display:flex;width:58px;height:58px;border-radius:50%;background:${colors.rankBg};align-items:center;justify-content:center;font-size:28px">🏆</span>`;
  const cellsHtml = `
            <div class="record-data-card__matrix">
              <div class="record-data-card__col">
                ${_renderDataCell(cells[0])}
                ${_renderDataCell(cells[1])}
              </div>
              <div class="record-data-card__col">
                ${_renderDataCell(cells[2])}
                ${_renderDataCell(cells[3])}
              </div>
              <div class="record-data-card__col">
                ${_renderDataCell(cells[4])}
                ${_renderDataCell(cells[5])}
              </div>
            </div>
            <div class="record-data-card__rank">
              ${rankIconHtml}
              <span class="record-data-card__rank-text">${rank.text || ''}</span>
            </div>`;

  const dataCardHtml = `
      <div class="record-data-card" style="background:${colors.bg}">
        <div class="record-data-card__bg">
          <img class="record-data-card__bg-blur" src="${game.cardBg || 'game-tab-assets/card2-bg-blur-65580c.png'}" alt="">
        </div>
        <div class="record-data-card__gradient-svg"></div>
        <div class="record-data-card__content">
          <div class="record-data-card__title">数据总览</div>
          <div class="record-data-card__body">${cellsHtml}
          </div>
        </div>
      </div>`;

  // 文案：支持 recentCard 的游戏显示时间范围，不支持的显示"数据总览"
  const textLabel = (d.isRecentQuery && !game.supportsRecentCard)
    ? `这是Q仔的${game.name}数据总览 📊`
    : `这是Q仔 <strong>${range.label}</strong> 的${game.name}战绩 📊`;

  return {
    text: textLabel,
    cardHtml: dataCardHtml,
    ...(_buildAfterCompleteQR('record', game.name, ['replay', 'ranking', 'partner'], game.id) || {}),
  };
};

// ── 复盘响应 ───────────────────────────────────────
window.buildReplayResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const range = parseTimeRange(text) || { label:'最近一局', days:0, tag:'last_match' };
  let game = detectGameWithContext(text);

  // 未指定游戏 → 先尝试通过英雄名跨游戏识别
  if (!game) {
    const crossResult = detectHeroAcrossGames(text);
    if (crossResult) {
      game = crossResult.game;
    }
  }

  // 🆕 本地匹配失败 → 检查 AI 异步识别的英雄结果，从中获取游戏信息
  if (!game && window._lastAIHeroResult && window._lastAIHeroResult.game) {
    game = window._lastAIHeroResult.game;
    console.log('[复盘] AI兜底提供游戏:', game.name);
  }

  // 仍然未识别 → 追问用户（从统一配置动态生成选项）
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('replay');
    const qrItems = buildQR_L1_selectGame(qrGames, 'replay');
    // 如果复盘只支持少数游戏，补充其他功能引导
    if (qrItems.length < 3) {
      qrItems.push({ text: '查看战绩', actionKey: '查看战绩' });
      qrItems.push({ text: '看看攻略', actionKey: '看看攻略' });
    }
    const onQR = {};
    qrGames.forEach(g => { onQR[g.name + '复盘'] = () => window.buildReplayResponse(g.name + '复盘'); });
    onQR['查看战绩'] = () => window.buildRecordResponse('战绩');
    onQR['看看攻略'] = () => window.buildGuideResponse('攻略');
    const qrTexts = qrItems.map(function(item) { return typeof item === 'string' ? item : item.text; });
    return {
      text: 'AI复盘目前支持 <strong>' + qrGames.map(g=>g.name).join('、') + '</strong>，想复盘一下吗？🔍',
      quickReplies: qrTexts, onQR,
      _displayMap: Object.fromEntries(qrItems.map(function(item) {
        return [typeof item === 'string' ? item : item.text, typeof item === 'string' ? item : item.actionKey];
      })),
    };
  }

  // 识别到了游戏，但该游戏不支持复盘 → 友好提示并引导
  if (!isGameSupportedForFeature(game.id, 'replay')) {
    const qrGames = getFeatureQuickReplyGames('replay');
    const qrItems = buildQR_L2_suggest(qrGames, 'replay', game.name, 'record', game.id);
    // 追加攻略引导（检查去重）
    var guideKey = game.name + '攻略';
    var hasDup = qrItems.some(function(item) { return item.actionKey === guideKey; });
    if (!hasDup) qrItems.push({ text: '看看' + game.name + '攻略', actionKey: guideKey });
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '战绩') return function() { return window.buildRecordResponse(game.name + '战绩'); };
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      if (key === game.name + '资讯') return function() { return window.buildNewsResponse(game.name + '资讯'); };
      return function() { return window.buildReplayResponse(key); };
    });
    return { text: getUnsupportedGameTip('replay', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  const d = genReplayData(range, game);
  const isWin = d.result === 'win';
  const kLabel = d.kLabel || '击杀';
  const dLabel = d.dLabel || '死亡';
  const aLabel = d.aLabel || '助攻';
  const dVal   = d.dVal || d.d;
  const aVal   = d.aVal || d.a;

  // ── 玩家点评数据 ──
  const pc = d.playerCard || {};
  const pcBadgesHtml = (pc.badges || []).map(b => `<div class="rp-pc-badge">${b}</div>`).join('');
  // 英雄头像：优先用 heroImg 图片，兜底用 emoji
  const heroAvatarHtml = pc.heroImg
    ? `<img src="${pc.heroImg}" style="width:44px;height:44px;border-radius:8px;object-fit:cover;display:block" alt="${pc.heroName || ''}">`
    : `<span style="font-size:22px">${d.heroIcon || '🎮'}</span>`;

  return {
    text: `找到Q仔 <strong>${range.label}</strong> 的${game.name}数据了，AI分析如下：`,
    cardHtml: `
      <div class="result-card">
        <div class="replay-card">
          <!-- AI 总结卡片 -->
          <div class="rp-summary-card">
            <div class="rp-sc-bg"></div>
            <div class="rp-sc-decor"></div>
            <div class="rp-sc-content">
              <div class="rp-sc-label">本局对战总结</div>
              <div class="rp-sc-title">${d.summaryTitle || '对局复盘'}</div>
            </div>
          </div>
          <!-- 对战总评 -->
          <div class="rp-review-text">${d.reviewText || d.insight || ''}</div>
          <!-- 玩家评价（我） -->
          <div class="rp-player-card">
            <div class="rp-pc-head">
              <div class="rp-pc-avatar">
                <div class="rp-pc-role">我</div>
                ${heroAvatarHtml}
              </div>
              <div class="rp-pc-info">
                <div class="rp-pc-name">${pc.heroName || d.hero}</div>
                <div class="rp-pc-kda">${pc.kda || (d.k+'杀/'+d.d+'死/'+d.a+'助')}</div>
              </div>
              <div class="rp-pc-badges">${pcBadgesHtml}</div>
            </div>
            <div class="rp-pc-title">${pc.title || '对局表现'}</div>
            <div class="rp-pc-body">${pc.comment || d.insight || ''}</div>
            <div class="rp-pc-divider"></div>
            <div class="rp-pc-foot">
              <div class="rp-pc-foot-left">
                <div class="rp-pc-foot-avatar">🤖</div>
                <span class="rp-pc-foot-name">Q仔</span>
              </div>
            </div>
          </div>
          <!-- 双按钮 -->
          <div class="replay-btn-row">
                      <button class="replay-btn secondary" onclick="handleViewDetailData('${game.id}','${d.hero}','${range.label}')">查看详细复盘</button>  
          <button class="replay-btn primary" onclick="handleGenerateHighlightVideo('${game.id}','${d.hero}','${d.result}')">生成高光视频</button>
          </div>
        </div>
      </div>`,
    // 自定义追问：highlight 按钮直接调用 handleGenerateHighlightVideo，保持"这局"语境
    ...(function() {
      // 获取 guide 和 partner 的通用追问
      var baseQR = _buildAfterCompleteQR('replay', game.name, ['guide', 'partner'], game.id);
      var qrTexts = baseQR ? (baseQR.quickReplies || []) : [];
      var qrOnQR = baseQR ? (baseQR.onQR || {}) : {};
      var qrDisplayMap = baseQR ? (baseQR._displayMap || {}) : {};

      // 插入 highlight 追问按钮（放在第一个位置，最醒目）
      var highlightLabel = '生成这局高光视频';
      qrTexts.unshift(highlightLabel);
      qrOnQR[highlightLabel] = function() {
        // 直接调用视频生成handler，传入当前复盘的上下文
        window.handleGenerateHighlightVideo(game.id, d.hero, d.result);
        return null; // 返回 null 表示由 handler 自行处理气泡
      };
      qrDisplayMap[highlightLabel] = highlightLabel;

      return { quickReplies: qrTexts, onQR: qrOnQR, _displayMap: qrDisplayMap };
    })(),
  };
};

// ── 周报/报告响应 ──────────────────────────────────
window.buildReportResponse = function(text) {
  const range = parseTimeRange(text) || { label:'本周', days:7, tag:'week' };
  const game = detectGameWithContext(text);

  // 未指定具体游戏 → 反问用户
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('report');
    const qrItems = buildQR_L1_selectGame(qrGames, 'report');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildReportResponse(key); };
    });
    return { text: '想看哪个游戏的报告呢？📅 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 识别到了游戏，但该游戏不支持周报 → 友好提示并引导
  if (!isGameSupportedForFeature(game.id, 'report')) {
    const qrGames = getFeatureQuickReplyGames('report', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'report', game.name, 'record', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '战绩') return function() { return window.buildRecordResponse(game.name + '战绩'); };
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      if (key === game.name + '资讯') return function() { return window.buildNewsResponse(game.name + '资讯'); };
      return function() { return window.buildReportResponse(key); };
    });
    return { text: getUnsupportedGameTip('report', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 指定了具体游戏 → 生成该游戏的卡片
  const d = genReportData(range, game);

  // ── 王者荣耀 + 上周周报：使用专属周报卡片样式（设计稿第3张卡片） ──
  if (game.id === 'wzry' && range.tag === 'last_week') {
    const subtitleText = `王者${d.title}·${d.period}`;
    const summaryText = d.summary || '精湛操作，稳步上星';
    // 追问选项
    var qrItemsWzry = buildQR_L2_afterComplete('report', game.name, ['record', 'replay', 'partner']);
    var resolvedWzry = resolveQR(qrItemsWzry, function(key) {
      if (key === game.name + '战绩') return function() { return window.buildRecordResponse(game.name + '战绩'); };
      if (key === game.name + '复盘') return function() { return window.buildReplayResponse(game.name + '复盘'); };
      if (key === game.name + '找搭子') return function() { return window.buildPartnerResponse(game.name + '找搭子'); };
      return function() { return window.buildRecordResponse(key); };
    });
    return {
      text: `这是Q仔的${game.name} <strong>${d.title}</strong> 📅`
        + `<p class="mq-intro">💡 ${d.tip}</p>`,
      cardHtml: `
      <div class="result-card">
        <div class="result-card-header">${game.icon || '🎮'} ${game.name} · ${d.title} · ${d.period}</div>
        <div class="wzry-report-card">
          <div class="wzry-report-card__bg">
            <img class="wzry-report-card__bg-logo" src="my-tab-assets/card3-wangzhe-logo.svg" alt="">
            <div class="wzry-report-card__bg-cover-wrap">
              <img class="wzry-report-card__bg-cover" src="my-tab-assets/card3-report-cover.png" alt="">
            </div>
          </div>
          <img class="wzry-report-card__gradient-svg" src="my-tab-assets/card3-gradient-bw.svg" alt="">
          <div class="wzry-report-card__content">
            <div class="wzry-report-card__subtitle">
              <span class="wzry-report-card__subtitle-text">${subtitleText}</span>
            </div>
            <div class="wzry-report-card__main">
              <span class="wzry-report-card__title-text">${summaryText}</span>
              <div class="wzry-report-card__stats">
                <div class="wzry-report-card__stat-item"><span class="wzry-report-card__stat-label">对局场次</span><span class="wzry-report-card__stat-value">${d.matches}</span></div>
                <div class="wzry-report-card__stat-item"><span class="wzry-report-card__stat-label">平均胜率</span><span class="wzry-report-card__stat-value">${d.winRate}%</span></div>
              </div>
            </div>
            <div class="wzry-report-card__footer">
              <div class="wzry-report-card__detail-row">
                <div class="wzry-report-card__detail-left">
                  <span class="wzry-report-card__detail-text">周报日期：${d.period}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`,
      quickReplies: resolvedWzry.quickReplies,
      onQR: resolvedWzry.onQR,
      _displayMap: resolvedWzry.displayMap
    };
  }

  // ── 三列数据卡片（王者非上周 + 其他游戏） ──
  // 根据游戏定义三列数据（每款游戏展示不同维度）
  let col1, col2, col3;
  if (game.id === 'wzry') {
    // 王者荣耀（非上周周报）：总局数 | 胜率 | 上星数
    const starsVal = d.stars > 0 ? '+' + d.stars : '' + d.stars;
    col1 = { val: d.matches, label: '总局数', color: '' };
    col2 = { val: d.winRate + '%', label: '胜率', color: '' };
    col3 = { val: starsVal, label: '上星数', color: '' };
  } else if (game.id === 'hpjy') {
    // 和平精英：总局数 | 胜率 | 击杀数
    col1 = { val: d.matches, label: '总局数', color: '' };
    col2 = { val: d.winRate + '%', label: '胜率', color: '' };
    col3 = { val: d.kills, label: '击杀数', color: '' };
  } else if (game.id === 'sjz') {
    // 三角洲行动：总局数 | 撤离率 | 收货
    col1 = { val: d.matches, label: '总局数', color: '' };
    col2 = { val: d.extractRate + '%', label: '撤离率', color: '' };
    col3 = { val: d.loot, label: '收货', color: '' };
  } else {
    // 兜底：通用三列
    col1 = { val: d.matches, label: '总局数', color: '' };
    col2 = { val: (d.winRate || 0) + '%', label: '胜率', color: '' };
    col3 = { val: d.hours, label: '游戏时长', color: '' };
  }

  // 追问选项：战报完成后引导查看战绩、复盘、找搭子
  var qrItemsReport = buildQR_L2_afterComplete('report', game.name, ['record', 'replay', 'partner']);
  var resolvedReport = resolveQR(qrItemsReport, function(key) {
    if (key === game.name + '战绩') return function() { return window.buildRecordResponse(game.name + '战绩'); };
    if (key === game.name + '复盘') return function() { return window.buildReplayResponse(game.name + '复盘'); };
    if (key === game.name + '找搭子') return function() { return window.buildPartnerResponse(game.name + '找搭子'); };
    return function() { return window.buildRecordResponse(key); };
  });

  return {
    text: `这是Q仔的${game.name} <strong>${d.title}</strong> 📅`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">${game.icon || '🎮'} ${game.name} · ${d.title} · ${d.period}</div>
        <div class="report-card">
          <div class="report-row">
            <div class="report-item"><div class="report-val"${col1.color ? ' style="color:'+col1.color+'"' : ''}>${col1.val}</div><div class="report-label">${col1.label}</div></div>
            <div class="report-divider"></div>
            <div class="report-item"><div class="report-val"${col2.color ? ' style="color:'+col2.color+'"' : ''}>${col2.val}</div><div class="report-label">${col2.label}</div></div>
            <div class="report-divider"></div>
            <div class="report-item"><div class="report-val"${col3.color ? ' style="color:'+col3.color+'"' : ''}>${col3.val}</div><div class="report-label">${col3.label}</div></div>
          </div>
          <div style="background:#f5fff8;border:1px solid #d0f0d8;border-radius:9px;padding:10px;font-size:12px;color:#1a6a30;margin-top:10px">
            💡 ${d.tip}
          </div>
        </div>
      </div>`,
    quickReplies: resolvedReport.quickReplies,
    onQR: resolvedReport.onQR,
    _displayMap: resolvedReport.displayMap
  };
};

// ── 找搭子响应 ─────────────────────────────────────
window.buildPartnerResponse = function(text) {
  const HERO_DB = window.ENGINE_HERO_DB;
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  // 先尝试从英雄名反推游戏
  let game = detectGameWithContext(text);
  let hero = game ? detectHero(text, game) : null;

  // 未通过游戏关键词识别到游戏，尝试通过英雄名跨游戏识别
  if (!game && !hero) {
    const crossResult = detectHeroAcrossGames(text);
    if (crossResult) {
      game = crossResult.game;
      hero = crossResult.hero;
    }
  }

  // 🆕 本地匹配全部失败 → 检查 AI 异步识别的英雄结果
  if (!hero && window._lastAIHeroResult) {
    if (!game && window._lastAIHeroResult.game) {
      game = window._lastAIHeroResult.game;
    }
    hero = window._lastAIHeroResult.hero;
    console.log('[找搭子] AI兜底提供英雄:', hero.name, '游戏:', game?.name);
  }
  // 仍未识别到游戏 → 反问用户
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('partner');
    const qrItems = buildQR_L1_selectGame(qrGames, 'partner');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildPartnerResponse(key); };
    });
    return { text: '想找哪个游戏的搭子呢？🎮 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }
  // 该游戏不支持找搭子 → 友好提示并引导
  if (!isGameSupportedForFeature(game.id, 'partner')) {
    const qrGames = getFeatureQuickReplyGames('partner', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'partner', game.name, 'guide', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      return function() { return window.buildPartnerResponse(key); };
    });
    return { text: getUnsupportedGameTip('partner', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  if (!hero) hero = detectHero(text, game);
  // 🆕 detectHero 仍失败 → 再次检查 AI 兜底结果
  if (!hero && window._lastAIHeroResult && window._lastAIHeroResult.hero) {
    hero = window._lastAIHeroResult.hero;
  }

  // 位置关键词（从 data/mock/partner.js 加载）
  const roleKeywords = window.MOCK_ROLE_KEYWORDS || {};
  let detectedRole = null;
  if (!hero) {
    const lower = text.toLowerCase();
    for (const [role, kws] of Object.entries(roleKeywords)) {
      if (kws.some(kw => lower.includes(kw.toLowerCase()))) { detectedRole = role; break; }
    }
  }

  // 搭子数据库（从 data/mock/partner.js 加载）
  const partnerData = window.MOCK_PARTNER_DATA || {};

  const allPartners = partnerData[game.id] || partnerData.wzry || [];
  let partners, matchInfo;

  if (hero) {
    const heroMatched = allPartners.filter(p => p.heroes.includes(hero.name));
    const roleComplement = allPartners.filter(p => p.role !== hero.role && !heroMatched.includes(p));
    partners = [...heroMatched, ...roleComplement].slice(0, 4);
    if (partners.length === 0) partners = allPartners.slice(0, 3);
    matchInfo = `<strong>${game.name}</strong>擅长<strong>${hero.name}</strong>的搭子`;
  } else if (detectedRole) {
    partners = allPartners.filter(p => p.role === detectedRole || p.heroes.some(h => {
      const db = HERO_DB[game.id];
      const heroData = db?.find(d => d.name === h);
      return heroData && heroData.role === detectedRole;
    }));
    if (partners.length === 0) partners = allPartners.slice(0, 3);
    else partners = partners.slice(0, 4);
    matchInfo = `<strong>${game.name}</strong>${detectedRole}位的搭子`;
  } else {
    partners = allPartners.slice(0, 3);
    matchInfo = `<strong>${game.name}</strong>实力相当的搭子`;
  }

  const partnerCards = partners.map(p => {
    const heroHighlight = hero && p.heroes.includes(hero.name)
      ? ` · 擅长${hero.name}`
      : '';
    // 性别 SVG
    const genderSvg = p.gender === 'female'
      ? `<svg class="partner-rec-gender" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3.2" stroke="#FF4D7D" stroke-width="1.6"/><path d="M7 8.2V12.5M5 10.8H9" stroke="#FF4D7D" stroke-width="1.6" stroke-linecap="round"/></svg>`
      : `<svg class="partner-rec-gender" viewBox="0 0 14 14" fill="none"><circle cx="5.5" cy="8" r="3.2" stroke="#56B4FF" stroke-width="1.6"/><path d="M8 6L12 2M12 2H9M12 2V5" stroke="#56B4FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    // 匹配度 badge
    const matchBadge = p.match
      ? `<span class="partner-rec-match-badge">${p.match}匹配</span>`
      : '';
    // 标签
    const tagsHtml = (p.tags || []).map(t => {
      const isBlue = t.startsWith('✓');
      return `<span class="partner-rec-tag ${isBlue ? 'blue' : 'neutral'}">${t}</span>`;
    }).join('');
    // 推荐理由
    const reasonText = hero && p.heroes.includes(hero.name)
      ? `推荐理由：擅长${hero.name}${heroHighlight ? '，' : ''}${p.reason || ''}`
      : `推荐理由：${p.reason || p.role + '位实力强劲'}`;
    // 状态 + 胜率
    const subInfo = `${p.rank} · ${p.status || '在线'} · 胜率${p.winRate || '50%'}`;
    return `
          <div class="partner-rec-card">
            <div class="partner-rec-row">
              <div class="partner-rec-avatar-wrap" style="background:${p.avatarBg || 'linear-gradient(135deg, #FF80BF, #A78BFA, #60A5FA)'}">
                <div class="partner-rec-avatar-inner">${p.avatar}</div>
              </div>
              <div class="partner-rec-info">
                <div class="partner-rec-name-row">
                  <span class="partner-rec-name">${p.name}</span>
                  ${genderSvg}
                  ${matchBadge}
                </div>
                <span class="partner-rec-sub-info">${subInfo}</span>
              </div>
              <button class="partner-rec-action-btn" onclick="showToast('正在向 ${p.name} 发送开黑邀请...')">搭一搭</button>
            </div>
            <div class="partner-rec-tags">${tagsHtml}</div>
            <div class="partner-rec-reason">
              <span class="partner-rec-reason-text">${reasonText}</span>
            </div>
          </div>`;
  }).join('');

  return {
    text: `为Q仔匹配 ${matchInfo} ✨`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">🤝 为你匹配的搭子 · ${game.name}${hero ? ' · ' + hero.name : ''}</div>
        <div class="partner-list">
          ${partnerCards}
        </div>
      </div>`,
    ...(_buildAfterCompleteQR('partner', game.name, ['record', 'welfare', 'reminder'], game.id) || {}),
  };
};

// ── 资讯响应（支持联网搜索） ───────────────────────────────────────
// 同步版本：先返回 loading 占位，异步请求完成后替换内容
window.buildNewsResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = detectGameWithContext(text);

  // 未指定游戏 → 追问用户想看哪个游戏的资讯
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('news');
    const qrItems = buildQR_L1_selectGame(qrGames, 'news');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildNewsResponse(key); };
    });
    return { text: '想看哪个游戏的最新资讯呢？📰 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 该游戏不支持资讯 → 友好提示并引导（虚拟游戏在 isGameSupportedForFeature 中统一处理）
  if (!isGameSupportedForFeature(game.id, 'news')) {
    const qrGames = getFeatureQuickReplyGames('news', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'news', game.name, 'guide', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      return function() { return window.buildNewsResponse(key); };
    });
    return { text: getUnsupportedGameTip('news', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 生成唯一 ID，用于异步回填
  const cardId = 'news_live_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

  // 立即返回一个 loading 状态的卡片
  const loadingHtml = `
      <div class="result-card" id="${cardId}">
        <div class="news-search-status">
          <div class="search-loading-wrap">
            <div class="search-loading-spinner"></div>
            <div class="search-loading-text">
              <div class="search-loading-title">🔍 正在联网搜索</div>
              <div class="search-loading-desc">正在联网搜索 ${game.name} 最新资讯…</div>
            </div>
          </div>
        </div>
      </div>`;

  // 异步触发搜索，完成后替换卡片内容（立即触发，不再等 100ms）
  setTimeout(() => {
    _fetchAndFillNews(cardId, game, text);
  }, 10);

  return {
    text: `正在为你联网查找 <strong>${game.name}</strong> 最新资讯… 🌐`,
    cardHtml: loadingHtml,
    ...(_buildAfterCompleteQR('news', game.name, ['welfare', 'guide', 'skin'], game.id) || {}),
  };
};

// ── 异步获取并填充资讯（优先使用预搜索结果）──────────────────────────────
window._fetchAndFillNews = async function(cardId, game, userText) {
  const cardEl = document.getElementById(cardId);
  if (!cardEl) return;

  // 总超时保护：无论发生什么，最多 12 秒必须有结果（不能让 loading 永远转）
  const TOTAL_TIMEOUT = 12000;
  let settled = false;

  const fallbackTimer = setTimeout(() => {
    if (!settled) {
      settled = true;
      console.warn('[NewsSearch] 总超时(12s)，强制降级到本地数据');
      const el = document.getElementById(cardId);
      if (el) _fallbackToMockNews(el, game);
      window.scrollChat && window.scrollChat();
    }
  }, TOTAL_TIMEOUT);

  try {
    // 优先使用预搜索结果（在 DeepSeek 意图识别期间已经开始搜索）
    let results;
    const preSearch = window.getPreSearchResult ? window.getPreSearchResult(game, userText) : null;
    if (preSearch) {
      console.log('[NewsSearch] 使用预搜索结果');
      results = await preSearch;
    } else {
      // 没有预搜索结果，正常搜索
      results = await window.searchGameNews(game.id, userText);
    }

    if (settled) return; // 已被超时处理，不再操作
    settled = true;
    clearTimeout(fallbackTimer);

    const formatted = window.formatSearchResults(results, game.name);

    if (formatted && formatted.length > 0) {
      // 搜索成功 → 渲染真实资讯
      cardEl.innerHTML = `
        <div class="news-live-header">
          <span class="news-live-badge">🌐 实时</span>
          <span class="news-live-title">${game.name} · 最新资讯</span>
        </div>
        <div class="news-list">
          ${formatted.map(n => `
          <div class="news-item news-item-live" onclick="${n.url ? `window.open('${n.url.replace(/'/g, "\\'")}','_blank')` : `showToast('正在打开: ${n.fullTitle.replace(/'/g, "\\'")}')`}">
            <div class="news-img">${n.icon}</div>
            <div class="news-info">
              <div class="news-title">${n.title}</div>
              ${n.abstract ? `<div class="news-abstract">${n.abstract.slice(0, 60)}${n.abstract.length > 60 ? '…' : ''}</div>` : ''}
              <div class="news-meta">${n.meta}</div>
            </div>
          </div>`).join('')}
        </div>
        <div class="news-live-footer">
          <span>数据来源：联网搜索 · ${new Date().toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'})}</span>
        </div>`;

      // 更新上方的文字
      const parentContent = cardEl.closest('.ai-reply-card');
      if (parentContent) {
        const textEl = parentContent.querySelector('.ai-reply-desc');
        if (textEl) {
          // 🆕 如果 AI 已启用，调用 DeepSeek 对资讯内容进行流式总结
          if (window.DEEPSEEK_CONFIG.enabled() && window.streamAISummary) {
            textEl.innerHTML = `<span class="ai-stream-text">正在为你总结资讯要点…</span><span class="ai-stream-cursor">|</span>`;
            textEl.classList.add('ai-streaming');
            window.streamAISummary(formatted, game.name, 'news', textEl).then(ok => {
              if (!ok) {
                textEl.innerHTML = `为你找到 <strong>${game.name}</strong> 的 <strong>${formatted.length} 条最新资讯</strong> 🌐`;
              }
              window.scrollChat && window.scrollChat();
            });
          } else {
            textEl.innerHTML = `为你找到 <strong>${game.name}</strong> 的 <strong>${formatted.length} 条最新资讯</strong> 🌐`;
          }
        }
      }
    } else {
      // 搜索无结果 → 降级到本地 mock 数据
      _fallbackToMockNews(cardEl, game);
    }
  } catch (e) {
    if (settled) return;
    settled = true;
    clearTimeout(fallbackTimer);
    console.warn('[NewsSearch] 搜索异常，降级到本地数据:', e.message);
    _fallbackToMockNews(cardEl, game);
  }

  // 滚动到底部
  window.scrollChat && window.scrollChat();
};

// ── 降级到本地 mock 数据 ──────────────────────────────
window._fallbackToMockNews = function(cardEl, game) {
  const newsData = window.MOCK_NEWS_DATA || {};
  const items = newsData[game.id];

  // 虚拟游戏或找不到 mock 数据 → 显示搜索失败提示（不回退到王者荣耀）
  if (!items) {
    cardEl.innerHTML = `
      <div class="news-live-header">
        <span class="news-live-badge">📰 资讯</span>
        <span class="news-live-title">${game.name} · 近期资讯</span>
      </div>
      <div class="news-list">
        <div class="news-item" style="justify-content:center;padding:20px 0">
          <div class="news-info" style="text-align:center">
            <div class="news-title" style="font-size:13px;color:#999">暂未搜索到 ${game.name} 的相关资讯</div>
            <div class="news-meta">请稍后重试或换个关键词</div>
          </div>
        </div>
      </div>
      <div class="news-live-footer" style="display:flex;justify-content:space-between;align-items:center">
        <span>数据截至 2026年3月</span>
        <span class="news-retry-btn" onclick="_retryNewsSearch(this,'${game.id}','${game.name}')" style="color:#1a6bff;cursor:pointer;font-weight:600;font-size:11px">🔄 搜索最新</span>
      </div>`;
  } else {
    cardEl.innerHTML = `
      <div class="news-live-header">
        <span class="news-live-badge">📰 资讯</span>
        <span class="news-live-title">${game.name} · 近期资讯</span>
      </div>
      <div class="news-list">
        ${items.map(n => `
        <div class="news-item" onclick="showToast('正在打开: ${n.title.replace(/'/g, "\\'")}')">
          <div class="news-img">${n.icon}</div>
          <div class="news-info"><div class="news-title">${n.title}</div><div class="news-meta">${n.meta}</div></div>
        </div>`).join('')}
      </div>
      <div class="news-live-footer" style="display:flex;justify-content:space-between;align-items:center">
        <span>数据截至 2026年3月</span>
        <span class="news-retry-btn" onclick="_retryNewsSearch(this,'${game.id}','${game.name}')" style="color:#1a6bff;cursor:pointer;font-weight:600;font-size:11px">🔄 搜索最新</span>
      </div>`;
  }

  // 更新上方的文字
  const parentContent = cardEl.closest('.ai-reply-card');
  if (parentContent) {
    const textEl = parentContent.querySelector('.ai-reply-desc');
    if (textEl) {
      textEl.innerHTML = `为你找到 <strong>${game.name}</strong> 的 <strong>近期资讯</strong> 📰`;
    }
  }
};

// ── 重试联网搜索 ──────────────────────────────────
window._retryNewsSearch = async function(btnEl, gameId, gameName) {
  const cardEl = btnEl.closest('.result-card');
  if (!cardEl) return;
  btnEl.textContent = '⏳ 搜索中…';
  btnEl.style.pointerEvents = 'none';
  try {
    const results = await window.searchGameNews(gameId, gameName + '资讯', gameName);
    const formatted = window.formatSearchResults(results, gameName);
    if (formatted && formatted.length > 0) {
      cardEl.innerHTML = `
        <div class="news-live-header">
          <span class="news-live-badge">🌐 实时</span>
          <span class="news-live-title">${gameName} · 最新资讯</span>
        </div>
        <div class="news-list">
          ${formatted.map(n => `
          <div class="news-item news-item-live" onclick="${n.url ? `window.open('${n.url.replace(/'/g, "\\'")}','_blank')` : `showToast('正在打开: ${n.fullTitle.replace(/'/g, "\\'")}')`}">
            <div class="news-img">${n.icon}</div>
            <div class="news-info">
              <div class="news-title">${n.title}</div>
              ${n.abstract ? `<div class="news-abstract">${n.abstract.slice(0, 60)}${n.abstract.length > 60 ? '…' : ''}</div>` : ''}
              <div class="news-meta">${n.meta}</div>
            </div>
          </div>`).join('')}
        </div>
        <div class="news-live-footer">
          <span>数据来源：联网搜索 · ${new Date().toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'})}</span>
        </div>`;
    } else {
      btnEl.textContent = '❌ 搜索无结果';
      setTimeout(() => { btnEl.textContent = '🔄 重新搜索'; btnEl.style.pointerEvents = 'auto'; }, 2000);
    }
  } catch (e) {
    btnEl.textContent = '❌ 搜索失败';
    setTimeout(() => { btnEl.textContent = '🔄 重新搜索'; btnEl.style.pointerEvents = 'auto'; }, 2000);
  }
};

// ── 从文本中提取潜在的角色名（去除意图词后的剩余文本）───────────────────
window._extractPotentialHeroName = function(text) {
  const intentWords = ['怎么玩','怎么出装','出装','铭文','打法','攻略','技巧','教学',
    '怎么打','怎么用','天赋','符文','连招','玩法','怎么样','厉害吗','强吗','好用吗'];
  let heroText = text.trim();
  for (const iw of intentWords) {
    heroText = heroText.replace(iw, '');
  }
  heroText = heroText.trim();
  // 2-10 字，不包含标点和常见无意义词
  if (heroText.length >= 2 && heroText.length <= 10 && !/[？?！!。，,、\s]/.test(heroText)) {
    return heroText;
  }
  return null;
};

// 🆕 pending query 全局存储（当 buildGuideResponse 反问"选游戏"时保存，供后续回溯）
window._pendingGuideQuery = null;

// ── 攻略响应（支持联网搜索角色攻略） ───────────────────────────────────────
window.buildGuideResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const GAMES = window.ENGINE_GAMES;
  // 攻略是独立查询意图，优先从当前文本识别游戏，不盲目沿用上下文
  let game = window.detectGame(text);
  let hero = null;

  // 🆕 检查 pending query：如果上一轮反问了"选游戏"，且本次识别到了游戏，自动关联上一轮的英雄名
  if (game && window._pendingGuideQuery && (Date.now() - window._pendingGuideQuery.timestamp < 120000)) {
    const pendingHero = window._pendingGuideQuery.heroText;
    if (pendingHero) {
      hero = { name: pendingHero, aliases: [pendingHero], role: '未知', icon: '🔍', _fromPending: true };
      console.log('[攻略] 回溯 pending query 英雄名:', pendingHero, '+ 游戏:', game.name);
    }
    window._pendingGuideQuery = null; // 消费后清空
  }
  // 如果是虚拟游戏（从上下文回溯时），也检查 pending query
  if (!game && !hero && window._pendingGuideQuery && (Date.now() - window._pendingGuideQuery.timestamp < 120000)) {
    // 先不消费，让后面的上下文回溯逻辑处理游戏识别
  }

  // ── 未从当前文本识别到游戏 → 先尝试通过英雄名跨游戏识别 ──
  if (!game) {
    const crossResult = detectHeroAcrossGames(text);
    if (crossResult) {
      game = crossResult.game;
      hero = crossResult.hero;
    }
  }

  // 🆕 本地匹配全部失败 → 检查 AI 异步识别的英雄结果
  if (!hero && window._lastAIHeroResult) {
    if (!game && window._lastAIHeroResult.game) {
      game = window._lastAIHeroResult.game;
    }
    if (!hero) {
      hero = window._lastAIHeroResult.hero;
    }
    console.log('[攻略] AI兜底提供英雄:', hero?.name, '游戏:', game?.name);
  }

  // ── 仍然未识别到 → 尝试提取游戏名创建虚拟游戏对象（通用兜底）──
  if (!game) {
    const extractedGameName = window.extractGameNameFromText ? window.extractGameNameFromText(text) : null;
    if (extractedGameName) {
      console.log('[通用攻略识别] 检测到未录入游戏:', extractedGameName);
      game = window.createVirtualGame(extractedGameName);
    }
  }

  // 🆕 仍然未识别到 → 从对话上下文中回溯（可能用户之前说了游戏名）
  if (!game) {
    const ctxGame = window.getLastMentionedGame ? window.getLastMentionedGame() : null;
    if (ctxGame) {
      console.log('[攻略] 从对话上下文回溯到游戏:', ctxGame.name, ctxGame.isVirtual ? '(虚拟)' : '');
      game = ctxGame;
      // 🆕 有上下文游戏 + 先检查 pending query 中的英雄名
      if (!hero && window._pendingGuideQuery && (Date.now() - window._pendingGuideQuery.timestamp < 120000)) {
        const pendingHero = window._pendingGuideQuery.heroText;
        if (pendingHero) {
          hero = { name: pendingHero, aliases: [pendingHero], role: '未知', icon: '🔍', _fromPending: true };
          console.log('[攻略] 从 pending query 回溯英雄名:', pendingHero);
        }
        window._pendingGuideQuery = null;
      }
      // 有上下文游戏 + 用户文本中可能有英雄名 → 尝试从文本中提取角色名
      // 例如"卡牌大师怎么玩" → 去掉意图词后得到"卡牌大师"
      if (!hero) {
        const intentWords = ['怎么玩','怎么出装','出装','铭文','打法','攻略','技巧','教学','怎么打','怎么用','天赋','符文','连招','玩法'];
        let heroText = text.trim();
        for (const iw of intentWords) {
          heroText = heroText.replace(iw, '');
        }
        heroText = heroText.trim();
        if (heroText.length >= 2 && heroText.length <= 10) {
          // 构造一个临时的英雄对象用于搜索
          hero = { name: heroText, aliases: [heroText], role: '未知', icon: '🔍', _fromText: true };
          console.log('[攻略] 从用户文本中提取角色名:', heroText);
        }
      }
    }
  }

  // 仍未识别到且用户只说了"攻略"没有游戏名 → 反问
  if (!game) {
    // 🆕 保存 pending query：用户可能在说某个角色的攻略但没指定游戏
    // 当用户后续回答游戏名时，可以回溯这个 pending query 自动关联
    const _pendingHeroText = _extractPotentialHeroName(text);
    if (_pendingHeroText) {
      window._pendingGuideQuery = { heroText: _pendingHeroText, originalText: text, timestamp: Date.now() };
      console.log('[攻略] 保存 pending query:', _pendingHeroText);
    }
    const qrGames = getFeatureQuickReplyGames('guide');
    const qrItems = buildQR_L1_selectGame(qrGames, 'guide');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildGuideResponse(key); };
    });
    return { text: '想查哪个游戏的攻略呢？📖 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 该游戏不支持攻略 → 友好提示并引导（虚拟游戏在 isGameSupportedForFeature 中统一处理）
  if (!isGameSupportedForFeature(game.id, 'guide')) {
    const qrGames = getFeatureQuickReplyGames('guide', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'guide', game.name, 'news', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '资讯') return function() { return window.buildNewsResponse(game.name + '资讯'); };
      return function() { return window.buildGuideResponse(key); };
    });
    return { text: getUnsupportedGameTip('guide', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 已确定游戏，尝试识别英雄
  if (!hero) hero = detectHero(text, game);
  // 🆕 detectHero 仍失败 → 再次检查 AI 兜底结果
  if (!hero && window._lastAIHeroResult && window._lastAIHeroResult.hero) {
    hero = window._lastAIHeroResult.hero;
  }

  // ── 有英雄 → 直接给英雄攻略（联网搜索或本地） ──
  if (hero) return _buildGuideCard(game, hero, text);

  // ── 无英雄 → 尝试识别攻略子类型 ──
  const guideType = _detectGuideType(text, game);

  // 识别到子类型 → 直接展示该类型攻略
  if (guideType) return _buildTypedGuideCard(game, guideType, text);

  // 未识别到子类型 → 反问用户想看哪种攻略
  return _buildGuideTypeAsk(game);
};

// ── 攻略卡片构建（支持联网搜索）───────────────────────────
window._buildGuideCard = function(game, hero, text) {
  const heroName = hero ? hero.name : _getGuideSubject(game, text);

  // 如果识别到了具体英雄，启用联网搜索模式
  if (hero && window.searchGuide) {
    const cardId = 'guide_live_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

    const loadingHtml = `
      <div class="result-card" id="${cardId}">
        <div class="result-card-header">📖 ${heroName} · ${game.name}攻略</div>
        <div class="news-search-status">
          <div class="search-loading-wrap">
            <div class="search-loading-spinner"></div>
            <div class="search-loading-text">
              <div class="search-loading-title">🔍 正在搜索最新攻略</div>
              <div class="search-loading-desc">正在搜索 ${heroName} 最新出装和打法…</div>
            </div>
          </div>
        </div>
      </div>`;

    // 异步搜索攻略 — 轮询等待 DOM 元素出现后再执行
    // ⚠️ 不能用固定 setTimeout(10ms)，因为 showTyping 延迟 350~500ms 才会将卡片插入 DOM
    //    如果 DOM 元素不存在就执行 _fetchAndFillGuide，它会直接 return，搜索永远不会完成
    (function _waitAndFetch(attempts) {
      const el = document.getElementById(cardId);
      if (el) {
        _fetchAndFillGuide(cardId, game, hero, heroName);
      } else if (attempts < 30) {
        // 每 50ms 检查一次，最多等 1.5s（30 * 50ms）
        setTimeout(() => _waitAndFetch(attempts + 1), 50);
      } else {
        console.warn('[GuideSearch] DOM 元素超时未出现，放弃搜索:', cardId);
      }
    })(0);

    return {
      text: `正在为你联网搜索 <strong>${heroName}</strong> 的${game.name}最新攻略… 🔍`,
      cardHtml: loadingHtml,
      ...(_buildAfterCompleteQR('guide', game.name, ['record', 'partner', 'replay'], game.id) || {}),
    };
  }

  // 没有具体英雄 → 直接用本地 mock 数据
  return _buildLocalGuideCard(game, heroName);
};

// ── 本地攻略卡片（无联网搜索）───────────────────────────
window._buildLocalGuideCard = function(game, heroName) {
  const guideData = window.MOCK_GUIDE_DATA || {};
  const gd = guideData[game.id]; // 不再回退到 wzry

  // 🆕 虚拟游戏或没有 mock 数据 → 提供搜索引导
  if (!gd || (game.isVirtual || (typeof game.id === 'string' && game.id.startsWith('virtual_')))) {
    const searchQuery = encodeURIComponent(`${game.name} ${heroName} 攻略 出装 打法`);
    const baiduUrl = `https://www.baidu.com/s?wd=${searchQuery}`;
    return {
      text: `暂无 <strong>${heroName}</strong> 的本地攻略数据，你可以直接搜索查看 🔍`,
      cardHtml: `
        <div class="result-card">
          <div class="result-card-header">📖 ${heroName} · ${game.name}攻略</div>
          <div style="padding:16px 14px;text-align:center">
            <div style="font-size:28px;margin-bottom:8px">🔍</div>
            <div style="font-size:13px;color:#555;margin-bottom:12px">暂无本地攻略数据</div>
            <a href="${baiduUrl}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;background:#1a6bff;color:#fff;border:none;border-radius:20px;padding:8px 16px;font-size:12px;font-weight:600;text-decoration:none;cursor:pointer">
              🌐 搜索 ${heroName} 攻略
            </a>
          </div>
        </div>`,
      ...(_buildAfterCompleteQR('guide', game.name, ['news'], game.id) || {}),
    };
  }

  // 库内游戏 + 有 mock 数据 → 正常显示
  return {
    text: `这是 <strong>${heroName}</strong> 的${game.name}推荐配置和核心玩法 📖`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">📖 ${heroName} · ${game.name}攻略</div>
        <div style="padding:12px">
          <div style="font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:8px">${gd.equipLabel}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
            ${gd.equips.map((i,idx)=>`<div style="background:#eef3ff;border:1px solid rgba(26,107,255,.2);border-radius:8px;padding:5px 10px;font-size:11px;color:#1a6bff;font-weight:600">${idx+1}. ${i}</div>`).join('')}
          </div>
          <div style="font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:6px">⚡ 核心技巧</div>
          <div style="font-size:12px;color:#555;line-height:1.7">
            ${gd.tips.map(t=>`• ${t}`).join('<br>')}
          </div>
        </div>
      </div>`,
    ...(_buildAfterCompleteQR('guide', game.name, ['record', 'partner', 'replay'], game.id) || {}),
  };
};

// ── 异步获取并填充攻略 ──────────────────────────────
window._fetchAndFillGuide = async function(cardId, game, hero, heroName) {
  const cardEl = document.getElementById(cardId);
  if (!cardEl) return;

  // 总超时保护
  const TOTAL_TIMEOUT = 12000;
  let settled = false;

  const fallbackTimer = setTimeout(() => {
    if (!settled) {
      settled = true;
      console.warn('[GuideSearch] 总超时(12s)，降级到本地攻略');
      const el = document.getElementById(cardId);
      if (el) _fallbackToMockGuide(el, game, heroName);
      window.scrollChat && window.scrollChat();
    }
  }, TOTAL_TIMEOUT);

  try {
    const results = await window.searchGuide(game.name, heroName, game.id);

    if (settled) return;
    settled = true;
    clearTimeout(fallbackTimer);

    const formatted = window.formatGuideResults(results, heroName);

    if (formatted && formatted.length > 0) {
      // 搜索成功 → 渲染联网攻略
      cardEl.innerHTML = `
        <div class="result-card-header">📖 ${heroName} · ${game.name}攻略</div>
        <div class="news-live-header" style="padding:0 14px">
          <span class="news-live-badge">🌐 实时</span>
          <span class="news-live-title">为你找到 ${formatted.length} 条${heroName}攻略</span>
        </div>
        <div class="news-list" style="padding:0 10px 4px">
          ${formatted.map(n => `
          <div class="news-item news-item-live" onclick="${n.url ? `window.open('${n.url.replace(/'/g, "\\'")}','_blank')` : `showToast('${n.fullTitle.replace(/'/g, "\\'")}')`}" style="cursor:pointer">
            <div class="news-img">📖</div>
            <div class="news-info">
              <div class="news-title">${n.title}</div>
              ${n.abstract ? `<div class="news-abstract" style="font-size:11px;color:#888;margin-top:2px">${n.abstract.slice(0, 80)}${n.abstract.length > 80 ? '…' : ''}</div>` : ''}
              <div class="news-meta" style="font-size:10px;color:#aaa;margin-top:2px">${n.source}</div>
            </div>
          </div>`).join('')}
        </div>
        <div style="padding:0 14px 10px">
          <div style="font-size:11px;color:#888;padding:6px 0;border-top:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center">
            <span>数据来源：联网搜索 · ${new Date().toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'})}</span>
            <span>点击可查看详情</span>
          </div>
        </div>`;

      // 更新上方的文字（卡片内已有"为你找到 N 条攻略"，气泡文字用不同措辞避免重复）
      const parentContent = cardEl.closest('.ai-reply-card');
      if (parentContent) {
        const textEl = parentContent.querySelector('.ai-reply-desc');
        if (textEl) {
          // 🆕 如果 AI 已启用，调用 DeepSeek 对搜索结果进行流式总结
          if (window.DEEPSEEK_CONFIG.enabled() && window.streamAISummary) {
            textEl.innerHTML = `<span class="ai-stream-text">正在为你总结攻略要点…</span><span class="ai-stream-cursor">|</span>`;
            textEl.classList.add('ai-streaming');
            // 异步调用，不阻塞卡片渲染
            window.streamAISummary(formatted, heroName, 'guide', textEl).then(ok => {
              if (!ok) {
                // AI 总结失败，降级为固定文案
                textEl.innerHTML = `已为你搜索到 <strong>${heroName}</strong> 的最新攻略，点击查看详情 📖`;
              }
              window.scrollChat && window.scrollChat();
            });
          } else {
            textEl.innerHTML = `已为你搜索到 <strong>${heroName}</strong> 的最新攻略，点击查看详情 📖`;
          }
        }
      }
    } else {
      _fallbackToMockGuide(cardEl, game, heroName);
    }
  } catch (e) {
    if (settled) return;
    settled = true;
    clearTimeout(fallbackTimer);
    console.warn('[GuideSearch] 搜索异常，降级到本地攻略:', e.message);
    _fallbackToMockGuide(cardEl, game, heroName);
  }

  window.scrollChat && window.scrollChat();
};

// ── 攻略降级到本地 mock 数据 ──────────────────────────────
window._fallbackToMockGuide = function(cardEl, game, heroName) {
  const guideData = window.MOCK_GUIDE_DATA || {};
  const gd = guideData[game.id]; // 注意：不再回退到 wzry，只使用该游戏自己的 mock 数据

  // 🆕 如果是虚拟游戏或该游戏没有本地 mock 数据 → 显示搜索引导而非假数据
  if (!gd || (game.isVirtual || (typeof game.id === 'string' && game.id.startsWith('virtual_')))) {
    const searchQuery = encodeURIComponent(`${game.name} ${heroName} 攻略 出装 打法`);
    const baiduUrl = `https://www.baidu.com/s?wd=${searchQuery}`;
    cardEl.innerHTML = `
      <div class="result-card-header">📖 ${heroName} · ${game.name}攻略</div>
      <div style="padding:16px 14px">
        <div style="text-align:center;padding:12px 0 16px">
          <div style="font-size:28px;margin-bottom:8px">🔍</div>
          <div style="font-size:13px;color:#555;line-height:1.6">
            暂时没有搜索到 <strong>${heroName}</strong> 的在线攻略<br>
            <span style="font-size:12px;color:#888">网络搜索可能暂时不可用</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <a href="${baiduUrl}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;background:#1a6bff;color:#fff;border:none;border-radius:20px;padding:8px 16px;font-size:12px;font-weight:600;text-decoration:none;cursor:pointer">
            🌐 搜索攻略
          </a>
          <span class="news-retry-btn" onclick="_retryGuideSearch(this,'${game.id.replace(/'/g, "\\'")}','${game.name.replace(/'/g, "\\'")}','${heroName.replace(/'/g, "\\'")}')" style="display:inline-flex;align-items:center;gap:4px;background:#eef3ff;color:#1a6bff;border:1px solid rgba(26,107,255,.2);border-radius:20px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer">
            🔄 重新搜索
          </span>
        </div>
      </div>`;

    // 更新上方的文字
    const parentContent = cardEl.closest('.ai-reply-card');
    if (parentContent) {
      const textEl = parentContent.querySelector('.ai-reply-desc');
      if (textEl) {
        textEl.innerHTML = `正在尝试获取 <strong>${heroName}</strong> 的${game.name}攻略，你也可以直接搜索查看 🔍`;
      }
    }
    return;
  }

  // 库内游戏 + 有本地 mock 数据 → 正常显示
  cardEl.innerHTML = `
    <div class="result-card-header">📖 ${heroName} · ${game.name}攻略</div>
    <div style="padding:12px">
      <div style="font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:8px">${gd.equipLabel}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
        ${gd.equips.map((i,idx)=>`<div style="background:#eef3ff;border:1px solid rgba(26,107,255,.2);border-radius:8px;padding:5px 10px;font-size:11px;color:#1a6bff;font-weight:600">${idx+1}. ${i}</div>`).join('')}
      </div>
      <div style="font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:6px">⚡ 核心技巧</div>
      <div style="font-size:12px;color:#555;line-height:1.7">
        ${gd.tips.map(t=>`• ${t}`).join('<br>')}
      </div>
    </div>
    <div style="padding:0 14px 10px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#888;border-top:1px solid #f0f0f0;margin:0 12px;padding-top:8px">
      <span>通用攻略 · 数据截至 2026年3月</span>
      <span class="news-retry-btn" onclick="_retryGuideSearch(this,'${game.id}','${game.name}','${heroName}')" style="color:#1a6bff;cursor:pointer;font-weight:600">🔄 搜索最新</span>
    </div>`;

  // 更新上方的文字
  const parentContent = cardEl.closest('.ai-reply-card');
  if (parentContent) {
    const textEl = parentContent.querySelector('.ai-reply-desc');
    if (textEl) {
      textEl.innerHTML = `这是 <strong>${heroName}</strong> 的${game.name}推荐配置和核心玩法 📖`;
    }
  }
};

// ── 重试攻略搜索 ──────────────────────────────────
window._retryGuideSearch = async function(btnEl, gameId, gameName, heroName) {
  const cardEl = btnEl.closest('.result-card');
  if (!cardEl) return;
  btnEl.textContent = '⏳ 搜索中…';
  btnEl.style.pointerEvents = 'none';
  try {
    const results = await window.searchGuide(gameName, heroName, gameId);
    const formatted = window.formatGuideResults(results, heroName);
    if (formatted && formatted.length > 0) {
      cardEl.innerHTML = `
        <div class="result-card-header">📖 ${heroName} · ${gameName}攻略</div>
        <div class="news-live-header" style="padding:0 14px">
          <span class="news-live-badge">🌐 实时</span>
          <span class="news-live-title">为你找到 ${formatted.length} 条${heroName}攻略</span>
        </div>
        <div class="news-list" style="padding:0 10px 4px">
          ${formatted.map(n => `
          <div class="news-item news-item-live" onclick="${n.url ? `window.open('${n.url.replace(/'/g, "\\'")}','_blank')` : `showToast('${n.fullTitle.replace(/'/g, "\\'")}')`}" style="cursor:pointer">
            <div class="news-img">📖</div>
            <div class="news-info">
              <div class="news-title">${n.title}</div>
              ${n.abstract ? `<div class="news-abstract" style="font-size:11px;color:#888;margin-top:2px">${n.abstract.slice(0, 80)}${n.abstract.length > 80 ? '…' : ''}</div>` : ''}
              <div class="news-meta" style="font-size:10px;color:#aaa;margin-top:2px">${n.source}</div>
            </div>
          </div>`).join('')}
        </div>
        <div style="padding:0 14px 10px">
          <div style="font-size:11px;color:#888;padding:6px 0;border-top:1px solid #f0f0f0;display:flex;justify-content:space-between">
            <span>数据来源：联网搜索 · ${new Date().toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'})}</span>
            <span>点击可查看详情</span>
          </div>
        </div>`;
    } else {
      btnEl.textContent = '❌ 搜索无结果';
      setTimeout(() => { btnEl.textContent = '🔄 搜索最新'; btnEl.style.pointerEvents = 'auto'; }, 2000);
    }
  } catch (e) {
    btnEl.textContent = '❌ 搜索失败';
    setTimeout(() => { btnEl.textContent = '🔄 搜索最新'; btnEl.style.pointerEvents = 'auto'; }, 2000);
  }
};

// 获取攻略主题名称（已确定游戏但未确定英雄时的 fallback）
function _getGuideSubject(game, text) {
  const subjectMap = {
    wzry: '综合攻略',
    hpjy: text.includes('冲锋') ? '冲锋打法' : '生存技巧',
    sjz:  text.includes('突击') ? '突击兵' : text.includes('狙击') ? '狙击手' : '战术指南',
    cfm:  '综合攻略',
    ys:   '角色培养',
  };
  return subjectMap[game.id] || '综合攻略';
}

// ── 攻略子类型定义（按游戏区分） ─────────────────────────────
// 每个游戏可配置不同的攻略分类，id 用于内部识别，label/icon 用于展示
const GUIDE_TYPE_CONFIG = {
  wzry: [
    { id: 'hero',     label: '英雄攻略',   icon: '⚔️', keywords: ['英雄','角色','出装','铭文','连招','技能','打法'] },
    { id: 'lane',     label: '分路攻略',   icon: '🗺️', keywords: ['分路','上路','中路','下路','打野','辅助','对抗路','发育路','游走','中单'] },
    { id: 'meta',     label: '版本攻略',   icon: '📊', keywords: ['版本','机制','改动','调整','加强','削弱','平衡','赛季','强势','环境','t0','t1','tier','梯队','节奏'] },
    { id: 'team',     label: '阵容搭配',   icon: '👥', keywords: ['阵容','搭配','体系','组合','双排','五排','ban','选','bp'] },
    { id: 'rank',     label: '上分技巧',   icon: '🏆', keywords: ['上分','段位','排位','星耀','王者','冲分','连胜','意识','大局观'] },
  ],
  hpjy: [
    { id: 'weapon',   label: '枪械攻略',   icon: '🔫', keywords: ['枪','武器','配件','压枪','后坐力','伤害','射速'] },
    { id: 'map',      label: '地图打法',   icon: '🗺️', keywords: ['地图','跑圈','航线','资源点','落点','城区','野区','决赛圈'] },
    { id: 'mode',     label: '模式攻略',   icon: '🎮', keywords: ['模式','经典','团队','地铁','逃生','海岛','沙漠'] },
    { id: 'meta',     label: '版本攻略',   icon: '📊', keywords: ['版本','赛季','更新','改动','调整','平衡','新枪'] },
    { id: 'survival', label: '生存技巧',   icon: '🏆', keywords: ['上分','吃鸡','技巧','身法','卡点','掩体','对枪','拉枪'] },
  ],
  sjz: [
    { id: 'operator', label: '干员攻略',   icon: '🎖️', keywords: ['干员','角色','技能','特长','配装'] },
    { id: 'weapon',   label: '武器攻略',   icon: '🔫', keywords: ['枪','武器','配件','改装','后坐力'] },
    { id: 'map',      label: '地图攻略',   icon: '🗺️', keywords: ['地图','据点','路线','战术','攻楼','点位'] },
    { id: 'meta',     label: '版本攻略',   icon: '📊', keywords: ['版本','赛季','更新','改动','调整','平衡'] },
    { id: 'mode',     label: '模式攻略',   icon: '🎮', keywords: ['全面战场','据点','护送','爆破','撤离'] },
  ],
  cfm: [
    { id: 'weapon',   label: '武器攻略',   icon: '🔫', keywords: ['枪','武器','弹道','后坐力','爆头'] },
    { id: 'map',      label: '地图攻略',   icon: '🗺️', keywords: ['地图','点位','卡点','身法','烟雾'] },
    { id: 'mode',     label: '模式攻略',   icon: '🎮', keywords: ['爆破','团队','生化','挑战','排位'] },
    { id: 'meta',     label: '版本攻略',   icon: '📊', keywords: ['版本','更新','改动','调整','新武器','平衡'] },
  ],
  ys: [
    { id: 'char',     label: '角色攻略',   icon: '⚔️', keywords: ['角色','出装','圣遗物','武器','天赋','命座','培养'] },
    { id: 'team',     label: '队伍搭配',   icon: '👥', keywords: ['阵容','队伍','搭配','国家队','雷神','万达','永冻'] },
    { id: 'abyss',    label: '深渊攻略',   icon: '🏆', keywords: ['深渊','螺旋','满星','12层','速通'] },
    { id: 'meta',     label: '版本攻略',   icon: '📊', keywords: ['版本','更新','新角色','卡池','抽卡','up','复刻'] },
    { id: 'explore',  label: '探索攻略',   icon: '🗺️', keywords: ['探索','宝箱','神瞳','任务','隐藏','成就','收集'] },
  ],
};

// 通用 fallback 配置（未在上方列出的游戏使用）
const GUIDE_TYPE_DEFAULT = [
  { id: 'hero',   label: '角色攻略', icon: '⚔️', keywords: ['角色','英雄','出装','技能','打法'] },
  { id: 'meta',   label: '版本攻略', icon: '📊', keywords: ['版本','更新','改动','调整','赛季'] },
  { id: 'map',    label: '地图/模式', icon: '🗺️', keywords: ['地图','模式','玩法','关卡'] },
  { id: 'rank',   label: '上分技巧', icon: '🏆', keywords: ['上分','技巧','段位','排位'] },
];

// ── 识别攻略子类型 ──────────────────────────────────────
function _detectGuideType(text, game) {
  const types = GUIDE_TYPE_CONFIG[game.id] || GUIDE_TYPE_DEFAULT;
  // 🆕 从文本中去掉游戏名，避免游戏名中的关键词误匹配
  // 例如"英雄联盟"包含"英雄"，会误匹配到 hero 类型的 keywords
  let cleanText = text.toLowerCase();
  if (game.name) {
    cleanText = cleanText.replace(new RegExp(game.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
  }
  // 同样去掉已知的游戏别名
  if (game.keywords) {
    game.keywords.forEach(kw => {
      cleanText = cleanText.replace(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
    });
  }
  cleanText = cleanText.trim();

  // 遍历每个类型的关键词，找到第一个匹配的
  for (const t of types) {
    for (const kw of t.keywords) {
      if (cleanText.includes(kw)) return t;
    }
  }
  return null; // 没有匹配到任何子类型
}

// ── 反问攻略类型（已确定游戏但未确定类型和英雄） ──────────────
function _buildGuideTypeAsk(game) {
  const types = GUIDE_TYPE_CONFIG[game.id] || GUIDE_TYPE_DEFAULT;
  const qrTexts = types.map(t => t.icon + ' ' + t.label);
  const onQR = {};
  types.forEach(t => {
    const label = t.icon + ' ' + t.label;
    onQR[label] = () => window.buildGuideResponse(game.name + ' ' + t.label);
  });

  return {
    text: `想看 <strong>${game.name}</strong> 哪方面的攻略呢？📖`,
    quickReplies: qrTexts,
    onQR,
  };
}

// ── 按攻略类型构建卡片 ──────────────────────────────────
window._buildTypedGuideCard = function(game, guideType, text) {
  // 🆕 虚拟游戏没有本地 mock 类型数据 → 直接走联网搜索
  if (game.isVirtual || (typeof game.id === 'string' && game.id.startsWith('virtual_'))) {
    // 将攻略类型作为搜索关键词，构造一个虚拟 hero 对象用于联网搜索
    const searchSubject = guideType.label; // 如"角色攻略"、"版本攻略"
    const searchHero = { name: searchSubject, aliases: [searchSubject], role: '未知', icon: guideType.icon, _fromTypedGuide: true };
    return window._buildGuideCard(game, searchHero, text);
  }

  const typedGuideData = _getTypedGuideData(game, guideType);

  return {
    text: `这是 <strong>${game.name}</strong> 的${guideType.label} ${guideType.icon}`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">${guideType.icon} ${game.name} · ${guideType.label}</div>
        <div style="padding:12px">
          <div style="font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:8px">${typedGuideData.title}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
            ${typedGuideData.tags.map(tag => `<div style="background:#eef3ff;border:1px solid rgba(26,107,255,.2);border-radius:8px;padding:5px 10px;font-size:11px;color:#1a6bff;font-weight:600">${tag}</div>`).join('')}
          </div>
          <div style="font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:6px">⚡ 要点</div>
          <div style="font-size:12px;color:#555;line-height:1.7">
            ${typedGuideData.tips.map(t => `• ${t}`).join('<br>')}
          </div>
        </div>
      </div>`,
    ...(_buildAfterCompleteQR('guide', game.name, ['record', 'partner', 'replay'], game.id) || {}),
  };
};

// ── 按类型获取攻略 mock 数据 ─────────────────────────────
function _getTypedGuideData(game, guideType) {
  // 各游戏 × 各攻略类型的 mock 数据
  const data = {
    wzry: {
      hero:  { title: '🛡️ 热门英雄推荐', tags: ['花木兰','赵云','鲁班七号','瑶','裴擒虎'], tips: ['当前版本花木兰对抗路强势，重剑连招一套带走','赵云打野前期多抓边路，4级后利用大招开团','辅助瑶绑定射手，注意附身时机保护C位'] },
      lane:  { title: '🗺️ 各分路要点', tags: ['对抗路','中路','发育路','打野','游走'], tips: ['对抗路：注重线权和河道视野控制，有线权才敢支援','中路：快速清线后支援上下，控制暴君节奏','打野：前期反野抢节奏，中期抓C位，后期保团战'] },
      meta:  { title: '📊 当前版本强势分析', tags: ['S43赛季','强势英雄','环境分析'], tips: ['S43赛季刺客回归，打野/中路刺客优先级提升','坦克辅助地位下降，软辅体系更适应当前节奏','推荐关注：花木兰、澜、镜等高机动英雄'] },
      team:  { title: '👥 热门阵容推荐', tags: ['双刺体系','保射阵容','快攻体系'], tips: ['双刺体系：打野+中路刺客，前期抓崩一路滚雪球','保射阵容：辅助+坦边保C位，稳定发育后期团战','快攻体系：高机动组合，利用版本节奏快速结束'] },
      rank:  { title: '🏆 上分实战技巧', tags: ['意识','走位','出装','ban位'], tips: ['排位优先ban版本强势英雄，减少对面拿到OP英雄的概率','多看小地图，培养支援意识，有线权就去抢河道资源','出装不要死板套用，根据对面阵容灵活调整防装'] },
    },
    hpjy: {
      weapon:   { title: '🔫 热门枪械推荐', tags: ['M416','AKM','AWM','UZI','DP-28'], tips: ['M416全能步枪，配合补偿器+垂直握把压枪极稳','AWM一枪倒，高手必备，注意子弹珍贵要精准','近战首选UZI/Vector，配合红点射速快TTK短'] },
      map:      { title: '🗺️ 地图打法要点', tags: ['海岛','沙漠','资源点','跑圈'], tips: ['跳伞选择偏远资源点，保证初期发育不被淘汰','关注航线和安全区走向，提前卡圈占据有利位置','决赛圈贴边走，利用掩体逐步缩圈，避免腹背受敌'] },
      mode:     { title: '🎮 各模式玩法', tags: ['经典模式','地铁逃生','团队竞技'], tips: ['经典模式讲究生存，搜集物资→转移→决赛圈三步走','地铁逃生注重收益，合理规划背包和撤离时机','团队竞技适合练枪，提升近战和中距离对枪能力'] },
      meta:     { title: '📊 版本环境分析', tags: ['CH.10赛季','枪械平衡','新内容'], tips: ['当前赛季地铁逃生新地图已开放，怒兆火山有大量高级资源','枪械平衡调整后步枪整体加强，冲锋枪近距离仍有优势','新配件系统上线，合理搭配配件可显著提升武器性能'] },
      survival: { title: '🏆 吃鸡实战技巧', tags: ['身法','对枪','卡点','转圈'], tips: ['对枪时多利用左右探头和跳射，减少暴露面积','转圈优先占领高点或建筑物，视野优势非常关键','决赛圈保持冷静，听声辨位，不要盲目暴露位置'] },
    },
    sjz: {
      operator: { title: '🎖️ 热门干员推荐', tags: ['蝶','突击兵','狙击手','医疗兵'], tips: ['新干员"蝶"机动性强，适合侧翼包抄和快速突破','突击兵适合攻楼，利用闪光弹配合队友推进','狙击手远程压制，注意变换狙击位避免被反狙'] },
      weapon:   { title: '🔫 武器配置推荐', tags: ['HK416','AK-74','烟雾弹','闪光弹'], tips: ['HK416综合性能优秀，适合中远距离交战','配件优先选择消焰器+垂直握把，稳定性最佳','战术装备带烟雾弹+闪光弹，攻守兼备'] },
      map:      { title: '🗺️ 地图战术要点', tags: ['据点','路线','攻防','撤离'], tips: ['进攻方先用烟雾遮蔽关键通道再推进，减少伤亡','防守方控制高点和瓶颈位，交叉火力覆盖入口','撤离模式规划多条撤离路线，随时有备选方案'] },
      meta:     { title: '📊 S8版本分析', tags: ['S8蝶变时刻','武器平衡','新内容'], tips: ['S8赛季新干员"蝶"上线，改变了快节奏进攻的打法','巴雷特M82A1和AR57即将加入，远程火力将增强','S9定档4月18日，新地图核电站值得期待'] },
      mode:     { title: '🎮 模式攻略', tags: ['全面战场','据点争夺','爆破'], tips: ['全面战场注重团队配合，分工明确攻防有序','据点争夺要灵活切换进攻和防守节奏','爆破模式听脚步判断位置，残局保持冷静'] },
    },
  };

  // 获取对应游戏和类型的数据，没有则返回通用 fallback
  const gameData = data[game.id] || {};
  const typeData = gameData[guideType.id];

  if (typeData) return typeData;

  // fallback：通用数据
  return {
    title: `${guideType.icon} ${game.name} ${guideType.label}`,
    tags: [game.name, guideType.label],
    tips: [`正在为你整理${game.name}的${guideType.label}…`, '可以告诉我更具体的问题，我来帮你搜索最新攻略 🔍'],
  };
}

// ── 高光视频响应 ───────────────────────────────────
window.buildHighlightResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  let game = detectGameWithContext(text);

  // 未指定游戏 → 先尝试通过英雄名跨游戏识别
  if (!game) {
    const crossResult = detectHeroAcrossGames(text);
    if (crossResult) game = crossResult.game;
  }

  // 仍然未识别 → 追问用户
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('highlight');
    const qrItems = buildQR_L1_selectGame(qrGames, 'highlight');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildHighlightResponse(key); };
    });
    return { text: '想生成哪个游戏的高光视频呢？🎬 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 该游戏不支持高光 → 友好提示并引导
  if (!isGameSupportedForFeature(game.id, 'highlight')) {
    const qrGames = getFeatureQuickReplyGames('highlight', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'highlight', game.name, 'record', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '战绩') return function() { return window.buildRecordResponse(game.name + '战绩'); };
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      if (key === game.name + '资讯') return function() { return window.buildNewsResponse(game.name + '资讯'); };
      return function() { return window.buildHighlightResponse(key); };
    });
    return { text: getUnsupportedGameTip('highlight', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  const highlightData = window.MOCK_HIGHLIGHT_DATA || {};
  const items = highlightData[game.id] || highlightData.wzry;
  return {
    text: `正在为Q仔生成 <strong>${game.name}昨日高光视频</strong>，提取到${items.length}个精彩时刻 🎬`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">🎬 Q仔的高光时刻 · ${game.name}</div>
        <div style="padding:10px;display:flex;flex-direction:column;gap:8px">
          ${items.map(item=>`
            <div style="display:flex;align-items:center;gap:10px;padding:9px;background:#fafbff;border-radius:10px">
              <div style="width:52px;height:36px;background:${game.gradient};border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">▶️</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:700;color:#1a1a2e">${item.t}</div>
                <div style="font-size:10px;color:#888;margin-top:2px">${item.d}</div>
              </div>
              <div style="background:#eef3ff;color:#1a6bff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:6px;flex-shrink:0">${item.tag}</div>
            </div>`).join('')}
          <div class="replay-btn-row">
            <button class="replay-btn primary" onclick="showToast('合集视频生成中，预计需要2分钟...')">一键生成合集视频</button>
          </div>
        </div>
      </div>`,
    ...(_buildAfterCompleteQR('highlight', game.name, ['record', 'partner', 'replay'], game.id) || {}),
  };
};

// ── 下载响应 ───────────────────────────────────────
window.buildDownloadResponse = function(text) {
  const GAMES = window.ENGINE_GAMES;
  const downloadData = window.MOCK_DOWNLOAD_DATA || {};

  // ── 游戏识别策略（下载场景特殊处理）──
  // 下载场景下，用户通常会提到一个具体的游戏名（可能不在游戏库中）
  // 因此需要：① 先从当前文本直接匹配 ② 再检查特殊文本 fallback ③ 最后才用上下文
  // 如果当前文本像是在说一个新游戏名（非库内游戏），不应该用上下文中的旧游戏替代

  const directGame = window.detectGame(text); // 仅从当前文本匹配（不含上下文）
  let detectedGame = directGame;
  let game;

  if (directGame && downloadData[directGame.id]) {
    // ① 当前文本直接匹配到库内游戏
    game = downloadData[directGame.id];
  } else if (!directGame) {
    // ③ 当前文本未匹配到任何游戏
    // 检查用户是否在说一个具体的游戏名（但不在我们的库中）
    // 通过检测文本中是否有"游戏名特征"来判断
    const looksLikeGameName = _looksLikeUnknownGameQuery(text);

    if (looksLikeGameName) {
      // 用户提到了一个我们库中没有的游戏 → 告知找不到，引导看其他游戏
      const qrGames = getFeatureQuickReplyGames('download');
      const qrItems = buildQR_L1_selectGame(qrGames, 'download');
      const resolved = resolveQR(qrItems, function(key) {
        return function() { return window.buildDownloadResponse(key) || { text: '好的，帮你查查～', cardHtml: null }; };
      });
      const gameName = _extractGameName(text);
      return {
        text: `抱歉，暂时没有找到 <strong>${gameName}</strong> 的下载信息 😅<br>这款游戏可能还没有收录到游戏中心，你可以看看下面这些热门游戏~`,
        cardHtml: null,
        quickReplies: resolved.quickReplies,
        onQR: resolved.onQR,
        _displayMap: resolved.displayMap,
      };
    }

    // 尝试用上下文获取（用户可能在延续之前的对话）
    const contextGame = window.getLastMentionedGame();
    if (contextGame && downloadData[contextGame.id]) {
      detectedGame = contextGame;
      game = downloadData[contextGame.id];
    }
  }

  // 未识别到具体游戏 → 反问用户，提供热门游戏快捷选项
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('download');
    const qrItems = buildQR_L1_selectGame(qrGames, 'download');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildDownloadResponse(key) || { text: '好的，帮你查查～', cardHtml: null }; };
    });
    return { text: '你想下载哪款游戏呢？告诉我游戏名称，我帮你找到下载入口 🎮', cardHtml: null, quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 该游戏不支持下载 → 友好提示并引导
  if (detectedGame && !isGameSupportedForFeature(detectedGame.id, 'download')) {
    const qrGames = getFeatureQuickReplyGames('download', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'download', detectedGame.name, 'guide', detectedGame.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === detectedGame.name + '攻略') return function() { return window.buildGuideResponse(detectedGame.name + '攻略'); };
      return function() { return window.buildDownloadResponse(key); };
    });
    return { text: getUnsupportedGameTip('download', detectedGame.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 获取跳转链接：优先用 detectedGame 的 jumpUrl
  const jumpUrl = (detectedGame && detectedGame.jumpUrl) || game.jumpUrl || '';
  const jumpAction = jumpUrl ? `window.open('${jumpUrl}','_blank')` : `showToast('正在跳转至应用宝下载 ${game.name}...')`;

  // 根据游戏状态动态获取按钮文案（兜底"立即下载"）
  const gameStatus = (detectedGame && detectedGame.status) || 'download';
  const statusInfo = (window.GAME_STATUS && window.GAME_STATUS[gameStatus]) || { text: '立即进入' };
  const btnText = statusInfo.text;

  // 根据状态生成不同的 AI 回复文案
  const replyTextMap = {
    download: `已找到 <strong>${game.name}</strong> 的下载入口 ⬇️`,
    reserve:  `<strong>${game.name}</strong> 即将上线，快来预约吧 🔔`,
    update:   `<strong>${game.name}</strong> 有新版本可以更新啦 🆕`,
  };
  const replyText = replyTextMap[gameStatus] || replyTextMap.download;

  // 构建素材模块 HTML（可选，配置了 media 时展示）
  const mediaList = (detectedGame && detectedGame.media) || [];
  let mediaHtml = '';
  if (mediaList.length > 0) {
    const mediaItems = mediaList.map(item => {
      if (item.type === 'video' && item.vid) {
        return `<div class="dl-media-item">
          <iframe class="dl-media-video" src="https://v.qq.com/txp/iframe/player.html?vid=${item.vid}&tiny=0&auto=0" frameborder="0" allowfullscreen></iframe>
        </div>`;
      } else if (item.type === 'image' && item.url) {
        return `<div class="dl-media-item">
          <img class="dl-media-img" src="${item.url}" alt="游戏素材" />
        </div>`;
      }
      return '';
    }).join('');
    mediaHtml = `<div class="dl-media-scroll">${mediaItems}</div>`;
  }

  // 获取游戏名用于追问
  var dlGameName = (detectedGame && detectedGame.name) || game.name;

  return {
    text: replyText,
    cardHtml: `
      <div class="result-card" style="cursor:pointer" onclick="${jumpAction}">
        <div class="download-card">
          <div class="dl-icon" style="background:${game.bg};overflow:hidden">${renderGameIcon(game,56,14,28)}</div>
          <div class="dl-info">
            <div class="dl-name">${game.name}</div>
            <div class="dl-meta">${game.slogan || ''}</div>
          </div>
          <button class="dl-btn" onclick="event.stopPropagation();${jumpAction}">${btnText}</button>
        </div>${mediaHtml}
        <div style="padding:0 14px 12px;display:flex;gap:8px">
          <div style="flex:1;background:#f5f8ff;border-radius:9px;padding:9px;text-align:center">
            <div style="font-size:11px;color:#888">${gameStatus === 'reserve' ? '预约人数' : '下载次数'}</div>
            <div style="font-size:16px;font-weight:900;color:#1a6bff">${game.downloads || '5280'}</div>
          </div>
          <div style="flex:1;background:#f5f8ff;border-radius:9px;padding:9px;text-align:center">
            <div style="font-size:11px;color:#888">品类</div>
            <div style="font-size:16px;font-weight:900;color:#1a1a2e">${game.category || '休闲'}</div>
          </div>${gameStatus !== 'reserve' ? `
          <div style="flex:1;background:#f5f8ff;border-radius:9px;padding:9px;text-align:center">
            <div style="font-size:11px;color:#888">大小</div>
            <div style="font-size:16px;font-weight:900;color:#1a1a2e">${game.size}</div>
          </div>` : ''}
        </div>
      </div>`,
    ...(_buildAfterCompleteQR('download', dlGameName, ['guide', 'news', 'welfare'], detectedGame && detectedGame.id) || {}),
  };
};

// ── 辅助函数：判断用户输入是否像在问一个不在库中的游戏 ────
// 去掉"下载/安装/预约"等动词后，如果剩余部分有 ≥2 个字符
// 且没有匹配到库内游戏，则认为用户在问一个未知游戏
function _looksLikeUnknownGameQuery(text) {
  // 去掉常见的下载类动词和修饰语（长模式优先，避免"怎么下"吃掉"下载"的"下"导致"载"残留）
  const cleaned = text.replace(/怎么下载|怎么下|哪里下载|哪里下|在哪下载|在哪下|下载|安装|预约|想玩|怎么玩|能玩|可以玩|体验|入口|链接|客户端|手游|手机版|游戏/g, '').trim();
  // 排除纯指代性词汇（这个/那个/这款/那款/它 等），这些不是游戏名
  if (/^(这个?|那个?|这款|那款|它|这游戏|那游戏|什么)$/.test(cleaned)) return false;
  // 如果剩余内容 ≥2 个字符，认为用户可能在提一个游戏名
  return cleaned.length >= 2;
}

// ── 辅助函数：从用户输入中提取可能的游戏名 ─────────────────
function _extractGameName(text) {
  // 去掉常见的动词和修饰语，保留游戏名部分（长模式优先，避免残留字符）
  return text.replace(/怎么下载|怎么下|哪里下载|哪里下|在哪下载|在哪下|下载|安装|预约|想玩|怎么玩|能玩|可以玩|体验|入口|链接|客户端|手游|手机版|帮我|帮忙|我想|我要|你能|请|游戏/g, '').trim() || text;
}

// ── 商城/皮肤响应（根据游戏使用不同商业化术语）───────────
window.buildSkinResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = detectGameWithContext(text);
  const skinByGame = window.MOCK_SKIN_BY_GAME || {};

  // 未识别到具体游戏 → 反问用户
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('skin');
    const qrItems = buildQR_L1_selectGame(qrGames, 'skin');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildSkinResponse(key); };
    });
    return { text: '想逛哪款游戏的商城呢？🛍️ 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 获取该游戏的商业化术语
  const skinLabel = window.getGameSkinLabel(game.id);

  // 该游戏不支持 → 友好提示并引导
  if (!isGameSupportedForFeature(game.id, 'skin')) {
    const qrGames = getFeatureQuickReplyGames('skin', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'skin', game.name, 'guide', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      return function() { return window.buildSkinResponse(key); };
    });
    return { text: getUnsupportedGameTip('skin', game.name, game.id), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  const skins = skinByGame[game.id] || [];

  // 该游戏没有数据 → 友好提示
  if (skins.length === 0) {
    const qrGames = getFeatureQuickReplyGames('skin', 2);
    const otherGames = qrGames.filter(g => g.id !== game.id);
    const qrItems = buildQR_L2_suggest(otherGames, 'skin', game.name, 'guide', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      return function() { return window.buildSkinResponse(key); };
    });
    return { text: `<strong>${game.name}</strong>暂时还没有${skinLabel}数据哦 😅 可以看看其他游戏~`, quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  const headerGame = game.name;
  return {
    text: game ? `<strong>${game.name}</strong>最近上架的${skinLabel}来了，看看有没有心动的 🛍️` : '最近上架的 <strong>热门新品</strong> 来了，限时特惠别错过 🛍️',
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">🛍️ 鹅毛市集 · ${headerGame}</div>
        <div class="skin-scroll">
          ${skins.map(s=>`
            <div class="skin-card" onclick="showToast('正在打开 ${s.name} 详情…')">
              <div class="skin-img" style="background:${s.bg}">${s.icon}</div>
              <div class="skin-info">
                <div class="skin-name">${s.name}</div>
                <div class="skin-price">${s.price}</div>
                <span class="skin-tag">${s.tag}</span>
              </div>
            </div>`).join('')}
        </div>
      </div>`,
    ...(_buildAfterCompleteQR('skin', game.name, ['welfare', 'news', 'record'], game.id) || {}),
  };
};

// ── 情绪安抚响应 ───────────────────────────────────
window.buildEmotionResponse = function(text) {
  // 情绪类型判断
  const lower = text.toLowerCase();
  let emotionType = 'frustrated'; // 默认连跪/沮丧
  if (/开心|高兴|赢|胜|上分|连胜|mvp|吃鸡|五杀|carry|上星/.test(lower)) emotionType = 'happy';
  else if (/累|困|疲|不想|休息|歇|睡|摆烂/.test(lower)) emotionType = 'tired';
  else if (/气|怒|举报|挂机|送人头|坑|猪队友|喷/.test(lower)) emotionType = 'angry';
  else if (/跪|输|烦|惨|崩|裂|炸|难受|心态|自闭|emo|无语/.test(lower)) emotionType = 'frustrated';

  const config = {
    happy: {
      text: 'Q仔，看起来今天战绩不错啊 🎉<br>想趁热打铁继续，还是见好就收？',
      icon: '🎉',
      title: '今天状态在线！',
      sub: '趁手感好，选一个：',
      buttons: [
        {icon:'🤝',text:'继续找搭子',action:'partner'},
        {icon:'🎬',text:'生成高光',action:'highlight'},
        {icon:'📊',text:'看看战绩',action:'record'},
        {icon:'📖',text:'进阶攻略',action:'guide'},
      ]
    },
    tired: {
      text: 'Q仔，累了就歇歇，游戏不会跑的 😴<br>选一个放松方式：',
      icon: '😴',
      title: '累了就放一放吧',
      sub: '先调整一下再说：',
      buttons: [
        {icon:'😌',text:'休息一下',action:'rest'},
        {icon:'📊',text:'看看战报',action:'report'},
        {icon:'🛍️',text:'逛逛商城',action:'skin'},
        {icon:'📰',text:'看看资讯',action:'news'},
      ]
    },
    angry: {
      text: 'Q仔，遇到这种队友确实气人 😤<br>别急，我帮你想办法：',
      icon: '😤',
      title: '深呼吸，别被带节奏',
      sub: '来释放一下：',
      buttons: [
        {icon:'🤝',text:'找靠谱搭子',action:'partner'},
        {icon:'🔍',text:'复盘看看',action:'replay'},
        {icon:'😌',text:'休息一下',action:'rest'},
        {icon:'📖',text:'提升自己',action:'guide'},
      ]
    },
    frustrated: {
      text: 'Q仔，连跪确实太难受了 😮‍💨<br>我来帮你找个出口，选一个：',
      icon: '😮‍💨',
      title: '心态稳住，都是青铜的路',
      sub: '想怎么调整一下？',
      buttons: [
        {icon:'🤝',text:'找个搭子',action:'partner'},
        {icon:'🔍',text:'看看复盘',action:'replay'},
        {icon:'😌',text:'休息一下',action:'rest'},
        {icon:'📖',text:'看看攻略',action:'guide'},
      ]
    }
  };
  const c = config[emotionType];
  return {
    text: c.text,
    cardHtml: `
      <div class="result-card">
        <div class="emotion-card">
          <div class="emotion-header">
            <div class="emotion-icon">${c.icon}</div>
            <div><div class="emotion-text">${c.title}</div><div class="emotion-sub">${c.sub}</div></div>
          </div>
          <div class="emotion-actions">
            ${c.buttons.map(b => `<div class="emotion-btn" onclick="emotionAction('${b.action}')"><div class="emotion-btn-icon">${b.icon}</div><div class="emotion-btn-text">${b.text}</div></div>`).join('')}
          </div>
        </div>
      </div>`
  };
};

// ── 提醒响应 ───────────────────────────────────────
window.buildReminderResponse = function(text) {
  // ── 检测是否为「取消提醒」意图 ──
  var _cancelPatterns = ['取消提醒','取消闹钟','取消定时','不用提醒','别提醒','不需要提醒',
    '关掉提醒','关闭提醒','删除提醒','去掉提醒','不要提醒了','算了不用提醒'];
  var _textLower = text.toLowerCase();
  for (var _ci = 0; _ci < _cancelPatterns.length; _ci++) {
    if (_textLower.indexOf(_cancelPatterns[_ci]) !== -1) {
      return window.buildCancelReminderResponse(text);
    }
  }

  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = detectGameWithContext(text);

  // 未指定游戏 → 追问用户
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('reminder');
    const qrItems = buildQR_L1_selectGame(qrGames, 'reminder');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildReminderResponse(key + text); };
    });
    return { text: '想设置哪个游戏的提醒呢？⏰ 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 该游戏不支持提醒 → 友好提示并引导
  if (!isGameSupportedForFeature(game.id, 'reminder')) {
    const qrGames = getFeatureQuickReplyGames('reminder', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'reminder', game.name, 'guide', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      return function() { return window.buildReminderResponse(key + text); };
    });
    return { text: getUnsupportedGameTip('reminder', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  const timeMatch = text.match(/(\d+)点/);
  const timeStr = timeMatch ? `今天 ${timeMatch[1]}:00` : '设定时间';
  const modeMap = window.MOCK_MODE_MAP || { wzry:'排位', hpjy:'经典模式', sjz:'据点争夺', cfm:'爆破模式', ys:'每日委托' };
  const mode = modeMap[game.id] || '排位';
  return {
    text: `好的！我来帮你设置${game.name}提醒 ⏰`,
    cardHtml: `
      <div class="result-card">
        <div class="reminder-card">
          <div class="reminder-header">
            <div class="reminder-icon">⏰</div>
            <div><div class="reminder-title">提醒已设置</div><div class="reminder-sub">到时间我会通知你</div></div>
          </div>
          <div class="reminder-time">📅 ${timeStr} &nbsp;·&nbsp; <span style="display:inline-flex;align-items:center;gap:4px">${renderGameIcon(game,16,4,10)} ${game.name}</span> · ${mode}</div>
          <div class="replay-btn-row">
            <button class="replay-btn primary" onclick="this.textContent='✅ 已确认';this.style.background='#22c55e';showToast('提醒设置成功 ⏰')">确认提醒</button>
          </div>
        </div>
      </div>`,
    ...(_buildAfterCompleteQR('reminder', game.name, ['welfare', 'partner', 'record'], game.id) || {}),
  };
};

// ── 提醒卡片按钮交互 ───────────────────────────────
window._confirmReminder = function(btn) {
  var row = btn.closest('.reminder-btn-row');
  if (!row) return;
  btn.textContent = '✅ 已确认';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  // 隐藏取消按钮
  var cancelBtn = row.querySelector('.reminder-cancel-btn');
  if (cancelBtn) { cancelBtn.style.display = 'none'; }
  showToast('提醒设置成功 ⏰');
};

window._cancelReminder = function(btn) {
  var row = btn.closest('.reminder-btn-row');
  var card = btn.closest('.reminder-card');
  if (!row || !card) return;
  // 更新标题区域
  var titleEl = card.querySelector('.reminder-title');
  var subEl = card.querySelector('.reminder-sub');
  var iconEl = card.querySelector('.reminder-icon');
  if (titleEl) titleEl.textContent = '提醒已取消';
  if (subEl) subEl.textContent = '你可以随时重新设置';
  if (iconEl) iconEl.textContent = '🔕';
  // 时间行加删除线效果
  var timeEl = card.querySelector('.reminder-time');
  if (timeEl) {
    timeEl.style.textDecoration = 'line-through';
    timeEl.style.opacity = '0.5';
    timeEl.style.color = '#909094';
    timeEl.style.borderColor = 'rgba(0,0,0,.08)';
  }
  // 更新按钮区：只保留一个"已取消"状态
  row.innerHTML = '<button class="replay-btn reminder-cancelled-btn" disabled>🔕 已取消</button>';
  showToast('提醒已取消');
};

// ── 取消提醒指令响应 ───────────────────────────────
window.buildCancelReminderResponse = function(text) {
  return {
    text: '好的，已帮你<strong>取消提醒</strong> 🔕 需要重新设置的话随时告诉我~',
    cardHtml: '<div class="result-card"><div class="reminder-card">' +
      '<div class="reminder-header">' +
        '<div class="reminder-icon">🔕</div>' +
        '<div><div class="reminder-title">提醒已取消</div><div class="reminder-sub">你可以随时重新设置</div></div>' +
      '</div>' +
      '<div class="replay-btn-row">' +
        '<button class="replay-btn primary" onclick="fillInput(\'帮我设个游戏提醒\')">重新设置提醒</button>' +
      '</div>' +
    '</div></div>',
    quickReplies: ['重新设个提醒', '看看今日福利', '查查最近战绩'],
    onQR: {
      '重新设个提醒': function() { return window.buildReminderResponse('帮我设个游戏提醒'); },
      '看看今日福利': function() { return window.buildWelfareResponse('今日福利'); },
      '查查最近战绩': function() { return window.buildRecordResponse('查查最近战绩'); },
    },
  };
};

// ── 预构建福利卡片 ─────────────────────────────────
window.getPrebuiltCard = function(cardId) {
  const welfareItems = window.MOCK_WELFARE_ITEMS || {};
  const items = welfareItems[cardId] || welfareItems['welfare__all'];
  return `
    <div class="result-card">
      <div class="result-card-header">🎁 今日可领福利 · ${items.length}个</div>
      <div class="welfare-list">
        ${items.map(i=>`
          <div class="welfare-item">
            <div class="wi-icon ${i.cls}">${i.icon}</div>
            <div class="wi-info"><div class="wi-name">${i.name}</div><div class="wi-deadline">⏰ ${i.dl}</div></div>
            <button class="wi-action" onclick="${i.url ? `window.open('${i.url}','_blank')` : `showToast('正在跳转领取 ${i.name}...')`}">立即领取</button>
          </div>`).join('')}
      </div>
    </div>`;
};

// ── 好友排行响应 ───────────────────────────────────
window.buildRankingResponse = function(text) {
  const game = detectGameWithContext(text);

  // ── 检测用户是否在问"英雄排行/角色排行/武器排行"等不支持的排行类型 ──
  // 策略：如果文本中包含非好友排行的排行类型关键词，或者检测到了英雄/角色名
  //       → 先告知没有该服务，再推荐好友排行等可用功能
  var unsupportedRankType = null;
  var _rankTypePatterns = [
    { keywords: ['英雄排行','英雄榜','角色排行','角色榜','武器排行','武器榜','装备排行','装备榜'], label: '英雄排行' },
    { keywords: ['胜率排行','胜率榜','出场率排行','出场率榜','ban率排行','热度排行','热度榜','使用率排行','使用率榜'], label: '英雄胜率排行' },
    { keywords: ['国服排行','国服榜','国服最强'], label: '国服排行' },
    { keywords: ['全服排行','全服榜','战力排行','战力榜'], label: '战力排行' },
  ];
  var _textLower = text.toLowerCase();
  for (var _rp = 0; _rp < _rankTypePatterns.length; _rp++) {
    var _rItem = _rankTypePatterns[_rp];
    for (var _rk = 0; _rk < _rItem.keywords.length; _rk++) {
      if (_textLower.indexOf(_rItem.keywords[_rk]) !== -1) {
        unsupportedRankType = _rItem.label;
        break;
      }
    }
    if (unsupportedRankType) break;
  }

  // 如果没匹配到显式关键词，再检查是否提到了英雄名/角色名 + 排行
  if (!unsupportedRankType && /排行|排名|榜/.test(text)) {
    var _heroResult = window.detectHeroAcrossGames ? window.detectHeroAcrossGames(text) : null;
    if (_heroResult && _heroResult.hero) {
      unsupportedRankType = _heroResult.hero.name + '排行';
    }
  }

  if (unsupportedRankType) {
    // 构建推荐好友排行 + 其他功能的追问
    var qrGames = getFeatureQuickReplyGames('ranking');
    var qrItems = buildQR_L1_selectGame(qrGames, 'ranking');
    var resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildRankingResponse(key); };
    });
    return {
      text: '<strong>' + unsupportedRankType + '</strong>暂时还没有上线哦 😅 目前支持查看<strong>好友排行</strong>，看看你在好友中排第几 🏅',
      quickReplies: resolved.quickReplies,
      onQR: resolved.onQR,
      _displayMap: resolved.displayMap
    };
  }

  // 未识别到具体游戏 → 反问用户
  if (!game) {
    const qrGames = getFeatureQuickReplyGames('ranking');
    const qrItems = buildQR_L1_selectGame(qrGames, 'ranking');
    const resolved = resolveQR(qrItems, function(key) {
      return function() { return window.buildRankingResponse(key); };
    });
    return { text: '想看哪款游戏的好友排行呢？🏅 告诉我游戏名~', quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  // 该游戏不支持排行 → 友好提示并引导
  if (!isGameSupportedForFeature(game.id, 'ranking')) {
    const qrGames = getFeatureQuickReplyGames('ranking', 2);
    const qrItems = buildQR_L2_suggest(qrGames, 'ranking', game.name, 'record', game.id);
    const resolved = resolveQR(qrItems, function(key) {
      if (key === game.name + '战绩') return function() { return window.buildRecordResponse(game.name + '战绩'); };
      if (key === game.name + '攻略') return function() { return window.buildGuideResponse(game.name + '攻略'); };
      if (key === game.name + '资讯') return function() { return window.buildNewsResponse(game.name + '资讯'); };
      return function() { return window.buildRankingResponse(key); };
    });
    return { text: getUnsupportedGameTip('ranking', game.name), quickReplies: resolved.quickReplies, onQR: resolved.onQR, _displayMap: resolved.displayMap };
  }

  const rankingData = window.MOCK_RANKING_DATA || {};
  const data = rankingData[game.id] || rankingData.wzry;
  if (!data) {
    return { text: '暂时没有排行数据，稍后再试 😅' };
  }

  const tabs = data.tabs || ['上星榜'];
  const defaultTab = data.defaultTab || tabs[0];
  const me = data.me || {};
  const friends = (data.friends || {})[defaultTab] || [];
  const encouragement = data.encouragement || '';

  // 渲染 Tab 栏
  const tabsHtml = tabs.map(t =>
    `<button class="ranking-tab${t === defaultTab ? ' ranking-tab--active' : ''}" onclick="window._switchRankingTab(this,'${game.id}','${t}')">${t}</button>`
  ).join('');

  // 渲染"我"的排名行
  const meStat = (me.stats || {})[defaultTab] || {};
  const meRankLabel = me.rank ? `<span class="ranking-item__rank-num">${me.rank}</span>` : '';
  const meHtml = `
    <div class="ranking-item ranking-item--me">
      <div class="ranking-item__left">
        <div class="ranking-item__avatar-wrap">
          <img class="ranking-item__avatar" src="${me.avatar || ''}" alt="" onerror="this.style.display='none'">
        </div>
        ${meRankLabel}
        <div class="ranking-item__info">
          <span class="ranking-item__name">${me.name || '我'}</span>
          <div class="ranking-item__tier-row"><div class="ranking-item__tier-icon"></div><span class="ranking-item__tier-text">${me.tier || ''}</span></div>
        </div>
      </div>
      <div class="ranking-item__right">
        <div class="ranking-item__stat">${meStat.prefix ? '<span class="ranking-item__stat-prefix">' + meStat.prefix + '</span>' : ''}<span class="ranking-item__stat-value">${meStat.value || 0}</span>${meStat.unit ? '<span class="ranking-item__stat-suffix">' + meStat.unit + '</span>' : ''}</div>
        <button class="ranking-item__like-btn" onclick="event.stopPropagation();showToast('已点赞 ❤️')"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 10.5s-5-3.5-5-6.5a2.5 2.5 0 015 0 2.5 2.5 0 015 0c0 3-5 6.5-5 6.5z" stroke="#4D4D4D" stroke-width="1" fill="none"/></svg><span class="ranking-item__like-count">${me.likes || 0}</span></button>
      </div>
    </div>`;

  // 渲染好友排名行
  const friendsHtml = friends.map(f => {
    const rankLabel = f.rank ? `<span class="ranking-item__rank-num">${f.rank}</span>` : '';
    return `
    <div class="ranking-item">
      <div class="ranking-item__left">
        <div class="ranking-item__avatar-wrap">
          <img class="ranking-item__avatar" src="${f.avatar || ''}" alt="" onerror="this.style.display='none'">
        </div>
        ${rankLabel}
        <div class="ranking-item__info">
          <span class="ranking-item__name">${f.name}</span>
          <div class="ranking-item__tier-row"><div class="ranking-item__tier-icon"></div><span class="ranking-item__tier-text">${f.tier || ''}</span></div>
        </div>
      </div>
      <div class="ranking-item__right">
        <div class="ranking-item__stat">${f.prefix ? '<span class="ranking-item__stat-prefix">' + f.prefix + '</span>' : ''}<span class="ranking-item__stat-value">${f.value}</span>${f.unit ? '<span class="ranking-item__stat-suffix">' + f.unit + '</span>' : ''}</div>
        <button class="ranking-item__like-btn" onclick="event.stopPropagation();showToast('已点赞 ❤️')"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 10.5s-5-3.5-5-6.5a2.5 2.5 0 015 0 2.5 2.5 0 015 0c0 3-5 6.5-5 6.5z" stroke="#4D4D4D" stroke-width="1" fill="none"/></svg><span class="ranking-item__like-count">${f.likes || 0}</span></button>
      </div>
    </div>`;
  }).join('');

  // 底部激励栏
  const encourageHtml = encouragement ? `
    <div class="ranking-encourage">
      <div class="ranking-encourage__avatar"><img src="${me.avatar || ''}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>
      <span class="ranking-encourage__text">${encouragement}</span>
    </div>` : '';

  // 快捷回复：优先引导同游戏下的其他功能（游戏关联度优先策略）
  // 策略：排行完成后 → 同游戏战绩/复盘/找搭子 优先于 跨游戏排行
  var rankingQR = _buildAfterCompleteQR('ranking', game.name, ['record', 'replay', 'partner'], game.id);
  var qrTexts, onQR, displayMap;
  if (rankingQR && rankingQR.quickReplies && rankingQR.quickReplies.length > 0) {
    qrTexts = rankingQR.quickReplies;
    onQR = rankingQR.onQR;
    displayMap = rankingQR._displayMap;
  } else {
    // 兜底：如果同游戏功能追问构建失败，降级到查看战绩
    const qrItems = [{ text: '看看我的战绩', actionKey: game.name + '战绩' }];
    onQR = {};
    onQR[game.name + '战绩'] = () => window.buildRecordResponse(game.name + '战绩');
    qrTexts = qrItems.map(function(item) { return item.text; });
    displayMap = {};
    qrItems.forEach(function(item) { displayMap[item.text] = item.actionKey; });
  }

  return {
    text: `来看看 <strong>${game.name}</strong> 好友排行，你在第几名？🏅`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">🏅 好友排行 · ${game.name}</div>
        <div class="ranking-card" data-game="${game.id}">
          <div class="ranking-tabs">${tabsHtml}</div>
          <div class="ranking-list">
            ${meHtml}
            ${friendsHtml}
          </div>
          ${encourageHtml}
        </div>
      </div>`,
    quickReplies: qrTexts,
    onQR,
    _displayMap: displayMap,
  };
};

// ── Tab 切换逻辑（好友排行卡片内部切换）──
window._switchRankingTab = function(btnEl, gameId, tabName) {
  const card = btnEl.closest('.ranking-card');
  if (!card) return;

  // 更新 tab 样式
  card.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('ranking-tab--active'));
  btnEl.classList.add('ranking-tab--active');

  const rankingData = window.MOCK_RANKING_DATA || {};
  const data = rankingData[gameId];
  if (!data) return;

  const me = data.me || {};
  const friends = (data.friends || {})[tabName] || [];
  const meStat = (me.stats || {})[tabName] || {};

  const list = card.querySelector('.ranking-list');
  if (!list) return;

  // 重新渲染排名列表
  const meRankLabel = me.rank ? `<span class="ranking-item__rank-num">${me.rank}</span>` : '';
  const meHtml = `
    <div class="ranking-item ranking-item--me">
      <div class="ranking-item__left">
        <div class="ranking-item__avatar-wrap">
          <img class="ranking-item__avatar" src="${me.avatar || ''}" alt="" onerror="this.style.display='none'">
        </div>
        ${meRankLabel}
        <div class="ranking-item__info">
          <span class="ranking-item__name">${me.name || '我'}</span>
          <div class="ranking-item__tier-row"><div class="ranking-item__tier-icon"></div><span class="ranking-item__tier-text">${me.tier || ''}</span></div>
        </div>
      </div>
      <div class="ranking-item__right">
        <div class="ranking-item__stat">${meStat.prefix ? '<span class="ranking-item__stat-prefix">' + meStat.prefix + '</span>' : ''}<span class="ranking-item__stat-value">${meStat.value || 0}</span>${meStat.unit ? '<span class="ranking-item__stat-suffix">' + meStat.unit + '</span>' : ''}</div>
        <button class="ranking-item__like-btn" onclick="event.stopPropagation();showToast('已点赞 ❤️')"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 10.5s-5-3.5-5-6.5a2.5 2.5 0 015 0 2.5 2.5 0 015 0c0 3-5 6.5-5 6.5z" stroke="#4D4D4D" stroke-width="1" fill="none"/></svg><span class="ranking-item__like-count">${me.likes || 0}</span></button>
      </div>
    </div>`;

  const friendsHtml = friends.map(f => {
    const rankLabel = f.rank ? `<span class="ranking-item__rank-num">${f.rank}</span>` : '';
    return `
    <div class="ranking-item">
      <div class="ranking-item__left">
        <div class="ranking-item__avatar-wrap">
          <img class="ranking-item__avatar" src="${f.avatar || ''}" alt="" onerror="this.style.display='none'">
        </div>
        ${rankLabel}
        <div class="ranking-item__info">
          <span class="ranking-item__name">${f.name}</span>
          <div class="ranking-item__tier-row"><div class="ranking-item__tier-icon"></div><span class="ranking-item__tier-text">${f.tier || ''}</span></div>
        </div>
      </div>
      <div class="ranking-item__right">
        <div class="ranking-item__stat">${f.prefix ? '<span class="ranking-item__stat-prefix">' + f.prefix + '</span>' : ''}<span class="ranking-item__stat-value">${f.value}</span>${f.unit ? '<span class="ranking-item__stat-suffix">' + f.unit + '</span>' : ''}</div>
        <button class="ranking-item__like-btn" onclick="event.stopPropagation();showToast('已点赞 ❤️')"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 10.5s-5-3.5-5-6.5a2.5 2.5 0 015 0 2.5 2.5 0 015 0c0 3-5 6.5-5 6.5z" stroke="#4D4D4D" stroke-width="1" fill="none"/></svg><span class="ranking-item__like-count">${f.likes || 0}</span></button>
      </div>
    </div>`;
  }).join('');

  list.innerHTML = meHtml + friendsHtml;
};
