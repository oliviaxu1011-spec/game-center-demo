// ============================================================
// AI复盘 模拟数据
// 修改说明：编辑各游戏、各时间段的复盘数据（英雄、战果、KDA、AI分析等）
// ============================================================
window.MOCK_REPLAY_PRESETS = {
  wzry: {
    last_match: {
      hero:'马可', heroIcon:'⚔️', result:'lose', duration:'18:42', time:'2小时前', k:4, d:6, a:7, mode:'排位赛',
      insight:'8-12分钟频繁单独进攻，3次死亡发生在无视野区域。建议中期跟随团队，避免孤立作战。',
      // ── AI 总结 + 对战总评 + 玩家点评 ──
      summaryTitle: '负重前行',
      reviewText: '对面大司命是节奏发动机，从头杀到尾；咱们的猴哥是对面经济的发动机，从头送到尾。你这把海诺打得真不错了，对线、支援都尽力了，输了不怪你！',
      playerCard: {
        heroName: '海诺', heroImg: 'game-tab-assets/hero/hero-6.png',
        kda: '4杀/6死/7助', score: '5.8分',
        badges: ['金牌射手'],
        title: '人形盾牌',
        comment: '海诺本局的任务是"前排吸收伤害"，执行标准是"站得住就算赢"。可惜，对面的大司命伤害太高，你每次冲上去都像在给对面喂经济。好在你的存在感拉满，对面五个人优先集火你，队友才有了输出空间，属于典型的<span class="rp-gold">"我死了，但我队友活了"</span>。'
      }
    },
    today: {
      hero:'嫦娥', heroIcon:'🌙', result:'win', duration:'22:10', time:'今天下午', k:6, d:2, a:11, mode:'排位赛',
      insight:'大招命中率达81%，团战贡献突出。但第15分钟蹲草过久，错失反推机会。',
      summaryTitle: '月下无双',
      reviewText: '这把嫦娥属于是"神仙操作"，大招命中率81%，团战贡献拉满！对面后排被你追着打，根本不敢露头。就是中期有一波蹲草时间太长，不然能更快结束比赛。',
      playerCard: {
        heroName: '嫦娥', heroImg: 'game-tab-assets/hero/hero-2.png',
        kda: '6杀/2死/11助', score: '8.7分',
        badges: ['MVP', '金牌法师'],
        title: '月光收割机',
        comment: '嫦娥这把属于"法力无边"模式，蓝量就是你的生命值，你把"蓝血互换"玩明白了。对面刺客看到你都绕着走，因为他们知道一套秒不掉你，反而会被你的月光反杀。出装思路完美，冰杖减速配合大招收割，属于典型的<span class="rp-gold">"追不上，打不过，跑不掉"</span>。'
      }
    },
    yesterday: {
      hero:'兰陵王', heroIcon:'🗡️', result:'lose', duration:'14:30', time:'昨天晚上', k:2, d:8, a:3, mode:'排位赛',
      insight:'前期抢红BUFF两次失败导致节奏崩盘，建议开局优先刷野保证经济。',
      summaryTitle: '迷雾困局',
      reviewText: '这把兰陵王的节奏从开局就崩了，两次抢红失败直接让你经济落后一截。对面打野反野太凶，你的隐身突进变成了"隐身送人头"。不过比赛本身就很难打，对面阵容克制太严重了。',
      playerCard: {
        heroName: '兰陵王', heroImg: 'game-tab-assets/hero/hero-3.png',
        kda: '2杀/8死/3助', score: '3.2分',
        badges: ['金牌打野'],
        title: '隐身快递员',
        comment: '兰陵王本局的工作是"敌方后排质检员"，可惜质检还没开始，自己就先被检查了。前期两次抢红失败，直接变成"无装备裸奔刺客"。每次隐身摸到后排，还没出手就被控住，属于典型的<span class="rp-gold">"来了，看到了，被秒了"</span>。下次记住：没有经济的刺客不叫刺客，叫移动提款机。'
      }
    },
  },
};

