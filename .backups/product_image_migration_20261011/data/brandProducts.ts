import { BRANDS_DATA, Brand } from "./brands";
import { PRODUCTS_DATA, ProductType } from "./products";

export interface BrandProductMapping {
  brandId: string;
  productIds: string[];
}

// Data-driven relationship matrix strictly verified against DEYSLA catalogue
export const BRAND_PRODUCT_MAP: BrandProductMapping[] = BRANDS_DATA.map((brand) => ({
  brandId: brand.id,
  productIds: brand.productIds,
}));

export function getProductsByBrandId(brandId: string): ProductType[] {
  const brand = BRANDS_DATA.find((b) => b.id === brandId || b.slug === brandId);
  if (!brand) return [];
  return PRODUCTS_DATA.filter((p) => brand.productIds.includes(p.id));
}

export function getBrandsByProductId(productId: string): Brand[] {
  const product = PRODUCTS_DATA.find((p) => p.id === productId || p.slug === productId);
  if (!product) return [];
  return BRANDS_DATA.filter((b) => product.brandIds.includes(b.id));
}

export function getBrandsByCategoryId(categoryId: string): Brand[] {
  return BRANDS_DATA.filter((b) => b.categoryIds.includes(categoryId));
}

export interface BrandProductItem {
  id: string;
  brandId: string;
  model: string;
  name: string;
  category: string;
  image: string;
  specs: string[];
}

