import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import analyzeRouter from './routes/analyze.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api', analyzeRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Bilibili Analyzer API is running on Vercel' 
  })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    message: err.message || '啊哦，探测器好像短路了...'
  })
})

// Export for Vercel Serverless
export default app
