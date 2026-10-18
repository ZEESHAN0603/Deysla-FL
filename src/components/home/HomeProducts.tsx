import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Layers, Box } from "lucide-react";
import { useCatalog } from "../../context/CatalogContext";

export const HomeProducts: React.FC = () => {
  const { activeProducts: products, categories } = useCatalog();

  return (
    <section className="py-20 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-black uppercase tracking-wider block">
              Hardware &amp; Physical Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Enterprise Products &amp; Equipment
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Authentic hardware catalogue organized across 8 primary technology domains. Sourced from certified global manufacturers with full warranty and local delivery.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-black hover:text-neutral-700 flex items-center gap-1.5 whitespace-nowrap self-start md:self-end group"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 8 Product Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const types = products.filter((p) => p.categoryId === cat.id);
            return (
              <div
                key={cat.id}
                className="p-6 rounded-2xl border border-orange-200/50 bg-white hover:border-[#ff8c3a] hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Realistic Hardware Product Photo Showcase */}
                  <div className="relative w-full h-48 sm:h-52 bg-white rounded-xl border border-orange-200/40 overflow-hidden flex items-center justify-center p-4 mb-4 group-hover:bg-orange-50/30 transition-colors">
                    <img
                      src={cat.featuredImage}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-orange-200/50 shadow-2xs">
                      <img src={cat.icon} alt="" className="w-3.5 h-3.5 object-contain" />
                      <span className="text-[10px] font-mono font-bold uppercase text-neutral-900">{cat.name}</span>
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono font-bold text-orange-700 bg-orange-50/80 border border-orange-200/60 px-2 py-0.5 rounded shadow-2xs">
                      {types.length} Types
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-orange-600 transition-colors mb-2">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Sub-Product Types Bullet List */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Includes:
                    </span>
                    {types.slice(0, 4).map((t) => (
                      <Link
                        key={t.id}
                        to={`/products/${cat.slug}/${t.slug}`}
                        className="text-xs text-slate-600 hover:text-orange-600 block truncate transition-colors flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff8c3a] shrink-0" />
                        <span className="truncate">{t.name}</span>
                      </Link>
                    ))}
                    {types.length > 4 && (
                      <span className="text-[11px] text-slate-400 italic block pl-2.5">
                        + {types.length - 4} more types
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/products/${cat.slug}`}
                    className="text-xs font-bold text-black hover:underline flex items-center gap-1 group-hover:gap-1.5 transition-all"
                  >
                    <span>View Category</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] font-mono text-slate-400">
                    {types.length} Types
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
