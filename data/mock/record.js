// ============================================================
// 战绩查询 模拟数据
// 修改说明：编辑各游戏、各时间段的英雄/武器数据和基准数据
// ============================================================

// genRecordData 用 — 各游戏在不同时间段的常用英雄/武器数据
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
  lol: {
    today:     [{i:'⚡',n:'亚索',r:'75%',c:'#22c55e'},{i:'🐉',n:'赵信',r:'50%',c:'#f59e0b'}],
    yesterday: [{i:'⚡',n:'亚索',r:'40%',c:'#ef4444'},{i:'🔮',n:'阿狸',r:'60%',c:'#22c55e'},{i:'🐉',n:'赵信',r:'33%',c:'#ef4444'}],
    week:      [{i:'⚡',n:'亚索',r:'58%',c:'#22c55e'},{i:'🔮',n:'阿狸',r:'55%',c:'#22c55e'},{i:'🐉',n:'赵信',r:'45%',c:'#ef4444'}],
  },
  ys: {
    today:     [{i:'⚡',n:'雷电将军',r:'—',c:'#888'},{i:'❄️',n:'甘雨',r:'—',c:'#888'}],
    yesterday: [{i:'🔥',n:'胡桃',r:'—',c:'#888'},{i:'⚡',n:'雷电将军',r:'—',c:'#888'},{i:'💧',n:'行秋',r:'—',c:'#888'}],
    week:      [{i:'🔥',n:'胡桃',r:'—',c:'#888'},{i:'⚡',n:'雷电将军',r:'—',c:'#888'},{i:'❄️',n:'甘雨',r:'—',c:'#888'}],
  },
};

// genRecordData 用 — 按时间标签的战绩基准数据
window.MOCK_BASE_PRESETS = {
  today:      { matches:3,  winRate:'67%', winColor:'#22c55e', score:'7.8' },
  yesterday:  { matches:5,  winRate:'40%', winColor:'#ef4444', score:'6.3' },
  '3days':    { matches:11, winRate:'55%', winColor:'#22c55e', score:'7.1' },
  week:       { matches:24, winRate:'58%', winColor:'#22c55e', score:'7.2' },
  last_week:  { matches:18, winRate:'44%', winColor:'#ef4444', score:'6.8' },
  month:      { matches:72, winRate:'52%', winColor:'#f59e0b', score:'7.0' },
  recent:     { matches:24, winRate:'58%', winColor:'#22c55e', score:'7.2' },
};

// buildRecordResponse 用 — 用户在玩游戏列表（未指定游戏时展示概览）
window.MOCK_USER_GAMES = [
  { id:'wzry', name:'王者荣耀', icon:'⚔️', color:'#c9a227', gradient:'linear-gradient(135deg,#c9a227,#f0d060)', matches:5, winRate:'40%', winColor:'#ef4444' },
  { id:'hpjy', name:'和平精英', icon:'🪂', color:'#3a8a3a', gradient:'linear-gradient(135deg,#2a5a2a,#3a8a3a)', matches:3, winRate:'33%', winColor:'#ef4444' },
  { id:'sjz',  name:'三角洲行动', icon:'🔫', color:'#2a6090', gradient:'linear-gradient(135deg,#1a3a5e,#2a6090)', matches:4, winRate:'50%', winColor:'#f59e0b' },
  { id:'lol',  name:'英雄联盟手游', icon:'🏰', color:'#c0392b', gradient:'linear-gradient(135deg,#8b0000,#cc2200)', matches:2, winRate:'50%', winColor:'#f59e0b' },
  { id:'ys',   name:'原神', icon:'🌍', color:'#5a7abf', gradient:'linear-gradient(135deg,#2a3a5a,#4a6090)', desc:'深渊12层 · 探索度 85%' },
];
