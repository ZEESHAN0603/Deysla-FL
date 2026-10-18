import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  FileSpreadsheet,
  Clock,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  X,
  Package,
  Layers,
  Eye,
  Loader2,
  CheckCircle2,
  Trash2,
  Download,
  Save,
  FileDown,
} from 'lucide-react';
import { QuoteRecord } from '../../server/db/database';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminQuotesTab() {
  const { authHeaders } = useAdminAuth();
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRecord | null>(null);

  // Status & Notes editing in modal
  const [modalStatus, setModalStatus] = useState<string>('Pending');
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Deletion modal state
  const [quoteToDelete, setQuoteToDelete] = useState<QuoteRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/quotes', { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.quotes)) {
        setQuotes(data.quotes);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch quotation requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleUpdateStatusInline = async (quote: QuoteRecord, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/quotes/${encodeURIComponent(quote.id)}`, {
        method: 'PATCH',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.quote) {
        setQuotes((prev) => prev.map((q) => (q.id === quote.id ? data.quote : q)));
        if (selectedQuote?.id === quote.id) {
          setSelectedQuote(data.quote);
        }
        showToast(`RFQ #${quote.id} status updated to "${newStatus}".`);
      } else {
        throw new Error(data.error || 'Failed to update RFQ status.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error updating status.', 'error');
    }
  };

  const handleSaveModalChanges = async () => {
    if (!selectedQuote) return;
    try {
      setIsSavingStatus(true);
      setSaveSuccessNotice(null);
      const res = await fetch(`/api/admin/quotes/${encodeURIComponent(selectedQuote.id)}`, {
        method: 'PATCH',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: modalStatus,
          notes: editingNotes.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.quote) {
        setQuotes((prev) => prev.map((q) => (q.id === selectedQuote.id ? data.quote : q)));
        setSelectedQuote(data.quote);
        setSaveSuccessNotice('RFQ status and notes saved successfully.');
        setTimeout(() => setSaveSuccessNotice(null), 3000);
      } else {
        throw new Error(data.error || 'Failed to update RFQ.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to save changes.', 'error');
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const res = await fetch(`/api/admin/quotes/${encodeURIComponent(quoteToDelete.id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setQuotes((prev) => prev.filter((q) => q.id !== quoteToDelete.id));
        if (selectedQuote?.id === quoteToDelete.id) {
          setSelectedQuote(null);
        }
        showToast(`Quotation Request "${quoteToDelete.id}" deleted successfully.`);
        setQuoteToDelete(null);
      } else {
        throw new Error(data.error || 'Failed to delete quote.');
      }
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete quote.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openInspectionModal = (quote: QuoteRecord) => {
    setSelectedQuote(quote);
    setModalStatus(quote.status || 'Pending');
    setEditingNotes(quote.notes || '');
    setSaveSuccessNotice(null);
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const s = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !s ||
        q.id.toLowerCase().includes(s) ||
        q.companyName.toLowerCase().includes(s) ||
        q.name.toLowerCase().includes(s) ||
        q.email.toLowerCase().includes(s) ||
        (q.city && q.city.toLowerCase().includes(s));

      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchQuery, statusFilter]);

  // Export filtered quotes as CSV
  const handleExportCsv = () => {
    if (filteredQuotes.length === 0) {
      showToast('No quotes to export.', 'error');
      return;
    }

    const headersRow = [
      'RFQ Reference',
      'Company Name',
      'Contact Person',
      'Email',
      'Phone',
      'City',
      'Timeline',
      'Items Count',
      'Status',
      'Customer Notes',
      'Submitted At',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredQuotes.map((q) => [
      escapeCsv(q.id),
      escapeCsv(q.companyName),
      escapeCsv(q.name),
      escapeCsv(q.email),
      escapeCsv(q.phone),
      escapeCsv(q.city),
      escapeCsv(q.projectTimeline),
      q.items?.length || 0,
      escapeCsv(q.status),
      escapeCsv(q.notes || ''),
      escapeCsv(new Date(q.submittedAt).toISOString()),
    ]);

    const csvContent = '\uFEFF' + [headersRow.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DEYSLA-RFQs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredQuotes.length} RFQ record(s) to CSV.`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Quoted':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Declined':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Archived':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-orange-600" />
              Quotation Requests (RFQs)
            </h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredQuotes.length} of {quotes.length} RFQs
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Persistently saved Bills of Materials submitted by enterprise clients. Manage request status, export CSV reports, and inspect requested hardware quantities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={filteredQuotes.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition shadow-2xs cursor-pointer disabled:opacity-50"
            title="Export filtered quotation requests to CSV"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchQuotes}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchQuotes}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by RFQ Reference, company, contact name, or city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="all">All Request Statuses ({quotes.length})</option>
            <option value="Pending">Pending ({quotes.filter((q) => q.status === 'Pending').length})</option>
            <option value="Under Review">Under Review ({quotes.filter((q) => q.status === 'Under Review').length})</option>
            <option value="Quoted">Quoted ({quotes.filter((q) => q.status === 'Quoted').length})</option>
            <option value="Completed">Completed ({quotes.filter((q) => q.status === 'Completed').length})</option>
            <option value="Declined">Declined ({quotes.filter((q) => q.status === 'Declined').length})</option>
            <option value="Archived">Archived ({quotes.filter((q) => q.status === 'Archived').length})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3.5 px-4 w-32">Status</th>
                <th className="py-3.5 px-4">RFQ Reference</th>
                <th className="py-3.5 px-4">Company Name</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">City / Timeline</th>
                <th className="py-3.5 px-4 text-center">Items Count</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-600 mx-auto mb-2" />
                    <span>Loading quotation requests from MySQL...</span>
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No quotation requests match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <select
                        value={q.status || 'Pending'}
                        onChange={(e) => handleUpdateStatusInline(q, e.target.value)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeClass(
                          q.status || 'Pending'
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Completed">Completed</option>
                        <option value="Declined">Declined</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{q.id}</td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{q.companyName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{q.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{q.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      <span className="text-slate-700 block font-medium">{q.city}</span>
                      <span className="text-[10px] text-slate-400">{q.projectTimeline}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                        {q.items?.length || 0} items
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(q.submittedAt).toLocaleDateString('en-GB')}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openInspectionModal(q)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-blue-600" />
                          <span>Inspect</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuoteToDelete(q)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete quotation request"
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
      </div>

      {/* INSPECTION & MANAGEMENT MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Quotation Request {selectedQuote.id}</h3>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadgeClass(selectedQuote.status || 'Pending')}`}>
                    {selectedQuote.status || 'Pending'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted {new Date(selectedQuote.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Customer Profile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Company / Organization</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-orange-500" />
                    <span>{selectedQuote.companyName}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Authorized Contact</span>
                  <span className="font-semibold text-slate-900">{selectedQuote.name}</span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Email Address</span>
                  <a
                    href={`mailto:${selectedQuote.email}`}
                    className="font-medium text-blue-600 hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedQuote.email}</span>
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Phone Number</span>
                  <a
                    href={`tel:${selectedQuote.phone}`}
                    className="text-slate-800 hover:text-orange-600 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedQuote.phone}</span>
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Project Location</span>
                  <span className="text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedQuote.city}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Procurement Timeline</span>
                  <span className="text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedQuote.projectTimeline}</span>
                  </span>
                </div>
              </div>

              {selectedQuote.notes && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                  <span className="text-slate-600 font-semibold block mb-1">Customer Project Notes:</span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedQuote.notes}</p>
                </div>
              )}

              {/* Line Items Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>Requested Hardware BOQ ({selectedQuote.items?.length || 0} line items)</span>
                  </h4>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-600 uppercase tracking-wider">
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-3">Product Title</th>
                        <th className="py-2.5 px-3">Brand / SKU</th>
                        <th className="py-2.5 px-3 text-center w-20">Quantity</th>
                        <th className="py-2.5 px-3">Item Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedQuote.items && selectedQuote.items.length > 0 ? (
                        selectedQuote.items.map((it, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-900">
                              {it.title}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              <div>{it.brand || 'Standard'}</div>
                              {it.sku && <span className="font-mono text-[10px] text-slate-400">{it.sku}</span>}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-orange-600">
                              {it.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                              {it.notes || '—'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400">
                            No individual line items detailed in this quote.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Update & Internal Notes Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 text-xs block">Update Status & Recruiter/Sales Notes:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Status:</label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Completed">Completed</option>
                      <option value="Declined">Declined</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Administrative Notes:</label>
                    <textarea
                      rows={2}
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Add distributor quote reference, sales rep assignment, or pricing notes..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {saveSuccessNotice && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{saveSuccessNotice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setQuoteToDelete(selectedQuote)}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete RFQ</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveModalChanges}
                  disabled={isSavingStatus}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  {isSavingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {quoteToDelete && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Confirm RFQ Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete this quotation request?
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Company:</span>
                <strong className="text-slate-800">{quoteToDelete.companyName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference:</span>
                <span className="font-mono text-slate-700">{quoteToDelete.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact:</span>
                <span className="text-slate-700">{quoteToDelete.name} ({quoteToDelete.email})</span>
              </div>
              <div className="text-[11px] text-rose-600 pt-1 border-t border-slate-200">
                This RFQ and its BOQ item records will be permanently removed from Hostinger MySQL and recorded in the audit trail.
              </div>
            </div>

            {deleteError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuoteToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteQuote}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
