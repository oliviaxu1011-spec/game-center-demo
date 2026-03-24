# AIBot — QQ游戏中心 AI意图识别 Demo

> 基于纯原生 HTML/CSS/JS 构建的移动端 AI 聊天助手 Demo，模拟 QQ 游戏中心内的 AI 课代表交互体验。
> 支持 12 种游戏垂类意图识别 + DeepSeek 大模型 + 联网实时搜索。

---

## 📁 项目结构

```
代码/
├── index.html                    # 主页面入口（全部 HTML 结构）
├── README.md                     # 本文件
├── MOCK-DATA-GUIDE.md            # Mock 数据维护指南
├── 游戏礼包跳转地址.xlsx          # 参考文档：游戏礼包链接
├── 游戏信息.xlsx                  # 参考文档：游戏基础信息
├── 游戏战绩数据维度.xlsx          # 参考文档：战绩数据维度定义
│
├── css/                          # 样式文件（按模块拆分）
│   ├── variables.css             # CSS 变量 + 全局 Reset
│   ├── landing.css               # 落地页样式
│   ├── app.css                   # 主应用页样式（导航栏、Tab 页签、游戏卡片）
│   ├── ai-panel.css              # AI 聊天面板样式（QQ AIO 风格）
│   ├── game-tab.css              # 游戏 Tab 页模块样式
│   ├── video-card.css            # 视频卡片样式
│   └── responsive.css            # 响应式 + 移动端适配（iOS 安全区、键盘弹起等）
│
├── js/                           # 业务逻辑（按职责拆分）
│   ├── intent-engine.js          # 意图识别引擎（模糊匹配、容错、游戏/英雄/时间检测）
│   ├── data-generators.js        # 动态数据生成器（战绩、复盘等 Mock 数据）
│   ├── deepseek-api.js           # DeepSeek 大模型 API 调用
│   ├── web-search.js             # 联网搜索模块（百度搜索 + CORS 代理竞速）
│   ├── response-builders.js      # 响应构建器（12 种意图的卡片生成 + 功能×游戏支持范围）
│   ├── video-handler.js          # 视频生成/播放/分享交互
│   └── chat-controller.js        # 聊天主控制器（UI 渲染、面板控制、消息收发）
│
├── data/                         # 数据配置
│   ├── intents.js                # 意图定义（12 种意图 + 关键词 + 正则）
│   ├── games.js                  # 游戏数据库（游戏列表 + 识别关键词）
│   ├── heroes.js                 # 英雄数据库（各游戏英雄 + 别名）
│   ├── typo-abbr.js              # 谐音/错别字纠正映射
│   ├── video-templates.js        # 视频模板配置
│   ├── system-prompt.js          # DeepSeek 系统提示词
│   ├── deepseek-config.js        # DeepSeek API 配置（Key/URL/Model）
│   ├── pullback-fallback.js      # 拉回话题/降级处理逻辑
│   └── mock/                     # Mock 数据
│       ├── welfare.js            # 福利卡片数据
│       ├── record.js             # 战绩数据
│       ├── replay.js             # 回放/复盘数据
│       ├── partner.js            # 找搭子数据
│       └── misc.js               # 其他卡片（下载、皮肤、资讯等）
│
├── game-tab-assets/              # 游戏 Tab 页图片资源
│   ├── game-promo-bg.png         # 推广大卡背景
│   ├── icon-wangzhe.png          # 王者荣耀图标
│   ├── icon-yuanmeng.png         # 元梦之星图标
│   ├── icon-jinchan.png          # 金铲铲之战图标
│   ├── icon-*.png                # 其他游戏图标
│   ├── icon-tab-*.svg            # 底部 TabBar 图标
│   ├── nav-right-icon.png        # 导航栏右侧功能入口图标
│   └── 小游戏.svg                # 小游戏角标
│
├── icons/                        # 通用图标
│   └── mic-icon.svg              # 麦克风图标（语音入口）
│
└── my-tab-assets/                # 我的 Tab 页图片资源
    └── bottom-tabbar.png         # TabBar 参考截图
```

---

## 🖥️ 页面模块结构

> 下面从整体架构到各模块 DOM 层级进行完整拆解，包含关键样式参数和类名映射。

### 整体页面架构（概览）

