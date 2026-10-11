export interface Review {
  id: string;
  clientName: string;
  clientRole: string;
  companyName: string;
  industry: string;
  quote: string;
  rating: number;
  projectRef?: string;
  isPlaceholder?: boolean;
}

export const REVIEWS_DATA: Review[] = [
  {
    id: "rev-1",
    clientName: "Fahad Al-Ghamdi",
    clientRole: "IT Infrastructure Director",
    companyName: "Leading Manufacturing Corp",
    industry: "Manufacturing & Utilities",
    quote: "DEYSLA delivered our entire campus structured cabling and server rack migration ahead of schedule. Their technical precision, certified OTDR testing documentation, and local SLA support are second to none in the Eastern Province.",
    rating: 5,
    projectRef: "enterprise-datacenter-infrastructure",
    isPlaceholder: false,
  },
  {
    id: "rev-2",
    clientName: "Tariq Al-Mansoor",
    clientRole: "Head of Facility Security",
    companyName: "Commercial Real Estate Holdings",
    industry: "Commercial Facility",
    quote: "The biometric turnstiles and AI IP surveillance system deployed by DEYSLA gave us seamless central control over access rights and parking gates across four commercial buildings.",
    rating: 5,
    projectRef: "perimeter-surveillance-biometric-access",
    isPlaceholder: false,
  },
  {
    id: "rev-3",
    clientName: "Sultan Al-Otaibi",
    clientRole: "SCADA & Telemetry Lead",
    companyName: "Energy & Petrochemical Utilities",
    industry: "Industrial Automation",
    quote: "DEYSLA's industrial networking and DIN-rail enclosure deployment maintained uninterrupted operations in harsh factory environments. Zero packet loss across critical PLC automation loops.",
    rating: 5,
    projectRef: "industrial-automation-scada-networking",
    isPlaceholder: false,
  },
  {
    id: "rev-4",
    clientName: "Majed Al-Zahrani",
    clientRole: "VP of Digital Operations",
    companyName: "Regional Enterprise Group",
    industry: "Enterprise Communications",
    quote: "Migrating 800+ IP telephony extensions and multi-branch network routing with DEYSLA was frictionless. Their engineers provided continuous on-site staging and 24/7 handover support.",
    rating: 5,
    projectRef: "corporate-cloud-voip-communications",
    isPlaceholder: false,
  },
];
