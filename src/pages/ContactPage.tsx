import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle2, ChevronRight, MapPin, Sparkles, AlertCircle, Loader2, Briefcase } from "lucide-react";
import { COMPANY_DATA } from "../data/company";
import { ContactLocationsMap } from "../components/contact/ContactLocationsMap";
import { CareersModal } from "../components/careers/CareersModal";
import { useLanguage } from "../context/LanguageContext";

export const ContactPage: React.FC = () => {
  const { dict, lang, formatPath } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    companyName: "",
    message: "",
    website: "", // honeypot
  });

  const [formState, setFormState] = useState<"default" | "loading" | "success" | "error">("default");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCareersModalOpen, setIsCareersModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.contact.trim() || !formData.message.trim()) {
      setFormState("error");
      setErrorMessage(dict.contact.errorRequired);
      return;
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormState("error");
      setErrorMessage(dict.contact.errorEmail);
      return;
    }

    setFormState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || (lang === 'ar' ? 'فشل إرسال الرسالة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.' : 'Failed to dispatch email. Please check your network or try again.'));
      }

      setFormState("success");
      // Clear form on success only
      setFormData({
        name: "",
        email: "",
        contact: "",
        companyName: "",
        message: "",
        website: "",
      });
    } catch (err: any) {
      setFormState("error");
      setErrorMessage(err.message || (lang === 'ar' ? 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة على info@deysla.com.' : 'Failed to send message. Please try again or email us directly at info@deysla.com.'));
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
            <span className="font-semibold text-slate-900">{dict.nav.contact}</span>
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
            <span>{dict.contact.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-3xl leading-tight">
            {dict.contact.title}
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {dict.contact.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{lang === 'ar' ? 'المكتب الإداري - الدمام' : 'Dammam Corporate Office'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{lang === 'ar' ? 'استجابة سريعة لطلبات عروض الأسعار' : 'Rapid RFQ & Procurement Triage'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
              <span>{lang === 'ar' ? 'مدراء حسابات مخصصون للشركات' : 'Dedicated Enterprise Account Managers'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Form */}
      <section className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  {dict.contact.formCardBadge}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {dict.contact.formCardTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {dict.contact.formCardSubtitle}
                </p>
              </div>

              {/* Form Status Banners */}
              {formState === "success" && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-sm font-bold">{dict.contact.successTitle}</p>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    {dict.contact.successMessage}
                  </p>
                </div>
              )}

              {formState === "error" && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      {dict.contact.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={dict.contact.namePlaceholder}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-slate-50/50 focus:bg-white transition-colors"
                      dir="auto"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      {dict.contact.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={dict.contact.emailPlaceholder}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-slate-50/50 focus:bg-white transition-colors isolate-ltr"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Contact Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      {dict.contact.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder={dict.contact.phonePlaceholder}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-slate-50/50 focus:bg-white transition-colors isolate-ltr"
                      dir="ltr"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      {dict.contact.companyLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder={dict.contact.companyPlaceholder}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-slate-50/50 focus:bg-white transition-colors"
                      dir="auto"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {dict.contact.messageLabel}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={dict.contact.messagePlaceholder}
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-slate-50/50 focus:bg-white transition-colors resize-none"
                    dir="auto"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className="w-full py-3.5 theme-button-primary text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {formState === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{dict.contact.submittingButton}</span>
                    </>
                  ) : (
                    <>
                      <span>{dict.contact.submitButton}</span>
                      <Send className="w-3.5 h-3.5 rtl-flip" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Global Facilities Map Section */}
      <section className="py-10 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactLocationsMap />
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-10 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {dict.contact.careersBoxBadge}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold">{dict.contact.careersBoxTitle}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {dict.contact.careersBoxDescription}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsCareersModalOpen(true)}
                className="w-full sm:w-auto text-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Briefcase className="w-4 h-4" />
                <span>{dict.contact.careersApplyBtn}</span>
              </button>
              <a
                href={`mailto:${COMPANY_DATA.contact.email}?subject=Career%20Application%20-%20DEYSLA`}
                className="w-full sm:w-auto text-center px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                {dict.contact.careersEmailBtn} ({COMPANY_DATA.contact.email})
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Application Modal */}
      <CareersModal
        isOpen={isCareersModalOpen}
        onClose={() => setIsCareersModalOpen(false)}
      />
    </div>
  );
};
