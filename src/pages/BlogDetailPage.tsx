import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Twitter, Linkedin, Facebook, Newspaper } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_BLOGS } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';
import { toast } from 'sonner';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [blogs] = useLocalStorage<BlogPost[]>('force1_blogs', MOCK_BLOGS);
  const navigate = useNavigate();
  const post = blogs.find(b => b.id === id);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-[#90AEAD] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#244855] mb-3">Post not found</h2>
          <Link to="/blog" className="btn-primary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
        </div>
      </div>
    );
  }

  const related = blogs.filter(b => b.id !== post.id && b.category === post.category).slice(0, 3);
  const shareUrl = window.location.href;

  return (
    <main className="pt-16">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#244855]/90 via-[#244855]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#FBE9D0]/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E64833] text-white mb-3 inline-block">{post.category}</span>
          <h1 className="text-2xl md:text-4xl font-bold text-white font-display leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-[#90AEAD]/20">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#244855] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#244855] dark:text-white">{post.author}</p>
              <p className="text-xs text-[#90AEAD]">Force1 Team</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-sm text-[#90AEAD]"><Calendar className="w-4 h-4" />{formatDate(post.date)}</span>
          <span className="flex items-center gap-1 text-sm text-[#90AEAD]"><Clock className="w-4 h-4" />{post.readTime}</span>
          <div className="ml-auto flex items-center gap-2">
            {[
              { icon: Twitter, url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`, label: 'Twitter', color: 'hover:bg-sky-100 hover:text-sky-500' },
              { icon: Linkedin, url: `https://linkedin.com/shareArticle?url=${shareUrl}`, label: 'LinkedIn', color: 'hover:bg-blue-100 hover:text-blue-600' },
              { icon: Facebook, url: `https://facebook.com/sharer/sharer.php?u=${shareUrl}`, label: 'Facebook', color: 'hover:bg-blue-50 hover:text-blue-500' },
            ].map(({ icon: Icon, url, label, color }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                className={`p-2 rounded-lg text-[#90AEAD] ${color} transition-all`} aria-label={label}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success('Link copied!'); }}
              className="p-2 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n\n').map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return <h3 key={i} className="text-xl font-bold text-[#244855] dark:text-white font-display mt-8 mb-3">{para.replace(/\*\*/g, '')}</h3>;
            }
            if (para.startsWith('1.') || para.startsWith('- ')) {
              const items = para.split('\n').filter(Boolean);
              return (
                <ul key={i} className="space-y-2 my-4">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[#244855]/80 dark:text-[#90AEAD]">
                      <div className="w-2 h-2 rounded-full bg-[#E64833] flex-shrink-0 mt-2.5" />
                      <span>{item.replace(/^[0-9]+\.\s|^-\s/, '')}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="text-base text-[#244855]/80 dark:text-[#90AEAD] leading-relaxed mb-4">{para}</p>;
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#90AEAD]/20">
          {post.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#244855]/8 dark:bg-[#244855]/30 text-[#244855] dark:text-[#90AEAD] rounded-full text-sm font-medium">
              <Tag className="w-3.5 h-3.5" />{tag}
            </span>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold font-display text-[#244855] dark:text-white mb-6">Related Articles</h3>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map(r => (
                <Link key={r.id} to={`/blog/${r.id}`} className="group card-base overflow-hidden hover:-translate-y-1">
                  <img src={r.image} alt={r.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-4">
                    <p className="font-bold text-sm text-[#244855] dark:text-white group-hover:text-[#E64833] transition-colors leading-tight">{r.title}</p>
                    <p className="text-xs text-[#90AEAD] mt-1.5">{r.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link to="/blog" className="btn-outline inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
        </div>
      </div>
    </main>
  );
}
