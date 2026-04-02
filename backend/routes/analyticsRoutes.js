import express from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/summary')
  .get(protect, authorize('read_analytics'), getAnalyticsSummary);

export default router;
