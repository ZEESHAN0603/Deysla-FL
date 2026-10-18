import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Settings,
  FileText,
  Wrench,
  Briefcase,
  MessageSquareQuote,
  HelpCircle,
  GraduationCap,
  Folder,
  Inbox,
  Globe,
  Sparkles,
  Shield,
  Search,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminTab } from '../../pages/admin/AdminDashboardPage';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCompact: boolean;
  onToggleCompact: () => void;
  stats?: {
    newInquiries?: number;
    pendingQuotes?: number;
    openComplaints?: number;
    newCareers?: number;
    inactiveProducts?: number;
  } | null;
}

interface NavLeaf {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroupItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: NavLeaf[];
}

type NavEntry =
  | { type: 'leaf'; data: NavLeaf }
  | { type: 'group'; data: NavGroupItem };

interface NavCategory {
  title: string;
  entries: NavEntry[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  isCompact,
  onToggleCompact,
  stats,
}) => {
  const { user, logout } = useAdminAuth();

  // Navigation structure adhering strictly to Phase 2 specification
  const navigationCategories: NavCategory[] = [
    {
      title: 'A. Overview',
      entries: [
        {
          type: 'leaf',
          data: {
            id: 'overview',
            label: 'Dashboard',
            icon: LayoutDashboard,
          },
        },
      ],
    },
    {
      title: 'B. Website Content',
      entries: [
        {
          type: 'group',
          data: {
            id: 'grp-pages',
            label: 'Website Pages',
            icon: Globe,
            children: [
              { id: 'content', label: 'Page Content & Hero', icon: FileText },
              { id: 'settings', label: 'Site Settings & MySQL', icon: Settings },
            ],
          },
        },
        {
          type: 'leaf',
          data: {
            id: 'services',
            label: 'Services',
            icon: Wrench,
          },
        },
        {
          type: 'group',
          data: {
            id: 'grp-products',
            label: 'Products & Brands',
            icon: Package,
            children: [
              {
                id: 'products',
                label: 'Products & Taxonomy',
                icon: Package,
                badge: stats?.inactiveProducts ? stats.inactiveProducts : undefined,
              },
              { id: 'catalog-items', label: 'Commercial SKUs', icon: Layers },
              { id: 'brands', label: 'OEM Brand Partners', icon: Award },
            ],
          },
        },
        {
          type: 'leaf',
          data: {
            id: 'projects',
            label: 'Projects',
            icon: Briefcase,
          },
        },
        {
          type: 'group',
          data: {
            id: 'grp-gallery',
            label: 'Gallery & Media',
            icon: ImageIcon,
            children: [
              { id: 'gallery', label: 'Showcase Gallery', icon: ImageIcon },
              { id: 'media', label: 'Media & Image Assets', icon: Folder },
            ],
          },
        },
        {
          type: 'leaf',
          data: {
            id: 'faqs',
            label: 'FAQs',
            icon: HelpCircle,
          },
        },
        {
          type: 'leaf',
          data: {
            id: 'reviews',
            label: 'Reviews & Testimonials',
            icon: MessageSquareQuote,
          },
        },
      ],
    },
    {
      title: 'C. Customer & Sales',
      entries: [
        {
          type: 'leaf',
          data: {
            id: 'inbox',
            label: 'Customer Inquiries',
            icon: Inbox,
            badge: stats?.newInquiries && stats.newInquiries > 0 ? stats.newInquiries : undefined,
          },
        },
        {
          type: 'leaf',
          data: {
            id: 'quotes',
            label: 'Quotation Requests',
            icon: FileSpreadsheet,
            badge: stats?.pendingQuotes && stats.pendingQuotes > 0 ? stats.pendingQuotes : undefined,
          },
        },
        {
          type: 'leaf',
          data: {
            id: 'complaints',
            label: 'Complaints',
            icon: MessageSquareWarning,
            badge: stats?.openComplaints && stats.openComplaints > 0 ? stats.openComplaints : undefined,
          },
        },
      ],
    },
    {
      title: 'D. Recruitment',
      entries: [
        {
          type: 'leaf',
          data: {
            id: 'careers',
            label: 'Careers & Resumes',
            icon: GraduationCap,
            badge: stats?.newCareers && stats.newCareers > 0 ? stats.newCareers : undefined,
          },
        },
      ],
    },
    {
      title: 'E. System & Administration',
      entries: [
        {
          type: 'leaf',
          data: {
            id: 'audit',
            label: 'Audit Trail',
            icon: History,
          },
        },
      ],
    },
  ];

  // Helper to determine which group contains the activeTab
  const getParentGroupId = (tab: AdminTab): string | null => {
    for (const cat of navigationCategories) {
      for (const entry of cat.entries) {
        if (entry.type === 'group') {
          if (entry.data.children.some((c) => c.id === tab)) {
            return entry.data.id;
          }
        }
      }
    }
    return null;
  };

  // State to track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const parent = getParentGroupId(activeTab);
    return {
      'grp-pages': parent === 'grp-pages',
      'grp-products': parent === 'grp-products' || true, // default products open
      'grp-gallery': parent === 'grp-gallery',
    };
  });

  // Auto-expand parent group when activeTab changes
  useEffect(() => {
    const parent = getParentGroupId(activeTab);
    if (parent) {
      setExpandedGroups((prev) => ({ ...prev, [parent]: true }));
    }
  }, [activeTab]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleLeafClick = (tabId: AdminTab) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  // Floating hover popover for compact mode
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 ease-in-out md:static flex flex-col justify-between shadow-xl md:shadow-none ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${isCompact ? 'md:w-18' : 'md:w-72'}`}
      >
        {/* Top Header / Brand Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-sky-500 p-0.5 shrink-0 flex items-center justify-center shadow-md shadow-orange-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-sky-400">
                  D
                </span>
              </div>
            </div>
            {!isCompact && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm tracking-tight">DEYSLA</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30">
                    CMS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Enterprise Control Center</p>
              </div>
            )}
          </div>

          {/* Desktop Compact Toggle Button */}
          <button
            onClick={onToggleCompact}
            className="hidden md:inline-flex w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 items-center justify-center transition cursor-pointer"
            title={isCompact ? 'Expand Sidebar' : 'Compact Sidebar'}
          >
            {isCompact ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navigationCategories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-1">
              {/* Category Header (Hidden in compact mode) */}
              {!isCompact ? (
                <div className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  {category.title}
                </div>
              ) : (
                <div className="w-full h-px bg-slate-800/80 my-2" />
              )}

              {/* Entries in this category */}
              <div className="space-y-1">
                {category.entries.map((entry, entryIdx) => {
                  if (entry.type === 'leaf') {
                    const leaf = entry.data;
                    const Icon = leaf.icon;
                    const isActive = activeTab === leaf.id;

                    return (
                      <div key={leaf.id} className="relative group">
                        <button
                          onClick={() => handleLeafClick(leaf.id)}
                          className={`w-full flex items-center ${
                            isCompact ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
                          } rounded-xl text-xs font-medium transition cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-500 to-sky-600 text-white font-semibold shadow-lg shadow-orange-500/20'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          }`}
                          title={isCompact ? leaf.label : undefined}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                              }`}
                            />
                            {!isCompact && <span className="truncate">{leaf.label}</span>}
                          </div>

                          {!isCompact && leaf.badge !== undefined && (
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                isActive
                                  ? 'bg-white text-slate-900'
                                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              }`}
                            >
                              {leaf.badge}
                            </span>
                          )}
                        </button>

                        {/* Floating Tooltip in Compact Mode */}
                        {isCompact && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                            <div className="px-2.5 py-1.5 bg-slate-950 text-white text-xs rounded-lg shadow-xl border border-slate-700 whitespace-nowrap flex items-center gap-2">
                              <span>{leaf.label}</span>
                              {leaf.badge !== undefined && (
                                <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-[10px] font-bold">
                                  {leaf.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Collapsible Group
                  if (entry.type === 'group') {
                    const group = entry.data;
                    const GroupIcon = group.icon;
                    const isGroupOpen = !!expandedGroups[group.id];
                    const isAnyChildActive = group.children.some((c) => c.id === activeTab);

                    return (
                      <div
                        key={group.id}
                        className="relative group"
                        onMouseEnter={() => isCompact && setHoveredGroupId(group.id)}
                        onMouseLeave={() => isCompact && setHoveredGroupId(null)}
                      >
                        {/* Group Header Button */}
                        <button
                          onClick={() => {
                            if (isCompact) {
                              onToggleCompact(); // expand on click
                            } else {
                              toggleGroup(group.id);
                            }
                          }}
                          className={`w-full flex items-center ${
                            isCompact ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
                          } rounded-xl text-xs font-medium transition cursor-pointer ${
                            isAnyChildActive
                              ? 'bg-slate-800 text-orange-400 border border-slate-700/80 font-semibold'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                          }`}
                          title={isCompact ? group.label : undefined}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <GroupIcon
                              className={`w-4 h-4 shrink-0 ${
                                isAnyChildActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-200'
                              }`}
                            />
                            {!isCompact && <span className="truncate">{group.label}</span>}
                          </div>

                          {!isCompact && (
                            <div className="flex items-center gap-1.5">
                              {isAnyChildActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              )}
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                  isGroupOpen ? 'rotate-180 text-white' : ''
                                }`}
                              />
                            </div>
                          )}
                        </button>

                        {/* Expanded Submenu (When not in compact mode) */}
                        {!isCompact && isGroupOpen && (
                          <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-1 py-0.5">
                            {group.children.map((child) => {
                              const ChildIcon = child.icon;
                              const isChildActive = activeTab === child.id;

                              return (
                                <button
                                  key={child.id}
                                  onClick={() => handleLeafClick(child.id)}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                                    isChildActive
                                      ? 'bg-gradient-to-r from-orange-500/20 to-sky-500/20 text-orange-400 font-semibold border border-orange-500/30'
                                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <ChildIcon
                                      className={`w-3.5 h-3.5 shrink-0 ${
                                        isChildActive ? 'text-orange-400' : 'text-slate-500'
                                      }`}
                                    />
                                    <span className="truncate">{child.label}</span>
                                  </div>

                                  {child.badge !== undefined && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-400">
                                      {child.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Compact Flyout Popover (When hovering in compact mode) */}
                        {isCompact && hoveredGroupId === group.id && (
                          <div className="absolute left-full ml-3 top-0 z-50 w-56 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl py-2 px-1 space-y-1">
                            <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase border-b border-slate-800 pb-1.5 mb-1">
                              {group.label}
                            </div>
                            {group.children.map((child) => {
                              const ChildIcon = child.icon;
                              const isChildActive = activeTab === child.id;

                              return (
                                <button
                                  key={child.id}
                                  onClick={() => handleLeafClick(child.id)}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition text-left cursor-pointer ${
                                    isChildActive
                                      ? 'bg-orange-500/20 text-orange-400 font-medium'
                                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <ChildIcon className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="truncate">{child.label}</span>
                                  </div>
                                  {child.badge !== undefined && (
                                    <span className="text-[10px] px-1.5 rounded-full bg-orange-500/20 text-orange-400">
                                      {child.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Profile & System Status */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className={`flex items-center ${isCompact ? 'justify-center' : 'justify-between'} gap-2`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              {!isCompact && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-white leading-tight truncate">
                    {user?.username || 'Administrator'}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Hostinger MySQL Live</span>
                  </div>
                </div>
              )}
            </div>

            {!isCompact && (
              <button
                onClick={() => logout()}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="Sign out of Admin Console"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
