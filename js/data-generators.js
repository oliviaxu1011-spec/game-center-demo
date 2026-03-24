// ============================================================
// 动态数据生成器 — 根据时间范围/游戏生成合理的 mock 数据
// 修改说明：直接编辑此文件即可调整数据生成逻辑，刷新页面生效
// ============================================================

window.genRecordData = function(range, game) {
  const gid = game?.id || 'wzry';

  // ── 判断是否为近期查询（7天以内含今天）──
  // 近期 tag：today, yesterday, week, 3days, recent
  // 全量 tag：last_week, month, all（或无法匹配的 fallback）
  const RECENT_TAGS = ['today', 'yesterday', 'week', '3days', 'recent'];
  const isRecentQuery = RECENT_TAGS.includes(range.tag);

  // ── 数据总览（data-card 风格，全量查询时使用）──
  const overviewPresets = window.MOCK_OVERVIEW_PRESETS || {};
  const overviewByGame = overviewPresets[gid] || overviewPresets.wzry || {};
  const overview = JSON.parse(JSON.stringify(overviewByGame[range.tag] || overviewByGame['week'] || {}));

  // ── 近期数据（rank-card 风格，近期查询时所有游戏都有）──
  let recentData = null;
  if (isRecentQuery) {
    const recentPresets = window.MOCK_RECENT_PRESETS || {};
    const recentByGame = recentPresets[gid] || recentPresets.wzry || {};
    recentData = JSON.parse(JSON.stringify(recentByGame[range.tag] || recentByGame['week'] || {}));
  }

  return { gid, overview, recentData, isRecentQuery };
};

window.genReplayData = function(range, game) {
  const gid = game?.id || 'wzry';
  // 各游戏复盘预设数据（从 data/mock/replay.js 加载）
  const gamePresets = window.MOCK_REPLAY_PRESETS || {};
  const presets = gamePresets[gid] || gamePresets.wzry || {};
  return presets[range.tag] || presets['last_match'] || {};
};

window.genReportData = function(range, game) {
  const gid = game?.id || 'wzry';
  // 报告预设数据（从 data/mock/replay.js 加载）— 按游戏×时间段
  const presets = window.MOCK_REPORT_PRESETS || {};
  const gamePresets = presets[gid] || presets.wzry || {};
  return gamePresets[range.tag] || gamePresets['week'] || {};
};

window.genDetailData = function(gameId, hero) {
  // 详细数据预设（从 data/mock/misc.js 加载）
  const presets = window.MOCK_DETAIL_PRESETS || {};
  return presets[gameId] || presets.wzry || {};
};
