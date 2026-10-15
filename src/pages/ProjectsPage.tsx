import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Briefcase, MapPin, Building, ShieldCheck, CheckCircle2, Star, Quote } from "lucide-react";
import { PROJECTS_DATA, Project } from "../data/projects";
import { REVIEWS_DATA } from "../data/reviews";
import { useLanguage } from "../context/LanguageContext";
import { useCmsContent } from "../context/CmsContentContext";

export const ProjectsPage: React.FC = () => {
  const { language, formatPath } = useLanguage();
  const { projects, reviews } = useCmsContent();
  const isAr = language === "ar";

  const [selectedFilter, setSelectedFilter] = useState("all");

  const categories = [
    { id: "all", label: isAr ? "جميع المشاريع" : "All Projects" },
    { id: "IT Infrastructure & Cabling", label: isAr ? "البنية التحتية" : "Infrastructure" },
    { id: "Security Systems", label: isAr ? "الأنظمة الأمنية" : "Security Systems" },
    { id: "Industrial Automation", label: isAr ? "الأتمتة الصناعية" : "Industrial Automation" },
    { id: "VoIP & Communications", label: isAr ? "الاتصالات والسحابة" : "VoIP & Cloud" },
  ];

  const filtered =
    selectedFilter === "all"
      ? projects
      : projects.filter((p) => p.category === selectedFilter);

  return (
    <div className="w-full bg-white/70 backdrop-blur-xs">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to={formatPath("/")} className="hover:text-sky-700 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <span className="font-semibold text-slate-900">
              {isAr ? "المشاريع ودراسات الحالة" : "Projects & Case Studies"}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="relative theme-hero-luminous text-slate-900 py-14 sm:py-20 lg:py-24 border-b border-slate-200/80 overflow-hidden">
        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />

        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 theme-grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>
              {isAr ? "سجل إنجازات معتمد وتقييمات العملاء" : "PROVEN TRACK RECORD & CLIENT REVIEWS"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-3xl leading-tight">
            {isAr ? (
              <>منهجية مشاريع <span className="theme-text-gradient">ديسلا الهندسية</span> ودراسات الحالة</>
            ) : (
              <>DEYSLA <span className="theme-text-gradient">Project Architecture</span> &amp; Case Studies</>
            )}
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {isAr
              ? "مع أكثر من 500 مشروع ناجح تم تنفيذه في مختلف مناطق المملكة العربية السعودية ودول الخليج العربي، توفر ديسلا بنى تحتية فائقة الموثوقية للقطاعات الحكومية والصناعية والتجارية والصحية."
              : "With 500+ successful projects completed across the Kingdom of Saudi Arabia and the GCC, DEYSLA delivers high-reliability infrastructure to government, industrial, commercial, and healthcare clients."}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isAr ? "أكثر من 500 مشروع معتمد" : "500+ Certified Deployments"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>
                {isAr ? "تسليم خالي من العيوب وفق أعلى المعايير" : "Zero-Defect Handover Track Record"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>
                {isAr ? "متوافق مع معايير أرامكو والمؤسسات الكبرى" : "Saudi Aramco & Enterprise Standard Compliant"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Project Cards Grid */}
      <section className="py-10 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedFilter(c.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedFilter === c.id
                    ? "bg-gradient-to-r from-sky-600 via-sky-500 to-amber-500 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
            {filtered.map((proj) => {
              const review = REVIEWS_DATA.find((r) => r.projectRef === proj.slug);

              return (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  {/* Project Header Banner */}
                  <div className="bg-slate-900 p-5 text-white flex items-center justify-between text-xs border-b border-slate-800">
                    <span className="px-2.5 py-1 rounded bg-gradient-to-r from-sky-600 to-sky-700 font-semibold shadow-xs">
                      {proj.category}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{proj.location}</span>
                    </span>
                  </div>

                  {/* Project Card Content */}
                  <div className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{proj.clientSector}</span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                        {proj.title}
                      </h2>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {proj.shortDescription}
                      </p>

                      {/* Scope of Work */}
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          {isAr ? "نطاق العمل الهندسي:" : "Scope of Engineering:"}
                        </span>
                        {proj.scopeOfWork.map((s) => (
                          <div key={s} className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>

                      {/* Verified Customer Review Inside Card */}
                      {review && (
                        <div className="pt-3 border-t border-slate-100">
                          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2.5 shadow-2xs">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                {isAr ? "تقييم معتمد من العميل" : "Verified Customer Review"}
                              </span>
                            </div>

                            <p className="text-xs italic text-slate-700 leading-relaxed">
                              &ldquo;{review.quote}&rdquo;
                            </p>

                            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-1">
                              <span className="font-semibold text-slate-800">
                                {review.clientName} · {review.clientRole}
                              </span>
                              <span className="text-slate-500 font-medium">
                                {review.companyName}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Technologies & Inquire */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1">
                        {proj.technologiesUsed.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded isolate-ltr"
                            dir="ltr"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={formatPath("/contact")}
                        className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 shrink-0"
                      >
                        <span>{isAr ? "استفسر عن دراسة الحالة" : "Inquire Case Study"}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                      </Link>
                    </div>
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
