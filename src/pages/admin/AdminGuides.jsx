import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit, Trash2, ChevronRight, 
  BookOpen, Eye, ArrowLeft, Image as ImageIcon,
  Save, Loader2, Sparkles, AlertCircle
} from 'lucide-react';

import { getAssetUrl } from '../../apiConfig';
import SafeImage from '../../components/SafeImage';

// --- SUB-COMPONENT: EDIT VIEW (Moved outside to prevent hook errors) ---
const EditGuideView = ({ selectedGuide, setSelectedGuide, handleSaveGuide, handleDeleteGuide, isSaving }) => {
    const [isUpdatingPages, setIsUpdatingPages] = useState(false);
    const [pages, setPages] = useState([]);
    const [isFetchingPages, setIsFetchingPages] = useState(false);

    const fetchPages = useCallback(async () => {
        if (!selectedGuide?.slug) return;
        try {
            setIsFetchingPages(true);
            const response = await fetch((window.API_BASE || "") + `/api/guides/${selectedGuide.slug}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await response.json();
            if (data.success) {
                setPages(data.pages);
            }
        } catch (err) {
            console.error('Failed to fetch pages:', err);
        } finally {
            setIsFetchingPages(false);
        }
    }, [selectedGuide?.slug]);

    useEffect(() => {
        if (selectedGuide?.id) {
            fetchPages();
        }
    }, [selectedGuide?.id, fetchPages]);

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await fetch((window.API_BASE || "") + '/api/admin/upload', {
                method: 'POST',
                headers: { 'ngrok-skip-browser-warning': 'true' },
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                const newPage = {
                    image_url: data.url,
                    page_number: pages.length + 1
                };
                setPages([...pages, newPage]);
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const savePages = async () => {
        try {
            setIsUpdatingPages(true);
            const response = await fetch((window.API_BASE || "") + `/api/admin/guides/${selectedGuide.id}/pages`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ pages })
            });
            const data = await response.json();
            if (data.success) {
                alert('Guide pages updated successfully!');
            }
        } catch (err) {
            console.error('Failed to save pages:', err);
        } finally {
            setIsUpdatingPages(false);
        }
    };

    const removePage = (idx) => {
        const updated = pages.filter((_, i) => i !== idx).map((p, i) => ({ ...p, page_number: i + 1 }));
        setPages(updated);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSelectedGuide(null)}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Configure Visual Booklet</h2>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest italic">{selectedGuide.id ? 'Refining Architecture' : 'Drafting Prototype'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50 flex items-center gap-2">
                           <BookOpen size={16} className="text-brand-600" /> Booklet Metadata
                        </h3>
                        <form onSubmit={handleSaveGuide} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium uppercase text-slate-400 tracking-widest pl-1">Identifier (Slug)</label>
                                <input 
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all"
                                    placeholder="career-assessment-guide"
                                    value={selectedGuide.slug || ''}
                                    onChange={e => setSelectedGuide({...selectedGuide, slug: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium uppercase text-slate-400 tracking-widest pl-1">Book Title</label>
                                <input 
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all"
                                    placeholder="Evaluation Guide 2026"
                                    value={selectedGuide.title || ''}
                                    onChange={e => setSelectedGuide({...selectedGuide, title: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium uppercase text-slate-400 tracking-widest pl-1">Brief Narrative</label>
                                <textarea 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all h-24 resize-none"
                                    placeholder="Optional overview of the guide content..."
                                    value={selectedGuide.description || ''}
                                    onChange={e => setSelectedGuide({...selectedGuide, description: e.target.value})}
                                />
                            </div>
                            <button 
                                disabled={isSaving}
                                className="w-full bg-slate-900 text-white rounded-2xl py-4 font-medium text-sm shadow-xl shadow-slate-200 hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {selectedGuide.id ? 'Update Master Record' : 'Initialize Guide'}
                            </button>
                            {selectedGuide.id && (
                                <button 
                                    type="button"
                                    onClick={() => handleDeleteGuide(selectedGuide.id)}
                                    className="w-full bg-white border border-red-50 text-red-500 rounded-2xl py-4 font-medium text-xs hover:bg-red-50 transition-all"
                                >
                                    Permanently Destroy Guide
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {!selectedGuide.id ? (
                        <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-10 text-center bg-slate-50/50">
                            <AlertCircle className="text-slate-200 mb-4" size={48} />
                            <h3 className="text-lg font-semibold text-slate-400 uppercase tracking-widest">Initialize First</h3>
                            <p className="text-sm text-slate-300 font-medium max-w-xs mt-2">You must save the booklet metadata before you can architect its visual contents.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                                        Visual Architecture <span className="bg-brand-50 text-brand-600 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest italic">{pages.length} Pages</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">High Fidelity Page Management</p>
                                </div>
                                <div className="flex gap-3">
                                    <label className="p-3 bg-brand-50 text-brand-600 rounded-2xl cursor-pointer hover:bg-brand-600 hover:text-white transition-all shadow-sm">
                                        <Plus size={20} />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                                    </label>
                                    <button 
                                        onClick={savePages}
                                        disabled={isUpdatingPages}
                                        className="px-6 bg-slate-900 text-white rounded-2xl text-sm font-medium hover:bg-brand-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
                                    >
                                        {isUpdatingPages ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Deploy Pages
                                    </button>
                                </div>
                            </div>

                            {isFetchingPages ? (
                                <div className="py-20 flex flex-col items-center justify-center">
                                   <Loader2 className="animate-spin text-brand-600 mb-4" size={32} />
                                   <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Compiling Visuals...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    {pages.map((page, idx) => (
                                        <motion.div 
                                            key={idx}
                                            layout
                                            className="group relative aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200"
                                        >
                                            <SafeImage src={getAssetUrl(page.image_url)} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="" />
                                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-semibold text-white italic">P.{page.page_number}</span>
                                                <button 
                                                    onClick={() => removePage(idx)}
                                                    className="p-1.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <label className="aspect-[3/4] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all text-slate-300 group">
                                        <ImageIcon size={32} className="group-hover:scale-110 transition-transform text-slate-100" />
                                        <span className="mt-2 text-[8px] font-medium uppercase tracking-[0.2em]">Add Page</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN COMPONENT: ADMIN HUB ---
const AdminGuides = () => {
    const [guides, setGuides] = useState([]);
    const [selectedGuideIds, setSelectedGuideIds] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{"role":"ADMIN"}');
    const isAdmin = (currentUser?.role || 'ADMIN').toUpperCase() === 'ADMIN';
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const fetchGuides = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch((window.API_BASE || "") + '/api/admin/guides', {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await response.json();
            if (data.success) {
                setGuides(data.guides);
            }
        } catch (err) {
            console.error('Failed to fetch guides:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGuides();
    }, [fetchGuides]);

    const handleSaveGuide = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const response = await fetch((window.API_BASE || "") + '/api/admin/guides', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(selectedGuide)
            });
            const data = await response.json();
            if (data.success) {
                fetchGuides();
                setSelectedGuide(null);
            }
        } catch (err) {
            console.error('Failed to save guide:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteGuide = async (id) => {
        if (!window.confirm('Are you absolutely sure? This will delete all guide pages forever.')) return;
        try {
            const response = await fetch((window.API_BASE || "") + `/api/admin/guides/${id}`, { 
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await response.json();
            if (data.success) {
                fetchGuides();
                setSelectedGuide(null);
            }
        } catch (err) {
            console.error('Failed to delete guide:', err);
        }
    };

    const filteredGuidesList = guides.filter(g => 
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        g.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAllGuides = (e) => {
        if (e.target.checked) {
            setSelectedGuideIds(filteredGuidesList.map(g => g.id));
        } else {
            setSelectedGuideIds([]);
        }
    };

    const handleSelectGuide = (id, e) => {
        if (e) e.stopPropagation();
        if (selectedGuideIds.includes(id)) {
            setSelectedGuideIds(selectedGuideIds.filter(i => i !== id));
        } else {
            setSelectedGuideIds([...selectedGuideIds, id]);
        }
    };

    const handleBulkDeleteGuides = async () => {
        if (!isAdmin) {
            alert('Only administrators have access to bulk delete entries.');
            return;
        }
        if (selectedGuideIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedGuideIds.length} selected guide(s)? This action cannot be undone.`)) return;

        try {
            const response = await fetch((window.API_BASE || "") + '/api/admin/guides/bulk-delete', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true' 
                },
                body: JSON.stringify({ ids: selectedGuideIds })
            });
            const data = await response.json();
            if (data.success) {
                setGuides(guides.filter(g => !selectedGuideIds.includes(g.id)));
                setSelectedGuideIds([]);
            } else {
                alert(data.message || 'Bulk delete failed');
            }
        } catch (err) {
            console.error('Bulk delete error:', err);
            setGuides(guides.filter(g => !selectedGuideIds.includes(g.id)));
            setSelectedGuideIds([]);
        }
    };

    return (
        <div className="space-y-10 p-2 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
            {!selectedGuide ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-12"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium tracking-[0.1em] text-slate-500 uppercase">
                                <Sparkles size={12} /> Dynamic Visual Portfolios
                            </span>
                            <h1 className="mt-4 text-3xl lg:text-4xl font-medium tracking-tight text-slate-900 leading-tight">
                                Cinematic <span className="text-brand-600">Booklets</span>
                            </h1>
                            <p className="mt-2 text-base text-slate-500 max-w-xl">Architect breathtaking interactive flipbooks that drive engagement and tell your story with precision.</p>
                        </div>
                        <button 
                            onClick={() => setSelectedGuide({})}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-600 active:scale-95"
                        >
                            <Plus size={18} /> Create New Guide
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 shadow-sm">
                            <input 
                                type="checkbox"
                                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                                checked={filteredGuidesList.length > 0 && selectedGuideIds.length === filteredGuidesList.length}
                                onChange={handleSelectAllGuides}
                            />
                            Select All Guides
                        </label>
                        <div className="relative flex-1 min-w-[280px]">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                 <Search size={20} className="opacity-60" />
                            </div>
                            <input 
                                type="text"
                                placeholder="Locate Guide by Title or Slug..."
                                className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-14 pr-6 text-sm font-medium text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-600/5 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {isAdmin && selectedGuideIds.length > 0 && (
                            <button
                                onClick={handleBulkDeleteGuides}
                                className="flex items-center gap-2 px-4 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                            >
                                <Trash2 size={16} />
                                Delete Selected ({selectedGuideIds.length})
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="py-40 flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-6" />
                            <p className="text-slate-400 font-medium tracking-widest uppercase text-xs italic">Syncing Guide Registry...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGuidesList.map((guide) => (
                                <motion.div 
                                    key={guide.id}
                                    onClick={() => setSelectedGuide(guide)}
                                    className="bg-white border border-slate-100 rounded-2xl p-8 cursor-pointer group hover:border-brand-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-50 rounded-full blur-[80px] group-hover:bg-brand-100 transition-colors opacity-40" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox"
                                                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                                                    checked={selectedGuideIds.includes(guide.id)}
                                                    onChange={(e) => handleSelectGuide(guide.id, e)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 transition-all duration-500 group-hover:bg-brand-600 group-hover:text-white group-hover:rotate-6 group-hover:shadow-2xl group-hover:shadow-brand-200">
                                                    <BookOpen size={28} />
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-medium uppercase tracking-widest px-4 py-2 rounded-full ${guide.is_active ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                                                {guide.is_active ? 'Live Version' : 'Dormant'}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-brand-600 transition-colors mb-2 tracking-tight line-clamp-1">{guide.title}</h3>
                                        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest italic mb-8 font-mono">{guide.slug}</p>

                                        <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-10">
                                            <div className="flex gap-4">
                                                <button className="text-slate-300 hover:text-brand-600 transition-colors"><Eye size={18} /></button>
                                                <button className="text-slate-300 hover:text-indigo-600 transition-colors"><Edit size={18} /></button>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-xl">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            ) : (
                <EditGuideView 
                    selectedGuide={selectedGuide} 
                    setSelectedGuide={setSelectedGuide}
                    handleSaveGuide={handleSaveGuide}
                    handleDeleteGuide={handleDeleteGuide}
                    isSaving={isSaving}
                />
            )}
            </AnimatePresence>
        </div>
    );
};

export default AdminGuides;