// genReportData 用 — 日报/周报的基准数据（动态日期）
(function() {
  const now = new Date();
  const fmt = (d) => (d.getMonth()+1) + '.' + d.getDate();
  const dayMs = 86400000;
  // 本周（周一到今天）
  const dow = now.getDay() || 7; // 周日=7
  const weekStart = new Date(now.getTime() - (dow-1)*dayMs);
  const weekEnd = now;
  // 上周
  const lastWeekEnd = new Date(weekStart.getTime() - dayMs);
  const lastWeekStart = new Date(lastWeekEnd.getTime() - 6*dayMs);
  // 本月
  const monthLabel = (now.getMonth()+1) + '月';
  // 近3日
  const d3Start = new Date(now.getTime() - 2*dayMs);
  // 近7日
  const d7Start = new Date(now.getTime() - 6*dayMs);

  window.MOCK_REPORT_PRESETS = {
    wzry: {
      today:     { title:'今日战报', period:'今天',                          matches:3,  winRate:67, hours:'1.5h', stars:1,  summary:'嫦娥发挥亮眼', tip:'今天3场赢了2场，嫦娥表现亮眼，上了1颗星 💪' },
      yesterday: { title:'昨日战报', period:'昨天',                          matches:4,  winRate:50, hours:'1.8h', stars:0,  summary:'中规中矩的一天', tip:'昨天王者发挥中规中矩，兰陵王那把拖了后腿，星数没变' },
      week:      { title:'本周报告', period:fmt(weekStart)+'-'+fmt(weekEnd), matches:27, winRate:59, hours:'10h',  stars:5,  summary:'状态火热，稳步上星', tip:'本周王者状态火热，胜率比上周提升 +11%，净上5颗星 🔥' },
      last_week: { title:'上周报告', period:fmt(lastWeekStart)+'-'+fmt(lastWeekEnd), matches:18, winRate:44, hours:'7h', stars:-2, summary:'精湛操作，稳步上星', tip:'上周王者胜率偏低，主要输在排位赛，掉了2颗星' },
      month:     { title:'本月报告', period:monthLabel+'全月',               matches:73, winRate:55, hours:'28h',  stars:8,  summary:'本月主力输出，稳定发挥', tip:'本月王者是主力，净上8颗星，保持得不错！' },
      '3days':   { title:'近3日战报', period:fmt(d3Start)+'-'+fmt(now),      matches:8,  winRate:63, hours:'3.5h', stars:3,  summary:'近日状态不错', tip:'近三天王者状态不错，上了3颗星 👍' },
      recent:    { title:'近7日战报', period:fmt(d7Start)+'-'+fmt(now),      matches:17, winRate:59, hours:'6.5h', stars:4,  summary:'近期表现稳定', tip:'近7天王者表现稳定，净上4颗星，继续保持！' },
    },
    hpjy: {
      today:     { title:'今日战报', period:'今天',                          matches:1,  winRate:0,  hours:'0.5h', kills:3,  tip:'今天只打了一把，击杀3人，明天再来！' },
      yesterday: { title:'昨日战报', period:'昨天',                          matches:2,  winRate:50, hours:'1h',   kills:8,  tip:'昨天和平精英小打两把，击杀8人 🔫' },
      week:      { title:'本周报告', period:fmt(weekStart)+'-'+fmt(weekEnd), matches:4,  winRate:50, hours:'1.5h', kills:15, tip:'本周和平精英击杀15人，保持手感就好' },
      last_week: { title:'上周报告', period:fmt(lastWeekStart)+'-'+fmt(lastWeekEnd), matches:11, winRate:55, hours:'4h', kills:42, tip:'上周和平精英击杀42人，发挥不错 📈' },
      month:     { title:'本月报告', period:monthLabel+'全月',               matches:11, winRate:45, hours:'4h',   kills:38, tip:'本月和平精英击杀38人，可以多练练手感' },
      '3days':   { title:'近3日战报', period:fmt(d3Start)+'-'+fmt(now),      matches:2,  winRate:50, hours:'0.8h', kills:7,  tip:'近三天和平精英击杀7人，表现中规中矩' },
      recent:    { title:'近7日战报', period:fmt(d7Start)+'-'+fmt(now),      matches:2,  winRate:50, hours:'1h',   kills:9,  tip:'近7天和平精英击杀9人，状态保持中' },
    },
    sjz: {
      today:     { title:'今日战报', period:'今天',                          matches:2,  extractRate:50, hours:'1h',   loot:12800,  tip:'今天三角洲打了2把，撤离1次，收货12800' },
      yesterday: { title:'昨日战报', period:'昨天',                          matches:3,  extractRate:33, hours:'1.2h', loot:8500,   tip:'昨天三角洲撤离率偏低，收货一般，需要调整策略' },
      week:      { title:'本周报告', period:fmt(weekStart)+'-'+fmt(weekEnd), matches:7,  extractRate:43, hours:'2.5h', loot:45600,  tip:'本周三角洲撤离率偏低，收货45600，建议多练练' },
      last_week: { title:'上周报告', period:fmt(lastWeekStart)+'-'+fmt(lastWeekEnd), matches:5, extractRate:60, hours:'2h', loot:38200, tip:'上周三角洲撤离率不错，收货38200，越打越有感觉' },
      month:     { title:'本月报告', period:monthLabel+'全月',               matches:28, extractRate:50, hours:'10h',  loot:186000, tip:'本月三角洲打了不少，收货186000，撤离率五五开' },
      '3days':   { title:'近3日战报', period:fmt(d3Start)+'-'+fmt(now),      matches:3,  extractRate:33, hours:'1h',   loot:9800,   tip:'近三天三角洲撤离率偏低，收货9800，慢慢提升吧' },
      recent:    { title:'近7日战报', period:fmt(d7Start)+'-'+fmt(now),      matches:5,  extractRate:60, hours:'2h',   loot:42000,  tip:'近7天三角洲撤离率不错，收货42000，越打越有感觉' },
    },
  };
})();
