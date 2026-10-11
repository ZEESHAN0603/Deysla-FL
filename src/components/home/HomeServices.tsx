import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Shield, Lock, Database, PhoneCall, Server, Cpu, Cloud, Settings, Code, FileCheck } from "lucide-react";
import { SERVICES_DATA, Service } from "../../data/services";

export const HomeServices: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-black uppercase tracking-wider block">
              What We Offer
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Technology Services That Drive Results
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl">
              Integrated IT services designed to optimize operations, strengthen security, and power business growth across commercial and industrial enterprises.
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-black hover:text-neutral-600 flex items-center gap-1.5 whitespace-nowrap self-start md:self-end group"
          >
            <span>Explore All 10 Services</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 10 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id}
              to={`/services/${service.slug}`}
              className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all duration-200 flex flex-col justify-between group h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-black bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md">
                    {service.number}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors mb-2 leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-black group-hover:underline">
                <span>View Service</span>
                <span className="text-neutral-400 font-mono text-[10px]">
                  {service.subServices.length} sub-services
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
