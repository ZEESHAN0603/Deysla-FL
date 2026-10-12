import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface ServiceNode {
  id: string;
  number: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  link: string;
  angle: number; // in degrees for 10 nodes (36° increments)
}

export const RadialProductRange: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { lang, formatPath } = useLanguage();

  // 10 Services positioned symmetrically around 360° (36° mathematical symmetry)
  const nodes: ServiceNode[] = [
    {
      id: "cyber-security",
      number: "01",
      titleEn: "Cyber Security",
      titleAr: "الأمن السيبراني",
      subtitleEn: "Threat Defense",
      subtitleAr: "حماية التهديدات",
      link: "/services/cyber-security",
      angle: 270, // 12 o'clock - Exact Top
    },
    {
      id: "security-systems",
      number: "02",
      titleEn: "Security Systems",
      titleAr: "الأنظمة الأمنية",
      subtitleEn: "CCTV & Access",
      subtitleAr: "المراقبة والتحكم",
      link: "/services/security-systems",
      angle: 306, // Top-Right
    },
    {
      id: "data-migration",
      number: "03",
      titleEn: "Data Migration",
      titleAr: "ترحيل البيانات",
      subtitleEn: "Zero Downtime",
      subtitleAr: "أداء مستمر",
      link: "/services/data-migration",
      angle: 342, // Upper-Right
    },
    {
      id: "voip-communications",
      number: "04",
      titleEn: "VoIP Comms",
      titleAr: "اتصالات VoIP",
      subtitleEn: "IP PBX & SIP",
      subtitleAr: "IP PBX و SIP",
      link: "/services/voip-communications",
      angle: 18, // Lower-Right
    },
    {
      id: "it-infrastructure",
      number: "05",
      titleEn: "IT Infrastructure",
      titleAr: "البنية التحتية",
      subtitleEn: "Compute & Core",
      subtitleAr: "الخوادم والشبكات",
      link: "/services/it-infrastructure",
      angle: 54, // Bottom-Right
    },
    {
      id: "erpnext-solutions",
      number: "06",
      titleEn: "ERP Next",
      titleAr: "حلول ERPNext",
      subtitleEn: "ERP Solution",
      subtitleAr: "إدارة المؤسسات",
      link: "/services/erpnext-solutions",
      angle: 90, // 6 o'clock - Exact Bottom
    },
    {
      id: "cloud-solutions",
      number: "07",
      titleEn: "Cloud Solutions",
      titleAr: "الحلول السحابية",
      subtitleEn: "Hybrid & DR",
      subtitleAr: "السحابة والتعافي",
      link: "/services/cloud-solutions",
      angle: 126, // Bottom-Left
    },
    {
      id: "industrial-automation",
      number: "08",
      titleEn: "Industrial Auto",
      titleAr: "الأتمتة الصناعية",
      subtitleEn: "SCADA & PLC",
      subtitleAr: "SCADA و PLC",
      link: "/services/industrial-automation",
      angle: 162, // Lower-Left
    },
    {
      id: "software-development",
      number: "09",
      titleEn: "Software Dev",
      titleAr: "تطوير البرمجيات",
      subtitleEn: "Custom Web & API",
      subtitleAr: "تطبيقات و APIs",
      link: "/services/software-development",
      angle: 198, // Upper-Left
    },
    {
      id: "governance-and-audit",
      number: "10",
      titleEn: "Governance & Audit",
      titleAr: "الحوكمة والتدقيق",
      subtitleEn: "Compliance & Risk",
      subtitleAr: "الامتثال والمخاطر",
      link: "/services/governance-and-audit",
      angle: 234, // Top-Left
    },
  ];

  const activeNode = nodes.find((n) => n.id === hoveredNode);

  return (
    <div className="relative w-full max-w-[330px] xs:max-w-[380px] sm:max-w-[560px] lg:max-w-[580px] mx-auto aspect-square flex items-center justify-center p-1 sm:p-4 select-none">
      {/* Background SVG Connectors from Center to Satellites */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="-260 -260 520 520"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5e00" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffa043" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0052cc" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Orbital Guide Rings with subtle high-tech motion */}
        <circle cx={0} cy={0} r={66} fill="none" stroke="#e5e5e5" strokeWidth={1.5} strokeOpacity={0.8} />
        <circle cx={0} cy={0} r={76} fill="none" stroke="#ff5e00" strokeWidth={1} strokeOpacity={0.35} className="animate-pulse-ring" />
        <circle cx={0} cy={0} r={195} fill="none" stroke="url(#lineGrad)" strokeWidth={1.2} strokeDasharray="5 7" className="animate-orbit-slow" />

        {nodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const radius = 195; // Symmetrical distance from center in SVG units
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);

          const isHovered = hoveredNode === node.id;

          return (
            <g key={node.id}>
              {/* Spoke connector line */}
              <line
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke={isHovered ? "#ff5e00" : "#d4d4d4"}
                strokeWidth={isHovered ? 2.5 : 1.5}
                strokeDasharray={isHovered ? "none" : "3 3"}
                className="transition-all duration-300"
              />
              {/* Outer connector anchor dot */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 5 : 3.5}
                fill={isHovered ? "#ff5e00" : "#a3a3a3"}
                className="transition-all duration-300"
              />
            </g>
          );
        })}
      </svg>

      {/* Center Circle: Interactive 10 CORE SERVICES Hub */}
      <div className="relative z-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-white border-2 border-[#ff8c3a] shadow-xl flex flex-col items-center justify-center text-center p-1.5 sm:p-2.5 ring-4 sm:ring-8 ring-orange-400/15 transition-all duration-300">
        {activeNode ? (
          <div className="flex flex-col items-center">
            <span className="text-[7.5px] sm:text-[9.5px] font-extrabold tracking-wider text-[#ff8c3a] uppercase isolate-ltr">
              #{activeNode.number}
            </span>
            <h4 className="text-[9px] sm:text-[11.5px] font-black text-slate-900 uppercase tracking-tight leading-tight mt-0.5 line-clamp-2 px-1">
              {lang === 'ar' ? activeNode.titleAr : activeNode.titleEn}
            </h4>
            <span className="w-3.5 sm:w-5 h-0.5 bg-gradient-to-r from-[#ff8c3a] via-[#ffa85c] to-[#6ea4f7] rounded-full mt-0.5 sm:mt-1" />
            <span className="text-[6.5px] sm:text-[8px] font-medium text-neutral-500 mt-0.5 line-clamp-1">
              {lang === 'ar' ? activeNode.subtitleAr : activeNode.subtitleEn}
            </span>
          </div>
        ) : (
          <>
            <span className="text-[7.5px] sm:text-[10px] font-bold tracking-widest text-[#ff8c3a] uppercase">
              DEYSLA
            </span>
            <h4 className="text-[9.5px] sm:text-xs lg:text-[13px] font-black text-slate-900 uppercase tracking-tight leading-tight mt-0.5">
              {lang === 'ar' ? (
                <>10 خدمات<br />رئيسية</>
              ) : (
                <>10 CORE<br />SERVICES</>
              )}
            </h4>
            <span className="w-3 sm:w-5 h-0.5 bg-gradient-to-r from-[#ff8c3a] via-[#ffa85c] to-[#6ea4f7] rounded-full mt-1" />
            <span className="text-[6.5px] sm:text-[8.5px] font-semibold text-neutral-400 uppercase tracking-wider mt-0.5">
              {lang === 'ar' ? 'متكاملة' : 'RANGE'}
            </span>
          </>
        )}
      </div>

      {/* 10 Symmetrical Satellite Node Buttons with Uniform Clean Gaps */}
      {nodes.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        const radiusPercent = 37.5; // Uniform percentage radius for consistent spacing
        // CSS position offsets: 50% + radius * cos(rad)
        const left = 50 + radiusPercent * Math.cos(rad);
        const top = 50 + radiusPercent * Math.sin(rad);

        const isHovered = hoveredNode === node.id;
        const title = lang === 'ar' ? node.titleAr : node.titleEn;
        const subtitle = lang === 'ar' ? node.subtitleAr : node.subtitleEn;

        return (
          <Link
            key={node.id}
            to={formatPath(node.link)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: "translate(-50%, -50%)",
            }}
            className={`absolute z-20 w-[52px] h-[52px] xs:w-[60px] xs:h-[60px] sm:w-[78px] sm:h-[78px] lg:w-[84px] lg:h-[84px] rounded-full bg-white border-2 transition-all duration-200 flex flex-col items-center justify-center text-center p-0.5 sm:p-1.5 group shadow-sm hover:shadow-lg ${
              isHovered
                ? "border-[#ff8c3a] scale-110 ring-4 ring-orange-500/20 z-30"
                : "border-orange-200/60 hover:border-[#ff8c3a]"
            }`}
          >
            <span className="text-[6px] xs:text-[6.5px] sm:text-[7.5px] font-bold text-white bg-gradient-to-r from-[#ff8c3a] via-[#ffa85c] to-[#6ea4f7] px-1.5 py-0.2 rounded-full leading-none isolate-ltr">
              {node.number}
            </span>
            <span className="text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] lg:text-[9px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2 px-0.5 mt-0.5">
              {title}
            </span>
            <span className="text-[6.5px] sm:text-[7.5px] font-semibold text-neutral-400 group-hover:text-neutral-600 transition-colors leading-tight mt-0.5 line-clamp-1 hidden sm:block">
              {subtitle}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