```
index.html
│
├── 🟢 #screen-landing — 落地页（首屏展示）
│   └── .landing-content
│       ├── Logo + 标题 + 副标题
│       ├── 意图标签矩阵（12 个 .intent-pill）
│       └── [进入Demo] 按钮 → startDemo()
│
├── 🔵 #screen-app — 主应用页（游戏 Tab 页）
│   ├── .page-inner — 页面主体（可滚动区域）
│   │   │
│   │   ├── 1️⃣ .top-fixed — 顶部固定导航区
│   │   │   └── .nav-bar — 导航栏
│   │   │       ├── .nav-back        返回按钮 ← 
│   │   │       ├── .search-box      搜索框（点击打开 AI 面板）
│   │   │       └── .nav-gift-btn    右侧功能入口图标
│   │   │
│   │   ├── 2️⃣ .tab-navigation — Tab 页签栏
│   │   │   └── 推荐 | 新游 | 热玩 | 期待 | 内测 | 分类
│   │   │
│   │   ├── 3️⃣ .promo-section — 游戏推广大卡
│   │   │   ├── .promo-card
│   │   │   │   ├── .promo-card-top       推广大图
│   │   │   │   └── .promo-card-bottom    毛玻璃底栏
│   │   │   │       ├── 游戏图标 + 名称 + 标签 + 公司 + 大小
│   │   │   │       └── [下载] 按钮
│   │   │   └── .carousel-dots           轮播指示器（3 dots）
│   │   │
│   │   ├── 4️⃣ .game-module — 模拟经营游戏（横滑分页模块）
│   │   │   ├── .module-header + .module-title
│   │   │   └── .game-swipe-container
│   │   │       ├── 第 1 页：圣斗士星矢 | 地铁跑酷(小游戏) | 火影忍者
│   │   │       └── 第 2 页：三国冰河时代(小游戏) | 金铲铲之战 | 欢乐麻将(小游戏)
│   │   │
│   │   ├── .divider-module — 模块间分割线
│   │   │
│   │   └── 5️⃣ .game-module — 人气竞速与跑酷游戏（横滑分页模块）
│   │       ├── .module-header + .module-title
│   │       └── .game-swipe-container
│   │           └── 第 1 页：王者荣耀 | 元梦之星 | 金铲铲之战
│   │
│   └── .bottom-nav-design — 底部固定 TabBar
│       └── .bottom-nav-inner
│           ├── 🎮 游戏 (active)
│           ├── 🤝 搭子
│           ├── 🪶 鹅毛
│           └── 👤 我的
│
├── 🟠 #overlay — 遮罩层（打开 AI 面板时显示）
│
└── 🟣 #aiPanel — AI 聊天面板（QQ AIO 风格，底部弹出）
    ├── .ai-panel-handle          拖拽手柄条
    │
    ├── .aio-nav-bar — 聊天顶部导航
    │   └── .aio-title-bar
    │       ├── .aio-left         ← 返回 + "游戏课代表" + AI 标签
    │       └── .aio-right        ≡ 菜单按钮（打开设置）
    │
    ├── #settingsPanel — 设置面板（隐藏，展开显示）
    │   ├── DeepSeek API Key 输入框
    │   ├── [保存] 按钮
    │   └── 状态提示文字
    │
    ├── .chat-area #chatArea — 聊天消息区（动态渲染）
    │   ├── AI 消息气泡（.msg .msg-ai）
    │   │   ├── 头像
    │   │   ├── 文本消息
    │   │   └── 卡片内容（福利卡片/战绩卡片/复盘卡片/...）
    │   └── 用户消息气泡（.msg .msg-user）
    │
    └── .aio-bottom-fixed — 底部固定输入区
        ├── .aio-quick-actions    快捷操作标签（12 个按钮）
        │   └── 福利/礼包 | 战绩查询 | AI复盘 | 找搭子 | ...
        ├── .aio-input-bar        输入栏
        │   ├── 🎤 麦克风按钮
        │   └── 💬 文字输入框
        └── .aio-home-indicator   iOS Home Indicator
```

### 页面顶层分屏架构

