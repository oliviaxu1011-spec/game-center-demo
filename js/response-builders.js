// ============================================================
// RESPONSE BUILDERS — 响应构建器
// 根据意图 ID 和用户文本，生成对应的回复（text + cardHtml）
// 修改说明：直接编辑此文件即可调整卡片展示内容，刷新页面生效
// ============================================================

// ── 响应路由器（分发到各 build 函数）───────────────
window.buildResponse = function(intentId, userText) {
  const map = {
    welfare: window.buildWelfareResponse,
    record:  window.buildRecordResponse,
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
  };
  const fn = map[intentId];
  return fn ? fn(userText) : null;
};

// ── 福利响应 ───────────────────────────────────────
window.buildWelfareResponse = function(text) {
  const game = detectGame(text);
  const showAll = text === '_all';
  if (game) {
    const welfareByGame = window.MOCK_WELFARE_BY_GAME || {};
    const items = welfareByGame[game.id] || welfareByGame.wzry;
    return {
      text: `${game.name}今天有 <strong>${items.length}个福利</strong> 可以领，快去领吧！`,
      card: 'welfare_' + game.id,
      cardHtml: `
        <div class="result-card">
          <div class="result-card-header">🎁 今日可领福利 · ${game.name}</div>
          <div class="welfare-list">
            ${items.map(i=>`
              <div class="welfare-item">
                <div class="wi-icon ${i.cls}">${i.icon}</div>
                <div class="wi-info"><div class="wi-game">${i.game}</div><div class="wi-name">${i.name}</div><div class="wi-deadline">⏰ ${i.dl}</div></div>
                <button class="wi-action">立即领</button>
              </div>`).join('')}
          </div>
        </div>`
    };
  }
  if (showAll) {
    return {
      text: '帮你汇总了 <strong>全部游戏的今日福利</strong> 🎉',
      card: 'welfare__all'
    };
  }
  return {
    text: '我帮你找到了 <strong>今日全部可领福利</strong> 🎉<br>想先看哪个游戏的？',
    quickReplies: ['⚔️ 王者荣耀', '🔫 三角洲行动', '🪂 和平精英', '🏰 英雄联盟', '🌍 原神', '全部游戏'],
    onQR: {
      '⚔️ 王者荣耀': () => window.buildWelfareResponse('王者'),
      '🔫 三角洲行动': () => window.buildWelfareResponse('三角'),
      '🪂 和平精英': () => window.buildWelfareResponse('和平'),
      '🏰 英雄联盟': () => window.buildWelfareResponse('英雄联盟'),
      '🌍 原神': () => window.buildWelfareResponse('原神'),
      '全部游戏': () => window.buildWelfareResponse('_all')
    }
  };
};

