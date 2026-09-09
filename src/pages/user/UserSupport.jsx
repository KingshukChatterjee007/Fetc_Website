import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Loader2, Plus, MessageCircle, AlertCircle, Send, X, Clock, CheckCircle2, User, HelpCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function UserSupport() {
  const { user } = useOutletContext();
  const [searchParams] = useSearchParams();
  const urlTicketId = searchParams.get('ticketId');

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Active Chat State
  const [activeTicket, setActiveTicket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const [formData, setFormData] = useState({
    category: 'IELTS / PTE / TOEFL Coaching',
    customSubject: '',
    message: '',
    priority: 'MEDIUM'
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeTicket) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeTicket]);

  const fetchTickets = async () => {
    try {
      const emailParam = user?.email ? `email=${encodeURIComponent(user.email)}` : '';
      const userIdVal = user?.id || '0';
      const response = await fetch((window.API_BASE || "") + `/api/users/${userIdVal}/tickets${emailParam ? '?' + emailParam : ''}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        const list = data.tickets || [];
        setTickets(list);
        if (urlTicketId) {
          const matched = list.find(t => String(t.id) === String(urlTicketId));
          if (matched) {
            setActiveTicket(matched);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id || user?.email) fetchTickets();
  }, [user]);

  // Fetch chat history for selected active ticket
  const fetchChatMessages = async (ticketId, isSilent = false) => {
    if (!isSilent) setIsChatLoading(true);
    try {
      const response = await fetch((window.API_BASE || "") + `/api/tickets/${ticketId}/messages`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setChatMessages(data.messages || []);
        if (data.ticket) {
          setActiveTicket(data.ticket);
        }
      }
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    } finally {
      if (!isSilent) setIsChatLoading(false);
    }
  };

  // Live polling for chat messages every 3 seconds
  useEffect(() => {
    if (!activeTicket?.id) return;
    fetchChatMessages(activeTicket.id, false);

    const interval = setInterval(() => {
      fetchChatMessages(activeTicket.id, true);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTicket?.id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (activeTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTicket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalSubject = formData.category === 'Other' 
      ? (formData.customSubject.trim() || 'Other Inquiry')
      : formData.category;

    try {
      const response = await fetch((window.API_BASE || "") + '/api/tickets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          subject: finalSubject,
          message: formData.message,
          priority: formData.priority,
          userId: user.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ category: 'IELTS / PTE / TOEFL Coaching', customSubject: '', message: '', priority: 'MEDIUM' });
        setShowForm(false);
        fetchTickets();
      } else {
        alert(data.message || 'Failed to create ticket.');
      }
    } catch (err) {
      console.error('Error submitting ticket:', err);
      alert('Network error while creating ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingMessage || !activeTicket) return;

    const messageText = chatInput.trim();
    setChatInput('');
    setIsSendingMessage(true);

    try {
      const response = await fetch((window.API_BASE || "") + `/api/tickets/${activeTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          sender_type: 'USER',
          sender_name: user?.name || 'Student',
          sender_id: user?.id,
          message: messageText
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchChatMessages(activeTicket.id, true);
        fetchTickets();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="animate-spin text-brand-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Support Center</h1>
          <p className="text-slate-500 mt-1.5 text-sm font-medium">Create support requests & chat directly with instructors and support staff.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> New Ticket</>}
        </button>
      </div>

      {/* New Ticket Form */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject / Support Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-semibold text-slate-800 bg-white"
              >
                <option value="IELTS / PTE / TOEFL Coaching">IELTS / PTE / TOEFL Coaching & Training</option>
                <option value="Study Abroad Counseling & Admissions">Study Abroad Counseling & Admissions</option>
                <option value="Visa Processing & Documentation">Visa Processing & Documentation</option>
                <option value="Career Assessment & Guidance">Career Assessment & Guidance</option>
                <option value="Mock Test & Score Query">Mock Test & Score Query</option>
                <option value="Course Enrollment & Fees Inquiry">Course Enrollment & Fees Inquiry</option>
                <option value="Other">Other (Custom Subject)</option>
              </select>
            </div>

            {formData.category === 'Other' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specify Custom Subject</label>
                <input
                  required={formData.category === 'Other'}
                  type="text"
                  value={formData.customSubject}
                  onChange={(e) => setFormData({...formData, customSubject: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-800"
                  placeholder="Enter your custom subject or query details..."
                />
              </motion.div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Initial Message</label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all resize-none text-sm font-medium text-slate-800"
                placeholder="Provide detailed information about your inquiry..."
              ></textarea>
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-70 shadow-sm"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Ticket'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No support tickets</h3>
            <p className="text-slate-500 text-sm">You haven't submitted any support requests yet.</p>
          </div>
        ) : (
          tickets.map(ticket => {
            const hasReply = !!(ticket.admin_reply && ticket.admin_reply.trim());
            return (
              <div 
                key={ticket.id} 
                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                  hasReply ? 'border-blue-200 ring-1 ring-blue-100 hover:shadow-md' : 'border-slate-100 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-slate-800 text-lg leading-snug">{ticket.subject}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {ticket.status}
                      </span>
                      {hasReply && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <MessageCircle size={11} /> Admin / Instructor Replied
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-2">{ticket.message}</p>
                    
                    {/* Admin / Instructor Response Highlight */}
                    {hasReply && (
                      <div className="mt-3 p-3.5 rounded-xl bg-blue-50/90 border border-blue-200/70">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-blue-600" /> Instructor / Admin Response:
                          </span>
                          {ticket.replied_at && (
                            <span className="text-[10px] text-blue-600 font-semibold">
                              {new Date(ticket.replied_at).toLocaleDateString([], { day: 'numeric', month: 'short' })} at {new Date(ticket.replied_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {ticket.admin_reply}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 text-xs text-slate-400 font-semibold flex items-center gap-2">
                      <Clock size={14} /> Submitted on {new Date(ticket.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTicket(ticket)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 shadow-xs ${
                      hasReply 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 shadow-md ring-2 ring-blue-600/20' 
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                    }`}
                  >
                    <MessageCircle size={16} />
                    {hasReply ? 'View Messages & Answer' : 'Open Chat Box'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Box Modal Drawer */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeTicket && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setActiveTicket(null)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[85vh] z-10"
              >
                {/* Chat Header */}
                <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveTicket(null)} 
                      className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">{activeTicket.subject}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket #{activeTicket.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          activeTicket.status === 'OPEN' ? 'bg-amber-50 text-amber-600 border border-amber-200/80' :
                          activeTicket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border border-blue-200/80' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
                        }`}>
                          {activeTicket.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTicket(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Chat Message History */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/70">
                  {isChatLoading && chatMessages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="animate-spin text-brand-600 w-6 h-6" />
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs font-medium">
                      No messages in this conversation yet. Send your first message below.
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => {
                      const isUser = msg.sender_type === 'USER';
                      return (
                        <div 
                          key={msg.id || index} 
                          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                              {isUser ? 'You' : (msg.sender_name || 'Support Team')}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div 
                            className={`min-w-[70px] max-w-[82%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                              isUser 
                                ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs text-right' 
                                : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs text-left'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Footer */}
                <div className="border-t border-slate-100 bg-white shrink-0">
                  {activeTicket && (activeTicket.status?.toUpperCase() === 'RESOLVED' || activeTicket.status?.toUpperCase() === 'CLOSED') && (
                    <div className="px-4 py-2 bg-emerald-50/80 border-b border-emerald-100/70 flex items-center justify-between text-xs text-emerald-800">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 size={14} className="text-emerald-600" /> Ticket marked answered / resolved
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Type below to reply or ask follow-up questions</span>
                    </div>
                  )}
                  <form onSubmit={handleSendChatMessage} className="p-4 flex items-center gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={
                        activeTicket?.status?.toUpperCase() === 'RESOLVED'
                          ? "Type your answer or follow-up query here to reply..."
                          : "Type your message or answer here..."
                      }
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-medium text-slate-800 placeholder-slate-400 transition-all shadow-2xs"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isSendingMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all disabled:opacity-40 active:scale-95 shadow-sm shrink-0 flex items-center gap-1.5 text-xs"
                    >
                      {isSendingMessage ? <Loader2 className="animate-spin w-4 h-4" /> : <><Send size={15} /><span>Send</span></>}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export default UserSupport;
