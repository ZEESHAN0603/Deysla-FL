import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ExternalLink,
  LogOut,
  ChevronRight,
  Shield,
  RefreshCw,
  Bell,
  Search,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

// Tab Components
import { AdminOverviewTab } from '../../components/admin/AdminOverviewTab';
import { AdminProductsTab } from '../../components/admin/AdminProductsTab';
import { AdminCatalogItemsTab } from '../../components/admin/AdminCatalogItemsTab';
import { AdminBrandsTab } from '../../components/admin/AdminBrandsTab';
import { AdminComplaintsTab } from '../../components/admin/AdminComplaintsTab';
import { AdminQuotesTab } from '../../components/admin/AdminQuotesTab';
import { AdminMediaTab } from '../../components/admin/AdminMediaTab';
import { AdminAuditTab } from '../../components/admin/AdminAuditTab';
import { AdminSettingsTab } from '../../components/admin/AdminSettingsTab';
import { AdminContentTab } from '../../components/admin/AdminContentTab';
import { AdminServicesTab } from '../../components/admin/AdminServicesTab';
import { AdminProjectsTab } from '../../components/admin/AdminProjectsTab';
import { AdminGalleryTab } from '../../components/admin/AdminGalleryTab';
import { AdminReviewsTab } from '../../components/admin/AdminReviewsTab';
import { AdminFaqsTab } from '../../components/admin/AdminFaqsTab';
import { AdminCareersTab } from '../../components/admin/AdminCareersTab';
import { AdminInquiryInboxTab } from '../../components/admin/AdminInquiryInboxTab';

export type AdminTab =
  | 'overview'
  | 'inbox'
  | 'settings'
  | 'content'
  | 'services'
  | 'products'
  | 'catalog-items'
  | 'brands'
  | 'projects'
  | 'gallery'
  | 'reviews'
  | 'faqs'
  | 'careers'
  | 'complaints'
  | 'quotes'
  | 'media'
  | 'audit';

const VALID_TABS: AdminTab[] = [
  'overview',
  'inbox',
  'settings',
  'content',
  'services',
  'products',
  'catalog-items',
  'brands',
  'projects',
  'gallery',
  'reviews',
  'faqs',
  'careers',
  'complaints',
  'quotes',
  'media',
  'audit',
];

interface BreadcrumbInfo {
  section: string;
  group?: string;
  title: string;
}

const TAB_BREADCRUMBS: Record<AdminTab, BreadcrumbInfo> = {
  overview: { section: 'Overview', title: 'Executive Dashboard' },
  content: { section: 'Website Content', group: 'Website Pages', title: 'Page Content & Hero' },
  settings: { section: 'Website Content', group: 'Website Pages', title: 'Site Settings & MySQL' },
  services: { section: 'Website Content', title: 'Enterprise Services' },
  products: { section: 'Website Content', group: 'Products & Brands', title: 'Products & Taxonomy' },
  'catalog-items': { section: 'Website Content', group: 'Products & Brands', title: 'Commercial SKUs' },
  brands: { section: 'Website Content', group: 'Products & Brands', title: 'OEM Brand Partners' },
  projects: { section: 'Website Content', title: 'Turnkey Projects' },
  gallery: { section: 'Website Content', group: 'Gallery & Media', title: 'Showcase Gallery' },
  media: { section: 'Website Content', group: 'Gallery & Media', title: 'Media & Image Assets' },
  faqs: { section: 'Website Content', title: 'FAQs Knowledge Base' },
  reviews: { section: 'Website Content', title: 'Client Reviews & Testimonials' },
  inbox: { section: 'Customer & Sales', title: 'Customer Inquiries' },
  quotes: { section: 'Customer & Sales', title: 'Quotation Requests' },
  complaints: { section: 'Customer & Sales', title: 'Customer Complaints' },
  careers: { section: 'Recruitment', title: 'Careers & Resumes' },
  audit: { section: 'System & Administration', title: 'Audit Trail & Operations Log' },
};

