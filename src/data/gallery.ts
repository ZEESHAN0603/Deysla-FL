export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Data Center Infrastructure & Compute Assembly",
    category: "Infrastructure",
    image: "/assets/Picture21.png",
    description: "High-density server rack mounting and cable dressing in enterprise facilities.",
  },
  {
    id: "gal-2",
    title: "Security & Biometric Speed Turnstile Access",
    category: "Security",
    image: "/assets/Picture23.png",
    description: "Pedestrian entrance turnstiles integrated with facial recognition access terminals.",
  },
  {
    id: "gal-3",
    title: "Industrial Automation & DIN-Rail Network Enclosures",
    category: "Automation",
    image: "/assets/Picture25.png",
    description: "Hardened Ethernet switches and surge-protected industrial control cabinets.",
  },
  {
    id: "gal-4",
    title: "Structured Cabling & High-Density Patch Panels",
    category: "Cabling",
    image: "/assets/Picture26.png",
    description: "Precision Cat6A terminations, optical distribution frames, and trunking.",
  },
  {
    id: "gal-5",
    title: "Commercial Digital Signage & Interactive Display",
    category: "Displays",
    image: "/assets/Picture27.png",
    description: "Ultra-narrow bezel commercial displays and customer touch kiosks.",
  },
  {
    id: "gal-6",
    title: "Enterprise Technology Engineering Operations",
    category: "Operations",
    image: "/assets/Picture8.png",
    description: "Technical staging, device provisioning, and network QA benchmarks.",
  },
  {
    id: "gal-7",
    title: "Hardware Integration & Systems Staging",
    category: "Hardware",
    image: "/assets/Picture9.png",
    description: "Certified hardware procurement and pre-deployment configuration.",
  },
  {
    id: "gal-8",
    title: "Field Deployment & Client Systems Delivery",
    category: "Field Engineering",
    image: "/assets/Picture10.png",
    description: "On-site engineering, commissioning, and handover to client teams.",
  },
];
