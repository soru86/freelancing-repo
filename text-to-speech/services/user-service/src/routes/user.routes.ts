import express from 'express';
import {
  createUser,
  getUser,
  updateUser,
  getUserCredits,
  updateUserCredits,
  getUserHistory,
} from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', createUser);
router.get('/:userId', authenticateToken, getUser);
router.put('/:userId', authenticateToken, updateUser);
router.get('/:userId/credits', authenticateToken, getUserCredits);
router.put('/:userId/credits', authenticateToken, updateUserCredits);
router.get('/:userId/history', authenticateToken, getUserHistory);

export default router;

