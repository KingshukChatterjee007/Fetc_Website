import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Plus, Search, Calendar, Loader2, Save, Globe } from 'lucide-react';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostData, setNewPostData] = useState({ title: "", slug: "" });
  const [isSaving, setIsSaving] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE||'') + '/api/admin/posts');
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFinalCreate = async () => {
    if (!newPostData.title || !newPostData.slug) return;
    
    let slug = newPostData.slug;
    if (!slug.startsWith('/blog/')) {
       slug = slug.startsWith('/') ? '/blog' + slug : '/blog/' + slug;
    }

    setIsSaving(true);
    try {
      const response = await fetch((window.API_BASE||'') + '/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newPostData.title, slug }),
      });
      const data = await response.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setShowCreateModal(false);
        setNewPostData({ title: "", slug: "" });
      }
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div className="relative">
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-brand-200/20 rounded-full blur-[60px] pointer-events-none" />
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2 relative z-10">Content Hub</h1>
          <p className="text-slate-500 font-medium text-sm italic relative z-10">Manage your blog posts, articles, and insights.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold text-xs uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" /> New Blog Post
        </button>
      </div>

      <div className="glass-card rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden mb-16">
        <div className="p-10 border-b border-white/20 flex flex-wrap items-center justify-between gap-6 bg-white/20">
          <div className="relative flex-1 max-w-md group text-slate-400 focus-within:text-brand-600 transition-colors">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
            <input 
              className="w-full pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-8 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
              placeholder="Search posts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <Loader2 className="animate-spin text-brand-600" size={18} />}
        </div>

        <div className="p-8">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="glass-card rounded-2xl p-8 transition-all cursor-pointer group relative active:scale-[0.99] border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex justify-between items-start mb-8 relative z-10 mt-2">
                    <div className="p-4 bg-slate-50 text-brand-600 rounded-xl border border-slate-100 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                      <Share2 size={22} />
                    </div>
                    <div className="flex flex-col items-end gap-2.5">
                      <span className={`text-[9px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-xl border shadow-xs ${post.status === 'PUBLISHED' 
                        ? 'bg-emerald-400/5 text-emerald-600 border-emerald-400/20' 
                        : 'bg-amber-400/5 text-amber-600 border-amber-400/20'
                        }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 mb-8">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 truncate tracking-tight">{post.title}</h3>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                      <Globe size={12} className="opacity-40" /> {post.slug}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100/60 relative z-10">
                    <div className="flex items-center gap-2 text-slate-400 uppercase text-[9px] font-medium tracking-widest opacity-60">
                      <Calendar size={11} /> {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                      <Save size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="text-slate-200" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">No blog posts found</h3>
              <p className="text-slate-400 text-sm">Create your first story to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[35] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transform-gpu"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8 border border-slate-100 z-50 my-auto transform-gpu"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">New Blog Post</h2>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Share a new story</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">Post Title</label>
                  <input
                    autoFocus
                    placeholder="e.g. 10 Tips for IELTS Success"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700"
                    value={newPostData.title}
                    onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">URL Slug</label>
                  <input
                    placeholder="/blog/tips-for-ielts"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-500"
                    value={newPostData.slug}
                    onChange={(e) => setNewPostData({ ...newPostData, slug: e.target.value })}
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-medium text-xs hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleFinalCreate}
                    disabled={isSaving || !newPostData.title || !newPostData.slug}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-medium text-xs hover:bg-brand-600 transition-all shadow-xl shadow-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    {isSaving ? "Creating..." : "Create Post"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPosts;


