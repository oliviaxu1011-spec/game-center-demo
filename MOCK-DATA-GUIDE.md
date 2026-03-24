# AIbot Mock 数据整理指引 & 任务计划

> 📅 创建日期：2026-03-23
> 🎯 目标：系统性整理和优化 AIbot 项目的 mock 数据，提升数据质量、一致性和可维护性

---

## 一、项目背景

AIbot 是一个游戏 AI 助手的 Demo 原型，核心功能是通过对话为用户提供：战绩查询、AI 复盘、找搭子、福利查询、游戏资讯、攻略、高光时刻、皮肤推荐、游戏下载、情绪互动、定时提醒、日报/周报等 **12 种意图** 的响应卡片。

目前所有数据都是前端 mock 的，分布在 `data/` 和 `data/mock/` 目录下。数据存在**冗余、不一致、硬编码**等问题，需要统一整理。

### 1.1 支持的 5 款核心游戏

| 游戏 ID | 名称 | 图标 |
|---------|------|------|
| `wzry` | 王者荣耀 | ⚔️ |
| `hpjy` | 和平精英 | 🪂 |
| `sjz` | 三角洲行动 | 🔫 |
| `lol` | 英雄联盟手游 | 🏰 |
| `ys` | 原神 | 🌍 |

### 1.2 核心原则

- **`DATA_GAMES` 是唯一的游戏信息源**：游戏名称、图标、颜色等信息只在 `data/games.js` 定义一次，其他文件不要重复硬编码
- **游戏 ID 是数据枢纽**：所有按游戏分组的数据都用 `wzry/hpjy/sjz/lol/ys` 作为 key
- **字段命名保持一致**：同一概念在所有文件中用相同的字段名
- **数据要"像真的"**：虽然是 mock 数据，但内容应该合理、可信，不要出现明显假数据

---

## 二、文件总览 & 数据地图

### 2.1 文件结构

```
代码/
├── data/
│   ├── games.js              ← 🔑 游戏数据库（核心源）
│   ├── heroes.js             ← 英雄/角色/武器数据库
│   ├── intents.js            ← 意图识别配置
│   ├── deepseek-config.js    ← DeepSeek API 配置（不用改）
│   ├── system-prompt.js      ← AI 系统提示词
│   ├── pullback-fallback.js  ← 拉回策略 + 兜底回复
│   ├── typo-abbr.js          ← 谐音纠错 + 拼音缩写
│   ├── video-templates.js    ← 视频模板配置
│   └── mock/
│       ├── misc.js           ← ⚠️ 最大文件，混合了 9 个变量
│       ├── partner.js        ← 找搭子数据
│       ├── record.js         ← 战绩查询数据
│       ├── replay.js         ← AI 复盘 + 日报/周报
│       └── welfare.js        ← 福利/礼包数据
└── js/
    ├── response-builders.js  ← 响应构建（消费 mock 数据的主文件）
    ├── data-generators.js    ← 数据生成器（战绩/复盘/报告动态生成）
    ├── intent-engine.js      ← 意图引擎
    ├── chat-controller.js    ← 对话控制器
    ├── video-handler.js      ← 视频处理
    └── deepseek-api.js       ← API 调用
```

### 2.2 数据关联地图

```
DATA_GAMES[gameId]             ← 游戏基础信息（名称/图标/颜色）
    │
    ├── DATA_HERO_DB[gameId]           ← 该游戏的英雄列表
    ├── DATA_VIDEO_TEMPLATES[gameId]   ← 该游戏的视频模板
    ├── MOCK_NEWS_DATA[gameId]         ← 该游戏的资讯
    ├── MOCK_GUIDE_DATA[gameId]        ← 该游戏的攻略（出装+技巧）
    ├── MOCK_HIGHLIGHT_DATA[gameId]    ← 该游戏的高光时刻
    ├── MOCK_SKIN_BY_GAME[gameId]      ← 该游戏的皮肤
    ├── MOCK_DOWNLOAD_DATA[gameId]     ← 该游戏的下载页信息
    ├── MOCK_PARTNER_DATA[gameId]      ← 该游戏的搭子
    ├── MOCK_GAME_HEROES[gameId]       ← 该游戏的战绩英雄胜率
    ├── MOCK_REPLAY_PRESETS[gameId]    ← 该游戏的复盘数据
    ├── MOCK_WELFARE_BY_GAME[gameId]   ← 该游戏的福利
    ├── MOCK_DETAIL_PRESETS[gameId]    ← 该游戏的详细数据面板
    └── MOCK_MODE_MAP[gameId]          ← 该游戏的模式名称
```

