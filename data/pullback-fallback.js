// ============================================================
// 拉回策略 + 兜底回复 — 非游戏话题时的引导配置
// 修改说明：编辑关键词(kw)和回复文案(reply)即可调整拉回策略
// L3 对话型文案：口语化、有温度、有情绪共鸣
// ============================================================

// 拉回策略：关键词匹配 → 将非游戏话题拉回到游戏功能
window.DATA_PULLBACKS = [
  { kw: ['累','困','烦','压力','难受','崩溃','焦虑','emo','不开心','难过','伤心','郁闷','丧','down'],  intentId:'emotion',  label:'😤 情绪互动',  reply:'听起来你需要放松一下 😮‍💨 游戏是个好出口——<strong>找个搭子开黑</strong>发泄一下？', qr:['找个人一起玩吧','看看最近打得怎么样'], _sceneKey:'tired' },
  { kw: ['无聊','没事干','闲','发呆','摸鱼','没意思','干啥'],  intentId:'partner',  label:'🤝 找搭子',    reply:'无聊？那正好！<strong>王者荣耀</strong>一把走起，帮你匹配在线搭子 🎮',             qr:['不如找人开黑？','今天有啥福利可以薅？'], _sceneKey:'bored' },
  { kw: ['吃饭','吃','喝','午饭','晚饭','早饭','外卖','奶茶'],  intentId:'welfare',  label:'🎁 福利/礼包', reply:'吃饭前先领个游戏礼包？<strong>今日福利</strong>限时领，三分钟搞定 🎁',             qr:['饭后顺便领个福利','王者今天有礼包哦'], _sceneKey:'eating' },
  { kw: ['睡觉','睡了','晚安','休息','早安','起床','醒了'],  intentId:'reminder', label:'⏰ 定时提醒',  reply:'睡前帮你设个提醒，<strong>明早登录</strong>领限时奖励不错过 ⏰',                  qr:['明天帮你提醒上线？','临睡前看看有啥好东西'], _sceneKey:'sleeping' },
  { kw: ['天气','下雨','晴','冷','热','大风','雾霾'],  intentId:'welfare',  label:'🎁 福利/礼包', reply:'管它天气怎样，<strong>今日游戏福利</strong>不受影响，快来领一波 🎁',              qr:['不如领个福利','今天有啥好活动'], _sceneKey:'weather' },
  { kw: ['工作','上班','加班','老板','会议','摸鱼','下班','放假','周末'],  intentId:'report',   label:'📅 日报/周报', reply:'打工人辛苦了！忙里偷闲看看<strong>本周游戏战绩报告</strong>充充电 ⚡',            qr:['摸鱼看看本周战报','查查最近战绩'], _sceneKey:'working' },
  { kw: ['钱','买','价格','贵','便宜','优惠','折扣','打折','省钱','划算'],  intentId:'skin',     label:'🛍️ 鹅毛市集', reply:'说到买买买，<strong>鹅毛市集</strong>最近有新品上架，性价比超高 👀',             qr:['逛逛鹅毛市集','看看有什么优惠'], _sceneKey:'money' },
  { kw: ['朋友','同学','同事','聚会','约','兄弟','姐妹','基友','闺蜜'],  intentId:'partner',  label:'🤝 找搭子',    reply:'约朋友？不如约游戏搭子！<strong>在线玩家</strong>随时等你组队 🤝',                qr:['一起开黑呀','找个搭子玩一把'], _sceneKey:'social' },
  { kw: ['学习','考试','期末','作业','论文','复习','卷','内卷'],  intentId:'partner',  label:'🤝 找搭子',    reply:'学累了就放松一下 📚→🎮 帮你<strong>匹配在线搭子</strong>休息一把？', qr:['学累了来一把？','看看今天有啥福利'], _sceneKey:'study' },
  { kw: ['帅','酷','好看','美','漂亮','颜值','颜'],  intentId:'skin',     label:'🛍️ 鹅毛市集', reply:'爱美之心人皆有之 ✨ 游戏里也要帅，逛逛<strong>鹅毛市集</strong>？', qr:['逛逛鹅毛市集','看看限定新品'], _sceneKey:'handsome' },
  { kw: ['赢','牛','厉害','nb','666','强','猛','6','niubi','awesome'],  intentId:'highlight', label:'🎬 高光/视频', reply:'666！要不要把<strong>精彩操作</strong>做成高光视频秀一波？🎬', qr:['做个高光视频秀一波','顺便看看战绩'], _sceneKey:'winning' },
  { kw: ['新','有什么','有啥','来了','出了','更新了','推出'],  intentId:'news',     label:'📰 游戏资讯', reply:'最新资讯来了！看看<strong>近期更新和活动</strong> 📰', qr:['看看最新资讯','今天有啥新活动'], _sceneKey:'newStuff' },
];

// 兜底回复：实在匹配不到任何关联时的随机回复
window.DATA_FALLBACKS = [
  { reply:'说的是！顺便说一句，<strong>今日游戏福利</strong>还没领，要不要看看？🎁', intentId:'welfare', label:'🎁 福利/礼包', qr:['今天有好东西，看看？','下次再说'] },
  { reply:'哈哈，不过你知道吗，游戏才是真正的解压神器 🎮 帮你<strong>找个搭子</strong>开一把？', intentId:'partner', label:'🤝 找搭子', qr:['一个人玩没意思？找个搭子','先不了'] },
  { reply:'嗯嗯～话说你最近<strong>游戏战绩</strong>怎么样？要不帮你查查？📊', intentId:'record', label:'🏆 战绩查询', qr:['看看最近战绩如何','复盘一下上一把？'] },
];
