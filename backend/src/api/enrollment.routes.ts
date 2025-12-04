import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import netbirdService from '../services/netbird.service'
import { logger } from '../config/logger'
import crypto from 'crypto'

const router = Router()

router.use(authenticate)

/**
 * POST /api/v1/enrollment/device
 * Enroll a new device
 */
router.post('/device', async (req: AuthRequest, res: Response) => {
  try {
    const { deviceName, os } = req.body

    if (!deviceName) {
      return res.status(400).json({ error: 'Device name is required' })
    }

    // Create a unique setup key for this device
    const setupKey = await netbirdService.createSetupKey(
      `${deviceName}-${Date.now()}`,
      ['user-devices'], // Auto-assign to user devices group
      7, // Expires in 7 days
      1 // Single use
    )

    // Generate enrollment token (for tracking)
    const enrollmentToken = crypto.randomBytes(32).toString('hex')

    logger.info(`Device enrollment initiated by ${req.user?.email}: ${deviceName}`)

    res.json({
      enrollmentToken,
      setupKey: setupKey.key,
      installScript: generateInstallScript(setupKey.key, deviceName),
      expiresAt: setupKey.expires
    })
  } catch (error: any) {
    logger.error('Error enrolling device:', error.message)
    res.status(500).json({ error: 'Failed to enroll device' })
  }
})

/**
 * GET /api/v1/enrollment/status/:token
 * Check enrollment status
 */
router.get('/status/:token', async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params
    
    // This would check the enrollment status in the database
    // For now, return a mock response
    res.json({
      status: 'pending',
      message: 'Waiting for device to connect'
    })
  } catch (error: any) {
    logger.error('Error checking enrollment status:', error.message)
    res.status(500).json({ error: 'Failed to check enrollment status' })
  }
})

/**
 * Generate PowerShell installation script
 */
function generateInstallScript(setupKey: string, deviceName: string): string {
  return `
# Neogenesys Netbird Client Installation Script
# Device: ${deviceName}
# Generated: ${new Date().toISOString()}

# Download rebranded Netbird client
$clientUrl = "https://github.com/infra-neo/netbird-rebrand/releases/latest/download/neogenesys-client-installer.exe"
$installerPath = "$env:TEMP\\neogenesys-installer.exe"

Write-Host "Downloading Neogenesys Network Client..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $clientUrl -OutFile $installerPath

Write-Host "Installing client..." -ForegroundColor Cyan
Start-Process -FilePath $installerPath -ArgumentList "/S", "/setupkey=${setupKey}", "/name=${deviceName}" -Wait

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Your device is now enrolling in the Neogenesys network..." -ForegroundColor Cyan

# Clean up
Remove-Item $installerPath -Force

Write-Host "Done! The Neogenesys Network Client is now running." -ForegroundColor Green
`.trim()
}

export default router
