import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Building2,
  Sparkles,
  Layers,
  Briefcase,
  Image as ImageIcon,
  PhoneCall,
  Mail,
  Home,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { CATEGORY_TRANSLATIONS, SERVICE_TRANSLATIONS } from "../../i18n/translations";
import { SERVICES_DATA } from "../../data/services";
import { PRODUCT_CATEGORIES } from "../../data/productCategories";
import { useCatalog } from "../../context/CatalogContext";

interface NavbarProps {
  onOpenSearch: () => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuChange?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  isMobileMenuOpen: externalMobileMenuOpen,
  onMobileMenuChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"brands" | "products" | "services" | null>(null);
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const mobileMenuOpen = Boolean(externalMobileMenuOpen || internalMobileMenuOpen);
  const setMobileMenuOpen = (open: boolean) => {
    setInternalMobileMenuOpen(open);
    onMobileMenuChange?.(open);
  };
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
  const [activeBrandCategory, setActiveBrandCategory] = useState<string>("networking");
  const [activeProductCategory, setActiveProductCategory] = useState<string>("networking");

  const location = useLocation();
  const { totalItemsCount, setIsEnquiryModalOpen, lastAddedItem } = useCart();
  const { language, isRTL, dict, formatPath } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Translation helpers
  const getCatName = (catId: string, fallback: string) =>
    CATEGORY_TRANSLATIONS[language]?.[catId]?.name || fallback;
  const getCatHeadline = (catId: string, fallback: string) =>
    CATEGORY_TRANSLATIONS[language]?.[catId]?.headline || fallback;
  const getSvcTitle = (svcId: string, fallback: string) =>
    SERVICE_TRANSLATIONS[language]?.[svcId]?.title || fallback;
  const getSvcDesc = (svcId: string, fallback: string) =>
    SERVICE_TRANSLATIONS[language]?.[svcId]?.shortDescription || fallback;

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setMobileSubMenu(null);
  }, [location.pathname]);

  // Handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.about, href: "/about" },
    { label: dict.nav.services, href: "/services", hasDropdown: "services" as const },
    { label: dict.nav.products, href: "/products", hasDropdown: "products" as const },
    { label: dict.nav.brands, href: "/brands", hasDropdown: "brands" as const },
    { label: dict.nav.projects, href: "/projects" },
    { label: dict.nav.gallery, href: "/gallery" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  // Filtered brands for active category in mega menu
  const { products, brands, categories } = useCatalog();

  const brandsForActiveCategory = brands.filter((b) =>
    b.categoryIds.includes(activeBrandCategory)
  );

  // Active product category details
  const selectedProductCat = categories.find((c) => c.id === activeProductCategory) || categories[0];
  const productsForActiveCategory = products.filter((p) => p.categoryId === activeProductCategory);

  return (
    <header
      ref={dropdownRef}
      className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white/80 backdrop-blur-md border-b ${
        isScrolled
          ? "border-slate-200/90 shadow-xs"
          : "border-slate-200/80"
      }`}
    >
      {/* Top Brand Iridescent Theme Gradient Bar */}
      <div className="h-1 w-full theme-gradient-bar" />

      {/* Main Bar: Horizontal Navbar on Laptop/Desktop (>= 1024px), Compact Header with Sidebar Trigger on Mobile (< 1024px) */}
      <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 lg:gap-4">
        {/* Zone 1: DEYSLA Brand Wordmark / Official Logo */}
        <div className="flex items-center shrink-0 min-w-0">
          <Link
            to={formatPath("/")}
            className="inline-flex items-center focus:outline-hidden py-1"
            aria-label="DEYSLA IT Solutions Homepage"
          >
            <img
              src="/assets/logo.png"
              alt="DEYSLA IT SOLUTIONS"
              className="h-8 xs:h-8.5 sm:h-9 lg:h-9.5 xl:h-10 w-auto max-w-[160px] xs:max-w-[200px] sm:max-w-[240px] lg:max-w-none object-contain transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Zone 2: Navigation Links & Mega Menus (Centered on Laptop & Desktop screens >= 1024px) */}
        <nav className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-auto gap-0.5 xl:gap-1.5 shrink min-w-0">
          {navLinks.map((link) => {
            const cleanCurrent = location.pathname.replace(/^\/(en|ar)/, "") || "/";
            const isActive =
              link.href === "/"
                ? cleanCurrent === "/"
                : cleanCurrent.startsWith(link.href);

            if (link.hasDropdown) {
              const isDropdownOpen = activeDropdown === link.hasDropdown;
              return (
                <div key={link.label} className="relative inline-flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDropdown(isDropdownOpen ? null : link.hasDropdown)
                    }
                    onMouseEnter={() => setActiveDropdown(link.hasDropdown)}
                    className={`inline-flex items-center justify-center gap-1 h-9 xl:h-10 px-2 xl:px-2.5 2xl:px-3 text-[13px] xl:text-[13.5px] 2xl:text-[14.5px] font-semibold rounded-lg transition-all whitespace-nowrap focus:outline-hidden cursor-pointer ${
                      isActive || isDropdownOpen
                        ? "text-[#ff5e00] bg-orange-50/80 font-bold border border-orange-200/70 shadow-2xs"
                        : "text-neutral-700 hover:text-[#ff5e00] hover:bg-orange-50/40"
                    }`}
                    aria-expanded={isDropdownOpen}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180 text-[#ff5e00]" : "text-neutral-400 group-hover:text-[#ff5e00]"
                      }`}
                    />
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                to={formatPath(link.href)}
                onMouseEnter={() => setActiveDropdown(null)}
                className={`inline-flex items-center justify-center h-9 xl:h-10 px-2 xl:px-2.5 2xl:px-3 text-[13px] xl:text-[13.5px] 2xl:text-[14.5px] font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? "text-[#ff5e00] bg-orange-50/80 font-bold border border-orange-200/70 shadow-2xs"
                    : "text-neutral-700 hover:text-[#ff5e00] hover:bg-orange-50/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Search, Quote Cart, Language Switcher, and Mobile Sidebar Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2 xl:gap-2.5 shrink-0">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 lg:px-2.5 xl:px-3 text-xs sm:text-sm font-medium text-neutral-800 hover:text-[#ff5e00] bg-neutral-100 hover:bg-orange-50/60 hover:border-orange-200 rounded-xl transition-all border border-neutral-200 shadow-2xs focus:outline-hidden cursor-pointer"
            title={dict.nav.search}
            aria-label={dict.nav.search}
          >
            <Search className="w-4 h-4 text-neutral-600 shrink-0" />
            <span className="hidden sm:inline lg:hidden xl:inline font-medium">{dict.nav.search}</span>
            <kbd className="hidden 2xl:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono text-neutral-500 bg-white rounded border border-neutral-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Polished Desktop Language Switcher */}
          <LanguageSwitcher variant="desktop" />

          {/* Product Enquiry Cart Button */}
          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="relative inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-3 sm:px-3.5 lg:px-3 xl:px-4 text-xs sm:text-sm font-bold text-white theme-button-primary active:opacity-90 rounded-xl shadow-xs hover:shadow-md transition-all focus:outline-hidden whitespace-nowrap cursor-pointer"
            aria-label={`${dict.nav.requestQuote} (${totalItemsCount})`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline lg:hidden xl:inline">{dict.nav.requestQuote}</span>
            <span className="hidden lg:inline xl:hidden">{dict.nav.requestQuote}</span>
            <span className="sm:hidden">{dict.nav.requestQuote}</span>
            {totalItemsCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 sm:px-1.5 bg-white text-[#ff5e00] text-[11px] sm:text-xs font-black rounded-full tabular-nums shadow-xs border border-orange-200">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Sidebar Menu Button (< 1024px) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMobileMenuOpen(true);
            }}
            className="w-10 h-10 inline-flex items-center justify-center text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/90 border border-slate-200 rounded-xl lg:hidden transition-all focus:outline-hidden cursor-pointer shrink-0 shadow-2xs active:scale-95"
            aria-label={dict.nav.openMenu}
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP & LAPTOP MEGA MENU: BRANDS (AZRA-Inspired Structured Layout)      */}
      {/* ========================================================================= */}
      {activeDropdown === "brands" && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-xl transition-all animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  DEYSLA Technology Brand Partners
                </h3>
                <p className="text-xs text-slate-500">
                  Leading global OEMs and certified manufacturers supported by DEYSLA engineering.
                </p>
              </div>
              <Link
                to={formatPath("/brands")}
                onClick={() => setActiveDropdown(null)}
                className="text-xs font-semibold text-black hover:text-neutral-700 flex items-center gap-1 group"
              >
                <span>{dict.nav.viewAllBrands}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl-flip transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Category Filter Column */}
              <div className="col-span-3 space-y-1 border-r border-slate-100 pr-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-3 mb-2">
                  {dict.nav.exploreCatalog}
                </span>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveBrandCategory(cat.id)}
                    onClick={() => setActiveBrandCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                      activeBrandCategory === cat.id
                        ? "bg-orange-50/70 text-orange-600 font-bold border-l-2 border-[#ff8c3a]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{getCatName(cat.id, cat.name)}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {brands.filter((b) => b.categoryIds.includes(cat.id)).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Brand Logo Grid Column */}
              <div className="col-span-9">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800">
                    {getCatName(activeBrandCategory, PRODUCT_CATEGORIES.find((c) => c.id === activeBrandCategory)?.name || "")}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {dict.nav.allBrands}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {brandsForActiveCategory.slice(0, 8).map((brand) => (
                    <Link
                      key={brand.id}
                      to={formatPath(`/brands/${brand.slug}`)}
                      onClick={() => setActiveDropdown(null)}
                      className="group p-3 rounded-xl border border-slate-200/80 hover:border-[#ff8c3a] hover:bg-orange-50/40 transition-all flex flex-col justify-between h-28 bg-white shadow-2xs"
                    >
                      <div className="h-12 w-full flex items-center justify-center p-1 bg-white">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="max-h-full max-w-full object-contain filter transition-all group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 group-hover:text-black truncate">
                          {brand.name}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-black rtl-flip transition-all shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DESKTOP & LAPTOP MEGA MENU: PRODUCTS (8 Categories + Sub-Product Types)  */}
      {/* ========================================================================= */}
      {activeDropdown === "products" && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-xl transition-all animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {dict.nav.products}
                </h3>
                <p className="text-xs text-slate-500">
                  {dict.home.heroSubtitle}
                </p>
              </div>
              <Link
                to={formatPath("/products")}
                onClick={() => setActiveDropdown(null)}
                className="text-xs font-semibold text-black hover:text-neutral-700 flex items-center gap-1 group"
              >
                <span>{dict.nav.viewAllProducts}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl-flip transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Category List */}
              <div className="col-span-4 space-y-1 border-r border-slate-100 pr-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-3 mb-2">
                  {dict.nav.exploreCatalog}
                </span>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveProductCategory(cat.id)}
                    onClick={() => setActiveProductCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                      activeProductCategory === cat.id
                        ? "bg-orange-50/70 text-orange-600 font-bold border-l-2 border-[#ff8c3a]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <img src={cat.icon} alt="" className="w-5 h-5 object-contain shrink-0" />
                    <span className="truncate flex-1">{getCatName(cat.id, cat.name)}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {products.filter((p) => p.categoryId === cat.id).length} types
                    </span>
                  </button>
                ))}
              </div>

              {/* Sub-Products Grid */}
              <div className="col-span-8 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {getCatName(selectedProductCat.id, selectedProductCat.name)}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xl">
                      {getCatHeadline(selectedProductCat.id, selectedProductCat.headline)}
                    </p>
                  </div>
                  <Link
                    to={formatPath(`/products/${selectedProductCat.slug}`)}
                    onClick={() => setActiveDropdown(null)}
                    className="text-xs font-semibold text-black hover:text-neutral-700 whitespace-nowrap flex items-center gap-1"
                  >
                    <span>{dict.common.viewAll}</span>
                    <ArrowRight className="w-3 h-3 rtl-flip" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {productsForActiveCategory.map((prod) => (
                    <Link
                      key={prod.id}
                      to={formatPath(`/products/${selectedProductCat.slug}/${prod.slug}`)}
                      onClick={() => setActiveDropdown(null)}
                      className="group p-3 rounded-xl border border-slate-200/80 hover:border-[#ff8c3a] hover:bg-orange-50/40 transition-all flex items-start gap-3 bg-white"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={prod.image || selectedProductCat.icon}
                          alt={prod.imageAlt || prod.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = selectedProductCat.icon;
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-900 group-hover:text-black truncate">
                          {prod.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {prod.subcategories.slice(0, 3).join(" · ")}
                        </p>
                        <span className="text-[10px] text-black font-semibold inline-flex items-center gap-1 mt-1">
                          {dict.nav.requestQuote} <ArrowRight className="w-2.5 h-2.5 rtl-flip" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DESKTOP & LAPTOP DROPDOWN: SERVICES (10 DEYSLA Services)                  */}
      {/* ========================================================================= */}
      {activeDropdown === "services" && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-xl transition-all animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {dict.nav.services}
                </h3>
                <p className="text-xs text-slate-500">
                  {dict.footer.servicesDesc}
                </p>
              </div>
              <Link
                to={formatPath("/services")}
                onClick={() => setActiveDropdown(null)}
                className="text-xs font-semibold text-black hover:text-neutral-700 flex items-center gap-1 group"
              >
                <span>{dict.nav.viewAllServices}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl-flip transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {SERVICES_DATA.map((svc) => (
                <Link
                  key={svc.id}
                  to={formatPath(`/services/${svc.slug}`)}
                  onClick={() => setActiveDropdown(null)}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-[#ff8c3a] hover:bg-orange-50/40 transition-all flex flex-col justify-between group bg-white"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-black bg-neutral-100 px-1.5 py-0.5 rounded">
                      {svc.number}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-black mt-2">
                      {getSvcTitle(svc.id, svc.title)}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {getSvcDesc(svc.id, svc.shortDescription)}
                    </p>
                  </div>
                  <span className="text-[11px] text-black font-semibold mt-3 flex items-center gap-1">
                    {dict.common.learnMore} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 rtl-flip transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE & TABLET OFF-CANVAS SIDEBAR (< 1024px) (Rendered in document.body)  */}
      {/* ========================================================================= */}
      {typeof document !== "undefined" && createPortal(
        <div
          className={`fixed inset-0 z-[99999] lg:hidden flex ${
            isRTL ? "justify-start" : "justify-end"
          } transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.openMenu}
        >
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Off-Canvas Sliding Sidebar Panel */}
          <aside
            className={`relative z-20 ${
              isRTL ? "mr-auto border-r" : "ml-auto border-l"
            } w-[86vw] max-w-xs sm:max-w-sm bg-white h-full max-h-screen shadow-2xl flex flex-col border-slate-200 overflow-hidden transform transition-transform duration-300 ease-out ${
              mobileMenuOpen
                ? "translate-x-0"
                : isRTL
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            {/* Top Brand Iridescent Theme Gradient Bar */}
            <div className="h-1.5 w-full theme-gradient-bar shrink-0" />

          {/* Sidebar Top Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <Link
              to={formatPath("/")}
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center"
            >
              <img
                src="/assets/logo.png"
                alt="DEYSLA"
                className="h-7 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:border-neutral-400 shadow-2xs transition-colors cursor-pointer"
                aria-label={dict.nav.search}
                title={dict.nav.search}
              >
                <Search className="w-4 h-4 text-slate-700" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:border-neutral-400 shadow-2xs transition-colors cursor-pointer"
                aria-label={dict.nav.closeMenu}
              >
                <X className="w-5 h-5 text-slate-800" />
              </button>
            </div>
          </div>

          {/* Language Switcher in Mobile Drawer */}
          <div className="px-3.5 py-2.5 border-b border-slate-200 bg-white">
            <LanguageSwitcher variant="mobile" />
          </div>

          {/* Quick RFQ Quote Bar inside Mobile Sidebar */}
          <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-black shrink-0" />
              <span className="text-xs font-semibold text-neutral-700">
                {dict.cart.title}: <strong className="text-black">{totalItemsCount} {totalItemsCount === 1 ? dict.nav.itemSingular : dict.nav.itemsPlural}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsEnquiryModalOpen(true);
              }}
              className="px-3 py-1 text-[11px] font-bold text-white theme-button-primary rounded-lg shadow-2xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span>{dict.cart.viewFullCart}</span>
              <ArrowRight className="w-3 h-3 rtl-flip" />
            </button>
          </div>

          {/* Sidebar Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Quick Navigation Links */}
            <div className="space-y-1">
              <Link
                to={formatPath("/")}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
                  location.pathname === "/" || location.pathname === "/en" || location.pathname === "/ar"
                    ? "bg-orange-50/70 text-orange-600 font-bold border-l-2 border-[#ff8c3a] shadow-2xs"
                    : "text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                <Home className="w-4 h-4 text-[#ff8c3a] shrink-0" />
                <span>{dict.nav.home}</span>
              </Link>

              <Link
                to={formatPath("/about")}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
                  location.pathname.includes("/about")
                    ? "bg-orange-50/70 text-orange-600 font-bold border-l-2 border-[#ff8c3a] shadow-2xs"
                    : "text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                <Building2 className="w-4 h-4 text-[#ff8c3a] shrink-0" />
                <span>{dict.nav.about}</span>
              </Link>

              {/* Services Accordion Item */}
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileSubMenu(mobileSubMenu === "services" ? null : "services")}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-black shrink-0" />
                    <span>{dict.nav.services}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-black bg-neutral-100 px-1.5 py-0.5 rounded-full border border-neutral-300">
                      {SERVICES_DATA.length}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        mobileSubMenu === "services" ? "rotate-180 text-black" : ""
                      }`}
                    />
                  </div>
                </button>
                {mobileSubMenu === "services" && (
                  <div className="px-3 pb-3 pt-1 space-y-1 bg-neutral-50 border-t border-neutral-200">
                    <Link
                      to={formatPath("/services")}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-black hover:underline"
                    >
                      <span>{dict.nav.viewAllServices}</span>
                      <ArrowRight className="w-3 h-3 rtl-flip" />
                    </Link>
                    <div className="grid grid-cols-1 gap-1">
                      {SERVICES_DATA.map((s) => (
                        <Link
                          key={s.id}
                          to={formatPath(`/services/${s.slug}`)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-3 py-1.5 text-xs text-neutral-700 hover:text-black hover:bg-white rounded-lg transition-colors truncate block"
                        >
                          <span className="font-mono text-neutral-400 mr-1.5">{s.number}.</span>
                          {getSvcTitle(s.id, s.title)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Products Accordion Item */}
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileSubMenu(mobileSubMenu === "products" ? null : "products")}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-black shrink-0" />
                    <span>{dict.nav.products}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-black bg-neutral-100 px-1.5 py-0.5 rounded-full border border-neutral-300">
                      {PRODUCT_CATEGORIES.length}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        mobileSubMenu === "products" ? "rotate-180 text-black" : ""
                      }`}
                    />
                  </div>
                </button>
                {mobileSubMenu === "products" && (
                  <div className="px-3 pb-3 pt-1 space-y-1 bg-neutral-50 border-t border-neutral-200">
                    <Link
                      to={formatPath("/products")}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-black hover:underline"
                    >
                      <span>{dict.nav.viewAllProducts}</span>
                      <ArrowRight className="w-3 h-3 rtl-flip" />
                    </Link>
                    <div className="grid grid-cols-1 gap-1">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          to={formatPath(`/products/${cat.slug}`)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-3 py-1.5 text-xs text-neutral-700 hover:text-black hover:bg-white rounded-lg transition-colors truncate block"
                        >
                          {getCatName(cat.id, cat.name)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Brands Accordion Item */}
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileSubMenu(mobileSubMenu === "brands" ? null : "brands")}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                    <span>{dict.nav.brands}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-full border border-neutral-200">
                      {brands.length}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        mobileSubMenu === "brands" ? "rotate-180 text-black" : ""
                      }`}
                    />
                  </div>
                </button>
                {mobileSubMenu === "brands" && (
                  <div className="px-3 pb-3 pt-1 space-y-1 bg-neutral-50 border-t border-neutral-200">
                    <Link
                      to={formatPath("/brands")}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-black hover:underline"
                    >
                      <span>{dict.nav.viewAllBrands}</span>
                      <ArrowRight className="w-3 h-3 rtl-flip" />
                    </Link>
                    <div className="grid grid-cols-2 gap-1.5 py-1">
                      {brands.slice(0, 12).map((b) => (
                        <Link
                          key={b.id}
                          to={formatPath(`/brands/${b.slug}`)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-2.5 py-1.5 text-xs text-neutral-700 hover:text-black hover:bg-white rounded-lg transition-colors truncate block"
                        >
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to={formatPath("/projects")}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
                  location.pathname.includes("/projects")
                    ? "bg-orange-50/70 text-orange-600 font-bold border-l-2 border-[#ff8c3a] shadow-2xs"
                    : "text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#ff8c3a] shrink-0" />
                <span>{dict.nav.projects}</span>
              </Link>

              <Link
                to={formatPath("/gallery")}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
                  location.pathname.includes("/gallery")
                    ? "bg-orange-50/70 text-orange-600 font-bold border-l-2 border-[#ff8c3a] shadow-2xs"
                    : "text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                <ImageIcon className="w-4 h-4 text-[#ff8c3a] shrink-0" />
                <span>{dict.nav.gallery}</span>
              </Link>

              <Link
                to={formatPath("/contact")}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
                  location.pathname.includes("/contact")
                    ? "bg-orange-50/70 text-orange-600 font-bold border-l-2 border-[#ff8c3a] shadow-2xs"
                    : "text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                <PhoneCall className="w-4 h-4 text-[#ff8c3a] shrink-0" />
                <span>{dict.nav.contact}</span>
              </Link>
            </div>
          </div>

          {/* Sidebar Bottom Info & Direct Actions */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <a
                href="tel:+966544553670"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs font-semibold text-neutral-800 hover:text-orange-600 hover:border-[#ff8c3a] shadow-2xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#ff8c3a]" />
                <span className="isolate-ltr">+966 54 455 3670</span>
              </a>
              <a
                href="mailto:info@deysla.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs font-semibold text-neutral-800 hover:text-orange-600 hover:border-[#ff8c3a] shadow-2xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#ff8c3a]" />
                <span className="isolate-ltr">info@deysla.com</span>
              </a>
            </div>
            <p className="text-[11px] font-semibold text-neutral-600">
              DEYSLA IT Solutions &bull; Dammam, KSA
            </p>
            <p className="text-[10px] text-neutral-400">
              Engineering &bull; Networking &bull; Enterprise Solutions
            </p>
          </div>
        </aside>
      </div>,
      document.body
    )}

      {/* Floating Toast Notification when an item is added to Quote */}
      {lastAddedItem && (
        <div className={`fixed bottom-20 ${isRTL ? "left-6" : "right-6"} z-50 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-3 rounded-xl shadow-xl border border-orange-200/80 flex items-center gap-3 animate-in slide-in-from-bottom duration-200`}>
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">{dict.cart.addedToQuote}</p>
            <p className="text-[11px] text-slate-500 truncate max-w-xs">{lastAddedItem}</p>
          </div>
          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="ms-2 text-xs text-[#ff8c3a] font-bold hover:underline cursor-pointer"
          >
            {dict.cart.reviewQuote}
          </button>
        </div>
      )}
    </header>
  );
};
