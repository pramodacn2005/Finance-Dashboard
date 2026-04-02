import express from 'express';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// protect all paths
router.use(protect);



router.route('/')
  .post(authorize('write_transactions'), createTransaction)
  .get(authorize('read_transactions'), getTransactions);

router.route('/:id')
  .put(authorize('write_transactions'), updateTransaction)
  .delete(authorize('delete_transactions'), deleteTransaction);

export default router;
