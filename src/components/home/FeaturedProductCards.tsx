import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Award } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface ProductCard {
  id: string;
  productId: string;
  titleEn: string;
  titleAr: string;
  brandName: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  brandLogo: string;
  brandImage: string;
  modelName: string;
  category: string;
  link: string;
}

export const FeaturedProductCards: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { lang, formatPath } = useLanguage();

  const cards: ProductCard[] = [
    {
      id: "cisco",
      productId: "network-switches",
      titleEn: "Cisco Products",
      titleAr: "منتجات Cisco",
      brandName: "Cisco Systems",
      taglineEn: "Enterprise Routing & Switching",
      taglineAr: "التوجيه والتحويل للمؤسسات",
      descriptionEn:
        "Over the years at DEYSLA IT Solutions, we have dealt a lot with Cisco products and we have never been let down by their quality and reliability. Subsequently, they are one of our top recommended networking lines.",
      descriptionAr:
        "على مدار سنوات عملنا في ديسلا، قمنا بتوريد ودعم منتجات Cisco وحظيت دائماً بثقة مطلقة لجودتها وموثوقيتها، لذا تعد من أكثر خطوط الشبكات الموصى بها.",
      brandLogo: "/assets/brands/cisco-logo-0-2048x2048-1-1536x1536-1.png",
      brandImage: "/assets/catalog/net-rtr-cisco-897vaw.webp",
      modelName: "Cisco 897VAW & Catalyst Series",
      category: "networking",
      link: "/brands/cisco",
    },
    {
      id: "fortinet",
      productId: "cybersecurity-systems",
      titleEn: "Fortinet Products",
      titleAr: "منتجات Fortinet",
      brandName: "Fortinet Security",
      taglineEn: "Next-Gen Firewall & Threat Defense",
      taglineAr: "جدران الحماية المتقدمة ومكافحة التهديدات",
      descriptionEn:
        "DEYSLA IT Solutions provides Fortinet security products to many of our clients across Saudi Arabia and the GCC, and this is another top brand in our portfolio. Our certified engineers can help you deploy robust firewalls quickly.",
      descriptionAr:
        "توفر ديسلا منتجات Fortinet الأمنية لنخبة عملائنا في المملكة ودول الخليج. يساعدك مهندسونا المعتمدون في نشر حلول الحماية المتقدمة بكفاءة عالية.",
      brandLogo: "/assets/brands/fortinet_logo.png",
      brandImage: "/assets/catalog/sec-cs-fortinet-firewall.webp",
      modelName: "FortiGate Enterprise NGFW",
      category: "security",
      link: "/brands/fortinet",
    },
    {
      id: "cabling",
      productId: "patch-panels",
      titleEn: "CommScope & Cabling Products",
      titleAr: "منتجات CommScope والكابلات",
      brandName: "CommScope",
      taglineEn: "Certified Physical Layer Infrastructure",
      taglineAr: "بنية الطبقة المادية المعتمدة",
      descriptionEn:
        "We supply CommScope, Corning, and certified structured cabling products as top-tier infrastructure brands. If you are in any doubt over anything within the product range, please request a quote or contact our team.",
      descriptionAr:
        "نورد كابلات CommScope وCorning المعتمدة كعلامات رائدة للبنية التحتية. لطلب عروض الأسعار والمواصفات الفنية يرجى التواصل مع فريقنا الهندسي.",
      brandLogo: "/assets/brands/Commscope-Logo-2011-scaled.png",
      brandImage: "/assets/catalog/cbl-pp-cat6a-management.webp",
      modelName: "Systimax Cat6A Cabling",
      category: "cabling",
      link: "/products/structured-cabling",
    },
    {
      id: "hikvision",
      productId: "cctv-surveillance",
      titleEn: "Hikvision Surveillance",
      titleAr: "أنظمة المراقبة Hikvision",
      brandName: "Hikvision",
      taglineEn: "Commercial 4K Video Surveillance",
      taglineAr: "كاميرات مراقبة تجارية بدقة 4K",
      descriptionEn:
        "Leading provider of high-definition commercial CCTV cameras, AI-powered NVRs, and thermal imaging cameras for industrial and enterprise perimeter monitoring.",
      descriptionAr:
        "توريد كاميرات المراقبة التلفزيونية عالية الدقة، ومسجلات NVR المدعومة بالذكاء الاصطناعي، والكاميرات الحرارية لمراقبة محيط المنشآت الحيوية.",
      brandLogo: "/assets/brands/Hikvision-Logo-scaled.png",
      brandImage: "/assets/catalog/sec-cctv-hikvision-dome.webp",
      modelName: "4K DarkFighter CCTV Series",
      category: "security",
      link: "/brands/hikvision",
    },
    {
      id: "aruba",
      productId: "wireless-solutions",
      titleEn: "Aruba Networks",
      titleAr: "شبكات Aruba Networks",
      brandName: "Aruba by HPE",
      taglineEn: "High-Density Campus Wi-Fi 6",
      taglineAr: "نقاط وصول Wi-Fi 6 للمؤسسات",
      descriptionEn:
        "Enterprise-grade Wi-Fi 6 access points and mobility controllers engineered for high-density corporate environments, seamless roaming, and cloud telemetry.",
      descriptionAr:
        "نقاط وصول لاسلكية من فئة المؤسسات وأجهزة تحكم بالتنقل مصممة لبيئات الشركات المزدحمة والتجوال السلس مع دعم الإدارة السحابية.",
      brandLogo: "/assets/brands/aruba-networks-logo.png",
      brandImage: "/assets/catalog/net-wl-white-ap.webp",
      modelName: "Aruba Wi-Fi 6 AP Series",
      category: "networking",
      link: "/brands/aruba",
    },
    {
      id: "dell",
      productId: "rack-servers",
      titleEn: "Dell Technologies",
      titleAr: "تقنيات Dell Technologies",
      brandName: "Dell PowerEdge",
      taglineEn: "Mission-Critical Compute & Storage",
      taglineAr: "خوادم وحوسبة للمهام الحرجة",
      descriptionEn:
        "High-density rack and tower servers designed for mission-critical enterprise workloads, virtualization, AI computing, and multi-cloud scalability.",
      descriptionAr:
        "خوادم الرفوف والأبراج عالية الكثافة المصممة لأعباء العمل المؤسسية الحرجة، والأنظمة الافتراضية، والحوسبة السحابية المتعددة.",
      brandLogo: "/assets/brands/dell-logo-transparent-free-png.webp",
      brandImage: "/assets/catalog/srv-dell-t550.webp",
      modelName: "PowerEdge Server Series",
      category: "compute",
      link: "/brands/dell",
    },
  ];

  const displayedCards =
    activeCategory === "all"
      ? cards.slice(0, 3)
      : cards.filter((c) => c.category === activeCategory);

  const filterTabs = [
    { id: "all", labelEn: "Top Best Sellers", labelAr: "الأكثر طلباً" },
    { id: "networking", labelEn: "Networking (Cisco & Aruba)", labelAr: "الشبكات (Cisco & Aruba)" },
    { id: "security", labelEn: "Security (Fortinet & Hikvision)", labelAr: "الأمن والمراقبة (Fortinet & Hikvision)" },
    { id: "cabling", labelEn: "Structured Cabling (CommScope)", labelAr: "التمديدات الهيكلية (CommScope)" },
    { id: "compute", labelEn: "Servers & Compute (Dell)", labelAr: "الخوادم والحوسبة (Dell)" },
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-transparent border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Section Heading with theme gradient bar underneath */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ff5e00] text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'شراكات المصنعين المعتمدة (OEM)' : 'OEM PARTNERSHIP SHOWCASE'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {lang === 'ar' ? 'المنتجات الأكثر طلباً' : 'Our Best Selling Products'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            {lang === 'ar'
              ? 'توريد وتجهيز ونشر معتمد لمنتجات أكبر شركات تصنيع تقنية المعلومات عالمياً.'
              : 'Authorized supply, staging, and deployment for world-class enterprise technology manufacturers.'}
          </p>
          <div className="w-16 h-1 theme-gradient-bar mx-auto rounded-full" />
        </div>

        {/* Brand Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {filterTabs.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "theme-pill-active text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-orange-50/50 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              {lang === 'ar' ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Cards Grid showcasing prominent Brand Images and certified hardware */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayedCards.map((card) => {
            const title = lang === 'ar' ? card.titleAr : card.titleEn;
            const tagline = lang === 'ar' ? card.taglineAr : card.taglineEn;
            const description = lang === 'ar' ? card.descriptionAr : card.descriptionEn;

            return (
              <Link
                key={card.id}
                to={formatPath(card.link)}
                className="group rounded-2xl border border-orange-200/50 bg-white shadow-2xs hover:shadow-xl hover:border-[#ff8c3a] transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Brand Image Showcase Container */}
                  <div className="w-full h-44 sm:h-48 bg-white border-b border-orange-200/40 p-4 sm:p-6 relative flex items-center justify-center overflow-hidden group-hover:bg-orange-50/20 transition-colors">
                    {/* Authorized Tag */}
                    <div className="absolute top-2.5 end-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-neutral-200 shadow-2xs z-10 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        {lang === 'ar' ? 'وكيل معتمد' : 'Authorized OEM'}
                      </span>
                    </div>

                    {/* Main Brand Image */}
                    <img
                      src={card.brandLogo}
                      alt={card.brandName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full max-h-28 sm:max-h-32 object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />

                    {/* Tagline / Category Badge */}
                    <div className="absolute bottom-2.5 start-2.5 bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-slate-100 z-10">
                      {tagline}
                    </div>
                  </div>

                  {/* Card Text Content */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {title}
                      </h3>
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {lang === 'ar' ? 'فئة معتمدة' : 'OEM Line'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal line-clamp-3">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1.5 uppercase tracking-wider transition-colors">
                    <span>{lang === 'ar' ? `استكشف منتجات ${card.brandName}` : `Explore ${card.brandName}`}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {lang === 'ar' ? 'توريد لدول الخليج' : 'GCC Supply'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
