// ============================================================
// 福利/礼包 模拟数据
// 修改说明：编辑各游戏的福利条目即可更新展示内容
// ============================================================

// buildWelfareResponse 用 — 按游戏分组的福利数据
// url 字段为礼包跳转地址（speed.gamecenter.qq.com 专用礼包入口）
window.MOCK_WELFARE_BY_GAME = {
  wzry: [
    {icon:'⚔️',cls:'wzry',game:'王者荣耀',name:'英雄碎片 ×20',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104466820&adtag=10007'},
    {icon:'💎',cls:'wzry',game:'王者荣耀',name:'点券 ×18',dl:'明日12:00截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104466820&adtag=10007'},
    {icon:'🏆',cls:'wzry',game:'王者荣耀',name:'铭文碎片 ×50 + 金币 ×2000',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104466820&adtag=10007'},
  ],
  sjz: [
    {icon:'🔫',cls:'sjz',game:'三角洲行动',name:'补给箱 ×3',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110543085&adtag=10007'},
    {icon:'🎖️',cls:'sjz',game:'三角洲行动',name:'战术物资包',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110543085&adtag=10007'},
    {icon:'🛡️',cls:'sjz',game:'三角洲行动',name:'干员经验卡 ×500',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110543085&adtag=10007'},
  ],
  hyrz: [
    {icon:'🥷',cls:'hyrz',game:'火影忍者',name:'金币 ×5000',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104307008&adtag=10007'},
    {icon:'🌀',cls:'hyrz',game:'火影忍者',name:'忍者碎片 ×30',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104307008&adtag=10007'},
    {icon:'🔥',cls:'hyrz',game:'火影忍者',name:'体力 ×100 + 铜币 ×10000',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104307008&adtag=10007'},
  ],
  hpjy: [
    {icon:'🪂',cls:'hpjy',game:'和平精英',name:'金币 ×188',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1106467070&adtag=10007'},
    {icon:'🎒',cls:'hpjy',game:'和平精英',name:'精英补给箱',dl:'今日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1106467070&adtag=10007'},
    {icon:'🔫',cls:'hpjy',game:'和平精英',name:'枪械皮肤碎片 ×30',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1106467070&adtag=10007'},
  ],
  lkwg: [
    {icon:'🐾',cls:'lkwg',game:'洛克王国：世界',name:'精灵蛋 ×3',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110613799&adtag=10007'},
    {icon:'🌈',cls:'lkwg',game:'洛克王国：世界',name:'洛克贝 ×2000',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110613799&adtag=10007'},
    {icon:'⭐',cls:'lkwg',game:'洛克王国：世界',name:'经验果实 ×50',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110613799&adtag=10007'},
  ],
  ys: [
    {icon:'✨',cls:'ys',game:'原神',name:'原石 ×60',dl:'今日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110976923&adtag=10007'},
    {icon:'🌟',cls:'ys',game:'原神',name:'摩拉 ×20000',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110976923&adtag=10007'},
    {icon:'📦',cls:'ys',game:'原神',name:'大英雄的经验 ×5',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110976923&adtag=10007'},
  ],
  wwqy: [
    {icon:'🎯',cls:'wwqy',game:'无畏契约：源能行动',name:'辐能点 ×200',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1111677210&adtag=10007'},
    {icon:'💥',cls:'wwqy',game:'无畏契约：源能行动',name:'战令经验 ×500',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1111677210&adtag=10007'},
    {icon:'🏆',cls:'wwqy',game:'无畏契约：源能行动',name:'特工契约积分 ×300',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1111677210&adtag=10007'},
  ],
  aqtw: [
    {icon:'🔦',cls:'aqtw',game:'暗区突围',name:'秘银 ×500',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110196838&adtag=10007'},
    {icon:'🎒',cls:'aqtw',game:'暗区突围',name:'补给箱钥匙 ×3',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110196838&adtag=10007'},
    {icon:'🛡️',cls:'aqtw',game:'暗区突围',name:'防弹插板 ×5 + 急救包 ×10',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110196838&adtag=10007'},
  ],
  nzwl: [
    {icon:'🚀',cls:'nzwl',game:'逆战：未来',name:'钻石 ×200',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110484610&adtag=10007'},
    {icon:'🤖',cls:'nzwl',game:'逆战：未来',name:'武器箱 ×3',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110484610&adtag=10007'},
    {icon:'🔥',cls:'nzwl',game:'逆战：未来',name:'强化材料 ×50',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110484610&adtag=10007'},
  ],
  cfm: [
    {icon:'🔥',cls:'cfm',game:'穿越火线-枪战王者',name:'钻石 ×188',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104512706&adtag=10007'},
    {icon:'💣',cls:'cfm',game:'穿越火线-枪战王者',name:'武器箱钥匙 ×3',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104512706&adtag=10007'},
    {icon:'🎯',cls:'cfm',game:'穿越火线-枪战王者',name:'GP ×5000',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104512706&adtag=10007'},
  ],
};

// getPrebuiltCard 用 — 预构建福利卡片数据
// url 字段为礼包跳转地址（speed.gamecenter.qq.com 专用礼包入口）
window.MOCK_WELFARE_ITEMS = {
  welfare_wzry: [
    {icon:'⚔️',cls:'wzry',game:'王者荣耀',name:'英雄碎片 ×20',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104466820&adtag=10007'},
    {icon:'💎',cls:'wzry',game:'王者荣耀',name:'点券 ×18',dl:'明日12:00截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104466820&adtag=10007'},
    {icon:'🏆',cls:'wzry',game:'王者荣耀',name:'铭文碎片 ×50 + 金币 ×2000',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104466820&adtag=10007'},
  ],
  welfare_sjz: [
    {icon:'🔫',cls:'sjz',game:'三角洲行动',name:'补给箱 ×3',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110543085&adtag=10007'},
    {icon:'🎖️',cls:'sjz',game:'三角洲行动',name:'战术物资包',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110543085&adtag=10007'},
  ],
  welfare_hyrz: [
    {icon:'🥷',cls:'hyrz',game:'火影忍者',name:'金币 ×5000',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104307008&adtag=10007'},
    {icon:'🌀',cls:'hyrz',game:'火影忍者',name:'忍者碎片 ×30',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104307008&adtag=10007'},
  ],
  welfare_hpjy: [
    {icon:'🪂',cls:'hpjy',game:'和平精英',name:'金币 ×188',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1106467070&adtag=10007'},
    {icon:'🎒',cls:'hpjy',game:'和平精英',name:'精英补给箱',dl:'今日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1106467070&adtag=10007'},
  ],
  welfare_lkwg: [
    {icon:'🐾',cls:'lkwg',game:'洛克王国：世界',name:'精灵蛋 ×3',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110613799&adtag=10007'},
    {icon:'🌈',cls:'lkwg',game:'洛克王国：世界',name:'洛克贝 ×2000',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110613799&adtag=10007'},
  ],
  welfare_ys: [
    {icon:'✨',cls:'ys',game:'原神',name:'原石 ×60',dl:'今日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110976923&adtag=10007'},
    {icon:'🌟',cls:'ys',game:'原神',name:'摩拉 ×20000',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110976923&adtag=10007'},
  ],
  welfare_wwqy: [
    {icon:'🎯',cls:'wwqy',game:'无畏契约：源能行动',name:'辐能点 ×200',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1111677210&adtag=10007'},
    {icon:'💥',cls:'wwqy',game:'无畏契约：源能行动',name:'战令经验 ×500',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1111677210&adtag=10007'},
  ],
  welfare_aqtw: [
    {icon:'🔦',cls:'aqtw',game:'暗区突围',name:'秘银 ×500',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110196838&adtag=10007'},
    {icon:'🎒',cls:'aqtw',game:'暗区突围',name:'补给箱钥匙 ×3',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110196838&adtag=10007'},
  ],
  welfare_nzwl: [
    {icon:'🚀',cls:'nzwl',game:'逆战：未来',name:'钻石 ×200',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110484610&adtag=10007'},
    {icon:'🤖',cls:'nzwl',game:'逆战：未来',name:'武器箱 ×3',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110484610&adtag=10007'},
  ],
  welfare_cfm: [
    {icon:'🔥',cls:'cfm',game:'穿越火线-枪战王者',name:'钻石 ×188',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104512706&adtag=10007'},
    {icon:'💣',cls:'cfm',game:'穿越火线-枪战王者',name:'武器箱钥匙 ×3',dl:'明日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104512706&adtag=10007'},
    {icon:'🎯',cls:'cfm',game:'穿越火线-枪战王者',name:'GP ×5000',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104512706&adtag=10007'},
  ],
  welfare__all: [
    {icon:'⚔️',cls:'wzry',game:'王者荣耀',name:'英雄碎片 ×20',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104466820&adtag=10007'},
    {icon:'🔫',cls:'sjz',game:'三角洲行动',name:'补给箱 ×3',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110543085&adtag=10007'},
    {icon:'🥷',cls:'hyrz',game:'火影忍者',name:'金币 ×5000',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104307008&adtag=10007'},
    {icon:'🪂',cls:'hpjy',game:'和平精英',name:'金币 ×188',dl:'3天后截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1106467070&adtag=10007'},
    {icon:'🐾',cls:'lkwg',game:'洛克王国：世界',name:'精灵蛋 ×3',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110613799&adtag=10007'},
    {icon:'✨',cls:'ys',game:'原神',name:'原石 ×60',dl:'今日截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110976923&adtag=10007'},
    {icon:'🎯',cls:'wwqy',game:'无畏契约：源能行动',name:'辐能点 ×200',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1111677210&adtag=10007'},
    {icon:'🔦',cls:'aqtw',game:'暗区突围',name:'秘银 ×500',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110196838&adtag=10007'},
    {icon:'🚀',cls:'nzwl',game:'逆战：未来',name:'钻石 ×200',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1110484610&adtag=10007'},
    {icon:'🔥',cls:'cfm',game:'穿越火线-枪战王者',name:'钻石 ×188',dl:'今日23:59截止',url:'https://speed.gamecenter.qq.com/pushgame/v1/gift/game?_wv=18950115&_wwv=393&appid=1104512706&adtag=10007'},
  ],
};
