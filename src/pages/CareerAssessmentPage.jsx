import React, { useState, useEffect } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Brain, Target, AlertTriangle, Compass,
  CheckCircle2, ArrowRight, LayoutGrid, Loader2,
  Award, Activity, TrendingUp, Building2,
  MessageSquare, HeartPulse, Cog, Shield, Map, Focus,
  Layers, Check, X, Mail, User, Phone, Send, Calendar, CreditCard, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../apiConfig';
import { useNavigate } from 'react-router-dom';
import { useScrollLock } from '../hooks/useScrollLock';
// import ContactPage from "./ContactPage";

// --- Extracted Data ---
const VAK_DATA = [
  { name: 'Visual', score: 80, color: '#0ea5e9' },      // sky-500
  { name: 'Kinesthetic', score: 60, color: '#3b82f6' }, // blue-500
  { name: 'Auditory', score: 40, color: '#64748b' },    // slate-500
];

const COMPETENCY_DATA = [
  { subject: 'Democratic values', score: 90 },
  { subject: 'Helping attitude', score: 85 },
  { subject: 'Democratic decision', score: 75 },
  { subject: 'Consultative Process', score: 80 },
  { subject: 'Repeated Action', score: 65 },
  { subject: 'Organizing', score: 70 },
  { subject: 'Market research', score: 75 },
  { subject: 'Attention to detail', score: 85 },
  { subject: 'Conflict Management', score: 80 },
  { subject: 'Interpersonal Skill', score: 85 },
];

const CAREER_DATA = [
  { subject: 'Hospitality', score: 95, icon: Building2 },
  { subject: 'Counseling', score: 88, icon: MessageSquare },
  { subject: 'Healthcare', score: 85, icon: HeartPulse },
  { subject: 'Production Eng', score: 82, icon: Cog },
  { subject: 'Criminology', score: 84, icon: Shield },
  { subject: 'Navigation', score: 80, icon: Map },
];

const STRENGTHS = [
  "Effectively processes and utilizes feedback",
  "Engages positively in recognition exchanges",
  "Consistently identifies potential in peers",
  "Demonstrates high emotional intelligence",
  "Accurately assesses human motivations",
  "Maintains high proactive engagement",
  "Structures personal time efficiently",
  "Processes information in linear, logical steps",
  "Prefers contextual stability over disruption",
  "Exhibits strong visual-spatial imagination"
];

const TABS = [
  { id: 'overview', label: 'Executive Summary', icon: LayoutGrid },
  { id: 'competencies', label: 'Core Competencies', icon: Target },
  { id: 'careers', label: 'Career Alignment', icon: BriefcaseIcon },
  { id: 'learning', label: 'Cognitive Profile', icon: Brain },
];

// Helper icon component for tabs
function BriefcaseIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}

