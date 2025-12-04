import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import netbirdService from '../services/netbird.service'
import { logger } from '../config/logger'

const router = Router()

// All Netbird routes require authentication
router.use(authenticate)

/**
 * GET /api/v1/netbird/peers
 * Get all peers in the Netbird network
 */
router.get('/peers', async (req: AuthRequest, res: Response) => {
  try {
    const peers = await netbirdService.getPeers()
    res.json({ peers })
  } catch (error: any) {
    logger.error('Error fetching peers:', error.message)
    res.status(500).json({ error: 'Failed to fetch peers' })
  }
})

/**
 * GET /api/v1/netbird/peers/:peerId
 * Get a specific peer
 */
router.get('/peers/:peerId', async (req: AuthRequest, res: Response) => {
  try {
    const { peerId } = req.params
    const peer = await netbirdService.getPeer(peerId)
    res.json({ peer })
  } catch (error: any) {
    logger.error('Error fetching peer:', error.message)
    res.status(500).json({ error: 'Failed to fetch peer' })
  }
})

/**
 * POST /api/v1/netbird/setup-keys
 * Create a new setup key for device enrollment
 */
router.post('/setup-keys', async (req: AuthRequest, res: Response) => {
  try {
    const { name, autoGroups, expiresInDays, usageLimit } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Setup key name is required' })
    }

    const setupKey = await netbirdService.createSetupKey(
      name,
      autoGroups || [],
      expiresInDays || 30,
      usageLimit || 1
    )

    logger.info(`Setup key created by ${req.user?.email}: ${name}`)
    
    res.json({ setupKey })
  } catch (error: any) {
    logger.error('Error creating setup key:', error.message)
    res.status(500).json({ error: 'Failed to create setup key' })
  }
})

/**
 * DELETE /api/v1/netbird/peers/:peerId
 * Remove a peer from the network
 */
router.delete('/peers/:peerId', async (req: AuthRequest, res: Response) => {
  try {
    const { peerId } = req.params
    await netbirdService.deletePeer(peerId)
    
    logger.info(`Peer deleted by ${req.user?.email}: ${peerId}`)
    
    res.json({ message: 'Peer deleted successfully' })
  } catch (error: any) {
    logger.error('Error deleting peer:', error.message)
    res.status(500).json({ error: 'Failed to delete peer' })
  }
})

/**
 * GET /api/v1/netbird/groups
 * Get all groups
 */
router.get('/groups', async (req: AuthRequest, res: Response) => {
  try {
    const groups = await netbirdService.getGroups()
    res.json({ groups })
  } catch (error: any) {
    logger.error('Error fetching groups:', error.message)
    res.status(500).json({ error: 'Failed to fetch groups' })
  }
})

/**
 * GET /api/v1/netbird/acls
 * Get network ACL rules
 */
router.get('/acls', async (req: AuthRequest, res: Response) => {
  try {
    const acls = await netbirdService.getACLRules()
    res.json({ acls })
  } catch (error: any) {
    logger.error('Error fetching ACLs:', error.message)
    res.status(500).json({ error: 'Failed to fetch ACLs' })
  }
})

export default router
