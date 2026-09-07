import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Loader2, FileText, Download, CheckCircle, 
  Clock, RefreshCw, User, BookOpen, FileCheck, ArrowLeft, ArrowRight,
  ShieldAlert, X, Save
} from 'lucide-react';

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
  ],
  training: [
    { name: "passportTraining", label: "Passport" },
    { name: "otherDocumentsTraining", label: "Other Documents" }
  ]
};

const studyAbroadSections = [
  {
    title: "General Verification",
    fields: [
      "passport", "passportPhotograph", "aadhaarCard", "birthCertificate", 
      "cv", "parentsPassport", "itinerary", "visaCopy", "sop", "coverLetter", 
      "otherDocumentsStudyAbroad"
    ]
  },
  {
    title: "Education Documents",
    fields: [
      "tenthResult", "tenthPassingCertificate", "eleventhResult", "predictableMarksheet", 
      "twelfthResult", "twelfthPassingCertificate", "languageExamCertificate", 
      "lorPrincipal", "lorProfessor1", "lorProfessor2", "bachelorsMarksheets", 
      "predictableTranscript", "transcript", "bachelorsProvisionalCertificate", 
      "bachelorsDegree", "wes", "internshipWorkExperience", "gap"
    ]
  },
  {
    title: "Financial Documents",
    fields: [
      "bankStatement", "bankManagerCertificate", "itrs", "caNetworth", 
      "companyProof", "sponsorDocs", "loanSanctionLetter"
    ]
  }
];

