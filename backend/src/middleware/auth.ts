import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ApiError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    groups: string[]
    roles: string[]
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided')
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      groups: decoded.groups || [],
      roles: decoded.roles || []
    }

    next()
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'))
  }
}

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'))
    }

    const hasRole = req.user.roles.some(role => allowedRoles.includes(role))
    if (!hasRole) {
      return next(new ApiError(403, 'Insufficient permissions'))
    }

    next()
  }
}
