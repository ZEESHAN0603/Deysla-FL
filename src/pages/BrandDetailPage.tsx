import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, Box, ShoppingCart, ExternalLink, Globe } from "lucide-react";
import { BRANDS_DATA } from "../data/brands";
import { PRODUCTS_DATA } from "../data/products";
import { PRODUCT_CATEGORIES } from "../data/productCategories";
import { SERVICES_DATA } from "../data/services";
import { getBrandEquipmentItems } from "../data/brandProducts";
import { useCart } from "../context/CartContext";
import { usePosterImages } from "../context/PosterImagesContext";
import { useLanguage } from "../context/LanguageContext";
import { CATEGORY_TRANSLATIONS, SERVICE_TRANSLATIONS } from "../i18n/translations";

export const BrandDetailPage: React.FC = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const { addItem, setIsEnquiryModalOpen } = useCart();
  const { getProductImage } = usePosterImages();
  const { language, formatPath } = useLanguage();
  const isAr = language === "ar";

  const brand = BRANDS_DATA.find((b) => b.slug === brandSlug);

  if (!brand) {
    return <Navigate to={formatPath("/brands")} replace />;
  }

  const brandEquipment = getBrandEquipmentItems(brand.id);

  // Cross-linked products supported strictly by DEYSLA
  const supportedProducts = PRODUCTS_DATA.filter((p) =>
    brand.productIds.includes(p.id)
  );

  const supportedCategories = PRODUCT_CATEGORIES.filter((c) =>
    brand.categoryIds.includes(c.id)
  );

  const relatedServices = SERVICES_DATA.filter((s) =>
    s.relevantBrandIds.includes(brand.id)
  );

  return (
    <div className="w-full bg-white/70 backdrop-blur-xs">
      {/* Breadcrumbs */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to={formatPath("/")} className="hover:text-sky-700 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <Link to={formatPath("/brands")} className="hover:text-sky-700 transition-colors">
              {isAr ? "العلامات التجارية" : "Brands"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <span className="font-semibold text-slate-900">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Brand Hero Header */}
      <section className="relative theme-hero-luminous text-slate-900 py-14 sm:py-20 lg:py-24 border-b border-slate-200/80 overflow-hidden">
        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />

        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 theme-grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span>
                  {isAr ? "تحالف ديسلا للتقنية المصنعية الأصلية" : "DEYSLA OEM TECHNOLOGY ALLIANCE"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
                {brand.name}
              </h1>
              <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                {brand.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-600 font-medium pt-2 flex-wrap">
                <span>
                  {isAr ? "بلد المنشأ:" : "Origin:"}{" "}
                  <strong className="text-slate-900 font-bold isolate-ltr" dir="ltr">
                    {brand.origin || (isAr ? "عالمي" : "Global")}
                  </strong>
                </span>
                <span>·</span>
                <span>
                  {isAr ? "نشر وتوريد معتمد عبر قنوات ديسلا" : "Authorized DEYSLA Channel Deployment"}
                </span>
              </div>
            </div>

            {/* Brand Logo Showcase in Hero */}
            <div className="lg:col-span-5 flex justify-start lg:justify-end">
              <div className="theme-card-ambient rounded-2xl w-full max-w-md p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="px-6 py-4 rounded-xl bg-white shadow-xs border border-slate-200/80 h-20 w-48 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isAr ? "شريك توزيع معتمد من المستوى الأول" : "Authorized Tier-1 Distribution Partner"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Overview & Categories */}
      <section className="py-10 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
              {isAr ? "توزيع الفئات التقنية" : "Category Distribution"}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isAr
                ? `المجالات التقنية التي ننشرها لـ ${brand.name}`
                : `Technology Domains We Deploy for ${brand.name}`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {supportedCategories.map((cat) => {
                const cName = (isAr && CATEGORY_TRANSLATIONS['ar']?.[cat.slug]?.name) || cat.name;
                const cHeadline = (isAr && CATEGORY_TRANSLATIONS['ar']?.[cat.slug]?.headline) || cat.headline;
                return (
                  <Link
                    key={cat.id}
                    to={formatPath(`/products/${cat.slug}`)}
                    className="p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-center gap-3.5 group"
                  >
                    <img src={cat.icon} alt="" className="w-10 h-10 object-contain shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                        {cName}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate">{cHeadline}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Specific Flagship Models & Hardware Series */}
          {brandEquipment.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                    {isAr ? "خط الأجهزة والمعدات المعتمد" : "Verified Hardware Line"}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {isAr
                      ? `أبرز طرازات ومعدات ${brand.name}`
                      : `Flagship ${brand.name} Equipment Models`}
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {brandEquipment.length} {isAr ? "طرازات تجارية متوفرة" : "Commercial Models Available"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {brandEquipment.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-black hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Realistic Hardware Product Photo Box */}
                      <div className="relative w-full h-48 bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden flex items-center justify-center p-4 group-hover:bg-neutral-100/60 transition-colors">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="max-h-36 w-auto object-contain group-hover:scale-106 transition-transform duration-300 drop-shadow-sm"
                        />
                        <span className="absolute top-3 start-3 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black text-white shadow-xs isolate-ltr" dir="ltr">
                          {item.model}
                        </span>
                        <span className="absolute bottom-3 end-3 text-[10px] font-mono text-neutral-800 bg-neutral-200 px-2 py-0.5 rounded font-semibold">
                          {item.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-neutral-900">{item.name}</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          {isAr ? "مرجع الطراز المعتمد رسمياً لدى ديسلا" : "Official DEYSLA Certified Model Reference"}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {item.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                        {isAr ? "متوفر في المخزون / توصيل لدول الخليج" : "In Stock / GCC Delivery"}
                      </span>
                      <button
                        onClick={() => {
                          addItem({
                            id: item.id,
                            name: `${brand.name} ${item.model} (${item.name})`,
                            categoryName: item.category,
                            brandPreference: brand.name,
                            image: item.image,
                          });
                          setIsEnquiryModalOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{isAr ? "إضافة الطراز إلى عرض السعر" : "Add Model to Quote"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products We Provide from Brand */}
          <div className="pt-6 border-t border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  {isAr ? "دليل المنتجات" : "Product Catalogue"}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {isAr
                    ? `فئات المنتجات الموردة من ${brand.name}`
                    : `Product Categories Supplied from ${brand.name}`}
                </h2>
              </div>
              <button
                onClick={() => {
                  addItem({
                    id: `brand-rfq-${brand.id}`,
                    name: `${brand.name} Complete Line RFQ`,
                    categoryName: brand.name,
                  });
                  setIsEnquiryModalOpen(true);
                }}
                className="px-4 py-2 theme-button-primary text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-sm hover:scale-[1.02] cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>
                  {isAr ? `طلب عرض سعر لمنتجات ${brand.name}` : `Request ${brand.name} Quote`}
                </span>
              </button>
            </div>

            {supportedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Product Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 uppercase">
                          {p.categoryName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {isAr ? "دليل المصنع" : "OEM Catalog"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{p.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2">
                        {p.subcategories.slice(0, 3).map((sub) => (
                          <span
                            key={sub}
                            className="text-[10px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={formatPath(`/products/${p.categoryId}/${p.slug}`)}
                        className="text-xs font-bold text-slate-900 hover:text-blue-700 flex items-center gap-1 group"
                      >
                        <span>{isAr ? "المواصفات الفنية" : "Specifications"}</span>
                        <ArrowRight className="w-3 h-3 rtl-flip group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform text-slate-400" />
                      </Link>

                      <button
                        onClick={() => {
                          addItem({
                            id: `${brand.id}-${p.id}`,
                            name: `${brand.name} ${p.name}`,
                            categoryName: p.categoryName,
                            brandPreference: brand.name,
                            image: p.image,
                          });
                          setIsEnquiryModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {isAr ? "إضافة للعرض" : "Add to Quote"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-2">
                <p className="text-sm font-bold text-slate-900">
                  {isAr ? "جاري تحديث الدليل" : "[PRODUCT_MAPPING_REQUIRED]"}
                </p>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {isAr
                    ? `يجري حالياً تحديث جداول الطرازات التفصيلية لـ ${brand.name} في دليلنا التجاري. يرجى تقديم طلب استفسار للتحقق المباشر من جدول المواد (BOM).`
                    : `Specific model mappings for ${brand.name} are currently being updated in our commercial catalogue. Please submit an enquiry for direct BOM verification.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-10 sm:py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">
              {isAr
                ? `خدمات التنفيذ والتركيب لـ ${brand.name}`
                : `Implementation Services for ${brand.name}`}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedServices.map((svc) => {
                const sTrans = isAr ? SERVICE_TRANSLATIONS['ar']?.[svc.slug] : null;
                const sTitle = sTrans?.title || svc.title;
                const sDesc = sTrans?.shortDescription || svc.shortDescription;
                return (
                  <Link
                    key={svc.id}
                    to={formatPath(`/services/${svc.slug}`)}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {svc.number}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 mt-2">
                        {sTitle}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{sDesc}</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 mt-4 flex items-center gap-1">
                      <span>{isAr ? "معاينة النطاق الهندسي" : "View Engineering Scope"}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Enquiry CTA Footer */}
      <section className="py-10 sm:py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {isAr
              ? `هل تحتاج إلى توريد معتمد لمنتجات ${brand.name}؟`
              : `Need Authorized Sourcing for ${brand.name}?`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {isAr
              ? "تنسق ديسلا مباشرة مع قنوات التوزيع المعتمدة لضمان أرقام تسلسلية أصلية، واتفاقيات دعم مؤسسي سارية، وشحن فوري للمشاريع."
              : "DEYSLA coordinates directly with authorized distribution channels to ensure authentic serial numbers, valid enterprise support agreements, and prompt project dispatch."}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to={formatPath("/contact")}
              className="px-6 py-3 theme-button-primary text-white text-xs font-bold rounded-xl transition-all shadow-md hover:scale-[1.02]"
            >
              {isAr ? "تواصل مع أخصائي العلامة التجارية" : "Contact Brand Specialist"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
