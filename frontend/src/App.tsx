import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import ResultPage from './pages/ResultPage'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { motion } from 'framer-motion'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-4 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 text-2xl"
      title={theme === 'light' ? '切换到夜间模式' : '切换到白天模式'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </motion.button>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/result/:uid" element={<ResultPage />} />
      </Routes>
      <ThemeToggle />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App
