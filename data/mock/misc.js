// ============================================================
// 资讯、攻略、高光、下载、皮肤、提醒、详细数据、情绪 等零散 mock 数据
// 修改说明：各函数使用的模拟数据，按用途分组
// ============================================================

// ── 资讯数据（2026年3月更新，使用真实版本信息）──────────────────────────────────
window.MOCK_NEWS_DATA = {
  wzry: [
    {icon:'⚔️',title:'S43赛季"妙手空空"3月26日正式更新',meta:'官方公告 · 近期'},
    {icon:'🎭',title:'S43新英雄"元流之子"刺客登场，五职业集齐',meta:'版本预告 · 近期'},
    {icon:'🏆',title:'S43战令联动"熊出没"系列皮肤曝光',meta:'赛季指南 · 近期'},
  ],
  hpjy: [
    {icon:'🪂',title:'CH.10赛季进行中，地铁逃生怒兆火山地图已开启',meta:'官方公告 · 近期'},
    {icon:'🔫',title:'新春版本团队协作与枪械平衡性调整一览',meta:'版本说明 · 近期'},
    {icon:'🏆',title:'2026 PEL春季赛正在进行，赛事精彩回顾',meta:'赛事资讯 · 近期'},
  ],
  sjz: [
    {icon:'🔫',title:'S8赛季"蝶变时刻"进行中，新干员"蝶"已上线',meta:'官方公告 · 近期'},
    {icon:'🗺️',title:'S9赛季定档4月18日，新地图「核电站」曝光',meta:'版本预告 · 近期'},
    {icon:'🛡️',title:'武器平衡性调整：巴雷特M82A1与AR57即将加入',meta:'版本说明 · 近期'},
  ],
  cfm: [
    {icon:'🔥',title:'CF手游周年庆版本火热进行中，限定武器免费领',meta:'官方公告 · 近期'},
    {icon:'🗺️',title:'新地图「废弃工厂」上线，全新爆破体验',meta:'版本更新 · 近期'},
    {icon:'🏆',title:'CFML职业联赛春季赛精彩回顾',meta:'赛事资讯 · 近期'},
  ],
  ys: [
    {icon:'✨',title:'月之五版本「空月之歌·变奏」正在进行中',meta:'官方公告 · 近期'},
    {icon:'🌟',title:'「捕风的归客」版本攻略征集活动进行中',meta:'活动通知 · 近期'},
    {icon:'🎉',title:'下个版本预计5月7日更新，敬请期待',meta:'版本预告 · 近期'},
  ],
};

// ── 攻略数据 ──────────────────────────────────
window.MOCK_GUIDE_DATA = {
  wzry: {
    equipLabel: '🛡️ 推荐出装顺序',
    equips: ['破军','不祥征兆','暗影战斧','影刃','名刀·司命','影忍之足'],
    tips: ['开局先补兵，5级后开始抢红蓝BUFF','二技能切入，大招开启后立即普攻叠层','优先击杀敌方脆皮，拉开对局优势'],
  },
  hpjy: {
    equipLabel: '🔫 推荐配件搭配',
    equips: ['红点瞄准','垂直握把','消焰器','扩容弹夹','枪托','消音器'],
    tips: ['跳伞选择偏远资源点，前期避免正面交火','转圈时优先进屋搜索，保证载具和药品','决赛圈找好掩体，不要在空地暴露位置'],
  },
  sjz: {
    equipLabel: '🔫 推荐武器配置',
    equips: ['HK416','烟雾弹×2','闪光弹','急救包','防弹插板','战术背心'],
    tips: ['攻楼前先投烟雾弹遮蔽视线，减少伤亡','利用掩体交替掩护推进，不要扎堆','据点防守时注意多个入口，分散站位'],
  },
  cfm: {
    equipLabel: '🔫 推荐武器配置',
    equips: ['M4A1-雷神','AWM-天龙','手雷','烟雾弹','闪光弹','防弹衣'],
    tips: ['爆破模式注意听脚步声判断敌人位置','配合队友交叉火力覆盖关键路口','残局时保持冷静，善用道具拖延时间'],
  },
  ys: {
    equipLabel: '📦 推荐圣遗物/武器',
    equips: ['护摩之杖','魔女四件套','攻击沙漏','火伤杯','暴击头','精通副词条'],
    tips: ['E技能进入后靠普攻和重击输出，保持低血量','配合行秋/夜兰蒸发打法伤害最大化','大招留到换队时使用，不要浪费无敌帧'],
  },
};

