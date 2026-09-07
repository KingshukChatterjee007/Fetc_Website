import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Loader2, Globe, Clock, ChevronRight, X, Save, Edit, Info, Building, GraduationCap, BookOpen, Users, ImageIcon, MapPin, Target, Tag, Sparkles, CheckCircle2, Compass, Send, Trash2, AlertCircle, Award, CreditCard, Upload, Video, Play, FileDown, Folder, Calendar, Download, LayoutGrid } from 'lucide-react';
import { getAssetUrl, getApiUrl } from '../../apiConfig';
import SafeImage from '../../components/SafeImage';

import UditImg from '../../assets/reviews/Udit Gangnami.png';
import MansiImg from '../../assets/reviews/Mansi Savani USA F1 Visa.png';
import NaitikImg from '../../assets/reviews/Naitik Patel Ireland Student Visa.png';
import PrajalImg from '../../assets/reviews/Prajal Sonariya USA F1 Visa.png';
import PrathanaImg from '../../assets/reviews/Prathana Dankhara USA F1 visa.png';
import RutvikImg from '../../assets/reviews/Rutvik Tejani USA F1 Visa.png';
import SamarthImg from '../../assets/reviews/Samarth Pachchigar Spain Student Visa.png';
import HeroBanner1 from '../../assets/logo/banner 1.png';
import HeroBanner2 from '../../assets/logo/banner 2.png';
import HeroBanner3 from '../../assets/logo/banner 3.png';

const defaultTopStudents = [
  { name: "Mansi Savani", achievement: "USA F1 Visa", country: "🇺🇸", image: "", fallbackImage: MansiImg },
  { name: "Naitik Patel", achievement: "Ireland Student Visa", country: "🇮🇪", image: "", fallbackImage: NaitikImg },
  { name: "Prajal Sonariya", achievement: "USA F1 Visa", country: "🇺🇸", image: "", fallbackImage: PrajalImg },
  { name: "Prathana Dankhara", achievement: "USA F1 Visa", country: "🇺🇸", image: "", fallbackImage: PrathanaImg },
  { name: "Rutvik Tejani", achievement: "USA F1 Visa", country: "🇺🇸", image: "", fallbackImage: RutvikImg },
  { name: "Samarth Pachchigar", achievement: "Spain Student Visa", country: "🇪🇸", image: "", fallbackImage: SamarthImg }
];

