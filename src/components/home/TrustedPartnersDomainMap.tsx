import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Server,
  Lock,
  Wifi,
  PhoneCall,
  Flame,
  Cpu,
  Monitor,
  Building,
} from "lucide-react";
import { BRANDS_DATA, Brand } from "../../data/brands";
import { PRODUCT_CATEGORIES } from "../../data/productCategories";

interface DomainDefinition {
  id: string;
  name: string;
  shortLabel: string;
  headline: string;
  description: string;
  icon: string;
  standards: string[];
}

const DOMAINS: DomainDefinition[] = [
  {
    id: "all",
    name: "All Technology Domains",
    shortLabel: "All Domains",
    headline: "End-to-End Enterprise Hardware & ELV Solutions Ecosystem",
    description:
      "Comprehensive multi-domain mapping of world-leading manufacturers distributed and engineered by DEYSLA across Saudi Arabia and the GCC.",
    icon: "/assets/cable_2292144.png",
    standards: ["ISO 9001:2015", "BICSI Certified", "TIA/EIA-568", "CE & UL Listed"],
  },
  {
    id: "networking",
    name: "Networking Infrastructure",
    shortLabel: "Networking",
    headline: "High-Throughput Enterprise Switching, Routing & Campus Wi-Fi 6",
    description:
      "Core, distribution, and edge network hardware from industry-defining global networking leaders for campuses, data centers, and multi-branch networks.",
    icon: "/assets/cable_2292144.png",
    standards: ["IEEE 802.3", "Wi-Fi 6/6E", "Multi-Gigabit PoE++", "100G/400G Optical"],
  },
  {
    id: "security-systems",
    name: "Security & Surveillance Systems",
    shortLabel: "Security Systems",
    headline: "Intelligent CCTV, Biometric Access & Enterprise Cybersecurity",
    description:
      "Next-generation AI surveillance cameras, biometric access controllers, turnstiles, and perimeter protection integrated with robust firewall security.",
    icon: "/assets/action-camera_1560280.png",
    standards: ["ONVIF Profile S/G/T", "NDAA Compliant", "ISO 27001", "IP67 Ingress"],
  },
  {
    id: "structured-cabling",
    name: "Structured Cabling & Fiber Optics",
    shortLabel: "Structured Cabling",
    headline: "High-Performance Cat6/6A Copper & Single/Multi-Mode Optical Trunking",
    description:
      "Certified structured physical layer infrastructure, high-density patch panels, outdoor armored fiber cables, and server enclosures.",
    icon: "/assets/cable_16690844.png",
    standards: ["TIA/EIA-568.2-D", "ISO/IEC 11801", "LSZH Fire-Retardant", "CPR B2ca Rated"],
  },
  {
    id: "communications",
    name: "Unified Communications & VoIP",
    shortLabel: "Communications",
    headline: "Enterprise IP PBX, Executive VoIP Terminals & Commercial Audio",
    description:
      "Seamless communication systems connecting distributed teams. Enterprise SIP servers, executive video phones, DECT wireless, and paging sound systems.",
    icon: "/assets/landline_9723090.png",
    standards: ["SIP RFC 3261", "G.722 HD Audio", "Opus Codec", "TLS/SRTP Encrypted"],
  },
  {
    id: "servers-and-computing",
    name: "Servers, Storage & Power Systems",
    shortLabel: "Servers & Compute",
    headline: "High-Density Rack Servers, Enterprise SAN/NAS & True Online UPS",
    description:
      "Mission-critical compute nodes, hyperconverged server infrastructure, smart rack PDUs, and double-conversion uninterruptible power systems.",
    icon: "/assets/hosting_3848790.png",
    standards: ["Tier-3 Data Center Ready", "True Online Double-Conversion", "IPMI 2.0", "RAID 6/60"],
  },
  {
    id: "industrial-automation",
    name: "Industrial Automation & Controls",
    shortLabel: "Automation",
    headline: "Ruggedized DIN-Rail Switches, PLC Controls & SCADA Telemetry",
    description:
      "Hazardous-environment networking, industrial protocol converters, ruggedized Ethernet switches, and surge suppression for factories and refineries.",
    icon: "/assets/robotic-machine_5815583.png",
    standards: ["IEC 61850-3", "EN 50121-4", "Class I Div 2", "-40°C to +75°C Extended Temp"],
  },
  {
    id: "fire-safety",
    name: "Fire Detection & Life Safety",
    shortLabel: "Fire & Safety",
    headline: "Intelligent Addressable Fire Alarm Panels & Clean Agent Systems",
    description:
      "Civil Defense compliant fire alarm systems, optical smoke sensors, voice evacuation horns, and certified gas suppression systems for sensitive rooms.",
    icon: "/assets/fire-prevention_12299025.png",
    standards: ["NFPA 72", "UL 864 Listed", "EN 54 Certified", "Saudi Civil Defense Approved"],
  },
  {
    id: "digital-display",
    name: "Digital Displays & Commercial Signage",
    shortLabel: "Digital Displays",
    headline: "Ultra-Bright 4K Video Walls, Interactive Kiosks & Signage Panels",
    description:
      "Commercial-grade continuous 24/7 digital displays, touch interactive flat panels for conference rooms, and centralized content management.",
    icon: "/assets/interactiv-kiosk_103817.png",
    standards: ["24/7 Operation Rating", "4K UHD 500+ Nits", "Anti-Glare Tempered Glass", "SOC Embedded"],
  },
];

