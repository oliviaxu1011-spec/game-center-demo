// ============================================================
// DEEPSEEK API — 大模型调用封装
// 修改说明：直接编辑此文件即可调整 API 配置/调用逻辑，刷新页面生效
// ============================================================

// ── DeepSeek 配置 ──────────────────────────────────
// 优先级：URL参数 > 配置文件预设 Key > 默认空
// URL参数示例：?key=sk-xxxx  或  ?k=sk-xxxx
const _urlKey = (() => {
  try {
    const p = new URLSearchParams(location.search);
    return p.get('key') || p.get('k') || '';
  } catch(e) { return ''; }
})();

const _cfg = window.DATA_DEEPSEEK_CONFIG || {};

window.DEEPSEEK_CONFIG = {
  apiKey: _urlKey || _cfg.apiKey || '',
  baseUrl: _cfg.baseUrl || 'https://api.deepseek.com/v1',
  model: _cfg.model || 'deepseek-chat',
  enabled() { return !!this.apiKey.trim(); },
};

// 游戏中心垂类 System Prompt（从 data/system-prompt.js 加载）
window.SYSTEM_PROMPT = window.DATA_SYSTEM_PROMPT || '你是YoYo。';

// ============================================================
// DEEPSEEK API — 英雄识别专用（轻量级调用）
// 当本地 heroes.js 未录入某英雄时，调 AI 识别并动态补充到内存
// ============================================================
window._heroAICache = {}; // 缓存已识别的英雄，避免重复调 AI