function UserVerification() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  // Documentation Wizard states
  const [wizardTab, setWizardTab] = useState(0); // 0: LeadGen, 1: Enrollment, 2: Docs
  const [lead, setLead] = useState(null);
  const [isFetchingLead, setIsFetchingLead] = useState(true);
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const initialLeadForm = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: user?.email || "",
    phone: "",
    location: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    service: "",
    country: "",
    program: "",
    visaRejection: "",
    travelHistory: "",
    examType: "",
    ebd: "",
    anyspecificlocation: "",
    status: "NEW",
    payment: "",
    documents: []
  };

  const [leadForm, setLeadForm] = useState(initialLeadForm);

  useEffect(() => {
    if (user?.email) fetchLeadByEmail(user.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch lead by student email
  const fetchLeadByEmail = async (email) => {
    setIsFetchingLead(true);
    try {
      const response = await fetch((window.API_BASE || "") + `/api/v1/lead/email/${encodeURIComponent(email)}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) {
        const data = await response.json();
        const formattedDob = data.dob ? new Date(data.dob).toISOString().split('T')[0] : "";
        const formattedEbd = data.ebd ? new Date(data.ebd).toISOString().split('T')[0] : "";
        setLead(data);
        setLeadForm({
          ...initialLeadForm,
          ...data,
          dob: formattedDob,
          ebd: formattedEbd,
          email: email
        });
      } else {
        // No lead exists yet
        setLead(null);
        setLeadForm(prev => ({
          ...prev,
          email: email,
          firstName: user?.name?.split(" ")[0] || "",
          lastName: user?.name?.split(" ").slice(1).join(" ") || ""
        }));
      }
    } catch (err) {
      console.error('Error fetching lead:', err);
    } finally {
      setIsFetchingLead(false);
    }
  };

  // Change lead form text/select inputs
  const handleLeadFormChange = (e) => {
    const { name, value } = e.target;
    setLeadForm(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  // Validate wizard fields based on stage
  const validateWizardFields = (stage) => {
    const errors = {};
    if (stage === 0) {
      if (!leadForm.firstName) errors.firstName = "First name is required";
      if (!leadForm.lastName) errors.lastName = "Last name is required";
      if (!leadForm.gender) errors.gender = "Gender selection is required";
      if (!leadForm.phone) errors.phone = "Phone number is required";
      if (!leadForm.location) errors.location = "Office location is required";
    }
    if (stage === 1) {
      if (!leadForm.service) errors.service = "Service type selection is required";
      if (["studyAbroad", "workpermit", "touristVisa"].includes(leadForm.service) && !leadForm.country) {
        errors.country = "Target Country is required";
      }
      if (["examBooking", "training"].includes(leadForm.service) && !leadForm.examType) {
        errors.examType = "Course/Exam title is required";
      }
      if (!leadForm.visaRejection) {
        errors.visaRejection = "Visa rejection answer is required";
      }
      if (!leadForm.travelHistory) {
        errors.travelHistory = "Travel history answer is required";
      }
      if (!leadForm.program) {
        errors.program = "Academic program / course is required";
      }
      if (!leadForm.ebd) {
        errors.ebd = "Expected Booking Date is required";
      }
      if (!leadForm.payment) {
        errors.payment = "Payment Method is required";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save/Update lead wizard details
  const saveLeadWizard = async () => {
    if (!validateWizardFields(wizardTab)) {
      alert("Please fix all highlighted errors before saving.");
      return;
    }

    setIsSavingLead(true);
    try {
      let response;
      const isUpdate = lead && (lead.id || lead._id);
      
      const payload = {
        ...leadForm,
        name: `${leadForm.firstName || ''} ${leadForm.lastName || ''}`.trim()
      };
      // Funnel Lead Status is strictly managed by Admin and Instructor, not student/user
      delete payload.status;

      if (isUpdate) {
        const leadId = lead.id || lead._id;
        response = await fetch((window.API_BASE || '') + `/api/v1/lead/${leadId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch((window.API_BASE || '') + '/api/v1/lead/create', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(payload)
        });
      }

      const result = await response.json();
      if (result.success && result.data) {
        const savedData = result.data;
        const formattedDob = savedData.dob ? new Date(savedData.dob).toISOString().split('T')[0] : "";
        const formattedEbd = savedData.ebd ? new Date(savedData.ebd).toISOString().split('T')[0] : "";
        
        setLead(savedData);
        setLeadForm({
          ...initialLeadForm,
          ...savedData,
          dob: formattedDob,
          ebd: formattedEbd
        });
        alert(isUpdate ? "Profile details updated successfully! 🎉" : "Enrollment profile registered! Proceed to documents. 📂");
        if (wizardTab === 0) {
          setWizardTab(1);
        } else {
          setWizardTab(2);
        }
      } else {
        throw new Error(result.message || "Failed to save profile");
      }
    } catch (err) {
      console.error('Error saving wizard:', err);
      alert(`Failed to save details: ${err.message}`);
    } finally {
      setIsSavingLead(false);
    }
  };

  // Handle document file upload slot
  const handleDocUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!lead || !(lead.id || lead._id)) {
      alert("Please save your enrollment details (Stage 1 & 2) first before uploading documents!");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("File exceeds the maximum size limit of 50MB.");
      return;
    }

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append("file", file);

    const leadId = lead.id || lead._id;

    try {
      const response = await fetch((window.API_BASE || '') + `/api/v1/lead/${leadId}/documents/${fieldName}/upload`, {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        const updatedDoc = data.document;
        const updatedDocs = Array.isArray(leadForm.documents)
          ? [...leadForm.documents.filter(d => d.documentType !== fieldName), updatedDoc]
          : [updatedDoc];

        setLeadForm(prev => ({
          ...prev,
          [fieldName]: updatedDoc.filePath,
          documents: updatedDocs
        }));
        
        // Update local lead state too
        setLead(prev => ({
          ...prev,
          [fieldName]: updatedDoc.filePath,
          documents: updatedDocs
        }));

        alert(`${updatedDoc.fileName} uploaded successfully!`);
      } else {
        throw new Error(data.message || "Failed uploading document");
      }
    } catch (err) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  if (isFetchingLead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
        <p className="text-slate-400 font-medium italic">Retrieving profile information...</p>
      </div>
    );
  }

  const activeService = leadForm.service || "";
  const documentSlots = docFieldsByService[activeService] || [];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Premium Gradient Top Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            Document Verification Portal
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1.5">
            Complete your verification dossier and upload requested documents in one place.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Stage Bar */}
        <div className="relative my-8 max-w-3xl mx-auto px-4">
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-100 -translate-y-1/2 rounded-full z-0" />
          <div 
            className="absolute top-1/2 left-0 h-[3px] bg-indigo-600 -translate-y-1/2 rounded-full transition-all duration-500 z-0"
            style={{ width: `${(wizardTab / 2) * 100}%` }}
          />
          
          <div className="flex justify-between relative z-10">
            {[
              { key: "leadGeneration", label: "Personal Info" },
              { key: "enrollmentInfo", label: "Enrollment Info" },
              { key: "documentation", label: "Verification Docs" }
            ].map((tab, idx) => {
              const isCompleted = idx < wizardTab;
              const isActive = idx === wizardTab;
              const isDisabled = idx === 2 && !lead;
              return (
                <button
                  key={tab.key}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (idx === 0) setWizardTab(0);
                    else if (idx === 1) {
                      if (idx <= wizardTab || validateWizardFields(0)) setWizardTab(1);
                    } else if (idx === 2 && lead) {
                      if (validateWizardFields(0) && validateWizardFields(1)) {
                        setWizardTab(2);
                      } else {
                        alert("Please fill all required fields in stages 1 & 2 before viewing Verification Docs.");
                      }
                    }
                  }}
                  className={`flex flex-col items-center gap-2 focus:outline-none ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                      isCompleted 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : isActive 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" 
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-indigo-600" : isCompleted ? "text-emerald-500" : "text-slate-400"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Glass-morphic form card */}
        <div className="bg-white border border-slate-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.02)] rounded-3xl p-6 md:p-10 mb-8 min-h-[380px]">
          
          {/* STAGE 0: PERSONAL INFO FORM */}
          {wizardTab === 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <User size={18} className="text-indigo-600" /> Personal Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">First Name *</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={leadForm.firstName} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white ${formErrors.firstName ? 'border-rose-400' : 'border-slate-200'}`} 
                    placeholder="e.g. John"
                  />
                  {formErrors.firstName && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.firstName}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Middle Name</label>
                  <input 
                    type="text" 
                    name="middleName" 
                    value={leadForm.middleName || ""} 
                    onChange={handleLeadFormChange}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white" 
                    placeholder="e.g. Kumar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Last Name *</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={leadForm.lastName} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white ${formErrors.lastName ? 'border-rose-400' : 'border-slate-200'}`} 
                    placeholder="e.g. Sharma"
                  />
                  {formErrors.lastName && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.lastName}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob" 
                    value={leadForm.dob} 
                    onChange={handleLeadFormChange}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gender *</label>
                  <select 
                    name="gender" 
                    value={leadForm.gender || ""} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white cursor-pointer ${formErrors.gender ? 'border-rose-400' : 'border-slate-200'}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.gender && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.gender}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={leadForm.phone} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white ${formErrors.phone ? 'border-rose-400' : 'border-slate-200'}`} 
                    placeholder="e.g. 9876543210"
                  />
                  {formErrors.phone && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Office Location *</label>
                  <select 
                    name="location" 
                    value={leadForm.location || ""} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white cursor-pointer ${formErrors.location ? 'border-rose-400' : 'border-slate-200'}`}
                  >
                    <option value="">Select Office Location</option>
                    <option value="Vesu">Vesu</option>
                    <option value="Varachha">Varachha</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.location && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.location}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Permanent Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={leadForm.address || ""} 
                    onChange={handleLeadFormChange}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white" 
                    placeholder="e.g. 123, Main Street, City"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-8">
                <h4 className="font-bold text-slate-800 text-sm mb-4">Emergency Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Contact Person Name</label>
                    <input 
                      type="text" 
                      name="emergencyContactName" 
                      value={leadForm.emergencyContactName || ""} 
                      onChange={handleLeadFormChange}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white" 
                      placeholder="e.g. Father/Mother Name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Relationship</label>
                    <input 
                      type="text" 
                      name="emergencyContactRelation" 
                      value={leadForm.emergencyContactRelation || ""} 
                      onChange={handleLeadFormChange}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white" 
                      placeholder="e.g. Parent, Sibling"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Emergency Phone</label>
                    <input 
                      type="text" 
                      name="emergencyContactPhone" 
                      value={leadForm.emergencyContactPhone || ""} 
                      onChange={handleLeadFormChange}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white" 
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 1: ENROLLMENT DETAILS FORM */}
          {wizardTab === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" /> Course & Program Enrollment details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Service *</label>
                  <select 
                    name="service" 
                    value={leadForm.service || ""} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white cursor-pointer ${formErrors.service ? 'border-rose-400' : 'border-slate-200'}`}
                  >
                    <option value="">Select Service</option>
                    <option value="studyAbroad">Study Abroad</option>
                    <option value="workpermit">Work Permit</option>
                    <option value="touristVisa">Tourist Visa</option>
                    <option value="examBooking">Exam Booking</option>
                    <option value="training">Training Courses</option>
                  </select>
                  {formErrors.service && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.service}</span>}
                </div>

                {["studyAbroad", "workpermit", "touristVisa"].includes(leadForm.service) && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target Country *</label>
                    <select 
                      name="country" 
                      value={leadForm.country || ""} 
                      onChange={handleLeadFormChange}
                      className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white cursor-pointer ${formErrors.country ? 'border-rose-400' : 'border-slate-200'}`}
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
                    {formErrors.country && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.country}</span>}
                  </div>
                )}

                {["examBooking", "training"].includes(leadForm.service) && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Exam / Training Course Title *</label>
                    <input 
                      type="text" 
                      name="examType" 
                      value={leadForm.examType || ""} 
                      onChange={handleLeadFormChange}
                      className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white ${formErrors.examType ? 'border-rose-400' : 'border-slate-200'}`}
                      placeholder="e.g. IELTS Reading, SAT, PTE"
                    />
                    {formErrors.examType && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.examType}</span>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Specific Target Location</label>
                  <input 
                    type="text" 
                    name="anyspecificlocation" 
                    value={leadForm.anyspecificlocation || ""} 
                    onChange={handleLeadFormChange}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white" 
                    placeholder="e.g. Munich, Toronto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Visa Rejections? *</label>
                  <select 
                    name="visaRejection" 
                    value={leadForm.visaRejection || ""} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white cursor-pointer ${formErrors.visaRejection ? 'border-rose-400' : 'border-slate-200'}`}
                  >
                    <option value="">Select Option</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  {formErrors.visaRejection && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.visaRejection}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Travel History? *</label>
                  <select 
                    name="travelHistory" 
                    value={leadForm.travelHistory || ""} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white cursor-pointer ${formErrors.travelHistory ? 'border-rose-400' : 'border-slate-200'}`}
                  >
                    <option value="">Select Option</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  {formErrors.travelHistory && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.travelHistory}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Academic Program / Course *</label>
                  <input 
                    type="text" 
                    name="program" 
                    value={leadForm.program || ""} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white ${formErrors.program ? 'border-rose-400' : 'border-slate-200'}`} 
                    placeholder="e.g. Business Administration, IT"
                  />
                  {formErrors.program && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.program}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment Method *</label>
                  <select 
                    name="payment" 
                    value={leadForm.payment || ""} 
                    onChange={handleLeadFormChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white cursor-pointer ${formErrors.payment ? 'border-rose-400' : 'border-slate-200'}`}
                  >
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Credit/Debit Card</option>
                  </select>
                  {formErrors.payment && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.payment}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Expected Booking Date (EBD) *</label>
                  <input 
                    type="date" 
                    name="ebd" 
                    value={leadForm.ebd || ""} 
                    onChange={handleLeadFormChange} 
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-700 bg-white ${formErrors.ebd ? 'border-rose-400' : 'border-slate-200'}`} 
                  />
                  {formErrors.ebd && <span className="text-xs text-rose-500 font-semibold mt-1 block">{formErrors.ebd}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: DOCUMENT UPLOADER FILES SLOTS */}
          {wizardTab === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileCheck size={18} className="text-indigo-600" /> Dossier Upload slots
                </h3>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">
                  Selected Service: {leadForm.service || 'N/A'}
                </span>
              </div>

              {!leadForm.service ? (
                <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-sm italic mb-1">Service Type Not Selected</p>
                  <p className="text-xs text-slate-400">Please go back to the previous step and select a course or study abroad service.</p>
                </div>
              ) : documentSlots.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-pulse" />
                  <p className="font-bold text-sm text-slate-500 mb-1">No Documents Required</p>
                  <p className="text-xs text-slate-400">Selected service ("{leadForm.service}") does not require document verification.</p>
                </div>
              ) : (() => {
                const renderSlotCard = (field) => {
                  const existingDoc = Array.isArray(leadForm.documents)
                    ? leadForm.documents.find(d => d.documentType === field.name)
                    : null;
                  const fileUrl = existingDoc ? existingDoc.filePath : leadForm[field.name];
                  const status = existingDoc ? existingDoc.status : (fileUrl ? "Uploaded" : "Empty");

                  return (
                    <div 
                      key={field.name}
                      className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 ${
                        status === 'Verified' 
                          ? 'bg-emerald-50/20 border-emerald-100' 
                          : status === 'Rejected' 
                          ? 'bg-rose-50/20 border-rose-100' 
                          : status === 'Pending' 
                          ? 'bg-amber-50/20 border-amber-100'
                          : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 leading-none">
                            {status === "Verified" && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                            {status === "Rejected" && <X size={16} className="text-rose-500 shrink-0 border border-rose-200 rounded-full p-0.5 bg-white" />}
                            {status === "Pending" && <Clock className="w-4 h-4 text-amber-500 shrink-0" />}
                            {field.label}
                          </h4>
                          
                          {fileUrl ? (
                            <p className="text-[10px] text-slate-400 font-semibold mt-2.5 truncate flex items-center gap-1.5 bg-white w-fit px-2 py-0.5 rounded-md border border-slate-150 shadow-sm">
                              <FileText size={10} className="text-slate-400 shrink-0" />
                              {existingDoc?.fileName || "uploaded-document"}
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-medium italic mt-2.5">No file uploaded.</p>
                          )}
                        </div>

                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shrink-0 ${
                          status === 'Verified' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : status === 'Rejected' 
                            ? 'bg-rose-100 text-rose-700' 
                            : status === 'Pending' 
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-slate-100/50 pt-3 mt-1">
                        <div className="flex gap-2 w-full">
                          {fileUrl ? (
                            <>
                              <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 flex items-center gap-1.5 text-[11px] font-bold transition-colors shadow-sm"
                              >
                                <Download size={12} /> View File
                              </a>

                              <label className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 flex items-center gap-1.5 text-[11px] font-bold cursor-pointer transition-colors shadow-sm">
                                <RefreshCw size={12} className={uploadingField === field.name ? 'animate-spin animate-infinite' : ''} />
                                Replace
                                <input 
                                  type="file" 
                                  accept="application/pdf,image/jpeg,image/png,image/webp,video/mp4,audio/mp3"
                                  onChange={(e) => handleDocUpload(e, field.name)}
                                  disabled={uploadingField !== null}
                                  className="hidden" 
                                />
                              </label>
                            </>
                          ) : (
                            <label className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-1.5 text-[11px] font-bold cursor-pointer transition-colors hover:bg-indigo-700 shadow-sm shadow-indigo-100">
                              <Loader2 size={12} className={uploadingField === field.name ? 'animate-spin shrink-0' : 'hidden'} />
                              {uploadingField === field.name ? 'Uploading...' : 'Upload File'}
                              <input 
                                type="file" 
                                accept="application/pdf,image/jpeg,image/png,image/webp,video/mp4,audio/mp3"
                                onChange={(e) => handleDocUpload(e, field.name)}
                                disabled={uploadingField !== null}
                                className="hidden" 
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                };

                if (leadForm.service === 'studyAbroad') {
                  return (
                    <div className="space-y-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {studyAbroadSections.map((section) => {
                        const sectionFields = documentSlots.filter(f => section.fields.includes(f.name));
                        const uploadedCount = sectionFields.filter(f => {
                          const doc = Array.isArray(leadForm.documents)
                            ? leadForm.documents.find(d => d.documentType === f.name)
                            : null;
                          return doc ? doc.filePath : leadForm[f.name];
                        }).length;

                        return (
                          <div key={section.title} className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full inline-block"></span>
                                {section.title}
                                <span className="text-xs text-slate-400 font-semibold normal-case tracking-normal">
                                  ({uploadedCount} of {sectionFields.length} uploaded)
                                </span>
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {sectionFields.map(renderSlotCard)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {documentSlots.map(renderSlotCard)}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Form actions */}
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {wizardTab === 0 ? (
            <div />
          ) : (
            <button 
              type="button" 
              onClick={() => setWizardTab(prev => prev - 1)}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft size={16} /> Previous Step
            </button>
          )}

          {wizardTab === 2 ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium italic">Changes and uploads are automatically saved!</span>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={saveLeadWizard}
              disabled={isSavingLead}
              className="px-7 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSavingLead ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> {wizardTab === 1 ? 'Save & Continue' : 'Next Step'} <ArrowRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserVerification;