export const TrustedPartnersDomainMap: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const currentDomain = DOMAINS.find((d) => d.id === selectedDomain) || DOMAINS[0];

  // Filter brands based on active domain
  const filteredBrands: Brand[] =
    selectedDomain === "all"
      ? BRANDS_DATA
      : BRANDS_DATA.filter((b) => b.categoryIds.includes(selectedDomain));

  return (
    <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-black" />
              <span>OEM &amp; Technology Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted Partners Mapped With Their Domains
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore authentic global manufacturers, certified hardware lines, and industry-standard OEMs mapped by technology domain for enterprise delivery across Saudi Arabia.
            </p>
          </div>

          <Link
            to="/brands"
            className="text-xs font-bold text-black hover:text-neutral-700 flex items-center gap-1.5 whitespace-nowrap self-start md:self-end group shrink-0"
          >
            <span>View All {BRANDS_DATA.length} Brand Profiles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Interactive Domain Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {DOMAINS.map((domain) => {
            const isSelected = domain.id === selectedDomain;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => setSelectedDomain(domain.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "theme-pill-active text-white shadow-md scale-[1.02]"
                    : "bg-white text-slate-700 hover:text-slate-900 hover:bg-orange-50/50 border border-slate-200/90 shadow-2xs"
                }`}
              >
                <span>{domain.shortLabel}</span>
                {domain.id !== "all" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-white/25 text-white font-bold"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {BRANDS_DATA.filter((b) => b.categoryIds.includes(domain.id)).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Domain Overview Spotlight Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-orange-200/50 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider font-mono">
                Domain Matrix:
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {currentDomain.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentDomain.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Compliance &amp; Standards:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {currentDomain.standards.map((std) => (
                  <span
                    key={std}
                    className="px-2.5 py-1 rounded-md bg-neutral-100 text-slate-800 text-[11px] font-semibold font-mono border border-neutral-200"
                  >
                    {std}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid of Partner Brands Mapped To Current Domain */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {filteredBrands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="p-4 sm:p-5 rounded-2xl border border-orange-200/50 bg-white hover:border-[#ff8c3a] hover:shadow-lg transition-all duration-200 group flex flex-col justify-between h-48 sm:h-52"
            >
              {/* Top Logo Container */}
              <div className="h-20 w-full flex items-center justify-center p-2 rounded-xl bg-neutral-50 group-hover:bg-neutral-100/60 transition-colors">
                <img
                  src={brand.logo}
                  alt={`${brand.name} official logo`}
                  className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              {/* Bottom Meta & Origin */}
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-black truncate transition-colors">
                    {brand.name}
                  </h4>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="capitalize font-medium truncate">
                    {brand.categoryIds[0]?.replace("-", " ") || "Enterprise"}
                  </span>
                  {brand.origin && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[9px] text-slate-600 shrink-0">
                      {brand.origin}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Domain Matrix Footer Callout */}
        <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 text-black border border-neutral-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                100% Authentic OEM Certified Distribution
              </p>
              <p className="text-[11px] text-slate-500">
                All hardware includes manufacturer international warranties, factory support, and verified documentation.
              </p>
            </div>
          </div>

          <Link
            to="/contact"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-2xs"
          >
            Enquire For Brand Quotation
          </Link>
        </div>
      </div>
    </section>
  );
};
