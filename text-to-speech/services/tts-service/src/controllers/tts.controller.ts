import { Request, Response } from 'express';
import pool from '../config/database';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const AUDIO_STORAGE_PATH = process.env.AUDIO_STORAGE_PATH || './storage/audio';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const openai = OPENAI_API_KEY
  ? new OpenAI({ apiKey: OPENAI_API_KEY })
  : null;

// Ensure storage directory exists
if (!fs.existsSync(AUDIO_STORAGE_PATH)) {
  fs.mkdirSync(AUDIO_STORAGE_PATH, { recursive: true });
}

// Voice mapping: Custom voice IDs to OpenAI TTS voices
// OpenAI TTS supports: alloy, echo, fable, onyx, nova, shimmer
const VOICE_MAPPING: Record<string, 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'> = {
  'adam': 'onyx',        // Male voice
  'alice': 'nova',       // Female voice
  'aaditya': 'onyx',     // Male voice
  'ahmed': 'echo',       // Male voice
  'anika': 'shimmer',    // Female voice
  'anjali': 'nova',      // Female voice
  'ayesha': 'shimmer',   // Female voice
  'cherry': 'alloy',     // Female voice
  'priyanka-sogam': 'nova',
  'sam': 'onyx',
  'pryanka-gujrati': 'echo',
  'sam-tamil': 'onyx',
};

// Available voices (can be extended with actual TTS API)
const AVAILABLE_VOICES = [
  { id: 'adam', name: 'Adam', language: 'English (American)', gender: 'male', featured: true },
  { id: 'alice', name: 'Alice', language: 'English (American)', gender: 'female', featured: true },
  { id: 'aaditya', name: 'Aaditya', language: 'Hindi (Indian)', gender: 'male', featured: true },
  { id: 'ahmed', name: 'Ahmed', language: 'Hindi (Indian)', gender: 'male', featured: true },
  { id: 'anika', name: 'Anika', language: 'Hindi (Indian)', gender: 'female', featured: true },
  { id: 'anjali', name: 'Anjali', language: 'Hindi (Indian)', gender: 'female', featured: true },
  { id: 'ayesha', name: 'Ayesha', language: 'Hindi (Indian)', gender: 'female', featured: true },
  { id: 'cherry', name: 'Cherry', language: 'Hindi (Indian)', gender: 'female', featured: true },
  { id: 'priyanka-sogam', name: 'Priyanka Sogam', language: 'Bengali (Indian)', gender: 'female', featured: true },
  { id: 'sam', name: 'Sam', language: 'Telugu (Indian)', gender: 'male', featured: true },
  { id: 'pryanka-gujrati', name: 'Pryanka Gujrati', language: 'Gujarati (Indian)', gender: 'male', featured: true },
  { id: 'sam-tamil', name: 'Sam Tamil', language: 'Tamil (Indian)', gender: 'male', featured: true },
];

