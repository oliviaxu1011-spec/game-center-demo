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

  // 创建居中容器（用 flexbox 居中，避免 transform 与动画冲突）
  const wrapper = document.createElement('div');
  wrapper.id = 'globalToast';

  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = 'background:rgba(0,0,0,.75);color:white;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;text-align:center;max-width:280px;backdrop-filter:blur(8px);animation:toast-in .25s ease;pointer-events:none';
  wrapper.appendChild(el);

  // 判断 AI Panel 是否打开，决定挂载容器
  const aiPanel = document.getElementById('aiPanel');
  const inPanel = aiPanel && !aiPanel.classList.contains('hidden');

  if (inPanel) {
    wrapper.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;z-index:9999;pointer-events:none';
    aiPanel.appendChild(wrapper);
  } else {
    wrapper.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;z-index:9999;pointer-events:none';
    document.body.appendChild(wrapper);
  }

  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => wrapper.remove(), 300); }, duration);
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
    label.textContent = window.DEEPSEEK_CONFIG.enabled() ? 'AI' : '本地引擎';
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
    '嗨Q仔！🎮 我是YoYo。<br>你可以直接问我任何游戏问题——<br>领福利、查战绩、找搭子、复盘…<br>问我 <strong>游戏版本/资讯</strong> 还能联网搜索哦 🌐',
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
  input.dispatchEvent(new Event('input'));
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
  // 重置发送按钮状态
  const sendBtnEl = document.getElementById('sendBtn');
  if (sendBtnEl) sendBtnEl.classList.remove('active');
  const sendBtn = document.querySelector('.send-btn');
  if (sendBtn) { sendBtn.disabled = true; setTimeout(() => sendBtn.disabled = false, 1500); }
  processUserMessage(text);
};