window.callDeepSeekForHero = async function(userText, gameId) {
  if (!window.DEEPSEEK_CONFIG.enabled()) return null;

  // 构建缓存 key
  const cacheKey = (gameId || 'any') + ':' + userText.trim().toLowerCase();
  if (window._heroAICache[cacheKey] !== undefined) {
    console.log('[英雄AI识别] 命中缓存:', cacheKey, window._heroAICache[cacheKey]);
    return window._heroAICache[cacheKey]; // 可能是 null（AI也识别不出）
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

    const gameHint = gameId && window.ENGINE_GAMES?.[gameId]
      ? `用户当前讨论的游戏是"${window.ENGINE_GAMES[gameId].name}"。`
      : '请从文本中推断是哪个游戏的英雄/角色/武器。';

    const prompt = `你是一个游戏角色识别助手。请从用户输入中提取游戏英雄/角色/武器名称。
${gameHint}

【本地数据库支持的 5 款游戏】
wzry = 王者荣耀
hpjy = 和平精英
ys   = 原神
cfm  = 穿越火线（手游）
sjz  = 三角洲行动

要求：
1. 仅返回 JSON，格式：{"heroName":"官方标准名","userAlias":"用户原文称呼","role":"位置","gameId":"游戏ID"}
2. heroName 必须是该角色在其所属游戏中的当前官方标准名称（例如王者荣耀的"荆轲"已改名为"阿轲"，heroName 应为"阿轲"）
3. userAlias 是用户原文中使用的称呼（例如用户说"荆轲"，userAlias 就是"荆轲"），用于别名匹配
4. role 是该角色的定位，如：打野、上单、中单、射手、辅助（王者荣耀）等
5. gameId 使用该角色真正所属的游戏ID。如果属于上述5款之一就用对应ID；如果属于其他游戏（如英雄联盟、DOTA2等），gameId 填该游戏的英文简写（如 lol、dota2 等）
6. 如果文本中没有提到任何游戏角色/英雄/武器，返回 {"heroName":null}
7. 不要编造不存在的角色，不要把其他游戏的角色强行归类到上述 5 款游戏中`;

    const res = await fetch(`${window.DEEPSEEK_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.DEEPSEEK_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: window.DEEPSEEK_CONFIG.model,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userText },
        ],
        temperature: 0.1,
        max_tokens: 150,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn('[英雄AI识别] API error:', res.status);
      window._heroAICache[cacheKey] = null;
      return null;
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) { window._heroAICache[cacheKey] = null; return null; }

    const parsed = JSON.parse(raw);
    if (!parsed.heroName) {
      console.log('[英雄AI识别] AI未识别到英雄');
      window._heroAICache[cacheKey] = null;
      return null;
    }

    // 验证 gameId 是否在支持范围内
    const SUPPORTED_GAMES = ['wzry', 'hpjy', 'ys', 'cfm', 'sjz'];
    const aiGameId = parsed.gameId || gameId || 'wzry';
    if (!SUPPORTED_GAMES.includes(aiGameId)) {
      // 🆕 不在支持范围 → 不直接返回 null，而是返回带标记的结果
      // 让调用方可以利用英雄名和游戏名去联网搜索
      console.log(`[英雄AI识别] 游戏 ${aiGameId} 不在本地支持范围，标记为库外游戏英雄`);
      const unsupportedResult = {
        hero: {
          name: parsed.heroName,
          aliases: [parsed.heroName, parsed.userAlias].filter(Boolean),
          role: parsed.role || '未知',
          icon: '🔍',
          _fromAI: true,
          _unsupportedGame: true, // 标记：来自不支持的游戏
        },
        gameId: aiGameId,
        gameName: parsed.reason ? parsed.reason.replace(/.*属于/, '').replace(/[，,].*/,'').trim() : aiGameId,
        _unsupportedGame: true,
      };
      window._heroAICache[cacheKey] = unsupportedResult;
      return unsupportedResult;
    }

    // 构造与 heroes.js 一致的 hero 对象
    // 将用户原文称呼（如"荆轲"）和官方名（如"阿轲"）都加入 aliases
    const aliasSet = new Set([parsed.heroName]);
    if (parsed.userAlias && parsed.userAlias !== parsed.heroName) {
      aliasSet.add(parsed.userAlias);
    }
    const heroObj = {
      name: parsed.heroName,
      aliases: Array.from(aliasSet),
      role: parsed.role || '未知',
      icon: '🤖', // AI 识别标记
      _fromAI: true, // 标记为 AI 识别
    };

    const resolvedGameId = aiGameId;

    // 动态补充到内存中的 ENGINE_HERO_DB，后续本地匹配可直接命中
    if (!window.ENGINE_HERO_DB[resolvedGameId]) {
      window.ENGINE_HERO_DB[resolvedGameId] = [];
    }
    // 检查是否已存在（避免重复添加）
    const exists = window.ENGINE_HERO_DB[resolvedGameId].some(
      h => h.name === heroObj.name
    );
    if (!exists) {
      window.ENGINE_HERO_DB[resolvedGameId].push(heroObj);
      console.log(`[英雄AI识别] ✅ 动态补充: ${heroObj.name}(${heroObj.role}) → ${resolvedGameId}`);
    }

    // 缓存结果
    const result = { hero: heroObj, gameId: resolvedGameId };
    window._heroAICache[cacheKey] = result;
    return result;

  } catch (e) {
    if (e.name === 'AbortError') {
      console.warn('[英雄AI识别] 请求超时(5s)');
    } else {
      console.warn('[英雄AI识别] 调用失败:', e.message);
    }
    window._heroAICache[cacheKey] = null;
    return null;
  }
};

// ============================================================
// DEEPSEEK API — 流式总结搜索结果（攻略/资讯）
// 将搜索到的内容发给 AI 进行总结，流式输出到指定 DOM 元素
// ============================================================
window.streamAISummary = async function(contentList, heroName, type, targetEl) {
  if (!window.DEEPSEEK_CONFIG.enabled() || !targetEl) return false;

  // 构建待总结的内容摘要
  const contentText = contentList.map((item, i) => {
    return `${i + 1}. 《${item.fullTitle || item.title}》\n${item.abstract || ''}`;
  }).join('\n\n');

  const typeLabel = type === 'guide' ? '攻略' : '资讯';
  const prompt = `你是一个专业的游戏${typeLabel}总结助手。请根据以下搜索到的${typeLabel}内容，用简洁、有重点的方式为玩家总结核心要点。

要求：
1. 总结控制在 80 字以内，语言简洁有力
2. 突出最关键的信息（${type === 'guide' ? '出装、铭文、打法要点' : '版本动态、活动信息'}等）
3. 使用适当的 emoji 让回复更生动
4. 不要用"根据搜索结果"这类开头，直接说内容
5. 如果是攻略内容，直接给出实用建议；如果是资讯内容，概述主要新闻点`;

  const userMsg = `以下是搜索到的关于「${heroName}」的 ${contentList.length} 条${typeLabel}内容：\n\n${contentText}\n\n请用一段话总结核心要点。`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

    const res = await fetch(`${window.DEEPSEEK_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.DEEPSEEK_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: window.DEEPSEEK_CONFIG.model,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMsg },
        ],
        temperature: 0.5,
        max_tokens: 200,
        stream: true, // 🔑 开启流式输出
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn('[AI总结] API error:', res.status);
      return false;
    }

    // 流式读取 SSE 响应
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulated = '';
    let buffer = ''; // SSE 行缓冲

    // 添加打字光标样式
    targetEl.classList.add('ai-streaming');
    targetEl.innerHTML = '<span class="ai-stream-text"></span><span class="ai-stream-cursor">|</span>';
    const textSpan = targetEl.querySelector('.ai-stream-text');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留未完整的最后一行

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const jsonStr = trimmed.slice(5).trim();
        if (jsonStr === '[DONE]') continue;

        try {
          const chunk = JSON.parse(jsonStr);
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            accumulated += delta;
            textSpan.innerHTML = accumulated;
            // 每次更新后滚动聊天到底部
            window.scrollChat && window.scrollChat();
          }
        } catch (parseErr) {
          // 忽略解析错误（可能是不完整的 JSON）
        }
      }
    }

    // 流式输出完成，移除光标
    targetEl.classList.remove('ai-streaming');
    targetEl.innerHTML = accumulated || '攻略内容已就绪，点击下方查看详情 👇';
    // 在总结文字末尾添加 AI 标记
    targetEl.innerHTML += ' <span class="ai-summary-badge">✨AI总结</span>';
    window.scrollChat && window.scrollChat();

    console.log('[AI总结] 流式输出完成，共', accumulated.length, '字');
    return true;

  } catch (e) {
    if (e.name === 'AbortError') {
      console.warn('[AI总结] 请求超时(15s)');
    } else {
      console.warn('[AI总结] 流式调用失败:', e.message);
    }
    // 失败时恢复为默认文案
    targetEl.classList.remove('ai-streaming');
    return false;
  }
};

