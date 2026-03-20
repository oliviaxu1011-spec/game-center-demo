// ============================================================
// CHAT CONTROLLER — 聊天主流程 + UI 渲染 + 面板控制 + 移动端适配
// 修改说明：直接编辑此文件即可调整聊天交互逻辑，刷新页面生效
// ============================================================

// ── 快捷引用 ───────────────────────────────────────
const INTENTS      = window.ENGINE_INTENTS;
const GAMES        = window.ENGINE_GAMES;
const DEFAULT_GAME = window.ENGINE_DEFAULT_GAME;
const MAX_HISTORY  = window.MAX_HISTORY;

// ── 状态变量 ───────────────────────────────────────
let panelOpen  = false;
let chatInited = false;
let pendingQR  = null;

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
    status.textContent = '✅ 已启用 DeepSeek 大模型';
    status.style.color = '#22c55e';
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
    label.textContent = window.DEEPSEEK_CONFIG.enabled() ? 'DeepSeek' : '本地引擎';
    label.style.background = window.DEEPSEEK_CONFIG.enabled()
      ? 'linear-gradient(90deg,#22c55e,#16a34a)'
      : 'linear-gradient(135deg,#1a6bff,#4a90ff)';
  }
};

// 页面加载时：如果 URL 带了 key，同步 UI 状态
(function initKeyFromURL() {
  if (window.DEEPSEEK_CONFIG.enabled()) {
    const input = document.getElementById('apiKeyInput');
    if (input) input.value = window.DEEPSEEK_CONFIG.apiKey;
    const status = document.getElementById('apiKeyStatus');
    if (status) { status.textContent = '✅ 已启用 DeepSeek 大模型（URL参数）'; status.style.color = '#22c55e'; }
    updateModeLabel();
  }
})();

// ============================================================
// 页面导航 / 面板控制
// ============================================================
window.startDemo = function() {
  document.getElementById('screen-landing').classList.remove('active');
  document.getElementById('screen-app').classList.add('active');
  setTimeout(openAIPanel, 600);
};

window.goToLanding = function() {
  closeAIPanel();
  document.getElementById('screen-app').classList.remove('active');
  document.getElementById('screen-landing').classList.add('active');
  chatInited = false;
  pendingQR = null;
  document.getElementById('chatArea').innerHTML = '';
};

window.openAIPanel = function() {
  document.getElementById('aiPanel').classList.remove('hidden');
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
  addAIBubble(
    '嗨蟹柳！🎮 我是游戏中心 AI。<br>你可以直接问我任何游戏问题——<br>领福利、查战绩、找搭子、复盘…<br>也可以点上面的快捷词试试 ↑',
    null, null, null
  );
};

window.fillInput = function(text) {
  const input = document.getElementById('chatInput');
  input.value = text;
  input.focus();
};

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
// ============================================================
window.processUserMessage = async function(text) {
  addUserBubble(text);
  addToHistory('user', text);

  const analyzingId = addAnalyzing(
    window.DEEPSEEK_CONFIG.enabled() ? '🤖 DeepSeek 意图理解中…' : '⚡ 本地引擎识别中…'
  );

  let dsResult = null;

  // 优先尝试 DeepSeek
  if (window.DEEPSEEK_CONFIG.enabled()) {
    dsResult = await callDeepSeek(text);
  }

  removeEl(analyzingId);

  // ── 走 DeepSeek 结果 ──────────────────────────────
  if (dsResult) {
    const { intentId, intentLabel, confidence, replyText, needFollowUp, followUpQuestion, quickReplies } = dsResult;

    const histEntry = { role: 'assistant', content: replyText || '' };
    histEntry._intentId = intentId;
    window.chatHistory.push(histEntry);
    if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();

    if (intentId === 'out_of_scope') {
      showTyping(() => {
        addAIBubble(
          replyText || '哈哈，这个我不太擅长 😄 不过<strong>今日游戏福利</strong>还没领，要不要看看？🎁',
          '🎁 福利/礼包', 65, null, ['看今日福利', '帮我找搭子'],
          { '看今日福利': () => buildResponse('welfare', '今日福利'), '帮我找搭子': () => buildResponse('partner', '找搭子') }
        );
      });
      return;
    }

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
          response?.onQR
        );
      }
    });
    return;
  }

  // ── 降级到本地引擎（带模糊语义） ──────────────────

  // Step A: 上下文延续 — 短输入可能是对上一轮的回应
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
              response.quickReplies, response.onQR
            );
            const h = { role: 'assistant', content: response.text }; h._intentId = lastIntent;
            window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
          }
        });
        return;
      }
    }
  }

  // Step B: 模糊意图识别
  const result = detectIntent(text);

  // Step B2: 置信度阈值判断
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
              quickReplies: ['有什么礼包','查我的战绩','帮我找搭子','最近有什么资讯'],
            };
          },
        }
      );
      const h = { role: 'assistant', content: `确认意图：${guessLabel}？` }; h._intentId = result.id;
      window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
    });
    return;
  }

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
      window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
    });
    return;
  }

  if (!result) {
    // Step C: 扩展 pullback
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
        window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
      });
    }
    return;
  }

  // Step D: 本地引擎成功识别意图
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
          response.onQR
        );
        const h = { role: 'assistant', content: response.text }; h._intentId = result.id;
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

window.addAIBubble = function(text, intentLabel, confidence, cardHtml, quickReplies, qrCallbacks) {
  const area = document.getElementById('chatArea');
  const el = document.createElement('div');
  el.className = 'msg ai';

  let inner = `<div class="msg-avatar ai-av">✨</div><div class="msg-content">`;
  inner += `<div class="msg-bubble">${text}</div>`;

  if (cardHtml) inner += cardHtml;

  if (quickReplies) {
    inner += `<div class="quick-replies">`;
    quickReplies.forEach((r, i) => {
      inner += `<button class="qr-btn" data-qr="${i}">${r}</button>`;
    });
    inner += `</div>`;
    pendingQR = qrCallbacks;
  }

  inner += `</div>`;
  el.innerHTML = inner;
  area.appendChild(el);

  // Bind quick reply buttons
  if (quickReplies && qrCallbacks) {
    el.querySelectorAll('.qr-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.qr-btn').forEach(b => b.classList.add('selected'));
        const reply = quickReplies[i];
        addUserBubble(reply);
        const cb = qrCallbacks[reply];
        if (cb) {
          const resp = cb();
          setTimeout(() => {
            showTyping(() => {
              const html = resp.cardHtml || (resp.card ? getPrebuiltCard(resp.card) : null);
              addAIBubble(resp.text, null, null, html);
            });
          }, 300);
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
  setTimeout(() => { removeEl(id); callback(); }, 700 + Math.random() * 300);
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
  if (e.key === 'Enter') sendMessage();
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
      if (e.target.closest('.input-hints')) return;
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
