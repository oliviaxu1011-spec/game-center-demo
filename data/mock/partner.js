// ============================================================
// 找搭子 模拟数据（推荐卡片风格）
// 修改说明：编辑各游戏的搭子列表即可更新匹配结果
// 字段说明：
//   avatar   - emoji 头像（兜底）
//   avatarBg - 头像外圈渐变色
//   name     - 玩家昵称
//   gender   - 'male' | 'female'
//   match    - 匹配度百分比，如 '97%'
//   rank     - 段位
//   status   - 在线状态，如 '在线' / '游戏中' / '离线'
//   winRate  - 胜率，如 '68%'
//   role     - 游戏位置/分路
//   heroes   - 擅长英雄/武器列表（用于匹配逻辑）
//   tags     - 标签数组，带 ✓ 前缀的为亮色蓝标签，其余为中性灰标签
//   reason   - 推荐理由（一句话）
// ============================================================

// 位置关键词识别表
window.MOCK_ROLE_KEYWORDS = {
  '打野':['打野','野区','刷野'], '上单':['上单','上路','对抗路'],
  '中单':['中单','中路','法师'], '射手':['射手','ADC','adc','下路'],
  '辅助':['辅助','辅','奶妈','保护'], '狙击':['狙击','狙','远程'],
  '突击':['突击','步兵','冲锋'], '重装':['重装','坦克','肉'],
  '主C':['主C','主c','输出','站场'], '副C':['副C','副c','挂机','脱手'],
};

