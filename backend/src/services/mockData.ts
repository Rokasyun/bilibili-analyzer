// 模拟数据，用于演示和测试
export const mockUserData = {
  '1': {
    user: {
      uid: 1,
      name: 'bishi',
      face: 'https://i0.hdslb.com/bfs/face/480e2e98513aaeb65d2f2c76dbae750c4de722e9.jpg',
      sign: 'B站创始人',
      level: 6,
      follower: 2000000,
      following: 100
    },
    categories: [
      { name: '科技', count: 50, percentage: 40 },
      { name: '生活', count: 30, percentage: 24 },
      { name: '知识', count: 25, percentage: 20 },
      { name: '游戏', count: 20, percentage: 16 }
    ],
    catchphrases: [{ name: '科技改变生活', value: 10 }],
    syncRate: '95.0',
    tags: ['科技', '生活', '知识'],
    followingAnalysis: [
      { name: '个人认证', count: 45, percentage: 45 },
      { name: '机构认证', count: 30, percentage: 30 },
      { name: '普通用户', count: 25, percentage: 25 }
    ],
    videoAnalysis: [
      { name: '科技', count: 30, percentage: 50 },
      { name: '生活', count: 20, percentage: 33.3 },
      { name: '知识', count: 10, percentage: 16.7 }
    ]
  },
  '2': {
    user: {
      uid: 2,
      name: '碧诗',
      face: 'https://i1.hdslb.com/bfs/face/ef0457addb24141e15dfac6fbf45293ccf1e32ab.jpg',
      sign: 'B站早期用户',
      level: 6,
      follower: 1500000,
      following: 200
    },
    categories: [
      { name: '动画', count: 60, percentage: 50 },
      { name: '游戏', count: 30, percentage: 25 },
      { name: '音乐', count: 30, percentage: 25 }
    ],
    catchphrases: [{ name: '干杯', value: 20 }],
    syncRate: '99.0',
    tags: ['动画', '游戏', '音乐'],
    followingAnalysis: [
      { name: '普通用户', count: 120, percentage: 60 },
      { name: '个人认证', count: 50, percentage: 25 },
      { name: '机构认证', count: 30, percentage: 15 }
    ],
    videoAnalysis: [
      { name: '动画', count: 40, percentage: 44.4 },
      { name: '游戏', count: 30, percentage: 33.3 },
      { name: '音乐', count: 20, percentage: 22.2 }
    ]
  },
  'demo': {
    user: {
      uid: 999999,
      name: '演示账号',
      face: 'https://i0.hdslb.com/bfs/face/member/noface.jpg',
      sign: '这是一个演示账号，展示系统功能',
      level: 5,
      follower: 10000,
      following: 300,
      mentalState: { status: '情绪稳定', desc: '演示账号，精神状态满分！', insomniaLevel: 5 },
      contrastAnalysis: { title: '表里如一', desc: '由于是演示账号，一切都很完美。', score: 10 },
      commentTone: { style: '热心市民', examples: ['演示评论1', '演示评论2'] },
      activityHeatmap: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: Math.floor(Math.random() * 10) })),
      ddIndex: { score: 45, level: '偶尔DD', vupCount: 12, mainVup: '演示UP' }
    },
    categories: [
      { name: '游戏', count: 80, percentage: 40 },
      { name: '动画', count: 60, percentage: 30 },
      { name: '科技', count: 40, percentage: 20 },
      { name: '生活', count: 20, percentage: 10 }
    ],
    tags: ['游戏', '动画', '科技', '二次元'],
    followingAnalysis: [
      { name: '个人认证', count: 150, percentage: 50 },
      { name: '普通用户', count: 100, percentage: 33.3 },
      { name: '机构认证', count: 50, percentage: 16.7 }
    ],
    videoAnalysis: [
      { name: '游戏', count: 45, percentage: 45 },
      { name: '动画', count: 30, percentage: 30 },
      { name: '科技', count: 15, percentage: 15 },
      { name: '生活', count: 10, percentage: 10 }
    ],
    catchphrases: [
      { name: '太强了', value: 12 },
      { name: '哈哈哈', value: 8 },
      { name: '收藏了', value: 5 }
    ],
    syncRate: '98.5',
    energyLevel: '82',
    energyStatus: 'HIGH',
    recentBulletChats: [
      { content: '这个视频也太赞了吧！', type: 'dynamic', tag: '资深B友', timestamp: Math.floor(Date.now() / 1000) },
      { content: '嘉然今天吃什么？', type: 'dynamic', tag: '嘉心糖' },
      { content: '好活，当赏！', type: 'predicted', tag: '语气预测' },
      { content: '爷青回', type: 'predicted', tag: '语气预测' }
    ],
    playedGames: ['原神', '英雄联盟', '绝区零', '黑神话'],
    milestones: [
      { label: '初入次元', date: '2015年', icon: '🐣' },
      { label: '初露锋芒 Lv4', date: '2016年', icon: '🌟' },
      { label: '坚实中坚 Lv5', date: '2018年', icon: '🎖️' },
      { label: '创作达人', date: '持续产出中', icon: '🎨' }
    ],
    subCultureAlignment: [
      { name: '二次元浓度', value: 85, color: 'from-pink-400 to-rose-500' },
      { name: '硬核游戏力', value: 92, color: 'from-emerald-400 to-teal-500' },
      { name: '科技极客感', value: 40, color: 'from-blue-400 to-indigo-500' },
      { name: '现充生活感', value: 60, color: 'from-orange-400 to-amber-500' }
    ]
  }
}

export function getMockData(uid: string) {
  return mockUserData[uid as keyof typeof mockUserData] || null
}
