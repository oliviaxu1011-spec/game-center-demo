// ============================================================
// 游戏数据库 — 支持的游戏及其识别关键词
// 修改说明：新增游戏只需加一条记录，刷新页面生效
// ============================================================
window.DATA_GAMES = {
  wzry: {
    id: 'wzry', name: '王者荣耀', icon: '⚔️', emoji: '👑',
    color: '#c9a227', gradient: 'linear-gradient(135deg,#c9a227,#f0d060)',
    keywords: ['王者','荣耀','王者荣耀','wzry','农药'],
  },
  hpjy: {
    id: 'hpjy', name: '和平精英', icon: '🪂', emoji: '🔫',
    color: '#3a8a3a', gradient: 'linear-gradient(135deg,#2a5a2a,#3a8a3a)',
    keywords: ['和平','精英','和平精英','吃鸡','hpjy','绝地'],
  },
  sjz: {
    id: 'sjz', name: '三角洲行动', icon: '🔫', emoji: '🎯',
    color: '#2a6090', gradient: 'linear-gradient(135deg,#1a3a5e,#2a6090)',
    keywords: ['三角','三角洲','行动','sjz','三角洲行动','delta'],
  },
  lol: {
    id: 'lol', name: '英雄联盟手游', icon: '🏰', emoji: '⚡',
    color: '#c0392b', gradient: 'linear-gradient(135deg,#8b0000,#cc2200)',
    keywords: ['英雄联盟','lol','LOL','撸啊撸','联盟'],
  },
  ys: {
    id: 'ys', name: '原神', icon: '🌍', emoji: '✨',
    color: '#5a7abf', gradient: 'linear-gradient(135deg,#2a3a5a,#4a6090)',
    keywords: ['原神','genshin','提瓦特'],
  },
};

// 默认游戏标识（未指定时使用哪个游戏的 id）
window.DATA_DEFAULT_GAME_ID = 'wzry';
