import { Request, Response } from 'express';
import pool from '../config/database';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { userId, email, name } = req.body;

    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, email, name, credits, plan_id, created_at)
       VALUES ($1, $2, $3, 250, 1, NOW())
       RETURNING *`,
      [userId, email, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authUserId = (req as any).user.userId;

    if (userId !== authUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await pool.query(
      `SELECT up.*, p.name as plan_name, p.credits as plan_credits
       FROM user_profiles up
       LEFT JOIN pricing_plans p ON up.plan_id = p.id
       WHERE up.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authUserId = (req as any).user.userId;
    const { name } = req.body;

    if (userId !== authUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await pool.query(
      'UPDATE user_profiles SET name = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
      [name, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authUserId = (req as any).user.userId;

    if (userId !== authUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await pool.query(
      'SELECT credits FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ credits: result.rows[0].credits });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserCredits = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authUserId = (req as any).user.userId;
    const { credits } = req.body;

    if (userId !== authUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await pool.query(
      'UPDATE user_profiles SET credits = credits + $1, updated_at = NOW() WHERE user_id = $2 RETURNING credits',
      [credits, userId]
    );

    res.json({ credits: result.rows[0].credits });
  } catch (error) {
    console.error('Update credits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authUserId = (req as any).user.userId;

    if (userId !== authUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await pool.query(
      `SELECT * FROM tts_conversions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

