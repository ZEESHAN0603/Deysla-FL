export interface Service {
  id: string;
  number: string;
  title: string;
  slug: string;
  shortDescription: string;
  overview: string;
  subServices: string[];
  deliverables: string[];
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  relevantCategories: string[];
  relevantBrandIds: string[];
  image: string;
  imageAlt: string;
}

export const SERVICES_DATA: Service[] = [
  {
    id: "cyber-security",
    number: "01",
    title: "Cyber Security",
    slug: "cyber-security",
    shortDescription:
      "Proactive cybersecurity solutions that protect systems, data, users, and business operations.",
    overview:
      "In an era of sophisticated digital threats, DEYSLA provides comprehensive cyber protection tailored to corporate and governmental infrastructure. From next-generation firewall deployments to managed endpoint response (EDR), we establish zero-trust perimeter defense and continuous security hygiene.",
    image:
      "/assets/products/cybersecurity-systems.webp",
    imageAlt: "DEYSLA Cyber Security Operations & Zero-Trust Threat Defense",
    subServices: [
      "Firewall Installation & Policy Management",
      "Endpoint Security & Advanced EDR Protection",
      "Network Intrusion Prevention Systems (IPS)",
      "Continuous Security Monitoring & Incident Response",
      "Vulnerability Scanning & Penetration Testing",
    ],
    deliverables: [
      "Perimeter Next-Gen Firewall Configuration (Fortinet, Cisco)",
      "Multi-Layered Threat Intelligence Feed Integration",
      "Real-Time Endpoint Isolation & Malware Defense Protocols",
      "Executive Security Risk & Compliance Reports",
    ],
    process: [
      { step: "01", title: "Security Assessment", description: "Audit current network perimeters, open attack surfaces, and user privileges." },
      { step: "02", title: "Architecture Design", description: "Engineer segmented zero-trust zones, firewall policies, and encrypted tunnels." },
      { step: "03", title: "Deployment & Hardening", description: "Deploy hardware appliances, install EDR agents, and enforce access controls." },
      { step: "04", title: "Continuous Monitoring", description: "Maintain proactive telemetry, firmware updates, and 24/7 incident alerting." },
    ],
    relevantCategories: ["security-systems", "networking"],
    relevantBrandIds: ["fortinet", "cisco"],
  },
  {
    id: "security-systems",
    number: "02",
    title: "Security Systems",
    slug: "security-systems",
    shortDescription:
      "Enterprise CCTV surveillance, biometric access control, and integrated physical facility protection.",
    overview:
      "DEYSLA engineers robust physical security ecosystems designed to safeguard industrial plants, corporate headquarters, and commercial centers. We combine high-resolution IP optical surveillance with intelligent video analytics, turnstiles, and multi-factor biometric authentication.",
    image:
      "/assets/products/cctv-surveillance.webp",
    imageAlt: "DEYSLA Enterprise IP CCTV Surveillance & Biometric Access Systems",
    subServices: [
      "High-Definition IP CCTV Camera Networks",
      "Biometric Access Control & Facial Recognition",
      "Pedestrian Speed Turnstiles & Vehicle Flap Barriers",
      "Intrusion Alarm & Perimeter Protection Systems",
      "Centralized Video Management Software (VMS)",
    ],
    deliverables: [
      "Turnkey CCTV Camera & Storage Engineering",
      "Enterprise Multi-Door Access Control Panels",
      "Time & Attendance System Integration",
      "Certified Civil Defense & Municipal Code Compliance",
    ],
    process: [
      { step: "01", title: "Site Survey", description: "Evaluate perimeter zones, entry gates, lighting, and vulnerable blind spots." },
      { step: "02", title: "System Engineering", description: "Specify camera focal lengths, NVR storage retention days, and cable routes." },
      { step: "03", title: "Installation & Cabling", description: "Install certified outdoor/indoor cameras, speed gates, and secure enclosures." },
      { step: "04", title: "VMS Commissioning", description: "Configure motion alerts, license plate recognition (ANPR), and central control desks." },
    ],
    relevantCategories: ["security-systems", "structured-cabling"],
    relevantBrandIds: ["hikvision", "axis", "bosch", "zkteco", "hid", "suprema", "hanwha-vision"],
  },
  {
    id: "data-migration",
    number: "03",
    title: "Data Migration",
    slug: "data-migration",
    shortDescription:
      "Secure, zero-downtime data and database migration between on-premises and cloud environments.",
    overview:
      "Transitioning enterprise data requires meticulous validation, schema mapping, and transactional integrity. DEYSLA plans and executes risk-free data migration across heterogeneous storage systems, SQL databases, and virtualized private/public cloud clusters without business disruption.",
    image:
      "/assets/Picture21.png",
    imageAlt: "DEYSLA Enterprise Cloud Data Migration & Database Transfer Pipeline",
    subServices: [
      "Enterprise Database Migration (SQL, PostgreSQL, Oracle)",
      "On-Premises to Cloud Infrastructure Migration",
      "Legacy System Modernization & Data Extraction",
      "Storage Area Network (SAN/NAS) Data Staging",
      "Post-Migration Integrity Verification & Schema Auditing",
    ],
    deliverables: [
      "Migration Architecture & Phased Rollout Roadmap",
      "Automated Parallel Sync Pipelines with Fallback Rollback",
      "Zero-Data-Loss Validation Checksum Protocols",
      "Performance Benchmark & Index Optimization Post-Transfer",
    ],
    process: [
      { step: "01", title: "Source Audit", description: "Catalog schema dependencies, data volumes, network latency, and uptime constraints." },
      { step: "02", title: "Dry-Run Staging", description: "Execute test migrations in isolated sandbox environments to measure throughput." },
      { step: "03", title: "Live Sync Cutover", description: "Perform delta-synchronization and orchestrated cutover during planned maintenance." },
      { step: "04", title: "Data Verification", description: "Perform row-level parity audits and hand over production system credentials." },
    ],
    relevantCategories: ["servers-and-computing"],
    relevantBrandIds: ["dell", "hp", "lenovo"],
  },
  {
    id: "voip-communications",
    number: "04",
    title: "VoIP Communications",
    slug: "voip-communications",
    shortDescription:
      "Enterprise IP PBX systems, unified communications, SIP trunking, and commercial audio.",
    overview:
      "Connect teams and clients with crystal-clear digital voice infrastructure. DEYSLA supplies and configures enterprise IP PBX appliances, interactive voice response (IVR) call routing, multi-branch SIP interconnectivity, and executive boardroom audio systems.",
    image:
      "/assets/products/ip-pbx-systems.webp",
    imageAlt: "DEYSLA Enterprise IP PBX Telephony & Unified Communications",
    subServices: [
      "Enterprise IP PBX Appliance Installation",
      "Cloud & Hybrid Telephony Deployment",
      "Multi-Branch SIP Trunking & Extension Dialing",
      "Call Center Queuing, Recording & Live Analytics",
      "Public Address (PA) & Commercial Sound Paging",
    ],
    deliverables: [
      "Configured PBX Appliance with Custom Voice Menus",
      "Executive Gigabit Desktop Phones & Wireless DECT Terminals",
      "Mobile Softphone Client Onboarding for Remote Workers",
      "Telephony QoS Optimization across LAN & WAN",
    ],
    process: [
      { step: "01", title: "Telephony Discovery", description: "Audit current trunk lines, extension counts, call volume, and paging zones." },
      { step: "02", title: "PBX Provisioning", description: "Configure dial plans, auto-attendants, ring groups, and voicemail-to-email." },
      { step: "03", title: "Hardware Deployment", description: "Deliver and patch IP phones, conference speakerphones, and PA speakers." },
      { step: "04", title: "Testing & Go-Live", description: "Validate call clarity, failover routing, emergency numbers, and user orientation." },
    ],
    relevantCategories: ["communications"],
    relevantBrandIds: ["grandstream", "yeastar", "fanvil", "panasonic", "toa", "jabra"],
  },
  {
    id: "it-infrastructure",
    number: "05",
    title: "IT Infrastructure",
    slug: "it-infrastructure",
    shortDescription:
      "End-to-end data center compute, enterprise switching, structured cabling, and server architecture.",
    overview:
      "Your IT physical and logical layer forms the backbone of all operational productivity. DEYSLA designs, builds, and maintains full-stack enterprise infrastructure including high-density server racks, resilient core switches, certified structured cabling, and clean online UPS power protection.",
    image:
      "/assets/products/network-cabinets.webp",
    imageAlt: "DEYSLA Data Center Server Racks & High-Density Infrastructure",
    subServices: [
      "Data Center Design & Server Rack Assembly",
      "Core & Distribution Switching Layer Architecture",
      "Certified Cat6A Copper & Fiber Optic Backbone",
      "Virtualization Cluster Setup (VMware, Proxmox, Hyper-V)",
      "Uninterruptible Power Supply (UPS) & Clean Power Backups",
    ],
    deliverables: [
      "Turnkey Rackmount Compute & Storage Enclosures",
      "Calibrated Fluke Cable Certification Test Reports",
      "Redundant Power Distribution & Battery Backup Bank",
      "Comprehensive As-Built Network Topology Diagrams",
    ],
    process: [
      { step: "01", title: "Capacity Planning", description: "Calculate workload compute cores, RAM, storage IOPS, and network bandwidth." },
      { step: "02", title: "Physical Layout", description: "Engineer rack elevation, airflow paths, cable trays, and electrical specs." },
      { step: "03", title: "Hardware Build", description: "Mount chassis, patch structured cabling, install UPS units, and cable label." },
      { step: "04", title: "Commissioning & Burn-In", description: "Perform stress tests, benchmark storage throughput, and verify failover." },
    ],
    relevantCategories: ["networking", "structured-cabling", "servers-and-computing"],
    relevantBrandIds: ["cisco", "dell", "hp", "commscope", "panduit", "eaton", "vertiv", "schneider"],
  },
  {
    id: "erpnext-solutions",
    number: "06",
    title: "ERPNext – Enterprise ERP",
    slug: "erpnext-solutions",
    shortDescription:
      "Custom ERPNext implementation, business process automation, accounting, and supply chain.",
    overview:
      "Unify accounting, inventory, human resources, manufacturing, and customer relationship management into a single sovereign platform. DEYSLA provides turnkey ERPNext implementation, customized workflows, role-based access security, and local GCC tax/e-invoicing compliance.",
    image:
      "/assets/products/desktops-and-laptops.webp",
    imageAlt: "DEYSLA ERPNext Solutions & Enterprise Resource Planning Dashboards",
    subServices: [
      "ERPNext Full Lifecycle Deployment & Hosting",
      "Financial Accounting, ZATCA e-Invoicing & Tax Setup",
      "Supply Chain, Procurement & Multi-Warehouse Tracking",
      "Human Resource Management & WPS Payroll Processing",
      "Custom DocType, Scripting & API Integrations",
    ],
    deliverables: [
      "Configured Production ERPNext Instance with Daily Backups",
      "Tailored Role-Based User Access Matrix",
      "Automated PDF Invoicing & Purchase Order Templates",
      "Admin & Departmental Staff Training Documentation",
    ],
    process: [
      { step: "01", title: "Business Process Mapping", description: "Document charts of accounts, approval hierarchies, and inventory stages." },
      { step: "02", title: "Customization & Schema", description: "Configure custom fields, validation rules, print formats, and tax modules." },
      { step: "03", title: "Data Migration & UAT", description: "Migrate customers, items, balances, and conduct user acceptance testing." },
      { step: "04", title: "Go-Live & Support", description: "Supervise production cutover, provide real-time floor support, and SLA maintenance." },
    ],
    relevantCategories: ["servers-and-computing"],
    relevantBrandIds: ["dell", "hp", "lenovo"],
  },
  {
    id: "cloud-solutions",
    number: "07",
    title: "Cloud Solutions",
    slug: "cloud-solutions",
    shortDescription:
      "Scalable public, private, and hybrid cloud architectures, automated backups, and disaster recovery.",
    overview:
      "Modernize business applications with agile cloud architectures built for speed, elastic scalability, and cost efficiency. DEYSLA architects hybrid cloud environments combining localized on-prem storage with secure cloud compute, automated geo-redundant backups, and disaster recovery protocols.",
    image:
      "/assets/products/rack-servers.webp",
    imageAlt: "DEYSLA Hybrid Cloud Computing & Scalable Infrastructure",
    subServices: [
      "Public, Private & Hybrid Cloud Architecture",
      "Automated Cloud Backup & Disaster Recovery (DR)",
      "Secure Cloud Storage & Virtual Server Provisioning",
      "Cloud Cost Optimization & Workload Right-Sizing",
      "Multi-Cloud VPN Interconnect & Identity Integration",
    ],
    deliverables: [
      "Engineered Cloud Infrastructure Topology",
      "Automated Encrypted Offsite Backup Schedules",
      "Tested Disaster Recovery Recovery-Time (RTO/RPO) Plans",
      "Centralized Cloud Governance & Access Dashboards",
    ],
    process: [
      { step: "01", title: "Workload Assessment", description: "Evaluate application dependencies, storage patterns, and sovereignty needs." },
      { step: "02", title: "Cloud Blueprint", description: "Architect virtual private clouds (VPCs), subnets, security groups, and storage tiers." },
      { step: "03", title: "Deployment & Sync", description: "Deploy virtual machines, configure replication, and establish encrypted VPNs." },
      { step: "04", title: "Disaster Simulation", description: "Execute mock failovers to verify business continuity without data loss." },
    ],
    relevantCategories: ["servers-and-computing", "networking"],
    relevantBrandIds: ["dell", "hp", "cisco", "fortinet"],
  },
  {
    id: "industrial-automation",
    number: "08",
    title: "Industrial Automation",
    slug: "industrial-automation",
    shortDescription:
      "SCADA networking, PLC control wiring, ruggedized industrial switching, and instrumentation.",
    overview:
      "Bridging the physical plant floor with enterprise intelligence. DEYSLA provides rugged industrial networking, hardened DIN-rail switches, process control instrumentation, and SCADA fieldbus wiring designed to endure high heat, humidity, vibration, and electrical noise.",
    image:
      "/assets/products/industrial-switches.webp",
    imageAlt: "DEYSLA Industrial Automation, PLC Control & SCADA Networks",
    subServices: [
      "Harsh-Environment Industrial Switch Deployment",
      "PLC to SCADA Network Architecture & Fieldbus Cabling",
      "Industrial IoT Remote Telemetry & Gateway Setup",
      "Control Panel Wiring, Terminals & Surge Protection",
      "Process Instrumentation & Sensor Interfacing",
    ],
    deliverables: [
      "Hardened DIN-Rail Switch Cabinets with Redundant DC Power",
      "Shielded Profinet / Modbus Industrial Cabling Links",
      "Signal Conditioners & Isolated Remote I/O Racks",
      "Industrial Cybersecurity & Air-Gapped Network Zones",
    ],
    process: [
      { step: "01", title: "Plant Environment Survey", description: "Measure thermal conditions, ingress protection (IP rating), and EMI noise." },
      { step: "02", title: "Industrial Blueprint", description: "Select hardened hardware, redundant ring topologies (MRP), and fiber paths." },
      { step: "03", title: "Panel Assembly", description: "Wire DIN-rail components, surge protectors, power supplies, and field cables." },
      { step: "04", title: "Loop Testing & Handover", description: "Verify signal latency, packet loss, failover time (<20ms), and sensor reads." },
    ],
    relevantCategories: ["industrial-automation", "structured-cabling"],
    relevantBrandIds: ["schneider", "phoenix-contact", "advantech", "hirschmann", "weidmuller", "abb"],
  },
  {
    id: "software-development",
    number: "09",
    title: "Software Development",
    slug: "software-development",
    shortDescription:
      "Custom enterprise software, internal business portals, API integrations, and workflow engines.",
    overview:
      "When off-the-shelf software fails to match your operational requirements, DEYSLA develops bespoke, high-performance web applications, administrative portals, and system integration middleware. Engineered with modern TypeScript, microservices, and secure relational databases.",
    image:
      "/assets/Picture10.png",
    imageAlt: "DEYSLA Custom Software Development, APIs & Enterprise Portals",
    subServices: [
      "Custom Web Applications & Enterprise Dashboards",
      "Internal Business Portals & Workflow Engines",
      "REST & GraphQL API Integration Middleware",
      "Mobile Companion Apps for Field Personnel",
      "Database Optimization & Legacy Code Refactoring",
    ],
    deliverables: [
      "Production-Ready Custom Application Codebase",
      "Role-Based Authentication & Audit Logging Systems",
      "Documented API Endpoints & Developer Reference",
      "Automated CI/CD Pipeline & Containerized Deployment",
    ],
    process: [
      { step: "01", title: "Requirements Discovery", description: "Define user personas, functional specifications, and data models." },
      { step: "02", title: "UX Design & Architecture", description: "Create responsive interactive mockups and technical system architecture." },
      { step: "03", title: "Agile Development", description: "Build iterative sprint deliverables with continuous client review demos." },
      { step: "04", title: "Deployment & QA", description: "Conduct security audits, stress testing, and deploy to production servers." },
    ],
    relevantCategories: ["servers-and-computing"],
    relevantBrandIds: ["dell", "hp", "lenovo"],
  },
  {
    id: "governance-and-audit",
    number: "10",
    title: "Governance and Audit",
    slug: "governance-and-audit",
    shortDescription:
      "IT compliance assessments, cybersecurity audits, risk management, and regulatory advisory.",
    overview:
      "Align IT operations with recognized international standards and regional regulatory frameworks. DEYSLA provides independent security posture audits, IT asset documentation, risk assessment frameworks, and disaster recovery validation to ensure institutional compliance.",
    image:
      "/assets/products/antivirus-edr.webp",
    imageAlt: "DEYSLA IT Governance, Cybersecurity Audit & Regulatory Compliance",
    subServices: [
      "Cybersecurity Framework Audits & Gap Analysis",
      "IT Infrastructure Health & Performance Auditing",
      "Data Protection & Access Privilege Governance",
      "Disaster Recovery & Business Continuity Plan Auditing",
      "Formal Audit Reporting & Remediation Roadmaps",
    ],
    deliverables: [
      "Executive Gap Analysis & Risk Matrix Report",
      "Prioritized Remediation Roadmap with Estimated Impact",
      "Formal IT Policy & Procedure Template Suite",
      "Post-Remediation Verification & Attestation Statement",
    ],
    process: [
      { step: "01", title: "Scope Definition", description: "Establish audit boundaries, regulatory mandates, and stakeholder interviews." },
      { step: "02", title: "Technical Evidence Review", description: "Inspect firewall rules, password policies, backup logs, and physical access." },
      { step: "03", title: "Risk Analysis", description: "Score findings by severity, probability, and business disruption potential." },
      { step: "04", title: "Executive Briefing", description: "Deliver comprehensive audit findings and actionable remediation plans." },
    ],
    relevantCategories: ["security-systems", "servers-and-computing"],
    relevantBrandIds: ["fortinet", "cisco"],
  },
];