### 2.3 全局变量清单（28 个）

| 分类 | 变量名 | 文件 | 数据量 |
|------|--------|------|--------|
| **核心配置** | `DATA_GAMES` | games.js | 5 款游戏 |
| | `DATA_DEFAULT_GAME_ID` | games.js | 默认 `'wzry'` |
| | `DATA_HERO_DB` | heroes.js | 62 个英雄/角色 |
| | `DATA_INTENTS` | intents.js | 12 个意图 |
| | `DATA_DEEPSEEK_CONFIG` | deepseek-config.js | API 配置 |
| | `DATA_SYSTEM_PROMPT` | system-prompt.js | 系统提示词 |
| | `DATA_PULLBACKS` | pullback-fallback.js | 13 条拉回策略 |
| | `DATA_FALLBACKS` | pullback-fallback.js | 3 条兜底回复 |
| | `DATA_TYPO_MAP` | typo-abbr.js | 20 个纠错映射 |
| | `DATA_ABBR_MAP` | typo-abbr.js | 14 个缩写映射 |
| | `DATA_VIDEO_TEMPLATES` | video-templates.js | 20 个视频模板 |
| **Mock 数据** | `MOCK_NEWS_DATA` | mock/misc.js | 15 条资讯（5×3） |
| | `MOCK_GUIDE_DATA` | mock/misc.js | 5 套攻略 |
| | `MOCK_HIGHLIGHT_DATA` | mock/misc.js | 15 条高光 |
| | `MOCK_SKIN_BY_GAME` | mock/misc.js | 12 条皮肤 |
| | `MOCK_SKIN_DATA` | mock/misc.js | 上面的展平数组 |
| | `MOCK_DOWNLOAD_DATA` | mock/misc.js | 8 条下载信息 |
| | `MOCK_MODE_MAP` | mock/misc.js | 5 个模式映射 |
| | `MOCK_DETAIL_PRESETS` | mock/misc.js | 5 套详细数据 |
| | `MOCK_EMOTION_TEXT_MAP` | mock/misc.js | 9 个情绪映射 |
| | `MOCK_ROLE_KEYWORDS` | mock/partner.js | 10 个位置关键词 |
| | `MOCK_PARTNER_DATA` | mock/partner.js | 24 个搭子 |
| | `MOCK_GAME_HEROES` | mock/record.js | 战绩英雄数据 |
| | `MOCK_BASE_PRESETS` | mock/record.js | 7 个时间段预设 |
| | `MOCK_USER_GAMES` | mock/record.js | 5 条用户游戏概览 |
| | `MOCK_REPLAY_PRESETS` | mock/replay.js | 15 条复盘数据 |
| | `MOCK_REPORT_PRESETS` | mock/replay.js | 7 条报告预设 |
| | `MOCK_WELFARE_BY_GAME` | mock/welfare.js | 15 条福利 |
| | `MOCK_WELFARE_ITEMS` | mock/welfare.js | 6 组预构建卡片 |

---

## 三、已知问题清单 & 修复任务

### 🔴 P0 — 严重冗余（必须修）

#### 任务 1：消除 `MOCK_USER_GAMES` 的游戏信息冗余

**文件**：`data/mock/record.js`，第 47-53 行

**问题**：`MOCK_USER_GAMES` 数组中每个对象都硬编码了 `name, icon, iconUrl, iconLocal, color, gradient`，与 `DATA_GAMES` 完全重复。

**当前代码**：
```js
window.MOCK_USER_GAMES = [
  { id:'wzry', name:'王者荣耀', icon:'⚔️', iconUrl:'', iconLocal:'game-tab-assets/icon-wangzhe.png',
    color:'#c9a227', gradient:'linear-gradient(135deg,#c9a227,#f0d060)',
    matches:5, winRate:'40%', winColor:'#ef4444' },
  // ... 其他 4 款
];
```

**目标**：只保留该数组特有的业务字段（`matches, winRate, winColor, desc`），游戏基础信息在运行时从 `DATA_GAMES` 合并。

**改为**：
```js
window.MOCK_USER_GAMES = [
  { id:'wzry', matches:5, winRate:'40%', winColor:'#ef4444' },
  { id:'hpjy', matches:3, winRate:'33%', winColor:'#ef4444' },
  { id:'sjz',  matches:4, winRate:'50%', winColor:'#f59e0b' },
  { id:'lol',  matches:2, winRate:'50%', winColor:'#f59e0b' },
  { id:'ys',   desc:'深渊12层 · 探索度 85%' },
];
```

