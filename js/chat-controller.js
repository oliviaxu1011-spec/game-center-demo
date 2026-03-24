// ============================================================
// CHAT CONTROLLER — 聊天主流程 + UI 渲染 + 面板控制 + 移动端适配
// 修改说明：直接编辑此文件即可调整聊天交互逻辑，刷新页面生效
// ============================================================

// ── 快捷引用 ───────────────────────────────────────
const INTENTS      = window.ENGINE_INTENTS;
const GAMES        = window.ENGINE_GAMES;
const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
const MAX_HISTORY  = window.MAX_HISTORY;

// ── Toast 提示组件 ──────────────────────────────────
window.showToast = function(msg, duration) {
  duration = duration || 2000;
  const existing = document.getElementById('globalToast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'globalToast';

  // 判断 AI Panel 是否打开，决定挂载容器
  const aiPanel = document.getElementById('aiPanel');
  const inPanel = aiPanel && !aiPanel.classList.contains('hidden');

  if (inPanel) {
    // AI Panel 内：absolute 定位，相对于 aiPanel 居中
    el.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.75);color:white;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;z-index:9999;text-align:center;max-width:280px;backdrop-filter:blur(8px);animation:msg-in .25s ease;pointer-events:none';
    el.textContent = msg;
    aiPanel.appendChild(el);
  } else {
    // 非 AI Panel：fixed 定位，相对于视口居中
    el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.75);color:white;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;z-index:9999;text-align:center;max-width:280px;backdrop-filter:blur(8px);animation:msg-in .25s ease;pointer-events:none';
    el.textContent = msg;
    document.body.appendChild(el);
  }

  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, duration);
};

// ── 状态变量 ───────────────────────────────────────
let panelOpen  = false;
let chatInited = false;

// Tab 页签切换
window.switchTab = function(el) {
  document.querySelectorAll('#screen-app .tab-item').forEach(btn => btn.classList.remove('active'));
  el.classList.add('active');
  showToast('已切换到「' + el.textContent.trim() + '」');
};

// 底部 TabBar 切换
window.switchBottomTab = function(el, name) {
  document.querySelectorAll('.bottom-nav-design .bottom-nav-item').forEach(item => item.classList.remove('active'));
  el.classList.add('active');
  if (name === '游戏') return; // 当前页，不提示
  showToast('正在前往「' + name + '」频道…');
};

// ============================================================
// 设置面板
// ============================================================
window.toggleSettingsPanel = function() {
  const panel = document.getElementById('settingsPanel');
  panel.classList.toggle('hidden');
};

window.saveApiKey = function() {
  const val = document.getElementById('apiKeyInput').value.trim();
  window.DEEPSEEK_CONFIG.apiKey = val;
  const status = document.getElementById('apiKeyStatus');
  if (val) {
    status.textContent = '✅ 已启用混合模式（本地引擎 + DeepSeek 增强）';
    status.style.color = '#8b5cf6';
  } else {
    status.textContent = '⚙️ 未填写，使用本地关键词引擎';
    status.style.color = '#888';
  }
  document.getElementById('settingsPanel').classList.add('hidden');
  updateModeLabel();
};

window.updateModeLabel = function() {
  const label = document.getElementById('modeLabel');
  if (label) {
    label.textContent = window.DEEPSEEK_CONFIG.enabled() ? '混合模式' : '本地引擎';
    label.style.background = window.DEEPSEEK_CONFIG.enabled()
      ? 'linear-gradient(90deg,#8b5cf6,#6366f1)'
      : 'linear-gradient(135deg,#1a6bff,#4a90ff)';
  }
};

// 页面加载时：同步 Key 状态到 UI（支持 URL 参数 和 配置文件预设）
(function initKeyState() {
  if (window.DEEPSEEK_CONFIG.enabled()) {
    const key = window.DEEPSEEK_CONFIG.apiKey;
    // 把 Key 填入输入框（显示为掩码形式，但实际值是完整 Key）
    const input = document.getElementById('apiKeyInput');
    if (input) input.value = key;
    // 更新状态文字
    const status = document.getElementById('apiKeyStatus');
    if (status) {
      const source = _urlKey ? 'URL参数' : '配置文件预设';
      status.textContent = `✅ 已启用混合模式（${source}）`;
      status.style.color = '#8b5cf6';
    }
    // 更新顶部模式标签
    updateModeLabel();
  }
})();