// ── 战绩响应 ───────────────────────────────────────
window.buildRecordResponse = function(text) {
  const GAMES = window.ENGINE_GAMES;
  const range = parseTimeRange(text) || { label:'近7日', days:7, tag:'week' };
  const game = detectGame(text);

  // 未指定具体游戏 → 展示所有在玩游戏的概览
  if (!game) {
    const userGames = window.MOCK_USER_GAMES || [];
    const gameCardsHtml = userGames.map(g => {
      const summary = g.desc || (range.label + ' ' + g.matches + '场 · 胜率 <span style="color:' + g.winColor + '">' + g.winRate + '</span>');
      return `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#f8faff;border-radius:10px;cursor:pointer;transition:all 0.2s;border:1px solid #e8eef8" onmouseover="this.style.background='#eef3ff';this.style.borderColor='#1a6bff'" onmouseout="this.style.background='#f8faff';this.style.borderColor='#e8eef8'">
        <div style="width:36px;height:36px;border-radius:10px;background:${g.gradient};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${g.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;color:#1a1a2e">${g.name}</div>
          <div style="font-size:11px;color:#888;margin-top:1px">${summary}</div>
        </div>
        <div style="font-size:11px;color:#1a6bff;font-weight:600;flex-shrink:0">查看 ›</div>
      </div>`;
    }).join('');

    const qrOptions = userGames.map(g => `${g.icon} ${g.name}`);
    const callbacks = {};
    userGames.forEach(g => {
      callbacks[`${g.icon} ${g.name}`] = () => {
        const gameObj = GAMES[g.id];
        const d = genRecordData(range, gameObj);
        const winRateLabel = gameObj.id === 'ys' ? '探索度' : '胜率';
        return {
          text: `这是蟹柳 <strong>${range.label}</strong> 的${gameObj.name}战绩 📊`,
          cardHtml: `
            <div class="result-card">
              <div class="result-card-header">🏆 ${range.label}战绩 · ${gameObj.name}</div>
              <div style="padding:12px">
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">
                  <div class="stat-item"><div class="stat-val" style="color:${d.winColor}">${d.winRate}</div><div class="stat-label">${winRateLabel}</div></div>
                  <div class="stat-item"><div class="stat-val">${d.matches}</div><div class="stat-label">场次</div></div>
                  <div class="stat-item"><div class="stat-val">${d.score}</div><div class="stat-label">${d.scoreLabel}</div></div>
                </div>
                <div style="font-size:12px;color:#888;margin-bottom:6px;font-weight:600">${d.heroLabel}</div>
                <div style="display:flex;gap:8px">
                  ${d.heroes.map(h=>`
                  <div style="flex:1;background:#fafbff;border-radius:9px;padding:8px;text-align:center">
                    <div style="font-size:20px">${h.i}</div>
                    <div style="font-size:11px;font-weight:700;color:#1a1a2e;margin-top:3px">${h.n}</div>
                    <div style="font-size:10px;color:${h.c}">${gameObj.id === 'ys' ? '' : '胜率 '}${h.r}</div>
                  </div>`).join('')}
                </div>
              </div>
            </div>`
        };
      };
    });

    return {
      text: `蟹柳${range.label}玩了好几款游戏呢 🎮 你想看哪个游戏的战绩？`,
      cardHtml: `
        <div class="result-card">
          <div class="result-card-header">🎮 ${range.label}在玩的游戏</div>
          <div style="padding:10px;display:flex;flex-direction:column;gap:6px">
            ${gameCardsHtml}
          </div>
        </div>`,
      quickReplies: qrOptions,
      onQR: callbacks
    };
  }

  // 指定了具体游戏 → 直接展示该游戏战绩
  const d = genRecordData(range, game);
  const winRateLabel = game.id === 'ys' ? '探索度' : '胜率';
  return {
    text: `这是蟹柳 <strong>${range.label}</strong> 的${game.name}战绩 📊`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">🏆 ${range.label}战绩 · ${game.name}</div>
        <div style="padding:12px">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">
            <div class="stat-item"><div class="stat-val" style="color:${d.winColor}">${d.winRate}</div><div class="stat-label">${winRateLabel}</div></div>
            <div class="stat-item"><div class="stat-val">${d.matches}</div><div class="stat-label">场次</div></div>
            <div class="stat-item"><div class="stat-val">${d.score}</div><div class="stat-label">${d.scoreLabel}</div></div>
          </div>
          <div style="font-size:12px;color:#888;margin-bottom:6px;font-weight:600">${d.heroLabel}</div>
          <div style="display:flex;gap:8px">
            ${d.heroes.map(h=>`
            <div style="flex:1;background:#fafbff;border-radius:9px;padding:8px;text-align:center">
              <div style="font-size:20px">${h.i}</div>
              <div style="font-size:11px;font-weight:700;color:#1a1a2e;margin-top:3px">${h.n}</div>
              <div style="font-size:10px;color:${h.c}">${game.id === 'ys' ? '' : '胜率 '}${h.r}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>`
  };
};

// ── 复盘响应 ───────────────────────────────────────
window.buildReplayResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const range = parseTimeRange(text) || { label:'最近一局', days:0, tag:'last_match' };
  const game = detectGame(text) || DEFAULT_GAME;
  const d = genReplayData(range, game);
  const isWin = d.result === 'win';
  const kLabel = d.kLabel || '击杀';
  const dLabel = d.dLabel || '死亡';
  const aLabel = d.aLabel || '助攻';
  const dVal   = d.dVal || d.d;
  const aVal   = d.aVal || d.a;
  return {
    text: `找到蟹柳 <strong>${range.label}</strong> 的${game.name}数据了，AI分析如下：`,
    cardHtml: `
      <div class="result-card">
        <div class="replay-card">
          <div class="replay-header">
            <div class="replay-hero-icon" style="background:${game.gradient}">${d.heroIcon || game.icon}</div>
            <div class="replay-game-info">
              <div class="replay-game-name">${game.name} · ${d.hero}</div>
              <div class="replay-result ${d.result}">● ${isWin?'胜利':'失败'} · ${d.duration}</div>
              <div class="replay-time">${d.time} · ${d.mode || '排位赛'}</div>
            </div>
          </div>
          <div class="replay-stats">
            <div class="stat-item"><div class="stat-val">${d.k}</div><div class="stat-label">${kLabel}</div></div>
            <div class="stat-item"><div class="stat-val">${dVal}</div><div class="stat-label">${dLabel}</div></div>
            <div class="stat-item"><div class="stat-val">${aVal}</div><div class="stat-label">${aLabel}</div></div>
          </div>
          <div class="replay-insight">
            <span class="replay-insight-label">💡 AI分析：</span>${d.insight}
          </div>
          <div class="replay-btn-row">
            <button class="replay-btn primary" onclick="handleGenerateHighlightVideo('${game.id}','${d.hero}','${d.result}')">🎬 生成高光视频</button>
            <button class="replay-btn secondary" onclick="handleViewDetailData('${game.id}','${d.hero}','${range.label}')">📊 详细数据</button>
          </div>
        </div>
      </div>`
  };
};

// ── 周报/报告响应 ──────────────────────────────────
window.buildReportResponse = function(text) {
  const range = parseTimeRange(text) || { label:'本周', days:7, tag:'week' };
  const d = genReportData(range);
  const wc = d.winRate >= 55 ? '#22c55e' : d.winRate >= 45 ? '#f59e0b' : '#ef4444';
  return {
    text: `这是蟹柳的 <strong>${d.title}</strong> 📅`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">📅 蟹柳的${d.title} · ${d.period}</div>
        <div class="report-card">
          <div class="report-row">
            <div class="report-item"><div class="report-val">${d.matches}</div><div class="report-label">总局数</div></div>
            <div class="report-divider"></div>
            <div class="report-item"><div class="report-val" style="color:${wc}">${d.winRate}%</div><div class="report-label">综合胜率</div></div>
            <div class="report-divider"></div>
            <div class="report-item"><div class="report-val">${d.hours}</div><div class="report-label">游戏时长</div></div>
          </div>
          <div class="report-bar-section">
            ${d.bars.map(b=>`
              <div style="margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                  <span class="report-bar-label">${b.l}</span>
                  <span style="font-size:11px;color:#888">${b.p}%</span>
                </div>
                <div class="report-bar-track"><div class="report-bar-fill" style="width:${b.p}%;background:${b.c}"></div></div>
              </div>`).join('')}
          </div>
          <div style="background:#f5fff8;border:1px solid #d0f0d8;border-radius:9px;padding:10px;font-size:12px;color:#1a6a30;margin-top:2px">
            💡 ${d.tip}
          </div>
        </div>
      </div>`
  };
};

// ── 找搭子响应 ─────────────────────────────────────
window.buildPartnerResponse = function(text) {
  const HERO_DB = window.ENGINE_HERO_DB;
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  // 先尝试从英雄名反推游戏
  let game = detectGame(text);
  let hero = game ? detectHero(text, game) : null;

  // 未通过游戏关键词识别到游戏，尝试通过英雄名跨游戏识别
  if (!game && !hero) {
    const crossResult = detectHeroAcrossGames(text);
    if (crossResult) {
      game = crossResult.game;
      hero = crossResult.hero;
    }
  }
  if (!game) game = DEFAULT_GAME;
  if (!hero) hero = detectHero(text, game);

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
      ? `<div style="font-size:10px;color:#1a6bff;margin-top:2px">🎯 擅长${hero.name}</div>`
      : '';
    const heroListStr = p.heroes.slice(0, 3).join(' / ');
    return `
          <div class="partner-item">
            <div class="partner-avatar" style="background:${p.bg}">${p.avatar}<div class="partner-online-dot"></div></div>
            <div class="partner-info">
              <div class="partner-name">${p.name}</div>
              <div class="partner-rank">⭐ ${p.rank} · ${p.role}</div>
              ${heroHighlight}
              <div style="font-size:10px;color:#999;margin-top:1px">常用：${heroListStr}</div>
              <div class="partner-tag-row">${p.tags.map(t=>`<span class="partner-tag">${t}</span>`).join('')}</div>
            </div>
            <button class="partner-btn">搭一搭</button>
          </div>`;
  }).join('');

  return {
    text: `为蟹柳匹配 ${matchInfo} ✨`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">🤝 为你匹配的搭子 · ${game.name}${hero ? ' · ' + hero.name : ''}</div>
        <div class="partner-list">
          ${partnerCards}
        </div>
      </div>`
  };
};

// ── 资讯响应 ───────────────────────────────────────
window.buildNewsResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = detectGame(text) || DEFAULT_GAME;
  const newsData = window.MOCK_NEWS_DATA || {};
  const items = newsData[game.id] || newsData.wzry;
  return {
    text: `${game.name}最近的 <strong>版本更新内容</strong> 📰`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">📰 ${game.name} · 近期资讯</div>
        <div class="news-list">
          ${items.map(n=>`
          <div class="news-item">
            <div class="news-img">${n.icon}</div>
            <div class="news-info"><div class="news-title">${n.title}</div><div class="news-meta">${n.meta}</div></div>
          </div>`).join('')}
        </div>
      </div>`
  };
};

// ── 攻略响应 ───────────────────────────────────────
window.buildGuideResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = detectGame(text) || DEFAULT_GAME;
  const guideData = window.MOCK_GUIDE_DATA || {};
  const gd = guideData[game.id] || guideData.wzry || {};
  // 动态判断英雄名称（依赖用户输入 text，无法静态化）
  const heroNameMap = {
    wzry: () => text.includes('朵莉亚') ? '朵莉亚' : text.includes('亚瑟') ? '亚瑟' : text.includes('嫦娥') ? '嫦娥' : '该英雄',
    hpjy: () => text.includes('M416') ? 'M416' : text.includes('AWM') ? 'AWM' : text.includes('冲锋') ? '冲锋打法' : '生存技巧',
    sjz:  () => text.includes('突击') ? '突击兵' : text.includes('狙击') ? '狙击手' : text.includes('重装') ? '重装兵' : '战术指南',
    lol:  () => text.includes('亚索') ? '亚索' : text.includes('阿狸') ? '阿狸' : text.includes('赵信') ? '赵信' : '该英雄',
    ys:   () => text.includes('胡桃') ? '胡桃' : text.includes('甘雨') ? '甘雨' : text.includes('雷') ? '雷电将军' : '角色培养',
  };
  const heroName = (heroNameMap[game.id] || heroNameMap.wzry)();
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
      </div>`
  };
};