// ── 高光时刻数据 ──────────────────────────────────
window.MOCK_HIGHLIGHT_DATA = {
  wzry: [
    {t:'⚔️ 亚瑟 · 三杀',d:'8:32 · 中路团战逆转',tag:'团战高光'},
    {t:'🌙 嫦娥 · 完美大招',d:'14:20 · 一技能+大招双杀',tag:'操作秀'},
    {t:'🏆 逆风翻盘',d:'18:00 · 最终团战MVP',tag:'逆风局'},
  ],
  hpjy: [
    {t:'🔫 M416 · 四连杀',d:'12:45 · 城区巷战清队',tag:'灭队高光'},
    {t:'🎯 AWM · 超远狙',d:'18:30 · 800米爆头击杀',tag:'神枪手'},
    {t:'🏆 决赛圈吃鸡',d:'24:10 · 1v3反杀吃鸡',tag:'绝地翻盘'},
  ],
  sjz: [
    {t:'🔫 突击兵 · ACE',d:'5:20 · A点突破五杀',tag:'突破高光'},
    {t:'🎯 狙击手 · 连续爆头',d:'8:15 · 三连爆头锁定回合',tag:'精准射击'},
    {t:'🛡️ 拆弹成功',d:'11:40 · 最后3秒拆弹绝杀',tag:'极限操作'},
  ],
  cfm: [
    {t:'🔥 M4A1 · ACE',d:'1:45 · 爆破模式五杀',tag:'五杀高光'},
    {t:'🎯 AWM · 一枪四连',d:'0:58 · 残局四连狙',tag:'神枪手'},
    {t:'🏆 1v5翻盘',d:'1:30 · 残局极限翻盘',tag:'绝地翻盘'},
  ],
  ys: [
    {t:'🔥 胡桃 · 蒸发大招',d:'深渊12-3 · 一招秒杀BOSS',tag:'秒杀高光'},
    {t:'⚡ 雷神 · 无限大招',d:'深渊12-1 · 雷神国家队速通',tag:'速通'},
    {t:'❄️ 甘雨 · 融化重击',d:'深渊12-2 · 单人输出全场',tag:'输出秀'},
  ],
};

