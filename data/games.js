// ============================================================
// 游戏数据库 — 支持的游戏及其识别关键词
// 修改说明：新增游戏只需加一条记录，刷新页面生效
// ============================================================
// 游戏状态枚举：download=下载 | reserve=预约 | update=更新
// 对应前端文案：立即下载 | 立即预约 | 立即更新
//
// media（可选）：素材配置，数组格式，支持图片链接或腾讯视频 vid
// 每项格式：{ type: 'image', url: '图片链接' } 或 { type: 'video', vid: '腾讯视频vid' }
// 配置后在下载卡片中展示，多个素材支持横向滑动查看
window.GAME_STATUS = {
  download: { key: 'download', text: '立即下载' },
  reserve:  { key: 'reserve',  text: '立即预约' },
  update:   { key: 'update',   text: '立即更新' },
};

window.DATA_GAMES = {
  wzry: {
    id: 'wzry', name: '王者荣耀', icon: '⚔️', emoji: '👑',
    skinLabel: '皮肤',  // 商业化产品术语
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774238622226_ecb8e5162318dc2b7616c4ff17bdecee.png',
    iconLocal: 'game-tab-assets/icon-wangzhe.png',
    color: '#c9a227', gradient: 'linear-gradient(135deg,#c9a227,#f0d060)',
    bg: 'linear-gradient(135deg,#c9a227,#f0d060)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    supportsRecentCard: true,  // 支持近7日战绩卡（rank-card 风格）
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/sgame.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1104466820%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%7D',
    slogan: '国民MOBA手游大作',
    keywords: ['王者','荣耀','王者荣耀','wzry','农药','峡谷'],
    status: 'download',     // 立即下载
    media: [
      { type: 'video', vid: 'i3185k0qdar' },
    ],
  },
  wzrysj: {
    id: 'wzrysj', name: '王者荣耀世界', icon: '⚔️', emoji: '🌍',
    skinLabel: '外观',  // 商业化产品术语
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774319960762_5e1a78ae171af8a95f33fc6d213ed1d8.png',
    iconLocal: '',
    color: '#8a5a2e', gradient: 'linear-gradient(135deg,#5a3a1e,#a87a3e)',
    bg: 'linear-gradient(135deg,#5a3a1e,#a87a3e)',
    cardBg: '',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/index.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1112067243%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%2C%22kr_turbo_display%22%3A%22on%22%2C%22kr_turbo_display_key_list%22%3A%22appid%22%7D',
    slogan: '王者荣耀开放世界冒险',
    keywords: ['王者荣耀世界','王者世界','wzrysj','荣耀世界'],
    status: 'reserve',          // 立即预约
    media: [
      { type: 'video', vid: 'v31937i51r7' },
    ],
  },
  sjz: {
    id: 'sjz', name: '三角洲行动', icon: '🔫', emoji: '🎯',
    skinLabel: '涂装',  // 商业化产品术语
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774238725456_8215684f47da3c5706cd646681a33f0d.png',
    iconLocal: '',
    color: '#2a6090', gradient: 'linear-gradient(135deg,#1a3a5e,#2a6090)',
    bg: 'linear-gradient(135deg,#1a3a5e,#2a6090)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/index.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1110543085%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%2C%22kr_turbo_display%22%3A%22on%22%2C%22kr_turbo_display_key_list%22%3A%22appid%22%7D',
    slogan: '战术射击品质标杆游戏',
    keywords: ['三角','三角洲','行动','sjz','三角洲行动','delta'],
    status: 'update',       // 立即更新
    media: [
      { type: 'video', vid: 'a31891u4k2m' },
    ],
  },
  hyrz: {
    id: 'hyrz', name: '火影忍者', icon: '🥷', emoji: '🔥',
    skinLabel: '忍者',  // 商业化产品术语
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774238828038_be2bcb4e595c41756ebaafbdc4d621a3.png',
    iconLocal: '',
    color: '#e67e22', gradient: 'linear-gradient(135deg,#c0392b,#e67e22)',
    bg: 'linear-gradient(135deg,#c0392b,#e67e22)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/index.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1104307008%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%2C%22kr_turbo_display%22%3A%22on%22%2C%22kr_turbo_display_key_list%22%3A%22appid%22%7D',
    slogan: '正版火影忍者格斗手游',
    keywords: ['火影','忍者','火影忍者','鸣人','佐助','hyrz'],
    status: 'update',       // 立即更新
  },
  hpjy: {
    id: 'hpjy', name: '和平精英', icon: '🪂', emoji: '🔫',
    skinLabel: '皮肤',  // 商业化产品术语（枪械皮肤/套装）
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774238896108_b346c0a61ed8685c57ce57fef4ef2135.png',
    iconLocal: '',
    color: '#3a8a3a', gradient: 'linear-gradient(135deg,#2a5a2a,#3a8a3a)',
    bg: 'linear-gradient(135deg,#2a5a2a,#3a8a3a)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/jdqsm.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1106467070%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%7D',
    slogan: '自研打造的战术竞技手游',
    keywords: ['和平','精英','和平精英','吃鸡','hpjy','绝地'],
    status: 'download',     // 立即下载
  },
  lkwg: {
    id: 'lkwg', name: '洛克王国：世界', icon: '🐾', emoji: '🌈',
    skinLabel: '精灵',  // 商业化产品术语
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774238990140_e01d65d4b535c3acec58aafad5913d25.png',
    iconLocal: '',
    color: '#3498db', gradient: 'linear-gradient(135deg,#2980b9,#3498db)',
    bg: 'linear-gradient(135deg,#2980b9,#3498db)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/index.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1110613799%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%2C%22kr_turbo_display%22%3A%22on%22%2C%22kr_turbo_display_key_list%22%3A%22appid%22%7D',
    slogan: '自主研发的精灵大世界游戏',
    keywords: ['洛克','洛克王国','世界','精灵','lkwg'],
    status: 'reserve',      // 立即预约
  },
  ys: {
    id: 'ys', name: '原神', icon: '🌍', emoji: '✨',
    skinLabel: '角色',  // 商业化产品术语（角色祈愿）
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774239539707_df706b30589bcac7805776b2c59af966.png',
    iconLocal: '',
    color: '#5a7abf', gradient: 'linear-gradient(135deg,#2a3a5a,#4a6090)',
    bg: 'linear-gradient(135deg,#2a3a5a,#4a6090)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/index.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1110976923%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%2C%22kr_turbo_display%22%3A%22on%22%2C%22kr_turbo_display_key_list%22%3A%22appid%22%7D',
    slogan: '全新开放世界冒险RPG',
    keywords: ['原神','genshin','提瓦特'],
    status: 'download',     // 立即下载
  },
  wwqy: {
    id: 'wwqy', name: '无畏契约：源能行动', icon: '🎯', emoji: '💥',
    skinLabel: '皮肤',  // 商业化产品术语（枪械皮肤）
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774239097407_bdbd22085c7bf1dffc9f8e0f835c5e00.png',
    iconLocal: '',
    color: '#e74c3c', gradient: 'linear-gradient(135deg,#c0392b,#e74c3c)',
    bg: 'linear-gradient(135deg,#c0392b,#e74c3c)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/index.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1111677210%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%2C%22kr_turbo_display%22%3A%22on%22%2C%22kr_turbo_display_key_list%22%3A%22appid%22%7D',
    slogan: '全球流行的潮流射击竞技网游',
    keywords: ['无畏','契约','无畏契约','源能','瓦罗兰特','valorant','wwqy'],
    status: 'download',     // 立即下载
  },
  aqtw: {
    id: 'aqtw', name: '暗区突围', icon: '🔦', emoji: '🎒',
    skinLabel: '外观',  // 商业化产品术语（角色/武器外观）
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774239168250_823efdbe8313c090d915f51069abd161.png',
    iconLocal: '',
    color: '#2c3e50', gradient: 'linear-gradient(135deg,#1a252f,#2c3e50)',
    bg: 'linear-gradient(135deg,#1a252f,#2c3e50)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/index.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1110196838%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%2C%22kr_turbo_display%22%3A%22on%22%2C%22kr_turbo_display_key_list%22%3A%22appid%22%7D',
    slogan: '自研的真硬核射击手游',
    keywords: ['暗区','突围','暗区突围','aqtw','塔科夫'],
    status: 'download',     // 立即下载
  },
  nzwl: {
    id: 'nzwl', name: '逆战：未来', icon: '🚀', emoji: '🤖',
    skinLabel: '武器',  // 商业化产品术语
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774239248341_df38ee4fdadeb1d4bf294ace9cb02f67.png',
    iconLocal: '',
    color: '#8e44ad', gradient: 'linear-gradient(135deg,#6c3483,#8e44ad)',
    bg: 'linear-gradient(135deg,#6c3483,#8e44ad)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/index.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1110484610%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%2C%22kr_turbo_display%22%3A%22on%22%2C%22kr_turbo_display_key_list%22%3A%22appid%22%7D',
    slogan: 'PVE射击爽游',
    keywords: ['逆战','未来','逆战未来','nzwl'],
    status: 'download',     // 立即下载
  },
  cfm: {
    id: 'cfm', name: '穿越火线-枪战王者', icon: '🔥', emoji: '💣',
    skinLabel: '武器',  // 商业化产品术语（英雄武器）
    iconUrl: 'https://img.gamecenter.qq.com/xgame/gm/1774239347733_8535cc41795de70f54b2c481012be26b.png',
    iconLocal: '',
    color: '#d35400', gradient: 'linear-gradient(135deg,#a04000,#d35400)',
    bg: 'linear-gradient(135deg,#a04000,#d35400)',
    cardBg: 'game-tab-assets/card2-bg-blur-65580c.png',
    jumpUrl: 'https://static.gamecenter.qq.com/xgame/gc-assets/pages/game-detail/index.html?page_name=QQGameCenterGameDetail&open_kuikly_info=%7B%22url%22%3A%22%3FFFROMSCHEMA%3D%26appid%3D1104512706%26adtag%3Dremen%22%2C%22page_name%22%3A%22QQGameCenterGameDetail%22%2C%22bundle_name%22%3A%22gamecenter_detail%22%2C%22kr_turbo_display%22%3A%22on%22%2C%22kr_turbo_display_key_list%22%3A%22appid%22%7D',
    slogan: 'CF正版第一人称射击手游',
    keywords: ['穿越火线','CF','cf','枪战王者','cfm','穿越'],
    status: 'update',       // 立即更新
  },
};

// 默认游戏标识（未指定时使用哪个游戏的 id）
window.DATA_DEFAULT_GAME_ID = 'wzry';
