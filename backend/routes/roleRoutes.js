import express from 'express';
import { getRoles } from '../controllers/roleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('manage_users'), getRoles);

export default router;
