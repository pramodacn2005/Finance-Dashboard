import express from 'express';
import { getUsers, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('manage_users'), getUsers);

router.route('/:id')
  .put(protect, authorize('manage_users'), updateUser);

export default router;