// 搭子数据库
window.MOCK_PARTNER_DATA = {
  wzry: [
    {
      avatar:'🦁', avatarBg:'linear-gradient(135deg, #FF80BF, #A78BFA, #60A5FA)',
      name:'甜甜辅助', gender:'female', match:'97%',
      rank:'星耀III', status:'游戏中', winRate:'68%', role:'辅助',
      heroes:['鬼谷子','瑶','张飞','蔡文姬'],
      tags:['✓ 可开麦','✓ 国服鬼谷子','不喷人'],
      reason:'辅助胜率68%，和你段位和分路匹配'
    },
    {
      avatar:'⚔️', avatarBg:'linear-gradient(135deg, #60A5FA, #34D399, #FBBF24)',
      name:'暗影刀锋', gender:'male', match:'93%',
      rank:'尊贵铂金II', status:'在线', winRate:'62%', role:'打野',
      heroes:['李白','韩信','赵云','兰陵王'],
      tags:['✓ 上分型','✓ 语音开黑','节奏快'],
      reason:'打野胜率62%，李白2000场，Carry能力强'
    },
    {
      avatar:'🌸', avatarBg:'linear-gradient(135deg, #F472B6, #C084FC, #818CF8)',
      name:'樱花剑士', gender:'female', match:'89%',
      rank:'永恒钻石V', status:'在线', winRate:'58%', role:'中单',
      heroes:['诸葛亮','貂蝉','王昭君','嫦娥'],
      tags:['✓ 教学耐心','✓ 中路稳健','不倾诉'],
      reason:'中单法师胜率58%，打法稳健适合配合'
    },
    {
      avatar:'🐉', avatarBg:'linear-gradient(135deg, #34D399, #60A5FA, #A78BFA)',
      name:'龙腾四海', gender:'male', match:'85%',
      rank:'尊贵铂金V', status:'离线', winRate:'55%', role:'辅助',
      heroes:['瑶','张飞','鬼谷子','蔡文姬'],
      tags:['✓ 稳健型','不开麦'],
      reason:'辅助专精，瑶800场胜率稳定'
    },
    {
      avatar:'🏹', avatarBg:'linear-gradient(135deg, #FBBF24, #F97316, #EF4444)',
      name:'百步穿杨', gender:'male', match:'82%',
      rank:'永恒钻石III', status:'游戏中', winRate:'60%', role:'射手',
      heroes:['后羿','马可波罗','孙尚香','鲁班七号'],
      tags:['✓ 补刀精准','走A流'],
      reason:'射手位胜率60%，后羿1200场走A极致'
    },
    {
      avatar:'🌙', avatarBg:'linear-gradient(135deg, #818CF8, #C084FC, #F472B6)',
      name:'月下独酌', gender:'male', match:'80%',
      rank:'永恒钻石I', status:'在线', winRate:'65%', role:'打野',
      heroes:['露娜','李白','孙悟空'],
      tags:['✓ 秀操作','✓ carry型','会切后排'],
      reason:'露娜2200场胜率65%，操作天花板'
    },
  ],
  hpjy: [
    {
      avatar:'🦅', avatarBg:'linear-gradient(135deg, #34D399, #60A5FA, #FBBF24)',
      name:'丛林猎鹰', gender:'male', match:'95%',
      rank:'超级王牌', status:'在线', winRate:'58%', role:'突击手',
      heroes:['M416','AKM','UMP45'],
      tags:['✓ 压枪稳','✓ 会指挥','配合默契'],
      reason:'突击手胜率58%，M416压枪王，吃鸡率18%'
    },
    {
      avatar:'🎯', avatarBg:'linear-gradient(135deg, #FBBF24, #F97316, #EF4444)',
      name:'百步穿杨', gender:'male', match:'91%',
      rank:'无敌战神', status:'游戏中', winRate:'52%', role:'狙击手',
      heroes:['AWM','Kar98k','SKS'],
      tags:['✓ 神枪手','不苟'],
      reason:'AWM爆头率42%，千米狙神'
    },
    {
      avatar:'🚁', avatarBg:'linear-gradient(135deg, #60A5FA, #818CF8, #C084FC)',
      name:'钢铁之翼', gender:'male', match:'87%',
      rank:'荣耀皇冠II', status:'在线', winRate:'55%', role:'载具手',
      heroes:['DP-28','M416'],
      tags:['✓ 会开车','接人稳'],
      reason:'载具击杀王，场均跑毒0次'
    },
    {
      avatar:'💣', avatarBg:'linear-gradient(135deg, #6B7280, #9CA3AF, #D1D5DB)',
      name:'爆破专家', gender:'male', match:'83%',
      rank:'荣耀皇冠I', status:'离线', winRate:'50%', role:'突击手',
      heroes:['S12K','AKM','M416'],
      tags:['✓ 近战猛','投雷准'],
      reason:'手雷击杀200+，决赛圈之王'
    },
  ],
  sjz: [
    {
      avatar:'🔫', avatarBg:'linear-gradient(135deg, #6B7280, #9CA3AF, #D1D5DB)',
      name:'铁血战士', gender:'male', match:'94%',
      rank:'黄金Ⅰ', status:'在线', winRate:'56%', role:'突击兵',
      heroes:['突击兵'],
      tags:['✓ 配合好','✓ 打法凶','团战型'],
      reason:'突击兵3000场，MVP率28%，团战核心'
    },
    {
      avatar:'🛡️', avatarBg:'linear-gradient(135deg, #60A5FA, #34D399, #FBBF24)',
      name:'钢铁堡垒', gender:'male', match:'90%',
      rank:'铂金Ⅲ', status:'游戏中', winRate:'53%', role:'重装兵',
      heroes:['重装兵','工程兵'],
      tags:['✓ 能抗伤','会报点'],
      reason:'重装专精，场均承伤最高'
    },
    {
      avatar:'🎯', avatarBg:'linear-gradient(135deg, #818CF8, #C084FC, #F472B6)',
      name:'暗夜之眼', gender:'female', match:'86%',
      rank:'黄金Ⅱ', status:'在线', winRate:'51%', role:'狙击手',
      heroes:['狙击手','侦察兵'],
      tags:['✓ 精准射击','不抢人头'],
      reason:'狙击手爆头率38%，远程压制强'
    },
    {
      avatar:'💊', avatarBg:'linear-gradient(135deg, #34D399, #60A5FA, #A78BFA)',
      name:'生命之手', gender:'female', match:'82%',
      rank:'铂金Ⅰ', status:'在线', winRate:'54%', role:'医疗兵',
      heroes:['医疗兵'],
      tags:['✓ 奶量足','走位安全'],
      reason:'医疗兵专精，场均治疗量2400'
    },
  ],
  cfm: [
    {
      avatar:'🔥', avatarBg:'linear-gradient(135deg, #F97316, #EF4444, #DC2626)',
      name:'爆破之王', gender:'male', match:'96%',
      rank:'枪王', status:'在线', winRate:'58%', role:'步枪手',
      heroes:['M4A1','AK47','AWM'],
      tags:['✓ 枪法准','✓ 会补枪','残局王'],
      reason:'M4A1爆头率32%，枪王段位稳定输出'
    },
    {
      avatar:'🎯', avatarBg:'linear-gradient(135deg, #60A5FA, #818CF8, #C084FC)',
      name:'千里追踪', gender:'male', match:'92%',
      rank:'传奇', status:'游戏中', winRate:'55%', role:'狙击手',
      heroes:['AWM','巴雷特','大炮'],
      tags:['✓ 狙击精准','残局稳'],
      reason:'AWM狙击手，爆头率45%'
    },
    {
      avatar:'💣', avatarBg:'linear-gradient(135deg, #6B7280, #9CA3AF, #D1D5DB)',
      name:'闪光大师', gender:'male', match:'88%',
      rank:'枪王', status:'在线', winRate:'53%', role:'突击手',
      heroes:['M4A1','AK47'],
      tags:['✓ 投雷准','身法好'],
      reason:'闪光+投雷配合，战术型选手'
    },
    {
      avatar:'🛡️', avatarBg:'linear-gradient(135deg, #34D399, #60A5FA, #FBBF24)',
      name:'钢铁意志', gender:'female', match:'84%',
      rank:'传奇', status:'离线', winRate:'51%', role:'冲锋手',
      heroes:['P90','MP5'],
      tags:['✓ 近战猛','不怕死'],
      reason:'冲锋枪专精，近距离之王'
    },
  ],
};
