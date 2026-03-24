// ============================================================
// 视频模板数据库 — 各游戏的高光视频模板配置
// 修改说明：编辑此文件即可调整视频生成模板，刷新页面生效
// ============================================================
// Mock 视频路径
const _V = 'data/mock/video/';
const _VIDEOS = {
  // 王者荣耀专用视频（4个）
  v1: _V + '50208_0bc3iqb62aadmyajpeocszusgrge5vcah3ka.f0.mp4',
  v2: _V + '50208_0bc3kia44aabryaloe6ahbuscuwezzjadtsa.f0.mp4',
  v3: _V + '50208_0bc3lmdniaagkaak5i6hwbusmw6e2rnqnvca.f0.mp4',
  v4: _V + '50208_0bc3wua7gaabuaaishwadnusdnoe6o2qd42a.f0.mp4',
  // 和平精英专用视频（1个）
  hp: _V + '50208_0bc33iavoaabfuacbwwalzusdwwek7nacv2a.f0.mp4',
};

// 封面图片路径
const _C = 'data/mock/video/covers/';
const _COVERS = {
  // 王者荣耀封面
  wzryKill:      _C + 'wzry-kill-highlight.png',
  wzryRetro:     _C + 'wzry-retro.png',
  wzryTeamfight: _C + 'wzry-teamfight.png',
  wzryMontage:   _C + 'wzry-montage.png',
  // 和平精英封面
  hpjySniper:    _C + 'hpjy-sniper.png',
  hpjyParachute: _C + 'hpjy-parachute.png',
  hpjyHeadshot:  _C + 'hpjy-headshot.png',
  hpjyVictory:   _C + 'hpjy-victory.png',
};

window.DATA_VIDEO_TEMPLATES = {
  wzry: {
    direct: { title:'击杀集锦·热血版', cover: _COVERS.wzryKill, tag:'效果预览', duration:'00:45', desc:'AI自动剪辑你的精彩击杀瞬间，配上热血BGM', videoSrc: _VIDEOS.v1 },
    ondemand: [
      { title:'击杀集锦·复古风', cover: _COVERS.wzryRetro, tag:'效果预览', duration:'00:52', desc:'每次点播耗时约15分钟，不消耗流量', style:'复古胶片风格', videoSrc: _VIDEOS.v2 },
      { title:'团战高光·史诗版', cover: _COVERS.wzryTeamfight, tag:'推荐', duration:'01:15', desc:'完整团战视角，震撼慢动作回放', style:'电影级特效', videoSrc: _VIDEOS.v3 },
      { title:'操作秀·节奏快剪', cover: _COVERS.wzryMontage, tag:'热门', duration:'00:30', desc:'快节奏剪辑，适合分享到动态', style:'短视频风格', videoSrc: _VIDEOS.v4 },
    ],
  },
  hpjy: {
    direct: { title:'吃鸡高光·战场纪录', cover: _COVERS.hpjySniper, tag:'效果预览', duration:'01:02', desc:'从跳伞到决赛圈，记录你的精彩瞬间', videoSrc: _VIDEOS.hp },
    ondemand: [
      { title:'击杀集锦·复古风', cover: _COVERS.hpjyParachute, tag:'效果预览', duration:'00:48', desc:'每次点播耗时约15分钟，不消耗流量', style:'复古胶片风格', videoSrc: _VIDEOS.hp },
      { title:'枪法秀·精准狙击', cover: _COVERS.hpjyHeadshot, tag:'推荐', duration:'00:35', desc:'高光狙击击杀瞬间合集', style:'慢动作回放', videoSrc: _VIDEOS.hp },
      { title:'吃鸡全程·纪录片', cover: _COVERS.hpjyVictory, tag:'完整版', duration:'02:30', desc:'完整对局精华浓缩，从跳伞到吃鸡', style:'纪录片风格', videoSrc: _VIDEOS.hp },
    ],
  },
  sjz: {
    direct: { title:'据点突破·战术高光', cover:'🔫💥', tag:'效果预览', duration:'00:38', desc:'战术配合精彩瞬间，AI智能剪辑', videoSrc: _VIDEOS.v3 },
    ondemand: [
      { title:'ACE集锦·硬核版', cover:'🔫🎬', tag:'效果预览', duration:'00:42', desc:'每次点播耗时约15分钟，不消耗流量', style:'硬核军事风', videoSrc: _VIDEOS.v4 },
      { title:'团队配合·战术版', cover:'🛡️💊', tag:'推荐', duration:'00:55', desc:'完美团队配合瞬间，展示战术默契', style:'战术分析视角', videoSrc: _VIDEOS.v1 },
      { title:'爆头集锦·精准版', cover:'🎯⚡', tag:'热门', duration:'00:25', desc:'连续爆头精彩操作，快节奏剪辑', style:'短视频风格', videoSrc: _VIDEOS.v2 },
    ],
  },
  cfm: {
    direct: { title:'爆破高光·热血版', cover:'🔥💥', tag:'效果预览', duration:'00:42', desc:'爆破模式精彩击杀瞬间，配上热血BGM', videoSrc: _VIDEOS.v4 },
    ondemand: [
      { title:'狙击集锦·精准版', cover:'🎯🎬', tag:'效果预览', duration:'00:38', desc:'每次点播耗时约15分钟，不消耗流量', style:'慢动作回放', videoSrc: _VIDEOS.v1 },
      { title:'ACE合集·传奇版', cover:'🔥🏆', tag:'推荐', duration:'01:00', desc:'ACE全灭精彩瞬间合集', style:'电影级特效', videoSrc: _VIDEOS.v2 },
      { title:'身法走位·丝滑版', cover:'💨✨', tag:'热门', duration:'00:25', desc:'极限身法走位和闪避操作', style:'短视频风格', videoSrc: _VIDEOS.v3 },
    ],
  },
  ys: {
    direct: { title:'深渊速通·满星纪录', cover:'🔥⚡', tag:'效果预览', duration:'01:10', desc:'深渊满星通关全过程精彩浓缩', videoSrc: _VIDEOS.v1 },
    ondemand: [
      { title:'大招集锦·华丽版', cover:'✨🎬', tag:'效果预览', duration:'00:45', desc:'每次点播耗时约15分钟，不消耗流量', style:'华丽特效风', videoSrc: _VIDEOS.v2 },
      { title:'元素反应·连锁版', cover:'🌊🔥', tag:'推荐', duration:'00:50', desc:'精彩元素反应连锁瞬间', style:'慢动作解析', videoSrc: _VIDEOS.v3 },
      { title:'探索集锦·风景版', cover:'🌍🌸', tag:'唯美', duration:'01:30', desc:'提瓦特最美风景与战斗瞬间', style:'唯美风格', videoSrc: _VIDEOS.v4 },
    ],
  },
};
