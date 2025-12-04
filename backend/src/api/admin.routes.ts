import { Router, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import netbirdService from '../services/netbird.service'
import zitadelService from '../services/zitadel.service'
import { logger } from '../config/logger'

const router = Router()

// All admin routes require authentication and admin role
router.use(authenticate)
router.use(authorize(['admin']))

/**
 * GET /api/v1/admin/users
 * Get all users
 */
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const users = await zitadelService.getUsers()
    res.json({ users })
  } catch (error: any) {
    logger.error('Error fetching users:', error.message)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

/**
 * GET /api/v1/admin/network/status
 * Get network status overview
 */
router.get('/network/status', async (req: AuthRequest, res: Response) => {
  try {
    const peers = await netbirdService.getPeers()
    const groups = await netbirdService.getGroups()
    
    const connectedPeers = peers.filter(p => p.connected).length
    
    res.json({
      totalPeers: peers.length,
      connectedPeers,
      disconnectedPeers: peers.length - connectedPeers,
      totalGroups: groups.length,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    logger.error('Error fetching network status:', error.message)
    res.status(500).json({ error: 'Failed to fetch network status' })
  }
})

/**
 * POST /api/v1/admin/groups
 * Create a new group
 */
router.post('/groups', async (req: AuthRequest, res: Response) => {
  try {
    const { name, peers } = req.body
    
    if (!name) {
      return res.status(400).json({ error: 'Group name is required' })
    }
    
    const group = await netbirdService.createGroup(name, peers || [])
    
    logger.info(`Group created by ${req.user?.email}: ${name}`)
    
    res.json({ group })
  } catch (error: any) {
    logger.error('Error creating group:', error.message)
    res.status(500).json({ error: 'Failed to create group' })
  }
})

/**
 * GET /api/v1/admin/logs
 * Get system logs (recent activity)
 */
router.get('/logs', async (req: AuthRequest, res: Response) => {
  try {
    // This would fetch recent logs from the logging system
    // For now, return a mock response
    res.json({
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'User logged in',
          user: 'admin@example.com'
        }
      ]
    })
  } catch (error: any) {
    logger.error('Error fetching logs:', error.message)
    res.status(500).json({ error: 'Failed to fetch logs' })
  }
})

export default router
