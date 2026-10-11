/**
 * Normalized crop regions (x, y, width, height) for the DEYSLA Solutions Library Poster
 * Generated specifically for DEYSLA IT Solutions Enterprise Technology Library
 */

export interface CropRegion {
  id: string;
  name: string;
  category: string;
  // Normalized 0.0 to 1.0 bounding box coordinates
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PRODUCT_CROP_REGIONS: Record<string, CropRegion> = {
  // 1. Switches & Routers
  "network-switches": {
    id: "network-switches",
    name: "Managed & Enterprise Switches",
    category: "networking",
    x: 0.525,
    y: 0.160,
    width: 0.225,
    height: 0.075,
  },
  routers: {
    id: "routers",
    name: "Enterprise & Edge Routers",
    category: "networking",
    x: 0.755,
    y: 0.160,
    width: 0.210,
    height: 0.075,
  },

  // 2. Wireless & Media Converters
  "wireless-solutions": {
    id: "wireless-solutions",
    name: "Wireless APs & WiFi Bridges",
    category: "networking",
    x: 0.525,
    y: 0.245,
    width: 0.225,
    height: 0.075,
  },
  "media-converters": {
    id: "media-converters",
    name: "Gigabit & PoE Media Converters",
    category: "networking",
    x: 0.755,
    y: 0.245,
    width: 0.210,
    height: 0.075,
  },

  // 3. Industrial Networking
  "industrial-networking": {
    id: "industrial-networking",
    name: "DIN-Rail Industrial Switches",
    category: "networking",
    x: 0.525,
    y: 0.330,
    width: 0.440,
    height: 0.075,
  },

  // 4. Transceivers
  transceivers: {
    id: "transceivers",
    name: "SFP, SFP+, QSFP & BiDi Transceivers",
    category: "networking",
    x: 0.525,
    y: 0.415,
    width: 0.440,
    height: 0.075,
  },

  // 5. Security Systems
  "cctv-surveillance": {
    id: "cctv-surveillance",
    name: "CCTV Surveillance Systems",
    category: "security-systems",
    x: 0.530,
    y: 0.485,
    width: 0.085,
    height: 0.075,
  },
  "access-control": {
    id: "access-control",
    name: "Biometric Speed Gate Access Control",
    category: "security-systems",
    x: 0.620,
    y: 0.485,
    width: 0.085,
    height: 0.075,
  },
  "security-cabling": {
    id: "security-cabling",
    name: "Security Transmission Cabling",
    category: "security-systems",
    x: 0.705,
    y: 0.485,
    width: 0.085,
    height: 0.075,
  },
  "cybersecurity-systems": {
    id: "cybersecurity-systems",
    name: "Cybersecurity Shield & Firewalls",
    category: "security-systems",
    x: 0.795,
    y: 0.485,
    width: 0.085,
    height: 0.075,
  },
  "antivirus-edr": {
    id: "antivirus-edr",
    name: "Antivirus & Endpoint Telemetry",
    category: "security-systems",
    x: 0.880,
    y: 0.485,
    width: 0.085,
    height: 0.075,
  },

  // 6. Communications
  "ip-pbx-systems": {
    id: "ip-pbx-systems",
    name: "IP PBX Systems",
    category: "communications",
    x: 0.530,
    y: 0.560,
    width: 0.130,
    height: 0.075,
  },
  "ip-phones": {
    id: "ip-phones",
    name: "Conference & Executive IP Phones",
    category: "communications",
    x: 0.670,
    y: 0.560,
    width: 0.150,
    height: 0.075,
  },
  "audio-solutions": {
    id: "audio-solutions",
    name: "Commercial Audio & PA Handsets",
    category: "communications",
    x: 0.830,
    y: 0.560,
    width: 0.135,
    height: 0.075,
  },

  // 7. Structured Cabling
  "patch-panels": {
    id: "patch-panels",
    name: "High-Density Patch Panels",
    category: "structured-cabling",
    x: 0.530,
    y: 0.635,
    width: 0.085,
    height: 0.075,
  },
  "copper-cables": {
    id: "copper-cables",
    name: "Cat6/Cat6A Copper Cable Spools",
    category: "structured-cabling",
    x: 0.620,
    y: 0.635,
    width: 0.085,
    height: 0.075,
  },
  "fiber-optic-cables": {
    id: "fiber-optic-cables",
    name: "Fiber Optic Cables & ODF",
    category: "structured-cabling",
    x: 0.705,
    y: 0.635,
    width: 0.085,
    height: 0.075,
  },
  "keystone-jacks": {
    id: "keystone-jacks",
    name: "Modular Keystone Jacks",
    category: "structured-cabling",
    x: 0.795,
    y: 0.635,
    width: 0.085,
    height: 0.075,
  },
  "network-cabinets": {
    id: "network-cabinets",
    name: "42U Server Enclosure Cabinets",
    category: "structured-cabling",
    x: 0.880,
    y: 0.635,
    width: 0.085,
    height: 0.075,
  },

  // 8. Digital Displays & Kiosks
  "led-displays": {
    id: "led-displays",
    name: "Commercial LED Video Walls",
    category: "digital-displays-and-kiosks",
    x: 0.530,
    y: 0.710,
    width: 0.105,
    height: 0.075,
  },
  "digital-signage": {
    id: "digital-signage",
    name: "Digital Signage Displays",
    category: "digital-displays-and-kiosks",
    x: 0.645,
    y: 0.710,
    width: 0.110,
    height: 0.075,
  },
  "interactive-displays": {
    id: "interactive-displays",
    name: "Interactive Touchscreen Smart Displays",
    category: "digital-displays-and-kiosks",
    x: 0.765,
    y: 0.710,
    width: 0.100,
    height: 0.075,
  },
  "kiosk-accessories": {
    id: "kiosk-accessories",
    name: "Kiosk Terminals & Commercial Mounts",
    category: "digital-displays-and-kiosks",
    x: 0.875,
    y: 0.710,
    width: 0.090,
    height: 0.075,
  },

  // 9. Servers & Computing
  "rack-servers": {
    id: "rack-servers",
    name: "Rack Servers",
    category: "servers-and-computing",
    x: 0.530,
    y: 0.785,
    width: 0.085,
    height: 0.075,
  },
  "tower-servers": {
    id: "tower-servers",
    name: "Tower Servers",
    category: "servers-and-computing",
    x: 0.620,
    y: 0.785,
    width: 0.085,
    height: 0.075,
  },
  "desktops-and-laptops": {
    id: "desktops-and-laptops",
    name: "Enterprise Desktops & Laptops",
    category: "servers-and-computing",
    x: 0.705,
    y: 0.785,
    width: 0.085,
    height: 0.075,
  },
  "printers-and-supplies": {
    id: "printers-and-supplies",
    name: "Commercial Multifunction Laser Printers",
    category: "servers-and-computing",
    x: 0.795,
    y: 0.785,
    width: 0.085,
    height: 0.075,
  },
  "ups-and-pdus": {
    id: "ups-and-pdus",
    name: "Online UPS & Power PDUs",
    category: "servers-and-computing",
    x: 0.880,
    y: 0.785,
    width: 0.085,
    height: 0.075,
  },

  // 10. Industrial Automation & Fire Safety
  "industrial-switches": {
    id: "industrial-switches",
    name: "Industrial Switches",
    category: "industrial-automation",
    x: 0.525,
    y: 0.870,
    width: 0.065,
    height: 0.085,
  },
  "control-cables": {
    id: "control-cables",
    name: "Industrial Control Cables",
    category: "industrial-automation",
    x: 0.595,
    y: 0.870,
    width: 0.070,
    height: 0.085,
  },
  instrumentation: {
    id: "instrumentation",
    name: "Process Instrumentation",
    category: "industrial-automation",
    x: 0.670,
    y: 0.870,
    width: 0.070,
    height: 0.085,
  },
  "fire-detection-and-alarm": {
    id: "fire-detection-and-alarm",
    name: "Fire Detection & Alarms",
    category: "fire-and-safety-systems",
    x: 0.748,
    y: 0.870,
    width: 0.075,
    height: 0.085,
  },
  "fire-suppression": {
    id: "fire-suppression",
    name: "Clean Agent Fire Suppression",
    category: "fire-and-safety-systems",
    x: 0.828,
    y: 0.870,
    width: 0.065,
    height: 0.085,
  },
  "emergency-and-fire-safety": {
    id: "emergency-and-fire-safety",
    name: "Emergency & Life Safety Stations",
    category: "fire-and-safety-systems",
    x: 0.898,
    y: 0.870,
    width: 0.065,
    height: 0.085,
  },
};

/**
 * Service crop regions on the left side of the poster
 */
export const SERVICE_CROP_REGIONS: Record<string, CropRegion> = {
  "it-infrastructure": {
    id: "it-infrastructure",
    name: "Data Center & IT Infrastructure",
    category: "services",
    x: 0.050,
    y: 0.160,
    width: 0.440,
    height: 0.075,
  },
  "cyber-security": {
    id: "cyber-security",
    name: "Cyber Security & SOC Operations",
    category: "services",
    x: 0.050,
    y: 0.245,
    width: 0.440,
    height: 0.075,
  },
  "structured-cabling-service": {
    id: "structured-cabling-service",
    name: "Structured Cabling & Data Hall Engineering",
    category: "services",
    x: 0.050,
    y: 0.330,
    width: 0.440,
    height: 0.075,
  },
  "ip-telephony": {
    id: "ip-telephony",
    name: "Unified IP Telephony & Boardroom Audio",
    category: "services",
    x: 0.050,
    y: 0.415,
    width: 0.440,
    height: 0.075,
  },
  "security-systems-service": {
    id: "security-systems-service",
    name: "Security Surveillance & Facilities",
    category: "services",
    x: 0.050,
    y: 0.500,
    width: 0.440,
    height: 0.075,
  },
  "erpnext-solutions": {
    id: "erpnext-solutions",
    name: "ERPNext & Business Intelligence Dashboards",
    category: "services",
    x: 0.050,
    y: 0.585,
    width: 0.440,
    height: 0.075,
  },
  "cloud-solutions": {
    id: "cloud-solutions",
    name: "Hybrid Cloud Infrastructure & Virtualization",
    category: "services",
    x: 0.050,
    y: 0.670,
    width: 0.440,
    height: 0.075,
  },
  "industrial-automation-service": {
    id: "industrial-automation-service",
    name: "Industrial Automation & Robotics Control",
    category: "services",
    x: 0.050,
    y: 0.755,
    width: 0.440,
    height: 0.075,
  },
  "software-development": {
    id: "software-development",
    name: "Custom Software Engineering & APIs",
    category: "services",
    x: 0.050,
    y: 0.840,
    width: 0.440,
    height: 0.075,
  },
  "it-consulting": {
    id: "it-consulting",
    name: "IT Auditing, ISO Governance & Compliance",
    category: "services",
    x: 0.050,
    y: 0.925,
    width: 0.440,
    height: 0.060,
  },
};
