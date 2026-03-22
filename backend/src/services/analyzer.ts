import { BiliFollowing, BiliVideo } from '../services/bilibili.js'

export interface CategoryData {
  name: string
  count: number
  percentage: number
}

/**
 * 分析关注列表，提取UP主类型
 */
export function analyzeFollowings(followings: BiliFollowing[]): CategoryData[] {
  const categoryMap = new Map<string, number>()

  followings.forEach(following => {
    // 根据认证类型分类
    if (following.official_verify) {
      const type = following.official_verify.type
      if (type === 0) {
        categoryMap.set('个人认证', (categoryMap.get('个人认证') || 0) + 1)
      } else if (type === 1) {
        categoryMap.set('机构认证', (categoryMap.get('机构认证') || 0) + 1)
      }
    } else {
      categoryMap.set('普通用户', (categoryMap.get('普通用户') || 0) + 1)
    }
  })

  const total = followings.length
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
    percentage: (count / total) * 100
  }))
}

/**
 * 分析投稿视频，按分区统计
 */
export function analyzeVideos(videos: BiliVideo[]): CategoryData[] {
  const categoryMap = new Map<string, number>()

  videos.forEach(video => {
    const category = video.tname || '其他'
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
  })

  const total = videos.length
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count) // 按数量降序
}

/**
 * 综合分析用户成分
 */
