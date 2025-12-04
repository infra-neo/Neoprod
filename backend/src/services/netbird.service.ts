import axios, { AxiosInstance } from 'axios'
import { logger } from '../config/logger'

export interface NetbirdPeer {
  id: string
  name: string
  ip: string
  connected: boolean
  lastSeen: string
  os: string
  version: string
  groups: string[]
}

export interface NetbirdSetupKey {
  id: string
  key: string
  name: string
  expires: string
  autoGroups: string[]
  usageLimit: number
  usedTimes: number
}

export class NetbirdService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NETBIRD_API_URL,
      headers: {
        'Authorization': `Bearer ${process.env.NETBIRD_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Get all peers in the Netbird network
   */
  async getPeers(): Promise<NetbirdPeer[]> {
    try {
      const response = await this.client.get('/peers')
      logger.info('Retrieved Netbird peers')
      return response.data
    } catch (error: any) {
      logger.error('Error getting Netbird peers:', error.message)
      throw error
    }
  }

  /**
   * Get a specific peer by ID
   */
  async getPeer(peerId: string): Promise<NetbirdPeer> {
    try {
      const response = await this.client.get(`/peers/${peerId}`)
      return response.data
    } catch (error: any) {
      logger.error(`Error getting peer ${peerId}:`, error.message)
      throw error
    }
  }

  /**
   * Create a new setup key for device enrollment
   */
  async createSetupKey(
    name: string,
    autoGroups: string[] = [],
    expiresInDays: number = 30,
    usageLimit: number = 1
  ): Promise<NetbirdSetupKey> {
    try {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiresInDays)

      const response = await this.client.post('/setup-keys', {
        name,
        type: 'reusable',
        expires_in: expiresInDays * 24 * 60 * 60 * 1000, // Convert to milliseconds
        auto_groups: autoGroups,
        usage_limit: usageLimit
      })

      logger.info(`Created Netbird setup key: ${name}`)
      return response.data
    } catch (error: any) {
      logger.error('Error creating setup key:', error.message)
      throw error
    }
  }

  /**
   * Delete a peer from the network
   */
  async deletePeer(peerId: string): Promise<void> {
    try {
      await this.client.delete(`/peers/${peerId}`)
      logger.info(`Deleted peer: ${peerId}`)
    } catch (error: any) {
      logger.error(`Error deleting peer ${peerId}:`, error.message)
      throw error
    }
  }

  /**
   * Update peer groups
   */
  async updatePeerGroups(peerId: string, groups: string[]): Promise<NetbirdPeer> {
    try {
      const response = await this.client.put(`/peers/${peerId}`, {
        groups
      })
      logger.info(`Updated peer ${peerId} groups`)
      return response.data
    } catch (error: any) {
      logger.error(`Error updating peer ${peerId} groups:`, error.message)
      throw error
    }
  }

  /**
   * Get all groups
   */
  async getGroups(): Promise<any[]> {
    try {
      const response = await this.client.get('/groups')
      return response.data
    } catch (error: any) {
      logger.error('Error getting groups:', error.message)
      throw error
    }
  }

  /**
   * Create a new group
   */
  async createGroup(name: string, peers: string[] = []): Promise<any> {
    try {
      const response = await this.client.post('/groups', {
        name,
        peers
      })
      logger.info(`Created group: ${name}`)
      return response.data
    } catch (error: any) {
      logger.error('Error creating group:', error.message)
      throw error
    }
  }

  /**
   * Get network access control rules
   */
  async getACLRules(): Promise<any[]> {
    try {
      const response = await this.client.get('/acls')
      return response.data
    } catch (error: any) {
      logger.error('Error getting ACL rules:', error.message)
      throw error
    }
  }
}

export default new NetbirdService()
