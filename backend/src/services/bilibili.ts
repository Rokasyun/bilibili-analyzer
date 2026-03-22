import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { proxyPool, proxyConfigToAxios, ProxyConfig } from '../utils/proxyPool.js'

dotenv.config()

// --- WBI 签名逻辑开始 ---
const mixinKeyEncTab = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 54, 40,
  51, 64, 4, 11, 26, 61, 30, 34, 63, 20, 22, 55, 6, 62, 21, 59, 52, 57, 1,
  17, 36, 60, 56, 25, 44
]

const getMixinKey = (orig: string) => {
  let temp = ''
  mixinKeyEncTab.forEach((n) => {
    temp += orig[n - 1]
  })
  return temp.slice(0, 32)
}

const encWbi = (params: any, imgKey: string, subKey: string) => {
  const mixinKey = getMixinKey(imgKey + subKey)
  const currTime = Math.round(Date.now() / 1000)
  const chrFilter = /[!'()*]/g
  const query: string[] = []
  
  Object.assign(params, { wts: currTime })
  Object.keys(params).sort().forEach((key) => {
    query.push(
      encodeURIComponent(key) +
      '=' +
      encodeURIComponent(params[key].toString().replace(chrFilter, ''))
    )
  })
  
  const queryStr = query.join('&')
  const wbiSign = crypto.createHash('md5').update(queryStr + mixinKey).digest('hex')
  return queryStr + '&w_rid=' + wbiSign
}

let cachedWbiKeys: { imgKey: string; subKey: string; lastUpdate: number } | null = null

async function getWbiKeys(api: AxiosInstance) {
  if (cachedWbiKeys && Date.now() - cachedWbiKeys.lastUpdate < 3600000) {
    return cachedWbiKeys
  }
  
  console.log('🔑 正在获取最新 WBI 密钥...')
  const response = await api.get('https://api.bilibili.com/x/web-interface/nav')
  
  if (!response.data?.data?.wbi_img) {
    throw new Error('获取WBI密钥失败，接口未返回有效数据')
  }

  const imgUrl = response.data.data.wbi_img.img_url
  const subUrl = response.data.data.wbi_img.sub_url
  
  const imgKey = imgUrl.slice(imgUrl.lastIndexOf('/') + 1, imgUrl.lastIndexOf('.'))
  const subKey = subUrl.slice(subUrl.lastIndexOf('/') + 1, subUrl.lastIndexOf('.'))
  
  console.log('✅ WBI 密钥同步成功')
  cachedWbiKeys = { imgKey, subKey, lastUpdate: Date.now() }
  return cachedWbiKeys
}
// --- WBI 签名逻辑结束 ---

function generateBuvid() {
  const s = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase()
  const b3 = `${s()}${s()}-${s()}-${s()}-${s()}-${s()}${s()}${s()}infoc`
  const b4 = `${s()}${s()}-${s()}-${s()}-${s()}-${s()}${s()}${s()}`
  return { buvid3: b3, buvid4: b4 }
}

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0'
]

function createBiliApi(proxy?: ProxyConfig | null, uid?: string): AxiosInstance {
  const ua = USER_AGENTS[0]
  const cookieStr = process.env.BILIBILI_COOKIE || ''
  
  // 从环境变量中提取已有的 buvid
  const hasBuvid3 = cookieStr.includes('buvid3=')
  const hasBuvid4 = cookieStr.includes('buvid4=')
  
  const { buvid3: genB3, buvid4: genB4 } = generateBuvid()
  const b3 = hasBuvid3 ? '' : `buvid3=${genB3}; `
  const b4 = hasBuvid4 ? '' : `buvid4=${genB4}; `
  const b_nut = cookieStr.includes('b_nut=') ? '' : `b_nut=${Math.floor(Date.now() / 1000)}; `
  
  // 核心：模拟更真实的 Referer 和 Origin
  const referer = uid ? `https://space.bilibili.com/${uid}` : 'https://www.bilibili.com/'

  return axios.create({
    timeout: 10000,
    headers: {
      'User-Agent': ua,
      'Referer': referer,
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      'Cookie': `${b3}${b4}${b_nut}${cookieStr}`,
      'Origin': 'https://www.bilibili.com',
      'Connection': 'keep-alive',
      'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Microsoft Edge";v="122"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'X-Requested-With': 'XMLHttpRequest'
    },
    proxy: proxy ? proxyConfigToAxios(proxy) : undefined
  })
}

