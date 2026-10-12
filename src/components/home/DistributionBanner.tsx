import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Truck, ShieldCheck, ArrowRight, Clock, Globe } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const DistributionBanner: React.FC = () => {
  const { lang, formatPath } = useLanguage();

  return (
    <section className="relative py-14 sm:py-20 lg:py-24 bg-white/70 backdrop-blur-md text-slate-900 overflow-hidden border-b border-orange-200/50">
      {/* Top Brand Iridescent Theme Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />

      {/* Atmospheric Theme Radial Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle Network Grid */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(255,140,58,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(94,162,255,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Theme Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_15%_20%,rgba(255,94,0,0.14),transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(0,82,204,0.14),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,94,0,0.08)_0%,transparent_50%,rgba(0,82,204,0.08)_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Main Content Area */}
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-[#e65500] text-xs font-mono font-semibold uppercase tracking-wider shadow-xs backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-[#ff8c3a]" />
            <span>{lang === 'ar' ? 'شبكة لوجستية تغطي المملكة ودول الخليج' : 'NATIONWIDE & GCC LOGISTICS REACH'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase leading-tight">
            {lang === 'ar' ? (
              <>التوزيع والتوريد في كافة أنحاء <span className="theme-text-gradient">المملكة العربية السعودية</span> والخليج</>
            ) : (
              <>Distribution Throughout <span className="theme-text-gradient">Saudi Arabia</span> &amp; GCC</>
            )}
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'انطلاقاً من مقرنا الرئيسي بالدمام بالمنطقة الشرقية، تقدم ديسلا لحلول تقنية المعلومات خدمات توزيع وتوريد سريعة ومعتمدة لجميع مناطق المملكة ومملكة البحرين والأسواق التجارية بدول الخليج.'
              : 'Headquartered in Dammam, Eastern Province, DEYSLA IT Solutions delivers rapid, certified distribution across the entire Kingdom of Saudi Arabia, Bahrain, and regional GCC commercial hubs.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to={formatPath("/contact")}
              className="px-8 sm:px-10 py-3.5 theme-button-primary text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>{lang === 'ar' ? 'تواصل مع فريق التوزيع' : 'Contact Distribution Team'}</span>
              <ArrowRight className="w-4 h-4 rtl-flip" />
            </Link>
            <Link
              to={formatPath("/products")}
              className="px-8 sm:px-10 py-3.5 bg-white hover:bg-orange-50/50 border border-orange-200/80 text-slate-800 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all"
            >
              {lang === 'ar' ? 'استعرض الكتالوج' : 'Browse Catalog'}
            </Link>
          </div>
        </div>

        {/* 4 Regional Fulfillment Hubs Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 pt-4 border-t border-orange-200/50">
          <div className="p-4 rounded-xl bg-white/90 border border-orange-200/50 backdrop-blur-xs flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-600 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {lang === 'ar' ? 'المقر الرئيسي بالدمام' : 'Dammam HQ'}
              </p>
              <p className="text-[11px] text-slate-500">
                {lang === 'ar' ? 'مركز اللوجستيات المركزي' : 'Central Logistics Hub'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-orange-200/50 backdrop-blur-xs flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-600 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {lang === 'ar' ? 'الرياض والمنطقة الوسطى' : 'Riyadh & Central'}
              </p>
              <p className="text-[11px] text-slate-500">
                {lang === 'ar' ? 'إرسال سريع للمؤسسات' : 'Rapid Enterprise Dispatch'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-orange-200/50 backdrop-blur-xs flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {lang === 'ar' ? 'المنطقة الغربية' : 'Western Province'}
              </p>
              <p className="text-[11px] text-slate-500">
                {lang === 'ar' ? 'جدة والمدن الصناعية' : 'Jeddah & Industrial Cities'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-orange-200/50 backdrop-blur-xs flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-orange-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {lang === 'ar' ? 'البحرين ودول الخليج' : 'Bahrain & GCC'}
              </p>
              <p className="text-[11px] text-slate-500">
                {lang === 'ar' ? 'تخليص ومستودعات إقليمية' : 'Cross-Border Customs Staging'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
