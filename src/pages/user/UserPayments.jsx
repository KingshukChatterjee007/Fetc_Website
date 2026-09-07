import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, CreditCard, ShieldCheck, Calendar, Hash, IndianRupee } from 'lucide-react';
import { getApiUrl } from '../../apiConfig';

const UserPayments = () => {
  const { user } = useOutletContext();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const emailParam = user?.email ? `email=${encodeURIComponent(user.email)}` : '';
      const phoneParam = user?.phone ? `phone=${encodeURIComponent(user.phone)}` : '';
      const queryStr = [emailParam, phoneParam].filter(Boolean).join('&');

      const targetUrl = getApiUrl(`/api/v1/order/user-orders${queryStr ? '?' + queryStr : ''}`);
      const response = await fetch(targetUrl, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();

      if (data.success) {
        setTransactions(data.orders || data.transactions || []);
      }
    } catch (err) {
      console.error('Error fetching payment transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'SUCCESS' || s === 'PAID' || s === 'COMPLETED') {
      return (
        <span className="bg-emerald-500/10 text-emerald-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-emerald-200">
          SUCCESS
        </span>
      );
    }
    if (s === 'PENDING' || s === 'INITIATED') {
      return (
        <span className="bg-amber-500/10 text-amber-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-amber-200">
          PENDING
        </span>
      );
    }
    return (
      <span className="bg-rose-500/10 text-rose-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-rose-200">
        FAILED
      </span>
    );
  };

  const getTitle = (tx) => {
    if (tx.courseName) return tx.courseName;
    if (tx.productName) return tx.productName;
    if (tx.courseId === 'CAREER_ASSESSMENT') return 'Career Assessment Payment';
    if (tx.courseId) return tx.courseId.replace(/_/g, ' ');
    if (tx.productType) return tx.productType.replace(/_/g, ' ');
    return 'Transaction #' + (tx.id || '');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Online Payments</h1>
        <p className="text-sm text-slate-500 mt-1">View payment receipts, transaction history, and status updates.</p>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <CreditCard size={24} />
          </div>
          <h3 className="text-slate-800 font-semibold mb-1">No payment transactions</h3>
          <p className="text-slate-500 text-sm">You have no online payment transactions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {transactions.map((tx) => {
            const txId = tx.id || tx._id || tx.transactionId;
            const status = (tx.status || 'PENDING').toUpperCase();
            const title = getTitle(tx);
            const formattedDate = tx.createdAt
              ? new Date(tx.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'N/A';

            const formattedAssessmentDate = tx.assessmentDate
              ? (() => {
                  try {
                    const d = new Date(tx.assessmentDate);
                    return isNaN(d.getTime())
                      ? tx.assessmentDate
                      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  } catch (e) {
                    return tx.assessmentDate;
                  }
                })()
              : null;

            return (
              <div
                key={txId}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header: Title & Status */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {tx.method || 'Online (PhonePe Gateway)'}
                      </p>
                    </div>
                  </div>
                  <div>{getStatusBadge(status)}</div>
                </div>

                {/* Grid Info: Always Visible */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
                      <IndianRupee size={13} />
                      <span>Payment Amount</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{Number(tx.amount || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
                      <Calendar size={13} />
                      <span>Payment Date</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-800">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Scheduled Assessment Date */}
                  {formattedAssessmentDate && (
                    <div className="col-span-2 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100/90 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                        <Calendar size={13} className="text-blue-600" />
                        <span>Assessment Date</span>
                      </div>
                      <span className="text-xs font-extrabold text-blue-900 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200/60 shadow-2xs">
                        {formattedAssessmentDate}
                      </span>
                    </div>
                  )}

                  <div className="col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
                      <Hash size={13} />
                      <span>Payment / Transaction ID</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-800 break-all select-all">
                      {tx.transactionId || tx.merchant_transaction_id || `TX-${tx.id}`}
                    </span>
                  </div>
                </div>

                {/* Footer badge */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-medium border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <ShieldCheck size={14} />
                    <span>Verified Payment</span>
                  </div>
                  <span>{tx.courseId || 'CAREER_ASSESSMENT'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPayments;
