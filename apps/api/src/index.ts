import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'hovawart-api'
  })
})

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Hovawart API is running',
    version: '1.0.0'
  })
})

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Hovawart API running on port ${PORT}`)
})