export const getVoices = async (req: Request, res: Response) => {
  try {
    res.json({ voices: AVAILABLE_VOICES });
  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const convertTextToSpeech = async (req: Request, res: Response) => {
  try {
    const { text, voiceId, speed = 1.0, pitch = 1.0 } = req.body;
    const userId = (req as any).user.userId;

    if (!text || !voiceId) {
      return res.status(400).json({ error: 'Text and voiceId are required' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text exceeds maximum length of 5000 characters' });
    }

    // Check if voice exists
    const voice = AVAILABLE_VOICES.find((v) => v.id === voiceId);
    if (!voice) {
      return res.status(400).json({ error: 'Invalid voice ID' });
    }

    // Calculate credits needed (1 credit per character)
    const creditsNeeded = text.length;

    // Check user credits
    const userCreditsResponse = await axios.get(
      `${USER_SERVICE_URL}/api/users/${userId}/credits`,
      {
        headers: { Authorization: req.headers.authorization },
      }
    );

    const userCredits = userCreditsResponse.data.credits;
    if (userCredits < creditsNeeded) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Create conversion record
    const conversionId = uuidv4();
    await pool.query(
      `INSERT INTO tts_conversions (id, user_id, text, voice_id, credits_used, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [conversionId, userId, text, voiceId, creditsNeeded, 'processing']
    );

    // Deduct credits
    await axios.put(
      `${USER_SERVICE_URL}/api/users/${userId}/credits`,
      { credits: -creditsNeeded },
      {
        headers: { Authorization: req.headers.authorization },
      }
    );

    // Generate audio using OpenAI TTS API
    const audioFileName = `${conversionId}.mp3`;
    const audioPath = path.join(AUDIO_STORAGE_PATH, audioFileName);
    const audioUrl = `/api/tts/audio/${audioFileName}`;

    try {
      if (!openai) {
        // Update conversion status to failed
        await pool.query(
          'UPDATE tts_conversions SET status = $1 WHERE id = $2',
          ['failed', conversionId]
        );

        // Refund credits
        await axios.put(
          `${USER_SERVICE_URL}/api/users/${userId}/credits`,
          { credits: creditsNeeded },
          {
            headers: { Authorization: req.headers.authorization },
          }
        );

        return res.status(500).json({
          error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
        });
      }

      // Get OpenAI voice from mapping, default to 'alloy' if not found
      const openaiVoice = VOICE_MAPPING[voiceId] || 'alloy';

      // Generate speech using OpenAI TTS
      const mp3 = await openai.audio.speech.create({
        model: 'tts-1', // or 'tts-1-hd' for higher quality
        voice: openaiVoice,
        input: text,
        speed: Math.max(0.25, Math.min(4.0, speed || 1.0)), // OpenAI supports 0.25 to 4.0
      });

      // Convert response to buffer
      const buffer = Buffer.from(await mp3.arrayBuffer());

      // Save audio file to storage
      fs.writeFileSync(audioPath, buffer);

      // Update conversion with audio URL
      await pool.query(
        'UPDATE tts_conversions SET audio_url = $1, status = $2 WHERE id = $3',
        [audioUrl, 'completed', conversionId]
      );

      res.json({
        id: conversionId,
        text,
        voiceId,
        audioUrl,
        creditsUsed: creditsNeeded,
        status: 'completed',
      });
    } catch (ttsError: any) {
      console.error('OpenAI TTS error:', ttsError);

      // Update conversion status to failed
      await pool.query(
        'UPDATE tts_conversions SET status = $1 WHERE id = $2',
        ['failed', conversionId]
      );

      // Refund credits
      try {
        await axios.put(
          `${USER_SERVICE_URL}/api/users/${userId}/credits`,
          { credits: creditsNeeded },
          {
            headers: { Authorization: req.headers.authorization },
          }
        );
      } catch (refundError) {
        console.error('Failed to refund credits:', refundError);
      }

      throw new Error(`TTS generation failed: ${ttsError.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Convert TTS error:', error);

    // Refund credits if conversion failed
    if (error.response?.status !== 400) {
      try {
        const userId = (req as any).user.userId;
        const creditsNeeded = req.body.text?.length || 0;
        await axios.put(
          `${USER_SERVICE_URL}/api/users/${userId}/credits`,
          { credits: creditsNeeded },
          {
            headers: { Authorization: req.headers.authorization },
          }
        );
      } catch (refundError) {
        console.error('Failed to refund credits:', refundError);
      }
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const result = await pool.query(
      'SELECT * FROM tts_conversions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conversion not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get conversion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserConversions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const result = await pool.query(
      `SELECT * FROM tts_conversions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json({ conversions: result.rows });
  } catch (error) {
    console.error('Get user conversions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const serveAudioFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    // Security: Only allow alphanumeric, dash, and underscore in filename
    if (!/^[a-zA-Z0-9_-]+\.mp3$/.test(filename)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const audioPath = path.join(AUDIO_STORAGE_PATH, filename);

    // Check if file exists
    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Set appropriate headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Stream the audio file
    const fileStream = fs.createReadStream(audioPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Serve audio file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

