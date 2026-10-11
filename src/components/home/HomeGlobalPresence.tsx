import React from "react";
import {
  MapPin,
  Clock,
  Phone,
  AtSign,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
  Globe2,
} from "lucide-react";
import { WhatsAppIcon } from "../common/WhatsAppIcon";
import { COMPANY_DATA } from "../../data/company";
import { useLanguage } from "../../context/LanguageContext";

interface SocialChannel {
  name: string;
  handle: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  hoverColor: string;
}

const GLOBAL_SOCIAL_CHANNELS: SocialChannel[] = [
  {
    name: "Instagram",
    handle: "@deysla.it",
    url: "https://www.instagram.com/deysla.it/",
    icon: Instagram,
    hoverColor: "hover:text-white hover:border-neutral-600 hover:bg-neutral-800",
  },
  {
    name: "Facebook",
    handle: "deysla.it",
    url: "https://www.facebook.com/deysla.it",
    icon: Facebook,
    hoverColor: "hover:text-white hover:border-neutral-600 hover:bg-neutral-800",
  },
  {
    name: "YouTube",
    handle: "@deyslait",
    url: "https://www.youtube.com/@deyslait",
    icon: Youtube,
    hoverColor: "hover:text-white hover:border-neutral-600 hover:bg-neutral-800",
  },
  {
    name: "WhatsApp",
    handle: "+966 544 553 670",
    url: "https://wa.me/966544553670",
    icon: (props) => <WhatsAppIcon variant="monochrome" {...props} />,
    hoverColor: "hover:text-white hover:border-neutral-600 hover:bg-neutral-800",
  },
];

export const HomeGlobalPresence: React.FC = () => {
  const { lang } = useLanguage();

  const getRegionTitle = (region: string) => {
    if (lang !== 'ar') return region;
    if (region.includes('SAUDI')) return 'المملكة العربية السعودية';
    if (region.includes('BAHRAIN')) return 'مملكة البحرين';
    if (region.includes('USA')) return 'الولايات المتحدة';
    return region;
  };

  const getLocationText = (location: string) => {
    if (lang !== 'ar') return location;
    if (location.includes('Dammam')) return 'الدمام 32223، المنطقة الشرقية، المملكة العربية السعودية';
    if (location.includes('Hidd')) return 'مجمع البحرين الاستثماري، الحد الصناعية، البحرين';
    if (location.includes('Charleston')) return 'تشارلستون، وست فرجينيا 25301، الولايات المتحدة';
    return location;
  };

  const getHoursText = (hours: string) => {
    if (lang !== 'ar') return hours;
    return '8:00 ص – 9:00 م (الأحد – الخميس)';
  };

  return (
    <section className="mt-4 sm:mt-8 mb-8 sm:mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Compact, sleek, unified card container */}
      <div className="relative rounded-2xl bg-black border border-neutral-800 shadow-xl overflow-hidden p-4 sm:p-8">
        {/* Top subtle theme gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar" />

        {/* Subtle header badge */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Globe2 className="w-3.5 h-3.5 text-white" />
          <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider font-mono">
            {lang === 'ar' ? 'حضورنا الإقليمي والدولي' : 'Global Presence'}
          </span>
        </div>

        {/* 3 Compact Regional Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-8 pb-5 sm:pb-6 border-b border-neutral-800">
          {COMPANY_DATA.offices.map((office) => (
            <div
              key={office.region}
              className="p-3.5 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5 sm:space-y-3"
            >
              {/* Region Heading */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  {getRegionTitle(office.region)}
                </h3>
              </div>

              {/* Compact Details List */}
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="leading-snug text-neutral-200">{getLocationText(office.location)}</span>
                </li>

                <li className="flex items-center gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{getHoursText(office.hours)}</span>
                </li>

                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                  <a
                    href={`tel:${office.phoneRaw}`}
                    className="hover:text-white transition-colors font-mono tracking-tight isolate-ltr"
                    dir="ltr"
                  >
                    {office.phone}
                  </a>
                </li>

                <li className="flex items-center gap-2.5">
                  <AtSign className="w-3.5 h-3.5 text-white shrink-0" />
                  <a
                    href={`mailto:${office.email}`}
                    className="hover:text-white transition-colors font-mono text-neutral-300 truncate isolate-ltr"
                    dir="ltr"
                  >
                    {office.email}
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Compact Common Social Channels Bar */}
        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-[11px] font-semibold text-slate-400">
            {lang === 'ar' ? 'تواصل معنا عبر القنوات الرسمية:' : 'Connect across all regions:'}
          </span>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5">
            {GLOBAL_SOCIAL_CHANNELS.map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.name}
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 transition-all ${ch.hoverColor}`}
                  title={ch.name}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium text-[11px] truncate">{ch.name}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500 opacity-60 shrink-0 rtl-flip" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
