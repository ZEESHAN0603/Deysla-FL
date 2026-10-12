import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RadialProductRange } from "./RadialProductRange";
import { useLanguage } from "../../context/LanguageContext";

export const CompanyIntro: React.FC = () => {
  const { lang, formatPath } = useLanguage();

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-transparent border-b border-neutral-200/80 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: DEYSLA IT Solutions Overview */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                {lang === 'ar' ? 'ديسلا لحلول تقنية المعلومات' : 'DEYSLA IT Solutions'}
              </h2>
              {/* Solid theme bar underneath heading */}
              <div className="w-16 h-1 theme-gradient-bar mt-2 rounded-full" />
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              {lang === 'ar'
                ? 'شركة ديسلا لحلول تقنية المعلومات هي موزع ومورد رئيسي لمجموعة شاملة من أجهزة تقنية المعلومات المؤسسية، والكابلات الهيكلية، وحلول اتصالات الصوت عبر بروتوكول الإنترنت (IP Telecom) في جميع أنحاء المملكة العربية السعودية ودول الخليج. نمتلك خبرة تفوق 15 عاماً في القطاع ونفذنا مشاريع رائدة لقطاعات التشييد، الهندسة، النفط والغاز، الطاقة، الضيافة، النقل، سلاسل الإمداد، الرعاية الصحية، والتعليم.'
                : 'DEYSLA IT Solutions is a distributor and supplier of a wide range of enterprise IT hardware, electrical cables, structured cabling, and IP telecom technology throughout Saudi Arabia and the GCC. We have over 15 years of experience within the industry and have delivered for clients in sectors such as construction, engineering, oil and gas, energy, hospitality, transportation, retail, logistics, healthcare, and education.'}
            </p>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              {lang === 'ar'
                ? 'تتعامل ديسلا مع كافة منتجات تقنية المعلومات والتيار الخفيف (ELV) الرائدة: محولات الشبكات (Switches)، الموجهات (Routers)، نقاط الوصول اللاسلكية، كابلات الألياف الضوئية، وصلات Pigtails، لوحات التوزيع (Patch Panels)، وموزعات PLC لأشهر العلامات العالمية: Cisco, Dell, Aruba, Fortinet, CommScope, Corning, Schneider Electric, Panduit, Hikvision, Grandstream.'
                : 'DEYSLA IT Solutions deals with all leading IT & ELV Products: Network Switches, Routers, Access Points, Fiber Optic Cables, Pigtails, Patch Panels, Fiber and PLC Splitters of world-tier brands: Cisco, Dell, Aruba, Fortinet, CommScope, Corning, Schneider Electric, Panduit, Hikvision, and Grandstream.'}
            </p>

            <div className="pt-2">
              <Link
                to={formatPath("/about")}
                className="theme-button-primary px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider group inline-flex items-center gap-2 shadow-md hover:scale-[1.02]"
              >
                <span>{lang === 'ar' ? 'عرض المزيد' : 'VIEW MORE'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl-flip transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Signature Radial "OUR PRODUCT RANGE" Diagram */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <RadialProductRange />
          </div>
        </div>
      </div>
    </section>
  );
};
