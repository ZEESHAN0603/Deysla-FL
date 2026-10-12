import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  MessageSquareWarning,
  FileSpreadsheet,
  Image as ImageIcon,
  History,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminOverviewTab } from '../../components/admin/AdminOverviewTab';
import { AdminProductsTab } from '../../components/admin/AdminProductsTab';
import { AdminCatalogItemsTab } from '../../components/admin/AdminCatalogItemsTab';
import { AdminBrandsTab } from '../../components/admin/AdminBrandsTab';
import { AdminComplaintsTab } from '../../components/admin/AdminComplaintsTab';
import { AdminQuotesTab } from '../../components/admin/AdminQuotesTab';
import { AdminMediaTab } from '../../components/admin/AdminMediaTab';
import { AdminAuditTab } from '../../components/admin/AdminAuditTab';

type AdminTab =
  | 'overview'
  | 'products'
  | 'catalog-items'
  | 'brands'
  | 'complaints'
  | 'quotes'
  | 'media'
  | 'audit';

export function AdminDashboardPage() {
  const { user, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [subproductFilter, setSubproductFilter] = useState<string | undefined>(undefined);

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: 'Products & Taxonomy', icon: Package },
    { id: 'catalog-items' as AdminTab, label: 'Commercial SKUs (Sub-Products)', icon: Layers },
    { id: 'brands' as AdminTab, label: 'OEM Brand Partners', icon: Award },
    { id: 'complaints' as AdminTab, label: 'Customer Complaints & Inquiries', icon: MessageSquareWarning },
    { id: 'quotes' as AdminTab, label: 'Quotation Requests (RFQs)', icon: FileSpreadsheet },
    { id: 'media' as AdminTab, label: 'Media & Image Assets', icon: ImageIcon },
    { id: 'audit' as AdminTab, label: 'Audit Trail & Snapshots', icon: History },
  ];

  const handleSelectProductForSubproducts = (productId: string) => {
    setSubproductFilter(productId);
    setActiveTab('catalog-items');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Enterprise Bar */}
      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="DEYSLA" className="h-7 w-auto" />
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-sm tracking-tight">DEYSLA</span>
              <span className="text-[10px] font-bold uppercase tracking-widest block bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent font-mono">
                Management Console
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/en"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs border border-slate-200 transition font-medium"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-semibold text-slate-900 block leading-none">{user?.username}</span>
              <span className="text-[10px] text-slate-500">Authenticated Admin</span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 pt-16 md:pt-0 transform transition-transform duration-200 md:relative md:translate-x-0 flex flex-col justify-between shadow-xs ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Operations & Catalogue
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold shadow-md shadow-orange-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/90" />}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-blue-600" />
              <span>Persistent Engine v2.0 (Active)</span>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-20 md:hidden backdrop-blur-xs"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full bg-slate-50/60">
          {activeTab === 'overview' && (
            <AdminOverviewTab onNavigateTab={(t) => setActiveTab(t as AdminTab)} />
          )}
          {activeTab === 'products' && (
            <AdminProductsTab
              onSelectProductForSubproducts={handleSelectProductForSubproducts}
            />
          )}
          {activeTab === 'catalog-items' && (
            <AdminCatalogItemsTab
              initialProductIdFilter={subproductFilter}
              onClearParentFilter={() => setSubproductFilter(undefined)}
            />
          )}
          {activeTab === 'brands' && <AdminBrandsTab />}
          {activeTab === 'complaints' && <AdminComplaintsTab />}
          {activeTab === 'quotes' && <AdminQuotesTab />}
          {activeTab === 'media' && <AdminMediaTab />}
          {activeTab === 'audit' && <AdminAuditTab />}
        </main>
      </div>
    </div>
  );
}
