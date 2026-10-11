import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Layers } from "lucide-react";
import { BRANDS_DATA, Brand } from "../../data/brands";
import { PRODUCT_CATEGORIES } from "../../data/productCategories";

export const HomeBrands: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filterTabs = [
    { id: "all", label: "All Brands" },
    { id: "networking", label: "Networking" },
    { id: "security-systems", label: "Security" },
    { id: "structured-cabling", label: "Cabling" },
    { id: "communications", label: "Telecom" },
    { id: "servers-and-computing", label: "Compute & Power" },
    { id: "industrial-automation", label: "Automation" },
    { id: "fire-and-safety-systems", label: "Fire & Safety" },
  ];

  const filteredBrands =
    selectedCategory === "all"
      ? BRANDS_DATA.slice(0, 16)
      : BRANDS_DATA.filter((b) => b.categoryIds.includes(selectedCategory)).slice(0, 16);

  return (
    <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-black uppercase tracking-wider block">
              OEM &amp; Technology Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted Global Technology Partners
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              We partner with industry-standard global manufacturers to deliver authenticated hardware, manufacturer warranties, and authorized enterprise solutions.
            </p>
          </div>
          <Link
            to="/brands"
            className="text-xs font-bold text-black hover:text-neutral-700 flex items-center gap-1.5 whitespace-nowrap self-start md:self-end group"
          >
            <span>View All {BRANDS_DATA.length} Brands</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === tab.id
                  ? "bg-black text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Brands Grid with Actual DEYSLA Logos & Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredBrands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all group flex flex-col justify-between h-40"
            >
              <div className="h-16 w-full flex items-center justify-center p-2">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-black truncate">
                    {brand.name}
                  </h3>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                  <span className="capitalize truncate">
                    {brand.categoryIds.map((c) => c.replace("-", " ")).join(", ")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
