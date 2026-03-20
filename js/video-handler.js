// ============================================================
// VIDEO HANDLER — 视频生成/播放/分享交互
// 修改说明：直接编辑此文件即可调整视频交互逻辑，刷新页面生效
// ============================================================

// 视频模板数据库（从 data/video-templates.js 加载）
window.VIDEO_TEMPLATES = window.DATA_VIDEO_TEMPLATES || {};

// ── 生成高光视频 ───────────────────────────────────
window.handleGenerateHighlightVideo = function(gameId, hero, result) {
  const GAMES = window.ENGINE_GAMES;
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = GAMES[gameId] || DEFAULT_GAME;
  const templates = window.VIDEO_TEMPLATES[gameId] || window.VIDEO_TEMPLATES.wzry;

  // Step 1: 先推送"正在生成"消息 + 进度动画
  addAIBubble(
    `正在为蟹柳生成 <strong>${game.name} · ${hero}</strong> 的高光视频 🎬<br>AI正在分析精彩片段…`,
    null, null,
    `<div class="result-card">
      <div class="video-generating" id="videoGenProgress">
        <div class="video-gen-anim">
          <div class="video-gen-bar"></div>
          <div class="video-gen-bar"></div>
          <div class="video-gen-bar"></div>
          <div class="video-gen-bar"></div>
          <div class="video-gen-bar"></div>
        </div>
        <div class="video-gen-text">🎬 AI智能剪辑中…正在提取精彩瞬间</div>
        <div class="video-gen-progress"><div class="video-gen-progress-fill"></div></div>
      </div>
    </div>`
  );

  // Step 2: 3秒后替换为"直接播放态"视频卡片
  setTimeout(() => {
    const genEl = document.getElementById('videoGenProgress');
    if (genEl) {
      const card = genEl.closest('.result-card');
      if (card) card.remove();
    }

    const d = templates.direct;
    addAIBubble(
      `<strong>高光视频已生成！</strong>🎉 有大神带飞真的很爽`,
      null, null,
      `<div class="result-card">
        <div class="video-card">
          <div class="video-card-hero" onclick="playVideo(this)">
            <div class="video-card-hero-img" style="background:${game.gradient}">${d.cover}</div>
            <div class="play-btn-overlay"></div>
            <div class="video-card-hero-tag">${d.tag}</div>
            <div class="video-card-hero-duration">${d.duration}</div>
          </div>
          <div class="video-card-info">
            <div class="video-card-title">${d.title} · ${hero}</div>
            <div class="video-card-desc">${d.desc}</div>
          </div>
          <div class="video-card-action-row">
            <button class="video-card-action-btn primary" onclick="shareVideo()">📤 去炫耀</button>
            <button class="video-card-action-btn secondary" onclick="handleShowOndemandVideos('${gameId}','${hero}')">🎬 更多模板</button>
          </div>
        </div>
      </div>`
    );

    // Step 3: 0.8秒后推送点播态视频列表
    setTimeout(() => {
      showTyping(() => {
        const items = templates.ondemand;
        addAIBubble(
          `点播你和好友开黑的<strong>高光视频</strong>，还有更多风格可选 👇`,
          null, null,
          buildOndemandCardHtml(gameId, hero, items)
        );
      });
    }, 800);

  }, 3000);
};

// ── 构建点播视频列表 HTML ──────────────────────────
window.buildOndemandCardHtml = function(gameId, hero, items) {
  const GAMES = window.ENGINE_GAMES;
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = GAMES[gameId] || DEFAULT_GAME;
  return `<div class="result-card">
    <div class="result-card-header">🎬 点播更多高光视频 · ${game.name}</div>
    <div class="video-ondemand-list">
      ${items.map((item, i) => `
        <div class="video-ondemand-item" onclick="ondemandPlay(this, '${item.title}')">
          <div class="video-ondemand-thumb">
            <div class="video-ondemand-thumb-img" style="background:${game.gradient}">${item.cover}</div>
            <div class="play-mini"></div>
            ${item.tag ? `<div class="video-ondemand-thumb-tag">${item.tag}</div>` : ''}
            <div class="video-ondemand-thumb-duration">${item.duration}</div>
          </div>
          <div class="video-ondemand-info">
            <div class="video-ondemand-title">${item.title}</div>
            <div class="video-ondemand-meta">${item.desc}</div>
          </div>
          <button class="video-ondemand-btn" onclick="event.stopPropagation();ondemandPlay(this.closest('.video-ondemand-item'), '${item.title}')">点播</button>
        </div>
      `).join('')}
    </div>
  </div>`;
};

// ── 展示更多视频模板 ───────────────────────────────
window.handleShowOndemandVideos = function(gameId, hero) {
  const templates = window.VIDEO_TEMPLATES[gameId] || window.VIDEO_TEMPLATES.wzry;
  const items = templates.ondemand;
  showTyping(() => {
    addAIBubble(
      `为蟹柳推荐更多<strong>视频风格模板</strong>，点播即可生成 🎬`,
      null, null,
      buildOndemandCardHtml(gameId, hero, items)
    );
  });
};