// ============================================================
// 页面导航 / 面板控制
// ============================================================
window.startDemo = function() {
  document.getElementById('screen-landing').classList.remove('active');
  document.getElementById('screen-app').classList.add('active');
  // 极短延迟后拉起 AI 面板，避免看到背后页面闪现
  setTimeout(openAIPanel, 50);
};

window.goToLanding = function() {
  closeAIPanel();
  document.getElementById('screen-app').classList.remove('active');
  document.getElementById('screen-landing').classList.add('active');
  chatInited = false;
  document.getElementById('chatArea').innerHTML = '';
};

window.openAIPanel = function() {
  const panel = document.getElementById('aiPanel');
  panel.classList.remove('hidden');
  // 添加从底部拉起的动画
  panel.classList.add('slide-up');
  // 动画结束后移除动画类，避免影响后续 transition
  panel.addEventListener('animationend', function handler() {
    panel.classList.remove('slide-up');
    panel.removeEventListener('animationend', handler);
  });
  document.getElementById('overlay').classList.add('active');
  panelOpen = true;
  if (!chatInited) { initChat(); chatInited = true; }
};

window.closeAIPanel = function() {
  document.getElementById('aiPanel').classList.add('hidden');
  document.getElementById('overlay').classList.remove('active');
  panelOpen = false;
};

window.initChat = function() {
  // 先渲染欢迎语（不带追问参数）
  addAIBubble(
    '嗨蟹柳！🎮 我是游戏中心 AI。<br>你可以直接问我任何游戏问题——<br>领福利、查战绩、找搭子、复盘…<br>问我 <strong>游戏版本/资讯</strong> 还能联网搜索哦 🌐',
    null, null, null
  );

  // ── 欢迎引导追问池（口语化，覆盖核心功能）──────────────
  var welcomeQRPool = [
    '今天有什么福利可以领',
    '看看我最近的战绩',
    '帮我找个搭子开黑',
    '复盘一下上一把',
    '最近有什么游戏资讯',
    '看看有什么好攻略',
    '帮我设个游戏提醒',
    '看看本周战绩报告',
    '逛逛鹅毛市集',
    '看看好友排行榜',
  ];

  // Fisher-Yates 随机打乱并取前 3 个
  var shuffled = welcomeQRPool.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
  }
  var welcomeQR = shuffled.slice(0, 3);

  // 在欢迎气泡最后一个 msg 元素后追加引导追问按钮
  var area = document.getElementById('chatArea');
  var lastMsg = area.querySelector('.msg:last-child .msg-content');
  if (lastMsg) {
    var qrDiv = document.createElement('div');
    qrDiv.className = 'quick-replies';
    welcomeQR.forEach(function(text) {
      var btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.innerHTML = '<span class="qr-btn-text">' + text + '</span>' +
        '<svg class="qr-btn-arrow" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      btn.addEventListener('click', function() {
        // 点击后隐藏追问区域
        qrDiv.style.transition = 'opacity .2s, max-height .3s';
        qrDiv.style.opacity = '0';
        qrDiv.style.maxHeight = '0';
        qrDiv.style.overflow = 'hidden';
        setTimeout(function() { qrDiv.style.display = 'none'; }, 300);
        // 作为用户输入发送，走正常消息流程
        processUserMessage(text);
      });
      qrDiv.appendChild(btn);
    });
    lastMsg.appendChild(qrDiv);
  }
};

window.fillInput = function(text) {
  const input = document.getElementById('chatInput');
  input.value = text;
  input.focus();
};

// ============================================================
// 追问模块清理：新对话触发时隐藏所有历史追问按钮
// ============================================================
function _hideAllPreviousQuickReplies() {
  const area = document.getElementById('chatArea');
  if (!area) return;
  area.querySelectorAll('.quick-replies').forEach(qrContainer => {
    // 跳过已经隐藏的
    if (qrContainer.style.display === 'none') return;
    qrContainer.style.transition = 'opacity .2s, max-height .3s';
    qrContainer.style.opacity = '0';
    qrContainer.style.maxHeight = '0';
    qrContainer.style.overflow = 'hidden';
    setTimeout(() => { qrContainer.style.display = 'none'; }, 300);
  });
}

// ============================================================
// 消息发送
// ============================================================
window.sendMessage = function() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  const sendBtn = document.querySelector('.send-btn');
  if (sendBtn) { sendBtn.disabled = true; setTimeout(() => sendBtn.disabled = false, 1500); }
  processUserMessage(text);
};

