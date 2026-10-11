import React from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { COMPANY_DATA } from "../../data/company";
import { useLanguage } from "../../context/LanguageContext";

interface WhatsAppButtonProps {
  isHidden?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ isHidden = false }) => {
  const { language } = useLanguage();
  const prefillText = language === "ar"
    ? "مرحباً بشركة ديسلا لتقنية المعلومات، أود الاستفسار عن الحلول والمنتجات التقنية."
    : "Hello DEYSLA IT Solutions, I would like to enquire about your products and services.";
  const whatsappUrl = `https://wa.me/${COMPANY_DATA.contact.phone}?text=${encodeURIComponent(prefillText)}`;

  if (isHidden) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact DEYSLA on WhatsApp"
      className="fixed bottom-4 end-4 sm:bottom-6 sm:end-6 z-40 flex items-center gap-2 sm:gap-2.5 p-2 sm:px-3.5 sm:py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group focus:outline-hidden focus:ring-3 focus:ring-emerald-400 active:scale-95"
    >
      <div className="relative flex items-center justify-center">
        {/* Authentic WhatsApp SVG Icon */}
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 drop-shadow-xs" />
        <span className="absolute -top-1 -end-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
        </span>
      </div>
      <span className="text-xs font-semibold tracking-wide hidden sm:inline-block pe-1 font-sans text-white">
        {language === "ar" ? "واتساب" : "WhatsApp"}
      </span>
    </a>
  );
};
