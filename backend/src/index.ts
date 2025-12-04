import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { logger } from './config/logger'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

// Routes
import authRoutes from './api/auth.routes'
import netbirdRoutes from './api/netbird.routes'
import pomeriumRoutes from './api/pomerium.routes'
import enrollmentRoutes from './api/enrollment.routes'
import applicationsRoutes from './api/applications.routes'
import adminRoutes from './api/admin.routes'

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3001
const API_PREFIX = process.env.API_PREFIX || '/api/v1'

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(rateLimiter)

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
})

// API Routes
app.use(`${API_PREFIX}/auth`, authRoutes)
app.use(`${API_PREFIX}/netbird`, netbirdRoutes)
app.use(`${API_PREFIX}/pomerium`, pomeriumRoutes)
app.use(`${API_PREFIX}/enrollment`, enrollmentRoutes)
app.use(`${API_PREFIX}/applications`, applicationsRoutes)
app.use(`${API_PREFIX}/admin`, adminRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  })
})

// Error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Neogenesys Backend API running on port ${PORT}`)
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`)
  logger.info(`🌐 API prefix: ${API_PREFIX}`)
})

export default app