export function analyzeUserComposition(
  followings: BiliFollowing[],
  videos: BiliVideo[],
  userInfo: any
): { 
  categories: CategoryData[], 
  tags: string[], 
  power: any,
  valuation: number,
  honorTags: { label: string, color: string }[],
  memeStatus: string,
  persona: {
    name: string,
    desc: string,
    icon: string,
    color: string,
    matchRate: number
  },
  evaluation: {
    title: string,
    content: string,
    type: 'explorer' | 'creator' | 'collector' | 'observer',
    stats: { label: string, value: string | number }[]
  },
  catchphrases: { name: string, value: number }[],
  syncRate: string,
  energyLevel: string,
  energyStatus: string,
  sentiment: string,
  registrationDate: string,
  b站工龄: number,
  medals: any[],
  mentalState: {
    status: string,
    desc: string,
    insomniaLevel: number
  },
  contrastAnalysis: {
    title: string,
    desc: string,
    score: number
  },
  commentTone: {
    style: string,
    examples: string[]
  },
  activityHeatmap: {
    hour: number,
    count: number
  }[],
  ddIndex: {
    score: number,
    level: string,
    vupCount: number,
    mainVup?: string
  },
  recentBulletChats: {
    content: string,
    type: 'dynamic' | 'predicted',
    timestamp?: number,
    tag?: string
  }[],
  playedGames: string[],
  milestones: { label: string, date: string, icon: string }[],
  subCultureAlignment: { name: string, value: number, color: string }[]
} {
  const videoCategories = analyzeVideos(videos)
  const followingCategories = analyzeFollowings(followings)

  // 1. 计算账号身价
  const baseVal = (userInfo.follower * 0.5) + (userInfo.level * 1000)
  const videoBonus = videos.reduce((sum, v) => sum + (v.play || 0), 0) * 0.01
  const valuation = Math.round(baseVal + videoBonus)

  // 2. 计算六维战力
  const power = [
    { name: '影响力', value: Math.min(100, Math.log10(userInfo.follower + 1) * 15) },
    { name: '活跃度', value: Math.min(100, videos.length * 3.3) },
    { name: '专注度', value: videoCategories.length > 0 ? (videoCategories[0].percentage) : 50 },
    { name: '持久力', value: userInfo.level * 16.6 },
    { name: '社交力', value: Math.min(100, (userInfo.following / 500) * 100) },
    { name: '吸粉力', value: userInfo.follower > 0 ? Math.min(100, (userInfo.follower / 10000) * 100) : 0 }
  ]

  // 基础数据定义（提前声明以供标签和勋章逻辑使用）
  const uidStr = userInfo.mid.toString()
  const uidLen = uidStr.length
  const uidNum = parseInt(userInfo.mid)

  // 生成常规标签
  const tags = videoCategories.slice(0, 2).map(cat => cat.name)
  if (valuation > 100000) tags.push('大金主')
  if (videos.length > 20) tags.push('爆肝狂魔')
  if (uidNum < 1000000) tags.push('老资历')

  // 3. 推算荣誉标签 (UID位数 + 等级)
  const honorTags: { label: string, color: string }[] = []
  
  // UID 位数勋章
  if (uidLen <= 3) honorTags.push({ label: `${uidLen}位原人`, color: 'from-amber-700 to-amber-900' })
  else if (uidLen === 4) honorTags.push({ label: '4位骨灰元老', color: 'from-purple-700 to-purple-950' })
  else if (uidLen === 5) honorTags.push({ label: '5位先行者', color: 'from-indigo-700 to-indigo-950' })
  else if (uidLen === 6) honorTags.push({ label: '6位老兵', color: 'from-emerald-700 to-emerald-950' })
  else if (uidLen === 7) honorTags.push({ label: '7位资深漫民', color: 'from-sky-700 to-sky-950' })
  else if (uidLen === 8) honorTags.push({ label: '8位站柱', color: 'from-slate-700 to-slate-950' })
  else honorTags.push({ label: `${uidLen}位新锐`, color: 'from-gray-600 to-gray-800' })

  // 等级勋章
  if (userInfo.level === 6) honorTags.push({ label: '登峰造极 Lv6', color: 'from-rose-700 to-rose-950' })
  else if (userInfo.level === 5) honorTags.push({ label: '坚实支柱 Lv5', color: 'from-orange-700 to-orange-950' })
  else if (userInfo.level === 4) honorTags.push({ label: '活跃分子 Lv4', color: 'from-green-700 to-green-950' })

  // --- 新增十个维度勋章 ---
  
  // 1. 播放量维度
  const views = userInfo.totalViews || 0
  if (views >= 100000000) honorTags.push({ label: '亿级名流', color: 'from-amber-600 to-amber-900' })
  else if (views >= 10000000) honorTags.push({ label: '千万巨擘', color: 'from-purple-700 to-purple-900' })
  else if (views >= 1000000) honorTags.push({ label: '百万播放', color: 'from-blue-600 to-blue-800' })

  // 2. 粉丝维度
  const fans = userInfo.follower || 0
  if (fans >= 1000000) honorTags.push({ label: '百万粉大V', color: 'from-red-600 to-red-900' })
  else if (fans >= 10000) honorTags.push({ label: '万众瞩目', color: 'from-pink-600 to-pink-800' })

  // 3. 投稿维度
  if (videos.length >= 100) honorTags.push({ label: '爆肝狂魔', color: 'from-orange-600 to-orange-900' })
  else if (videos.length >= 30) honorTags.push({ label: '高产UP主', color: 'from-yellow-600 to-yellow-800' })

  // 4. 社交维度
  if (userInfo.following > 1000) honorTags.push({ label: '社交天花板', color: 'from-green-600 to-green-900' })
  else if (userInfo.following < 5 && fans > 1000) honorTags.push({ label: '孤傲高冷', color: 'from-slate-700 to-slate-950' })

  // 5. 身份维度
  if (userInfo.official && userInfo.official.role !== -1) honorTags.push({ label: '官方认证', color: 'from-yellow-500 to-amber-700' })
  if (userInfo.vip && userInfo.vip.status === 1) honorTags.push({ label: '尊贵大会员', color: 'from-pink-500 to-rose-700' })

  // 6. 获赞维度
  const likes = userInfo.totalLikes || 0
  if (likes >= 1000000) honorTags.push({ label: '获赞无数', color: 'from-cyan-600 to-blue-700' })

  // 7. 直播维度
  if (userInfo.liveRoom && userInfo.liveRoom.status === 1) honorTags.push({ label: '劳模主播', color: 'from-red-500 to-red-800' })

  // 8. 创作专注度
  if (videoCategories.length > 0 && videoCategories[0].percentage > 70) {
    honorTags.push({ label: `纯正${videoCategories[0].name}魂`, color: 'from-indigo-600 to-purple-800' })
  }

  // 9. 账号价值维度
  if (valuation > 1000000) honorTags.push({ label: '行走的GDP', color: 'from-emerald-600 to-emerald-900' })

  // 10. 历史地位
  if (uidNum < 50000) honorTags.push({ label: '创始元老', color: 'from-gray-800 to-black' })
  
  // --- 新增更多维度勋章（差异化升级） ---
    
  // 1. 内容深度定制
  videoCategories.forEach(cat => {
    if (cat.percentage > 50) honorTags.push({ label: `${cat.name}领主`, color: 'from-blue-600 to-indigo-900' })
    else if (cat.count > 10) honorTags.push({ label: `${cat.name}达人`, color: 'from-cyan-500 to-blue-800' })
  })
  
  // 2. 粉丝质量与活跃度
  if (fans > 100000 && userInfo.level >= 6) honorTags.push({ label: '德高望重', color: 'from-amber-600 to-red-900' })
  if (userInfo.following > fans * 2 && userInfo.following > 100) honorTags.push({ label: '博爱主义', color: 'from-pink-500 to-purple-800' })
    
  // 3. 投稿特征
  const totalPlay = videos.reduce((sum, v) => sum + (v.play || 0), 0)
  if (videos.length > 0 && totalPlay / videos.length > 100000) honorTags.push({ label: '篇篇爆款', color: 'from-orange-600 to-red-900' })
  if (videos.some(v => v.title.includes('测评') || v.title.includes('深度'))) honorTags.push({ label: '硬核评测', color: 'from-slate-700 to-gray-950' })
  
  // 4. 社交/二次元浓度
  if (followingCategories.some(c => c.name === '虚拟UP主' && c.percentage > 30)) honorTags.push({ label: '单推人', color: 'from-blue-400 to-indigo-700' })
  if (tags.includes('老资历') && fans < 100) honorTags.push({ label: '隐世高手', color: 'from-zinc-800 to-black' })
  
  // 5. 趣味/梗勋章 (随机授予增加差异化)
  const memePool = [
    { label: '下次一定', cond: () => videos.length > 5 && views < 1000 },
    { label: '素质三连', cond: () => userInfo.level >= 5 },
    { label: '此处有本', cond: () => videoCategories.some(c => c.name === '动画') },
    { label: '战力崩坏', cond: () => valuation > 500000 },
    { label: '鸽王之王', cond: () => videos.length > 0 && videos.length < 3 },
    { label: '弹幕发射器', cond: () => userInfo.following > 500 },
    { label: '野生技术协', cond: () => videoCategories.some(c => c.name === '科技' || c.name === '数码') },
    { label: '深夜食堂', cond: () => videoCategories.some(c => c.name === '美食') }
  ]
    
  memePool.forEach(m => {
    if (m.cond() && Math.random() > 0.3) honorTags.push({ label: m.label, color: 'from-indigo-500 to-purple-900' })
  })
  
  // --- 强制补满十个勋章（动态池） ---
  const fillers = [
    { label: '观测者', color: 'from-slate-700 to-slate-900' },
    { label: '次元居民', color: 'from-blue-800 to-indigo-950' },
    { label: '干杯小将', color: 'from-pink-800 to-rose-950' },
    { label: '三连大师', color: 'from-orange-800 to-red-950' },
    { label: '弹幕之魂', color: 'from-cyan-800 to-blue-950' },
    { label: '投币达人', color: 'from-yellow-700 to-amber-900' },
    { label: '收藏狂魔', color: 'from-purple-800 to-indigo-950' },
    { label: '一键三连', color: 'from-rose-800 to-pink-950' },
    { label: '硬币玩家', color: 'from-zinc-700 to-zinc-900' },
    { label: '潜水精英', color: 'from-emerald-800 to-teal-950' },
    { label: '宝藏猎人', color: 'from-sky-800 to-blue-950' },
    { label: '数据极客', color: 'from-violet-800 to-purple-950' },
    { label: '二次元之友', color: 'from-pink-600 to-pink-900' },
    { label: '首席观测员', color: 'from-slate-600 to-slate-900' },
    { label: '成分探索家', color: 'from-blue-600 to-blue-900' }
  ]
  
  // 随机打乱 filler 增加每个人进去看到的保底勋章都不一样
  const shuffledFillers = fillers.sort(() => Math.random() - 0.5)
  
  let fillerIdx = 0
  while (honorTags.length < 10 && fillerIdx < shuffledFillers.length) {
    const filler = shuffledFillers[fillerIdx]
    if (!honorTags.some(t => t.label === filler.label)) {
      honorTags.push(filler)
    }
    fillerIdx++
  }
  
  // 梗文案逻辑
  let memeStatus = ''
  if (uidNum < 10000) memeStatus = '老资历，我敬你！敬礼！∠(°ゝ°)'
  else if (uidNum < 1000000) memeStatus = '这资历，放在全站也是相当炸裂的存在'
  else if (userInfo.level === 6) memeStatus = '满级大佬，恐怖如斯！'

  // 合并分类
  const allCategories = new Map<string, number>()
  videoCategories.forEach(cat => {
    allCategories.set(cat.name, (allCategories.get(cat.name) || 0) + cat.count)
  })

  const total = Array.from(allCategories.values()).reduce((sum, count) => sum + count, 0) || 1
  const categories = Array.from(allCategories.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // --- 个人综合评价逻辑 (深度差异化) ---
  let evalTitle = '次元观测者'
  let evalContent = '你似乎更倾向于在寂静中观察这个世界的脉动。'
  let evalType: 'explorer' | 'creator' | 'collector' | 'observer' = 'observer'
    
  const fCount = userInfo.follower || 0
  const flCount = userInfo.following || 0
  const vCount = videos.length
  const dCount = (userInfo.dynamics || []).length
  const tLikes = userInfo.totalLikes || 0
  const lv = userInfo.level || 0
  
  if (vCount > 30 || (vCount > 5 && tLikes > 10000)) {
    evalTitle = '高能创作者'
    evalContent = '你的灵魂中跳动着创作的火焰，每一次投稿都在次元世界中激起剧烈的能量涟漪。'
    evalType = 'creator'
  } else if (flCount > 300 || (flCount > 100 && vCount === 0)) {
    evalTitle = '次元探险家'
    evalContent = '你的足迹遍布各大分区，对新奇事物有着永无止境的好奇心，是这片领域最活跃的探索者。'
    evalType = 'explorer'
  } else if (lv >= 6 || (uidNum < 1000000 && lv >= 5)) {
    evalTitle = '顶级收藏家'
    evalContent = '作为站内的顶尖大佬，你见证了无数时代的更迭，无数珍贵的文化记忆被你收入囊中。'
    evalType = 'collector'
  } else if (fCount > 1000) {
    evalTitle = '灵魂领袖'
    evalContent = '你的存在本身就是一种磁场，吸引着无数迷途的灵魂向你聚拢。'
    evalType = 'creator'
  } else if (dCount > 15) {
    evalTitle = '时空记录者'
    evalContent = '你热衷于记录每一个瞬间，文字是你与这个次元世界沟通的独特频率。'
    evalType = 'observer'
  }
  
  const contentPools = {
    creator: [
      '你的作品是连接现实与幻想的桥梁。',
      '在这个数字宇宙中，你正在一砖一瓦地构建自己的神殿。',
      '创意是你最锋利的武器，内容是你最坚实的盾牌。'
    ],
    explorer: [
      '星辰大海才是你的终点，每一个分区都是你落脚的驿站。',
      '没有什么能阻挡你对未知的渴望，你的好奇心比宇宙还要广阔。',
      '你在不同次元间穿梭自如，收集着被他人遗忘的文明碎片。'
    ],
    collector: [
      '岁月在你面前不过是跳动的字符，你拥有看穿时光的眼睛。',
      '你的收藏夹里躺着的不仅是视频，更是几代人的青春。',
      '你是文化的看门人，在喧嚣的时代中守护着那份纯粹。'
    ],
    observer: [
      '众人皆醉你独醒，你在这片喧嚣中保持着最清澈的观察。',
      '静默中孕育着巨大的能量，你观察到的每一个细节都是宇宙的真相。',
      '你是次元世界的守望者，静静等待着下一次文明的爆发。'
    ]
  }
  
  const pool = contentPools[evalType]
  const randomContent = pool[uidNum % pool.length]
  evalContent = `${evalContent} ${randomContent}`
  
  const evalStats = [
    { label: '互动指数', value: `${Math.min(100, (fCount / 100) + (flCount / 10) + (tLikes / 1000)).toFixed(1)}%` },
    { label: '创作频率', value: vCount > 0 ? `${(30 / Math.max(1, (new Date().getTime() - new Date(videos[vCount-1].created * 1000).getTime()) / (1000 * 60 * 60 * 24 * 30))).toFixed(1)}次/月` : (dCount > 5 ? '高频更新' : '静默中') },
    { label: '社交倾向', value: flCount > fCount ? (flCount > 500 ? '社交狂魔' : '活跃社交') : (fCount > 100 ? '高冷领袖' : '独行侠') }
  ]
  
  const evaluation = {
    title: evalTitle,
    content: evalContent,
    type: evalType,
    stats: evalStats
  }
  
  // --- 次元数据指标 (同步率、能量波动) ---
  const syncRate = Math.min(99.9, 75 + (lv * 3) + (uidNum < 1000000 ? 5 : 0) + (vCount > 0 ? 3 : 0) + (uidNum % 10)).toFixed(1)
  const energyLevel = Math.min(100, (vCount * 2) + (dCount * 3) + (lv * 5) + (uidNum % 20)).toFixed(0)
  const energyStatus = parseInt(energyLevel) > 85 ? 'CRITICAL' : parseInt(energyLevel) > 60 ? 'HIGH' : 'STABLE'
  
  // --- 次元人格逻辑 ---
  let persona = {
    name: '次元平民',
    desc: '在 B 站广袤的世界中过着平凡而充实的生活。',
    icon: '👤',
    color: 'from-blue-400 to-blue-600',
    matchRate: 85
  }

  if (uidNum < 100000) {
    persona = {
      name: '创始之柱',
      desc: '你是这片星系的元初居民，见证了万物的诞生与演化。',
      icon: '🏛️',
      color: 'from-amber-600 to-amber-900',
      matchRate: 99
    }
  } else if (uidNum === 546195) {
    persona = {
      name: '番茄领主',
      desc: '恭喜你捕捉到了这颗史上最红的番茄！他是这里的传奇。',
      icon: '🍅',
      color: 'from-red-600 to-red-950',
      matchRate: 100
    }
  } else if (videos.length > 50) {
    persona = {
      name: '次元架构师',
      desc: '你不仅在观测，更是在用作品构建属于自己的次元宇宙。',
      icon: '🛠️',
      color: 'from-purple-500 to-pink-600',
      matchRate: 94
    }
  } else if (userInfo.following > 500 && userInfo.follower < 100) {
    persona = {
      name: '深海观测者',
      desc: '你潜行于无数分区的深处，静静捕捉着每一丝文化脉动。',
      icon: '🌊',
      color: 'from-teal-500 to-blue-700',
      matchRate: 88
    }
  } else if (videoCategories.length > 4) {
    persona = {
      name: '银河漫游者',
      desc: '你的灵魂无法被单一分区定义，跨越次元的边界是你的本能。',
      icon: '🚀',
      color: 'from-indigo-500 to-purple-800',
      matchRate: 92
    }
  } else if (userInfo.level >= 6) {
    persona = {
      name: '圣域守护者',
      desc: '拥有巅峰级的次元权限，你是这片净土秩序的守护之光。',
      icon: '🛡️',
      color: 'from-rose-500 to-red-800',
      matchRate: 97
    }
  }

  // --- 高频关键词分析与数据准备 ---
  const dynamicTexts = userInfo.dynamics || []
  const wordFreq = new Map<string, number>()
  const stopWords = new Set(['的', '了', '在', '是', '我', '你', '他', '她', '它', '们', '这', '那', '就', '都', '而', '及', '并', '与', '或', '也', '还', '等', '又', '到', '说', '去', '想', '看', '好', '很'])
  
  dynamicTexts.forEach((text: string) => {
    const words = text.match(/[\u4e00-\u9fa5]{2,}/g) || []
    words.forEach(word => {
      if (!stopWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
      }
    })
  })
  
  const catchphrases = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, value: count }))

  // --- 情感波动分析 ---
  let positiveScore = 0
  let negativeScore = 0
  const posWords = ['哈', '赞', '好', '牛', '强', '美', '趣', '支', '乐', '爱', '棒']
  const negWords = ['差', '恶', '烦', '难', '失', '坑', '喷', '垃圾', '死', '滚', '黑']
  
  dynamicTexts.forEach((text: string) => {
    posWords.forEach(w => { if (text.includes(w)) positiveScore++ })
    negWords.forEach(w => { if (text.includes(w)) negativeScore++ })
  })
  
  const sentiment = positiveScore >= negativeScore ? 
    (positiveScore === 0 ? '平静' : '乐观') : '略显忧郁'
  
  // --- 入站时长推算 ---
  let joinYear = 2021
  if (uidNum < 10000) joinYear = 2009
  else if (uidNum < 100000) joinYear = 2011
  else if (uidNum < 1000000) joinYear = 2012
  else if (uidNum < 10000000) joinYear = 2013
  else if (uidNum < 30000000) joinYear = 2014
  else if (uidNum < 60000000) joinYear = 2015
  else if (uidNum < 150000000) joinYear = 2016
  else if (uidNum < 300000000) joinYear = 2017
  else if (uidNum < 450000000) joinYear = 2018
  else if (uidNum < 600000000) joinYear = 2019
  else joinYear = 2020
  
  const b站工龄 = new Date().getFullYear() - joinYear
  const registrationDate = `约 ${joinYear} 年入站`

  // --- 勋章墙处理 ---
  const medals = userInfo.medals || []

  // --- 新增：精神状态分析 (借鉴 aicu.cc) ---
  const timestamps = userInfo.dynamicTimestamps || []
  let nightCount = 0
  timestamps.forEach((ts: number) => {
    const hour = new Date(ts * 1000).getHours()
    if (hour >= 1 && hour <= 5) nightCount++
  })
  
  const insomniaLevel = timestamps.length > 0 ? Math.round((nightCount / timestamps.length) * 100) : 0
  let mentalStatus = '情绪稳定'
  let mentalDesc = '你的精神状态非常健康，像早晨八九点钟的太阳。'
  
  if (insomniaLevel > 40) {
    mentalStatus = '修仙党'
    mentalDesc = '凌晨时分是你最活跃的时刻，黑夜给了你黑色的眼睛。'
  } else if (insomniaLevel > 15) {
    mentalStatus = '轻微焦虑'
    mentalDesc = '深夜的动态记录了你偶尔的辗转反侧。'
  }
  
  if (negativeScore > positiveScore * 1.5) {
    mentalStatus = '网抑云选手'
    mentalDesc = '字里行间流露出的淡淡忧郁，是次元世界的阴雨天。'
  }

  // --- 新增：动态/审美反差分析 ---
  let contrastTitle = '表里如一'
  let contrastDesc = '你的兴趣爱好与你的表达高度一致。'
  let contrastScore = 15

  const hasMemeStreamer = medals.some((m: any) => m.up_name.includes('老番茄') || m.up_name.includes('某幻') || m.up_name.includes('花少北'))
  const isQuietDynamics = dynamicTexts.length < 5 || (positiveScore < 2 && negativeScore < 2)
  
  if (hasMemeStreamer && isQuietDynamics) {
    contrastTitle = '闷骚型选手'
    contrastDesc = '动态里安静如水，其实私下里是个搞笑男/女。'
    contrastScore = 85
  } else if (videoCategories.some(c => c.name === '游戏') && userInfo.sign.includes('文艺')) {
    contrastTitle = '硬核文青'
    contrastDesc = '外表斯文儒雅，实则在游戏世界里大杀四方。'
    contrastScore = 70
  }

  // --- 弹幕语气预测 (增加随机性与丰富度) ---
  const tonePools = [
    {
      style: '阳光开朗小天使',
      examples: ['好活，当赏！', '哈哈哈笑死我了', 'AWSL！', '这就是B站吗，爱了爱了', '三连了三连了'],
      cond: () => sentiment === '乐观' || positiveScore > 5
    },
    {
      style: '高冷技术流/围观党',
      examples: ['有点意思', '1', '打卡', '学到了', '硬核，投币了'],
      cond: () => sentiment === '平静' && vCount > 10
    },
    {
      style: '深夜哲学家',
      examples: ['这就是人生吗', '懂了，又不完全懂', '下次一定', '夜深了，看这个容易破防', '这世界终究是...'],
      cond: () => insomniaLevel > 20
    },
    {
      style: '气氛组核心',
      examples: ['前方高能！', '前方核能！', '兄弟们把公屏打在保护上', '名场面打卡', '这个地方我能看十遍'],
      cond: () => energyLevel > '70'
    },
    {
      style: '资深老二次元',
      examples: ['这是什么番？', '爷青回', '诸君，我喜欢...', '此生无悔入...', '这波啊，这波是肉蛋葱鸡'],
      cond: () => videoCategories.some(c => c.name === '动画') || followingCategories.some(c => c.name === '虚拟UP主')
    },
    {
      style: '阴阳怪气大师',
      examples: ['你最好是', '你是懂...', '这种事情我一般...', '蚌埠住了', '还得是你啊'],
      cond: () => negativeScore > 1
    },
    {
      style: '佛系潜水员',
      examples: ['默默看完', '点个赞就走', '单纯路过', '马克一下', '火钳刘明'],
      cond: () => true // 兜底
    }
  ]
  
  // 筛选符合条件的池子
  const availablePools = tonePools.filter(p => p.cond())
  // 根据 UID 确定池子索引，确保同一 UID 结果固定但不同 UID 差异大
  const poolIndex = uidNum % availablePools.length
  const selectedPool = availablePools[poolIndex]
  
  // 从选中的池子中随机抽取 3 个示例
  const shuffledExamples = [...selectedPool.examples].sort((a, b) => {
    // 使用简单的哈希确保对特定 UID 固定
    const hashA = (uidNum * a.length) % 100
    const hashB = (uidNum * b.length) % 100
    return hashA - hashB
  })
  
  const toneStyle = selectedPool.style
  const toneExamples = shuffledExamples.slice(0, 3)

  // --- 新增：近期活跃弹幕/评论列表 ---
  const recentBulletChats: { content: string, type: 'dynamic' | 'predicted', timestamp?: number, tag?: string }[] = []
  
  // 1. 真实动态转化 (取前5条)
  const realDynamics = (userInfo.dynamics || []).slice(0, 5).map((text: string, idx: number) => {
    // 尝试匹配成分标签
    let tag = ''
    if (text.includes('原神') || text.includes('米哈游')) tag = '原友'
    else if (text.includes('嘉然') || text.includes('向晚') || text.includes('贝拉') || text.includes('乃琳') || text.includes('嘉心糖')) tag = '嘉心糖'
    else if (text.includes('老番茄') || text.includes('小电视')) tag = '资深B友'
    else if (text.includes('抽奖') || text.includes('转发')) tag = '抽奖分母'
    
    return {
      content: text.length > 50 ? text.substring(0, 50) + '...' : text,
      type: 'dynamic' as const,
      timestamp: (userInfo.dynamicTimestamps || [])[idx],
      tag: tag || undefined
    }
  })
  recentBulletChats.push(...realDynamics)

  // 2. 预测弹幕 (根据语气)
  selectedPool.examples.forEach(ex => {
    recentBulletChats.push({
      content: ex,
      type: 'predicted' as const,
      tag: '语气预测'
    })
  })

  // 随机打乱混合
  const finalBulletChats = recentBulletChats.sort(() => (uidNum % 10 - 5) / 10)

  // --- 新增：DD指数计算 (提取到外部以供对齐分析使用) ---
  const vupKeywords = ['虚拟UP主', 'VUP', 'VTuber', '虚拟主播', '虚拟艺人']
  const followedVups = followings.filter(f => 
    vupKeywords.some(k => f.sign?.includes(k)) || 
    f.official_verify?.desc?.includes('虚拟')
  )
  const vupCount = followedVups.length
  const ddScore = Math.min(100, (vupCount / 20) * 100)
  let ddLevel = '纯良路人'
  if (ddScore > 90) ddLevel = '究极DD'
  else if (ddScore > 60) ddLevel = '资深单推人(们)'
  else if (ddScore > 30) ddLevel = '偶尔DD'
  else if (ddScore > 10) ddLevel = 'DD雏形'
  
  const ddIndex = {
    score: ddScore,
    level: ddLevel,
    vupCount,
    mainVup: medals.length > 0 ? [...medals].sort((a, b) => b.level - a.level)[0].up_name : undefined
  }

  // --- 新增：游玩轨迹提取 ---
  const gameSet = new Set<string>()
  const gameCategories = ['游戏', '单机游戏', '网络游戏', '电子竞技', '手机游戏', '主机游戏']
  
  videos.forEach(v => {
    if (gameCategories.includes(v.tname)) {
      const titleMatch = v.title.match(/[【\[](.+?)[】\]]/)
      if (titleMatch) gameSet.add(titleMatch[1])
    } else if (v.tname !== '其他' && v.tname !== '投稿' && !v.tname.includes('视频')) {
      gameSet.add(v.tname)
    }
    
    const hotGames = ['原神', '绝区零', '崩坏：星穹铁道', '王者荣耀', '和平精英', '英雄联盟', 'LOL', 'CS:GO', 'CS2', '无畏契约', '瓦罗兰特', '黑神话', '我的世界', 'Minecraft', '双人成行', '艾尔登法环', '法环', '幻兽帕鲁']
    hotGames.forEach(game => {
      if (v.title.toLowerCase().includes(game.toLowerCase())) {
        gameSet.add(game)
      }
    })
  })
  const playedGames = Array.from(gameSet).slice(0, 10)

  // --- 新增：里程碑推算 ---
  const ms = [{ label: '初入次元', date: `${joinYear}年`, icon: '🐣' }]
  if (lv >= 4) ms.push({ label: '初露锋芒 Lv4', date: `${joinYear + 1}年`, icon: '🌟' })
  if (lv >= 5) ms.push({ label: '坚实中坚 Lv5', date: `${joinYear + (uidNum < 1000000 ? 2 : 3)}年`, icon: '🎖️' })
  if (lv >= 6) ms.push({ label: '巅峰之境 Lv6', date: `${joinYear + (uidNum < 1000000 ? 4 : 6)}年`, icon: '👑' })
  if (vCount > 50) ms.push({ label: '创作达人', date: '持续产出中', icon: '🎨' })
  const milestones = ms

  // --- 新增：亚文化对齐分析 ---
  const alignment = []
  const acgScore = Math.min(100, 
    (videoCategories.find(c => c.name === '动画')?.percentage || 0) * 2 +
    (videoCategories.find(c => c.name === '音乐')?.percentage || 0) +
    (ddIndex.score > 50 ? 30 : 0)
  )
  alignment.push({ name: '二次元浓度', value: Math.max(20, acgScore), color: 'from-pink-400 to-rose-500' })

  const gameScore = Math.min(100, 
    (videoCategories.find(c => c.name === '游戏')?.percentage || 0) * 2.5 +
    (playedGames.length > 3 ? 20 : 0)
  )
  alignment.push({ name: '硬核游戏力', value: Math.max(15, gameScore), color: 'from-emerald-400 to-teal-500' })

  const techScore = Math.min(100, 
    (videoCategories.find(c => c.name === '科技' || c.name === '知识')?.percentage || 0) * 3
  )
  alignment.push({ name: '科技极客感', value: Math.max(10, techScore), color: 'from-blue-400 to-indigo-500' })

  const lifeScore = Math.min(100, 
    (videoCategories.find(c => c.name === '生活' || c.name === '美食' || c.name === '时尚')?.percentage || 0) * 2
  )
  alignment.push({ name: '现充生活感', value: Math.max(30, lifeScore), color: 'from-orange-400 to-amber-500' })
  const subCultureAlignment = alignment

  return { 
    categories, tags, power, valuation, honorTags, 
    memeStatus, persona, evaluation, catchphrases, 
    syncRate, energyLevel, energyStatus,
    sentiment, registrationDate, b站工龄, medals,
    mentalState: { status: mentalStatus, desc: mentalDesc, insomniaLevel },
    contrastAnalysis: { title: contrastTitle, desc: contrastDesc, score: contrastScore },
    commentTone: { style: toneStyle, examples: toneExamples },
    activityHeatmap: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: timestamps.filter(ts => new Date(ts * 1000).getHours() === i).length +
             videos.filter(v => new Date(v.created * 1000).getHours() === i).length
    })),
    ddIndex,
    recentBulletChats: finalBulletChats,
    playedGames,
    milestones,
    subCultureAlignment
  }
}
