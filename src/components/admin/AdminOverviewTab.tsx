import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  Award,
  MessageSquareWarning,
  FileSpreadsheet,
  Clock,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Globe,
  FileText,
  Inbox,
  GraduationCap,
  Folder,
  History,
  Activity,
  Server,
  Zap,
  Check,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminTab } from '../../pages/admin/AdminDashboardPage';

interface DashboardStatsData {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts?: number;
  totalCatalogItems: number;
  totalBrands: number;
  totalInquiries?: number;
  newInquiries?: number;
  totalComplaints: number;
  openComplaints?: number;
  newComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  pendingQuotes: number;
  totalQuotes: number;
  totalCareers?: number;
  newCareers?: number;
  recentActivity: Array<{
    type: 'complaint' | 'quote';
    id: string;
    title: string;
    time: string;
    status: string;
  }>;
  recentAudit?: Array<{
    id: string;
    timestamp: string;
    user: string;
    action: string;
    entity: string;
    entityId: string;
    details: string;
  }>;
}

interface AdminOverviewTabProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export function AdminOverviewTab({ onNavigateTab }: AdminOverviewTabProps) {
  const { authHeaders } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/stats', { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        setLastRefreshed(new Date());
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-sky-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-orange-500/20">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-700">Connecting to Hostinger MySQL & compiling live CMS metrics...</p>
        <p className="text-xs text-slate-400 mt-1">Reading database records and real-time activity</p>
      </div>
    );
  }

  const inactiveProductsCount =
    stats?.inactiveProducts !== undefined
      ? stats.inactiveProducts
      : Math.max(0, (stats?.totalProducts ?? 0) - (stats?.activeProducts ?? 0));

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Welcome / Executive Summary Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Hostinger MySQL · Live Production Store
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            DEYSLA Executive CMS Console
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Unified management dashboard. Real-time catalogue inventory, customer inquiries, quotation requests, and website content controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
            title="Refresh metrics from MySQL"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Data</span>
          </button>

          <a
            href="/en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-sky-600 hover:from-orange-600 hover:to-sky-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-orange-500/15 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Open Public Storefront</span>
          </a>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Actions Panel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Quick Client Actions
          </h2>
          <span className="text-[11px] text-slate-400">Direct shortcuts to primary management tasks</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Action 1: Website Content */}
          <button
            onClick={() => onNavigateTab('content')}
            className="p-3.5 bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md rounded-xl transition text-left group cursor-pointer flex flex-col justify-between h-28"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition">
                Website Content
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Edit hero &amp; pages</div>
            </div>
          </button>

          {/* Action 2: Products & Taxonomy */}
          <button
            onClick={() => onNavigateTab('products')}
            className="p-3.5 bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md rounded-xl transition text-left group cursor-pointer flex flex-col justify-between h-28"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition">
                Products &amp; Brands
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Catalogue &amp; status</div>
            </div>
          </button>

          {/* Action 3: Inquiries */}
          <button
            onClick={() => onNavigateTab('inbox')}
            className="p-3.5 bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md rounded-xl transition text-left group cursor-pointer flex flex-col justify-between h-28"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition flex items-center gap-1.5">
                <span>Inquiries</span>
                {(stats?.newInquiries ?? 0) > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Customer inbox</div>
            </div>
          </button>

          {/* Action 4: Quotations */}
          <button
            onClick={() => onNavigateTab('quotes')}
            className="p-3.5 bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md rounded-xl transition text-left group cursor-pointer flex flex-col justify-between h-28"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
                <span>Quotations</span>
                {(stats?.pendingQuotes ?? 0) > 0 && (
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Review client RFQs</div>
            </div>
          </button>

          {/* Action 5: Careers */}
          <button
            onClick={() => onNavigateTab('careers')}
            className="p-3.5 bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md rounded-xl transition text-left group cursor-pointer flex flex-col justify-between h-28"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition">
                Recruitment
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Review applications</div>
            </div>
          </button>

          {/* Action 6: Media Assets */}
          <button
            onClick={() => onNavigateTab('media')}
            className="p-3.5 bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md rounded-xl transition text-left group cursor-pointer flex flex-col justify-between h-28"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">
                Media &amp; Images
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Manage uploads</div>
            </div>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
          Core Operating Metrics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Customer Inquiries */}
          <div
            onClick={() => onNavigateTab('inbox')}
            className="bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md rounded-2xl p-5 cursor-pointer transition group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600">Customer Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">
                {stats?.totalInquiries ?? stats?.totalComplaints ?? 0}
              </span>
              {(stats?.newInquiries ?? stats?.newComplaints ?? 0) > 0 ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {stats?.newInquiries ?? stats?.newComplaints} Unread
                </span>
              ) : (
                <span className="text-xs text-slate-400">All answered</span>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-orange-600">
              <span>View contact messages</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </div>

          {/* Card 2: Quotation Requests (RFQs) */}
          <div
            onClick={() => onNavigateTab('quotes')}
            className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-5 cursor-pointer transition group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600">Quotation Requests (RFQs)</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{stats?.totalQuotes ?? 0}</span>
              {(stats?.pendingQuotes ?? 0) > 0 ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  {stats?.pendingQuotes} Pending Review
                </span>
              ) : (
                <span className="text-xs text-slate-400">Zero pending</span>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-blue-600">
              <span>Inspect Bill of Materials</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </div>

          {/* Card 3: Complaints */}
          <div
            onClick={() => onNavigateTab('complaints')}
            className="bg-white border border-slate-200 hover:border-rose-300 hover:shadow-md rounded-2xl p-5 cursor-pointer transition group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600">Client Complaints</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <MessageSquareWarning className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">
                {stats?.totalComplaints ?? 0}
              </span>
              {(stats?.openComplaints ?? stats?.newComplaints ?? 0) > 0 ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {stats?.openComplaints ?? stats?.newComplaints} Open
                </span>
              ) : (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Resolved
                </span>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-rose-600">
              <span>Customer service tickets</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </div>

          {/* Card 4: Career Applications */}
          <div
            onClick={() => onNavigateTab('careers')}
            className="bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md rounded-2xl p-5 cursor-pointer transition group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600">Job Applications &amp; Resumes</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{stats?.totalCareers ?? 0}</span>
              {(stats?.newCareers ?? 0) > 0 ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {stats?.newCareers} New
                </span>
              ) : (
                <span className="text-xs text-slate-400">All reviewed</span>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-purple-600">
              <span>View candidate profiles</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Catalogue Inventory Health Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" />
              <span>Hardware &amp; Equipment Catalogue Overview</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current state of product taxonomy, commercial SKU lines, and global OEM partnerships.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Open Taxonomy Manager</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-1">Total Products</span>
            <span className="text-xl font-bold text-slate-900">{stats?.totalProducts ?? 0}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
            <span className="text-[11px] text-emerald-700 block mb-1">Active Products</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-emerald-800">{stats?.activeProducts ?? 0}</span>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
            <span className="text-[11px] text-amber-700 block mb-1">Inactive Products</span>
            <span className="text-xl font-bold text-amber-800">{inactiveProductsCount}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200/60">
            <span className="text-[11px] text-sky-700 block mb-1">Commercial SKUs</span>
            <span className="text-xl font-bold text-sky-800">{stats?.totalCatalogItems ?? 0}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/60">
            <span className="text-[11px] text-purple-700 block mb-1">OEM Partner Brands</span>
            <span className="text-xl font-bold text-purple-800">{stats?.totalBrands ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Customer Activity & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries & RFQs Feed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Recent Customer Submissions</span>
              </h3>
              <button
                onClick={() => onNavigateTab('inbox')}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Inbox</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-2.5">
                {stats.recentActivity.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    onClick={() => onNavigateTab(act.type === 'complaint' ? 'complaints' : 'quotes')}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/70 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          act.type === 'complaint'
                            ? 'bg-orange-500/10 text-orange-600'
                            : 'bg-blue-500/10 text-blue-600'
                        }`}
                      >
                        {act.type === 'complaint' ? (
                          <MessageSquareWarning className="w-3.5 h-3.5" />
                        ) : (
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-orange-600 transition truncate">
                          {act.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(act.time).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        act.status === 'New' || act.status === 'Pending'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No recent customer submissions recorded.</p>
              </div>
            )}
          </div>
        </div>

        {/* Administrative Audit Log Feed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-sky-600" />
                <span>Recent Administrative Activity (Audit Log)</span>
              </h3>
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Full Audit Log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {stats?.recentAudit && stats.recentAudit.length > 0 ? (
              <div className="space-y-2.5">
                {stats.recentAudit.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    onClick={() => onNavigateTab('audit')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50/40 border border-slate-200/70 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 font-bold uppercase">
                          {log.action}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {log.entity}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 truncate">
                      {log.details || `Modified ${log.entityId || 'record'}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Audit logging active. Recent actions will record here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
