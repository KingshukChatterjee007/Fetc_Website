import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Search, Loader2, Mail, Clock, CheckCircle, User, X, MessageSquare, Send, ExternalLink, Trash2 } from 'lucide-react';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [notification, setNotification] = useState(null);

  // Live Chat Box state
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = React.useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = (currentUser?.role || 'ADMIN').toUpperCase();
  const isAdmin = userRole === 'ADMIN' || !currentUser?.role;
  const canDeleteTicket = isAdmin || userRole === 'INSTRUCTOR';

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTicket) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedTicket]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE || '') + '/api/admin/tickets', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatMessages = async (ticketId, silent = false) => {
    if (!silent) setIsChatLoading(true);
    try {
      const response = await fetch((window.API_BASE || '') + `/api/tickets/${ticketId}/messages`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setChatMessages(data.messages || []);
        if (data.ticket) {
          setSelectedTicket(data.ticket);
        }
      }
    } catch (err) {
      console.error('Failed to fetch ticket chat:', err);
    } finally {
      if (!silent) setIsChatLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTicket?.id) return;
    fetchChatMessages(selectedTicket.id, false);

    const interval = setInterval(() => {
      fetchChatMessages(selectedTicket.id, true);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedTicket?.id]);

  useEffect(() => {
    if (selectedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, selectedTicket]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch((window.API_BASE || "") + `/api/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDeleteTicket = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this support ticket? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch((window.API_BASE || '') + `/api/admin/tickets/${id}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        setTickets(prev => prev.filter(t => t.id !== id));
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket(null);
        }
      } else {
        alert(data.message || 'Failed to delete ticket');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting support ticket');
    }
  };

  const handleSelectAllTickets = (e) => {
    if (e.target.checked) {
      setSelectedTicketIds(filteredTickets.map(t => t.id));
    } else {
      setSelectedTicketIds([]);
    }
  };

  const handleSelectTicket = (id, e) => {
    if (e) e.stopPropagation();
    if (selectedTicketIds.includes(id)) {
      setSelectedTicketIds(selectedTicketIds.filter(i => i !== id));
    } else {
      setSelectedTicketIds([...selectedTicketIds, id]);
    }
  };

  const handleBulkDeleteTickets = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedTicketIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedTicketIds.length} selected ticket(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch((window.API_BASE || '') + '/api/admin/tickets/bulk-delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ ids: selectedTicketIds })
      });
      const data = await response.json();
      if (data.success) {
        setTickets(tickets.filter(t => !selectedTicketIds.includes(t.id)));
        setSelectedTicketIds([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setTickets(tickets.filter(t => !selectedTicketIds.includes(t.id)));
      setSelectedTicketIds([]);
    }
  };

  const handleSendReply = async (newStatus = 'RESOLVED') => {
    if (!replyText.trim() || !selectedTicket) {
      setNotification({ type: 'error', text: 'Please enter a reply message before sending.' });
      return;
    }

    setIsSendingReply(true);
    setNotification(null);
    const messageText = replyText.trim();
    setReplyText("");

    try {
      const response = await fetch((window.API_BASE || "") + `/api/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          sender_type: currentUser.role || 'ADMIN',
          sender_name: currentUser.name || 'Support Staff',
          sender_id: currentUser.id,
          message: messageText,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchChatMessages(selectedTicket.id, true);
        fetchTickets();
        setNotification({ type: 'success', text: 'Message posted to Chat Box!' });
      } else {
        setNotification({ type: 'error', text: data.message || 'Failed to send message.' });
      }
    } catch (err) {
      console.error('Reply send error:', err);
      setNotification({ type: 'error', text: 'Network error while sending reply.' });
    } finally {
      setIsSendingReply(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      setNotification(null);
      setReplyText("");
    }
  }, [selectedTicket?.id]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = (
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.name && ticket.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.email && ticket.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-rose-500 bg-rose-50';
      case 'MEDIUM': return 'text-amber-500 bg-amber-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto">
      {/* Ticket Detail & Email Reply Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedTicket && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedTicket(null)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60 max-h-[90vh] flex flex-col z-10"
              >
                {/* Modal Header */}
                <div className="p-8 pb-4 border-b border-slate-100 flex justify-between items-start shrink-0 bg-slate-50/50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority} Priority
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase ${
                        selectedTicket.status === 'OPEN' ? 'bg-blue-100 text-blue-600' : 
                        selectedTicket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 leading-snug">{selectedTicket.subject}</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    {canDeleteTicket && (
                      <button 
                        onClick={(e) => handleDeleteTicket(selectedTicket.id, e)}
                        className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition-colors"
                        title="Delete Support Ticket"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                    <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-200/50 rounded-full text-slate-400 transition-colors">
                      <X size={22} />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">
                  {/* User Info Bar */}
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs">
                      <User size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Student Name</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{selectedTicket.name || 'Anonymous'}</p>
                    </div>
                  </div>

                  {/* Live Chat Box Thread */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MessageSquare size={14} className="text-brand-600" /> Live Chat Thread
                    </h4>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {isChatLoading && chatMessages.length === 0 ? (
                        <div className="flex justify-center p-6"><Loader2 className="animate-spin text-brand-600" size={20} /></div>
                      ) : chatMessages.length === 0 ? (
                        <div className="text-xs text-slate-400 italic text-center py-4 font-medium">"{selectedTicket.message}"</div>
                      ) : (
                        chatMessages.map((msg, index) => {
                          const isStudent = msg.sender_type === 'USER';
                          return (
                            <div key={msg.id || index} className={`flex flex-col ${isStudent ? 'items-start' : 'items-end'}`}>
                              <div className="flex items-center gap-2 mb-1 px-1">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                  {isStudent ? (msg.sender_name || 'Student') : (msg.sender_name || 'Support / Instructor')}
                                </span>
                                <span className="text-[9px] text-slate-400">
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div 
                                className={`min-w-[70px] max-w-[85%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                                  isStudent 
                                    ? 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60 text-left' 
                                    : 'bg-blue-600 text-white rounded-tr-xs shadow-xs text-right'
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
                  </div>

                  {/* Reply Form / Closed Banner */}
                  {selectedTicket && (selectedTicket.status?.toUpperCase() === 'RESOLVED' || selectedTicket.status?.toUpperCase() === 'CLOSED') ? (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-center gap-2.5 text-emerald-800 text-xs font-bold shadow-2xs">
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                      <span>This support ticket is resolved & closed. Conversation ended.</span>
                    </div>
                  ) : (
                    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                          <Send size={14} className="text-blue-400" /> Send Response in Chat Box
                        </h4>
                        <span className="text-[10px] font-medium text-slate-400">Live Chat</span>
                      </div>

                      <textarea 
                        rows="3"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response here to send into the chat box..."
                        className="w-full p-3.5 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-medium text-slate-100 placeholder-slate-400"
                      />

                      {/* Notification Feedback */}
                      {notification && (
                        <div className={`mt-3 p-2.5 text-xs rounded-xl font-medium flex items-center gap-2 ${
                          notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {notification.type === 'success' ? <CheckCircle size={14} /> : <X size={14} />}
                          {notification.text}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400 italic">
                          Live Chat Conversation
                        </span>
                        <div className="flex gap-2">
                          <button 
                            disabled={isSendingReply || !replyText.trim()}
                            onClick={() => handleSendReply('IN_PROGRESS')}
                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5 active:scale-95"
                          >
                            {isSendingReply ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                            Post & In Progress
                          </button>

                          <button 
                            disabled={isSendingReply || !replyText.trim()}
                            onClick={() => handleSendReply('RESOLVED')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-40 flex items-center gap-1.5 active:scale-95"
                          >
                            {isSendingReply ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                            Post & Resolve
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Student Support</h1>
          <p className="text-slate-500 font-medium text-sm italic">Review inquiries and directly reply to students via email.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <label className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all text-xs font-semibold text-slate-700">
              <input 
                type="checkbox"
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                checked={filteredTickets.length > 0 && selectedTicketIds.length === filteredTickets.length}
                onChange={handleSelectAllTickets}
              />
              Select All
            </label>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
                placeholder="Search by query, name, or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isAdmin && selectedTicketIds.length > 0 && (
              <button
                onClick={handleBulkDeleteTickets}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <Trash2 size={14} />
                Delete Selected ({selectedTicketIds.length})
              </button>
            )}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 bg-slate-100/70 p-1 rounded-xl">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {isLoading && <Loader2 className="animate-spin text-brand-600" size={18} />}
        </div>

        {/* Tickets Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map((ticket) => (
              <motion.div 
                key={ticket.id}
                layout
                onClick={() => setSelectedTicket(ticket)}
                className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 hover:bg-white hover:shadow-md transition-all group cursor-pointer relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                        checked={selectedTicketIds.includes(ticket.id)}
                        onChange={(e) => handleSelectTicket(ticket.id, e)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className={`px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority} Priority
                      </div>
                      {ticket.admin_reply && (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-semibold bg-indigo-50 text-indigo-600 flex items-center gap-1">
                          <Mail size={10} /> Replied
                        </span>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase ${
                      ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-600' : 
                      ticket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-slate-900 mb-2 truncate">{ticket.subject}</h4>
                  <p className="text-xs text-slate-500 mb-6 line-clamp-2 italic leading-relaxed break-words">"{ticket.message}"</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-slate-600 flex items-center gap-1">
                      <User size={12} className="text-slate-400" /> {ticket.name || 'Anonymous Student'}
                    </span>
                    <span className="text-[10px] text-slate-400 opacity-80 flex items-center gap-1 mt-0.5">
                      <Mail size={10} /> {ticket.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(ticket);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1"
                      title="Reply via Email"
                    >
                      <Mail size={14} /> Answer
                    </button>
                    {ticket.status === 'OPEN' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(ticket.id, 'IN_PROGRESS');
                        }}
                        className="p-2 text-amber-500 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
                        title="Mark In Progress"
                      >
                        <Clock size={16} />
                      </button>
                    )}
                    {ticket.status !== 'RESOLVED' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(ticket.id, 'RESOLVED');
                        }}
                        className="p-2 text-emerald-500 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                        title="Mark Resolved"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {canDeleteTicket && (
                      <button 
                        onClick={(e) => handleDeleteTicket(ticket.id, e)}
                        className="p-2 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                        title="Delete Support Ticket"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {!isLoading && filteredTickets.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">All clear!</h3>
              <p className="text-slate-400 text-sm italic">There are no matching support tickets.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSupportTickets;