| 层级 | 元素 | 类名/ID | 功能 | z-index |
|:---|:---|:---|:---|:---|
| L0 | 落地页 | `#screen-landing` | 启动引导页，深色 | — |
| L0 | 游戏Tab页 | `#screen-app` | 核心内容页，白色 | — |
| L1 | 遮罩层 | `#overlay` | AI面板弹出时的半透明遮罩 | 150 |
| L2 | AI对话面板 | `#aiPanel` | 底部弹出式全屏对话 | 200 |

> 屏幕切换机制：`.screen` 默认 `display:none`，`.screen.active` 才可见。

---

### 落地页详细 DOM 结构 `#screen-landing`

```
#screen-landing (.screen.active)
├── .landing-content
│   ├── .logo-icon           🎮 浮动动画LOGO (80×80, 圆角24, float动画3s)
│   ├── .logo-title          "游戏中心 AI助手"
│   ├── .logo-sub            英文副标题
│   ├── h1.landing-title     标语"从找功能到问一问" (34px/900字重)
│   │   └── .hl              蓝色渐变高亮文字
│   ├── p.landing-desc       描述文字
│   ├── .intent-pills        意图标签横滑区 (单行横滑, 隐藏滚动条)
│   │   └── .intent-pill ×12 灰底蓝字标签
│   └── button.start-btn     "进入Demo · 自由对话 →" (100%宽, 蓝色渐变+阴影)
```

**关键样式**:
| 模块 | 样式描述 | 对应类名 |
|:---|:---|:---|
| 背景 | 深色渐变 `#0a0c14` + 两个呼吸光晕伪元素 | `#screen-landing::before/after` |
| LOGO | 80×80，圆角24，浮动动画 `float 3s` | `.logo-icon` |
| 标题 | 34px/900 字重，蓝色渐变高亮 | `.landing-title .hl` |
| 意图标签 | 单行横滑，隐藏滚动条，灰底蓝字 | `.intent-pills > .intent-pill` |
| CTA按钮 | 100%宽，蓝色渐变+阴影，hover上浮 | `.start-btn` |

---

### 游戏Tab页详细 DOM 结构 `#screen-app`

```
#screen-app (.screen)
├── .page-inner
│   ├── [1] .top-fixed                    ← sticky 置顶导航
│   │   └── .nav-bar (h=50px)
│   │       ├── .nav-back                 返回按钮 (SVG箭头)
│   │       ├── .search-box               搜索框（点击→打开AI面板）
│   │       │   ├── svg.search-icon       搜索图标
│   │       │   └── span.search-text      "搜索游戏、攻略、视频"
│   │       └── .nav-gift-btn             右侧功能入口 (PNG图标)
│   │
│   ├── [2] .tab-navigation               ← sticky 置顶Tab，top:50px
│   │   └── button.tab-item × 6          推荐|新游|热玩|期待|内测|分类
│   │
│   ├── [3] .promo-section                ← 推广大卡片区
│   │   ├── .promo-card (h=277px)
│   │   │   ├── .promo-card-top (h=193px)
│   │   │   │   ├── img                   推广背景大图
│   │   │   │   └── .promo-title-overlay  底部渐变覆盖
│   │   │   └── .promo-card-bottom (h=88px)
│   │   │       ├── .promo-blur-layer     毛玻璃底层
│   │   │       │   ├── .promo-blur-base  黑底
│   │   │       │   ├── img.promo-blur-img 偏移放大的背景图
│   │   │       │   └── .promo-blur-glass  backdrop-filter:blur(100px)
│   │   │       └── .promo-game-info      游戏信息行
│   │   │           ├── img.promo-game-icon    52×52图标
│   │   │           ├── .promo-game-text
│   │   │           │   ├── .promo-game-name   游戏名称
│   │   │           │   ├── .promo-game-desc   类型描述
│   │   │           │   └── .promo-game-meta   公司+包体大小
│   │   │           └── button.promo-download-btn  下载按钮(毛玻璃)
│   │   └── .carousel-dots × 3            轮播指示点
│   │
│   ├── [4] .game-module                   ← "模拟经营游戏" 横滑分页
│   │   ├── .module-header > h3.module-title
│   │   └── .game-swipe-container
│   │       ├── .game-swipe-page (第1页)  3个 .design-game-item
│   │       └── .game-swipe-page-2 (第2页) 3个 .design-game-item
│   │
│   ├── .divider-module (h=8px)            模块间分割
│   │
│   └── [5] .game-module                   ← "人气竞速与跑酷游戏" 横滑分页
│       ├── .module-header > h3.module-title
│       └── .game-swipe-container
│           └── .game-swipe-page (1页)    3个 .design-game-item
│
└── .bottom-nav-design                     ← 底部TabBar (fixed)
    └── .bottom-nav-inner
        ├── .bottom-nav-item.active        游戏 (SVG)
        ├── .bottom-nav-item               搭子 (SVG)
        ├── .bottom-nav-item               鹅毛 (SVG)
        └── .bottom-nav-item               我的 (SVG)
```

