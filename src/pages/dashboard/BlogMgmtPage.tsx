import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_BLOGS } from '@/lib/mockData';
import type { BlogPost } from '@/types';
import {
  Newspaper, Plus, Search, Filter, Trash2, Edit3, Eye, Calendar,
  User, Clock, PlusCircle, CheckCircle, Tag, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { generateId, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function BlogMgmtPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useLocalStorage<BlogPost[]>('force1_blogs', MOCK_BLOGS);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Selected item states
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<BlogPost | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    readTime: '5 min read',
    tags: '',
  });

  // Filter blogs
  const filteredBlogs = blogs.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.excerpt || !formState.content) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const tagList = formState.tags
      ? formState.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [formState.category];

    const newPost: BlogPost = {
      id: generateId(),
      title: formState.title,
      excerpt: formState.excerpt,
      content: formState.content,
      author: user?.name || 'Administrator',
      date: new Date().toISOString().split('T')[0],
      category: formState.category,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      readTime: formState.readTime,
      tags: tagList,
    };

    setBlogs(prev => [newPost, ...prev]);
    setIsCreateOpen(false);
    toast.success('Blog article published successfully!');
    resetForm();
  };

  const handleEditBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogToEdit) return;
    if (!formState.title || !formState.excerpt || !formState.content) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const tagList = formState.tags
      ? formState.tags.split(',').map(t => t.trim()).filter(Boolean)
      : blogToEdit.tags;

    setBlogs(prev => prev.map(b => b.id === blogToEdit.id ? { 
      ...b, 
      ...formState, 
      tags: tagList 
    } : b));

    setIsEditOpen(false);
    setBlogToEdit(null);
    toast.success('Blog article updated successfully!');
  };

  const openEditModal = (post: BlogPost) => {
    setBlogToEdit(post);
    setFormState({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      readTime: post.readTime,
      tags: post.tags.join(', '),
    });
    setIsEditOpen(true);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this blog post?')) {
      setBlogs(prev => prev.filter(b => b.id !== id));
      toast.success('Blog article deleted.');
      if (selectedBlog?.id === id) setSelectedBlog(null);
    }
  };

  const resetForm = () => {
    setFormState({
      title: '',
      excerpt: '',
      content: '',
      category: 'Technology',
      readTime: '5 min read',
      tags: '',
    });
  };

  const blogCategories = ['Technology', 'Management', 'Case Study', 'Trends'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Newspaper className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">Blog Administration</h1>
          </div>
          <p className="text-white/70 text-sm">Publish and edit case studies, trends, technology guides, and field management articles.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-white font-bold text-sm shadow transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Create New Post
        </button>
      </div>

      {/* Analytics block */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Published Articles', value: blogs.length, sub: 'Total articles live', color: 'bg-[#244855]' },
          { label: 'Guides & Tech', value: blogs.filter(b => b.category === 'Technology').length, sub: 'AI and software topics', color: 'bg-[#874F41]' },
          { label: 'Management Topics', value: blogs.filter(b => b.category === 'Management').length, sub: 'Distributed workforce tips', color: 'bg-[#E64833]' },
          { label: 'Avg Read Duration', value: '6 mins', sub: 'Average reading time', color: 'bg-green-500' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-5 border border-[#90AEAD]/10">
            <div className={`w-2 h-8 ${stat.color} rounded-full absolute left-0 top-1/2 -translate-y-1/2`} />
            <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{stat.value}</p>
            <p className="text-xs font-semibold text-[#244855]/90 dark:text-[#90AEAD]">{stat.label}</p>
            <p className="text-[10px] text-[#90AEAD]/80 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="card-base p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-[#90AEAD]/10">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90AEAD]" />
          <input
            type="text"
            placeholder="Search by article title, author, keyword..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input-field pl-9"
          />
        </div>
        <div>
          <select 
            value={categoryFilter} 
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All Blog Categories</option>
            {blogCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Datatable */}
      <div className="card-base border border-[#90AEAD]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafb] dark:bg-[#1a2d38] border-b border-[#90AEAD]/10 text-xs font-bold uppercase tracking-wider text-[#90AEAD]">
                <th className="px-5 py-4">Title & Excerpt</th>
                <th className="px-5 py-4">Author</th>
                <th className="px-5 py-4">Publish Date</th>
                <th className="px-5 py-4">Read Time</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90AEAD]/10 text-sm">
              {paginatedBlogs.map(post => (
                <tr key={post.id} className="hover:bg-[#f8fafb] dark:hover:bg-[#244855]/10 transition-colors">
                  <td className="px-5 py-4 max-w-xs">
                    <div className="font-bold text-[#244855] dark:text-white truncate">{post.title}</div>
                    <div className="text-xs text-[#90AEAD] truncate mt-1">{post.excerpt}</div>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#244855] dark:text-white">
                    {post.author}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#244855] dark:text-white">
                    {formatDate(post.date)}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#244855] dark:text-white">
                    {post.readTime}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#244855]/10 text-[#244855] dark:text-[#90AEAD]">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBlog(post)}
                        title="View Article"
                        className="p-2 rounded-xl text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(post)}
                        title="Edit Article"
                        className="p-2 rounded-xl text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(post.id)}
                        title="Delete Article"
                        className="p-2 rounded-xl text-[#90AEAD] hover:bg-red-50 hover:text-red-500 transition-all min-h-[36px]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedBlogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#90AEAD] text-xs">
                    No articles found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#f8fafb] dark:bg-[#1a2d38] border-t border-[#90AEAD]/10 flex items-center justify-between">
            <span className="text-xs text-[#90AEAD]">
              Showing <span className="font-bold text-[#244855] dark:text-white">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-[#244855] dark:text-white">
                {Math.min(startIndex + itemsPerPage, filteredBlogs.length)}
              </span>{' '}
              of <span className="font-bold text-[#244855] dark:text-white">{filteredBlogs.length}</span> articles
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

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-2xl overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">Write Blog Post</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateBlog} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Article Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Field accountability insights"
                  value={formState.title}
                  onChange={e => setFormState(f => ({ ...f, title: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Summary Excerpt *</label>
                <input
                  type="text"
                  placeholder="Brief summary sentence..."
                  value={formState.excerpt}
                  onChange={e => setFormState(f => ({ ...f, excerpt: e.target.value }))}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Article Body Content *</label>
                <textarea
                  placeholder="Draft your thoughts here..."
                  value={formState.content}
                  onChange={e => setFormState(f => ({ ...f, content: e.target.value }))}
                  className="input-field resize-none text-xs"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState(f => ({ ...f, category: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    {blogCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Read Duration</label>
                  <input
                    type="text"
                    value={formState.readTime}
                    onChange={e => setFormState(f => ({ ...f, readTime: e.target.value }))}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. AI, Accountability, Management"
                  value={formState.tags}
                  onChange={e => setFormState(f => ({ ...f, tags: e.target.value }))}
                  className="input-field text-xs"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-xl font-bold text-sm shadow transition-all mt-2">
                Publish Article
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && blogToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-2xl overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">Edit Blog Post</h3>
              <button onClick={() => { setIsEditOpen(false); setBlogToEdit(null); }} className="p-1 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleEditBlog} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Article Title *</label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={e => setFormState(f => ({ ...f, title: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Summary Excerpt *</label>
                <input
                  type="text"
                  value={formState.excerpt}
                  onChange={e => setFormState(f => ({ ...f, excerpt: e.target.value }))}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Article Body Content *</label>
                <textarea
                  value={formState.content}
                  onChange={e => setFormState(f => ({ ...f, content: e.target.value }))}
                  className="input-field resize-none text-xs"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState(f => ({ ...f, category: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    {blogCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Read Duration</label>
                  <input
                    type="text"
                    value={formState.readTime}
                    onChange={e => setFormState(f => ({ ...f, readTime: e.target.value }))}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formState.tags}
                  onChange={e => setFormState(f => ({ ...f, tags: e.target.value }))}
                  className="input-field text-xs"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-[#244855] hover:bg-[#1a3340] text-white rounded-xl font-bold text-sm shadow transition-all mt-2">
                Save Article Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-2xl overflow-hidden shadow-xl animate-scale-in max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between bg-[#244855]/5 flex-shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#90AEAD] tracking-widest">{selectedBlog.category} Article Preview</span>
                <h3 className="text-base font-bold text-[#244855] dark:text-white font-display mt-0.5">{selectedBlog.title}</h3>
              </div>
              <button onClick={() => setSelectedBlog(null)} className="p-1.5 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="flex gap-4 text-xs text-[#90AEAD] flex-wrap border-b border-[#90AEAD]/10 pb-3">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{selectedBlog.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(selectedBlog.date)}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selectedBlog.readTime}</span>
              </div>
              
              <p className="text-xs font-bold text-[#244855]/80 dark:text-[#90AEAD] italic bg-[#f8fafb] dark:bg-[#244855]/10 p-4 rounded-xl border-l-4 border-[#E64833]">
                "{selectedBlog.excerpt}"
              </p>

              <div className="text-xs text-[#244855]/95 dark:text-[#90AEAD] whitespace-pre-wrap leading-relaxed">
                {selectedBlog.content}
              </div>

              <div className="flex items-center gap-1.5 pt-4 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-[#E64833]" />
                {selectedBlog.tags.map(t => (
                  <span key={t} className="text-[10px] font-bold px-2 py-0.5 bg-[#244855]/10 text-[#244855] dark:text-[#90AEAD] rounded-md">#{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
