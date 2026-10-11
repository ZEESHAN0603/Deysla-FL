export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  icon: string;
  featuredImage?: string;
  productTypeIds: string[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "networking",
    name: "Networking",
    slug: "networking",
    headline: "High-Performance Enterprise Connectivity & Switching",
    description:
      "Build reliable, high-performance networks with scalable connectivity solutions designed for modern businesses. Complete switching, routing, wireless, and optical transceiver infrastructure.",
    icon: "/assets/cable_2292144.png",
    featuredImage: "/assets/products/network-switches.webp",
    productTypeIds: [
      "network-switches",
      "routers",
      "wireless-solutions",
      "media-converters",
      "industrial-networking",
      "transceivers",
    ],
  },
  {
    id: "security-systems",
    name: "Security Systems",
    slug: "security-systems",
    headline: "Intelligent Physical & Cyber Protection for Facilities",
    description:
      "Enterprise surveillance, biometric access control, unified security cabling, and next-generation cybersecurity architectures engineered to safeguard assets, personnel, and data.",
    icon: "/assets/action-camera_1560280.png",
    featuredImage: "/assets/products/cctv-surveillance.webp",
    productTypeIds: [
      "cctv-surveillance",
      "access-control",
      "security-cabling",
      "cybersecurity-systems",
      "antivirus-edr",
    ],
  },
  {
    id: "communications",
    name: "Communications",
    slug: "communications",
    headline: "Unified Enterprise IP Telephony & Collaboration",
    description:
      "Seamless communication systems connecting modern workplaces. Enterprise IP PBX platforms, executive VoIP phones, SIP trunking, and high-fidelity commercial audio systems.",
    icon: "/assets/landline_9723090.png",
    featuredImage: "/assets/products/ip-pbx-systems.webp",
    productTypeIds: [
      "ip-pbx-systems",
      "ip-phones",
      "audio-solutions",
    ],
  },
  {
    id: "structured-cabling",
    name: "Structured Cabling",
    slug: "structured-cabling",
    headline: "Certified Copper & Fiber Physical Layer Infrastructure",
    description:
      "End-to-end data transmission infrastructure engineered to international standards. High-performance Cat6/6A copper, single/multi-mode fiber optics, modular patch panels, and server cabinets.",
    icon: "/assets/cable_16690844.png",
    featuredImage: "/assets/products/patch-panels.webp",
    productTypeIds: [
      "copper-cables",
      "fiber-optic-cables",
      "patch-panels",
      "keystone-jacks",
      "network-cabinets",
    ],
  },
  {
    id: "digital-displays-and-kiosks",
    name: "Digital Displays and Kiosks",
    slug: "digital-displays-and-kiosks",
    headline: "Interactive Visual Technology & Commercial Kiosks",
    description:
      "Engage audiences and streamline operations with commercial LED video walls, digital signage totems, interactive flat panels, and self-service transactional kiosks.",
    icon: "/assets/interactiv-kiosk_103817.png",
    featuredImage: "/assets/products/led-displays.webp",
    productTypeIds: [
      "led-displays",
      "digital-signage",
      "interactive-displays",
      "kiosk-accessories",
    ],
  },
  {
    id: "servers-and-computing",
    name: "Servers and Computing",
    slug: "servers-and-computing",
    headline: "Mission-Critical Compute, Storage & Power Protection",
    description:
      "Scalable enterprise compute architectures for modern workloads. High-density rack servers, tower servers, commercial workstations, enterprise UPS backups, and intelligent PDUs.",
    icon: "/assets/hosting_3848790.png",
    featuredImage: "/assets/products/rack-servers.webp",
    productTypeIds: [
      "rack-servers",
      "tower-servers",
      "desktops-and-laptops",
      "printers-and-supplies",
      "ups-and-pdus",
    ],
  },
  {
    id: "industrial-automation",
    name: "Industrial Automation",
    slug: "industrial-automation",
    headline: "Ruggedized Operational Technology & Process Control",
    description:
      "Harsh-environment networking and automation hardware for factories, utilities, and plants. Hardened DIN-rail switches, industrial control cabling, and precision instrumentation.",
    icon: "/assets/robotic-machine_5815583.png",
    featuredImage: "/assets/products/industrial-switches.webp",
    productTypeIds: [
      "industrial-switches",
      "control-cables",
      "instrumentation",
    ],
  },
  {
    id: "fire-and-safety-systems",
    name: "Fire and Safety Systems",
    slug: "fire-and-safety-systems",
    headline: "Certified Life Safety, Detection & Gas Suppression",
    description:
      "Compliant life-safety solutions protecting personnel and critical assets. Intelligent addressable fire alarm panels, clean-agent suppression, emergency voice evacuation, and sensors.",
    icon: "/assets/fire-prevention_12299025.png",
    featuredImage: "/assets/products/fire-detection-and-alarm.webp",
    productTypeIds: [
      "fire-detection-and-alarm",
      "fire-suppression",
      "emergency-and-fire-safety",
    ],
  },
];
