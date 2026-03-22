import axios from 'axios'

// 自动检测当前环境，支持局域网访问
const getApiBaseUrl = () => {
  // 如果有环境变量，使用环境变量
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // 否则根据当前访问的域名自动构造
  const hostname = window.location.hostname
  
  // 如果是localhost，使用localhost:3001
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001'
  }
  
  // 否则使用当前域名的3001端口（局域网）
  return `http://${hostname}:3001`
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

console.log('🔗 API Base URL:', API_BASE_URL)

export interface UserInfo {
  uid: number
  name: string
  face: string
  sign: string
  level: number
  follower: number
  following: number
  honorTags?: { label: string, color: string }[]
  memeStatus?: string
  vip?: {
    type: number
    status: number
    label: string
  }
  official?: {
    role: number
    title: string
    desc: string
  }
  liveRoom?: {
    status: number
    url: string
    title: string
    cover: string
  }
  totalViews?: number
  totalLikes?: number
  mentions?: { name: string, mid: string }[]
  medals?: { medal_name: string, level: number, up_name: string }[]
  mentalState?: {
    status: string
    desc: string
    insomniaLevel: number
  }
  contrastAnalysis?: {
    title: string
    desc: string
    score: number
  }
  commentTone?: {
    style: string,
    examples: string[]
  }
  activityHeatmap?: {
    hour: number
    count: number
  }[]
  ddIndex?: {
    score: number
    level: string
    vupCount: number
    mainVup?: string
  }
  recentBulletChats?: {
    content: string
    type: 'dynamic' | 'predicted'
    timestamp?: number
    tag?: string
  }[]
  playedGames?: string[]
  milestones?: { label: string, date: string, icon: string }[]
  subCultureAlignment?: { name: string, value: number, color: string }[]
}

export interface CategoryData {
  name: string
  count: number
  percentage: number
}

export interface AnalysisResult {
  user: UserInfo
  categories: CategoryData[]
  tags: string[]
  followingAnalysis: CategoryData[]
  videoAnalysis: CategoryData[]
  power?: { name: string, value: number }[]
  valuation?: number
  persona?: {
    name: string
    desc: string
    icon: string
    color: string
    matchRate: number
  }
  evaluation?: {
    title: string
    content: string
    type: 'explorer' | 'creator' | 'collector' | 'observer'
    stats: { label: string, value: string | number }[]
  }
  catchphrases?: { name: string; value: number }[]
  syncRate?: string,
  energyLevel?: string
  energyStatus?: string
  sentiment?: string
  registrationDate?: string
  b站工龄?: number
  medals?: { medal_name: string, level: number, up_name: string }[]
  recentBulletChats?: {
    content: string
    type: 'dynamic' | 'predicted'
    timestamp?: number
    tag?: string
  }[]
  playedGames?: string[]
  milestones?: { label: string, date: string, icon: string }[]
  subCultureAlignment?: { name: string, value: number, color: string }[]
  _status?: {
    followings: 'success' | 'empty'
    videos: 'success' | 'empty'
  }
}

export const getUserAnalysis = async (uid: string): Promise<AnalysisResult> => {
  const response = await api.get(`/api/analyze/${uid}`)
  return response.data
}

export default api