> ⚠️ **注意**：改完后需要在 `response-builders.js` 的 `buildRecordResponse` 函数中做合并：`const game = { ...DATA_GAMES[item.id], ...item }`。搜索 `MOCK_USER_GAMES` 找到消费它的代码一并调整。

---

#### 任务 2：消除 `MOCK_DOWNLOAD_DATA` 的游戏信息冗余

**文件**：`data/mock/misc.js`，第 128-136 行

**问题**：同任务 1，每条下载数据都重复了 `name, icon, iconUrl, iconLocal, bg`。

**目标**：只保留下载专有字段（`size, score, preOrder, goodRate`），基础信息从 `DATA_GAMES` 合并。

**改为**：
```js
window.MOCK_DOWNLOAD_DATA = {
  wzry:     { size:'3.8GB', score:'9.6', preOrder:'1,280,000', goodRate:'97%' },
  hpjy:     { size:'2.1GB', score:'9.5', preOrder:'860,000',  goodRate:'96%' },
  sjz:      { size:'3.2GB', score:'9.3', preOrder:'520,000',  goodRate:'94%' },
  lol:      { size:'3.5GB', score:'9.4', preOrder:'980,000',  goodRate:'95%' },
  ys:       { size:'4.2GB', score:'9.7', preOrder:'1,560,000',goodRate:'98%' },
  _default: { size:'1.2GB', score:'8.9', preOrder:'5,280',    goodRate:'91%' },
};
```

> ⚠️ **同时处理**：
> - 删除 `'三国志'` 和 `'和平'` 两个中文 key（它们分别是 `_default` 和 `hpjy` 的重复）
> - `response-builders.js` 的 `buildDownloadResponse` 函数需要做合并：`const dl = { ...DATA_GAMES[gameId], ...MOCK_DOWNLOAD_DATA[gameId] || MOCK_DOWNLOAD_DATA._default }`

---

### 🟡 P1 — 字段不一致（应该修）

#### 任务 3：统一 `MOCK_USER_GAMES` 中原神的结构

**文件**：`data/mock/record.js`

**问题**：其他 4 款游戏都有 `matches + winRate + winColor`，原神用 `desc` 替代（因为原神没有胜率概念）。

**目标**：保留 `desc` 但增加注释说明，让代码中对 `matches` 的判断有 fallback：
```js
{ id:'ys', desc:'深渊12层 · 探索度 85%' },  // 原神无对战胜率概念，用 desc 展示
```

> 消费代码（`buildRecordResponse`）已经有 `if (g.desc)` 的分支，这里只要确保注释清晰即可。

---

#### 任务 4：检查皮肤数据的"价格"字段一致性

**文件**：`data/mock/misc.js`，`MOCK_SKIN_BY_GAME`

**问题**：
- 王者荣耀/和平精英/三角洲/LOL 的皮肤价格都是"XX点券/XX金币"格式
- 原神的价格写的是"限定UP池"，不是价格而是获取方式

**目标**：统一改为 `price`（价格）+ `acquire`（获取方式）两个字段，或者 `price` 统一为"获取方式/价格"的描述字符串。由你决定哪种更合理。

---

#### 任务 5：修复 LOL 攻略数据的错字

**文件**：`data/mock/misc.js`，约第 54 行

**问题**：`'凡性之提醒'` 应为 `'凡性的提醒'`（游戏内道具名）

**操作**：全文搜索确认后替换。

---

#### 任务 6：整理 `MOCK_REPLAY_PRESETS` 的 KDA 字段

**文件**：`data/mock/replay.js`

**问题**：
- wzry/sjz/lol 没有 `kLabel/dLabel/aLabel`，用默认的 K/D/A
- hpjy 有自定义 `kLabel:'击杀', dLabel:'淘汰', aLabel:'救援'`
- ys 的 k/d/a 全为 0，用自定义 `kLabel:'深渊层数'` 等覆盖

**目标**：所有 5 款游戏都**显式写出** `kLabel/dLabel/aLabel`，不依赖 `||` fallback，提高可读性。例如：
```js
wzry: {
  today: { k:8, d:3, a:12, kLabel:'击杀', dLabel:'死亡', aLabel:'助攻', ... },
  ...
}
```

---

### 🟢 P2 — 内容丰富度提升（锦上添花）

#### 任务 7：丰富搭子数据

**文件**：`data/mock/partner.js`

**当前状态**：24 个搭子，分布不均（wzry 6 人，其他 4-5 人）。

**目标**：
- 每款游戏 **5-6 个搭子**，总数 25-30 人
- 搭子的 `rank`（段位）分布合理，不要全是最强王者/荣耀王者
- `tags[]` 增加更丰富的标签（如"周末在线"、"语音开黑"、"轻松休闲"等）
- `desc` 描述文案自然、口语化

