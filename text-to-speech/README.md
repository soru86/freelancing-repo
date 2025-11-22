# Text-to-Speech Microservices Application

A highly scalable, containerized microservices-based text-to-speech conversion platform inspired by MiloVoice.

## Architecture

### Microservices
- **Auth Service**: JWT-based authentication + OAuth (Google, GitHub)
- **TTS Service**: Text-to-speech conversion using AI
- **User Service**: User management and profiles
- **Admin Service**: Admin dashboard, pricing plans, settings
- **API Gateway**: Routes requests to appropriate services

### Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (main), Redis (caching)
- **Message Queue**: RabbitMQ (for async TTS processing)
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Project Structure

```
text-to-speech/
├── frontend/              # Next.js frontend application
├── services/
│   ├── auth-service/      # Authentication microservice
│   ├── tts-service/       # Text-to-speech conversion service
│   ├── user-service/      # User management service
│   ├── admin-service/     # Admin dashboard service
│   └── api-gateway/       # API Gateway
├── docker-compose.yml     # Docker Compose for local development
├── k8s/                   # Kubernetes configurations
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Kubernetes (for production)
- PostgreSQL
- Redis
- OpenAI API Key (for TTS functionality) - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` files in each service directory to `.env`
   - See `ENV_SETUP.md` for detailed configuration guide
   - For Docker Compose, most values are already configured in `docker-compose.yml`
   - **Important**: Set `OPENAI_API_KEY` environment variable for TTS functionality:
     ```bash
     export OPENAI_API_KEY=your-openai-api-key-here
     ```

4. Start services with Docker Compose:
   ```bash
   docker-compose up -d
   ```
   
   Or with OpenAI API key inline:
   ```bash
   OPENAI_API_KEY=your-key-here docker-compose up -d
   ```

5. Run database migrations:
   ```bash
   npm run migrate
   ```

6. Seed database:
   ```bash
   npm run seed
   ```

7. Start frontend:
   ```bash
   cd frontend && npm run dev
   ```

### Production Deployment

Deploy to Kubernetes:
```bash
kubectl apply -f k8s/
```

## Features

- ✅ User registration (Email + Social Media)
- ✅ JWT authentication
- ✅ OAuth (Google, GitHub)
- ✅ Text-to-speech conversion (using OpenAI TTS API)
- ✅ Multiple voice options (12+ voices mapped to OpenAI voices)
- ✅ Configurable pricing plans
- ✅ Admin dashboard
- ✅ Usage analytics and reports
- ✅ Credit-based system
- ✅ Containerized deployment
- ✅ Kubernetes-ready

## Environment Configuration

See `ENV_SETUP.md` for detailed environment variable configuration guide.

Each service has a `.env.example` file with required variables:
- `services/auth-service/.env.example`
- `services/user-service/.env.example`
- `services/tts-service/.env.example`
- `services/admin-service/.env.example`
- `services/api-gateway/.env.example`
- `frontend/.env.example`

## API Documentation

See individual service READMEs for API documentation.

## License

MIT