---

### 游戏列表项结构（通用）

```
.design-game-item — 单个游戏行
├── .game-icon-wrap [.mini-game]  游戏图标容器 (52×52)
│   ├── <img>                     游戏图标
│   └── .mini-game-badge          小游戏角标 (17×17, 可选)
├── .game-info                    游戏信息区
│   ├── .game-name-row > .game-name  游戏名称 (16px)
│   ├── .game-subtitle            标签+描述 (12px)
│   │   └── .tag-text | .desc-text | .rank-badge 等
│   └── .game-meta                公司+大小 (10px, 可选)
└── button.game-download-btn      下载/立即玩 (74×32)
```

**列表项类型区分**:
| 区分标志 | 样式差异 |
|:---|:---|
| 普通游戏 | `.game-icon-wrap` 方角 `border-radius:10.4px`，有 `.game-meta` |
| 小游戏 | `.game-icon-wrap.mini-game` 圆形，带 `.mini-game-badge`，按钮文案"立即玩" |
| 人气榜 | `.rank-badge` 蓝色闪电图标 + "人气榜TOPxx" |

---

### AI 对话面板详细 DOM 结构 `#aiPanel`

```
#aiPanel (.ai-panel.hidden)
├── .ai-panel-handle               拖拽手柄（已隐藏）
│
├── nav.aio-nav-bar                QQ AIO 风格导航栏
│   └── .aio-title-bar
│       ├── .aio-left
│       │   ├── .aio-back          返回按钮 (SVG)
│       │   └── .aio-bot-info
│       │       ├── .aio-bot-name  "游戏课代表"
│       │       └── .aio-ai-badge  "AI" 紫色标签
│       └── .aio-right
│           └── .aio-menu-btn      三横线菜单 (SVG)
│
├── #settingsPanel (.hidden)        DeepSeek API Key 配置区
│   ├── 标题 "🤖 接入 DeepSeek 大模型"
│   ├── input#apiKeyInput + 保存按钮
│   └── #apiKeyStatus 状态提示
│
├── .chat-area#chatArea             可滚动消息区域（灰底 #F1F1F1）
│   └── (JS动态生成消息)
│       ├── .msg.user              用户消息（蓝色气泡，右对齐）
│       └── .msg.ai                AI回复（三段式布局）
│           └── .msg-content
│               ├── .ai-reply-card     主卡片（白底圆角16）
│               │   ├── .ai-reply-text     文本区
│               │   ├── .result-card       数据卡片（内嵌）
│               │   └── .ai-reply-buttons  操作按钮
│               ├── .ai-followups          追问建议（胶囊气泡）
│               └── .quick-replies         快捷回复
│
├── .aio-bottom-fixed
│   ├── .aio-quick-actions#inputHints   快捷标签横滑区
│   │   └── button.aio-quick-btn × 12  福利/战绩/复盘/找搭子...
│   └── .aio-input-bar                  输入栏
│       ├── .aio-input-content
│       │   ├── .aio-mic-btn           麦克风图标 (SVG)
│       │   └── input.aio-input-field  文字输入框
│       └── .aio-home-indicator        iOS Home Indicator模拟
│           └── .aio-home-indicator-bar (134×5 黑色圆角)
```

---

### AI 回复数据卡片类型（JS 动态渲染）

