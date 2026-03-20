// ============================================================
// 福利/礼包 模拟数据
// 修改说明：编辑各游戏的福利条目即可更新展示内容
// ============================================================

// buildWelfareResponse 用 — 按游戏分组的福利数据
window.MOCK_WELFARE_BY_GAME = {
  wzry: [{icon:'⚔️',cls:'wzry',game:'王者荣耀',name:'英雄碎片 ×20',dl:'今日23:59截止'},{icon:'💎',cls:'wzry',game:'王者荣耀',name:'点券 ×18',dl:'明日12:00截止'},{icon:'🏆',cls:'wzry',game:'王者荣耀',name:'铭文碎片 ×50 + 金币 ×2000',dl:'3天后截止'}],
  hpjy: [{icon:'🪂',cls:'hpjy',game:'和平精英',name:'金币 ×188',dl:'3天后截止'},{icon:'🎒',cls:'hpjy',game:'和平精英',name:'精英补给箱',dl:'今日截止'},{icon:'🔫',cls:'hpjy',game:'和平精英',name:'枪械皮肤碎片 ×30',dl:'明日截止'}],
  sjz: [{icon:'🔫',cls:'sjz',game:'三角洲行动',name:'补给箱 ×3',dl:'今日23:59截止'},{icon:'🎖️',cls:'sjz',game:'三角洲行动',name:'战术物资包',dl:'明日截止'},{icon:'🛡️',cls:'sjz',game:'三角洲行动',name:'干员经验卡 ×500',dl:'3天后截止'}],
  lol: [{icon:'🏰',cls:'wzry',game:'英雄联盟手游',name:'英雄体验卡 ×3',dl:'今日23:59截止'},{icon:'💎',cls:'wzry',game:'英雄联盟手游',name:'蓝色精粹 ×200',dl:'明日截止'},{icon:'🎭',cls:'wzry',game:'英雄联盟手游',name:'随机皮肤碎片',dl:'3天后截止'}],
  ys: [{icon:'✨',cls:'wzry',game:'原神',name:'原石 ×60',dl:'今日截止'},{icon:'🌟',cls:'wzry',game:'原神',name:'摩拉 ×20000',dl:'明日截止'},{icon:'📦',cls:'wzry',game:'原神',name:'大英雄的经验 ×5',dl:'3天后截止'}],
};

// getPrebuiltCard 用 — 预构建福利卡片数据
window.MOCK_WELFARE_ITEMS = {
  welfare_wzry: [
    {icon:'⚔️',cls:'wzry',game:'王者荣耀',name:'英雄碎片 ×20',dl:'今日23:59截止'},
    {icon:'💎',cls:'wzry',game:'王者荣耀',name:'点券 ×18',dl:'明日12:00截止'},
    {icon:'🏆',cls:'wzry',game:'王者荣耀',name:'铭文碎片 ×50 + 金币 ×2000',dl:'3天后截止'},
  ],
  welfare_sjz: [
    {icon:'🔫',cls:'sjz',game:'三角洲行动',name:'补给箱 ×3',dl:'今日23:59截止'},
    {icon:'🎖️',cls:'sjz',game:'三角洲行动',name:'战术物资包',dl:'明日截止'},
  ],
  welfare_hpjy: [
    {icon:'🪂',cls:'hpjy',game:'和平精英',name:'金币 ×188',dl:'3天后截止'},
    {icon:'🎒',cls:'hpjy',game:'和平精英',name:'精英补给箱',dl:'今日截止'},
  ],
  welfare__all: [
    {icon:'⚔️',cls:'wzry',game:'王者荣耀',name:'英雄碎片 ×20',dl:'今日23:59截止'},
    {icon:'🔫',cls:'sjz',game:'三角洲行动',name:'补给箱 ×3',dl:'今日23:59截止'},
    {icon:'🪂',cls:'hpjy',game:'和平精英',name:'金币 ×188',dl:'3天后截止'},
  ],
};
