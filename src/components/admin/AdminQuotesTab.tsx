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

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const s = searchQuery.toLowerCase();
      const matchesSearch =
        q.id.toLowerCase().includes(s) ||
        q.companyName.toLowerCase().includes(s) ||
        q.name.toLowerCase().includes(s) ||
        q.email.toLowerCase().includes(s) ||
        (q.city && q.city.toLowerCase().includes(s));

      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Quotation Requests (RFQs)</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredQuotes.length} of {quotes.length} RFQs
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
              Phase 1 View-Only
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Persistently saved Bills of Materials submitted by enterprise clients. Inspect line items, requested quantities, and delivery schedules.
          </p>
        </div>

        <button
          onClick={fetchQuotes}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh RFQs</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
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
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          >
            <option value="all">All Request Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3.5 px-4 w-28">Status</th>
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
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    <span>Loading quotation requests...</span>
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <span>No quotation requests found.</span>
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-orange-50/30 transition group cursor-pointer"
                    onClick={() => setSelectedQuote(q)}
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          q.status === 'Pending'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : q.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {q.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                      {q.id}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {q.companyName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{q.name}</div>
                      <div className="text-[11px] text-slate-500">{q.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 block">{q.city}</span>
                      <span className="text-[10px] text-slate-400">{q.projectTimeline}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                        {q.items?.length || 0} products
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(q.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuote(q);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-blue-600" />
                        <span>Inspect BOQ</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW-ONLY INSPECTION MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Quotation Request {selectedQuote.id}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    View-Only Mode
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
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex justify-end">
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
