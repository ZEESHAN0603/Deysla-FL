import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, Box, ShoppingCart, Send, Search, Filter } from "lucide-react";
import { PRODUCT_CATEGORIES } from "../data/productCategories";
import { PRODUCTS_DATA, ProductType } from "../data/products";
import { BRANDS_DATA } from "../data/brands";
import { SERVICES_DATA } from "../data/services";
import { getCatalogItemsByCategory } from "../data/productCatalogItems";
import { useCart } from "../context/CartContext";
import { usePosterImages } from "../context/PosterImagesContext";
import { useLanguage } from "../context/LanguageContext";
import { CATEGORY_TRANSLATIONS, SERVICE_TRANSLATIONS } from "../i18n/translations";

export const ProductCategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { addItem, setIsEnquiryModalOpen } = useCart();
  const { getProductImage } = usePosterImages();
  const { dict, lang, formatPath } = useLanguage();
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const category = PRODUCT_CATEGORIES.find((c) => c.slug === categorySlug);

  if (!category) {
    return <Navigate to={formatPath("/products")} replace />;
  }

  const categoryName = CATEGORY_TRANSLATIONS[lang]?.[category.id]?.name || category.name;
  const categoryDesc = CATEGORY_TRANSLATIONS[lang]?.[category.id]?.description || category.description;

  const categoryProducts = PRODUCTS_DATA.filter((p) => p.categoryId === category.id);
  const relevantBrands = BRANDS_DATA.filter((b) => b.categoryIds.includes(category.id));
  const relatedServices = SERVICES_DATA.filter((s) => s.relevantCategories.includes(category.id));
  const categoryCatalogItems = getCatalogItemsByCategory(category.id);

  const filteredCatalogItems = categoryCatalogItems.filter((item) => {
    const matchesSub = selectedSubcategoryFilter === "all" || item.subcategoryId === selectedSubcategoryFilter;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesSearch;
  });

  return (
    <div className="w-full bg-white">
      {/* Breadcrumbs */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to={formatPath("/")} className="hover:text-slate-900 transition-colors">
              {dict.nav.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <Link to={formatPath("/products")} className="hover:text-slate-900 transition-colors">
              {dict.nav.products}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <span className="font-semibold text-slate-900">{categoryName}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header with Hardware Photography Backdrop */}
      <section className="relative bg-slate-950 text-white py-12 sm:py-16 lg:py-20 border-b border-slate-800 overflow-hidden">
        {category.featuredImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={category.featuredImage}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-25 filter blur-xs scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/80" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            {lang === 'ar' ? 'فئة منتجات ديسلا المعتمدة' : 'DEYSLA PRODUCT LINE'}
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight uppercase">
            {categoryName}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {categoryDesc}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                addItem({
                  id: `cat-${category.id}`,
                  name: `${categoryName} Complete Line RFQ`,
                  categoryName: categoryName,
                });
                setIsEnquiryModalOpen(true);
              }}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{lang === 'ar' ? 'طلب تسعير شامل للفئة' : 'Request Category Quotation'}</span>
            </button>
            <Link
              to={formatPath("/brands")}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              {lang === 'ar' ? 'استعراض العلامات التجارية المتوافقة' : 'Browse Compatible Brands'}
            </Link>
          </div>
        </div>
      </section>

      {/* Product Type Grid */}
      <section className="py-10 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
              {lang === 'ar' ? 'بنود الكتالوج' : 'Catalogue Items'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 uppercase">
              {lang === 'ar' ? `منتجات ${categoryName}` : `${categoryName} Products`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Product Image */}
                  <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-200/80 p-2 relative overflow-hidden flex items-center justify-center group/img">
                    <img
                      src={getProductImage(prod.id, prod.image)}
                      alt={prod.imageAlt || prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/products/network-switches.webp";
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 uppercase">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {prod.description}
                    </p>
                  </div>

                  {/* Subcategories */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {lang === 'ar' ? 'الأنظمة الفرعية (انقر لعرض المواصفات):' : 'Sub-Products (Click to View Details):'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {prod.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={formatPath(`/products/${category.slug}/${prod.slug}?sub=${encodeURIComponent(sub)}`)}
                          className="text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 group/sub"
                          title={`Inspect ${sub}`}
                        >
                          <span>{sub}</span>
                          <ChevronRight className="w-2.5 h-2.5 opacity-60 rtl-flip group-hover/sub:translate-x-0.5 rtl:group-hover/sub:-translate-x-0.5 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    to={formatPath(`/products/${category.slug}/${prod.slug}`)}
                    className="text-xs font-bold text-slate-900 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    <span>{dict.products.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform text-slate-400 group-hover:text-blue-600" />
                  </Link>

                  <button
                    onClick={() => {
                      addItem({
                        id: prod.id,
                        name: prod.name,
                        categoryName: categoryName,
                        image: prod.image,
                      });
                      setIsEnquiryModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{lang === 'ar' ? 'طلب تسعيرة' : 'Get Quote'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certified Equipment Models & Hardware Inventory */}
      {categoryCatalogItems.length > 0 && (
        <section className="py-10 sm:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  {lang === 'ar' ? 'مخزون المعدات المعتمدة' : 'Equipment Inventory'}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 uppercase">
                  {lang === 'ar' ? `الموديلات والأجهزة المعتمدة لـ ${categoryName}` : `${categoryName} Certified Models & Hardware`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {lang === 'ar' ? 'استعرض الموديلات والمعدات المتوفرة والمجهزة في مستودعات ديسلا.' : 'Browse specific commercial hardware models deployed and staged by DEYSLA.'}
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'البحث عن موديل، علامة تجارية...' : 'Search models, brands, specs...'}
                  className="w-full text-xs ps-9 pe-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:bg-white focus:border-blue-600 transition-all"
                  dir="auto"
                />
              </div>
            </div>

            {/* Subcategory Pills Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                type="button"
                onClick={() => setSelectedSubcategoryFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubcategoryFilter === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lang === 'ar' ? `كافة الموديلات (${categoryCatalogItems.length})` : `All Models (${categoryCatalogItems.length})`}
              </button>
              {categoryProducts.map((p) => {
                const count = categoryCatalogItems.filter((it) => it.subcategoryId === p.id).length;
                if (count === 0) return null;
                const isSelected = selectedSubcategoryFilter === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedSubcategoryFilter(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Models Cards Grid */}
            {filteredCatalogItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCatalogItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      {/* Studio Product Image */}
                      <div className="w-full h-44 rounded-xl bg-slate-50/60 border border-slate-100 p-4 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={item.imageWebp}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.image;
                          }}
                        />
                        <div className="absolute top-2 start-2 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                            {item.brand}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">
                          {item.subcategoryName}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">
                          {item.name}
                        </h3>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        {item.specs.map((sp, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{sp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        to={formatPath(`/products/${category.slug}/${item.subcategoryId}?model=${item.id}`)}
                        className="text-xs font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1 group/btn"
                        title={`Inspect full specifications for ${item.name}`}
                      >
                        <span>{dict.products.viewDetails}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl-flip text-slate-400 group-hover/btn:text-blue-600 group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5 transition-transform" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          addItem({
                            id: item.id,
                            name: `${item.name} (${item.subcategoryName})`,
                            categoryName: categoryName,
                            brandPreference: item.brand,
                            image: item.imageWebp,
                          });
                          setIsEnquiryModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'إضافة للتسعير' : 'Add Quote'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  {lang === 'ar' ? 'لا توجد موديلات تطابق معايير البحث' : 'No models match your search criteria'}
                </p>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'يرجى تجربة كلمات بحث أو فلاتر أخرى' : 'Try adjusting your search terms or filters'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSubcategoryFilter("all");
                  }}
                  className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Relevant Brands Section */}
      {relevantBrands.length > 0 && (
        <section className="py-10 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  {lang === 'ar' ? 'شركاء التصنيع (OEM)' : 'OEM Partners'}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === 'ar' ? `العلامات التجارية المعتمدة لـ ${categoryName}` : `Certified Brands for ${categoryName}`}
                </h3>
              </div>
              <Link
                to={formatPath("/brands")}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>{dict.brands.allBrands}</span>
                <ArrowRight className="w-3 h-3 rtl-flip" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {relevantBrands.map((brand) => (
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

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-10 sm:py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                {lang === 'ar' ? 'الخدمات الهندسية المرتبطة' : 'Engineering Services'}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'ar' ? 'خدمات التنفيذ المتكامل والصيانة' : 'Turnkey Implementation & Maintenance Services'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedServices.map((svc) => {
                const svcTitle = SERVICE_TRANSLATIONS[lang]?.[svc.id]?.title || svc.title;
                const svcDesc = SERVICE_TRANSLATIONS[lang]?.[svc.id]?.shortDescription || svc.shortDescription;

                return (
                  <Link
                    key={svc.id}
                    to={formatPath(`/services/${svc.slug}`)}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded isolate-ltr">
                        {svc.number}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 mt-2">
                        {svcTitle}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {svcDesc}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 mt-4 flex items-center gap-1">
                      <span>{lang === 'ar' ? 'استعراض نطاق الخدمة' : 'View Service Scope'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Quotation Section */}
      <section className="py-10 sm:py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {lang === 'ar' ? `هل تحتاج إلى دراسة وتخصيص كميات لـ ${categoryName}؟` : `Need Custom Sizing for ${categoryName}?`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {lang === 'ar'
              ? 'يساعدك مهندسونا المعتمدون في إعداد مخططات الشبكة وميزانيات الفقد البصري وجداول كميات المسح الميداني (BOQ).'
              : 'Our certified pre-sales engineers assist with network topology designs, optical loss budgets, and site survey bills of quantities (BOQ).'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                addItem({
                  id: `cat-${category.id}-quote`,
                  name: `${categoryName} Custom Inquiry`,
                  categoryName: categoryName,
                });
                setIsEnquiryModalOpen(true);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
            >
              {lang === 'ar' ? 'إضافة الفئة لسلة التسعير' : 'Add Category to Quote Cart'}
            </button>
            <Link
              to={formatPath("/contact")}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
            >
              {lang === 'ar' ? 'التواصل مع مكتب الدمام' : 'Contact Dammam Office'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
