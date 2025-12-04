import { Router, Request, Response } from 'express'
import { authRateLimiter } from '../middleware/rateLimiter'
import zitadelService from '../services/zitadel.service'
import { logger } from '../config/logger'
import jwt from 'jsonwebtoken'

const router = Router()

/**
 * POST /api/v1/auth/callback
 * Handle OAuth callback from Zitadel
 */
router.post('/callback', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { code, redirect_uri } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' })
    }

    // Exchange code for tokens
    const tokens = await zitadelService.exchangeCodeForTokens(
      code,
      redirect_uri || `${process.env.CORS_ORIGIN}/auth/callback`
    )

    // Get user info
    const userInfo = await zitadelService.getUserInfo(tokens.access_token)

    // Create internal JWT
    const internalToken = jwt.sign(
      {
        sub: userInfo.sub,
        email: userInfo.email,
        groups: userInfo.groups || [],
        roles: userInfo.roles || [],
        name: userInfo.name
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    )

    logger.info(`User authenticated: ${userInfo.email}`)

    res.json({
      token: internalToken,
      user: {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        groups: userInfo.groups || [],
        roles: userInfo.roles || []
      }
    })
  } catch (error: any) {
    logger.error('Authentication error:', error.message)
    res.status(500).json({ error: 'Authentication failed' })
  }
})

/**
 * POST /api/v1/auth/validate
 * Validate a token
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Token required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    res.json({
      valid: true,
      user: {
        id: decoded.sub,
        email: decoded.email,
        groups: decoded.groups,
        roles: decoded.roles
      }
    })
  } catch (error) {
    res.json({ valid: false })
  }
})

/**
 * GET /api/v1/auth/config
 * Get authentication configuration for frontend
 */
router.get('/config', (req: Request, res: Response) => {
  res.json({
    zitadelDomain: process.env.ZITADEL_DOMAIN,
    clientId: process.env.ZITADEL_CLIENT_ID,
    redirectUri: `${process.env.CORS_ORIGIN}/auth/callback`,
    scopes: ['openid', 'profile', 'email', 'groups']
  })
})

export default router