| 卡片类型 | 对应类名 | 意图场景 |
|:---|:---|:---|
| 福利列表 | `.welfare-list > .welfare-item` | 福利/礼包 |
| 战绩统计 | `.replay-card > .replay-stats` | 战绩查询 |
| AI复盘 | `.replay-card + .replay-insight` | AI复盘 |
| 搭子匹配 | `.partner-list > .partner-item` | 找搭子 |
| 资讯列表 | `.news-list > .news-item` | 游戏资讯 |
| 下载卡片 | `.download-card` | 游戏下载 |
| 皮肤横滑 | `.skin-scroll > .skin-card` | 皮肤购买 |
| 周报统计 | `.report-card` | 日报周报 |
| 情绪互动 | `.emotion-card > .emotion-actions` | 情绪互动 |
| 定时提醒 | `.reminder-card` | 定时提醒 |
| 视频卡片 | `.video-card-hero` / `.video-ondemand-*` | 高光视频 |
| 联网搜索 | `.news-search-status` + `.news-live-*` | 实时搜索 |

---

### 全局尺寸约束

| 参数 | 值 |
|:---|:---|
| 最大宽度 | `430px`（模拟手机屏宽） |
| 居中方式 | `margin:0 auto` + `max-width:430px` |
| 底部安全区 | `env(safe-area-inset-bottom)` 或 `28px` |
| 桌面端 | 灰色背景 `#f0f1f3` + `box-shadow` 投影 |
| 圆角体系 | 卡片 `16px`、按钮 `100px/16px`、图标 `10.4px`、输入框 `8-12px` |
| 主色调 | `#0099FF`（蓝）、`#1A1C1E`（文字黑）、`#F1F1F1`（聊天区灰底） |

---

## 🎯 核心业务流程

### 消息处理全流程

```
用户输入消息
    │
    ├──────────── DeepSeek 模式已开启？
    │                │
    │           YES  │  NO
    │                │
    ▼                ▼
[deepseek-api.js] [intent-engine.js]
  调用大模型 API    本地意图识别
  (1-3 秒)          (即时)
    │                │
    │                ├── 识别到意图 + 游戏/英雄/时间
    │                │
    │                ▼
    │         [response-builders.js]
    │           │
    │           ├── 检查功能×游戏支持范围 (FEATURE_GAME_SCOPE)
    │           │   ├── ✅ 支持 → 生成对应卡片
    │           │   └── ❌ 不支持 → 友好提示 + 引导到支持的游戏
    │           │
    │           ├── 需要联网搜索？（资讯/攻略）
    │           │   └── [web-search.js] 百度搜索 + CORS 代理竞速
    │           │
    │           └── 返回 { text, cardHtml, quickReplies }
    │                │
    ▼                ▼
        [chat-controller.js]
          渲染到 UI 界面
              │
              ▼
        消息气泡 + 卡片展示 + 快捷回复按钮
```

---

## 🔧 功能×游戏支持范围配置

在 `js/response-builders.js` 中通过 `FEATURE_GAME_SCOPE` 统一管理：

| 功能 | 配置值 | 说明 |
|:---|:---|:---|
| `welfare` 福利 | `'ALL'` | 全部游戏 |
| `record` 战绩 | `['wzry','hpjy','sjz','hyrz','wwqy','aqtw','cfm']` | 仅支持 7 款游戏 |
| `replay` 复盘 | `['wzry']` | 仅王者荣耀 |
| `partner` 找搭子 | `'ALL'` | 全部游戏 |
| `news` 资讯 | `'ALL'` | 全部游戏 |
| `guide` 攻略 | `'ALL'` | 全部游戏 |
| `highlight` 高光 | `'ALL'` | 全部游戏 |
| `download` 下载 | `'ALL'` | 全部游戏 |
| `skin` 皮肤 | `'ALL'` | 全部游戏 |
| `report` 日报/周报 | `'NONE'` | 不区分游戏 |
| `emotion` 情绪互动 | `'NONE'` | 不区分游戏 |
| `reminder` 提醒 | `'ALL'` | 全部游戏 |

**不支持的游戏会怎样？** → 自动显示友好提示文案 + 引导到支持的游戏快捷回复按钮

---

## 📄 各 JS 文件详细说明

### 1. **chat-controller.js** — 聊天主控制器
**位置**: `js/chat-controller.js`
**职责**: 聊天主流程、UI 渲染、面板控制、移动端适配

