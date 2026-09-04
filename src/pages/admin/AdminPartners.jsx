import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Handshake, 
  Eye, 
  Trash2, 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  Users, 
  Clock, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { getApiUrl } from '../../apiConfig';

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{"role":"ADMIN"}');
  const isAdmin = (currentUser?.role || 'ADMIN').toUpperCase() === 'ADMIN';
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/partners'), {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setPartners(data.partners || []);
      }
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/partners/${id}`), {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
        if (selectedPartner?.id === id) {
          setSelectedPartner(null);
        }
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Failed to delete partner:', err);
    }
  };

  const handleSelectAllPartners = (e) => {
    if (e.target.checked) {
      setSelectedPartnerIds(partners.map(p => p.id));
    } else {
      setSelectedPartnerIds([]);
    }
  };

  const handleSelectPartner = (id) => {
    if (selectedPartnerIds.includes(id)) {
      setSelectedPartnerIds(selectedPartnerIds.filter(i => i !== id));
    } else {
      setSelectedPartnerIds([...selectedPartnerIds, id]);
    }
  };

  const handleBulkDeletePartners = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedPartnerIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedPartnerIds.length} selected partner application(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch(getApiUrl('/api/admin/partners/bulk-delete'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ ids: selectedPartnerIds })
      });
      const data = await response.json();
      if (data.success) {
        setPartners(partners.filter(p => !selectedPartnerIds.includes(p.id)));
        setSelectedPartnerIds([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setPartners(partners.filter(p => !selectedPartnerIds.includes(p.id)));
      setSelectedPartnerIds([]);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(getApiUrl(`/api/partners/${id}/status`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setPartners((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
        if (selectedPartner?.id === id) {
          setSelectedPartner((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Helper to parse partnership_types regardless of whether stored as array or JSON string
  const parsePartnershipTypes = (types) => {
    if (!types) return [];
    if (Array.isArray(types)) return types;
    if (typeof types === 'string') {
      try {
        return JSON.parse(types);
      } catch (e) {
        return [types];
      }
    }
    return [];
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <Handshake size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Partner Applications</h1>
            <p className="text-slate-500 font-medium text-xs">Review and manage inbound B2B partnership & collaboration requests.</p>
          </div>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 bg-brand-50 text-brand-700 rounded-xl border border-brand-100">
          Total Received: {partners.length}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isAdmin && selectedPartnerIds.length > 0 && (
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{selectedPartnerIds.length} partner application(s) selected</span>
            <button
              onClick={handleBulkDeletePartners}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all"
            >
              <Trash2 size={14} />
              Delete Selected ({selectedPartnerIds.length})
            </button>
          </div>
        )}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                <th className="px-4 pb-2 w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                    checked={partners.length > 0 && selectedPartnerIds.length === partners.length}
                    onChange={handleSelectAllPartners}
                    title="Select All Partners"
                  />
                </th>
                <th className="px-6 pb-2">Full Name</th>
                <th className="px-6 pb-2">Organization</th>
                <th className="px-6 pb-2">Contact Info</th>
                <th className="px-6 pb-2">Partnership Type</th>
                <th className="px-6 pb-2">Status</th>
                <th className="px-6 pb-2">Submitted Date</th>
                <th className="px-6 pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400 text-xs italic">
                    Loading partner applications...
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400 text-xs italic">
                    No partner applications received yet.
                  </td>
                </tr>
              ) : (
                partners.map((partner) => {
                  const pTypes = parsePartnershipTypes(partner.partnership_types || partner.partnershipTypes);
                  return (
                    <tr key={partner.id} className="bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                      <td className="px-4 py-4 rounded-l-xl text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                          checked={selectedPartnerIds.includes(partner.id)}
                          onChange={() => handleSelectPartner(partner.id)}
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-xs text-slate-900">
                        {partner.full_name || partner.fullName}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {partner.organization_name || partner.organizationName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        <div className="font-medium text-slate-800">{partner.email}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{partner.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {pTypes.length > 0 ? (
                            pTypes.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-md">
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">General</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <select
                          value={partner.status || 'pending'}
                          onChange={(e) => handleStatusChange(partner.id, e.target.value)}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border outline-none cursor-pointer transition-all ${
                            partner.status === 'approved' || partner.status === 'accepted'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : partner.status === 'reviewed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : partner.status === 'rejected'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                        {partner.created_at ? new Date(partner.created_at).toLocaleString() : partner.date || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right rounded-r-xl">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedPartner(partner)}
                            className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg transition-all font-bold text-xs flex items-center gap-1.5" 
                            title="View full application details"
                          >
                            <Eye size={14} /> View All Details
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(partner.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                            title="Delete Application"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 w-screen h-screen z-[50] flex items-center justify-center pt-24 pb-6 px-4 overflow-y-auto">
          <div onClick={() => setDeleteConfirmId(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transform-gpu" />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 z-50 my-auto transform-gpu">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle size={24} />
              <h4 className="text-lg font-bold text-slate-900">Delete Partner Request?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this partner submission? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Full Details Modal */}
      {selectedPartner && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 w-screen h-screen z-[50] flex items-center justify-center pt-24 pb-6 px-4 overflow-y-auto">
          <div onClick={() => setSelectedPartner(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transform-gpu" />
          <div className="relative bg-white rounded-3xl max-w-3xl w-full flex flex-col max-h-[calc(100vh-140px)] shadow-2xl overflow-hidden border border-slate-100 z-50 my-auto transform-gpu">
            {/* Modal Header (Fixed at Top) */}
            <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 block mb-1">
                  Partner Application #{selectedPartner.id}
                </span>
                <h3 className="text-2xl font-bold text-slate-900">{selectedPartner.full_name || selectedPartner.fullName}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedPartner.organization_name || 'Individual Applicant'}</p>
              </div>
              <button 
                onClick={() => setSelectedPartner(null)}
                className="w-10 h-10 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-full flex items-center justify-center transition-colors font-bold shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content (Scrollable Body) */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar space-y-6">
              {/* Primary Contact & Org Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">1. Full Name</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedPartner.full_name || selectedPartner.fullName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">2. Email Address</span>
                  <p className="font-bold text-brand-700 text-sm">{selectedPartner.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">3. Phone Number</span>
                  <p className="font-bold text-slate-900 font-mono text-sm">{selectedPartner.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">4. Organization Name</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedPartner.organization_name || selectedPartner.organizationName || 'N/A'}</p>
                </div>
                {selectedPartner.organization_website && (
                  <div className="col-span-1 sm:col-span-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">5. Organization Website</span>
                    <a 
                      href={selectedPartner.organization_website.startsWith('http') ? selectedPartner.organization_website : `https://${selectedPartner.organization_website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-brand-600 underline font-semibold text-sm hover:text-brand-800 transition-colors"
                    >
                      {selectedPartner.organization_website}
                    </a>
                  </div>
                )}
              </div>

              {/* Partnership Interest & Communication */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">6. Partnership Types Interested In</span>
                  <div className="flex flex-wrap gap-1.5">
                    {parsePartnershipTypes(selectedPartner.partnership_types || selectedPartner.partnershipTypes).map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-brand-50 text-brand-800 text-xs font-bold rounded-lg border border-brand-100">
                        {t}
                      </span>
                    ))}
                    {selectedPartner.other_type_detail && (
                      <div className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        <strong className="text-slate-900">Other Detail:</strong> {selectedPartner.other_type_detail}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">9. Preferred Communication</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-800 text-xs font-bold rounded-lg border border-purple-100 inline-block">
                    {selectedPartner.preferred_communication || selectedPartner.preferredCommunication || 'Email'}
                  </span>
                </div>
              </div>

              {/* Candidates Sent & Track Record */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">10. Candidates Sent Abroad (Past Year)</span>
                  <p className="font-bold text-slate-800 text-sm">{selectedPartner.candidates_sent || selectedPartner.candidatesSent || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Submission Timestamp</span>
                  <p className="font-bold text-slate-700 font-mono text-xs">
                    {selectedPartner.created_at ? new Date(selectedPartner.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Textarea Responses */}
              {selectedPartner.organization_description && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">7. Organization Description</span>
                  <p className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-xs leading-relaxed font-medium">
                    {selectedPartner.organization_description}
                  </p>
                </div>
              )}

              {selectedPartner.why_partner && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">8. Why Do You Want to Partner With Us?</span>
                  <p className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-xs leading-relaxed font-medium">
                    {selectedPartner.why_partner}
                  </p>
                </div>
              )}

              {selectedPartner.additional_comments && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">11. Additional Comments or Questions</span>
                  <p className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-xs leading-relaxed font-medium">
                    {selectedPartner.additional_comments}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls (Fixed at Bottom) */}
            <div className="p-4 sm:px-8 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
              <button
                onClick={() => setDeleteConfirmId(selectedPartner.id)}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete Application
              </button>
              <button
                onClick={() => setSelectedPartner(null)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminPartners;
