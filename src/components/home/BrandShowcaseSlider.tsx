import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { BRANDS_DATA } from "../../data/brands";
import { useLanguage } from "../../context/LanguageContext";

interface ShowcaseSlide {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  brandIds: string[];
  link: string;
}

export const BrandShowcaseSlider: React.FC = () => {
  const { lang, formatPath } = useLanguage();

  const slides: ShowcaseSlide[] = [
    {
      id: "racks-security",
      titleEn: "Racks and Security",
      titleAr: "الكبائن والأنظمة الأمنية",
      descriptionEn:
        "Supplying enterprise racks, high-density enclosures, CCTV surveillance, and biometric security solutions to companies throughout Saudi Arabia. Please let us know your requirements and we can help you get started right away.",
      descriptionAr:
        "توريد كبائن الشبكات ومراكز البيانات وحلول المراقبة بالفيديو (CCTV) والتحكم في الدخول للمؤسسات في المملكة العربية السعودية. أخبرنا بمتطلباتكم لنبدأ العمل فوراً.",
      brandIds: ["schneider", "eaton", "hikvision", "zkteco", "axis", "bosch"],
      link: "/products/security-systems",
    },
    {
      id: "networking-switching",
      titleEn: "Enterprise Networking",
      titleAr: "شبكات المؤسسات والربط السحابي",
      descriptionEn:
        "Distributing core and edge switches, high-throughput VPN routers, and enterprise wireless access points. Fully tested and warrantied equipment for campus and industrial deployments.",
      descriptionAr:
        "توزيع محولات الشبكات الأساسية وموجهات VPN عالية الأداء ونقاط الوصول اللاسلكية المؤسسية. معدات مجربة ومضمونة لبيئات العمل والحرم المؤسسي.",
      brandIds: ["cisco", "aruba", "huawei", "netgear", "ruijie", "mikrotik"],
      link: "/products/networking",
    },
    {
      id: "structured-cabling",
      titleEn: "Structured Cabling",
      titleAr: "التمديدات الهيكلية والألياف الضوئية",
      descriptionEn:
        "Providing certified copper Cat6/6A data cables, single-mode and multi-mode fiber optic trunking, modular patch panels, and keystone jacks for mission-critical facilities.",
      descriptionAr:
        "توفير كابلات Cat6/6A النحاسية المعتمدة، ومسارات الألياف الضوئية أحادية ومتعددة الأنماط، ولوحات التوزيع المعيارية (Patch Panels) للمنشآت الحيوية.",
      brandIds: ["commscope", "corning", "panduit", "legrand", "excel-cabling", "nexans"],
      link: "/products/structured-cabling",
    },
    {
      id: "power-computing",
      titleEn: "Power and Computing",
      titleAr: "أنظمة الطاقة والحوسبة المركزية",
      descriptionEn:
        "Delivering online double-conversion UPS backups, smart rack PDUs, enterprise servers, and commercial workstations engineered for continuous uptime and zero interruption.",
      descriptionAr:
        "توفير وحدات عدم انقطاع التيار (UPS)، ووحدات توزيع الطاقة الذكية (PDU)، والخوادم المؤسسية ومحطات العمل المصممة للعمل المتواصل دون انقطاع.",
      brandIds: ["dell", "hp", "lenovo", "vertiv", "eaton", "schneider"],
      link: "/products/servers-and-computing",
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentSlideIndex];
  const slideBrands = BRANDS_DATA.filter((b) => currentSlide.brandIds.includes(b.id));

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-transparent border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card Container with Left/Right split */}
        <div className="theme-card-ambient rounded-2xl overflow-hidden p-4 sm:p-8 lg:p-12 relative">
          {/* Navigation Arrows with logical placement */}
          <button
            onClick={prevSlide}
            className="absolute start-1.5 sm:start-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-xs border border-neutral-300 text-neutral-800 hover:text-black hover:bg-neutral-100 shadow-sm flex items-center justify-center transition-all z-20 cursor-pointer"
            aria-label="Previous Category"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 rtl-flip" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute end-1.5 sm:end-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-xs border border-neutral-300 text-neutral-800 hover:text-black hover:bg-neutral-100 shadow-sm flex items-center justify-center transition-all z-20 cursor-pointer"
            aria-label="Next Category"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 rtl-flip" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center px-6 sm:px-10">
            {/* Left/Start Side: Brand Logos Grid Showcase */}
            <div className="lg:col-span-6 bg-neutral-50 rounded-xl border border-neutral-200 p-3 sm:p-6 lg:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-6 items-center">
                {slideBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    to={formatPath(`/brands/${brand.slug}`)}
                    className="h-14 sm:h-16 p-2 rounded-lg bg-white border border-orange-200/50 shadow-2xs hover:border-[#ff8c3a] hover:shadow-xs transition-all flex items-center justify-center group"
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right/End Side: Category Title & Description */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-widest block">
                  {lang === 'ar' ? 'حلول مختارة' : 'FEATURED SOLUTION'}
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {lang === 'ar' ? currentSlide.titleAr : currentSlide.titleEn}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg">
                {lang === 'ar' ? currentSlide.descriptionAr : currentSlide.descriptionEn}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to={formatPath(currentSlide.link)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#ff5e00] hover:text-[#0052cc] uppercase tracking-wider group transition-colors"
                >
                  <span>{lang === 'ar' ? 'استكشف المنتجات' : 'Explore Range'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl-flip group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center gap-1.5 ms-auto">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlideIndex === idx ? "w-6 bg-gradient-to-r from-[#ff5e00] to-[#0052cc] shadow-xs" : "w-2 bg-neutral-300"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
