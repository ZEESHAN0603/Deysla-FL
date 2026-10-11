import React, { useState } from "react";
import { useCart, EnquiryItem } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { X, Trash2, Send, CheckCircle2, Building, Mail, Phone, User, FileText, ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import { COMPANY_DATA } from "../../data/company";

export const EnquiryDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
    isEnquiryModalOpen,
    setIsEnquiryModalOpen,
    totalItemsCount,
  } = useCart();
  const { language, isRTL, dict } = useLanguage();

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

  if (!isEnquiryModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.companyName.trim()) {
      setErrorMsg(language === "ar" ? "يرجى ملء جميع الحقول الإلزامية المطلوبة." : "Please provide your name, business email, phone, and company name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg(language === "ar" ? "يرجى إدخال بريد إلكتروني صالح." : "Please enter a valid business email address.");
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
        throw new Error(data.error || (language === "ar" ? "تعذر إرسال طلب عرض السعر. يرجى المحاولة لاحقاً." : "Failed to submit quote request. Please try again."));
      }

      setSubmittedRef(data.rfqReference || `DEY-RFQ-${Date.now().toString().slice(-6)}`);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || (language === "ar" ? "تعذر إرسال طلب عرض السعر. يرجى التحقق من الاتصال." : "Failed to dispatch RFQ. Please check your network and try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsEnquiryModalOpen(false);
    if (submittedRef) {
      setSubmittedRef(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        city: "Dammam",
        projectTimeline: "Immediate (1-2 weeks)",
        notes: "",
        website: "",
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-stretch ${
        isRTL ? "sm:justify-start" : "sm:justify-end"
      } bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in`}
      role="dialog"
      aria-modal="true"
      aria-label={dict.cart.title}
      onClick={handleClose}
    >
      <div
        className={`w-full sm:max-w-xl max-h-[90vh] sm:max-h-full h-auto sm:h-full bg-white rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom ${
          isRTL ? "sm:slide-in-from-left" : "sm:slide-in-from-right"
        } duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0" />

        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="h-1 w-full theme-gradient-bar shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                {dict.cart.title}
              </h2>
              <p className="text-xs text-neutral-500">
                {totalItemsCount} {totalItemsCount === 1 ? dict.nav.itemSingular : dict.nav.itemsPlural} · {dict.cart.rfqSub}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            aria-label={dict.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          {submittedRef ? (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-100 text-black border border-neutral-300 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">{dict.cart.successTitle}</h3>
              <p className="text-sm text-neutral-600 max-w-md mx-auto">
                {dict.cart.successMsg.replace("{name}", formData.name)}
              </p>
              <div className="inline-block px-4 py-2 bg-neutral-100 rounded-lg font-mono font-bold text-neutral-900 text-base border border-neutral-300 isolate-ltr">
                {submittedRef}
              </div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {dict.cart.teamFollowup.replace("{email}", formData.email)}
              </p>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  {dict.cart.returnCatalog}
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900">{dict.cart.emptyTitle}</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                {dict.cart.emptyDesc}
              </p>
              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  {dict.cart.browseCatalog}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {dict.cart.selectedEquipment} ({items.length})
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-neutral-500 hover:text-black font-medium transition-colors cursor-pointer"
                  >
                    {dict.cart.clearCart}
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[11px] font-medium text-neutral-600 uppercase tracking-wider block">
                          {item.categoryName}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                        {item.brandPreference && (
                          <span className="text-xs text-slate-500">
                            {dict.cart.brandLabel}: <strong className="text-slate-700">{item.brandPreference}</strong>
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-medium text-xs transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-slate-900 bg-white min-w-8 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-medium text-xs transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.notes || ""}
                        onChange={(e) => updateNotes(item.id, e.target.value)}
                        placeholder={dict.cart.notesPlaceholder}
                        className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-black"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* RFQ Submission Form */}
              <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-200 space-y-4">
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
                  <h3 className="text-sm font-bold text-slate-900">{dict.cart.title}</h3>
                  <p className="text-xs text-slate-500">
                    {dict.cart.rfqSub}
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {dict.cart.fullName} *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === "ar" ? "مثال: خالد المنصور" : "e.g. Khalid Al-Mansoor"}
                        className="w-full text-xs ps-8 pe-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {dict.cart.companyName} *
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder={language === "ar" ? "اسم المنشأة / الشركة" : "Company / Org Name"}
                        className="w-full text-xs ps-8 pe-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {dict.cart.email} *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full text-xs ps-8 pe-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-black isolate-ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {dict.cart.phone} *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+966 5..."
                        className="w-full text-xs ps-8 pe-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-black isolate-ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {dict.cart.city}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder={language === "ar" ? "الدمام، الرياض، الخبر، البحرين..." : "e.g. Dammam, Riyadh, Al Khobar, Bahrain"}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {dict.cart.timeline}
                    </label>
                    <select
                      value={formData.projectTimeline}
                      onChange={(e) => setFormData({ ...formData, projectTimeline: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-black bg-white"
                    >
                      <option value="Immediate (1-2 weeks)">{language === "ar" ? "فوري (خلال 1-2 أسبوع)" : "Immediate (1-2 weeks)"}</option>
                      <option value="Within 1 Month">{language === "ar" ? "خلال شهر" : "Within 1 Month"}</option>
                      <option value="Quarterly Project">{language === "ar" ? "مشروع ربع سنوي" : "Quarterly Project"}</option>
                      <option value="Budgetary Planning">{language === "ar" ? "تخطيط ودراسة ميزانية" : "Budgetary Planning"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {dict.cart.additionalNotes}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={language === "ar" ? "اذكر أي متطلبات خاصة بالمواصفات، الماركات المفضلة، أو خدمات التركيب المطلوبة..." : "Include any specific brand requirements, site delivery instructions, or installation services required..."}
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-hidden focus:border-black resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 theme-button-primary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{dict.cart.sending}</span>
                    </>
                  ) : (
                    <>
                      <span>{dict.cart.submitRfq}</span>
                      <Send className="w-3.5 h-3.5 rtl-flip" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{language === "ar" ? "مقر شركة ديسلا - حي الخالدية، الدمام" : "Official DEYSLA Al Khalidiya Office"}</span>
          <span className="font-semibold text-slate-700 isolate-ltr">+966 54 455 3670</span>
        </div>
      </div>
    </div>
  );
};
