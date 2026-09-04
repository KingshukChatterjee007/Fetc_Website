import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Eye, Edit2, Trash2, Loader2, X, Check, Image as ImageIcon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../../apiConfig';
import SafeImage from '../../components/SafeImage';

const DEFAULT_MOCKS = [
  { id: 'm1', title: "SELT (Secure English Language Test)", price: "₹49", status: "Published", content: "Official SELT practice exam with simulated reading, writing, and listening modules.", image_url: "" },
  { id: 'm2', title: "IELTS Academic & General Training", price: "₹49", status: "Published", content: "Full length IELTS mock test covering Academic & GT modules with instant band score feedback.", image_url: "" },
  { id: 'm3', title: "TOEFL iBT Practice", price: "₹49", status: "Published", content: "Complete TOEFL iBT simulator with timed sections and speech recognition checks.", image_url: "" },
  { id: 'm4', title: "PTE Academic Exam Prep", price: "₹49", status: "Published", content: "AI-scored PTE mock exam replicating the Pearson test center interface.", image_url: "" },
  { id: 'm5', title: "SAT Prep Simulators", price: "₹49", status: "Published", content: "Digital SAT practice tests with adaptive Math and Reading/Writing sections.", image_url: "" },
  { id: 'm6', title: "GMAT Focus Edition Mock", price: "₹49", status: "Published", content: "GMAT Focus edition exam prep with Quant, Data Insights, and Verbal evaluation.", image_url: "" },
  { id: 'm7', title: "GRE General Test Simulator", price: "₹49", status: "Published", content: "Full-length GRE simulator with analytical writing and section-level adaptivity.", image_url: "" },
  { id: 'm8', title: "Pearson Versant Test Simulator", price: "₹499", status: "Published", content: "Pearson Versant automated voice & fluency assessment simulator.", image_url: "" }
];

