import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.routes';
import { connectRedis } from './config/redis';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Redis
connectRedis();

// Routes
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'admin-service' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Admin service running on port ${PORT}`);
});

