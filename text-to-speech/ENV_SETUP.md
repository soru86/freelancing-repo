# Environment Variables Setup Guide

This document describes all environment variables required for the Text-to-Speech microservices application.

## Quick Start

1. Copy the `.env.example` files to `.env` in each service directory
2. Update the values according to your environment
3. For Docker Compose, most values are already set in `docker-compose.yml`

## Environment Variables by Service

### Auth Service (`services/auth-service/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Service port | No | 3001 |
| `DB_HOST` | PostgreSQL host | Yes | localhost |
| `DB_PORT` | PostgreSQL port | No | 5432 |
| `DB_NAME` | Database name | Yes | tts_db |
| `DB_USER` | Database user | Yes | postgres |
| `DB_PASSWORD` | Database password | Yes | postgres |
| `REDIS_URL` | Redis connection URL | Yes | redis://localhost:6379 |
| `JWT_SECRET` | Secret for JWT tokens | Yes | - |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Yes | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No | - |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | No | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | No | - |
| `FACEBOOK_APP_ID` | Facebook OAuth App ID | No | - |
| `FACEBOOK_APP_SECRET` | Facebook OAuth App Secret | No | - |
| `USER_SERVICE_URL` | User service URL | Yes | http://localhost:3002 |
| `FRONTEND_URL` | Frontend URL for OAuth callbacks | Yes | http://localhost:3000 |

**Note:** OAuth credentials are optional. The service will start without them, but OAuth routes will return 503 errors.

### User Service (`services/user-service/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Service port | No | 3002 |
| `DB_HOST` | PostgreSQL host | Yes | localhost |
| `DB_PORT` | PostgreSQL port | No | 5432 |
| `DB_NAME` | Database name | Yes | tts_db |
| `DB_USER` | Database user | Yes | postgres |
| `DB_PASSWORD` | Database password | Yes | postgres |
| `REDIS_URL` | Redis connection URL | Yes | redis://localhost:6379 |
| `JWT_SECRET` | Secret for JWT tokens (must match auth-service) | Yes | - |

### TTS Service (`services/tts-service/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Service port | No | 3003 |
| `DB_HOST` | PostgreSQL host | Yes | localhost |
| `DB_PORT` | PostgreSQL port | No | 5432 |
| `DB_NAME` | Database name | Yes | tts_db |
| `DB_USER` | Database user | Yes | postgres |
| `DB_PASSWORD` | Database password | Yes | postgres |
| `REDIS_URL` | Redis connection URL | Yes | redis://localhost:6379 |
| `JWT_SECRET` | Secret for JWT tokens (must match auth-service) | Yes | - |
| `USER_SERVICE_URL` | User service URL | Yes | http://localhost:3002 |
| `AUDIO_STORAGE_PATH` | Path for storing generated audio files | No | ./storage/audio |
| `OPENAI_API_KEY` | OpenAI API key for TTS generation | Yes | - |

**Note:** The TTS service requires an OpenAI API key to generate audio. Without it, text-to-speech conversion will fail. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

### Admin Service (`services/admin-service/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Service port | No | 3004 |
| `DB_HOST` | PostgreSQL host | Yes | localhost |
| `DB_PORT` | PostgreSQL port | No | 5432 |
| `DB_NAME` | Database name | Yes | tts_db |
| `DB_USER` | Database user | Yes | postgres |
| `DB_PASSWORD` | Database password | Yes | postgres |
| `REDIS_URL` | Redis connection URL | Yes | redis://localhost:6379 |
| `JWT_SECRET` | Secret for JWT tokens (must match auth-service) | Yes | - |
| `ADMIN_EMAIL` | Email address for admin access | Yes | admin@test.com |

### API Gateway (`services/api-gateway/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Service port | No | 3000 |
| `AUTH_SERVICE_URL` | Auth service URL | Yes | http://localhost:3001 |
| `USER_SERVICE_URL` | User service URL | Yes | http://localhost:3002 |
| `TTS_SERVICE_URL` | TTS service URL | Yes | http://localhost:3003 |
| `ADMIN_SERVICE_URL` | Admin service URL | Yes | http://localhost:3004 |

**For Docker Compose:** Use service names instead of localhost:
- `AUTH_SERVICE_URL=http://auth-service:3001`
- `USER_SERVICE_URL=http://user-service:3002`
- etc.

### Frontend (`frontend/.env.local`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | API Gateway URL | Yes | http://localhost:3000 |

**Note:** Next.js requires the `NEXT_PUBLIC_` prefix for client-side environment variables.

## Docker Compose Configuration

When using Docker Compose, environment variables are set in `docker-compose.yml`. You can override them by:

1. Creating a `.env` file in the project root
2. Using environment variable substitution in `docker-compose.yml`
3. Setting them directly in `docker-compose.yml` (as currently done)

## Security Best Practices

1. **Never commit `.env` files** - They are in `.gitignore`
2. **Use strong secrets** - Generate random strings for JWT secrets (minimum 32 characters)
3. **Use different secrets for production** - Never use default/example values
4. **Rotate secrets regularly** - Especially JWT secrets
5. **Use environment-specific configs** - Different values for dev/staging/production

## Generating Secure Secrets

### Using OpenSSL:
```bash
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
```

### Using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## OAuth Setup

### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret

### GitHub OAuth:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
4. Copy Client ID and Client Secret

### Facebook OAuth:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing
3. Add Facebook Login product
4. Go to Settings → Basic
5. Add authorized redirect URI: `http://localhost:3000/api/auth/facebook/callback`
6. Copy App ID and App Secret from Settings → Basic
7. Make sure to request `email` permission in the OAuth scope

## Production Checklist

- [ ] Generate strong, unique JWT secrets
- [ ] Use managed database (RDS, Cloud SQL, etc.)
- [ ] Use managed Redis (ElastiCache, Cloud Memorystore, etc.)
- [ ] Configure OAuth with production URLs
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
- [ ] Enable rate limiting
- [ ] Configure backup strategies

