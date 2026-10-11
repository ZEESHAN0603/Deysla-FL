const fs = require("fs");
const sharp = require("sharp");

function renderCpPlusNvrSvg(width = 1000, height = 750) {
  const leds = [0, 1, 2, 3, 4, 5, 6, 7].map(i => {
    const color = i === 0 ? "#22c55e" : (i === 1 ? "#38bdf8" : "#334155");
    const glow = i === 0 ? `<circle cx="${i * 24}" cy="0" r="3.5" fill="#22c55e" opacity="0.3"/>` :
                 (i === 1 ? `<circle cx="${i * 24}" cy="0" r="3.5" fill="#38bdf8" opacity="0.25"/>` : '');
    return `<circle cx="${i * 24}" cy="0" r="1.5" fill="${color}"/>${glow}`;
  }).join("\n");

  const buttons = [
    { label: "1", x: 0 },
    { label: "2", x: 28 },
    { label: "3", x: 56 },
    { label: "4", x: 84 },
    { label: "5", x: 112 },
    { label: "6", x: 140 },
    { label: "7", x: 168 },
    { label: "8", x: 196 },
    { label: "SHIFT", x: 232, wide: true },
    { label: "REC", x: 274, wide: true },
    { label: "FN", x: 312 },
    { label: "ESC", x: 340 }
  ].map(btn => {
    const w = btn.wide ? 34 : 22;
    const fs = btn.wide ? 6.5 : 8;
    return `
      <g transform="translate(${btn.x}, 0)">
        <rect x="0" y="0" width="${w}" height="17" rx="3" fill="url(#buttonBezel)" stroke="#090a0d" stroke-width="1"/>
        <rect x="1" y="1" width="${w - 2}" height="7" rx="1.5" fill="#3a3f47" opacity="0.3"/>
        <text x="${w / 2}" y="11" fill="#cbd5e1" font-size="${fs}" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${btn.label}</text>
      </g>
    `;
  }).join("\n");

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Pure clean white e-commerce studio background -->
      <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="90%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f8fafc"/>
      </linearGradient>

      <!-- Soft ground contact shadow for realistic perspective table placement -->
      <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#090d16" stop-opacity="0.55"/>
        <stop offset="40%" stop-color="#1e293b" stop-opacity="0.3"/>
        <stop offset="75%" stop-color="#475569" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>

      <!-- Chassis Top Lid Perspective Gradient (Matte Black Powder-Coated Metal) -->
      <linearGradient id="topLidGrad" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stop-color="#3a4048"/>
        <stop offset="35%" stop-color="#2d3238"/>
        <stop offset="70%" stop-color="#22262a"/>
        <stop offset="100%" stop-color="#1a1d20"/>
      </linearGradient>

      <!-- Front Panel Matte / Gloss Bezel Gradient -->
      <linearGradient id="frontFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#181a1d"/>
        <stop offset="45%" stop-color="#121315"/>
        <stop offset="75%" stop-color="#1e2023"/>
        <stop offset="100%" stop-color="#111214"/>
      </linearGradient>

      <!-- Right Side Panel Gradient (Shadowed Perspective) -->
      <linearGradient id="rightSideGrad" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#1c1f22"/>
        <stop offset="50%" stop-color="#151719"/>
        <stop offset="100%" stop-color="#0d0e10"/>
      </linearGradient>

      <!-- Specular Highlight for Top Front Edge Chamfer -->
      <linearGradient id="edgeChamfer" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#64748b" stop-opacity="0.6"/>
        <stop offset="25%" stop-color="#94a3b8" stop-opacity="0.8"/>
        <stop offset="60%" stop-color="#475569" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#334155" stop-opacity="0.2"/>
      </linearGradient>

      <!-- Nav Ring Metallic Radial Gradient -->
      <radialGradient id="navRingGrad" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#2a2e34"/>
        <stop offset="60%" stop-color="#16181b"/>
        <stop offset="100%" stop-color="#0a0b0d"/>
      </radialGradient>

      <linearGradient id="buttonBezel" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2c3036"/>
        <stop offset="100%" stop-color="#141618"/>
      </linearGradient>
    </defs>

    <!-- 1. Background -->
    <rect width="${width}" height="${height}" fill="url(#bg)"/>

    <!-- 2. Realistic Ground Shadows (Contact + Ambient) -->
    <ellipse cx="490" cy="505" rx="420" ry="28" fill="url(#groundShadow)"/>
    <path d="M 85 498 Q 480 504 882 495 L 892 506 Q 480 514 78 506 Z" fill="#020617" opacity="0.65"/>
    <path d="M 880 495 L 900 488 L 905 496 L 888 505 Z" fill="#020617" opacity="0.5"/>

    <!-- 3. MAIN HARDWARE NVR APPLIANCE (Realistic Perspective View) -->
    <g transform="translate(10, 20)">

      <!-- Top Cover Plate (Angled Perspective 3D Sheet Metal Lid) -->
      <polygon points="218,292 882,308 887,390 74,368" fill="url(#topLidGrad)" stroke="#1a1c1e" stroke-width="1"/>
      <line x1="230" y1="298" x2="870" y2="313" stroke="#475569" stroke-width="0.8" opacity="0.3"/>
      <polygon points="218,292 480,298 380,370 74,368" fill="#ffffff" opacity="0.04"/>

      <!-- Right Side Flange Panel -->
      <polygon points="887,390 882,308 884,432 874,495" fill="url(#rightSideGrad)" stroke="#0f1113" stroke-width="1"/>
      <g stroke="#090a0c" stroke-width="2.5" stroke-linecap="round" opacity="0.7">
        <line x1="883" y1="365" x2="881" y2="415"/>
        <line x1="885" y1="375" x2="883" y2="422"/>
      </g>

      <!-- Top Edge Chamfer Highlight -->
      <line x1="74" y1="368" x2="887" y2="390" stroke="url(#edgeChamfer)" stroke-width="1.6"/>
      <line x1="218" y1="292" x2="882" y2="308" stroke="#525b66" stroke-width="0.8" opacity="0.5"/>

      <!-- Front Panel Face -->
      <polygon points="74,368 874,390 874,495 78,488" fill="url(#frontFaceGrad)" stroke="#090a0b" stroke-width="1"/>

      <!-- Sculpted Front Face Inset Section -->
      <polygon points="560,382 860,390 860,490 560,483" fill="#141518" stroke="#1f2226" stroke-width="0.8"/>
      <path d="M 550 420 L 560 382 L 560 483 L 550 450 Z" fill="#1a1c1f"/>

      <!-- Bottom Edge Baseline -->
      <line x1="78" y1="488" x2="874" y2="495" stroke="#050607" stroke-width="2"/>
      <line x1="80" y1="487" x2="872" y2="494" stroke="#2a2e34" stroke-width="0.8" opacity="0.5"/>

      <!-- Rubber Foot Pads Underneath -->
      <rect x="110" y="488" width="35" height="4" rx="2" fill="#090a0c"/>
      <rect x="830" y="493" width="35" height="4" rx="2" fill="#090a0c"/>

      <!-- 1. CP PLUS Red Logo on Front Left -->
      <g transform="translate(92, 385)">
        <g stroke="#e11d48" stroke-width="2.4" fill="none" stroke-linecap="round">
          <path d="M 4 8 Q 12 16 20 8 Q 12 0 4 8 Z"/>
          <path d="M 12 4 L 12 12"/>
          <path d="M 8 8 L 16 8"/>
        </g>
        <text x="26" y="11" fill="#e11d48" font-size="13" font-family="Arial, Helvetica, sans-serif" font-weight="900" letter-spacing="0.5">CP PLUS</text>
      </g>

      <!-- 2. Front Status LED Array -->
      <g transform="translate(245, 396)">
        ${leds}
      </g>

      <!-- 3. Front USB Port -->
      <g transform="translate(120, 442)">
        <rect x="0" y="0" width="34" height="17" rx="3" fill="#0a0b0d" stroke="#334155" stroke-width="1"/>
        <rect x="4" y="3" width="26" height="11" rx="1.5" fill="#181a1d"/>
        <rect x="6" y="8" width="22" height="4" fill="#3b82f6"/>
        <line x1="10" y1="5" x2="10" y2="8" stroke="#94a3b8" stroke-width="0.8"/>
        <line x1="24" y1="5" x2="24" y2="8" stroke="#94a3b8" stroke-width="0.8"/>
      </g>

      <!-- 4. Channel Pushbuttons -->
      <g transform="translate(195, 442)">
        ${buttons}
      </g>

      <!-- 5. Right-Hand Multi-Directional Navigation Wheel -->
      <g transform="translate(735, 452)">
        <circle cx="0" cy="0" r="30" fill="#0c0d0f" stroke="#222529" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="28" fill="url(#navRingGrad)" stroke="#1a1c1e" stroke-width="1"/>
        <polygon points="0,-22 -5,-15 5,-15" fill="#e2e8f0"/>
        <polygon points="0,22 -5,15 5,15" fill="#e2e8f0"/>
        <polygon points="-22,0 -15,-5 -15,5" fill="#e2e8f0"/>
        <polygon points="22,0 15,-5 15,5" fill="#e2e8f0"/>
        <circle cx="0" cy="0" r="12" fill="#121316" stroke="#e11d48" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="9.5" fill="#1c1e22"/>
        <text x="0" y="2.5" fill="#ffffff" font-size="5" font-family="Arial, sans-serif" font-weight="900" text-anchor="middle">MODE</text>
      </g>

      <!-- 6. Power Standby Button -->
      <g transform="translate(815, 442)">
        <rect x="0" y="0" width="28" height="20" rx="4" fill="#0f1114" stroke="#262a30" stroke-width="1"/>
        <circle cx="14" cy="10" r="5" fill="none" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="24 8" stroke-dashoffset="6"/>
        <line x1="14" y1="4" x2="14" y2="10" stroke="#e11d48" stroke-width="1.5"/>
      </g>

    </g>
  </svg>
  `;
}

(async () => {
  const svg = renderCpPlusNvrSvg(1000, 750);
  await sharp(Buffer.from(svg))
    .webp({ quality: 95 })
    .toFile("public/assets/catalog/sec-cctv-cpplus-nvr.webp");
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 8 })
    .toFile("public/assets/catalog/sec-cctv-cpplus-nvr.png");
  
  // Also copy to dist if dist exists
  if (fs.existsSync("dist/assets/catalog")) {
    fs.copyFileSync("public/assets/catalog/sec-cctv-cpplus-nvr.webp", "dist/assets/catalog/sec-cctv-cpplus-nvr.webp");
    fs.copyFileSync("public/assets/catalog/sec-cctv-cpplus-nvr.png", "dist/assets/catalog/sec-cctv-cpplus-nvr.png");
  }
  console.log("CP PLUS NVR image built successfully!");
})();
