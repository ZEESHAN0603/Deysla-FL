import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GALLERY_DATA } from "../data/gallery";
import {
  Server,
  ShieldCheck,
  Cpu,
  Network,
  Monitor,
  Wrench,
  HardDrive,
  Layers,
  X,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Boxes,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const GalleryPage: React.FC = () => {
  const { language, formatPath } = useLanguage();
  const isAr = language === "ar";

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    category: string;
    desc: string;
  } | null>(null);

  const categories = [
    { id: "all", label: isAr ? "جميع الأصول" : "All Assets" },
    { id: "Infrastructure", label: isAr ? "البنية التحتية" : "Infrastructure" },
    { id: "Security", label: isAr ? "الأمن والتحكم" : "Security & Access" },
    { id: "Automation", label: isAr ? "الأتمتة الصناعية" : "Industrial Automation" },
    { id: "Cabling", label: isAr ? "التمديدات الهيكلية" : "Structured Cabling" },
    { id: "Displays", label: isAr ? "الشاشات الرقمية" : "Digital Displays" },
    { id: "Operations", label: isAr ? "العمليات والتجهيز" : "Operations & Staging" },
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "infrastructure":
        return <Server className="w-8 h-8 text-sky-400" />;
      case "security":
        return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
      case "automation":
        return <Cpu className="w-8 h-8 text-indigo-400" />;
      case "cabling":
        return <Network className="w-8 h-8 text-blue-400" />;
      case "displays":
        return <Monitor className="w-8 h-8 text-purple-400" />;
      case "operations":
        return <Wrench className="w-8 h-8 text-rose-400" />;
      case "hardware":
        return <HardDrive className="w-8 h-8 text-cyan-400" />;
      default:
        return <Layers className="w-8 h-8 text-sky-400" />;
    }
  };

  const filtered =
    selectedCategory === "all"
      ? GALLERY_DATA
      : GALLERY_DATA.filter((item) => item.category === selectedCategory);

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
              {isAr ? "معرض الأعمال الهندسية" : "Engineering Gallery"}
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
              {isAr
                ? "دليل ديسلا الهندسي · أعمال ميدانية معتمدة"
                : "DEYSLA ENGINEERING DIRECTORY · CERTIFIED FIELDWORK"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-3xl leading-tight">
            {isAr ? (
              <>محفظة الحلول التقنية و<span className="theme-text-gradient">البنى التحتية الميدانية</span></>
            ) : (
              <>Technology Portfolio &amp; <span className="theme-text-gradient">Field Architectures</span></>
            )}
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {isAr
              ? "نطاق عمل موثق لتجهيز البنى التحتية المؤسسية، والتركيبات الأمنية، وتجميع حوسبة مراكز البيانات، والهندسة التشغيلية في المملكة العربية السعودية والخليج."
              : "Verified scope of DEYSLA enterprise infrastructure staging, security installations, data center compute assembly, and operational engineering across Saudi Arabia and the GCC."}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isAr ? "جودة مؤسسية معتمدة ومطابقة للمواصفات" : "Enterprise Grade Quality Verified"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>
                {isAr ? "تنفيذ مشاريع عبر قطاعات متعددة" : "Multi-Sector Implementation"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>
                {isAr ? "مهندسون معتمدون من الشركاء المصنعين" : "OEM Partner Certified Engineers"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-10 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === c.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                onClick={() =>
                  setSelectedItem({
                    title: item.title,
                    category: item.category,
                    desc: item.description,
                  })
                }
              >
                {/* Engineering Visual Header */}
                <div className="relative h-44 w-full bg-slate-950 p-5 flex flex-col justify-between border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-sky-300 border border-slate-700 text-[10px] font-mono font-semibold">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      DEYSLA·SPEC
                    </span>
                  </div>
                  <div className="flex items-center justify-center py-2">
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{isAr ? "الحالة: تم النشر" : "STATUS: DEPLOYED"}</span>
                    <span className="text-emerald-400 font-bold">
                      {isAr ? "معتمد" : "VERIFIED"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed mt-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                    <span>{isAr ? "عرض المواصفات الفنية" : "View Specifications"}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blueprint Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="max-w-xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl space-y-5 p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
                  {selectedItem.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {isAr ? "توثيق النطاق الهندسي" : "Engineering Scope Documentation"}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">
                {selectedItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedItem.desc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                {isAr ? "معايير النشر والامتثال المعتمدة:" : "Deployment Standards & Compliance:"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>ISO 9001 / IEC 11801 Aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Saudi Aramco &amp; SABIC Standards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>OEM Manufacturer Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct Turnkey Delivery</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to={formatPath("/contact")}
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 theme-button-primary text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
              >
                {isAr ? "طلب مقترح لهذا المجال" : "Request Proposal for this Domain"}
              </Link>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
