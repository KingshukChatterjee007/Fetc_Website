import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Search, Filter, Download, Edit2, Trash2, Loader2, X, Check, Upload, Image, Video, Award } from 'lucide-react';
import { getApiUrl } from '../../apiConfig';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{"role":"ADMIN"}');
  const isAdmin = (currentUser?.role || 'ADMIN').toUpperCase() === 'ADMIN';
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    learningOutcomes: '',
    instructorName: '',
    instructorBio: '',
    featuredImage: '',
    introVideo: '',
    slug: '',
    metaDescription: '',
    category: 'Language Exam',
    price: '',
    duration: '4 Weeks',
    level: 'Beginner',
    status: 'DRAFT',
    language: 'English',
    subtitles: 'English',
    certificateEnabled: false
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch(getApiUrl('/api/admin/upload-media'), {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, featuredImage: data.url }));
      } else {
        alert(data.message || 'Image upload failed.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Error uploading image file.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingVideo(true);

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch(getApiUrl('/api/admin/upload-media'), {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, introVideo: data.url }));
      } else {
        alert(data.message || 'Video upload failed.');
      }
    } catch (err) {
      console.error('Video upload error:', err);
      alert('Error uploading video file.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/v1/course/all'));
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormData({
      courseId: '',
      title: '',
      description: '',
      learningOutcomes: '',
      instructorName: '',
      instructorBio: '',
      featuredImage: '',
      introVideo: '',
      slug: '',
      metaDescription: '',
      category: 'Language Exam',
      price: '',
      duration: '4 Weeks',
      level: 'Beginner',
      status: 'DRAFT',
      language: 'English',
      subtitles: 'English',
      certificateEnabled: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      courseId: course.courseId || '',
      title: course.title || '',
      description: course.description || '',
      learningOutcomes: course.learningOutcomes || '',
      instructorName: course.instructorName || '',
      instructorBio: course.instructorBio || '',
      featuredImage: course.featuredImage || '',
      introVideo: course.introVideo || '',
      slug: course.slug || '',
      metaDescription: course.metaDescription || '',
      category: course.category || 'General',
      price: course.price || '',
      duration: course.duration || '4 Weeks',
      level: course.level || 'Beginner',
      status: course.status || 'DRAFT',
      language: course.language || 'English',
      subtitles: course.subtitles || 'English',
      certificateEnabled: course.certificateEnabled || false
    });
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/v1/course/${id}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCourses();
      } else {
        alert(data.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const handleSelectAllCourses = (e) => {
    if (e.target.checked) {
      setSelectedCourseIds(filteredCourses.map(c => c.id));
    } else {
      setSelectedCourseIds([]);
    }
  };

  const handleSelectCourse = (id) => {
    if (selectedCourseIds.includes(id)) {
      setSelectedCourseIds(selectedCourseIds.filter(i => i !== id));
    } else {
      setSelectedCourseIds([...selectedCourseIds, id]);
    }
  };

  const handleBulkDeleteCourses = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedCourseIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedCourseIds.length} selected course(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch(getApiUrl('/api/admin/courses/bulk-delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedCourseIds })
      });
      const data = await response.json();
      if (data.success) {
        setCourses(courses.filter(c => !selectedCourseIds.includes(c.id)));
        setSelectedCourseIds([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setCourses(courses.filter(c => !selectedCourseIds.includes(c.id)));
      setSelectedCourseIds([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Course title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/v1/course/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCourses();
      } else {
        alert(data.message || 'Failed to save course');
      }
    } catch (err) {
      console.error('Error saving course:', err);
      alert('Failed to connect to backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      (c.category && c.category.toLowerCase().includes(query)) ||
      (c.courseId && c.courseId.toLowerCase().includes(query))
    );
  });

  const totalActiveStudents = courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Courses Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Manage your curriculum and student enrollments.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-medium text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
        >
          <Plus size={18} /> Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-medium uppercase mb-1">Total Courses</p>
          <h3 className="text-2xl font-semibold text-slate-800">{isLoading ? '...' : courses.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-medium uppercase mb-1">Active Students</p>
          <h3 className="text-2xl font-semibold text-slate-800">{isLoading ? '...' : totalActiveStudents}</h3>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
              placeholder="Search courses..." 
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
              <Filter size={18} />
            </button>
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
              <Download size={18} />
            </button>
            {isAdmin && selectedCourseIds.length > 0 && (
              <button
                onClick={handleBulkDeleteCourses}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <Trash2 size={14} />
                Delete Selected ({selectedCourseIds.length})
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 flex justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-brand-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No courses found</h3>
            <p className="text-slate-400 text-sm italic">Start by adding your first course to the curriculum.</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                  <th className="px-4 pb-2 w-10 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                      checked={filteredCourses.length > 0 && selectedCourseIds.length === filteredCourses.length}
                      onChange={handleSelectAllCourses}
                      title="Select All Courses"
                    />
                  </th>
                  <th className="px-6 pb-2">Course Title</th>
                  <th className="px-6 pb-2">Category</th>
                  <th className="px-6 pb-2">Duration</th>
                  <th className="px-6 pb-2">Price</th>
                  <th className="px-6 pb-2">Status</th>
                  <th className="px-6 pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id || course.courseId} className="bg-slate-50/70 rounded-xl hover:bg-slate-100/80 transition-all">
                    <td className="px-4 py-4 rounded-l-xl text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                        checked={selectedCourseIds.includes(course.id)}
                        onChange={() => handleSelectCourse(course.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-xs text-slate-800">
                      <div>
                        <span className="font-bold">{course.title}</span>
                        {course.description && (
                          <p className="text-[11px] text-slate-400 font-normal line-clamp-1">{course.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      <span className="px-2.5 py-1 bg-brand-50 text-brand-700 font-bold text-[10px] rounded-lg">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      {course.duration || '4 Weeks'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-800 font-bold">
                      ₹{Number(course.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        course.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-xl">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(course)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Course"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Course Full Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 15 }}
                className="relative bg-slate-50/50 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden z-10"
              >
                {/* Modal Top Header */}
                <div className="p-6 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0 shadow-2xs">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {editingCourse ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Fill in the details below to create or update your course syllabus.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form Body - 2 Columns Scrollable */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 lg:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Left Column (2 Cols wide) */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* 1. Course Information Card */}
                      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Course Information</h3>
                          <p className="text-[11px] text-slate-500 font-medium">Core details about your course.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Course Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. IELTS Academic Masterclass"
                            value={formData.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                              setFormData(prev => ({
                                ...prev,
                                title: val,
                                slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug
                              }));
                            }}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                          <textarea
                            rows="4"
                            placeholder="Detailed description of what the course offers..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-medium text-slate-900 placeholder-slate-400 transition-all resize-none"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Learning Outcomes</label>
                          <textarea
                            rows="3"
                            placeholder="What will students learn in this course? (e.g. Band 8+ strategies, mock feedback...)"
                            value={formData.learningOutcomes}
                            onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-medium text-slate-900 placeholder-slate-400 transition-all resize-none"
                          ></textarea>
                        </div>
                      </div>

                      {/* 2. Instructor Details Card */}
                      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Instructor Details</h3>
                          <p className="text-[11px] text-slate-500 font-medium">Add details about the lead instructor.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Instructor Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Dr. Kingshuk Chatterjee"
                            value={formData.instructorName}
                            onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Instructor Bio</label>
                          <textarea
                            rows="3"
                            placeholder="Brief profile, experience, and achievements of the instructor..."
                            value={formData.instructorBio}
                            onChange={(e) => setFormData({ ...formData, instructorBio: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-medium text-slate-900 placeholder-slate-400 transition-all resize-none"
                          ></textarea>
                        </div>
                      </div>

                      {/* 3. Media Upload Card */}
                      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Image size={16} className="text-blue-600" /> Media Upload
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium">Upload course banner thumbnail and intro preview video.</p>
                        </div>

                        {/* Featured Image Picker */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700">Featured Image</label>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition-all shrink-0 active:scale-95 shadow-2xs">
                              {isUploadingImage ? (
                                <Loader2 size={16} className="animate-spin text-blue-600" />
                              ) : (
                                <Upload size={16} className="text-blue-600" />
                              )}
                              <span>{isUploadingImage ? 'Uploading...' : 'Choose Image File'}</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="hidden" 
                                disabled={isUploadingImage}
                              />
                            </label>
                            <span className="text-[10px] text-slate-400 font-semibold self-center hidden sm:inline">OR</span>
                            <input
                              type="text"
                              placeholder="Or paste image URL (e.g. https://...)"
                              value={formData.featuredImage}
                              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-xs font-medium text-slate-900 placeholder-slate-400 transition-all"
                            />
                          </div>
                          {formData.featuredImage && (
                            <div className="mt-2.5 relative w-40 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group bg-slate-100">
                              <img src={formData.featuredImage} alt="Featured Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, featuredImage: '' })}
                                className="absolute top-1.5 right-1.5 p-1 bg-slate-900/70 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Intro Video Picker */}
                        <div className="space-y-2 pt-3 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-700">Intro Video</label>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition-all shrink-0 active:scale-95 shadow-2xs">
                              {isUploadingVideo ? (
                                <Loader2 size={16} className="animate-spin text-blue-600" />
                              ) : (
                                <Video size={16} className="text-blue-600" />
                              )}
                              <span>{isUploadingVideo ? 'Uploading...' : 'Choose Video File'}</span>
                              <input 
                                type="file" 
                                accept="video/*" 
                                onChange={handleVideoUpload} 
                                className="hidden" 
                                disabled={isUploadingVideo}
                              />
                            </label>
                            <span className="text-[10px] text-slate-400 font-semibold self-center hidden sm:inline">OR</span>
                            <input
                              type="text"
                              placeholder="Or paste video URL (e.g. https://...)"
                              value={formData.introVideo}
                              onChange={(e) => setFormData({ ...formData, introVideo: e.target.value })}
                              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-xs font-medium text-slate-900 placeholder-slate-400 transition-all"
                            />
                          </div>
                          {formData.introVideo && (
                            <div className="mt-2.5 relative max-w-sm rounded-xl overflow-hidden border border-slate-200 bg-black">
                              <video src={formData.introVideo} controls className="w-full max-h-40" />
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, introVideo: '' })}
                                className="absolute top-1.5 right-1.5 p-1 bg-slate-900/80 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4. SEO & Metadata Card */}
                      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">SEO & Metadata</h3>
                          <p className="text-[11px] text-slate-500 font-medium">Customize search engine URL slug and metadata.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Slug</label>
                          <input
                            type="text"
                            placeholder="e.g. ielts-academic-masterclass"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-medium text-slate-900 placeholder-slate-400 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Meta Description</label>
                          <textarea
                            rows="2"
                            placeholder="Short search result snippet for Google..."
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-medium text-slate-900 placeholder-slate-400 transition-all resize-none"
                          ></textarea>
                        </div>
                      </div>

                    </div>

                    {/* Right Column (1 Col wide) */}
                    <div className="space-y-6">
                      
                      {/* Course Settings Card */}
                      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Course Settings</h3>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-xs font-semibold text-slate-900 transition-all"
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="ACTIVE">Published / Active</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Price (₹)</label>
                          <input
                            type="number"
                            placeholder="14999"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Level</label>
                          <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-xs font-semibold text-slate-900 transition-all"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="All Levels">All Levels</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Language</label>
                          <input
                            type="text"
                            placeholder="English"
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-xs font-medium text-slate-900 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Subtitles</label>
                          <input
                            type="text"
                            placeholder="English"
                            value={formData.subtitles}
                            onChange={(e) => setFormData({ ...formData, subtitles: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-xs font-medium text-slate-900 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 8 Weeks"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-xs font-medium text-slate-900 placeholder-slate-400 transition-all"
                          />
                        </div>

                        {/* Certificate Toggle */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                            <div>
                              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <Award size={14} className="text-amber-500" /> Certificate
                              </p>
                              <p className="text-[10px] text-slate-500 font-medium">Enable certificate for this course</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={formData.certificateEnabled}
                              onChange={(e) => setFormData({ ...formData, certificateEnabled: e.target.checked })}
                              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all active:scale-95"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          {editingCourse ? 'Save Changes' : 'Create Course'}
                        </button>
                      </div>

                    </div>

                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default AdminCourses;