// ============================================================
// DEEPSEEK API 调用
// ============================================================
window.callDeepSeek = async function(userText) {
  if (!window.DEEPSEEK_CONFIG.enabled()) return null;

  try {
    // 添加 6 秒超时控制（缩短以提升体验）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    // 构建 messages：system prompt + 最近对话历史 + 当前用户输入
    const messages = [
      { role: 'system', content: window.SYSTEM_PROMPT },
    ];
    // 添加历史上下文（帮助理解省略/指代/模糊的后续输入）
    window.chatHistory.forEach(h => {
      if (h.role === 'user' || h.role === 'assistant') {
        messages.push({ role: h.role, content: h.content });
      }
    });
    messages.push({ role: 'user', content: userText });

    const res = await fetch(`${window.DEEPSEEK_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.DEEPSEEK_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: window.DEEPSEEK_CONFIG.model,
        messages,
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn('[DeepSeek] API error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    // 校验必要字段
    if (!parsed.intentId || !parsed.intentLabel) {
      console.warn('[DeepSeek] 返回格式不完整:', parsed);
      return null;
    }
    return parsed;
  } catch (e) {
    if (e.name === 'AbortError') {
      console.warn('[DeepSeek] 请求超时(6s)，降级到本地引擎');
    } else {
      console.warn('[DeepSeek] 调用失败，降级到本地引擎:', e.message);
    }
    return null;
  }
};
