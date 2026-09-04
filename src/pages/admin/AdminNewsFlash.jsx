import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, Bell, Trash2, Edit2, CheckCircle, XCircle, Loader2, Link as LinkIcon, X, Save } from 'lucide-react';

const AdminNewsFlash = () => {
  const [items, setItems] = useState([]);
  const [selectedNewsIds, setSelectedNewsIds] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{"role":"ADMIN"}');
  const isAdmin = (currentUser?.role || 'ADMIN').toUpperCase() === 'ADMIN';
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ content: '', link: '', is_active: true, priority: 0 });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch((window.API_BASE || "") + '/api/admin/news-flash', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      if (data.success) setItems(data.news);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ content: item.content, link: item.link || '', is_active: item.is_active, priority: item.priority });
    } else {
      setEditingItem(null);
      setFormData({ content: '', link: '', is_active: true, priority: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const url = editingItem ? `/api/admin/news-flash/${editingItem.id}` : '/api/admin/news-flash';
    const method = editingItem ? 'PATCH' : 'POST';

    try {
      const res = await fetch((window.API_BASE || "") + url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchNews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news flash?')) return;
    try {
      const res = await fetch((window.API_BASE || "") + `/api/admin/news-flash/${id}`, { 
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      if (data.success) fetchNews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAllNews = (e) => {
    if (e.target.checked) {
      setSelectedNewsIds(items.map(item => item.id));
    } else {
      setSelectedNewsIds([]);
    }
  };

  const handleSelectNews = (id, e) => {
    if (e) e.stopPropagation();
    if (selectedNewsIds.includes(id)) {
      setSelectedNewsIds(selectedNewsIds.filter(i => i !== id));
    } else {
      setSelectedNewsIds([...selectedNewsIds, id]);
    }
  };

  const handleBulkDeleteNews = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedNewsIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedNewsIds.length} selected news flash item(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch((window.API_BASE || "") + '/api/admin/news-flash/bulk-delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ ids: selectedNewsIds })
      });
      const data = await response.json();
      if (data.success) {
        setItems(items.filter(item => !selectedNewsIds.includes(item.id)));
        setSelectedNewsIds([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setItems(items.filter(item => !selectedNewsIds.includes(item.id)));
      setSelectedNewsIds([]);
    }
  };

  const toggleStatus = async (item) => {
    try {
      const res = await fetch((window.API_BASE || "") + `/api/admin/news-flash/${item.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      const data = await res.json();
      if (data.success) fetchNews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1600px] mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Zap size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">News Flash</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm italic">Broadcast important announcements across the website footer.</p>
        </div>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <label className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 shadow-sm">
              <input 
                type="checkbox"
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                checked={items.length > 0 && selectedNewsIds.length === items.length}
                onChange={handleSelectAllNews}
              />
              Select All
            </label>
          )}
          {isAdmin && selectedNewsIds.length > 0 && (
            <button
              onClick={handleBulkDeleteNews}
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-semibold shadow-sm transition-all"
            >
              <Trash2 size={16} />
              Delete Selected ({selectedNewsIds.length})
            </button>
          )}
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-medium text-sm hover:bg-brand-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
          >
            <Plus size={18} /> Create Announcement
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm font-medium uppercase tracking-widest italic">Fetching highlights...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-20 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-brand-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Silence is golden?</h3>
            <p className="text-slate-400 text-sm italic">You haven't created any news flash announcements yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className={`group glass-card rounded-2xl border transition-all duration-300 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${item.is_active ? 'border-brand-100 shadow-md hover:shadow-xl' : 'border-slate-100 opacity-60 hover:opacity-100 shadow-sm'}`}
            >
              <div className="flex-1 flex items-center gap-4">
                <input 
                  type="checkbox"
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                  checked={selectedNewsIds.includes(item.id)}
                  onChange={(e) => handleSelectNews(item.id, e)}
                />
                <div className={`shrink-0 p-2 rounded-xl h-fit ${item.is_active ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-400'}`}>
                  <Zap size={18} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900 leading-relaxed">{item.content}</p>
                  {item.link && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-brand-600">
                      <LinkIcon size={12} />
                      <span>{item.link}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-[10px] font-medium uppercase text-slate-300 tracking-widest">Priority: {item.priority}</span>
                    <span className="text-[10px] font-medium uppercase text-slate-300 tracking-widest">•</span>
                    <span className="text-[10px] font-medium uppercase text-slate-300 tracking-widest">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <button 
                  onClick={() => toggleStatus(item)}
                  className={`p-3 rounded-xl transition-all ${item.is_active ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  title={item.is_active ? "Deactivate" : "Activate"}
                >
                  {item.is_active ? <CheckCircle size={20} /> : <XCircle size={20} />}
                </button>
                <button 
                  onClick={() => handleOpenModal(item)}
                  className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
                  title="Edit"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Editor */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-35 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transform-gpu"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-50 my-auto transform-gpu"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                      <Plus size={20} />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                      {editingItem ? 'Edit Announcement' : 'New Flash News'}
                    </h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2">Announcement Content</label>
                    <textarea 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all h-32 resize-none"
                      placeholder="e.g. 🚀 Big News: Top UK Universities offering 1 year pathway program!"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2">Link (Optional)</label>
                      <input 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 focus:outline-none focus:border-brand-300 transition-all"
                        placeholder="https://fetc.in/..."
                        value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2">Priority Level</label>
                      <input 
                        type="number"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 focus:outline-none focus:border-brand-300 transition-all"
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900">Active Status</p>
                      <p className="text-[10px] text-slate-400 font-medium">Show this news flash on the website immediately.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-brand-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_active ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 rounded-2xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="flex-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-medium text-sm hover:bg-brand-600 transition-all shadow-xl flex items-center justify-center gap-2 group"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
                      {editingItem ? 'Update Broadcast' : 'Launch News'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminNewsFlash;


