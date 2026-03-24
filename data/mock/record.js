// ============================================================
// 战绩查询 模拟数据
// 修改说明：编辑各游戏、各时间段的英雄/武器数据和基准数据
// ============================================================

// 战绩数据维度参考：
// 王者荣耀：段位、总场数、胜率、MVP数、擅长分路、战力最高、皮肤数
// 三角洲行动：段位、烽火总局数、总资产、撤离率、战场段位、战场总局数、累积得分
// 火影忍者：段位、战斗力、总胜场、完胜场、最高连胜、最高连击、忍者数量
// 和平精英：段位、总场数、吃鸡数、前十次数、K/D、战术风格、最高段位
// 无畏契约：段位、游戏等级、MVP次数、ACS、赛季KDA、精准击败、皮肤数
// 暗区突围：段位、总局数、仓库价值、撤离率、累计淘汰、战损比
// 穿越火线：段位、等级、英雄武器、ACE次数、五连杀次数、杀敌次数、爆头次数

// ── genRecordData 用 — 各游戏在不同时间段的常用英雄/武器数据 ──
window.MOCK_GAME_HEROES = {
  wzry: {
    today:     [{i:'⚔️',n:'亚瑟',r:'67%',c:'#22c55e'},{i:'🌙',n:'嫦娥',r:'50%',c:'#f59e0b'}],
    yesterday: [{i:'🗡️',n:'兰陵王',r:'40%',c:'#ef4444'},{i:'⚔️',n:'亚瑟',r:'67%',c:'#22c55e'},{i:'🌙',n:'嫦娥',r:'0%',c:'#ef4444'}],
    week:      [{i:'⚔️',n:'亚瑟',r:'63%',c:'#22c55e'},{i:'🌙',n:'嫦娥',r:'55%',c:'#22c55e'},{i:'🗡️',n:'兰陵王',r:'44%',c:'#ef4444'}],
  },
  hpjy: {
    today:     [{i:'🔫',n:'M416',r:'55%',c:'#22c55e'},{i:'🎯',n:'AWM',r:'100%',c:'#22c55e'}],
    yesterday: [{i:'🔫',n:'M416',r:'33%',c:'#ef4444'},{i:'💣',n:'手雷',r:'50%',c:'#f59e0b'},{i:'🎯',n:'AWM',r:'25%',c:'#ef4444'}],
    week:      [{i:'🔫',n:'M416',r:'52%',c:'#f59e0b'},{i:'🎯',n:'AWM',r:'60%',c:'#22c55e'},{i:'🚗',n:'载具击杀',r:'40%',c:'#ef4444'}],
  },
  sjz: {
    today:     [{i:'🔫',n:'突击兵',r:'60%',c:'#22c55e'},{i:'🛡️',n:'重装兵',r:'50%',c:'#f59e0b'}],
    yesterday: [{i:'🔫',n:'突击兵',r:'38%',c:'#ef4444'},{i:'🎯',n:'狙击手',r:'50%',c:'#f59e0b'},{i:'🛡️',n:'重装兵',r:'25%',c:'#ef4444'}],
    week:      [{i:'🔫',n:'突击兵',r:'55%',c:'#22c55e'},{i:'🎯',n:'狙击手',r:'58%',c:'#22c55e'},{i:'🛡️',n:'重装兵',r:'42%',c:'#ef4444'}],
  },
  hyrz: {
    today:     [{i:'🥷',n:'鸣人',r:'75%',c:'#22c55e'},{i:'⚡',n:'佐助',r:'50%',c:'#f59e0b'}],
    yesterday: [{i:'🥷',n:'鸣人',r:'60%',c:'#22c55e'},{i:'🌀',n:'小南',r:'33%',c:'#ef4444'},{i:'⚡',n:'佐助',r:'50%',c:'#f59e0b'}],
    week:      [{i:'🥷',n:'鸣人',r:'62%',c:'#22c55e'},{i:'⚡',n:'佐助',r:'55%',c:'#22c55e'},{i:'🌀',n:'小南',r:'40%',c:'#ef4444'}],
  },
  wwqy: {
    today:     [{i:'🎯',n:'杰特',r:'60%',c:'#22c55e'},{i:'💥',n:'瑞兹',r:'50%',c:'#f59e0b'}],
    yesterday: [{i:'🎯',n:'杰特',r:'45%',c:'#ef4444'},{i:'🛡️',n:'贤者',r:'67%',c:'#22c55e'},{i:'💥',n:'瑞兹',r:'33%',c:'#ef4444'}],
    week:      [{i:'🎯',n:'杰特',r:'56%',c:'#22c55e'},{i:'💥',n:'瑞兹',r:'52%',c:'#f59e0b'},{i:'🛡️',n:'贤者',r:'58%',c:'#22c55e'}],
  },
  aqtw: {
    today:     [{i:'🔦',n:'侦察兵',r:'55%',c:'#22c55e'},{i:'🎒',n:'拾荒者',r:'60%',c:'#22c55e'}],
    yesterday: [{i:'🔦',n:'侦察兵',r:'40%',c:'#ef4444'},{i:'🔫',n:'突击手',r:'50%',c:'#f59e0b'},{i:'🎒',n:'拾荒者',r:'33%',c:'#ef4444'}],
    week:      [{i:'🔦',n:'侦察兵',r:'52%',c:'#f59e0b'},{i:'🎒',n:'拾荒者',r:'55%',c:'#22c55e'},{i:'🔫',n:'突击手',r:'45%',c:'#ef4444'}],
  },
  cfm: {
    today:     [{i:'🔥',n:'M4A1',r:'70%',c:'#22c55e'},{i:'🎯',n:'AWM',r:'50%',c:'#f59e0b'}],
    yesterday: [{i:'🔥',n:'M4A1',r:'55%',c:'#22c55e'},{i:'💣',n:'手雷',r:'67%',c:'#22c55e'},{i:'🎯',n:'AWM',r:'33%',c:'#ef4444'}],
    week:      [{i:'🔥',n:'M4A1',r:'60%',c:'#22c55e'},{i:'🎯',n:'AWM',r:'52%',c:'#f59e0b'},{i:'💣',n:'手雷',r:'48%',c:'#ef4444'}],
  },
};

