// ============================================================
// AI复盘 模拟数据
// 修改说明：编辑各游戏、各时间段的复盘数据（英雄、战果、KDA、AI分析等）
// ============================================================
window.MOCK_REPLAY_PRESETS = {
  wzry: {
    last_match: { hero:'亚瑟',  heroIcon:'⚔️', result:'lose', duration:'18:42', time:'2小时前', k:4,d:6,a:7,  mode:'排位赛', insight:'8-12分钟频繁单独进攻，3次死亡发生在无视野区域。建议中期跟随团队，避免孤立作战。' },
    today:      { hero:'嫦娥',  heroIcon:'🌙', result:'win',  duration:'22:10', time:'今天下午', k:6,d:2,a:11, mode:'排位赛', insight:'大招命中率达81%，团战贡献突出。但第15分钟蹲草过久，错失反推机会。' },
    yesterday:  { hero:'兰陵王',heroIcon:'🗡️', result:'lose', duration:'14:30', time:'昨天晚上', k:2,d:8,a:3,  mode:'排位赛', insight:'前期抢红BUFF两次失败导致节奏崩盘，建议开局优先刷野保证经济。' },
  },
  hpjy: {
    last_match: { hero:'M416主武器', heroIcon:'🔫', result:'lose', duration:'24:18', time:'1小时前', k:5,d:1,a:2,  mode:'经典模式', insight:'决赛圈选位偏高，被对手卡毒边击杀。建议决赛圈提前转移到安全区中心附近掩体。', kLabel:'击杀', dLabel:'排名', aLabel:'伤害', dVal:'#12', aVal:'1,850' },
    today:      { hero:'AWM狙击',   heroIcon:'🎯', result:'win',  duration:'28:05', time:'今天中午', k:11,d:0,a:3, mode:'经典模式', insight:'狙击命中率78%，决赛圈3连杀锁定吃鸡！前期可以更积极搜索空投。', kLabel:'击杀', dLabel:'排名', aLabel:'伤害', dVal:'#1', aVal:'2,680' },
    yesterday:  { hero:'手雷高光',   heroIcon:'💣', result:'lose', duration:'19:50', time:'昨天下午', k:3,d:1,a:1,  mode:'经典模式', insight:'中期过于保守缩圈，最终因装备劣势落败。建议中期适当攻楼获取更好装备。', kLabel:'击杀', dLabel:'排名', aLabel:'伤害', dVal:'#8', aVal:'980' },
  },
  sjz: {
    last_match: { hero:'突击兵', heroIcon:'🔫', result:'lose', duration:'12:35', time:'3小时前', k:8,d:5,a:6,  mode:'据点争夺', insight:'A点进攻时多次正面硬刚导致死亡，建议利用烟雾弹绕后包抄。' },
    today:      { hero:'狙击手', heroIcon:'🎯', result:'win',  duration:'15:20', time:'今天上午', k:14,d:2,a:4, mode:'据点争夺', insight:'远距离压制非常出色，MVP！中距离交战可以考虑切换副武器提高效率。' },
    yesterday:  { hero:'重装兵', heroIcon:'🛡️', result:'lose', duration:'10:48', time:'昨天晚上', k:3,d:7,a:8,  mode:'拆弹模式', insight:'频繁冲锋导致血量不足，重装兵应利用盾牌掩护队友推进而非单独冲锋。' },
  },
  lol: {
    last_match: { hero:'亚索',  heroIcon:'⚡', result:'lose', duration:'25:30', time:'2小时前', k:7,d:8,a:5,  mode:'排位赛', insight:'中期频繁单带被抓，建议团战期跟团输出而非分推。0/10/0定律提醒：别送了！' },
    today:      { hero:'阿狸',  heroIcon:'🔮', result:'win',  duration:'28:15', time:'今天下午', k:9,d:3,a:12, mode:'排位赛', insight:'团战E技能命中率极高，多次成功勾引敌方C位。继续保持！' },
    yesterday:  { hero:'赵信',  heroIcon:'🐉', result:'lose', duration:'20:10', time:'昨天晚上', k:4,d:6,a:7,  mode:'排位赛', insight:'前期入侵野区被反蹲2次，建议先确认敌方打野位置再入侵。' },
  },
  ys: {
    last_match: { hero:'胡桃',    heroIcon:'🔥', result:'win',  duration:'— ',   time:'2小时前', k:0,d:0,a:0, mode:'深渊12层', insight:'12-3上半间胡桃蒸发流伤害可观，但下半间切人时机偏慢，可以优化轴序。', kLabel:'星数', dLabel:'用时', aLabel:'阵容', dVal:'3★', aVal:'胡行钟夜' },
    today:      { hero:'雷电将军',heroIcon:'⚡', result:'win',  duration:'—',    time:'今天',   k:0,d:0,a:0, mode:'深渊12层', insight:'雷神国家队输出稳定，全星通关！可以尝试更换圣遗物提升15%伤害。', kLabel:'星数', dLabel:'用时', aLabel:'阵容', dVal:'3★', aVal:'雷万班香' },
    yesterday:  { hero:'甘雨',    heroIcon:'❄️', result:'lose', duration:'—',    time:'昨天',   k:0,d:0,a:0, mode:'深渊12层', insight:'甘雨冻结队在12-2遇到无法冻结的BOSS，建议换融化甘雨或胡桃队。', kLabel:'星数', dLabel:'用时', aLabel:'阵容', dVal:'2★', aVal:'甘莫迪万' },
  },
};