export function AdminDashboardPage() {
  const { user, logout, authHeaders } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab from route: /admin or /admin/:tab
  const currentTabFromUrl = useMemo<AdminTab>(() => {
    const raw = location.pathname.replace(/^\/admin\/?/, '').split('/')[0];
    if (raw && (VALID_TABS as string[]).includes(raw)) {
      return raw as AdminTab;
    }
    return 'overview';
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState<AdminTab>(currentTabFromUrl);

  // Sync state if URL changes (e.g. browser back/forward or direct link)
  useEffect(() => {
    if (currentTabFromUrl !== activeTab) {
      setActiveTab(currentTabFromUrl);
    }
  }, [currentTabFromUrl]);

  // Handle tab selection with clean URL navigation and refresh preservation
  const handleSelectTab = useCallback(
    (tab: AdminTab) => {
      setActiveTab(tab);
      const targetUrl = tab === 'overview' ? '/admin' : `/admin/${tab}`;
      if (location.pathname !== targetUrl) {
        navigate(targetUrl);
      }
    },
    [navigate, location.pathname]
  );

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Compact sidebar mode with persistent preference
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    try {
      return localStorage.getItem('deysla_admin_sidebar_compact') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCompact = () => {
    setIsCompact((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('deysla_admin_sidebar_compact', String(next));
      } catch {}
      return next;
    });
  };

  // Cross-tab subproduct linking
  const [subproductFilter, setSubproductFilter] = useState<string | undefined>(undefined);
  const handleSelectProductForSubproducts = (productId: string) => {
    setSubproductFilter(productId);
    handleSelectTab('catalog-items');
  };

  // Live sidebar badge stats
  const [sidebarStats, setSidebarStats] = useState<{
    newInquiries?: number;
    pendingQuotes?: number;
    openComplaints?: number;
    newCareers?: number;
    inactiveProducts?: number;
  } | null>(null);

  const fetchSidebarStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.stats) {
          const s = data.stats;
          setSidebarStats({
            newInquiries: s.newInquiries ?? s.newComplaints ?? 0,
            pendingQuotes: s.pendingQuotes ?? 0,
            openComplaints: s.openComplaints ?? s.newComplaints ?? 0,
            newCareers: s.newCareers ?? 0,
            inactiveProducts: s.inactiveProducts ?? 0,
          });
        }
      }
    } catch {
      // Non-critical background telemetry
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchSidebarStats();
    // Poll stats occasionally for live badge updates
    const timer = setInterval(fetchSidebarStats, 60000);
    return () => clearInterval(timer);
  }, [fetchSidebarStats]);

  const breadcrumb = TAB_BREADCRUMBS[activeTab] || {
    section: 'Administration',
    title: activeTab,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex font-sans selection:bg-orange-500 selection:text-white">
      {/* Redesigned Structured Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCompact={isCompact}
        onToggleCompact={toggleCompact}
        stats={sidebarStats}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Enterprise Bar */}
        <header className="h-16 border-b border-slate-200/90 bg-white sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-2xs">
          {/* Left: Mobile Toggle & Contextual Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden w-9 h-9 inline-flex items-center justify-center text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg cursor-pointer shrink-0 transition"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs truncate">
              <span
                onClick={() => handleSelectTab('overview')}
                className="font-semibold text-slate-500 hover:text-slate-900 cursor-pointer transition hidden sm:inline"
              >
                DEYSLA CMS
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip shrink-0 hidden sm:inline" />
              <span className="text-slate-500 font-medium truncate hidden md:inline">
                {breadcrumb.section}
              </span>
              {breadcrumb.group && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip shrink-0 hidden md:inline" />
                  <span className="text-slate-500 font-medium truncate hidden md:inline">
                    {breadcrumb.group}
                  </span>
                </>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip shrink-0" />
              <span className="font-bold text-slate-900 truncate">
                {breadcrumb.title}
              </span>
            </nav>
          </div>

          {/* Right: Actions, Storefront Link, User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live Storefront Button */}
            <a
              href="/en"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200/80 transition"
              title="Open public website in new tab"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-sky-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-none">
                  {user?.username || 'admin'}
                </span>
                <span className="text-[10px] text-slate-500">Super Administrator</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
              title="Sign out of DEYSLA CMS"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full bg-slate-100/70">
          {activeTab === 'overview' && (
            <AdminOverviewTab onNavigateTab={handleSelectTab} />
          )}
          {activeTab === 'inbox' && <AdminInquiryInboxTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
          {activeTab === 'content' && <AdminContentTab />}
          {activeTab === 'services' && <AdminServicesTab />}
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
          {activeTab === 'projects' && <AdminProjectsTab />}
          {activeTab === 'gallery' && <AdminGalleryTab />}
          {activeTab === 'reviews' && <AdminReviewsTab />}
          {activeTab === 'faqs' && <AdminFaqsTab />}
          {activeTab === 'careers' && <AdminCareersTab />}
          {activeTab === 'complaints' && <AdminComplaintsTab />}
          {activeTab === 'quotes' && <AdminQuotesTab />}
          {activeTab === 'media' && <AdminMediaTab />}
          {activeTab === 'audit' && <AdminAuditTab />}
        </main>
      </div>
    </div>
  );
}
