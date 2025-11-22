import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import pool from './database';

// Google OAuth - only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;

          if (!email) {
            return done(new Error('No email found'), undefined);
          }

          // Check if user exists
          let result = await pool.query(
            'SELECT id, email, name FROM users WHERE email = $1',
            [email]
          );

          let user;
          if (result.rows.length === 0) {
            // Create new user
            result = await pool.query(
              `INSERT INTO users (email, name, auth_provider, provider_id, created_at)
               VALUES ($1, $2, $3, $4, NOW())
               RETURNING id, email, name`,
              [email, name, 'google', profile.id]
            );
            user = result.rows[0];
          } else {
            user = result.rows[0];
          }

          return done(null, user);
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
} else {
  console.log('Google OAuth not configured - skipping Google OAuth strategy');
}

// GitHub OAuth - only initialize if credentials are provided
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
          const name = profile.displayName || profile.username;

          // Check if user exists
          let result = await pool.query(
            'SELECT id, email, name FROM users WHERE email = $1 OR provider_id = $2',
            [email, profile.id.toString()]
          );

          let user;
          if (result.rows.length === 0) {
            // Create new user
            result = await pool.query(
              `INSERT INTO users (email, name, auth_provider, provider_id, created_at)
               VALUES ($1, $2, $3, $4, NOW())
               RETURNING id, email, name`,
              [email, name, 'github', profile.id.toString()]
            );
            user = result.rows[0];
          } else {
            user = result.rows[0];
          }

          return done(null, user);
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
} else {
  console.log('GitHub OAuth not configured - skipping GitHub OAuth strategy');
}

// Facebook OAuth - only initialize if credentials are provided
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
          const name = profile.displayName || profile.name?.givenName || 'Facebook User';

          if (!email) {
            return done(new Error('No email found'), undefined);
          }

          // Check if user exists
          let result = await pool.query(
            'SELECT id, email, name FROM users WHERE email = $1 OR provider_id = $2',
            [email, profile.id.toString()]
          );

          let user;
          if (result.rows.length === 0) {
            // Create new user
            result = await pool.query(
              `INSERT INTO users (email, name, auth_provider, provider_id, created_at)
               VALUES ($1, $2, $3, $4, NOW())
               RETURNING id, email, name`,
              [email, name, 'facebook', profile.id.toString()]
            );
            user = result.rows[0];
          } else {
            user = result.rows[0];
          }

          return done(null, user);
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
} else {
  console.log('Facebook OAuth not configured - skipping Facebook OAuth strategy');
}

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    },
    async (payload, done) => {
      try {
        const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [
          payload.userId,
        ]);

        if (result.rows.length === 0) {
          return done(null, false);
        }

        return done(null, result.rows[0]);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;