async function executeWithSmartRetry<T>(
  requestFn: (api: AxiosInstance) => Promise<T>,
  maxRetries: number = 2,
  uid?: string
): Promise<T> {
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const isProxyAttempt = attempt > 0
      let proxy = null
      
      if (isProxyAttempt) {
        proxy = proxyPool.getNext()
        if (!proxy) {
          console.log('❌ 无可用代理，跳过此轮重试')
          continue 
        }
      }
      
      console.log(`🌐 [Attempt ${attempt + 1}] ${isProxyAttempt ? `使用代理 ${proxy.host}:${proxy.port}` : '使用本地IP'} 访问...`)
      
      const api = createBiliApi(proxy, uid)
      
      const result = await requestFn(api)
      console.log(`✅ ${isProxyAttempt ? '代理' : '本地IP'}访问成功！`)
      return result
      
    } catch (error: any) {
      lastError = error
      const errorCode = error.response?.data?.code ?? error.response?.status ?? error.code
      const errorMsg = error.response?.data?.message ?? error.message
      
      console.log(`⚠️  [Attempt ${attempt + 1}] 访问失败: [${errorCode}] ${errorMsg}`)
      
      if (isProxyAttempt) {
        proxyPool.markCurrentFailed()
      }

      // 如果是业务错误（如用户隐私 22007），直接抛出不再重试
      if (errorCode === 22007 || errorCode === -404 || errorCode === -400) {
        throw error
      }

      // 如果是 -412 (Banned) 且是本地 IP，下次强行尝试代理
      if (errorCode === -412 && attempt === 0) {
        console.log('🚫 本地 IP 被封禁，准备切换代理...')
      }

      if (attempt < maxRetries) {
        const delay = 500 * (attempt + 1)
        console.log(`⏳ 等待 ${delay}ms 后进行重试...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

export interface BiliUserInfo {
  mid: number
  name: string
  face: string
  sign: string
  level: number
  follower: number
  following: number
  videoCount?: number
  vip: {
    type: number
    status: number
    label: string
  }
  official: {
    role: number
    title: string
    desc: string
  }
  live_room?: {
    status: number
    url: string
    title: string
    cover: string
  }
  mentions?: { name: string, mid: string }[]
  medals?: any[]
  dynamicTimestamps?: number[]
}

export interface BiliVideo {
  aid: number
  bvid: string
  title: string
  tname: string 
  tid: number    
  play: number
  comment: number
  description: string
  pic: string
  created: number
  length: string
}

export interface BiliFollowing {
  mid: number
  uname: string
  sign: string
  face: string
  official_verify?: {
    type: number
    desc: string
  }
}

export async function getUserInfo(uid: string): Promise<BiliUserInfo> {
  try {
    return await executeWithSmartRetry(async (api) => {
      // 策略 1: 使用 card 接口 (包含关注数等)
      try {
        const response = await api.get(`https://api.bilibili.com/x/web-interface/card?mid=${uid}`)
        if (response.data.code === 0) {
          const card = response.data.data.card
          const follower = response.data.data.follower || 0
          const archiveCount = response.data.data.archive_count || 0
          return {
            mid: parseInt(card.mid),
            name: card.name,
            face: card.face,
            sign: card.sign || '',
            level: card.level_info?.current_level || 0,
            follower: follower,
            following: card.attention || 0,
            videoCount: archiveCount,
            vip: {
              type: card.vip?.type || 0,
              status: card.vip?.status || 0,
              label: card.vip?.label?.text || ''
            },
            official: {
              role: card.official_verify?.type || -1,
              title: card.official_verify?.desc || '',
              desc: card.official_verify?.desc || ''
            },
            live_room: card.live_room ? {
              status: card.live_room.liveStatus,
              url: card.live_room.url,
              title: card.live_room.title,
              cover: card.live_room.cover
            } : undefined
          }
        }
      } catch (e) {
        console.warn('Card 接口访问失败，尝试备用接口...')
      }

      // 策略 2: 使用 acc/info 接口
      const { imgKey, subKey } = await getWbiKeys(api)
      const signedQuery = encWbi({ mid: uid }, imgKey, subKey)
      const response = await api.get(`https://api.bilibili.com/x/space/wbi/acc/info?${signedQuery}`)
      
      if (response.data.code !== 0) {
        throw new Error(response.data.message || '获取用户信息失败')
      }
      
      const data = response.data.data
      return {
        mid: data.mid,
        name: data.name,
        face: data.face,
        sign: data.sign,
        level: data.level,
        follower: 0, // 此接口不直接提供，由其他函数补全或前端处理
        following: 0,
        videoCount: 0,
        vip: {
          type: data.vip.type,
          status: data.vip.status,
          label: data.vip.label.text
        },
        official: {
          role: data.official.role,
          title: data.official.title,
          desc: data.official.desc
        },
        live_room: data.live_room ? {
          status: data.live_room.liveStatus,
          url: data.live_room.url,
          title: data.live_room.title,
          cover: data.live_room.cover
        } : undefined
      }
    }, 2, uid)
  } catch (error: any) {
    console.warn(`基础信息获取失败 (${error.message})`)
    throw error 
  }
}

