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
  ShieldAlert,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface StatsData {
  totalProducts: number;
  activeProducts: number;
  totalCatalogItems: number;
  totalBrands: number;
  newComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  totalComplaints: number;
  pendingQuotes: number;
  totalQuotes: number;
  recentActivity: Array<{
    type: 'complaint' | 'quote';
    id: string;
    title: string;
    time: string;
    status: string;
  }>;
}

interface AdminOverviewTabProps {
  onNavigateTab: (tab: string) => void;
}

export function AdminOverviewTab({ onNavigateTab }: AdminOverviewTabProps) {
  const { authHeaders } = useAdminAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/stats', { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch dashboard stats');
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
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-orange-500/20">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-medium">Loading real-time dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/15">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>Operations & Catalogue Hub</span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              Live Backend Connected
            </span>
          </h2>
          <p className="text-xs text-white/90 mt-1">
            Real-time status of commercial equipment lines, active partners, inquiries, and customer RFQs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-xl border border-white/25 transition cursor-pointer backdrop-blur-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Metrics</span>
          </button>
          <button
            onClick={() => onNavigateTab('products')}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold rounded-xl transition shadow-md cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-orange-600" />
            <span>Manage Products</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md rounded-2xl p-5 cursor-pointer transition group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{stats?.totalProducts ?? 0}</span>
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              {stats?.activeProducts ?? 0} Active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-orange-600">
            <span>Inline spreadsheet view</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* Sub-Products / SKUs */}
        <div
          onClick={() => onNavigateTab('catalog-items')}
          className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-5 cursor-pointer transition group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Commercial SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{stats?.totalCatalogItems ?? 0}</span>
            <span className="text-xs text-slate-500">Sub-product lines</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-blue-600">
            <span>Parent-product links</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* Brand Partners */}
        <div
          onClick={() => onNavigateTab('brands')}
          className="bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md rounded-2xl p-5 cursor-pointer transition group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Partner Brands</span>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500/10 to-blue-500/10 text-orange-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{stats?.totalBrands ?? 0}</span>
            <span className="text-xs text-slate-500">Global OEMs</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-orange-600">
            <span>Manage brand profiles</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* Customer Complaints / Inquiries */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md rounded-2xl p-5 cursor-pointer transition group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Complaints & Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <MessageSquareWarning className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{stats?.totalComplaints ?? 0}</span>
            {(stats?.newComplaints ?? 0) > 0 ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                {stats?.newComplaints} New
              </span>
            ) : (
              <span className="text-xs text-slate-400">All clear</span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-orange-600">
            <span>Contact form tickets</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>
      </div>

      {/* Secondary Row: Quotes & Recent Inquiries Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quotation Requests Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>Quotation Requests (RFQs)</span>
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Phase 1 View-Only
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Incoming customer Bills of Materials and quote submissions received via website checkout drawer.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block mb-1">Pending Review</span>
                <span className="text-2xl font-bold text-orange-600">{stats?.pendingQuotes ?? 0}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block mb-1">Total Received</span>
                <span className="text-2xl font-bold text-slate-900">{stats?.totalQuotes ?? 0}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('quotes')}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/15 cursor-pointer"
          >
            <span>Inspect All Quotation Requests</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Live Activity Stream */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Recent Activity Feed</span>
            </h3>
            <span className="text-xs text-slate-400">Live persistent logs</span>
          </div>

          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((act) => (
                <div
                  key={act.id}
                  onClick={() => onNavigateTab(act.type === 'complaint' ? 'complaints' : 'quotes')}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-orange-50/40 border border-slate-200/80 rounded-xl cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        act.type === 'complaint'
                          ? 'bg-orange-500/10 text-orange-600'
                          : 'bg-blue-500/10 text-blue-600'
                      }`}
                    >
                      {act.type === 'complaint' ? (
                        <MessageSquareWarning className="w-4 h-4" />
                      ) : (
                        <FileSpreadsheet className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-800 group-hover:text-orange-600 transition truncate max-w-sm">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        ID: {act.id} · {new Date(act.time).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        act.status === 'New' || act.status === 'Pending'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : act.status === 'Resolved' || act.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {act.status}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No customer activity recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