**主要函数**:
| 函数 | 作用 |
|:---|:---|
| `toggleChatPanel()` | 打开/关闭聊天面板 |
| `toggleSettingsPanel()` | 打开/关闭设置面板 |
| `sendMessage()` | 发送消息（输入 → 意图识别 → 渲染回复） |
| `addUserBubble(text)` | 添加用户消息气泡 |
| `addAIBubble(text, cardId, cardData, cardHtml)` | 添加 AI 消息气泡（支持卡片） |
| `handleKeyPress(e)` | 回车键发送 |
| `saveApiKey()` | 保存 DeepSeek API Key |
| `updateModeLabel()` | 更新引擎模式标签 |

---

### 2. **intent-engine.js** — 意图识别引擎
**位置**: `js/intent-engine.js`
**职责**: 模糊语义识别、容错匹配、游戏/英雄/时间检测

**核心能力**:
1. **编辑距离算法** — 纠正错别字/谐音字（如 "王者荣幸" → "王者荣耀"）
2. **关键词匹配** — 三级匹配（强关键词 > 弱关键词 > 正则模式）
3. **游戏检测** — 识别用户提到的游戏
4. **英雄检测** — 识别用户提到的英雄/武器
5. **时间解析** — "最近" → `week`、"昨天" → `yesterday`

**主要函数**:
| 函数 | 作用 |
|:---|:---|
| `editDistance(a, b)` | 计算编辑距离 |
| `correctTypos(text)` | 纠正错别字/谐音 |
| `detectGame(text)` | 识别游戏 |
| `detectHero(text, gameId)` | 识别英雄 |
| `parseTimeRange(text)` | 解析时间范围 |
| `detectIntent(text)` | 识别意图（返回意图对象 + 置信度） |

---

### 3. **response-builders.js** — 响应构建器
**位置**: `js/response-builders.js`
**职责**: 根据意图 ID 生成回复（文本 + HTML 卡片）+ 功能×游戏支持范围管理

**12 种意图对应的构建函数**:

| 意图 ID | 构建函数 | 作用 |
|:---|:---|:---|
| `welfare` | `buildWelfareResponse()` | 福利/礼包卡片 |
| `record` | `buildRecordResponse()` | 战绩查询卡片 |
| `replay` | `buildReplayResponse()` | AI 复盘卡片 |
| `partner` | `buildPartnerResponse()` | 找搭子卡片 |
| `news` | `buildNewsResponse()` | 资讯卡片（联网搜索） |
| `guide` | `buildGuideResponse()` | 攻略指南卡片（联网搜索） |
| `highlight` | `buildHighlightResponse()` | 高光视频卡片 |
| `download` | `buildDownloadResponse()` | 游戏下载卡片 |
| `skin` | `buildSkinResponse()` | 皮肤展示卡片 |
| `report` | `buildReportResponse()` | 周报/数据报告卡片 |
| `emotion` | `buildEmotionResponse()` | 情绪互动（陪聊） |
| `reminder` | `buildReminderResponse()` | 提醒/通知 |

**辅助函数**:
| 函数 | 作用 |
|:---|:---|
| `buildResponse(intentId, text)` | 响应路由器，分发到对应 build 函数 |
| `renderGameIcon(obj, size, ...)` | 游戏图标渲染（三级回退：在线URL→本地→Emoji） |
| `isGameSupportedForFeature(gameId, feature)` | 检查某游戏是否支持某功能 |
| `getFeatureSupportedGames(feature)` | 获取某功能支持的游戏列表 |
| `getUnsupportedGameTip(feature, gameName)` | 生成"不支持该游戏"的友好提示文案 |

---

### 4. **web-search.js** — 联网搜索模块
**位置**: `js/web-search.js`
**职责**: 为资讯/攻略意图提供百度联网实时搜索能力

**核心特性**:
- 🏎️ 多 CORS 代理**并发竞速**（6 个代理池，谁先返回用谁）
- 📦 搜索结果缓存（30 分钟 TTL）
- ⏱️ 7 秒超时控制
- 📰 自动解析百度搜索结果为标题+摘要+链接

**降级策略**: 搜索超时/失败 → 自动降级到本地 Mock 数据

---

### 5. **deepseek-api.js** — 大模型 API 调用
**位置**: `js/deepseek-api.js`
**职责**: DeepSeek API 调用封装、请求构建、错误处理