// genReportData 用 — 日报/周报的基准数据
window.MOCK_REPORT_PRESETS = {
  today:     { title:'今日战报',     period:'今天',         matches:3,  winRate:67, hours:'1.5h', bars:[{l:'王者荣耀',p:100,c:'#c9a227'}], tip:'今天3场赢了2场，发挥不错！继续保持 💪' },
  yesterday: { title:'昨日战报',     period:'昨天',         matches:5,  winRate:40, hours:'2.3h', bars:[{l:'王者荣耀',p:80,c:'#c9a227'},{l:'和平精英',p:20,c:'#3a8a3a'}], tip:'昨天胜率偏低，今天换个思路试试？' },
  week:      { title:'本周报告',     period:'3.11-3.17',    matches:38, winRate:55, hours:'14h',  bars:[{l:'王者荣耀',p:70,c:'#c9a227'},{l:'三角洲行动',p:20,c:'#2a6090'},{l:'和平精英',p:10,c:'#3a8a3a'}], tip:'本周胜率比上周提升 +7%，继续加油！' },
  last_week: { title:'上周报告',     period:'3.4-3.10',     matches:29, winRate:48, hours:'11h',  bars:[{l:'王者荣耀',p:60,c:'#c9a227'},{l:'和平精英',p:40,c:'#3a8a3a'}], tip:'上周整体偏弱，本周已经有进步了 📈' },
  month:     { title:'本月报告',     period:'3月全月',       matches:112,winRate:53, hours:'42h',  bars:[{l:'王者荣耀',p:65,c:'#c9a227'},{l:'三角洲行动',p:25,c:'#2a6090'},{l:'和平精英',p:10,c:'#3a8a3a'}], tip:'本月共打112场，场均评分7.1，稳步提升！' },
  '3days':   { title:'近3日战报',    period:'近3天',         matches:11, winRate:55, hours:'4.5h', bars:[{l:'王者荣耀',p:75,c:'#c9a227'},{l:'三角洲行动',p:25,c:'#2a6090'}], tip:'近三天状态不错，胜率稳定在55%以上 👍' },
  recent:    { title:'近7日战报',    period:'近7天',         matches:24, winRate:58, hours:'9.5h', bars:[{l:'王者荣耀',p:70,c:'#c9a227'},{l:'三角洲行动',p:20,c:'#2a6090'},{l:'和平精英',p:10,c:'#3a8a3a'}], tip:'近期胜率不错，继续保持！' },
};
