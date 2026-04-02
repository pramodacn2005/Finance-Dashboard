import Transaction from '../models/Transaction.js';

export const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    // Check amount > 0
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const transaction = new Transaction({
      userId: req.user._id,
      amount,
      type,
      category,
      date,
      notes,
    });

    const createdTransaction = await transaction.save();

    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    let query = {};
    
    // Viewer/Analyst/Admin rules: if admin sees all, or if we scope to user.
    // A dashboard for personal finance usually scopes to userId,
    // but the prompt implies an enterprise view where Admin/Analyst sees aggregated/all data.
    // If it's a global finance scope, we omit userId check unless specified.
    // Assuming a global scope (company dashboard).
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query).populate('userId', 'name email').sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction) {
      transaction.amount = req.body.amount || transaction.amount;
      transaction.type = req.body.type || transaction.type;
      transaction.category = req.body.category || transaction.category;
      transaction.date = req.body.date || transaction.date;
      transaction.notes = req.body.notes !== undefined ? req.body.notes : transaction.notes;

      if (transaction.amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }

      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      await transaction.deleteOne();
      res.json({ message: 'Transaction removed' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
