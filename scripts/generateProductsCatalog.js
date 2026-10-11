import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = path.resolve('public/assets/products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 34 Products specifications matching user's Product Page zip archives
const products = [
  // 1. NETWORKING (Product_Page_1)
  {
    id: 'network-switches',
    title: 'Managed & PoE+ Enterprise Switches',
    subtitle: 'Layer 2/3 Enterprise Switching • PoE+ 370W • 10G SFP+ Uplinks',
    category: 'NETWORKING',
    brand: 'CISCO / NETGEAR / HUAWEI',
    themeColor: '#0284c7', // Sky Blue
    accentColor: '#38bdf8',
    spec1: '24x GbE PoE+ Ports',
    spec2: '4x 10G SFP+ Uplinks',
    spec3: '128 Gbps Switching Fabric',
    type: 'switch'
  },
  {
    id: 'routers',
    title: 'Enterprise Core & Branch Edge Routers',
    subtitle: 'Dual WAN Redundancy • Hardware IPsec Acceleration • SFP Combo',
    category: 'NETWORKING',
    brand: 'CISCO Catalyst / HUAWEI',
    themeColor: '#0284c7',
    accentColor: '#38bdf8',
    spec1: 'Dual-WAN Gigabit SFP',
    spec2: 'Hardware IPsec / SSL VPN',
    spec3: '4G/5G Cellular Failover',
    type: 'router'
  },
  {
    id: 'wireless-solutions',
    title: 'Enterprise Wi-Fi 6 APs & 5G CPE Gateways',
    subtitle: '802.11ax OFDMA • 5.9 Gbps Aggregated Throughput • MU-MIMO',
    category: 'NETWORKING',
    brand: 'ARUBA / HUAWEI 5G CPE',
    themeColor: '#0284c7',
    accentColor: '#38bdf8',
    spec1: 'Wi-Fi 6 (802.11ax) 4x4',
    spec2: '5G Sub-6GHz & mmWave',
    spec3: '512 Concurrent Clients',
    type: 'wireless'
  },
  {
    id: 'media-converters',
    title: 'Gigabit Optical Copper-to-Fiber Converters',
    subtitle: '10/100/1000Base-T to 1000Base-FX • Up to 20km Single-Mode',
    category: 'NETWORKING',
    brand: 'COMMERCIAL / INDUSTRIAL',
    themeColor: '#0284c7',
    accentColor: '#38bdf8',
    spec1: 'SC/LC Duplex Optical',
    spec2: 'Auto-MDI/MDIX Gigabit',
    spec3: 'Link Fault Pass-Through',
    type: 'converter'
  },
  {
    id: 'industrial-networking',
    title: 'Hardened DIN-Rail Industrial Switches',
    subtitle: 'IP40 Rugged Aluminum • -40°C to +75°C • Dual DC Redundancy',
    category: 'NETWORKING',
    brand: 'HIRSCHMANN / ADVANTECH',
    themeColor: '#0284c7',
    accentColor: '#38bdf8',
    spec1: 'DIN-Rail Mount IP40',
    spec2: '-40°C to +75°C Extreme Temp',
    spec3: '12-48V DC Dual Power',
    type: 'industrial-switch'
  },
  {
    id: 'transceivers',
    title: '40G / 10G SFP+ & QSFP Optical Transceivers',
    subtitle: '40GBASE-CSR4 / 10G SFP+ • Hot-Pluggable • DDM Diagnostics',
    category: 'NETWORKING',
    brand: 'CISCO / HUAWEI COMPATIBLE',
    themeColor: '#0284c7',
    accentColor: '#38bdf8',
    spec1: '40G QSFP+ / 10G SFP+',
    spec2: '850nm / 1310nm Duplex LC',
    spec3: 'Digital Diagnostics (DDM)',
    type: 'transceiver'
  },

  // 2. SECURITY SYSTEMS (Product_page_2)
  {
    id: 'cctv-surveillance',
    title: 'Commercial Optical 4K IP CCTV Cameras',
    subtitle: 'Vandal Dome & Bullet • H.265+ Compression • 50m IR Night Vision',
    category: 'SECURITY SYSTEMS',
    brand: 'HIKVISION / AXIS / BOSCH',
    themeColor: '#059669', // Emerald
    accentColor: '#34d399',
    spec1: '4K Ultra HD (3840x2160)',
    spec2: 'Smart IR 50m & WDR 120dB',
    spec3: 'IP67 Weatherproof & IK10',
    type: 'cctv'
  },
  {
    id: 'access-control',
    title: 'Speed Turnstiles, Boom Barriers & Biometrics',
    subtitle: 'Automatic Vehicular Barrier • Facial Recognition • Anti-Tailgate',
    category: 'SECURITY SYSTEMS',
    brand: 'ZKTECO / SUPREMA / HID',
    themeColor: '#059669',
    accentColor: '#34d399',
    spec1: '0.6s High-Speed Boom Arm',
    spec2: 'Face Recognition <0.2s',
    spec3: 'SUS304 Stainless Turnstile',
    type: 'access-control'
  },
  {
    id: 'security-cabling',
    title: 'RG59 Siamese Coaxial & Shielded Alarm Cables',
    subtitle: 'RG59 Coax + 18/2 Power • 95% Bare Copper Braid • FPLR Listed',
    category: 'SECURITY SYSTEMS',
    brand: 'BELDEN / COMMSCOPE',
    themeColor: '#059669',
    accentColor: '#34d399',
    spec1: 'RG59 Solid Copper Core',
    spec2: 'Integrated 18AWG 2-Conductor',
    spec3: 'FPLR Riser Fire Rated',
    type: 'cabling-security'
  },
  {
    id: 'cybersecurity-systems',
    title: 'Next-Generation Firewall Security Appliances',
    subtitle: 'Fortinet FortiGate • Hardware ASIC Threat Defense • SSL Inspection',
    category: 'SECURITY SYSTEMS',
    brand: 'FORTINET / CISCO FIREPOWER',
    themeColor: '#059669',
    accentColor: '#34d399',
    spec1: '10 Gbps Firewall Throughput',
    spec2: 'AI-Powered IPS & Antivirus',
    spec3: 'Zero Trust Network Access',
    type: 'firewall'
  },
  {
    id: 'antivirus-edr',
    title: 'Enterprise Endpoint Detection & Response (EDR)',
    subtitle: 'Quick Heal Server Edition • Ransomware Shield • Central Console',
    category: 'SECURITY SYSTEMS',
    brand: 'QUICK HEAL / SOPHOS',
    themeColor: '#059669',
    accentColor: '#34d399',
    spec1: 'Server Edition 1-Yr License',
    spec2: 'Behavioral Ransomware Shield',
    spec3: 'Cloud-Managed Central Console',
    type: 'edr'
  },

  // 3. COMMUNICATIONS
  {
    id: 'ip-pbx-systems',
    title: 'Unified Enterprise IP PBX Telephony Servers',
    subtitle: 'Hybrid SIP & PSTN • Up to 500 Extensions • IVR & Call Recording',
    category: 'COMMUNICATIONS',
    brand: 'YEASTAR / GRANDSTREAM',
    themeColor: '#7c3aed', // Violet
    accentColor: '#a78bfa',
    spec1: '500 VoIP Users & 100 Calls',
    spec2: 'FXO/FXS/E1 Expansion',
    spec3: 'Built-in Call Recording',
    type: 'pbx'
  },
  {
    id: 'ip-phones',
    title: 'Executive HD Gigabit Desktop IP Telephones',
    subtitle: 'Color LCD Screen • Dual Gigabit PoE • Wideband Opus HD Voice',
    category: 'COMMUNICATIONS',
    brand: 'FANVIL / GRANDSTREAM',
    themeColor: '#7c3aed',
    accentColor: '#a78bfa',
    spec1: '4.3\" Color LCD Display',
    spec2: 'Dual Gigabit PoE Ports',
    spec3: 'Opus HD Audio & Headset',
    type: 'phone'
  },
  {
    id: 'audio-solutions',
    title: 'Commercial Sound, PA Amplifiers & Speakers',
    subtitle: '100V Line System • Multi-Zone Mixer Amplifier • Ceiling Speakers',
    category: 'COMMUNICATIONS',
    brand: 'TOA / BOSCH SECURITY',
    themeColor: '#7c3aed',
    accentColor: '#a78bfa',
    spec1: '240W 100V/70V Mixer Amp',
    spec2: 'Multi-Zone Paging Control',
    spec3: 'EN54-24 Certified Audio',
    type: 'audio'
  },

  // 4. STRUCTURED CABLING (Product_page_4)
  {
    id: 'copper-cables',
    title: 'Cat6A S/FTP Rigid Copper Ethernet Cables',
    subtitle: 'Cat6A 10Gbps 500MHz • 23AWG LSZH • 500-Meter Wooden Spool Drum',
    category: 'STRUCTURED CABLING',
    brand: 'COMMSCOPE / EXCEL / 3A CORNING',
    themeColor: '#d97706', // Amber
    accentColor: '#fbbf24',
    spec1: 'Cat6A 10Gbps 500MHz',
    spec2: 'S/FTP 23AWG LSZH Blue',
    spec3: '500m Wooden Drum Reel',
    type: 'cable-spool'
  },
  {
    id: 'fiber-optic-cables',
    title: 'Single-Mode & Multi-Mode Fiber Backbone Cables',
    subtitle: 'OS2 9/125 & OM4 50/125 • Armored Loose Tube • Duplex LC Cords',
    category: 'STRUCTURED CABLING',
    brand: 'CORNING / COMMSCOPE',
    themeColor: '#d97706',
    accentColor: '#fbbf24',
    spec1: 'OS2 9/125 & OM4 50/125',
    spec2: 'Steel Armored Direct Burial',
    spec3: 'Low Loss Ceramic Ferrules',
    type: 'fiber'
  },
  {
    id: 'patch-panels',
    title: '24-Port & 48-Port Cat6A Shielded Patch Panels',
    subtitle: '1U 19-Inch Rackmount • Rear Cable Management Bar • Shielded FTP',
    category: 'STRUCTURED CABLING',
    brand: 'EXCEL / COMMSCOPE / PANDUIT',
    themeColor: '#d97706',
    accentColor: '#fbbf24',
    spec1: '1U 24-Port 19-Inch Rack',
    spec2: 'Cat6A Shielded Metallic Body',
    spec3: 'Rear Cable Support Bar',
    type: 'patch-panel'
  },
  {
    id: 'keystone-jacks',
    title: 'Toolless RJ45 Keystone Jacks & Inline Couplers',
    subtitle: 'Cat6A 180° Shielded Die-Cast Zinc • HDMI & RJ45 Modular Couplers',
    category: 'STRUCTURED CABLING',
    brand: 'PANDUIT / LEGRAND / EXCEL',
    themeColor: '#d97706',
    accentColor: '#fbbf24',
    spec1: 'Toolless 180° Zinc Alloy',
    spec2: 'Cat6A 10G Certified',
    spec3: 'Modular Snap-in Standard',
    type: 'keystone'
  },
  {
    id: 'network-cabinets',
    title: '36U Outdoor Weatherproof & 42U Server Cabinets',
    subtitle: '36U IP55 Telecom Enclosure • 1500W AC Unit • 42U Server Racks',
    category: 'STRUCTURED CABLING',
    brand: 'GREAT LAKES / TOTEN',
    themeColor: '#d97706',
    accentColor: '#fbbf24',
    spec1: '36U IP55 Outdoor Enclosure',
    spec2: 'Integrated 1500W AC Unit',
    spec3: '19-Inch 42U Heavy-Duty',
    type: 'cabinet'
  },

  // 5. DIGITAL DISPLAYS AND KIOSKS (Product_Page_5)
  {
    id: 'led-displays',
    title: 'DOIT-VISION Fine-Pitch 4K UHD Commercial LED Wall',
    subtitle: 'P1.2/P1.5 Seamless Matrix • 3840Hz Refresh Rate • Magnetic Service',
    category: 'DIGITAL DISPLAYS & KIOSKS',
    brand: 'DOIT-VISION / SAMSUNG',
    themeColor: '#c026d3', // Fuchsia
    accentColor: '#e879f9',
    spec1: 'P1.25 Fine Pixel Pitch',
    spec2: '3840Hz High Refresh Rate',
    spec3: 'Seamless 4K/8K Matrix',
    type: 'led-wall'
  },
  {
    id: 'digital-signage',
    title: '43/50/55-Inch Interactive Touch Info Kiosks',
    subtitle: 'Floor-Standing Curved Totem • 4K UHD 24/7 Panel • 10-Point Touch',
    category: 'DIGITAL DISPLAYS & KIOSKS',
    brand: 'COMMERCIAL SERIES',
    themeColor: '#c026d3',
    accentColor: '#e879f9',
    spec1: '55\" 4K UHD Commercial Panel',
    spec2: '10-Point Capacitive Touch',
    spec3: 'Built-in Android / Win11',
    type: 'kiosk'
  },
  {
    id: 'interactive-displays',
    title: 'Corporate Conference 4K Collaboration Smart Board',
    subtitle: '75\"/86\" 4K Touch Panel • 20-Point Touch • Integrated 4K Camera Bar',
    category: 'DIGITAL DISPLAYS & KIOSKS',
    brand: 'VIEWSONIC / LG COMMERCIAL',
    themeColor: '#c026d3',
    accentColor: '#e879f9',
    spec1: '75\" / 86\" Anti-Glare 4K',
    spec2: 'Zero-Gap Optical Bonding',
    spec3: '4K Camera & 8-Mic Array',
    type: 'smart-board'
  },
  {
    id: 'kiosk-accessories',
    title: 'Commercial Kiosk POS Terminals & Accessories',
    subtitle: '80mm Thermal Receipt Printers • 2D QR Scanners • RFID Card Readers',
    category: 'DIGITAL DISPLAYS & KIOSKS',
    brand: 'ZEBRA / CUSTOM POS',
    themeColor: '#c026d3',
    accentColor: '#e879f9',
    spec1: '80mm Auto-Cutter Thermal',
    spec2: '2D QR & Barcode Engine',
    spec3: 'RFID / NFC Card Module',
    type: 'pos-scanner'
  },

  // 6. SERVERS AND COMPUTING (Product_page_6)
  {
    id: 'rack-servers',
    title: 'Enterprise GPU Cloud & Machine Learning Rack Servers',
    subtitle: '2U Dual Intel Xeon Scalable • Multi-GPU Bays • Hot-Swap NVMe',
    category: 'SERVERS & COMPUTING',
    brand: 'DELL POWREDGE / HPE / LENOVO',
    themeColor: '#4f46e5', // Indigo
    accentColor: '#818cf8',
    spec1: 'Dual Intel Xeon Scalable',
    spec2: '4x Enterprise GPU Slots',
    spec3: '24x 2.5\" NVMe SSD Bays',
    type: 'rack-server'
  },
  {
    id: 'tower-servers',
    title: 'Dell PowerEdge T550 Enterprise Tower Servers',
    subtitle: 'Dual-Socket Xeon Scalable • 8x 3.5\" SAS/SATA • iDRAC9 Enterprise',
    category: 'SERVERS & COMPUTING',
    brand: 'DELL TECHNOLOGIES',
    themeColor: '#4f46e5',
    accentColor: '#818cf8',
    spec1: 'Dell PowerEdge T550',
    spec2: '8x 3.5\" Hot-Swap SAS/SATA',
    spec3: 'iDRAC9 Remote Management',
    type: 'tower-server'
  },
  {
    id: 'desktops-and-laptops',
    title: 'Enterprise Business Laptops & Workstation Desktops',
    subtitle: 'Intel Core i7/i9 vPro • 32GB DDR5 • Dual-Monitor Docking Stations',
    category: 'SERVERS & COMPUTING',
    brand: 'HP / DELL / LENOVO',
    themeColor: '#4f46e5',
    accentColor: '#818cf8',
    spec1: 'Intel Core vPro Series',
    spec2: '32GB RAM & 1TB Gen4 NVMe',
    spec3: 'Dual 4K Monitor Docking',
    type: 'laptop-workstation'
  },
  {
    id: 'printers-and-supplies',
    title: 'Color Laser Printers & ColorWorks Ink Supplies',
    subtitle: 'Duplex Laser MFP • Epson ColorWorks SJIC35P Pigment Ink Supplies',
    category: 'SERVERS & COMPUTING',
    brand: 'HP / EPSON COLORWORKS',
    themeColor: '#4f46e5',
    accentColor: '#818cf8',
    spec1: 'Duplex Color Laser MFP',
    spec2: 'Epson ColorWorks SJIC35P',
    spec3: 'High-Yield Heavy Duty',
    type: 'printer'
  },
  {
    id: 'ups-and-pdus',
    title: 'Online Double-Conversion Rackmount & Desktop UPS',
    subtitle: '500VA-1500VA Desktop • 3kVA-10kVA Rackmount • Zero Transfer Time',
    category: 'SERVERS & COMPUTING',
    brand: 'EATON / VERTIV / APC',
    themeColor: '#4f46e5',
    accentColor: '#818cf8',
    spec1: '500VA to 1500VA Desktop',
    spec2: '3kVA 2U Online Rackmount',
    spec3: 'Zero Transfer Pure Sine Wave',
    type: 'ups'
  },

  // 7. INDUSTRIAL AUTOMATION (Product_Page_7)
  {
    id: 'industrial-switches',
    title: '16-Port Industrial Gigabit PoE+ Fiber Switches',
    subtitle: '10/100/1000Mbps Managed PoE+ • Dual SFP Slots • DIN-Rail Enclosure',
    category: 'INDUSTRIAL AUTOMATION',
    brand: 'HIRSCHMANN / ADVANTECH',
    themeColor: '#0891b2', // Cyan
    accentColor: '#22d3ee',
    spec1: '16x Gigabit PoE+ (30W/port)',
    spec2: '2x Gigabit SFP Slots',
    spec3: 'IP40 DIN-Rail Aluminum',
    type: 'ind-switch'
  },
  {
    id: 'control-cables',
    title: 'Multi-Conductor Shielded Industrial Control Cables',
    subtitle: 'Oil-Resistant S/FTP & CY • Flexible PVC/PUR • IEC 60332 Certified',
    category: 'INDUSTRIAL AUTOMATION',
    brand: 'BELDEN / NEXANS',
    themeColor: '#0891b2',
    accentColor: '#22d3ee',
    spec1: 'Multi-Core 0.75-2.5mm²',
    spec2: 'Tinned Copper Braid Shield',
    spec3: 'Oil & UV Resistant PUR',
    type: 'control-cable'
  },
  {
    id: 'instrumentation',
    title: 'Intelligent Gauge & Absolute Pressure Transmitters',
    subtitle: '4-20mA HART Protocol • Stainless Steel Diaphragm • Backlit LCD',
    category: 'INDUSTRIAL AUTOMATION',
    brand: 'ABB / HONEYWELL / SIEMENS',
    themeColor: '#0891b2',
    accentColor: '#22d3ee',
    spec1: '4-20mA with HART Protocol',
    spec2: '316L SS Process Diaphragm',
    spec3: 'Ex d IIC T6 Explosion-Proof',
    type: 'pressure-transmitter'
  },

  // 8. FIRE AND SAFETY SYSTEMS (Product_Page_8)
  {
    id: 'fire-detection-and-alarm',
    title: 'Addressable Fire Alarm Panels & Manual Call Points',
    subtitle: 'Addressable 4-Loop Control Panel • Manual Break-Glass Call Point',
    category: 'FIRE AND SAFETY SYSTEMS',
    brand: 'APOLLO / KIDDE / EDWARDS / NOTIFIER',
    themeColor: '#e11d48', // Rose
    accentColor: '#fb7185',
    spec1: '4-Loop 1000-Device Panel',
    spec2: 'Manual Break-Glass Call Point',
    spec3: 'EN54 & UL 864 Certified',
    type: 'fire-alarm'
  },
  {
    id: 'fire-suppression',
    title: 'FM-200 / Novec Clean Agent Fire Suppression Cylinders',
    subtitle: 'Total Flooding Gas Suppression • Electric Actuator • Zero ODP',
    category: 'FIRE AND SAFETY SYSTEMS',
    brand: 'ANSUL / NAFFCO / KIDDE',
    themeColor: '#e11d48',
    accentColor: '#fb7185',
    spec1: 'FM-200 / HFC-227ea Clean Gas',
    spec2: 'Electric Solenoid Actuator',
    spec3: 'UL / FM Approved Valves',
    type: 'fire-suppression'
  },
  {
    id: 'emergency-and-fire-safety',
    title: 'UL/FM Certified Pillar Fire Hydrants & Safety Stations',
    subtitle: 'Ductile Iron Wet Barrel • Dual 2.5\" Hose & 4.5\" Pumper Outlets',
    category: 'FIRE AND SAFETY SYSTEMS',
    brand: 'NAFFCO / MUELLER',
    themeColor: '#e11d48',
    accentColor: '#fb7185',
    spec1: 'UL Listed / FM Approved',
    spec2: '2x 2.5\" Hose + 1x 4.5\" Pumper',
    spec3: '250 PSI Working Pressure',
    type: 'hydrant'
  }
];

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSVG(p) {
  const width = 800;
  const height = 500;
  const title = escapeXml(p.title);
  const subtitle = escapeXml(p.subtitle);
  const category = escapeXml(p.category);
  const brand = escapeXml(p.brand);
  const spec1 = escapeXml(p.spec1);
  const spec2 = escapeXml(p.spec2);
  const spec3 = escapeXml(p.spec3);

  // Visual device rendering customized per type
  let deviceSvg = '';

  switch (p.type) {
    case 'switch':
      deviceSvg = `
        <!-- 1U Network Switch Chassis -->
        <rect x="80" y="210" width="640" height="90" rx="4" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <!-- Mounting Ears -->
        <rect x="60" y="200" width="20" height="110" rx="2" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <circle cx="70" cy="215" r="4" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
        <circle cx="70" cy="295" r="4" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
        <rect x="720" y="200" width="20" height="110" rx="2" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <circle cx="730" cy="215" r="4" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
        <circle cx="730" cy="295" r="4" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
        <!-- LED Status Panel -->
        <rect x="100" y="225" width="70" height="60" rx="3" fill="#0f172a"/>
        <circle cx="115" cy="240" r="3.5" fill="#22c55e"/>
        <circle cx="130" cy="240" r="3.5" fill="#22c55e"/>
        <circle cx="145" cy="240" r="3.5" fill="#eab308"/>
        <circle cx="160" cy="240" r="3.5" fill="#22c55e"/>
        <text x="135" y="270" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">PWR SYS POE</text>
        <!-- 24x RJ45 Ports (Dual Row) -->
        <g transform="translate(190, 222)">
          ${Array.from({ length: 12 }).map((_, i) => `
            <g transform="translate(${i * 35}, 0)">
              <!-- Top Port -->
              <rect x="0" y="0" width="28" height="28" rx="2" fill="#020617" stroke="#475569" stroke-width="1"/>
              <rect x="6" y="8" width="16" height="14" fill="#334155"/>
              <circle cx="14" cy="4" r="2" fill="${i % 3 === 0 ? '#eab308' : '#22c55e'}"/>
              <!-- Bottom Port -->
              <rect x="0" y="34" width="28" height="28" rx="2" fill="#020617" stroke="#475569" stroke-width="1"/>
              <rect x="6" y="42" width="16" height="14" fill="#334155"/>
              <circle cx="14" cy="38" r="2" fill="#22c55e"/>
            </g>
          `).join('')}
        </g>
        <!-- 4x SFP+ Cages -->
        <g transform="translate(625, 226)">
          <rect x="0" y="0" width="38" height="26" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <rect x="42" y="0" width="38" height="26" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <rect x="0" y="32" width="38" height="26" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <rect x="42" y="32" width="38" height="26" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="40" y="66" fill="#38bdf8" font-size="8" font-family="monospace" text-anchor="middle">10G SFP+ UPLINKS</text>
        </g>
      `;
      break;

    case 'router':
      deviceSvg = `
        <!-- Router Desktop / Rack Unit -->
        <rect x="120" y="195" width="560" height="120" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <!-- Dual Antennas -->
        <line x1="160" y1="195" x2="140" y2="130" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
        <line x1="640" y1="195" x2="660" y2="130" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
        <!-- Front Fascia with Bevel -->
        <rect x="135" y="210" width="530" height="90" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <!-- Cisco Style Logo Badge -->
        <rect x="155" y="235" width="80" height="40" rx="4" fill="#020617" stroke="#38bdf8" stroke-width="1"/>
        <text x="195" y="255" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">CISCO</text>
        <text x="195" y="268" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">897VAW-K9</text>
        <!-- Gigabit WAN & LAN Ports -->
        <g transform="translate(260, 230)">
          <!-- Dual WAN Ports (Blue) -->
          <rect x="0" y="5" width="34" height="40" rx="3" fill="#082f49" stroke="#0284c7" stroke-width="1.5"/>
          <rect x="40" y="5" width="34" height="40" rx="3" fill="#082f49" stroke="#0284c7" stroke-width="1.5"/>
          <text x="37" y="60" fill="#38bdf8" font-size="8" font-family="monospace" text-anchor="middle">DUAL WAN</text>
          <!-- 8x LAN Gigabit Ports -->
          ${Array.from({ length: 4 }).map((_, i) => `
            <g transform="translate(${95 + i * 40}, 5)">
              <rect x="0" y="0" width="32" height="18" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
              <rect x="0" y="22" width="32" height="18" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
            </g>
          `).join('')}
          <!-- SFP Slot -->
          <rect x="270" y="5" width="45" height="40" rx="3" fill="#020617" stroke="#eab308" stroke-width="1.5"/>
          <text x="292" y="60" fill="#facc15" font-size="8" font-family="monospace" text-anchor="middle">SFP COMBO</text>
          <!-- Status Indicators -->
          <g transform="translate(330, 15)">
            <circle cx="10" cy="5" r="4" fill="#22c55e"/>
            <circle cx="25" cy="5" r="4" fill="#22c55e"/>
            <circle cx="40" cy="5" r="4" fill="#38bdf8"/>
            <circle cx="55" cy="5" r="4" fill="#22c55e"/>
            <text x="32" y="30" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">VPN 5G ACT</text>
          </g>
        </g>
      `;
      break;

    case 'wireless':
      deviceSvg = `
        <!-- Ceiling Mount Access Point + 5G Gateway -->
        <!-- Circular Wi-Fi 6 AP -->
        <g transform="translate(260, 240)">
          <circle cx="0" cy="0" r="85" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
          <circle cx="0" cy="0" r="75" fill="#f1f5f9"/>
          <!-- Logo & Status Ring -->
          <circle cx="0" cy="0" r="25" fill="#e2e8f0"/>
          <circle cx="0" cy="0" r="6" fill="#0284c7"/>
          <text x="0" y="45" fill="#475569" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">Wi-Fi 6 AP</text>
          <!-- Wireless Wave Rings -->
          <circle cx="0" cy="0" r="105" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>
          <circle cx="0" cy="0" r="125" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4,6" opacity="0.3"/>
        </g>
        <!-- Huawei 5G CPE Desktop Router -->
        <g transform="translate(480, 150)">
          <rect x="0" y="20" width="130" height="160" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
          <!-- 5G Logo and LED Strip -->
          <rect x="35" y="45" width="60" height="25" rx="4" fill="#0f172a"/>
          <text x="65" y="62" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">5G CPE</text>
          <!-- Status Lights -->
          <circle cx="45" cy="100" r="3" fill="#22c55e"/>
          <circle cx="65" cy="100" r="3" fill="#22c55e"/>
          <circle cx="85" cy="100" r="3" fill="#0284c7"/>
          <line x1="25" y1="130" x2="105" y2="130" stroke="#cbd5e1" stroke-width="2"/>
          <text x="65" y="155" fill="#64748b" font-size="9" font-family="sans-serif" text-anchor="middle">HUAWEI Pro</text>
        </g>
      `;
      break;

    case 'cctv':
      deviceSvg = `
        <!-- Vandal Dome Camera & Optical Bullet Camera -->
        <!-- Dome Camera (Left) -->
        <g transform="translate(250, 250)">
          <!-- Base mount -->
          <ellipse cx="0" cy="-30" rx="80" ry="25" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
          <!-- Polycarbonate Dome bubble -->
          <path d="M -60 -30 A 60 70 0 0 0 60 -30 Z" fill="#0f172a" stroke="#334155" stroke-width="2" opacity="0.9"/>
          <!-- Inner motorized lens -->
          <circle cx="0" cy="0" r="22" fill="#020617" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="0" cy="0" r="10" fill="#0369a1"/>
          <!-- Infrared LED ring -->
          ${Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return `<circle cx="${Math.cos(angle) * 32}" cy="${Math.sin(angle) * 32}" r="2" fill="#ef4444"/>`;
          }).join('')}
          <text x="0" y="55" fill="#94a3b8" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">4K IK10 DOME</text>
        </g>
        <!-- Bullet Camera (Right) -->
        <g transform="translate(520, 200)">
          <!-- Sunshield & Cylinder Body -->
          <path d="M 0 10 L 140 10 L 130 90 L 0 90 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
          <rect x="-10" y="0" width="160" height="14" rx="3" fill="#e2e8f0"/>
          <!-- Optical Lens Face -->
          <ellipse cx="140" cy="50" rx="15" ry="38" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="140" cy="50" r="14" fill="#020617"/>
          <circle cx="140" cy="50" r="6" fill="#38bdf8"/>
          <!-- Mounting Bracket -->
          <path d="M 40 90 L 40 130 L 10 130" fill="none" stroke="#64748b" stroke-width="12" stroke-linecap="round"/>
          <rect x="-15" y="115" width="30" height="30" rx="4" fill="#475569"/>
          <text x="70" y="125" fill="#94a3b8" font-size="10" font-family="sans-serif" font-weight="bold">4K OPTICAL BULLET</text>
        </g>
      `;
      break;

    case 'cable-spool':
      deviceSvg = `
        <!-- Heavy-Duty Cat6A Wooden Spool Drum -->
        <g transform="translate(400, 250)">
          <!-- Back Flange -->
          <ellipse cx="0" cy="-20" rx="130" ry="80" fill="#78350f" stroke="#451a03" stroke-width="4"/>
          <!-- Cable Coil (Blue Cat6A) -->
          <rect x="-100" y="-30" width="200" height="90" rx="10" fill="#0284c7" stroke="#0369a1" stroke-width="3"/>
          ${Array.from({ length: 8 }).map((_, i) => `
            <line x1="-95" y1="${-20 + i * 11}" x2="95" y2="${-20 + i * 11}" stroke="#38bdf8" stroke-width="3"/>
          `).join('')}
          <!-- Front Flange with Arbor Hole -->
          <ellipse cx="0" cy="40" rx="130" ry="80" fill="#92400e" stroke="#451a03" stroke-width="4"/>
          <ellipse cx="0" cy="40" rx="30" ry="18" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
          <!-- Specification Printing -->
          <text x="0" y="8" fill="#fef08a" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">DEYSLA Cat6A S/FTP 23AWG LSZH</text>
          <text x="0" y="24" fill="#ffffff" font-size="10" font-family="monospace" text-anchor="middle">500M • 500MHz • 10G-BASE-T</text>
        </g>
      `;
      break;

    case 'patch-panel':
      deviceSvg = `
        <!-- 1U 24-Port Cat6A Shielded Patch Panel -->
        <rect x="70" y="210" width="660" height="85" rx="3" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <!-- Rack Ears -->
        <rect x="50" y="200" width="20" height="105" rx="2" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <rect x="730" y="200" width="20" height="105" rx="2" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <!-- 24 Shielded Keystone Ports in 4 banks of 6 -->
        ${Array.from({ length: 4 }).map((_, bank) => `
          <g transform="translate(${95 + bank * 155}, 225)">
            <rect x="0" y="0" width="145" height="55" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1"/>
            ${Array.from({ length: 6 }).map((_, port) => `
              <g transform="translate(${8 + port * 23}, 12)">
                <rect x="0" y="0" width="18" height="24" rx="2" fill="#020617" stroke="#e2e8f0" stroke-width="1.5"/>
                <rect x="3" y="6" width="12" height="12" fill="#d97706"/>
                <text x="9" y="32" fill="#94a3b8" font-size="7" font-family="monospace" text-anchor="middle">${bank * 6 + port + 1}</text>
              </g>
            `).join('')}
          </g>
        `).join('')}
        <text x="400" y="315" fill="#f59e0b" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">CAT6A SHIELDED 24-PORT 1U PATCH PANEL</text>
      `;
      break;

    case 'cabinet':
      deviceSvg = `
        <!-- 36U Weatherproof & 42U Server Rack Enclosure -->
        <g transform="translate(230, 140)">
          <!-- 36U Outdoor IP55 Cabinet -->
          <rect x="0" y="0" width="140" height="220" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
          <rect x="15" y="20" width="110" height="180" rx="4" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
          <!-- 1500W AC Unit mounted on door -->
          <rect x="30" y="50" width="80" height="70" rx="4" fill="#0f172a"/>
          ${Array.from({ length: 5 }).map((_, i) => `
            <line x1="40" y1="${65 + i * 10}" x2="100" y2="${65 + i * 10}" stroke="#38bdf8" stroke-width="2"/>
          `).join('')}
          <text x="70" y="145" fill="#0f172a" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">36U OUTDOOR</text>
          <text x="70" y="160" fill="#0284c7" font-size="8" font-family="monospace" text-anchor="middle">1500W A/C UNIT</text>
        </g>
        <g transform="translate(430, 120)">
          <!-- 42U Server Rack with Glass Door -->
          <rect x="0" y="0" width="160" height="250" rx="6" fill="#0f172a" stroke="#334155" stroke-width="3"/>
          <rect x="15" y="15" width="130" height="220" rx="3" fill="#1e293b" opacity="0.8"/>
          <!-- Glass reflection / Server Bays inside -->
          ${Array.from({ length: 7 }).map((_, i) => `
            <rect x="25" y="${25 + i * 28}" width="110" height="20" rx="2" fill="#020617" stroke="#475569" stroke-width="1"/>
            <circle cx="35" cy="${35 + i * 28}" r="2" fill="#22c55e"/>
            <circle cx="45" cy="${35 + i * 28}" r="2" fill="#38bdf8"/>
          `).join('')}
          <text x="80" y="240" fill="#94a3b8" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">42U GLASS SERVER RACK</text>
        </g>
      `;
      break;

    case 'kiosk':
      deviceSvg = `
        <!-- Floor-Standing 55" Touch Signage Kiosk -->
        <g transform="translate(330, 120)">
          <!-- Base Plate -->
          <ellipse cx="70" cy="250" rx="90" ry="18" fill="#0f172a" stroke="#334155" stroke-width="3"/>
          <!-- Vertical Totem Body -->
          <path d="M 20 250 L 35 30 L 105 30 L 120 250 Z" fill="#1e293b" stroke="#475569" stroke-width="3"/>
          <!-- 55" Bezel and Screen -->
          <rect x="35" y="40" width="70" height="150" rx="4" fill="#020617" stroke="#38bdf8" stroke-width="2"/>
          <rect x="38" y="45" width="64" height="140" fill="#0f172a"/>
          <!-- UI Graphics on Screen -->
          <rect x="44" y="55" width="52" height="30" rx="2" fill="#0284c7"/>
          <text x="70" y="74" fill="#ffffff" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">DEYSLA</text>
          <rect x="44" y="95" width="24" height="24" rx="2" fill="#334155"/>
          <rect x="72" y="95" width="24" height="24" rx="2" fill="#334155"/>
          <rect x="44" y="125" width="24" height="24" rx="2" fill="#334155"/>
          <rect x="72" y="125" width="24" height="24" rx="2" fill="#334155"/>
          <circle cx="70" cy="168" r="6" fill="#38bdf8"/>
          <text x="70" y="225" fill="#f8fafc" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">55-INCH TOUCH KIOSK</text>
        </g>
      `;
      break;

    case 'tower-server':
      deviceSvg = `
        <!-- Dell PowerEdge T550 Tower Server -->
        <g transform="translate(320, 130)">
          <!-- Tower Chassis -->
          <rect x="0" y="0" width="160" height="230" rx="8" fill="#1e293b" stroke="#475569" stroke-width="3"/>
          <!-- Dell Front Bezel with Grille -->
          <rect x="15" y="15" width="130" height="200" rx="4" fill="#0f172a"/>
          <!-- Dell Badge -->
          <circle cx="80" cy="35" r="14" fill="#0284c7"/>
          <text x="80" y="40" fill="#ffffff" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">DELL</text>
          <!-- PowerEdge T550 Model Tag -->
          <rect x="30" y="60" width="100" height="16" rx="2" fill="#1e293b"/>
          <text x="80" y="72" fill="#38bdf8" font-size="8" font-family="monospace" text-anchor="middle">PowerEdge T550</text>
          <!-- 8x Hot-Swap 3.5" Drive Bays -->
          ${Array.from({ length: 4 }).map((_, i) => `
            <rect x="30" y="${85 + i * 25}" width="48" height="20" rx="2" fill="#020617" stroke="#64748b" stroke-width="1"/>
            <rect x="82" y="${85 + i * 25}" width="48" height="20" rx="2" fill="#020617" stroke="#64748b" stroke-width="1"/>
            <circle cx="72" cy="${95 + i * 25}" r="2" fill="#22c55e"/>
            <circle cx="124" cy="${95 + i * 25}" r="2" fill="#22c55e"/>
          `).join('')}
          <!-- Cooling Vent -->
          <rect x="30" y="190" width="100" height="15" fill="#1e293b"/>
        </g>
      `;
      break;

    case 'rack-server':
      deviceSvg = `
        <!-- 2U Enterprise GPU Server Chassis -->
        <rect x="90" y="200" width="620" height="110" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <!-- Rack Ears -->
        <rect x="70" y="190" width="20" height="130" rx="2" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
        <rect x="710" y="190" width="20" height="130" rx="2" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
        <!-- 24x 2.5" NVMe Drive Bays -->
        <g transform="translate(110, 215)">
          ${Array.from({ length: 12 }).map((_, i) => `
            <rect x="${i * 26}" y="0" width="22" height="38" rx="2" fill="#020617" stroke="#475569" stroke-width="1"/>
            <rect x="${i * 26}" y="42" width="22" height="38" rx="2" fill="#020617" stroke="#475569" stroke-width="1"/>
            <circle cx="${i * 26 + 11}" cy="30" r="2" fill="#22c55e"/>
            <circle cx="${i * 26 + 11}" cy="72" r="2" fill="#22c55e"/>
          `).join('')}
        </g>
        <!-- Power & Management Module -->
        <rect x="430" y="215" width="110" height="80" rx="3" fill="#0f172a" stroke="#64748b" stroke-width="1"/>
        <text x="485" y="240" fill="#818cf8" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">DUAL XEON</text>
        <text x="485" y="258" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">4x GPU BAY</text>
        <!-- Dual Redundant Hot-Swap PSUs -->
        <rect x="555" y="215" width="65" height="80" rx="3" fill="#020617" stroke="#22c55e" stroke-width="1.5"/>
        <rect x="625" y="215" width="65" height="80" rx="3" fill="#020617" stroke="#22c55e" stroke-width="1.5"/>
        <text x="622" y="305" fill="#22c55e" font-size="8" font-family="monospace" text-anchor="middle">1600W TITANIUM PSU</text>
      `;
      break;

    case 'fire-alarm':
      deviceSvg = `
        <!-- Fire Alarm Control Panel & Manual Call Point -->
        <g transform="translate(230, 140)">
          <!-- Addressable Control Panel (Red Cabinet) -->
          <rect x="0" y="0" width="160" height="220" rx="8" fill="#be123c" stroke="#881337" stroke-width="4"/>
          <!-- LCD Display -->
          <rect x="25" y="30" width="110" height="60" rx="4" fill="#0f172a" stroke="#f43f5e" stroke-width="1.5"/>
          <text x="80" y="55" fill="#4ade80" font-size="10" font-family="monospace" text-anchor="middle">SYSTEM NORMAL</text>
          <text x="80" y="72" fill="#f87171" font-size="9" font-family="monospace" text-anchor="middle">4 LOOPS • 0 ALARM</text>
          <!-- Controls & Keyswitch -->
          <circle cx="45" cy="120" r="8" fill="#0f172a"/>
          <circle cx="80" cy="120" r="8" fill="#0f172a"/>
          <circle cx="115" cy="120" r="8" fill="#0f172a"/>
          <text x="80" y="170" fill="#ffffff" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">FIRE ALARM</text>
        </g>
        <!-- Manual Call Point Break Glass -->
        <g transform="translate(450, 180)">
          <rect x="0" y="0" width="110" height="110" rx="8" fill="#e11d48" stroke="#9f1239" stroke-width="4"/>
          <!-- White Center with Glass Window -->
          <rect x="20" y="20" width="70" height="70" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
          <circle cx="55" cy="55" r="18" fill="#0f172a"/>
          <path d="M 45 55 L 65 55 M 55 45 L 55 65" stroke="#ef4444" stroke-width="4"/>
          <text x="55" y="102" fill="#ffffff" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">BREAK GLASS</text>
        </g>
      `;
      break;

    case 'fire-suppression':
      deviceSvg = `
        <!-- FM-200 Clean Agent Suppression Cylinders -->
        <g transform="translate(400, 240)">
          <!-- Left Cylinder -->
          <g transform="translate(-70, 0)">
            <path d="M -30 -100 C -30 -120 30 -120 30 -100 L 30 70 C 30 85 -30 85 -30 70 Z" fill="#be123c" stroke="#881337" stroke-width="3"/>
            <!-- Valve & Gauge -->
            <rect x="-8" y="-135" width="16" height="20" fill="#e2e8f0"/>
            <circle cx="0" cy="-145" r="10" fill="#0f172a" stroke="#e2e8f0" stroke-width="2"/>
            <line x1="0" y1="-145" x2="6" y2="-148" stroke="#22c55e" stroke-width="2"/>
            <text x="0" y="-10" fill="#ffffff" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">FM-200</text>
          </g>
          <!-- Right Cylinder -->
          <g transform="translate(70, 0)">
            <path d="M -30 -100 C -30 -120 30 -120 30 -100 L 30 70 C 30 85 -30 85 -30 70 Z" fill="#be123c" stroke="#881337" stroke-width="3"/>
            <!-- Valve & Gauge -->
            <rect x="-8" y="-135" width="16" height="20" fill="#e2e8f0"/>
            <circle cx="0" cy="-145" r="10" fill="#0f172a" stroke="#e2e8f0" stroke-width="2"/>
            <line x1="0" y1="-145" x2="6" y2="-148" stroke="#22c55e" stroke-width="2"/>
            <text x="0" y="-10" fill="#ffffff" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">HFC-227ea</text>
          </g>
          <!-- Manifold Discharge Pipe -->
          <line x1="-70" y1="-135" x2="70" y2="-135" stroke="#94a3b8" stroke-width="8"/>
          <line x1="0" y1="-135" x2="0" y2="-170" stroke="#94a3b8" stroke-width="8"/>
        </g>
      `;
      break;

    case 'hydrant':
      deviceSvg = `
        <!-- UL/FM Wet Barrel Pillar Fire Hydrant -->
        <g transform="translate(400, 240)">
          <!-- Ground Flange -->
          <ellipse cx="0" cy="80" rx="70" ry="15" fill="#475569" stroke="#1e293b" stroke-width="3"/>
          <!-- Barrel Body -->
          <path d="M -35 80 L -30 -70 C -30 -100 30 -100 30 -70 L 35 80 Z" fill="#e11d48" stroke="#9f1239" stroke-width="4"/>
          <!-- Top Bonnet Nut -->
          <polygon points="-12,-90 12,-90 18,-75 -18,-75" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
          <!-- 4.5\" Front Pumper Nozzle -->
          <rect x="-24" y="-30" width="48" height="30" rx="4" fill="#0f172a" stroke="#facc15" stroke-width="3"/>
          <circle cx="0" cy="-15" r="8" fill="#ca8a04"/>
          <!-- Left 2.5\" Hose Outlet -->
          <rect x="-55" y="-35" width="25" height="25" rx="3" fill="#facc15" stroke="#a16207" stroke-width="2"/>
          <!-- Right 2.5\" Hose Outlet -->
          <rect x="30" y="-35" width="25" height="25" rx="3" fill="#facc15" stroke="#a16207" stroke-width="2"/>
          <text x="0" y="40" fill="#ffffff" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">UL / FM</text>
          <text x="0" y="55" fill="#fef08a" font-size="9" font-family="monospace" text-anchor="middle">250 PSI</text>
        </g>
      `;
      break;

    default:
      // Generic high-tech enterprise hardware device rendering
      deviceSvg = `
        <rect x="140" y="180" width="520" height="140" rx="8" fill="#1e293b" stroke="#334155" stroke-width="3"/>
        <rect x="160" y="200" width="480" height="100" rx="4" fill="#0f172a"/>
        <circle cx="200" cy="250" r="16" fill="${p.themeColor}"/>
        <text x="250" y="245" fill="#ffffff" font-size="16" font-family="sans-serif" font-weight="bold">${title}</text>
        <text x="250" y="268" fill="${p.accentColor}" font-size="12" font-family="monospace">${subtitle}</text>
      `;
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background Gradient -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0b1329"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>

        <!-- Glow Effect -->
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${p.accentColor}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="${p.accentColor}" stop-opacity="0"/>
        </radialGradient>

        <!-- Card Shadow -->
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>

      <!-- Background with Blueprint Grid -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
      <g stroke="#334155" stroke-width="0.5" stroke-opacity="0.25">
        ${Array.from({ length: 17 }).map((_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${height}"/>`).join('')}
        ${Array.from({ length: 11 }).map((_, i) => `<line x1="0" y1="${i * 50}" x2="${width}" y2="${i * 50}"/>`).join('')}
      </g>

      <!-- Central Spotlight Glow -->
      <circle cx="${width / 2}" cy="${height / 2}" r="260" fill="url(#glow)"/>

      <!-- Header Elements -->
      <!-- Category Badge -->
      <rect x="40" y="32" width="${p.category.length * 9 + 30}" height="28" rx="6" fill="${p.themeColor}33" stroke="${p.themeColor}" stroke-width="1.5"/>
      <text x="55" y="51" fill="${p.accentColor}" font-size="11" font-family="sans-serif" font-weight="bold" letter-spacing="1">${category}</text>

      <!-- Verified Brand Badge -->
      <rect x="${width - 240}" y="32" width="200" height="28" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <circle cx="${width - 225}" cy="46" r="4" fill="#22c55e"/>
      <text x="${width - 212}" y="50" fill="#cbd5e1" font-size="10" font-family="monospace">${brand}</text>

      <!-- Product Title and Subtitle -->
      <text x="40" y="95" fill="#f8fafc" font-size="22" font-family="'Libre Baskerville', Georgia, serif" font-weight="bold">${title}</text>
      <text x="40" y="118" fill="#94a3b8" font-size="12" font-family="'IBM Plex Serif', serif">${subtitle}</text>

      <!-- Visual Device Diagram -->
      <g filter="url(#shadow)">
        ${deviceSvg}
      </g>

      <!-- Footer Specifications Bar -->
      <g transform="translate(40, ${height - 65})">
        <rect x="0" y="0" width="${width - 80}" height="45" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
        
        <g transform="translate(30, 27)">
          <circle cx="0" cy="-4" r="3.5" fill="${p.accentColor}"/>
          <text x="12" y="0" fill="#f1f5f9" font-size="11" font-family="monospace" font-weight="bold">${spec1}</text>
        </g>

        <g transform="translate(280, 27)">
          <circle cx="0" cy="-4" r="3.5" fill="${p.accentColor}"/>
          <text x="12" y="0" fill="#f1f5f9" font-size="11" font-family="monospace" font-weight="bold">${spec2}</text>
        </g>

        <g transform="translate(520, 27)">
          <circle cx="0" cy="-4" r="3.5" fill="${p.accentColor}"/>
          <text x="12" y="0" fill="#f1f5f9" font-size="11" font-family="monospace" font-weight="bold">${spec3}</text>
        </g>
      </g>
    </svg>
  `;
}

async function main() {
  console.log(`Generating ${products.length} high-resolution product images in ${outputDir}...`);
  for (const p of products) {
    const svgStr = generateSVG(p);
    const destWebp = path.join(outputDir, `${p.id}.webp`);
    await sharp(Buffer.from(svgStr))
      .webp({ quality: 92 })
      .toFile(destWebp);
    console.log(`Generated: ${p.id}.webp`);
  }
  console.log('All product images successfully generated!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
