import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { IndianRupee, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8B5CF6', '#EC4899'];

const Dashboard = () => {
  const [data, setData] = useState({ summary: {}, categoryTotals: [], monthlyTrends: [], recentTransactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/analytics/summary');
      setData(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading Dashboard...</div>;

  const { summary, categoryTotals, monthlyTrends, recentTransactions } = data;

  const pieData = categoryTotals.map((item) => ({
    name: item._id.category,
    value: item.totalAmount
  }));

  const lineData = monthlyTrends.map((item) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      name: monthNames[item._id.month - 1],
      amount: item.totalAmount,
      type: item._id.type
    };
  });

  // Group line data by month to have income/expense in same object for composed chart, simplified version here
  const groupedLineData = lineData.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.name);
    if(existing) {
      existing[curr.type] = curr.amount;
    } else {
      acc.push({ name: curr.name, [curr.type]: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 flex-shrink-0">
            <IndianRupee className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Total Income</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 truncate" title={`₹${summary.totalIncome?.toFixed(2) || 0}`}>₹{summary.totalIncome?.toFixed(2) || 0}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4 flex-shrink-0">
            <TrendingDown className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Total Expenses</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 truncate" title={`₹${summary.totalExpenses?.toFixed(2) || 0}`}>₹{summary.totalExpenses?.toFixed(2) || 0}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 flex-shrink-0">
            <Activity className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Net Balance</p>
            <p className={`text-xl md:text-2xl font-bold truncate ${summary.netBalance < 0 ? 'text-red-600' : 'text-green-600'}`} title={`₹${summary.netBalance?.toFixed(2) || 0}`}>
              ₹{summary.netBalance?.toFixed(2) || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Expenses by Category</h2>
          <div className="h-64 sm:h-80">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Trends</h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={groupedLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{tx.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500 text-sm">No recent transactions.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
