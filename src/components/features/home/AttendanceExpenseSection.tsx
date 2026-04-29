import { useEffect, useRef } from 'react';
import { Clock, MapPin, CheckCircle2, DollarSign, Upload, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ATTENDANCE_LOG = [
  { name: 'Rahul S.', time: '09:02 AM', status: 'checked-in', location: 'Andheri Office', avatar: 'RS' },
  { name: 'Sneha D.', time: '08:58 AM', status: 'checked-in', location: 'Bandra Field', avatar: 'SD' },
  { name: 'Kiran J.', time: '09:45 AM', status: 'late', location: 'Powai Zone', avatar: 'KJ' },
  { name: 'Vijay K.', time: '—', status: 'absent', location: '—', avatar: 'VK' },
];

const STATUS_STYLE: Record<string, string> = {
  'checked-in': 'bg-green-100 text-green-700',
  'late': 'bg-amber-100 text-amber-700',
  'absent': 'bg-red-100 text-red-700',
};

export default function AttendanceExpenseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#FBE9D0]/20 dark:bg-[#152c35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 reveal">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Attendance & <span className="text-[#E64833]">Expense Management</span>
          </h2>
          <p className="text-lg text-[#90AEAD]">Eliminate manual processes. GPS-verified attendance and digital expense flows in one platform.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Attendance card */}
          <div className="reveal card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-[#244855] rounded-2xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#244855] dark:text-white font-display">Attendance System</h3>
                <p className="text-xs text-[#90AEAD]">GPS-verified check-in/out • Today's status</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-xs font-semibold text-green-700">Live</span>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {ATTENDANCE_LOG.map((entry, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafb] dark:bg-[#244855]/20">
                  <div className="w-9 h-9 rounded-full bg-[#244855] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {entry.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#244855] dark:text-white">{entry.name}</p>
                    <div className="flex items-center gap-1 text-xs text-[#90AEAD]">
                      <MapPin className="w-3 h-3" />{entry.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#244855] dark:text-white">{entry.time}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[entry.status]}`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#90AEAD]/20">
              {[
                { label: 'Present', value: '38', color: 'text-green-600' },
                { label: 'Late', value: '4', color: 'text-amber-600' },
                { label: 'Absent', value: '3', color: 'text-red-500' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-[#90AEAD]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expense card */}
          <div className="reveal card-base p-6" style={{ transitionDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-[#E64833] rounded-2xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#244855] dark:text-white font-display">Expense Management</h3>
                <p className="text-xs text-[#90AEAD]">Submit, review & approve expenses digitally</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {[
                { title: 'Auto Rickshaw Fare', agent: 'Rahul S.', amount: '₹850', status: 'pending', category: 'Travel' },
                { title: 'Client Refreshments', agent: 'Sneha D.', amount: '₹450', status: 'approved', category: 'Entertainment' },
                { title: 'Printing Materials', agent: 'Kiran J.', amount: '₹1,200', status: 'approved', category: 'Office' },
              ].map((exp, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafb] dark:bg-[#244855]/20">
                  <div className="w-9 h-9 rounded-xl bg-[#E64833]/10 flex items-center justify-center flex-shrink-0">
                    <Upload className="w-4 h-4 text-[#E64833]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#244855] dark:text-white truncate">{exp.title}</p>
                    <p className="text-xs text-[#90AEAD]">{exp.agent} · {exp.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#244855] dark:text-white">{exp.amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${exp.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {exp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Approve button */}
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#244855] text-white rounded-xl font-semibold text-sm hover:bg-[#1a3340] transition-all">
              <ThumbsUp className="w-4 h-4" /> Approve Pending Expenses
            </button>
          </div>
        </div>

        <div className="text-center mt-10 reveal">
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Get Started Free — No Credit Card
          </Link>
        </div>
      </div>
    </section>
  );
}
