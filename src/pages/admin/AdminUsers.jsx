import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Search, Mail, Loader2, X, Trash2, Edit2, Shield, FileText, Save, CheckCircle2, GraduationCap } from 'lucide-react';

const ALL_ROLES = [
  { id: 'USER', label: 'USER', description: 'Standard user portal' },
  { id: 'STUDENT', label: 'STUDENT', description: 'Student portal & course access' },
  { id: 'INSTRUCTOR', label: 'INSTRUCTOR', description: 'Instructor & course management' },
  { id: 'ADMIN', label: 'ADMIN', description: 'Full system access' }
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{"role":"ADMIN"}');
  const isAdmin = (currentUser?.role || 'ADMIN').toUpperCase() === 'ADMIN';
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "USER",
    phone: ""
  });

  // Student Profile Details Modal State
  const [profileUser, setProfileUser] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    candidate_name: '', candidate_age: '', dob: '', student_phone: '', student_email: '',
    study_budget: '', subject_interest: '', target_country: '', state_preference: '', city_preference: '', current_status: '',
    toefl_score: '', toefl_mock_score: '', toefl_test_date: '',
    ielts_score: '', ielts_mock_score: '', ielts_test_date: '',
    gre_score: '', gre_mock_score: '', gre_test_date: '',
    gmat_score: '', gmat_mock_score: '', gmat_test_date: '',
    sat_score: '', sat_mock_score: '', sat_test_date: '',
    tenth_score: '', tenth_passing_year: '', tenth_school: '',
    twelfth_score: '', twelfth_passing_year: '', twelfth_stream: '', twelfth_school: '',
    diploma_score: '', diploma_passing_year: '', diploma_name: '', diploma_awarding_body: '', diploma_duration: '',
    bachelors_score: '', bachelors_passing_year: '', bachelors_degree: '', bachelors_college: '', bachelors_university: '', bachelors_duration: '', bachelors_backlogs: '',
    pg_diploma_score: '', pg_diploma_passing_year: '', pg_diploma_name: '', pg_diploma_awarding_body: '', pg_diploma_duration: '',
    masters_score: '', masters_passing_year: '', masters_degree: '', masters_college: '', masters_university: '', masters_duration: '', masters_backlogs: ''
  });

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (typeof dateStr === 'string' && dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    return dateStr;
  };

  const handleOpenProfile = async (user) => {
    setProfileUser(user);
    setIsProfileLoading(true);
    setProfileSaveSuccess(false);

    const defaultProfile = {
      candidate_name: user.name || '',
      candidate_age: '',
      dob: formatDateForInput(user.dob) || '',
      student_phone: user.phone || user.phoneNumber || '',
      student_email: user.email || '',
      study_budget: '', subject_interest: '', target_country: '', state_preference: '', city_preference: '', current_status: '',
      toefl_score: '', toefl_mock_score: '', toefl_test_date: '',
      ielts_score: '', ielts_mock_score: '', ielts_test_date: '',
      gre_score: '', gre_mock_score: '', gre_test_date: '',
      gmat_score: '', gmat_mock_score: '', gmat_test_date: '',
      sat_score: '', sat_mock_score: '', sat_test_date: '',
      tenth_score: '', tenth_passing_year: '', tenth_school: '',
      twelfth_score: '', twelfth_passing_year: '', twelfth_stream: '', twelfth_school: '',
      diploma_score: '', diploma_passing_year: '', diploma_name: '', diploma_awarding_body: '', diploma_duration: '',
      bachelors_score: '', bachelors_passing_year: '', bachelors_degree: '', bachelors_college: '', bachelors_university: '', bachelors_duration: '', bachelors_backlogs: '',
      pg_diploma_score: '', pg_diploma_passing_year: '', pg_diploma_name: '', pg_diploma_awarding_body: '', pg_diploma_duration: '',
      masters_score: '', masters_passing_year: '', masters_degree: '', masters_college: '', masters_university: '', masters_duration: '', masters_backlogs: ''
    };

    setProfileData(defaultProfile);

    try {
      const response = await fetch((window.API_BASE || "") + `/api/admin/users/${user.id}/student-profile`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success && data.profile) {
        const p = data.profile;
        setProfileData({
          candidate_name: p.candidate_name || user.name || '',
          candidate_age: p.candidate_age || '',
          dob: formatDateForInput(p.dob) || formatDateForInput(user.dob) || '',
          student_phone: p.student_phone || user.phone || user.phoneNumber || '',
          student_email: p.student_email || user.email || '',
          study_budget: p.study_budget || '',
          subject_interest: p.subject_interest || '',
          target_country: p.target_country || '',
          state_preference: p.state_preference || '',
          city_preference: p.city_preference || '',
          current_status: p.current_status || '',
          toefl_score: p.toefl_score || '',
          toefl_mock_score: p.toefl_mock_score || '',
          toefl_test_date: formatDateForInput(p.toefl_test_date) || '',
          ielts_score: p.ielts_score || '',
          ielts_mock_score: p.ielts_mock_score || '',
          ielts_test_date: formatDateForInput(p.ielts_test_date) || '',
          gre_score: p.gre_score || '',
          gre_mock_score: p.gre_mock_score || '',
          gre_test_date: formatDateForInput(p.gre_test_date) || '',
          gmat_score: p.gmat_score || '',
          gmat_mock_score: p.gmat_mock_score || '',
          gmat_test_date: formatDateForInput(p.gmat_test_date) || '',
          sat_score: p.sat_score || '',
          sat_mock_score: p.sat_mock_score || '',
          sat_test_date: formatDateForInput(p.sat_test_date) || '',
          tenth_score: p.tenth_score || '',
          tenth_passing_year: p.tenth_passing_year || '',
          tenth_school: p.tenth_school || '',
          twelfth_score: p.twelfth_score || '',
          twelfth_passing_year: p.twelfth_passing_year || '',
          twelfth_stream: p.twelfth_stream || '',
          twelfth_school: p.twelfth_school || '',
          diploma_score: p.diploma_score || '',
          diploma_passing_year: p.diploma_passing_year || '',
          diploma_name: p.diploma_name || '',
          diploma_awarding_body: p.diploma_awarding_body || '',
          diploma_duration: p.diploma_duration || '',
          bachelors_score: p.bachelors_score || '',
          bachelors_passing_year: p.bachelors_passing_year || '',
          bachelors_degree: p.bachelors_degree || '',
          bachelors_college: p.bachelors_college || '',
          bachelors_university: p.bachelors_university || '',
          bachelors_duration: p.bachelors_duration || '',
          bachelors_backlogs: p.bachelors_backlogs || '',
          pg_diploma_score: p.pg_diploma_score || '',
          pg_diploma_passing_year: p.pg_diploma_passing_year || '',
          pg_diploma_name: p.pg_diploma_name || '',
          pg_diploma_awarding_body: p.pg_diploma_awarding_body || '',
          pg_diploma_duration: p.pg_diploma_duration || '',
          masters_score: p.masters_score || '',
          masters_passing_year: p.masters_passing_year || '',
          masters_degree: p.masters_degree || '',
          masters_college: p.masters_college || '',
          masters_university: p.masters_university || '',
          masters_duration: p.masters_duration || '',
          masters_backlogs: p.masters_backlogs || ''
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileUser) return;
    setIsProfileSaving(true);
    setProfileSaveSuccess(false);
    try {
      const response = await fetch((window.API_BASE || "") + `/api/admin/users/${profileUser.id}/student-profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      if (data.success) {
        setProfileSaveSuccess(true);
        setTimeout(() => setProfileSaveSuccess(false), 4000);
      } else {
        alert(data.message || 'Failed to save student details');
      }
    } catch (err) {
      console.error('Save profile error:', err);
      alert('Error saving student details');
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const response = await fetch((window.API_BASE || "") + `/api/admin/users/${id}`, { 
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error connecting to server');
    }
  };

  const handleSelectAllUsers = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter(i => i !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const handleBulkDeleteUsers = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedUserIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedUserIds.length} selected user(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch((window.API_BASE || "") + '/api/admin/users/bulk-delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ ids: selectedUserIds })
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(u => !selectedUserIds.includes(u.id)));
        setSelectedUserIds([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setUsers(users.filter(u => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const response = await fetch((window.API_BASE || "") + '/api/admin/users/invite', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(inviteForm)
      });
      const data = await response.json();
      if (data.success) {
        setIsInviteModalOpen(false);
        setInviteForm({ name: "", email: "", role: "USER", phone: "" });
        fetchUsers();
        alert('Invitation sent successfully!');
      } else {
        alert(data.message || 'Failed to send invitation');
      }
    } catch (err) {
      console.error('Invite error:', err);
      alert('Error connecting to server');
    } finally {
      setIsInviting(false);
    }
  };

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [roleEditingUser, setRoleEditingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateUser = async (id, payload, closeModal) => {
    setIsUpdating(true);
    try {
      const response = await fetch((window.API_BASE || "") + `/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(u => u.id === id ? data.user : u));
        closeModal();
      } else {
        alert(data.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error connecting to server');
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE || "") + '/api/admin/users', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((user.enrolled_course || user.enrolledCourse || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Oversee registrations, roles, and permissions.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-medium text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
        >
          <UserPlus size={18} /> Invite New User
        </button>
      </div>

      {/* Invite User Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[35] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transform-gpu"
              onClick={() => setIsInviteModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 overflow-hidden border border-slate-100 z-50 my-auto transform-gpu"
            >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Invite New User</h3>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Send an invitation to join FETC</p>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                <input 
                  required
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all"
                  placeholder="e.g. John Doe"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all"
                  placeholder="name@example.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">User Role</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_ROLES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setInviteForm({...inviteForm, role: r.id})}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-all border ${
                          inviteForm.role === r.id 
                            ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-200' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-brand-200 hover:text-slate-600'
                        }`}
                      >
                        {r.id}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <input 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all font-mono"
                    placeholder="+91..."
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm({...inviteForm, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={isInviting}
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium text-sm hover:bg-brand-600 transition-all shadow-xl flex items-center justify-center gap-2 group"
                >
                  {isInviting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Mail size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 w-screen h-screen z-[50] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-sm transform-gpu"
              onClick={() => setEditingUser(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 overflow-hidden border border-slate-100 z-50 my-auto transform-gpu"
            >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Edit User Info</h3>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Update personal details</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(editingUser.id, editingUser, () => setEditingUser(null)); }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                <input required className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <input required type="email" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                <input className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-300 transition-all font-mono" value={editingUser.phone || ''} onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} />
              </div>
              {/* Enrolled Courses Block */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Enrolled Courses</h4>
                <p className="text-xs text-slate-400">Courses enrolled by this student</p>
                <div className="pt-1">
                  {editingUser.enrolled_course || editingUser.enrolledCourse ? (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      <GraduationCap size={14} className="text-blue-600 shrink-0" />
                      <span>{editingUser.enrolled_course || editingUser.enrolledCourse}</span>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 pt-1">No enrolled courses</p>
                  )}
                </div>
              </div>
              <div className="pt-4">
                <button disabled={isUpdating} type="submit" className="w-full bg-brand-600 text-white py-4 rounded-2xl font-medium text-sm hover:bg-brand-700 transition-all shadow-xl flex items-center justify-center gap-2">
                  {isUpdating ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Change Role Modal */}
      <AnimatePresence>
        {roleEditingUser && (
          <div className="fixed inset-0 w-screen h-screen z-[50] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-sm transform-gpu"
              onClick={() => setRoleEditingUser(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 overflow-hidden border border-slate-100 z-50 my-auto transform-gpu"
            >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Change Role</h3>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Update access permissions</p>
              </div>
              <button onClick={() => setRoleEditingUser(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(roleEditingUser.id, { role: roleEditingUser.role }, () => setRoleEditingUser(null)); }} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pl-1">Select Access Permission</label>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {ALL_ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRoleEditingUser({...roleEditingUser, role: r.id})}
                      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all border-2 ${
                        roleEditingUser.role === r.id 
                          ? 'bg-brand-50 border-brand-600 text-brand-900 ring-4 ring-brand-600/5' 
                          : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-bold tracking-widest">{r.label}</span>
                        <span className="text-[9px] font-medium opacity-60">{r.description}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        roleEditingUser.role === r.id ? 'border-brand-600 bg-brand-600' : 'border-slate-100'
                      }`}>
                        {roleEditingUser.role === r.id && <motion.div layoutId="check" className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <button disabled={isUpdating} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium text-sm hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2">
                  {isUpdating ? <Loader2 className="animate-spin" size={18} /> : 'Confirm Role'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      <div className="glass-card rounded-2xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-visible">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isAdmin && selectedUserIds.length > 0 && (
              <button
                onClick={handleBulkDeleteUsers}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <Trash2 size={14} />
                Delete Selected ({selectedUserIds.length})
              </button>
            )}
          </div>
          {isLoading && <Loader2 className="animate-spin text-brand-600" size={18} />}
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-medium uppercase tracking-widest px-4">
                <th className="px-4 pb-4 w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                    checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                    onChange={handleSelectAllUsers}
                    title="Select All Users"
                  />
                </th>
                <th className="px-6 pb-4">User Details</th>
                <th className="px-6 pb-4">Enrolled Course</th>
                <th className="px-6 pb-4">Access Role</th>
                <th className="px-6 pb-4">Activity Status</th>
                <th className="px-6 pb-4">Contact</th>
                <th className="px-6 pb-4 text-right">Management</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="bg-slate-50/50 rounded-2xl group hover:bg-white transition-all">
                  <td className="px-4 py-4 rounded-l-2xl text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{user.name}</p>
                        <p className="text-[10px] text-slate-400 italic">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.enrolled_course || user.enrolledCourse ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        <GraduationCap size={12} className="text-blue-600" />
                        {user.enrolled_course || user.enrolledCourse}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Not Enrolled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-medium rounded-full uppercase tracking-tighter ${
                      user.status === 'ACTIVE' 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {user.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium font-mono">
                    {user.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right rounded-r-2xl">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenProfile(user)}
                        title="View Candidate Details (General, Test Scores, Academics)"
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <FileText size={16} />
                      </button>
                      <button 
                        onClick={() => setEditingUser(user)}
                        title="Edit User Info"
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      >
                         <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setRoleEditingUser(user)}
                        title="Change User Role"
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                         <Shield size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete Account"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                         <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic text-sm">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-16 text-center border-t border-slate-50">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={24} />
          </div>
          <p className="text-slate-400 text-sm italic">
            Total {users.length} user{users.length !== 1 ? 's' : ''} registered in the system.
          </p>
        </div>
      </div>

      {/* Student Profile & Academics Modal */}
      <AnimatePresence>
        {profileUser && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 pt-16 md:pt-20 pb-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[99999]"
              onClick={() => setProfileUser(null)}
            />
            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              className="relative w-full max-w-6xl bg-slate-100 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-[100000] my-auto max-h-[85vh] flex flex-col"
            >
              {/* Top Header */}
              <div className="bg-white px-8 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-brand-600" size={24} />
                    <h3 className="text-xl font-bold text-slate-800">Student Profile & Academic Details</h3>
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Managing Candidate Details for <span className="font-semibold text-slate-700">{profileUser.name}</span> ({profileUser.email})
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {profileSaveSuccess && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 size={16} /> Saved Successfully
                    </span>
                  )}
                  <button
                    onClick={handleSaveProfile}
                    disabled={isProfileSaving}
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-brand-200 transition-all disabled:opacity-50"
                  >
                    {isProfileSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Details
                  </button>
                  <button 
                    onClick={() => setProfileUser(null)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable Form Area */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
                {isProfileLoading ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-brand-600" size={32} />
                    <p className="text-sm font-medium text-slate-500">Loading student details...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-8">
                    {/* Top Row: General Details & Test Scores */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* GENERAL DETAILS (Col 7) */}
                      <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
                        <div className="border-b border-slate-100 pb-4">
                          <h4 className="text-base font-bold text-slate-800">General Details</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Candidate Info & Preferences</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Candidate Name</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="Full Name"
                              value={profileData.candidate_name}
                              onChange={(e) => setProfileData({...profileData, candidate_name: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Age of Candidate</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="e.g. 21"
                              value={profileData.candidate_age}
                              onChange={(e) => setProfileData({...profileData, candidate_age: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date of Birth</label>
                            <input 
                              type="date" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              value={profileData.dob}
                              onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Student Phone</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="Phone Number"
                              value={profileData.student_phone}
                              onChange={(e) => setProfileData({...profileData, student_phone: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Student Email</label>
                            <input 
                              type="email" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="Email Address"
                              value={profileData.student_email}
                              onChange={(e) => setProfileData({...profileData, student_email: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Any Budget for Studying Abroad</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="e.g. $25,000 / ₹20 Lakhs"
                              value={profileData.study_budget}
                              onChange={(e) => setProfileData({...profileData, study_budget: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Choose Subject and Interest</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="e.g. Computer Science, Business"
                              value={profileData.subject_interest}
                              onChange={(e) => setProfileData({...profileData, subject_interest: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Choose Country</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="e.g. USA, UK, Canada, Australia"
                              value={profileData.target_country}
                              onChange={(e) => setProfileData({...profileData, target_country: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Any State Preference</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="State Preference"
                              value={profileData.state_preference}
                              onChange={(e) => setProfileData({...profileData, state_preference: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Any City Preference</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="City Preference"
                              value={profileData.city_preference}
                              onChange={(e) => setProfileData({...profileData, city_preference: e.target.value})}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Status</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:outline-none transition-all"
                              placeholder="Enter current status..."
                              value={profileData.current_status}
                              onChange={(e) => setProfileData({...profileData, current_status: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      {/* TEST SCORES (Col 5) */}
                      <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
                        <div className="border-b border-slate-100 pb-4">
                          <h4 className="text-base font-bold text-slate-800">Test Scores</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Standardized Exam Results</p>
                        </div>

                        <div className="space-y-4">
                          {/* TOEFL */}
                          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">TOEFL</span>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.toefl_score} onChange={(e) => setProfileData({...profileData, toefl_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Mock Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.toefl_mock_score} onChange={(e) => setProfileData({...profileData, toefl_mock_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Test Date</label>
                                <input type="date" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium" value={profileData.toefl_test_date} onChange={(e) => setProfileData({...profileData, toefl_test_date: e.target.value})} />
                              </div>
                            </div>
                          </div>

                          {/* IELTS */}
                          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">IELTS</span>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.ielts_score} onChange={(e) => setProfileData({...profileData, ielts_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Mock Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.ielts_mock_score} onChange={(e) => setProfileData({...profileData, ielts_mock_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">IELTS Date</label>
                                <input type="date" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium" value={profileData.ielts_test_date} onChange={(e) => setProfileData({...profileData, ielts_test_date: e.target.value})} />
                              </div>
                            </div>
                          </div>

                          {/* GRE */}
                          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">GRE</span>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.gre_score} onChange={(e) => setProfileData({...profileData, gre_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Mock Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.gre_mock_score} onChange={(e) => setProfileData({...profileData, gre_mock_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">GRE Date</label>
                                <input type="date" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium" value={profileData.gre_test_date} onChange={(e) => setProfileData({...profileData, gre_test_date: e.target.value})} />
                              </div>
                            </div>
                          </div>

                          {/* GMAT */}
                          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">GMAT</span>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.gmat_score} onChange={(e) => setProfileData({...profileData, gmat_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Mock Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.gmat_mock_score} onChange={(e) => setProfileData({...profileData, gmat_mock_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">GMAT Date</label>
                                <input type="date" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium" value={profileData.gmat_test_date} onChange={(e) => setProfileData({...profileData, gmat_test_date: e.target.value})} />
                              </div>
                            </div>
                          </div>

                          {/* SAT */}
                          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">SAT</span>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.sat_score} onChange={(e) => setProfileData({...profileData, sat_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Mock Score</label>
                                <input type="text" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium" placeholder="-" value={profileData.sat_mock_score} onChange={(e) => setProfileData({...profileData, sat_mock_score: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">SAT Date</label>
                                <input type="date" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium" value={profileData.sat_test_date} onChange={(e) => setProfileData({...profileData, sat_test_date: e.target.value})} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section: Academics */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h4 className="text-base font-bold text-slate-800">Academics</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Educational History</p>
                      </div>

                      <div className="space-y-6">
                        {/* 10TH STANDARD */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">10th Standard</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">10th Score</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Score / %" value={profileData.tenth_score} onChange={(e) => setProfileData({...profileData, tenth_score: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Passing Year</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Passing Year" value={profileData.tenth_passing_year} onChange={(e) => setProfileData({...profileData, tenth_passing_year: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">School Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="School Name" value={profileData.tenth_school} onChange={(e) => setProfileData({...profileData, tenth_school: e.target.value})} />
                            </div>
                          </div>
                        </div>

                        {/* 12TH STANDARD */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">12th Standard</span>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">12th Score</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Score / %" value={profileData.twelfth_score} onChange={(e) => setProfileData({...profileData, twelfth_score: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Passing Year</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Passing Year" value={profileData.twelfth_passing_year} onChange={(e) => setProfileData({...profileData, twelfth_passing_year: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Stream</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Stream (Science/Comm/Arts)" value={profileData.twelfth_stream} onChange={(e) => setProfileData({...profileData, twelfth_stream: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">School Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="School Name" value={profileData.twelfth_school} onChange={(e) => setProfileData({...profileData, twelfth_school: e.target.value})} />
                            </div>
                          </div>
                        </div>

                        {/* DIPLOMA */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Diploma</span>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Diploma Score</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.diploma_score} onChange={(e) => setProfileData({...profileData, diploma_score: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Passing Year</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.diploma_passing_year} onChange={(e) => setProfileData({...profileData, diploma_passing_year: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Diploma Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.diploma_name} onChange={(e) => setProfileData({...profileData, diploma_name: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Awarding Body</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.diploma_awarding_body} onChange={(e) => setProfileData({...profileData, diploma_awarding_body: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Duration</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.diploma_duration} onChange={(e) => setProfileData({...profileData, diploma_duration: e.target.value})} />
                            </div>
                          </div>
                        </div>

                        {/* BACHELORS */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Bachelors</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Bachelors Score</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Score / CGPA" value={profileData.bachelors_score} onChange={(e) => setProfileData({...profileData, bachelors_score: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Passing Year</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Passing Year" value={profileData.bachelors_passing_year} onChange={(e) => setProfileData({...profileData, bachelors_passing_year: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Degree Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Degree Name" value={profileData.bachelors_degree} onChange={(e) => setProfileData({...profileData, bachelors_degree: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">College Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="College Name" value={profileData.bachelors_college} onChange={(e) => setProfileData({...profileData, bachelors_college: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">University Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="University Name" value={profileData.bachelors_university} onChange={(e) => setProfileData({...profileData, bachelors_university: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Duration of Course</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Duration (e.g. 3 Years)" value={profileData.bachelors_duration} onChange={(e) => setProfileData({...profileData, bachelors_duration: e.target.value})} />
                            </div>
                            <div className="md:col-span-3">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Backlogs (If Any)</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Backlogs info" value={profileData.bachelors_backlogs} onChange={(e) => setProfileData({...profileData, bachelors_backlogs: e.target.value})} />
                            </div>
                          </div>
                        </div>

                        {/* PG DIPLOMA */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">PG Diploma</span>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">PG Diploma Score</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.pg_diploma_score} onChange={(e) => setProfileData({...profileData, pg_diploma_score: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Passing Year</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.pg_diploma_passing_year} onChange={(e) => setProfileData({...profileData, pg_diploma_passing_year: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">PG Diploma Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.pg_diploma_name} onChange={(e) => setProfileData({...profileData, pg_diploma_name: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Awarding Body</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.pg_diploma_awarding_body} onChange={(e) => setProfileData({...profileData, pg_diploma_awarding_body: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Duration of Course</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="-" value={profileData.pg_diploma_duration} onChange={(e) => setProfileData({...profileData, pg_diploma_duration: e.target.value})} />
                            </div>
                          </div>
                        </div>

                        {/* MASTERS */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Masters</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Masters Score</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Score / CGPA" value={profileData.masters_score} onChange={(e) => setProfileData({...profileData, masters_score: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Passing Year</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Passing Year" value={profileData.masters_passing_year} onChange={(e) => setProfileData({...profileData, masters_passing_year: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Degree Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Degree Name" value={profileData.masters_degree} onChange={(e) => setProfileData({...profileData, masters_degree: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">College Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="College Name" value={profileData.masters_college} onChange={(e) => setProfileData({...profileData, masters_college: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">University Name</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="University Name" value={profileData.masters_university} onChange={(e) => setProfileData({...profileData, masters_university: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Duration of Course</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Duration (e.g. 2 Years)" value={profileData.masters_duration} onChange={(e) => setProfileData({...profileData, masters_duration: e.target.value})} />
                            </div>
                            <div className="md:col-span-3">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Backlogs (If Any)</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium" placeholder="Backlogs info" value={profileData.masters_backlogs} onChange={(e) => setProfileData({...profileData, masters_backlogs: e.target.value})} />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isProfileSaving}
                        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-brand-200 transition-all disabled:opacity-50"
                      >
                        {isProfileSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save All Student Details
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUsers;


