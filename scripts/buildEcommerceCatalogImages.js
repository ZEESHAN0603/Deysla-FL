import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Load catalog items and products data
import { CATALOG_ITEMS } from '../src/data/productCatalogItems.ts';
import { PRODUCTS_DATA } from '../src/data/products.ts';

const catalogDir = path.resolve('public/assets/catalog');
const productsDir = path.resolve('public/assets/products');

if (!fs.existsSync(catalogDir)) fs.mkdirSync(catalogDir, { recursive: true });
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Category theme colors
const THEME_COLORS = {
  'networking': { primary: '#0284c7', accent: '#38bdf8', glow: '#0ea5e9' },
  'security-systems': { primary: '#059669', accent: '#34d399', glow: '#10b981' },
  'communications': { primary: '#7c3aed', accent: '#a78bfa', glow: '#8b5cf6' },
  'structured-cabling': { primary: '#d97706', accent: '#fbbf24', glow: '#f59e0b' },
  'digital-displays-and-kiosks': { primary: '#c026d3', accent: '#e879f9', glow: '#d946ef' },
  'servers-and-computing': { primary: '#4f46e5', accent: '#818cf8', glow: '#6366f1' },
  'industrial-automation': { primary: '#0891b2', accent: '#22d3ee', glow: '#06b6d4' },
  'fire-and-safety-systems': { primary: '#e11d48', accent: '#fb7185', glow: '#f43f5e' },
};

function getTheme(categoryId) {
  return THEME_COLORS[categoryId] || { primary: '#0284c7', accent: '#38bdf8', glow: '#0ea5e9' };
}

