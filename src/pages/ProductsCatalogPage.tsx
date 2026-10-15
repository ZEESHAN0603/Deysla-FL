import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCatalog } from "../context/CatalogContext";
import { CATEGORY_TRANSLATIONS } from "../i18n/translations";

export const ProductsCatalogPage: React.FC = () => {
  const { dict, lang, formatPath } = useLanguage();
  const { products, categories } = useCatalog();
  const [searchTerm, setSearchTerm] = useState("");

  const getCatName = (catId: string, fallback: string) => {
    return CATEGORY_TRANSLATIONS[lang]?.[catId]?.name || fallback;
  };

  const getCatDesc = (catId: string, fallback: string) => {
    return CATEGORY_TRANSLATIONS[lang]?.[catId]?.description || fallback;
  };

  const filteredCategories = categories.filter((cat) => {
    const term = searchTerm.toLowerCase();
    const catName = getCatName(cat.id, cat.name).toLowerCase();
    const inName = catName.includes(term) || cat.name.toLowerCase().includes(term);
    const inDesc = getCatDesc(cat.id, cat.description).toLowerCase().includes(term);
    const inTypes = products.some(
      (p) => p.categoryId === cat.id && p.name.toLowerCase().includes(term)
    );
    return inName || inDesc || inTypes;
  });


  return (
    <div className="w-full bg-white/70 backdrop-blur-xs">
      {/* Page Hero */}
      <section className="relative theme-hero-luminous text-slate-900 py-10 sm:py-14 lg:py-16 border-b border-slate-200/80 overflow-hidden">
        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />

        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 theme-grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>{lang === 'ar' ? 'الأجهزة والمعدات والبنية التحتية الفيزيائية' : 'HARDWARE & PHYSICAL INFRASTRUCTURE'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 max-w-3xl leading-tight">
            {lang === 'ar' ? (
              <>كتالوج منتجات <span className="theme-text-gradient">ديسلا</span> المعتمدة</>
            ) : (
              <>DEYSLA <span className="theme-text-gradient">Products</span> Catalogue</>
            )}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 max-w-2xl leading-relaxed">
            {dict.products.subtitle}
          </p>

          {/* Quick Search */}
          <div className="pt-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'ar' ? 'البحث عن فئة أو نوع المعدات...' : 'Filter by product category or hardware type...'}
                className="w-full bg-white text-slate-900 text-xs sm:text-sm ps-10 pe-4 py-3 rounded-xl border border-slate-200 shadow-2xs focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-200/60 transition-all"
                dir="auto"
              />
            </div>
          </div>

          {/* Quality Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {lang === 'ar' ? 'أجهزة أصلية معتمدة 100%' : '100% Genuine OEM Hardware'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              {lang === 'ar' ? 'مطابق لمواصفات ساسو وهيئة الاتصالات' : 'SASO & CITC Compliant'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {lang === 'ar' ? 'ضمان المصنع المعتمد' : 'Official Warranty'}
            </span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8 sm:py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredCategories.map((cat) => {
              const types = products.filter((p) => p.categoryId === cat.id);
              const catName = getCatName(cat.id, cat.name);
              const catDesc = getCatDesc(cat.id, cat.description);

              return (
                <div
                  key={cat.id}
                  className="p-4 sm:p-5 rounded-xl border border-neutral-200 bg-white hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Category Icon & Badge Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200 p-2 flex items-center justify-center group-hover:border-black transition-colors shadow-2xs">
                          <img src={cat.icon} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">
                            {dict.products.categoriesBadge}
                          </span>
                          <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                            {catName}
                          </h2>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-black bg-neutral-100 border border-neutral-300 px-2.5 py-1 rounded-md shadow-2xs">
                        {types.length} {lang === 'ar' ? 'فئة' : 'Types'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {catDesc}
                    </p>

                    {/* Sub-Product Types Grid */}
                    <div className="pt-2.5 border-t border-neutral-100">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                        {lang === 'ar' ? 'الأنظمة والأنواع المتاحة:' : 'Product Types Available:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {types.map((t) => (
                          <Link
                            key={t.id}
                            to={formatPath(`/products/${cat.slug}/${t.slug}`)}
                            className="p-2 rounded-lg border border-neutral-200 hover:border-black hover:bg-neutral-50 text-xs font-semibold text-neutral-800 hover:text-black transition-colors flex items-center justify-between group/link"
                          >
                            <span className="truncate">{t.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover/link:text-black group-hover/link:translate-x-0.5 rtl:group-hover/link:-translate-x-0.5 rtl-flip transition-transform shrink-0 ms-1" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <Link
                      to={formatPath(`/products/${cat.slug}`)}
                      className="text-xs font-bold text-black hover:underline flex items-center gap-1.5 group/btn"
                    >
                      <span>{lang === 'ar' ? 'استعراض تفاصيل الفئة' : 'Explore Category Overview'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl-flip group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to={formatPath("/contact")}
                      className="text-xs text-neutral-500 hover:text-black font-medium"
                    >
                      {lang === 'ar' ? 'طلب تسعير جدول الكميات (BOQ) ←' : 'Request Category BOQ →'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
