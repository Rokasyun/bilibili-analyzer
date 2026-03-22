import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DynamicBackground from '../components/DynamicBackground'

function SearchPage() {
  const [uid, setUid] = useState('')
  const [loading, setLoading] = useState(false)
  const [fortune, setFortune] = useState<{ text: string, level: string, icon: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // 生成基于日期的运势
    const fortunes = [
      { text: '宜：三连、投币、点赞', level: '大吉', icon: '🌟' },
      { text: '宜：催更、潜水、补番', level: '中吉', icon: '🍃' },
      { text: '宜：考古、发弹幕、买周边', level: '小吉', icon: '🍪' },
      { text: '忌：长文评论、深夜网抑云', level: '末吉', icon: '⚓' },
      { text: '宜：干杯、抽卡、看直播', level: '中吉', icon: '🍻' }
    ]
    const day = new Date().getDate()
    setFortune(fortunes[day % fortunes.length])
  }, [])

  // 从本地存储获取搜索历史
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('search_history')
    return saved ? JSON.parse(saved) : []
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uid.trim()) return

    setLoading(true)
    
    // 保存到历史记录
    const newHistory = [uid.trim(), ...history.filter(h => h !== uid.trim())].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem('search_history', JSON.stringify(newHistory))

    navigate(`/result/${uid.trim()}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 font-sans relative overflow-hidden transition-colors duration-300">
      <DynamicBackground />
      
      {/* 顶部装饰条 */}
      <motion.div 
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#fb7299] via-blue-400 to-[#fb7299] bg-[length:200%_auto] animate-gradient-x"
      ></motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-block mb-6 p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-lg border border-white/50 dark:border-slate-800/50 cursor-pointer"
          >
            <svg width="72" height="72" viewBox="0 0 1024 1024" className="text-[#fb7299] fill-current">
              <path d="M777.1 123.3c19.4 0 35.1 15.7 35.1 35.1v108.6h85.3c35.1 0 63.5 28.5 63.5 63.5v447.4c0 35-28.4 63.5-63.5 63.5H126.5c-35.1 0-63.5-28.5-63.5-63.5V330.5c0-35 28.4-63.5 63.5-63.5h85.3V158.4c0-19.4 15.7-35.1 35.1-35.1s35.1 15.7 35.1 35.1v108.6h460V158.4c0-19.4 15.8-35.1 35.1-35.1z m85.3 268.4H161.6v404.9h700.8V391.7z m-538.5 73.1c31.1 0 56.4 25.3 56.4 56.4v30.5c0 31.1-25.3 56.4-56.4 56.4s-56.4-25.3-56.4-56.4v-30.5c0-31.1 25.3-56.4 56.4-56.4z m376.5 0c31.1 0 56.4 25.3 56.4 56.4v30.5c0 31.1-25.3 56.4-56.4 56.4s-56.4-25.3-56.4-56.4v-30.5c0-31.1 25.3-56.4 56.4-56.4z"></path>
            </svg>
          </motion.div>
          <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#fb7299] via-purple-500 to-[#00aeec] drop-shadow-lg tracking-tight">
            bilibili 次元成分探测站
          </h1>
          <p className="text-slate-500 dark:text-slate-200 text-xl font-bold italic opacity-90">哔哩哔哩 (゜-゜)つロ 干杯~</p>
        </div>

        {/* 今日运势 (New!) */}
        {fortune && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/30 dark:border-slate-800/30 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{fortune.icon}</span>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Fortune</div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{fortune.text}</div>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#fb7299] text-white text-xs font-black rounded-lg shadow-md transform rotate-3">
              {fortune.level}
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSearch} className="relative group mb-8">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative"
          >
            <input
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="输入 B 站 UID (例如: 546195)"
              className="w-full px-8 py-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-2 border-transparent rounded-2xl shadow-2xl text-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#fb7299] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !uid.trim()}
              className="absolute right-2.5 top-2.5 bottom-2.5 px-10 bg-[#fb7299] text-white font-bold rounded-xl hover:bg-[#ff85a7] active:scale-95 transition-all shadow-md disabled:bg-slate-300 dark:disabled:bg-slate-800 overflow-hidden"
            >
              <span className="relative z-10">{loading ? '探测中...' : '启动'}</span>
              {loading && (
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
              )}
            </button>
          </motion.div>
        </form>

        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm"
          >
            <h4 className="text-[#fb7299] font-bold text-sm mb-2 flex items-center gap-1">
              <span>💡</span> 如何获取 UID
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">主页 URL 结尾的数字，或 App 个人中心直接点击 ID 复制。</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col"
          >
            <h4 className="text-blue-500 dark:text-blue-400 font-bold text-sm mb-2 flex items-center gap-1">
              <span>🕒</span> 最近探查
            </h4>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-12">
              <AnimatePresence>
                {history.length > 0 ? history.map((h, index) => (
                  <motion.button 
                    key={h}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/result/${h}`)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#fb7299] hover:text-white dark:hover:bg-[#fb7299] rounded-lg text-[11px] text-slate-600 dark:text-slate-400 transition-colors border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {h}
                  </motion.button>
                )) : <p className="text-slate-400 dark:text-slate-600 text-[10px]">暂无记录</p>}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500 font-medium"
        >
          <p>© 2026 Bili Analyzer • 兴趣使然的探测站</p>
          <p className="mt-1">ヾ(≧▽≦*)o 愿你在这找到属于自己的二次元归属</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SearchPage
