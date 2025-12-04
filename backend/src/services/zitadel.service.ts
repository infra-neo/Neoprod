import axios, { AxiosInstance } from 'axios'
import { logger } from '../config/logger'

export interface ZitadelUser {
  id: string
  state: string
  userName: string
  loginNames: string[]
  preferredLoginName: string
  human?: {
    firstName: string
    lastName: string
    email: string
    emailVerified: boolean
  }
}

export interface ZitadelGroup {
  id: string
  name: string
  members: string[]
}

export class ZitadelService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${process.env.ZITADEL_DOMAIN}/management/v1`,
      headers: {
        'Authorization': `Bearer ${process.env.ZITADEL_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<ZitadelUser> {
    try {
      const response = await this.client.get(`/users/${userId}`)
      return response.data.user
    } catch (error: any) {
      logger.error(`Error getting user ${userId}:`, error.message)
      throw error
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<ZitadelUser | null> {
    try {
      const response = await this.client.post('/users/_search', {
        queries: [{
          emailQuery: {
            emailAddress: email
          }
        }]
      })
      
      if (response.data.result && response.data.result.length > 0) {
        return response.data.result[0]
      }
      return null
    } catch (error: any) {
      logger.error(`Error getting user by email ${email}:`, error.message)
      throw error
    }
  }

  /**
   * Get all users in a project
   */
  async getUsers(): Promise<ZitadelUser[]> {
    try {
      const response = await this.client.post('/users/_search', {})
      return response.data.result || []
    } catch (error: any) {
      logger.error('Error getting users:', error.message)
      throw error
    }
  }

  /**
   * Get user's groups
   */
  async getUserGroups(userId: string): Promise<string[]> {
    try {
      const response = await this.client.get(`/users/${userId}/memberships`)
      return response.data.result?.map((m: any) => m.groupId) || []
    } catch (error: any) {
      logger.error(`Error getting groups for user ${userId}:`, error.message)
      throw error
    }
  }

  /**
   * Validate OIDC token
   */
  async validateToken(token: string): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.ZITADEL_DOMAIN}/oauth/v2/introspect`,
        new URLSearchParams({
          token,
          client_id: process.env.ZITADEL_CLIENT_ID!,
          client_secret: process.env.ZITADEL_CLIENT_SECRET!
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      return response.data
    } catch (error: any) {
      logger.error('Error validating token:', error.message)
      throw error
    }
  }

  /**
   * Get user info from OIDC userinfo endpoint
   */
  async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(
        `${process.env.ZITADEL_DOMAIN}/oidc/v1/userinfo`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
      return response.data
    } catch (error: any) {
      logger.error('Error getting user info:', error.message)
      throw error
    }
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string, redirectUri: string): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.ZITADEL_DOMAIN}/oauth/v2/token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: process.env.ZITADEL_CLIENT_ID!,
          client_secret: process.env.ZITADEL_CLIENT_SECRET!
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      return response.data
    } catch (error: any) {
      logger.error('Error exchanging code for tokens:', error.message)
      throw error
    }
  }
}

export default new ZitadelService()