---

#### 任务 8：丰富英雄数据库

**文件**：`data/heroes.js`

**当前状态**：62 个角色。

**目标**：
- 王者荣耀：当前 22 个，可扩充到 **30 个**（补几个热门英雄：瑶、鲁班、后羿、妲己、蒙犽等）
- 英雄联盟：当前 15 个，可扩充到 **20 个**
- 原神：当前 11 个，可扩充到 **15 个**（补纳西妲、芙宁娜、林尼等热门角色）
- 和平精英/三角洲保持不变（武器/兵种比较固定）
- 确保每个英雄的 `aliases[]` 至少有 1 个别名

---

#### 任务 9：丰富资讯 & 攻略内容

**文件**：`data/mock/misc.js` — `MOCK_NEWS_DATA` + `MOCK_GUIDE_DATA`

**目标**：
- 资讯每游戏 **5 条**（当前 3 条），标题要像真实游戏媒体标题
- 攻略的 `tips[]` 每游戏 **5 条**（当前 3 条）
- 出装 `equips[]` 数据检查准确性（是否为当前版本热门出装）

---

#### 任务 10：补充本地 icon 图片

**目录**：`game-tab-assets/`

**当前状态**：只有王者荣耀有本地 icon（`icon-wangzhe.png`），其他 4 款只有在线 URL。

**目标**：为 5 款核心游戏都准备本地 icon 图片，命名规范：
```
icon-wangzhe.png  ← 已有
icon-heping.png   ← 新增
icon-sanjiaozhou.png ← 新增
icon-lol.png      ← 新增
icon-yuanshen.png ← 新增
```

图片规格：**256×256 PNG**，圆角裁切由代码 CSS 处理。

> 准备好图片后，更新 `DATA_GAMES` 中对应游戏的 `iconLocal` 字段。

---

## 四、操作规范 & 注意事项

### 4.1 修改前必做

1. **理解数据流向**：修改任何 mock 数据之前，先搜索该变量在 `js/` 目录下的所有引用位置，理解数据怎么被消费的
2. **搜索命令**：在项目根目录执行 `grep -rn "变量名" js/` 找到所有引用点
3. **不要只改数据文件**：如果数据结构变了（比如删字段、改字段名），消费代码也必须同步修改

### 4.2 字段命名规范

| 概念 | 统一字段名 | 说明 |
|------|-----------|------|
| 游戏 ID | `id` | 枚举值：`wzry/hpjy/sjz/lol/ys` |
| 游戏名称 | `name` | 来自 `DATA_GAMES`，不要重复定义 |
| 图标 emoji | `icon` | 单个 emoji |
| 在线图标 URL | `iconUrl` | HTTPS 地址，可为空字符串 |
| 本地图标路径 | `iconLocal` | 相对路径，可为空字符串 |
| 主题色 | `color` | 十六进制色值 |
| 渐变色 | `gradient` | CSS `linear-gradient()` |
| 背景色 | `bg` | CSS `linear-gradient()` |

### 4.3 数据格式规范

```js
// ✅ 正确 — 用游戏 ID 做 key
MOCK_XXX_DATA = {
  wzry: { ... },
  hpjy: { ... },
  sjz:  { ... },
  lol:  { ... },
  ys:   { ... },
};

// ❌ 错误 — 用中文做 key
MOCK_XXX_DATA = {
  '王者荣耀': { ... },
  '和平':     { ... },  // 而且还是简称，不一致
};
```

### 4.4 测试验证

每完成一个任务后：

1. 在浏览器打开 `index.html`
2. 在聊天框输入相关指令测试对应功能，例如：
   - 任务 1/2：输入"查战绩"、"下载王者荣耀"
   - 任务 7：输入"找搭子"
   - 任务 8：输入"后羿怎么出装"（验证新增英雄能被识别）
   - 任务 9：输入"最新资讯"
3. 确保卡片正常渲染，数据显示正确，无 JS 报错（打开浏览器控制台 F12 检查）

### 4.5 禁止修改的文件

以下文件**不要动**，除非确认理解了影响范围：

| 文件 | 原因 |
|------|------|
| `index.html` | 这是游戏 Tab 首页（screen-app），与 AI 对话数据无关 |
| `js/intent-engine.js` | 意图识别核心逻辑，改错会影响所有对话 |
| `js/chat-controller.js` | 对话流程控制器 |
| `js/deepseek-api.js` | API 调用逻辑 |
| `css/` 目录下所有样式 | 样式调整需要单独评审 |

---

## 五、任务优先级 & 排期建议

