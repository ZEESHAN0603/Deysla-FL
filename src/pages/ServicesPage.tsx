import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { SERVICES_DATA } from "../data/services";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { SERVICE_TRANSLATIONS } from "../i18n/translations";

export const ServicesPage: React.FC = () => {
  const { addItem, setIsEnquiryModalOpen } = useCart();
  const { dict, lang, formatPath } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const categories = [
    { id: "all", labelEn: "All Services", labelAr: "كافة الخدمات" },
    { id: "security-systems", labelEn: "Security & Surveillance", labelAr: "الأمن والمراقبة" },
    { id: "networking", labelEn: "Networking & Cabling", labelAr: "الشبكات والتمديدات" },
    { id: "servers-and-computing", labelEn: "Compute & Cloud", labelAr: "الحوسبة والسحابة" },
    { id: "industrial-automation", labelEn: "Industrial & SCADA", labelAr: "الأنظمة الصناعية و SCADA" },
    { id: "communications", labelEn: "VoIP Telephony", labelAr: "اتصالات VoIP" },
  ];

  const getServiceTitle = (id: string, fallback: string) => {
    return SERVICE_TRANSLATIONS[lang]?.[id]?.title || fallback;
  };

  const getServiceDesc = (id: string, fallback: string) => {
    return SERVICE_TRANSLATIONS[lang]?.[id]?.shortDescription || fallback;
  };

  const filteredServices = SERVICES_DATA.filter((service) => {
    if (selectedFilter === "all") return true;
    return service.relevantCategories.includes(selectedFilter);
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to={formatPath("/")} className="hover:text-sky-700 transition-colors">
              {dict.nav.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <span className="font-semibold text-slate-900">{dict.nav.services}</span>
          </nav>
        </div>
      </div>

      {/* Page Hero Header */}
      <section className="relative bg-slate-950 text-white py-14 sm:py-20 lg:py-24 border-b border-slate-800 overflow-hidden">
        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />

        {/* Realistic Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <picture>
            <source srcSet="/assets/services/hero-all-services.webp" type="image/webp" />
            <img
              src="/assets/services/hero-all-services.jpg"
              alt="DEYSLA Enterprise Technology Solutions Operations Center"
              className="w-full h-full object-cover object-center scale-100 contrast-105 brightness-100 transition-transform duration-1000"
            />
          </picture>

          {/* Directional Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/70 to-slate-950/30 lg:to-slate-950/15 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 pointer-events-none" />
          
          {/* Subtle Cyber Grid & Ambient Cyan Glow */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(56,189,248,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.15)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgba(14,165,233,0.18),transparent_70%)] pointer-events-none" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl lg:max-w-4xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="uppercase tracking-widest">
                {lang === 'ar' ? 'محفظة حلول المؤسسات · 10 تخصصات هندسية' : 'Enterprise Solutions Portfolio · 10 Specialized Practices'}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              {lang === 'ar' ? (
                <>خدمات تقنية تحقق <span className="theme-text-gradient-light">نتائج ملموسة</span></>
              ) : (
                <>Technology Services That Drive <span className="theme-text-gradient-light">Measurable Results</span></>
              )}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed drop-shadow-xs">
              {dict.services.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'ar' ? '10 تخصصات هندسية معتمدة' : '10 Verified Practice Domains'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{lang === 'ar' ? 'شراكات تصنيع مباشرة من الفئة الأولى' : 'Tier-1 Manufacturer Direct Partners'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>{lang === 'ar' ? 'دعم هندسي 24/7 باتفاقيات SLA' : '24/7 SLA Engineering Support'}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-sky-500 via-sky-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
              >
                <span>{dict.services.requestQuoteForService}</span>
                <ArrowRight className="w-4 h-4 rtl-flip" />
              </button>
              <Link
                to={formatPath("/contact")}
                className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 text-xs font-semibold rounded-xl transition-all shadow-sm backdrop-blur-md"
              >
                {dict.services.ctaButton}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          
          {/* Category Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    selectedFilter === cat.id
                      ? "bg-gradient-to-r from-sky-600 via-sky-500 to-amber-500 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {lang === 'ar' ? cat.labelAr : cat.labelEn}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-slate-500">
              {lang === 'ar'
                ? `عرض ${filteredServices.length} من أصل ${SERVICES_DATA.length} مجالات`
                : `Showing ${filteredServices.length} of ${SERVICES_DATA.length} practices`}
            </span>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 lg:gap-10">
            {filteredServices.map((service) => {
              const svcTitle = getServiceTitle(service.id, service.title);
              const svcDesc = getServiceDesc(service.id, service.shortDescription);

              return (
                <div
                  key={service.id}
                  className="group rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Service Card Header */}
                  <div className="relative h-44 sm:h-52 overflow-hidden bg-slate-900 border-b border-slate-800">
                    <picture>
                      <source srcSet={`/assets/services/hero-${service.slug}.webp`} type="image/webp" />
                      <img
                        src={`/assets/services/hero-${service.slug}.jpg`}
                        alt={`${svcTitle} Enterprise Practice Infrastructure`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/assets/services/hero-all-services.jpg";
                        }}
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/30" />

                    {/* Header Content */}
                    <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/35 isolate-ltr">
                          {lang === 'ar' ? `المجال ${service.number}` : `PRACTICE ${service.number}`}
                        </span>
                        <span className="text-[10px] font-semibold text-cyan-300 bg-sky-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-sky-500/30">
                          {service.subServices.length} {lang === 'ar' ? 'إمكانيات' : 'Capabilities'}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors drop-shadow-md">
                          {svcTitle}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-7 flex flex-col justify-between flex-1 space-y-4 sm:space-y-5">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {svcDesc}
                    </p>

                    {/* Subservices List */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {lang === 'ar' ? 'نطاق العمل الهندسي الرئيسي:' : 'Core Engineering Scope:'}
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {service.subServices.slice(0, 4).map((sub) => (
                          <div key={sub} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-5 mt-auto border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <Link
                        to={formatPath(`/services/${service.slug}`)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 group/link"
                      >
                        <span>{lang === 'ar' ? 'استعراض تفاصيل الخدمة' : 'Explore Practice Details'}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl-flip group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform" />
                      </Link>

                      <button
                        onClick={() => {
                          addItem({
                            id: `service-${service.id}`,
                            name: `${svcTitle} Scope Request`,
                            categoryName: "Service Consultation",
                          });
                          setIsEnquiryModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200 text-center cursor-pointer"
                      >
                        {lang === 'ar' ? 'طلب تسعير واستشارة' : 'Enquire on Scope'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Turnkey Architecture Assistance Banner */}
          <div className="p-5 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                {lang === 'ar' ? 'استشارات التكامل المخصصة' : 'Custom Integration Consulting'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                {dict.services.ctaTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {dict.services.ctaSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={formatPath("/contact")}
                className="px-5 py-3 theme-button-primary text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02]"
              >
                <span>{dict.services.ctaButton}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