export async function getUserUpStat(uid: string): Promise<{ views: number, likes: number }> {
  try {
    return await executeWithSmartRetry(async (api) => {
      const response = await api.get(`https://api.bilibili.com/x/space/upstat?mid=${uid}`)
      if (response.data.code !== 0) {
        return { views: 0, likes: 0 }
      }
      return {
        views: response.data.data?.archive?.view || 0,
        likes: response.data.data?.likes || 0
      }
    }, 2, uid)
  } catch (error: any) {
    return { views: 0, likes: 0 }
  }
}

export async function getUserFollowings(uid: string, limit: number = 50): Promise<BiliFollowing[]> {
  try {
    return await executeWithSmartRetry(async (api) => {
      // 策略 1: 传统关注列表
      try {
        const response = await api.get(`https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=1&ps=20`)
        if (response.data.code === 0) {
          const list = response.data.data?.list || []
          if (list.length > 0) {
            console.log(`✅ 通过传统关注接口抓取 ${list.length} 条数据`)
            return list.slice(0, limit)
          }
        }
        if (response.data.code === 22007) throw new Error('用户设置了隐私，看不见哦~')
        console.warn(`传统关注接口返回: ${response.data.code} ${response.data.message || ''}`)
      } catch (e: any) {
        if (e.message.includes('隐私')) throw e
        console.warn(`传统关注接口失败: ${e.message}`)
      }

      // 策略 2: Polymer 关系接口
      try {
        const polyUrl = `https://api.bilibili.com/x/polymer/web-relation/relations?vmid=${uid}`
        const polyRes = await api.get(polyUrl)
        if (polyRes.data.code === 0) {
          const list = polyRes.data.data?.list || []
          if (list.length > 0) {
            console.log(`✅ 通过 Polymer 关注接口抓取 ${list.length} 条数据`)
            return list.map((item: any) => ({
              mid: item.mid, uname: item.uname, sign: item.sign,
              face: item.face, official_verify: item.official_verify
            })).slice(0, limit)
          }
        }
        console.warn(`Polymer 关注接口返回: ${polyRes.data.code}`)
      } catch (e: any) {
        console.warn(`Polymer 关注接口失败: ${e.message}`)
      }

      return [] // 返回空数组
    }, 2, uid)
  } catch (error: any) {
    console.warn(`关注列表抓取最终跳过: ${error.message}`)
    return [] 
  }
}

