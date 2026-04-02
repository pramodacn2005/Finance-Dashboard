import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, Edit 
} from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, [filterType, filterCategory]);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions', {
        params: { type: filterType, category: filterCategory }
      });
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', formData);
      toast.success('Transaction added');
      setShowForm(false);
      setFormData({ amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
      fetchTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        {user?.role?.permissions?.includes('write_transactions') && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary w-auto flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        )}
      </div>

      {showForm && user?.role?.permissions?.includes('write_transactions') && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
             <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="input-field" placeholder="0.00" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-field">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field" placeholder="e.g. Software" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input-field" />
             </div>
             <div className="lg:col-span-2 flex flex-col sm:flex-row gap-2">
                <button type="submit" className="btn-primary w-full sm:flex-1">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-primary bg-gray-500 hover:bg-gray-600 w-full sm:flex-1">Cancel</button>
             </div>
          </form>
        </div>
      )}

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
           <select 
             className="input-field w-full sm:w-auto"
             value={filterType}
             onChange={e => setFilterType(e.target.value)}
           >
             <option value="">All Types</option>
             <option value="income">Income</option>
             <option value="expense">Expense</option>
           </select>
           
           <input 
             type="text" 
             placeholder="Filter by Category..." 
             className="input-field w-full sm:w-auto"
             value={filterCategory}
             onChange={e => setFilterCategory(e.target.value)}
           />
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  {user?.role?.permissions?.includes('delete_transactions') && <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{tx.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{tx.amount.toFixed(2)}
                    </td>
                    {user?.role?.permissions?.includes('delete_transactions') && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDelete(tx._id)} className="text-red-600 hover:text-red-900 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={user?.role?.permissions?.includes('delete_transactions') ? 5 : 4} className="px-6 py-8 text-center text-gray-500">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
