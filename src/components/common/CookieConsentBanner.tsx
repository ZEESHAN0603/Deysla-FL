import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, ShieldCheck, X, Settings2, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { language, dict, formatPath } = useLanguage();
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user already made a choice
    const savedConsent = localStorage.getItem("deysla_cookie_consent");
    if (!savedConsent) {
      // Delay showing slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Allow external trigger to reopen cookie settings (via custom event)
  useEffect(() => {
    const handleOpenPreferences = () => {
      setIsVisible(true);
      setShowSettings(true);
    };
    window.addEventListener("open-cookie-preferences", handleOpenPreferences);
    return () => window.removeEventListener("open-cookie-preferences", handleOpenPreferences);
  }, []);

  const handleAcceptAll = () => {
    const consent = { essential: true, analytics: true, marketing: true, timestamp: Date.now() };
    localStorage.setItem("deysla_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleAcceptEssential = () => {
    const consent = { essential: true, analytics: false, marketing: false, timestamp: Date.now() };
    localStorage.setItem("deysla_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    const consent = { ...preferences, essential: true, timestamp: Date.now() };
    localStorage.setItem("deysla_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Consent"
      className="fixed bottom-4 start-4 end-4 md:start-auto md:end-6 md:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 backdrop-blur-xl border border-orange-200/80 rounded-2xl shadow-2xl p-5 text-slate-900 ring-1 ring-orange-500/10">
        {!showSettings ? (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center text-orange-600 shrink-0">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                    {dict.common.cookiesTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {language === "ar" ? "متوافق مع نظام حماية البيانات الشخصية السعودي (PDPL)" : "Compliant with KSA PDPL & International Standards"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAcceptEssential}
                aria-label="Dismiss cookie notice"
                className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              {dict.common.cookiesMessage}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-orange-100 text-[11px]">
              <div className="flex items-center gap-3 text-slate-500">
                <Link to={formatPath("/cookies")} className="hover:text-orange-600 underline underline-offset-2">
                  {dict.footer.cookiesLink}
                </Link>
                <span>&bull;</span>
                <Link to={formatPath("/privacy")} className="hover:text-orange-600 underline underline-offset-2">
                  {dict.footer.privacyLink}
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-orange-600 font-medium transition-colors cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{language === "ar" ? "تخصيص" : "Customize"}</span>
              </button>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAcceptEssential}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors text-center cursor-pointer"
              >
                {dict.common.cookiesDecline}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-3.5 py-2 rounded-xl theme-button-primary text-xs font-bold text-white transition-colors shadow-md text-center cursor-pointer"
              >
                {dict.common.cookiesAccept}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Cookie Preferences
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Back
              </button>
            </div>

            <div className="mt-3 space-y-2.5 max-h-60 overflow-y-auto pr-1 text-xs">
              {/* Essential */}
              <div className="p-2.5 rounded-xl bg-orange-50/40 border border-orange-200/50 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-[12px]">Strictly Necessary</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 border border-emerald-400/30">
                      Required
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Essential for secure authentication, RFQ enquiry drawer, and site operation.
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-3 h-3" />
                </div>
              </div>

              {/* Analytics */}
              <label className="p-2.5 rounded-xl bg-orange-50/40 border border-orange-200/50 flex items-start justify-between gap-3 cursor-pointer hover:border-orange-300 transition-colors">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-[12px] block">Performance &amp; Analytics</span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Helps us understand how visitors interact with product categories to improve user experience.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 bg-white text-orange-500 focus:ring-orange-400 cursor-pointer"
                />
              </label>

              {/* Marketing */}
              <label className="p-2.5 rounded-xl bg-orange-50/40 border border-orange-200/50 flex items-start justify-between gap-3 cursor-pointer hover:border-orange-300 transition-colors">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-[12px] block">Marketing &amp; Personalization</span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Enables tailored enterprise solutions recommendations and relevant partner updates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 bg-white text-orange-500 focus:ring-orange-400 cursor-pointer"
                />
              </label>
            </div>

            <div className="mt-4 pt-3 border-t border-orange-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-4 py-1.5 rounded-lg theme-button-primary text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
