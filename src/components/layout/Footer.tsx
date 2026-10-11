import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { WhatsAppIcon } from "../common/WhatsAppIcon";
import { COMPANY_DATA } from "../../data/company";
import { PRODUCT_CATEGORIES } from "../../data/productCategories";
import { SERVICES_DATA } from "../../data/services";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { CATEGORY_TRANSLATIONS, SERVICE_TRANSLATIONS } from "../../i18n/translations";

export const Footer: React.FC = () => {
  const { language, dict, formatPath } = useLanguage();

  const getCatName = (catId: string, fallback: string) =>
    CATEGORY_TRANSLATIONS[language]?.[catId]?.name || fallback;
  const getSvcTitle = (svcId: string, fallback: string) =>
    SERVICE_TRANSLATIONS[language]?.[svcId]?.title || fallback;

  return (
    <footer className="bg-black text-neutral-300 border-t border-neutral-800 relative">
      {/* Top Brand Iridescent Theme Gradient Bar */}
      <div className="h-1 w-full theme-gradient-bar" />

      {/* Main Footer Links & Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Executive Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={formatPath("/")} className="inline-block" aria-label="DEYSLA IT Solutions">
              <img
                src="/assets/logo.png"
                alt="DEYSLA IT Solutions"
                className="h-8 w-auto brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {dict.meta.siteDescription}
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>Al Khalidiya, Dammam, Saudi Arabia</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <a
                  href="tel:+966544553670"
                  className="hover:text-white transition-colors isolate-ltr"
                >
                  +966 54 455 3670
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <a
                  href="mailto:info@deysla.com"
                  className="hover:text-white transition-colors isolate-ltr"
                >
                  info@deysla.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 pt-1">
                <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>{language === "ar" ? "ساعات العمل: 8:00 ص – 9:00 م" : "Operating Hours: 8:00 am – 9:00 pm"}</span>
              </div>
            </div>

            {/* Official Global Presence Social Channels & Language Toggle */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="https://www.instagram.com/deysla.it/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                title="DEYSLA on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/deysla.it"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                title="DEYSLA on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@deyslait"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                title="DEYSLA on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/966544553670"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                title="DEYSLA WhatsApp"
              >
                <WhatsAppIcon variant="monochrome" className="w-4 h-4" />
              </a>
              <div className="ms-2">
                <LanguageSwitcher variant="footer" />
              </div>
            </div>
          </div>

          {/* Column 2: Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {dict.footer.servicesTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {SERVICES_DATA.slice(0, 7).map((s) => (
                <li key={s.id}>
                  <Link
                    to={formatPath(`/services/${s.slug}`)}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600 rtl-flip" />
                    <span>{getSvcTitle(s.id, s.title)}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={formatPath("/services")}
                  className="text-xs text-white hover:underline font-semibold inline-flex items-center gap-1 pt-1"
                >
                  <span>{dict.nav.viewAllServices}</span>
                  <ChevronRight className="w-3 h-3 rtl-flip" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {dict.footer.solutionsTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={formatPath(`/products/${cat.slug}`)}
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-neutral-600 rtl-flip" />
                    <span>{getCatName(cat.id, cat.name)}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={formatPath("/brands")}
                  className="text-xs text-white hover:underline font-semibold inline-flex items-center gap-1 pt-1"
                >
                  <span>{dict.nav.viewAllBrands}</span>
                  <ChevronRight className="w-3 h-3 rtl-flip" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {dict.footer.corporateTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={formatPath("/about")} className="text-neutral-400 hover:text-white transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link to={formatPath("/privacy")} className="text-neutral-400 hover:text-white transition-colors">
                  {dict.footer.privacyLink}
                </Link>
              </li>
              <li>
                <Link to={formatPath("/terms")} className="text-neutral-400 hover:text-white transition-colors">
                  {dict.footer.termsLink}
                </Link>
              </li>
              <li>
                <Link to={formatPath("/cookies")} className="text-neutral-400 hover:text-white transition-colors">
                  {dict.footer.cookiesLink}
                </Link>
              </li>
              <li>
                <Link to={formatPath("/projects")} className="text-neutral-400 hover:text-white transition-colors">
                  {dict.nav.projects}
                </Link>
              </li>
              <li>
                <Link to={formatPath("/gallery")} className="text-neutral-400 hover:text-white transition-colors">
                  {dict.nav.gallery}
                </Link>
              </li>
              <li>
                <Link to={formatPath("/careers")} className="text-neutral-400 hover:text-white transition-colors">
                  {dict.footer.careersLink}
                </Link>
              </li>
              <li>
                <Link to={formatPath("/contact")} className="text-neutral-400 hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${COMPANY_DATA.contact.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-200 hover:text-white font-medium transition-colors"
                >
                  {dict.footer.whatsappDirect}
                </a>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                {language === "ar" ? "التواجد الجغرافي" : "Global Footprint"}
              </span>
              <p className="text-xs text-slate-400">
                {language === "ar"
                  ? "عمليات تشغيلية نشطة في المملكة العربية السعودية، البحرين، والولايات المتحدة الأمريكية."
                  : "Operating actively across KSA, Bahrain, and the USA."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Standards */}
      <div className="border-t border-slate-900 bg-black/40 py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-500 text-center md:text-start">
          <p>© {new Date().getFullYear()} {dict.footer.rightsReserved}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
            <Link to={formatPath("/privacy")} className="hover:text-slate-300 transition-colors">
              {dict.footer.privacyLink}
            </Link>
            <span>&bull;</span>
            <Link to={formatPath("/terms")} className="hover:text-slate-300 transition-colors">
              {dict.footer.termsLink}
            </Link>
            <span>&bull;</span>
            <Link to={formatPath("/cookies")} className="hover:text-slate-300 transition-colors">
              {dict.footer.cookiesLink}
            </Link>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-preferences"))}
              className="hover:text-white underline transition-colors cursor-pointer"
            >
              {language === "ar" ? "تفضيلات ملفات تعريف الارتباط" : "Cookie Preferences"}
            </button>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline font-mono text-slate-600 isolate-ltr">v2.4-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
