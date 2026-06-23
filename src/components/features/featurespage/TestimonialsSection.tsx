import { Star, MessageSquare } from 'lucide-react';

const REVIEWS = [
  {
    quote: "Force1 replaced three legacy platforms for us. We now track 400 delivery agents, verify delivery routes, and approve expenses in a single web pane. Our mileage cost audit duration plummeted by 80%.",
    author: "Rohan Kulkarni",
    role: "VP Operations, Apollo Logistics",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    quote: "Geofenced check-ins solved our buddy-punching problem overnight. Agents can't fake their clock-in coordinates anymore. Our service ticket completion SLA increased from 82% to 96%.",
    author: "Shreya Ghoshal",
    role: "National Sales Director, Blue Dart Group",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face",
  },
  {
    quote: "The SQLite offline database is a lifesaver. Our field engineers perform infrastructure inspection inside basement storage bunkers with absolutely no cell signal. The app caches the files and auto-syncs instantly when they surface.",
    author: "Abhinav Bindra",
    role: "Head of Infrastructure, Airtel Towers",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#0d1f28] relative border-t border-[#90AEAD]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <MessageSquare className="w-4 h-4" /> Customer Reviews
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            See how operations managers and dispatchers achieve flawless execution on the ground using Force1.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-[#1a2d38] p-6.5 rounded-3xl border border-[#90AEAD]/20 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 text-[#E64833] fill-current" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-200 italic leading-relaxed mb-6">
                  "{review.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3.5 pt-5 border-t border-[#90AEAD]/10">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[#E64833]"
                />
                <div>
                  <h5 className="font-bold text-sm text-[#244855] dark:text-white leading-tight">
                    {review.author}
                  </h5>
                  <p className="text-[10px] text-[#90AEAD] font-semibold mt-0.5">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
