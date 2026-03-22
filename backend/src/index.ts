import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import analyzeRouter from './routes/analyze.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // 允许没有origin的请求（如移动端、Postman等）
    if (!origin) return callback(null, true)
    
    // 允许本地开发环境的所有端口
    const isLocal = origin.startsWith('http://localhost:') || 
                    origin.startsWith('http://127.0.0.1:') || 
                    origin === 'http://localhost' || 
                    origin === 'http://127.0.0.1'
    
    // 允许局域网私有IP段
    const isPrivateIP = origin.startsWith('http://192.168.') || 
                        origin.startsWith('http://172.') || 
                        origin.startsWith('http://10.')

    if (isLocal || isPrivateIP) {
      callback(null, true)
    } else {
      console.log('Blocked Origin:', origin) // 记录被拦截的来源以便调试
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api', analyzeRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bilibili Analyzer API is running' })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    message: err.message || '啊哦，探测器好像短路了...'
  })
})

const MAX_PORT_ATTEMPTS = 10
const startServer = (port: number, attempt = 0) => {
  if (attempt >= MAX_PORT_ATTEMPTS) {
    console.error(`❌ Could not find an available port after ${MAX_PORT_ATTEMPTS} attempts.`)
    process.exit(1)
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server is running on:`)
    console.log(`   - Local:   http://localhost:${port}`)
    console.log(`   - Network: http://192.168.10.7:${port}`)
    console.log(`📊 CORS enabled for multiple origins (including LAN)`)
  })

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is busy, trying ${port + 1}...`)
      startServer(port + 1, attempt + 1)
    } else {
      console.error('Server error:', e)
    }
  })
}

startServer(Number(PORT))
