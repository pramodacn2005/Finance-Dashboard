import Transaction from '../models/Transaction.js';

export const getAnalyticsSummary = async (req, res) => {
  try {
    // Basic aggregation
    const totals = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    totals.forEach((t) => {
      if (t._id === 'income') totalIncome = t.totalAmount;
      if (t._id === 'expense') totalExpenses = t.totalAmount;
    });

    const netBalance = totalIncome - totalExpenses;

    // Category-wise totals
    const categoryTotals = await Transaction.aggregate([
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    // Monthly trends
    const currentYear = new Date().getFullYear();
    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type',
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } }
    ]);

    // Recent transactions
    const recentTransactions = await Transaction.find()
      .populate('userId', 'name')
      .sort({ date: -1 })
      .limit(5);

    res.json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
      },
      categoryTotals,
      monthlyTrends,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
