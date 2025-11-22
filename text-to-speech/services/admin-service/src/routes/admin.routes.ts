import express from 'express';
import {
  getStats,
  getUsers,
  getPricingPlans,
  updatePricingPlan,
  createPricingPlan,
  deletePricingPlan,
  getSettings,
  updateSetting,
  getConversions,
  getUserStats,
} from '../controllers/admin.controller';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(isAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/pricing-plans', getPricingPlans);
router.post('/pricing-plans', createPricingPlan);
router.put('/pricing-plans/:id', updatePricingPlan);
router.delete('/pricing-plans/:id', deletePricingPlan);
router.get('/settings', getSettings);
router.put('/settings/:key', updateSetting);
router.get('/conversions', getConversions);
router.get('/users/:userId/stats', getUserStats);

export default router;

