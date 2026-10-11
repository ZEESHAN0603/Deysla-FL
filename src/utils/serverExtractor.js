import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PRODUCT_CROP_REGIONS = {
  "network-switches": { x: 0.525, y: 0.160, width: 0.225, height: 0.075 },
  "routers": { x: 0.755, y: 0.160, width: 0.210, height: 0.075 },
  "wireless-solutions": { x: 0.525, y: 0.245, width: 0.225, height: 0.075 },
  "media-converters": { x: 0.755, y: 0.245, width: 0.210, height: 0.075 },
  "industrial-networking": { x: 0.525, y: 0.330, width: 0.440, height: 0.075 },
  "transceivers": { x: 0.525, y: 0.415, width: 0.440, height: 0.075 },
  "cctv-surveillance": { x: 0.530, y: 0.485, width: 0.085, height: 0.075 },
  "access-control": { x: 0.620, y: 0.485, width: 0.085, height: 0.075 },
  "security-cabling": { x: 0.705, y: 0.485, width: 0.085, height: 0.075 },
  "cybersecurity-systems": { x: 0.795, y: 0.485, width: 0.085, height: 0.075 },
  "antivirus-edr": { x: 0.880, y: 0.485, width: 0.085, height: 0.075 },
  "ip-pbx-systems": { x: 0.530, y: 0.560, width: 0.130, height: 0.075 },
  "ip-phones": { x: 0.670, y: 0.560, width: 0.150, height: 0.075 },
  "audio-solutions": { x: 0.830, y: 0.560, width: 0.135, height: 0.075 },
  "patch-panels": { x: 0.530, y: 0.635, width: 0.085, height: 0.075 },
  "copper-cables": { x: 0.620, y: 0.635, width: 0.085, height: 0.075 },
  "fiber-optic-cables": { x: 0.705, y: 0.635, width: 0.085, height: 0.075 },
  "keystone-jacks": { x: 0.795, y: 0.635, width: 0.085, height: 0.075 },
  "network-cabinets": { x: 0.880, y: 0.635, width: 0.085, height: 0.075 },
  "led-displays": { x: 0.530, y: 0.710, width: 0.105, height: 0.075 },
  "digital-signage": { x: 0.645, y: 0.710, width: 0.110, height: 0.075 },
  "interactive-displays": { x: 0.765, y: 0.710, width: 0.100, height: 0.075 },
  "kiosk-accessories": { x: 0.875, y: 0.710, width: 0.090, height: 0.075 },
  "rack-servers": { x: 0.530, y: 0.785, width: 0.085, height: 0.075 },
  "tower-servers": { x: 0.620, y: 0.785, width: 0.085, height: 0.075 },
  "desktops-and-laptops": { x: 0.705, y: 0.785, width: 0.085, height: 0.075 },
  "printers-and-supplies": { x: 0.795, y: 0.785, width: 0.085, height: 0.075 },
  "ups-and-pdus": { x: 0.880, y: 0.785, width: 0.085, height: 0.075 },
  "industrial-switches": { x: 0.525, y: 0.870, width: 0.065, height: 0.085 },
  "control-cables": { x: 0.595, y: 0.870, width: 0.070, height: 0.085 },
  "instrumentation": { x: 0.670, y: 0.870, width: 0.070, height: 0.085 },
  "fire-detection-and-alarm": { x: 0.748, y: 0.870, width: 0.075, height: 0.085 },
  "fire-suppression": { x: 0.828, y: 0.870, width: 0.065, height: 0.085 },
  "emergency-and-fire-safety": { x: 0.898, y: 0.870, width: 0.065, height: 0.085 },
};

export async function extractPosterBuffer(imageBuffer, publicDir) {
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width;
  const height = metadata.height;

  // Save master poster
  const masterPath = path.join(publicDir, 'assets', 'deysla-solutions-library.png');
  fs.mkdirSync(path.dirname(masterPath), { recursive: true });
  await sharp(imageBuffer).toFile(masterPath);

  // Extract products
  const productsDir = path.join(publicDir, 'assets', 'products');
  fs.mkdirSync(productsDir, { recursive: true });

  const results = {};

  for (const [id, region] of Object.entries(PRODUCT_CROP_REGIONS)) {
    const left = Math.max(0, Math.floor(region.x * width));
    const top = Math.max(0, Math.floor(region.y * height));
    const cropWidth = Math.min(width - left, Math.floor(region.width * width));
    const cropHeight = Math.min(height - top, Math.floor(region.height * height));

    const outputPath = path.join(productsDir, `${id}.png`);
    await sharp(imageBuffer)
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize({ width: 500, withoutEnlargement: false })
      .png({ quality: 90 })
      .toFile(outputPath);

    results[id] = `/assets/products/${id}.png`;
  }

  return {
    master: '/assets/deysla-solutions-library.png',
    products: results,
  };
}