// ============================================================
// 核心消息处理流程
// 策略：无 API Key → 纯本地引擎
//       有 API Key → 混合模式（本地先行 + DeepSeek 增强）
// ============================================================
window.processUserMessage = async function(text) {
  // ── 新对话开始：隐藏所有历史消息的追问模块 ──
  _hideAllPreviousQuickReplies();

  addUserBubble(text);
  addToHistory('user', text);

  // ── 预搜索：检测到资讯类输入时，在意图识别的同时提前开始联网搜索 ──
  if (window.preSearchIfNeeded) window.preSearchIfNeeded(text);

  const isHybrid = window.DEEPSEEK_CONFIG.enabled();

  // ── Step A: 上下文延续（短确认词 → 复用上一轮意图，两种模式共用）──
  const shortConfirms = /^(好|行|嗯|ok|可以|来|对|是|要|冲|走|开|试试|好的|行吧|来吧|可以啊|走起|冲冲|开搞|好呀|试试看|整|搞|go|yes|嗯嗯|对对|好好)$/i;
  if (shortConfirms.test(text.trim())) {
    const lastIntent = getLastIntent();
    if (lastIntent) {
      const intentObj = INTENTS.find(i => i.id === lastIntent);
      if (intentObj) {
        showTyping(() => {
          const response = buildResponse(lastIntent, text);
          if (response) {
            addAIBubble(
              response.text, intentObj.label, 82,
              response.cardHtml || (response.card ? getPrebuiltCard(response.card) : null),
              response.quickReplies, response.onQR, response._displayMap
            );
            const h = { role: 'assistant', content: response.text }; h._intentId = lastIntent;
            // 标记游戏上下文（短确认词场景从上下文获取）
            const _gCtx = window.detectGame(text) || window.getLastMentionedGame();
            if (_gCtx) h._gameId = _gCtx.id;
            window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
          }
        });
        return;
      }
    }
  }

  // ── Step B: 本地引擎先行识别（0ms，两种模式都先跑）──
  const localResult = detectIntent(text);

  // ── Step C: 判断是否需要 DeepSeek 增强 ──
  // 本地 strong（score≥4）→ 直接用本地结果，不调 API
  // 本地 medium/weak/null/ambiguous → 有 key 则调 DeepSeek 增强
  const localIsStrong = localResult && localResult.level === 'strong' && !localResult.ambiguous;

  if (localIsStrong || !isHybrid) {
    // ── 纯本地路径（本地 strong 或 无 API Key）──
    handleLocalResult(text, localResult);
    return;
  }

  // ── Step D: 混合模式 — 本地不够确信，调 DeepSeek 增强 ──
  const analyzingId = addAnalyzing('🤖 DeepSeek 增强分析中…');

  let dsResult = null;
  dsResult = await callDeepSeek(text);

  removeEl(analyzingId);

  // DeepSeek 成功 → 用 AI 结果
  if (dsResult) {
    handleDeepSeekResult(text, dsResult);
    return;
  }

  // DeepSeek 失败 → 降级回本地结果
  console.warn('[混合模式] DeepSeek 失败，降级到本地结果');
  handleLocalResult(text, localResult);
};

// ============================================================
// DeepSeek 结果处理
// ============================================================
window.handleDeepSeekResult = function(text, dsResult) {
  const { intentId, intentLabel, confidence, replyText, needFollowUp, followUpQuestion } = dsResult;
  // 清洗 quickReplies 中可能的 emoji 前缀（如 "⚔️ 王者荣耀" → "王者荣耀"）
  const rawQR = dsResult.quickReplies || [];
  const quickReplies = rawQR.map(s => s.replace(/^[\p{Emoji_Presentation}\p{Emoji}\u200d\ufe0f]+\s*/u, ''));

  const histEntry = { role: 'assistant', content: replyText || '' };
  histEntry._intentId = intentId;
  // 标记本轮提到的游戏，供后续上下文回溯
  const _gDs = window.detectGame(text);
  if (_gDs) histEntry._gameId = _gDs.id;
  window.chatHistory.push(histEntry);
  if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();

  showTyping(() => {
    if (needFollowUp) {
      const qrOptions = quickReplies || [];
      const callbacks = {};
      qrOptions.forEach(opt => {
        callbacks[opt] = () => {
          const resp = buildResponse(intentId, text + ' ' + opt);
          return resp || { text: opt + '，好的，我来帮你处理！', cardHtml: null };
        };
      });
      addAIBubble(replyText, intentLabel, confidence, null, qrOptions, callbacks);
    } else {
      const response = buildResponse(intentId, text);
      addAIBubble(
        replyText || response?.text || '',
        intentLabel,
        confidence,
        response?.cardHtml || (response?.card ? getPrebuiltCard(response.card) : null),
        response?.quickReplies,
        response?.onQR,
        response?._displayMap
      );
    }
  });
};

