// ============================================================
// DEEPSEEK API — 大模型调用封装
// 修改说明：直接编辑此文件即可调整 API 配置/调用逻辑，刷新页面生效
// ============================================================

// ── DeepSeek 配置 ──────────────────────────────────
// 支持三种方式填入 Key（优先级：URL参数 > 手动输入 > 默认空）
// URL参数示例：?key=sk-xxxx  或  ?k=sk-xxxx
const _urlKey = (() => {
  try {
    const p = new URLSearchParams(location.search);
    return p.get('key') || p.get('k') || '';
  } catch(e) { return ''; }
})();

window.DEEPSEEK_CONFIG = {
  apiKey: _urlKey,
  baseUrl: (window.DATA_DEEPSEEK_CONFIG || {}).baseUrl || 'https://api.deepseek.com/v1',
  model: (window.DATA_DEEPSEEK_CONFIG || {}).model || 'deepseek-chat',
  enabled() { return !!this.apiKey.trim(); },
};

// 游戏中心垂类 System Prompt（从 data/system-prompt.js 加载）
window.SYSTEM_PROMPT = window.DATA_SYSTEM_PROMPT || '你是QQ游戏中心AI助手。';

// ============================================================
// DEEPSEEK API 调用
// ============================================================
window.callDeepSeek = async function(userText) {
  if (!window.DEEPSEEK_CONFIG.enabled()) return null;

  try {
    // 添加 10 秒超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
      console.warn('[DeepSeek] 请求超时(10s)，降级到本地引擎');
    } else {
      console.warn('[DeepSeek] 调用失败，降级到本地引擎:', e.message);
    }
    return null;
  }
};