// Generate device SVG matching hardware type
function generateDeviceVisual(item, isProduct = false) {
  const name = (item.name || item.title || '').toLowerCase();
  const subcat = (item.subcategoryId || item.id || '').toLowerCase();
  const brand = (item.brand || '').toUpperCase();
  const badge = item.badge || '';

  // 1. SWITCHES
  if (subcat.includes('switch') || name.includes('switch')) {
    const isPoE = name.includes('poe') || badge.includes('poe');
    const isGigabit = name.includes('gigabit') || badge.includes('gigabit') || name.includes('24-port') || name.includes('16-port');
    const portCount = name.includes('5-port') ? 5 : name.includes('8-port') ? 8 : name.includes('16-port') ? 16 : 24;
    const isCompact = name.includes('compact') || name.includes('desktop') || portCount <= 8;

    if (isCompact) {
      return `
        <!-- Compact Desktop Switch Hardware -->
        <g transform="translate(0, 10)">
          <!-- Main Metal Housing -->
          <rect x="-170" y="-45" width="340" height="90" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2.5"/>
          <!-- Front Bezel Recess -->
          <rect x="-160" y="-35" width="320" height="70" rx="5" fill="#090d16" stroke="#334155" stroke-width="1.5"/>
          <!-- Brand & Model Label -->
          <text x="-148" y="-18" fill="#f8fafc" font-size="11" font-family="sans-serif" font-weight="900" letter-spacing="1">${escapeXml(brand.split('/')[0] || 'DEYSLA')}</text>
          <text x="-148" y="-5" fill="#94a3b8" font-size="8" font-family="monospace">${portCount}P GIGABIT METAL</text>
          
          <!-- RJ45 Ports Matrix -->
          <g transform="translate(-50, -15)">
            ${Array.from({ length: Math.min(portCount, 8) }).map((_, i) => `
              <g transform="translate(${i * 24}, 0)">
                <!-- Port Housing -->
                <rect x="0" y="0" width="18" height="22" rx="2" fill="#020617" stroke="#64748b" stroke-width="1.2"/>
                <rect x="3" y="10" width="12" height="10" rx="1" fill="#334155"/>
                <!-- Gold Pins -->
                <line x1="6" y1="12" x2="6" y2="17" stroke="#eab308" stroke-width="1"/>
                <line x1="9" y1="12" x2="9" y2="17" stroke="#eab308" stroke-width="1"/>
                <line x1="12" y1="12" x2="12" y2="17" stroke="#eab308" stroke-width="1"/>
                <!-- Status LED -->
                <circle cx="9" cy="-6" r="2.5" fill="${isPoE && i % 2 === 0 ? '#38bdf8' : '#22c55e'}"/>
                <circle cx="9" cy="-6" r="4.5" fill="${isPoE && i % 2 === 0 ? '#38bdf8' : '#22c55e'}" opacity="0.4"/>
              </g>
            `).join('')}
          </g>
          <!-- Power LED -->
          <circle cx="140" cy="-15" r="3" fill="#22c55e"/>
          <text x="140" y="2" fill="#64748b" font-size="7" font-family="monospace" text-anchor="middle">PWR</text>
        </g>
      `;
    }

    // 19" Rackmount 1U Enterprise Switch
    return `
      <!-- 19-Inch 1U Enterprise Rackmount Switch Hardware -->
      <g transform="translate(0, 10)">
        <!-- Left & Right Rackmount Ears -->
        <path d="M -235 -30 L -215 -30 L -215 30 L -235 30 Z" fill="#334155" stroke="#1e293b" stroke-width="1.5"/>
        <circle cx="-225" cy="-15" r="4" fill="#090d16" stroke="#64748b" stroke-width="1"/>
        <circle cx="-225" cy="15" r="4" fill="#090d16" stroke="#64748b" stroke-width="1"/>
        
        <path d="M 235 -30 L 215 -30 L 215 30 L 235 30 Z" fill="#334155" stroke="#1e293b" stroke-width="1.5"/>
        <circle cx="225" cy="-15" r="4" fill="#090d16" stroke="#64748b" stroke-width="1"/>
        <circle cx="225" cy="15" r="4" fill="#090d16" stroke="#64748b" stroke-width="1"/>

        <!-- Main Chassis 1U Body -->
        <rect x="-215" y="-30" width="430" height="60" rx="3" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <!-- Front Panel Inset -->
        <rect x="-205" y="-24" width="410" height="48" rx="2" fill="#020617" stroke="#1e293b" stroke-width="1"/>
        
        <!-- Brand & Model Stamp -->
        <text x="-195" y="-6" fill="#f8fafc" font-size="11" font-family="sans-serif" font-weight="900" letter-spacing="1.5">${escapeXml(brand.split('/')[0] || 'CISCO CATALYST')}</text>
        <text x="-195" y="8" fill="#38bdf8" font-size="8" font-family="monospace">24G + 4x 10G SFP+ PoE+</text>

        <!-- 24-Port High-Density RJ45 Block (2 rows of 12) -->
        <g transform="translate(-75, -18)">
          ${Array.from({ length: 12 }).map((_, i) => `
            <g transform="translate(${i * 15.5}, 0)">
              <!-- Upper Port -->
              <rect x="0" y="0" width="12" height="15" rx="1.5" fill="#0f172a" stroke="#64748b" stroke-width="0.8"/>
              <line x1="4" y1="7" x2="4" y2="12" stroke="#eab308" stroke-width="0.8"/>
              <line x1="8" y1="7" x2="8" y2="12" stroke="#eab308" stroke-width="0.8"/>
              <circle cx="6" cy="-3" r="1.5" fill="#22c55e"/>
              
              <!-- Lower Port -->
              <rect x="0" y="19" width="12" height="15" rx="1.5" fill="#0f172a" stroke="#64748b" stroke-width="0.8"/>
              <line x1="4" y1="21" x2="4" y2="26" stroke="#eab308" stroke-width="0.8"/>
              <line x1="8" y1="21" x2="8" y2="26" stroke="#eab308" stroke-width="0.8"/>
              <circle cx="6" cy="36" r="1.5" fill="${i % 3 === 0 ? '#38bdf8' : '#22c55e'}"/>
            </g>
          `).join('')}
        </g>

        <!-- 4x 10G SFP+ Uplink Optical Cages -->
        <g transform="translate(130, -12)">
          ${[0, 1, 2, 3].map((idx) => `
            <g transform="translate(${idx * 16}, 0)">
              <rect x="0" y="0" width="13" height="24" rx="2" fill="#1e293b" stroke="#94a3b8" stroke-width="1"/>
              <rect x="2" y="4" width="9" height="16" fill="#020617"/>
              <circle cx="6.5" cy="-5" r="1.5" fill="#38bdf8"/>
            </g>
          `).join('')}
        </g>
      </g>
    `;
  }

  // 2. ROUTERS & CPE
  if (subcat.includes('router') || name.includes('router') || name.includes('cpe')) {
    const is5G = name.includes('5g') || name.includes('cpe');
    if (is5G) {
      return `
        <!-- Enterprise 5G CPE Gateway Hardware -->
        <g transform="translate(0, 5)">
          <!-- Cylinder / Tower Chassis -->
          <rect x="-65" y="-105" width="130" height="210" rx="30" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
          <!-- Status Light Ring -->
          <ellipse cx="0" cy="-90" rx="50" ry="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
          <!-- 5G Signal Strength Indicators -->
          <circle cx="0" cy="-40" r="18" fill="#0f172a"/>
          <text x="0" y="-34" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="900" text-anchor="middle">5G</text>
          
          <g transform="translate(-30, 0)">
            <rect x="10" y="15" width="4" height="10" rx="1" fill="#22c55e"/>
            <rect x="18" y="10" width="4" height="15" rx="1" fill="#22c55e"/>
            <rect x="26" y="5" width="4" height="20" rx="1" fill="#22c55e"/>
            <rect x="34" y="0" width="4" height="25" rx="1" fill="#22c55e"/>
            <rect x="42" y="-5" width="4" height="30" rx="1" fill="#22c55e"/>
          </g>

          <!-- Huawei / Brand Mark -->
          <text x="0" y="65" fill="#475569" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(brand.split('/')[0] || 'HUAWEI 5G')}</text>
          <!-- Power / Wi-Fi LEDs -->
          <circle cx="-15" cy="85" r="2.5" fill="#22c55e"/>
          <circle cx="15" cy="85" r="2.5" fill="#38bdf8"/>
        </g>
      `;
    }

    // Enterprise Edge Router with 4 Antennas
    return `
      <!-- Enterprise VPN Dual-WAN Router Hardware with Antennas -->
      <g transform="translate(0, 20)">
        <!-- 4 Adjustable Antennas -->
        <line x1="-120" y1="-30" x2="-145" y2="-115" stroke="#334155" stroke-width="6" stroke-linecap="round"/>
        <line x1="-60" y1="-30" x2="-70" y2="-125" stroke="#334155" stroke-width="6" stroke-linecap="round"/>
        <line x1="60" y1="-30" x2="70" y2="-125" stroke="#334155" stroke-width="6" stroke-linecap="round"/>
        <line x1="120" y1="-30" x2="145" y2="-115" stroke="#334155" stroke-width="6" stroke-linecap="round"/>

        <!-- Main Body Chassis -->
        <rect x="-160" y="-30" width="320" height="75" rx="12" fill="#0f172a" stroke="#475569" stroke-width="2.5"/>
        <rect x="-145" y="-20" width="290" height="55" rx="6" fill="#020617"/>
        
        <!-- Brand & Model -->
        <text x="-125" y="-3" fill="#f8fafc" font-size="12" font-family="sans-serif" font-weight="900" letter-spacing="1">${escapeXml(brand.split('/')[0] || 'CISCO 897')}</text>
        <text x="-125" y="12" fill="#38bdf8" font-size="8" font-family="monospace">DUAL-WAN VPN ROUTER</text>

        <!-- Ports & Indicators -->
        <g transform="translate(10, -10)">
          <!-- Dual WAN Ports -->
          <rect x="0" y="0" width="16" height="20" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="8" y="28" fill="#38bdf8" font-size="6" font-family="monospace" text-anchor="middle">WAN1</text>
          <rect x="22" y="0" width="16" height="20" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="30" y="28" fill="#38bdf8" font-size="6" font-family="monospace" text-anchor="middle">WAN2</text>
          
          <!-- 4x LAN Gigabit Ports -->
          <rect x="46" y="0" width="14" height="20" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
          <rect x="64" y="0" width="14" height="20" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
          <rect x="82" y="0" width="14" height="20" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
          <rect x="100" y="0" width="14" height="20" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
        </g>
      </g>
    `;
  }

  // 3. WIRELESS APs & BRIDGES
  if (subcat.includes('wireless') || name.includes('access point') || name.includes('wi-fi') || name.includes('bridge')) {
    if (name.includes('bridge') || name.includes('outdoor')) {
      return `
        <!-- High-Gain Wireless Bridge / Dish Hardware -->
        <g transform="translate(0, 10)">
          <!-- Parabolic White Reflector Dish -->
          <ellipse cx="0" cy="0" rx="110" ry="110" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
          <!-- Inner Feed Horn Assembly -->
          <circle cx="0" cy="0" r="50" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="0" cy="0" r="25" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <text x="0" y="4" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">5GHz P2P</text>
          <!-- Mounting Collar -->
          <rect x="-18" y="105" width="36" height="25" fill="#475569" stroke="#334155" stroke-width="2"/>
        </g>
      `;
    }

    // Enterprise Ceiling-Mount Round / Square Wi-Fi 6 AP
    return `
      <!-- Enterprise Ceiling-Mount Wi-Fi 6 Access Point Hardware -->
      <g transform="translate(0, 5)">
        <!-- Outer Sleek Aerodynamic Body -->
        <rect x="-110" y="-110" width="220" height="220" rx="45" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
        <rect x="-95" y="-95" width="190" height="190" rx="35" fill="#f8fafc" stroke="#f1f5f9" stroke-width="1"/>
        
        <!-- Subtle Brand Inset -->
        <circle cx="0" cy="-20" r="32" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
        <text x="0" y="-16" fill="#0f172a" font-size="10" font-family="sans-serif" font-weight="900" letter-spacing="1" text-anchor="middle">${escapeXml(brand.split('/')[0] || 'ARUBA')}</text>
        <text x="0" y="-3" fill="#64748b" font-size="7" font-family="monospace" text-anchor="middle">WI-FI 6 AP</text>

        <!-- Center Illuminated Status LED Arc -->
        <path d="M -25 35 A 25 25 0 0 1 25 35" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round"/>
        <path d="M -25 35 A 25 25 0 0 1 25 35" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" opacity="0.3"/>
      </g>
    `;
  }

  // 4. CCTV CAMERAS (Dome, Bullet, PTZ)
  if (subcat.includes('cctv') || name.includes('camera') || name.includes('dome') || name.includes('bullet')) {
    if (name.includes('bullet')) {
      return `
        <!-- Commercial 4K Infrared Bullet IP Camera Hardware -->
        <g transform="translate(-15, 10)">
          <!-- Wall Mounting Base & Articulated Arm -->
          <rect x="-150" y="-25" width="25" height="50" rx="4" fill="#334155" stroke="#1e293b" stroke-width="2"/>
          <line x1="-125" y1="0" x2="-80" y2="0" stroke="#475569" stroke-width="14" stroke-linecap="round"/>
          <circle cx="-80" cy="0" r="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
          
          <!-- Cylindrical Camera Barrel Body -->
          <rect x="-70" y="-45" width="190" height="90" rx="15" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
          <!-- Sunshield Sunhood -->
          <path d="M -60 -52 L 130 -52 L 115 -45 L -60 -45 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
          
          <!-- Front Optical Lens Face -->
          <rect x="110" y="-40" width="20" height="80" rx="6" fill="#090d16" stroke="#475569" stroke-width="2"/>
          <!-- Dark Glass Core & Lens Reflection -->
          <circle cx="120" cy="0" r="22" fill="#020617" stroke="#334155" stroke-width="2"/>
          <circle cx="120" cy="0" r="14" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
          <!-- Lens Glare Highlight -->
          <ellipse cx="116" cy="-4" rx="4" ry="2" fill="#ffffff" opacity="0.8"/>
          <!-- IR LED Array Ring -->
          ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
            const rad = (deg * Math.PI) / 180;
            const x = 120 + Math.cos(rad) * 18;
            const y = 0 + Math.sin(rad) * 18;
            return `<circle cx="${x}" cy="${y}" r="1.5" fill="#ef4444"/>`;
          }).join('')}

          <!-- Brand Logo Text -->
          <text x="-10" y="5" fill="#0f172a" font-size="11" font-family="sans-serif" font-weight="900" letter-spacing="1">${escapeXml(brand.split('/')[0] || 'HIKVISION')}</text>
          <text x="-10" y="20" fill="#64748b" font-size="8" font-family="monospace">4K DARKFIGHTER</text>
        </g>
      `;
    }

    // Vandal-Resistant Optical Dome Camera
    return `
      <!-- Vandal-Resistant 4K Dome IP Camera Hardware -->
      <g transform="translate(0, 15)">
        <!-- Ceiling Base Flange -->
        <ellipse cx="0" cy="-55" rx="140" ry="20" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/>
        <!-- Metal Cast Lower Ring Housing -->
        <path d="M -135 -55 C -135 -20 135 -20 135 -55 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
        <text x="0" y="-30" fill="#0f172a" font-size="11" font-family="sans-serif" font-weight="900" letter-spacing="1" text-anchor="middle">${escapeXml(brand.split('/')[0] || 'HIKVISION DOME')}</text>

        <!-- Transparent Optical Polycarbonate Smoked Dome Bubble -->
        <path d="M -95 -25 C -95 90 95 90 95 -25 Z" fill="#0f172a" stroke="#475569" stroke-width="3"/>
        
        <!-- Internal Motorized Gimbal & Optical Lens Assembly -->
        <circle cx="0" cy="25" r="42" fill="#020617" stroke="#1e293b" stroke-width="2"/>
        <circle cx="0" cy="25" r="26" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="0" cy="25" r="14" fill="#090d16" stroke="#22c55e" stroke-width="1"/>
        <!-- Optical Reflection Arc on Lens -->
        <path d="M -15 15 A 18 18 0 0 1 12 12" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
      </g>
    `;
  }

  // 5. ACCESS CONTROL & BIOMETRICS
  if (subcat.includes('access-control') || name.includes('biometric') || name.includes('fingerprint') || name.includes('card reader')) {
    return `
      <!-- Wall-Mounted Biometric Fingerprint & Time Attendance Terminal Hardware -->
      <g transform="translate(0, 10)">
        <!-- Main Dark Ergonomic Wall Housing -->
        <rect x="-85" y="-120" width="170" height="235" rx="20" fill="#0f172a" stroke="#475569" stroke-width="3"/>
        <!-- Front Beveled Bezel Face -->
        <rect x="-75" y="-110" width="150" height="215" rx="14" fill="#020617" stroke="#1e293b" stroke-width="1.5"/>
        
        <!-- 3.5\" TFT Color LCD Display Screen -->
        <rect x="-60" y="-95" width="120" height="85" rx="6" fill="#0b1329" stroke="#334155" stroke-width="1.5"/>
        <!-- Display Screen Graphics (Clock & Status) -->
        <text x="0" y="-60" fill="#f8fafc" font-size="20" font-family="monospace" font-weight="bold" text-anchor="middle">08:45:22</text>
        <text x="0" y="-40" fill="#38bdf8" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">VERIFIED OK</text>
        <rect x="-45" y="-28" width="90" height="10" rx="3" fill="#22c55e" opacity="0.3"/>
        <text x="0" y="-20" fill="#4ade80" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">ACCESS GRANTED</text>

        <!-- Capacitive Touch Numeric Keypad -->
        <g transform="translate(-45, 5)">
          ${[0, 1, 2, 3].map(row => `
            <g transform="translate(0, ${row * 15})">
              <circle cx="10" cy="0" r="5" fill="#1e293b" stroke="#475569" stroke-width="1"/>
              <circle cx="45" cy="0" r="5" fill="#1e293b" stroke="#475569" stroke-width="1"/>
              <circle cx="80" cy="0" r="5" fill="#1e293b" stroke="#475569" stroke-width="1"/>
            </g>
          `).join('')}
        </g>

        <!-- Optical Fingerprint Sensor Prism Glass (NO human hand, pure prism hardware!) -->
        <g transform="translate(0, 75)">
          <rect x="-24" y="-12" width="48" height="24" rx="5" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
          <ellipse cx="0" cy="0" rx="18" ry="8" fill="#38bdf8" opacity="0.6"/>
          <!-- Internal Optical Sensor Grid -->
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#ffffff" stroke-width="1" opacity="0.8"/>
        </g>
      </g>
    `;
  }

  // 6. SERVERS (Rack & Tower)
  if (subcat.includes('server') || name.includes('server')) {
    const isTower = name.includes('tower') || subcat.includes('tower');
    if (isTower) {
      return `
        <!-- Enterprise Dell PowerEdge Tower Server Hardware -->
        <g transform="translate(0, 5)">
          <!-- Heavy-Duty Tower Chassis -->
          <rect x="-70" y="-120" width="140" height="240" rx="10" fill="#0f172a" stroke="#475569" stroke-width="3"/>
          <!-- Honeycomb Front Bezel Grille -->
          <rect x="-60" y="-110" width="120" height="220" rx="6" fill="#020617" stroke="#1e293b" stroke-width="1.5"/>
          
          <!-- Silver Dell / OEM Badge -->
          <circle cx="0" cy="-90" r="14" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="0" y="-86" fill="#f8fafc" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">${escapeXml(brand.split(' ')[0] || 'DELL')}</text>
          
          <!-- 8x 3.5\" Hot-Swap Hard Drive Trays -->
          <g transform="translate(-48, -60)">
            ${Array.from({ length: 4 }).map((_, r) => `
              <g transform="translate(0, ${r * 28})">
                <rect x="0" y="0" width="96" height="22" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1"/>
                <rect x="6" y="5" width="60" height="12" fill="#090d16"/>
                <text x="12" y="14" fill="#94a3b8" font-size="7" font-family="monospace">SAS 12G [BAY ${r + 1}]</text>
                <!-- Drive Status LED -->
                <circle cx="82" cy="11" r="2.5" fill="#22c55e"/>
              </g>
            `).join('')}
          </g>

          <!-- Power Button & Front I/O -->
          <circle cx="42" cy="75" r="4" fill="#38bdf8"/>
          <rect x="-48" y="70" width="16" height="8" rx="1.5" fill="#334155"/>
        </g>
      `;
    }

    // 2U Enterprise Rackmount Server (Dual Xeon, Hot-Swap Trays)
    return `
      <!-- 2U Enterprise Rackmount Server Chassis Hardware -->
      <g transform="translate(0, 10)">
        <!-- Left & Right Rack Ears with Locking Screws -->
        <rect x="-225" y="-45" width="20" height="90" rx="3" fill="#334155" stroke="#1e293b" stroke-width="2"/>
        <circle cx="-215" cy="-25" r="5" fill="#090d16" stroke="#94a3b8" stroke-width="1.5"/>
        <circle cx="-215" cy="25" r="5" fill="#090d16" stroke="#94a3b8" stroke-width="1.5"/>
        
        <rect x="205" y="-45" width="20" height="90" rx="3" fill="#334155" stroke="#1e293b" stroke-width="2"/>
        <circle cx="215" cy="-25" r="5" fill="#090d16" stroke="#94a3b8" stroke-width="1.5"/>
        <circle cx="215" cy="25" r="5" fill="#090d16" stroke="#94a3b8" stroke-width="1.5"/>

        <!-- Main 2U Chassis Frame -->
        <rect x="-205" y="-45" width="410" height="90" rx="4" fill="#0f172a" stroke="#475569" stroke-width="2.5"/>
        
        <!-- Drive Bay Matrix (12x 3.5\" or 24x 2.5\" Caddies) -->
        <g transform="translate(-195, -35)">
          ${Array.from({ length: 8 }).map((_, i) => `
            <g transform="translate(${i * 44}, 0)">
              <!-- Upper Drive Bay -->
              <rect x="0" y="0" width="40" height="32" rx="2" fill="#020617" stroke="#334155" stroke-width="1"/>
              <rect x="4" y="4" width="24" height="24" fill="#1e293b"/>
              <line x1="8" y1="10" x2="24" y2="10" stroke="#475569" stroke-width="1.5"/>
              <line x1="8" y1="16" x2="24" y2="16" stroke="#475569" stroke-width="1.5"/>
              <!-- Drive Activity LED -->
              <circle cx="33" cy="10" r="1.8" fill="#22c55e"/>
              <circle cx="33" cy="22" r="1.8" fill="#38bdf8"/>
              
              <!-- Lower Drive Bay -->
              <rect x="0" y="38" width="40" height="32" rx="2" fill="#020617" stroke="#334155" stroke-width="1"/>
              <rect x="4" y="42" width="24" height="24" fill="#1e293b"/>
              <circle cx="33" cy="48" r="1.8" fill="#22c55e"/>
            </g>
          `).join('')}
        </g>

        <!-- Dell PowerEdge Brand Badge & System Health LED -->
        <rect x="155" y="-35" width="40" height="70" rx="3" fill="#020617" stroke="#1e293b" stroke-width="1"/>
        <text x="175" y="-15" fill="#f8fafc" font-size="7" font-family="sans-serif" font-weight="900" text-anchor="middle">DELL</text>
        <circle cx="175" cy="5" r="3.5" fill="#38bdf8"/>
        <text x="175" y="22" fill="#94a3b8" font-size="6" font-family="monospace" text-anchor="middle">iDRAC9</text>
      </g>
    `;
  }

  // 7. FIREWALL APPLIANCES
  if (subcat.includes('cybersecurity') || name.includes('firewall') || name.includes('fortinet')) {
    return `
      <!-- Fortinet FortiGate Enterprise Next-Gen Firewall Hardware -->
      <g transform="translate(0, 15)">
        <rect x="-190" y="-35" width="380" height="70" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
        <rect x="-180" y="-25" width="360" height="50" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
        
        <!-- Red Fortinet Brand Bar & Logo -->
        <rect x="-170" y="-12" width="12" height="24" rx="2" fill="#ef4444"/>
        <text x="-150" y="3" fill="#0f172a" font-size="12" font-family="sans-serif" font-weight="900" letter-spacing="1">FORTINET</text>
        <text x="-150" y="16" fill="#64748b" font-size="7" font-family="monospace">FortiGate Enterprise NGFW</text>

        <!-- Ports & SFP Slots -->
        <g transform="translate(-10, -15)">
          <!-- Console & WAN Ports -->
          <rect x="0" y="0" width="16" height="22" rx="2" fill="#0f172a" stroke="#ef4444" stroke-width="1"/>
          <text x="8" y="30" fill="#ef4444" font-size="6" font-family="monospace" text-anchor="middle">WAN1</text>
          
          <rect x="22" y="0" width="16" height="22" rx="2" fill="#0f172a" stroke="#ef4444" stroke-width="1"/>
          <text x="30" y="30" fill="#ef4444" font-size="6" font-family="monospace" text-anchor="middle">WAN2</text>
          
          <!-- 8x Internal Switch Ports -->
          ${Array.from({ length: 6 }).map((_, i) => `
            <g transform="translate(${48 + i * 18}, 0)">
              <rect x="0" y="0" width="14" height="22" rx="2" fill="#0f172a" stroke="#64748b" stroke-width="1"/>
              <circle cx="7" cy="-4" r="1.5" fill="#22c55e"/>
            </g>
          `).join('')}

          <!-- SFP+ High-Speed Ports -->
          <rect x="160" y="0" width="14" height="24" rx="2" fill="#334155" stroke="#38bdf8" stroke-width="1"/>
          <rect x="178" y="0" width="14" height="24" rx="2" fill="#334155" stroke="#38bdf8" stroke-width="1"/>
        </g>
      </g>
    `;
  }

  // 8. STRUCTURED CABLING & PATCH PANELS
  if (subcat.includes('patch-panel') || name.includes('patch panel')) {
    return `
      <!-- 24-Port 1U Shielded Patch Panel Hardware -->
      <g transform="translate(0, 15)">
        <!-- 19-Inch Steel Body -->
        <rect x="-215" y="-25" width="430" height="50" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <rect x="-195" y="-18" width="390" height="36" fill="#090d16" stroke="#334155" stroke-width="1"/>
        
        <!-- 24x RJ45 Shielded Keystone Ports -->
        <g transform="translate(-185, -10)">
          ${Array.from({ length: 24 }).map((_, i) => `
            <g transform="translate(${i * 15.5}, 0)">
              <rect x="0" y="0" width="12" height="18" rx="1.5" fill="#1e293b" stroke="#94a3b8" stroke-width="1"/>
              <rect x="2" y="4" width="8" height="10" fill="#020617"/>
              <text x="6" y="24" fill="#94a3b8" font-size="5" font-family="monospace" text-anchor="middle">${i + 1}</text>
            </g>
          `).join('')}
        </g>
      </g>
    `;
  }

  // 9. CABLES (Copper, Fiber, Spools)
  if (subcat.includes('cable') || name.includes('cable') || name.includes('patch cord') || name.includes('fiber')) {
    const isFiber = subcat.includes('fiber') || name.includes('fiber');
    const color = isFiber ? (name.includes('orange') ? '#ea580c' : '#eab308') : (name.includes('blue') ? '#0284c7' : '#ffffff');

    return `
      <!-- Professional Cable Reel / Coiled Patch Cable Hardware -->
      <g transform="translate(0, 10)">
        <!-- Outer Coiled Loop -->
        <ellipse cx="0" cy="0" rx="120" ry="70" fill="none" stroke="${color}" stroke-width="16"/>
        <ellipse cx="0" cy="0" rx="100" ry="55" fill="none" stroke="${color}" stroke-width="14" opacity="0.85"/>
        <ellipse cx="0" cy="0" rx="80" ry="42" fill="none" stroke="${color}" stroke-width="12" opacity="0.7"/>

        <!-- Velcro Cable Tie -->
        <rect x="-15" y="-75" width="30" height="15" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="0" y="-65" fill="#38bdf8" font-size="6" font-family="sans-serif" font-weight="bold" text-anchor="middle">DEYSLA</text>
        
        <!-- Molded Connectors (RJ45 or LC Duplex) -->
        <g transform="translate(60, -30)">
          <rect x="0" y="0" width="36" height="18" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
          <rect x="24" y="3" width="16" height="12" rx="1" fill="#eab308" opacity="0.8"/>
          <line x1="28" y1="5" x2="28" y2="13" stroke="#000000" stroke-width="1"/>
          <line x1="32" y1="5" x2="32" y2="13" stroke="#000000" stroke-width="1"/>
          <line x1="36" y1="5" x2="36" y2="13" stroke="#000000" stroke-width="1"/>
        </g>
      </g>
    `;
  }

  // 10. UPS & POWER
  if (subcat.includes('ups') || subcat.includes('pdu') || name.includes('ups') || name.includes('power')) {
    return `
      <!-- Online Double-Conversion UPS Battery Backup Hardware with LCD -->
      <g transform="translate(0, 10)">
        <!-- Tower Chassis -->
        <rect x="-80" y="-115" width="160" height="230" rx="12" fill="#0f172a" stroke="#475569" stroke-width="3"/>
        <rect x="-70" y="-105" width="140" height="210" rx="8" fill="#020617"/>
        
        <!-- Brand & Model -->
        <text x="-50" y="-80" fill="#f8fafc" font-size="12" font-family="sans-serif" font-weight="900" letter-spacing="1">${escapeXml(brand.split('/')[0] || 'APC SMART-UPS')}</text>
        <text x="-50" y="-68" fill="#94a3b8" font-size="8" font-family="monospace">1500VA / 230V PURE SINE</text>

        <!-- Blue Backlit Digital LCD Screen -->
        <rect x="-55" y="-50" width="110" height="65" rx="6" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
        <text x="0" y="-30" fill="#ffffff" font-size="14" font-family="monospace" font-weight="bold" text-anchor="middle">230 V IN</text>
        <text x="0" y="-10" fill="#38bdf8" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">100% BATT</text>
        
        <!-- Status LEDs -->
        <circle cx="-35" cy="35" r="4" fill="#22c55e"/>
        <circle cx="0" cy="35" r="4" fill="#38bdf8"/>
        <circle cx="35" cy="35" r="4" fill="#eab308"/>

        <!-- Cooling Intake Vent Grille -->
        <g transform="translate(-50, 55)">
          ${Array.from({ length: 6 }).map((_, i) => `
            <line x1="0" y1="${i * 6}" x2="100" y2="${i * 6}" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
          `).join('')}
        </g>
      </g>
    `;
  }

  // 11. DIGITAL SIGNAGE & DISPLAYS (Isolated hardware, NO people!)
  if (subcat.includes('display') || subcat.includes('signage') || subcat.includes('kiosk') || name.includes('kiosk') || name.includes('display')) {
    return `
      <!-- Commercial Freestanding Digital Signage Totem Hardware (Pure Hardware Device, NO people) -->
      <g transform="translate(0, 10)">
        <!-- Heavy Tempered Glass & Steel Floor Pedestal Base -->
        <ellipse cx="0" cy="110" rx="90" ry="18" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        
        <!-- Vertical Curved Totem Enclosure -->
        <rect x="-55" y="-120" width="110" height="230" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2.5"/>
        
        <!-- 4K Ultra-HD Glass Display Surface -->
        <rect x="-46" y="-105" width="92" height="165" rx="6" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
        <!-- Display Graphic (High-Tech Enterprise UI, NO humans!) -->
        <rect x="-40" y="-98" width="80" height="150" fill="#090d16"/>
        <!-- Tech Interface Curves & Nodes -->
        <path d="M -30 -60 Q 0 -30 30 -70" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="30" cy="-70" r="4" fill="#22c55e"/>
        <text x="0" y="-10" fill="#f8fafc" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">DEYSLA</text>
        <text x="0" y="5" fill="#38bdf8" font-size="7" font-family="monospace" text-anchor="middle">DIGITAL DISPLAY</text>
        
        <rect x="-30" y="20" width="60" height="18" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
        <text x="0" y="32" fill="#38bdf8" font-size="7" font-family="monospace" text-anchor="middle">TOUCH SCREEN</text>
      </g>
    `;
  }

  // 12. PRINTERS (Thermal & Multifunction)
  if (subcat.includes('printer') || name.includes('printer')) {
    return `
      <!-- Industrial Thermal Label / POS Receipt Printer Hardware -->
      <g transform="translate(0, 10)">
        <rect x="-90" y="-60" width="180" height="130" rx="14" fill="#1e293b" stroke="#475569" stroke-width="3"/>
        <rect x="-80" y="-50" width="160" height="110" rx="8" fill="#0f172a"/>
        
        <!-- Front Label Exit Slot & Cutter Bar -->
        <rect x="-60" y="-35" width="120" height="12" rx="2" fill="#020617" stroke="#64748b" stroke-width="1"/>
        <!-- Printed Barcode Label Ejecting -->
        <rect x="-45" y="-30" width="90" height="35" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        <!-- Barcode Lines -->
        <g transform="translate(-35, -22)">
          ${[2, 6, 9, 15, 18, 22, 28, 35, 42, 48, 55, 62].map(x => `
            <line x1="${x}" y1="0" x2="${x}" y2="18" stroke="#000000" stroke-width="${x % 2 === 0 ? 2 : 1}"/>
          `).join('')}
        </g>
        
        <!-- Controls & Feed Button -->
        <circle cx="55" cy="30" r="8" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
        <text x="55" y="33" fill="#ffffff" font-size="6" font-family="monospace" font-weight="bold" text-anchor="middle">FEED</text>
      </g>
    `;
  }

  // 13. FIRE AND SAFETY (Panel, Detector, Hydrant)
  if (subcat.includes('fire') || name.includes('fire') || name.includes('detector') || name.includes('alarm')) {
    if (name.includes('panel')) {
      return `
        <!-- Addressable Fire Alarm Control Panel Hardware -->
        <g transform="translate(0, 10)">
          <!-- Red Steel Enclosure -->
          <rect x="-95" y="-120" width="190" height="240" rx="10" fill="#991b1b" stroke="#dc2626" stroke-width="3"/>
          <rect x="-85" y="-110" width="170" height="220" rx="6" fill="#7f1d1d"/>
          
          <!-- Keylock -->
          <circle cx="65" cy="-85" r="6" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>
          
          <!-- 4-Line Backlit Emergency LCD -->
          <rect x="-65" y="-75" width="130" height="50" rx="4" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
          <text x="0" y="-55" fill="#000000" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">SYSTEM NORMAL</text>
          <text x="0" y="-40" fill="#000000" font-size="9" font-family="monospace" text-anchor="middle">0 FAULTS / 0 ALARMS</text>
          
          <!-- Status Indicators (Normal, Alarm, Trouble, Supervisory) -->
          <g transform="translate(-50, -5)">
            <circle cx="0" cy="0" r="5" fill="#22c55e"/>
            <text x="12" y="3" fill="#ffffff" font-size="7" font-family="sans-serif">POWER</text>
            
            <circle cx="0" cy="20" r="5" fill="#ef4444"/>
            <text x="12" y="23" fill="#ffffff" font-size="7" font-family="sans-serif">FIRE ALARM</text>
            
            <circle cx="0" cy="40" r="5" fill="#f59e0b"/>
            <text x="12" y="43" fill="#ffffff" font-size="7" font-family="sans-serif">TROUBLE</text>
          </g>
        </g>
      `;
    }

    // Optical Smoke Detector Head
    return `
      <!-- Optical Smoke Detector Head Hardware -->
      <g transform="translate(0, 15)">
        <!-- Ceiling Base Flange -->
        <ellipse cx="0" cy="-30" rx="105" ry="35" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
        <!-- Main Chamber Cover -->
        <path d="M -90 -30 C -90 60 90 60 90 -30 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2.5"/>
        <!-- Smoke Ingress Vents Ring -->
        <ellipse cx="0" cy="15" rx="55" ry="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <!-- Red Pulsing Status LED -->
        <circle cx="0" cy="35" r="4.5" fill="#ef4444"/>
        <circle cx="0" cy="35" r="8" fill="#ef4444" opacity="0.4"/>
      </g>
    `;
  }

  // 14. DEFAULT HIGH-TECH HARDWARE CHASSIS
  return `
    <!-- Professional Enterprise Hardware Appliance Chassis -->
    <g transform="translate(0, 15)">
      <rect x="-180" y="-45" width="360" height="90" rx="10" fill="#0f172a" stroke="#334155" stroke-width="3"/>
      <rect x="-165" y="-32" width="330" height="65" rx="6" fill="#020617" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="-130" cy="0" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
      <text x="-100" y="-3" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="900">${escapeXml(item.name || 'COMMERCIAL HARDWARE')}</text>
      <text x="-100" y="14" fill="#38bdf8" font-size="9" font-family="monospace">${escapeXml(badge || brand || 'CERTIFIED OEM UNIT')}</text>
      <circle cx="130" cy="0" r="4" fill="#22c55e"/>
    </g>
  `;
}

