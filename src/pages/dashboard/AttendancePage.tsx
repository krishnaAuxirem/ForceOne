import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_ATTENDANCE } from '@/lib/mockData';
import type { AttendanceRecord } from '@/types';
import { Clock, MapPin, Calendar, CheckCircle, AlertTriangle, AlertCircle, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';
import { toast } from 'sonner';

export default function AttendancePage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('force1_attendance', MOCK_ATTENDANCE);

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(a => (a.userId === user?.id || a.userId === 'agent-1') && a.date === today);

  // States
  const [currentMonth, setCurrentMonth] = useState('April 2026');
  const [remarks, setRemarks] = useState('');

  const myAttendance = attendance.filter(a => a.userId === user?.id || a.userId === 'agent-1');

  // KPI Calculations
  const totalDays = myAttendance.length;
  const presentDays = myAttendance.filter(a => a.status === 'present').length;
  const lateDays = myAttendance.filter(a => a.status === 'late').length;
  const leaves = myAttendance.filter(a => a.status === 'on-leave').length;

  const handleCheckIn = () => {
    const now = new Date();
    const existing = attendance.find(a => (a.userId === user?.id || a.userId === 'agent-1') && a.date === today);
    
    if (existing) {
      toast.error('You are already checked in for today.');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: 'att-' + Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'agent-1',
      date: today,
      checkIn: now.toTimeString().slice(0, 5),
      status: now.getHours() >= 10 ? 'late' : 'present',
      location: 'Andheri West Office, Mumbai (GPS Verified)',
      notes: remarks || 'Regular check-in',
    };

    setAttendance(prev => [newRecord, ...prev]);
    setRemarks('');
    toast.success('Check-in logged successfully! Enjoy your shift.');
  };

  const handleCheckOut = () => {
    const existingIndex = attendance.findIndex(a => (a.userId === user?.id || a.userId === 'agent-1') && a.date === today);
    if (existingIndex === -1) {
      toast.error('No check-in record found for today. Check in first.');
      return;
    }
    if (attendance[existingIndex].checkOut) {
      toast.error('You have already checked out for today.');
      return;
    }

    const updated = [...attendance];
    updated[existingIndex] = {
      ...updated[existingIndex],
      checkOut: new Date().toTimeString().slice(0, 5),
    };

    setAttendance(updated);
    toast.success('Check-out logged successfully. Have a nice evening!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Clock className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">Time & Attendance</h1>
          </div>
          <p className="text-white/70 text-sm">Verify check-in hours, log daily locations, request leaves, and trace history.</p>
        </div>
      </div>

      {/* Main Check-In Controls */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-base p-6 border border-[#90AEAD]/10 md:col-span-2 space-y-5">
          <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm">Shift Check-In & Check-Out</h3>
          <p className="text-xs text-[#90AEAD]">Your office hours are set to 09:00 AM - 06:00 PM. Check-ins after 10:00 AM are flagged late.</p>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#f8fafb] dark:bg-[#1a2d38] p-5 rounded-2xl border border-[#90AEAD]/10 justify-between">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#90AEAD]">Today's Attendance Status</span>
              {todayRecord ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${getStatusColor(todayRecord.status)}`}>
                    {todayRecord.status}
                  </span>
                  <span className="text-xs font-semibold text-[#244855] dark:text-white">
                    In: {todayRecord.checkIn} {todayRecord.checkOut ? `| Out: ${todayRecord.checkOut}` : ''}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" /> Not checked-in for today yet.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCheckIn}
                disabled={!!todayRecord?.checkIn}
                className="px-5 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-all min-h-[42px]"
              >
                Check In Shift
              </button>
              <button
                onClick={handleCheckOut}
                disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
                className="px-5 py-3 bg-[#E64833] hover:bg-[#cc3d29] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-all min-h-[42px]"
              >
                Check Out Shift
              </button>
            </div>
          </div>

          {!todayRecord?.checkIn && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider">Arrival Remarks / Notes</label>
              <input
                type="text"
                placeholder="e.g. Client site direct check-in, delays..."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="input-field text-xs"
              />
            </div>
          )}
        </div>

        {/* Shift stats */}
        <div className="card-base p-5 border border-[#90AEAD]/10 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm mb-3">Attendance Stats (Month)</h3>
            <div className="space-y-2.5 text-xs text-[#90AEAD]">
              <div className="flex justify-between"><span>Present Days</span><span className="font-bold text-[#244855] dark:text-white">{presentDays} days</span></div>
              <div className="flex justify-between"><span>Late Arrivals</span><span className="font-bold text-amber-500">{lateDays} days</span></div>
              <div className="flex justify-between"><span>Leaves Taken</span><span className="font-bold text-blue-500">{leaves} days</span></div>
              <div className="flex justify-between"><span>Average Hours Logged</span><span className="font-bold text-green-500">8.2 hrs/day</span></div>
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-[#90AEAD]/10 text-[10px] text-[#90AEAD] flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-green-500" /> Attendance threshold: 96% (Good)
          </div>
        </div>
      </div>

      {/* Visual calendar display */}
      <div className="card-base p-6 border border-[#90AEAD]/10">
        <div className="flex items-center justify-between mb-4.5">
          <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm flex items-center gap-1">
            <Calendar className="w-4 h-4 text-[#E64833]" /> Monthly Attendance Calendar
          </h3>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded bg-[#f8fafb] dark:bg-[#1a2d38] border border-[#90AEAD]/20"><ChevronLeft className="w-3.5 h-3.5 text-[#90AEAD]" /></button>
            <span className="text-xs font-bold text-[#244855] dark:text-white px-2.5">{currentMonth}</span>
            <button className="p-1 rounded bg-[#f8fafb] dark:bg-[#1a2d38] border border-[#90AEAD]/20"><ChevronRight className="w-3.5 h-3.5 text-[#90AEAD]" /></button>
          </div>
        </div>

        {/* Visual Grid representing days */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-[#90AEAD]">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {/* Mock days offset (April starts on Wednesday) */}
          {[null, null, null].map((_, i) => <div key={`empty-${i}`} className="h-10 bg-[#f8fafb]/20 dark:bg-[#1a2d38]/10 rounded-lg" />)}
          {Array.from({ length: 30 }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `2026-04-${dayNum.toString().padStart(2, '0')}`;
            const record = attendance.find(a => (a.userId === user?.id || a.userId === 'agent-1') && a.date === dateStr);
            
            let bgStyle = 'bg-white dark:bg-[#1a2d38] text-[#244855] dark:text-white border border-[#90AEAD]/10';
            if (record) {
              if (record.status === 'present') bgStyle = 'bg-green-500 text-white shadow-md';
              else if (record.status === 'late') bgStyle = 'bg-amber-500 text-white shadow-md';
              else bgStyle = 'bg-red-500 text-white shadow-md';
            } else if (dayNum === 26) {
              bgStyle = 'bg-red-500 text-white shadow-md'; // Mock Sunday/Absent
            }

            return (
              <div key={dayNum} className={`h-10 rounded-lg flex items-center justify-center font-bold text-xs relative cursor-pointer hover:opacity-80 transition-opacity ${bgStyle}`}>
                {dayNum}
                {record?.checkIn && (
                  <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4.5 justify-center flex-wrap mt-4 text-[10px] font-bold uppercase tracking-wider text-[#90AEAD]">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-full" /> Present</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full" /> Late Arrival</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-full" /> Absent</div>
        </div>
      </div>

      {/* Attendance History log */}
      <div className="card-base border border-[#90AEAD]/10 overflow-hidden">
        <div className="p-4 border-b border-[#90AEAD]/10 font-bold text-sm text-[#244855] dark:text-white">Attendance Log Registry</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafb] dark:bg-[#1a2d38] border-b border-[#90AEAD]/10 text-xs font-bold uppercase tracking-wider text-[#90AEAD]">
                <th className="px-5 py-4">Work Date</th>
                <th className="px-5 py-4">Check-In Time</th>
                <th className="px-5 py-4">Check-Out Time</th>
                <th className="px-5 py-4">GPS Location Pin</th>
                <th className="px-5 py-4">Remarks</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90AEAD]/10 font-semibold text-[#244855] dark:text-[#90AEAD]">
              {myAttendance.map(record => (
                <tr key={record.id} className="hover:bg-[#f8fafb]/60 dark:hover:bg-[#244855]/10">
                  <td className="px-5 py-3.5 font-bold">{formatDate(record.date)}</td>
                  <td className="px-5 py-3.5">{record.checkIn || '--:--'}</td>
                  <td className="px-5 py-3.5">{record.checkOut || '--:--'}</td>
                  <td className="px-5 py-3.5 flex items-center gap-1.5 pt-4">
                    {record.location ? (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-[#E64833]" />
                        <span className="truncate max-w-[160px]">{record.location}</span>
                      </>
                    ) : (
                      <span className="text-[#90AEAD]/60 italic">--</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">{record.notes || 'No remarks'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
