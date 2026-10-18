import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Inbox,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MessageSquareWarning,
  MessageSquare,
  FileText,
  Copy,
  Save,
  Loader2,
  Sparkles,
  ArrowUpRight,
  Trash2,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export type InquiryType = 'Contact Enquiry' | 'Job Application' | 'Complaint';
export type InquiryStatus = 'New' | 'In Progress' | 'Resolved';

export interface UnifiedInquiry {
  id: string;
  source: 'complaints' | 'careers';
  type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  subjectOrPosition: string;
  message: string;
  status: InquiryStatus;
  originalStatus: string;
  notes?: string;
  submittedAt: string;
  updatedAt: string;
  // Specific to career applications
  experience?: string;
  noticePeriod?: string;
  portfolioUrl?: string;
  resumeFilename?: string;
}

interface InquiriesResponse {
  success: boolean;
  inquiries: UnifiedInquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: {
    all: number;
    new: number;
    inProgress: number;
    resolved: number;
    contact: number;
    careers: number;
    complaints: number;
  };
  error?: string;
}

export function AdminInquiryInboxTab() {
  const { authHeaders } = useAdminAuth();

  // Data state
  const [inquiries, setInquiries] = useState<UnifiedInquiry[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    new: 0,
    inProgress: 0,
    resolved: 0,
    contact: 0,
    careers: 0,
    complaints: 0,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<UnifiedInquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Direct Email Reply Modal State
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [markStatusAfterReply, setMarkStatusAfterReply] = useState<'In Progress' | 'Resolved'>('In Progress');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccessMessage, setReplySuccessMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<UnifiedInquiry | null>(null);
  const [isDeletingInquiry, setIsDeletingInquiry] = useState(false);
  const [deleteInquiryError, setDeleteInquiryError] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Inquiries from Backend
  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pageSize),
        q: debouncedSearch,
        type: selectedType,
        status: selectedStatus,
        dateRange: selectedDateRange,
      });

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load customer inquiries.`);
      }

      const data: InquiriesResponse = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.counts) {
          setCounts(data.counts);
        }
      } else {
        throw new Error(data.error || 'Server reported failure loading inquiries.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error fetching inquiries.');
    } finally {
      setLoading(false);
    }
  }, [authHeaders, currentPage, pageSize, debouncedSearch, selectedType, selectedStatus, selectedDateRange]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Handle Opening Detail View
  const handleOpenDetail = (inquiry: UnifiedInquiry) => {
    setSelectedInquiry(inquiry);
    setEditingNotes(inquiry.notes || '');
    setActionSuccess(null);
    setReplySuccessMessage(null);
  };

  // Handle Quick Status Update
  const handleUpdateStatus = async (newStatus: InquiryStatus) => {
    if (!selectedInquiry) return;
    try {
      setIsSavingNotes(true);
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(selectedInquiry.id)}`, {
        method: 'PATCH',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: editingNotes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus, notes: editingNotes.trim() } : null));
        setInquiries((prev) =>
          prev.map((item) => (item.id === selectedInquiry.id ? { ...item, status: newStatus, notes: editingNotes.trim() } : item))
        );
        setActionSuccess(`Status updated to "${newStatus}" successfully.`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchInquiries(); // refresh aggregate counts
      } else {
        alert(data.error || 'Failed to update status.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error updating status.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle Saving Internal Administrative Notes
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    try {
      setIsSavingNotes(true);
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(selectedInquiry.id)}`, {
        method: 'PATCH',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: editingNotes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedInquiry((prev) => (prev ? { ...prev, notes: editingNotes.trim() } : null));
        setInquiries((prev) =>
          prev.map((item) => (item.id === selectedInquiry.id ? { ...item, notes: editingNotes.trim() } : item))
        );
        setActionSuccess('Administrative internal note saved.');
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        alert(data.error || 'Failed to save notes.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving notes.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle Deleting an Inquiry
  const handleDeleteInquiry = async () => {
    if (!inquiryToDelete) return;
    try {
      setIsDeletingInquiry(true);
      setDeleteInquiryError(null);
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(inquiryToDelete.id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== inquiryToDelete.id));
        if (selectedInquiry?.id === inquiryToDelete.id) {
          setSelectedInquiry(null);
        }
        setInquiryToDelete(null);
        setActionSuccess(`Inquiry #${inquiryToDelete.id} permanently deleted.`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchInquiries();
      } else {
        setDeleteInquiryError(data.error || 'Failed to delete inquiry.');
      }
    } catch (err: any) {
      setDeleteInquiryError(err?.message || 'Error deleting inquiry.');
    } finally {
      setIsDeletingInquiry(false);
    }
  };


  // Open Direct Email Reply Modal
  const handleOpenReplyModal = (inquiry: UnifiedInquiry) => {
    setSelectedInquiry(inquiry);
    setReplySubject(`Re: [${inquiry.id}] ${inquiry.subjectOrPosition} - DEYSLA IT Solutions`);
    setReplyMessage(
      `Dear ${inquiry.name},\n\nThank you for reaching out to DEYSLA IT Solutions regarding your ${inquiry.type.toLowerCase()}.\n\n`
    );
    setMarkStatusAfterReply('In Progress');
    setIsReplyModalOpen(true);
  };

  // Submit Direct Reply to Customer via Backend SMTP
  const handleSendDirectReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    if (!replySubject.trim() || !replyMessage.trim()) {
      alert('Please provide both subject and reply message.');
      return;
    }

    try {
      setIsSendingReply(true);
      const res = await fetch('/api/admin/inquiries/reply', {
        method: 'POST',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiryId: selectedInquiry.id,
          recipientEmail: selectedInquiry.email,
          subject: replySubject.trim(),
          message: replyMessage.trim(),
          markStatus: markStatusAfterReply,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReplySuccessMessage(data.message || 'Reply dispatched successfully.');
        setIsReplyModalOpen(false);
        setActionSuccess(`Reply sent to ${selectedInquiry.email} via authenticated SMTP.`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchInquiries();
      } else {
        alert(data.error || 'Failed to dispatch email reply.');
      }
    } catch (err: any) {
      alert(err?.message || 'Network error sending reply.');
    } finally {
      setIsSendingReply(false);
    }
  };

  // Copy Email to Clipboard
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Helper Badge Color
  const getTypeBadgeClass = (type: InquiryType) => {
    switch (type) {
      case 'Contact Enquiry':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Job Application':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Complaint':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeClass = (status: InquiryStatus) => {
    switch (status) {
      case 'New':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      {/* Top Banner / Identity Assurance */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-orange-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Customer Inquiry & Application Inbox
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized registry of verified customers, prospective engineering candidates, and support tickets with direct reply capabilities.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchInquiries()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Inbox</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total Inquiries', count: counts.all, typeVal: 'all', statusVal: 'all', color: 'from-slate-700 to-slate-900' },
          { label: 'New / Unread', count: counts.new, typeVal: 'all', statusVal: 'New', color: 'from-orange-500 to-amber-600' },
          { label: 'In Progress', count: counts.inProgress, typeVal: 'all', statusVal: 'In Progress', color: 'from-blue-600 to-indigo-600' },
          { label: 'Resolved', count: counts.resolved, typeVal: 'all', statusVal: 'Resolved', color: 'from-emerald-500 to-teal-600' },
          { label: 'Contact Enquiries', count: counts.contact, typeVal: 'Contact Enquiry', statusVal: 'all', color: 'from-sky-500 to-blue-600' },
          { label: 'Job Applications', count: counts.careers, typeVal: 'Job Application', statusVal: 'all', color: 'from-indigo-500 to-purple-600' },
          { label: 'Complaints', count: counts.complaints, typeVal: 'Complaint', statusVal: 'all', color: 'from-rose-500 to-pink-600' },
        ].map((card, idx) => {
          const isSelected = selectedType === card.typeVal && selectedStatus === card.statusVal;
          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedType(card.typeVal);
                setSelectedStatus(card.statusVal);
                setCurrentPage(1);
              }}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-orange-500 shadow-md ring-2 ring-orange-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                {card.label}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-extrabold text-slate-900">{card.count}</span>
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.color}`} />
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Field */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, phone, company, position, or ID..."
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Inquiry Types</option>
              <option value="Contact Enquiry">Contact Enquiries</option>
              <option value="Job Application">Job Applications</option>
              <option value="Complaint">Customer Complaints</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDateRange}
              onChange={(e) => {
                setSelectedDateRange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Reset and Summary */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{inquiries.length}</strong> of{' '}
            <strong className="text-slate-900">{totalItems}</strong> matching records
          </div>
          {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all' || selectedDateRange !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedStatus('all');
                setSelectedDateRange('all');
                setCurrentPage(1);
              }}
              className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer underline flex items-center gap-1"
            >
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-28">Status</th>
                <th className="py-3.5 px-4 w-36">Inquiry Type</th>
                <th className="py-3.5 px-4">Customer / Candidate</th>
                <th className="py-3.5 px-4">Subject / Applied Position</th>
                <th className="py-3.5 px-4 max-w-xs">Message / Cover Note</th>
                <th className="py-3.5 px-4 w-36">Submitted Date</th>
                <th className="py-3.5 px-4 text-right w-36">Direct Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    <span>Loading inquiries from database...</span>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-slate-700">No matching inquiries found</p>
                    <p className="text-[11px] mt-1">Try adjusting your search criteria or filter options above.</p>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="hover:bg-slate-50/70 transition group cursor-pointer"
                    onClick={() => handleOpenDetail(inquiry)}
                  >
                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeClass(
                          inquiry.status
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {inquiry.status}
                      </span>
                    </td>

                    {/* Inquiry Type */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeBadgeClass(
                          inquiry.type
                        )}`}
                      >
                        {inquiry.type === 'Job Application' ? (
                          <GraduationCap className="w-3 h-3 shrink-0" />
                        ) : inquiry.type === 'Complaint' ? (
                          <MessageSquareWarning className="w-3 h-3 shrink-0" />
                        ) : (
                          <MessageSquare className="w-3 h-3 shrink-0" />
                        )}
                        <span>{inquiry.type}</span>
                      </span>
                    </td>

                    {/* Customer Identity */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {inquiry.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{inquiry.email}</span>
                      </div>
                      {inquiry.phone && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{inquiry.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Subject / Position */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {inquiry.subjectOrPosition}
                      </div>
                      {inquiry.companyName && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{inquiry.companyName}</span>
                        </div>
                      )}
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">#{inquiry.id}</div>
                    </td>

                    {/* Message Snippet */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 text-[11px] line-clamp-2" title={inquiry.message}>
                        {inquiry.message}
                      </p>
                      {inquiry.notes && (
                        <span className="text-[10px] text-orange-600 font-medium block mt-1 line-clamp-1">
                          Note: {inquiry.notes}
                        </span>
                      )}
                    </td>

                    {/* Submission Date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      <div>{new Date(inquiry.submittedAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(inquiry.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenReplyModal(inquiry)}
                          title="Reply to Customer"
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(inquiry)}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setInquiryToDelete(inquiry)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-slate-400">|</span>
            <span>
              Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
              <strong className="text-slate-900">{totalPages}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || loading}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DETAIL MODAL / DRAWER */}
      {/* ========================================================================= */}
      {selectedInquiry && !isReplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getTypeBadgeClass(
                    selectedInquiry.type
                  )}`}
                >
                  {selectedInquiry.type}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>{selectedInquiry.name}</span>
                    <span className="font-mono text-xs text-slate-400 font-normal">#{selectedInquiry.id}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Received on {new Date(selectedInquiry.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Customer Verified Identity Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Verified Customer / Candidate Contact Information
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Real Identity Verified</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Full Name</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedInquiry.name}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Corporate Email</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{selectedInquiry.email}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(selectedInquiry.email)}
                        title="Copy Email Address"
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {copiedEmail && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone / WhatsApp</span>
                    {selectedInquiry.phone ? (
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="font-medium text-slate-800 hover:text-orange-600 flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedInquiry.phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Company or Organization</span>
                    <div className="flex items-center gap-1 text-slate-800 font-medium mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedInquiry.companyName || 'Individual Client'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Specific Details (If Job Application) */}
              {selectedInquiry.type === 'Job Application' && (
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                    Job Application Metadata
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Applied Position:</span>
                      <strong className="text-indigo-900">{selectedInquiry.subjectOrPosition.replace('Application: ', '')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Experience:</span>
                      <span>{selectedInquiry.experience || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Notice Period:</span>
                      <span>{selectedInquiry.noticePeriod || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Resume / Attachment:</span>
                      {selectedInquiry.resumeFilename ? (
                        <span className="font-semibold text-slate-900">📎 {selectedInquiry.resumeFilename}</span>
                      ) : (
                        <span className="text-slate-400 italic">None attached</span>
                      )}
                    </div>
                  </div>
                  {selectedInquiry.portfolioUrl && (
                    <div className="pt-1">
                      <span className="text-slate-500 block text-[11px]">LinkedIn / Portfolio:</span>
                      <a
                        href={selectedInquiry.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{selectedInquiry.portfolioUrl}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Complete Message Content */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-500" />
                  <span>Submitted Message / Inquiry Details</span>
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 leading-relaxed whitespace-pre-wrap select-text">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Update Workflow */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Update Resolution Workflow Status
                </label>
                <div className="flex gap-2">
                  {(['New', 'In Progress', 'Resolved'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(st)}
                      disabled={isSavingNotes}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedInquiry.status === st
                          ? st === 'Resolved'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : st === 'In Progress'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Administrative Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Internal Administrative Notes & Communication Trail
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record investigation notes, technician assigned, reply status, or customer feedback..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/15 cursor-pointer"
                >
                  {isSavingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Internal Note</span>
                </button>
              </div>
            </div>

            {/* Modal Footer / Direct Reply Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* 1. Open in Email App (mailto:) */}
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                    `Re: [${selectedInquiry.id}] ${selectedInquiry.subjectOrPosition} - DEYSLA IT Solutions`
                  )}`}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open in Mail App</span>
                </a>

                {/* 2. Direct Reply via Backend SMTP */}
                <button
                  type="button"
                  onClick={() => setIsReplyModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/15 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Reply via SMTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryToDelete(selectedInquiry)}
                  className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold border border-rose-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Permanently Delete Inquiry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 bg-slate-200/70 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIRECT EMAIL REPLY MODAL */}
      {/* ========================================================================= */}
      {isReplyModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Direct Customer Response</h3>
                  <p className="text-xs text-slate-500">
                    Dispatched from authenticated DEYSLA mailbox (<code className="text-slate-700 font-mono">info@sa.deysla.com</code>)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendDirectReply} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Recipient info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Sending To (Customer):</span>
                  <strong className="text-slate-900">{selectedInquiry.name}</strong>
                  <div className="text-[11px] font-mono text-blue-600">{selectedInquiry.email}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Authenticated Sender:</span>
                  <strong className="text-slate-900">DEYSLA IT Solutions</strong>
                  <div className="text-[11px] font-mono text-slate-600">info@sa.deysla.com</div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Response Message Content
                </label>
                <textarea
                  rows={8}
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Write your professional response to the customer..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 leading-relaxed resize-none"
                />
              </div>

              {/* Status transition choice */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Workflow Status After Reply:</span>
                  <span className="text-slate-500 text-[11px]">Update the ticket status automatically upon sending.</span>
                </div>
                <select
                  value={markStatusAfterReply}
                  onChange={(e) => setMarkStatusAfterReply(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="In Progress">Mark as In Progress</option>
                  <option value="Resolved">Mark as Resolved</option>
                </select>
              </div>

              {/* Footer / Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReplyModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingReply}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-md shadow-orange-500/15 cursor-pointer disabled:opacity-50"
                >
                  {isSendingReply ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Reply via Hostinger SMTP...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Email to Customer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Confirm Record Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete this customer inquiry record?
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <strong className="text-slate-800">{inquiryToDelete.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subject:</span>
                <span className="text-slate-700 truncate max-w-[200px]">{inquiryToDelete.subjectOrPosition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Record ID:</span>
                <span className="font-mono text-slate-600">{inquiryToDelete.id}</span>
              </div>
              <div className="text-[11px] text-rose-600 pt-1 border-t border-slate-200">
                This record will be permanently purged from Hostinger MySQL ({inquiryToDelete.source}) and logged in audit trail.
              </div>
            </div>

            {deleteInquiryError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{deleteInquiryError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
                disabled={isDeletingInquiry}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteInquiry}
                disabled={isDeletingInquiry}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                {isDeletingInquiry ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