const AdminMockTest = () => {
  const [mockTests, setMockTests] = useState([]);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [selectedRegIds, setSelectedRegIds] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{"role":"ADMIN"}');
  const isAdmin = (currentUser?.role || 'ADMIN').toUpperCase() === 'ADMIN';
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  // Tab & Registration state
  const [activeTab, setActiveTab] = useState('tests'); // 'tests' | 'registrations'
  const [registrations, setRegistrations] = useState([]);
  const [isRegLoading, setIsRegLoading] = useState(false);
  const [regSearch, setRegSearch] = useState('');

  // Form states for Add / Edit
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('₹49');
  const [status, setStatus] = useState('Published');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchMockTests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch((window.API_BASE || '') + '/api/admin/mock-tests', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      if (data.success && data.mockTests && data.mockTests.length > 0) {
        setMockTests(data.mockTests);
      } else {
        setMockTests(DEFAULT_MOCKS);
      }
    } catch (err) {
      console.error('Failed to fetch mock tests:', err);
      setMockTests(DEFAULT_MOCKS);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setIsRegLoading(true);
      const res = await fetch(getAssetUrl ? (window.API_BASE || '') + '/api/v1/mock-test/admin/registrations' : '/api/v1/mock-test/admin/registrations', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Failed to fetch mock test registrations:', err);
    } finally {
      setIsRegLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
    fetchRegistrations();
  }, []);

  const handleUpdateRegStatus = async (id, newStatus) => {
    try {
      const res = await fetch((window.API_BASE || '') + `/api/v1/mock-test/admin/registrations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleUpdateRegDate = async (id, newDate, currentStatus) => {
    try {
      const targetStatus = currentStatus === 'Form Submitted' ? 'Scheduled' : currentStatus;
      const res = await fetch((window.API_BASE || '') + `/api/v1/mock-test/admin/registrations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedDate: newDate, status: targetStatus })
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, requested_date: newDate, status: data.registration.status } : r));
      }
    } catch (err) {
      console.error('Error updating registration date:', err);
    }
  };

  const handleDeleteReg = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    try {
      const res = await fetch((window.API_BASE || '') + `/api/v1/mock-test/admin/registrations/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Error deleting registration:', err);
    }
  };

  const handleOpenAdd = () => {
    setTitle('');
    setPrice('₹49');
    setStatus('Published');
    setContent('');
    setImageUrl('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (test) => {
    setEditingTest(test);
    setTitle(test.title || '');
    setPrice(test.price || '₹49');
    setStatus(test.status || 'Published');
    setContent(test.content || '');
    setImageUrl(test.image_url || test.imageUrl || '');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch((window.API_BASE || '') + '/api/admin/upload', {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.message || 'Failed to upload image. Please try again.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Failed to upload image. Please check your network or try a smaller image file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const payload = { title, price, status, content, image_url: imageUrl };
      const res = await fetch((window.API_BASE || '') + '/api/admin/mock-tests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMockTests([data.mockTest, ...mockTests]);
      } else {
        const newMock = { id: 'm-' + Date.now(), ...payload };
        setMockTests([newMock, ...mockTests]);
      }
    } catch (err) {
      console.error('Failed to create mock test:', err);
      const newMock = { id: 'm-' + Date.now(), title, price, status, content, image_url: imageUrl };
      setMockTests([newMock, ...mockTests]);
    } finally {
      setShowAddModal(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingTest || !title) return;

    try {
      const payload = { title, price, status, content, image_url: imageUrl };
      const res = await fetch((window.API_BASE || '') + `/api/admin/mock-tests/${editingTest.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMockTests(mockTests.map((t) => (t.id === editingTest.id ? data.mockTest : t)));
      } else {
        setMockTests(mockTests.map((t) => (t.id === editingTest.id ? { ...t, ...payload } : t)));
      }
    } catch (err) {
      console.error('Failed to update mock test:', err);
      setMockTests(mockTests.map((t) => (t.id === editingTest.id ? { ...t, title, price, status, content, image_url: imageUrl } : t)));
    } finally {
      setEditingTest(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mock test?')) return;
    try {
      await fetch((window.API_BASE || '') + `/api/admin/mock-tests/${id}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      setMockTests(mockTests.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete mock test:', err);
      setMockTests(mockTests.filter((t) => t.id !== id));
    }
  };

  // Tests Selection & Bulk Delete
  const handleSelectAllTests = (e) => {
    if (e.target.checked) {
      setSelectedTestIds(mockTests.map(t => t.id));
    } else {
      setSelectedTestIds([]);
    }
  };

  const handleSelectTest = (id) => {
    if (selectedTestIds.includes(id)) {
      setSelectedTestIds(selectedTestIds.filter(i => i !== id));
    } else {
      setSelectedTestIds([...selectedTestIds, id]);
    }
  };

  const handleBulkDeleteTests = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedTestIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedTestIds.length} selected mock test(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch((window.API_BASE || '') + '/api/admin/mock-tests/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ ids: selectedTestIds })
      });
      const data = await response.json();
      if (data.success) {
        setMockTests(mockTests.filter(t => !selectedTestIds.includes(t.id)));
        setSelectedTestIds([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setMockTests(mockTests.filter(t => !selectedTestIds.includes(t.id)));
      setSelectedTestIds([]);
    }
  };

  // Registrations Selection & Bulk Delete
  const handleSelectAllRegs = (e) => {
    if (e.target.checked) {
      setSelectedRegIds(filteredRegistrations.map(r => r.id));
    } else {
      setSelectedRegIds([]);
    }
  };

  const handleSelectReg = (id) => {
    if (selectedRegIds.includes(id)) {
      setSelectedRegIds(selectedRegIds.filter(i => i !== id));
    } else {
      setSelectedRegIds([...selectedRegIds, id]);
    }
  };

  const handleBulkDeleteRegs = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedRegIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedRegIds.length} selected registration(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch((window.API_BASE || '') + '/api/admin/mock-registrations/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ ids: selectedRegIds })
      });
      const data = await response.json();
      if (data.success) {
        setRegistrations(registrations.filter(r => !selectedRegIds.includes(r.id)));
        setSelectedRegIds([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setRegistrations(registrations.filter(r => !selectedRegIds.includes(r.id)));
      setSelectedRegIds([]);
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const q = regSearch.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      (r.test_title && r.test_title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <CheckSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mock Tests Portal</h1>
            <p className="text-xs text-slate-500 font-medium">Manage available mock tests & student registrations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/mock"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-xs hover:bg-slate-50 transition-all shadow-sm"
          >
            <Eye size={14} /> View Page
          </Link>
          {activeTab === 'tests' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-xs hover:bg-slate-800 transition-all shadow-sm"
            >
              <Plus size={14} /> Create Mock Test
            </button>
          )}
        </div>
      </div>

      {/* Category Tab Bar */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/70">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'tests'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Mock Tests ({mockTests.length})
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'registrations'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Mock Test Registrations
          {registrations.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-black">
              {registrations.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'registrations' ? (
        /* Category Tab 2: Registrations / Filled Forms Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Exam Registrations</h3>
              <p className="text-xs text-slate-500 font-medium">Filled form data submitted by students for mock tests.</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search student, email, exam..."
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 w-full sm:w-64"
              />
              {isAdmin && selectedRegIds.length > 0 && (
                <button
                  onClick={handleBulkDeleteRegs}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0"
                >
                  <Trash2 size={14} />
                  Delete Selected ({selectedRegIds.length})
                </button>
              )}
            </div>
          </div>

          {isRegLoading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Loading registrations...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm font-medium">
              No mock test registrations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-4">
                    <th className="px-4 pb-2 w-10 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                        checked={filteredRegistrations.length > 0 && selectedRegIds.length === filteredRegistrations.length}
                        onChange={handleSelectAllRegs}
                        title="Select All Registrations"
                      />
                    </th>
                    <th className="px-6 pb-2">Student Info</th>
                    <th className="px-6 pb-2">Exam Title</th>
                    <th className="px-6 pb-2">Requested Date</th>
                    <th className="px-6 pb-2">Submitted On</th>
                    <th className="px-6 pb-2">Status</th>
                    <th className="px-6 pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => {
                    const formattedReqDate = reg.requested_date
                      ? new Date(reg.requested_date).toLocaleDateString('en-GB')
                      : 'Not specified';
                    const formattedCreated = reg.created_at
                      ? new Date(reg.created_at).toLocaleDateString('en-GB')
                      : 'N/A';

                    return (
                      <tr key={reg.id} className="bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                        <td className="px-4 py-4 rounded-l-xl text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                            checked={selectedRegIds.includes(reg.id)}
                            onChange={() => handleSelectReg(reg.id)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-xs text-slate-900">{reg.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{reg.email} • {reg.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-blue-700">
                          {reg.test_title}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">
                          <input
                            type="date"
                            value={reg.requested_date ? reg.requested_date.split('T')[0] : ''}
                            onChange={(e) => handleUpdateRegDate(reg.id, e.target.value, reg.status)}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-700 focus:outline-none focus:border-blue-500 shadow-sm"
                          />
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {formattedCreated}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <select
                            value={reg.status || 'Form Submitted'}
                            onChange={(e) => handleUpdateRegStatus(reg.id, e.target.value)}
                            className="text-xs font-bold py-1.5 px-3 rounded-lg bg-white border border-slate-200 focus:outline-none text-slate-800 shadow-sm"
                          >
                            <option value="Form Submitted">Form Submitted</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right rounded-r-xl">
                          <button
                            onClick={() => handleDeleteReg(reg.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Registration"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Category Tab 1: All Mock Tests Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isAdmin && selectedTestIds.length > 0 && (
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{selectedTestIds.length} mock test(s) selected</span>
            <button
              onClick={handleBulkDeleteTests}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all"
            >
              <Trash2 size={14} />
              Delete Selected ({selectedTestIds.length})
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} /> Loading mock tests...
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
                      checked={mockTests.length > 0 && selectedTestIds.length === mockTests.length}
                      onChange={handleSelectAllTests}
                      title="Select All Mock Tests"
                    />
                  </th>
                  <th className="px-6 pb-2">Test Info</th>
                  <th className="px-6 pb-2">Description / Content</th>
                  <th className="px-6 pb-2">Price</th>
                  <th className="px-6 pb-2">Status</th>
                  <th className="px-6 pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTests.map((test) => {
                  const testImg = test.image_url || test.imageUrl;
                  return (
                    <tr key={test.id} className="bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                      <td className="px-4 py-4 rounded-l-xl text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                          checked={selectedTestIds.includes(test.id)}
                          onChange={() => handleSelectTest(test.id)}
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-xs text-slate-700">
                        <div className="flex items-center gap-3">
                          {testImg ? (
                            <SafeImage
                              src={getAssetUrl(testImg)}
                              alt={test.title}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                              <ImageIcon size={18} />
                            </div>
                          )}
                          <span className="font-bold text-slate-900">{test.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium max-w-xs truncate">
                        {test.content || test.description || <span className="text-slate-400 italic">No content added</span>}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium font-mono">
                        {test.price}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border ${
                          test.status === 'Draft' 
                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {test.status || 'Published'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right rounded-r-xl">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(test)}
                            title="Edit Mock Test"
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(test.id)}
                            title="Delete Mock Test"
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-6 text-center border-t border-slate-50 text-slate-400 text-xs italic">
          List of all mock tests ({mockTests.length} items)
        </div>
      </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-35 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transform-gpu"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 my-auto z-50 transform-gpu"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Create New Mock Test</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                  <X size={20} />
                </button>
              </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                <input
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Duolingo English Test Practice"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price</label>
                  <input
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. ₹49"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload & URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <SafeImage src={getAssetUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : null}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste Image URL or upload below..."
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Content / Description Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Content / Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter detailed content, test format, syllabus, or instructions..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} /> Save Mock Test
              </button>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingTest && (
          <div className="fixed inset-0 z-35 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setEditingTest(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transform-gpu"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 my-auto z-50 transform-gpu"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Edit Mock Test</h3>
                <button onClick={() => setEditingTest(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                  <X size={20} />
                </button>
              </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                <input
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price</label>
                  <input
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload & URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <SafeImage src={getAssetUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : null}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste Image URL or upload below..."
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Content / Description Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Content / Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter detailed content, test format, syllabus, or instructions..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} /> Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMockTest;
