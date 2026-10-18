import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Trash2,
  Download,
  Save,
  Loader2,
  X,
  FileQuestion,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface CareerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  noticePeriod?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  resumeFilename?: string;
  resumePath?: string;
  status: 'New' | 'Reviewing' | 'Interviewed' | 'Offered' | 'Archived';
  notes?: string;
  submittedAt: string;
  updatedAt?: string;
}

export function AdminCareersTab() {
  const { authHeaders } = useAdminAuth();
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Notes & modal editing state
  const [editingNotes, setEditingNotes] = useState('');
  const [modalStatus, setModalStatus] = useState<string>('New');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Delete modal state
  const [applicationToDelete, setApplicationToDelete] = useState<CareerApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/cms/careers', {
        headers: authHeaders(),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load career applications.`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.applications)) {
        setApplications(data.applications);
      } else {
        throw new Error(data.error || 'Server returned failure response.');
      }
    } catch (err: any) {
      console.error('Failed to load career applications:', err);
      setError(err?.message || 'Could not load career applications from MySQL.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string, notes?: string) => {
    setUpdatingId(id);
    try {
      const body: Record<string, any> = { status: newStatus };
      if (notes !== undefined) body.notes = notes;

      const res = await fetch(`/api/admin/cms/careers/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success && data.application) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, ...data.application } : app))
        );
        if (selectedApplication?.id === id) {
          setSelectedApplication((prev) => (prev ? { ...prev, ...data.application } : prev));
        }
        showToast(`Application status updated to "${newStatus}".`);
      } else {
        throw new Error(data.error || 'Failed to update status.');
      }
    } catch (err: any) {
      console.error('Failed to update status:', err);
      showToast(err?.message || 'Error updating status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveModalChanges = async () => {
    if (!selectedApplication) return;
    setIsSavingNotes(true);
    setSaveSuccessNotice(null);
    try {
      const res = await fetch(`/api/admin/cms/careers/${encodeURIComponent(selectedApplication.id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          status: modalStatus,
          notes: editingNotes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.application) {
        setApplications((prev) =>
          prev.map((app) => (app.id === selectedApplication.id ? { ...app, ...data.application } : app))
        );
        setSelectedApplication((prev) => (prev ? { ...prev, ...data.application } : prev));
        setSaveSuccessNotice('Candidate record updated successfully.');
        setTimeout(() => setSaveSuccessNotice(null), 3000);
      } else {
        throw new Error(data.error || 'Failed to update application.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error saving changes.', 'error');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!applicationToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/cms/careers/${encodeURIComponent(applicationToDelete.id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApplications((prev) => prev.filter((app) => app.id !== applicationToDelete.id));
        if (selectedApplication?.id === applicationToDelete.id) {
          setSelectedApplication(null);
        }
        showToast(`Application "${applicationToDelete.id}" for ${applicationToDelete.name} permanently deleted.`);
        setApplicationToDelete(null);
      } else {
        throw new Error(data.error || 'Failed to delete career application.');
      }
    } catch (err: any) {
      console.error('Error deleting career application:', err);
      setDeleteError(err?.message || 'Deletion failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDetailModal = (app: CareerApplication) => {
    setSelectedApplication(app);
    setEditingNotes(app.notes || '');
    setModalStatus(app.status);
    setSaveSuccessNotice(null);
  };

  // Stage counts for filters
  const stageCounts = useMemo(() => {
    const counts = {
      all: applications.length,
      New: 0,
      Reviewing: 0,
      Interviewed: 0,
      Offered: 0,
      Archived: 0,
    };
    for (const app of applications) {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    }
    return counts;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.position.toLowerCase().includes(q) ||
        app.phone.includes(q) ||
        app.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Reviewing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Interviewed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Offered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Archived':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getResumeUrl = (app: CareerApplication): string | null => {
    const path = app.resumePath || app.resumeFilename;
    if (!path || path.trim() === '') return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return path;
    return `/uploads/${path}`;
  };

  return (
    <div className="space-y-6">
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              Careers & Candidate Applications
            </h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredApplications.length} of {applications.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review submitted CVs, engineering applicant profiles, contact details, and update hiring stage statuses in Hostinger MySQL.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error state banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchApplications}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex-1 flex items-center gap-2 w-full">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Search candidates by name, position, email, phone or application ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-700 focus:outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-700 font-medium"
          >
            <option value="all">All Stages ({stageCounts.all})</option>
            <option value="New">New ({stageCounts.New})</option>
            <option value="Reviewing">Reviewing ({stageCounts.Reviewing})</option>
            <option value="Interviewed">Interviewed ({stageCounts.Interviewed})</option>
            <option value="Offered">Offered ({stageCounts.Offered})</option>
            <option value="Archived">Archived ({stageCounts.Archived})</option>
          </select>
        </div>
      </div>

      {/* Applications Table / Cards */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600 mx-auto" />
          <p className="text-xs text-slate-500">Loading career applications from Hostinger MySQL...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
          <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No applications match your criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or stage filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Role Applied</th>
                  <th className="py-3 px-4">Experience & Notice</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Resume</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredApplications.map((app) => {
                  const resumeUrl = getResumeUrl(app);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{app.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                          <span>{app.email}</span>
                          <span>•</span>
                          <span>{app.phone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div>{app.position}</div>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {app.id}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        <div>Exp: {app.experience || 'Not specified'}</div>
                        <div>Notice: {app.noticePeriod || 'Standard'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-slate-400 font-mono whitespace-nowrap">
                        {new Date(app.submittedAt).toLocaleDateString('en-GB')}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          disabled={updatingId === app.id}
                          className={`text-[11px] font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeClass(
                            app.status
                          )}`}
                        >
                          <option value="New">New</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Interviewed">Interviewed</option>
                          <option value="Offered">Offered</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        {resumeUrl ? (
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[11px] font-semibold transition"
                            title="Download / View Resume"
                          >
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span>View CV</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">None attached</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailModal(app)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => setApplicationToDelete(app)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete candidate application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedApplication.name}</h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Applied for: <strong>{selectedApplication.position}</strong> (ID: {selectedApplication.id})
                </span>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Contact Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium uppercase">Email</span>
                  <a href={`mailto:${selectedApplication.email}`} className="font-semibold text-orange-600 hover:underline">
                    {selectedApplication.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium uppercase">Contact Phone</span>
                  <a href={`tel:${selectedApplication.phone}`} className="font-semibold text-slate-800">
                    {selectedApplication.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium uppercase">Experience</span>
                  <span className="font-semibold text-slate-800">{selectedApplication.experience || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium uppercase">Notice Period</span>
                  <span className="font-semibold text-slate-800">{selectedApplication.noticePeriod || 'Standard'}</span>
                </div>
              </div>

              {/* Portfolio Link */}
              {selectedApplication.portfolioUrl && (
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium uppercase mb-1">Portfolio / Profile Link</span>
                  <a
                    href={selectedApplication.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-600 hover:underline font-mono text-xs flex items-center gap-1"
                  >
                    <span>{selectedApplication.portfolioUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Resume File Attachment Block */}
              <div>
                <span className="text-slate-400 block text-[11px] font-medium uppercase mb-1">Resume / CV Document</span>
                {getResumeUrl(selectedApplication) ? (
                  <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="font-semibold text-blue-900 block">
                          {selectedApplication.resumeFilename || 'Candidate-Resume.pdf'}
                        </span>
                        <span className="text-[10px] text-blue-700">Stored via persistent career intake pipeline</span>
                      </div>
                    </div>
                    <a
                      href={getResumeUrl(selectedApplication)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-500">
                    <FileQuestion className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>No resume file was uploaded with this candidate application.</span>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium uppercase mb-1">Cover Letter & Technical Statement</span>
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              {/* Administrative Notes */}
              <div>
                <span className="text-slate-700 font-semibold block text-xs mb-1">Internal Recruitment Notes:</span>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record interview notes, technical screening feedback, or recruiter observations..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              {saveSuccessNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{saveSuccessNotice}</span>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-700">Stage:</span>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Offered">Offered</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setApplicationToDelete(selectedApplication);
                    }}
                    className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={handleSaveModalChanges}
                    disabled={isSavingNotes}
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    {isSavingNotes ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {applicationToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Confirm Application Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this career application? This action cannot be undone.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate:</span>
                <strong className="text-slate-800">{applicationToDelete.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role:</span>
                <span className="text-slate-700">{applicationToDelete.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Application ID:</span>
                <span className="font-mono text-slate-600">{applicationToDelete.id}</span>
              </div>
              <div className="text-[11px] text-rose-600 pt-1 border-t border-slate-200">
                This record will be permanently purged from Hostinger MySQL and recorded in the audit trail.
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
                onClick={() => setApplicationToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteApplication}
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
