import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Search, ShieldCheck, Layers, Building, Sparkles } from "lucide-react";
import { Brand } from "../data/brands";
import { useLanguage } from "../context/LanguageContext";
import { useCatalog } from "../context/CatalogContext";

export const BrandsCatalogPage: React.FC = () => {
  const { language, formatPath } = useLanguage();
  const { brands, products } = useCatalog();
  const isAr = language === "ar";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categoriesFilter = [
    { id: "all", label: isAr ? "جميع العلامات التجارية" : "All Brands" },
    { id: "networking", label: isAr ? "الشبكات والربط" : "Networking" },
    { id: "security-systems", label: isAr ? "الأنظمة الأمنية" : "Security Systems" },
    { id: "structured-cabling", label: isAr ? "التمديدات الهيكلية" : "Structured Cabling" },
    { id: "communications", label: isAr ? "الاتصالات المؤسسية" : "Communications" },
    { id: "digital-displays-and-kiosks", label: isAr ? "الشاشات الرقمية والأكشاك" : "Displays & Kiosks" },
    { id: "servers-and-computing", label: isAr ? "الخوادم والحوسبة" : "Servers & Computing" },
    { id: "industrial-automation", label: isAr ? "الأتمتة الصناعية" : "Industrial Automation" },
    { id: "fire-and-safety-systems", label: isAr ? "أنظمة السلامة والحرائق" : "Fire & Safety" },
  ];

  const filteredBrands = brands.filter((brand) => {
    const matchesCategory =
      selectedCategory === "all" || brand.categoryIds.includes(selectedCategory);
    const matchesSearch =
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to={formatPath("/")} className="hover:text-sky-700 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <span className="font-semibold text-slate-900">
              {isAr ? "العلامات التجارية" : "Brands"}
            </span>
          </nav>
        </div>
      </div>

      {/* Page Hero Header */}
      <section className="relative theme-hero-luminous text-slate-900 py-14 sm:py-20 lg:py-24 border-b border-slate-200/80 overflow-hidden">
        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />

        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 theme-grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>
              {isAr ? "منظومة الشركات المصنعة العالمية" : "GLOBAL OEM ECOSYSTEM"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-3xl leading-tight">
            {isAr ? (
              <>شركاؤنا من <span className="theme-text-gradient">العلامات التجارية التقنية</span></>
            ) : (
              <>Our Technology <span className="theme-text-gradient">Brand Partners</span></>
            )}
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {isAr
              ? "تقنية موثوقة. حلول مجربة. تعقد ديسلا شراكات مع كبرى الشركات المصنعة العالمية لتوريد أجهزة ومعدات مؤسسية أصلية، كابلات هيكلية، أجهزة أمان سيبراني، وأنظمة تحكم أوتوماتيكية في المملكة العربية السعودية ودول الخليج العربي."
              : "Trusted Technology. Proven Solutions. DEYSLA partners with top-tier global manufacturers to deliver authenticated enterprise hardware, structured cabling, cybersecurity appliances, and automation control systems throughout Saudi Arabia and the GCC."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isAr ? "أكثر من 40 تحالفاً مع شركات عالمية" : "40+ Global Manufacturer Alliances"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>
                {isAr ? "أجهزة أصلية معتمدة 100% بضمان المصنع" : "100% Genuine Warrantied Hardware"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>
                {isAr ? "توريد معتمد عبر قنوات التوزيع الخليجية" : "Authorized GCC Channel Supply"}
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="pt-4 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  isAr
                    ? "ابحث عن اسم العلامة التجارية أو المجال التقني..."
                    : "Search brand name or technology domain..."
                }
                className="w-full bg-white text-slate-900 text-xs ps-10 pe-4 py-3 rounded-xl border border-slate-200 shadow-2xs focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Brand Cards Grid */}
      <section className="py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Category Filter Pills & Counter */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categoriesFilter.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-sky-600 via-sky-500 to-amber-500 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-slate-500">
              {isAr
                ? `عرض ${filteredBrands.length} من أصل ${brands.length} شريكاً معتمداً`
                : `Showing ${filteredBrands.length} of ${brands.length} partners`}
            </span>
          </div>

          {/* Brand Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredBrands.map((brand) => {
              const supportedProducts = products.filter((p) =>
                brand.productIds.includes(p.id)
              );

              return (
                <div
                  key={brand.id}
                  className="rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Brand Logo Header Container */}
                  <div className="relative w-full h-36 sm:h-40 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-6 group-hover:bg-blue-50/30 transition-colors">
                    {/* Centered Brand Logo */}
                    <div className="h-16 w-36 sm:w-44 flex items-center justify-center p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>

                    {/* Origin Tag */}
                    {brand.origin && (
                      <div className="absolute top-3 end-3">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs isolate-ltr" dir="ltr">
                          {brand.origin}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight mb-2">
                        {brand.name}
                      </h2>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {brand.description}
                      </p>
                    </div>

                    {/* Products We Provide from this Brand */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {isAr ? "خطوط الأجهزة والمعدات:" : "Hardware Lines:"}
                      </span>
                      {supportedProducts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {supportedProducts.slice(0, 2).map((p) => (
                            <span
                              key={p.id}
                              className="text-[11px] font-medium text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100"
                            >
                              {p.name}
                            </span>
                          ))}
                          {supportedProducts.length > 2 && (
                            <span className="text-[10px] text-slate-400 italic self-center ps-1">
                              +{supportedProducts.length - 2} {isAr ? "المزيد" : "more"}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded block">
                          {isAr ? "محفظة القنوات المؤسسية المعتمدة" : "Enterprise Channel Portfolio"}
                        </span>
                      )}
                    </div>

                    {/* Card Link */}
                    <div className="pt-4 mt-auto border-t border-slate-100">
                      <Link
                        to={formatPath(`/brands/${brand.slug}`)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center justify-between group-hover:text-blue-600 transition-colors"
                      >
                        <span>{isAr ? "استكشاف منتجات العلامة التجارية" : "Explore Brand Portfolio"}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl-flip group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBrands.length === 0 && (
            <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              <p className="text-base font-semibold text-slate-800">
                {isAr ? "لا توجد علامات تجارية تطابق خيارات البحث" : "No brands match your filter"}
              </p>
              <p className="text-xs mt-1">
                {isAr
                  ? "يرجى إعادة تعيين خيارات التصفية أو كلمة البحث."
                  : "Try resetting the category filter or search query."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sourcing CTA */}
      <section className="py-12 sm:py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            {isAr ? "توريد مباشر عبر قنوات المصنع المعتمدة" : "DIRECT OEM CHANNEL SOURCING"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {isAr ? "هل تبحث عن علامة تجارية محددة أو خط معدات معين؟" : "Looking for a Specific Brand or Hardware Line?"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            {isAr
              ? "تنسق ديسلا عمليات التوريد المباشر من المصنع، وتسجيل الضمان بالرقم التسلسلي، والنشر الميداني من مرافق التجهيز بالمنطقة الشرقية."
              : "DEYSLA coordinates manufacturer-direct procurement, serial warranty registration, and on-site deployment from our Eastern Province staging facilities."}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to={formatPath("/contact")}
              className="px-6 py-3 theme-button-primary text-white text-xs font-bold rounded-xl transition-all shadow-md hover:scale-[1.02]"
            >
              {isAr ? "طلب مقترح توريد مصنعي" : "REQUEST OEM PROPOSAL"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
