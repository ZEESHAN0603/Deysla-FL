import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Trash2, Send, CheckCircle2, ArrowRight, ShieldCheck, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const CartPage: React.FC = () => {
  const { dict, lang, formatPath } = useLanguage();
  const {
    items,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    city: "Dammam",
    projectTimeline: "Immediate (1-2 weeks)",
    notes: "",
    website: "", // honeypot
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.companyName.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى إكمال جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، الهاتف، واسم الشركة).' : "Please complete all required fields (Name, Corporate Email, Phone, and Company Name).");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال عنوان بريد إلكتروني صحيح للشركة.' : "Please enter a valid corporate email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        companyName: formData.companyName.trim(),
        city: formData.city,
        projectTimeline: formData.projectTimeline,
        notes: formData.notes.trim(),
        website: formData.website,
        items: items.map((it) => ({
          id: it.id,
          title: it.name,
          category: it.categoryName,
          brand: it.brandPreference,
          quantity: it.quantity,
          notes: it.notes,
        })),
      };

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || (lang === 'ar' ? 'فشل إرسال طلب عرض الأسعار. يرجى المحاولة مرة أخرى أو مراسلتنا على info@deysla.com.' : "Failed to submit RFQ. Please try again or contact info@deysla.com directly."));
      }

      setSubmittedRef(data.rfqReference || `DEY-RFQ-${Date.now().toString().slice(-6)}`);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ar' ? 'فشل إرسال الطلب. يرجى التحقق من اتصال الشبكة والمحاولة مجدداً.' : "Failed to dispatch RFQ. Please check your network and try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-xs">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to={formatPath("/")} className="hover:text-sky-700 transition-colors">
              {dict.nav.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <Link to={formatPath("/products")} className="hover:text-sky-700 transition-colors">
              {dict.nav.products}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <span className="font-semibold text-slate-900">{dict.cart.pageTitle}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative theme-hero-luminous text-slate-900 py-14 sm:py-20 lg:py-24 border-b border-slate-200/80 overflow-hidden">
        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />

        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 theme-grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>{lang === 'ar' ? 'مكتب طلبات عروض الأسعار والمشتريات التجارية للشركات' : 'B2B RFQ & COMMERCIAL PROCUREMENT DESK'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-3xl leading-tight">
            {dict.cart.pageTitle}
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {dict.cart.pageSubtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'ar' ? 'معدات أصلية 100% من الشركات المصنعة' : '100% Genuine OEM Equipment'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
              <span>{lang === 'ar' ? 'تجميع بنود الشراء متعددة العلامات التجارية' : 'Multi-Brand Line Item Consolidation'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
              <span>{lang === 'ar' ? 'توريد معتمد عبر قنوات التوزيع بدول الخليج' : 'Authorized GCC Channel Supply'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {submittedRef ? (
            <div className="max-w-xl mx-auto p-10 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{dict.cart.successRfqTitle}</h2>
              <p className="text-sm text-slate-600">
                {dict.cart.successRfqMsg}
              </p>
              <div className="inline-block px-5 py-2.5 bg-slate-100 rounded-xl font-mono font-bold text-slate-900 text-lg border border-slate-200 isolate-ltr">
                <span className="text-xs text-slate-500 font-sans block mb-1">{dict.cart.rfqRefPrefix}</span>
                {submittedRef}
              </div>
              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? `سيتم إرسال العرض التجاري الرسمي مع المواصفات الفنية إلى ${formData.email} خلال 24 ساعة عمل.`
                  : `An official commercial proposal with technical datasheets will be delivered to ${formData.email} within 24 hours.`
                }
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  to={formatPath("/products")}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  {dict.cart.browseCatalogBtn}
                </Link>
                <Link
                  to={formatPath("/contact")}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {dict.nav.contact}
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="max-w-lg mx-auto p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{dict.cart.emptyCartTitle}</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {dict.cart.emptyCartSubtitle}
              </p>
              <div className="pt-2">
                <Link
                  to={formatPath("/products")}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>{dict.cart.browseCatalogBtn}</span>
                  <ArrowRight className="w-4 h-4 rtl-flip" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Items List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {dict.cart.lineItemsTitle} ({items.length} {items.length === 1 ? dict.nav.itemSingular : dict.nav.itemsPlural})
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    {dict.cart.clearCartBtn}
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
                            {item.categoryName}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                          {item.brandPreference && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {dict.products.brandLabel}: <strong className="text-slate-800">{item.brandPreference}</strong>
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-xs font-bold text-slate-900 bg-white tabular-nums isolate-ltr">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <input
                          type="text"
                          value={item.notes || ""}
                          onChange={(e) => updateNotes(item.id, e.target.value)}
                          placeholder={dict.cart.notesPlaceholder}
                          className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-blue-600"
                          dir="auto"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    to={formatPath("/products")}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180 rtl:rotate-0" />
                    <span>{dict.cart.browseCatalogBtn}</span>
                  </Link>
                </div>
              </div>

              {/* Quotation Submission Form */}
              <div className="lg:col-span-5">
                <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-5 sticky top-28">
                  <div>
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      {dict.cart.formSectionTitle}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">
                      {dict.nav.requestQuote}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {dict.cart.formSectionSubtitle}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Honeypot field */}
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {dict.cart.fullNameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={dict.contact.namePlaceholder}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
                        dir="auto"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {dict.cart.corpEmailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={dict.contact.emailPlaceholder}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 isolate-ltr"
                        dir="ltr"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {dict.cart.phoneLabel}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={dict.contact.phonePlaceholder}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 isolate-ltr"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {dict.cart.companyLabel}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder={dict.contact.companyPlaceholder}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
                          dir="auto"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {dict.cart.cityLabel}
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder={lang === 'ar' ? 'الدمام، الرياض...' : 'e.g. Dammam, Riyadh'}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
                          dir="auto"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {dict.cart.timelineLabel}
                        </label>
                        <select
                          value={formData.projectTimeline}
                          onChange={(e) => setFormData({ ...formData, projectTimeline: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 bg-white"
                        >
                          <option value="Immediate (1-2 weeks)">{lang === 'ar' ? 'عاجل (1-2 أسبوع)' : 'Immediate (1-2 weeks)'}</option>
                          <option value="Within 1 Month">{lang === 'ar' ? 'خلال شهر' : 'Within 1 Month'}</option>
                          <option value="Quarterly">{lang === 'ar' ? 'خلال الربع الحالي' : 'Quarterly'}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {dict.cart.scopeLabel}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder={lang === 'ar' ? 'أضف شروط التسليم، أطوال الكابلات، متطلبات المنافذ...' : 'Add delivery terms, cabling lengths, or port specs...'}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 resize-none"
                        dir="auto"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 theme-button-primary font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{dict.cart.submittingRfqBtn}</span>
                        </>
                      ) : (
                        <>
                          <span>{dict.cart.submitRfqBtn}</span>
                          <Send className="w-3.5 h-3.5 rtl-flip" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
