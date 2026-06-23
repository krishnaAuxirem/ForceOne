import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_EXPENSES } from '@/lib/mockData';
import type { Expense } from '@/types';
import {
  DollarSign, Search, Filter, Plus, Check, X, FileText, Calendar,
  TrendingUp, BarChart2, CheckCircle, AlertTriangle, Eye, Upload, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getStatusColor, formatDate } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('force1_expenses', MOCK_EXPENSES);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected item states
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    amount: '',
    category: 'Travel',
    description: '',
    receipt: '',
  });

  // Approvals comments
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  // Filter Claims
  const filteredExpenses = expenses.filter(claim => {
    // Agents only view their own claims
    const matchesUser = isAdminOrManager || claim.userId === user?.id || claim.userId === 'agent-1';

    const matchesSearch =
      claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (claim.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || claim.category === categoryFilter;

    return matchesUser && matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.amount) {
      toast.error('Claim title and amount are required.');
      return;
    }

    const amt = parseFloat(formState.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Claim amount must be a positive number.');
      return;
    }

    const newClaim: Expense = {
      id: 'exp-' + Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'agent-1',
      userName: user?.name || 'Rahul Sharma',
      title: formState.title,
      amount: amt,
      category: formState.category,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: formState.description,
      receipt: formState.receipt || 'receipt_placeholder.png',
    };

    setExpenses(prev => [newClaim, ...prev]);
    setIsSubmitOpen(false);
    toast.success('Expense claim submitted successfully for manager approval!');
    setFormState({ title: '', amount: '', category: 'Travel', description: '', receipt: '' });
  };

  const handleApproveClaim = (id: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
    toast.success('Claim has been approved.');
    if (selectedExpense?.id === id) {
      setSelectedExpense(prev => prev ? { ...prev, status: 'approved' } : null);
    }
  };

  const handleRejectClaim = (id: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected', description: e.description + ` (Rejected: ${rejectReason})` } : e));
    toast.error('Claim has been rejected.');
    setShowRejectForm(false);
    setRejectReason('');
    if (selectedExpense?.id === id) {
      setSelectedExpense(prev => prev ? { ...prev, status: 'rejected' } : null);
    }
  };

  const handleDeleteClaim = (id: string) => {
    if (confirm('Delete this expense claim permanently?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast.success('Claim deleted.');
      if (selectedExpense?.id === id) setSelectedExpense(null);
    }
  };

  // Compile category totals for Recharts
  const categoryTotals = expenses.reduce((acc: { [key: string]: number }, cur) => {
    if (cur.status === 'approved') {
      acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
    }
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map(cat => ({
    category: cat,
    amount: categoryTotals[cat],
  }));

  const expenseCategories = ['Travel', 'Entertainment', 'Office', 'Equipment', 'Others'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/90 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <DollarSign className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">Expense claims</h1>
          </div>
          <p className="text-white/70 text-sm">
            {isAdminOrManager 
              ? 'Review pending reimbursement claims, approve receipts, and track operational spend limits.'
              : 'Log and submit local field trip costs, auto rickshaw passes, client dinners, and supplies.'}
          </p>
        </div>
        <button 
          onClick={() => setIsSubmitOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-white font-bold text-sm shadow transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Submit Claim
        </button>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-base p-5 border border-[#90AEAD]/10 md:col-span-2">
          <h3 className="font-bold text-[#244855] dark:text-white font-display text-xs mb-3">Approved Spending (Categorized)</h3>
          <div className="h-44">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#90AEAD' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#90AEAD' }} />
                  <Tooltip contentStyle={{ fontSize: 11, background: '#244855', color: 'white', borderRadius: '8px' }} />
                  <Bar dataKey="amount" fill="#244855" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#E64833' : '#244855'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#90AEAD]">No approved expenses logged yet.</div>
            )}
          </div>
        </div>

        <div className="card-base p-5 border border-[#90AEAD]/10 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#244855] dark:text-white font-display text-xs mb-2">My Reimbursements Limit</h3>
            <p className="text-[11px] text-[#90AEAD]">Your monthly claims target threshold: ₹15,000</p>
          </div>
          <div className="my-3">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#90AEAD]">Current Spend</span>
              <span className="text-[#244855] dark:text-white">
                ₹{expenses.filter(e => (e.userId === user?.id || e.userId === 'agent-1') && e.status === 'approved').reduce((s, c) => s + c.amount, 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-full bg-[#90AEAD]/20 rounded-full h-2.5">
              <div className="bg-[#E64833] h-2.5 rounded-full" style={{ width: '38%' }} />
            </div>
          </div>
          <span className="text-[10px] text-[#90AEAD]/70 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-[#E64833]" /> Resets in 12 days.
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card-base p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-[#90AEAD]/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90AEAD]" />
          <input
            type="text"
            placeholder="Search by claim title, submitter..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input-field pl-9"
          />
        </div>
        <div>
          <select 
            value={statusFilter} 
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All Claim Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved Claims</option>
            <option value="rejected">Rejected Claims</option>
          </select>
        </div>
        <div>
          <select 
            value={categoryFilter} 
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All Categories</option>
            {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Claims List Table */}
      <div className="card-base border border-[#90AEAD]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafb] dark:bg-[#1a2d38] border-b border-[#90AEAD]/10 text-xs font-bold uppercase tracking-wider text-[#90AEAD]">
                <th className="px-5 py-4">Claim Details</th>
                <th className="px-5 py-4">Logged By</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Total Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90AEAD]/10 text-sm">
              {paginatedExpenses.map(claim => (
                <tr key={claim.id} className="hover:bg-[#f8fafb] dark:hover:bg-[#244855]/10 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#244855] dark:text-white">{claim.title}</div>
                    <div className="flex items-center gap-2.5 text-xs text-[#90AEAD] mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(claim.date)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-xs text-[#244855] dark:text-white">{claim.userName}</span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#244855] dark:text-white">
                    {claim.category}
                  </td>
                  <td className="px-5 py-4 font-bold text-[#244855] dark:text-white">
                    ₹{claim.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedExpense(claim)}
                        title="View Details"
                        className="p-2 rounded-xl text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {claim.status === 'pending' && isAdminOrManager && (
                        <>
                          <button
                            onClick={() => handleApproveClaim(claim.id)}
                            title="Approve Claim"
                            className="p-2 rounded-xl text-green-600 hover:bg-green-50 transition-all min-h-[36px]"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelectedExpense(claim); setShowRejectForm(true); }}
                            title="Reject Claim"
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all min-h-[36px]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteClaim(claim.id)}
                        title="Delete Claim"
                        className="p-2 rounded-xl text-[#90AEAD] hover:bg-red-50 hover:text-red-500 transition-all min-h-[36px]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#90AEAD] text-xs">
                    No expense claims match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#f8fafb] dark:bg-[#1a2d38] border-t border-[#90AEAD]/10 flex items-center justify-between">
            <span className="text-xs text-[#90AEAD]">
              Showing <span className="font-bold text-[#244855] dark:text-white">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-[#244855] dark:text-white">
                {Math.min(startIndex + itemsPerPage, filteredExpenses.length)}
              </span>{' '}
              of <span className="font-bold text-[#244855] dark:text-white">{filteredExpenses.length}</span> claims
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white dark:bg-[#244855] border border-[#90AEAD]/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] min-h-[36px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-[#244855] dark:text-white">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white dark:bg-[#244855] border border-[#90AEAD]/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] min-h-[36px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CLAIM SUBMIT MODAL */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-lg overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">New Expense Claim</h3>
              <button onClick={() => setIsSubmitOpen(false)} className="p-1 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleClaimSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Claim Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Travel tickets - Mumbai to Pune"
                  value={formState.title}
                  onChange={e => setFormState(f => ({ ...f, title: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={formState.amount}
                    onChange={e => setFormState(f => ({ ...f, amount: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState(f => ({ ...f, category: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Notes / Description</label>
                <textarea
                  placeholder="Provide rationale for expenditure..."
                  value={formState.description}
                  onChange={e => setFormState(f => ({ ...f, description: e.target.value }))}
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Attach Receipt</label>
                <label className="flex items-center justify-between border border-[#90AEAD]/20 bg-white dark:bg-[#1a2d38] p-3 rounded-xl cursor-pointer hover:border-[#244855] transition-all">
                  <span className="text-xs text-[#90AEAD] truncate">{formState.receipt || 'Select receipt photo/pdf...'}</span>
                  <Upload className="w-4 h-4 text-[#90AEAD]" />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={e => setFormState(f => ({ ...f, receipt: e.target.files?.[0]?.name || '' }))} 
                  />
                </label>
              </div>

              <button type="submit" className="w-full py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-xl font-bold text-sm shadow transition-all mt-2">
                Submit Claim
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-lg overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between bg-[#244855]/5">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#90AEAD] tracking-widest">{selectedExpense.category} Expense Details</span>
                <h3 className="text-base font-bold text-[#244855] dark:text-white font-display mt-0.5">{selectedExpense.title}</h3>
              </div>
              <button onClick={() => { setSelectedExpense(null); setShowRejectForm(false); }} className="p-1.5 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center py-2.5 border-b border-[#90AEAD]/10">
                <span className="text-xs text-[#90AEAD]">Claim Submitter</span>
                <span className="text-xs font-bold text-[#244855] dark:text-white">{selectedExpense.userName}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#90AEAD]/10">
                <span className="text-xs text-[#90AEAD]">Submission Date</span>
                <span className="text-xs font-bold text-[#244855] dark:text-white">{formatDate(selectedExpense.date)}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#90AEAD]/10">
                <span className="text-xs text-[#90AEAD]">Claim Status</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${getStatusColor(selectedExpense.status)}`}>{selectedExpense.status}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#90AEAD]/10">
                <span className="text-xs text-[#90AEAD]">Amount Claimed</span>
                <span className="text-sm font-bold text-[#244855] dark:text-white">₹{selectedExpense.amount.toLocaleString('en-IN')}</span>
              </div>

              <div>
                <span className="text-xs text-[#90AEAD] block mb-1">Notes / Description:</span>
                <p className="text-xs text-[#244855]/90 dark:text-[#90AEAD] bg-[#f8fafb] dark:bg-[#244855]/20 p-3 rounded-xl border border-[#90AEAD]/10">
                  {selectedExpense.description || 'No description provided.'}
                </p>
              </div>

              <div className="p-3 bg-[#244855]/5 border border-[#90AEAD]/10 rounded-xl text-xs flex items-center justify-between">
                <span className="text-[#90AEAD] flex items-center gap-1"><FileText className="w-4 h-4 text-[#E64833]" /> Receipt Attached:</span>
                <span className="font-bold text-[#244855] dark:text-white hover:underline cursor-pointer">{selectedExpense.receipt || 'receipt_192.jpg'}</span>
              </div>

              {/* Reject Reason input form */}
              {showRejectForm && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-[#244855] dark:text-white">Reason for Rejection *</div>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    className="input-field py-1.5 px-3 text-xs"
                    placeholder="e.g. Missing receipt scan"
                    required
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowRejectForm(false)} className="text-[10px] px-2.5 py-1.5 bg-gray-100 rounded-lg font-bold">Cancel</button>
                    <button onClick={() => handleRejectClaim(selectedExpense.id)} className="text-[10px] px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold">Confirm Reject</button>
                  </div>
                </div>
              )}

              {selectedExpense.status === 'pending' && isAdminOrManager && !showRejectForm && (
                <div className="flex gap-2 border-t border-[#90AEAD]/15 pt-4">
                  <button
                    onClick={() => handleApproveClaim(selectedExpense.id)}
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all shadow"
                  >
                    Approve Claims Reimbursement
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow"
                  >
                    Reject Claim
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
