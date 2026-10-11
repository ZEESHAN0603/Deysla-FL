import React from "react";
import { HeroVideo } from "../components/home/HeroVideo";
import { CompanyIntro } from "../components/home/CompanyIntro";
import { BrandShowcaseSlider } from "../components/home/BrandShowcaseSlider";
import { DistributionBanner } from "../components/home/DistributionBanner";
import { FeaturedProductCards } from "../components/home/FeaturedProductCards";
import { HomeGlobalPresence } from "../components/home/HomeGlobalPresence";

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* 01. HERO SECTION (Matching format: top brands, bold centered title with cyan accent, LEARN MORE button) */}
      <HeroVideo />

      {/* 02. COMPANY INTRO & OUR PRODUCT RANGE RADIAL HUB (Matching format: left text + right radial diagram) */}
      <CompanyIntro />

      {/* 03. CATEGORY & BRAND SHOWCASE SLIDER (Matching format: left logos slider + right Racks and Security feature) */}
      <BrandShowcaseSlider />

      {/* 04. DISTRIBUTION THROUGHOUT SAUDI ARABIA BANNER (Matching format: dark tech mesh + CONTACT US button) */}
      <DistributionBanner />

      {/* 05. OUR BEST SELLING PRODUCTS (Realistic hardware cards for Cisco, Fortinet, and Structured Cabling) */}
      <FeaturedProductCards />

      {/* 06. GLOBAL PRESENCE (Saudi Arabia, Bahrain, USA simple text display) */}
      <HomeGlobalPresence />
    </div>
  );
};
