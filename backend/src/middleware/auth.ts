import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { AppError } from './errorHandler.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    user_type: string;
  };
}

export interface IRequest extends Request {
  user?: {
    id: string;
    email: string;
    user_type: string;
  };
}

export const authenticateToken = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new AppError(401, 'No token provided');
  }

  try {
    const user = jwt.verify(token, config.jwt.secret) as any;
    req.user = user;
    next();
  } catch (err) {
    throw new AppError(403, 'Invalid or expired token');
  }
};

// Optional auth (doesn't require token but will populate if present)
export const optionalAuth = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const user = jwt.verify(token, config.jwt.secret) as any;
      req.user = user;
    } catch (err) {
      // Token invalid, but we don't throw since it's optional
    }
  }

  next();
};
