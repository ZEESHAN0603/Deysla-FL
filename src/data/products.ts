export interface ProductType {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  subcategories: string[];
  keyApplications: string[];
  image: string;
  imageAlt?: string;
  brandIds: string[];
}

export const PRODUCTS_DATA: ProductType[] = [
  // 1. NETWORKING
  {
    id: "network-switches",
    name: "Network Switches",
    slug: "network-switches",
    categoryId: "networking",
    categoryName: "Networking",
    description:
      "High-speed managed and unmanaged enterprise switches designed for continuous throughput, low latency, and scalable campus or data center connectivity.",
    subcategories: [
      "Managed Switches",
      "Unmanaged Switches",
      "PoE Switch",
      "Gigabit Switch",
      "10G Switch",
      "Layer 2 Switch",
      "Layer 3 Switch",
    ],
    keyApplications: [
      "Enterprise Campus LAN",
      "IP CCTV Camera Power & Data Aggregation",
      "Data Center Top-of-Rack Switching",
      "VoIP Phone Deployment with PoE+",
    ],
    image: "/assets/products/network-switches.webp",
    imageAlt: "Enterprise Managed Gigabit and 10G Network Switches in Data Center Rack",
    brandIds: ["cisco", "netgear", "huawei", "aruba", "ruijie", "mikrotik"],
  },
  {
    id: "routers",
    name: "Routers",
    slug: "routers",
    categoryId: "networking",
    categoryName: "Networking",
    description:
      "Secure edge routing platforms delivering robust wide area networking, encrypted site-to-site VPN tunnels, and high-availability dual-WAN redundancy.",
    subcategories: [
      "Enterprise Routers",
      "Branch Routers",
      "Industrial Routers",
      "VPN Routers",
      "4G/5G Routers",
    ],
    keyApplications: [
      "Corporate Headquarter WAN Termination",
      "Branch Office Multi-Site Interconnect",
      "Remote Industrial SCADA Backhaul",
      "High-Speed Cellular Redundant Failover",
    ],
    image: "/assets/products/routers.webp",
    imageAlt: "Enterprise Edge Routing Gateway and WAN Infrastructure",
    brandIds: ["cisco", "huawei", "mikrotik", "ruijie"],
  },
  {
    id: "wireless-solutions",
    name: "Wireless Solutions",
    slug: "wireless-solutions",
    categoryId: "networking",
    categoryName: "Networking",
    description:
      "Enterprise-grade Wi-Fi 6 access points, wireless controllers, outdoor long-range point-to-point wireless bridges, and guest management portals.",
    subcategories: [
      "Wireless Access Points",
      "Indoor Access Point",
      "Outdoor Access Points",
      "WiFi Bridges and P2P",
    ],
    keyApplications: [
      "High-Density Office Wi-Fi",
      "Campus Outdoor Wireless Coverage",
      "Warehouse High-Bay RF Connectivity",
      "Inter-Building Gigabit Wireless Links",
    ],
    image: "/assets/products/wireless-solutions.webp",
    imageAlt: "Enterprise High-Density Wi-Fi 6 Access Points & Wireless Architecture",
    brandIds: ["cisco", "aruba", "ruijie", "huawei"],
  },
  {
    id: "media-converters",
    name: "Media Converters",
    slug: "media-converters",
    categoryId: "networking",
    categoryName: "Networking",
    description:
      "Reliable copper-to-fiber protocol media converters extending Ethernet distances over single-mode and multi-mode optical fiber lines.",
    subcategories: [
      "Ethernet to Fiber Converters",
      "Gigabit Media Converters",
      "PoE Media Converter",
      "Managed Media Converters",
    ],
    keyApplications: [
      "Long-Distance Perimeter Camera Extensions",
      "Electrical Isolation in Industrial Environments",
      "Inter-Building Backbone Connections",
    ],
    image: "/assets/products/media-converters.webp",
    imageAlt: "Industrial Optical Copper-to-Fiber Gigabit Media Converters",
    brandIds: ["cisco", "netgear", "ruijie"],
  },
  {
    id: "industrial-networking",
    name: "Industrial Networking",
    slug: "industrial-networking",
    categoryId: "networking",
    categoryName: "Networking",
    description:
      "Hardened DIN-rail Ethernet switches engineered for extreme temperature variances, vibration resistance, and electromagnetic immunity in factories and utilities.",
    subcategories: [
      "Managed Industrial Switches",
      "Unmanaged Industrial Switches",
      "PoE Industrial Switches",
      "Gigabit Industrial Switches",
      "DIN Rail Switches",
      "Fibre Industrial Switches",
    ],
    keyApplications: [
      "Manufacturing Plant Floor Automation",
      "Substation Automation & SCADA Networks",
      "Traffic Control & ITS Transportation Systems",
      "Oil & Gas Pipeline Telemetry",
    ],
    image: "/assets/products/industrial-networking.webp",
    imageAlt: "DEYSLA Hardened DIN-Rail Industrial Networking and Control Enclosure",
    brandIds: ["schneider", "advantech", "hirschmann", "phoenix-contact"],
  },
  {
    id: "transceivers",
    name: "Transceivers",
    slug: "transceivers",
    categoryId: "networking",
    categoryName: "Networking",
    description:
      "High-compatibility optical transceivers delivering seamless multi-gigabit uplinks across short-range (SR) and long-range (LR) optical fiber spans.",
    subcategories: [
      "SFP Transceivers",
      "SFP+ Transceivers",
      "SFP28 Transceivers",
      "QSFP Transceivers",
      "QSFP28 Transceivers",
      "BiDi Transceivers",
    ],
    keyApplications: [
      "Switch Core-to-Distribution 10G/40G/100G Uplinks",
      "Storage Area Network (SAN) Optical Interfaces",
      "Single-Strand Bi-Directional Fiber Utilization",
    ],
    image: "/assets/products/transceivers.webp",
    imageAlt: "High-Speed SFP, SFP+, and QSFP Optical Transceivers for Enterprise Uplinks",
    brandIds: ["cisco", "huawei", "ruijie"],
  },

  // 2. SECURITY SYSTEM
  {
    id: "cctv-surveillance",
    name: "CCTV Surveillance",
    slug: "cctv-surveillance",
    categoryId: "security-systems",
    categoryName: "Security Systems",
    description:
      "High-definition IP surveillance cameras, AI-powered smart video analytics, network video recorders (NVR), and centralized video management software (VMS).",
    subcategories: [
      "IP Dome Cameras",
      "Bullet Cameras",
      "PTZ High-Speed Domes",
      "Thermal Imaging Cameras",
      "Network Video Recorders (NVR)",
      "Video Management Software (VMS)",
    ],
    keyApplications: [
      "Corporate Headquarters Perimeter Security",
      "Industrial Facility Monitoring",
      "Commercial Retail Asset Protection",
      "License Plate Recognition (ANPR) Gate Systems",
    ],
    image: "/assets/products/cctv-surveillance.webp",
    imageAlt: "Commercial Optical IP CCTV Surveillance Dome and Bullet Cameras",
    brandIds: ["hikvision", "axis", "bosch", "hanwha-vision", "honeywell"],
  },
  {
    id: "access-control",
    name: "Access Control Systems",
    slug: "access-control",
    categoryId: "security-systems",
    categoryName: "Security Systems",
    description:
      "Integrated biometric facial recognition terminals, smart card readers, speed turnstiles, and enterprise multi-door access controllers.",
    subcategories: [
      "Biometric Terminals",
      "RFID & Smart Card Readers",
      "Pedestrian Speed Turnstiles & Flap Barriers",
      "Multi-Door IP Controllers",
      "Time & Attendance Software",
    ],
    keyApplications: [
      "Restricted Data Center Access",
      "Corporate Office Employee Turnstiles",
      "Multi-Tenant Commercial Building Gates",
      "Time and Attendance Payroll Synchronization",
    ],
    image: "/assets/products/access-control.webp",
    imageAlt: "DEYSLA Pedestrian Speed Turnstiles and Biometric Access Control Terminal",
    brandIds: ["zkteco", "hid", "suprema", "honeywell", "hikvision"],
  },
  {
    id: "security-cabling",
    name: "Security Cabling",
    slug: "security-cabling",
    categoryId: "security-systems",
    categoryName: "Security Systems",
    description:
      "Specialized shielded and flame-retardant cabling engineered for high-integrity transmission across IP video, sensor loops, and alarm signals.",
    subcategories: [
      "Shielded Security Cabling",
      "Access Control Composite Cable",
      "Alarm Multicore Cable",
      "Coaxial Cable with Power",
    ],
    keyApplications: [
      "Perimeter IP Surveillance Cabling",
      "Access Control Door Lock Loops",
      "Intruder Alarm Sensor Bus",
    ],
    image: "/assets/products/security-cabling.webp",
    imageAlt: "Precision Shielded Security Cabling Spools and Access Control Wiring",
    brandIds: ["commscope", "panduit", "excel-cabling"],
  },
  {
    id: "cybersecurity-systems",
    name: "Cybersecurity Systems",
    slug: "cybersecurity-systems",
    categoryId: "security-systems",
    categoryName: "Security Systems",
    description:
      "Enterprise Next-Generation Firewalls (NGFW), Intrusion Prevention Systems (IPS), and secure remote access gateways safeguarding business networks.",
    subcategories: [
      "Next-Gen Firewalls (NGFW)",
      "Intrusion Prevention Systems (IPS)",
      "Secure VPN Gateways",
      "Email & Web Security Gateways",
    ],
    keyApplications: [
      "Enterprise Perimeter Threat Prevention",
      "Zero Trust Branch Network Access",
      "Encrypted Multi-Site VPN Connectivity",
    ],
    image: "/assets/products/cybersecurity-systems.webp",
    imageAlt: "Enterprise Next-Generation Firewall and Cybersecurity Telemetry Operations",
    brandIds: ["fortinet", "cisco"],
  },
  {
    id: "antivirus-edr",
    name: "Antivirus & EDR Solutions",
    slug: "antivirus-edr",
    categoryId: "security-systems",
    categoryName: "Security Systems",
    description:
      "Centralized endpoint detection, endpoint response (EDR), server protection suites, and proactive malware defense for distributed enterprise fleets.",
    subcategories: [
      "Endpoint Protection Platforms",
      "Server Edition Antivirus",
      "Endpoint Detection and Response (EDR)",
      "Central Cloud Management Consoles",
    ],
    keyApplications: [
      "Corporate Workstation Fleet Protection",
      "Data Center Hypervisor & Server Shielding",
      "Ransomware Isolation and Automated Remediation",
    ],
    image: "/assets/products/antivirus-edr.webp",
    imageAlt: "Enterprise Endpoint Detection and Response EDR Defense Console",
    brandIds: ["fortinet"],
  },

  // 3. COMMUNICATIONS
  {
    id: "ip-pbx-systems",
    name: "IP PBX Systems",
    slug: "ip-pbx-systems",
    categoryId: "communications",
    categoryName: "Communications",
    description:
      "Scalable on-premises and hybrid IP PBX platforms supporting unified voice, video, interactive voice response (IVR), and call center queuing.",
    subcategories: [
      "On-Premises Appliance IP PBX",
      "Hybrid IP PBX Systems",
      "Cloud PBX Solutions",
      "Call Center Management Modules",
    ],
    keyApplications: [
      "Multi-Branch Corporate Telephony",
      "Customer Support Call Center Queues",
      "Unified Communications Interconnect",
    ],
    image: "/assets/products/ip-pbx-systems.webp",
    imageAlt: "Enterprise Unified IP PBX Telephony System and Voice Gateway",
    brandIds: ["grandstream", "yeastar", "panasonic"],
  },
  {
    id: "ip-phones",
    name: "IP Phones",
    slug: "ip-phones",
    categoryId: "communications",
    categoryName: "Communications",
    description:
      "Executive HD color IP desktop phones, wireless cordless DECT handsets, and conference room speakerphones engineered for acoustic clarity.",
    subcategories: [
      "Executive Color IP Phones",
      "Enterprise Gigabit Desktop Phones",
      "Cordless DECT Handsets & Base Stations",
      "Conference Room Speakerphones",
    ],
    keyApplications: [
      "Executive Boardroom Teleconferencing",
      "Front-Desk & Reception Call Management",
      "Warehouse Mobile Cordless Communications",
    ],
    image: "/assets/products/ip-phones.webp",
    imageAlt: "Modern Executive Gigabit Desktop IP Telephone with Color Screen and HD Audio",
    brandIds: ["grandstream", "fanvil", "panasonic"],
  },
  {
    id: "audio-solutions",
    name: "Audio Solutions",
    slug: "audio-solutions",
    categoryId: "communications",
    categoryName: "Communications",
    description:
      "Commercial Public Address (PA) amplifiers, ceiling and horn speakers, enterprise audio mixers, and unified paging microphones.",
    subcategories: [
      "Public Address (PA) Amplifiers",
      "Ceiling Speakers",
      "Outdoor Weatherproof Horn Speakers",
      "Audio Mixers & Zone Selectors",
      "Professional Noise-Canceling Headsets",
    ],
    keyApplications: [
      "Shopping Mall Background Music & Paging",
      "Industrial Plant Evacuation Voice Broadcast",
      "Corporate Town Hall Acoustic Sound Reinforcement",
    ],
    image: "/assets/products/audio-solutions.webp",
    imageAlt: "Commercial PA Acoustic Speakers, Sound Amplifiers & Conference Audio",
    brandIds: ["toa", "bosch", "jabra"],
  },

  // 4. STRUCTURED CABLING
  {
    id: "copper-cables",
    name: "Copper Cables",
    slug: "copper-cables",
    categoryId: "structured-cabling",
    categoryName: "Structured Cabling",
    description:
      "Verified solid bare copper data cables compliant with TIA/EIA-568 standards for high-bandwidth 1G/10G Ethernet transmission.",
    subcategories: [
      "Cat5e UTP Cables",
      "Cat6 UTP / FTP Cables",
      "Cat6A Shielded SFTP Cables",
      "Cat7 S/FTP Cables",
      "LSZH Low-Smoke Zero-Halogen Jackets",
    ],
    keyApplications: [
      "Enterprise Horizontal Office Cabling",
      "High-Density Data Center Copper Links",
      "Industrial Interference-Shielded Data Runs",
    ],
    image: "/assets/products/copper-cables.webp",
    imageAlt: "High-Bandwidth Bare Copper Cat6A Data Cable Spools and Ethernet Wire Reels",
    brandIds: ["commscope", "corning", "panduit", "legrand", "excel-cabling", "nexans", "schneider"],
  },
  {
    id: "fiber-optic-cables",
    name: "Fiber Optic Cables",
    slug: "fiber-optic-cables",
    categoryId: "structured-cabling",
    categoryName: "Structured Cabling",
    description:
      "High-tensile single-mode (OS2) and multi-mode (OM3/OM4/OM5) optical cables engineered for high-bandwidth backbone transmission.",
    subcategories: [
      "Single-Mode (OS2) Fiber Cable",
      "Multi-Mode (OM3/OM4) Fiber Cable",
      "Armoured Underground Fiber Cable",
      "Indoor & Outdoor LSZH Fiber Cable",
      "ADSS Aerial Self-Supporting Cable",
    ],
    keyApplications: [
      "Campus Backbone Inter-Building Connections",
      "Industrial Plant Underground Trench Cabling",
      "Data Center Core Optical Trunks",
    ],
    image: "/assets/products/fiber-optic-cables.webp",
    imageAlt: "Single-Mode and Multimode High-Bandwidth Fiber Optic Backbone Cables",
    brandIds: ["corning", "commscope", "panduit", "nexans", "randm"],
  },
  {
    id: "patch-panels",
    name: "Patch Panels",
    slug: "patch-panels",
    categoryId: "structured-cabling",
    categoryName: "Structured Cabling",
    description:
      "High-density 24-port and 48-port copper patch panels, sliding fiber optic patch panels (ODF), and modular unloaded keystone frames.",
    subcategories: [
      "Cat5e, Cat6, Cat6A Patch Panels",
      "Fiber Optic Patch Panels (ODF)",
      "Modular Keystone Patch Panels",
      "Pre-Loaded & Shielded Patch Panels",
    ],
    keyApplications: [
      "Structured Cabling Cross-Connect Racks",
      "Fiber Splice Distribution Enclosures",
      "Clean Cable Management Closets",
    ],
    image: "/assets/products/patch-panels.webp",
    imageAlt: "DEYSLA Precision High-Density 24-Port and 48-Port Patch Panels",
    brandIds: ["commscope", "panduit", "excel-cabling", "legrand"],
  },
  {
    id: "keystone-jacks",
    name: "Keystone Jacks & Accessories",
    slug: "keystone-jacks",
    categoryId: "structured-cabling",
    categoryName: "Structured Cabling",
    description:
      "Tool-less RJ45 keystone jacks, fiber optic couplers, faceplates, backboxes, and multimedia snap-in modules.",
    subcategories: [
      "Cat6 & Cat6A Tool-less Keystone Jacks",
      "Shielded Die-Cast RJ45 Jacks",
      "Fiber Optic Couplers & Adapters",
      "Dual & Quad Port Faceplates",
    ],
    keyApplications: [
      "Workstation Wall Outlet Terminations",
      "Floor Box Network Connection Drops",
      "Server Rack Cable Interconnects",
    ],
    image: "/assets/products/keystone-jacks.webp",
    imageAlt: "Modular RJ45 Keystone Jacks, Faceplates, and Patch Connection Blocks",
    brandIds: ["commscope", "panduit", "excel-cabling", "legrand"],
  },
  {
    id: "network-cabinets",
    name: "Network Cabinets & Racks",
    slug: "network-cabinets",
    categoryId: "structured-cabling",
    categoryName: "Structured Cabling",
    description:
      "Heavy-duty 19-inch equipment racks, server enclosures, wall-mount swing frames, and IP55 weatherproof outdoor telecom cabinets.",
    subcategories: [
      "Wall Mount Cabinets (6U - 18U)",
      "Floor Standing Server Cabinets (24U - 47U)",
      "Open Frame 2-Post & 4-Post Racks",
      "IP55 Weatherproof Outdoor Cabinets",
    ],
    keyApplications: [
      "Enterprise Main Distribution Frames (MDF)",
      "Data Center Server Enclosures",
      "Outdoor Perimeter Telecommunications Housing",
    ],
    image: "/assets/products/network-cabinets.webp",
    imageAlt: "DEYSLA Heavy-Duty 19-Inch 42U Server Racks and Network Cabinets",
    brandIds: ["legrand", "schneider", "vertiv", "panduit"],
  },

  // 5. DIGITAL DISPLAYS AND KIOSKS
  {
    id: "led-displays",
    name: "LED Displays & Video Walls",
    slug: "led-displays",
    categoryId: "digital-displays-and-kiosks",
    categoryName: "Digital Displays and Kiosks",
    description:
      "Fine pixel pitch indoor LED displays, high-brightness outdoor billboards, and bezel-less video walls for command centers and lobbies.",
    subcategories: [
      "Indoor Fine Pixel Pitch LED Walls",
      "Outdoor High-Brightness LED Billboards",
      "Ultra-Narrow Bezel LCD Video Walls",
      "Curved & Architectural LED Displays",
    ],
    keyApplications: [
      "Control Room Monitoring Video Walls",
      "Corporate Headquarters Reception Lobbies",
      "Outdoor Retail & Commercial Billboards",
    ],
    image: "/assets/products/led-displays.webp",
    imageAlt: "Fine Pixel Pitch Ultra-HD Commercial LED Video Wall and Display System",
    brandIds: ["samsung", "lg", "philips", "viewsonic"],
  },
  {
    id: "digital-signage",
    name: "Digital Signage Displays",
    slug: "digital-signage",
    categoryId: "digital-displays-and-kiosks",
    categoryName: "Digital Displays and Kiosks",
    description:
      "24/7 commercial-grade digital signage displays, freestanding digital totems, and cloud-managed media player hardware.",
    subcategories: [
      "Commercial 24/7 Display Screens",
      "Freestanding Advertising Totems",
      "Touch-Enabled Interactive Signage",
      "Signage Media Players",
    ],
    keyApplications: [
      "Retail Digital Product Showcases",
      "Wayfinding Kiosks in Commercial Centers",
      "Corporate Internal Communication Boards",
    ],
    image: "/assets/products/digital-signage.webp",
    imageAlt: "DEYSLA Commercial Ultra-Narrow Bezel Digital Signage and Customer Kiosks",
    brandIds: ["samsung", "lg", "philips", "viewsonic"],
  },
  {
    id: "interactive-displays",
    name: "Interactive Displays",
    slug: "interactive-displays",
    categoryId: "digital-displays-and-kiosks",
    categoryName: "Digital Displays and Kiosks",
    description:
      "4K multi-touch interactive flat panels designed for corporate boardrooms, collaborative meeting spaces, and smart educational classrooms.",
    subcategories: [
      "4K Multi-Touch Flat Panels",
      "Digital Interactive Whiteboards",
      "Wireless Screen Sharing Systems",
      "Mobile Motorized Display Stands",
    ],
    keyApplications: [
      "Executive Meeting Room Collaboration",
      "Higher Education Smart Lecture Halls",
      "Design & Engineering Review Sessions",
    ],
    image: "/assets/products/interactive-displays.webp",
    imageAlt: "Corporate Boardroom 4K Multi-Touch Interactive Collaboration Smart Board",
    brandIds: ["samsung", "lg", "viewsonic"],
  },
  {
    id: "kiosk-accessories",
    name: "Kiosks & Accessories",
    slug: "kiosk-accessories",
    categoryId: "digital-displays-and-kiosks",
    categoryName: "Digital Displays and Kiosks",
    description:
      "Self-service transactional kiosks, industrial thermal receipt printers, QR/barcode scanners, and secure payment mounting enclosures.",
    subcategories: [
      "Self-Service Touch Kiosks",
      "Integrated Thermal Printers",
      "1D/2D Barcode & QR Scanners",
      "Card Reader Mounts & Enclosures",
    ],
    keyApplications: [
      "Government Customer Service Queue Terminals",
      "Healthcare Patient Check-In Stations",
      "Retail Self-Checkout Kiosks",
    ],
    image: "/assets/products/kiosk-accessories.webp",
    imageAlt: "Commercial Self-Service Touch Kiosks, Barcode Scanners and POS Terminals",
    brandIds: ["zebra", "samsung"],
  },

  // 6. SERVERS AND COMPUTING
  {
    id: "rack-servers",
    name: "Rack Servers",
    slug: "rack-servers",
    categoryId: "servers-and-computing",
    categoryName: "Servers and Computing",
    description:
      "High-density 1U/2U/4U enterprise rack servers engineered for high virtualization density, database computing, and mission-critical enterprise workloads.",
    subcategories: [
      "1U High-Density Compute Servers",
      "2U Scalable Storage & Compute Servers",
      "4U High-Availability Enterprise Servers",
      "Hyper-Converged Infrastructure Nodes",
    ],
    keyApplications: [
      "Enterprise VMware / Hyper-V Virtualization",
      "Database & ERP Backend Hosting",
      "Private Cloud Infrastructure Deployment",
    ],
    image: "/assets/products/rack-servers.webp",
    imageAlt: "DEYSLA High-Density Enterprise 1U/2U Rackmount Compute Servers in Datacenter",
    brandIds: ["dell", "hp", "lenovo"],
  },
  {
    id: "tower-servers",
    name: "Tower Servers",
    slug: "tower-servers",
    categoryId: "servers-and-computing",
    categoryName: "Servers and Computing",
    description:
      "Quiet, compact, and expandable tower servers designed for branch offices, remote sites, and distributed commercial operations.",
    subcategories: [
      "Single-Socket Tower Servers",
      "Dual-Socket Expandable Tower Servers",
      "Rack-Convertible Tower Systems",
    ],
    keyApplications: [
      "Branch Office Local Domain & File Server",
      "Small Business Centralized ERP Hosting",
      "Remote Site Data Staging & Backup",
    ],
    image: "/assets/products/tower-servers.webp",
    imageAlt: "Enterprise Quiet Tower Server Chassis and Scalable Compute Workstation",
    brandIds: ["dell", "hp", "lenovo"],
  },
  {
    id: "desktops-and-laptops",
    name: "Desktops and Laptops",
    slug: "desktops-and-laptops",
    categoryId: "servers-and-computing",
    categoryName: "Servers and Computing",
    description:
      "Enterprise-grade business workstations, thin clients, and business laptops built for high durability, fleet manageability, and hardware security.",
    subcategories: [
      "Commercial Workstations",
      "Small Form Factor Enterprise Desktops",
      "Business Class Laptops",
      "Ruggedized Field Laptops",
    ],
    keyApplications: [
      "CAD/CAM Engineering Workstations",
      "Corporate Office Knowledge Worker Fleets",
      "Field Service Rugged Mobile Computing",
    ],
    image: "/assets/products/desktops-and-laptops.webp",
    imageAlt: "Enterprise Commercial Laptops and Business Computing Workstations",
    brandIds: ["dell", "hp", "lenovo"],
  },
  {
    id: "printers-and-supplies",
    name: "Printers and Supplies",
    slug: "printers-and-supplies",
    categoryId: "servers-and-computing",
    categoryName: "Servers and Computing",
    description:
      "Heavy-duty industrial thermal barcode printers, enterprise multifunction laser printers, and certified consumable supplies.",
    subcategories: [
      "Industrial Thermal Barcode Printers",
      "Enterprise Multifunction Laser Printers",
      "Mobile Handheld Label Printers",
      "Original Toners & Media Ribbons",
    ],
    keyApplications: [
      "Warehouse Asset & Shipping Labeling",
      "Corporate Department Document Printing",
      "Healthcare Patient ID Wristband Printing",
    ],
    image: "/assets/products/printers-and-supplies.webp",
    imageAlt: "Departmental Multifunction Laser Printers and Heavy-Duty Thermal Labeling",
    brandIds: ["hp", "zebra"],
  },
  {
    id: "ups-and-pdus",
    name: "UPS and PDUs",
    slug: "ups-and-pdus",
    categoryId: "servers-and-computing",
    categoryName: "Servers and Computing",
    description:
      "Online double-conversion uninterruptible power supply (UPS) systems, external battery packs, and rackmount metered/switched PDUs.",
    subcategories: [
      "Online Double-Conversion Rack UPS (1kVA - 20kVA)",
      "Three-Phase Modular Data Center UPS",
      "Smart Metered & Switched Rack PDUs",
      "Automatic Transfer Switches (ATS)",
    ],
    keyApplications: [
      "Data Center Power Continuity Protection",
      "Telecom Network Closet Clean Backup Power",
      "Industrial SCADA System Voltage Stabilization",
    ],
    image: "/assets/products/ups-and-pdus.webp",
    imageAlt: "Online Double-Conversion Rackmount UPS Battery Backup and Switched PDUs",
    brandIds: ["eaton", "vertiv", "schneider"],
  },

  // 7. INDUSTRIAL AUTOMATION
  {
    id: "industrial-switches",
    name: "Industrial Switches",
    slug: "industrial-switches",
    categoryId: "industrial-automation",
    categoryName: "Industrial Automation",
    description:
      "Ruggedized industrial Ethernet switches with wide operating temperatures (-40°C to 75°C), redundant DC power inputs, and DIN-rail mounting.",
    subcategories: [
      "DIN-Rail Managed Switches",
      "Unmanaged Industrial Switches",
      "Industrial High-Power PoE+ Switches",
      "Substation IEC 61850 Switches",
    ],
    keyApplications: [
      "Factory Automation PLC Interconnection",
      "Power Utility Substation Control",
      "Water & Wastewater Treatment SCADA",
    ],
    image: "/assets/products/industrial-switches.webp",
    imageAlt: "DEYSLA DIN-Rail Mounted Hardened Industrial Ethernet Switches",
    brandIds: ["schneider", "advantech", "hirschmann", "phoenix-contact", "abb"],
  },
  {
    id: "control-cables",
    name: "Control & Instrumentation Cables",
    slug: "control-cables",
    categoryId: "industrial-automation",
    categoryName: "Industrial Automation",
    description:
      "Heavy-duty instrumentation cables, Profibus/Modbus fieldbus cables, and oil-resistant shielded flexible motor control cables.",
    subcategories: [
      "Shielded Instrumentation Cables",
      "Profibus / Profinet Data Cables",
      "Flexible Continuous-Flex Control Cables",
      "Oil & Chemical Resistant Cables",
    ],
    keyApplications: [
      "PLC to Sensor Signal Transmission",
      "Variable Frequency Drive (VFD) Connections",
      "Harsh Chemical Industrial Plant Floor Wiring",
    ],
    image: "/assets/products/control-cables.webp",
    imageAlt: "Multi-Conductor Shielded Industrial Automation Control Cables & Wiring",
    brandIds: ["schneider", "weidmuller", "phoenix-contact"],
  },
  {
    id: "instrumentation",
    name: "Industrial Instrumentation",
    slug: "instrumentation",
    categoryId: "industrial-automation",
    categoryName: "Industrial Automation",
    description:
      "Industrial sensor interfaces, signal conditioners, protocol gateways, and distributed remote I/O modules for process monitoring.",
    subcategories: [
      "Distributed Remote I/O Modules",
      "Signal Isolators & Conditioners",
      "Industrial Protocol Gateways (Modbus/EtherNet/IP)",
      "Surge Protective Devices for Control Cabinets",
    ],
    keyApplications: [
      "Industrial SCADA Telemetry Ingestion",
      "Legacy Fieldbus to Ethernet Bridging",
      "Critical Equipment Surge & Transient Protection",
    ],
    image: "/assets/products/instrumentation.webp",
    imageAlt: "Factory Floor Process Instrumentation, Sensors and PLC Gateways",
    brandIds: ["schneider", "advantech", "weidmuller", "abb", "phoenix-contact"],
  },

  // 8. FIRE AND SAFETY SYSTEMS
  {
    id: "fire-detection-and-alarm",
    name: "Fire Detection and Alarm",
    slug: "fire-detection-and-alarm",
    categoryId: "fire-and-safety-systems",
    categoryName: "Fire and Safety Systems",
    description:
      "Addressable fire alarm control panels, intelligent optical smoke sensors, heat sensors, manual call points, and visual strobe alarms.",
    subcategories: [
      "Intelligent Addressable Fire Panels",
      "Optical Smoke Detectors",
      "Rate-of-Rise Heat Detectors",
      "Manual Break-Glass Call Points",
      "Audio-Visual Flashing Sounder Strobes",
    ],
    keyApplications: [
      "Commercial Tower Fire Safety Code Compliance",
      "Industrial Facility Early Smoke Warning",
      "Hotel & Residential Complex Evacuation Alerts",
    ],
    image: "/assets/products/fire-detection-and-alarm.webp",
    imageAlt: "Addressable Fire Alarm Control Panels, Optical Smoke Detectors & Strobes",
    brandIds: ["honeywell", "notifier", "bosch", "apollo", "edwards", "eaton"],
  },
  {
    id: "fire-suppression",
    name: "Fire Suppression Systems",
    slug: "fire-suppression",
    categoryId: "fire-and-safety-systems",
    categoryName: "Fire and Safety Systems",
    description:
      "Clean-agent fire extinguishing systems (FM-200, Novec 1230), kitchen hood suppression systems, and deluge valves protecting critical electronic assets.",
    subcategories: [
      "Clean Agent Total Flooding Systems (FM-200 / Novec 1230)",
      "CO2 Gaseous Extinguishing Systems",
      "Commercial Kitchen Wet Chemical Suppression",
      "Automatic Pre-Action Sprinkler Valves",
    ],
    keyApplications: [
      "Server Room & Data Center Clean Agent Shielding",
      "Electrical Switchgear Room Protection",
      "Commercial Kitchen Grease Duct Suppression",
    ],
    image: "/assets/products/fire-suppression.webp",
    imageAlt: "Data Center Clean Agent Total Flooding Fire Suppression Cylinder Bank",
    brandIds: ["kidde", "ansul", "naffco"],
  },
  {
    id: "emergency-and-fire-safety",
    name: "Emergency and Fire Safety",
    slug: "emergency-and-fire-safety",
    categoryId: "fire-and-safety-systems",
    categoryName: "Fire and Safety Systems",
    description:
      "Self-contained emergency exit illumination luminaires, central battery systems, voice evacuation sound systems, and certified fire extinguishers.",
    subcategories: [
      "LED Emergency Exit Signs",
      "Central Battery Emergency Lighting Systems",
      "Voice Alarm Evacuation (EVAC) Audio Systems",
      "Certified Portable Fire Extinguishers",
    ],
    keyApplications: [
      "Building Safe Egress Pathway Illumination",
      "Audible Voice Evacuation Directions in High-Rises",
      "Civil Defense Compliant Rapid Response Safety",
    ],
    image: "/assets/products/emergency-and-fire-safety.webp",
    imageAlt: "Certified Commercial Emergency Exit Illumination Signs & Life Safety Stations",
    brandIds: ["naffco", "eaton", "bosch"],
  },
];
