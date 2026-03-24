// ============================================================
// QR COPYWRITING — 追问选项文案润色配置
// 三级文案体系：L1 精确型 / L2 引导型 / L3 对话型
// 修改说明：调整追问选项文案风格在此修改
// ============================================================

// ── 辅助：根据游戏名获取商业化产品术语 ──────────────────────
// 遍历 DATA_GAMES 或 ENGINE_GAMES，找到 name 匹配的游戏并返回 skinLabel
function _getSkinLabelByName(gameName) {
  var GAMES = window.ENGINE_GAMES || window.DATA_GAMES || {};
  for (var id in GAMES) {
    if (GAMES[id] && GAMES[id].name === gameName) {
      return GAMES[id].skinLabel || '皮肤';
    }
  }
  return '皮肤'; // 未找到默认
}

// ── 文案级别定义 ──────────────────────────────────────
// L1 精确型：选择类场景，简洁明确（如：选哪个游戏）
// L2 引导型：功能推荐/跨功能引导，轻度润色（如：功能不支持→推荐替代）
// L3 对话型：兜底/拉回/情感场景，口语化有温度
// ──────────────────────────────────────────────────────

window.QR_COPYWRITING = {

  // ═══════════════════════════════════════════════════════
  // L1 精确型：选游戏场景 — 上文已说明功能，选项只需游戏名
  // 规则：AI 回复已说"想查哪款游戏的XX"，选项不重复功能词
  // ═══════════════════════════════════════════════════════
  L1: {
    // 选游戏时直接用游戏名（不再拼接功能词）
    selectGame: function(gameName) {
      return gameName;
    },
    // 弱置信度确认：更自然的确认语气
    confirm: function(intentLabel) {
      var templates = [
        '对，' + intentLabel,
        '没错，' + intentLabel,
        '是的，' + intentLabel,
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    },
    // 弱置信度否定
    deny: '不是，随便看看',
  },

  // ═══════════════════════════════════════════════════════
  // L2 引导型：功能推荐 / 跨功能引导 — 加动词，像口语建议
  // ═══════════════════════════════════════════════════════
  L2: {
    // 功能不支持 → 推荐替代游戏的同功能
    suggestAlt: {
      record:    [
        function(g) { return '查查' + g + '战绩'; },
        function(g) { return '看看' + g + '战绩'; },
      ],
      replay:    [
        function(g) { return '复盘一把' + g; },
        function(g) { return '看看' + g + '复盘'; },
      ],
      welfare:   [
        function(g) { return '领' + g + '福利'; },
        function(g) { return '看看' + g + '福利'; },
      ],
      partner:   [
        function(g) { return '找' + g + '搭子'; },
        function(g) { return g + '找人开黑'; },
      ],
      news:      [
        function(g) { return '看' + g + '资讯'; },
        function(g) { return g + '最新消息'; },
      ],
      guide:     [
        function(g) { return '看看' + g + '攻略'; },
        function(g) { return '查' + g + '攻略'; },
      ],
      highlight: [
        function(g) { return '生成' + g + '高光'; },
        function(g) { return g + '精彩时刻'; },
      ],
      download:  [
        function(g) { return '下载' + g; },
        function(g) { return '去下载' + g; },
      ],
      skin:      [
        function(g) { return '看' + g + _getSkinLabelByName(g); },
        function(g) { return '逛逛' + g + _getSkinLabelByName(g); },
      ],
      report:    [
        function(g) { return '看' + g + '周报'; },
        function(g) { return g + '本周表现'; },
      ],
      reminder:  [
        function(g) { return '设置' + g + '提醒'; },
        function(g) { return g + '提醒一下'; },
      ],
      ranking:   [
        function(g) { return '看' + g + '排行'; },
        function(g) { return g + '好友排行'; },
      ],
      match_query: [
        function(g) { return '看' + g + '对局'; },
        function(g) { return '查' + g + '对局'; },
      ],
    },

    // 功能不支持 → 引导到当前游戏的其他功能
    crossFeature: {
      record:    [
        function(g) { return '看看' + g + '攻略'; },
      ],
      replay:    [
        function(g) { return g + '战绩看看'; },
        function(g) { return '查查' + g + '战绩'; },
      ],
      guide:     [
        function(g) { return '看看' + g + '资讯'; },
      ],
      welfare:   [
        function(g) { return '看看' + g + '攻略'; },
      ],
      partner:   [
        function(g) { return '看看' + g + '攻略'; },
      ],
      highlight: [
        function(g) { return '查查' + g + '战绩'; },
      ],
      download:  [
        function(g) { return '看看' + g + '攻略'; },
      ],
      skin:      [
        function(g) { return '看看' + g + '攻略'; },
      ],
      report:    [
        function(g) { return '查查' + g + '战绩'; },
      ],
      ranking:   [
        function(g) { return '查查' + g + '战绩'; },
      ],
      match_query: [
        function(g) { return '查查' + g + '战绩'; },
      ],
    },

    // 功能完成后 → 推荐下一步（五维度：话题深挖/横向拓展/纵向串联/行动建议/社交驱动）
    afterComplete: {
      // ── 对局查询完成后 ──
      match_query: {
        record:  [
          function(g) { return '顺便看看' + g + '战绩'; },
          function(g) { return '看看' + g + '整体数据'; },
        ],
        replay:  [
          function(g) { return '复盘一下这把'; },
          function(g) { return '分析下刚才的对局'; },
        ],
      },
      // ── 战报完成后 ──
      report: {
        record:  [
          function(g) { return '看看' + g + '详细战绩'; },
          function(g) { return '查查' + g + '整体数据'; },
        ],
        replay:  [
          function(g) { return '复盘一下最近的对局'; },
          function(g) { return '分析下近期表现'; },
        ],
        partner: [
          function(g) { return '找人一起' + g + '开黑'; },
          function(g) { return '约个搭子打' + g; },
        ],
      },
      // ── 排行完成后 ──
      ranking: {
        record:  [
          function(g) { return '看看我的战绩'; },
          function(g) { return '查查我的数据'; },
        ],
      },
      // ── 福利领取完成后 ──
      welfare: {
        record:  [
          function(g) { return '顺便看看' + g + '战绩'; },
          function(g) { return '查查' + g + '近期数据'; },
        ],
        skin:    [
          function(g) { return '逛逛' + g + '新' + _getSkinLabelByName(g); },
          function(g) { return '看看' + g + '热门' + _getSkinLabelByName(g); },
        ],
        partner: [
          function(g) { return '领完福利来一把？找个搭子'; },
          function(g) { return '找人一起' + g + '开黑'; },
        ],
      },
      // ── 战绩查看完成后 ──
      record: {
        replay:  [
          function(g) { return '复盘一下最近的对局'; },
          function(g) { return '分析下近期表现'; },
        ],
        ranking: [
          function(g) { return '看看' + g + '好友排行'; },
          function(g) { return '在好友中排第几？'; },
        ],
        partner: [
          function(g) { return '找个搭子一起上分'; },
          function(g) { return '约人一起打' + g; },
        ],
      },
      // ── 复盘完成后 ──
      replay: {
        guide:     [
          function(g) { return '看看这个英雄的攻略'; },
          function(g) { return '查查打法技巧'; },
        ],
        highlight: [
          function(g) { return '生成这局高光视频'; },
          function(g) { return '做个精彩集锦秀一波'; },
        ],
        partner:   [
          function(g) { return '找个搭子再来一把'; },
          function(g) { return '约人一起' + g + '开黑'; },
        ],
      },
      // ── 找搭子完成后 ──
      partner: {
        record:  [
          function(g) { return '看看我的' + g + '战绩'; },
          function(g) { return '查查自己' + g + '数据'; },
        ],
        welfare: [
          function(g) { return '开黑前领个' + g + '福利'; },
          function(g) { return '顺便看看有啥福利'; },
        ],
        reminder:[
          function(g) { return '设个' + g + '开黑提醒'; },
          function(g) { return '提醒我一会儿上线'; },
        ],
      },
      // ── 资讯查看完成后 ──
      news: {
        welfare: [
          function(g) { return '看看' + g + '今日福利'; },
          function(g) { return '有什么' + g + '福利可以领？'; },
        ],
        guide:   [
          function(g) { return '看看' + g + '攻略'; },
          function(g) { return '查查' + g + '新玩法'; },
        ],
        skin:    [
          function(g) { return '逛逛' + g + '最新' + _getSkinLabelByName(g); },
          function(g) { return '看看' + g + '上新' + _getSkinLabelByName(g); },
        ],
      },
      // ── 攻略查看完成后 ──
      guide: {
        record:  [
          function(g) { return '看看我' + g + '战绩如何'; },
          function(g) { return '查查近期' + g + '数据'; },
        ],
        partner: [
          function(g) { return '找个搭子实战一下'; },
          function(g) { return '约人一起练练'; },
        ],
        replay:  [
          function(g) { return '复盘下最近的对局'; },
          function(g) { return '对比下自己的打法'; },
        ],
      },
      // ── 高光生成完成后 ──
      highlight: {
        record:  [
          function(g) { return '看看' + g + '战绩数据'; },
          function(g) { return '查查近期' + g + '表现'; },
        ],
        partner: [
          function(g) { return '找人一起' + g + '开黑'; },
          function(g) { return '约个搭子再来几把'; },
        ],
        replay:  [
          function(g) { return '复盘一下这几把'; },
          function(g) { return '分析下操作细节'; },
        ],
      },
      // ── 下载完成后 ──
      download: {
        guide:   [
          function(g) { return '看看' + g + '新手攻略'; },
          function(g) { return '查查' + g + '入门攻略'; },
        ],
        news:    [
          function(g) { return '看看' + g + '最新资讯'; },
          function(g) { return '了解下' + g + '近期动态'; },
        ],
        welfare: [
          function(g) { return '有什么' + g + '新手福利？'; },
          function(g) { return '领个' + g + '新手礼包'; },
        ],
      },
      // ── 皮肤查看完成后 ──
      skin: {
        welfare: [
          function(g) { return '看看' + g + '今日福利'; },
          function(g) { return '有什么' + g + '折扣活动？'; },
        ],
        news:    [
          function(g) { return '看看' + g + '最新资讯'; },
          function(g) { return '了解下' + g + '近期活动'; },
        ],
        record:  [
          function(g) { return '看看' + g + '战绩如何'; },
          function(g) { return '查查' + g + '近期数据'; },
        ],
      },
      // ── 提醒设置完成后 ──
      reminder: {
        welfare: [
          function(g) { return '顺便领个' + g + '福利'; },
          function(g) { return '看看有啥' + g + '福利'; },
        ],
        partner: [
          function(g) { return '找个搭子一起玩'; },
          function(g) { return '到时候约人开黑'; },
        ],
        record:  [
          function(g) { return '看看最近' + g + '战绩'; },
          function(g) { return '查查' + g + '近期数据'; },
        ],
      },
    },

    // 否定后重选
    denyRedirect: {
      welfare: [
        '有什么礼包领？',
        '有什么福利可以薅？',
      ],
      record: [
        '查查我的战绩',
        '看看战绩如何',
      ],
      partner: [
        '帮我找个搭子',
        '找人一起开黑',
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // L3 对话型：拉回 / 兜底 — 口语化，有温度和情绪共鸣
  // ═══════════════════════════════════════════════════════
  L3: {
    // 拉回场景（按情绪/话题分组，每组多套文案随机选）
    pullback: {
      tired: {   // 累/烦/emo
        qr: [
          ['找个人一起玩吧', '看看最近打得怎么样'],
          ['不如找人开黑放松下', '看看近期战绩'],
        ],
      },
      bored: {   // 无聊
        qr: [
          ['不如找人开黑？', '今天有啥福利可以薅？'],
          ['找个搭子玩一把？', '看看今天有啥好东西'],
        ],
      },
      eating: {  // 吃饭
        qr: [
          ['饭后顺便领个福利', '王者今天有礼包哦'],
          ['吃完来一把？领个福利先', '看看今天有啥活动'],
        ],
      },
      sleeping: { // 睡觉
        qr: [
          ['明天帮你提醒上线？', '临睡前看看有啥好东西'],
          ['帮你设个明早提醒？', '睡前领个福利再走'],
        ],
      },
      working: { // 工作/上班
        qr: [
          ['摸鱼看看本周战报', '查查最近战绩'],
          ['看看本周游戏表现', '顺便看看战绩'],
        ],
      },
      money: {   // 钱/购物
        qr: [
          ['逛逛鹅毛市集', '看看有什么优惠'],
          ['鹅毛市集上新了', '看看限时折扣'],
        ],
      },
      social: {  // 朋友/聚会
        qr: [
          ['一起开黑呀', '找个搭子玩一把'],
          ['叫上朋友开黑', '帮我匹配搭子'],
        ],
      },
      study: {   // 学习/考试
        qr: [
          ['学累了来一把？', '看看今天有啥福利'],
          ['休息一下找人开黑', '顺便领个福利'],
        ],
      },
      handsome: { // 帅/好看
        qr: [
          ['逛逛鹅毛市集', '看看限定新品'],
          ['鹅毛市集上新了', '看看潮流新品'],
        ],
      },
      winning: {  // 赢/厉害/666
        qr: [
          ['做个高光视频秀一波', '顺便看看战绩'],
          ['生成精彩集锦', '查查近期数据'],
        ],
      },
      newStuff: { // 新/有什么/更新
        qr: [
          ['看看最新资讯', '今天有啥新活动'],
          ['查查最新消息', '有什么新动态'],
        ],
      },
      weather: {  // 天气
        qr: [
          ['不如领个福利', '今天有啥好活动'],
          ['宅家领福利', '看看游戏活动'],
        ],
      },
    },

    // 兜底场景
    fallback: [
      {
        qr: ['今天有好东西，看看？', '下次再说'],
      },
      {
        qr: ['一个人玩没意思？找个搭子', '先不了'],
      },
      {
        qr: ['看看最近战绩如何', '复盘一下上一把？'],
      },
    ],
  },
};


// ═══════════════════════════════════════════════════════
// 文案生成工具函数
// ═══════════════════════════════════════════════════════

// 从模板数组中随机选一个并执行
function _pickTemplate(templates, arg) {
  if (!templates || templates.length === 0) return arg;
  var tpl = templates[Math.floor(Math.random() * templates.length)];
  return typeof tpl === 'function' ? tpl(arg) : tpl;
}

// ── 核心函数：生成 quickReplies 对象数组 ──
// 返回格式：[{ text: '展示文案', actionKey: '回调key' }]
// text: 用于展示给用户看的润色文案
// actionKey: 用于匹配 onQR 回调的 key（保持原有功能化文案）

/**
 * 生成 L1 级别的追问选项（选游戏）
 * @param {Array} games - 游戏对象数组
 * @param {string} featureId - 功能ID
 * @returns {Array} [{text, actionKey}]
 */
window.buildQR_L1_selectGame = function(games, featureId) {
  var CW = window.QR_COPYWRITING;
  // 功能词映射
  var featureWord = {
    welfare: '福利', record: '战绩', replay: '复盘', partner: '找搭子',
    news: '资讯', guide: '攻略', highlight: '高光', download: '',
    skin: '皮肤', report: '周报', reminder: '提醒', ranking: '好友排行',
    match_query: '对局',
  };
  var word = featureWord[featureId] || '';
  var prefix = featureId === 'download' ? '下载' : '';

  return games.map(function(g) {
    var displayText = CW.L1.selectGame(g.name); // L1: 只显示游戏名
    var actionKey = prefix + g.name + (prefix ? '' : word);  // 回调key保持原格式
    return { text: displayText, actionKey: actionKey };
  });
};

/**
 * 生成 L2 级别的追问选项（功能不支持→推荐替代）
 * @param {Array} games - 推荐的替代游戏数组
 * @param {string} featureId - 功能ID
 * @param {string} currentGameName - 当前游戏名（可选，用于跨功能引导）
 * @param {string} crossFeatureId - 跨功能引导的功能ID（可选）
 * @returns {Array} [{text, actionKey}]
 */
window.buildQR_L2_suggest = function(games, featureId, currentGameName, crossFeatureId) {
  var CW = window.QR_COPYWRITING;
  var featureWord = {
    welfare: '福利', record: '战绩', replay: '复盘', partner: '找搭子',
    news: '资讯', guide: '攻略', highlight: '高光', download: '',
    skin: '皮肤', report: '周报', reminder: '提醒', ranking: '好友排行',
    match_query: '对局',
  };
  var word = featureWord[featureId] || '';
  var prefix = featureId === 'download' ? '下载' : '';
  var result = [];

  // 推荐替代游戏
  var altTemplates = (CW.L2.suggestAlt || {})[featureId] || [];
  games.forEach(function(g) {
    var displayText = _pickTemplate(altTemplates, g.name);
    var actionKey = prefix + g.name + (prefix ? '' : word);
    result.push({ text: displayText, actionKey: actionKey });
  });

  // 跨功能引导
  if (currentGameName && crossFeatureId) {
    var crossWord = featureWord[crossFeatureId] || '';
    var crossPrefix = crossFeatureId === 'download' ? '下载' : '';
    var crossTemplates = (CW.L2.crossFeature || {})[featureId] || [];
    var crossText = _pickTemplate(crossTemplates, currentGameName);
    var crossKey = crossPrefix + currentGameName + (crossPrefix ? '' : crossWord);
    result.push({ text: crossText, actionKey: crossKey });
  }

  return result;
};

/**
 * 生成 L2 级别的追问选项（功能完成后→推荐下一步）
 * @param {string} currentFeatureId - 当前完成的功能ID
 * @param {string} gameName - 游戏名
 * @param {Array} nextFeatureIds - 推荐的下一步功能ID数组
 * @returns {Array} [{text, actionKey}]
 */
window.buildQR_L2_afterComplete = function(currentFeatureId, gameName, nextFeatureIds) {
  var CW = window.QR_COPYWRITING;
  var featureWord = {
    welfare: '福利', record: '战绩', replay: '复盘', partner: '找搭子',
    news: '资讯', guide: '攻略', highlight: '高光', download: '',
    skin: '皮肤', report: '周报', reminder: '提醒', ranking: '好友排行',
    match_query: '对局',
  };
  var result = [];

  var afterConfig = (CW.L2.afterComplete || {})[currentFeatureId] || {};

  nextFeatureIds.forEach(function(fid) {
    var word = featureWord[fid] || '';
    var prefix = fid === 'download' ? '下载' : '';
    var templates = afterConfig[fid] || [];
    var displayText = _pickTemplate(templates, gameName);
    // 如果没有模板，用通用格式（skin 功能使用动态术语）
    if (!templates.length) {
      if (fid === 'skin') {
        displayText = '看看' + gameName + _getSkinLabelByName(gameName);
      } else {
        displayText = '看看' + gameName + word;
      }
    }
    var actionKey = prefix + gameName + (prefix ? '' : word);
    result.push({ text: displayText, actionKey: actionKey });
  });

  return result;
};

/**
 * 生成 L3 级别的追问选项（拉回场景）
 * @param {string} sceneKey - 场景key（如 tired, bored, eating...）
 * @returns {Array} 文案数组（字符串），用于直接替换 pullback 的 qr
 */
window.buildQR_L3_pullback = function(sceneKey) {
  var CW = window.QR_COPYWRITING;
  var scene = (CW.L3.pullback || {})[sceneKey];
  if (!scene || !scene.qr || scene.qr.length === 0) return null;
  // 随机选一套
  return scene.qr[Math.floor(Math.random() * scene.qr.length)];
};

/**
 * 生成 L3 级别的追问选项（兜底场景）
 * @param {number} index - fallback 索引（0/1/2）
 * @returns {Array} 文案数组（字符串），用于直接替换 fallback 的 qr
 */
window.buildQR_L3_fallback = function(index) {
  var CW = window.QR_COPYWRITING;
  var fallbacks = CW.L3.fallback || [];
  var fb = fallbacks[index] || fallbacks[0];
  return fb ? fb.qr : null;
};

// ═══════════════════════════════════════════════════════
// 兼容工具：将新格式 [{text, actionKey}] 转为旧格式
// quickReplies: 展示文案数组
// onQR: 以 actionKey 为 key 的回调映射
// displayToAction: 展示文案 → actionKey 的映射（点击时用）
// ═══════════════════════════════════════════════════════
window.resolveQR = function(qrItems, callbackBuilder) {
  var quickReplies = [];
  var onQR = {};
  var displayMap = {};

  (qrItems || []).forEach(function(item) {
    if (typeof item === 'string') {
      // 兼容旧格式：字符串直接用
      quickReplies.push(item);
      if (callbackBuilder) onQR[item] = callbackBuilder(item);
      displayMap[item] = item;
    } else {
      quickReplies.push(item.text);
      if (callbackBuilder) onQR[item.actionKey] = callbackBuilder(item.actionKey);
      displayMap[item.text] = item.actionKey;
    }
  });

  return {
    quickReplies: quickReplies,
    onQR: onQR,
    displayMap: displayMap,
  };
};