**核心特性**:
- 支持 3 种方式填入 API Key（URL 参数优先级最高）
- 自动加入 System Prompt 和对话历史
- 10 秒超时控制
- 自动剔除过长历史，优化 Token 消耗

---

### 6. **video-handler.js** — 视频处理
**位置**: `js/video-handler.js`
**职责**: 视频生成、播放、分享的交互逻辑

---

### 7. **data-generators.js** — 动态数据生成器
**位置**: `js/data-generators.js`
**职责**: 根据时间范围、游戏类型生成逼真的 Mock 数据

**主要函数**: `genRecordData()`、`genReplayData()`、`genPartnerData()` 等

---

## 🎨 CSS 架构说明

| 文件 | 职责 | 关键类名 |
|:---|:---|:---|
| `variables.css` | CSS 变量（色彩体系）+ 全局 Reset | `:root` 变量、`html`/`body` 基础样式 |
| `landing.css` | 落地页样式 | `#screen-landing`、`.landing-*`、`.intent-pill` |
| `app.css` | 主应用页样式 | `#screen-app`、`.app-header`、`.nav-bar`、`.search-box` |
| `game-tab.css` | 游戏 Tab 模块样式 | `.page-inner`、`.tab-navigation`、`.promo-*`、`.game-module`、`.design-game-item`、`.bottom-nav-*` |
| `ai-panel.css` | AI 聊天面板 | `.ai-panel`、`.aio-*`、`.chat-area`、`.msg`、`.msg-ai`、`.msg-user` |
| `video-card.css` | 视频相关卡片 | `.video-card`、`.video-player` |
| `responsive.css` | 响应式/移动端适配 | `@media` 查询、iOS 安全区、键盘弹起适配、`overscroll` 处理 |

**色彩体系**（`variables.css`）:
| 变量 | 值 | 用途 |
|:---|:---|:---|
| `--bg-deep` | `#0a0c14` | 落地页深色背景 |
| `--accent-blue` | `#0099FF` | 主强调色（按钮、链接） |
| `--text-primary` | `#f0f2ff` | 主文字色（深色主题） |
| `--text-secondary` | `#8b92b5` | 次要文字色 |

**应用页色值**:
| 区域 | 背景色 |
|:---|:---|
| `#screen-app` 主应用页 | `#FFFFFF` |
| `.chat-area` 聊天区 | `#F1F1F1` |
| `html` overscroll 背景 | `#F1F1F1`（与聊天区一致） |

---

## 📊 数据文件说明

### data/intents.js — 意图配置
定义 12 种意图，每种包含：`id`、`label`、`keywords`（弱匹配）、`strongKeywords`（强匹配）、`patterns`（正则）

### data/games.js — 游戏数据库
```javascript
{ id: 'wzry', name: '王者荣耀', icon: '⚔️', keywords: ['王者', '荣耀', ...] }
```

### data/heroes.js — 英雄数据库
```javascript
window.DATA_HERO_DB = {
  wzry: { '李白': ['李白', '剑仙', 'lb'], '诸葛亮': ['诸葛', '孔明', 'zgl'], ... },
  ...
}
```

### data/typo-abbr.js — 谐音/错别字纠正
```javascript
{ '王者荣幸': '王者荣耀', '和平精灵': '和平精英', ... }
```

### data/system-prompt.js — DeepSeek 系统提示词
定义 AI 助手的角色、能力、行为边界。

### data/pullback-fallback.js — 拉回话题/降级处理
定义跑题时的拉回策略和降级方案。

### data/mock/*.js — Mock 数据
| 文件 | 内容 |
|:---|:---|
| `welfare.js` | 各游戏的福利/礼包卡片数据 |
| `record.js` | 战绩数据（胜率、英雄、评分等） |
| `replay.js` | AI 复盘数据（关键时刻、建议等） |
| `partner.js` | 找搭子列表数据 |
| `misc.js` | 其他卡片（下载、皮肤、资讯等） |

---

## 🔄 双引擎模式对比

