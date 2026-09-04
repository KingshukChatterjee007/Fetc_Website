import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Plus, Search, Calendar, Edit2, Trash2, Loader2, 
  ArrowLeft, Save, Printer, X, PlusCircle, CheckCircle2, ShoppingBag, CreditCard, User, Tag, Eye
} from 'lucide-react';
import { getApiUrl } from '../../apiConfig';

const COMPANY_OPTIONS = [
  'Syzygy llp',
  'Foreign English Tests Capital llp',
  'Parikshaa.in llp',
  'Gina Abroad',
  'Gina Abroad pvt.ltd',
];

const AdminInvoice = () => {
  // Navigation & View Mode State ('list' | 'create' | 'edit')
  const [viewMode, setViewMode] = useState('list');
  const [activeCategory, setActiveCategory] = useState('admin'); // 'admin' | 'student'
  
  // Data States
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceNos, setSelectedInvoiceNos] = useState([]);
  const [selectedPurchaseIds, setSelectedPurchaseIds] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{"role":"ADMIN"}');
  const isAdmin = (currentUser?.role || 'ADMIN').toUpperCase() === 'ADMIN';
  const [studentPurchases, setStudentPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingPurchases, setIsFetchingPurchases] = useState(false);
  
  // Filters & Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null); // Receipt Modal

  // Invoice Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issuerCompany: 'Gina Abroad pvt.ltd',
    companyName: '',
    clientName: '',
    address: '',
    country: '',
    pin: '',
    phone: '',
    email: '',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    upiRef: '',
    items: [{ description: '', duration: '', quantity: 1, rate: 0, amount: 0 }],
    applySgst: false,
    applyCgst: false,
  });
  const [errors, setErrors] = useState({});

  const invoicePrintRef = useRef(null);

  useEffect(() => {
    fetchInvoices();
    fetchStudentPurchases();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/v1/invoice/all'));
      const data = await response.json();
      if (data.success) {
        setInvoices(data.invoices || []);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentPurchases = async () => {
    setIsFetchingPurchases(true);
    try {
      const response = await fetch(getApiUrl('/api/v1/orders/all'));
      const data = await response.json();
      if (data.success) {
        setStudentPurchases(data.purchases || []);
      }
    } catch (err) {
      console.error('Error fetching student purchases:', err);
    } finally {
      setIsFetchingPurchases(false);
    }
  };

  const fetchNextInvoiceNo = async () => {
    try {
      const response = await fetch(getApiUrl('/api/v1/invoice/next-no'));
      const data = await response.json();
      if (data.success && data.invoiceNo) {
        return data.invoiceNo;
      }
    } catch (err) {
      console.error('Error fetching next invoice no:', err);
    }
    return `INV-${String(invoices.length + 1).padStart(3, '0')}`;
  };

  const handleOpenCreateForm = async () => {
    const nextNo = await fetchNextInvoiceNo();
    setFormData({
      issuerCompany: 'Gina Abroad pvt.ltd',
      companyName: '',
      clientName: '',
      address: '',
      country: '',
      pin: '',
      phone: '',
      email: '',
      invoiceNo: nextNo,
      invoiceDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      upiRef: '',
      items: [{ description: '', duration: '', quantity: 1, rate: 0, amount: 0 }],
      applySgst: false,
      applyCgst: false,
    });
    setErrors({});
    setViewMode('create');
  };

  const handleOpenEditForm = async (inv) => {
    try {
      const response = await fetch(getApiUrl(`/api/v1/invoice/${inv.invoiceNo}`));
      const data = await response.json();
      if (data.success && data.invoice) {
        const fullInv = data.invoice;
        const billTo = fullInv.billTo || {};
        setFormData({
          issuerCompany: fullInv.issuerCompany || billTo.issuerCompany || 'Gina Abroad pvt.ltd',
          companyName: billTo.companyName || '',
          clientName: billTo.clientName || '',
          address: billTo.address || '',
          country: billTo.country || '',
          pin: billTo.pin || '',
          phone: billTo.phone || '',
          email: billTo.email || '',
          invoiceNo: fullInv.invoiceNo,
          invoiceDate: fullInv.invoiceDate || new Date().toISOString().split('T')[0],
          paymentMethod: fullInv.paymentMethod || 'Cash',
          upiRef: fullInv.upiRef || '',
          items: fullInv.items && fullInv.items.length > 0 ? fullInv.items : [{ description: '', duration: '', quantity: 1, rate: 0, amount: 0 }],
          applySgst: (fullInv.sgst || 0) > 0,
          applyCgst: (fullInv.cgst || 0) > 0,
        });
        setSelectedInvoiceNo(fullInv.invoiceNo);
        setErrors({});
        setViewMode('edit');
      }
    } catch (err) {
      console.error('Error fetching invoice details for edit:', err);
    }
  };

  const handleDeleteInvoice = async (invoiceNo) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNo}?`)) return;
    try {
      const response = await fetch(getApiUrl(`/api/v1/invoice/${invoiceNo}`), {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setInvoices(invoices.filter((inv) => inv.invoiceNo !== invoiceNo));
      } else {
        alert(data.message || 'Failed to delete invoice');
      }
    } catch (err) {
      console.error('Error deleting invoice:', err);
      alert('Failed to delete invoice');
    }
  };

  const handleSelectAllInvoices = (e) => {
    if (e.target.checked) {
      setSelectedInvoiceNos(filteredInvoices.map(inv => inv.invoiceNo || inv.id));
    } else {
      setSelectedInvoiceNos([]);
    }
  };

  const handleSelectInvoice = (invoiceNo) => {
    if (selectedInvoiceNos.includes(invoiceNo)) {
      setSelectedInvoiceNos(selectedInvoiceNos.filter(i => i !== invoiceNo));
    } else {
      setSelectedInvoiceNos([...selectedInvoiceNos, invoiceNo]);
    }
  };

  const handleBulkDeleteInvoices = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedInvoiceNos.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedInvoiceNos.length} selected invoice(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch(getApiUrl('/api/admin/invoices/bulk-delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedInvoiceNos })
      });
      const data = await response.json();
      if (data.success) {
        setInvoices(invoices.filter(i => !selectedInvoiceNos.includes(i.invoiceNo || i.id)));
        setSelectedInvoiceNos([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setInvoices(invoices.filter(i => !selectedInvoiceNos.includes(i.invoiceNo || i.id)));
      setSelectedInvoiceNos([]);
    }
  };

  const handleSelectAllPurchases = (e) => {
    if (e.target.checked) {
      setSelectedPurchaseIds(filteredPurchases.map(p => p.id || p.invoiceNo));
    } else {
      setSelectedPurchaseIds([]);
    }
  };

  const handleSelectPurchase = (id) => {
    if (selectedPurchaseIds.includes(id)) {
      setSelectedPurchaseIds(selectedPurchaseIds.filter(i => i !== id));
    } else {
      setSelectedPurchaseIds([...selectedPurchaseIds, id]);
    }
  };

  const handleBulkDeletePurchases = async () => {
    if (!isAdmin) {
      alert('Only administrators have access to bulk delete entries.');
      return;
    }
    if (selectedPurchaseIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedPurchaseIds.length} selected student online purchase(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch(getApiUrl('/api/admin/purchases/bulk-delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedPurchaseIds })
      });
      const data = await response.json();
      if (data.success) {
        setStudentPurchases(studentPurchases.filter(p => !selectedPurchaseIds.includes(p.id) && !selectedPurchaseIds.includes(p.invoiceNo)));
        setSelectedPurchaseIds([]);
      } else {
        alert(data.message || 'Bulk delete failed');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setStudentPurchases(studentPurchases.filter(p => !selectedPurchaseIds.includes(p.id) && !selectedPurchaseIds.includes(p.invoiceNo)));
      setSelectedPurchaseIds([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    const currentItem = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      const qty = parseFloat(field === 'quantity' ? value : currentItem.quantity) || 0;
      const rate = parseFloat(field === 'rate' ? value : currentItem.rate) || 0;
      currentItem.amount = qty * rate;
    }

    newItems[index] = currentItem;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', duration: '', quantity: 1, rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Calculations
  const subtotal = formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const sgst = formData.applySgst ? subtotal * 0.09 : 0;
  const cgst = formData.applyCgst ? subtotal * 0.09 : 0;
  const grandTotal = subtotal + sgst + cgst;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.invoiceNo.trim()) newErrors.invoiceNo = 'Invoice number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveInvoice = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const payload = {
      invoiceNo: formData.invoiceNo,
      invoiceDate: formData.invoiceDate,
      paymentMethod: formData.paymentMethod,
      upiRef: formData.upiRef,
      issuerCompany: formData.issuerCompany,
      billTo: {
        issuerCompany: formData.issuerCompany,
        clientName: formData.clientName,
        companyName: formData.companyName,
        address: formData.address,
        country: formData.country,
        pin: formData.pin,
        phone: formData.phone,
        email: formData.email,
      },
      items: formData.items,
      subtotal,
      sgst,
      cgst,
      total: grandTotal,
    };

    try {
      const response = await fetch(getApiUrl('/api/v1/invoice/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await fetchInvoices();
        setViewMode('list');
      } else {
        alert(data.message || 'Failed to save invoice');
      }
    } catch (err) {
      console.error('Error saving invoice:', err);
      alert('Failed to save invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered lists
  const filteredInvoices = invoices.filter((inv) => {
    const query = searchQuery.toLowerCase();
    const invNo = (inv.invoiceNo || '').toLowerCase();
    const client = (inv.billTo?.clientName || inv.client || '').toLowerCase();
    const company = (inv.billTo?.companyName || inv.company || '').toLowerCase();
    return invNo.includes(query) || client.includes(query) || company.includes(query);
  });

  const filteredPurchases = studentPurchases.filter((stu) => {
    const query = searchQuery.toLowerCase();
    const invNo = (stu.invoiceNo || '').toLowerCase();
    const name = (stu.studentName || '').toLowerCase();
    const email = (stu.email || '').toLowerCase();
    const product = (stu.productName || '').toLowerCase();
    return invNo.includes(query) || name.includes(query) || email.includes(query) || product.includes(query);
  });

  return (
    <div className="max-w-[1600px] mx-auto p-2 sm:p-4">
      {viewMode === 'list' ? (
        <>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md">
                <FileText size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice Management</h1>
                <p className="text-xs text-slate-500 font-medium">Manage Created Company Invoices & Student Online Purchases</p>
              </div>
            </div>

            {activeCategory === 'admin' && (
              <button
                onClick={handleOpenCreateForm}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <Plus size={16} /> Create New Invoice
              </button>
            )}
          </div>

          {/* 2 Category Switcher Tabs */}
          <div className="flex items-center gap-3 mb-6 bg-slate-100/70 p-1.5 rounded-2xl w-fit border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveCategory('admin')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'admin'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileText size={16} />
              <span>Created Invoices (Admin)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeCategory === 'admin' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {invoices.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('student')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'student'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShoppingBag size={16} />
              <span>Student Online Payments</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeCategory === 'student' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {studentPurchases.length}
              </span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-medium text-slate-700"
                  placeholder={activeCategory === 'admin' ? "Search by Invoice No, Client, or Company" : "Search by Student Name, Email, or Course"}
                />
              </div>
              {isAdmin && activeCategory === 'admin' && selectedInvoiceNos.length > 0 && (
                <button
                  onClick={handleBulkDeleteInvoices}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <Trash2 size={14} />
                  Delete Selected ({selectedInvoiceNos.length})
                </button>
              )}
              {isAdmin && activeCategory === 'student' && selectedPurchaseIds.length > 0 && (
                <button
                  onClick={handleBulkDeletePurchases}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <Trash2 size={14} />
                  Delete Selected ({selectedPurchaseIds.length})
                </button>
              )}
            </div>

            {/* CATEGORY 1: ADMIN CREATED INVOICES TABLE */}
            {activeCategory === 'admin' && (
              <div className="overflow-x-auto p-4">
                {isLoading ? (
                  <div className="flex justify-center py-12 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No saved invoices found. Click "Create New Invoice" to create your first invoice.
                  </div>
                ) : (
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                        <th className="px-4 pb-2 w-10 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                            checked={filteredInvoices.length > 0 && selectedInvoiceNos.length === filteredInvoices.length}
                            onChange={handleSelectAllInvoices}
                            title="Select All Invoices"
                          />
                        </th>
                        <th className="px-6 pb-2">Invoice No</th>
                        <th className="px-6 pb-2">Client</th>
                        <th className="px-6 pb-2">Company</th>
                        <th className="px-6 pb-2">Date</th>
                        <th className="px-6 pb-2">Total</th>
                        <th className="px-6 pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv) => {
                        const invId = inv.invoiceNo || inv.id;
                        const clientName = inv.billTo?.clientName || inv.client || 'N/A';
                        const companyName = inv.billTo?.companyName || inv.company || 'N/A';
                        const formattedDate = inv.invoiceDate
                          ? new Date(inv.invoiceDate).toLocaleDateString('en-US')
                          : inv.date || 'N/A';
                        const totalFormatted = typeof inv.total === 'number'
                          ? `₹${inv.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                          : inv.total;

                        return (
                          <tr key={invId} className="bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                            <td className="px-4 py-4 rounded-l-xl text-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                                checked={selectedInvoiceNos.includes(invId)}
                                onChange={() => handleSelectInvoice(invId)}
                              />
                            </td>
                            <td className="px-6 py-4 font-semibold text-xs text-slate-700">
                              {invId}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                              {clientName}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                              {companyName}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                              {formattedDate}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-800 font-bold">
                              {totalFormatted}
                            </td>
                            <td className="px-6 py-4 text-right rounded-r-xl">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditForm(inv)}
                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Edit Invoice"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteInvoice(inv.invoiceNo)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  title="Delete Invoice"
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
                )}
              </div>
            )}

            {/* CATEGORY 2: STUDENT ONLINE PURCHASES TABLE */}
            {activeCategory === 'student' && (
              <div className="overflow-x-auto p-4">
                {isFetchingPurchases ? (
                  <div className="flex justify-center py-12 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                  </div>
                ) : filteredPurchases.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No student online purchases found yet.
                  </div>
                ) : (
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                        <th className="px-4 pb-2 w-10 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                            checked={filteredPurchases.length > 0 && selectedPurchaseIds.length === filteredPurchases.length}
                            onChange={handleSelectAllPurchases}
                            title="Select All Student Purchases"
                          />
                        </th>
                        <th className="px-6 pb-2">Receipt No</th>
                        <th className="px-6 pb-2">Student Name</th>
                        <th className="px-6 pb-2">Product / Test</th>
                        <th className="px-6 pb-2">Date</th>
                        <th className="px-6 pb-2">Amount</th>
                        <th className="px-6 pb-2">Status</th>
                        <th className="px-6 pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map((stu) => {
                        const stuId = stu.id || stu.invoiceNo;
                        const formattedDate = stu.createdAt
                          ? new Date(stu.createdAt).toLocaleDateString('en-US')
                          : 'N/A';
                        const totalFormatted = typeof stu.amount === 'number'
                          ? `₹${stu.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                          : stu.amount;

                        const isCompleted = stu.status?.toUpperCase() === 'COMPLETED' || stu.status?.toUpperCase() === 'SUCCESS';
                        const isPending = stu.status?.toUpperCase() === 'PENDING';

                        return (
                          <tr key={stu.id || stu.invoiceNo} className="bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                            <td className="px-4 py-4 rounded-l-xl text-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                                checked={selectedPurchaseIds.includes(stuId)}
                                onChange={() => handleSelectPurchase(stuId)}
                              />
                            </td>
                            <td className="px-6 py-4 font-semibold text-xs text-brand-600">
                              {stu.invoiceNo}
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-800">
                              <div>{stu.studentName}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{stu.email}</div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-700 font-bold">
                              <span className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded-md text-[10px] uppercase font-mono mr-1">
                                {stu.productType}
                              </span>
                              {stu.productName}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                              {formattedDate}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-900 font-black">
                              {totalFormatted}
                            </td>
                            <td className="px-6 py-4 text-xs">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                                isCompleted 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                  : isPending 
                                  ? 'bg-amber-50 text-amber-600 border-amber-200' 
                                  : 'bg-rose-50 text-rose-600 border-rose-200'
                              }`}>
                                {stu.status || 'COMPLETED'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right rounded-r-xl">
                              <button
                                onClick={() => setSelectedPurchase(stu)}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 ml-auto shadow-xs"
                              >
                                <Eye size={14} /> Receipt
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            <div className="p-6 text-center border-t border-slate-50 text-slate-400 text-xs italic">
              {activeCategory === 'admin' ? 'List of all admin created invoices' : 'List of all student online purchases'}
            </div>
          </div>
        </>
      ) : (
        /* Create / Edit Form View for Admin Invoices */
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all"
            >
              <ArrowLeft size={16} /> Back to Invoices
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all"
              >
                <Printer size={14} /> Print / Save PDF
              </button>

              <button
                onClick={handleSaveInvoice}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Invoice
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div ref={invoicePrintRef} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-800 space-y-6">
            {/* Top Branding & Invoice No */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-1 text-xs text-slate-600">
                <img
                  src="/image/logo/fetc-logo.png"
                  alt="FETC Logo"
                  className="w-28 h-auto object-contain mb-2"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Issuing Company Name
                  </label>
                  <select
                    value={formData.issuerCompany}
                    onChange={(e) => handleInputChange('issuerCompany', e.target.value)}
                    className="font-extrabold text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-sm w-full sm:w-auto"
                    title="Select Issuing Company Name"
                  >
                    {COMPANY_OPTIONS.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="font-medium">Bhumika Dilkhush</p>
                <p>238-239, Roongta Signature, VIP Road, Vesu, Surat - 395007</p>
                <p>Phone: +91-9033347204 | Email: accounts@fetc.in</p>
                <p className="font-mono text-slate-500">GSTIN: 24AAKCG7584N1ZU</p>
              </div>

              <div className="sm:text-right space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">INVOICE</h2>
                <div className="space-y-1 text-xs">
                  <div className="flex sm:justify-end items-center gap-2">
                    <span className="font-bold text-slate-600">Invoice No:</span>
                    <input
                      type="text"
                      value={formData.invoiceNo}
                      onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                      className="font-mono font-bold text-slate-900 border border-slate-200 rounded px-2 py-0.5 w-32 sm:text-right text-xs"
                    />
                  </div>
                  {errors.invoiceNo && <p className="text-red-500 text-[10px] sm:text-right">{errors.invoiceNo}</p>}

                  <div className="flex sm:justify-end items-center gap-2">
                    <span className="font-bold text-slate-600">Date:</span>
                    <input
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                      className="border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Bill To</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <input
                    type="text"
                    placeholder="Client Name *"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-slate-400"
                  />
                  {errors.clientName && <p className="text-red-500 text-[10px] mt-0.5">{errors.clientName}</p>}
                </div>

                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-slate-400"
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-slate-400"
                />

                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-slate-400"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-slate-400"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                <span className="col-span-5">Description</span>
                <span className="col-span-2 text-center">Duration</span>
                <span className="col-span-2 text-center">Qty x Rate</span>
                <span className="col-span-2 text-right">Amount</span>
                <span className="col-span-1 text-center"></span>
              </div>

              {formData.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs py-1">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Item / Service Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Duration"
                      value={item.duration}
                      onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center"
                    />
                  </div>

                  <div className="col-span-2 flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-12 px-1.5 py-1.5 border border-slate-200 rounded-lg text-xs text-center"
                    />
                    <span className="text-slate-300">×</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                      className="w-full px-1.5 py-1.5 border border-slate-200 rounded-lg text-xs text-right"
                    />
                  </div>

                  <div className="col-span-2 text-right font-bold text-slate-900">
                    ₹{(Number(item.amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>

                  <div className="col-span-1 text-center">
                    {formData.items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="Remove item"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 mt-2 py-1 px-2 rounded-lg hover:bg-slate-50 transition-all"
              >
                <PlusCircle size={14} /> Add Line Item
              </button>
            </div>

            {/* Calculations & Bank Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Payment Method:</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl font-medium text-xs bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Netbanking">Netbanking</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {(formData.paymentMethod === 'UPI' || formData.paymentMethod === 'Other') && (
                  <input
                    type="text"
                    placeholder="Reference Number / UPI Transaction ID"
                    value={formData.upiRef}
                    onChange={(e) => handleInputChange('upiRef', e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                  />
                )}

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-slate-600">
                  <p className="font-bold text-slate-800">Bank Details:</p>
                  <p>Bank: ICICI Bank</p>
                  <p>A/C No.: 138605501228</p>
                  <p>Name: Gina Abroad Pvt. Ltd.</p>
                  <p>IFSC: ICIC0001386</p>
                </div>
              </div>

              <div className="space-y-2 sm:text-right self-end">
                <div className="flex justify-between sm:justify-end gap-6 text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex items-center sm:justify-end gap-2 text-slate-500">
                  <input
                    type="checkbox"
                    id="applySgst"
                    checked={formData.applySgst}
                    onChange={(e) => handleInputChange('applySgst', e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <label htmlFor="applySgst">Apply SGST (9%)</label>
                  {formData.applySgst && (
                    <span className="font-bold text-slate-700 ml-2">₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  )}
                </div>

                <div className="flex items-center sm:justify-end gap-2 text-slate-500">
                  <input
                    type="checkbox"
                    id="applyCgst"
                    checked={formData.applyCgst}
                    onChange={(e) => handleInputChange('applyCgst', e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <label htmlFor="applyCgst">Apply CGST (9%)</label>
                  {formData.applyCgst && (
                    <span className="font-bold text-slate-700 ml-2">₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between sm:justify-end gap-6 text-base font-black text-slate-900">
                  <span>Total Amount:</span>
                  <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Signature & Stamp Footer */}
            <div className="pt-8 border-t border-slate-100 flex justify-between items-end text-xs">
              <div className="space-y-1">
                <p className="font-bold text-slate-800">For, {formData.issuerCompany || 'Foreign English Tests Capital'}</p>
                <p className="text-slate-500">Powered by {formData.issuerCompany || 'Gina Abroad Pvt. Ltd'}</p>
              </div>

              <div className="text-right space-y-8">
                <p className="font-bold text-slate-800">Receiver's Signature</p>
                <div className="border-t border-slate-300 w-40 inline-block"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PURCHASE RECEIPT MODAL */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 shadow-2xl relative border border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedPurchase(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Student Purchase Receipt</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedPurchase.invoiceNo}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Student Name:</span>
                  <span className="font-bold text-slate-900">{selectedPurchase.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Email Address:</span>
                  <span className="font-semibold text-slate-700">{selectedPurchase.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Phone Number:</span>
                  <span className="font-semibold text-slate-700">{selectedPurchase.phone}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Product / Course:</span>
                  <span className="font-bold text-brand-600">{selectedPurchase.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Transaction ID:</span>
                  <span className="font-mono text-slate-600">{selectedPurchase.transactionId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Purchase Date:</span>
                  <span className="font-semibold text-slate-700">
                    {selectedPurchase.createdAt ? new Date(selectedPurchase.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-bold">Total Amount Paid:</span>
                  <span className="text-lg font-black text-slate-900">
                    ₹{(selectedPurchase.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPurchase(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-brand-600 transition-all shadow-md flex items-center gap-2"
              >
                <Printer size={14} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoice;
