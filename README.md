# AIBot 代码结构说明

## 📁 项目结构

```
代码/
├── index.html                 # 主页面（包含全部CSS样式）
├── README.md                  # 本文件
├── js/                        # 业务逻辑模块（核心逻辑）
│   ├── chat-controller.js     # 聊天主流程 + UI 渲染 + 面板控制
│   ├── intent-engine.js       # 意图识别引擎（模糊匹配、容错）
│   ├── response-builders.js   # 响应构建器（卡片生成）
│   ├── deepseek-api.js        # DeepSeek 大模型 API 调用
│   ├── video-handler.js       # 视频生成/播放/分享交互
│   └── data-generators.js     # 动态数据生成（战绩/回放等）
└── data/                      # 数据配置（关键字、意图、游戏等）
    ├── intents.js             # 意图识别配置（12种意图定义）
    ├── games.js               # 游戏数据库（支持游戏列表）
    ├── heroes.js              # 英雄数据库（英雄名称与识别）
    ├── system-prompt.js       # DeepSeek 系统提示词
    ├── typo-abbr.js           # 谐音/错别字纠正映射
    ├── video-templates.js     # 视频模板（各游戏高光视频配置）
    ├── pullback-fallback.js   # 拉回话题/降级处理逻辑
    ├── deepseek-config.js     # DeepSeek API 配置
    └── mock/                  # Mock 数据（模拟服务器响应）
        ├── welfare.js         # 福利卡片数据
        ├── record.js          # 战绩数据
        ├── replay.js          # 回放/复盘数据
        ├── misc.js            # 其他卡片数据（下载、皮肤等）
        └── ...
```

---

## 🎯 核心业务流程

### 用户发送消息 → 意图识别 → 响应生成 → UI 渲染

```
用户输入 "我最近赢了几把"
    ↓
[intent-engine.js] 意图识别
    ↓ 匹配到 "record" 意图
    ↓
[response-builders.js] 根据意图调用对应的构建函数
    ↓ buildRecordResponse()
    ↓
[data-generators.js] 生成模拟数据
    ↓
[chat-controller.js] 渲染到 UI
    ↓
消息气泡 + 卡片展示到聊天界面
```

---

## 📄 各个 JS 文件详细说明

### 1. **chat-controller.js** — 聊天主控制器
**位置**: `js/chat-controller.js`  
**职责**: 聊天主流程、UI 渲染、面板控制、移动端适配

**主要函数**:
- `toggleChatPanel()` — 打开/关闭聊天面板
- `toggleSettingsPanel()` — 打开/关闭设置面板
- `sendMessage()` — 发送消息（处理输入、调用意图识别、渲染回复）
- `addUserBubble(text)` — 添加用户消息气泡
- `addAIBubble(text, cardId, cardData, cardHtml)` — 添加 AI 消息气泡（支持卡片）
- `handleKeyPress(e)` — 处理回车键发送
- `saveApiKey()` — 保存 DeepSeek API Key
- `updateModeLabel()` — 更新引擎模式标签（DeepSeek/本地引擎）

**修改场景**:
- 要修改聊天交互逻辑 → 编辑这个文件
- 要调整 UI 渲染 → 编辑这个文件的 `addUserBubble()` 或 `addAIBubble()` 函数
- 要改变输入框/按钮行为 → 编辑这个文件

---

### 2. **intent-engine.js** — 意图识别引擎
**位置**: `js/intent-engine.js`  
**职责**: 模糊语义识别、容错匹配、游戏检测、英雄检测、时间解析

**核心能力**:
1. **编辑距离算法** — 纠正错别字、谐音字（例："王者" → "王者荣耀"）
2. **关键词匹配** — 多级匹配（强关键词、弱关键词、正则模式）
3. **游戏检测** — 识别用户提到的游戏（王者、和平精英、原神等）
4. **英雄检测** — 识别用户提到的英雄/武器（李白、诸葛亮、AK47等）
5. **时间解析** — 将自然语言时间转换为标准范围（"最近" → "week"、"昨天" → "yesterday"）
6. **意图识别** — 根据关键词、强关键词、正则匹配确定用户意图

**主要函数**:
- `editDistance(a, b)` — 计算两个字符串的编辑距离（用于容错）
- `correctTypos(text)` — 纠正错别字/谐音字
- `detectGame(text)` — 从用户输入中识别游戏
- `detectHero(text, gameId)` — 从用户输入中识别英雄
- `parseTimeRange(text)` — 解析时间范围（"最近" → "week"）
- `detectIntent(text)` — 返回最匹配的意图对象及置信度

**修改场景**:
- 要调整意图识别规则 → 修改 `data/intents.js`
- 要添加新的游戏 → 修改 `data/games.js`
- 要添加新的英雄 → 修改 `data/heroes.js`
- 要纠正错别字/谐音 → 修改 `data/typo-abbr.js`
- 要改变识别算法的逻辑 → 编辑这个文件本身

---

