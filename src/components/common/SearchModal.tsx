import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Layers, ShieldCheck, Box, Briefcase, ChevronRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { CATEGORY_TRANSLATIONS, SERVICE_TRANSLATIONS } from "../../i18n/translations";
import { SERVICES_DATA } from "../../data/services";
import { PRODUCT_CATEGORIES } from "../../data/productCategories";
import { PRODUCTS_DATA } from "../../data/products";
import { BRANDS_DATA } from "../../data/brands";
import { PROJECTS_DATA } from "../../data/projects";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { language, dict, formatPath } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingServices = q
    ? SERVICES_DATA.filter((s) => {
        const arTitle = SERVICE_TRANSLATIONS.ar?.[s.id]?.title || "";
        const arDesc = SERVICE_TRANSLATIONS.ar?.[s.id]?.shortDescription || "";
        return (
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          arTitle.toLowerCase().includes(q) ||
          arDesc.toLowerCase().includes(q) ||
          s.subServices.some((sub) => sub.toLowerCase().includes(q))
        );
      })
    : [];

  const matchingCategories = q
    ? PRODUCT_CATEGORIES.filter((c) => {
        const arName = CATEGORY_TRANSLATIONS.ar?.[c.id]?.name || "";
        const arDesc = CATEGORY_TRANSLATIONS.ar?.[c.id]?.description || "";
        return (
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          arName.toLowerCase().includes(q) ||
          arDesc.toLowerCase().includes(q)
        );
      })
    : [];

  const matchingProducts = q
    ? PRODUCTS_DATA.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategories.some((sub) => sub.toLowerCase().includes(q))
      )
    : [];

  const matchingBrands = q
    ? BRANDS_DATA.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      )
    : [];

  const matchingProjects = q
    ? PROJECTS_DATA.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchingServices.length > 0 ||
    matchingCategories.length > 0 ||
    matchingProducts.length > 0 ||
    matchingBrands.length > 0 ||
    matchingProjects.length > 0;

  const handleSelect = (path: string) => {
    onClose();
    navigate(formatPath(path));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-24 px-3 sm:px-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="h-1 w-full theme-gradient-bar shrink-0" />

        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-white">
          <Search className="w-5 h-5 text-black shrink-0 me-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.nav.searchPlaceholder}
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors me-1 cursor-pointer"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-4 space-y-6">
          {!q ? (
            <div className="py-8 text-center">
              <p className="text-sm font-bold text-slate-800">
                {language === "ar" ? "اقتراحات بحث سريعة" : "Quick suggestions"}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {["Cisco Switches", "Cat6A Cabling", "Biometric Access", "Grandstream PBX", "Fortinet Firewall", "Schneider PLC"].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag.split(" ")[0])}
                      className="px-3 py-1.5 text-xs text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors font-semibold cursor-pointer"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-base font-medium text-slate-800">
                {language === "ar" ? `لم يتم العثور على نتائج لـ "${query}"` : `No results found for "${query}"`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {language === "ar"
                  ? "جرب البحث عن تصنيف مثل \"الشبكات\"، علامة تجارية مثل \"Dell\"، أو خدمة مثل \"الأمن السيبراني\"."
                  : 'Try searching for a category like "Networking", brand like "Dell", or service like "Cybersecurity".'}
              </p>
            </div>
          ) : (
            <>
              {/* Product Categories */}
              {matchingCategories.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {dict.nav.products} ({matchingCategories.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleSelect(`/products/${cat.slug}`)}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-black hover:bg-neutral-50 transition-colors text-start group cursor-pointer"
                      >
                        <img src={cat.icon} alt="" className="w-8 h-8 object-contain shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-black transition-colors truncate">
                            {CATEGORY_TRANSLATIONS[language]?.[cat.id]?.name || cat.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {CATEGORY_TRANSLATIONS[language]?.[cat.id]?.headline || cat.headline}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black shrink-0 rtl-flip" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Types */}
              {matchingProducts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Product Types ({matchingProducts.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchingProducts.slice(0, 6).map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => handleSelect(`/products/${prod.categoryId}/${prod.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                            <Box className="w-4 h-4 text-slate-600" />
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-medium text-slate-900 group-hover:text-black truncate">
                              {prod.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              In {prod.categoryName} · {prod.subcategories.slice(0, 3).join(", ")}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-black font-semibold whitespace-nowrap pl-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {matchingBrands.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Technology Brands ({matchingBrands.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {matchingBrands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => handleSelect(`/brands/${brand.slug}`)}
                        className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 hover:border-black hover:bg-neutral-50 transition-colors text-left group"
                      >
                        <div className="w-10 h-8 bg-white border border-slate-100 rounded flex items-center justify-center p-1 shrink-0">
                          <img
                            src={brand.logo}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="truncate min-w-0">
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-black truncate">
                            {brand.name}
                          </p>
                          <p className="text-[11px] text-slate-400 capitalize truncate">
                            {brand.categoryIds[0]?.replace("-", " ")}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {matchingServices.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Services &amp; Solutions ({matchingServices.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchingServices.map((svc) => (
                      <button
                        key={svc.id}
                        onClick={() => handleSelect(`/services/${svc.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-neutral-100 border border-neutral-200 text-black font-semibold text-xs flex items-center justify-center shrink-0">
                            {svc.number}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-medium text-slate-900 group-hover:text-black truncate">
                              {svc.title}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{svc.shortDescription}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {matchingProjects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Projects ({matchingProjects.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchingProjects.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => handleSelect(`/projects/${proj.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                            <Briefcase className="w-4 h-4 text-slate-600" />
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-medium text-slate-900 group-hover:text-black truncate">
                              {proj.title}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {proj.category} · {proj.location}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
