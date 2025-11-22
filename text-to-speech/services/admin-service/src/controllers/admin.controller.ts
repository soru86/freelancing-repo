import { Request, Response } from 'express';
import pool from '../config/database';

export const getStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalConversions,
      totalCreditsUsed,
      activePlans,
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM tts_conversions'),
      pool.query('SELECT SUM(credits_used) as total FROM tts_conversions'),
      pool.query('SELECT COUNT(*) as count FROM pricing_plans WHERE is_active = true'),
    ]);

    // Get conversions by date (last 30 days)
    const conversionsByDate = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM tts_conversions
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalConversions: parseInt(totalConversions.rows[0].count),
      totalCreditsUsed: parseInt(totalCreditsUsed.rows[0].total || '0'),
      activePlans: parseInt(activePlans.rows[0].count),
      conversionsByDate: conversionsByDate.rows,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.auth_provider, u.created_at,
              up.credits, p.name as plan_name
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN pricing_plans p ON up.plan_id = p.id
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) as count FROM users');

    res.json({
      users: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPricingPlans = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pricing_plans ORDER BY price ASC'
    );
    res.json({ plans: result.rows });
  } catch (error) {
    console.error('Get pricing plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPricingPlan = async (req: Request, res: Response) => {
  try {
    const { name, price, credits, quality, validity_days, is_active } = req.body;

    const result = await pool.query(
      `INSERT INTO pricing_plans (name, price, credits, quality, validity_days, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [name, price, credits, quality, validity_days || 30, is_active !== undefined ? is_active : true]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create pricing plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePricingPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, credits, quality, validity_days, is_active } = req.body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (credits !== undefined) {
      updates.push(`credits = $${paramIndex++}`);
      values.push(credits);
    }
    if (quality !== undefined) {
      updates.push(`quality = $${paramIndex++}`);
      values.push(quality);
    }
    if (validity_days !== undefined) {
      updates.push(`validity_days = $${paramIndex++}`);
      values.push(validity_days);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE pricing_plans SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update pricing plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePricingPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM pricing_plans WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    res.json({ message: 'Pricing plan deleted successfully' });
  } catch (error) {
    console.error('Delete pricing plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM admin_settings ORDER BY key');
    res.json({ settings: result.rows });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const result = await pool.query(
      `INSERT INTO admin_settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
       RETURNING *`,
      [key, value]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT tc.*, u.email, u.name as user_name
       FROM tts_conversions tc
       JOIN users u ON tc.user_id = u.id
       ORDER BY tc.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) as count FROM tts_conversions');

    res.json({
      conversions: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      },
    });
  } catch (error) {
    console.error('Get conversions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const [
      userInfo,
      conversions,
      creditsUsed,
    ] = await Promise.all([
      pool.query(
        `SELECT u.*, up.credits, p.name as plan_name
         FROM users u
         LEFT JOIN user_profiles up ON u.id = up.user_id
         LEFT JOIN pricing_plans p ON up.plan_id = p.id
         WHERE u.id = $1`,
        [userId]
      ),
      pool.query(
        'SELECT COUNT(*) as count FROM tts_conversions WHERE user_id = $1',
        [userId]
      ),
      pool.query(
        'SELECT SUM(credits_used) as total FROM tts_conversions WHERE user_id = $1',
        [userId]
      ),
    ]);

    if (userInfo.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: userInfo.rows[0],
      totalConversions: parseInt(conversions.rows[0].count),
      totalCreditsUsed: parseInt(creditsUsed.rows[0].total || '0'),
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

