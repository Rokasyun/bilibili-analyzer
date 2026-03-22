import { Router } from 'express'
import NodeCache from 'node-cache'
import { getUserInfo, getUserFollowings, getUserVideos, getUserUpStat, getUserDynamics, getUserMedals } from '../services/bilibili.js'
import { analyzeFollowings, analyzeVideos, analyzeUserComposition } from '../services/analyzer.js'
import { getMockData } from '../services/mockData.js'

const router = Router()
const cache = new NodeCache({ stdTTL: 3600 }) // 缓存1小时

/**
 * GET /api/analyze/:uid
 * 分析用户成分
 */
router.get('/analyze/:uid', async (req, res, next) => {
  try {
    const { uid } = req.params

    // 允许数字UID或demo字符串
    if (!uid || (!(/^\d+$/.test(uid)) && uid !== 'demo')) {
      return res.status(400).json({ 
        error: '无效的UID', 
        message: '啊哦，UID 格式不对呢，要输入纯数字或者 demo 哦~' 
      })
    }

    // 调试期间临时禁用缓存逻辑
    const cacheKey = `analysis_${uid}`
    /*
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log(`Cache hit for UID: ${uid}`)
      return res.json(cached)
    }
    */

    console.log(`Analyzing user: ${uid}`)

    // 处理演示数据或模拟数据
    const mockData = getMockData(uid)
    if (mockData) {
      console.log(`Using mock data for UID: ${uid}`)
      return res.json(mockData)
    }

    let userInfo: any = null
    let upStat: any = { views: 0, likes: 0 }
    let followings: any[] = []
    let videos: any[] = []
    let dynamics: string[] = []
    let dynamicTimestamps: number[] = []

    // 第一阶段：尝试获取基础信息（核心）
    try {
      userInfo = await getUserInfo(uid)
    } catch (e: any) {
      console.warn(`基础信息获取失败: ${e.message}，将使用保底信息展示`)
      userInfo = {
        mid: parseInt(uid),
        name: `神秘用户(${uid})`,
        face: 'https://static.hdslb.com/images/akari.jpg',
        sign: '啊哦，这个人的灵魂暂时由于B站风控失联了...',
        level: 0,
        follower: 0,
        following: 0,
        vip: { type: 0, status: 0, label: '' },
        official: { role: -1, title: '', desc: '' },
        dynamics: [],
        mentions: [],
        medals: []
      }
    }

    // 第二阶段：并行获取其他所有数据（互不阻塞）
    let medals: any[] = []
    const otherData = await Promise.allSettled([
      getUserUpStat(uid),
      getUserFollowings(uid, 50),
      getUserVideos(uid, 30),
      getUserDynamics(uid, 10),
      getUserMedals(uid)
    ])

    if (otherData[0].status === 'fulfilled') upStat = otherData[0].value
    if (otherData[1].status === 'fulfilled') followings = otherData[1].value
    if (otherData[2].status === 'fulfilled') videos = otherData[2].value
    if (otherData[3].status === 'fulfilled') {
      dynamics = (otherData[3].value as any).texts || []
      dynamicTimestamps = (otherData[3].value as any).timestamps || []
      userInfo.mentions = (otherData[3].value as any).mentions || []
    }
    if (otherData[4].status === 'fulfilled') medals = otherData[4].value

    const followingAnalysis = analyzeFollowings(followings)
    const videoAnalysis = analyzeVideos(videos)
    const { 
      categories, tags, power, valuation, honorTags, 
      memeStatus, evaluation, persona, catchphrases,
      syncRate, energyLevel, energyStatus,
      sentiment, registrationDate, b站工龄,
      mentalState, contrastAnalysis, commentTone,
      activityHeatmap, ddIndex, recentBulletChats, playedGames,
      milestones, subCultureAlignment
    } = analyzeUserComposition(followings, videos, {
      ...userInfo,
      totalViews: upStat.views,
      totalLikes: upStat.likes,
      dynamics,
      dynamicTimestamps,
      medals
    })

    const result = {
      user: {
        uid: userInfo.mid,
        name: userInfo.name,
        face: userInfo.face,
        sign: userInfo.sign,
        level: userInfo.level,
        follower: userInfo.follower,
        following: userInfo.following,
        honorTags,
        memeStatus,
        vip: userInfo.vip,
        official: userInfo.official,
        liveRoom: userInfo.live_room,
        totalViews: upStat.views,
        totalLikes: upStat.likes,
        dynamics,
        persona,
        mentions: userInfo.mentions || [],
        medals,
        mentalState,
        contrastAnalysis,
        commentTone,
        activityHeatmap,
        ddIndex,
        recentBulletChats,
        playedGames,
        milestones,
        subCultureAlignment
      },
      categories,
      tags,
      followingAnalysis,
      videoAnalysis,
      power,
      valuation,
      evaluation,
      catchphrases,
      syncRate,
      energyLevel,
      energyStatus,
      sentiment,        // 新增透传
      registrationDate, // 新增透传
      b站工龄,          // 新增透传
      medals,           // 新增透传：顶层勋章
      recentBulletChats,
      playedGames,
      milestones,
      subCultureAlignment,
      _status: {
        followings: followings.length > 0 ? 'success' : 'empty',
        videos: videos.length > 0 ? 'success' : 'empty',
        info: userInfo.level > 0 ? 'success' : 'partial'
      }
    }

    // 缓存结果
    cache.set(cacheKey, result)
    return res.json(result)

  } catch (error: any) {
    console.error('Analysis error:', error)
    next(error)
  }
})

/**
 * GET /api/user/:uid
 * 获取用户基本信息
 */
router.get('/user/:uid', async (req, res, next) => {
  try {
    const { uid } = req.params

    if (!uid || !/^\d+$/.test(uid)) {
      return res.status(400).json({ error: '无效的UID' })
    }

    const userInfo = await getUserInfo(uid)
    res.json(userInfo)
  } catch (error: any) {
    next(error)
  }
})

export default router
