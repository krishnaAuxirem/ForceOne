import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { MOCK_BLOGS } from '@/lib/mockData';
import { formatDate, truncate } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700',
  Management: 'bg-green-100 text-green-700',
  'Case Study': 'bg-purple-100 text-purple-700',
  Trends: 'bg-orange-100 text-orange-700',
};

export default function BlogPreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const featured = MOCK_BLOGS[0];
  const others = MOCK_BLOGS.slice(1, 4);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#FBE9D0]/20 dark:bg-[#152c35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 reveal">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E64833]/10 border border-[#E64833]/20 text-[#E64833] text-sm font-semibold mb-4">
              Latest Insights
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-[#244855] dark:text-white">
              Field Force <span className="text-[#E64833]">Intelligence Blog</span>
            </h2>
          </div>
          <Link to="/blog" className="hidden md:flex items-center gap-2 text-[#244855] dark:text-[#90AEAD] font-semibold hover:text-[#E64833] transition-colors">
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Featured */}
          <Link to={`/blog/${featured.id}`} className="lg:col-span-3 reveal group">
            <div className="card-base overflow-hidden hover:-translate-y-1 transition-transform h-full flex flex-col">
              <div className="relative overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${CATEGORY_COLORS[featured.category] || 'bg-gray-100 text-gray-700'}`}>
                    {featured.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold font-display text-[#244855] dark:text-white mb-3 group-hover:text-[#E64833] transition-colors">
                  {featured.title}
                </h3>
                <p className="text-[#90AEAD] text-sm leading-relaxed flex-1 mb-4">{truncate(featured.excerpt, 140)}</p>
                <div className="flex items-center gap-4 text-xs text-[#90AEAD]">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(featured.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                  <span className="font-medium text-[#244855] dark:text-white">{featured.author}</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Others */}
          <div className="lg:col-span-2 space-y-5 reveal" style={{ transitionDelay: '0.1s' }}>
            {others.map((post, i) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group block">
                <div className="card-base overflow-hidden flex gap-4 p-4 hover:-translate-y-0.5 transition-transform" style={{ transitionDelay: `${i * 0.05}s` }}>
                  <img src={post.image} alt={post.title} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {post.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#244855] dark:text-white mt-1.5 mb-1 leading-tight group-hover:text-[#E64833] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-[#90AEAD]">
                      <span>{formatDate(post.date)}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            <Link to="/blog" className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#244855]/20 text-[#244855] dark:text-white font-semibold text-sm hover:bg-[#244855] hover:text-white dark:hover:bg-white dark:hover:text-[#244855] transition-all min-h-[44px]">
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