export interface BiliMedal {
  medal_name: string
  level: number
  up_name: string
}

export async function getUserMedals(uid: string): Promise<BiliMedal[]> {
  try {
    return await executeWithSmartRetry(async (api) => {
      const url = `https://api.bilibili.com/x/space/medal/wall?mid=${uid}`
      const res = await api.get(url)
      if (res.data.code === 0) {
        const list = res.data.data?.list || []
        return list.map((m: any) => ({
          medal_name: m.medal_info.medal_name,
          level: m.medal_info.level,
          up_name: m.target_name
        }))
      }
      return []
    }, 2, uid)
  } catch (e) {
    return []
  }
}

export async function getUserDynamics(uid: string, limit: number = 20): Promise<{texts: string[], mentions: {name: string, mid: string}[], timestamps: number[]}> {
  try {
    return await executeWithSmartRetry(async (api) => {
      const dynamicUrl = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=${uid}`
      const response = await api.get(dynamicUrl)
      if (response.data.code === 0) {
        const items = response.data.data?.items || []
        const texts: string[] = []
        const mentions: {name: string, mid: string}[] = []
        const timestamps: number[] = []
        
        items.forEach((item: any) => {
          const moduleDynamic = item.modules.module_dynamic
          const moduleAuthor = item.modules.module_author
          
          if (moduleDynamic) {
            const content = moduleDynamic.desc?.text
            if (content) {
              texts.push(content)
              // 提取时间戳
              if (moduleAuthor?.pub_ts) {
                timestamps.push(moduleAuthor.pub_ts)
              }
              
              // 提取提及的人
              const ctrl = moduleDynamic.desc?.rich_text_nodes || []
              ctrl.forEach((node: any) => {
                if (node.type === 'RICH_TEXT_NODE_TYPE_AT') {
                  mentions.push({ name: node.text.replace('@', ''), mid: node.rid })
                }
              })
            }
          }
        })
        
        return { 
          texts: texts.slice(0, limit), 
          mentions,
          timestamps: timestamps.slice(0, limit)
        }
      }
      return { texts: [], mentions: [], timestamps: [] }
    }, 2, uid)
  } catch (error) {
    return { texts: [], mentions: [], timestamps: [] }
  }
}
export async function getUserVideos(uid: string, limit: number = 30): Promise<BiliVideo[]> {
  try {
    return await executeWithSmartRetry(async (api) => {
      // 策略 1: 尝试 WBI 签名接口
      try {
        const { imgKey, subKey } = await getWbiKeys(api)
        const params: any = { 
          mid: uid, ps: limit, pn: 1, tid: 0,
          keyword: '', order: 'pubdate', platform: 'web', web_location: 1550101
        }
        const signedQuery = encWbi(params, imgKey, subKey)
        const wbiUrl = `https://api.bilibili.com/x/space/wbi/arc/search?${signedQuery}`
        const wbiResponse = await api.get(wbiUrl)
        
        if (wbiResponse.data.code === 0) {
          const rawList = wbiResponse.data.data?.list?.vlist || []
          if (rawList.length > 0) {
            console.log(`✅ 通过 WBI 接口抓取 ${rawList.length} 条数据`)
            return rawList.map((v: any) => ({
              aid: v.aid, bvid: v.bvid, title: v.title, tname: v.tname, tid: v.typeid,
              play: v.play, comment: v.video_review || 0, description: v.description,
              pic: v.pic, created: v.created, length: v.length
            }))
          }
        }
        console.warn(`WBI 接口返回: ${wbiResponse.data.code} ${wbiResponse.data.message || ''}`)
      } catch (e: any) {
        console.warn(`WBI 接口尝试失败: ${e.message}`)
      }

      // 策略 2: 尝试传统无签名接口
      try {
        const fallbackUrl = `https://api.bilibili.com/x/space/arc/search?mid=${uid}&ps=${limit}&tid=0&pn=1&order=pubdate`
        const res = await api.get(fallbackUrl)
        if (res.data.code === 0) {
          const rawList = res.data.data?.list?.vlist || []
          if (rawList.length > 0) {
            console.log(`✅ 通过传统接口抓取 ${rawList.length} 条数据`)
            return rawList.map((v: any) => ({
              aid: v.aid, bvid: v.bvid, title: v.title, tname: v.tname, tid: v.typeid,
              play: v.play, comment: v.video_review || 0, description: v.description,
              pic: v.pic, created: v.created, length: v.length
            }))
          }
        }
        console.warn(`传统接口返回: ${res.data.code} ${res.data.message || ''}`)
      } catch (e: any) {
        console.warn(`传统接口访问失败: ${e.message}`)
      }

      // 策略 3: 尝试 Polymer 搜索接口
      try {
        const polymerUrl = `https://api.bilibili.com/x/polymer/web-space/home/search?mid=${uid}&keyword=&pn=1&ps=${limit}`
        const polyRes = await api.get(polymerUrl)
        if (polyRes.data.code === 0) {
          const rawList = polyRes.data.data?.vlist || []
          if (rawList.length > 0) {
            console.log(`✅ 通过 Polymer 接口抓取 ${rawList.length} 条数据`)
            return rawList.map((v: any) => ({
              aid: v.aid, bvid: v.bvid, title: v.title, tname: v.tname, tid: v.typeid,
              play: v.play, comment: v.video_review || 0, description: v.description,
              pic: v.pic, created: v.created, length: v.length
            }))
          }
        }
        console.warn(`Polymer 接口返回: ${polyRes.data.code} ${polyRes.data.message || ''}`)
      } catch (e: any) {
        console.warn(`Polymer 接口访问失败: ${e.message}`)
      }

      // 策略 4: 尝试 MediaList 接口
      try {
        const medialistUrl = `https://api.bilibili.com/x/v2/medialist/resource/list?type=1&oid=${uid}&ps=${limit}&direction=desc&sort_field=pubtime&tid=0`
        const mlRes = await api.get(medialistUrl)
        if (mlRes.data.code === 0) {
          const rawList = mlRes.data.data?.medias || []
          if (rawList.length > 0) {
            console.log(`✅ 通过 MediaList 接口抓取 ${rawList.length} 条数据`)
            return rawList.map((v: any) => ({
              aid: v.id, bvid: v.bv_id, title: v.title, tname: v.vlist?.[0]?.tname || '未知',
              tid: v.vlist?.[0]?.tid || 0, play: v.cnt_info?.play || 0, comment: v.cnt_info?.reply || 0,
              description: v.intro, pic: v.cover, created: v.pubtime, length: v.duration
            }))
          }
        }
        console.warn(`MediaList 接口返回: ${mlRes.data.code}`)
      } catch (e: any) {
        console.warn(`MediaList 接口访问失败: ${e.message}`)
      }

      // 策略 5: 尝试动态接口
      try {
        const dynamicUrl = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=${uid}`
        const dynRes = await api.get(dynamicUrl)
        if (dynRes.data.code === 0) {
          const rawList = dynRes.data.data?.items || []
          const vlist: any[] = []
          rawList.forEach((item: any) => {
            if (item.type === 'DYNAMIC_TYPE_AV') {
              const v = item.modules.module_dynamic.major.archive
              vlist.push({
                aid: v.aid, bvid: v.bvid, title: v.title, tname: v.tname || '投稿', tid: 0,
                play: 0, comment: 0, description: v.desc, pic: v.cover, created: 0, length: v.duration_text
              })
            }
          })
          if (vlist.length > 0) {
            console.log(`✅ 通过动态接口抓取 ${vlist.length} 条视频数据`)
            return vlist.slice(0, limit)
          }
        }
        console.warn(`动态接口返回: ${dynRes.data.code}`)
      } catch (e: any) {
        console.warn(`动态接口访问失败: ${e.message}`)
      }

      throw new Error('B站把门锁死啦，进不去~')
    }, 2, uid)
  } catch (error: any) {
    console.warn(`视频抓取最终跳过: ${error.message}`)
    return [] 
  }
}
