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
      id: 'app1',
      name: 'Echo Server',
      description: 'HTTP echo server for testing',
      url: 'https://app1.pomerium.local',
      icon: '📡',
      type: 'web',
      requiredGroups: ['app1-users', 'admin'],
      category: 'Testing'
    },
    {
      id: 'app2',
      name: 'Static Site',
      description: 'Nginx static web application',
      url: 'https://app2.pomerium.local',
      icon: '🌐',
      type: 'web',
      requiredGroups: ['app2-users', 'admin'],
      category: 'Web Apps'
    },
    {
      id: 'whoami',
      name: 'Identity Checker',
      description: 'Check your identity and headers',
      url: 'https://whoami.pomerium.local',
      icon: '🔍',
      type: 'web',
      requiredGroups: ['pomerium-users', 'admin'],
      category: 'Testing'
    },
    {
      id: 'filebrowser',
      name: 'File Browser',
      description: 'Browse and manage files',
      url: 'https://files.pomerium.local',
      icon: '📁',
      type: 'web',
      requiredGroups: ['admin'],
      category: 'Tools'
    },
    {
      id: 'code-server',
      name: 'VS Code',
      description: 'Web-based code editor',
      url: 'https://code.pomerium.local',
      icon: '💻',
      type: 'web',
      requiredGroups: ['developers', 'admin'],
      category: 'Development'
    },
    {
      id: 'grafana',
      name: 'Grafana',
      description: 'Metrics and dashboards',
      url: 'https://grafana.pomerium.local',
      icon: '📊',
      type: 'web',
      requiredGroups: ['monitoring', 'admin'],
      category: 'Monitoring'
    },
    {
      id: 'portainer',
      name: 'Portainer',
      description: 'Container management interface',
      url: 'https://portainer.pomerium.local',
      icon: '🐳',
      type: 'web',
      requiredGroups: ['admin'],
      category: 'Infrastructure'
    },
    {
      id: 'uptime-kuma',
      name: 'Uptime Kuma',
      description: 'Uptime monitoring',
      url: 'https://uptime.pomerium.local',
      icon: '📈',
      type: 'web',
      requiredGroups: ['monitoring', 'admin'],
      category: 'Monitoring'
    },
    {
      id: 'wekan',
      name: 'Wekan',
      description: 'Kanban project management',
      url: 'https://wekan.pomerium.local',
      icon: '📋',
      type: 'web',
      requiredGroups: ['project-managers', 'admin'],
      category: 'Collaboration'
    },
    {
      id: 'drawio',
      name: 'Draw.io',
      description: 'Diagram and flowchart editor',
      url: 'https://drawio.pomerium.local',
      icon: '✏️',
      type: 'web',
      requiredGroups: ['pomerium-users', 'admin'],
      category: 'Tools'
    },
    {
      id: 'admin-portal',
      name: 'Admin Portal',
      description: 'Administrative tools and dashboards',
      url: 'https://admin.pomerium.local',
      icon: '⚙️',
      type: 'web',
      requiredGroups: ['admin'],
      category: 'Administration'
    }
  ]

  // Filter applications based on user's groups
  return allApplications.filter(app =>
    app.requiredGroups.some(reqGroup => groups.includes(reqGroup))
  )
}

export default router
