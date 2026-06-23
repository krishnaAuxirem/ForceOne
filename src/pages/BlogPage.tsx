import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Tag } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_BLOGS } from '@/lib/mockData';
import { formatDate, truncate } from '@/lib/utils';
import type { BlogPost } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700',
  Management: 'bg-green-100 text-green-700',
  'Case Study': 'bg-purple-100 text-purple-700',
  Trends: 'bg-orange-100 text-orange-700',
};

const CATEGORIES = ['All', 'Technology', 'Management', 'Case Study', 'Trends'];

export default function BlogPage() {
  const [blogs] = useLocalStorage<BlogPost[]>('force1_blogs', MOCK_BLOGS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = blogs.filter(b => {
    const matchesSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || b.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="pt-16">
      <section className="py-16 gradient-teal">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold font-display text-white mb-4">Force1 <span className="text-[#E64833]">Blog</span></h1>
          <p className="text-xl text-[#90AEAD] mb-8">Insights, guides, and case studies on field force management.</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#90AEAD]" />
            <input className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-[#244855] placeholder:text-[#90AEAD] focus:outline-none focus:ring-2 focus:ring-[#E64833]/30 text-base"
              placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-[#0d1f28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${category === cat ? 'bg-[#244855] text-white shadow-force' : 'border border-[#90AEAD]/30 text-[#244855] dark:text-[#90AEAD] hover:border-[#244855] dark:hover:border-[#90AEAD]'}`}>
                {cat}
              </button>
            ))}
            <span className="ml-auto py-2.5 text-sm text-[#90AEAD] flex items-center">{filtered.length} articles</span>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-[#90AEAD] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#244855] dark:text-white mb-2">No posts found</h3>
              <p className="text-[#90AEAD]">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group card-base overflow-hidden hover:-translate-y-1 flex flex-col">
                  <div className="relative overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700'}`}>{post.category}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold font-display text-[#244855] dark:text-white mb-2 group-hover:text-[#E64833] transition-colors leading-tight flex-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#90AEAD] leading-relaxed mb-4">{truncate(post.excerpt, 100)}</p>
                    <div className="flex items-center gap-3 text-xs text-[#90AEAD] pt-3 border-t border-[#90AEAD]/15">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(post.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                    </div>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-[#244855]/8 dark:bg-[#244855]/30 text-[#244855] dark:text-[#90AEAD] rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3" />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
