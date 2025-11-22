import express from 'express';
import passport from '../config/passport';
import {
  register,
  login,
  refreshToken,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  facebookAuth,
  facebookCallback,
  logout,
  verifyToken,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Email-based authentication
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logout);
router.get('/verify', authenticateToken, verifyToken);

// OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ error: 'Google OAuth is not configured' });
  }
  return passport.authenticate('google', { session: false })(req, res, next);
}, googleCallback);
router.get('/github', githubAuth);
router.get('/github/callback', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.status(503).json({ error: 'GitHub OAuth is not configured' });
  }
  return passport.authenticate('github', { session: false })(req, res, next);
}, githubCallback);
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', (req, res, next) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return res.status(503).json({ error: 'Facebook OAuth is not configured' });
  }
  return passport.authenticate('facebook', { session: false })(req, res, next);
}, facebookCallback);

export default router;