export const BRAND_EQUIPMENT_ITEMS: BrandProductItem[] = [
  // CISCO
  {
    id: "cisco-cat9300-48p",
    brandId: "cisco",
    model: "Catalyst 9300-48P",
    name: "48-Port PoE+ Managed Gigabit & 10G Switch",
    category: "Networking",
    image: "/assets/products/network-switches.webp",
    specs: ["48x 10/100/1000 PoE+ Ports (740W)", "Modular 4x 10G SFP+ Uplinks", "StackWise-480 High-Speed Stacking", "Cisco DNA Ready Security"],
  },
  {
    id: "cisco-isr-4331",
    brandId: "cisco",
    model: "ISR 4331/K9",
    name: "Integrated Multi-Service Edge Router",
    category: "Networking",
    image: "/assets/products/routers.webp",
    specs: ["100Mbps to 300Mbps Aggregated WAN", "3x Gigabit Ethernet Ports (SFP+)", "Integrated Hardware IPSec Cryptography", "Dual Power Supply Redundancy"],
  },
  // FORTINET
  {
    id: "fortinet-fg-100f",
    brandId: "fortinet",
    model: "FortiGate 100F",
    name: "Next-Generation Enterprise Firewall (NGFW)",
    category: "Security Systems",
    image: "/assets/products/cybersecurity-systems.webp",
    specs: ["10 Gbps Firewall Throughput", "1 Gbps Threat Protection Throughput", "2x 10G SFP+ Dedicated Slots", "AI-Powered Advanced Malware Sandboxing"],
  },
  {
    id: "fortinet-edr",
    brandId: "fortinet",
    model: "FortiClient EDR Server",
    name: "Endpoint Detection & Automated Incident Response",
    category: "Security Systems",
    image: "/assets/products/antivirus-edr.webp",
    specs: ["Real-Time Pre- & Post-Infection Protection", "Behavior-Based Anomaly Detection", "Automated Rollback & Remediation", "Central FortiCloud Fabric Telemetry"],
  },
  // COMMSCOPE
  {
    id: "commscope-systimax-cat6a",
    brandId: "commscope",
    model: "SYSTIMAX GigaSPEED X10D",
    name: "Cat6A F/UTP 23AWG Solid Copper LSZH Cable",
    category: "Structured Cabling",
    image: "/assets/products/copper-cables.webp",
    specs: ["10GBASE-T 500MHz High Bandwidth", "Low Smoke Zero Halogen (LSZH)", "305m Spool Precision Pull Box", "Certified 25-Year System Warranty"],
  },
  {
    id: "commscope-patch-panel-24p",
    brandId: "commscope",
    model: "SYSTIMAX 1100GS3-24",
    name: "24-Port 1U Cat6A Shielded Patch Panel",
    category: "Structured Cabling",
    image: "/assets/products/patch-panels.webp",
    specs: ["24-Port 1U Standard 19\" Rack Mount", "Rear Cable Management Support Bar", "T568A/B Universal Wiring Latch", "50-Microinch Gold-Plated RJ45 Pins"],
  },
  // CORNING
  {
    id: "corning-edge-trunk",
    brandId: "corning",
    model: "EDGE Pretium Trunk",
    name: "12-Fiber MTP Single-Mode OS2 Optical Trunk",
    category: "Structured Cabling",
    image: "/assets/products/fiber-optic-cables.webp",
    specs: ["12-Fiber High-Density MTP Connectors", "Corning Ultra-Bend Insensitive Glass", "Factory Terminated & 100% Optical QA Tested", "High-Density Data Center Backbone"],
  },
  // PANDUIT
  {
    id: "panduit-patch-panel",
    brandId: "panduit",
    model: "Mini-Com CPP24FMWBLY",
    name: "24-Port All-Metal Modular Patch Panel",
    category: "Structured Cabling",
    image: "/assets/products/patch-panels.webp",
    specs: ["24-Port 1U Flush-Mount Metal Frame", "Accepts All Mini-Com Shielded Modules", "Integrated Pre-Printed Identification Labels", "Bonding Stud for Ground Continuity"],
  },
  // HIKVISION
  {
    id: "hikvision-4k-acusense",
    brandId: "hikvision",
    model: "DS-2CD2186G2-ISU",
    name: "4K AcuSense Deep Learning IR Dome Camera",
    category: "Security Systems",
    image: "/assets/products/cctv-surveillance.webp",
    specs: ["8MP 4K Ultra-HD Resolution", "AcuSense Human & Vehicle Target Classification", "DarkFighter Low-Light Color Sensitivity", "IP67 Weatherproof & IK10 Vandal-Resistant"],
  },
  // ZKTECO
  {
    id: "zkteco-speed-gate",
    brandId: "zkteco",
    model: "ProBG3000 / Mars Pro",
    name: "Automatic High-Speed Boom Barrier & Gate",
    category: "Security Systems",
    image: "/assets/products/access-control.webp",
    specs: ["High-Efficiency Brushless DC Motor", "0.9s High-Speed Boom Raise Velocity", "Integrated Loop Detector & Anti-Smash", "LPR Camera & RFID Direct Interconnect"],
  },
  // DELL
  {
    id: "dell-r760-rack",
    brandId: "dell",
    model: "PowerEdge R760",
    name: "2U Dual-Socket Enterprise Rackmount Server",
    category: "Servers & Computing",
    image: "/assets/products/rack-servers.webp",
    specs: ["Dual 5th Gen Intel Xeon Scalable CPUs", "Up to 8TB DDR5-5600 Registered ECC RAM", "24x 2.5\" Direct NVMe All-Flash Drive Bays", "iDRAC9 Enterprise Remote Management"],
  },
  {
    id: "dell-t550-tower",
    brandId: "dell",
    model: "PowerEdge T550",
    name: "Enterprise Scalable Multi-Core Tower Server",
    category: "Servers & Computing",
    image: "/assets/products/tower-servers.webp",
    specs: ["Intel Xeon Scalable Enterprise Processor", "Up to 8x 3.5\" SAS/SATA Hot-Plug Storage", "Acoustically Quiet (<28dB) Office Enclosure", "Dual Redundant Hot-Plug Titanium PSUs"],
  },
  // SAMSUNG
  {
    id: "samsung-qmb-75",
    brandId: "samsung",
    model: "SMART Signage QM75B",
    name: "75-Inch 4K Commercial Digital Signage Display",
    category: "Audiovisual & Displays",
    image: "/assets/products/digital-signage.webp",
    specs: ["4K UHD 3840x2160 Non-Glare 500-Nit Panel", "24/7 Commercial Continuous Duty Rating", "Tizen 6.5 Integrated SoC Media Player Engine", "Ultra-Slim 28.5mm Depth Symmetrical Bezel"],
  },
  // VIEWSONIC
  {
    id: "viewsonic-ifp7550",
    brandId: "viewsonic",
    model: "ViewBoard IFP7550 Gen 5",
    name: "75-Inch 4K Interactive Conference Display",
    category: "Audiovisual & Displays",
    image: "/assets/products/interactive-displays.webp",
    specs: ["40-Point Ultra-Fine Touch IR Sensor", "4K UHD Anti-Glare Shatterproof Glass", "Integrated 48MP AI Auto-Tracking Camera Bar", "Wireless BYOD Screen Sharing App Included"],
  },
  // VERTIV
  {
    id: "vertiv-gxt5-3000",
    brandId: "vertiv",
    model: "Liebert GXT5-3000IRT2UXL",
    name: "3000VA / 3000W Online Double-Conversion UPS",
    category: "Servers & Computing",
    image: "/assets/products/ups-and-pdus.webp",
    specs: ["Unity Power Factor (3000VA / 3000W Output)", "Online Double-Conversion 0ms Transfer Speed", "Hot-Swappable Scalable External Battery Packs", "Integrated SNMP RDU-Web Network Interface"],
  },
  // HIRSCHMANN
  {
    id: "hirschmann-rsp20",
    brandId: "hirschmann",
    model: "RSP20 Railway Series",
    name: "Hardened Managed Industrial Gigabit Switch",
    category: "Industrial Automation",
    image: "/assets/products/industrial-switches.webp",
    specs: ["DIN-Rail Heavy-Duty Aluminum Enclosure IP40", "-40°C to +70°C Operating Temperature Class", "Zero-Loss PRP & HSR Seamless Ring Redundancy", "Substation IEC 61850-3 & IEEE 1613 Approved"],
  },
  // HONEYWELL
  {
    id: "honeywell-fire-panel",
    brandId: "honeywell",
    model: "Morley-IAS Max",
    name: "Multi-Loop Intelligent Addressable Fire Panel",
    category: "Fire & Life Safety",
    image: "/assets/products/fire-detection-and-alarm.webp",
    specs: ["1 to 4 Loops Supporting 792 Devices", "7-Inch Full Color Ergonomic Touchscreen", "Certified EN 54-2, EN 54-4 by LPCB", "Civil Defense Approved GCC Integration"],
  },
  // KIDDE
  {
    id: "kidde-ecs-500",
    brandId: "kidde",
    model: "ECS-500 Clean Agent",
    name: "Engineered Gaseous Fire Suppression System",
    category: "Fire & Life Safety",
    image: "/assets/products/fire-suppression.webp",
    specs: ["FK-5-1-12 / FM-200 Clean Gas Suppression", "10-Second High-Pressure Discharge Nozzle", "Zero Ozone Depletion & Safe for Personnel", "UL Listed & FM Approved Steel Cylinder Array"],
  },
  // NAFFCO
  {
    id: "naffco-fire-hydrant",
    brandId: "naffco",
    model: "NF-HYD-WB-250",
    name: "UL/FM Wet Barrel Heavy-Duty Fire Hydrant",
    category: "Fire & Life Safety",
    image: "/assets/products/emergency-and-fire-safety.webp",
    specs: ["Ductile Iron High-Strength Barrel 250 PSI", "Dual 2.5\" Hose Nozzles & 4.5\" Pumper Port", "UL Listed & FM Approved Civil Defense Rating", "Corrosion-Resistant Epoxy Exterior Finish"],
  },
];

export function getBrandEquipmentItems(brandId: string): BrandProductItem[] {
  return BRAND_EQUIPMENT_ITEMS.filter((item) => item.brandId === brandId);
}

