export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  clientSector: string;
  location: string;
  shortDescription: string;
  fullOverview?: string;
  scopeOfWork: string[];
  technologiesUsed: string[];
  image: string;
  isPlaceholder?: boolean;
}

// Architecture ready for future project case studies. Uses [PROJECT_DATA_REQUIRED] as instructed.
export const PROJECTS_DATA: Project[] = [
  {
    id: "proj-datacenter-infrastructure",
    slug: "enterprise-datacenter-infrastructure",
    title: "High-Density Campus Data Center Modernization",
    category: "IT Infrastructure & Cabling",
    clientSector: "Industrial Manufacturing Sector",
    location: "Dammam, Eastern Province, KSA",
    shortDescription: "Turnkey deployment of tier-3 compute racks, Cat6A shielded cabling, and online double-conversion UPS power protection.",
    scopeOfWork: [
      "Structured Cabling Backbone (Cat6A SFTP & OM4 Fiber)",
      "High-Density Compute & Server Rack Enclosures",
      "Redundant Online UPS Battery Systems",
      "Precision Airflow & Cold Aisle Containment",
    ],
    technologiesUsed: ["Cisco", "CommScope", "Schneider Electric", "Dell Technologies"],
    image: "/assets/Picture21.png",
    isPlaceholder: false,
  },
  {
    id: "proj-surveillance-access",
    slug: "perimeter-surveillance-biometric-access",
    title: "Facility-Wide IP Surveillance & Speed Gate Access Control",
    category: "Security Systems",
    clientSector: "Commercial Corporate Facility",
    location: "Eastern Province, KSA",
    shortDescription: "Integrated 120+ IP camera surveillance network with AI video analytics and multi-door biometric turnstile access control.",
    scopeOfWork: [
      "High-Definition Optical IP Cameras & NVR Storage Arrays",
      "Pedestrian Flap Speed Turnstiles with Facial Recognition",
      "Centralized Security Operations Monitoring Desk",
      "Perimeter Infrared Beam Intruder Detection",
    ],
    technologiesUsed: ["Hikvision", "ZKTeco", "Axis Communications", "Excel Cabling"],
    image: "/assets/Picture23.png",
    isPlaceholder: false,
  },
  {
    id: "proj-industrial-scada",
    slug: "industrial-automation-scada-networking",
    title: "Harsh-Environment Industrial Ethernet & SCADA Backbone",
    category: "Industrial Automation",
    clientSector: "Utilities & Processing Plant",
    location: "Al Khobar / Dammam, KSA",
    shortDescription: "Hardened DIN-rail ring network topology interconnecting distributed PLCs to centralized SCADA telemetry consoles.",
    scopeOfWork: [
      "DIN-Rail Managed Industrial Switches with Fast Failover Ring",
      "Shielded Instrumentation & Fieldbus Control Cabling",
      "Surge Protection Barriers for Harsh Electrical Environments",
      "Isolated Industrial Control Panel Assembly",
    ],
    technologiesUsed: ["Schneider Electric", "Phoenix Contact", "Advantech", "Hirschmann"],
    image: "/assets/Picture25.png",
    isPlaceholder: false,
  },
  {
    id: "proj-cloud-voip",
    slug: "corporate-cloud-voip-communications",
    title: "Multi-Branch Enterprise VoIP & Secure Cloud Migration",
    category: "VoIP & Communications",
    clientSector: "Financial & Corporate Services",
    location: "Riyadh & Eastern Province, KSA",
    shortDescription: "Unified IP PBX telephony deployment with high-availability SIP trunks, cloud disaster recovery, and multi-branch encrypted VPN routing.",
    scopeOfWork: [
      "Enterprise IP PBX Telephony Servers & SIP Trunking",
      "Executive Gigabit Desktop IP Phone Fleet Provisioning",
      "Hybrid Cloud Backup & Disaster Recovery Architecture",
      "Multi-Site Encrypted Site-to-Site VPN Connectivity",
    ],
    technologiesUsed: ["Grandstream", "Cisco", "Fortinet", "Yeastar"],
    image: "/assets/products/ip-pbx-systems.webp",
    isPlaceholder: false,
  },
];
