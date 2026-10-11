import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, Box, Send, Layers } from "lucide-react";
import { SERVICES_DATA } from "../data/services";
import { PRODUCT_CATEGORIES } from "../data/productCategories";
import { BRANDS_DATA } from "../data/brands";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { SERVICE_TRANSLATIONS, CATEGORY_TRANSLATIONS } from "../i18n/translations";

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, setIsEnquiryModalOpen } = useCart();
  const { language, formatPath } = useLanguage();
  const isAr = language === "ar";

  const service = SERVICES_DATA.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to={formatPath("/services")} replace />;
  }

  const sTrans = isAr ? SERVICE_TRANSLATIONS['ar']?.[service.slug] : null;
  const serviceTitle = sTrans?.title || service.title;
  const serviceShortDesc = sTrans?.shortDescription || service.shortDescription;
  const serviceDeliverables = service.deliverables;
  const serviceProcess = service.process;

  // Cross-linked products & brands
  const relatedCategories = PRODUCT_CATEGORIES.filter((c) =>
    service.relevantCategories.includes(c.id)
  );

  const relatedBrands = BRANDS_DATA.filter((b) =>
    service.relevantBrandIds.includes(b.id)
  );

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <Link to={formatPath("/")} className="hover:text-sky-700 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <Link to={formatPath("/services")} className="hover:text-sky-700 transition-colors">
              {isAr ? "الخدمات" : "Services"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <span className="font-semibold text-slate-900">{serviceTitle}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header with Service-Specific Realistic Background Image */}
      <section className="relative bg-slate-950 text-white py-14 sm:py-20 lg:py-24 border-b border-slate-800 overflow-hidden">
        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />

        {/* Realistic Background Image Highly Related to Service Name */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <picture>
            <source srcSet={`/assets/services/hero-${service.slug}.webp`} type="image/webp" />
            <img
              src={`/assets/services/hero-${service.slug}.jpg`}
              alt={`${service.title} Enterprise Practice Infrastructure`}
              className="w-full h-full object-cover object-center scale-100 contrast-105 brightness-100 transition-transform duration-1000"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/services/hero-all-services.jpg";
              }}
            />
          </picture>

          {/* Directional Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/70 to-slate-950/25 lg:to-slate-950/15 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 pointer-events-none" />

          {/* Subtle Cyber Grid & Ambient Glow */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(56,189,248,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.15)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgba(14,165,233,0.18),transparent_70%)] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl lg:max-w-4xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="uppercase tracking-widest">
                {isAr
                  ? `الممارسة ${service.number} · تخصص ديسلا المؤسسي`
                  : `PRACTICE ${service.number} · DEYSLA ENTERPRISE SPECIALIZATION`}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              {serviceTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed drop-shadow-xs">
              {serviceShortDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isAr
                    ? "متوافق مع ضوابط NCA ECC-1 ومعيار ISO 27001"
                    : "NCA ECC-1 & ISO 27001 Aligned"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>
                  {isAr
                    ? "مهندسون معتمدون من كبرى الشركات العالمية"
                    : "Tier-1 Vendor Certified Engineers"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>
                  {isAr
                    ? "دعم هندسي 24/7 باتفاقية مستوى الخدمة"
                    : "24/7 SLA Engineering Support"}
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => {
                  addItem({
                    id: `service-${service.id}`,
                    name: `${serviceTitle} Consultation`,
                    categoryName: isAr ? "استشارة هندسية" : "Service Consultation",
                  });
                  setIsEnquiryModalOpen(true);
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-sky-500 via-sky-600 to-amber-500 text-white hover:opacity-95 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02]"
              >
                <span>{isAr ? "طلب مقترح نطاق الخدمة" : "Request Service Scope Proposal"}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
              </button>
              <Link
                to={formatPath("/contact")}
                className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 text-xs font-semibold rounded-xl transition-all shadow-sm text-center backdrop-blur-md"
              >
                {isAr ? "التحدث مع مهندس حلول متخصص" : "Speak to a Solutions Architect"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview & What We Provide */}
      <section className="py-10 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
                  {isAr ? "نظرة عامة على الخدمة" : "Service Overview"}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {isAr ? "إطار العمل الشامل للتنفيذ والتسليم" : "Comprehensive Delivery Framework"}
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {service.overview}
              </p>

              <div className="pt-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  {isAr ? "نطاق العمل الرئيسي والخدمات الفرعية" : "Key Scope & Sub-Services"}
                </h3>
                <div className="space-y-3">
                  {service.subServices.map((sub) => (
                    <div
                      key={sub}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{sub}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {isAr
                            ? "مصممة لتلبية معايير الموثوقية المؤسسية ومتطلبات التراخيص والامتثال المعتمدة."
                            : "Engineered to meet enterprise reliability standards and municipal compliance codes."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deliverables Card & Service Visual */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                {/* Practice Overview Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white space-y-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-white bg-blue-600 px-2.5 py-1 rounded-md border border-blue-400/30">
                      {isAr ? `الخدمة ${service.number}` : `SERVICE ${service.number}`}
                    </span>
                    <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[11px] text-blue-300">
                      {isAr ? "معتمد من الدرجة الأولى" : "Tier-1 Certified"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{serviceTitle}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {isAr ? "مجال ممارسات ديسلا المؤسسية" : "DEYSLA Enterprise Practice Domain"}
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-6">
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      {isAr ? "المخرجات والتسليمات" : "Output & Deliverables"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {isAr ? "ما تسلّمه ديسلا لشركائها" : "What DEYSLA Hands Over"}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {serviceDeliverables.map((del) => (
                      <div key={del} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{del}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <button
                      onClick={() => {
                        addItem({
                          id: `service-${service.id}`,
                          name: `${serviceTitle} Service Proposal`,
                          categoryName: isAr ? "استشارة هندسية" : "Service Consultation",
                        });
                        setIsEnquiryModalOpen(true);
                      }}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{isAr ? "إضافة الخدمة لطلب عرض السعر" : "Add to Enquiry Quotation"}</span>
                      <Send className="w-3.5 h-3.5 rtl-flip" />
                    </button>
                    <p className="text-[10px] text-center text-slate-400">
                      {isAr
                        ? "عرض سعر رسمي يصدر خلال 24 ساعة من المقر الرئيسي بالدمام"
                        : "Official quote generated within 24 hours from Dammam HQ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Process */}
      <section className="py-10 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
              {isAr ? "منهجية العمل الهندسية" : "Structured Methodology"}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isAr ? "مراحل التنفيذ المعتمدة" : "Implementation Process"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceProcess.map((p) => (
              <div
                key={p.step}
                className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {isAr ? `المرحلة ${p.step}` : `Step ${p.step}`}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-3 mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Brands & Products (Cross-linking) */}
      {(relatedBrands.length > 0 || relatedCategories.length > 0) && (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Related Products */}
            {relatedCategories.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  {isAr
                    ? "المعدات وفئات المنتجات المرتبطة بالخدمة"
                    : "Relevant Equipment & Product Categories"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedCategories.map((cat) => {
                    const cName = (isAr && CATEGORY_TRANSLATIONS['ar']?.[cat.slug]?.name) || cat.name;
                    const cHeadline = (isAr && CATEGORY_TRANSLATIONS['ar']?.[cat.slug]?.headline) || cat.headline;
                    return (
                      <Link
                        key={cat.id}
                        to={formatPath(`/products/${cat.slug}`)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-center gap-3.5 group"
                      >
                        <img src={cat.icon} alt="" className="w-10 h-10 object-contain shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                            {cName}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{cHeadline}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 rtl-flip ms-auto shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Brands */}
            {relatedBrands.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  {isAr ? "العلامات التجارية المعتمدة ذات الصلة" : "Certified OEM Technology Brands"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {relatedBrands.map((b) => (
                    <Link
                      key={b.id}
                      to={formatPath(`/brands/${b.slug}`)}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col items-center justify-center h-24 text-center group"
                    >
                      <img
                        src={b.logo}
                        alt={b.name}
                        className="max-h-10 max-w-full object-contain filter group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span className="text-[10px] font-semibold text-slate-600 mt-2 truncate w-full">
                        {b.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Box */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {isAr ? `جاهز لتنفيذ ${serviceTitle}؟` : `Ready to Implement ${service.title}?`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {isAr
              ? "تواصل مع الفريق الهندسي لديسلا بالدمام لجدولة فحص ميداني أو طلب جدول كميات (BOQ) رسمي معتمد."
              : "Contact DEYSLA's engineering team in Dammam to schedule a technical walkthrough or request an official bill of quantities (BOQ)."}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to={formatPath("/contact")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              {isAr ? "تواصل مع مهندسي ديسلا" : "Contact DEYSLA Engineers"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
