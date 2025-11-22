import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import pool from '../config/database';
import redisClient from '../config/redis';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';

// Register with email
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const result = await pool.query(
      `INSERT INTO users (email, password, name, auth_provider, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, name, created_at`,
      [email, hashedPassword, name, 'email']
    );

    const user = result.rows[0];

    // Create user profile in user service
    try {
      await axios.post(`${USER_SERVICE_URL}/api/users`, {
        userId: user.id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error('Failed to create user profile:', error);
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in Redis
    await redisClient.setEx(`refresh:${user.id}`, 7 * 24 * 60 * 60, refreshToken);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login with email
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password, name FROM users WHERE email = $1 AND auth_provider = $2',
      [email, 'email']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in Redis
    await redisClient.setEx(`refresh:${user.id}`, 7 * 24 * 60 * 60, refreshToken);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };

    // Verify token exists in Redis
    const storedToken = await redisClient.get(`refresh:${decoded.userId}`);
    if (storedToken !== token) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Get user info
    const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [
      decoded.userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    await redisClient.del(`refresh:${userId}`);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify token
export const verifyToken = async (req: Request, res: Response) => {
  res.json({ valid: true, user: (req as any).user });
};

// Google OAuth
export const googleAuth = (req: Request, res: Response, next: any) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ error: 'Google OAuth is not configured' });
  }
  return passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await redisClient.setEx(`refresh:${user.id}`, 7 * 24 * 60 * 60, refreshToken);

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// GitHub OAuth
export const githubAuth = (req: Request, res: Response, next: any) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.status(503).json({ error: 'GitHub OAuth is not configured' });
  }
  return passport.authenticate('github', {
    scope: ['user:email'],
  })(req, res, next);
};

export const githubCallback = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await redisClient.setEx(`refresh:${user.id}`, 7 * 24 * 60 * 60, refreshToken);

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
  } catch (error) {
    console.error('GitHub callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Facebook OAuth
export const facebookAuth = (req: Request, res: Response, next: any) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return res.status(503).json({ error: 'Facebook OAuth is not configured' });
  }
  return passport.authenticate('facebook', {
    scope: ['email'],
  })(req, res, next);
};

export const facebookCallback = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await redisClient.setEx(`refresh:${user.id}`, 7 * 24 * 60 * 60, refreshToken);

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