// ============================================================
// 本地引擎结果处理
// ============================================================
window.handleLocalResult = function(text, result) {
  // ── 弱置信度 → 猜测确认 ──
  if (result && result.level === 'weak') {
    const guessLabel = result.label;
    const guessQR = [guessLabel.replace(/^.\s*/, ''), '不是，随便看看'];
    showTyping(() => {
      addAIBubble(
        `我猜你可能想问 <strong>${guessLabel}</strong>？还是说点别的 😊`,
        '🤔 确认意图',
        result.confidence,
        null,
        guessQR,
        {
          [guessQR[0]]: () => {
            const response = buildResponse(result.id, text);
            return response || { text: '好的～', cardHtml: null };
          },
          [guessQR[1]]: () => {
            return {
              text: '没关系！你可以试试直接说出想做的事，比如 <strong>"查战绩"、"领礼包"、"找搭子"</strong> 都行 🎮',
              cardHtml: null,
              quickReplies: ['有什么礼包','查我的战绩','帮我找搭子'],
              onQR: {
                '有什么礼包': () => buildResponse('welfare', '有什么礼包') || { text: '好的，帮你查查～', cardHtml: null },
                '查我的战绩': () => buildResponse('record', '查我的战绩') || { text: '好的，帮你查查～', cardHtml: null },
                '帮我找搭子': () => buildResponse('partner', '帮我找搭子') || { text: '好的，帮你查查～', cardHtml: null },
              }
            };
          },
        }
      );
      const h = { role: 'assistant', content: `确认意图：${guessLabel}？` }; h._intentId = result.id;
      const _gW = window.detectGame(text);
      if (_gW) h._gameId = _gW.id;
      window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
    });
    return;
  }

  // ── 消歧义 → 二选一 ──
  if (result && result.ambiguous && result.secondIntent) {
    const opt1 = result.label;
    const opt2 = result.secondIntent.label;
    const qrOptions = [opt1.replace(/^.\s*/, ''), opt2.replace(/^.\s*/, '')];
    showTyping(() => {
      addAIBubble(
        `这个我有两个理解方向 🤔<br>你是想 <strong>${opt1}</strong>，还是 <strong>${opt2}</strong>？`,
        '🤔 消歧义',
        result.confidence,
        null,
        qrOptions,
        {
          [qrOptions[0]]: () => {
            const response = buildResponse(result.id, text);
            return response || { text: '好的～', cardHtml: null };
          },
          [qrOptions[1]]: () => {
            const response = buildResponse(result.secondIntent.id, text);
            return response || { text: '好的～', cardHtml: null };
          },
        }
      );
      const h = { role: 'assistant', content: `消歧义：${opt1} vs ${opt2}` }; h._intentId = result.id;
      const _gA = window.detectGame(text);
      if (_gA) h._gameId = _gA.id;
      window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
    });
    return;
  }

  // ── 无匹配 → pullback / fallback ──
  if (!result) {
    const pullbacks = window.DATA_PULLBACKS || [];
    let matched = null;
    const lower = text.toLowerCase();
    for (const pb of pullbacks) {
      if (pb.kw.some(k => lower.includes(k))) { matched = pb; break; }
    }

    if (matched) {
      showTyping(() => {
        addAIBubble(matched.reply, matched.label, 72, null, matched.qr,
          Object.fromEntries(matched.qr.map(q => [q, () => {
            const r = buildResponse(matched.intentId, q);
            return r || { text: q, cardHtml: null };
          }]))
        );
        const h = { role: 'assistant', content: matched.reply }; h._intentId = matched.intentId;
        const _gPb = window.detectGame(text);
        if (_gPb) h._gameId = _gPb.id;
        window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
      });
    } else {
      const fallbacks = window.DATA_FALLBACKS || [
        { reply:'要不要看看<strong>今日福利</strong>？🎁', intentId:'welfare', label:'🎁 福利/礼包', qr:['看今日福利','没兴趣'] }
      ];
      const fb = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      showTyping(() => {
        addAIBubble(fb.reply, fb.label, 65, null, fb.qr,
          Object.fromEntries(fb.qr.map(q => [q, () => {
            const r = buildResponse(fb.intentId, q);
            return r || { text: q, cardHtml: null };
          }]))
        );
        const h = { role: 'assistant', content: fb.reply }; h._intentId = fb.intentId;
        const _gFb = window.detectGame(text);
        if (_gFb) h._gameId = _gFb.id;
        window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
      });
    }
    return;
  }

  // ── 本地引擎成功识别（strong / medium）→ 直接出结果 ──
  const confPct = result.confidence;
  showTyping(() => {
    const response = buildResponse(result.id, text);
    if (response) {
      addAIBubble(
        response.text,
        result.label,
        confPct,
        response.cardHtml || (response.card ? getPrebuiltCard(response.card) : null),
        response.quickReplies,
        response.onQR,
        response._displayMap
      );
      const h = { role: 'assistant', content: response.text }; h._intentId = result.id;
      // 标记本轮提到的游戏，供后续上下文回溯
      const _g = window.detectGame(text);
      if (_g) h._gameId = _g.id;
      window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
    }
  });
};

