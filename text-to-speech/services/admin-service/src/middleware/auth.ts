import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@test.com';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEmail = (req as any).user.email;

    // Check if user is admin (by email or database flag)
    if (userEmail === ADMIN_EMAIL) {
      return next();
    }

    // You can also check a role field in the database
    const result = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND email = $2',
      [(req as any).user.userId, userEmail]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // For now, only allow admin email
    if (userEmail !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden' });
  }
};

