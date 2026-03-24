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
      // 移除整个消息气泡容器（.msg.ai），避免残留空文字气泡
      const msgContainer = genEl.closest('.msg.ai');
      if (msgContainer) msgContainer.remove();
    }

    const d = templates.direct;
    const dCoverHtml = d.cover && d.cover.startsWith('data/')
      ? `<img src="${d.cover}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`
      : (d.cover || '');
    addAIBubble(
      `<strong>高光视频已生成！</strong>🎉 有大神带飞真的很爽`,
      null, null,
      `<div class="result-card">
        <div class="video-card">
          <div class="video-card-hero" onclick="playVideo(this)" data-video-src="${d.videoSrc || ''}">
            <div class="video-card-hero-img" style="background:${game.gradient}">${dCoverHtml}</div>
            <video class="video-card-player" preload="metadata" playsinline webkit-playsinline loop
              ${d.videoSrc ? 'src="' + d.videoSrc + '"' : ''}></video>
            <div class="play-btn-overlay"></div>
            <div class="video-card-hero-tag">${d.tag}</div>
            <div class="video-card-hero-duration">${d.duration}</div>
          </div>
          <div class="video-card-info">
            <div class="video-card-title">${d.title} · ${hero}</div>
            <div class="video-card-desc">${d.desc}</div>
          </div>
          <div class="replay-btn-row" style="padding:0 14px 12px">
            <button class="replay-btn primary" onclick="handleShowOndemandVideos('${gameId}','${hero}')">更多模板</button>
          </div>
        </div>
      </div>`
    );

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
      ${items.map((item, i) => {
        const coverHtml = item.cover && item.cover.startsWith('data/')
          ? `<img src="${item.cover}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`
          : (item.cover || '');
        return `
        <div class="video-ondemand-item" data-video-src="${item.videoSrc || ''}" onclick="ondemandPlay(this, '${item.title}')">
          <div class="video-ondemand-thumb">
            <div class="video-ondemand-thumb-img" style="background:${game.gradient}">${coverHtml}</div>
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
      `}).join('')}
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

// ── 播放视频（真实视频播放/暂停） ────────────────────
window.playVideo = function(el) {
  const video = el.querySelector('.video-card-player');
  const overlay = el.querySelector('.play-btn-overlay');
  const coverImg = el.querySelector('.video-card-hero-img');
  const tagEl = el.querySelector('.video-card-hero-tag');
  const durationEl = el.querySelector('.video-card-hero-duration');

  if (!video || !video.src) {
    // 没有视频源，走旧逻辑模拟播放
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
    return;
  }

  // 有视频源 → 真实播放/暂停切换
  if (video.paused) {
    // 开始播放
    if (coverImg) coverImg.style.opacity = '0';
    if (tagEl) tagEl.style.opacity = '0';
    if (durationEl) durationEl.style.opacity = '0';
    video.style.opacity = '1';
    video.play();
    // 播放按钮变成暂停图标
    if (overlay) {
      overlay.classList.add('is-playing');
      overlay.style.opacity = '0';
    }
    // 显示正在播放 badge
    const info = el.closest('.video-card')?.querySelector('.video-card-info');
    if (info && !info.querySelector('.video-playing-badge')) {
      const badge = document.createElement('div');
      badge.className = 'video-playing-badge';
      badge.style.cssText = 'display:inline-flex;align-items:center;gap:4px;background:#eef3ff;color:#1a6bff;font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;margin-top:6px';
      badge.innerHTML = '🔊 正在播放';
      info.appendChild(badge);
    }
  } else {
    // 暂停播放
    video.pause();
    if (overlay) {
      overlay.classList.remove('is-playing');
      overlay.style.opacity = '1';
    }
    // 移除播放 badge
    const badge = el.closest('.video-card')?.querySelector('.video-playing-badge');
    if (badge) badge.remove();
  }
};

// ── 点播播放（真实视频） ─────────────────────────────
window.ondemandPlay = function(el, title) {
  const btn = el.querySelector('.video-ondemand-btn');
  const videoSrc = el.getAttribute('data-video-src');

  if (btn) {
    // 如果已经在播放态，点击切换暂停/播放
    if (btn.classList.contains('play-now')) {
      const existingVideo = el.querySelector('.ondemand-inline-video');
      if (existingVideo) {
        if (existingVideo.paused) {
          existingVideo.play();
          btn.textContent = '⏸ 暂停';
        } else {
          existingVideo.pause();
          btn.textContent = '▶ 播放';
        }
      }
      return;
    }

    btn.textContent = '生成中…';
    btn.style.background = '#f0f3ff';
    btn.style.color = '#1a6bff';
    btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.textContent = '▶ 播放';
      btn.className = 'video-ondemand-btn play-now';
      btn.style.pointerEvents = 'auto';

      // 在缩略图区域嵌入真实视频
      if (videoSrc) {
        const thumb = el.querySelector('.video-ondemand-thumb');
        if (thumb) {
          const video = document.createElement('video');
          video.className = 'ondemand-inline-video';
          video.src = videoSrc;
          video.preload = 'metadata';
          video.playsInline = true;
          video.loop = true;
          video.muted = true; // 先静音自动播放
          thumb.appendChild(video);
          video.play();
          // 隐藏 emoji 封面和播放按钮
          const thumbImg = thumb.querySelector('.video-ondemand-thumb-img');
          const playMini = thumb.querySelector('.play-mini');
          if (thumbImg) thumbImg.style.opacity = '0';
          if (playMini) playMini.style.opacity = '0';
          btn.textContent = '⏸ 暂停';
        }
      }

      showTyping(() => {
        addAIBubble(
          `<strong>${title}</strong> 已生成完毕 ✅ 点击即可播放～`,
          null, null, null,
          ['🎬 生成更多'],
          {
            '🎬 生成更多': () => ({ text: '还想要什么风格的视频？告诉我就好 🎬', cardHtml: null }),
          }
        );
      });
    }, 2500);
  }
};

// ── 分享视频（已停用，保留函数签名避免其他地方调用报错） ──
window.shareVideo = function() {};

// ── 详细复盘（toast 提示跳转） ──────────────────────
window.handleViewDetailData = function(gameId, hero, timeLabel) {
  showToast('正在跳转详细复盘...');
};

// ── 情绪卡片回调 ───────────────────────────────────
window.emotionAction = function(type) {
  if (type === 'rest') {
    showTyping(() => {
      addAIBubble(
        '好的蟹柳，休息一下也很重要 ☕<br>我帮你设个 <strong>30分钟后的提醒</strong>，到时候再回来冲分！',
        null, null, null,
        ['好的，30分钟后提醒我', '算了，继续打'],
        {
          '好的，30分钟后提醒我': () => ({ text: '⏰ 提醒已设好！30分钟后叫你回来～去喝杯水放松一下吧 😌', cardHtml: null }),
          '算了，继续打': () => ({ text: '好的，那换个英雄换个心情试试？💪 要不要看看攻略换个打法？', cardHtml: null }),
        }
      );
    });
    return;
  }
  const textMap = window.MOCK_EMOTION_TEXT_MAP || {};
  const text = textMap[type] || type;
  processUserMessage(text);
};
