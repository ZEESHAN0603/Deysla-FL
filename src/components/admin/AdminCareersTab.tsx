import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

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
  submittedAt: string;
  updatedAt?: string;
}

export function AdminCareersTab() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/cms/careers');
      const data = await res.json();
      if (data.success && Array.isArray(data.applications)) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Failed to load career applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/cms/careers/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus as any } : app))
        );
        if (selectedApplication?.id === id) {
          setSelectedApplication((prev) => prev ? { ...prev, status: newStatus as any } : prev);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-orange-600" />
            Careers & Candidate Applications
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review submitted CVs, engineering applicant profiles, contact details, and update hiring stage statuses.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex-1 flex items-center gap-2 w-full">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Search candidates by name, position or email..."
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
            <option value="all">All Stages ({applications.length})</option>
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Offered">Offered</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Applications Table / Cards */}
      {filteredApplications.length === 0 ? (
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
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredApplications.map((app) => (
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
                      {app.position}
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
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeClass(app.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Interviewed">Interviewed</option>
                        <option value="Offered">Offered</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
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
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
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
                  <span className="font-semibold text-slate-800">{selectedApplication.experience || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium uppercase">Notice Period</span>
                  <span className="font-semibold text-slate-800">{selectedApplication.noticePeriod || 'Immediate'}</span>
                </div>
              </div>

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

              {selectedApplication.resumeFilename && (
                <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-semibold text-blue-900 block">{selectedApplication.resumeFilename}</span>
                      <span className="text-[10px] text-blue-700">Transmitted and stored via recruitment pipeline</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedApplication.coverLetter && (
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium uppercase mb-1">Cover Letter & Technical Statement</span>
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Application date: {new Date(selectedApplication.submittedAt).toLocaleString('en-GB')}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Stage:</span>
                  <select
                    value={selectedApplication.status}
                    onChange={(e) => handleUpdateStatus(selectedApplication.id, e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Offered">Offered</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
