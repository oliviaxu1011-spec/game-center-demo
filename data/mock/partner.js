// ============================================================
// 找搭子 模拟数据
// 修改说明：编辑各游戏的搭子列表即可更新匹配结果
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
    { avatar:'🦁', bg:'linear-gradient(135deg,#1a5090,#4a8adf)', name:'暗影刀锋', rank:'铂金II', role:'打野', heroes:['李白','韩信','赵云','兰陵王'], tags:['上分型','语音开黑'], desc:'国服李白2000场 胜率62%' },
    { avatar:'🌸', bg:'linear-gradient(135deg,#c0392b,#e74c3c)', name:'樱花剑士', rank:'钻石V', role:'中单', heroes:['诸葛亮','貂蝉','王昭君','嫦娥'], tags:['教学耐心','不倾诉'], desc:'诸葛亮1500场 胜率58%' },
    { avatar:'🐉', bg:'linear-gradient(135deg,#1a5276,#2e86c1)', name:'龙腾四海', rank:'铂金V', role:'辅助', heroes:['瑶','张飞','鬼谷子','蔡文姬'], tags:['稳健型','不开麦'], desc:'瑶妹800场 胜率55%' },
    { avatar:'🏹', bg:'linear-gradient(135deg,#8b6914,#c9a227)', name:'百步穿杨', rank:'钻石III', role:'射手', heroes:['后羿','马可波罗','孙尚香','鲁班七号'], tags:['补刀精准','走A流'], desc:'后羿1200场 胜率60%' },
    { avatar:'⚔️', bg:'linear-gradient(135deg,#2a5a2a,#3a8a3a)', name:'战神归来', rank:'星耀II', role:'上单', heroes:['花木兰','关羽','吕布','亚瑟'], tags:['单带型','会切后排'], desc:'花木兰900场 胜率57%' },
    { avatar:'🌙', bg:'linear-gradient(135deg,#1a3a5e,#5ab0ff)', name:'月下独酌', rank:'钻石I', role:'打野', heroes:['露娜','李白','孙悟空'], tags:['秀操作','carry型'], desc:'露娜2200场 胜率65%' },
  ],
  hpjy: [
    { avatar:'🦅', bg:'linear-gradient(135deg,#2a5a2a,#3a8a3a)', name:'丛林猎鹰', rank:'王牌II', role:'突击手', heroes:['M416','AKM','UMP45'], tags:['压枪稳','会指挥'], desc:'M416压枪王 吃鸡率18%' },
    { avatar:'🎯', bg:'linear-gradient(135deg,#8b6914,#c9a227)', name:'百步穿杨', rank:'无敌战神', role:'狙击手', heroes:['AWM','Kar98k','SKS'], tags:['神枪手','不苟'], desc:'AWM爆头率42% 千米狙神' },
    { avatar:'🚁', bg:'linear-gradient(135deg,#1a3a5e,#2a6090)', name:'钢铁之翼', rank:'王牌V', role:'载具手', heroes:['DP-28','M416'], tags:['会开车','接人稳'], desc:'载具击杀王 场均跑毒0次' },
    { avatar:'💣', bg:'linear-gradient(135deg,#333,#666)', name:'爆破专家', rank:'王牌III', role:'突击手', heroes:['S12K','AKM','M416'], tags:['近战猛','投雷准'], desc:'手雷击杀200+ 决赛圈之王' },
  ],
  sjz: [
    { avatar:'🔫', bg:'linear-gradient(135deg,#333,#666)', name:'铁血战士', rank:'黄金I', role:'突击兵', heroes:['突击兵'], tags:['配合好','打法凶'], desc:'突击兵3000场 MVP率28%' },
    { avatar:'🛡️', bg:'linear-gradient(135deg,#1a3a5e,#2a6090)', name:'钢铁堡垒', rank:'铂金III', role:'重装兵', heroes:['重装兵','工程兵'], tags:['能抗伤','会报点'], desc:'重装专精 场均承伤最高' },
    { avatar:'🎯', bg:'linear-gradient(135deg,#1a5090,#4a8adf)', name:'暗夜之眼', rank:'黄金II', role:'狙击手', heroes:['狙击手','侦察兵'], tags:['精准射击','不抢人头'], desc:'狙击手爆头率38%' },
    { avatar:'💊', bg:'linear-gradient(135deg,#2a5a2a,#3a8a3a)', name:'生命之手', rank:'铂金I', role:'医疗兵', heroes:['医疗兵'], tags:['奶量足','走位安全'], desc:'医疗兵 场均治疗量2400' },
  ],
  lol: [
    { avatar:'⚡', bg:'linear-gradient(135deg,#c0392b,#e74c3c)', name:'疾风剑客', rank:'钻石III', role:'中单', heroes:['亚索','永恩','劫'], tags:['carry型','补刀好'], desc:'亚索1800场 胜率56%' },
    { avatar:'🐉', bg:'linear-gradient(135deg,#1a5276,#2e86c1)', name:'龙骑士', rank:'铂金I', role:'打野', heroes:['李青','赵信','螳螂'], tags:['gank准','抢龙稳'], desc:'李青盲僧 2500场 胜率58%' },
    { avatar:'🌟', bg:'linear-gradient(135deg,#8b6914,#c9a227)', name:'星光辅助', rank:'钻石V', role:'辅助', heroes:['璐璐','锤石','琴女'], tags:['视野好','保护型'], desc:'辅助之王 场均视野分87' },
    { avatar:'🏹', bg:'linear-gradient(135deg,#1a5090,#4a8adf)', name:'影刃射手', rank:'钻石II', role:'射手', heroes:['薇恩','金克丝','EZ'], tags:['走A丝滑','团战稳'], desc:'薇恩1200场 胜率61%' },
    { avatar:'🛡️', bg:'linear-gradient(135deg,#2a5a2a,#3a8a3a)', name:'不灭磐石', rank:'铂金III', role:'上单', heroes:['盖伦','锐雯'], tags:['抗压强','TP支援快'], desc:'上单之王 对线压制率72%' },
  ],
  ys: [
    { avatar:'🔥', bg:'linear-gradient(135deg,#c0392b,#e74c3c)', name:'胡桃主C', rank:'深渊满星', role:'主C', heroes:['胡桃','宵宫'], tags:['蒸发流','输出爆炸'], desc:'胡桃蒸发流 满星速通' },
    { avatar:'❄️', bg:'linear-gradient(135deg,#1a5276,#5ab0ff)', name:'冰原旅人', rank:'56级', role:'辅助', heroes:['钟离','班尼特','行秋'], tags:['会奶','盾很厚'], desc:'钟离6命 班尼特13精' },
    { avatar:'⚡', bg:'linear-gradient(135deg,#1a5090,#4a8adf)', name:'雷神之怒', rank:'深渊满星', role:'副C', heroes:['雷电将军','夜兰','香菱'], tags:['国家队','配合好'], desc:'雷神国家队 36秒满星' },
    { avatar:'🌿', bg:'linear-gradient(135deg,#2a5a2a,#3a8a3a)', name:'须弥学者', rank:'深渊满星', role:'辅助', heroes:['纳西妲','万叶','芙宁娜'], tags:['绽放流','元素精通'], desc:'纳西妲绽放 全队增伤王' },
    { avatar:'❄️', bg:'linear-gradient(135deg,#3a6a9a,#5ab0ff)', name:'璃月仙人', rank:'58级', role:'主C', heroes:['甘雨','神里绫华'], tags:['冻结队','永冻流'], desc:'甘雨冻结 操作简单' },
  ],
};
