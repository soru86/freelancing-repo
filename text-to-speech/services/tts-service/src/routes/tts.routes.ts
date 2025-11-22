import express from 'express';
import {
  convertTextToSpeech,
  getVoices,
  getConversion,
  getUserConversions,
  serveAudioFile,
} from '../controllers/tts.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/voices', getVoices);
router.post('/convert', authenticateToken, convertTextToSpeech);
router.get('/conversion/:id', authenticateToken, getConversion);
router.get('/conversions', authenticateToken, getUserConversions);
router.get('/audio/:filename', serveAudioFile);

export default router;

