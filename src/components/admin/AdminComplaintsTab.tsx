import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MessageSquareWarning,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Calendar,
  Save,
  Loader2,
  X,
  FileText,
  Trash2,
} from 'lucide-react';
import { ComplaintRecord } from '../../server/db/database';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminComplaintsTab() {
  const { authHeaders } = useAdminAuth();
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Detail Modal / Drawer
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Deletion modal state
  const [complaintToDelete, setComplaintToDelete] = useState<ComplaintRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/complaints', { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch customer complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openComplaintModal = (comp: ComplaintRecord) => {
    setSelectedComplaint(comp);
    setEditingNotes(comp.notes || '');
    setUpdatingStatus(comp.status);
    setActionSuccess(null);
  };

  const handleUpdateComplaint = async (newStatus?: 'New' | 'In Progress' | 'Resolved') => {
    if (!selectedComplaint) return;
    try {
      setIsSaving(true);
      const targetStatus = newStatus || updatingStatus || selectedComplaint.status;

      const res = await fetch(
        `/api/admin/complaints/${encodeURIComponent(selectedComplaint.id)}`,
        {
          method: 'PUT',
          headers: { ...authHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: targetStatus,
            notes: editingNotes.trim(),
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success && data.complaint) {
        setSelectedComplaint(data.complaint);
        setUpdatingStatus(data.complaint.status);
        // Update local list
        setComplaints((prev) =>
          prev.map((c) => (c.id === data.complaint.id ? data.complaint : c))
        );
        setActionSuccess('Complaint updated successfully.');
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        alert(data.error || 'Failed to update complaint.');
      }
    } catch (err: any) {
      alert(err?.message || 'Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComplaint = async () => {
    if (!complaintToDelete) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const res = await fetch(`/api/admin/complaints/${encodeURIComponent(complaintToDelete.id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComplaints((prev) => prev.filter((c) => c.id !== complaintToDelete.id));
        if (selectedComplaint?.id === complaintToDelete.id) {
          setSelectedComplaint(null);
        }
        setComplaintToDelete(null);
        setActionSuccess(`Complaint #${complaintToDelete.id} deleted successfully.`);
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setDeleteError(data.error || 'Failed to delete complaint.');
      }
    } catch (err: any) {
      setDeleteError(err?.message || 'Error deleting complaint.');
    } finally {
      setIsDeleting(false);
    }
  };


  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.companyName && c.companyName.toLowerCase().includes(q)) ||
        c.message.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Customer Inquiries & Complaints</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredComplaints.length} of {complaints.length} Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Persistently stored submissions from the Contact Us enquiry form. Manage resolution workflows and internal notes.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Tickets</span>
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
            placeholder="Search by ID, customer name, email, company, or message..."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'New', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition capitalize cursor-pointer ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'All Tickets' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3.5 px-4 w-28">Status</th>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Message Snippet</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    <span>Loading customer complaints...</span>
                  </td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <MessageSquareWarning className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <span>No customer inquiries or complaints found.</span>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-orange-50/30 transition group cursor-pointer"
                    onClick={() => openComplaintModal(c)}
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          c.status === 'New'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : c.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {c.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.email}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {c.companyName || <span className="text-slate-400">Not specified</span>}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="truncate text-slate-600 text-[11px]" title={c.message}>
                        {c.message}
                      </p>
                      {c.notes && (
                        <span className="text-[10px] text-orange-600 font-medium block mt-0.5 truncate">
                          Note: {c.notes}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => openComplaintModal(c)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer"
                        >
                          View & Update
                        </button>
                        <button
                          type="button"
                          onClick={() => setComplaintToDelete(c)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete complaint ticket"
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

      {/* DETAIL & STATUS UPDATE MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Complaint Ticket #{selectedComplaint.id}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      selectedComplaint.status === 'New'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : selectedComplaint.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {selectedComplaint.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted on {new Date(selectedComplaint.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Customer Info Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Customer Full Name</span>
                  <span className="font-semibold text-slate-900">{selectedComplaint.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Email Address</span>
                  <a
                    href={`mailto:${selectedComplaint.email}`}
                    className="font-medium text-blue-600 hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedComplaint.email}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Contact Phone</span>
                  {selectedComplaint.contact ? (
                    <a
                      href={`tel:${selectedComplaint.contact}`}
                      className="text-slate-800 hover:text-orange-600 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedComplaint.contact}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400">Not provided</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Organization / Company</span>
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedComplaint.companyName || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Full Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-500" />
                  <span>Customer Message</span>
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
                  {selectedComplaint.message}
                </div>
              </div>

              {/* Update Status Workflow */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Update Resolution Status
                </label>
                <div className="flex gap-2">
                  {(['New', 'In Progress', 'Resolved'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateComplaint(st)}
                      disabled={isSaving}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                        selectedComplaint.status === st
                          ? st === 'Resolved'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : st === 'In Progress'
                            ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white border-transparent shadow-xs'
                            : 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record investigation notes, technician assigned, resolution steps, or contact history..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateComplaint()}
                  disabled={isSaving}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-medium rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/15 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Internal Note</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setComplaintToDelete(selectedComplaint)}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Ticket</span>
              </button>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition cursor-pointer"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {complaintToDelete && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Confirm Ticket Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete this customer ticket?
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <strong className="text-slate-800">{complaintToDelete.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Company:</span>
                <span className="text-slate-700">{complaintToDelete.companyName || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ticket ID:</span>
                <span className="font-mono text-slate-600">{complaintToDelete.id}</span>
              </div>
              <div className="text-[11px] text-rose-600 pt-1 border-t border-slate-200">
                This ticket will be permanently removed from Hostinger MySQL and recorded in the audit trail.
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
                onClick={() => setComplaintToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteComplaint}
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
