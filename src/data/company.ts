export interface CompanyInfo {
  name: string;
  tagline: string;
  director: {
    name: string;
    title: string;
    image: string;
    message: string;
  };
  contact: {
    phone: string;
    phoneFormatted: string;
    email: string;
    primaryLocation: string;
    primaryCity: string;
    primaryProvince: string;
    primaryCountry: string;
    businessHours: {
      days: string;
      hours: string;
    }[];
  };
  offices: {
    region: string;
    country: string;
    location: string;
    hours: string;
    phone: string;
    phoneRaw: string;
    email: string;
  }[];
  globalPresence: {
    country: string;
    code: string;
    status: string;
    location?: string;
    hours?: string;
    phone?: string;
    email?: string;
    description: string;
  }[];
  stats: {
    value: string;
    label: string;
    subtext: string;
  }[];
  about: {
    heroHeadline: string;
    heroSubtitle: string;
    vision: string;
    mission: string;
    coreValues: string[];
    journey: {
      year: string;
      milestone: string;
      description: string;
    }[];
    pillars: {
      title: string;
      description: string;
    }[];
    industries: {
      name: string;
      description: string;
    }[];
  };
}

export const COMPANY_DATA: CompanyInfo = {
  name: "DEYSLA IT Solutions",
  tagline: "EMPOWERING BUSINESSES THROUGH INNOVATIVE TECHNOLOGY SOLUTIONS",
  director: {
    name: "Mr. Dakheel Al Khatami",
    title: "Director",
    image: "/assets/director.png",
    message:
      "Welcome to DEYSLA IT Solutions. At DEYSLA, we are committed to helping businesses succeed through innovative, secure, and reliable technology solutions. Our focus is on building long-term partnerships by delivering quality, integrity, and exceptional service across every project. As technology continues to evolve, we remain dedicated to driving digital transformation and creating lasting value for our clients. Thank you for your trust—we look forward to being your technology partner for the future.",
  },
  contact: {
    phone: "+966544553670",
    phoneFormatted: "+966-544553670",
    email: "enquiry-sa@deysla.com",
    primaryLocation: "Al Khalidiya, Dammam",
    primaryCity: "Dammam",
    primaryProvince: "Eastern Province",
    primaryCountry: "Kingdom of Saudi Arabia",
    businessHours: [
      { days: "All Regional Hubs", hours: "8:00 am – 9:00 pm" },
    ],
  },
  offices: [
    {
      region: "USA",
      country: "United States",
      location: "Charleston, W. Virginia",
      hours: "8:00 am – 9:00 pm",
      phone: "+1 (215) 827 7344",
      phoneRaw: "+12158277344",
      email: "enquiry-us@deysla.com",
    },
    {
      region: "SAUDI ARABIA",
      country: "Saudi Arabia",
      location: "Al Khalidiya, Dammam",
      hours: "8:00 am – 9:00 pm",
      phone: "+966-544553670",
      phoneRaw: "+966544553670",
      email: "enquiry-sa@deysla.com",
    },
    {
      region: "BAHRAIN",
      country: "Bahrain",
      location: "BIW Business Park, Al Hidd",
      hours: "8:00 am – 9:00 pm",
      phone: "+973-33999611",
      phoneRaw: "+97333999611",
      email: "enquiry-bh@deysla.com",
    },
  ],
  globalPresence: [
    {
      country: "United States of America",
      code: "USA",
      status: "Regional Office",
      location: "Charleston, W. Virginia",
      hours: "8:00 am – 9:00 pm",
      phone: "+1 (215) 827 7344",
      email: "enquiry-us@deysla.com",
      description: "Charleston, W. Virginia. Technology alliances, hardware procurement & partner management.",
    },
    {
      country: "Kingdom of Saudi Arabia",
      code: "SAUDI ARABIA",
      status: "Regional Office",
      location: "Al Khalidiya, Dammam",
      hours: "8:00 am – 9:00 pm",
      phone: "+966-544553670",
      email: "enquiry-sa@deysla.com",
      description: "Al Khalidiya, Dammam. Enterprise IT hardware distribution, deployment & engineering support.",
    },
    {
      country: "Kingdom of Bahrain",
      code: "BAHRAIN",
      status: "Regional Office",
      location: "BIW Business Park, Al Hidd",
      hours: "8:00 am – 9:00 pm",
      phone: "+973-33999611",
      email: "enquiry-bh@deysla.com",
      description: "BIW Business Park, Al Hidd. Regional GCC business engagement, data cabling, and enterprise solutions.",
    },
  ],
  stats: [
    {
      value: "15+",
      label: "Years of Service",
      subtext: "Delivering proven enterprise IT infrastructure",
    },
    {
      value: "500+",
      label: "Successful Projects",
      subtext: "Across government, industrial & corporate sectors",
    },
    {
      value: "24/7",
      label: "Technical Support",
      subtext: "Continuous SLA-backed systems monitoring",
    },
  ],
  about: {
    heroHeadline: "ENGINEERING THE FUTURE OF BUSINESS THROUGH TECHNOLOGY",
    heroSubtitle:
      "At DEYSLA IT Solutions, we empower organisations with innovative, secure, and scalable technology solutions that accelerate digital transformation and drive long-term business success.",
    vision:
      "To become the Middle East's most trusted technology partner, enabling organizations to accelerate digital transformation through intelligent automation, innovative solutions, and world-class customer service.",
    mission:
      "Our mission is to empower organizations through innovative, reliable, and scalable technology solutions. By delivering enterprise software, cloud services, IT infrastructure, cybersecurity, industrial automation, and managed IT services, we help businesses improve efficiency, strengthen security, and achieve sustainable growth.",
    coreValues: [
      "Innovation",
      "Customer Success",
      "Excellence",
      "Integrity",
      "Collaboration",
      "Continuous Improvement",
    ],
    journey: [
      {
        year: "Foundation",
        milestone: "Establishment in Dammam, Eastern Province",
        description: "Founded to bridge the enterprise demand for reliable network infrastructure and technical engineering in KSA.",
      },
      {
        year: "Expansion",
        milestone: "Infrastructure & Security Portfolio",
        description: "Broadened core offerings to include structured cabling, data center computing, access control, and CCTV surveillance.",
      },
      {
        year: "Integration",
        milestone: "Enterprise Software & Cloud Practice",
        description: "Introduced ERPNext deployments, custom software engineering, and unified communication systems across GCC.",
      },
      {
        year: "Today",
        milestone: "Global Technology Ecosystem",
        description: "500+ completed projects, trusted partnerships with world-tier OEMs, and active presence in KSA, Bahrain, and the USA.",
      },
    ],
    pillars: [
      {
        title: "Experienced Team",
        description: "Certified network architects, cybersecurity specialists, and systems engineers with decades of combined field experience.",
      },
      {
        title: "End-to-End Solutions",
        description: "Comprehensive scope spanning design, procurement, physical installation, software integration, and lifecycle maintenance.",
      },
      {
        title: "Quality & Reliability",
        description: "Strict adherence to international standards (ISO, BICSI, TIA/EIA) with tier-1 authentic OEM equipment guarantees.",
      },
      {
        title: "Customer Centric",
        description: "Tailored commercial agreements, dedicated account managers, responsive local SLA fulfillment, and rapid emergency dispatch.",
      },
    ],
    industries: [
      { name: "Healthcare", description: "High-reliability hospital networks, secure medical data communications, and electronic access systems." },
      { name: "Manufacturing", description: "Industrial Ethernet, automated PLC control cabling, SCADA networks, and facility-wide surveillance." },
      { name: "Government", description: "Mission-critical security governance, high-availability data infrastructure, and strict compliance." },
      { name: "Retail", description: "Interactive kiosks, commercial digital signage, POS structured cabling, and centralized IP surveillance." },
      { name: "Construction", description: "Site telecom mobilization, structured cabling infrastructure, perimeter security, and fire alarm systems." },
      { name: "Finance", description: "Zero-loss data migration, secure branch routers, redundant computing, and audited access controls." },
      { name: "Logistics", description: "Warehouse wireless bridges, barcode scanning stations, ruggedized network switches, and thermal printing." },
      { name: "Education", description: "Campus-wide Wi-Fi 6 coverage, smart interactive flat panels, and campus security infrastructure." },
      { name: "Oil and Gas", description: "Explosion-proof hazardous area enclosures, fiber optic backbones, and ruggedized industrial communications." },
      { name: "Hospitality", description: "Guest Wi-Fi gateways, VoIP telephony, smart digital concierge kiosks, and unified PA audio." },
    ],
  },
};