| | 本地引擎（默认） | DeepSeek 大模型 |
|:---|:---|:---|
| **流程** | 输入 → 意图识别 → 预定义卡片 | 输入 → 大模型理解 → 自由回复 |
| **速度** | 即时 | 1-3 秒 |
| **优点** | 快速、准确、离线可用 | 理解力强、支持任意话题 |
| **缺点** | 仅 12 种预定义意图 | 需 API Key、可能产生幻觉 |

**启用 DeepSeek**:
1. 点击右上角 ≡ 菜单 → 输入 API Key → 保存
2. 或 URL 参数：`?key=sk-xxxx`

---

## 🛠️ 快速修改指南

| 想改什么 | 改哪里 |
|:---|:---|
| 福利/礼包数据 | `data/mock/welfare.js` |
| 添加新意图类型 | ① `data/intents.js` 加意图 → ② `js/response-builders.js` 加 `buildXxxResponse()` → ③ 在 `buildResponse()` 路由注册 |
| 调整意图关键词 | `data/intents.js` 的 `keywords` / `strongKeywords` / `patterns` |
| 纠正新的谐音错别字 | `data/typo-abbr.js` 添加映射 |
| 新增游戏 | `data/games.js` 添加游戏记录 |
| 改变某功能支持的游戏范围 | `js/response-builders.js` 的 `FEATURE_GAME_SCOPE` |
| 修改聊天交互逻辑 | `js/chat-controller.js` |
| 修改 UI 样式 | 对应的 `css/*.css` 文件 |
| 修改联网搜索配置 | `js/web-search.js` 的 `WEB_SEARCH_CONFIG` |

---

## 📱 技术栈

- **前端**: 纯原生 HTML/CSS/JavaScript（零框架依赖）
- **AI**: DeepSeek Chat API（可选，不启用也可运行）
- **联网搜索**: 百度搜索 + 多 CORS 代理并发竞速
- **数据**: 本地 Mock 数据（无后端数据库）
- **适配**: 移动端优先设计（iOS/Android，支持安全区、键盘弹起、overscroll 防护）

---

## 🚀 工作流总结

```
┌────────────────────────────────────────────────────────────────────┐
│                         用户输入消息                                │
└─────────────────────┬──────────────────────────────────────────────┘
                      │
           ┌──────────┴──────────┐
           │                     │
      检查 DeepSeek 模式       本地引擎模式
           │                     │
           ▼                     ▼
    [deepseek-api.js]    [intent-engine.js]
     调用大模型 API        意图识别 + 游戏/英雄检测
           │                     │
           │ (1-3秒)             │ (即时)
           ▼                     ▼
       自由回复       [response-builders.js]
                        │
                        ├── 检查 FEATURE_GAME_SCOPE
                        │   └── 不支持？→ 友好提示 + 引导
                        │
                        ├── 需要联网？→ [web-search.js]
                        │   └── 超时？→ 降级 Mock 数据
                        │
                        └── 生成卡片 + 快捷回复
                             │
                             ▼
                     [chat-controller.js]
                      渲染到 UI 界面
                             │
                             ▼
                    消息气泡 + 卡片 + 快捷回复按钮
```

---

## 📞 常见问题

**Q: 怎么本地运行？**
A: 直接在浏览器打开 `index.html` 即可。联网搜索功能需要网络连接。

**Q: 如何新增一个游戏？**
A: 在 `data/games.js` 添加游戏记录，刷新页面即生效。

**Q: 某个功能不支持某游戏怎么调？**
A: 修改 `js/response-builders.js` 的 `FEATURE_GAME_SCOPE`，改对应功能的游戏列表。

**Q: 为什么意图识别有时不准？**
A: 可以：① 在 `data/intents.js` 添加关键词 ② 在 `data/typo-abbr.js` 纠正谐音 ③ 开启 DeepSeek 模式

**Q: 联网搜索失败怎么办？**
A: 自动降级到本地 Mock 数据。可在 `js/web-search.js` 添加新的 CORS 代理。

---

## 📝 版本历史

- **v1.2** — 新增联网搜索（百度 + CORS 代理竞速）、功能×游戏支持范围配置、不支持游戏的友好拦截引导、overscroll 防护优化
- **v1.1** — 新增 web-search.js 联网搜索模块、partner.js 找搭子 Mock 数据
- **v1.0** — 初始版本，支持 12 种意图 + DeepSeek 集成
