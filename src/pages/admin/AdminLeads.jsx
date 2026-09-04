import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Search, Mail, Calendar, Loader2, CheckCircle, Clock, RotateCcw, Trash2, AlertTriangle, Edit, Phone, MapPin, Upload, Download, Plus, X } from 'lucide-react';

const docFieldsByService = {
  studyAbroad: [
    { name: "passport", label: "Passport" },
    { name: "passportPhotograph", label: "Passport sized Photograph" },
    { name: "aadhaarCard", label: "Aadhaar Card" },
    { name: "birthCertificate", label: "Copy of Birth Certificate" },
    { name: "cv", label: "CV" },
    { name: "parentsPassport", label: "Parent's Passport" },
    { name: "itinerary", label: "Itinerary" },
    { name: "visaCopy", label: "Visa Copy" },
    { name: "tenthResult", label: "10th Result" },
    { name: "tenthPassingCertificate", label: "10th Passing Certificate" },
    { name: "eleventhResult", label: "11th Result (Semester wise, NIOS)" },
    { name: "predictableMarksheet", label: "Predictable Marksheet" },
    { name: "twelfthResult", label: "12th Result/Diploma" },
    { name: "twelfthPassingCertificate", label: "12th Passing Certificate/Diploma" },
    { name: "sop", label: "SOP" },
    { name: "coverLetter", label: "Cover Letter" },
    { name: "languageExamCertificate", label: "Language Exam Certificate" },
    { name: "lorPrincipal", label: "LOR - Principal/HOD" },
    { name: "lorProfessor1", label: "LOR - Professor 1" },
    { name: "lorProfessor2", label: "LOR - Professor 2" },
    { name: "bachelorsMarksheets", label: "Bachelor’s Marksheets (Min. 6)" },
    { name: "predictableTranscript", label: "Predictable Transcript" },
    { name: "transcript", label: "Transcript" },
    { name: "bachelorsProvisionalCertificate", label: "Bachelor's Provisional Degree/Certificate" },
    { name: "bachelorsDegree", label: "Bachelor's Degree" },
    { name: "wes", label: "WES (if required)" },
    { name: "internshipWorkExperience", label: "Internship/Work Experience" },
    { name: "gap", label: "Gap Declaration" },
    { name: "bankStatement", label: "Bank Statement (Min 6 Months)" },
    { name: "bankManagerCertificate", label: "Bank Manager’s Certificate" },
    { name: "itrs", label: "ITR 3 Years" },
    { name: "caNetworth", label: "CA Networth" },
    { name: "companyProof", label: "Company/Job/Farmer's Proof" },
    { name: "sponsorDocs", label: "Sponsor Documents" },
    { name: "loanSanctionLetter", label: "Loan Sanction Letter" },
    { name: "otherDocumentsStudyAbroad", label: "Other Documents" }
  ],
  workpermit: [
    { name: "passportWorkpermit", label: "Passport" },
    { name: "passportPhotographWorkpermit", label: "Passport sized Photograph" },
    { name: "aadhaarCardWorkpermit", label: "Aadhaar Card" },
    { name: "panCardWorkpermit", label: "PAN Card" },
    { name: "birthCertificateWorkpermit", label: "Copy of Birth Certificate" },
    { name: "cvWorkpermit", label: "CV" },
    { name: "travelHistoryWorkpermit", label: "Travel History" },
    { name: "itineraryWorkpermit", label: "Itinerary" },
    { name: "visaCopyWorkpermit", label: "Visa Copy" },
    { name: "pccWorkpermit", label: "PCC" },
    { name: "marriageCertificateWorkpermit", label: "Marriage Certificate" },
    { name: "academicsWorkpermit", label: "Academic Documents" },
    { name: "sopWorkpermit", label: "SOP" },
    { name: "coverLetterWorkpermit", label: "Cover Letter" },
    { name: "languageExamCertificateWorkpermit", label: "Language Exam Certificate" },
    { name: "workExperienceWorkpermit", label: "Work Experience" },
    { name: "gapWorkpermit", label: "Gap Declaration" },
    { name: "nocWorkpermit", label: "NOC" },
    { name: "bankStatementWorkpermit", label: "Bank Statement (Min 6 Months)" },
    { name: "bankManagerCertificateWorkpermit", label: "Bank Manager’s Certificate" },
    { name: "salarySlipWorkpermit", label: "Salary Slip" },
    { name: "itrsWorkpermit", label: "ITR 3 Years/Form 16" },
    { name: "caNetworthWorkpermit", label: "CA Networth" },
    { name: "companyProofWorkpermit", label: "Company/Job/Farmer's Proof" },
    { name: "otherDocumentsWorkpermit", label: "Other Documents" }
  ],
  touristVisa: [
    { name: "passportTourist", label: "Passport" },
    { name: "passportPhotographTourist", label: "Passport sized Photograph" },
    { name: "aadhaarCardTourist", label: "Aadhaar Card" },
    { name: "birthCertificateTourist", label: "Copy of Birth Certificate" },
    { name: "cvTourist", label: "CV" },
    { name: "travelHistoryTourist", label: "Travel History" },
    { name: "itineraryTourist", label: "Itinerary" },
    { name: "visaCopyTourist", label: "Visa Copy" },
    { name: "marriageCertificateTourist", label: "Marriage Certificate" },
    { name: "academicsTourist", label: "Academic Documents" },
    { name: "coverLetterTourist", label: "Cover Letter" },
    { name: "workExperienceTourist", label: "Work Experience" },
    { name: "rejectionLetterTourist", label: "Rejection Letter (If Any)" },
    { name: "nocTourist", label: "NOC" },
    { name: "bankStatementsTourist", label: "Bank Statement (Min 6 Months)" },
    { name: "bankManagerCertificateTourist", label: "Bank Manager’s Certificate" },
    { name: "salarySlipTourist", label: "Salary Slip" },
    { name: "itrsTourist", label: "ITR 3 Years/Form 16" },
    { name: "caNetworthTourist", label: "CA Networth" },
    { name: "companyProofTourist", label: "Company/Job/Farmer's Proof" },
    { name: "sponsorDocsTourist", label: "Sponsor Documents" },
    { name: "otherDocumentsTourist", label: "Other Documents" }
  ],
  examBooking: [
    { name: "Govrmentid", label: "Government ID" },
    { name: "passportExamBooking", label: "Passport" },
    { name: "otherDocumentsExamBooking", label: "Other Documents" }
  ]
};