// ── 皮肤数据（按游戏分组 + 总列表） ──────────────────────────────────
window.MOCK_SKIN_BY_GAME = {
  wzry: [
    {name:'花月夜·嫦娥',game:'王者荣耀',price:'648点券',tag:'限时',bg:'linear-gradient(135deg,#0a3a7e,#4a8adf)',icon:'🌙'},
    {name:'星际迷途·孙悟空',game:'王者荣耀',price:'328点券',tag:'新品',bg:'linear-gradient(135deg,#0a2a5e,#1a5abf)',icon:'⭐'},
    {name:'白龙吟·赵云',game:'王者荣耀',price:'288点券',tag:'热卖',bg:'linear-gradient(135deg,#2a3a5a,#5a8aba)',icon:'🐉'},
  ],
  hpjy: [
    {name:'传说武装·M416',game:'和平精英',price:'金币×1888',tag:'热卖',bg:'linear-gradient(135deg,#2a5a2a,#3a8a3a)',icon:'🔫'},
    {name:'极寒迷彩·套装',game:'和平精英',price:'点券×680',tag:'新品',bg:'linear-gradient(135deg,#1a3a5e,#4a8adf)',icon:'❄️'},
  ],
  sjz: [
    {name:'暗夜骑士·突击兵',game:'三角洲行动',price:'酷玩币×88',tag:'折扣',bg:'linear-gradient(135deg,#1a1a2e,#2a2a5e)',icon:'🌑'},
    {name:'沙漠风暴·狙击手',game:'三角洲行动',price:'酷玩币×128',tag:'限时',bg:'linear-gradient(135deg,#5a4a2a,#8a7a4a)',icon:'🏜️'},
  ],
  hyrz: [
    {name:'六道仙人·鸣人',game:'火影忍者',price:'金币×2888',tag:'限时',bg:'linear-gradient(135deg,#c0392b,#e67e22)',icon:'🥷'},
    {name:'须佐能乎·佐助',game:'火影忍者',price:'金币×1888',tag:'新品',bg:'linear-gradient(135deg,#1a1a4e,#4a2a8e)',icon:'⚡'},
    {name:'晓之暗影·鼬',game:'火影忍者',price:'金币×1688',tag:'热卖',bg:'linear-gradient(135deg,#2a0a0a,#5a1a1a)',icon:'🌀'},
  ],
  wwqy: [
    {name:'龙年限定·杰特',game:'无畏契约',price:'VP×1775',tag:'限时',bg:'linear-gradient(135deg,#c0392b,#e74c3c)',icon:'🎯'},
    {name:'赛博朋克·瑞兹',game:'无畏契约',price:'VP×1275',tag:'新品',bg:'linear-gradient(135deg,#2a1a5e,#6a3abf)',icon:'💥'},
  ],
  aqtw: [
    {name:'暗夜猎手·套装',game:'暗区突围',price:'暗金×888',tag:'限时',bg:'linear-gradient(135deg,#1a252f,#2c3e50)',icon:'🔦'},
    {name:'沙漠之鹰·涂装',game:'暗区突围',price:'暗金×588',tag:'新品',bg:'linear-gradient(135deg,#5a4a2a,#8a7a4a)',icon:'🏜️'},
  ],
  cfm: [
    {name:'雷神·M4A1',game:'穿越火线-枪战王者',price:'钻石×888',tag:'限时',bg:'linear-gradient(135deg,#a04000,#d35400)',icon:'🔥'},
    {name:'天龙·AWM',game:'穿越火线-枪战王者',price:'钻石×1288',tag:'新品',bg:'linear-gradient(135deg,#1a3a5e,#4a8adf)',icon:'🐉'},
    {name:'黑武士·套装',game:'穿越火线-枪战王者',price:'钻石×680',tag:'热卖',bg:'linear-gradient(135deg,#0a0a2e,#2a2a6e)',icon:'🌑'},
  ],
  ys: [
    {name:'须弥·纳西妲',game:'原神',price:'限定UP池',tag:'限定',bg:'linear-gradient(135deg,#2a5a2a,#5aaa5a)',icon:'🌿'},
    {name:'花嫁·神里绫华',game:'原神',price:'限定UP池',tag:'复刻',bg:'linear-gradient(135deg,#3a5a8a,#5a9aca)',icon:'❄️'},
  ],
};
window.MOCK_SKIN_DATA = [
  ...window.MOCK_SKIN_BY_GAME.wzry,
  ...window.MOCK_SKIN_BY_GAME.hpjy,
  ...window.MOCK_SKIN_BY_GAME.sjz,
  ...window.MOCK_SKIN_BY_GAME.hyrz,
  ...window.MOCK_SKIN_BY_GAME.wwqy,
  ...window.MOCK_SKIN_BY_GAME.aqtw,
  ...window.MOCK_SKIN_BY_GAME.cfm,
  ...window.MOCK_SKIN_BY_GAME.ys,
];