### 3. **response-builders.js** — 响应构建器
**位置**: `js/response-builders.js`  
**职责**: 根据意图 ID 生成对应的回复（文本 + HTML卡片）

**12 种意图对应的构建函数**:

| 意图 ID | 构建函数 | 作用 |
|---------|----------|------|
| `welfare` | `buildWelfareResponse()` | 福利/礼包卡片 |
| `record` | `buildRecordResponse()` | 战绩查询卡片 |
| `replay` | `buildReplayResponse()` | AI复盘卡片 |
| `partner` | `buildPartnerResponse()` | 找搭子卡片 |
| `news` | `buildNewsResponse()` | 新闻资讯卡片 |
| `guide` | `buildGuideResponse()` | 攻略指南卡片 |
| `highlight` | `buildHighlightResponse()` | 高光视频卡片 |
| `download` | `buildDownloadResponse()` | 游戏下载卡片 |
| `skin` | `buildSkinResponse()` | 皮肤展示卡片 |
| `report` | `buildReportResponse()` | 周报/数据报告卡片 |
| `emotion` | `buildEmotionResponse()` | 情绪互动（陪聊） |
| `reminder` | `buildReminderResponse()` | 提醒/通知 |

**主要函数**:
- `buildResponse(intentId, userText)` — 响应路由器，分发到对应的 build 函数
- `buildXxxResponse(text)` — 各意图的具体构建函数，返回 `{text, card, cardHtml}`

**修改场景**:
- 要改变某个意图的卡片样式 → 编辑对应的 build 函数
- 要调整卡片数据（福利内容、下载链接等） → 修改 `data/mock/*.js`
- 要新增一个意图类型 → 在这个文件添加新的 build 函数，并在 `buildResponse()` 路由中注册

---

### 4. **deepseek-api.js** — 大模型 API 调用
**位置**: `js/deepseek-api.js`  
**职责**: DeepSeek API 调用封装、请求构建、错误处理

**核心特性**:
- 支持 3 种方式填入 API Key（URL参数优先级最高）
- 自动加入 System Prompt 和对话历史，提升理解准确度
- 10 秒超时控制，防止请求卡住
- 自动剔除过长历史，优化 Token 消耗

**主要函数**:
- `callDeepSeek(userText)` — 异步调用 DeepSeek API，返回 AI 回复
- `window.DEEPSEEK_CONFIG.enabled()` — 检查是否启用了 DeepSeek 模式

**配置项**:
```javascript
window.DEEPSEEK_CONFIG = {
  apiKey: '',  // 从 URL 参数或手动输入填充
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
}
```

**修改场景**:
- 要改变 API 调用的超时时间 → 编辑第 35 行的 `10000` 毫秒
- 要切换其他大模型 API → 修改 `baseUrl` 和 `model`
- 要调整发送的历史记录数量 → 编辑构建 messages 的逻辑

---

### 5. **video-handler.js** — 视频处理
**位置**: `js/video-handler.js`  
**职责**: 视频生成、播放、分享的交互逻辑

**主要函数**:
- `handleGenerateHighlightVideo(gameId, hero, result)` — 生成高光视频
- `handlePlayVideo(videoId)` — 播放视频
- `handleShareVideo(videoId)` — 分享视频

**修改场景**:
- 要改变视频生成的进度提示文案 → 编辑这个文件
- 要添加新的视频模板 → 修改 `data/video-templates.js`

---

### 6. **data-generators.js** — 动态数据生成器
**位置**: `js/data-generators.js`  
**职责**: 根据时间范围、游戏类型生成逼真的 Mock 数据

**主要函数**:
- `genRecordData(range, game)` — 生成战绩数据（基于时间范围）
- `genReplayData(range, game)` — 生成复盘数据
- `genPartnerData()` — 生成找搭子列表
- 等等...

**修改场景**:
- 要改变战绩数据的生成逻辑 → 编辑 `genRecordData()` 函数
- 要修改预设的胜率、评分等 → 修改 `data/mock/record.js`

---

## 📊 数据文件说明

### **data/intents.js** — 意图配置
定义系统支持的 12 种意图，每种意图包括：
- `id` — 意图唯一标识
- `label` — 意图显示标签
- `keywords` — 关键词列表（弱匹配）
- `strongKeywords` — 强关键词（强匹配）
- `patterns` — 正则模式（最强匹配）

**修改场景**: 要添加新的关键词或正则模式 → 直接编辑这个文件

---

### **data/games.js** — 游戏数据库
定义系统支持的游戏及其识别关键词：
```javascript
{
  id: 'wzry',
  name: '王者荣耀',
  icon: '⚔️',
  keywords: ['王者', '荣耀', '王者荣耀', ...],
}
```

**修改场景**: 要新增游戏 → 在这个文件添加新记录即可

---

### **data/heroes.js** — 英雄数据库
定义各游戏的英雄及其别名：
```javascript
window.DATA_HERO_DB = {
  wzry: {
    '李白': ['李白', '剑仙', '仙剑', 'lb'],
    '诸葛亮': ['诸葛', '孔明', '葛亮', 'zgl'],
    ...
  },
  ...
}
```

