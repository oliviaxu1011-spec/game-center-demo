// ============================================================
// 好友排行 模拟数据
// 修改说明：编辑各游戏的排行榜数据，刷新页面生效
// ============================================================

// ── 排行榜数据（按游戏分组）──
// 每个游戏包含多个榜单类型，每个榜单类型包含好友列表
window.MOCK_RANKING_DATA = {
  wzry: {
    tabs: ['上星榜', '击杀榜', 'MVP榜', '段位榜'],
    defaultTab: '上星榜',
    me: {
      name: 'Q仔（我）',
      avatar: 'my-tab-assets/rank-avatar-me.png',
      rank: 5,
      tier: '至尊星耀II',
      stats: { '上星榜': { value: 12, unit: '星', prefix: '上升' }, '击杀榜': { value: 186, unit: '次', prefix: '' }, 'MVP榜': { value: 28, unit: '次', prefix: '' }, '段位榜': { value: '至尊星耀II', unit: '', prefix: '' } },
      likes: 23,
    },
    friends: {
      '上星榜': [
        { rank: 1, name: '👑 一颗小星星', avatar: 'my-tab-assets/rank-avatar-1st.png', tier: '无双王者38星', value: 48, unit: '星', prefix: '上升', likes: 156 },
        { rank: 2, name: '无敌暴龙战士', avatar: 'my-tab-assets/rank-avatar-2nd.png', tier: '最强王者12星', value: 35, unit: '星', prefix: '上升', likes: 89 },
        { rank: 3, name: '峡谷小公主', avatar: 'my-tab-assets/rank-avatar-3rd.png', tier: '至尊星耀I', value: 20, unit: '星', prefix: '上升', likes: 45 },
        { rank: 4, name: '野区霸主', avatar: 'my-tab-assets/rank-avatar-4th.png', tier: '至尊星耀III', value: 8, unit: '星', prefix: '上升', likes: 12 },
      ],
      '击杀榜': [
        { rank: 1, name: '👑 一颗小星星', avatar: 'my-tab-assets/rank-avatar-1st.png', tier: '无双王者38星', value: 423, unit: '次', prefix: '', likes: 201 },
        { rank: 2, name: '无敌暴龙战士', avatar: 'my-tab-assets/rank-avatar-2nd.png', tier: '最强王者12星', value: 356, unit: '次', prefix: '', likes: 112 },
        { rank: 3, name: '峡谷小公主', avatar: 'my-tab-assets/rank-avatar-3rd.png', tier: '至尊星耀I', value: 298, unit: '次', prefix: '', likes: 67 },
        { rank: 4, name: '野区霸主', avatar: 'my-tab-assets/rank-avatar-4th.png', tier: '至尊星耀III', value: 145, unit: '次', prefix: '', likes: 23 },
      ],
      'MVP榜': [
        { rank: 1, name: '👑 一颗小星星', avatar: 'my-tab-assets/rank-avatar-1st.png', tier: '无双王者38星', value: 56, unit: '次', prefix: '', likes: 178 },
        { rank: 2, name: '峡谷小公主', avatar: 'my-tab-assets/rank-avatar-3rd.png', tier: '至尊星耀I', value: 42, unit: '次', prefix: '', likes: 95 },
        { rank: 3, name: '无敌暴龙战士', avatar: 'my-tab-assets/rank-avatar-2nd.png', tier: '最强王者12星', value: 38, unit: '次', prefix: '', likes: 76 },
        { rank: 4, name: '野区霸主', avatar: 'my-tab-assets/rank-avatar-4th.png', tier: '至尊星耀III', value: 15, unit: '次', prefix: '', likes: 8 },
      ],
      '段位榜': [
        { rank: 1, name: '👑 一颗小星星', avatar: 'my-tab-assets/rank-avatar-1st.png', tier: '无双王者38星', value: '无双王者38星', unit: '', prefix: '', likes: 220 },
        { rank: 2, name: '无敌暴龙战士', avatar: 'my-tab-assets/rank-avatar-2nd.png', tier: '最强王者12星', value: '最强王者12星', unit: '', prefix: '', likes: 134 },
        { rank: 3, name: '峡谷小公主', avatar: 'my-tab-assets/rank-avatar-3rd.png', tier: '至尊星耀I', value: '至尊星耀I', unit: '', prefix: '', likes: 88 },
        { rank: 4, name: '野区霸主', avatar: 'my-tab-assets/rank-avatar-4th.png', tier: '至尊星耀III', value: '至尊星耀III', unit: '', prefix: '', likes: 19 },
      ],
    },
    encouragement: '还差3星超过峡谷小公主，再来一把！',
  },
  hpjy: {
    tabs: ['吃鸡榜', '击杀榜', 'KD榜', '段位榜'],
    defaultTab: '吃鸡榜',
    me: {
      name: 'Q仔（我）',
      avatar: 'my-tab-assets/rank-avatar-me.png',
      rank: 4,
      tier: '坚韧铂金III',
      stats: { '吃鸡榜': { value: 8, unit: '次', prefix: '' }, '击杀榜': { value: 96, unit: '次', prefix: '' }, 'KD榜': { value: 2.3, unit: '', prefix: '' }, '段位榜': { value: '坚韧铂金III', unit: '', prefix: '' } },
      likes: 15,
    },
    friends: {
      '吃鸡榜': [
        { rank: 1, name: '👑 荒野猎人', avatar: 'my-tab-assets/rank-avatar-5th.png', tier: '超级王牌', value: 26, unit: '次', prefix: '', likes: 98 },
        { rank: 2, name: '伏地魔本魔', avatar: 'my-tab-assets/rank-avatar-6th.png', tier: '荣耀皇冠I', value: 18, unit: '次', prefix: '', likes: 56 },
        { rank: 3, name: '钢枪王子', avatar: 'my-tab-assets/rank-avatar-7th.png', tier: '坚韧铂金I', value: 12, unit: '次', prefix: '', likes: 34 },
      ],
      '击杀榜': [
        { rank: 1, name: '👑 荒野猎人', avatar: 'my-tab-assets/rank-avatar-5th.png', tier: '超级王牌', value: 312, unit: '次', prefix: '', likes: 120 },
        { rank: 2, name: '钢枪王子', avatar: 'my-tab-assets/rank-avatar-7th.png', tier: '坚韧铂金I', value: 245, unit: '次', prefix: '', likes: 78 },
        { rank: 3, name: '伏地魔本魔', avatar: 'my-tab-assets/rank-avatar-6th.png', tier: '荣耀皇冠I', value: 189, unit: '次', prefix: '', likes: 45 },
      ],
      'KD榜': [
        { rank: 1, name: '👑 荒野猎人', avatar: 'my-tab-assets/rank-avatar-5th.png', tier: '超级王牌', value: 4.8, unit: '', prefix: '', likes: 145 },
        { rank: 2, name: '钢枪王子', avatar: 'my-tab-assets/rank-avatar-7th.png', tier: '坚韧铂金I', value: 3.2, unit: '', prefix: '', likes: 67 },
        { rank: 3, name: '伏地魔本魔', avatar: 'my-tab-assets/rank-avatar-6th.png', tier: '荣耀皇冠I', value: 2.9, unit: '', prefix: '', likes: 43 },
      ],
      '段位榜': [
        { rank: 1, name: '👑 荒野猎人', avatar: 'my-tab-assets/rank-avatar-5th.png', tier: '超级王牌', value: '超级王牌', unit: '', prefix: '', likes: 156 },
        { rank: 2, name: '伏地魔本魔', avatar: 'my-tab-assets/rank-avatar-6th.png', tier: '荣耀皇冠I', value: '荣耀皇冠I', unit: '', prefix: '', likes: 89 },
        { rank: 3, name: '钢枪王子', avatar: 'my-tab-assets/rank-avatar-7th.png', tier: '坚韧铂金I', value: '坚韧铂金I', unit: '', prefix: '', likes: 56 },
      ],
    },
    encouragement: '离荒野猎人只差2次吃鸡，冲一把！',
  },
  sjz: {
    tabs: ['撤离榜', '击杀榜', '资产榜', '段位榜'],
    defaultTab: '撤离榜',
    me: {
      name: 'Q仔（我）',
      avatar: 'my-tab-assets/rank-avatar-me.png',
      rank: 4,
      tier: '黄金Ⅱ',
      stats: { '撤离榜': { value: 15, unit: '次', prefix: '' }, '击杀榜': { value: 68, unit: '次', prefix: '' }, '资产榜': { value: '28万', unit: '', prefix: '' }, '段位榜': { value: '黄金Ⅱ', unit: '', prefix: '' } },
      likes: 11,
    },
    friends: {
      '撤离榜': [
        { rank: 1, name: '👑 暗区独狼', avatar: 'my-tab-assets/rank-avatar-8th.png', tier: '黑鹰Ⅱ', value: 42, unit: '次', prefix: '', likes: 88 },
        { rank: 2, name: '战术大师', avatar: 'my-tab-assets/rank-avatar-9th.png', tier: '钻石Ⅲ', value: 28, unit: '次', prefix: '', likes: 45 },
        { rank: 3, name: '菜鸡互啄', avatar: 'my-tab-assets/rank-avatar-4th.png', tier: '铂金Ⅰ', value: 18, unit: '次', prefix: '', likes: 23 },
      ],
      '击杀榜': [
        { rank: 1, name: '👑 暗区独狼', avatar: 'my-tab-assets/rank-avatar-8th.png', tier: '黑鹰Ⅱ', value: 156, unit: '次', prefix: '', likes: 102 },
        { rank: 2, name: '战术大师', avatar: 'my-tab-assets/rank-avatar-9th.png', tier: '钻石Ⅲ', value: 112, unit: '次', prefix: '', likes: 67 },
        { rank: 3, name: '菜鸡互啄', avatar: 'my-tab-assets/rank-avatar-4th.png', tier: '铂金Ⅰ', value: 78, unit: '次', prefix: '', likes: 34 },
      ],
      '资产榜': [
        { rank: 1, name: '👑 暗区独狼', avatar: 'my-tab-assets/rank-avatar-8th.png', tier: '黑鹰Ⅱ', value: '86万', unit: '', prefix: '', likes: 134 },
        { rank: 2, name: '战术大师', avatar: 'my-tab-assets/rank-avatar-9th.png', tier: '钻石Ⅲ', value: '52万', unit: '', prefix: '', likes: 78 },
        { rank: 3, name: '菜鸡互啄', avatar: 'my-tab-assets/rank-avatar-4th.png', tier: '铂金Ⅰ', value: '31万', unit: '', prefix: '', likes: 45 },
      ],
      '段位榜': [
        { rank: 1, name: '👑 暗区独狼', avatar: 'my-tab-assets/rank-avatar-8th.png', tier: '黑鹰Ⅱ', value: '黑鹰Ⅱ', unit: '', prefix: '', likes: 110 },
        { rank: 2, name: '战术大师', avatar: 'my-tab-assets/rank-avatar-9th.png', tier: '钻石Ⅲ', value: '钻石Ⅲ', unit: '', prefix: '', likes: 65 },
        { rank: 3, name: '菜鸡互啄', avatar: 'my-tab-assets/rank-avatar-4th.png', tier: '铂金Ⅰ', value: '铂金Ⅰ', unit: '', prefix: '', likes: 28 },
      ],
    },
    encouragement: '你的撤离率不错，继续保持！',
  },
};
