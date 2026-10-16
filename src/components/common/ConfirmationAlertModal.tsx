import React, { useState, useEffect } from "react";
import { CheckCircle2, Copy, Check, X, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export interface ConfirmationAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  refId?: string;
  type?: "contact" | "quote" | "career" | "general";
  actionLabel?: string;
}

export const ConfirmationAlertModal: React.FC<ConfirmationAlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  refId,
  type = "general",
  actionLabel,
}) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCopied(false);
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
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyRef = async () => {
    if (!refId) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(refId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  // Default localized strings
  const defaultTitle = isArabic
    ? type === "quote"
      ? "تم إرسال طلب عرض الأسعار بنجاح!"
      : type === "career"
      ? "تم إرسال طلب التوظيف بنجاح!"
      : "تم إرسال رسالتك بنجاح!"
    : type === "quote"
    ? "Quotation Request Submitted Successfully!"
    : type === "career"
    ? "Job Application Submitted Successfully!"
    : "Inquiry Sent Successfully!";

  const defaultMessage = isArabic
    ? type === "quote"
      ? "شكراً لاهتمامكم بمنتجات وحلول DEYSLA IT Solutions. سيقوم مكتب المبيعات والمواصفات الفنية بمراجعة طلبكم وإعداد عرض السعر خلال وقت وجيز."
      : type === "career"
      ? "شكراً لاهتمامك بالانضمام إلى فريق DEYSLA IT Solutions. سيقوم فريق الموارد البشرية والتوظيف بمراجعة سيرتك الذاتية والتواصل معك."
      : "شكراً لتواصلك مع DEYSLA IT Solutions. تم استلام استفسارك وسيتم تحويله إلى الفريق المختص للرد عليك في أقرب وقت."
    : type === "quote"
    ? "Thank you for reaching out to DEYSLA IT Solutions. Our commercial desk and engineering team will review your bill of quantities and provide a tailored proposal shortly."
    : type === "career"
    ? "Thank you for applying to DEYSLA IT Solutions. Our talent acquisition and HR team will review your application and portfolio."
    : "Thank you for contacting DEYSLA IT Solutions. Your message has been received by our client service desk and our team will get back to you shortly.";

  const refLabel = isArabic ? "رقم المرجع للمتابعة" : "Tracking Reference Number";
  const okBtnLabel = actionLabel || (isArabic ? "حسناً، متابعة" : "OK, Continue");
  const notificationRecipient = "info@sa.deysla.com";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-alert-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Top Iridescent Theme Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#003366] via-[#005599] to-[#ff8c3a] shrink-0" />

        {/* Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label={isArabic ? "إغلاق" : "Close"}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Animated Green Badge */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-4 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-emerald-600 animate-in zoom-in-75 duration-300" />
          </div>

          {/* Title */}
          <h3
            id="confirmation-alert-title"
            className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight"
          >
            {title || defaultTitle}
          </h3>

          {/* Message */}
          <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
            {message || defaultMessage}
          </p>

          {/* Reference ID Pill / Card (if available) */}
          {refId && (
            <div className="w-full mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-start">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#003366]/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#003366]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {refLabel}
                  </p>
                  <p className="font-mono text-base font-bold text-slate-900 tracking-wide select-all">
                    {refId}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyRef}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                }`}
                aria-label={isArabic ? "نسخ رقم المرجع" : "Copy Reference ID"}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>{isArabic ? "تم النسخ!" : "Copied!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isArabic ? "نسخ" : "Copy"}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Routing / Dispatch Info Notice */}
          <div className="w-full mb-6 py-2.5 px-3 rounded-lg bg-sky-50/70 border border-sky-100 flex items-center justify-center gap-2 text-xs text-sky-900">
            <Mail className="w-4 h-4 text-sky-700 shrink-0" />
            <span>
              {isArabic ? (
                <>تم توجيه الإشعار إلى مكتب الاستقبال: <span className="font-semibold font-mono">{notificationRecipient}</span></>
              ) : (
                <>Routed directly to DEYSLA inbox: <span className="font-semibold font-mono">{notificationRecipient}</span></>
              )}
            </span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-base font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{okBtnLabel}</span>
            <ArrowRight className="w-4 h-4 rtl-flip" />
          </button>
        </div>
      </div>
    </div>
  );
};
