import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { logger } from '../config/logger'

const router = Router()

router.use(authenticate)

/**
 * GET /api/v1/applications
 * Get all applications available to the user
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userGroups = req.user?.groups || []
    
    // This would query the database or Pomerium API for applications
    // Filter based on user's groups
    const applications = getApplicationsForGroups(userGroups)
    
    res.json({ applications })
  } catch (error: any) {
    logger.error('Error fetching applications:', error.message)
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

/**
 * GET /api/v1/applications/:id
 * Get a specific application
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    
    // This would fetch the application from the database
    const application = {
      id,
      name: 'Sample Application',
      description: 'Sample application description',
      url: 'https://app.pomerium.local',
      icon: '🚀',
      type: 'web'
    }
    
    res.json({ application })
  } catch (error: any) {
    logger.error('Error fetching application:', error.message)
    res.status(500).json({ error: 'Failed to fetch application' })
  }
})

/**
 * Helper function to get applications based on user groups
 */
function getApplicationsForGroups(groups: string[]) {
  const allApplications = [
    {
      id: 'tsplus-sap',
      name: 'SAP Remote Access',
      description: 'Access SAP applications via TSplus',
      url: 'https://tsplus.pomerium.local',
      icon: '🖥️',
      type: 'remote-desktop',
      requiredGroups: ['sap-users', 'admin']
    },
    {
      id: 'app1',
      name: 'Application 1',
      description: 'Sample web application',
      url: 'https://app1.pomerium.local',
      icon: '📱',
      type: 'web',
      requiredGroups: ['app1-users', 'admin']
    },
    {
      id: 'admin-portal',
      name: 'Admin Portal',
      description: 'Administrative tools and dashboards',
      url: 'https://admin.pomerium.local',
      icon: '⚙️',
      type: 'web',
      requiredGroups: ['admin']
    }
  ]

  // Filter applications based on user's groups
  return allApplications.filter(app =>
    app.requiredGroups.some(reqGroup => groups.includes(reqGroup))
  )
}

export default router