// ── 播放视频 ───────────────────────────────────────
window.playVideo = function(el) {
  const overlay = el.querySelector('.play-btn-overlay');
  if (overlay) {
    overlay.style.background = 'rgba(26,107,255,.8)';
    overlay.style.width = '40px';
    overlay.style.height = '40px';
    overlay.innerHTML = '<div style="width:10px;height:12px;border-left:3px solid white;border-right:3px solid white"></div>';
    setTimeout(() => {
      overlay.innerHTML = '';
      overlay.style.width = '56px';
      overlay.style.height = '56px';
      overlay.style.background = 'rgba(0,0,0,.5)';
    }, 2000);
  }
  const info = el.closest('.video-card')?.querySelector('.video-card-info');
  if (info && !info.querySelector('.video-playing-badge')) {
    const badge = document.createElement('div');
    badge.className = 'video-playing-badge';
    badge.style.cssText = 'display:inline-flex;align-items:center;gap:4px;background:#eef3ff;color:#1a6bff;font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;margin-top:6px';
    badge.innerHTML = '🔊 正在播放';
    info.appendChild(badge);
    setTimeout(() => badge.remove(), 3000);
  }
};

// ── 点播播放 ───────────────────────────────────────
window.ondemandPlay = function(el, title) {
  const btn = el.querySelector('.video-ondemand-btn');
  if (btn) {
    btn.textContent = '生成中…';
    btn.style.background = '#f0f3ff';
    btn.style.color = '#1a6bff';
    btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.textContent = '▶ 播放';
      btn.className = 'video-ondemand-btn play-now';
      btn.style.pointerEvents = 'auto';
      showTyping(() => {
        addAIBubble(
          `<strong>${title}</strong> 已生成完毕 ✅ 点击即可播放，也可以分享到动态～`,
          null, null, null,
          ['📤 分享到动态', '🎬 生成更多'],
          {
            '📤 分享到动态': () => ({ text: '正在打开分享页面，选择你想分享的好友或动态 📤', cardHtml: null }),
            '🎬 生成更多': () => ({ text: '还想要什么风格的视频？告诉我就好 🎬', cardHtml: null }),
          }
        );
      });
    }, 2500);
  }
};

// ── 分享视频 ───────────────────────────────────────
window.shareVideo = function() {
  showTyping(() => {
    addAIBubble(
      '正在打开分享页面 📤 你可以分享到<strong>QQ动态、好友聊天</strong>或保存到手机相册～',
      null, null, null,
      ['分享到QQ动态', '保存到相册'],
      {
        '分享到QQ动态': () => ({ text: '已为你打开QQ动态分享页面 ✅ 选个好友圈一起看！', cardHtml: null }),
        '保存到相册': () => ({ text: '视频已保存到手机相册 📱 随时可以回看！', cardHtml: null }),
      }
    );
  });
};

// ── 详细数据 ───────────────────────────────────────
window.handleViewDetailData = function(gameId, hero, timeLabel) {
  const GAMES = window.ENGINE_GAMES;
  const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
  const game = GAMES[gameId] || DEFAULT_GAME;
  showTyping(() => {
    const detailData = genDetailData(gameId, hero);
    addAIBubble(
      `这是蟹柳 <strong>${hero}</strong> 在${game.name}的<strong>详细数据</strong> 📊`,
      null, null,
      `<div class="result-card">
        <div class="result-card-header">📊 详细数据 · ${game.name} · ${hero}</div>
        <div style="padding:12px">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px">
            ${detailData.stats.map(s => `
              <div class="stat-item">
                <div class="stat-val" style="color:${s.color}">${s.val}</div>
                <div class="stat-label">${s.label}</div>
              </div>`).join('')}
          </div>
          <div style="background:#f5f8ff;border:1px solid #d0dfff;border-radius:9px;padding:10px;font-size:12px;color:#1a6bff;line-height:1.6;margin-bottom:10px">
            <span style="font-weight:700">📈 趋势分析：</span>${detailData.trend}
          </div>
          <div style="display:flex;gap:6px">
            <button style="flex:1;padding:8px;background:linear-gradient(135deg,#1a6bff,#4a90ff);color:white;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit" onclick="handleGenerateHighlightVideo('${gameId}','${hero}','')">🎬 生成高光视频</button>
            <button style="flex:1;padding:8px;background:#eef3ff;color:#1a6bff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">📋 完整对局记录</button>
          </div>
        </div>
      </div>`
    );
  });
};

// ── 情绪卡片回调 ───────────────────────────────────
window.emotionAction = function(type) {
  const textMap = window.MOCK_EMOTION_TEXT_MAP || {};
  const text = textMap[type] || type;
  processUserMessage(text);
};
