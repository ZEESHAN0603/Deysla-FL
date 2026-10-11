import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Box,
  ShoppingCart,
  Send,
  Layers,
  Tag,
  Cpu,
  Zap,
  Activity,
  FileText,
  Sparkles,
  Check,
  X,
  ExternalLink,
  Info,
  Sliders,
  Server,
  Sun,
  Moon,
  ZoomIn,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { PRODUCTS_DATA, ProductType } from "../data/products";
import { PRODUCT_CATEGORIES } from "../data/productCategories";
import { BRANDS_DATA } from "../data/brands";
import { getCatalogItemsBySubcategory, CatalogItem } from "../data/productCatalogItems";
import { useCart } from "../context/CartContext";
import { usePosterImages } from "../context/PosterImagesContext";
import { useLanguage } from "../context/LanguageContext";
import { CATEGORY_TRANSLATIONS } from "../i18n/translations";

export const ProductDetailPage: React.FC = () => {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem, setIsEnquiryModalOpen } = useCart();
  const { getProductImage } = usePosterImages();
  const { language, formatPath } = useLanguage();
  const isAr = language === "ar";

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [inquiryNotes, setInquiryNotes] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"specs" | "features" | "deployment">("specs");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isDatasheetOpen, setIsDatasheetOpen] = useState<boolean>(false);
  const [backdropMode, setBackdropMode] = useState<"light" | "dark">("light");
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);

  const product = PRODUCTS_DATA.find((p) => p.slug === productSlug);
  const category = PRODUCT_CATEGORIES.find((c) => c.slug === categorySlug);

  if (!product || !category) {
    return <Navigate to={formatPath("/products")} replace />;
  }

  const categoryName = (isAr && CATEGORY_TRANSLATIONS['ar']?.[category.slug]?.name) || category.name;
  const catalogModels = getCatalogItemsBySubcategory(product.id);
  const [activeModel, setActiveModel] = useState<CatalogItem | null>(() => catalogModels[0] || null);

  const availableBrands = BRANDS_DATA.filter((b) => product.brandIds.includes(b.id));
  const otherProductsInCategory = PRODUCTS_DATA.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  );

  // Sync with searchParams on mount or param change
  useEffect(() => {
    const subParam = searchParams.get("sub");
    const modelParam = searchParams.get("model");
    if (modelParam && catalogModels.length > 0) {
      const found = catalogModels.find((m) => m.id === modelParam);
      if (found) {
        setActiveModel(found);
        return;
      }
    }
    if (subParam && catalogModels.length > 0) {
      setSelectedSubcategory(subParam);
      const subLower = subParam.toLowerCase();
      const matched = catalogModels.find((m) => {
        const text = `${m.name} ${m.badge} ${m.specs.join(" ")}`.toLowerCase();
        const words = subLower.split(" ").filter((w) => w.length > 2);
        return words.some((w) => text.includes(w));
      });
      if (matched) {
        setActiveModel(matched);
      }
    }
  }, [searchParams, product.id]);

  const handleSelectModel = (model: CatalogItem) => {
    setActiveModel(model);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("model", model.id);
        return next;
      },
      { replace: true }
    );
    // Auto-match manufacturer brand in select
    const matchedBrand = availableBrands.find(
      (b) =>
        model.brand.toLowerCase().includes(b.name.toLowerCase()) ||
        b.name.toLowerCase().includes(model.brand.toLowerCase())
    );
    if (matchedBrand) {
      setSelectedBrand(matchedBrand.name);
    }
  };

  const handleSubcategoryClick = (sub: string) => {
    if (selectedSubcategory === sub) {
      setSelectedSubcategory(null);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("sub");
          return next;
        },
        { replace: true }
      );
      return;
    }
    setSelectedSubcategory(sub);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("sub", sub);
        return next;
      },
      { replace: true }
    );
    // Find matching model that corresponds to this subcategory
    const subLower = sub.toLowerCase();
    const matched = catalogModels.find((m) => {
      const text = `${m.name} ${m.badge} ${m.specs.join(" ")}`.toLowerCase();
      const words = subLower.split(" ").filter((w) => w.length > 2);
      return words.some((w) => text.includes(w));
    });
    if (matched) {
      handleSelectModel(matched);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: activeModel ? activeModel.id : product.id,
      name: activeModel ? `${activeModel.name} (${product.name})` : product.name,
      categoryName: categoryName,
      image: activeModel ? activeModel.imageWebp : product.image,
      brandPreference: activeModel ? activeModel.brand : (selectedBrand || undefined),
      quantity: qty,
      notes: inquiryNotes || undefined,
    });
    setIsEnquiryModalOpen(true);
  };

  // Helper for dynamic sub-product description
  const getSubProductDescription = (model: CatalogItem | null) => {
    if (!model) return product.description;
    const nameLower = model.name.toLowerCase();
    const badgeLower = model.badge.toLowerCase();
    if (isAr) {
      if (nameLower.includes("poe") || badgeLower.includes("poe")) {
        return `طراز مراقبة احترافي ${model.name} مصمم خصيصاً لكاميرات المراقبة الشبكية عالية الكثافة والبنية التحتية للهواتف الشبكية ومستشعرات الطاقة الذكية. يوفر ${model.badge} بميزانيات معتمدة 30W PoE+ وحماية من الصواعق حتى 6KV.`;
      }
      if (nameLower.includes("gigabit") || badgeLower.includes("gigabit") || badgeLower.includes("16-port") || badgeLower.includes("24-port")) {
        return `محول تجاري فائق السرعة ${model.name} مصمم لمنع فقدان الحزم وتوزيع شبكات LAN بدون اختناق ومراكز البيانات. يتميز بـ ${model.badge} ضمن هيكل معدني متين وبنية موفرة للطاقة.`;
      }
      if (nameLower.includes("cisco") || model.brand.includes("CISCO")) {
        return `طراز بنية مؤسسية من سيسكو ${model.name}. يوفر توجيهاً وتبديلاً فائق الأداء للعمليات الحرجة مع ${model.badge} وضمان Cisco Smart Net المعتمد ومطابقة لهيئة المواصفات السعودية SASO.`;
      }
      return `طراز تجاري معتمد ${model.name} لبيئات المؤسسات الحيوية. يتميز بـ ${model.badge} مع ${model.specs.join("، ")} ودعم فني وتهيئة كاملة من مهندسي حلول ديسلا.`;
    }
    if (nameLower.includes("poe") || badgeLower.includes("poe")) {
      return `Surveillance-grade ${model.name} specifically engineered for high-density IP cameras, VoIP infrastructure, and smart sensor power delivery. Delivers ${model.badge} with certified 30W PoE+ budgets and 6KV lightning surge protection.`;
    }
    if (nameLower.includes("gigabit") || badgeLower.includes("gigabit") || badgeLower.includes("16-port") || badgeLower.includes("24-port")) {
      return `High-speed commercial ${model.name} built for zero packet loss, non-blocking LAN distribution, and data center top-of-rack switching. Features ${model.badge} in a rugged metal enclosure with energy-efficient green architecture.`;
    }
    if (nameLower.includes("cisco") || model.brand.includes("CISCO")) {
      return `Enterprise-grade Cisco architecture model ${model.name}. Provides mission-critical routing and switching performance featuring ${model.badge} with authentic Cisco Smart Net warranty support and Saudi SASO compliance.`;
    }
    return `Commercial-grade ${model.name} certified for mission-critical enterprise environments. Features ${model.badge} with ${model.specs.join(", ")} and complete technical staging support by DEYSLA solutions engineering team.`;
  };

  const activeSku = activeModel ? `DEY-${activeModel.id.toUpperCase().replace(/[^A-Z0-9]/g, "-")}` : `DEY-${product.id.toUpperCase()}`;

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <Link to={formatPath("/")} className="hover:text-slate-900 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <Link to={formatPath("/products")} className="hover:text-slate-900 transition-colors">
              {isAr ? "المنتجات" : "Products"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <Link to={formatPath(`/products/${category.slug}`)} className="hover:text-slate-900 transition-colors">
              {categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <span className="text-slate-700">{product.name}</span>
            {activeModel && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
                <span className="font-bold text-blue-700">{activeModel.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Product Overview Hero */}
      <section className="py-8 sm:py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Product Image & Hardware Thumbnail Carousel */}
            <div className="lg:col-span-6 space-y-4">
              {/* Product Hero Image Container */}
              <div className="w-full h-84 sm:h-96 rounded-2xl border border-slate-200/90 bg-white p-6 relative overflow-hidden shadow-xs group flex items-center justify-center">
                <img
                  src={activeModel ? activeModel.imageWebp : getProductImage(product.id, product.image)}
                  alt={activeModel ? `${activeModel.name} · ${activeModel.brand}` : (product.imageAlt || product.name)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain object-center drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                  onClick={() => setIsZoomModalOpen(true)}
                  onError={(e) => {
                    const fallback = product.image || "/assets/products/network-switches.webp";
                    (e.target as HTMLImageElement).src = fallback;
                  }}
                />

                {/* Subtle zoom button on hover */}
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="absolute top-3 end-3 z-10 p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200/80 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                  title={isAr ? "تكبير صورة المنتج" : "Zoom product image"}
                  aria-label={isAr ? "تكبير صورة المنتج" : "Zoom product image"}
                >
                  <ZoomIn className="w-4 h-4 text-slate-700" />
                </button>
              </div>

              {/* Sub-Products / Hardware Models Thumbnail Selector */}
              {catalogModels.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-bold text-slate-900">
                        {isAr
                          ? "انقر على طراز لمعاينة التفاصيل والصور الأصلية:"
                          : "Click a Sub-Product to Inspect Details & Original Photos:"}
                      </span>
                    </div>
                    {activeModel && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModel(null);
                          setSelectedSubcategory(null);
                          setSearchParams({}, { replace: true });
                        }}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer underline"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{isAr ? "النظرة العامة الأساسية" : "Base Overview"}</span>
                      </button>
                    )}
                  </div>

                  {/* Horizontal Scroll Carousel of Sub-Products */}
                  <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                    {catalogModels.map((m) => {
                      const isSelected = activeModel?.id === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleSelectModel(m)}
                          className={`shrink-0 w-32 h-32 rounded-xl border p-2 transition-all flex flex-col items-center justify-between relative overflow-hidden group/btn text-start cursor-pointer ${
                            isSelected
                              ? "border-blue-600 ring-3 ring-blue-500/50 bg-blue-50/80 shadow-md scale-102"
                              : "border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 hover:shadow-xs"
                          }`}
                          title={`${m.name} (${m.badge})`}
                        >
                          {/* Active Indicator Pin */}
                          {isSelected && (
                            <span className="absolute top-1 end-1 z-10 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}

                          <div className="w-full h-16 rounded-lg p-1 flex items-center justify-center overflow-hidden bg-slate-50 border border-slate-200/80">
                            <img
                              src={m.imageWebp}
                              alt={m.name}
                              className="w-full h-full object-contain group-hover/btn:scale-105 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = product.image;
                              }}
                            />
                          </div>

                          <div className="w-full px-0.5 mt-1 text-center">
                            <p className="text-[10.5px] font-bold text-slate-900 truncate leading-tight">
                              {m.name}
                            </p>
                            <p className="text-[9px] font-mono text-blue-600 truncate font-semibold isolate-ltr" dir="ltr">
                              {m.badge}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Genuine OEM Guarantee Bar */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">
                    {isAr
                      ? "أجهزة أصلية معتمدة 100% مع ضمان الرقم التسلسلي"
                      : "100% Genuine OEM Hardware with Serial Warranty"}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 isolate-ltr" dir="ltr">
                  SASO &bull; CITC
                </span>
              </div>
            </div>

            {/* Right: Dynamic Sub-Product Details & Interactive Specifications */}
            <div className="lg:col-span-6 space-y-5">
              {/* Active Sub-Product Header Banner */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    {categoryName}
                  </span>
                  <span className="text-slate-300 font-bold">&bull;</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {product.name}
                  </span>
                  {activeModel && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {isAr ? "طراز نشط" : "Active Sub-Product"}
                    </span>
                  )}
                </div>

                {/* Sub-Product Main Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {activeModel ? activeModel.name : product.name}
                </h1>

                {/* Subtitle with Model Badge & Brand */}
                <div className="mt-2 flex items-center gap-2.5 flex-wrap text-xs">
                  <span className="font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 isolate-ltr" dir="ltr">
                    {activeModel ? activeModel.brand : (product.brandIds[0]?.toUpperCase() || "OEM CERTIFIED")}
                  </span>
                  {activeModel && (
                    <span className="font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-[11px] isolate-ltr" dir="ltr">
                      {activeModel.badge}
                    </span>
                  )}
                  <span className="font-mono text-slate-400 text-[11px] isolate-ltr" dir="ltr">
                    SKU: {activeSku}
                  </span>
                </div>

                {/* Sub-Product Tailored Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3.5">
                  {getSubProductDescription(activeModel)}
                </p>
              </div>

              {/* Interactive Sub-Product Specifications & Details Panel */}
              {activeModel && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4 shadow-xs">
                  {/* Tabs Header */}
                  <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveTab("specs")}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "specs"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                      }`}
                    >
                      {isAr ? "المواصفات الفنية" : "Technical Specs"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("features")}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "features"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                      }`}
                    >
                      {isAr ? "المزايا والطاقة" : "Features & Power"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("deployment")}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "deployment"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                      }`}
                    >
                      {isAr ? "الضمان والتهيئة" : "Warranty & Staging"}
                    </button>
                  </div>

                  {/* Tab 1: Technical Specs */}
                  {activeTab === "specs" && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeModel.specs.map((sp, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2 shadow-2xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                                {isAr ? `مواصفة 0${idx + 1}` : `Specification 0${idx + 1}`}
                              </span>
                              <span className="text-xs font-bold text-slate-800 leading-snug">
                                {sp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs border-t border-slate-200">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Cpu className="w-3.5 h-3.5 text-sky-600" />
                          <span className="font-medium">
                            {isAr ? "الهيكل: معدني صناعي مدمج بدون مروحة / 1U رف" : "Chassis: Industrial Fanless Metal Desktop / 1U"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsDatasheetOpen(true)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isAr ? "النشرة الفنية الكاملة" : "Full Datasheet Modal"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Features & Power */}
                  {activeTab === "features" && (
                    <div className="space-y-3 text-xs text-slate-600 animate-in fade-in duration-200">
                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isAr ? "بنية الطاقة والحماية من الجهد" : "Power Architecture & Surge Immunity"}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          {isAr
                            ? "مزود بحماية من زيادة التيار حتى 6KV على منافذ الشبكة مع عزل خط AC. تخصيص تلقائي لطاقة PoE+ (حتى 30 واط/منفذ) لحماية الأجهزة المتصلة من تذبذب الجهد."
                            : "Equipped with 6KV surge protection on network ports and AC line isolation. Auto-sensing PoE+ power allocation (up to 30W/port) safeguards connected devices from voltage spikes."}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <Activity className="w-3.5 h-3.5 text-blue-600" />
                          <span>{isAr ? "جودة الخدمة (QoS) وتحديد الأولويات" : "Quality of Service (QoS) & Prioritization"}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          {isAr
                            ? "تصنيف حركة البيانات على مستوى العتاد وفق 802.1p لضمان تسليم سلس ودون تأخير لبث الفيديو لكاميرات المراقبة، مكالمات VoIP، وأنظمة تخطيط موارد المؤسسات (ERP)."
                            : "Hardware-level 802.1p traffic classification ensures uninterrupted delivery for latency-sensitive CCTV video streams, VoIP calls, and critical business ERP systems."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Warranty & Staging */}
                  {activeTab === "deployment" && (
                    <div className="space-y-3 text-xs text-slate-600 animate-in fade-in duration-200">
                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>{isAr ? "استبدال متقدم للأجهزة لمدة 3 سنوات" : "3-Year Advanced Hardware Replacement"}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          {isAr
                            ? "ضمان استبدال مباشر من الشركة المصنعة مدعوم باتفاقية مستوى خدمة ديسلا عبر مواقع المنطقة الشرقية، الرياض، وجدة."
                            : "Direct manufacturer replacement warranty backed by DEYSLA SLA response across Eastern Province, Riyadh, and Jeddah enterprise sites."}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <Server className="w-4 h-4 text-blue-600" />
                          <span>{isAr ? "الإعداد المسبق والتهيئة في فرع الدمام" : "Pre-Configuration & Staging in Dammam"}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          {isAr
                            ? "يمكن ضبط الوحدات مسبقاً بمخططات VLAN الخاصة بالعميل وعناوين IP وتحديثات البرامج الثابتة قبل التسليم الميداني للتشغيل الفوري."
                            : "Units can be pre-configured with client VLAN schemas, IP addresses, and firmware updates prior to on-site delivery for instant plug-and-play installation."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Clickable Subcategories & Product Variants */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {isAr ? "انقر لتصفية الطرازات حسب الفئة:" : "Click Category Filter to Find Sub-Products:"}
                  </h3>
                  {selectedSubcategory && (
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategory(null)}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      {isAr ? "مسح التصفية" : "Clear Filter"}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.subcategories.map((sub) => {
                    const isSelected = selectedSubcategory === sub;
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubcategoryClick(sub)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                        }`}
                        title={sub}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Selector for RFQ */}
              {availableBrands.length > 0 && (
                <div className="pt-1 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {isAr ? "العلامة التجارية المفضلة للجهة المصنعة:" : "Preferred Manufacturer Brand:"}
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="">
                      {activeModel
                        ? isAr
                          ? `${activeModel.brand} (الموصى به لهذا الطراز)`
                          : `${activeModel.brand} (Recommended for this Model)`
                        : isAr
                        ? "أي علامة تجارية معتمدة / أفضل توصية"
                        : "Any Supported Brand / Best Recommendation"}
                    </option>
                    {availableBrands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.origin})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity & Quotation Action Box */}
              <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {isAr ? "الكمية التقديرية" : "Estimated Quantity"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {isAr ? "المستهدف:" : "Target:"} {activeModel ? activeModel.name : product.name}
                    </span>
                  </div>
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-slate-900 tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  placeholder={
                    isAr
                      ? "موقع المشروع الاختياري، عدد المنافذ، أو كود مورد أرامكو..."
                      : "Optional site location, port count, or Aramco vendor code..."
                  }
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:border-blue-600"
                />

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-[0.99]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {isAr
                      ? `إضافة ${activeModel ? activeModel.name : product.name} إلى طلب عرض السعر`
                      : `Add ${activeModel ? activeModel.name : product.name} to RFQ`}
                  </span>
                </button>
                <p className="text-[11px] text-center text-slate-500">
                  {isAr
                    ? "لا يتطلب دفعاً إلكترونياً. عرض سعر رسمي مع اتفاقية مستوى الخدمة من مكتب مبيعات ديسلا."
                    : "No online payment required. Official commercial quotation with SLA issued by DEYSLA sales desk."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Technical Datasheet Modal */}
      {isDatasheetOpen && activeModel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold block">
                  {isAr ? "النشرة الفنية المصنعية الرسمية" : "Commercial OEM Datasheet"}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {activeModel.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDatasheetOpen(false)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-950 text-white">
                <div className="w-24 h-24 bg-slate-900 rounded-lg p-2 flex items-center justify-center shrink-0">
                  <img
                    src={activeModel.imageWebp}
                    alt={activeModel.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-start">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] isolate-ltr" dir="ltr">
                      {activeModel.brand}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] isolate-ltr" dir="ltr">
                      {activeModel.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{activeModel.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono isolate-ltr" dir="ltr">
                    SKU: {activeSku}
                  </p>
                </div>
              </div>

              {/* Datasheet Parameters Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                  {isAr ? "مصفوفة المواصفات الفنية والواجهات" : "Hardware Specifications & Interface Matrix"}
                </h4>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-start">
                    <tbody className="divide-y divide-slate-100">
                      {activeModel.specs.map((sp, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                          <td className="p-2.5 font-bold text-slate-900 w-1/3">
                            {isAr ? `معيار 0${idx + 1}` : `Parameter 0${idx + 1}`}
                          </td>
                          <td className="p-2.5 text-slate-700">{sp}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">
                          {isAr ? "هيكل الجهاز" : "Chassis Form Factor"}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {isAr ? "مكتبي / رف 1U هيكل فولاذي مقوى" : "Desktop / 1U Rackmount Ruggedized Steel Enclosure"}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-2.5 font-bold text-slate-900">
                          {isAr ? "مصدر الطاقة" : "Power Input"}
                        </td>
                        <td className="p-2.5 text-slate-700 isolate-ltr" dir="ltr">
                          100-240V AC 50/60Hz Internal PSU with Surge Suppression
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">
                          {isAr ? "المطابقة والاعتماد" : "Compliance & SASO"}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {isAr ? "معتمد من هيئة الاتصالات والفضاء والتقنية ومطابق للمواصفة القياسية SASO" : "Saudi CITC Approved, SASO IEC 62368-1 Certified"}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-2.5 font-bold text-slate-900">
                          {isAr ? "تغطية الضمان" : "Warranty Coverage"}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {isAr ? "استبدال متقدم للأجهزة لمدة 3 سنوات واتفاقية مستوى خدمة ديسلا" : "3-Year Advanced Hardware Replacement & DEYSLA SLA"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsDatasheetOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart();
                  setIsDatasheetOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{isAr ? "إضافة الطراز إلى عرض السعر" : "Add Model to RFQ"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen HD Studio Image Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-xs uppercase isolate-ltr" dir="ltr">
                  {activeModel ? activeModel.brand : (product.brandIds[0]?.toUpperCase() || "OEM HARDWARE")}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeModel ? activeModel.name : product.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBackdropMode((b) => (b === "light" ? "dark" : "light"))}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                  {backdropMode === "light" ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isAr ? "الخلفية الداكنة" : "Dark Stage"}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? "الخلفية الفاتحة" : "Light Stage"}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* High-Res Image View Stage */}
            <div
              className={`w-full flex-1 min-h-[350px] sm:min-h-[480px] my-4 rounded-xl flex items-center justify-center p-6 border ${
                backdropMode === "light"
                  ? "bg-white border-slate-200"
                  : "bg-slate-950 border-slate-800"
              }`}
            >
              <img
                src={activeModel ? activeModel.imageWebp : getProductImage(product.id, product.image)}
                alt={activeModel ? activeModel.name : product.name}
                className="max-h-[450px] w-auto max-w-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Footer with Verification Details */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-300">
                  {isAr
                    ? `صورة أصلية معتمدة ومطابقة لـ ${activeModel ? activeModel.name : product.name}`
                    : `100% Authentic Product Photo Verified with ${activeModel ? activeModel.name : product.name}`}
                </span>
              </div>
              <span className="font-mono text-slate-500 text-[11px] isolate-ltr" dir="ltr">
                SKU: {activeSku}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Certified Hardware Models & Variants */}
      {catalogModels.length > 0 && (
        <section className="py-10 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  {isAr ? "مخزون الأجهزة المعتمد" : "Verified Product Inventory"}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {isAr
                    ? `طرازات ومعدات ${product.name}`
                    : `${product.name} Equipment Models & Variants`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {isAr
                    ? "وحدات أجهزة أصلية معتمدة متوفرة للتوريد والتجهيز ونشر اتفاقية مستوى الخدمة."
                    : "Specific OEM hardware units available for procurement, staging, and SLA deployment."}
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-max">
                {catalogModels.length} {isAr ? "طرازاً معتمداً" : "Models Certified"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogModels.map((item) => (
                <div
                  key={item.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                    activeModel?.id === item.id
                      ? "border-blue-500 shadow-md bg-blue-50/10"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Model Studio Photo */}
                    <div className="w-full h-48 rounded-xl bg-white border border-slate-200/90 p-3 relative overflow-hidden flex items-center justify-center group/card shadow-2xs">
                      <img
                        src={item.imageWebp}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full max-h-full max-w-full object-contain object-center group-hover/card:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = product.image;
                        }}
                      />
                      <div className="absolute top-2.5 start-2.5 flex items-center gap-1.5 z-10">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white shadow-xs backdrop-blur-xs isolate-ltr" dir="ltr">
                          {item.brand}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/90 text-slate-200 border border-white/10 backdrop-blur-xs isolate-ltr" dir="ltr">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {item.name}
                      </h3>
                    </div>

                    {/* Technical Specs */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100">
                      {item.specs.map((sp, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{sp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectModel(item);
                        window.scrollTo({ top: 120, behavior: "smooth" });
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isAr ? "معاينة التفاصيل" : "Inspect Details"}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        addItem({
                          id: item.id,
                          name: `${item.name} (${product.name})`,
                          categoryName: categoryName,
                          brandPreference: item.brand,
                          image: item.imageWebp,
                        });
                        setIsEnquiryModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{isAr ? "طلب تسعير الطراز" : "Quote Model"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Applications & Features */}
      <section className="py-10 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
              {isAr ? "التطبيقات الميدانية" : "Field Implementation"}
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              {isAr ? "أبرز التطبيقات المؤسسية" : "Primary Enterprise Applications"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {product.keyApplications.map((app, idx) => (
              <div
                key={app}
                className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-max">
                  {isAr ? `تطبيق 0${idx + 1}` : `Application 0${idx + 1}`}
                </span>
                <p className="text-xs font-bold text-slate-900">{app}</p>
                <p className="text-[11px] text-slate-500">
                  {isAr
                    ? "مختبرة ومصممة لضمان استمرارية تشغيل الأنظمة الحيوية."
                    : "Tested and engineered to maintain continuous service availability."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available DEYSLA Brands (Cross-Linking) */}
      {availableBrands.length > 0 && (
        <section className="py-10 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                {isAr ? "التحالفات المصنعية" : "Manufacturer Alliances"}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {isAr
                  ? `العلامات التجارية المعتمدة لدى ديسلا لـ ${product.name}`
                  : `Available DEYSLA Brands for ${product.name}`}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr
                  ? "تورّد ديسلا أجهزة ومعدات أصلية معتمدة فقط عبر شراكات مع كبرى الشركات المصنعة."
                  : "DEYSLA only delivers authentic OEM hardware from verified brand partnerships."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {availableBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={formatPath(`/brands/${brand.slug}`)}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col items-center justify-center h-28 text-center group"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-12 max-w-full object-contain filter group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="text-xs font-semibold text-slate-800 mt-2 truncate w-full group-hover:text-blue-700">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {otherProductsInCategory.length > 0 && (
        <section className="py-10 sm:py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">
              {isAr ? `أجهزة ذات صلة بفئة ${categoryName}` : `Related ${category.name} Hardware`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherProductsInCategory.slice(0, 3).map((op) => (
                <Link
                  key={op.id}
                  to={formatPath(`/products/${category.slug}/${op.slug}`)}
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                    <img
                      src={getProductImage(op.id, op.image)}
                      alt={op.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                      {op.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {op.subcategories.slice(0, 2).join(", ")}
                    </p>
                    <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-block">
                      {isAr ? "عرض المواصفات ←" : "View Specs →"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