const AdminLeads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{"role":"ADMIN"}');
  const isAdmin = (currentUser?.role || 'ADMIN').toUpperCase() === 'ADMIN';
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isNewLeadSubmitting, setIsNewLeadSubmitting] = useState(false);
  const [activeNewLeadTab, setActiveNewLeadTab] = useState(0);
  const [newLeadErrors, setNewLeadErrors] = useState({});
  const [createdLeadId, setCreatedLeadId] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [newLeadForm, setNewLeadForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    service: "",
    country: "",
    examType: "",
    anyspecificlocation: "",
    visaRejection: "",
    travelHistory: "",
    program: "",
    status: "NEW",
    payment: "",
    ebd: ""
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE||'') + '/api/admin/leads');
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch((window.API_BASE || '') + `/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const deleteLead = async (id) => {
    try {
      const response = await fetch((window.API_BASE || '') + `/api/admin/leads/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setLeads(leads.filter(l => l.id !== id));
        setDeleteConfirm({ show: false, id: null });
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSelectAllLeads = (e) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectLead = (id) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter(i => i !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const handleBulkDeleteLeads = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedLeadIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedLeadIds.length} selected lead(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch((window.API_BASE || '') + '/api/admin/leads/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedLeadIds })
      });
      const data = await response.json();
      if (data.success) {
        setLeads(leads.filter(l => !selectedLeadIds.includes(l.id)));
        setSelectedLeadIds([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setLeads(leads.filter(l => !selectedLeadIds.includes(l.id)));
      setSelectedLeadIds([]);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    // 1. Search term match
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchString) ||
      lead.email.toLowerCase().includes(searchString) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchString)) ||
      (lead.location && lead.location.toLowerCase().includes(searchString)) ||
      (lead.subject && lead.subject.toLowerCase().includes(searchString));
      
    // 2. Date filter match
    if (!matchesSearch) return false;
    if (startDate || endDate) {
      const createdDate = new Date(lead.created_at);
      createdDate.setHours(0, 0, 0, 0);
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (createdDate < start) return false;
      }
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (createdDate > end) return false;
      }
    }
    
    return true;
  });

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["First Name", "Last Name", "Gender", "Email", "Phone", "Subject", "Location", "Status", "Date"];
    const rows = leads.map(lead => {
      const nameParts = (lead.name || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      return [
        firstName,
        lastName,
        lead.gender || "",
        lead.email || "",
        lead.phone || "",
        lead.subject || lead.message || "",
        lead.location || "",
        lead.status || "",
        lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ""
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length <= 1) return;
        
        const headers = lines[0].split(",").map(h => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
        const importedLeads = [];
        
        for (let i = 1; i < lines.length; i++) {
          const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(",");
          const values = matches.map(v => v.replace(/^["']|["']$/g, "").replace(/""/g, '"').trim());
          
          const leadObj = {};
          headers.forEach((header, idx) => {
            const val = values[idx] || "";
            if (header.includes("first name") || header === "first") leadObj.firstName = val;
            else if (header.includes("last name") || header === "last") leadObj.lastName = val;
            else if (header === "name") leadObj.name = val;
            else if (header === "email") leadObj.email = val;
            else if (header === "phone") leadObj.phone = val;
            else if (header === "gender") leadObj.gender = val;
            else if (header === "location") leadObj.location = val;
            else if (header === "subject" || header === "service") leadObj.subject = val;
            else if (header === "message") leadObj.message = val;
          });
          
          if (!leadObj.name && (leadObj.firstName || leadObj.lastName)) {
            leadObj.name = `${leadObj.firstName || ""} ${leadObj.lastName || ""}`.trim();
          }
          if (!leadObj.name) leadObj.name = "Unnamed CSV Lead";
          if (!leadObj.email) leadObj.email = "no-email@csv-import.com";
          
          importedLeads.push(leadObj);
        }
        
        setIsLoading(true);
        for (const lead of importedLeads) {
          await fetch((window.API_BASE||'') + '/api/leads', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: lead.name,
              email: lead.email,
              phone: lead.phone || "",
              subject: lead.subject || "CSV Imported Lead",
              message: lead.message || "Imported from CSV file.",
              gender: lead.gender || "",
              location: lead.location || ""
            })
          });
        }
        
        await fetchLeads();
      } catch (err) {
        console.error("Failed to parse CSV:", err);
        alert("Failed to parse CSV. Please verify that the file layout is correct.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const validateNewLeadFields = (stageKey) => {
    const errors = {};
    if (stageKey === "leadGeneration") {
      if (!newLeadForm.firstName) errors.firstName = "First name is required";
      if (!newLeadForm.lastName) errors.lastName = "Last name is required";
      if (!newLeadForm.gender) errors.gender = "Gender selection is required";
      if (!newLeadForm.email || !/\S+@\S+\.\S+/.test(newLeadForm.email)) errors.email = "Valid email is required";
      if (!newLeadForm.phone) errors.phone = "Phone number is required";
      if (!newLeadForm.location) errors.location = "Office location is required";
    }

    if (stageKey === "enrollmentInfo") {
      if (!newLeadForm.service) errors.service = "Service type is required";
      if (["studyAbroad", "workpermit", "touristVisa"].includes(newLeadForm.service) && !newLeadForm.country) {
        errors.country = "Country is required";
      }
      if (!newLeadForm.status) errors.status = "Lead conversion status is required";
    }

    setNewLeadErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetNewLeadModal = () => {
    setIsNewLeadOpen(false);
    setActiveNewLeadTab(0);
    setNewLeadErrors({});
    setCreatedLeadId(null);
    setUploadedDocs([]);
    setNewLeadForm({
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      email: "",
      phone: "",
      location: "",
      address: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      service: "",
      country: "",
      examType: "",
      anyspecificlocation: "",
      visaRejection: "",
      travelHistory: "",
      program: "",
      status: "NEW",
      payment: "",
      ebd: ""
    });
  };

  const handleNewLeadFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("File exceeds 50MB size limit.");
      return;
    }

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch((window.API_BASE || '') + `/api/v1/lead/${createdLeadId}/documents/${fieldName}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setUploadedDocs(prev => [...prev.filter(d => d.documentType !== fieldName), data.document]);
        alert(`${data.document.fileName} uploaded successfully!`);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleCreateLead = async (e) => {
    if (e) e.preventDefault();
    setIsNewLeadSubmitting(true);
    try {
      const response = await fetch((window.API_BASE||'') + '/api/v1/lead/create', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLeadForm)
      });
      const data = await response.json();
      if (data.success && data.data && (data.data.id || data.data._id)) {
        setCreatedLeadId(data.data.id || data.data._id);
        setUploadedDocs([]);
        setActiveNewLeadTab(2);
        await fetchLeads();
      } else {
        alert("Failed to create lead: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to create lead:", err);
      alert("Failed to create lead.");
    } finally {
      setIsNewLeadSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Confirmation Modal via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {deleteConfirm.show && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-10 text-center">
                  <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-inner">
                    <AlertTriangle size={40} />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">Delete Lead?</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">
                    This action is permanent and cannot be undone. Are you sure you want to remove this record?
                  </p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => deleteLead(deleteConfirm.id)}
                      className="w-full px-8 py-4 bg-rose-500 text-white rounded-2xl font-medium text-sm hover:bg-rose-600 shadow-xl shadow-rose-200 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Yes, Delete Lead
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm({ show: false, id: null })}
                      className="w-full px-8 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-medium text-sm hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all active:scale-95"
                    >
                      Keep Record
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* New Lead Modal via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isNewLeadOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetNewLeadModal}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Create New Lead</h3>
                    <p className="text-xs text-slate-400 font-medium italic mt-1">Fill in the fields below to capture a new student lead.</p>
                  </div>
                  <button 
                    onClick={resetNewLeadModal}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="relative my-6 max-w-2xl mx-auto px-8">
                  <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-100 -translate-y-1/2 rounded-full z-0" />
                  <div 
                    className="absolute top-1/2 left-0 h-[3px] bg-brand-600 -translate-y-1/2 rounded-full transition-all duration-500 z-0"
                    style={{ width: `${(activeNewLeadTab / 2) * 100}%` }}
                  />
                  
                  <div className="flex justify-between relative z-10">
                    {[
                      { key: "leadGeneration", label: "Lead Generation" },
                      { key: "enrollmentInfo", label: "Enrollment Info" },
                      { key: "documentation", label: "Documentation" }
                    ].map((tab, idx) => {
                      const isCompleted = idx < activeNewLeadTab;
                      const isActive = idx === activeNewLeadTab;
                      const isDisabled = idx === 2 && !createdLeadId;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => {
                            if (idx === 0) {
                              setActiveNewLeadTab(0);
                            } else if (idx === 1) {
                              if (idx <= activeNewLeadTab || validateNewLeadFields("leadGeneration")) {
                                setActiveNewLeadTab(1);
                              }
                            } else if (idx === 2) {
                              if (createdLeadId) {
                                setActiveNewLeadTab(2);
                              }
                            }
                          }}
                          className={`flex flex-col items-center gap-2 focus:outline-none ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                              isCompleted 
                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                : isActive 
                                ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-100 scale-110" 
                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                            }`}
                          >
                            {isCompleted ? "✓" : idx + 1}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-brand-600 font-bold" : isCompleted ? "text-emerald-500" : "text-slate-400"}`}>
                            {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <form onSubmit={(e) => e.preventDefault()} className="p-8 space-y-6 max-h-[65vh] overflow-y-auto">
                  {/* TAB 1: LEAD GENERATION */}
                  {activeNewLeadTab === 0 && (
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">👤 Lead Generation Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. John"
                            value={newLeadForm.firstName}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, firstName: e.target.value })}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${newLeadErrors.firstName ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          />
                          {newLeadErrors.firstName && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.firstName}</span>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Middle Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Kumar"
                            value={newLeadForm.middleName}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, middleName: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Doe"
                            value={newLeadForm.lastName}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, lastName: e.target.value })}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${newLeadErrors.lastName ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          />
                          {newLeadErrors.lastName && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.lastName}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                          <input
                            type="date"
                            value={newLeadForm.dob}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, dob: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender *</label>
                          <select
                            value={newLeadForm.gender}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, gender: e.target.value })}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white ${newLeadErrors.gender ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          {newLeadErrors.gender && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.gender}</span>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email *</label>
                          <input
                            type="email"
                            placeholder="john@example.com"
                            value={newLeadForm.email}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${newLeadErrors.email ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          />
                          {newLeadErrors.email && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.email}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number *</label>
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={newLeadForm.phone}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${newLeadErrors.phone ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          />
                          {newLeadErrors.phone && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.phone}</span>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Office Location *</label>
                          <select
                            value={newLeadForm.location}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, location: e.target.value })}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white ${newLeadErrors.location ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          >
                            <option value="">Select Location</option>
                            <option value="Vesu">Vesu</option>
                            <option value="Varachha">Varachha</option>
                            <option value="Other">Other</option>
                          </select>
                          {newLeadErrors.location && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.location}</span>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Permanent Address</label>
                        <textarea
                          rows="2"
                          placeholder="e.g. 123, Main Street, City, State"
                          value={newLeadForm.address}
                          onChange={(e) => setNewLeadForm({ ...newLeadForm, address: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white resize-none"
                        />
                      </div>

                      <div className="border-t border-slate-100 pt-6">
                        <h4 className="font-semibold text-slate-800 text-sm mb-4">Emergency Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Person Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Contact Person Name"
                              value={newLeadForm.emergencyContactName}
                              onChange={(e) => setNewLeadForm({ ...newLeadForm, emergencyContactName: e.target.value })}
                              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Relationship</label>
                            <input
                              type="text"
                              placeholder="e.g. Parent, Sibling, Guardian"
                              value={newLeadForm.emergencyContactRelation}
                              onChange={(e) => setNewLeadForm({ ...newLeadForm, emergencyContactRelation: e.target.value })}
                              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Emergency Phone</label>
                            <input
                              type="text"
                              placeholder="e.g. 9876543210"
                              value={newLeadForm.emergencyContactPhone}
                              onChange={(e) => setNewLeadForm({ ...newLeadForm, emergencyContactPhone: e.target.value })}
                              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ENROLLMENT INFO */}
                  {activeNewLeadTab === 1 && (
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">🎓 Course & Enrollment Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Selection *</label>
                          <select
                            value={newLeadForm.service}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, service: e.target.value, country: "", examType: "" })}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white ${newLeadErrors.service ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          >
                            <option value="">Select Service</option>
                            <option value="studyAbroad">Study Abroad</option>
                            <option value="workpermit">Work Permit</option>
                            <option value="touristVisa">Tourist Visa</option>
                            <option value="examBooking">Exam Booking</option>
                            <option value="training">Training Courses</option>
                          </select>
                          {newLeadErrors.service && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.service}</span>}
                        </div>

                        {["studyAbroad", "workpermit", "touristVisa"].includes(newLeadForm.service) && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Country *</label>
                            <select
                              value={newLeadForm.country}
                              onChange={(e) => setNewLeadForm({ ...newLeadForm, country: e.target.value })}
                              className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white ${newLeadErrors.country ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                            >
                              <option value="">Select Country</option>
                              <option value="Canada">Canada</option>
                              <option value="Germany">Germany</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="United States">United States</option>
                              <option value="Australia">Australia</option>
                              <option value="Europe">Europe</option>
                              <option value="Other">Other</option>
                            </select>
                            {newLeadErrors.country && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.country}</span>}
                          </div>
                        )}

                        {["examBooking", "training"].includes(newLeadForm.service) && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Exam / Training Course *</label>
                            <input
                              type="text"
                              placeholder="IELTS, PTE, GRE, etc."
                              value={newLeadForm.examType}
                              onChange={(e) => setNewLeadForm({ ...newLeadForm, examType: e.target.value })}
                              className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${newLeadErrors.examType ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                            />
                            {newLeadErrors.examType && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.examType}</span>}
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Specific Target Location</label>
                          <input
                            type="text"
                            placeholder="e.g. Munich, Toronto, London"
                            value={newLeadForm.anyspecificlocation}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, anyspecificlocation: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visa Rejections?</label>
                          <select
                            value={newLeadForm.visaRejection}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, visaRejection: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                          >
                            <option value="">Select Option</option>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Travel History?</label>
                          <select
                            value={newLeadForm.travelHistory}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, travelHistory: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                          >
                            <option value="">Select Option</option>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Program / Course</label>
                          <input
                            type="text"
                            placeholder="e.g. Science, Commerce, IT"
                            value={newLeadForm.program}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, program: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Funnel Lead Status *</label>
                          <select
                            value={newLeadForm.status}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value })}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white ${newLeadErrors.status ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          >
                            <option value="NEW">Cold (NEW)</option>
                            <option value="CONTACTED">Warm (CONTACTED)</option>
                            <option value="CLOSED">Hot / Won (CLOSED)</option>
                          </select>
                          {newLeadErrors.status && <span className="text-xs text-rose-500 font-semibold block">{newLeadErrors.status}</span>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Method</label>
                          <select
                            value={newLeadForm.payment}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, payment: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                          >
                            <option value="">Select Method</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Card">Credit/Debit Card</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expected Booking Date (EBD)</label>
                          <input
                            type="date"
                            value={newLeadForm.ebd}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, ebd: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: DOCUMENTATION */}
                  {activeNewLeadTab === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-sm font-bold text-slate-800">📂 Upload Required Documents</h4>
                        <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-brand-100">
                          Lead ID: #{createdLeadId}
                        </span>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs font-bold text-amber-800">Files uploaded here are saved directly to this lead's profile.</p>
                          <p className="text-[11px] text-amber-600/90 font-medium mt-0.5">Maximum file size allowed is 50MB. Supported formats: PDF, JPEG, PNG, DOCX.</p>
                        </div>
                      </div>

                      {(!newLeadForm.service || !(docFieldsByService[newLeadForm.service]?.length > 0)) ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                            <CheckCircle className="text-emerald-500" size={32} />
                          </div>
                          <h5 className="font-bold text-slate-800 text-sm">No Required Documents</h5>
                          <p className="text-xs text-slate-400 max-w-sm mt-1">This lead has been successfully created. Click "Finish & Close" below to complete this wizard.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
                          {docFieldsByService[newLeadForm.service].map((field) => {
                            const isUploading = uploadingField === field.name;
                            const uploadedFile = uploadedDocs.find(d => d.documentType === field.name);
                            
                            return (
                              <div 
                                key={field.name}
                                className={`p-4 rounded-2xl border transition-all ${
                                  uploadedFile 
                                    ? "bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50/50" 
                                    : isUploading 
                                    ? "bg-slate-50/50 border-slate-200 animate-pulse" 
                                    : "bg-slate-50/30 border-slate-100 hover:border-slate-200 hover:bg-white"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-700">{field.label}</p>
                                    {uploadedFile ? (
                                      <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                        <CheckCircle size={10} /> {uploadedFile.fileName || "Uploaded"}
                                      </p>
                                    ) : isUploading ? (
                                      <p className="text-[10px] text-brand-600 font-medium flex items-center gap-1">
                                        <Loader2 size={10} className="animate-spin" /> Uploading...
                                      </p>
                                    ) : (
                                      <p className="text-[10px] text-slate-400 font-medium italic">Not uploaded yet</p>
                                    )}
                                  </div>

                                  {!uploadedFile && !isUploading && (
                                    <label className="p-2 hover:bg-white border border-slate-200 hover:border-brand-300 rounded-xl cursor-pointer text-slate-400 hover:text-brand-600 transition-all flex items-center justify-center shrink-0">
                                      <Upload size={14} />
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => handleNewLeadFileUpload(e, field.name)} 
                                      />
                                    </label>
                                  )}

                                  {uploadedFile && (
                                    <div className="flex gap-2">
                                      <a 
                                        href={uploadedFile.filePath} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center transition-all"
                                        title="View Document"
                                      >
                                        <Download size={14} />
                                      </a>
                                      <label className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-brand-600 rounded-xl cursor-pointer transition-all flex items-center justify-center">
                                        <Upload size={14} />
                                        <input 
                                          type="file" 
                                          className="hidden" 
                                          onChange={(e) => handleNewLeadFileUpload(e, field.name)} 
                                        />
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    {activeNewLeadTab === 0 && (
                      <>
                        <button 
                          type="button"
                          onClick={resetNewLeadModal}
                          className="px-6 py-3 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (validateNewLeadFields("leadGeneration")) {
                              setActiveNewLeadTab(1);
                            }
                          }}
                          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-brand-100"
                        >
                          Next: Enrollment Info
                        </button>
                      </>
                    )}

                    {activeNewLeadTab === 1 && (
                      <>
                        <button 
                          type="button"
                          onClick={() => setActiveNewLeadTab(0)}
                          className="px-6 py-3 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors"
                        >
                          Back
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (validateNewLeadFields("enrollmentInfo")) {
                              handleCreateLead();
                            }
                          }}
                          disabled={isNewLeadSubmitting}
                          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-md shadow-brand-100"
                        >
                          {isNewLeadSubmitting ? (
                            <>
                              <Loader2 className="animate-spin" size={16} /> Creating...
                            </>
                          ) : (
                            'Create Lead'
                          )}
                        </button>
                      </>
                    )}

                    {activeNewLeadTab === 2 && (
                      <button 
                        type="button"
                        onClick={resetNewLeadModal}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-emerald-100 flex items-center gap-2"
                      >
                        <CheckCircle size={16} /> Finish & Close
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto">

      {/* Hidden File Input for CSV Upload */}
      <input 
        type="file" 
        id="csv-file-input" 
        accept=".csv" 
        onChange={handleCSVUpload} 
        className="hidden" 
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">All Leads</h1>
          <p className="text-slate-500 font-medium text-sm italic">Manage your leads with upload, search, and export.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Download size={14} /> Export Excel
          </button>
          <button
            onClick={() => document.getElementById('csv-file-input').click()}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Upload size={14} /> Upload
          </button>
          <button
            onClick={() => setIsNewLeadOpen(true)}
            className="px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus size={14} /> New Lead
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700" 
              placeholder="Search by First Name, Last Name, Email, Location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="date"
              className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700 cursor-pointer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">to</span>
            <input 
              type="date"
              className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-700 cursor-pointer"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>

          {(searchTerm || startDate || endDate) && (
            <button 
              onClick={() => {
                setSearchTerm("");
                setStartDate("");
                setEndDate("");
              }}
              className="px-4 py-3 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl flex items-center gap-1 transition-all"
            >
              <X size={14} /> Reset
            </button>
          )}

          {isAdmin && selectedLeadIds.length > 0 && (
            <button
              onClick={handleBulkDeleteLeads}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Trash2 size={14} />
              Delete Selected ({selectedLeadIds.length})
            </button>
          )}

          {isLoading && <Loader2 className="animate-spin text-brand-600 ml-auto" size={18} />}
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-medium uppercase tracking-widest px-4">
                <th className="px-4 pb-4 w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                    checked={filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length}
                    onChange={handleSelectAllLeads}
                    title="Select All Leads"
                  />
                </th>
                <th className="px-6 pb-4">Lead Information</th>
                <th className="px-6 pb-4">Area of Interest</th>
                <th className="px-6 pb-4">Lead Status</th>
                <th className="px-6 pb-4 text-right">Lead Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="bg-slate-50/50 rounded-2xl group hover:bg-white transition-all">
                  <td className="px-4 py-4 rounded-l-2xl text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-slate-800">{lead.name}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Mail size={10} /> {lead.email}</span>
                        {lead.phone && <span className="flex items-center gap-1"><Phone size={10} /> {lead.phone}</span>}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                        {lead.gender && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">
                            {lead.gender}
                          </span>
                        )}
                        {lead.location && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                            <MapPin size={10} className="text-slate-400" /> {lead.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(lead.created_at)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600">{formatAreaOfInterest(lead)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[9px] font-medium rounded-full uppercase tracking-tighter ${
                      lead.status === 'NEW' 
                        ? "bg-brand-50 text-brand-600" 
                        : lead.status === 'CONTACTED' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right rounded-r-2xl">
                    <div className="flex items-center justify-end gap-2">
                       {lead.status === 'NEW' && (
                         <button 
                           onClick={() => updateStatus(lead.id, 'CONTACTED')}
                           className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors"
                           title="Mark as Contacted"
                         >
                           <Clock size={16} />
                         </button>
                       )}
                       {lead.status !== 'CLOSED' ? (
                         <button 
                           onClick={() => updateStatus(lead.id, 'CLOSED')}
                           className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
                           title="Mark as Closed / Won"
                         >
                           <CheckCircle size={16} />
                         </button>
                       ) : (
                         <button 
                           onClick={() => updateStatus(lead.id, 'NEW')}
                           className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                           title="Re-open Lead"
                         >
                           <RotateCcw size={16} />
                         </button>
                       )}
                       <button 
                         onClick={() => navigate(`/admin/leads/edit/${lead.id}`)}
                         className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                         title="Edit Lead"
                       >
                         <Edit size={16} />
                       </button>
                       <button 
                         onClick={() => setDeleteConfirm({ show: true, id: lead.id })}
                         className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                         title="Delete Lead"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <UserCheck size={32} className="text-slate-300 mb-3" />
                      <p className="text-sm font-bold italic text-slate-400">No leads found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </motion.div>
    </>
  );
};

const serviceMap = {
  studyAbroad: "Study Abroad",
  workpermit: "Work Permit",
  touristVisa: "Tourist Visa",
  examBooking: "Exam Booking",
  training: "Training Courses"
};

const formatAreaOfInterest = (lead) => {
  if (!lead) return "General Inquiry";
  if (lead.service && serviceMap[lead.service]) return serviceMap[lead.service];
  if (lead.service) return lead.service;
  if (lead.program) return lead.program;
  return lead.subject || "General Inquiry";
};

export default AdminLeads;


