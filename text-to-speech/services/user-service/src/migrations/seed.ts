import pool from '../config/database';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seed() {
  try {
    // Seed pricing plans
    await pool.query(`
      INSERT INTO pricing_plans (name, price, credits, quality, validity_days, is_active)
      VALUES
        ('Free', 0, 250, 'standard', 30, true),
        ('Spark Plan', 100, 26000, 'high', 30, true),
        ('Ignite Plan', 499, 150000, 'premium', 30, true),
        ('Blaze Plan', 999, 400000, 'ultra', 30, true)
      ON CONFLICT DO NOTHING;
    `);

    // Seed test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUsers = [
      {
        email: 'admin@test.com',
        password: hashedPassword,
        name: 'Admin User',
        auth_provider: 'email',
      },
      {
        email: 'user1@test.com',
        password: hashedPassword,
        name: 'Test User 1',
        auth_provider: 'email',
      },
      {
        email: 'user2@test.com',
        password: hashedPassword,
        name: 'Test User 2',
        auth_provider: 'email',
      },
    ];

    for (const user of testUsers) {
      const userResult = await pool.query(
        `INSERT INTO users (email, password, name, auth_provider, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [user.email, user.password, user.name, user.auth_provider]
      );

      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id;
        const planId = user.email === 'admin@test.com' ? 4 : 1;

        await pool.query(
          `INSERT INTO user_profiles (user_id, email, name, credits, plan_id, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (user_id) DO NOTHING`,
          [userId, user.email, user.name, planId === 4 ? 400000 : 250, planId]
        );
      }
    }

    // Seed admin settings
    await pool.query(`
      INSERT INTO admin_settings (key, value)
      VALUES
        ('site_name', 'Text-to-Speech Platform'),
        ('max_text_length', '5000'),
        ('default_credits', '250'),
        ('credit_cost_per_character', '1')
      ON CONFLICT (key) DO NOTHING;
    `);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();

