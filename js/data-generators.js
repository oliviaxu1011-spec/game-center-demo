// ============================================================
// 动态数据生成器 — 根据时间范围/游戏生成合理的 mock 数据
// 修改说明：直接编辑此文件即可调整数据生成逻辑，刷新页面生效
// ============================================================

window.genRecordData = function(range, game) {
  const gid = game?.id || 'wzry';
  // 各游戏的角色数据（从 data/mock/record.js 加载）
  const gameHeroes = window.MOCK_GAME_HEROES || {};
  const heroLabel = (gid === 'hpjy' || gid === 'sjz') ? '常用武器/兵种' : gid === 'ys' ? '最常使用角色' : '最常使用英雄';
  const scoreLabel = gid === 'ys' ? '探索度' : '场均评分';

  // 基础战绩预设（从 data/mock/record.js 加载）
  const basePresets = window.MOCK_BASE_PRESETS || {};
  // 原神用特别的度量
  if (gid === 'ys') {
    Object.keys(basePresets).forEach(k => {
      basePresets[k].winRate = '—'; basePresets[k].winColor = '#888';
      basePresets[k].score = k === 'today' ? '82%' : k === 'yesterday' ? '78%' : '85%';
    });
  }

  const base = basePresets[range.tag] || basePresets['week'];
  const heroSet = (gameHeroes[gid] || gameHeroes.wzry);
  const heroes = heroSet[range.tag] || heroSet.week || heroSet[Object.keys(heroSet)[0]];
  return { ...base, heroes, heroLabel, scoreLabel };
};

window.genReplayData = function(range, game) {
  const gid = game?.id || 'wzry';
  // 各游戏复盘预设数据（从 data/mock/replay.js 加载）
  const gamePresets = window.MOCK_REPLAY_PRESETS || {};
  const presets = gamePresets[gid] || gamePresets.wzry || {};
  return presets[range.tag] || presets['last_match'] || {};
};

window.genReportData = function(range) {
  // 报告预设数据（从 data/mock/replay.js 加载）
  const presets = window.MOCK_REPORT_PRESETS || {};
  return presets[range.tag] || presets['week'] || {};
};

window.genDetailData = function(gameId, hero) {
  // 详细数据预设（从 data/mock/misc.js 加载）
  const presets = window.MOCK_DETAIL_PRESETS || {};
  return presets[gameId] || presets.wzry || {};
};