// Generate complete SVG for an item
function generateEcommerceSvg(item, width = 600, height = 450, isProduct = false) {
  const theme = getTheme(item.categoryId || 'networking');
  const name = item.name || item.title || 'Product';
  const brand = (item.brand || 'DEYSLA').toUpperCase();
  const badge = item.badge || item.subtitle || '';
  const specs = item.specs || [item.spec1, item.spec2, item.spec3].filter(Boolean) || [];

  const deviceVisual = generateDeviceVisual(item, isProduct);

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Studio Background Gradient (Clean High-Tech Dark Pedestal) -->
        <radialGradient id="studioGrad" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="60%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>

        <!-- Studio Light Spotlight Beam -->
        <linearGradient id="spotlight" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.15"/>
          <stop offset="70%" stop-color="${theme.accent}" stop-opacity="0.02"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </linearGradient>

        <!-- Studio Pedestal Floor Reflection -->
        <radialGradient id="pedestalGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#334155" stop-opacity="0.6"/>
          <stop offset="40%" stop-color="#1e293b" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
        </radialGradient>

        <!-- Drop Shadow Filter for Hardware Device -->
        <filter id="hwShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.85"/>
        </filter>
      </defs>

      <!-- 1. Background Surface -->
      <rect width="${width}" height="${height}" fill="url(#studioGrad)"/>

      <!-- Ambient Technical Blueprint Grid Lines (Subtle E-Commerce Studio Aesthetic) -->
      <g stroke="#334155" stroke-width="0.5" stroke-opacity="0.2">
        ${Array.from({ length: Math.ceil(width / 40) }).map((_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${height}"/>`).join('')}
        ${Array.from({ length: Math.ceil(height / 40) }).map((_, i) => `<line x1="0" y1="${i * 40}" x2="${width}" y2="${i * 40}"/>`).join('')}
      </g>

      <!-- 2. Studio Lighting Spotlight -->
      <ellipse cx="${width / 2}" cy="${height / 2 - 20}" rx="${width * 0.45}" ry="${height * 0.35}" fill="url(#spotlight)"/>

      <!-- 3. Studio Ground Pedestal Shadow Beneath Equipment -->
      <ellipse cx="${width / 2}" cy="${height / 2 + 75}" rx="${width * 0.38}" ry="24" fill="url(#pedestalGrad)"/>

      <!-- 4. E-Commerce Hardware Device (Front / Isometric Pure Product Focus) -->
      <g transform="translate(${width / 2}, ${height / 2 - 10})" filter="url(#hwShadow)">
        ${deviceVisual}
      </g>

      <!-- 5. Header Branding & Category Tag -->
      <g transform="translate(24, 28)">
        <!-- Verified Brand Badge -->
        <rect x="0" y="0" width="${brand.length * 8.5 + 24}" height="22" rx="5" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
        <circle cx="10" cy="11" r="3.5" fill="#22c55e"/>
        <text x="20" y="15" fill="#f8fafc" font-size="9.5" font-family="sans-serif" font-weight="900" letter-spacing="1">${escapeXml(brand)}</text>
      </g>

      <!-- 6. Footer Hardware Specifications Banner (Clean E-Commerce Detail) -->
      <g transform="translate(24, ${height - 48})">
        <rect x="0" y="0" width="${width - 48}" height="32" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1.2"/>
        
        <!-- Product Model Name -->
        <text x="14" y="20" fill="#f8fafc" font-size="10.5" font-family="sans-serif" font-weight="bold">${escapeXml(name)}</text>
        
        <!-- Key Specification Callout -->
        ${badge ? `
          <g transform="translate(${width - 240}, 6)">
            <rect x="0" y="0" width="180" height="20" rx="4" fill="${theme.primary}22" stroke="${theme.primary}" stroke-width="1"/>
            <text x="90" y="14" fill="${theme.accent}" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${escapeXml(badge)}</text>
          </g>
        ` : ''}
      </g>
    </svg>
  `;
}

async function main() {
  console.log(`Starting generation of 100% clean, pure e-commerce hardware product images...`);
  console.log(`Rules enforced: NO nature, NO humans, authentic studio hardware equipment presentation.`);

  // 1. Generate all 130 Catalog Models
  console.log(`\n--- Generating ${CATALOG_ITEMS.length} Catalog Items ---`);
  let catCount = 0;
  for (const item of CATALOG_ITEMS) {
    const svgStr = generateEcommerceSvg(item, 600, 450, false);
    const baseSlug = path.basename(item.imageWebp, '.webp');
    const outWebp = path.join(catalogDir, `${baseSlug}.webp`);
    const outPng = path.join(catalogDir, `${baseSlug}.png`);

    const imgBuffer = Buffer.from(svgStr);
    await sharp(imgBuffer).webp({ quality: 92 }).toFile(outWebp);
    await sharp(imgBuffer).png({ compressionLevel: 8 }).toFile(outPng);

    catCount++;
    if (catCount % 20 === 0 || catCount === CATALOG_ITEMS.length) {
      console.log(`Generated ${catCount}/${CATALOG_ITEMS.length} catalog items...`);
    }
  }

  // 2. Generate all 34 Primary Products
  console.log(`\n--- Generating ${PRODUCTS_DATA.length} Primary Products ---`);
  let prodCount = 0;
  for (const prod of PRODUCTS_DATA) {
    const productItem = {
      id: prod.id,
      name: prod.name,
      title: prod.name,
      categoryId: prod.categoryId,
      brand: (prod.brandIds && prod.brandIds[0]) ? prod.brandIds.slice(0, 3).join(' / ') : 'DEYSLA OEM',
      badge: (prod.subcategories && prod.subcategories[0]) ? prod.subcategories[0] : 'ENTERPRISE CERTIFIED',
      subcategoryId: prod.id,
      specs: prod.keyApplications ? prod.keyApplications.slice(0, 3) : [],
    };

    const svgStr = generateEcommerceSvg(productItem, 800, 600, true);
    const outWebp = path.join(productsDir, `${prod.id}.webp`);
    const outPng = path.join(productsDir, `${prod.id}.png`);

    const imgBuffer = Buffer.from(svgStr);
    await sharp(imgBuffer).webp({ quality: 92 }).toFile(outWebp);
    await sharp(imgBuffer).png({ compressionLevel: 8 }).toFile(outPng);

    prodCount++;
    console.log(`Generated product ${prodCount}/${PRODUCTS_DATA.length}: ${prod.id}.webp`);
  }

  console.log(`\nSUCCESS! All ${CATALOG_ITEMS.length} catalog items and ${PRODUCTS_DATA.length} products generated!`);
  console.log(`Zero nature, zero humans, authentic enterprise hardware e-commerce photography.`);
}

main().catch(err => {
  console.error("Image generation failed:", err);
  process.exit(1);
});