| 优先级 | 任务 | 预估工时 | 依赖 |
|--------|------|---------|------|
| 🔴 P0 | 任务 1：消除 `MOCK_USER_GAMES` 冗余 | 0.5h | 需同步改 `response-builders.js` |
| 🔴 P0 | 任务 2：消除 `MOCK_DOWNLOAD_DATA` 冗余 | 0.5h | 需同步改 `response-builders.js` |
| 🟡 P1 | 任务 3：原神结构统一 | 0.25h | 依赖任务 1 |
| 🟡 P1 | 任务 4：皮肤价格字段一致性 | 0.25h | 无 |
| 🟡 P1 | 任务 5：LOL 攻略错字修复 | 5min | 无 |
| 🟡 P1 | 任务 6：复盘 KDA 字段显式化 | 0.5h | 无 |
| 🟢 P2 | 任务 7：丰富搭子数据 | 1h | 无 |
| 🟢 P2 | 任务 8：丰富英雄数据库 | 1h | 无 |
| 🟢 P2 | 任务 9：丰富资讯 & 攻略 | 1h | 无 |
| 🟢 P2 | 任务 10：补充本地 icon | 0.5h | 需要找图片资源 |

**建议顺序**：`1 → 2 → 3 → 5 → 4 → 6 → 7 → 8 → 9 → 10`

> P0 任务 1 和 2 涉及结构变更 + 消费代码联动，建议先做并仔细测试。
> P1 任务互相独立可并行。
> P2 任务是纯内容扩充，风险最低。

---

## 六、FAQ

### Q1：改了数据字段，怎么知道哪些 JS 代码要一起改？

在项目根目录执行：
```bash
grep -rn "你要改的字段名" js/
```

比如要把 `iconImg` 改名，搜 `grep -rn "iconImg" js/`，所有引用点都会列出。

### Q2：`misc.js` 太大了（12KB），要不要拆分？

暂时不拆。misc.js 里的 9 个变量虽然混在一起，但它们都是 `response-builders.js` 的直接数据源。拆分需要改 `index.html` 的 `<script>` 加载顺序，风险较大，后续专门处理。

### Q3：`MOCK_WELFARE_ITEMS` 和 `MOCK_WELFARE_BY_GAME` 是什么关系？

- `MOCK_WELFARE_BY_GAME`：按游戏分组的原始福利数据
- `MOCK_WELFARE_ITEMS`：预构建的福利卡片（含 `welfare_wzry`, `welfare_hpjy`... 和 `welfare__all`），用于快捷命令直接展示

两者内容有重叠但用途不同，暂时都保留。

### Q4：测试时哪些对话指令可以触发哪些功能？

| 输入示例 | 触发意图 | 使用的 mock 数据 |
|---------|---------|-----------------|
| "查战绩" / "今天打了几把" | record | `MOCK_USER_GAMES` + `MOCK_GAME_HEROES` |
| "复盘一下" / "上把分析" | replay | `MOCK_REPLAY_PRESETS` |
| "找个队友" / "一起上分" | partner | `MOCK_PARTNER_DATA` |
| "有什么福利" / "领礼包" | welfare | `MOCK_WELFARE_BY_GAME` |
| "最新资讯" / "有啥新闻" | news | `MOCK_NEWS_DATA` |
| "怎么出装" / "李白攻略" | guide | `MOCK_GUIDE_DATA` |
| "看高光" / "精彩操作" | highlight | `MOCK_HIGHLIGHT_DATA` |
| "下载原神" / "安装游戏" | download | `MOCK_DOWNLOAD_DATA` |
| "新皮肤" / "买什么皮肤" | skin | `MOCK_SKIN_BY_GAME` |
| "今天周报" / "给我日报" | report | `MOCK_REPORT_PRESETS` |
| "气死了" / "又输了" | emotion | `MOCK_EMOTION_TEXT_MAP` |
| "10点提醒我打游戏" | reminder | `MOCK_MODE_MAP` |

---

## 七、交付标准

完成所有任务后，需要满足：

- [ ] 浏览器打开 `index.html`，控制台无 JS 错误
- [ ] 12 种意图对话全部可正常触发和展示卡片
- [ ] `DATA_GAMES` 是游戏信息的唯一定义源，其他文件不再重复定义
- [ ] 所有按游戏分组的数据都使用 `wzry/hpjy/sjz/lol/ys` 作为 key（无中文 key）
- [ ] 同一概念的字段名全局统一
- [ ] mock 数据内容合理可信，无明显假数据或错字

---

*如有疑问请随时沟通，改动涉及 JS 逻辑部分建议先讨论再动手。*
