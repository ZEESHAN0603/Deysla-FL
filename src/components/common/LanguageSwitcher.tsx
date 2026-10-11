import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile" | "footer";
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "desktop",
  className = "",
}) => {
  const { language, switchRouteLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (lang: "en" | "ar") => {
    if (lang !== language) {
      switchRouteLanguage(lang);
    }
    setIsOpen(false);
  };

  if (variant === "footer") {
    return (
      <div className={`inline-flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800 ${className}`}>
        <button
          type="button"
          onClick={() => handleSelect("en")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            language === "en"
              ? "bg-white text-black shadow-xs font-bold"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          aria-label="Switch to English"
        >
          English
        </button>
        <button
          type="button"
          onClick={() => handleSelect("ar")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            language === "ar"
              ? "bg-white text-black shadow-xs font-bold"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          aria-label="التبديل إلى اللغة العربية"
        >
          العربية
        </button>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={`w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200 ${className}`}>
        <div className="flex items-center gap-2 text-slate-800 text-xs font-bold">
          <Globe className="w-4 h-4 text-sky-600" />
          <span>{t("nav.switchLang", "Language / اللغة")}</span>
        </div>
        <div className="inline-flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => handleSelect("en")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              language === "en"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => handleSelect("ar")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              language === "ar"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            عربي
          </button>
        </div>
      </div>
    );
  }

  // Desktop Navigation Dropdown
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t("nav.switchLang", "Select website language")}
        className="inline-flex items-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 text-xs sm:text-[13px] font-semibold text-neutral-800 hover:text-black bg-neutral-100 hover:bg-neutral-200 hover:border-neutral-300 rounded-xl transition-all border border-neutral-200 shadow-2xs focus:outline-hidden cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 shrink-0" />
        <span className="font-bold tracking-tight">
          {language === "en" ? "EN" : "عربي"}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-neutral-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute end-0 mt-1.5 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            {t("nav.switchLang", "Select Language")}
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleSelect("en")}
            className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer text-start ${
              language === "en"
                ? "bg-neutral-100 text-black font-bold"
                : "text-neutral-700 hover:bg-neutral-50 hover:text-black"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇬🇧</span>
              <span>English</span>
            </div>
            {language === "en" && <Check className="w-3.5 h-3.5 text-black" />}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleSelect("ar")}
            className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer text-start ${
              language === "ar"
                ? "bg-neutral-100 text-black font-bold"
                : "text-neutral-700 hover:bg-neutral-50 hover:text-black"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇸🇦</span>
              <span className="font-bold">العربية</span>
            </div>
            {language === "ar" && <Check className="w-3.5 h-3.5 text-black" />}
          </button>
        </div>
      )}
    </div>
  );
};
