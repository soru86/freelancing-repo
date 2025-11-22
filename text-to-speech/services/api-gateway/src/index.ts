import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Service URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const TTS_SERVICE = process.env.TTS_SERVICE_URL || 'http://localhost:3003';
const ADMIN_SERVICE = process.env.ADMIN_SERVICE_URL || 'http://localhost:3004';

// Proxy routes
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/api/auth' },
  })
);

app.use(
  '/api/users',
  createProxyMiddleware({
    target: USER_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/users': '/api/users' },
  })
);

app.use(
  '/api/tts',
  createProxyMiddleware({
    target: TTS_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/tts': '/api/tts' },
  })
);

app.use(
  '/api/admin',
  createProxyMiddleware({
    target: ADMIN_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/admin': '/api/admin' },
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    services: {
      auth: AUTH_SERVICE,
      user: USER_SERVICE,
      tts: TTS_SERVICE,
      admin: ADMIN_SERVICE,
    },
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

