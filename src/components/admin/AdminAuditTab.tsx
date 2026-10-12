import React, { useState, useEffect } from 'react';
import {
  History,
  Shield,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Database,
  Loader2,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AuditLogEntry } from '../../server/db/database';

export function AdminAuditTab() {
  const { authHeaders } = useAdminAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupResult, setBackupResult] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/audit-logs', { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch audit trail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleManualBackup = async () => {
    try {
      setBackupLoading(true);
      setBackupResult(null);
      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBackupResult(`Recoverable snapshot saved to ${data.backupPath}`);
        fetchLogs();
      } else {
        alert(data.error || 'Backup creation failed.');
      }
    } catch (err: any) {
      alert(err?.message || 'Network error.');
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">System Audit Trail & Database Recovery</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {logs.length} Recorded Events
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of catalogue modifications, administrative actions, and automatic backup checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleManualBackup}
            disabled={backupLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-orange-500/15 cursor-pointer disabled:opacity-50"
          >
            {backupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4 text-white" />}
            <span>Create Database Snapshot Backup</span>
          </button>
        </div>
      </div>

      {backupResult && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-mono">{backupResult}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3.5 px-4 w-44">Timestamp</th>
                <th className="py-3.5 px-4 w-28">Admin User</th>
                <th className="py-3.5 px-4 w-28 text-center">Action</th>
                <th className="py-3.5 px-4 w-32">Target Entity</th>
                <th className="py-3.5 px-4">Entity ID</th>
                <th className="py-3.5 px-4">Modification Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <span>No audit events recorded yet.</span>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-orange-50/30 transition">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {log.user}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                          log.action === 'CREATE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : log.action === 'UPDATE'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : log.action === 'DELETE'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-orange-50 text-orange-700 border-orange-200'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                      {log.entity}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {log.entityId}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
