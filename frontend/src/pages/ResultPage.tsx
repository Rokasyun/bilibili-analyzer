import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserAnalysis, AnalysisResult } from '../api'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import DynamicBackground from '../components/DynamicBackground'

const COLORS = ['#fb7299', '#00aeec', '#ffb37e', '#00c091', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

function ResultPage() {
  const { uid } = useParams<{ uid: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 检测是否是深色模式，用于图表适配
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'))
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!uid) return
      setLoading(true)
      setError(null)
      try {
        const result = await getUserAnalysis(uid)
        setData(result)
      } catch (err: any) {
        setError(err.response?.data?.message || '啊哦，探测器好像短路了...')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [uid])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
        <DynamicBackground />
        <div className="text-center z-10">
          <div className="relative inline-block w-24 h-24 mb-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 border-4 border-t-[#fb7299] border-r-transparent border-b-blue-400 border-l-transparent rounded-full"
            ></motion.div>
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-3 border-4 border-t-transparent border-r-green-400 border-b-transparent border-l-purple-400 rounded-full"
            ></motion.div>
          </div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-slate-600 dark:text-slate-400 font-bold text-xl tracking-widest"
          >
            正在同步站内数据...
          </motion.p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 relative">
        <DynamicBackground />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border-t-8 border-red-400 z-10"
        >
          <div className="text-red-400 text-7xl mb-6 font-mono">X_X</div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-4">异常警报！</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">{error || '次元壁垒太厚，无法穿透'}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-[#fb7299] text-white font-bold rounded-2xl hover:bg-[#ff85a7] transition-all shadow-lg active:scale-95"
          >
            返回探测站首页
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4 relative overflow-hidden transition-colors duration-300">
      <DynamicBackground />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto z-10 relative"
      >
        {/* 返回按钮 */}
        <motion.button
          variants={itemVariants}
          onClick={() => navigate('/')}
          className="mb-8 group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#fb7299] transition-colors font-bold"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span> 返回搜索页
        </motion.button>

        {/* 用户信息卡片 */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl overflow-hidden mb-8 border border-white/50 dark:border-slate-800/50"
        >
          {/* 顶部 Banner: 动态水流效果 */}
          <div className="h-48 bg-gradient-to-br from-[#fb7299] via-[#ff85a7] to-[#00aeec] relative overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <svg className="absolute bottom-0 left-0 w-[200%] h-32 animate-wave-slow" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0 C300,0 300,80 600,80 C900,80 900,0 1200,0 L1200,120 L0,120 Z" fill="white" opacity="0.3"></path>
              </svg>
              <svg className="absolute bottom-0 left-0 w-[200%] h-24 animate-wave-medium opacity-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,30 C300,30 300,100 600,100 C900,100 900,30 1200,30 L1200,120 L0,120 Z" fill="white" opacity="0.2"></path>
              </svg>
              <svg className="absolute bottom-0 left-0 w-[200%] h-20 animate-wave-fast opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,60 C300,60 300,120 600,120 C900,120 900,60 1200,60 L1200,120 L0,120 Z" fill="white" opacity="0.1"></path>
              </svg>
            </div>
            {/* 顶层光影遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>

          {/* 信息主体区域 */}
          <div className="px-10 pb-8 relative">
            {/* 核心排版：头像、姓名、勋章 */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-20 mb-8">
              {/* 头像 */}
              <div className="relative flex-shrink-0 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-44 h-44 rounded-full border-8 border-white dark:border-slate-800 shadow-2xl bg-[#fb7299] flex items-center justify-center overflow-hidden relative"
                >
                  <svg width="100" height="100" viewBox="0 0 1024 1024" className="text-white fill-current translate-y-2">
                    <path d="M777.1 123.3c19.4 0 35.1 15.7 35.1 35.1v108.6h85.3c35.1 0 63.5 28.5 63.5 63.5v447.4c0 35-28.4 63.5-63.5 63.5H126.5c-35.1 0-63.5-28.5-63.5-63.5V330.5c0-35 28.4-63.5 63.5-63.5h85.3V158.4c0-19.4 15.7-35.1 35.1-35.1s35.1 15.7 35.1 35.1v108.6h460V158.4c0-19.4 15.8-35.1 35.1-35.1z m85.3 268.4H161.6v404.9h700.8V391.7z m-538.5 73.1c31.1 0 56.4 25.3 56.4 56.4v30.5c0 31.1-25.3 56.4-56.4 56.4s-56.4-25.3-56.4-56.4v-30.5c0-31.1 25.3-56.4 56.4-56.4z m376.5 0c31.1 0 56.4 25.3 56.4 56.4v30.5c0 31.1-25.3 56.4-56.4 56.4s-56.4-25.3-56.4-56.4v-30.5c0-31.1 25.3-56.4 56.4-56.4z"></path>
                  </svg>
                  {/* 小电视天线背景效果 */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-4 border-white rounded-full"></div>
                  </div>
                </motion.div>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-[#fb7299] text-white text-xs font-black rounded-lg shadow-lg">
                  LV{data.user.level}
                </div>
                {data.user.liveRoom?.status === 1 && (
                  <a 
                    href={data.user.liveRoom.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                    直播中
                  </a>
                )}
              </div>

              {/* 文字信息 */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <h2 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#fb7299] via-purple-500 to-[#00aeec] filter drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] flex items-center gap-3">
                    {data.user.name}
                    {data.user.official && data.user.official.role !== -1 && (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-full text-white text-[12px] shadow-sm" title={data.user.official.title}>
                        <svg width="18" height="18" viewBox="0 0 1024 1024" fill="currentColor">
                          <path d="M512 0L634.3 147.1L824.9 147.1L876.8 330.5L1024 452.8L932.1 634.3L932.1 824.9L748.7 876.8L626.4 1024L444.9 932.1L254.3 932.1L202.4 748.7L55.3 626.4L147.1 444.9L147.1 254.3L330.5 202.4L452.8 55.3L512 0Z M656.4 365.2L452.8 568.8L367.6 483.6L311.1 540.1L452.8 681.8L712.9 421.7L656.4 365.2Z"></path>
                        </svg>
                      </span>
                    )}
                  </h2>
                  
                  {data.user.vip && data.user.vip.status === 1 && (
                    <span className="px-3 py-1 bg-[#fb7299] text-white text-[11px] font-black rounded-lg italic shadow-sm">
                      {data.user.vip.label || '大会员'}
                    </span>
                  )}
                  
                  {/* 多维荣誉标签 */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {data.user.honorTags?.map((tag, idx) => {
                      // 强制映射颜色类名，确保 Tailwind 能够扫描到并生成样式
                      let bgStyle = '';
                      const label = tag.label;
                      
                      // 精确匹配颜色
                      if (label.includes('老兵')) bgStyle = 'from-emerald-800 to-emerald-950';
                      else if (label.includes('Lv6')) bgStyle = 'from-rose-800 to-rose-950';
                      else if (label.includes('骨灰') || label.includes('元老')) bgStyle = 'from-purple-800 to-purple-950';
                      else if (label.includes('原人')) bgStyle = 'from-amber-800 to-amber-950';
                      else if (label.includes('先行者')) bgStyle = 'from-indigo-800 to-indigo-950';
                      else if (label.includes('Lv5')) bgStyle = 'from-orange-800 to-orange-950';
                      else if (label.includes('Lv4')) bgStyle = 'from-green-800 to-green-950';
                      else if (label.includes('亿级') || label.includes('GDP')) bgStyle = 'from-amber-700 to-amber-950';
                      else if (label.includes('千万') || label.includes('魂')) bgStyle = 'from-purple-800 to-purple-950';
                      else if (label.includes('百万播放') || label.includes('获赞')) bgStyle = 'from-blue-700 to-blue-950';
                      else if (label.includes('百万粉') || label.includes('主播')) bgStyle = 'from-red-700 to-red-950';
                      else if (label.includes('万众') || label.includes('大会员')) bgStyle = 'from-pink-700 to-pink-950';
                      else if (label.includes('爆肝') || label.includes('认证')) bgStyle = 'from-orange-700 to-orange-950';
                      else if (label.includes('高产')) bgStyle = 'from-yellow-700 to-amber-900';
                      else if (label.includes('社交') || label.includes('天花板')) bgStyle = 'from-emerald-700 to-emerald-950';
                      else if (label.includes('孤傲') || label.includes('创始')) bgStyle = 'from-slate-800 to-black';
                      else if (label.includes('领主')) bgStyle = 'from-blue-600 to-indigo-900';
                      else if (label.includes('达人')) bgStyle = 'from-cyan-500 to-blue-800';
                      else if (label.includes('德高望重')) bgStyle = 'from-amber-600 to-red-900';
                      else if (label.includes('博爱')) bgStyle = 'from-pink-500 to-purple-800';
                      else if (label.includes('篇篇爆款')) bgStyle = 'from-orange-600 to-red-900';
                      else if (label.includes('评测')) bgStyle = 'from-slate-700 to-gray-950';
                      else if (label.includes('单推人')) bgStyle = 'from-blue-400 to-indigo-700';
                      else if (label.includes('隐世高手')) bgStyle = 'from-zinc-800 to-black';
                      else if (label.includes('下次一定')) bgStyle = 'from-slate-500 to-slate-800';
                      else if (label.includes('素质三连')) bgStyle = 'from-orange-500 to-red-700';
                      else if (label.includes('有本')) bgStyle = 'from-pink-400 to-rose-600';
                      else if (label.includes('战力崩坏')) bgStyle = 'from-red-600 to-black';
                      else if (label.includes('鸽王')) bgStyle = 'from-gray-400 to-gray-700';
                      else if (label.includes('发射器')) bgStyle = 'from-blue-500 to-indigo-800';
                      else if (label.includes('技术协')) bgStyle = 'from-emerald-600 to-teal-900';
                      else if (label.includes('食堂')) bgStyle = 'from-orange-400 to-amber-700';
                      else if (label.includes('二次元之友')) bgStyle = 'from-pink-600 to-pink-900';
                      else if (label.includes('首席观测员')) bgStyle = 'from-slate-600 to-slate-900';
                      else if (label.includes('成分探索家')) bgStyle = 'from-blue-600 to-blue-900';
                      else if (label.includes('观测者')) bgStyle = 'from-slate-700 to-slate-900';
                      else if (label.includes('次元居民')) bgStyle = 'from-blue-800 to-indigo-950';
                      else if (label.includes('干杯小将')) bgStyle = 'from-pink-800 to-rose-950';
                      else if (label.includes('三连大师')) bgStyle = 'from-orange-800 to-red-950';
                      else if (label.includes('弹幕之魂')) bgStyle = 'from-cyan-800 to-blue-950';
                      else if (label.includes('投币达人')) bgStyle = 'from-yellow-700 to-amber-900';
                      else if (label.includes('收藏狂魔')) bgStyle = 'from-purple-800 to-indigo-950';
                      else if (label.includes('一键三连')) bgStyle = 'from-rose-800 to-pink-950';
                      else if (label.includes('硬币玩家')) bgStyle = 'from-zinc-700 to-zinc-900';
                      else if (label.includes('潜水精英')) bgStyle = 'from-emerald-800 to-teal-950';
                      else if (label.includes('宝藏猎人')) bgStyle = 'from-sky-800 to-blue-950';
                      else if (label.includes('数据极客')) bgStyle = 'from-violet-800 to-purple-950';
                      else bgStyle = tag.color; // 最后兜底

                      return (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`px-3 py-1 bg-gradient-to-r ${bgStyle} text-[#FFD700] text-[11px] rounded-full font-black shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-white/20 ring-1 ring-black/10 dark:ring-white/10 inline-flex items-center justify-center min-w-[85px]`}
                        >
                          {tag.label}
                        </motion.span>
                      );
                    })}
                  </div>

                  {data.user.memeStatus && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full font-black shadow-lg"
                    >
                      {data.user.memeStatus}
                    </motion.span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-lg font-medium italic opacity-90 max-w-3xl line-clamp-2">
                  “ {data.user.sign || '这个人的灵魂正在休眠，暂无签名。'} ”
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="text-center md:text-left p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="text-2xl font-black text-[#fb7299]">￥{data.valuation?.toLocaleString()}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">身价估值</div>
              </div>
              <div className="text-center md:text-left p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{data.b站工龄 || 0}年</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">B站工龄</div>
              </div>
              <div className="text-center md:text-left p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{(data.user.totalViews || 0).toLocaleString()}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">总播放量</div>
              </div>
              <div className="text-center md:text-left p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{(data.user.totalLikes || 0).toLocaleString()}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">获赞总数</div>
              </div>
              <div className="text-center md:text-left p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{data.user.follower.toLocaleString()}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">追随者</div>
              </div>
              <div className="text-center md:text-left p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{data.user.following.toLocaleString()}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">关注</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 次元居民证 (New! Highly Shareable Summary Card) */}
        <motion.div 
          variants={itemVariants}
          className="bg-slate-200 dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-1 mb-8 relative overflow-hidden group border-4 border-slate-200 dark:border-slate-800 transition-colors duration-300"
        >
          <div className="bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-[2.2rem] p-8 relative overflow-hidden">
            {/* ID Card Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: isDark ? 'radial-gradient(#fb7299 1px, transparent 1px)' : 'radial-gradient(#00aeec 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              {/* Profile Side */}
              <div className="w-full md:w-1/3 flex flex-col items-center border-r-0 md:border-r border-slate-200 dark:border-white/10 pr-0 md:pr-8">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#fb7299]/50 shadow-[0_0_20px_rgba(251,114,153,0.3)]">
                    <img src={data.user.face} alt={data.user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-[#fb7299] text-white text-[10px] font-black rounded-md">
                    UID: {data.user.uid}
                  </div>
                </div>
                <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">{data.user.name}</h4>
                <div className="text-[#fb7299] dark:text-[#fb7299] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Bilibili Resident</div>
                
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                    <span>LEVEL</span>
                    <span className="text-slate-800 dark:text-white">Lv{data.user.level}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#fb7299]" style={{ width: `${(data.user.level / 6) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Data Side */}
              <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                <div className="space-y-4">
                  <div>
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider mb-1">Archetype</div>
                    <div className="text-slate-800 dark:text-white font-bold">{data.persona?.name || '未知成分'}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider mb-1">Entry Year</div>
                    <div className="text-slate-800 dark:text-white font-bold">{data.registrationDate?.replace('约 ', '') || '2021年'}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider mb-1">Contribution</div>
                    <div className="text-slate-800 dark:text-white font-bold">￥{data.valuation?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider mb-1">Sub-Culture Alignment</div>
                    <div className="space-y-2 mt-2">
                      {data.subCultureAlignment?.slice(0, 3).map((a, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${a.value}%` }}
                              className={`h-full bg-gradient-to-r ${a.color}`}
                            ></motion.div>
                          </div>
                          <span className="text-[8px] text-slate-400 dark:text-slate-400 font-bold whitespace-nowrap">{a.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code / Stamp Placeholder */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl opacity-40">
                <div className="text-3xl mb-1">🛡️</div>
                <div className="text-[8px] text-slate-800 dark:text-white font-black text-center leading-tight uppercase">Verified<br/>Resident</div>
              </div>
            </div>
            
            {/* Bottom Tech Bar */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-[8px] font-mono text-slate-400 dark:text-slate-600">
              <span>DE-ENCODING COMPLETED...</span>
              <span>SYSTEM_REV_2026.01.18</span>
              <span>EST_SYNC_RATE_{data.syncRate}%</span>
            </div>
          </div>
        </motion.div>

        {/* 成长里程碑时间轴 (New!) */}
        {data.milestones && data.milestones.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 mb-8 border border-white/50 dark:border-slate-800/50"
          >
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-10 flex items-center gap-3">
              <span className="w-3 h-8 bg-purple-400 rounded-full"></span>
              次元成长里程碑 (Milestones)
            </h3>
            <div className="relative">
              {/* Central Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {data.milestones.map((ms, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative z-10 flex flex-col items-center text-center"
                  >
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-slate-50 dark:border-slate-700 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                      {ms.icon}
                    </div>
                    <div className="text-sm font-black text-slate-800 dark:text-white mb-1">{ms.label}</div>
                    <div className="text-[10px] text-[#fb7299] font-bold">{ms.date}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 次元人格卡片 (New!) */}
        {data.persona && (
          <motion.div 
            variants={itemVariants}
            className={`bg-gradient-to-br ${data.persona.color} rounded-[2.5rem] shadow-2xl p-8 mb-8 relative overflow-hidden group border border-white/10`}
          >
            {/* 背景装饰 - 白天模式加一层白色蒙版降低饱和度 */}
            {!isDark && <div className="absolute inset-0 bg-white/10 pointer-events-none backdrop-blur-[1px]"></div>}
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-white/30">
                {data.persona.icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black rounded-full uppercase tracking-tighter border border-white/20">
                    Dimensional Archetype
                  </span>
                  <span className="text-white/80 text-sm font-bold italic">契合度 {data.persona.matchRate}%</span>
                </div>
                <h3 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-sm">
                  站内属性人格：{data.persona.name}
                </h3>
                <p className="text-white text-lg font-medium italic leading-relaxed drop-shadow-sm">
                  “ {data.persona.desc} ”
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/10">
                <div className="text-white/60 text-[10px] font-black uppercase mb-1">Soul Rank</div>
                <div className="text-4xl font-black text-white italic">
                  {data.persona.matchRate > 95 ? 'SSS' : data.persona.matchRate > 90 ? 'SS' : 'S'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 次元勋章墙 (New!) */}
        {data.medals && data.medals.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 mb-8 border border-white/50 dark:border-slate-800/50"
          >
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-3 h-8 bg-yellow-500 rounded-full"></span>
              次元勋章墙 (Fans Medals)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {data.medals.map((medal, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-md border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-lg mb-3 shadow-inner">
                    {medal.level}
                  </div>
                  <div className="text-sm font-black text-slate-800 dark:text-white mb-1">{medal.medal_name}</div>
                  <div className="text-[10px] text-slate-500 font-bold">@{medal.up_name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 高频关键词标签云 */}
        {data.catchphrases && data.catchphrases.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 mb-8 border border-white/50 dark:border-slate-800/50"
          >
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-3 h-8 bg-pink-500 rounded-full"></span>
              动态高频口头禅 (Keywords)
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {data.catchphrases.map((word, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.2, rotate: (idx % 2 === 0 ? 5 : -5) }}
                  className={`px-6 py-3 rounded-2xl font-black cursor-default shadow-sm border border-white/20 dark:border-slate-700/50 ${
                    idx === 0 ? 'text-4xl bg-pink-500 text-white shadow-pink-200 dark:shadow-none' :
                    idx < 3 ? 'text-2xl bg-blue-400 text-white' :
                    'text-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {word.name}
                </motion.div>
              ))}
            </div>
            <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-6 italic">
              * 基于最近发布的动态文本深度挖掘出的高频词汇
            </p>
          </motion.div>
        )}

        {/* 精神状态与反差分析 (New! 借鉴 aicu.cc) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {data.user.mentalState && (
            <motion.div 
              variants={itemVariants}
              className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 border border-white/50 dark:border-slate-800/50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🧠</div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="w-3 h-8 bg-indigo-500 rounded-full"></span>
                当前精神状态 (Mental State)
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-indigo-500 text-white font-black rounded-xl shadow-lg">
                    {data.user.mentalState.status}
                  </div>
                  <div className="text-slate-400 font-bold text-sm">
                    修仙等级: {data.user.mentalState.insomniaLevel}%
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium italic">
                  “ {data.user.mentalState.desc} ”
                </p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.user.mentalState.insomniaLevel}%` }}
                    className="h-full bg-indigo-500"
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {data.user.contrastAnalysis && (
            <motion.div 
              variants={itemVariants}
              className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 border border-white/50 dark:border-slate-800/50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🎭</div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="w-3 h-8 bg-amber-500 rounded-full"></span>
                动态/审美反差 (Contrast)
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-amber-500 text-white font-black rounded-xl shadow-lg">
                    {data.user.contrastAnalysis.title}
                  </div>
                  <div className="text-slate-400 font-bold text-sm">
                    反差指数: {data.user.contrastAnalysis.score}%
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium italic">
                  “ {data.user.contrastAnalysis.desc} ”
                </p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.user.contrastAnalysis.score}%` }}
                    className="h-full bg-amber-500"
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 弹幕语气预测 (New! 借鉴 aicu.cc) */}
        {data.user.commentTone && (
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-2xl p-8 mb-8 relative overflow-hidden group"
          >
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
             <div className="relative z-10">
               <div className="flex flex-wrap items-center gap-4 mb-6">
                 <h3 className="text-2xl font-black text-white flex items-center gap-3">
                   <span className="p-2 bg-white/20 rounded-lg">💬</span>
                   潜在评论区发言风格模拟
                 </h3>
                 <span className="px-4 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-black rounded-full border border-white/20">
                    风格倾向: {data.user.commentTone.style}
                 </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {data.user.commentTone.examples.map((ex, i) => (
                   <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white font-bold italic"
                   >
                     “ {ex} ”
                   </motion.div>
                 ))}
               </div>
               <p className="text-white/60 text-[10px] mt-6 italic">
                 * 基于近期活跃度与站内属性人格综合预测其在评论区的潜在发言模式
               </p>
             </div>
          </motion.div>
        )}

        {/* DD 指数与全天活跃度 (New!) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {data.user.ddIndex && (
            <motion.div 
              variants={itemVariants}
              className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 border border-white/50 dark:border-slate-800/50 relative overflow-hidden group"
            >
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="w-3 h-8 bg-[#00aeec] rounded-full"></span>
                DD 探测雷达 (VTuber Affinity)
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-800" />
                    <motion.circle 
                      cx="50" cy="50" r="45" fill="transparent" stroke="#00aeec" strokeWidth="10" strokeDasharray="282.7" 
                      initial={{ strokeDashoffset: 282.7 }}
                      animate={{ strokeDashoffset: 282.7 - (282.7 * data.user.ddIndex.score) / 100 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-black text-[#00aeec]">{Math.round(data.user.ddIndex.score)}%</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Affinity</div>
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="text-3xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">
                    {data.user.ddIndex.level}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500 font-medium">已识别 VUP 关注数: <span className="text-[#00aeec] font-black">{data.user.ddIndex.vupCount}</span></p>
                    {data.user.ddIndex.mainVup && (
                      <p className="text-sm text-slate-500 font-medium">头号单推目标: <span className="text-pink-500 font-black">@{data.user.ddIndex.mainVup}</span></p>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 italic">基于关注列表与粉丝勋章墙的交叉语义分析得出</p>
                </div>
              </div>
            </motion.div>
          )}

          {data.user.activityHeatmap && (
            <motion.div 
              variants={itemVariants}
              className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 border border-white/50 dark:border-slate-800/50"
            >
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="w-3 h-8 bg-[#fb7299] rounded-full"></span>
                24H 活跃灵魂分布 (Activity)
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.user.activityHeatmap}>
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white p-2 rounded-lg text-xs font-bold shadow-xl border border-white/10">
                              {payload[0].payload.hour}:00 - {payload[0].value} 次活动
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#fb7299" 
                      radius={[4, 4, 0, 0]}
                    >
                      {data.user.activityHeatmap.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.count === 0 ? (isDark ? '#1e293b' : '#f1f5f9') : '#fb7299'} 
                          fillOpacity={entry.count === 0 ? 1 : 0.4 + (entry.count / Math.max(...data.user.activityHeatmap.map(d => d.count), 1)) * 0.6}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* 近期活跃弹幕/评论墙 (New!) */}
        {data.recentBulletChats && data.recentBulletChats.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 mb-8 border border-white/50 dark:border-slate-800/50 relative overflow-hidden group"
          >
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-3 h-8 bg-pink-400 rounded-full"></span>
              近期活跃弹幕/评论墙 (Bullet Chat Wall)
            </h3>

            {/* 横向弹幕流 (Authentic Danmaku Feel) */}
            <div className="mb-6 overflow-hidden relative h-12 flex items-center bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <div 
                className="flex gap-12 whitespace-nowrap animate-horizontal-marquee items-center"
                style={{ '--duration': '40s' } as any}
              >
                {[...data.recentBulletChats, ...data.recentBulletChats].map((chat, idx) => (
                  <span key={idx} className={`text-sm font-bold opacity-80 ${
                    idx % 3 === 0 ? 'text-[#fb7299]' : idx % 3 === 1 ? 'text-[#00aeec]' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {chat.content}
                  </span>
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10"></div>
            </div>
            
            <div className="h-[450px] overflow-hidden relative mask-linear-v">
              <div 
                className="space-y-4 animate-vertical-ticker"
                style={{ '--duration': `${Math.max(10, data.recentBulletChats.length * 4)}s` } as any}
              >
                {/* 拼接两组数据实现无缝滚动 */}
                {[...data.recentBulletChats, ...data.recentBulletChats].map((chat, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group/item hover:border-pink-300 dark:hover:border-pink-900/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-black shadow-sm ${
                        chat.type === 'dynamic' ? 'bg-[#00aeec]' : 'bg-[#fb7299]'
                      }`}>
                        {chat.type === 'dynamic' ? '动' : '弹'}
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">
                          {chat.type === 'dynamic' ? 'Real Activity' : 'Predicted Tone'}
                        </span>
                        {chat.tag && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400 whitespace-nowrap">
                            #{chat.tag}
                          </span>
                        )}
                        {chat.timestamp && (
                          <span className="text-[9px] text-slate-400 font-bold ml-auto whitespace-nowrap">
                            {new Date(chat.timestamp * 1000).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 font-bold text-sm leading-relaxed">
                        {chat.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="text-[10px] text-slate-400 font-bold italic border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                基于动态文字抓取与语气预测算法综合生成
              </div>
            </div>
          </motion.div>
        )}

        {/* 游戏生涯/游玩轨迹 (New!) */}
        {data.playedGames && data.playedGames.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 mb-8 border border-white/50 dark:border-slate-800/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl group-hover:scale-110 transition-transform">🎮</div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-3 h-8 bg-emerald-500 rounded-full"></span>
              次元游玩轨迹 (Gaming History)
            </h3>
            <div className="flex flex-wrap gap-4">
              {data.playedGames.map((game, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-6 py-3 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex items-center gap-2"
                >
                  <span className="text-xl">🕹️</span>
                  {game}
                </motion.div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-6 italic">* 自动从历史投稿标题、视频分区及勋章信息中提取出的游玩印记</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* 个人深度评价总结 */}
            {data.evaluation && (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] shadow-lg p-8 border border-white/50 dark:border-slate-800/50">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                      <span className="text-5xl text-white">
                        {data.evaluation.type === 'creator' ? '🎨' : 
                         data.evaluation.type === 'explorer' ? '🧭' : 
                         data.evaluation.type === 'collector' ? '💎' : '🔭'}
                      </span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-3">
                        {data.evaluation.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-lg font-medium leading-relaxed italic">
                        “ {data.evaluation.content} ”
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                    {data.evaluation.stats.map((s, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <div className="text-slate-400 dark:text-slate-500 text-xs font-bold mb-1">{s.label}</div>
                        <div className="text-xl font-black text-slate-800 dark:text-slate-100">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 动态氛围感看板 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] shadow-lg p-6 border border-white/50 dark:border-slate-800/50">
                    <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <span className="text-pink-500">🔥</span> 近期能量波动
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">活跃等级</span>
                        <span className={`font-bold ${
                          data.energyStatus === 'CRITICAL' ? 'text-red-500' : 
                          data.energyStatus === 'HIGH' ? 'text-pink-500' : 'text-blue-500'
                        }`}>{data.energyStatus || 'STABLE'}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${data.energyLevel || 50}%` }}
                          className={`h-full bg-gradient-to-r ${
                            data.energyStatus === 'CRITICAL' ? 'from-red-500 to-orange-500' : 
                            'from-pink-500 to-purple-500'
                          } animate-pulse`}
                        ></motion.div>
                      </div>
                      <p className="text-xs text-slate-400">基于近30天内的互动、评论、投稿行为综合计算</p>
                    </div>
                  </div>
                  <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-lg p-6 border border-white/50 dark:border-slate-800/50">
                    <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <span className="text-blue-500">⚡</span> B站深度指数
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-blue-500">{data.syncRate || '98.5'}</div>
                      <div className="text-sm text-slate-500 leading-tight">
                        你的账号与 B 站多元文化的<br/>契合程度评价
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-lg p-6 border border-white/50 dark:border-slate-800/50">
                    <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <span className="text-amber-500">🍃</span> 情感基调
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-amber-500">{data.sentiment || '平静'}</div>
                      <div className="text-sm text-slate-500 leading-tight">
                        基于近期动态文本深度解析<br/>映射出的内心世界频率
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 战力雷达图 */}
            <motion.div variants={itemVariants} className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] shadow-lg p-8 border border-white/50 dark:border-slate-800/50">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-3">
                <span className="w-3 h-8 bg-purple-500 rounded-full"></span>
                六维行为能力画像
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="85%" data={data.power}>
                    <PolarGrid stroke={isDark ? "#334155" : "#e5e7eb"} strokeDasharray="4 4" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: isDark ? '#94a3b8' : '#4b5563', fontSize: 16, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="战力分布"
                      dataKey="value"
                      stroke="#fb7299"
                      strokeWidth={4}
                      fill="#fb7299"
                      fillOpacity={0.5}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '1rem', 
                        border: 'none', 
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#f1f5f9' : '#1e293b',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* 分区分布 */}
            <motion.div variants={itemVariants} className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] shadow-lg p-8 border border-white/50 dark:border-slate-800/50">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-3">
                <span className="w-3 h-8 bg-[#00aeec] rounded-full"></span>
                时空足迹 (投稿分区)
              </h3>
              {data.videoAnalysis && data.videoAnalysis.length > 0 ? (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.videoAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#f3f4f6"} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#6b7280', fontSize: 14, fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#64748b' : '#9ca3af', fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: isDark ? '#334155' : '#f9fafb'}} 
                        contentStyle={{ 
                          borderRadius: '1rem', 
                          border: 'none', 
                          backgroundColor: isDark ? '#1e293b' : '#ffffff',
                          color: isDark ? '#f1f5f9' : '#1e293b',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                        }}
                      />
                      <Bar dataKey="count" fill="url(#colorPink)" radius={[10, 10, 0, 0]} barSize={50} />
                      <defs>
                        <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fb7299" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#ffb37e" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[250px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border-4 border-dashed border-slate-100 dark:border-slate-800 italic px-10">
                  <div className="text-6xl mb-4 opacity-50">_(:з」∠)_</div>
                  <p className="text-lg font-bold">此处空空如也，TA可能更喜欢观测世界</p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-8">
             {/* 关注倾向卡片 */}
             <motion.div variants={itemVariants} className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] shadow-lg p-8 border border-white/50 dark:border-slate-800/50 h-fit">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8">社交波长</h3>
              {data.followingAnalysis && data.followingAnalysis.length > 0 ? (
                <div className="space-y-6">
                  {data.followingAnalysis.slice(0, 8).map((item, idx) => (
                    <div key={idx} className="group">
                      <div className="flex justify-between text-base mb-2">
                        <span className="text-slate-700 dark:text-slate-300 font-bold group-hover:text-[#fb7299] transition-colors">{item.name}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-mono font-bold">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (item.count / (data.user.following || 1)) * 100)}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-400 to-[#00aeec] rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 dark:text-slate-500 italic bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border-4 border-dashed border-slate-100 dark:border-slate-800">
                   <div className="text-5xl mb-4">🤫</div>
                   <p className="font-bold text-slate-500">隐私守护中...<br/>无法解析社交信号</p>
                </div>
              )}
            </motion.div>

            {/* 社交人脉雷达 (New!) */}
            {data.user.mentions && data.user.mentions.length > 0 && (
              <motion.div variants={itemVariants} className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] shadow-lg p-8 border border-white/50 dark:border-slate-800/50">
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6">社交人脉雷达</h3>
                <div className="flex flex-wrap gap-4">
                  {data.user.mentions.map((mention, i) => (
                    <a 
                      key={i} 
                      href={`https://space.bilibili.com/${mention.mid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:text-blue-500 transition-colors flex items-center gap-2"
                    >
                      <span className="text-blue-400">@</span>
                      {mention.name}
                    </a>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4 italic">* 提取自最近发布的动态，展示你频繁互动的小圈子</p>
              </motion.div>
            )}

            {/* 标签卡片 */}
            <motion.div variants={itemVariants} className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] shadow-lg p-8 border border-white/50 dark:border-slate-800/50">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6">属性标签</h3>
              <div className="flex flex-wrap gap-3">
                {data.tags && data.tags.length > 0 ? data.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.1, rotate: [-1, 1, -1] }}
                    className="px-5 py-2 bg-gradient-to-br from-pink-50 to-white dark:from-slate-800 dark:to-slate-900 text-[#fb7299] dark:text-pink-400 rounded-2xl text-base font-black border border-pink-100 dark:border-pink-900/30 shadow-sm"
                  >
                    #{tag}
                  </motion.span>
                )) : (
                  <span className="text-slate-400 dark:text-slate-500 font-bold italic">暂无明确标签...</span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ResultPage