// ── 下载页数据 ──────────────────────────────────
window.MOCK_DOWNLOAD_DATA = {
  wzry:     {name:'王者荣耀',icon:'⚔️',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238622226_ecb8e5162318dc2b7616c4ff17bdecee.png',iconLocal:'game-tab-assets/icon-wangzhe.png',bg:'linear-gradient(135deg,#c9a227,#f0d060)',size:'3.8GB',score:'9.6',downloads:'128万',goodRate:'97%',category:'MOBA',slogan:'国民MOBA手游大作'},
  wzrysj:   {name:'王者荣耀世界',icon:'⚔️',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774319960762_5e1a78ae171af8a95f33fc6d213ed1d8.png',iconLocal:'',bg:'linear-gradient(135deg,#5a3a1e,#a87a3e)',size:'5.2GB',score:'9.8',downloads:'326万',goodRate:'99%',category:'多人冒险',slogan:'王者荣耀开放世界冒险'},
  sjz:      {name:'三角洲行动',icon:'🔫',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238725456_8215684f47da3c5706cd646681a33f0d.png',iconLocal:'',bg:'linear-gradient(135deg,#1a3a5e,#2a6090)',size:'3.2GB',score:'9.3',downloads:'52万',goodRate:'94%',category:'射击',slogan:'战术射击品质标杆游戏'},
  hyrz:     {name:'火影忍者',icon:'🥷',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238828038_be2bcb4e595c41756ebaafbdc4d621a3.png',iconLocal:'',bg:'linear-gradient(135deg,#c0392b,#e67e22)',size:'2.5GB',score:'9.4',downloads:'68万',goodRate:'95%',category:'RPG',slogan:'正版火影忍者格斗手游'},
  hpjy:     {name:'和平精英',icon:'🪂',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238896108_b346c0a61ed8685c57ce57fef4ef2135.png',iconLocal:'',bg:'linear-gradient(135deg,#2a5a2a,#3a8a3a)',size:'2.1GB',score:'9.5',downloads:'86万',goodRate:'96%',category:'射击',slogan:'自研打造的战术竞技手游'},
  lkwg:     {name:'洛克王国：世界',icon:'🐾',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238990140_e01d65d4b535c3acec58aafad5913d25.png',iconLocal:'',bg:'linear-gradient(135deg,#2980b9,#3498db)',size:'1.6GB',score:'9.3',downloads:'189万',goodRate:'94%',category:'捉宠',slogan:'自主研发的精灵大世界游戏'},
  ys:       {name:'原神',icon:'🌍',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774239539707_df706b30589bcac7805776b2c59af966.png',iconLocal:'',bg:'linear-gradient(135deg,#2a3a5a,#4a6090)',size:'4.2GB',score:'9.7',downloads:'156万',goodRate:'98%',category:'二次元',slogan:'全新开放世界冒险RPG'},
  wwqy:     {name:'无畏契约：源能行动',icon:'🎯',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774239097407_bdbd22085c7bf1dffc9f8e0f835c5e00.png',iconLocal:'',bg:'linear-gradient(135deg,#c0392b,#e74c3c)',size:'2.8GB',score:'9.4',downloads:'72万',goodRate:'95%',category:'射击',slogan:'全球流行的潮流射击竞技网游'},
  aqtw:     {name:'暗区突围',icon:'🔦',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774239168250_823efdbe8313c090d915f51069abd161.png',iconLocal:'',bg:'linear-gradient(135deg,#1a252f,#2c3e50)',size:'2.4GB',score:'9.2',downloads:'43万',goodRate:'93%',category:'射击',slogan:'自研的真硬核射击手游'},
  nzwl:     {name:'逆战：未来',icon:'🚀',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774239248341_df38ee4fdadeb1d4bf294ace9cb02f67.png',iconLocal:'',bg:'linear-gradient(135deg,#6c3483,#8e44ad)',size:'2.0GB',score:'9.1',downloads:'28万',goodRate:'92%',category:'射击',slogan:'PVE射击爽游'},
  cfm:      {name:'穿越火线-枪战王者',icon:'🔥',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774239347733_8535cc41795de70f54b2c481012be26b.png',iconLocal:'',bg:'linear-gradient(135deg,#a04000,#d35400)',size:'2.6GB',score:'9.3',downloads:'95万',goodRate:'95%',category:'射击',slogan:'CF正版第一人称射击手游'},
  '三国志': {name:'三国志·异闻录',icon:'🏯',iconUrl:'',iconLocal:'',bg:'linear-gradient(135deg,#4a2a0e,#8a5a2e)',size:'1.8GB',score:'9.2',downloads:'1.3万',goodRate:'93%',category:'策略',slogan:'三国策略经典之作'},
  '和平':   {name:'和平精英',icon:'🪂',iconUrl:'https://img.gamecenter.qq.com/xgame/gm/1774238896108_b346c0a61ed8685c57ce57fef4ef2135.png',iconLocal:'',bg:'linear-gradient(135deg,#2a5a2a,#3a8a3a)',size:'2.1GB',score:'9.5',downloads:'86万',goodRate:'96%',category:'射击',slogan:'自研打造的战术竞技手游'},
  _default: {name:'游戏',icon:'🎮',iconUrl:'',iconLocal:'',bg:'linear-gradient(135deg,#1a2040,#2a3060)',size:'1.2GB',score:'8.9',downloads:'5280',goodRate:'91%',category:'休闲',slogan:'精品游戏推荐'},
};

// ── 提醒页 — 游戏模式映射 ──────────────────────────────────
window.MOCK_MODE_MAP = { wzry:'排位', sjz:'据点争夺', hyrz:'忍者对战', hpjy:'经典模式', lkwg:'精灵冒险', ys:'每日委托', wwqy:'竞技模式', aqtw:'暗区突围', nzwl:'PVE副本', cfm:'爆破模式' };

// ── 详细数据面板 ──────────────────────────────────
window.MOCK_DETAIL_PRESETS = {
  wzry: {
    stats: [
      {val:'4/6/7',label:'KDA',color:'#f59e0b'}, {val:'18:42',label:'时长',color:'#1a1a2e'},
      {val:'67%',label:'参团率',color:'#22c55e'}, {val:'8,420',label:'输出',color:'#1a6bff'},
      {val:'3,210',label:'承伤',color:'#ef4444'}, {val:'12.3k',label:'经济',color:'#f59e0b'},
    ],
    trend: '近5场KDA呈上升趋势，参团率高于段位均值。建议减少独行，提高视野控制。',
  },
  hpjy: {
    stats: [
      {val:'5',label:'击杀',color:'#1a6bff'}, {val:'#12',label:'排名',color:'#f59e0b'},
      {val:'1,850',label:'伤害',color:'#ef4444'}, {val:'24:18',label:'存活时长',color:'#22c55e'},
      {val:'380m',label:'最远击杀',color:'#1a6bff'}, {val:'2',label:'急救',color:'#22c55e'},
    ],
    trend: '中远距离交战优秀，但决赛圈选位需优化。建议提前占据有利地形。',
  },
  sjz: {
    stats: [
      {val:'8/5/6',label:'KDA',color:'#f59e0b'}, {val:'12:35',label:'时长',color:'#1a1a2e'},
      {val:'MVP',label:'表现',color:'#22c55e'}, {val:'2,400',label:'输出',color:'#1a6bff'},
      {val:'1,800',label:'承伤',color:'#ef4444'}, {val:'3',label:'据点攻占',color:'#22c55e'},
    ],
    trend: '突破力强但存活率偏低，建议多利用烟雾弹掩护推进。',
  },
  hyrz: {
    stats: [
      {val:'影5',label:'段位',color:'#f59e0b'}, {val:'12,680',label:'战斗力',color:'#1a6bff'},
      {val:'186',label:'总胜场',color:'#22c55e'}, {val:'42',label:'完胜场',color:'#22c55e'},
      {val:'12',label:'最高连胜',color:'#1a6bff'}, {val:'38',label:'忍者数量',color:'#f59e0b'},
    ],
    trend: '连胜记录优秀，完胜场占比高。建议多尝试不同忍者组合，拓宽战术思路。',
  },
  wwqy: {
    stats: [
      {val:'铂金2',label:'段位',color:'#f59e0b'}, {val:'Lv.68',label:'游戏等级',color:'#1a1a2e'},
      {val:'23',label:'MVP次数',color:'#22c55e'}, {val:'218',label:'ACS',color:'#1a6bff'},
      {val:'1.35',label:'赛季KDA',color:'#22c55e'}, {val:'156',label:'精准击败',color:'#ef4444'},
    ],
    trend: 'ACS表现稳定，精准击败数优秀。建议多关注团队配合与道具经济管理。',
  },
  aqtw: {
    stats: [
      {val:'金牌',label:'段位',color:'#f59e0b'}, {val:'342',label:'总局数',color:'#1a1a2e'},
      {val:'580万',label:'仓库价值',color:'#1a6bff'}, {val:'62%',label:'撤离率',color:'#22c55e'},
      {val:'486',label:'累计淘汰',color:'#ef4444'}, {val:'1.8',label:'战损比',color:'#f59e0b'},
    ],
    trend: '撤离率高于平均水平，战损比良好。建议控制每局投入成本，稳步积累仓库价值。',
  },
  cfm: {
    stats: [
      {val:'12/6/4',label:'KDA',color:'#f59e0b'}, {val:'2:15',label:'时长',color:'#1a1a2e'},
      {val:'ACE',label:'表现',color:'#22c55e'}, {val:'2,800',label:'输出',color:'#1a6bff'},
      {val:'1,200',label:'承伤',color:'#ef4444'}, {val:'28',label:'爆头率%',color:'#f59e0b'},
    ],
    trend: '爆头率优秀，投雷精准。建议多练习身法走位，提高残局翻盘能力。',
  },
  ys: {
    stats: [
      {val:'3★',label:'星数',color:'#f59e0b'}, {val:'1:42',label:'用时',color:'#1a1a2e'},
      {val:'87%',label:'元素反应',color:'#22c55e'}, {val:'280k',label:'总伤害',color:'#1a6bff'},
      {val:'15s',label:'最快半场',color:'#22c55e'}, {val:'A',label:'评级',color:'#1a6bff'},
    ],
    trend: '元素反应覆盖率高，但轴序切换有延迟。优化E→Q衔接可提升15%输出。',
  },
};

// ── 情绪互动按钮映射 ──────────────────────────────────
window.MOCK_EMOTION_TEXT_MAP = { partner:'帮我找个搭子', replay:'帮我复盘上一把', guide:'朵莉亚怎么出装', rest:'_rest', highlight:'帮我生成高光视频', record:'查查我的战绩', report:'看看我的周报', skin:'最近有什么新品上架', news:'最近有什么游戏资讯' };