// --- Custom macOS-style Tooltip ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-xl px-5 py-4 border border-slate-200/60 rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label || payload[0].payload.subject}</p>
        <p className="text-sm flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: payload[0].color || payload[0].payload.color || '#0ea5e9' }} />
          <span className="font-medium text-slate-600">Score:</span>
          <span className="font-bold text-slate-900 text-base">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function CareerAssessmentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Modal Inquiry states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFormData, setModalFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
  });
  const [modalIsSubmitting, setModalIsSubmitting] = useState(false);
  const [modalIsSubmitted, setModalIsSubmitted] = useState(false);

  // Payment Checkout Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isRedirectingPayment, setIsRedirectingPayment] = useState(false);
  const [assessmentFee, setAssessmentFee] = useState(1000);

  // Lock body scroll when any modal is open & prevent scrollbar layout shift
  useScrollLock(isModalOpen || showPaymentModal);

  const handleModalChange = (e) => {
    setModalFormData({ ...modalFormData, [e.target.name]: e.target.value });
  };

  const handleOpenAssessmentModal = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login first to start the assessment.");
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setModalFormData(prev => ({
        ...prev,
        name: prev.name || parsedUser.name || `${parsedUser.first_name || ''} ${parsedUser.last_name || ''}`.trim() || '',
        email: prev.email || parsedUser.email || '',
        phone: prev.phone || parsedUser.phone || ''
      }));
    } catch (e) {}

    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login first to start the assessment.");
      navigate("/login");
      return;
    }

    // Directly proceed to payment modal without creating a lead
    setIsModalOpen(false);
    setShowPaymentModal(true);
  };

  const handlePayNow = async () => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!user) {
        alert("Please login first to make the payment.");
        navigate("/login");
        return;
      }

      setIsRedirectingPayment(true);
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload = {
        phone: modalFormData.phone.replace(/\D/g, ''),
        courseId: 'CAREER_ASSESSMENT',
        name: modalFormData.name.trim(),
        email: modalFormData.email.trim(),
        date: modalFormData.date,
        selectedDate: modalFormData.date,
        productType: 'CAREER_ASSESSMENT',
        amount: Number(assessmentFee) || 1000,
        returnUrl: window.location.href,
      };

      // Point to API backend endpoint for payment initialization
      const targetUrl = getApiUrl('/api/v1/order/initiate-payment');
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      console.log('Payment Gateway Response:', res);

      const redirectUrl = res?.redirectUrl || res?.data?.redirectUrl;

      if (!redirectUrl) {
        setIsRedirectingPayment(false);
        const errorMsg = res?.message || res?.error || res?.data?.message || 'Gateway URL not returned by server.';
        alert(`Payment Error: ${errorMsg}`);
        return;
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Payment Error:', error);
      setIsRedirectingPayment(false);
      alert(`Payment Error: ${error.message || 'Failed to connect to payment gateway.'}`);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(getApiUrl('/api/settings/career_assessment_fee'))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.value) {
          setAssessmentFee(Number(data.value));
        }
      })
      .catch(err => console.error('Failed to fetch fee setting:', err));

    fetch(getApiUrl('/api/pages/career-assessment/behaviour-and-career-analysis'))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.page?.content) {
          const pAmount = data.page.content.amount ?? data.page.content.fee;
          if (pAmount !== undefined && pAmount !== null && pAmount !== '') {
            setAssessmentFee(Number(pAmount));
          }
        }
      })
      .catch(err => console.error('Failed to fetch career data:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Generating Analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="mx-auto max-w-[1200px] space-y-16">

        {/* --- PROFESSIONAL HERO HEADER WITH ROUNDED BORDERS & COLORS --- */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200/80 p-10 lg:p-14 shadow-sm">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/50 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Verified Assessment
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.15]">
                {/* MATCHED GRADIENT COLOR (Blue to Teal) */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
                  Behavioral & Career
                </span> <br />
                <span className="text-slate-900">Analysis Report</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                A comprehensive data-driven evaluation mapping your intrinsic behavioral patterns, cognitive learning styles, and verified competencies to optimal industry pathways.
              </p>
            </div>

            <div className="shrink-0 flex flex-col gap-4 w-full max-w-sm">
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Focus size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Profile</h3>
                  <p className="text-base font-bold text-slate-800">Consultative Leader</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Peak Industry Match</h3>
                  <p className="text-base font-bold text-slate-800">Hospitality & Healthcare</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN DASHBOARD CONTAINER --- */}
        <div className="bg-white rounded-[3rem] border border-slate-200/80 shadow-sm min-h-[700px] flex flex-col overflow-hidden">

          {/* Rounded Segmented Navigation */}
          <div className="w-full border-b border-slate-100 px-8 py-4 overflow-x-auto no-scrollbar flex md:justify-center">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shrink-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2.5 px-4 md:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                      isActive ? 'text-blue-700 bg-white shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="p-8 lg:p-12 flex-1">
            {/* 1. EXECUTIVE SUMMARY */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-10 lg:p-12 text-white relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-inner">
                      <LayoutGrid size={24} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">Assessment Overview</h2>
                    <p className="text-slate-300 text-base leading-relaxed max-w-xl mb-10 font-medium">
                      The ComPAS Now™ analysis indicates a strong alignment with roles requiring methodical organization, interpersonal diplomacy, and contextual consistency. High scores in democratic values suggest proficiency in collaborative environments.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => setActiveTab('competencies')} className="px-6 py-3 bg-white text-slate-900 text-sm font-bold rounded-xl shadow-sm inline-flex items-center gap-2 w-fit">
                        View Matrix Data <ArrowRight size={18} />
                      </button>
                      <button
                        onClick={handleOpenAssessmentModal}
                        className="px-6 py-3 bg-blue-600/30 backdrop-blur-md border border-white/20 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-blue-600/50 transition-all inline-flex items-center gap-2 w-fit"
                      >
                        Start Assessment <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-200 flex flex-col justify-center shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Activity size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Primary Modality</h3>
                  </div>
                  <p className="text-3xl font-extrabold text-slate-800 mb-4">Visual-Dominant</p>
                  <p className="text-base text-slate-500 font-medium leading-relaxed">
                    Primary cognitive processing occurs through spatial and observational engagement.
                  </p>
                </div>

                <div className="lg:col-span-3 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                    <CheckCircle2 className="text-blue-500" size={28} />
                    <h3 className="text-2xl font-bold text-slate-800">Verified Behavioral Strengths</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    {STRENGTHS.map((strength, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                        <Check size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-base font-medium text-slate-600">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. CORE COMPETENCIES */}
            {activeTab === 'competencies' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-7 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center">
                  <div className="w-full text-left mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Competency Matrix</h2>
                    <p className="text-slate-500 text-base font-medium">Multivariate analysis of interactive response patterns.</p>
                  </div>
                  <div className="w-full h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={COMPETENCY_DATA}>
                        <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Radar name="Score" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.15} isAnimationActive={false} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-8 flex items-center gap-2">
                      <Layers size={18} className="text-blue-500" /> Upper Quartile Traits
                    </h3>
                    <div className="space-y-6">
                      {[...COMPETENCY_DATA].sort((a, b) => b.score - a.score).slice(0, 4).map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-base font-bold text-slate-800">{item.subject}</span>
                            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{item.score}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${item.score}%` }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Analysis Note</h4>
                    <p className="text-base font-medium text-slate-600 leading-relaxed">
                      The combination of high Democratic Values (90%) and Interpersonal Skills (85%) strongly indicates a capability for consensus-building and effective team mediation in structured environments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CAREER ALIGNMENTS */}
            {activeTab === 'careers' && (
              <div className="space-y-6">

                <div className="bg-white rounded-[2rem] p-10 border border-emerald-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-emerald-400" />
                  <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Award size={40} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-3">
                      Primary Recommendation
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{CAREER_DATA[0].subject} Sector</h2>
                    <p className="text-base font-medium text-slate-600 max-w-2xl">Optimal alignment ({CAREER_DATA[0].score}%) based on interpersonal metrics and structured environmental preferences.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CAREER_DATA.slice(1).map((career) => {
                    const Icon = career.icon;
                    return (
                      <div key={career.subject} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600">
                            <Icon size={24} />
                          </div>
                          <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            {career.score}% Match
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">{career.subject}</h3>
                        <div className="mt-auto h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${career.score}%` }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <AlertTriangle size={24} className="text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Divergent Pathways</h3>
                    <p className="text-base font-medium text-slate-600">Statistical variance suggests minimizing pursuit of highly unstructured or volatile sectors such as Consultancy, Live Media, or active military deployments.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. COGNITIVE PROFILE */}
            {activeTab === 'learning' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm flex flex-col">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">VAK Modality Analysis</h2>
                  <p className="text-slate-500 text-base font-medium mb-10">Distribution of neuro-linguistic learning preferences.</p>

                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={VAK_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }} dy={15} />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                        <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={50} isAnimationActive={false}>
                          {VAK_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm h-full">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">Optimization Strategies</h3>
                    <div className="space-y-8">
                      {[
                        { title: "Data Visualization", desc: "Convert text-heavy materials into architectural diagrams, flowcharts, or mind maps prior to deep reading." },
                        { title: "Kinesthetic Engagement", desc: "Integrate physical interaction during study sessions via active highlighting, note-taking, or practical experimentation." },
                        { title: "Information Sequencing", desc: "Adopt a top-down approach: establish structural outlines or bullet points before engaging with granular details." },
                        { title: "Environmental Control", desc: "Ensure isolated, distraction-free environments to maintain focus integrity, minimizing auditory interference." },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-5">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={18} className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-base mb-1.5">{item.title}</h4>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- TAKE ASSESSMENT CTA --- */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white shadow-2xl shadow-blue-200/50">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Ready to Start?
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Take Your Professional <br />
                ComPAS Now™ Assessment
              </h2>
              <p className="text-blue-50 text-base font-medium opacity-90 leading-relaxed">
                Unlock your full potential with our advanced behavioral evaluation. 
                Complete the online test now to receive your personalized roadmap to career excellence.
              </p>
            </div>
            
            <button 
              onClick={handleOpenAssessmentModal}
              className="group relative px-10 py-5 bg-white text-blue-700 rounded-[2rem] font-black text-sm tracking-widest uppercase shadow-xl hover:shadow-2xl flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Start Assessment</span>
              <Compass size={20} className="relative z-10" />
            </button>
          </div>
        </div>

        {/* --- CONTACT SEGMENT (Now parallel and perfectly spaced) --- */}
        {/*
        <div className="w-full">
          <ContactPage bgTransparent={true} showMap={false} compact={true} />
        </div>
        */}

      </div>

      {/* Premium Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transform-gpu"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-10 my-auto transform-gpu"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800">Start Your Assessment</h3>
                  <p className="text-slate-500 mt-1">Fill out the form below to begin your career evaluation.</p>
                </div>

                {modalIsSubmitted && (
                  <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3">
                    <div className="bg-green-100 p-1.5 rounded-full shrink-0 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold">Assessment request submitted!</h4>
                      <p className="text-sm text-green-600 mt-0.5">We will get in touch shortly to start your assessment.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleModalSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label htmlFor="modal-name" className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                          <User size={18} />
                        </div>
                        <input
                          type="text"
                          id="modal-name"
                          name="name"
                          value={modalFormData.name}
                          onChange={handleModalChange}
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all hover:border-slate-300"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label htmlFor="modal-email" className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          id="modal-email"
                          name="email"
                          value={modalFormData.email}
                          onChange={handleModalChange}
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all hover:border-slate-300"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label htmlFor="modal-phone" className="text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        id="modal-phone"
                        name="phone"
                        value={modalFormData.phone}
                        onChange={handleModalChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all hover:border-slate-300"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label htmlFor="modal-date" className="text-sm font-semibold text-slate-700">Select Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Calendar size={18} />
                      </div>
                      <input
                        type="date"
                        id="modal-date"
                        name="date"
                        value={modalFormData.date}
                        onChange={handleModalChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all hover:border-slate-300"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={modalIsSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all mt-4 ${
                      modalIsSubmitting ? "bg-blue-600/70 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.99] hover:-translate-y-0.5"
                    }`}
                  >
                    {modalIsSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="transform -rotate-12 group-hover:rotate-0 transition-transform" />
                        Start Assessment
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* PAYMENT CHECKOUT MODAL */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowPaymentModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transform-gpu"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-10 my-auto transform-gpu"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isRedirectingPayment}
                  className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={20} className="text-blue-200" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">Assessment Checkout</span>
                </div>
                <h3 className="text-xl font-bold text-white">Career Assessment Fee</h3>
                <p className="text-blue-100 text-xs mt-1">Competency Mapping & Direction Tool</p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Amount</span>
                    <div className="text-2xl font-extrabold text-slate-900">₹{Number(assessmentFee).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">INR</span></div>
                  </div>
                  <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Online Test Access
                  </div>
                </div>

                <div className="space-y-2 border-t border-b border-slate-100 py-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Candidate:</span>
                    <span className="font-semibold text-slate-900">{modalFormData.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Email:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">{modalFormData.email}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phone:</span>
                    <span className="font-semibold text-slate-900">{modalFormData.phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Selected Date:</span>
                    <span className="font-semibold text-slate-900">{modalFormData.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                  <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                  <span>100% Encrypted & Secure Payment Gateway</span>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handlePayNow}
                    disabled={isRedirectingPayment}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75"
                  >
                    {isRedirectingPayment ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Connecting Gateway...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Pay ₹{Number(assessmentFee).toLocaleString('en-IN')} & Start Assessment</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setIsModalOpen(true);
                    }}
                    disabled={isRedirectingPayment}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                  >
                    Back to Form
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}