import React, { useState, useRef } from "react";
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
  const { language, dict } = useLanguage();
  const availablePositions = POSITIONS_BY_LANG[language] || POSITIONS_BY_LANG.en;

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
      // Reset form on success only
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
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      onClick={handleModalClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Iridescent Theme Gradient Bar */}
        <div className="h-1.5 w-full theme-gradient-bar shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Briefcase className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Join DEYSLA IT Solutions
              </h2>
              <p className="text-xs text-slate-500">
                Direct Application &bull; Dammam HQ &amp; Regional Operations
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {successMessage ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {successMessage}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Our HR &amp; Technical Evaluation team in Dammam will review your qualifications and contact you.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleModalClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
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

              {/* Position */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  {dict.careers.position} *
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-black bg-slate-50/50 focus:bg-white transition-colors"
                >
                  {availablePositions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {dict.contact.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === "ar" ? "مثال: طارق المنصور" : "e.g. Tariq Al-Mansoor"}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-black bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {dict.contact.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="candidate@email.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-black bg-slate-50/50 focus:bg-white transition-colors isolate-ltr"
                  />
                </div>
              </div>

              {/* Phone & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {dict.contact.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 5..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-black bg-slate-50/50 focus:bg-white transition-colors isolate-ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {dict.careers.experience}
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-black bg-slate-50/50 focus:bg-white transition-colors"
                  >
                    <option value="1-2 years">{language === "ar" ? "1 - 2 سنوات (مبتدئ / مساعد)" : "1 - 2 Years (Junior / Associate)"}</option>
                    <option value="3-5 years">{language === "ar" ? "3 - 5 سنوات (متوسط الخبرة)" : "3 - 5 Years (Mid-level Professional)"}</option>
                    <option value="5-8 years">{language === "ar" ? "5 - 8 سنوات (أخصائي أول)" : "5 - 8 Years (Senior Specialist)"}</option>
                    <option value="8+ years">{language === "ar" ? "+8 سنوات (قائد فريق / مهندس معماري)" : "8+ Years (Lead / Architect / Principal)"}</option>
                  </select>
                </div>
              </div>

              {/* Notice Period & LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {dict.careers.noticePeriod}
                  </label>
                  <input
                    type="text"
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                    placeholder={language === "ar" ? "فوري / 30 يوم" : "Immediate / 30 Days"}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-black bg-slate-50/50 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {dict.careers.linkedin}
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-black bg-slate-50/50 focus:bg-white transition-colors isolate-ltr"
                  />
                </div>
              </div>

              {/* Resume File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  {dict.careers.resumeUpload}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-black rounded-xl p-4 text-center cursor-pointer bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-5 h-5 text-black" />
                      <div className="text-start">
                        <p className="text-xs font-bold text-slate-800">{resumeFile.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {(resumeFile.size / 1024).toFixed(1)} KB &bull; {language === "ar" ? "انقر للاستبدال" : "Click to replace"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <Upload className="w-5 h-5 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-700">
                        {language === "ar" ? "انقر لاختيار السيرة الذاتية أو اسحب الملف هنا" : "Click to select CV or drag and drop"}
                      </p>
                      <p className="text-[11px] text-slate-400">PDF, DOC, DOCX (Max 5 MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  {dict.careers.coverNote}
                </label>
                <textarea
                  rows={3}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  placeholder={language === "ar" ? "اذكر بإيجاز شهاداتك التقنية (Cisco, Fortinet, Hikvision...) أو أبرز إنجازاتك المهنية..." : "Tell us briefly about your technical certifications (Cisco, Fortinet, Hikvision, etc.) or achievements..."}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-black bg-slate-50/50 focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 theme-button-primary text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
    </div>
  );
};