const AdminPages = () => {
  const uploadHeroBannerImage = async (file, replaceIndex = null) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(getApiUrl('/api/admin/upload'), {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setSelectedPage(prev => {
          if (!prev) return null;
          const newContent = { ...(prev.content || {}) };
          const hero = { ...(newContent.hero || {}) };
          let currentBanners = [...(hero.banners || [HeroBanner1, HeroBanner2, HeroBanner3])];

          if (replaceIndex !== null && currentBanners[replaceIndex] !== undefined) {
            currentBanners[replaceIndex] = data.url;
          } else {
            currentBanners.push(data.url);
          }
          hero.banners = currentBanners;
          newContent.hero = hero;
          return { ...prev, content: newContent };
        });
      }
    } catch (err) {
      console.error('Hero banner upload failed:', err);
      alert('Failed to upload hero banner image.');
    }
  };

  const removeHeroBanner = (index) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const newContent = { ...(prev.content || {}) };
      const hero = { ...(newContent.hero || {}) };
      let currentBanners = [...(hero.banners || [HeroBanner1, HeroBanner2, HeroBanner3])];
      currentBanners.splice(index, 1);
      hero.banners = currentBanners;
      newContent.hero = hero;
      return { ...prev, content: newContent };
    });
  };

  const handleFileUpload = async (section, field, file, customSectionId = null, arrayIndex = null, subSection = null) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(getApiUrl('/api/admin/upload'), {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        if (customSectionId) {
          updateCustomSection(customSectionId, field, data.url);
        } else if (arrayIndex !== null) {
          // Special case for items IN an array (like universities)
          const currentArray = [...(selectedPage.content?.[field] || [])];
          if (currentArray[arrayIndex]) {
            currentArray[arrayIndex] = { ...currentArray[arrayIndex], image: data.url };
            handleContentChange(null, field, currentArray);
          }
        } else if (subSection) {
          handleNestedContentChange(section, subSection, field, data.url);
        } else {
          // Check if the field should be an array (like office showcase images or gallery)
          const currentVal = selectedPage.content?.[section]?.[field] || selectedPage.content?.[field];

          if (selectedPage.slug === '/gallery' && field === 'images') {
            // Special case for Gallery: Add as object
            const current = selectedPage.content.images || [];
            handleContentChange(null, 'images', [...current, { src: data.url, title: "New Moment", category: "Gallery" }]);
          } else if (Array.isArray(currentVal)) {
            handleContentChange(section, field, [...currentVal, data.url]);
          } else {
            handleContentChange(section, field, data.url);
          }
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image. Please try again.');
    }
  };

  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageData, setNewPageData] = useState({ title: "", slug: "" });
  const [activeTab, setActiveTab] = useState("settings"); // "settings" or "content"
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmPageId, setDeleteConfirmPageId] = useState(null);

  const handleDeletePage = async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/pages/${id}`), {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setPages(prev => prev.filter(p => p.id !== id));
        if (selectedPage?.id === id) {
          setSelectedPage(null);
        }
        setDeleteConfirmPageId(null);
      }
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  };

  const categories = ["Home", "About Us", "Study Abroad", "Career Assessment", "Exam & Training", "Other"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [groupSelectedPageIds, setGroupSelectedPageIds] = useState({});

  const getCategory = (slug) => {
    const s = slug ? slug.toLowerCase() : '';
    if (s === '/' || s === '/home' || s === 'home') return 'Home';
    if (s.startsWith('/about') || s === '/gallery' || s === '/contact') return 'About Us';
    if (s.startsWith('/study-abroad')) return 'Study Abroad';
    if (s.includes('career-assessment')) return 'Career Assessment';
    if (s.startsWith('/mock')) return 'Exam & Training';
    if (s.startsWith('/exam-training')) return 'Exam & Training';
    return 'Other';
  };

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/admin/pages'), {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        const processedPages = data.pages.map(p => {
          let content = p.content;
          while (typeof content === 'string') {
            try {
              const next = JSON.parse(content);
              if (typeof next === 'string' && next === content) break;
              content = next;
            } catch (e) {
              break;
            }
          }
          return { ...p, content: content || { sections: [] } };
        });
        setPages(processedPages);
      }
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePage = async (id, updatedData) => {
    setIsSaving(true);

    // Auto-sort arrays if they exist in content (e.g. universities)
    const processedData = { ...updatedData };
    if (processedData.content?.universities) {
      processedData.content.universities.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (processedData.content?.metadata) {
      // Maybe not sort metadata to keep custom order
    }

    try {
      const response = await fetch(getApiUrl(`/api/admin/pages/${id}`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(processedData),
      });
      const data = await response.json();
      if (data.success) {
        if (selectedPage?.slug?.toLowerCase().includes('career-assessment')) {
          const feeVal = processedData.content?.amount ?? processedData.content?.fee;
          if (feeVal !== undefined && feeVal !== null) {
            fetch(getApiUrl('/api/admin/settings'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
              body: JSON.stringify({ key: 'career_assessment_fee', value: String(feeVal) })
            }).catch(e => console.error('Setting sync error:', e));
          }
        }
        let content = data.page.content;
        while (typeof content === 'string') {
          try {
            const next = JSON.parse(content);
            if (typeof next === 'string' && next === content) break;
            content = next;
          } catch (e) {
            break;
          }
        }
        const cleanPage = { ...data.page, content: content || { sections: [] } };
        setPages(pages.map(p => p.id === id ? cleanPage : p));
        setSelectedPage(null); // Close modal on success
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalCreate = async () => {
    if (!newPageData.title || !newPageData.slug) return;
    setIsSaving(true);
    try {
      const response = await fetch(getApiUrl('/api/admin/pages'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(newPageData),
      });
      const data = await response.json();
      if (data.success) {
        setPages([...pages, data.page]);
        setShowCreateModal(false);
        setNewPageData({ title: "", slug: "" });
        setSelectedPage(data.page);
      }
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (section, field, value) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const newContent = { ...(prev.content || {}) };
      if (section) {
        newContent[section] = { ...(newContent[section] || {}), [field]: value };
      } else if (field === null) {
        // Direct update of a complex section
        newContent[section] = value;
      } else {
        newContent[field] = value;
      }
      return { ...prev, content: newContent };
    });
  };

  const handleNestedContentChange = (section, subSection, field, value) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const newContent = { ...(prev.content || {}) };
      const currentSection = { ...(newContent[section] || {}) };
      const currentSub = { ...(currentSection[subSection] || {}) };
      currentSub[field] = value;
      currentSection[subSection] = currentSub;
      newContent[section] = currentSection;
      return { ...prev, content: newContent };
    });
  };

  const addTopStudent = () => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const newContent = { ...(prev.content || {}) };
      const bsp = { ...(newContent.bestStudentProfile || {}) };
      const topStudents = [...(bsp.topStudents || defaultTopStudents)];
      topStudents.push({
        name: "",
        achievement: "",
        country: "",
        image: "",
        isDefault: false
      });
      bsp.topStudents = topStudents;
      newContent.bestStudentProfile = bsp;
      return { ...prev, content: newContent };
    });
  };

  const removeTopStudent = (index) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const newContent = { ...(prev.content || {}) };
      const bsp = { ...(newContent.bestStudentProfile || {}) };
      const topStudents = [...(bsp.topStudents || defaultTopStudents)];
      topStudents.splice(index, 1);
      bsp.topStudents = topStudents;
      newContent.bestStudentProfile = bsp;
      return { ...prev, content: newContent };
    });
  };

  const updateTopStudent = (index, field, value) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const newContent = { ...(prev.content || {}) };
      const bsp = { ...(newContent.bestStudentProfile || {}) };
      const topStudents = [...(bsp.topStudents || defaultTopStudents)];
      if (topStudents[index]) {
        topStudents[index] = { ...topStudents[index], [field]: value };
      }
      bsp.topStudents = topStudents;
      newContent.bestStudentProfile = bsp;
      return { ...prev, content: newContent };
    });
  };

  const uploadTopStudentImage = async (index, file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(getApiUrl('/api/admin/upload'), {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        updateTopStudent(index, 'image', data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image.');
    }
  };

  const addMockTestItem = () => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const newContent = { ...(prev.content || {}) };
      const currentList = [...(newContent.mockTestsList || [])];
      currentList.push({
        title: "New Practice Test",
        content: "Complete practice module for foreign education entrance.",
        price: "₹49",
        image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
      });
      newContent.mockTestsList = currentList;
      return { ...prev, content: newContent };
    });
  };

  const removeMockTestItem = (index) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const newContent = { ...(prev.content || {}) };
      const currentList = [...(newContent.mockTestsList || [])];
      currentList.splice(index, 1);
      newContent.mockTestsList = currentList;
      return { ...prev, content: newContent };
    });
  };

  const updateMockTestItem = (index, field, value) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const newContent = { ...(prev.content || {}) };
      const currentList = [...(newContent.mockTestsList || [])];
      if (currentList[index]) {
        currentList[index] = { ...currentList[index], [field]: value };
      }
      newContent.mockTestsList = currentList;
      return { ...prev, content: newContent };
    });
  };

  const uploadMockTestImage = async (index, file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(getApiUrl('/api/admin/upload'), {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        updateMockTestItem(index, 'image_url', data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image.');
    }
  };

  const addSection = (type) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const currentSections = prev.content?.sections || [];
      const newSection = {
        type,
        title: "New Section Title",
        body: "Write your content here...",
        image: type === 'image_text' ? "" : undefined,
        reversed: type === 'image_text' ? false : undefined
      };
      return {
        ...prev,
        content: { ...prev.content, sections: [...currentSections, newSection] }
      };
    });
  };

  const updateSection = (index, field, value) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const currentSections = [...(prev.content?.sections || [])];
      currentSections[index] = { ...currentSections[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, sections: currentSections }
      };
    });
  };

  const removeSection = (index) => {
    setSelectedPage(prev => {
      if (!prev) return null;
      const currentSections = [...(prev.content?.sections || [])];
      currentSections.splice(index, 1);
      return {
        ...prev,
        content: { ...prev.content, sections: currentSections }
      };
    });
  };

  const addCustomSection = () => {
    const currentSections = selectedPage.content?.customSections || [];
    const newSection = {
      id: Date.now().toString(),
      title: "New Custom Section",
      content: "Enter your content here..."
    };
    handleContentChange('customSections', null, [...currentSections, newSection]);
  };

  const updateCustomSection = (id, field, value) => {
    const currentSections = selectedPage.content?.customSections || [];
    const updatedSections = currentSections.map(sec =>
      sec.id === id ? { ...sec, [field]: value } : sec
    );
    handleContentChange('customSections', null, updatedSections);
  };

  const removeCustomSection = (id) => {
    const currentSections = selectedPage.content?.customSections || [];
    const updatedSections = currentSections.filter(sec => sec.id !== id);
    handleContentChange('customSections', null, updatedSections);
  };

  useEffect(() => {
    console.log("AdminPages: Fetching pages...");
    fetchPages();
  }, []);

  const filteredPages = pages.filter(page => {
    const matchesCategory = selectedCategory === "All" || getCategory(page.slug) === selectedCategory;
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const CustomGroupSelector = ({ activePage, pages, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-full flex items-center justify-between bg-slate-100/50 hover:bg-slate-200/50 border border-slate-200/40 px-5 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-slate-700 transition-all shadow-sm group"
        >
          <span className="truncate">{activePage.title}</span>
          <ChevronRight className={`transition-transform duration-300 w-3.5 h-3.5 ${isOpen ? 'rotate-90 text-brand-600' : 'text-slate-400'}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                className="absolute left-0 right-0 top-full z-50 mt-1.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
              >
                {pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(p.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[10px] font-bold transition-all border-b border-slate-100/50 last:border-0
                      ${p.id === activePage.id
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-brand-600'}
                    `}
                  >
                    {p.title}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const PageCard = ({ page }) => (
    <motion.div
      key={page.id}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => setSelectedPage(page)}
      className="glass-card rounded-2xl p-8 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.99]"
    >
      {/* Glow Effect */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="p-3.5 bg-slate-50 text-brand-600 rounded-xl border border-slate-100 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
          <FileText size={20} />
        </div>
        <div className="flex flex-col items-end gap-2.5">
          <span className={`text-[10px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-xl border shadow-xs ${page.status === 'PUBLISHED'
            ? 'bg-emerald-400/5 text-emerald-600 border-emerald-400/20'
            : 'bg-amber-400/5 text-amber-600 border-amber-400/20'
            }`}>
            {page.status}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
            {getCategory(page.slug)}
          </span>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-semibold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors tracking-tight leading-tight">{page.title}</h3>
        <p className="text-[11px] text-slate-400 font-medium mb-8 flex items-center gap-2 group-hover:text-slate-500 transition-colors">
          <Globe size={13} className="opacity-40" /> {page.slug}
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/40 mt-auto relative z-10">
        <div className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-medium tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          <Clock size={12} /> {formatDate(page.updated_at)}
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 shadow-lg shadow-slate-900/20">
          <ChevronRight size={18} />
        </div>
      </div>
    </motion.div>
  );


  const ImageUploader = ({ section, field, value, label, customSectionId = null, subSection = null, fallbackImage = null }) => {
    const displaySrc = value ? getAssetUrl(value) : fallbackImage;
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">{label}</label>
        <div className="relative group aspect-video bg-white border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
          {displaySrc ? (
            <>
              <SafeImage src={displaySrc} className="w-full h-full object-cover" alt="Banner" />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                <label className="p-3 bg-white text-slate-900 rounded-full cursor-pointer hover:bg-brand-50 transition-colors" title="Upload / Edit Image">
                  <Edit size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(section, field, e.target.files[0], customSectionId, null, subSection)} />
                </label>
                {value && (
                  <button
                    type="button"
                    onClick={() => subSection ? handleNestedContentChange(section, subSection, field, "") : handleContentChange(section, field, "")}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove custom image"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all gap-2">
              <ImageIcon className="text-slate-200" size={32} />
              <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">Upload Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(section, field, e.target.files[0], customSectionId, null, subSection)} />
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1600px] mx-auto">
      {/* Page Editor Modal */}
      <AnimatePresence>
        {selectedPage && (
          <div className="fixed inset-0 w-screen h-screen z-[50] flex items-center justify-center pt-24 pb-6 px-4 overflow-y-auto">
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => { setSelectedPage(null); setActiveTab("settings"); }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transform-gpu"
            />

            {/* Centered Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-100px)] z-50 my-auto transform-gpu border border-slate-100"
            >
                {/* Fixed Modal Header */}
                <div className="p-6 md:px-8 md:pt-6 md:pb-0 shrink-0 bg-white border-b border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                        <Edit size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Page Editor</h2>
                        <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1.5 mt-0.5">
                          <Globe size={11} /> {selectedPage.slug}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedPage(null); setActiveTab("settings"); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl mb-4">
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'settings' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <Info size={14} /> Page Settings
                    </button>
                    <button
                      onClick={() => setActiveTab("content")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'content' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <Edit size={14} /> Page Content
                    </button>
                  </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                  {activeTab === 'settings' ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Display Title</label>
                        <input
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700"
                          value={selectedPage.title}
                          onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Page Slug (URL)</label>
                          <input
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-600"
                            value={selectedPage.slug}
                            onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                          />
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">Visibility Status</label>
                            <div className="relative">
                              <select
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all appearance-none cursor-pointer"
                                value={selectedPage.status}
                                onChange={(e) => setSelectedPage({ ...selectedPage, status: e.target.value })}
                              >
                                <option value="DRAFT">DRAFT (Hidden from website)</option>
                                <option value="PUBLISHED">PUBLISHED (Live on website)</option>
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronRight className="rotate-90" size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">Menu & Footer Placement</label>
                        <div className="relative">
                          <select
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all appearance-none cursor-pointer"
                            value={selectedPage.nav_visibility || 'none'}
                            onChange={(e) => setSelectedPage({ ...selectedPage, nav_visibility: e.target.value })}
                          >
                            <option value="none">Don't show in any menus (Private Link)</option>
                            <option value="navbar">Show in Navbar only</option>
                            <option value="footer">Show in Footer only</option>
                            <option value="both">Show in both Navbar & Footer</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-500">
                            <Globe size={18} />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                          <Info size={16} />
                          <h4 className="text-xs font-medium uppercase tracking-widest pt-0.5">Search Engine Optimization</h4>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-blue-400/80 uppercase tracking-tighter mb-1 block">Meta Title</label>
                            <input
                              className="w-full px-4 py-3 bg-white/80 border border-blue-100 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-all text-slate-600 font-medium"
                              value={selectedPage.seo_title || ""}
                              onChange={(e) => setSelectedPage({ ...selectedPage, seo_title: e.target.value })}
                              placeholder="Short, catchy title for Google..."
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-blue-400/80 uppercase tracking-tighter mb-1 block">Meta Description</label>
                            <textarea
                              className="w-full px-4 py-3 bg-white/80 border border-blue-100 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-all text-slate-600 font-medium h-20 resize-none"
                              value={selectedPage.seo_description || ""}
                              onChange={(e) => setSelectedPage({ ...selectedPage, seo_description: e.target.value })}
                              placeholder="Summarize the page content for search engines..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Danger Zone</span>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmPageId(selectedPage.id)}
                          className="px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Delete Page Permanently
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* 1. HOME PAGE EDITOR */}
                      {selectedPage.slug === '/' && (
                        <div className="space-y-6 pb-20">
                          {/* 1. Hero Section */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                  <Globe size={18} className="text-brand-600" /> 1. Hero Section & Background Banners
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                  Manage rotating hero background images. Previews are compact so you can easily edit or add new slides.
                                </p>
                              </div>
                            </div>

                            {/* Hero Slider Banners Grid (Compact Thumbnails) */}
                            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 flex items-center gap-2">
                                  <ImageIcon size={14} /> Hero Slider Banners ({(selectedPage.content?.hero?.banners || [HeroBanner1, HeroBanner2, HeroBanner3]).length} Active)
                                </span>
                                <label className="px-3.5 py-1.5 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
                                  <Plus size={14} /> Add New Banner
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        uploadHeroBannerImage(e.target.files[0]);
                                      }
                                    }}
                                  />
                                </label>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {(selectedPage.content?.hero?.banners || [HeroBanner1, HeroBanner2, HeroBanner3]).map((banner, idx) => {
                                  const imgSrc = typeof banner === 'string'
                                    ? getAssetUrl(banner)
                                    : (banner?.url ? getAssetUrl(banner.url) : getAssetUrl(banner));

                                  return (
                                    <div key={idx} className="relative group h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                                      <SafeImage src={imgSrc} className="w-full h-full object-cover" alt={`Hero Banner ${idx + 1}`} />
                                      <div className="absolute inset-0 bg-slate-900/65 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                        <label className="p-2 bg-white text-slate-900 rounded-full cursor-pointer hover:bg-brand-50 transition-colors" title="Change Banner">
                                          <Edit size={14} />
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              if (e.target.files && e.target.files[0]) {
                                                uploadHeroBannerImage(e.target.files[0], idx);
                                              }
                                            }}
                                          />
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => removeHeroBanner(idx)}
                                          className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                          title="Remove Banner"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                      <div className="absolute bottom-1 left-1 bg-slate-900/75 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded backdrop-blur-xs">
                                        Banner #{idx + 1}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Floating Badge</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.badge ?? "Foreign English Test Capital"}
                                  onChange={(e) => handleContentChange('hero', 'badge', e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Headline (Main)</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.hero?.titleMain ?? "Empowering Your"}
                                    onChange={(e) => handleContentChange('hero', 'titleMain', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Headline (Highlight)</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.hero?.titleHighlight ?? "Global Dreams"}
                                    onChange={(e) => handleContentChange('hero', 'titleHighlight', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Subtitle Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.subtitle ?? "Authorized examination space & test preparation for IELTS, TOEFL, GRE, GMAT, and international admissions."}
                                  onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Primary Button Text</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.buttonText ?? "Explore Courses"}
                                  onChange={(e) => handleContentChange('hero', 'buttonText', e.target.value)}
                                />
                              </div>
                            </div>

                          {/* 2. Trust Bar */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Building size={18} className="text-brand-600" /> 2. Trust Bar
                            </h3>
                            <div>
                              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Trust Message</label>
                              <input
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                value={selectedPage.content?.trustBar?.message ?? "Trusted by 100+ Global Universities & Thousands of Successful Students"}
                                onChange={(e) => handleContentChange('trustBar', 'message', e.target.value)}
                                placeholder="Trusted by 100+ Global Universities..."
                              />
                            </div>
                          </div>

                          {/* 3. Study Abroad Section */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <GraduationCap size={18} className="text-brand-600" /> 3. Study Abroad Section
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Section Title</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.studyAbroad?.title ?? "Explore the World"}
                                    onChange={(e) => handleContentChange('studyAbroad', 'title', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Badge Text</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.studyAbroad?.badgeText ?? "Global Vibes"}
                                    onChange={(e) => handleContentChange('studyAbroad', 'badgeText', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.studyAbroad?.description ?? "Pick your dream destination and let us handle the boring stuff. We've helped thousands of students settle in over 10+ countries."}
                                  onChange={(e) => handleContentChange('studyAbroad', 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 4. Exam Training Section */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <BookOpen size={18} className="text-brand-600" /> 4. Exam Training Section
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Section Title</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.examTraining?.title ?? "Ace Your Exams"}
                                    onChange={(e) => handleContentChange('examTraining', 'title', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Badge Text</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.examTraining?.badgeText ?? "Top Coaching"}
                                    onChange={(e) => handleContentChange('examTraining', 'badgeText', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.examTraining?.description ?? "We make exam prep feel like a breeze with expert coaching and real mock tests."}
                                  onChange={(e) => handleContentChange('examTraining', 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 5. Features Grid Section */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Sparkles size={18} className="text-brand-600" /> 5. Features Grid (Why Students Love Us)
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Section Title</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.features?.sectionTitle ?? "Why Students Love Us"}
                                  onChange={(e) => handleContentChange('features', 'sectionTitle', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Subtitle</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.features?.sectionSubtitle ?? "We're not your typical consultants. We care about your journey as much as you do."}
                                  onChange={(e) => handleContentChange('features', 'sectionSubtitle', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 6. How It Works Section */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <CheckCircle2 size={18} className="text-brand-600" /> 6. How It Works (Blueprint)
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Section Title</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.howItWorks?.title ?? "How It Works"}
                                    onChange={(e) => handleContentChange('howItWorks', 'title', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Badge Text</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.howItWorks?.badgeText ?? "Simple 4-Step Journey"}
                                    onChange={(e) => handleContentChange('howItWorks', 'badgeText', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Subtitle</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.howItWorks?.subtitle ?? "From your first counseling session to boarding your flight, we guide you at every step."}
                                  onChange={(e) => handleContentChange('howItWorks', 'subtitle', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 8. Best Student Profile (Student Spotlights) */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                  <Award size={18} className="text-brand-600" /> 8. Best Student Profile (Student Spotlights)
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                  Manage your Star Student spotlight (1 slot) and Top FETC Students carousel (up to 9 slots). Unused slots are hidden on the home page.
                                </p>
                              </div>
                            </div>

                            {/* A. STAR STUDENT (1 Slot) */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                  <Sparkles size={14} /> Star Student (Featured 1 Slot)
                                </span>
                              </div>

                              <ImageUploader
                                section="bestStudentProfile"
                                subSection="starStudent"
                                field="image"
                                value={selectedPage.content?.bestStudentProfile?.starStudent?.image}
                                fallbackImage={UditImg}
                                label="Star Student Photo"
                              />

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Student Name</label>
                                  <input
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-brand-300"
                                    value={selectedPage.content?.bestStudentProfile?.starStudent?.name ?? "Udit Gangnani"}
                                    onChange={(e) => handleNestedContentChange('bestStudentProfile', 'starStudent', 'name', e.target.value)}
                                    placeholder="e.g. Udit Gangnani"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Floating Badge</label>
                                  <input
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-brand-300"
                                    value={selectedPage.content?.bestStudentProfile?.starStudent?.badge ?? "Full Scholarship"}
                                    onChange={(e) => handleNestedContentChange('bestStudentProfile', 'starStudent', 'badge', e.target.value)}
                                    placeholder="e.g. Full Scholarship"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">University / Achievement Details</label>
                                <input
                                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-brand-300"
                                  value={selectedPage.content?.bestStudentProfile?.starStudent?.university ?? "University of Pisa, Italy"}
                                  onChange={(e) => handleNestedContentChange('bestStudentProfile', 'starStudent', 'university', e.target.value)}
                                  placeholder="e.g. University of Pisa, Italy"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Success Story Description</label>
                                <textarea
                                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-20 resize-none outline-none focus:border-brand-300"
                                  value={selectedPage.content?.bestStudentProfile?.starStudent?.description ?? "Driven by a passion for higher education, Udit placed his trust in FETC to guide his journey abroad. With our dedicated mentorship and strategic support, he earned a fully funded scholarship to pursue Data Science at the University of Pisa, Italy."}
                                  onChange={(e) => handleNestedContentChange('bestStudentProfile', 'starStudent', 'description', e.target.value)}
                                  placeholder="Driven by a passion for higher education, Udit placed his trust in FETC..."
                                />
                              </div>
                            </div>

                            {/* B. TOP FETC STUDENTS */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                    <Users size={14} className="text-brand-600" /> Top FETC Students ({(selectedPage.content?.bestStudentProfile?.topStudents || defaultTopStudents).length} Students)
                                  </span>
                                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                    Add as many student profiles as you like. All uploaded student cards will show on the home page slider.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={addTopStudent}
                                  className="px-3.5 py-1.5 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                  <Plus size={14} /> Add Student
                                </button>
                              </div>

                              <div className="space-y-4">
                                {(selectedPage.content?.bestStudentProfile?.topStudents || defaultTopStudents).map((student, idx) => (
                                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-3 relative group">
                                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                        Student #{idx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => removeTopStudent(idx)}
                                        className="p-1.5 text-rose-500 hover:bg-rose-100/60 rounded-lg transition-all"
                                        title="Remove Student"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                                        <input
                                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-brand-300"
                                          value={student.name || ""}
                                          onChange={(e) => updateTopStudent(idx, 'name', e.target.value)}
                                          placeholder="e.g. Mansi Savani"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Achievement / Visa Subtitle</label>
                                        <input
                                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-brand-300"
                                          value={student.achievement || ""}
                                          onChange={(e) => updateTopStudent(idx, 'achievement', e.target.value)}
                                          placeholder="e.g. USA F1 Visa"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Country Flag / Code</label>
                                        <input
                                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-brand-300"
                                          value={student.country || ""}
                                          onChange={(e) => updateTopStudent(idx, 'country', e.target.value)}
                                          placeholder="e.g. 🇺🇸 or US"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Student Photo</label>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                              if (e.target.files && e.target.files[0]) {
                                                uploadTopStudentImage(idx, e.target.files[0]);
                                              }
                                            }}
                                            className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer"
                                          />
                                        </div>
                                        {(() => {
                                          const thumbSrc = student.image 
                                            ? getAssetUrl(student.image) 
                                            : (student.fallbackImage || (idx < 6 ? defaultTopStudents[idx]?.fallbackImage : null));

                                          return thumbSrc ? (
                                            <div className="mt-2 w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                                              <SafeImage src={thumbSrc} alt={student.name || "Student"} className="w-full h-full object-cover" />
                                            </div>
                                          ) : null;
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {(!selectedPage.content?.bestStudentProfile?.topStudents || selectedPage.content.bestStudentProfile.topStudents.length === 0) && (
                                  <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                                    <p className="text-xs text-slate-400 italic font-medium mb-3">No student profiles added yet.</p>
                                    <button
                                      type="button"
                                      onClick={addTopStudent}
                                      className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-all inline-flex items-center gap-1.5"
                                    >
                                      <Plus size={14} /> Add First Student
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 8. Welcome Section */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Info size={18} className="text-brand-600" /> 8. Welcome / Why Choose Us Section
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Section Title</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.welcomeSection?.title ?? "Welcome to FETC"}
                                    onChange={(e) => handleContentChange('welcomeSection', 'title', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Badge Text</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.welcomeSection?.badge ?? "About FETC"}
                                    onChange={(e) => handleContentChange('welcomeSection', 'badge', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Subtitle</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.welcomeSection?.subtitle ?? "Foreign English Test Capital powered by Gina Abroad Pvt. Ltd."}
                                  onChange={(e) => handleContentChange('welcomeSection', 'subtitle', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 9. Contact CTA Section */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Send size={18} className="text-brand-600" /> 9. Contact Call-To-Action (CTA)
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">CTA Title</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.contactCTA?.title ?? "Ready to Start Your Journey?"}
                                    onChange={(e) => handleContentChange('contactCTA', 'title', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Badge Text</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.contactCTA?.badge ?? "Get In Touch"}
                                    onChange={(e) => handleContentChange('contactCTA', 'badge', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Subtitle</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.contactCTA?.subtitle ?? "Book a free 1-on-1 counseling session with our senior foreign education experts today."}
                                  onChange={(e) => handleContentChange('contactCTA', 'subtitle', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 7. Custom Sections Builder */}
                          <div className="pt-10 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Custom Sections</h3>
                                <p className="text-xs text-slate-400 font-medium">Add modular content blocks to this page.</p>
                              </div>
                              <button
                                onClick={addCustomSection}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-medium hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 active:scale-95"
                              >
                                <Plus size={14} /> Add New Section
                              </button>
                            </div>

                            <div className="space-y-6">
                              {selectedPage.content?.customSections?.map((section, idx) => (
                                <motion.div
                                  key={section.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative group"
                                >
                                  <button
                                    onClick={() => removeCustomSection(section.id)}
                                    className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                  >
                                    <X size={14} />
                                  </button>

                                  <div className="space-y-4">
                                    <ImageUploader
                                      section="customSections"
                                      field="image"
                                      value={section.image}
                                      customSectionId={section.id}
                                      label="Section Image"
                                    />
                                    <div>
                                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Section {idx + 1} Title</label>
                                      <input
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-900 focus:border-brand-300 outline-none transition-all"
                                        value={section.title}
                                        onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                                        placeholder="e.g. Our Global History"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Section Content</label>
                                      <textarea
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600 h-32 resize-none focus:border-brand-300 outline-none transition-all"
                                        value={section.content}
                                        onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                                        placeholder="Write your story here..."
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              ))}

                              {(!selectedPage.content?.customSections || selectedPage.content?.customSections.length === 0) && (
                                <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                                  <Plus size={32} className="mx-auto mb-3 text-slate-100" />
                                  <p className="text-xs font-medium text-slate-300 tracking-tight">No custom sections added yet.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2.5 STUDY ABROAD PAGE EDITOR */}
                      {(selectedPage.slug?.toLowerCase().startsWith('/study-abroad') || selectedPage.slug?.toLowerCase().includes('study-abroad')) && (
                        <div className="space-y-6 pb-20">
                          {/* 1. Destination Overview */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3 border-b border-slate-200/80 pb-3">
                              <Globe size={18} className="text-brand-600" /> Destination Overview
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Country Name</label>
                                  <input
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-brand-400 outline-none transition-all"
                                    value={selectedPage.content?.name ?? selectedPage.title.replace('Study in ', '')}
                                    onChange={(e) => handleContentChange(null, 'name', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Flag Image URL / Code</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:border-brand-400 outline-none transition-all"
                                      value={selectedPage.content?.flag ?? ""}
                                      onChange={(e) => handleContentChange(null, 'flag', e.target.value)}
                                      placeholder="https://flagcdn.com/w80/gb.png"
                                    />
                                    {selectedPage.content?.flag && (
                                      <img src={selectedPage.content.flag} alt="Flag" className="h-8 w-auto rounded border border-slate-200" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Destination Banner / Hero Image</label>
                                <div className="flex items-center gap-4">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const formData = new FormData();
                                        formData.append('image', e.target.files[0]);
                                        try {
                                          const res = await fetch(getApiUrl('/api/admin/upload'), { method: 'POST', body: formData });
                                          const data = await res.json();
                                          if (data.success) {
                                            handleContentChange(null, 'image', data.url);
                                          }
                                        } catch (err) {
                                          alert('Upload failed');
                                        }
                                      }
                                    }}
                                    className="text-xs text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer"
                                  />
                                  {selectedPage.content?.image && (
                                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200">
                                      <SafeImage src={getAssetUrl(selectedPage.content.image)} className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Overview Description</label>
                                <textarea
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-24 resize-none focus:border-brand-400 outline-none transition-all"
                                  value={selectedPage.content?.description ?? ""}
                                  onChange={(e) => handleContentChange(null, 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 2. SOP PDF Downloads */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <Download size={18} className="text-brand-600" /> SOP Guides & PDF Downloads
                              </h3>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = selectedPage.content?.sopLinks || [];
                                  handleContentChange(null, 'sopLinks', [...current, { label: "New SOP Guide", url: "" }]);
                                }}
                                className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-bold rounded-xl border border-brand-200 flex items-center gap-1 transition-all"
                              >
                                <Plus size={14} /> Add SOP Link
                              </button>
                            </div>

                            <div className="space-y-3">
                              {(selectedPage.content?.sopLinks || []).map((sop, sIdx) => (
                                <div key={sIdx} className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
                                  <input
                                    className="w-full md:w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                                    value={sop.label || ""}
                                    onChange={(e) => {
                                      const current = [...(selectedPage.content?.sopLinks || [])];
                                      current[sIdx] = { ...current[sIdx], label: e.target.value };
                                      handleContentChange(null, 'sopLinks', current);
                                    }}
                                    placeholder="e.g. Download UK SOP"
                                  />
                                  <input
                                    className="flex-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
                                    value={sop.url || ""}
                                    onChange={(e) => {
                                      const current = [...(selectedPage.content?.sopLinks || [])];
                                      current[sIdx] = { ...current[sIdx], url: e.target.value };
                                      handleContentChange(null, 'sopLinks', current);
                                    }}
                                    placeholder="PDF URL or Google Drive Link..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = (selectedPage.content?.sopLinks || []).filter((_, i) => i !== sIdx);
                                      handleContentChange(null, 'sopLinks', current);
                                    }}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. Elite Universities Manager */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                  <Building size={18} className="text-brand-600" /> Universities & Partner Institutions ({selectedPage.content?.universities?.length || 0})
                                </h3>
                                <p className="text-xs text-slate-400 font-medium">Add, edit, or upload logos for universities in {selectedPage.content?.name || selectedPage.title}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = selectedPage.content?.universities || [];
                                  handleContentChange(null, 'universities', [
                                    ...current,
                                    { name: "New University", ranking: "Top Ranked", location: selectedPage.content?.name || "Global", image: "", exclusive: false }
                                  ]);
                                }}
                                className="px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                              >
                                <Plus size={14} /> Add University
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(selectedPage.content?.universities || []).map((uni, uIdx) => (
                                <div key={uIdx} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 relative group">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = (selectedPage.content?.universities || []).filter((_, i) => i !== uIdx);
                                      handleContentChange(null, 'universities', current);
                                    }}
                                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>

                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">University Name</label>
                                    <input
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                                      value={uni.name || ""}
                                      onChange={(e) => {
                                        const current = [...(selectedPage.content?.universities || [])];
                                        current[uIdx] = { ...current[uIdx], name: e.target.value };
                                        handleContentChange(null, 'universities', current);
                                      }}
                                      placeholder="University Name..."
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ranking Badge</label>
                                      <input
                                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                                        value={uni.ranking || ""}
                                        onChange={(e) => {
                                          const current = [...(selectedPage.content?.universities || [])];
                                          current[uIdx] = { ...current[uIdx], ranking: e.target.value };
                                          handleContentChange(null, 'universities', current);
                                        }}
                                        placeholder="#1 Global"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
                                      <input
                                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                                        value={uni.location || ""}
                                        onChange={(e) => {
                                          const current = [...(selectedPage.content?.universities || [])];
                                          current[uIdx] = { ...current[uIdx], location: e.target.value };
                                          handleContentChange(null, 'universities', current);
                                        }}
                                        placeholder="City, Country"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">University Logo / Image</label>
                                    <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-white flex items-center justify-center p-1 shadow-xs">
                                        {uni.image ? (
                                          <SafeImage src={getAssetUrl(uni.image)} alt={uni.name} className="w-full h-full object-contain" />
                                        ) : (
                                          <div className="text-sm font-black text-brand-600">
                                            {uni.name ? uni.name.charAt(0) : "U"}
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0 space-y-1.5">
                                        <input
                                          className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-brand-400"
                                          value={uni.image || ""}
                                          onChange={(e) => {
                                            const current = [...(selectedPage.content?.universities || [])];
                                            current[uIdx] = { ...current[uIdx], image: e.target.value };
                                            handleContentChange(null, 'universities', current);
                                          }}
                                          placeholder="Image URL or Asset Path..."
                                        />
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={async (e) => {
                                            if (e.target.files && e.target.files[0]) {
                                              const formData = new FormData();
                                              formData.append('image', e.target.files[0]);
                                              try {
                                                const res = await fetch(getApiUrl('/api/admin/upload'), { method: 'POST', body: formData });
                                                const data = await res.json();
                                                if (data.success) {
                                                  const current = [...(selectedPage.content?.universities || [])];
                                                  current[uIdx] = { ...current[uIdx], image: data.url };
                                                  handleContentChange(null, 'universities', current);
                                                }
                                              } catch (err) {
                                                alert('Upload failed');
                                              }
                                            }
                                          }}
                                          className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = [...(selectedPage.content?.universities || [])];
                                        current[uIdx] = { ...current[uIdx], exclusive: !current[uIdx].exclusive };
                                        handleContentChange(null, 'universities', current);
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                        uni.exclusive ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-50 text-slate-500 border-slate-200'
                                      }`}
                                    >
                                      {uni.exclusive ? '⭐ Exclusive Partner' : 'Standard University'}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. COMPANY PROFILE EDITOR */}
                      {(selectedPage.slug?.toLowerCase() === '/about/company-profile' || selectedPage.slug?.toLowerCase() === '/about' || selectedPage.slug?.toLowerCase() === '/about/') && (
                        <div className="space-y-6 pb-20">
                          
                          {/* 1. HERO HEADER & KEY METRICS */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3 border-b border-slate-200/80 pb-3">
                              <Globe size={18} className="text-brand-600" /> 1. Hero Header & Key Metrics
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Badge Text (e.g. About FETC)</label>
                                  <input
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-brand-400 outline-none transition-all"
                                    value={selectedPage.content?.hero?.badge ?? "About FETC"}
                                    onChange={(e) => handleContentChange('hero', 'badge', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Main Title (e.g. Building Global Careers)</label>
                                  <input
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-brand-400 outline-none transition-all"
                                    value={selectedPage.content?.hero?.title ?? "Building Global Careers"}
                                    onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Title Highlight (e.g. Since 1999)</label>
                                <input
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-brand-600 focus:border-brand-400 outline-none transition-all"
                                  value={selectedPage.content?.hero?.titleHighlight ?? "Since 1999"}
                                  onChange={(e) => handleContentChange('hero', 'titleHighlight', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Hero Description</label>
                                <textarea
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-24 resize-none focus:border-brand-400 outline-none transition-all"
                                  value={selectedPage.content?.hero?.description ?? "FETC is an authorized, state-of-the-art English examination and training center headquartered in Surat, Gujarat. We are a dream project under Gina Abroad Pvt. Ltd., empowering students with digital classrooms and authorized examination spaces."}
                                  onChange={(e) => handleContentChange('hero', 'description', e.target.value)}
                                />
                              </div>

                              {/* Key Metrics List Editor */}
                              <div className="pt-4 border-t border-slate-200/80 space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Metrics / Stats</label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedPage.content?.stats || [
                                        { value: "27+", label: "Years of Industry Experience" },
                                        { value: "5,000+", label: "Candidates Trained" },
                                        { value: "5+", label: "State-of-the-art Centres" },
                                        { value: "15+", label: "Countries Served" },
                                        { value: "100%", label: "Tech-enabled Testing Labs" }
                                      ];
                                      handleContentChange(null, 'stats', [...current, { value: "10+", label: "New Highlight" }]);
                                    }}
                                    className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 text-[10px] font-bold rounded-lg border border-brand-200 flex items-center gap-1 transition-all"
                                  >
                                    <Plus size={12} /> Add Metric
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {(selectedPage.content?.stats || [
                                    { value: "27+", label: "Years of Industry Experience" },
                                    { value: "5,000+", label: "Candidates Trained" },
                                    { value: "5+", label: "State-of-the-art Centres" },
                                    { value: "15+", label: "Countries Served" },
                                    { value: "100%", label: "Tech-enabled Testing Labs" }
                                  ]).map((st, idx) => (
                                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2 relative">
                                      <input
                                        className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-brand-600"
                                        value={st.value}
                                        onChange={(e) => {
                                          const current = [...(selectedPage.content?.stats || [])];
                                          current[idx].value = e.target.value;
                                          handleContentChange(null, 'stats', current);
                                        }}
                                        placeholder="27+"
                                      />
                                      <input
                                        className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                                        value={st.label}
                                        onChange={(e) => {
                                          const current = [...(selectedPage.content?.stats || [])];
                                          current[idx].label = e.target.value;
                                          handleContentChange(null, 'stats', current);
                                        }}
                                        placeholder="Label..."
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const current = (selectedPage.content?.stats || []).filter((_, i) => i !== idx);
                                          handleContentChange(null, 'stats', current);
                                        }}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2. OUR PARTNERSHIP SECTION */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3 border-b border-slate-200/80 pb-3">
                              <Building size={18} className="text-brand-600" /> 2. Our Partnership Section
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Section Tag</label>
                                <input
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                                  value={selectedPage.content?.partnership?.tag ?? "Our Partnership"}
                                  onChange={(e) => handleContentChange('partnership', 'tag', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Title Highlight</label>
                                <input
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-brand-600"
                                  value={selectedPage.content?.partnership?.titleHighlight ?? "Opportunities"}
                                  onChange={(e) => handleContentChange('partnership', 'titleHighlight', e.target.value)}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Primary Description</label>
                                <textarea
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-20 resize-none"
                                  value={selectedPage.content?.partnership?.description1 ?? "We're excited to collaborate with R.H. Patel Institute of Technology to expand opportunities for your students and enhance faculty development. Our comprehensive approach combines international university partnerships, career counseling excellence, and certified training programs."}
                                  onChange={(e) => handleContentChange('partnership', 'description1', e.target.value)}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Secondary Description</label>
                                <textarea
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-16 resize-none"
                                  value={selectedPage.content?.partnership?.description2 ?? "This partnership opens doors to global education while supporting your institution's growth and your students' success."}
                                  onChange={(e) => handleContentChange('partnership', 'description2', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Side Card Badge (e.g. About Us)</label>
                                <input
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-indigo-600"
                                  value={selectedPage.content?.partnership?.cardBadge ?? "About Us"}
                                  onChange={(e) => handleContentChange('partnership', 'cardBadge', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Side Card Headline</label>
                                <input
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                                  value={selectedPage.content?.partnership?.cardTitle ?? "At FETC, We Offer Excellence in English Language Training"}
                                  onChange={(e) => handleContentChange('partnership', 'cardTitle', e.target.value)}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Side Card Content</label>
                                <textarea
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none"
                                  value={selectedPage.content?.partnership?.cardDesc ?? "We are dedicated to helping students and professionals achieve their dreams of studying, working, or settling abroad. We connect you with a world of opportunities through top-notch English language support."}
                                  onChange={(e) => handleContentChange('partnership', 'cardDesc', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 3. CAMPUS VISITS (OUTREACH) */}
                          <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <MapPin size={18} className="text-brand-600" /> 3. Campus Visits & Outreach
                              </h3>
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultVisits = [
                                    { icon: "🗓️", tag: "First Visit", title: "Bill Boozing – 3rd April 2026", desc: "Curry College representative will visit your campus, sharing opportunities for American education." },
                                    { icon: "🇬🇧", tag: "Follow-Up Visits", title: "UK University Representatives", desc: "UK University Representatives will visit, showcasing British higher education options and pathways." },
                                    { icon: "🌍", tag: "Ongoing Access", title: "Continued University Partnerships", desc: "Continued university partnerships expanding your students' global education choices." }
                                  ];
                                  const current = selectedPage.content?.campusVisits || defaultVisits;
                                  handleContentChange(null, 'campusVisits', [
                                    ...current,
                                    { icon: "🌍", tag: "New Visit", title: "Global Partner Visit", desc: "Visit details..." }
                                  ]);
                                }}
                                className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-bold rounded-xl border border-brand-200 flex items-center gap-1 transition-all"
                              >
                                <Plus size={14} /> Add Campus Visit
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                              {(() => {
                                const defaultVisits = [
                                  { icon: "🗓️", tag: "First Visit", title: "Bill Boozing – 3rd April 2026", desc: "Curry College representative will visit your campus, sharing opportunities for American education." },
                                  { icon: "🇬🇧", tag: "Follow-Up Visits", title: "UK University Representatives", desc: "UK University Representatives will visit, showcasing British higher education options and pathways." },
                                  { icon: "🌍", tag: "Ongoing Access", title: "Continued University Partnerships", desc: "Continued university partnerships expanding your students' global education choices." }
                                ];
                                const list = selectedPage.content?.campusVisits || defaultVisits;
                                return list.map((item, idx) => (
                                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative overflow-hidden shadow-xs">
                                    <div className="flex items-center gap-2">
                                      <input
                                        className="w-10 px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-center text-lg shrink-0"
                                        value={item.icon || ""}
                                        onChange={(e) => {
                                          const current = [...list];
                                          current[idx] = { ...current[idx], icon: e.target.value };
                                          handleContentChange(null, 'campusVisits', current);
                                        }}
                                      />
                                      <input
                                        className="flex-1 min-w-0 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-brand-600 truncate"
                                        value={item.tag || ""}
                                        onChange={(e) => {
                                          const current = [...list];
                                          current[idx] = { ...current[idx], tag: e.target.value };
                                          handleContentChange(null, 'campusVisits', current);
                                        }}
                                        placeholder="Tag..."
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const current = list.filter((_, i) => i !== idx);
                                          handleContentChange(null, 'campusVisits', current);
                                        }}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-all"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                    <input
                                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                                      value={item.title || ""}
                                      onChange={(e) => {
                                        const current = [...list];
                                        current[idx] = { ...current[idx], title: e.target.value };
                                        handleContentChange(null, 'campusVisits', current);
                                      }}
                                      placeholder="Title..."
                                    />
                                    <textarea
                                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-20 resize-none"
                                      value={item.desc || ""}
                                      onChange={(e) => {
                                        const current = [...list];
                                        current[idx] = { ...current[idx], desc: e.target.value };
                                        handleContentChange(null, 'campusVisits', current);
                                      }}
                                      placeholder="Description..."
                                    />
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          {/* 4. AGENDA OF OUR PARTNERSHIP (COLLABORATION) */}
                          <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                  <Folder size={18} className="text-indigo-600" /> 4. Agenda of Our Partnership (Collaboration)
                                </h3>
                                <p className="text-[11px] text-slate-400 font-normal">Manage professional training, counselling, visits, and City College Birmingham cards</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultAgenda = [
                                    { icon: "📜", title: "Professional Training", desc: "Certified TOEFL and SELT training programs for faculty members, enhancing teaching capabilities and career advancement opportunities." },
                                    { icon: "🎯", title: "Career Counselling", desc: "Expert guidance helping students navigate career paths, university selections, and global opportunities with confidence." },
                                    { icon: "🏫", title: "University Visits", desc: "Direct campus visits from international university representatives, providing students with firsthand information about study abroad options." },
                                    { icon: "🎓", title: "City College Birmingham (2+1)", desc: "Explore your path to Accredited qualifications. Complete your first two years in India, pathway to abroad." }
                                  ];
                                  const current = selectedPage.content?.agendaItems || defaultAgenda;
                                  handleContentChange(null, 'agendaItems', [
                                    ...current,
                                    { icon: "🎓", title: "New Agenda Card", desc: "Description of collaboration..." }
                                  ]);
                                }}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1 transition-all"
                              >
                                <Plus size={14} /> Add Agenda Card
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              {(() => {
                                const defaultAgenda = [
                                  { icon: "📜", title: "Professional Training", desc: "Certified TOEFL and SELT training programs for faculty members, enhancing teaching capabilities and career advancement opportunities." },
                                  { icon: "🎯", title: "Career Counselling", desc: "Expert guidance helping students navigate career paths, university selections, and global opportunities with confidence." },
                                  { icon: "🏫", title: "University Visits", desc: "Direct campus visits from international university representatives, providing students with firsthand information about study abroad options." },
                                  { icon: "🎓", title: "City College Birmingham (2+1)", desc: "Explore your path to Accredited qualifications. Complete your first two years in India, pathway to abroad." }
                                ];
                                const list = selectedPage.content?.agendaItems || defaultAgenda;
                                return list.map((item, idx) => (
                                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative overflow-hidden">
                                    <div className="flex items-center gap-2">
                                      <input
                                        className="w-10 px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-center text-lg shrink-0"
                                        value={item.icon || ""}
                                        onChange={(e) => {
                                          const current = [...list];
                                          current[idx] = { ...current[idx], icon: e.target.value };
                                          handleContentChange(null, 'agendaItems', current);
                                        }}
                                      />
                                      <input
                                        className="flex-1 min-w-0 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 truncate"
                                        value={item.title || ""}
                                        onChange={(e) => {
                                          const current = [...list];
                                          current[idx] = { ...current[idx], title: e.target.value };
                                          handleContentChange(null, 'agendaItems', current);
                                        }}
                                        placeholder="Title..."
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const current = list.filter((_, i) => i !== idx);
                                          handleContentChange(null, 'agendaItems', current);
                                        }}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-all"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                    <textarea
                                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-20 resize-none"
                                      value={item.desc || ""}
                                      onChange={(e) => {
                                        const current = [...list];
                                        current[idx] = { ...current[idx], desc: e.target.value };
                                        handleContentChange(null, 'agendaItems', current);
                                      }}
                                      placeholder="Description..."
                                    />
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          {/* 5. BENEFITS FOR YOUR FACULTY MEMBERS (FACULTY GROWTH) */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                  <Award size={18} className="text-brand-600" /> 5. Benefits for Your Faculty Members
                                </h3>
                                <p className="text-[11px] text-slate-400 font-normal">Faculty growth, certified training, professional development & referral incentives</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultBenefits = [
                                    { icon: "🏅", title: "Certified Training Programs", desc: "Official TOEFL and SELT certification training that enhances your teaching credentials and opens new career opportunities." },
                                    { icon: "📈", title: "Professional Development", desc: "Stay current with international education standards and improve your ability to guide students toward global opportunities." },
                                    { icon: "💰", title: "Referral Incentives", desc: "Earn referral incentives when your students enroll through our partnerships, creating additional income streams for dedicated faculty." }
                                  ];
                                  const current = selectedPage.content?.facultyBenefits || defaultBenefits;
                                  handleContentChange(null, 'facultyBenefits', [
                                    ...current,
                                    { icon: "⭐", title: "New Benefit Card", desc: "Benefit details..." }
                                  ]);
                                }}
                                className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-bold rounded-xl border border-brand-200 flex items-center gap-1 transition-all"
                              >
                                <Plus size={14} /> Add Faculty Benefit
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                              {(() => {
                                const defaultBenefits = [
                                  { icon: "🏅", title: "Certified Training Programs", desc: "Official TOEFL and SELT certification training that enhances your teaching credentials and opens new career opportunities." },
                                  { icon: "📈", title: "Professional Development", desc: "Stay current with international education standards and improve your ability to guide students toward global opportunities." },
                                  { icon: "💰", title: "Referral Incentives", desc: "Earn referral incentives when your students enroll through our partnerships, creating additional income streams for dedicated faculty." }
                                ];
                                const list = selectedPage.content?.facultyBenefits || defaultBenefits;
                                return list.map((item, idx) => (
                                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 relative overflow-hidden shadow-xs">
                                    <div className="flex items-center gap-2">
                                      <input
                                        className="w-10 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg shrink-0"
                                        value={item.icon || ""}
                                        onChange={(e) => {
                                          const current = [...list];
                                          current[idx] = { ...current[idx], icon: e.target.value };
                                          handleContentChange(null, 'facultyBenefits', current);
                                        }}
                                      />
                                      <input
                                        className="flex-1 min-w-0 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 truncate"
                                        value={item.title || ""}
                                        onChange={(e) => {
                                          const current = [...list];
                                          current[idx] = { ...current[idx], title: e.target.value };
                                          handleContentChange(null, 'facultyBenefits', current);
                                        }}
                                        placeholder="Title..."
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const current = list.filter((_, i) => i !== idx);
                                          handleContentChange(null, 'facultyBenefits', current);
                                        }}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-all"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                    <textarea
                                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-20 resize-none"
                                      value={item.desc || ""}
                                      onChange={(e) => {
                                        const current = [...list];
                                        current[idx] = { ...current[idx], desc: e.target.value };
                                        handleContentChange(null, 'facultyBenefits', current);
                                      }}
                                      placeholder="Description..."
                                    />
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          {/* 6. GLOBAL TECH EDUCATION & CAREER PATHWAYS */}
                          <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                  <Globe size={18} className="text-indigo-600" /> 6. Global Tech Education & Career Pathways
                                </h3>
                                <p className="text-[11px] text-slate-400 font-normal">IT, Computing & Digital Technology career pathway tags</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultPathways = [
                                    "Software Developer/ Web Developer",
                                    "IT Support Specialist",
                                    "Network Engineer/ Cybersecurity Analyst",
                                    "Data Scientist/ Business Intelligence Analyst",
                                    "E-Commerce Manager",
                                    "Tech Project Manager"
                                  ];
                                  const current = selectedPage.content?.pathways || defaultPathways;
                                  handleContentChange(null, 'pathways', [...current, "New Career Pathway"]);
                                }}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1 transition-all"
                              >
                                <Plus size={14} /> Add Pathway Tag
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                              {(() => {
                                const defaultPathways = [
                                  "Software Developer/ Web Developer",
                                  "IT Support Specialist",
                                  "Network Engineer/ Cybersecurity Analyst",
                                  "Data Scientist/ Business Intelligence Analyst",
                                  "E-Commerce Manager",
                                  "Tech Project Manager"
                                ];
                                const list = selectedPage.content?.pathways || defaultPathways;
                                return list.map((pw, idx) => (
                                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                                    <input
                                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-700"
                                      value={pw || ""}
                                      onChange={(e) => {
                                        const current = [...list];
                                        current[idx] = e.target.value;
                                        handleContentChange(null, 'pathways', current);
                                      }}
                                      placeholder="Pathway name..."
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = list.filter((_, i) => i !== idx);
                                        handleContentChange(null, 'pathways', current);
                                      }}
                                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          {/* 7. HISTORY, OUR STORY & VIDEO DEMO (WITH MEDIA PREVIEWS) */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-5">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3 border-b border-slate-200/80 pb-3">
                              <Video size={18} className="text-brand-600" /> 7. History, Our Story & Video Demo
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Story Card Title</label>
                                  <input
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                                    value={selectedPage.content?.story?.title ?? "The Inception (Since 1999)"}
                                    onChange={(e) => handleContentChange('story', 'title', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Video Title Headline</label>
                                  <input
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                                    value={selectedPage.content?.story?.videoTitle ?? "Inside FETC & Gina Abroad"}
                                    onChange={(e) => handleContentChange('story', 'videoTitle', e.target.value)}
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Story Text Description</label>
                                <textarea
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-24 resize-none"
                                  value={selectedPage.content?.story?.desc ?? "Specifically for exams and training and study abroad services this company has been formed under the umbrella of Ms. Bhumika Dilkhush proprietor of Gina Abroad."}
                                  onChange={(e) => handleContentChange('story', 'desc', e.target.value)}
                                />
                              </div>

                              {/* Media Row: Poster Image Preview & Video Preview */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                                {/* Video Poster Image */}
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">1. Video Poster Preview</label>
                                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 group">
                                    <SafeImage
                                      src={getAssetUrl(selectedPage.content?.story?.videoPoster || "/assets/story-video-thumbnail.png")}
                                      className="w-full h-full object-cover"
                                      alt="Video Poster Preview"
                                    />
                                    <label className="absolute inset-0 bg-slate-950/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer font-bold text-xs gap-1.5">
                                      <Upload size={20} /> Upload Poster Image
                                      <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                          if (e.target.files?.[0]) {
                                            handleFileUpload('story', 'videoPoster', e.target.files[0]);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>

                                {/* Video Player Preview */}
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">2. Video Player Preview (MP4)</label>
                                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 flex flex-col items-center justify-center group">
                                    <video
                                      src={getAssetUrl(selectedPage.content?.story?.videoUrl || "/assets/story-video.mp4")}
                                      controls
                                      className="w-full h-full object-contain"
                                    />
                                    <label className="absolute top-2 right-2 bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1 cursor-pointer transition-all">
                                      <Upload size={14} /> Upload Video (MP4)
                                      <input
                                        type="file"
                                        className="hidden"
                                        accept="video/*"
                                        onChange={(e) => {
                                          if (e.target.files?.[0]) {
                                            handleFileUpload('story', 'videoUrl', e.target.files[0]);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 5. PROGRAM CURRICULUMS & PDF DOCUMENTS */}
                          <div className="p-6 bg-white border-2 border-indigo-100 rounded-2xl space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                  <FileText size={18} className="text-indigo-600" /> 5. Program Curriculums & PDF Documents
                                </h3>
                                <p className="text-[11px] text-slate-400 font-normal">Add downloadable PDF guides and curriculums for students</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultDocs = [
                                    { name: "Business Management", category: "Management", icon: "💼", fileUrl: "/assets/certificates/Business Management.pdf" },
                                    { name: "Diploma in Health & Social Care", category: "Health & Social Care", icon: "🏥", fileUrl: "/assets/certificates/Diploma in Health & Social Care.pdf" },
                                    { name: "Diploma in IT - Web Design", category: "IT & Computing", icon: "💻", fileUrl: "/assets/certificates/Diploma in Information Technology - Web Design.pdf" },
                                    { name: "Diploma in IT - E Commerce", category: "IT & Computing", icon: "🛒", fileUrl: "/assets/certificates/Diploma in IT - E Commerce F.pdf" },
                                    { name: "Hospitality & Tourism Management", category: "Hospitality", icon: "🏨", fileUrl: "/assets/certificates/Hospitality & Tourism Management.pdf" },
                                    { name: "Gina Abroad - British Degree Route", category: "Academic Guide", icon: "🇬🇧", fileUrl: "/assets/certificates/Gina Abroad_Your-Smartest-Route-to-a-British-Degree.pdf" }
                                  ];
                                  const current = selectedPage.content?.programDownloads || defaultDocs;
                                  handleContentChange(null, 'programDownloads', [
                                    ...current,
                                    { name: "New Course Syllabus", category: "Academic Guide", icon: "📚", fileUrl: "" }
                                  ]);
                                }}
                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                              >
                                <Plus size={14} /> Add PDF Document
                              </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 pt-2">
                              {(() => {
                                const defaultDocs = [
                                  { name: "Business Management", category: "Management", icon: "💼", fileUrl: "/assets/certificates/Business Management.pdf" },
                                  { name: "Diploma in Health & Social Care", category: "Health & Social Care", icon: "🏥", fileUrl: "/assets/certificates/Diploma in Health & Social Care.pdf" },
                                  { name: "Diploma in IT - Web Design", category: "IT & Computing", icon: "💻", fileUrl: "/assets/certificates/Diploma in Information Technology - Web Design.pdf" },
                                  { name: "Diploma in IT - E Commerce", category: "IT & Computing", icon: "🛒", fileUrl: "/assets/certificates/Diploma in IT - E Commerce F.pdf" },
                                  { name: "Hospitality & Tourism Management", category: "Hospitality", icon: "🏨", fileUrl: "/assets/certificates/Hospitality & Tourism Management.pdf" },
                                  { name: "Gina Abroad - British Degree Route", category: "Academic Guide", icon: "🇬🇧", fileUrl: "/assets/certificates/Gina Abroad_Your-Smartest-Route-to-a-British-Degree.pdf" }
                                ];
                                const list = selectedPage.content?.programDownloads || defaultDocs;
                                return list.map((doc, idx) => (
                                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 relative group hover:border-indigo-200 transition-all">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                      <div className="md:col-span-1">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Icon</label>
                                        <input
                                          className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-center text-lg font-bold"
                                          value={doc.icon || "📄"}
                                          onChange={(e) => {
                                            const current = [...list];
                                            current[idx] = { ...current[idx], icon: e.target.value };
                                            handleContentChange(null, 'programDownloads', current);
                                          }}
                                        />
                                      </div>
                                      <div className="md:col-span-4">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Document Title</label>
                                        <input
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                                          value={doc.name || ""}
                                          onChange={(e) => {
                                            const current = [...list];
                                            current[idx] = { ...current[idx], name: e.target.value };
                                            handleContentChange(null, 'programDownloads', current);
                                          }}
                                          placeholder="Document Name..."
                                        />
                                      </div>
                                      <div className="md:col-span-3">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Category</label>
                                        <input
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600"
                                          value={doc.category || ""}
                                          onChange={(e) => {
                                            const current = [...list];
                                            current[idx] = { ...current[idx], category: e.target.value };
                                            handleContentChange(null, 'programDownloads', current);
                                          }}
                                          placeholder="Category..."
                                        />
                                      </div>
                                      <div className="md:col-span-4 flex items-center gap-2 pt-4 md:pt-0">
                                        <div className="flex-1 overflow-hidden">
                                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">File URL / Path</label>
                                          <input
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-mono text-slate-500 truncate"
                                            value={doc.fileUrl || doc.filename || ""}
                                            onChange={(e) => {
                                              const current = [...list];
                                              current[idx] = { ...current[idx], fileUrl: e.target.value };
                                              handleContentChange(null, 'programDownloads', current);
                                            }}
                                            placeholder="/assets/certificates/file.pdf"
                                          />
                                        </div>
                                        <label className="px-3 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl border border-indigo-200 text-xs font-bold cursor-pointer transition-all flex items-center gap-1 shrink-0 mt-4">
                                          <Upload size={14} /> Upload PDF
                                          <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={async (e) => {
                                              if (e.target.files?.[0]) {
                                                const file = e.target.files[0];
                                                const formData = new FormData();
                                                formData.append('image', file);
                                                try {
                                                  const res = await fetch(getApiUrl('/api/admin/upload'), {
                                                    method: 'POST',
                                                    headers: { 'ngrok-skip-browser-warning': 'true' },
                                                    body: formData
                                                  });
                                                  const data = await res.json();
                                                  if (data.success && data.url) {
                                                    const current = [...list];
                                                    current[idx] = { ...current[idx], fileUrl: data.url };
                                                    handleContentChange(null, 'programDownloads', current);
                                                  }
                                                } catch (err) {
                                                  console.error('PDF upload failed:', err);
                                                }
                                              }
                                            }}
                                          />
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const current = list.filter((_, i) => i !== idx);
                                            handleContentChange(null, 'programDownloads', current);
                                          }}
                                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl shrink-0 mt-4 transition-all"
                                          title="Remove Document"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                          {/* 6. TEAM PILLARS BANNER & IMAGE */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3 border-b border-slate-200/80 pb-3">
                              <Users size={18} className="text-brand-600" /> 6. Team Pillars Banner & Image
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Banner Tag</label>
                                  <input
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-600"
                                    value={selectedPage.content?.teamBanner?.tag ?? "Our Pillars"}
                                    onChange={(e) => handleContentChange('teamBanner', 'tag', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Banner Title</label>
                                  <input
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                                    value={selectedPage.content?.teamBanner?.title ?? "The team behind your success"}
                                    onChange={(e) => handleContentChange('teamBanner', 'title', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Overlay Quote</label>
                                <input
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-brand-600 italic"
                                  value={selectedPage.content?.teamBanner?.quote ?? "Be Great. Do Good. Learn Always."}
                                  onChange={(e) => handleContentChange('teamBanner', 'quote', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 block">Banner Subtext</label>
                                <textarea
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-20 resize-none"
                                  value={selectedPage.content?.teamBanner?.desc ?? "Whether organizing mock tests or conducting staff alignment meetings in our conference halls, our core value remains the same: student success comes first."}
                                  onChange={(e) => handleContentChange('teamBanner', 'desc', e.target.value)}
                                />
                              </div>

                              {/* Team Banner Image Upload & Preview */}
                              <div className="pt-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Team Banner Image Preview</label>
                                <div className="relative h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-200 group">
                                  <SafeImage
                                    src={getAssetUrl(selectedPage.content?.teamBanner?.image || "/assets/fetc-about-us/welcome-3.jpeg")}
                                    className="w-full h-full object-cover"
                                    alt="Team Banner Preview"
                                  />
                                  <label className="absolute inset-0 bg-slate-950/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer font-bold text-xs gap-1.5">
                                    <Upload size={20} /> Replace Team Banner Image
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                          const file = e.target.files[0];
                                          const formData = new FormData();
                                          formData.append('image', file);
                                          try {
                                            const res = await fetch(getApiUrl('/api/admin/upload'), {
                                              method: 'POST',
                                              headers: { 'ngrok-skip-browser-warning': 'true' },
                                              body: formData
                                            });
                                            const data = await res.json();
                                            if (data.success && data.url) {
                                              handleContentChange('teamBanner', 'image', data.url);
                                            } else {
                                              alert('Upload failed: ' + (data.message || 'Error uploading file'));
                                            }
                                          } catch (err) {
                                            console.error('Upload failed:', err);
                                            alert('Upload error. Please try again.');
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 7. CERTIFICATIONS & ACCREDITATIONS */}
                          <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                  <Award size={18} className="text-brand-600" /> 7. Certifications & Accreditations
                                </h3>
                                <p className="text-[11px] text-slate-400 font-normal">Official certificate & appointment images</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultCerts = [
                                    { src: "/assets/certificates/Screenshot 2026-06-10 111633.png", alt: "Certificate of Representation" },
                                    { src: "/assets/certificates/Screenshot 2026-06-10 111657.png", alt: "City College Birmingham Appointment Letter" },
                                    { src: "/assets/certificates/Screenshot 2026-06-10 111719.png", alt: "Certificate of Attendance" },
                                    { src: "/assets/certificates/Screenshot 2026-06-10 111730.png", alt: "ICEF Accredited Certificate" }
                                  ];
                                  const current = selectedPage.content?.certificates || defaultCerts;
                                  handleContentChange(null, 'certificates', [
                                    ...current,
                                    { src: "", alt: "New Certificate Title" }
                                  ]);
                                }}
                                className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                              >
                                <Plus size={14} /> Add Certificate
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                              {(selectedPage.content?.certificates || [
                                { src: "/assets/certificates/Screenshot 2026-06-10 111633.png", alt: "Certificate of Representation" },
                                { src: "/assets/certificates/Screenshot 2026-06-10 111657.png", alt: "City College Birmingham Appointment Letter" },
                                { src: "/assets/certificates/Screenshot 2026-06-10 111719.png", alt: "Certificate of Attendance" },
                                { src: "/assets/certificates/Screenshot 2026-06-10 111730.png", alt: "ICEF Accredited Certificate" }
                              ]).map((cert, idx) => {
                                const defaultCertsList = [
                                  { src: "/assets/certificates/Screenshot 2026-06-10 111633.png", alt: "Certificate of Representation" },
                                  { src: "/assets/certificates/Screenshot 2026-06-10 111657.png", alt: "City College Birmingham Appointment Letter" },
                                  { src: "/assets/certificates/Screenshot 2026-06-10 111719.png", alt: "Certificate of Attendance" },
                                  { src: "/assets/certificates/Screenshot 2026-06-10 111730.png", alt: "ICEF Accredited Certificate" }
                                ];
                                return (
                                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group">
                                  <div className="h-44 bg-white rounded-xl overflow-hidden border border-slate-200 relative">
                                    {cert.src ? (
                                      <>
                                        <SafeImage src={getAssetUrl(cert.src)} className="w-full h-full object-contain p-2" alt={cert.alt} />
                                        <label className="absolute inset-0 bg-slate-900/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer font-bold text-xs gap-1">
                                          <Upload size={18} /> Replace Image
                                          <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                              if (e.target.files?.[0]) {
                                                const file = e.target.files[0];
                                                const formData = new FormData();
                                                formData.append('image', file);
                                                try {
                                                  const res = await fetch(getApiUrl('/api/admin/upload'), {
                                                    method: 'POST',
                                                    headers: { 'ngrok-skip-browser-warning': 'true' },
                                                    body: formData
                                                  });
                                                  const data = await res.json();
                                                  if (data.success && data.url) {
                                                    const current = [...(selectedPage.content?.certificates || defaultCertsList)];
                                                    current[idx] = { ...current[idx], src: data.url };
                                                    handleContentChange(null, 'certificates', current);
                                                  }
                                                } catch (err) {
                                                  console.error('Certificate upload failed:', err);
                                                }
                                              }
                                            }}
                                          />
                                        </label>
                                      </>
                                    ) : (
                                      <label className="w-full h-full flex flex-col items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-brand-600 transition-all cursor-pointer p-4 text-center gap-1.5 border-2 border-dashed border-slate-300 rounded-xl">
                                        <Upload size={24} className="text-brand-600 mb-1" />
                                        <span className="text-xs font-bold text-slate-700">Upload Certificate Image</span>
                                        <span className="text-[10px] text-slate-400">Click to select file</span>
                                        <input
                                          type="file"
                                          className="hidden"
                                          accept="image/*"
                                          onChange={async (e) => {
                                            if (e.target.files?.[0]) {
                                              const file = e.target.files[0];
                                              const formData = new FormData();
                                              formData.append('image', file);
                                              try {
                                                const res = await fetch(getApiUrl('/api/admin/upload'), {
                                                  method: 'POST',
                                                  headers: { 'ngrok-skip-browser-warning': 'true' },
                                                  body: formData
                                                });
                                                const data = await res.json();
                                                if (data.success && data.url) {
                                                  const current = [...(selectedPage.content?.certificates || defaultCertsList)];
                                                  current[idx] = { ...current[idx], src: data.url };
                                                  handleContentChange(null, 'certificates', current);
                                                }
                                              } catch (err) {
                                                console.error('Certificate upload failed:', err);
                                              }
                                            }
                                          }}
                                        />
                                      </label>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <input
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                                      value={cert.alt || ""}
                                      onChange={(e) => {
                                        const current = [...(selectedPage.content?.certificates || defaultCertsList)];
                                        current[idx] = { ...current[idx], alt: e.target.value };
                                        handleContentChange(null, 'certificates', current);
                                      }}
                                      placeholder="Certificate Title..."
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = (selectedPage.content?.certificates || defaultCertsList).filter((_, i) => i !== idx);
                                        handleContentChange(null, 'certificates', current);
                                      }}
                                      className="w-full py-1.5 text-red-500 hover:bg-red-50 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                                    >
                                      <Trash2 size={12} /> Remove
                                    </button>
                                  </div>
                                </div>
                              );
                              })}
                            </div>
                          </div>

                          {/* 8. TEAM & CAMPUS ENVIRONMENT GALLERY PHOTOS */}
                          <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                  <ImageIcon size={18} className="text-brand-600" /> 8. Team & Campus Environment Gallery Photos
                                </h3>
                                <p className="text-[11px] text-slate-400 font-normal">Showcase testing labs, executive lounges, events, and workspaces</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultGallery = [
                                    { src: "/assets/office-images/testing-lab.jpg", title: "High-Capacity Testing Lab", category: "Labs", location: "Surat Vesu Branch", desc: "State-of-the-art computer labs customized for official IELTS and PTE exam delivery." },
                                    { src: "/assets/office-images/vip-conference.jpg", title: "VIP Executive Conference", category: "Spaces", location: "Surat Vesu Branch", desc: "Professional conference space for academic training and workshops." },
                                    { src: "/assets/office-images/vip-exam-centre.jpg", title: "Authorised City College Birmingham Centre", category: "Spaces", location: "Surat Vesu Branch", desc: "Authorised Study Centre for City College Birmingham, UK." },
                                    { src: "/assets/office-images/directors-cabin.jpeg", title: "Director's Cabin", category: "Spaces", location: "Surat Vesu Branch", desc: "Our executive administrative space." },
                                    { src: "/assets/office-images/p1.jpeg", title: "Navratri Traditional Day", category: "Events & News", location: "Surat Vesu Branch", desc: "Celebration of Navratri festival with staff." },
                                    { src: "/assets/office-images/p2.jpeg", title: "Diwali Celebration Dinner", category: "Events & News", location: "FETC Grand Ballroom", desc: "Annual festive dinner gathering with staff." },
                                    { src: "/assets/office-images/p3.jpeg", title: "Annual Team Trip & Offsite", category: "Events & News", location: "FETC Offsite", desc: "Annual retreat promoting team building." },
                                    { src: "/assets/office-images/p4.jpeg", title: "Champions of the League", category: "Events & News", location: "Surat Turf Arena", desc: "Turf cricket championship victory." },
                                    { src: "/assets/office-images/p5.jpeg", title: "Faculty Training Seminars", category: "Events & News", location: "Surat Vesu Branch", desc: "Score-optimization bootcamps." },
                                    { src: "/assets/office-images/p6.jpeg", title: "Student Success Ceremony", category: "Events & News", location: "Surat Vesu Branch", desc: "Recognizing high scoring students." },
                                    { src: "/assets/news/news1.png", title: "CBSE Mock Test Initiative", category: "Events & News", location: "Radiant School", desc: "English mock test for 700+ students." },
                                    { src: "/assets/news/news2.png", title: "Foreign Innovation Test", category: "Events & News", location: "Radiant School", desc: "Media coverage of mock test." },
                                    { src: "/assets/office-images/exterior-roongta-vesu.jpeg", title: "Roongta Business Park Campus", category: "Exterior", location: "Surat Vesu Branch", desc: "Flagship training center." },
                                    { src: "/assets/office-images/exterior-varachha-prime.jpeg", title: "Varachha Branch Campus", category: "Exterior", location: "Surat Varachha Branch", desc: "Second fully equipped branch." },
                                    { src: "/assets/office-images/admin-pc.jpeg", title: "Administrative Terminal", category: "Workspace", location: "Surat Vesu Branch", desc: "Dedicated administrative workspace." },
                                    { src: "/assets/office-images/waiting-area-washroom.jpeg", title: "Student Lounge & Waiting Area", category: "Workspace", location: "Surat Vesu Branch", desc: "Spacious lobby for candidates." }
                                  ];
                                  const current = selectedPage.content?.galleryItems || defaultGallery;
                                  handleContentChange(null, 'galleryItems', [
                                    ...current,
                                    { src: "", title: "New Campus Photo", category: "Spaces", location: "Surat Branch", desc: "Campus facility detail." }
                                  ]);
                                }}
                                className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                              >
                                <Plus size={14} /> Add Extra Photo
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                              {(() => {
                                const defaultGallery = [
                                  { src: "/assets/office-images/testing-lab.jpg", title: "High-Capacity Testing Lab", category: "Labs", location: "Surat Vesu Branch", desc: "State-of-the-art computer labs customized for official IELTS and PTE exam delivery." },
                                  { src: "/assets/office-images/vip-conference.jpg", title: "VIP Executive Conference", category: "Spaces", location: "Surat Vesu Branch", desc: "Professional conference space for academic training and workshops." },
                                  { src: "/assets/office-images/vip-exam-centre.jpg", title: "Authorised City College Birmingham Centre", category: "Spaces", location: "Surat Vesu Branch", desc: "Authorised Study Centre for City College Birmingham, UK." },
                                  { src: "/assets/office-images/directors-cabin.jpeg", title: "Director's Cabin", category: "Spaces", location: "Surat Vesu Branch", desc: "Our executive administrative space." },
                                  { src: "/assets/office-images/p1.jpeg", title: "Navratri Traditional Day", category: "Events & News", location: "Surat Vesu Branch", desc: "Celebration of Navratri festival with staff." },
                                  { src: "/assets/office-images/p2.jpeg", title: "Diwali Celebration Dinner", category: "Events & News", location: "FETC Grand Ballroom", desc: "Annual festive dinner gathering with staff." },
                                  { src: "/assets/office-images/p3.jpeg", title: "Annual Team Trip & Offsite", category: "Events & News", location: "FETC Offsite", desc: "Annual retreat promoting team building." },
                                  { src: "/assets/office-images/p4.jpeg", title: "Champions of the League", category: "Events & News", location: "Surat Turf Arena", desc: "Turf cricket championship victory." },
                                  { src: "/assets/office-images/p5.jpeg", title: "Faculty Training Seminars", category: "Events & News", location: "Surat Vesu Branch", desc: "Score-optimization bootcamps." },
                                  { src: "/assets/office-images/p6.jpeg", title: "Student Success Ceremony", category: "Events & News", location: "Surat Vesu Branch", desc: "Recognizing high scoring students." },
                                  { src: "/assets/news/news1.png", title: "CBSE Mock Test Initiative", category: "Events & News", location: "Radiant School", desc: "English mock test for 700+ students." },
                                  { src: "/assets/news/news2.png", title: "Foreign Innovation Test", category: "Events & News", location: "Radiant School", desc: "Media coverage of mock test." },
                                  { src: "/assets/office-images/exterior-roongta-vesu.jpeg", title: "Roongta Business Park Campus", category: "Exterior", location: "Surat Vesu Branch", desc: "Flagship training center." },
                                  { src: "/assets/office-images/exterior-varachha-prime.jpeg", title: "Varachha Branch Campus", category: "Exterior", location: "Surat Varachha Branch", desc: "Second fully equipped branch." },
                                  { src: "/assets/office-images/admin-pc.jpeg", title: "Administrative Terminal", category: "Workspace", location: "Surat Vesu Branch", desc: "Dedicated administrative workspace." },
                                  { src: "/assets/office-images/waiting-area-washroom.jpeg", title: "Student Lounge & Waiting Area", category: "Workspace", location: "Surat Vesu Branch", desc: "Spacious lobby for candidates." }
                                ];
                                const list = selectedPage.content?.galleryItems || defaultGallery;
                                return list.map((item, idx) => (
                                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group">
                                    <div className="h-44 bg-slate-900 rounded-xl overflow-hidden relative">
                                      {item.src ? (
                                        <>
                                          <SafeImage src={getAssetUrl(item.src)} className="w-full h-full object-cover" alt={item.title} />
                                          <label className="absolute inset-0 bg-slate-900/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer font-bold text-xs gap-1">
                                            <Upload size={18} /> Replace Photo
                                            <input
                                              type="file"
                                              className="hidden"
                                              accept="image/*"
                                              onChange={async (e) => {
                                                if (e.target.files?.[0]) {
                                                  const file = e.target.files[0];
                                                  const formData = new FormData();
                                                  formData.append('image', file);
                                                  try {
                                                    const res = await fetch(getApiUrl('/api/admin/upload'), {
                                                      method: 'POST',
                                                      headers: { 'ngrok-skip-browser-warning': 'true' },
                                                      body: formData
                                                    });
                                                    const data = await res.json();
                                                    if (data.success && data.url) {
                                                      const current = [...list];
                                                      current[idx] = { ...current[idx], src: data.url };
                                                      handleContentChange(null, 'galleryItems', current);
                                                    }
                                                  } catch (err) {
                                                    console.error('Gallery image upload failed:', err);
                                                  }
                                                }
                                              }}
                                            />
                                          </label>
                                        </>
                                      ) : (
                                        <label className="w-full h-full flex flex-col items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-brand-600 transition-all cursor-pointer p-4 text-center gap-1.5 border-2 border-dashed border-slate-300 rounded-xl">
                                          <Upload size={24} className="text-brand-600 mb-1" />
                                          <span className="text-xs font-bold text-slate-700">Upload Photo Image</span>
                                          <span className="text-[10px] text-slate-400">Click to select file</span>
                                          <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                              if (e.target.files?.[0]) {
                                                const file = e.target.files[0];
                                                const formData = new FormData();
                                                formData.append('image', file);
                                                try {
                                                  const res = await fetch(getApiUrl('/api/admin/upload'), {
                                                    method: 'POST',
                                                    headers: { 'ngrok-skip-browser-warning': 'true' },
                                                    body: formData
                                                  });
                                                  const data = await res.json();
                                                  if (data.success && data.url) {
                                                    const current = [...list];
                                                    current[idx] = { ...current[idx], src: data.url };
                                                    handleContentChange(null, 'galleryItems', current);
                                                  }
                                                } catch (err) {
                                                  console.error('Gallery image upload failed:', err);
                                                }
                                              }
                                            }}
                                          />
                                        </label>
                                      )}
                                    </div>
                                    <div className="space-y-2">
                                      <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Photo Title</label>
                                        <input
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                                          value={item.title || ""}
                                          onChange={(e) => {
                                            const current = [...list];
                                            current[idx] = { ...current[idx], title: e.target.value };
                                            handleContentChange(null, 'galleryItems', current);
                                          }}
                                          placeholder="Title..."
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Category</label>
                                          <select
                                            className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                                            value={item.category || "Spaces"}
                                            onChange={(e) => {
                                              const current = [...list];
                                              current[idx] = { ...current[idx], category: e.target.value };
                                              handleContentChange(null, 'galleryItems', current);
                                            }}
                                          >
                                            <option value="Labs">Labs</option>
                                            <option value="Spaces">Spaces</option>
                                            <option value="Events & News">Events & News</option>
                                            <option value="Exterior">Exterior</option>
                                            <option value="Workspace">Workspace</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Location</label>
                                          <input
                                            className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600"
                                            value={item.location || ""}
                                            onChange={(e) => {
                                              const current = [...list];
                                              current[idx] = { ...current[idx], location: e.target.value };
                                              handleContentChange(null, 'galleryItems', current);
                                            }}
                                            placeholder="Surat..."
                                          />
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const current = list.filter((_, i) => i !== idx);
                                          handleContentChange(null, 'galleryItems', current);
                                        }}
                                        className="w-full py-1.5 text-red-500 hover:bg-red-50 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                                      >
                                        <Trash2 size={12} /> Remove
                                      </button>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. CONTACT US EDITOR */}
                      {selectedPage.slug.toLowerCase() === '/contact' && (
                        <div className="space-y-6 pb-20">
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Info size={18} className="text-brand-600" /> 1. Intro Section
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Title</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.infoSection?.title || ""}
                                  onChange={(e) => handleContentChange('infoSection', 'title', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.infoSection?.description || ""}
                                  onChange={(e) => handleContentChange('infoSection', 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <MapPin size={18} className="text-brand-600" /> 2. Contact Details
                            </h3>
                            <div className="space-y-6">
                              <div className="p-4 bg-white rounded-2xl border border-slate-100 italic space-y-3">
                                <label className="text-[10px] font-medium text-slate-300 uppercase tracking-tight block">Address Lines (One per line)</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={Array.isArray(selectedPage.content?.contactDetails?.address?.lines)
                                    ? selectedPage.content.contactDetails.address.lines.join('\n')
                                    : (typeof selectedPage.content?.contactDetails?.address === 'string'
                                        ? selectedPage.content.contactDetails.address
                                        : "")}
                                  onChange={(e) => {
                                    const currentAddressObj = typeof selectedPage.content?.contactDetails?.address === 'object' && selectedPage.content?.contactDetails?.address !== null
                                      ? selectedPage.content.contactDetails.address
                                      : {};
                                    handleContentChange('contactDetails', 'address', { ...currentAddressObj, lines: e.target.value.split('\n') });
                                  }}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Phone Number</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={typeof selectedPage.content?.contactDetails?.phone === 'object' ? selectedPage.content.contactDetails.phone?.number || "" : (typeof selectedPage.content?.contactDetails?.phone === 'string' ? selectedPage.content.contactDetails.phone : "")}
                                    onChange={(e) => {
                                      const currentPhoneObj = typeof selectedPage.content?.contactDetails?.phone === 'object' && selectedPage.content?.contactDetails?.phone !== null
                                        ? selectedPage.content.contactDetails.phone
                                        : {};
                                      handleContentChange('contactDetails', 'phone', { ...currentPhoneObj, number: e.target.value });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Email Address</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={typeof selectedPage.content?.contactDetails?.email === 'object' ? selectedPage.content.contactDetails.email?.address || "" : (typeof selectedPage.content?.contactDetails?.email === 'string' ? selectedPage.content.contactDetails.email : "")}
                                    onChange={(e) => {
                                      const currentEmailObj = typeof selectedPage.content?.contactDetails?.email === 'object' && selectedPage.content?.contactDetails?.email !== null
                                        ? selectedPage.content.contactDetails.email
                                        : {};
                                      handleContentChange('contactDetails', 'email', { ...currentEmailObj, address: e.target.value });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Clock size={18} className="text-brand-600" /> 3. Working Hours
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Weekday Hours</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.workingHours?.weekdays || ""}
                                  onChange={(e) => handleContentChange('workingHours', 'weekdays', e.target.value)}
                                  placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Sunday Status</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.workingHours?.sunday || ""}
                                  onChange={(e) => handleContentChange('workingHours', 'sunday', e.target.value)}
                                  placeholder="Sunday: Closed"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Globe size={18} className="text-brand-600" /> 4. Location Map
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Google Maps Embed URL</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-medium text-slate-500 h-32 resize-none focus:border-brand-300 outline-none transition-all font-mono"
                                  value={selectedPage.content?.mapSection?.mapUrl || ""}
                                  onChange={(e) => handleContentChange('mapSection', 'mapUrl', e.target.value)}
                                  placeholder="Paste the src URL from the Google Maps iframe..."
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. EXAM & TRAINING EDITOR */}
                      {(selectedPage.slug?.toLowerCase() === '/exam-training' || selectedPage.slug?.toLowerCase().startsWith('/exam-training/')) && (
                        <div className="space-y-6 pb-20">
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <BookOpen size={18} className="text-brand-600" /> 1. Exam Identity
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Exam Name (e.g. IDP for IELTS)</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.name || selectedPage.content?.hero?.title || ""}
                                  onChange={(e) => {
                                    handleContentChange(null, 'name', e.target.value);
                                    handleContentChange('hero', 'title', e.target.value);
                                  }}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Short Description (Summary)</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.description || selectedPage.content?.hero?.description || ""}
                                  onChange={(e) => {
                                    handleContentChange(null, 'description', e.target.value);
                                    handleContentChange('hero', 'description', e.target.value);
                                  }}
                                  placeholder="A short summary for lists..."
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-semibold text-brand-600 uppercase tracking-tight mb-1 block">Full Rich Content (Detailed Story)</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-64 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.fullDescription || selectedPage.content?.hero?.fullDescription || ""}
                                  onChange={(e) => {
                                    handleContentChange(null, 'fullDescription', e.target.value);
                                    handleContentChange('hero', 'fullDescription', e.target.value);
                                  }}
                                  placeholder="Add the full detailed story here..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <Tag size={18} className="text-brand-600" /> 2. Exam Metadata (Cost, Validity, etc.)
                              </h3>
                              <button
                                onClick={() => {
                                  const current = selectedPage.content.metadata || [];
                                  handleContentChange(null, 'metadata', [...current, { label: "New Tech", value: "TBA" }]);
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-medium hover:bg-brand-50 transition-all flex items-center gap-2 shadow-sm"
                              >
                                <Plus size={12} /> Add Field
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {(selectedPage.content?.metadata || []).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 group">
                                  <div className="flex-1 bg-white border border-slate-100 p-3 rounded-2xl flex flex-col gap-1">
                                    <input
                                      className="bg-transparent border-none p-0 text-[10px] font-medium uppercase text-slate-300 focus:ring-0"
                                      value={item.label}
                                      onChange={(e) => {
                                        const current = [...selectedPage.content.metadata];
                                        current[idx].label = e.target.value;
                                        handleContentChange(null, 'metadata', current);
                                      }}
                                    />
                                    <input
                                      className="bg-transparent border-none p-0 text-xs font-semibold text-slate-800 focus:ring-0"
                                      value={item.value}
                                      onChange={(e) => {
                                        const current = [...selectedPage.content.metadata];
                                        current[idx].value = e.target.value;
                                        handleContentChange(null, 'metadata', current);
                                      }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const current = selectedPage.content.metadata.filter((_, i) => i !== idx);
                                      handleContentChange(null, 'metadata', current);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-6 bg-white border-2 border-brand-100 border-dashed rounded-2xl">
                            <div className="flex items-center justify-between mb-8">
                              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <Sparkles size={18} className="text-brand-600" /> 3. Key Training Features
                              </h3>
                              <button
                                onClick={() => {
                                  const current = selectedPage.content.features || [];
                                  handleContentChange(null, 'features', [...current, { highlight: "100%", label: "New Feature" }]);
                                }}
                                className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-medium hover:bg-brand-600 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                              >
                                <Plus size={12} /> Add Feature
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {(selectedPage.content?.features || []).map((feature, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative group">
                                  <button
                                    onClick={() => {
                                      const current = selectedPage.content.features.filter((_, i) => i !== idx);
                                      handleContentChange(null, 'features', current);
                                    }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                                  >
                                    <X size={14} />
                                  </button>
                                  <input
                                    className="w-full bg-transparent border-none p-0 text-2xl font-semibold text-brand-600 focus:ring-0 mb-1"
                                    value={feature.highlight}
                                    onChange={(e) => {
                                      const current = [...selectedPage.content.features];
                                      current[idx].highlight = e.target.value;
                                      handleContentChange(null, 'features', current);
                                    }}
                                  />
                                  <input
                                    className="w-full bg-transparent border-none p-0 text-[10px] font-medium uppercase text-slate-400 focus:ring-0"
                                    value={feature.label}
                                    onChange={(e) => {
                                      const current = [...selectedPage.content.features];
                                      current[idx].label = e.target.value;
                                      handleContentChange(null, 'features', current);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 6. GALLERY EDITOR */}
                      {(selectedPage.slug?.toLowerCase() === '/gallery' || selectedPage.slug?.toLowerCase() === '/gallery/') && (
                        <div className="space-y-6 pb-20">
                          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-10">
                              <div>
                                <h3 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
                                  <ImageIcon size={24} className="text-brand-600" /> Visual Portfolio
                                </h3>
                                <p className="text-xs text-slate-400 font-medium italic mt-1">Manage the snapshots of your facilities and success stories.</p>
                              </div>
                              <label className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-medium uppercase tracking-widest hover:bg-brand-600 hover:-translate-y-1 transition-all shadow-xl cursor-pointer active:scale-95">
                                <Plus size={16} /> Add Photo
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => e.target.files?.[0] && handleFileUpload(null, 'images', e.target.files[0])}
                                />
                              </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {(selectedPage.content?.images || []).map((img, idx) => (
                                <div key={idx} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                    <SafeImage src={getAssetUrl(img.src)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery" />
                                    <button
                                      onClick={() => {
                                        const current = selectedPage.content.images.filter((_, i) => i !== idx);
                                        handleContentChange(null, 'images', current);
                                      }}
                                      className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                                    >
                                      <X size={18} />
                                    </button>
                                  </div>
                                  <div className="p-5 space-y-4">
                                    <div>
                                      <label className="text-[9px] font-semibold text-slate-300 uppercase tracking-widest block mb-1">Photo Title</label>
                                      <input
                                        className="w-full bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-[11px] font-medium text-slate-700 focus:border-brand-200 outline-none transition-colors"
                                        value={img.title || ""}
                                        onChange={(e) => {
                                          const current = [...selectedPage.content.images];
                                          current[idx].title = e.target.value;
                                          handleContentChange(null, 'images', current);
                                        }}
                                        placeholder="e.g. VIP Conference Room"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-semibold text-slate-300 uppercase tracking-widest block mb-1">Category</label>
                                      <input
                                        className="w-full bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-[11px] font-medium text-slate-700 focus:border-brand-200 outline-none transition-colors"
                                        value={img.category || ""}
                                        onChange={(e) => {
                                          const current = [...selectedPage.content.images];
                                          current[idx].category = e.target.value;
                                          handleContentChange(null, 'images', current);
                                        }}
                                        placeholder="e.g. Office / Labs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {(!selectedPage.content?.images || selectedPage.content.images.length === 0) && (
                              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                <ImageIcon size={40} className="mx-auto mb-4 text-slate-100" />
                                <p className="text-slate-300 font-bold italic tracking-tight">Your gallery is waiting for its first photo...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 7. CAREER ASSESSMENT PAGE EDITOR */}
                      {selectedPage.slug?.toLowerCase().includes('career-assessment') && (
                        <div className="space-y-6 pb-20">
                          {/* Section 1: Hero Identity */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                              <Target size={18} className="text-brand-600" /> 1. Hero Identity & Title
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Badge Text</label>
                                <input
                                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                                  value={selectedPage.content?.hero?.badge ?? "Verified Assessment"}
                                  onChange={(e) => handleNestedContentChange('hero', null, 'badge', e.target.value)}
                                  placeholder="Verified Assessment"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Primary Profile</label>
                                <input
                                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                                  value={selectedPage.content?.hero?.primaryProfile ?? "Consultative Leader"}
                                  onChange={(e) => handleNestedContentChange('hero', null, 'primaryProfile', e.target.value)}
                                  placeholder="Consultative Leader"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Main Title</label>
                                <input
                                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                                  value={selectedPage.content?.hero?.title ?? selectedPage.content?.title ?? "Behavioral & Career"}
                                  onChange={(e) => {
                                    handleNestedContentChange('hero', null, 'title', e.target.value);
                                    handleContentChange(null, 'title', e.target.value);
                                  }}
                                  placeholder="Behavioral & Career"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Title Highlight</label>
                                <input
                                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-brand-600 outline-none"
                                  value={selectedPage.content?.hero?.titleHighlight ?? "Analysis Report"}
                                  onChange={(e) => handleNestedContentChange('hero', null, 'titleHighlight', e.target.value)}
                                  placeholder="Analysis Report"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Detailed Description</label>
                              <textarea
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-24 resize-none outline-none"
                                value={selectedPage.content?.hero?.description ?? selectedPage.content?.description ?? ""}
                                onChange={(e) => {
                                  handleNestedContentChange('hero', null, 'description', e.target.value);
                                  handleContentChange(null, 'description', e.target.value);
                                }}
                                placeholder="Describe your career analysis evaluation parameters..."
                              />
                            </div>
                          </div>

                          {/* Section 2: Executive Summary & Strengths */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                              <LayoutGrid size={18} className="text-brand-600" /> 2. Executive Summary & Key Strengths
                            </h3>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Overview Summary</label>
                              <textarea
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-24 resize-none outline-none"
                                value={selectedPage.content?.overview?.summary ?? "The analysis indicates a strong alignment with roles requiring methodical organization, interpersonal diplomacy, and contextual consistency."}
                                onChange={(e) => handleNestedContentChange('overview', null, 'summary', e.target.value)}
                                placeholder="Write overview summary..."
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Primary Modality</label>
                                <input
                                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                                  value={selectedPage.content?.overview?.primaryModality ?? "Visual-Dominant"}
                                  onChange={(e) => handleNestedContentChange('overview', null, 'primaryModality', e.target.value)}
                                  placeholder="Visual-Dominant"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Modality Description</label>
                                <input
                                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 outline-none"
                                  value={selectedPage.content?.overview?.modalityDesc ?? "Primary cognitive processing occurs through spatial and observational engagement."}
                                  onChange={(e) => handleNestedContentChange('overview', null, 'modalityDesc', e.target.value)}
                                  placeholder="Modality description..."
                                />
                              </div>
                            </div>

                            {/* Strengths List */}
                            <div className="pt-2">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Strengths List</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = selectedPage.content?.overview?.strengths || [];
                                    handleNestedContentChange('overview', null, 'strengths', [...current, "New Candidate Strength"]);
                                  }}
                                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-brand-600 transition-all flex items-center gap-1"
                                >
                                  <Plus size={12} /> Add Strength
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {(selectedPage.content?.overview?.strengths || [
                                  "Effectively processes and utilizes feedback",
                                  "Engages positively in recognition exchanges",
                                  "Consistently identifies potential in peers",
                                  "Demonstrates high emotional intelligence"
                                ]).map((str, sIdx) => (
                                  <div key={sIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                                    <input
                                      className="flex-1 px-2.5 py-1 bg-transparent text-xs font-medium text-slate-700 outline-none"
                                      value={str}
                                      onChange={(e) => {
                                        const current = [...(selectedPage.content?.overview?.strengths || [])];
                                        current[sIdx] = e.target.value;
                                        handleNestedContentChange('overview', null, 'strengths', current);
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = (selectedPage.content?.overview?.strengths || []).filter((_, i) => i !== sIdx);
                                        handleNestedContentChange('overview', null, 'strengths', current);
                                      }}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Section 3: Core Competencies Manager */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                  <Target size={18} className="text-brand-600" /> 3. Core Competencies & Evaluation Scores
                                </h3>
                                <p className="text-xs text-slate-400 font-medium">Manage subject parameters and target percentage scores.</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = selectedPage.content?.competencies || [];
                                  handleContentChange(null, 'competencies', [...current, { subject: "New Competency", score: 80 }]);
                                }}
                                className="px-3.5 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <Plus size={14} /> Add Competency
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {(selectedPage.content?.competencies || [
                                { subject: 'Democratic values', score: 90 },
                                { subject: 'Helping attitude', score: 85 },
                                { subject: 'Organizing', score: 70 },
                                { subject: 'Market research', score: 75 }
                              ]).map((comp, cIdx) => (
                                <div key={cIdx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                                  <div className="flex-1 space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Subject / Skill</label>
                                    <input
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                                      value={comp.subject || ""}
                                      onChange={(e) => {
                                        const current = [...(selectedPage.content?.competencies || [])];
                                        current[cIdx] = { ...current[cIdx], subject: e.target.value };
                                        handleContentChange(null, 'competencies', current);
                                      }}
                                    />
                                  </div>
                                  <div className="w-20 space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Score (%)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-brand-600 text-center"
                                      value={comp.score || 0}
                                      onChange={(e) => {
                                        const current = [...(selectedPage.content?.competencies || [])];
                                        current[cIdx] = { ...current[cIdx], score: Number(e.target.value) };
                                        handleContentChange(null, 'competencies', current);
                                      }}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = (selectedPage.content?.competencies || []).filter((_, i) => i !== cIdx);
                                      handleContentChange(null, 'competencies', current);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Section 4: Assessment Fee Editor */}
                          <div className="p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2">
                              <CreditCard size={18} className="text-brand-600" />
                              <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                Career Assessment Fee (INR)
                              </label>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                              Set the payment amount charged on the checkout modal when candidates start the assessment.
                            </p>
                            <div className="relative max-w-sm pt-1">
                              <span className="absolute left-4 top-[18px] text-slate-500 font-bold text-sm">₹</span>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                className="w-full pl-9 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none transition-all shadow-sm"
                                value={selectedPage.content?.amount ?? selectedPage.content?.fee ?? 1000}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleContentChange(null, 'amount', val);
                                  handleContentChange(null, 'fee', val);
                                }}
                                placeholder="1000"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 8. POLICY EDITOR (Terms, Privacy, Refund) */}
                      {(selectedPage.slug?.toLowerCase() === '/terms' || selectedPage.slug?.toLowerCase() === '/privacy' || selectedPage.slug?.toLowerCase() === '/refund') && (
                        <div className="space-y-6 pb-20">
                          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                              <FileText size={22} className="text-brand-600" /> Policy Content Editor
                            </h3>
                            <div className="space-y-6">
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-2 block">Last Updated Date</label>
                                <input
                                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:border-brand-300 outline-none transition-all shadow-sm"
                                  value={selectedPage.content?.lastUpdated || ""}
                                  onChange={(e) => handleContentChange(null, 'lastUpdated', e.target.value)}
                                  placeholder="e.g. October 24, 2026"
                                />
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">Policy Sections</label>
                                  <button
                                    onClick={() => {
                                      const current = selectedPage.content?.sections || [];
                                      handleContentChange(null, 'sections', [...current, { title: "New Section", body: "" }]);
                                    }}
                                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-medium hover:bg-brand-600 transition-all flex items-center gap-2"
                                  >
                                    <Plus size={12} /> Add Section
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {(selectedPage.content?.sections || []).map((section, idx) => (
                                    <div key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl relative group shadow-sm">
                                      <button
                                        onClick={() => {
                                          const current = selectedPage.content.sections.filter((_, i) => i !== idx);
                                          handleContentChange(null, 'sections', current);
                                        }}
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                                      >
                                        <X size={16} />
                                      </button>
                                      <input
                                        className="w-full bg-transparent border-none p-0 text-lg font-semibold text-slate-900 focus:ring-0 mb-3"
                                        value={section.title}
                                        onChange={(e) => {
                                          const current = [...selectedPage.content.sections];
                                          current[idx].title = e.target.value;
                                          handleContentChange(null, 'sections', current);
                                        }}
                                        placeholder="Section Title"
                                      />
                                      <textarea
                                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-600 h-32 resize-none focus:border-brand-200 outline-none transition-colors"
                                        value={section.body}
                                        onChange={(e) => {
                                          const current = [...selectedPage.content.sections];
                                          current[idx].body = e.target.value;
                                          handleContentChange(null, 'sections', current);
                                        }}
                                        placeholder="Enter policy details here..."
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 9. FAQ EDITOR */}
                      {(selectedPage.slug?.toLowerCase() === '/faq' || selectedPage.slug?.toLowerCase() === '/faq/') && (
                        <div className="space-y-6 pb-20">
                          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                              <Info size={22} className="text-brand-600" /> FAQ Knowledge Base
                            </h3>
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">Questions & Answers</label>
                                <button
                                  onClick={() => {
                                    const current = selectedPage.content?.faqs || [];
                                    handleContentChange(null, 'faqs', [...current, { question: "New Question?", answer: "" }]);
                                  }}
                                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-medium hover:bg-brand-600 transition-all flex items-center gap-2 shadow-lg"
                                >
                                  <Plus size={14} /> Add FAQ Item
                                </button>
                              </div>

                               <div className="space-y-4">
                                {(selectedPage.content?.faqs || (selectedPage.content?.sections ? selectedPage.content.sections.flatMap(s => s.faqs || []) : [])).map((faq, idx) => (
                                  <div key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl relative group shadow-sm overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-600" />
                                    <button
                                      onClick={() => {
                                        const current = selectedPage.content?.faqs || (selectedPage.content?.sections ? selectedPage.content.sections.flatMap(s => s.faqs || []) : []);
                                        const updated = current.filter((_, i) => i !== idx);
                                        handleContentChange(null, 'faqs', updated);
                                      }}
                                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                                    >
                                      <X size={16} />
                                    </button>
                                    <input
                                      className="w-full bg-transparent border-none p-0 text-base font-semibold text-slate-900 focus:ring-0 mb-3"
                                      value={faq.question || ""}
                                      onChange={(e) => {
                                        const current = [...(selectedPage.content?.faqs || (selectedPage.content?.sections ? selectedPage.content.sections.flatMap(s => s.faqs || []) : []))];
                                        current[idx] = { ...current[idx], question: e.target.value };
                                        handleContentChange(null, 'faqs', current);
                                      }}
                                      placeholder="Question?"
                                    />
                                    <textarea
                                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-600 h-24 resize-none focus:border-brand-200 outline-none transition-colors"
                                      value={faq.answer || ""}
                                      onChange={(e) => {
                                        const current = [...(selectedPage.content?.faqs || (selectedPage.content?.sections ? selectedPage.content.sections.flatMap(s => s.faqs || []) : []))];
                                        current[idx] = { ...current[idx], answer: e.target.value };
                                        handleContentChange(null, 'faqs', current);
                                      }}
                                      placeholder="Answer the question..."
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DYNAMIC SECTION EDITOR FOR GENERIC PAGES */}
                      {selectedPage.slug !== '/' && selectedPage.slug !== '/about/company-profile' && selectedPage.slug !== '/about' && selectedPage.slug.toLowerCase() !== '/contact' && selectedPage.slug.toLowerCase() !== '/study-abroad' && !selectedPage.slug.toLowerCase().startsWith('/study-abroad/') && selectedPage.slug.toLowerCase() !== '/exam-training' && !selectedPage.slug.toLowerCase().startsWith('/exam-training/') && selectedPage.slug.toLowerCase() !== '/mock-tests' && selectedPage.slug.toLowerCase() !== '/mock' && selectedPage.slug !== '/gallery' && !selectedPage.slug.includes('career-assessment') && selectedPage.slug !== '/terms' && selectedPage.slug !== '/privacy' && selectedPage.slug !== '/refund' && selectedPage.slug !== '/faq' && (
                        <div className="space-y-8 pb-20">
                          <div className="bg-brand-50/50 p-8 rounded-2xl border border-brand-100 flex items-center justify-between gap-6">
                            <div>
                              <h3 className="text-lg font-bold text-brand-900 mb-1">Custom Page Builder</h3>
                              <p className="text-xs text-brand-600 font-medium">Add sections to build your custom page layout.</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addSection('text')}
                                className="px-5 py-3 bg-white text-brand-700 rounded-xl font-bold text-[11px] uppercase tracking-wider border border-brand-200 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                              >
                                + Text Block
                              </button>
                              <button
                                onClick={() => addSection('image_text')}
                                className="px-5 py-3 bg-white text-brand-700 rounded-xl font-bold text-[11px] uppercase tracking-wider border border-brand-200 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                              >
                                + Image & Text
                              </button>
                            </div>
                          </div>

                          <div className="space-y-6">
                            {selectedPage.content?.sections?.map((section, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm group relative"
                              >
                                <button
                                  onClick={() => removeSection(idx)}
                                  className="absolute top-6 right-6 p-2 text-rose-300 hover:text-rose-500 transition-colors"
                                >
                                  <X size={18} />
                                </button>

                                <div className="flex items-center gap-2 mb-6">
                                  <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-medium uppercase tracking-widest border border-slate-100">
                                    Section #{idx + 1} — {section.type}
                                  </span>
                                </div>

                                <div className="space-y-4">
                                  <input
                                    className="w-full px-0 text-xl font-semibold text-slate-900 placeholder:text-slate-300 border-none focus:ring-0 outline-none"
                                    placeholder="Enter section title..."
                                    value={section.title}
                                    onChange={(e) => updateSection(idx, 'title', e.target.value)}
                                  />

                                  {section.type === 'image_text' && (
                                    <div className="grid grid-cols-2 gap-6 items-start">
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">Section Image</label>
                                        <div className="relative group aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-slate-400">
                                          {section.image ? (
                                            <SafeImage src={getAssetUrl(section.image)} className="w-full h-full object-cover" alt="Section" />
                                          ) : (
                                            <>
                                              <ImageIcon size={24} className="mb-2" />
                                              <span className="text-[10px] font-bold">No image selected</span>
                                            </>
                                          )}
                                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <label className="p-3 bg-white text-slate-900 rounded-full cursor-pointer shadow-xl">
                                              <Edit size={18} />
                                              <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                    const formData = new FormData();
                                                    formData.append('image', file);
                                                    fetch(getApiUrl('/api/admin/upload'), { method: 'POST', body: formData })
                                                      .then(res => res.json())
                                                      .then(data => data.success && updateSection(idx, 'image', data.url));
                                                  }
                                                }}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <textarea
                                        className="w-full h-full min-h-[150px] p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:border-brand-200 outline-none transition-colors resize-none"
                                        placeholder="Write section body content..."
                                        value={section.body}
                                        onChange={(e) => updateSection(idx, 'body', e.target.value)}
                                      />
                                    </div>
                                  )}

                                  {section.type === 'text' && (
                                    <textarea
                                      className="w-full min-h-[200px] p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:border-brand-200 outline-none transition-colors resize-none"
                                      placeholder="Write section body content..."
                                      value={section.body}
                                      onChange={(e) => updateSection(idx, 'body', e.target.value)}
                                    />
                                  )}
                                </div>
                              </motion.div>
                            ))}

                            {(!selectedPage.content?.sections || selectedPage.content.sections.length === 0) && (
                              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] opacity-40">
                                <Plus size={32} className="mx-auto mb-4 text-slate-300" />
                                <p className="text-sm font-bold italic text-slate-400 tracking-tight">Your page is empty. Start adding sections!</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* MOCK TESTS PAGE EDITOR */}
                      {(selectedPage.slug?.toLowerCase() === '/mock-tests' || selectedPage.slug?.toLowerCase() === '/mock') && (
                        <div className="space-y-6 pb-20">
                          {/* 1. Page Header */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Globe size={18} className="text-brand-600" /> 1. Page Header & Subtitle
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Badge Text</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.badge || "Practice & Succeed"}
                                  onChange={(e) => handleNestedContentChange('hero', null, 'badge', e.target.value)}
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Main Title</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.titleMain || "Practice Mock Exams & Tests"}
                                  onChange={(e) => handleNestedContentChange('hero', null, 'titleMain', e.target.value)}
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mb-1 block">Subtitle Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.subtitle || "Gain the confidence needed to clear your foreign educational and language requirements."}
                                  onChange={(e) => handleNestedContentChange('hero', null, 'subtitle', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 2. Mock Test Cards List */}
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                  <BookOpen size={18} className="text-brand-600" /> 2. Available Mock Tests ({selectedPage.content?.mockTestsList?.length || 0})
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                  Manage your mock test items, pricing, images, and syllabus descriptions.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={addMockTestItem}
                                className="px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-100"
                              >
                                <Plus size={14} /> Add Mock Test
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(selectedPage.content?.mockTestsList || []).map((test, idx) => (
                                <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 relative group">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                                      Mock Card #{idx + 1}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeMockTestItem(idx)}
                                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                      title="Remove Test"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Test Title</label>
                                      <input
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-brand-300"
                                        value={test.title || test.name || ""}
                                        onChange={(e) => updateMockTestItem(idx, 'title', e.target.value)}
                                        placeholder="e.g. SELT (Secure English Language Test)"
                                      />
                                    </div>

                                    <div>
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Price</label>
                                      <input
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-600 outline-none focus:border-brand-300"
                                        value={test.price || "₹49"}
                                        onChange={(e) => updateMockTestItem(idx, 'price', e.target.value)}
                                        placeholder="e.g. ₹49"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Description</label>
                                    <textarea
                                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 h-20 resize-none outline-none focus:border-brand-300"
                                      value={test.content || test.description || ""}
                                      onChange={(e) => updateMockTestItem(idx, 'content', e.target.value)}
                                      placeholder="Official practice test details..."
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Card Image</label>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            uploadMockTestImage(idx, e.target.files[0]);
                                          }
                                        }}
                                        className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer"
                                      />
                                    </div>
                                    {(test.image_url || test.image) && (
                                      <div className="mt-2.5 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                        <img src={getAssetUrl(test.image_url || test.image)} alt={test.title} className="w-full h-full object-cover" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4 md:px-8 bg-slate-50/80 border-t border-slate-100 shrink-0 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setSelectedPage(null); setActiveTab("settings"); }}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePage(selectedPage.id, selectedPage)}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? "Saving..." : "Save Page Content"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div className="relative">
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-brand-200/20 rounded-full blur-[60px] pointer-events-none" />
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Page Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Structure and manage your website's core pages.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="group flex items-center gap-3 bg-brand-600 text-white px-8 py-4 rounded-xl font-medium text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 active:scale-95 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Custom Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 w-screen h-screen z-[50] flex items-center justify-center pt-24 pb-6 px-4 overflow-y-auto">
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
                <h2 className="text-2xl font-semibold text-slate-900">Create New Page</h2>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Structure your website</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">Page Title</label>
                  <input
                    autoFocus
                    placeholder="e.g. Careers"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700"
                    value={newPageData.title}
                    onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">URL Slug</label>
                  <input
                    placeholder="/careers"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-500"
                    value={newPageData.slug}
                    onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
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
                    disabled={isSaving || !newPageData.title || !newPageData.slug}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-medium text-xs hover:bg-brand-600 transition-all shadow-xl shadow-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    {isSaving ? "Creating..." : "Create Page"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Category Filter Tabs */}
        <div className="px-6 pt-6 pb-2 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {["All", ...categories].map((cat) => {
            const count = cat === "All"
              ? pages.length
              : pages.filter(p => getCategory(p.slug) === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  selectedCategory === cat
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-medium" 
              placeholder="Search by Title or Slug" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-brand-600" size={16} />
            </div>
          )}
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                <th className="px-6 pb-2">Title</th>
                <th className="px-6 pb-2">Slug</th>
                <th className="px-6 pb-2">Status</th>
                <th className="px-6 pb-2">Updated On</th>
                <th className="px-6 pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page) => (
                <tr key={page.id} className="bg-slate-50 rounded-xl">
                  <td className="px-6 py-4 font-semibold text-xs text-slate-700 rounded-l-xl">
                    {page.title}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border ${
                      page.status === 'PUBLISHED' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {page.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    {formatDate(page.updated_at)}
                  </td>
                  <td className="px-6 py-4 text-right rounded-r-xl">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedPage(page)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Page"
                      >
                        <Edit size={14} />
                      </button>
                      <a 
                        href={page.slug.startsWith('/') ? page.slug : `/p/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all inline-flex items-center"
                        title="View Page"
                      >
                        <Globe size={14} />
                      </a>
                      <button
                        onClick={() => setDeleteConfirmPageId(page.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Page"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && filteredPages.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic text-sm">
                    No pages found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 text-center border-t border-slate-50 text-slate-400 text-xs italic">
          List of all created pages
        </div>
      </div>

      {/* Delete Page Confirmation Modal */}
      {deleteConfirmPageId && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmPageId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 z-[20001]"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-50 rounded-2xl">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Delete Page?</h4>
                  <p className="text-xs text-slate-400 font-medium">Permanent Action</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Are you sure you want to delete this page from your website? This will remove the page entry permanently.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmPageId(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePage(deleteConfirmPageId)}
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default AdminPages;