// ── 高光视频响应 ───────────────────────────────────
window.buildHighlightResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = detectGame(text) || DEFAULT_GAME;
  const highlightData = window.MOCK_HIGHLIGHT_DATA || {};
  const items = highlightData[game.id] || highlightData.wzry;
  return {
    text: `正在为蟹柳生成 <strong>${game.name}昨日高光视频</strong>，提取到${items.length}个精彩时刻 🎬`,
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">🎬 蟹柳的高光时刻 · ${game.name}</div>
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
          <button style="width:100%;padding:10px;background:linear-gradient(135deg,#1a6bff,#4a90ff);color:white;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:2px">✨ 一键生成合集视频</button>
        </div>
      </div>`
  };
};

// ── 下载响应 ───────────────────────────────────────
window.buildDownloadResponse = function(text) {
  const downloadData = window.MOCK_DOWNLOAD_DATA || {};
  const game = text.includes('三国志') ? downloadData['三国志'] : text.includes('和平') ? downloadData['和平'] : downloadData['_default']
    || {name:'游戏',icon:'🎮',bg:'linear-gradient(135deg,#1a2040,#2a3060)',size:'1.2GB',score:'8.9'};
  return {
    text: `已找到 <strong>${game.name}</strong> 的下载入口 ⬇️`,
    cardHtml: `
      <div class="result-card">
        <div class="download-card">
          <div class="dl-icon" style="background:${game.bg}">${game.icon}</div>
          <div class="dl-info">
            <div class="dl-name">${game.name}</div>
            <div class="dl-meta">⭐ ${game.score} · 大小 ${game.size} · 适合当前设备</div>
          </div>
          <button class="dl-btn">立即下载</button>
        </div>
        <div style="padding:0 14px 12px;display:flex;gap:8px">
          <div style="flex:1;background:#f5f8ff;border-radius:9px;padding:9px;text-align:center">
            <div style="font-size:11px;color:#888">已预约</div>
            <div style="font-size:16px;font-weight:900;color:#1a6bff">12,830</div>
          </div>
          <div style="flex:1;background:#f5f8ff;border-radius:9px;padding:9px;text-align:center">
            <div style="font-size:11px;color:#888">好评率</div>
            <div style="font-size:16px;font-weight:900;color:#22c55e">96%</div>
          </div>
          <div style="flex:1;background:#f5f8ff;border-radius:9px;padding:9px;text-align:center">
            <div style="font-size:11px;color:#888">大小</div>
            <div style="font-size:16px;font-weight:900;color:#1a1a2e">${game.size}</div>
          </div>
        </div>
      </div>`
  };
};

// ── 皮肤响应 ───────────────────────────────────────
window.buildSkinResponse = function(text) {
  return {
    text: '最近上架的 <strong>热门皮肤</strong> 来了，限时特惠别错过 🛍️',
    cardHtml: `
      <div class="result-card">
        <div class="result-card-header">🛍️ 鹅毛市集 · 热卖皮肤</div>
        <div class="skin-scroll">
          ${(window.MOCK_SKIN_DATA || []).map(s=>`
            <div class="skin-card">
              <div class="skin-img" style="background:${s.bg}">${s.icon}</div>
              <div class="skin-info">
                <div class="skin-name">${s.name}</div>
                <div class="skin-price">${s.price}</div>
                <span class="skin-tag">${s.tag}</span>
              </div>
            </div>`).join('')}
        </div>
      </div>`
  };
};

// ── 情绪安抚响应 ───────────────────────────────────
window.buildEmotionResponse = function(text) {
  return {
    text: '蟹柳，连跪确实太难受了 😮‍💨<br>我来帮你找个出口，选一个：',
    cardHtml: `
      <div class="result-card">
        <div class="emotion-card">
          <div class="emotion-header">
            <div class="emotion-icon">😮‍💨</div>
            <div><div class="emotion-text">心态稳住，都是青铜的路</div><div class="emotion-sub">想怎么调整一下？</div></div>
          </div>
          <div class="emotion-actions">
            <div class="emotion-btn" onclick="emotionAction('partner')"><div class="emotion-btn-icon">🤝</div><div class="emotion-btn-text">找个搭子</div></div>
            <div class="emotion-btn" onclick="emotionAction('replay')"><div class="emotion-btn-icon">🔍</div><div class="emotion-btn-text">看看复盘</div></div>
            <div class="emotion-btn"><div class="emotion-btn-icon">😌</div><div class="emotion-btn-text">休息一下</div></div>
            <div class="emotion-btn" onclick="emotionAction('guide')"><div class="emotion-btn-icon">📖</div><div class="emotion-btn-text">看看攻略</div></div>
          </div>
        </div>
      </div>`
  };
};

// ── 提醒响应 ───────────────────────────────────────
window.buildReminderResponse = function(text) {
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = detectGame(text) || DEFAULT_GAME;
  const timeMatch = text.match(/(\d+)点/);
  const timeStr = timeMatch ? `今天 ${timeMatch[1]}:00` : '设定时间';
  const modeMap = window.MOCK_MODE_MAP || { wzry:'排位', hpjy:'经典模式', sjz:'据点争夺', lol:'排位', ys:'每日委托' };
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
          <div class="reminder-time">📅 ${timeStr} &nbsp;·&nbsp; ${game.icon} ${game.name} · ${mode}</div>
          <button class="reminder-confirm" onclick="this.textContent='✅ 已确认'">确认提醒</button>
        </div>
      </div>`
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
            <div class="wi-info"><div class="wi-game">${i.game}</div><div class="wi-name">${i.name}</div><div class="wi-deadline">⏰ ${i.dl}</div></div>
            <button class="wi-action">立即领</button>
          </div>`).join('')}
      </div>
    </div>`;
};