// ============================================================
// UI 渲染函数
// ============================================================
window.addUserBubble = function(text) {
  const area = document.getElementById('chatArea');
  const el = document.createElement('div');
  el.className = 'msg user';
  const safe = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  el.innerHTML = `<div class="msg-avatar">👤</div><div class="msg-content"><div class="msg-bubble">${safe}</div></div>`;
  area.appendChild(el);
  scrollChat();
};

window.addAIBubble = function(text, intentLabel, confidence, cardHtml, quickReplies, qrCallbacks, displayMap) {
  const area = document.getElementById('chatArea');
  const el = document.createElement('div');
  el.className = 'msg ai';

  let inner = `<div class="msg-avatar ai-av">✨</div><div class="msg-content">`;

  // 文字 + 卡片合并到 ai-reply-card 中展示（避免 .msg-bubble display:none 隐藏文字）
  const hasText = text && text.trim();
  const hasCard = !!cardHtml;

  if (hasText || hasCard) {
    inner += `<div class="ai-reply-card">`;
    if (hasText) {
      inner += `<div class="ai-reply-text"><div class="ai-reply-desc">${text}</div></div>`;
    }
    if (hasCard) {
      inner += cardHtml;
    }
    inner += `</div>`;
  }

  const qrList = (quickReplies || []).slice(0, 3);
  if (qrList.length > 0) {
    inner += `<div class="quick-replies">`;
    qrList.forEach((r, i) => {
      inner += `<button class="qr-btn" data-qr="${i}"><span class="qr-btn-text">${r}</span><svg class="qr-btn-arrow" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
    });
    inner += `</div>`;
  }

  inner += `</div>`;
  el.innerHTML = inner;
  area.appendChild(el);

  // Bind quick reply buttons
  if (qrList.length > 0 && qrCallbacks) {
    const qrBtns = el.querySelectorAll('.qr-btn');
    const triggerQR = (index) => {
      // 隐藏整个追问模块
      const qrContainer = el.querySelector('.quick-replies');
      if (qrContainer) {
        qrContainer.style.transition = 'opacity .2s, max-height .3s';
        qrContainer.style.opacity = '0';
        qrContainer.style.maxHeight = '0';
        qrContainer.style.overflow = 'hidden';
        setTimeout(() => { qrContainer.style.display = 'none'; }, 300);
      }
      // 禁用所有按钮，防止重复点击
      qrBtns.forEach(b => {
        b.classList.add('selected');
        b.disabled = true;
      });
      // 同时禁用所有游戏行点击
      el.querySelectorAll('.game-record-row').forEach(row => {
        row.style.pointerEvents = 'none';
        row.style.opacity = '0.6';
      });
      const reply = qrList[index];
      addUserBubble(reply);
      // 通过 displayMap 将展示文案映射回 actionKey，再匹配 onQR 回调
      const actionKey = (displayMap && displayMap[reply]) || reply;
      const cb = qrCallbacks[actionKey] || qrCallbacks[reply];
      if (cb) {
        const resp = cb();
        // resp 为 null 表示回调已自行处理气泡渲染（如 handleGenerateHighlightVideo）
        if (!resp) {
          addToHistory('user', reply);
          return;
        }
        setTimeout(() => {
          showTyping(() => {
            const html = resp.cardHtml || (resp.card ? getPrebuiltCard(resp.card) : null);
            addAIBubble(
              resp.text,
              null,
              null,
              html,
              resp.quickReplies || null,
              resp.onQR || null,
              resp._displayMap || null
            );
            addToHistory('user', reply);
            if (resp.text) {
              const h = { role: 'assistant', content: resp.text.replace(/<[^>]*>/g, '') };
              // 标记游戏上下文
              const _gQr = window.detectGame(reply);
              if (_gQr) h._gameId = _gQr.id;
              // 从 actionKey 推断功能 ID，供后续追问去重
              const _fwMap = { '福利':'welfare','战绩':'record','复盘':'replay','找搭子':'partner',
                '资讯':'news','攻略':'guide','高光':'highlight','皮肤':'skin',
                '周报':'report','提醒':'reminder','好友排行':'ranking','对局':'match_query' };
              for (var _fw in _fwMap) {
                if (actionKey && actionKey.indexOf(_fw) !== -1) { h._intentId = _fwMap[_fw]; break; }
              }
              window.chatHistory.push(h);
              if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
            }
          });
        }, 300);
      }
    };

    qrBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => triggerQR(i));
    });

    // 绑定卡片内游戏行点击 → 触发对应 quickReply
    el.querySelectorAll('.game-record-row').forEach(row => {
      row.addEventListener('click', () => {
        const idx = parseInt(row.getAttribute('data-game-index'), 10);
        if (!isNaN(idx) && idx < quickReplies.length) {
          triggerQR(idx);
        }
      });
    });
  }

  scrollChat();
};

window.addAnalyzing = function(msg) {
  const area = document.getElementById('chatArea');
  const el = document.createElement('div');
  const id = 'analyzing_' + Date.now();
  el.id = id;
  el.innerHTML = `<div class="analyzing-wrap"><div class="analyzing-spinner"></div>${msg || '意图识别中…'}</div>`;
  area.appendChild(el);
  scrollChat();
  return id;
};

window.showTyping = function(callback) {
  const area = document.getElementById('chatArea');
  const el = document.createElement('div');
  const id = 'typing_' + Date.now();
  el.id = id;
  el.className = 'msg ai';
  el.innerHTML = `<div class="msg-avatar ai-av">✨</div><div class="typing-indicator"><div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  area.appendChild(el);
  scrollChat();
  setTimeout(() => { removeEl(id); callback(); }, 350 + Math.random() * 150);
};

window.removeEl = function(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
};

window.scrollChat = function() {
  const area = document.getElementById('chatArea');
  setTimeout(() => { area.scrollTop = area.scrollHeight; }, 60);
};

// ============================================================
// 事件绑定
// ============================================================

// Enter key
document.getElementById('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
});

// ============================================================
// MOBILE ADAPTATIONS
// ============================================================
(function mobilePatch() {
  const chatInput = document.getElementById('chatInput');

  if (window.visualViewport) {
    let lastHeight = window.visualViewport.height;
    window.visualViewport.addEventListener('resize', () => {
      const vh = window.visualViewport.height;
      const panel = document.getElementById('aiPanel');
      if (panel && !panel.classList.contains('hidden')) {
        panel.style.maxHeight = vh + 'px';
        scrollChat();
      }
      lastHeight = vh;
    });
    window.visualViewport.addEventListener('scroll', () => {
      const panel = document.getElementById('aiPanel');
      if (panel && !panel.classList.contains('hidden')) {
        panel.style.bottom = -window.visualViewport.offsetTop + 'px';
      }
    });
  }

  chatInput.addEventListener('focus', () => {
    setTimeout(scrollChat, 300);
  });

  const aiPanel = document.getElementById('aiPanel');
  if (aiPanel) {
    aiPanel.addEventListener('touchmove', e => {
      const chatArea = document.getElementById('chatArea');
      if (chatArea && chatArea.contains(e.target)) return;
      if (e.target.closest('.aio-quick-actions')) return;
      e.preventDefault();
    }, { passive: false });
  }

  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('touchstart', e => {
      e.preventDefault();
      closeAIPanel();
    }, { passive: false });
  }

  document.addEventListener('dblclick', e => e.preventDefault());
})();