// ══════════════════════════════════════════════════════════════
// 数据总览卡片数据（data-card 风格，所有游戏通用）
// 结构：3列 × 2行 = 6 个数据格子 + 右侧段位图标
// cells: [{ value, label, isText(可选) }]  — 6 个格子，按列排列（col1[0], col1[1], col2[0], col2[1], col3[0], col3[1]）
// rank: { icon(段位图片路径), text(段位文字) }
// ══════════════════════════════════════════════════════════════
window.MOCK_OVERVIEW_PRESETS = {
  // ── 王者荣耀：总场数、胜率、MVP数 / 擅长分路、战力最高、皮肤数 + 段位 ──
  wzry: {
    today: {
      cells: [
        { value:'3',   label:'总场数' },     { value:'发育路', label:'擅长分路', isText:true },
        { value:'67%', label:'胜率' },        { value:'8,234', label:'战力最高' },
        { value:'2',   label:'MVP数' },       { value:'128',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wangzhe.png', text:'至尊星耀II' },
    },
    yesterday: {
      cells: [
        { value:'5',   label:'总场数' },     { value:'中路', label:'擅长分路', isText:true },
        { value:'40%', label:'胜率' },        { value:'8,120', label:'战力最高' },
        { value:'1',   label:'MVP数' },       { value:'128',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wangzhe.png', text:'至尊星耀II' },
    },
    week: {
      cells: [
        { value:'24',  label:'总场数' },     { value:'对抗路', label:'擅长分路', isText:true },
        { value:'58%', label:'胜率' },        { value:'8,234', label:'战力最高' },
        { value:'8',   label:'MVP数' },       { value:'128',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wangzhe.png', text:'至尊星耀II' },
    },
    '3days': {
      cells: [
        { value:'11',  label:'总场数' },     { value:'打野', label:'擅长分路', isText:true },
        { value:'55%', label:'胜率' },        { value:'8,190', label:'战力最高' },
        { value:'4',   label:'MVP数' },       { value:'128',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wangzhe.png', text:'至尊星耀II' },
    },
    last_week: {
      cells: [
        { value:'18',  label:'总场数' },     { value:'辅助', label:'擅长分路', isText:true },
        { value:'44%', label:'胜率' },        { value:'7,960', label:'战力最高' },
        { value:'5',   label:'MVP数' },       { value:'126',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wangzhe.png', text:'至尊星耀III' },
    },
    month: {
      cells: [
        { value:'72',  label:'总场数' },     { value:'对抗路', label:'擅长分路', isText:true },
        { value:'52%', label:'胜率' },        { value:'8,234', label:'战力最高' },
        { value:'21',  label:'MVP数' },       { value:'128',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wangzhe.png', text:'至尊星耀II' },
    },
    recent: {
      cells: [
        { value:'24',  label:'总场数' },     { value:'对抗路', label:'擅长分路', isText:true },
        { value:'58%', label:'胜率' },        { value:'8,234', label:'战力最高' },
        { value:'8',   label:'MVP数' },       { value:'128',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wangzhe.png', text:'至尊星耀II' },
    },
  },

  // ── 和平精英：总场数、吃鸡数、前十次数 / K/D、战术风格、最高段位 + 段位 ──
  hpjy: {
    today: {
      cells: [
        { value:'3',   label:'总场数' },     { value:'3.2',   label:'K/D' },
        { value:'1',   label:'吃鸡数' },     { value:'刚枪型', label:'战术风格', isText:true },
        { value:'2',   label:'前十次数' },   { value:'超级王牌', label:'最高段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hpjy.png', text:'荣耀皇冠III' },
    },
    yesterday: {
      cells: [
        { value:'5',   label:'总场数' },     { value:'1.8',   label:'K/D' },
        { value:'0',   label:'吃鸡数' },     { value:'均衡型', label:'战术风格', isText:true },
        { value:'2',   label:'前十次数' },   { value:'超级王牌', label:'最高段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hpjy.png', text:'荣耀皇冠III' },
    },
    week: {
      cells: [
        { value:'18',  label:'总场数' },     { value:'2.6',   label:'K/D' },
        { value:'4',   label:'吃鸡数' },     { value:'刚枪型', label:'战术风格', isText:true },
        { value:'8',   label:'前十次数' },   { value:'超级王牌', label:'最高段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hpjy.png', text:'荣耀皇冠III' },
    },
    '3days': {
      cells: [
        { value:'9',   label:'总场数' },     { value:'2.4',   label:'K/D' },
        { value:'2',   label:'吃鸡数' },     { value:'刚枪型', label:'战术风格', isText:true },
        { value:'5',   label:'前十次数' },   { value:'超级王牌', label:'最高段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hpjy.png', text:'荣耀皇冠III' },
    },
    last_week: {
      cells: [
        { value:'15',  label:'总场数' },     { value:'1.9',   label:'K/D' },
        { value:'2',   label:'吃鸡数' },     { value:'苟活型', label:'战术风格', isText:true },
        { value:'6',   label:'前十次数' },   { value:'荣耀皇冠III', label:'最高段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hpjy.png', text:'荣耀皇冠IV' },
    },
    month: {
      cells: [
        { value:'56',  label:'总场数' },     { value:'2.3',   label:'K/D' },
        { value:'12',  label:'吃鸡数' },     { value:'刚枪型', label:'战术风格', isText:true },
        { value:'22',  label:'前十次数' },   { value:'超级王牌', label:'最高段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hpjy.png', text:'荣耀皇冠III' },
    },
    recent: {
      cells: [
        { value:'18',  label:'总场数' },     { value:'2.6',   label:'K/D' },
        { value:'4',   label:'吃鸡数' },     { value:'刚枪型', label:'战术风格', isText:true },
        { value:'8',   label:'前十次数' },   { value:'超级王牌', label:'最高段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hpjy.png', text:'荣耀皇冠III' },
    },
  },

  // ── 三角洲行动：烽火总局数、撤离率、累积得分 / 战场总局数、总资产、战场段位 + 段位 ──
  sjz: {
    today: {
      cells: [
        { value:'4',       label:'烽火总局数' },  { value:'6',       label:'战场总局数' },
        { value:'75%',     label:'撤离率' },       { value:'¥128万',  label:'总资产', isText:true },
        { value:'1,280',   label:'累积得分' },     { value:'黄金Ⅰ',   label:'战场段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-sjz.png', text:'黄金Ⅱ' },
    },
    yesterday: {
      cells: [
        { value:'6',       label:'烽火总局数' },  { value:'4',       label:'战场总局数' },
        { value:'50%',     label:'撤离率' },       { value:'¥125万',  label:'总资产', isText:true },
        { value:'980',     label:'累积得分' },     { value:'黄金Ⅰ',   label:'战场段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-sjz.png', text:'黄金Ⅱ' },
    },
    week: {
      cells: [
        { value:'22',      label:'烽火总局数' },  { value:'18',      label:'战场总局数' },
        { value:'59%',     label:'撤离率' },       { value:'¥132万',  label:'总资产', isText:true },
        { value:'5,460',   label:'累积得分' },     { value:'黄金Ⅰ',   label:'战场段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-sjz.png', text:'黄金Ⅱ' },
    },
    '3days': {
      cells: [
        { value:'12',      label:'烽火总局数' },  { value:'10',      label:'战场总局数' },
        { value:'58%',     label:'撤离率' },       { value:'¥130万',  label:'总资产', isText:true },
        { value:'2,880',   label:'累积得分' },     { value:'黄金Ⅰ',   label:'战场段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-sjz.png', text:'黄金Ⅱ' },
    },
    last_week: {
      cells: [
        { value:'18',      label:'烽火总局数' },  { value:'14',      label:'战场总局数' },
        { value:'44%',     label:'撤离率' },       { value:'¥118万',  label:'总资产', isText:true },
        { value:'3,920',   label:'累积得分' },     { value:'白银Ⅲ', label:'战场段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-sjz.png', text:'黄金Ⅲ' },
    },
    month: {
      cells: [
        { value:'68',      label:'烽火总局数' },  { value:'52',      label:'战场总局数' },
        { value:'54%',     label:'撤离率' },       { value:'¥132万',  label:'总资产', isText:true },
        { value:'16,800',  label:'累积得分' },     { value:'黄金Ⅰ',   label:'战场段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-sjz.png', text:'黄金Ⅱ' },
    },
    recent: {
      cells: [
        { value:'22',      label:'烽火总局数' },  { value:'18',      label:'战场总局数' },
        { value:'59%',     label:'撤离率' },       { value:'¥132万',  label:'总资产', isText:true },
        { value:'5,460',   label:'累积得分' },     { value:'黄金Ⅰ',   label:'战场段位', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-sjz.png', text:'黄金Ⅱ' },
    },
  },

  // ── 火影忍者：总胜场、完胜场、最高连胜 / 最高连击、忍者数量、战斗力 + 段位 ──
  hyrz: {
    today: {
      cells: [
        { value:'4',      label:'总胜场' },     { value:'86',      label:'最高连击' },
        { value:'2',      label:'完胜场' },     { value:'45',      label:'忍者数量' },
        { value:'3',      label:'最高连胜' },   { value:'52,800',  label:'战斗力' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hyrz.png', text:'影·暗部' },
    },
    yesterday: {
      cells: [
        { value:'3',      label:'总胜场' },     { value:'72',      label:'最高连击' },
        { value:'1',      label:'完胜场' },     { value:'45',      label:'忍者数量' },
        { value:'2',      label:'最高连胜' },   { value:'52,600',  label:'战斗力' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hyrz.png', text:'影·暗部' },
    },
    week: {
      cells: [
        { value:'18',     label:'总胜场' },     { value:'128',     label:'最高连击' },
        { value:'7',      label:'完胜场' },     { value:'45',      label:'忍者数量' },
        { value:'6',      label:'最高连胜' },   { value:'52,800',  label:'战斗力' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hyrz.png', text:'影·暗部' },
    },
    '3days': {
      cells: [
        { value:'9',      label:'总胜场' },     { value:'96',      label:'最高连击' },
        { value:'4',      label:'完胜场' },     { value:'45',      label:'忍者数量' },
        { value:'4',      label:'最高连胜' },   { value:'52,700',  label:'战斗力' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hyrz.png', text:'影·暗部' },
    },
    last_week: {
      cells: [
        { value:'12',     label:'总胜场' },     { value:'102',     label:'最高连击' },
        { value:'3',      label:'完胜场' },     { value:'44',      label:'忍者数量' },
        { value:'3',      label:'最高连胜' },   { value:'51,900',  label:'战斗力' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hyrz.png', text:'影·暗部' },
    },
    month: {
      cells: [
        { value:'56',     label:'总胜场' },     { value:'156',     label:'最高连击' },
        { value:'18',     label:'完胜场' },     { value:'45',      label:'忍者数量' },
        { value:'8',      label:'最高连胜' },   { value:'52,800',  label:'战斗力' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hyrz.png', text:'影·暗部' },
    },
    recent: {
      cells: [
        { value:'18',     label:'总胜场' },     { value:'128',     label:'最高连击' },
        { value:'7',      label:'完胜场' },     { value:'45',      label:'忍者数量' },
        { value:'6',      label:'最高连胜' },   { value:'52,800',  label:'战斗力' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-hyrz.png', text:'影·暗部' },
    },
  },

  // ── 无畏契约：MVP次数、ACS、赛季KDA / 精准击败、游戏等级、皮肤数 + 段位 ──
  wwqy: {
    today: {
      cells: [
        { value:'1',   label:'MVP次数' },    { value:'42',   label:'精准击败' },
        { value:'238', label:'ACS' },         { value:'Lv.42', label:'游戏等级', isText:true },
        { value:'1.8', label:'赛季KDA' },    { value:'36',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wwqy.png', text:'黄金III' },
    },
    yesterday: {
      cells: [
        { value:'0',   label:'MVP次数' },    { value:'28',   label:'精准击败' },
        { value:'195', label:'ACS' },         { value:'Lv.42', label:'游戏等级', isText:true },
        { value:'1.2', label:'赛季KDA' },    { value:'36',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wwqy.png', text:'黄金III' },
    },
    week: {
      cells: [
        { value:'5',   label:'MVP次数' },    { value:'186',  label:'精准击败' },
        { value:'221', label:'ACS' },         { value:'Lv.42', label:'游戏等级', isText:true },
        { value:'1.6', label:'赛季KDA' },    { value:'36',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wwqy.png', text:'黄金III' },
    },
    '3days': {
      cells: [
        { value:'2',   label:'MVP次数' },    { value:'96',   label:'精准击败' },
        { value:'216', label:'ACS' },         { value:'Lv.42', label:'游戏等级', isText:true },
        { value:'1.5', label:'赛季KDA' },    { value:'36',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wwqy.png', text:'黄金III' },
    },
    last_week: {
      cells: [
        { value:'3',   label:'MVP次数' },    { value:'152',  label:'精准击败' },
        { value:'208', label:'ACS' },         { value:'Lv.41', label:'游戏等级', isText:true },
        { value:'1.4', label:'赛季KDA' },    { value:'34',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wwqy.png', text:'黄金II' },
    },
    month: {
      cells: [
        { value:'14',  label:'MVP次数' },    { value:'520',  label:'精准击败' },
        { value:'215', label:'ACS' },         { value:'Lv.42', label:'游戏等级', isText:true },
        { value:'1.5', label:'赛季KDA' },    { value:'36',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wwqy.png', text:'黄金III' },
    },
    recent: {
      cells: [
        { value:'5',   label:'MVP次数' },    { value:'186',  label:'精准击败' },
        { value:'221', label:'ACS' },         { value:'Lv.42', label:'游戏等级', isText:true },
        { value:'1.6', label:'赛季KDA' },    { value:'36',   label:'皮肤数' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-wwqy.png', text:'黄金III' },
    },
  },

  // ── 暗区突围：总局数、撤离率、累计淘汰 / 战损比、仓库价值、段位分 + 段位 ──
  aqtw: {
    today: {
      cells: [
        { value:'4',    label:'总局数' },     { value:'1.6',    label:'战损比' },
        { value:'50%',  label:'撤离率' },     { value:'¥86万',  label:'仓库价值', isText:true },
        { value:'8',    label:'累计淘汰' },   { value:'1,850',  label:'段位分' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-aqtw.png', text:'白银I' },
    },
    yesterday: {
      cells: [
        { value:'6',    label:'总局数' },     { value:'1.2',    label:'战损比' },
        { value:'33%',  label:'撤离率' },     { value:'¥82万',  label:'仓库价值', isText:true },
        { value:'10',   label:'累计淘汰' },   { value:'1,720',  label:'段位分' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-aqtw.png', text:'白银I' },
    },
    week: {
      cells: [
        { value:'20',   label:'总局数' },     { value:'1.4',    label:'战损比' },
        { value:'45%',  label:'撤离率' },     { value:'¥86万',  label:'仓库价值', isText:true },
        { value:'38',   label:'累计淘汰' },   { value:'1,850',  label:'段位分' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-aqtw.png', text:'白银I' },
    },
    '3days': {
      cells: [
        { value:'10',   label:'总局数' },     { value:'1.5',    label:'战损比' },
        { value:'50%',  label:'撤离率' },     { value:'¥85万',  label:'仓库价值', isText:true },
        { value:'18',   label:'累计淘汰' },   { value:'1,800',  label:'段位分' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-aqtw.png', text:'白银I' },
    },
    last_week: {
      cells: [
        { value:'16',   label:'总局数' },     { value:'1.1',    label:'战损比' },
        { value:'38%',  label:'撤离率' },     { value:'¥78万',  label:'仓库价值', isText:true },
        { value:'28',   label:'累计淘汰' },   { value:'1,620',  label:'段位分' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-aqtw.png', text:'青铜II' },
    },
    month: {
      cells: [
        { value:'62',   label:'总局数' },     { value:'1.3',    label:'战损比' },
        { value:'42%',  label:'撤离率' },     { value:'¥86万',  label:'仓库价值', isText:true },
        { value:'112',  label:'累计淘汰' },   { value:'1,850',  label:'段位分' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-aqtw.png', text:'白银I' },
    },
    recent: {
      cells: [
        { value:'20',   label:'总局数' },     { value:'1.4',    label:'战损比' },
        { value:'45%',  label:'撤离率' },     { value:'¥86万',  label:'仓库价值', isText:true },
        { value:'38',   label:'累计淘汰' },   { value:'1,850',  label:'段位分' },
      ],
      rank: { icon:'game-tab-assets/rank-icon-aqtw.png', text:'白银I' },
    },
  },

  // ── 穿越火线：ACE次数、杀敌次数、爆头次数 / 五连杀次数、英雄武器、等级 + 段位 ──
  cfm: {
    today: {
      cells: [
        { value:'1',   label:'ACE次数' },    { value:'0',       label:'五连杀' },
        { value:'46',  label:'杀敌次数' },   { value:'雷神',    label:'英雄武器', isText:true },
        { value:'18',  label:'爆头次数' },   { value:'Lv.58',   label:'等级', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-cfm.png', text:'枪王' },
    },
    yesterday: {
      cells: [
        { value:'0',   label:'ACE次数' },    { value:'0',       label:'五连杀' },
        { value:'38',  label:'杀敌次数' },   { value:'雷神',    label:'英雄武器', isText:true },
        { value:'12',  label:'爆头次数' },   { value:'Lv.58',   label:'等级', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-cfm.png', text:'枪王' },
    },
    week: {
      cells: [
        { value:'3',   label:'ACE次数' },    { value:'1',       label:'五连杀' },
        { value:'186', label:'杀敌次数' },   { value:'雷神',    label:'英雄武器', isText:true },
        { value:'72',  label:'爆头次数' },   { value:'Lv.58',   label:'等级', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-cfm.png', text:'枪王' },
    },
    '3days': {
      cells: [
        { value:'1',   label:'ACE次数' },    { value:'0',       label:'五连杀' },
        { value:'92',  label:'杀敌次数' },   { value:'雷神',    label:'英雄武器', isText:true },
        { value:'35',  label:'爆头次数' },   { value:'Lv.58',   label:'等级', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-cfm.png', text:'枪王' },
    },
    last_week: {
      cells: [
        { value:'2',   label:'ACE次数' },    { value:'1',       label:'五连杀' },
        { value:'152', label:'杀敌次数' },   { value:'火麒麟',  label:'英雄武器', isText:true },
        { value:'58',  label:'爆头次数' },   { value:'Lv.57',   label:'等级', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-cfm.png', text:'枪王' },
    },
    month: {
      cells: [
        { value:'9',   label:'ACE次数' },    { value:'3',       label:'五连杀' },
        { value:'620', label:'杀敌次数' },   { value:'雷神',    label:'英雄武器', isText:true },
        { value:'248', label:'爆头次数' },   { value:'Lv.58',   label:'等级', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-cfm.png', text:'枪王' },
    },
    recent: {
      cells: [
        { value:'3',   label:'ACE次数' },    { value:'1',       label:'五连杀' },
        { value:'186', label:'杀敌次数' },   { value:'雷神',    label:'英雄武器', isText:true },
        { value:'72',  label:'爆头次数' },   { value:'Lv.58',   label:'等级', isText:true },
      ],
      rank: { icon:'game-tab-assets/rank-icon-cfm.png', text:'枪王' },
    },
  },
};

// ══════════════════════════════════════════════════════════════
// 近期数据卡片（rank-card 风格，所有游戏在近期查询时使用）
// 结构：3项统计 + 段位变化图 + 底部标签
// stats: [{ value, label }]  — 3 项核心数值
// chart: { img(段位变化图路径), labels([段位1, 段位2, 段位3]), dates([起始日期, 结束日期]) }
// tags: [{ icon(可选), text, desc }]  — 底部标签
// ══════════════════════════════════════════════════════════════
window.MOCK_RECENT_PRESETS = {
  // ── 王者荣耀：对局数、上星数、排位胜率 ──
  wzry: {
    today: {
      stats: [{ value:'3', label:'对局数' },{ value:'+2', label:'上星数' },{ value:'67%', label:'排位胜率' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['至尊星耀 II','至尊星耀 III','至尊星耀 IV'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'今日+2星' }],
    },
    yesterday: {
      stats: [{ value:'5', label:'对局数' },{ value:'-1', label:'上星数' },{ value:'40%', label:'排位胜率' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['至尊星耀 II','至尊星耀 III','至尊星耀 IV'], dates:['3/15','3/22'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'昨日-1星' }],
    },
    week: {
      stats: [{ value:'24', label:'对局数' },{ value:'+5', label:'上星数' },{ value:'58%', label:'排位胜率' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['至尊星耀 II','尊贵铂金 I','尊贵铂金 IV'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'本周+5星' }],
    },
    '3days': {
      stats: [{ value:'11', label:'对局数' },{ value:'+3', label:'上星数' },{ value:'55%', label:'排位胜率' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['至尊星耀 II','至尊星耀 III','尊贵铂金 I'], dates:['3/20','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近3日+3星' }],
    },
    recent: {
      stats: [{ value:'24', label:'对局数' },{ value:'+5', label:'上星数' },{ value:'58%', label:'排位胜率' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['至尊星耀 II','尊贵铂金 I','尊贵铂金 IV'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近期+5星' }],
    },
  },

  // ── 和平精英：对局数、吃鸡数、K/D ──
  hpjy: {
    today: {
      stats: [{ value:'3', label:'对局数' },{ value:'1', label:'吃鸡数' },{ value:'3.2', label:'K/D' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['荣耀皇冠 III','荣耀皇冠 IV','荣耀皇冠 V'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'今日1吃鸡' }],
    },
    yesterday: {
      stats: [{ value:'5', label:'对局数' },{ value:'0', label:'吃鸡数' },{ value:'1.8', label:'K/D' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['荣耀皇冠 III','荣耀皇冠 IV','荣耀皇冠 V'], dates:['3/15','3/22'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'昨日0吃鸡' }],
    },
    week: {
      stats: [{ value:'18', label:'对局数' },{ value:'4', label:'吃鸡数' },{ value:'2.6', label:'K/D' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['荣耀皇冠 III','荣耀皇冠 IV','荣耀皇冠 V'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'本周4吃鸡' }],
    },
    '3days': {
      stats: [{ value:'9', label:'对局数' },{ value:'2', label:'吃鸡数' },{ value:'2.4', label:'K/D' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['荣耀皇冠 III','荣耀皇冠 IV','荣耀皇冠 V'], dates:['3/20','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近3日2吃鸡' }],
    },
    recent: {
      stats: [{ value:'18', label:'对局数' },{ value:'4', label:'吃鸡数' },{ value:'2.6', label:'K/D' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['荣耀皇冠 III','荣耀皇冠 IV','荣耀皇冠 V'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近期4吃鸡' }],
    },
  },

  // ── 三角洲行动：对局数、撤离率、累积得分 ──
  sjz: {
    today: {
      stats: [{ value:'4', label:'对局数' },{ value:'75%', label:'撤离率' },{ value:'1,280', label:'累积得分' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 Ⅱ','黄金 Ⅲ','白银 Ⅰ'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'今日75%撤离' }],
    },
    yesterday: {
      stats: [{ value:'6', label:'对局数' },{ value:'50%', label:'撤离率' },{ value:'980', label:'累积得分' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 Ⅱ','黄金 Ⅲ','白银 Ⅰ'], dates:['3/15','3/22'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'昨日50%撤离' }],
    },
    week: {
      stats: [{ value:'22', label:'对局数' },{ value:'59%', label:'撤离率' },{ value:'5,460', label:'累积得分' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 Ⅱ','黄金 Ⅲ','白银 Ⅰ'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'本周59%撤离' }],
    },
    '3days': {
      stats: [{ value:'12', label:'对局数' },{ value:'58%', label:'撤离率' },{ value:'2,880', label:'累积得分' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 Ⅱ','黄金 Ⅲ','白银 Ⅰ'], dates:['3/20','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近3日58%撤离' }],
    },
    recent: {
      stats: [{ value:'22', label:'对局数' },{ value:'59%', label:'撤离率' },{ value:'5,460', label:'累积得分' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 Ⅱ','黄金 Ⅲ','白银 Ⅰ'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近期59%撤离' }],
    },
  },

  // ── 火影忍者：对局数、胜场数、最高连胜 ──
  hyrz: {
    today: {
      stats: [{ value:'6', label:'对局数' },{ value:'4', label:'胜场数' },{ value:'3', label:'最高连胜' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['影·暗部','影·中忍','特别上忍'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'今日4胜' }],
    },
    yesterday: {
      stats: [{ value:'5', label:'对局数' },{ value:'3', label:'胜场数' },{ value:'2', label:'最高连胜' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['影·暗部','影·中忍','特别上忍'], dates:['3/15','3/22'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'昨日3胜' }],
    },
    week: {
      stats: [{ value:'28', label:'对局数' },{ value:'18', label:'胜场数' },{ value:'6', label:'最高连胜' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['影·暗部','影·中忍','特别上忍'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'本周18胜' }],
    },
    '3days': {
      stats: [{ value:'14', label:'对局数' },{ value:'9', label:'胜场数' },{ value:'4', label:'最高连胜' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['影·暗部','影·中忍','特别上忍'], dates:['3/20','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近3日9胜' }],
    },
    recent: {
      stats: [{ value:'28', label:'对局数' },{ value:'18', label:'胜场数' },{ value:'6', label:'最高连胜' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['影·暗部','影·中忍','特别上忍'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近期18胜' }],
    },
  },

  // ── 无畏契约：对局数、MVP次数、ACS ──
  wwqy: {
    today: {
      stats: [{ value:'3', label:'对局数' },{ value:'1', label:'MVP次数' },{ value:'238', label:'ACS' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 III','黄金 II','白银 I'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'今日1MVP' }],
    },
    yesterday: {
      stats: [{ value:'4', label:'对局数' },{ value:'0', label:'MVP次数' },{ value:'195', label:'ACS' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 III','黄金 II','白银 I'], dates:['3/15','3/22'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'昨日0MVP' }],
    },
    week: {
      stats: [{ value:'16', label:'对局数' },{ value:'5', label:'MVP次数' },{ value:'221', label:'ACS' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 III','黄金 II','白银 I'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'本周5MVP' }],
    },
    '3days': {
      stats: [{ value:'8', label:'对局数' },{ value:'2', label:'MVP次数' },{ value:'216', label:'ACS' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 III','黄金 II','白银 I'], dates:['3/20','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近3日2MVP' }],
    },
    recent: {
      stats: [{ value:'16', label:'对局数' },{ value:'5', label:'MVP次数' },{ value:'221', label:'ACS' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['黄金 III','黄金 II','白银 I'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近期5MVP' }],
    },
  },

  // ── 暗区突围：对局数、撤离率、累计淘汰 ──
  aqtw: {
    today: {
      stats: [{ value:'4', label:'对局数' },{ value:'50%', label:'撤离率' },{ value:'8', label:'累计淘汰' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['白银 I','白银 II','青铜 I'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'今日50%撤离' }],
    },
    yesterday: {
      stats: [{ value:'6', label:'对局数' },{ value:'33%', label:'撤离率' },{ value:'10', label:'累计淘汰' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['白银 I','白银 II','青铜 I'], dates:['3/15','3/22'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'昨日33%撤离' }],
    },
    week: {
      stats: [{ value:'20', label:'对局数' },{ value:'45%', label:'撤离率' },{ value:'38', label:'累计淘汰' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['白银 I','白银 II','青铜 I'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'本周45%撤离' }],
    },
    '3days': {
      stats: [{ value:'10', label:'对局数' },{ value:'50%', label:'撤离率' },{ value:'18', label:'累计淘汰' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['白银 I','白银 II','青铜 I'], dates:['3/20','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近3日50%撤离' }],
    },
    recent: {
      stats: [{ value:'20', label:'对局数' },{ value:'45%', label:'撤离率' },{ value:'38', label:'累计淘汰' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['白银 I','白银 II','青铜 I'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近期45%撤离' }],
    },
  },

  // ── 穿越火线：对局数、ACE次数、杀敌次数 ──
  cfm: {
    today: {
      stats: [{ value:'4', label:'对局数' },{ value:'1', label:'ACE次数' },{ value:'46', label:'杀敌次数' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['枪王','枪神','枪皇'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'今日1ACE' }],
    },
    yesterday: {
      stats: [{ value:'3', label:'对局数' },{ value:'0', label:'ACE次数' },{ value:'38', label:'杀敌次数' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['枪王','枪神','枪皇'], dates:['3/15','3/22'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'昨日0ACE' }],
    },
    week: {
      stats: [{ value:'18', label:'对局数' },{ value:'3', label:'ACE次数' },{ value:'186', label:'杀敌次数' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['枪王','枪神','枪皇'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'本周3ACE' }],
    },
    '3days': {
      stats: [{ value:'9', label:'对局数' },{ value:'1', label:'ACE次数' },{ value:'92', label:'杀敌次数' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['枪王','枪神','枪皇'], dates:['3/20','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近3日1ACE' }],
    },
    recent: {
      stats: [{ value:'18', label:'对局数' },{ value:'3', label:'ACE次数' },{ value:'186', label:'杀敌次数' }],
      chart: { img:'game-tab-assets/rank-chart.svg', labels:['枪王','枪神','枪皇'], dates:['3/16','3/23'] },
      tags: [{ icon:'game-tab-assets/icon-daily-report.svg', text:'日报', desc:'近期3ACE' }],
    },
  },
};

// 向下兼容旧引用
window.MOCK_WZRY_RECENT = window.MOCK_RECENT_PRESETS.wzry;

// ── 向下兼容：旧数据（废弃但保留防止其他引用报错）──
window.MOCK_GAME_PRESETS = window.MOCK_GAME_PRESETS || {};
window.MOCK_BASE_PRESETS = {
  today:      { matches:3,  winRate:'67%', winColor:'#22c55e', score:'7.8' },
  yesterday:  { matches:5,  winRate:'40%', winColor:'#ef4444', score:'6.3' },
  '3days':    { matches:11, winRate:'55%', winColor:'#22c55e', score:'7.1' },
  week:       { matches:24, winRate:'58%', winColor:'#22c55e', score:'7.2' },
  last_week:  { matches:18, winRate:'44%', winColor:'#ef4444', score:'6.8' },
  month:      { matches:72, winRate:'52%', winColor:'#f59e0b', score:'7.0' },
  recent:     { matches:24, winRate:'58%', winColor:'#22c55e', score:'7.2' },
};

// ── buildRecordResponse 用 — 用户在玩游戏列表（未指定游戏时展示概览）──
window.MOCK_USER_GAMES = [
  { id:'wzry', name:'王者荣耀', icon:'⚔️', iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238622226_ecb8e5162318dc2b7616c4ff17bdecee.png', iconLocal:'game-tab-assets/icon-wangzhe.png', color:'#c9a227', gradient:'linear-gradient(135deg,#c9a227,#f0d060)', matches:5, winRate:'40%', winColor:'#ef4444' },
  { id:'hpjy', name:'和平精英', icon:'🪂', iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238896108_b346c0a61ed8685c57ce57fef4ef2135.png', iconLocal:'', color:'#3a8a3a', gradient:'linear-gradient(135deg,#2a5a2a,#3a8a3a)', matches:3, winRate:'33%', winColor:'#ef4444' },
  { id:'sjz',  name:'三角洲行动', icon:'🔫', iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238725456_8215684f47da3c5706cd646681a33f0d.png', iconLocal:'', color:'#2a6090', gradient:'linear-gradient(135deg,#1a3a5e,#2a6090)', matches:4, winRate:'50%', winColor:'#f59e0b' },
  { id:'hyrz', name:'火影忍者', icon:'🥷', iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238828038_be2bcb4e595c41756ebaafbdc4d621a3.png', iconLocal:'', color:'#e67e22', gradient:'linear-gradient(135deg,#c0392b,#e67e22)', matches:6, winRate:'58%', winColor:'#22c55e' },
  { id:'wwqy', name:'无畏契约：源能行动', icon:'🎯', iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774239097407_bdbd22085c7bf1dffc9f8e0f835c5e00.png', iconLocal:'', color:'#e74c3c', gradient:'linear-gradient(135deg,#c0392b,#e74c3c)', matches:3, winRate:'67%', winColor:'#22c55e' },
  { id:'aqtw', name:'暗区突围', icon:'🔦', iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774239168250_823efdbe8313c090d915f51069abd161.png', iconLocal:'', color:'#2c3e50', gradient:'linear-gradient(135deg,#1a252f,#2c3e50)', matches:4, winRate:'50%', winColor:'#f59e0b' },
  { id:'cfm',  name:'穿越火线-枪战王者', icon:'🔥', iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774239347733_8535cc41795de70f54b2c481012be26b.png', iconLocal:'', color:'#d35400', gradient:'linear-gradient(135deg,#a04000,#d35400)', matches:2, winRate:'50%', winColor:'#f59e0b' },
];
