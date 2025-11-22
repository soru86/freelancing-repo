import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ttsRoutes from './routes/tts.routes';
import { connectRedis } from './config/redis';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY not set. Text-to-speech conversion will fail.');
  console.warn('   Please set OPENAI_API_KEY environment variable to enable TTS functionality.');
  console.warn('   Get your API key from: https://platform.openai.com/api-keys');
}

// Ensure audio storage directory exists
const AUDIO_STORAGE_PATH = process.env.AUDIO_STORAGE_PATH || './storage/audio';
if (!fs.existsSync(AUDIO_STORAGE_PATH)) {
  fs.mkdirSync(AUDIO_STORAGE_PATH, { recursive: true });
  console.log(`Created audio storage directory: ${AUDIO_STORAGE_PATH}`);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to Redis
connectRedis();

// Routes
app.use('/api/tts', ttsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'tts-service' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`TTS service running on port ${PORT}`);
});

