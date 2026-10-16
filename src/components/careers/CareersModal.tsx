import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Upload, CheckCircle2, AlertCircle, Loader2, Briefcase, FileText, Send } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface CareersModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPosition?: string;
}

const POSITIONS_BY_LANG = {
  en: [
    "Network & Infrastructure Solutions Architect",
    "Enterprise Cybersecurity & Firewall Specialist",
    "CCTV, Access Control & ELV Systems Engineer",
    "Structured Cabling & Fiber Optics Technician",
    "Senior IT Systems & Cloud Administrator",
    "Enterprise IT Account Executive / Technical Sales",
    "General Technical / Engineering Application",
  ],
  ar: [
    "مهندس معماري لحلول الشبكات والبنية التحتية",
    "أخصائي أمن سيبراني وجدران حماية مؤسسية",
    "مهندس أنظمة المراقبة والتحكم بالدخول (ELV)",
    "فني تمديدات كابلات هيكلية وألياف ضوئية",
    "مسؤول أول لأنظمة تقنية المعلومات والبيئات السحابية",
    "مسؤول مبيعات تقنية وحسابات كبار العملاء",
    "طلب توظيف عام في المجالات الهندسية والتقنية",
  ],
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const CareersModal: React.FC<CareersModalProps> = ({
  isOpen,
  onClose,
  defaultPosition = "Network & Infrastructure Solutions Architect",
}) => {
  const { language, isRTL, dict } = useLanguage();

  const availablePositions = useMemo(() => {
    const list = [...(POSITIONS_BY_LANG[language] || POSITIONS_BY_LANG.en)];
    if (defaultPosition && !list.includes(defaultPosition)) {
      list.unshift(defaultPosition);
    }
    return list;
  }, [language, defaultPosition]);

  const [formData, setFormData] = useState({
    position: defaultPosition,
    name: "",
    email: "",
    phone: "",
    experience: "3-5 years",
    noticePeriod: "Immediate / 1 Month",
    portfolioUrl: "",
    coverLetter: "",
    website: "", // honeypot
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultPosition) {
      setFormData((prev) => ({ ...prev, position: defaultPosition }));
    }
  }, [defaultPosition, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleModalClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (![".pdf", ".doc", ".docx"].includes(ext)) {
      setErrorMessage(
        language === "ar"
          ? "نوع الملف غير صالح. يرجى رفع ملف PDF (.pdf) أو مستند Word (.doc, .docx)."
          : "Invalid file type. Please upload a PDF (.pdf) or Word document (.doc, .docx)."
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        language === "ar"
          ? `حجم الملف يتجاوز الحد الأقصى 5 ميجابايت (${(file.size / (1024 * 1024)).toFixed(2)} ميجابايت).`
          : `File exceeds 5 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please upload a smaller file.`
      );
      return;
    }

    setErrorMessage(null);
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage(
        language === "ar"
          ? "يرجى إكمال جميع الحقول الإلزامية (الاسم، البريد الإلكتروني، رقم الهاتف)."
          : "Please complete all required fields (Name, Email, Phone)."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage(
        language === "ar"
          ? "يرجى إدخال عنوان بريد إلكتروني صحيح."
          : "Please provide a valid email address."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("position", formData.position);
      payload.append("name", formData.name.trim());
      payload.append("email", formData.email.trim());
      payload.append("phone", formData.phone.trim());
      payload.append("experience", formData.experience);
      payload.append("noticePeriod", formData.noticePeriod);
      payload.append("portfolioUrl", formData.portfolioUrl.trim());
      payload.append("coverLetter", formData.coverLetter.trim());
      payload.append("website", formData.website);

      if (resumeFile) {
        payload.append("resume", resumeFile);
      }

      const res = await fetch("/api/careers", {
        method: "POST",
        body: payload,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            (language === "ar"
              ? "فشل في إرسال طلب التوظيف. يرجى المحاولة لاحقاً."
              : "Failed to submit career application. Please try again.")
        );
      }

      setSuccessMessage(
        data.message ||
          (language === "ar"
            ? "تم استلام طلب التوظيف بنجاح! سيتواصل معك فريق الاستقطاب قريباً."
            : "Your application has been received successfully!")
      );

      setSubmittedAppId(data.applicationId || null);

      // Reset form on success
      setFormData({
        position: defaultPosition,
        name: "",
        email: "",
        phone: "",
        experience: "3-5 years",
        noticePeriod: "Immediate / 1 Month",
        portfolioUrl: "",
        coverLetter: "",
        website: "",
      });
      setResumeFile(null);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (language === "ar"
            ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
            : "An unexpected error occurred. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSuccessMessage(null);
    setSubmittedAppId(null);
    setErrorMessage(null);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={handleModalClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Top Iridescent Theme Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#003366] via-[#005599] to-[#ff8c3a] shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#003366] text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
              <Briefcase className="w-3.5 h-3.5 text-sky-300" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {language === "ar" ? "طلب توظيف مباشر • DEYSLA IT Solutions" : "Careers & Direct Application • DEYSLA IT Solutions"}
              </h2>
              <p className="text-[10px] text-slate-500">
                {language === "ar" ? "المكتب الإداري - الدمام والعمليات الإقليمية" : "Dammam HQ & Regional GCC Operations"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
            aria-label={language === "ar" ? "إغلاق" : "Close"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Guaranteed Non-Scrollable Compact Layout */}
        <div className="p-4 sm:p-5 overflow-hidden">
          {successMessage ? (
            <div className="py-5 px-3 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {language === "ar" ? "تم إرسال طلب التوظيف بنجاح!" : "Application Transmitted Successfully!"}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {successMessage}
                </p>
              </div>

              {submittedAppId && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-mono font-bold">
                  <span>{language === "ar" ? "رقم المرجع:" : "Ref:"}</span>
                  <span>{submittedAppId}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-500">
                {language === "ar"
                  ? "سيقوم فريق الموارد البشرية والتقييم الفني بالدمام بمراجعة سيرتك الذاتية والتواصل معك."
                  : "Our talent acquisition team in Dammam will review your qualifications and contact you."}
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {language === "ar" ? "حسناً، تم" : "Done"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {errorMessage && (
                <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Row 1: Position & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    {dict.careers.position} *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full h-8 text-xs px-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#003366] bg-slate-50/50 focus:bg-white transition-colors"
                  >
                    {availablePositions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    {dict.contact.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === "ar" ? "مثال: طارق المنصور" : "e.g. Tariq Al-Mansoor"}
                    className="w-full h-8 text-xs px-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#003366] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    {dict.contact.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="candidate@email.com"
                    className="w-full h-8 text-xs px-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#003366] bg-slate-50/50 focus:bg-white transition-colors isolate-ltr"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    {dict.contact.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 5..."
                    className="w-full h-8 text-xs px-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#003366] bg-slate-50/50 focus:bg-white transition-colors isolate-ltr"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 3: Experience & Notice Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    {dict.careers.experience}
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full h-8 text-xs px-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#003366] bg-slate-50/50 focus:bg-white transition-colors"
                  >
                    <option value="1-2 years">{language === "ar" ? "1 - 2 سنوات (مبتدئ / مساعد)" : "1 - 2 Years (Junior / Associate)"}</option>
                    <option value="3-5 years">{language === "ar" ? "3 - 5 سنوات (متوسط الخبرة)" : "3 - 5 Years (Mid-level)"}</option>
                    <option value="5-8 years">{language === "ar" ? "5 - 8 سنوات (أخصائي أول)" : "5 - 8 Years (Senior Specialist)"}</option>
                    <option value="8+ years">{language === "ar" ? "+8 سنوات (قائد فريق / مهندس)" : "8+ Years (Lead / Architect)"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    {dict.careers.noticePeriod}
                  </label>
                  <input
                    type="text"
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                    placeholder={language === "ar" ? "فوري / 30 يوم" : "Immediate / 30 Days"}
                    className="w-full h-8 text-xs px-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#003366] bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Row 4: LinkedIn & CV Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    {dict.careers.linkedin}
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full h-8 text-xs px-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#003366] bg-slate-50/50 focus:bg-white transition-colors isolate-ltr"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    {dict.careers.resumeUpload} *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 flex items-center justify-between px-2.5 rounded-lg border border-dashed border-slate-300 hover:border-[#003366] bg-slate-50/70 hover:bg-slate-50 cursor-pointer text-xs transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-1.5 truncate">
                      {resumeFile ? (
                        <>
                          <FileText className="w-3.5 h-3.5 text-[#003366] shrink-0" />
                          <span className="truncate text-slate-800 font-semibold">{resumeFile.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-slate-500 truncate text-[11px]">
                            {language === "ar" ? "اختر ملف السيرة الذاتية (PDF/DOC)" : "Choose CV file (PDF/DOC)"}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">Max 5MB</span>
                  </div>
                </div>
              </div>

              {/* Row 5: Certifications / Cover Note */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                  {dict.careers.coverNote}
                </label>
                <input
                  type="text"
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  placeholder={language === "ar" ? "الشهادات التقنية (Cisco, Fortinet...) أو نبذة موجزة..." : "Key technical certifications (Cisco, Fortinet, etc.) or summary..."}
                  className="w-full h-8 text-xs px-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#003366] bg-slate-50/50 focus:bg-white transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-9 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition-all active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{dict.careers.uploading}</span>
                    </>
                  ) : (
                    <>
                      <span>{dict.careers.submitApp}</span>
                      <Send className="w-3.5 h-3.5 rtl-flip" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
