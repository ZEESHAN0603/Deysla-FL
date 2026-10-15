import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Award, Users, Headphones } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCmsContent } from "../../context/CmsContentContext";

export const HeroVideo: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { lang, formatPath } = useLanguage();
  const { getSectionContent } = useCmsContent();
  const heroContent = getSectionContent<any>('home', 'hero', {});

  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[660px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white selection:bg-[#ff5e00] selection:text-white">
      {/* Top Brand Iridescent Theme Gradient Bar with Cyan Data Flow */}
      <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-30" />

      {/* Background Video with IT Solution Telemetry & Circuit Matrix Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/deysla-hero-poster.jpg"
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover object-center scale-105 transform motion-reduce:hidden transition-opacity duration-700 contrast-[1.08] brightness-[1.02]"
        >
          <source src="/videos/deysla-hero.mp4" type="video/mp4" />
          <img
            src="/videos/deysla-hero-poster.jpg"
            alt="DEYSLA Enterprise Infrastructure"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Static poster fallback for prefers-reduced-motion */}
        <div
          className="hidden motion-reduce:block absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/videos/deysla-hero-poster.jpg')" }}
        />

        {/* IT Solution Matrix Layer 1: Digital Network Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:44px_44px]"
        />

        {/* IT Solution Matrix Layer 2: Micro Circuit Dot Matrix */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(rgba(56,189,248,0.25)_1px,transparent_1px)] bg-[size:22px_22px]" 
        />

        {/* Theme Radial Atmosphere: Sunset Orange (top-left) & Royal Cobalt Blue (bottom-right) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_15%_10%,rgba(255,94,0,0.38),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(0,82,204,0.42),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,94,0,0.20)_0%,transparent_50%,rgba(0,82,204,0.25)_100%)] pointer-events-none" />

        {/* Cinematic Contrast Gradients for Content Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

        {/* IT Infrastructure Floating Telemetry & Circuit Precision Markers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Top Start IT Data Node Telemetry */}
          <div className="absolute top-4 start-6 hidden lg:flex items-center gap-2 text-[10px] font-mono tracking-wider text-cyan-400/70 uppercase isolate-ltr">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>SYS_NODE // RIYADH_PRIMARY · 99.999% SLA UPTIME</span>
          </div>

          {/* Top End Enterprise Fiber Backbone */}
          <div className="absolute top-4 end-6 hidden lg:flex items-center gap-2 text-[10px] font-mono tracking-wider text-cyan-400/70 uppercase isolate-ltr">
            <span>FIBER_MESH: 100G CLOUD BACKBONE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>

          {/* Precision Architectural Framing Crosshairs */}
          <div className="absolute top-1/4 start-8 hidden md:block w-3 h-3 border-t border-s border-cyan-400/30" />
          <div className="absolute top-1/4 end-8 hidden md:block w-3 h-3 border-t border-e border-cyan-400/30" />
          <div className="absolute bottom-1/4 start-8 hidden md:block w-3 h-3 border-b border-s border-cyan-400/30" />
          <div className="absolute bottom-1/4 end-8 hidden md:block w-3 h-3 border-b border-e border-cyan-400/30" />

          {/* Optical fiber glow trace line across the top */}
          <div className="absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
        </div>
      </div>

      {/* Main Content Area - Center Aligned Matching Screenshot Hero Format */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-24 lg:pt-28 pb-8 sm:pb-14 w-full my-auto text-center space-y-4 sm:space-y-6">
        {/* Executive Theme Kicker Badge - Light Luminous Version */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/20 border border-white/35 text-white text-[11px] sm:text-xs font-semibold tracking-wide shadow-md backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
          <span>
            {lang === 'ar'
              ? 'شريك معتمد من الفئة الأولى · Cisco, Fortinet, CommScope, Corning, Dell, Schneider'
              : 'Tier-1 Partner · Cisco, Fortinet, CommScope, Corning, Dell, Schneider'}
          </span>
        </div>

        {/* Main Title with Highlighted Colored Word in Theme Gradient */}
        <div className="relative inline-block max-w-3xl">
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.15] relative z-10 drop-shadow-md">
            {lang === 'ar' ? (
              <>البنية التحتية <span className="theme-text-gradient-light">لتقنية المعلومات</span> والشبكات</>
            ) : (
              <>Enterprise <span className="theme-text-gradient-light">Technology</span> Infrastructure</>
            )}
          </h1>
          {/* Subtle translucent play watermark accent behind title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 opacity-15 pointer-events-none">
            <Play className="w-16 h-16 sm:w-28 sm:h-28 text-white fill-white/10" />
          </div>
        </div>

        {/* Sub-headline */}
        <p className="text-xs sm:text-sm lg:text-base text-neutral-200 font-normal leading-relaxed max-w-2xl mx-auto px-2 drop-shadow-sm">
          {lang === 'ar'
            ? 'توفير حلول تقنية متكاملة للمؤسسات، والشبكات السحابية، والأنظمة الأمنية، وكابلات الألياف الضوئية في جميع أنحاء المملكة ودول الخليج.'
            : (heroContent?.tagline || 'Delivering end-to-end IT Solutions, Enterprise Software, Networking, Security Systems, and Structured Cabling throughout Saudi Arabia and the GCC.')}
        </p>

        {/* Executive Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to={formatPath(heroContent?.ctaPrimaryLink || "/about")}
            className="inline-block px-7 sm:px-9 py-3 sm:py-3.5 theme-button-primary text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
          >
            {lang === 'ar' ? 'تعرف على ديسلا' : (heroContent?.ctaPrimaryText || 'LEARN MORE')}
          </Link>
        </div>
      </div>

      {/* Bottom Credibility Strip - Light Luminous Glass Version */}
      <div className="relative z-10 w-full border-t border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 sm:divide-x rtl:sm:divide-x-reverse divide-white/20 text-center sm:text-start">
            {/* Item 1: 15+ Years */}
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-3.5 sm:pe-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0 text-white shadow-xs">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-0.5 text-start">
                <p className="text-sm sm:text-base font-bold text-white leading-tight tracking-tight isolate-ltr">
                  {lang === 'ar' ? '+15 عاماً' : '15+ Years'}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-200 font-normal leading-tight">
                  {lang === 'ar' ? 'خدمة متميزة بالمملكة' : 'Service across Saudi Arabia'}
                </p>
              </div>
            </div>

            {/* Item 2: 500+ Projects */}
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-3.5 sm:px-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0 text-white shadow-xs">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-0.5 text-start">
                <p className="text-sm sm:text-base font-bold text-white leading-tight tracking-tight isolate-ltr">
                  {lang === 'ar' ? '+500 مشروع' : '500+ Projects'}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-200 font-normal leading-tight">
                  {lang === 'ar' ? 'للمؤسسات والقطاع الصناعي' : 'Enterprise & industrial clients'}
                </p>
              </div>
            </div>

            {/* Item 3: 24/7 Support */}
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-3.5 sm:ps-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0 text-white shadow-xs">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-0.5 text-start">
                <p className="text-sm sm:text-base font-bold text-white leading-tight tracking-tight isolate-ltr">
                  {lang === 'ar' ? 'دعم فني 24/7' : '24/7 Support'}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-200 font-normal leading-tight">
                  {lang === 'ar' ? 'مهندسون محليون معتمدون' : 'Dedicated local SLA engineering'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