**修改场景**: 要添加英雄或别名 → 直接编辑这个文件

---

### **data/typo-abbr.js** — 谐音/错别字纠正
定义用户常见的输入错误及正确映射：
```javascript
window.DATA_TYPO_MAP = {
  '王者荣幸': '王者荣耀',
  '和平精灵': '和平精英',
  '李白啊': '李白',
  ...
}
```

**修改场景**: 要纠正用户常见的错别字 → 添加新的映射

---

### **data/system-prompt.js** — DeepSeek 系统提示词
定义 AI 助手的角色、能力、行为边界。使用 DeepSeek 模式时会加载此提示词。

**修改场景**: 要改变 AI 的回复风格、添加特殊指示 → 编辑这个文件

---

### **data/video-templates.js** — 视频模板
定义各游戏的高光视频生成模板（配乐、转场效果、字幕等）。

**修改场景**: 要改变视频的生成样式 → 编辑这个文件

---

### **data/mock/*.js** — Mock 数据
存储各种卡片的模拟数据：

| 文件 | 内容 |
|------|------|
| `welfare.js` | 福利卡片数据（礼包、截止时间等） |
| `record.js` | 战绩数据（胜率、英雄、评分等） |
| `replay.js` | 复盘数据（建议、关键时刻等） |
| `misc.js` | 其他卡片（下载、皮肤、新闻等） |

**修改场景**: 要改变卡片显示的数据 → 直接编辑对应的文件

---

## 🔄 使用 DeepSeek vs 本地引擎的区别

### 本地引擎（默认）
- **流程**: 用户输入 → 意图识别 → 预定义卡片
- **优点**: 快速、准确、无需 API Key
- **缺点**: 只支持 12 种预定义意图

### DeepSeek 大模型
- **流程**: 用户输入 → DeepSeek 理解 → 自由生成回复
- **优点**: 理解能力强、支持任意话题、可陪聊
- **缺点**: 需要 API Key、响应较慢（1-3 秒）、可能产生幻觉

**启用方法**:
1. 点击右上角 ⚙️ 设置按钮
2. 输入 DeepSeek API Key
3. 点击保存

或者在 URL 中添加参数：
```
?key=sk-xxxx
```

---

## 🛠️ 快速修改指南

### 1. 要改福利数据？
编辑 `data/mock/welfare.js` → 修改 `MOCK_WELFARE_BY_GAME` 对象

### 2. 要添加新的意图类型？
1. 在 `data/intents.js` 添加新意图
2. 在 `js/response-builders.js` 添加 `buildXxxResponse()` 函数
3. 在 `buildResponse()` 路由中注册

### 3. 要改变意图识别的关键词？
编辑 `data/intents.js` → 修改对应意图的 `keywords`、`strongKeywords`、`patterns`

### 4. 要纠正谐音错别字？
编辑 `data/typo-abbr.js` → 添加新的映射

### 5. 要改变 UI 样式？
编辑 `index.html` → 修改 CSS 样式部分（第 200+ 行）

### 6. 要改变聊天交互逻辑？
编辑 `js/chat-controller.js` → 修改对应函数

---

## 📱 技术栈

- **前端**: 纯原生 HTML/CSS/JavaScript（无框架）
- **API**: DeepSeek Chat API（可选）
- **数据**: 本地 Mock 数据（无后端数据库）
- **适配**: 移动端响应式设计（iOS/Android）

---

## 🚀 工作流总结

```
┌─────────────────────────────────────────────────────────────┐
│                      用户输入消息                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   检查DeepSeek模式         本地引擎模式
        │                     │
        ▼                     ▼
   [deepseek-api.js]   [intent-engine.js]
   调用大模型API        意图识别
        │                     │
        │ (1-3秒)             │ (即时)
        ▼                     ▼
    自由回复      [response-builders.js]
                   生成预定义卡片
                        │
                        ▼
                  [chat-controller.js]
                   渲染到UI界面
                        │
                        ▼
                  消息气泡 + 卡片展示
```

---

## 📞 常见问题

**Q: 如何改变聊天面板的高度？**  
A: 编辑 `index.html` 第 288 行，改 `.ai-panel { min-height }` 的值

**Q: 如何新增一个游戏？**  
A: 在 `data/games.js` 中添加新的游戏记录，刷新页面即生效

**Q: 为什么有时候识别不了我的输入？**  
A: 意图识别依赖关键词匹配，可以：
1. 在 `data/intents.js` 添加新的关键词
2. 在 `data/typo-abbr.js` 纠正谐音错别字
3. 或使用 DeepSeek 模式（理解能力更强）

**Q: 如何禁用某个意图？**  
A: 在 `data/intents.js` 中注释掉或删除该意图对象

---

## 📝 版本历史

- **v1.0** — 初始版本，支持 12 种意图 + DeepSeek 集成