// ============================================================
// 核心消息处理流程
// 三层漏斗策略（按优先级）：
//   1️⃣ 本地意图引擎（能完整处理的直接用）
//   2️⃣ DeepSeek AI（本地无匹配 或 本地命中意图但无法完整处理时调用）
//   3️⃣ Pullback/Fallback（以上均无结果时的兜底）
// 特殊机制：本地命中意图但游戏不在库中 → 标记 _needDeepSeek → 转交 AI
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

  // ── Step B2: 异步英雄 AI 识别预处理 ──
  // 当本地意图识别有结果（replay/partner/guide 等需要英雄信息的场景），
  // 且本地英雄匹配失败时，提前调 AI 识别英雄并注入全局变量，
  // 让后续同步的 buildXxxResponse 能读取到 AI 识别的英雄。
  window._lastAIHeroResult = null; // 每轮清空
  const heroRelatedIntents = ['replay', 'partner', 'guide'];
  if (isHybrid && localResult && heroRelatedIntents.includes(localResult.id)) {
    const _game = window.detectGameWithContext ? window.detectGameWithContext(text) : window.detectGame(text);
    const _localHero = _game ? window.detectHero(text, _game) : null;
    const _crossHero = !_localHero ? window.detectHeroAcrossGames(text) : null;
    // 本地全部匹配失败 → 调 AI 异步识别
    if (!_localHero && !_crossHero && window.detectHeroWithAI) {
      const aiHeroResult = await window.detectHeroWithAI(text, _game);
      if (aiHeroResult) {
        window._lastAIHeroResult = aiHeroResult;
        console.log(`[英雄AI兜底] 识别到: ${aiHeroResult.hero.name}(${aiHeroResult.source})`);
      }
    }
  }

  // ── Step C: 本地引擎有结果 → 先试构建响应，检查是否需要转交 DeepSeek ──
  if (localResult) {
    // 预检：调 buildResponse 看看本地能否完整处理
    const preCheckResponse = buildResponse(localResult.id, text);
    if (preCheckResponse && preCheckResponse._needDeepSeek && isHybrid) {
      // 本地识别到意图，但无法完整处理（如游戏不在库中）→ 转交 DeepSeek
      console.log(`[三层漏斗] 本地识别到 ${localResult.id}，但 ${preCheckResponse._reason || '需要 AI 增强'}，转交 DeepSeek`);
    } else {
      // 本地可以完整处理 → 直接用
      handleLocalResult(text, localResult);
      return;
    }
  }

  // ── Step D: 本地无匹配 / 本地需要 AI 增强 → 尝试 DeepSeek AI ──
  // 🆕 Step C2: 纯游戏名拦截 — 在走 DeepSeek 之前，先检查是否是纯游戏名
  // 这样"英雄联盟"等库外游戏名可以走本地消歧追问（更快 + 能关联 pending query）
  if (!localResult) {
    const _pureGame2 = window.detectGame(text);
    const _trimmed2 = text.trim();
    const _hasIntent2 = /查|领|看|找|复盘|战绩|福利|攻略|皮肤|搭子|提醒|下载|资讯|高光|排行|数据|战报|怎么|出装|铭文/.test(_trimmed2);
    const _maybeGame2 = !_pureGame2 && _trimmed2.length >= 2 && _trimmed2.length <= 8
      && !/[？?！!。，,、\s]/.test(_trimmed2) && !_hasIntent2
      && !/^(最近|上[一二两三四五六七八九十\d]*[把局场盘]|今天|昨天|前天|本周|上周|这周|刚才|这把|近期|最近[一那]?[把局场盘])/.test(_trimmed2);
    
    if ((_pureGame2 || _maybeGame2) && !_hasIntent2) {
      console.log('[Step C2] 拦截纯游戏名，走本地消歧追问:', _trimmed2);
      handleLocalResult(text, null);
      return;
    }
  }

  if (isHybrid) {
    const analyzingId = addAnalyzing('🤖 YoYo思考中…');

    let dsResult = null;
    dsResult = await callDeepSeek(text);

    removeEl(analyzingId);

    // DeepSeek 成功 → 用 AI 结果
    if (dsResult) {
      handleDeepSeekResult(text, dsResult);
      return;
    }

    console.warn('[混合模式] DeepSeek 失败，降级到本地/pullback/fallback');
  }

  // ── Step E: DeepSeek 也无结果 → 降级处理 ──
  // 无论是本地无匹配，还是本地命中意图但无法完整处理（游戏不在库等），
  // 只要 DeepSeek 也失败了，统一走 pullback/fallback
  handleLocalResult(text, null);
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
  if (_gDs) {
    histEntry._gameId = _gDs.id;
  } else {
    // 🆕 已知游戏未匹配 → 检查用户消息历史中是否有虚拟游戏上下文
    // 确保 DeepSeek 回复也能被关联到上下文中的虚拟游戏
    const _lastVG = window.getLastMentionedGame ? window.getLastMentionedGame() : null;
    if (_lastVG && _lastVG.isVirtual) {
      histEntry._gameId = _lastVG.id;
      histEntry._virtualGame = _lastVG;
    }
  }
  window.chatHistory.push(histEntry);
  if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();

  showTyping(() => {
    if (needFollowUp) {
      const qrOptions = quickReplies || [];
      const callbacks = {};
      qrOptions.forEach(opt => {
        callbacks[opt] = () => {
          // 🔧 根据选项内容重新判断真实意图，不盲目沿用原始 intentId
          // 原因：纯游戏名引导场景下 intentId 是兜底值（如 "news"），
          //       但用户选了"福利"就该走 welfare，选了"战绩"就该走 record
          let combinedText = text + ' ' + opt;

          // 🆕 如果用户选了"查查攻略"类选项，且历史中有 pending guide query，拼接英雄名
          const isGuideOpt = /攻略|怎么玩|出装/.test(opt);
          if (isGuideOpt && window._pendingGuideQuery && (Date.now() - window._pendingGuideQuery.timestamp < 120000)) {
            const pendingHero = window._pendingGuideQuery.heroText;
            if (pendingHero) {
              combinedText = text + ' ' + pendingHero + ' ' + opt;
              console.log('[追问回调] 拼接 pending hero:', pendingHero, '→', combinedText);
            }
          }

          const reDetected = window.detectIntent ? window.detectIntent(combinedText) : null;
          const actualIntentId = reDetected ? reDetected.id : intentId;
          const resp = buildResponse(actualIntentId, combinedText);
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
      const _gW = window.detectGame(text) || window.getLastMentionedGame();
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
      const _gA = window.detectGame(text) || window.getLastMentionedGame();
      if (_gA) h._gameId = _gA.id;
      window.chatHistory.push(h); if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
    });
    return;
  }

  // ── 无匹配 → 先检测纯游戏名 → 消歧追问 ──
  if (!result) {
    // 🆕 纯游戏名检测：用户只输入了游戏名，没有功能意图词 → 主动追问
    const _pureGame = window.detectGame(text);                        // 先查已知游戏库
    const _trimmed = text.trim();
    const _hasIntentWord = /查|领|看|找|复盘|战绩|福利|攻略|皮肤|搭子|提醒|下载|资讯|高光|排行|数据|战报/.test(_trimmed);
    // 条件：识别到已知游戏 或 短文本可能是游戏名（2-8字、无标点、无意图词、非时间词）
    const _maybeGameName = !_pureGame && _trimmed.length >= 2 && _trimmed.length <= 8
      && !/[？?！!。，,、\s]/.test(_trimmed) && !_hasIntentWord
      && !/^(最近|上[一二两三四五六七八九十\d]*[把局场盘]|今天|昨天|前天|本周|上周|这周|刚才|这把|近期|最近[一那]?[把局场盘])/.test(_trimmed);
    const _virtualGame = _maybeGameName ? window.createVirtualGame(_trimmed) : null;
    const _gameForDisambig = _pureGame || _virtualGame;

    if (_gameForDisambig && !_hasIntentWord) {
      const gName = _gameForDisambig.name;
      const gId   = _gameForDisambig.id;
      const isVirtual = _gameForDisambig.isVirtual;
      const skinLabel = _gameForDisambig.skinLabel || '皮肤';

      // 🆕 快速通道：如果有 pending guide query（用户之前问了"XX怎么玩"但没指定游戏），
      // 现在用户说了游戏名 → 直接走攻略搜索，不再显示消歧菜单
      // ⚠️ 关键：直接调用 _buildGuideCard 而非 buildGuideResponse，
      //    因为 buildGuideResponse 内部会重新检测 game/hero，虚拟游戏的 hero 会丢失
      if (window._pendingGuideQuery && (Date.now() - window._pendingGuideQuery.timestamp < 120000)) {
        const pendingHero = window._pendingGuideQuery.heroText;
        if (pendingHero) {
          console.log('[消歧快速通道] 检测到 pending query，跳过消歧直接搜攻略:', gName, pendingHero);
          // 先将游戏记录到历史（供后续上下文回溯）
          window.addToHistory(text, 'user');
          window._pendingGuideQuery = null; // 消费掉
          // 直接构造 hero 对象，调用 _buildGuideCard 生成联网搜索卡片
          const heroObj = { name: pendingHero, aliases: [pendingHero], role: '未知', icon: '🔍', _fromPending: true };
          const response = window._buildGuideCard(_gameForDisambig, heroObj, gName + ' ' + pendingHero + ' 攻略');
          showTyping(() => {
            addAIBubble(
              response.text,
              '📖 攻略',
              85,
              response.cardHtml,
              response.quickReplies,
              response.onQR,
              response._displayMap
            );
            const h = { role: 'assistant', content: `攻略：${gName} ${pendingHero}` };
            h._gameId = gId;
            if (isVirtual) h._virtualGame = _gameForDisambig;
            window.chatHistory.push(h);
            if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
          });
          return;
        }
      }

      // ── 动态查询该游戏支持的功能，构建个性化引导选项 ──
      // 功能定义：intentId → { label(展示文案), action(回调文案), responseId(响应路由) }
      const _featureMenu = [
        { id: 'welfare',     label: '领福利',         action: gName + '福利',    responseId: 'welfare' },
        { id: 'record',      label: '查战绩',         action: gName + '战绩',    responseId: 'record' },
        { id: 'partner',     label: '找搭子',         action: gName + '找搭子',  responseId: 'partner' },
        { id: 'guide',       label: '看攻略',         action: gName + '攻略',    responseId: 'guide' },
        { id: 'news',        label: '看资讯',         action: gName + '资讯',    responseId: 'news' },
        { id: 'skin',        label: '逛' + skinLabel,  action: gName + skinLabel,  responseId: 'skin' },
        { id: 'download',    label: '下载游戏',       action: '下载' + gName,     responseId: 'download' },
        { id: 'highlight',   label: '看高光',         action: gName + '高光',    responseId: 'highlight' },
        { id: 'report',      label: '看战报',         action: gName + '战报',    responseId: 'report' },
        { id: 'ranking',     label: '好友排行',       action: gName + '排行',    responseId: 'ranking' },
        { id: 'replay',      label: 'AI复盘',         action: gName + '复盘',    responseId: 'replay' },
        { id: 'match_query', label: '查对局',         action: gName + '对局',    responseId: 'match_query' },
        { id: 'reminder',    label: '设提醒',         action: gName + '提醒',    responseId: 'reminder' },
      ];

      // 根据 FEATURE_GAME_SCOPE 过滤出该游戏支持的功能
      // 虚拟游戏也走 isGameSupportedForFeature 统一判断（内部已处理虚拟游戏策略）
      const isSupported = window.isGameSupportedForFeature || (() => false);
      const supportedFeatures = _featureMenu.filter(f => isSupported(gId, f.id));

      // 最多展示 5 个选项（避免过多），优先展示高频功能
      const maxOptions = 5;
      const displayFeatures = supportedFeatures.slice(0, maxOptions);

      const disambigQR = displayFeatures.map(f => f.label);
      const disambigCallbacks = {};
      displayFeatures.forEach(f => {
        disambigCallbacks[f.label] = () => {
          // 🆕 如果是攻略类功能 + 有 pending guide query → 拼接英雄名
          let actionText = f.action;
          if (f.id === 'guide' && window._pendingGuideQuery && (Date.now() - window._pendingGuideQuery.timestamp < 120000)) {
            const pendingHero = window._pendingGuideQuery.heroText;
            if (pendingHero) {
              actionText = gName + ' ' + pendingHero + ' 攻略';
              console.log('[消歧回调] 拼接 pending hero:', pendingHero, '→', actionText);
            }
          }
          return buildResponse(f.responseId, actionText) || { text: '好的，帮你看看～', cardHtml: null };
        };
      });

      // 根据功能数量调整引导话术
      const featureCount = displayFeatures.length;
      let guideText;
      if (featureCount === 1) {
        guideText = `提到<strong>${gName}</strong>，我可以帮你<strong>${displayFeatures[0].label}</strong>哦～`;
      } else {
        guideText = `提到<strong>${gName}</strong>啊～你想了解什么呢？😊`;
      }

      showTyping(() => {
        addAIBubble(
          guideText,
          '🎮 功能引导',
          75,
          null,
          disambigQR,
          disambigCallbacks
        );
        const h = { role: 'assistant', content: `功能引导：${gName}` };
        h._gameId = gId;
        window.chatHistory.push(h);
        if (window.chatHistory.length > MAX_HISTORY) window.chatHistory.shift();
      });
      return;
    }

    // ── 非游戏名 → pullback / fallback ──
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
      const _g = window.detectGame(text) || window.getLastMentionedGame();
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
  const sendBtn = document.getElementById('sendBtn');
  const panel = document.getElementById('aiPanel');

  // — 发送按钮状态跟随输入内容 —
  function updateSendBtn() {
    if (sendBtn) {
      if (chatInput.value.trim()) {
        sendBtn.classList.add('active');
      } else {
        sendBtn.classList.remove('active');
      }
    }
  }
  chatInput.addEventListener('input', updateSendBtn);

  // — 键盘弹出/收起检测 —
  let keyboardOpen = false;

  function setKeyboardState(open) {
    if (keyboardOpen === open) return;
    keyboardOpen = open;
    if (panel) {
      if (open) {
        panel.classList.add('keyboard-open');
      } else {
        panel.classList.remove('keyboard-open');
      }
    }
  }

  if (window.visualViewport) {
    const fullHeight = window.visualViewport.height;
    window.visualViewport.addEventListener('resize', () => {
      const vh = window.visualViewport.height;
      if (panel && !panel.classList.contains('hidden')) {
        // 键盘弹出时，viewport 高度会明显变小
        const isKbOpen = vh < fullHeight * 0.75;
        setKeyboardState(isKbOpen);

        // 面板高度保持固定，不随键盘动态调整
        // 只滚动聊天区域，确保最新消息可见
        scrollChat();
      }
    });
    // 不再动态调整 panel.style.top，保持面板固定位置
  }

  chatInput.addEventListener('focus', () => {
    setTimeout(() => {
      setKeyboardState(true);
      scrollChat();
    }, 300);
  });

  chatInput.addEventListener('blur', () => {
    setTimeout(() => {
      setKeyboardState(false);
    }, 100);
  });

  // — 添加 enterkeyhint="send" 的键盘回车处理 —
  chatInput.addEventListener('keydown', e => {
    // Enter 发送（已在上面绑定，这里仅用于虚拟键盘的 send 按钮适配）
  });

  // — 防止 AI 面板区域触摸滑动导致页面上缩/下缩 —
  // 策略：chat-area 内允许正常滚动，但到达边界时阻止默认行为
  //       快捷按钮区允许横向滚动
  //       其他空白区域完全阻止触摸滚动
  let _touchStartY = 0;
  if (panel) {
    panel.addEventListener('touchstart', e => {
      _touchStartY = e.touches[0].clientY;
    }, { passive: true });

    panel.addEventListener('touchmove', e => {
      const chatArea = document.getElementById('chatArea');

      // 快捷按钮区 — 允许横向滚动
      if (e.target.closest('.aio-quick-actions')) return;

      // 横向滚动容器（皮肤、下载媒体等）— 允许滑动
      if (e.target.closest('.dl-media-scroll, .skin-scroll, .video-templates-row')) return;

      // chat-area 内 — 仅在内容可滚动方向上允许，边界时阻止
      if (chatArea && chatArea.contains(e.target)) {
        var touchY = e.touches[0].clientY;
        var deltaY = touchY - _touchStartY;
        var scrollTop = chatArea.scrollTop;
        var scrollHeight = chatArea.scrollHeight;
        var clientHeight = chatArea.clientHeight;

        // 内容不足以滚动（无溢出）→ 阻止，防止页面被拖动
        if (scrollHeight <= clientHeight) {
          e.preventDefault();
          return;
        }

        // 已在顶部，还想下拉（deltaY > 0，手指下滑）→ 阻止
        if (scrollTop <= 0 && deltaY > 0) {
          e.preventDefault();
          return;
        }

        // 已在底部，还想上拉（deltaY < 0，手指上滑）→ 阻止
        if (scrollTop + clientHeight >= scrollHeight && deltaY < 0) {
          e.preventDefault();
          return;
        }

        // 正常滚动范围内 → 允许
        return;
      }

      // 其他区域（导航栏、输入栏等空白处）→ 阻止默认行为
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
