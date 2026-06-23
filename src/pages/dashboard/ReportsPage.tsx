import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_TASKS, MOCK_EXPENSES } from '@/lib/mockData';
import type { Task, Expense } from '@/types';
import {
  FileText, Download, BarChart2, Calendar, Filter, FileSpreadsheet,
  CheckCircle, ArrowUpRight, Plus, RefreshCw, X, Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  format: 'PDF' | 'Excel';
  size: string;
  date: string;
}

export default function ReportsPage() {
  const [tasks] = useLocalStorage<Task[]>('force1_tasks', MOCK_TASKS);
  const [expenses] = useLocalStorage<Expense[]>('force1_expenses', MOCK_EXPENSES);

  // States
  const [reportType, setReportType] = useState('tasks');
  const [dateRange, setDateRange] = useState('month');
  const [isGenerating, setIsGenerating] = useState(false);

  const [downloadedReports, setDownloadedReports] = useLocalStorage<GeneratedReport[]>('force1_downloads', [
    { id: 'rep1', name: 'Attendance_Summary_May_2026', type: 'Attendance', format: 'Excel', size: '242 KB', date: '2026-06-20' },
    { id: 'rep2', name: 'Task_Metrics_Audit_Q2', type: 'Tasks Performance', format: 'PDF', size: '1.8 MB', date: '2026-06-15' },
    { id: 'rep3', name: 'Travel_Claims_Reimbursements', type: 'Expenses Distribution', format: 'Excel', size: '120 KB', date: '2026-06-10' },
  ]);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      const formatName = reportType.charAt(0).toUpperCase() + reportType.slice(1);
      const isExcel = reportType === 'expenses' || reportType === 'attendance';
      const fmt = isExcel ? 'Excel' : 'PDF';
      
      const newReport: GeneratedReport = {
        id: 'rep-' + Math.random().toString(36).substr(2, 9),
        name: `${formatName}_Analysis_${dateRange}_${new Date().toISOString().split('T')[0]}`,
        type: formatName + ' Report',
        format: fmt,
        size: isExcel ? '154 KB' : '1.2 MB',
        date: new Date().toISOString().split('T')[0],
      };

      setDownloadedReports(prev => [newReport, ...prev]);
      toast.success(`Report "${newReport.name}" compiled and downloaded successfully!`);
    }, 1200);
  };

  const handleDeleteReport = (id: string) => {
    setDownloadedReports(prev => prev.filter(r => r.id !== id));
    toast.success('Report deleted from history.');
  };

  // Mock Performance Curve Chart Data
  const mockChartData = [
    { name: 'Week 1', value: 45 },
    { name: 'Week 2', value: 72 },
    { name: 'Week 3', value: 68 },
    { name: 'Week 4', value: 91 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <FileText className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">Reports Center</h1>
          </div>
          <p className="text-white/70 text-sm">Download spreadsheet aggregates, task performance curves, and reimbursement audit bills.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Criteria Form (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6 border border-[#90AEAD]/10">
            <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm mb-4">Export Custom Report Log</h3>
            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1.5">Report Category Type</label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value)}
                    className="input-field font-semibold text-xs py-2 px-3"
                  >
                    <option value="tasks">Tasks Performance</option>
                    <option value="attendance">Attendance History</option>
                    <option value="expenses">Expenses claims Audit</option>
                    <option value="tracking">GPS Location tracking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1.5">Trimming Date Interval</label>
                  <select
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                    className="input-field font-semibold text-xs py-2 px-3"
                  >
                    <option value="today">Today</option>
                    <option value="week">Past 7 Days</option>
                    <option value="month">Current Month</option>
                    <option value="quarter">Past Quarter</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#f8fafb] dark:bg-[#1a2d38] rounded-2xl border border-[#90AEAD]/10 text-xs text-[#90AEAD] leading-relaxed">
                <span className="font-bold text-[#244855] dark:text-white block mb-1">Scope details:</span>
                Generates a detailed summary of all {reportType} logs captured within the requested range, formatted directly as an optimized {reportType === 'expenses' || reportType === 'attendance' ? 'Excel Spreadsheet (.xlsx)' : 'A4 Document (.pdf)'}.
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 bg-[#E64833] hover:bg-[#cc3d29] disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow transition-all flex items-center justify-center gap-2 min-h-[46px]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Compiling report details...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Generate and Download Report
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Metrics Graph */}
          <div className="card-base p-6 border border-[#90AEAD]/10">
            <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm mb-3">Completion Efficiency Curve</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#90AEAD' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#90AEAD' }} />
                  <Tooltip contentStyle={{ fontSize: 11, background: '#244855', color: 'white', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="value" stroke="#E64833" strokeWidth={2} dot={{ fill: '#E64833' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Historically Downloaded Reports (1 column) */}
        <div className="card-base p-5 border border-[#90AEAD]/10 flex flex-col">
          <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm mb-4">Export History</h3>
          <div className="flex-1 space-y-3.5">
            {downloadedReports.map(report => (
              <div key={report.id} className="p-3 bg-[#f8fafb] dark:bg-[#1a2d38] rounded-xl border border-[#90AEAD]/15 text-xs flex justify-between items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#244855] dark:text-white truncate">{report.name}</div>
                  <div className="text-[10px] text-[#90AEAD] mt-1">
                    {report.type} · {report.size} · {report.format}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toast.success(`Starting download: ${report.name}`)}
                    className="p-1.5 rounded-lg bg-white dark:bg-[#244855] border border-[#90AEAD]/20 text-[#244855] dark:text-[#90AEAD] hover:text-[#E64833] transition-all min-h-[30px]"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-1.5 rounded-lg bg-white dark:bg-[#244855] border border-[#90AEAD]/20 text-[#90AEAD] hover:text-red-500 transition-all min-h-[30px]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {downloadedReports.length === 0 && (
              <div className="text-center py-10 text-xs text-[#90AEAD] italic">No export history saved.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
