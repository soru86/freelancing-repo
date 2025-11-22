# Setup Guide

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- PostgreSQL 15+ (optional, Docker Compose includes it)
- Redis (optional, Docker Compose includes it)

## Quick Start with Docker Compose

1. **Clone the repository** (if not already done)

2. **Set up environment variables**

   Create `.env` files in each service directory or use the defaults in docker-compose.yml

3. **Start all services**

   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database
   - Redis cache
   - Auth Service (port 3001)
   - User Service (port 3002)
   - TTS Service (port 3003)
   - Admin Service (port 3004)
   - API Gateway (port 3000)
   - Frontend (port 3005)

4. **Run database migrations**

   ```bash
   docker-compose exec user-service npm run migrate
   ```

5. **Seed the database**

   ```bash
   docker-compose exec user-service npm run seed
   ```

6. **Access the application**

   - Frontend: http://localhost:3005
   - API Gateway: http://localhost:3000
   - Admin Dashboard: http://localhost:3005/admin (login with admin@test.com / password123)

## Local Development Setup

### Backend Services

1. **Install dependencies for all services**

   ```bash
   npm run install:all
   ```

2. **Set up PostgreSQL and Redis**

   - Install PostgreSQL locally or use Docker:
     ```bash
     docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15-alpine
     ```
   - Install Redis locally or use Docker:
     ```bash
     docker run -d -p 6379:6379 redis:7-alpine
     ```

3. **Configure environment variables**

   Copy `.env.example` files in each service directory and update with your values.

4. **Run database migrations**

   ```bash
   cd services/user-service
   npm run migrate
   ```

5. **Seed the database**

   ```bash
   cd services/user-service
   npm run seed
   ```

6. **Start services** (in separate terminals)

   ```bash
   # Terminal 1 - Auth Service
   npm run dev:auth

   # Terminal 2 - User Service
   npm run dev:user

   # Terminal 3 - TTS Service
   npm run dev:tts

   # Terminal 4 - Admin Service
   npm run dev:admin

   # Terminal 5 - API Gateway
   npm run dev:gateway
   ```

### Frontend

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set environment variables**

   Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Access the application**

   Open http://localhost:3000

## Test Accounts

After seeding the database, you can use these test accounts:

- **Admin Account:**
  - Email: `admin@test.com`
  - Password: `password123`

- **Regular User:**
  - Email: `user1@test.com`
  - Password: `password123`

## OAuth Setup (Optional)

To enable Google and GitHub OAuth:

1. **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
   - Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in auth-service `.env`

2. **GitHub OAuth:**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
   - Update `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in auth-service `.env`

## Kubernetes Deployment

See `k8s/README.md` for Kubernetes deployment instructions.

## Project Structure

```
text-to-speech/
├── frontend/              # Next.js frontend
├── services/
│   ├── auth-service/      # Authentication (JWT + OAuth)
│   ├── user-service/      # User management
│   ├── tts-service/       # Text-to-speech conversion
│   ├── admin-service/     # Admin dashboard
│   └── api-gateway/       # API Gateway
├── docker-compose.yml     # Docker Compose configuration
├── k8s/                   # Kubernetes configurations
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register with email
- `POST /api/auth/login` - Login with email
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `GET /api/users/:userId/credits` - Get user credits
- `PUT /api/users/:userId/credits` - Update user credits

### TTS
- `GET /api/tts/voices` - Get available voices
- `POST /api/tts/convert` - Convert text to speech
- `GET /api/tts/conversions` - Get user conversions

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/pricing-plans` - Get pricing plans
- `PUT /api/admin/pricing-plans/:id` - Update pricing plan
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings/:key` - Update setting

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env` files
- Verify database exists: `CREATE DATABASE tts_db;`

### Redis Connection Issues
- Ensure Redis is running
- Check Redis URL in `.env` files

### Port Conflicts
- Change ports in `docker-compose.yml` or service `.env` files
- Ensure no other services are using the same ports

### Frontend Not Connecting to Backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check API Gateway is running on port 3000
- Check CORS settings in backend services

## Production Deployment

1. **Update environment variables** with production values
2. **Use strong secrets** for JWT and database passwords
3. **Enable HTTPS** with SSL certificates
4. **Set up monitoring** and logging
5. **Configure backup** for PostgreSQL
6. **Set up CI/CD** pipeline
7. **Use managed services** for PostgreSQL and Redis in production

## Support

For issues or questions, please check the documentation or create an issue in the repository.

