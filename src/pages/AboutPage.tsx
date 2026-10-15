import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Send,
  Server,
  Award,
  Clock,
  Cloud,
  Database,
  Code2,
  Cpu,
  FileCheck2,
  Layers,
  Globe2,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { WhatsAppIcon } from "../components/common/WhatsAppIcon";
import { COMPANY_DATA } from "../data/company";
import { useLanguage } from "../context/LanguageContext";

export const AboutPage: React.FC = () => {
  const { dict, lang, formatPath } = useLanguage();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", contact: "", message: "" });
    }, 4000);
  };

  return (
    <div className="w-full bg-transparent text-slate-900">
      {/* 01. PROFESSIONAL HERO BANNER */}
      <section className="relative w-full min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] flex items-center justify-center overflow-hidden bg-slate-950 text-white border-b border-slate-800">
        {/* Top Brand Iridescent Theme Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />

        {/* Background Image Container with Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <picture>
            <source srcSet="/assets/about-hero-bg.webp" type="image/webp" />
            <img
              src="/assets/about-hero-bg.jpg"
              alt="DEYSLA IT Solutions Corporate Headquarters"
              className="w-full h-full object-cover object-center scale-105 transform contrast-105 brightness-[0.78] transition-transform duration-1000"
            />
          </picture>

          {/* IT Solution Cyber Matrix & Micro-Dot Pattern Overlays */}
          <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,rgba(56,189,248,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(rgba(56,189,248,0.3)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Deep Navy/Black Gradient Tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/90 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.8)_100%)] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center space-y-4 sm:space-y-6">
          {/* Top Kicker */}
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-white bg-white/20 border border-white/35 px-4 py-1.5 rounded-full shadow-md backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>{lang === 'ar' ? 'المملكة العربية السعودية · حلول تقنية المعلومات المعتمدة' : 'Kingdom of Saudi Arabia · Tier-1 IT Solutions'}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-lg">
            {lang === 'ar' ? (
              <>من <span className="theme-text-gradient-light">نحن</span></>
            ) : (
              <>About <span className="theme-text-gradient-light">DEYSLA</span></>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
            {dict.about.subtitle}
          </p>

          {/* Quick Highlight Metrics Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-xs text-slate-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">15+</span>
              <span>{lang === 'ar' ? 'سنوات تميز' : 'Years Excellence'}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-xs text-slate-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="font-semibold text-white">500+</span>
              <span>{lang === 'ar' ? 'مشاريع مؤسسية' : 'Enterprise Projects'}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-xs text-slate-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="font-semibold text-white">100%</span>
              <span>{lang === 'ar' ? 'أجهزة أصلية معتمدة' : 'OEM Certified Hardware'}</span>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="pt-2">
            <nav
              aria-label="Breadcrumb"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/35 text-xs font-semibold text-white shadow-sm backdrop-blur-md"
            >
              <Link
                to={formatPath("/")}
                className="hover:text-cyan-200 transition-colors uppercase tracking-wider"
              >
                {dict.nav.home}
              </Link>
              <span className="text-white/60 font-bold">/</span>
              <span className="text-cyan-300 font-bold uppercase tracking-wider">
                {dict.nav.about}
              </span>
            </nav>
          </div>
        </div>

        {/* Bottom Strip: Key Telemetry Accents */}
        <div className="absolute bottom-0 inset-x-0 z-10 border-t border-white/20 bg-white/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>{lang === 'ar' ? '+15 عاماً من الخبرة' : '15+ Years Experience'}</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{lang === 'ar' ? '+500 مشروع مؤسسي منجز' : '500+ Enterprise Deployments'}</span>
              </span>
              <span className="hidden lg:inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>{lang === 'ar' ? 'توزيع معتمد من الفئة الأولى' : 'Authorized Tier-1 Distribution'}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>{lang === 'ar' ? 'المقر الرئيسي بالدمام · المملكة' : 'Dammam Headquarters · KSA'}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 02. EXECUTIVE LEADERSHIP: A MESSAGE FROM OUR DIRECTOR */}
      <section
        id="directors-message"
        className="py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-white via-slate-50/60 to-white text-slate-900 border-b border-slate-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10">
            {/* Top header strip */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
                  {lang === 'ar' ? 'القيادة التنفيذية' : 'EXECUTIVE ADDRESS · LEADERSHIP'}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                {lang === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}
              </span>
            </div>

            {/* Main Content: Circular Director Avatar alongside Executive Message */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Director Portrait Avatar Column */}
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-sky-500/20 bg-slate-100 relative">
                    <picture>
                      <source srcSet="/assets/director-avatar.webp" type="image/webp" />
                      <source srcSet="/assets/director.webp" type="image/webp" />
                      <img
                        src="/assets/director-avatar.png"
                        alt={`${COMPANY_DATA.director.name} - Director · DEYSLA IT Solutions`}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="eager"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes("director.png")) {
                            target.src = "/assets/director.png";
                          } else if (!target.src.includes("director_fitted")) {
                            target.src = "/assets/director_fitted.png";
                          }
                        }}
                      />
                    </picture>
                  </div>

                  {/* Director Badge */}
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="px-3.5 py-1 rounded-full bg-slate-950 text-white text-[11px] font-bold uppercase tracking-wider shadow-md border border-slate-700">
                      {lang === 'ar' ? 'المدير العام' : 'Director'}
                    </span>
                  </div>
                </div>

                {/* Director Identity */}
                <div className="mt-5 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {COMPANY_DATA.director.name}
                  </h3>
                  <p className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                    {lang === 'ar' ? 'المدير العام · ديسلا لحلول تقنية المعلومات' : 'Director · DEYSLA IT Solutions'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {lang === 'ar' ? 'الدمام، المنطقة الشرقية، المملكة العربية السعودية' : 'Dammam, Eastern Province, KSA'}
                  </p>
                </div>

                {/* Key Credentials Badges */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700">
                    {lang === 'ar' ? '+15 عاماً من القيادة' : '15+ Years Leadership'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-[10px] font-bold text-sky-700">
                    {lang === 'ar' ? 'رؤية السعودية 2030' : 'Saudi Vision 2030'}
                  </span>
                </div>
              </div>

              {/* Executive Message Column */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {lang === 'ar' ? 'رسالة من المدير العام' : 'A Message From Our Director'}
                  </h2>
                  <div className="w-16 h-1 bg-sky-500 rounded-full mt-2.5" />
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed border-s-4 border-sky-500 ps-4 sm:ps-6 bg-slate-50/70 p-5 sm:p-6 rounded-e-2xl border border-s-0 border-slate-200/80 shadow-xs">
                  <p className="font-bold text-slate-900 text-base sm:text-lg">
                    {lang === 'ar' ? 'مرحباً بكم في ديسلا لحلول تقنية المعلومات.' : 'Welcome to DEYSLA IT Solutions.'}
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {lang === 'ar'
                      ? 'في ديسلا، نلتزم بتمكين المؤسسات من النجاح والنمو من خلال تقديم حلول تقنية مبتكرة وموثوقة وآمنة. يرتكز عملنا على بناء شراكات استراتيجية طويلة الأجل من خلال الالتزام الصارم بمعايير الجودة والنزاهة والخدمة الاستثنائية في كل مرحلة من مراحل المشروع.'
                      : 'At DEYSLA, we are committed to helping businesses succeed through innovative, secure, and reliable technology solutions. Our focus is on building long-term partnerships by delivering quality, integrity, and exceptional service across every project.'}
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {lang === 'ar'
                      ? 'مع التطور التكنولوجي المتسارع، نظل ملتزمين بدعم مسيرة التحول الرقمي وصناعة قيمة مستدامة لعملائنا في المملكة ودول الخليج. نشكركم على ثقتكم الغالية ونتطلع لأن نكون شريككم التقني المفضل للمستقبل.'
                      : 'As technology continues to evolve, we remain dedicated to driving digital transformation and creating lasting value for our clients. Thank you for your trust—we look forward to being your technology partner for the future.'}
                  </p>

                  <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div>
                      <p className="font-black text-slate-900 text-sm">
                        {COMPANY_DATA.director.name}
                      </p>
                      <p className="font-bold text-sky-600 text-[11px] uppercase tracking-wider">
                        {lang === 'ar' ? 'المدير العام · ديسلا لحلول تقنية المعلومات' : `${COMPANY_DATA.director.title} · DEYSLA IT Solutions`}
                      </p>
                    </div>
                    <div className="text-start text-[11px] text-slate-500 font-medium">
                      <span>{lang === 'ar' ? 'المكتب التنفيذي · الدمام، المملكة' : 'Executive Office · Dammam, KSA'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Divider with Three Distinct Value Columns */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{lang === 'ar' ? 'نزاهة وأصالة 100%' : '100% Integrity'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'ar'
                    ? 'معدات أصلية من كبرى الشركات العالمية مع ضمانات المصنع وأرقام تسلسلية موثقة.'
                    : 'Authentic tier-1 manufacturer equipment with factory warranties and verified serial numbers.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lang === 'ar' ? 'ثقة مستدامة' : 'Long-Term Trust'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'ar'
                    ? 'فرق هندسية محلية متخصصة ودعم فني على مدار الساعة باتفاقيات مستوى خدمة صارمة.'
                    : 'Dedicated local engineering teams and responsive 24/7 SLA technical support across the Kingdom.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wide">
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{lang === 'ar' ? 'رؤية السعودية 2030' : 'Saudi Vision 2030'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'ar'
                    ? 'تمكين البنية التحتية الرقمية للمؤسسات والمساهمة في التحول المؤسسي الاستراتيجي بالمملكة.'
                    : 'Empowering nationwide enterprise digital infrastructure and strategic institutional transformation.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. ABOUT US / DEYSLA IT Solutions Profile */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block">
                  {dict.nav.about.toUpperCase()}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {lang === 'ar' ? 'ديسلا لحلول تقنية المعلومات' : 'DEYSLA IT Solutions'}
                </h2>
                <div className="w-14 h-1 bg-slate-900 mt-2.5 rounded-full" />
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  {lang === 'ar'
                    ? 'تعتبر شركة ديسلا لحلول تقنية المعلومات موزعاً ومورداً رائداً لحلول البنية التحتية والاتصالات والتمديدات الهيكلية في المملكة العربية السعودية. نفخر بالتعامل مع أرقى العلامات التجارية العالمية وسلاسل التوريد المعتمدة من الفئة الأولى.'
                    : 'DEYSLA IT Solutions is a leading IT distributor and supplier for IT Infrastructure Brands, Telecom Brands and Structured Cabling Brands in Saudi Arabia. We pride ourselves on using the world\'s leading brands and we work with verified tier-1 supply chains.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? 'نحن من كبار الموردين لمحولات الشبكات (Switches)، والموجهات (Routers)، وهواتف IP، ونقاط الوصول اللاسلكية في جميع مناطق المملكة. كما نوفر خوادم الشبكات وملحقاتها والطابعات وحلول الأمان المؤسسية.'
                    : 'We are the largest suppliers Networking Switches, Routers, IP Phones, Access Points across the Kingdom. We also deal with Network Servers and Network Accessories, Printers, and Enterprise Anti-Virus software.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? 'يمتلك فريقنا الهندسي تخصصاً عميقاً في كافة فئات الكابلات: Cat6، Cat6A، Cat7، وكابلات SFTP، والكابلات المحورية، وكاميرات المراقبة التلفزيونية والأنظمة الأمنية.'
                    : 'We have a specialized team dealing with all types of cables: Cat6, Cat6A, Cat7, SFTP Cables, Coaxial Cables, CCTV and Security systems.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? 'توفر ديسلا كافة منتجات تقنية المعلومات والتيار الخفيف (ELV): كابلات الألياف الضوئية، وصلات Pigtails، ولوحات التوزيع Patch Panels، وموزعات PLC لأشهر العلامات: Cisco, Belden, D-Link, CommScope, Corning, Schneider Electric, Panduit, Fortinet, Dell.'
                    : 'DEYSLA IT Solutions deals with all leading IT & ELV Products: Fiber Cables, Pigtails, Patch Panels, Fiber and PLC Splitters of all leading Brands: Cisco, Belden, D-Link, CommScope, Corning, Schneider Electric, Panduit, Fortinet, and Dell.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to={formatPath("/products")}
                  className="px-7 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-sm text-center"
                >
                  {dict.nav.exploreCatalog}
                </Link>
                <Link
                  to={formatPath("/contact")}
                  className="px-7 py-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors text-center"
                >
                  {dict.nav.contact}
                </Link>
              </div>
            </div>

            {/* Right Column: Enterprise Credentials Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 p-8 text-white space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
                  <span>{lang === 'ar' ? 'تحالف مؤسسي معتمد' : 'VERIFIED ENTERPRISE ALLIANCE'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {lang === 'ar' ? 'توزيع وهندسة تقنية من الفئة الأولى' : 'Tier-1 Technology Distribution & Engineering'}
                </h3>
                <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{lang === 'ar' ? 'توريد مباشر من كبرى الشركات العالمية مع ضمانات المصنع الرسمية.' : 'Direct sourcing from certified global manufacturers with full factory warranties.'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{lang === 'ar' ? 'مستودعات إقليمية في الدمام والبحرين والولايات المتحدة لإنجاز سريع.' : 'Regional hubs across Dammam, Bahrain, and the United States for rapid fulfillment.'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{lang === 'ar' ? 'مهندسو حلول معتمدون وفرق نشر ميدانية متخصصة في المملكة.' : 'Dedicated certified solutions architects and on-site deployment engineers.'}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{lang === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}</span>
                  <span className="text-sky-400 font-mono font-bold">DEYSLA IT SOLUTIONS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04. STRATEGIC PILLARS */}
      <section className="relative py-8 sm:py-12 lg:py-14 bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.15),transparent_75%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_90%,rgba(59,130,246,0.1),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-[11px] font-mono font-semibold uppercase tracking-wider shadow-xs backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{lang === 'ar' ? 'ركائز القيمة والضمان المؤسسي' : 'CORE VALUE PILLARS & ENTERPRISE ASSURANCE'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase">
              {lang === 'ar' ? (
                <>مهندسة للعمليات <span className="theme-text-gradient-light">الحرجة والمستمرة</span></>
              ) : (
                <>Engineered for <span className="theme-text-gradient-light">Mission-Critical</span> Operations</>
              )}
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {lang === 'ar'
                ? 'مدعومة بفرق هندسية معتمدة وشراكات تصنيع مباشرة والتزام صارم باتفاقيات مستوى الخدمة في المملكة ودول الخليج.'
                : 'Backed by certified engineering, direct tier-1 manufacturer partnerships, and strict local SLA commitments across Saudi Arabia and the GCC.'}
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* 1. Turnkey Infrastructure */}
            <div className="relative p-4 sm:p-5 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-sky-400/50 backdrop-blur-md hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 group-hover:bg-sky-500/25 transition-all shadow-inner">
                    <Server className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-sky-300/80 bg-sky-500/10 border border-sky-400/20 px-2 py-0.5 rounded-full isolate-ltr">
                    99.999% UPTIME
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-[15px] font-extrabold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                    {lang === 'ar' ? 'بنية تحتية متكاملة' : 'Turnkey Infrastructure'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                    {lang === 'ar'
                      ? 'أنظمة التيار الخفيف ELV، والتمديدات الهيكلية، وكبائن مراكز البيانات، ومسارات الألياف الضوئية.'
                      : 'Complete ELV systems, structured cabling, data center racks, and high-speed optical backbones.'}
                  </p>
                </div>
              </div>
              <div className="pt-2.5 mt-3 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
                <span>{lang === 'ar' ? 'بنية معمارية بدون توقف' : 'Zero-downtime architecture'}</span>
              </div>
            </div>

            {/* 2. Certified Engineering */}
            <div className="relative p-4 sm:p-5 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-emerald-400/50 backdrop-blur-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/25 transition-all shadow-inner">
                    <Award className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-300/80 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded-full isolate-ltr">
                    OEM CERTIFIED
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-[15px] font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                    {lang === 'ar' ? 'هندسة معتمدة' : 'Certified Engineering'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                    {lang === 'ar'
                      ? 'خبراء معتمدون في Cisco CCIE/CCNP وFortinet NSE وCommScope لتنفيذ المشاريع وفق أدق المعايير.'
                      : 'Certified Cisco CCIE/CCNP, Fortinet NSE, and CommScope specialists delivering standards deployment.'}
                  </p>
                </div>
              </div>
              <div className="pt-2.5 mt-3 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{lang === 'ar' ? 'فريق تقني ثنائي اللغة' : 'Bilingual technical team'}</span>
              </div>
            </div>

            {/* 3. Authorized Distribution */}
            <div className="relative p-4 sm:p-5 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-blue-400/50 backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-105 group-hover:bg-blue-500/25 transition-all shadow-inner">
                    <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-blue-300/80 bg-blue-500/10 border border-blue-400/20 px-2 py-0.5 rounded-full isolate-ltr">
                    FACTORY DIRECT
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-[15px] font-extrabold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                    {lang === 'ar' ? 'توزيع معتمد' : 'Authorized Distribution'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                    {lang === 'ar'
                      ? 'معدات أصلية من المصنعين مباشرة مع ضمان رسمي وأرقام تسلسلية موثقة.'
                      : 'Authentic tier-1 manufacturer hardware with verified factory serial numbers and official warranty.'}
                  </p>
                </div>
              </div>
              <div className="pt-2.5 mt-3 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                <span>{lang === 'ar' ? 'ضمان المصنع الكامل' : 'Full manufacturer warranty'}</span>
              </div>
            </div>

            {/* 4. 24/7 SLA Support */}
            <div className="relative p-4 sm:p-5 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-cyan-400/50 backdrop-blur-md hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-500/25 transition-all shadow-inner">
                    <Clock className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-300/80 bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 rounded-full isolate-ltr">
                    &lt; 2H DISPATCH
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-[15px] font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {lang === 'ar' ? 'دعم 24/7 مع اتفاقية SLA' : '24/7 SLA Support'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                    {lang === 'ar'
                      ? 'مهندسو دعم محليون على مدار الساعة مع خط ساخن للحالات الطارئة واستجابة سريعة في الموقع.'
                      : 'Dedicated local support engineers with 24/7 emergency hotline and rapid on-site dispatch.'}
                  </p>
                </div>
              </div>
              <div className="pt-2.5 mt-3 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>{lang === 'ar' ? 'تغطية طوارئ ميدانية' : 'Emergency on-site coverage'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05. DUAL CARDS: "What We Do" & "Our Vision" */}
      <section className="py-12 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Left Card: What We Do */}
            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-slate-950">
                <picture>
                  <source srcSet="/assets/what-we-do.webp" type="image/webp" />
                  <img
                    src="/assets/what-we-do.jpg"
                    alt="DEYSLA IT Solutions Systems Engineering & Deployment"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3.5 start-3.5 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300 border border-white/10">
                  {lang === 'ar' ? 'هندسة الأنظمة والتنفيذ الميداني' : 'SYSTEMS ENGINEERING & DEPLOYMENT'}
                </div>
                <div className="absolute bottom-3.5 end-3.5 w-10 h-10 rounded-xl bg-white/95 border border-slate-200 flex items-center justify-center text-sky-600 shadow-md">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between space-y-5">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">
                    {lang === 'ar' ? 'ماذا نقدم' : 'What We Do'}
                  </h3>
                  <div className="w-10 h-1 bg-sky-500 rounded-full" />
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {lang === 'ar'
                      ? 'نمتلك خبرة واسعة في تصميم وتخصيص وتركيب طيف شامل من الأنظمة لمختلف المنشآت المؤسسية. نركز على التواصل المستمر لفهم الأهداف والمتطلبات الخاصة لعملائنا في كافة مناطق المملكة.'
                      : 'We are experienced in designing, customizing and installing a wide range of systems for diverse enterprise clients. We focus on close communication to understand the specific needs and goals of our clients across the Kingdom.'}
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to={formatPath("/services")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 uppercase tracking-wider"
                  >
                    <span>{lang === 'ar' ? 'استعرض خدماتنا الـ 10 الأساسية' : 'View Our 10 Core Services'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Card: Our Vision */}
            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-slate-950">
                <picture>
                  <source srcSet="/assets/our-vision.webp" type="image/webp" />
                  <img
                    src="/assets/our-vision.jpg"
                    alt="DEYSLA IT Solutions Vision for Enterprise Growth"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3.5 start-3.5 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 border border-white/10">
                  {lang === 'ar' ? 'نمو مؤسسي مستعد للمستقبل' : 'FUTURE-READY ENTERPRISE GROWTH'}
                </div>
                <div className="absolute bottom-3.5 end-3.5 w-10 h-10 rounded-xl bg-white/95 border border-slate-200 flex items-center justify-center text-emerald-600 shadow-md">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between space-y-5">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {dict.about.visionTitle}
                  </h3>
                  <div className="w-10 h-1 bg-emerald-500 rounded-full" />
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>{lang === 'ar' ? 'القيمة:' : 'Value:'}</strong> {lang === 'ar' ? 'تقديم حلول تقنية عالية الأداء بأعلى قيمة وأفضل كفاءة اقتصادية.' : 'Deliver high-performance IT essentials at optimal value.'}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>{lang === 'ar' ? 'النمو:' : 'Growth:'}</strong> {lang === 'ar' ? 'ضمان مرونة تكنولوجية مستدامة ونمو مستمر للمؤسسات على المدى الطويل.' : 'Ensure sustainable and profitable long-term technological agility.'}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>{lang === 'ar' ? 'الأمان:' : 'Safety:'}</strong> {lang === 'ar' ? 'الحفاظ على بيئات عمل آمنة ومعتمدة ومتوافقة مع المعايير القياسية.' : 'Maintain certified, compliant, and secure working environments.'}</span>
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <Link
                    to={formatPath("/products")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider"
                  >
                    <span>{lang === 'ar' ? 'استكشف المنتجات والحلول' : 'Explore Products & Solutions'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06. OUR EXPERTISE & CAPABILITIES: 7 Offerings */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block">
                  {lang === 'ar' ? 'حلول للمؤسسات' : 'ENTERPRISE SOLUTIONS'}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {lang === 'ar' ? 'خبراتنا وإمكانياتنا' : 'Our Expertise & Capabilities'}
                </h2>
                <div className="w-14 h-1 bg-sky-500 rounded-full mt-2.5" />
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed max-w-2xl">
                  {lang === 'ar'
                    ? 'تقدم ديسلا خدمات تقنية شاملة مصممة خصيصاً للمؤسسات والقطاع الصناعي في المملكة ودول الخليج، تجمع بين الكفاءة الهندسية وتوريد المعدات من الفئة الأولى والتنفيذ الميداني.'
                    : 'DEYSLA IT Solutions provides end-to-end technology services tailored to enterprise and industrial organizations across Saudi Arabia and the GCC, combining technical proficiency, tier-1 hardware, and hands-on deployment.'}
                </p>
              </div>

              {/* 7 Capability Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* 1. Cloud Solutions */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-400/60 hover:bg-white hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0 shadow-2xs">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'الحلول السحابية' : 'Cloud Solutions'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'بنية السحابة الهجينة والخاصة والترحيل السحابي وإدارة البنية التحتية.' : 'Public, private, and hybrid cloud architecture, migration, and infrastructure management.'}
                    </p>
                  </div>
                </div>

                {/* 2. Cyber Security */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-400/60 hover:bg-white hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'الأمن السيبراني' : 'Cyber Security'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'حماية محيط الشبكة وجدران الحماية المؤسسية وحماية النقاط الطرفية والمراقبة.' : 'Network perimeter defense, enterprise firewalls, endpoint protection, and monitoring.'}
                    </p>
                  </div>
                </div>

                {/* 3. IT Infrastructure */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-400/60 hover:bg-white hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0 shadow-2xs">
                    <Server className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'البنية التحتية لتقنية المعلومات' : 'IT Infrastructure'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'التمديدات الهيكلية وأنظمة الخوادم والكبائن عالية الكثافة والشبكات النشطة.' : 'Structured cabling, server compute systems, high-density racks, and active networking.'}
                    </p>
                  </div>
                </div>

                {/* 4. ERP Solutions */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-400/60 hover:bg-white hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0 shadow-2xs">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'حلول ERP المؤسسية' : 'ERP Solutions'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'تطبيق شامل لأنظمة تخطيط موارد المؤسسات ERPNext والربط والتدريب.' : 'Comprehensive enterprise resource planning implementation, integration, and training.'}
                    </p>
                  </div>
                </div>

                {/* 5. Software Development */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-400/60 hover:bg-white hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0 shadow-2xs">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'تطوير البرمجيات' : 'Software Development'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'تطبيقات الأعمال المخصصة، وبوابات العملاء، وقواعد البيانات والربط عبر APIs.' : 'Custom business applications, portal engineering, database architecture, and API integration.'}
                    </p>
                  </div>
                </div>

                {/* 6. Industrial Automation */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-400/60 hover:bg-white hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0 shadow-2xs">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'الأتمتة الصناعية' : 'Industrial Automation'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'شبكات صناعية مجهزة للظروف القاسية، وكبائن DIN-rail، وأنظمة تحكم SCADA.' : 'Hardened industrial networking, DIN-rail enclosures, and control system infrastructure.'}
                    </p>
                  </div>
                </div>

                {/* 7. ISO Certification & Audit */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-400/60 hover:bg-white hover:shadow-xs transition-all group flex items-start gap-3 sm:col-span-2">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0 shadow-2xs">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'شهادات ISO وتدقيق الأنظمة' : 'ISO Certification & Audit'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'تدقيق منظم لتقنية المعلومات، ومراجعات الامتثال للحوكمة، والمواءمة مع المعايير الدولية.' : 'Structured IT auditing, governance compliance reviews, and international standard alignment.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Experience Highlights */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 p-8 text-white space-y-6">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white isolate-ltr">
                      {lang === 'ar' ? '+15 عاماً' : '15+ Years'}
                    </span>
                    <p className="text-xs text-slate-300">
                      {lang === 'ar' ? 'من الخبرة الصناعية المثبتة' : 'Of Proven Industry Experience'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <p className="leading-relaxed">
                    {lang === 'ar'
                      ? 'أكثر من عقد ونصف في تنفيذ مشاريع البنية التحتية المعقدة لتقنية المعلومات، وتجهيزات مراكز البيانات الحساسة، والتمديدات الهيكلية المعتمدة في المملكة العربية السعودية.'
                      : 'Over a decade and a half of executing complex IT infrastructure, critical data center fit-outs, and certified structured cabling installations throughout Saudi Arabia.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07. WHY ORGANIZATIONS CHOOSE DEYSLA */}
      <section className="py-12 sm:py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block">
                  {lang === 'ar' ? 'تميز مثبت' : 'PROVEN EXCELLENCE'}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {lang === 'ar' ? 'لماذا تختار المنشآت ديسلا' : 'Why Organizations Choose DEYSLA'}
                </h2>
                <div className="w-14 h-1 bg-sky-500 rounded-full mt-2.5" />
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed max-w-2xl">
                  {lang === 'ar'
                    ? 'تعتمد كبرى المؤسسات والشركات الصناعية على ديسلا لتنفيذ المشاريع التقنية بموثوقية عالية، وتوريد معدات أصلية من الفئة الأولى، وتوفير دعم فني مخصص في جميع مراحل المشروع.'
                    : 'Enterprises and industrial leaders partner with DEYSLA IT Solutions for reliable technology execution, verified tier-1 equipment sourcing, and dedicated support across every project lifecycle.'}
                </p>
              </div>

              {/* 6 Compact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* 1 */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-sky-400/60 hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? '+15 عاماً من الخبرة' : '15+ Years of Experience'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'تاريخ عريق وموثوق في تقديم حلول تقنية المعلومات للمؤسسات في المنطقة.' : 'Established industry heritage delivering enterprise IT solutions across the region.'}
                    </p>
                  </div>
                </div>

                {/* 2 */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-sky-400/60 hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? '+500 مشروع ناجح' : '500+ Successful Projects'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'سجل حافل بالنجاح في المشاريع المؤسسية والصناعية والحكومية.' : 'Proven track record across corporate, industrial, and institutional deployments.'}
                    </p>
                  </div>
                </div>

                {/* 3 */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-sky-400/60 hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'دعم فني 24/7' : '24/7 Technical Support'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'مساعدة فنية على مدار الساعة وجاهزية هندسية دائمة للاستجابة السريعة.' : 'Around-the-clock technical assistance and responsive engineering availability.'}
                    </p>
                  </div>
                </div>

                {/* 4 */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-sky-400/60 hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'حلول تقنية متكاملة' : 'End-to-End Technology Solutions'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'قدرات تغطي دورة حياة المشروع كاملة من البنية التحتية والشبكات إلى السحابة والأمان.' : 'Full lifecycle capabilities from infrastructure and networking to cloud and security.'}
                    </p>
                  </div>
                </div>

                {/* 5 */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-sky-400/60 hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'نهج يركز على العميل' : 'Customer-Centric Approach'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'استشارات تعاونية تركز على تحقيق أهداف العميل وصناعة قيمة مستدامة.' : 'Collaborative consulting focused on understanding client goals and long-term value.'}
                    </p>
                  </div>
                </div>

                {/* 6 */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-sky-400/60 hover:shadow-xs transition-all group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors shrink-0">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {lang === 'ar' ? 'حضور وشبكة إمداد عالمية' : 'Global Presence'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'شبكة توريد دولية تربطنا بأكبر مصنعي تقنية المعلومات من الفئة الأولى عالمياً.' : 'International procurement network connecting world-class tier-1 technology manufacturers.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-900 p-8 text-white space-y-6">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-wider">
                      {lang === 'ar' ? 'التميز المؤسسي' : 'Enterprise Excellence'}
                    </p>
                    <p className="text-xs text-slate-300">
                      {lang === 'ar' ? 'فحص معتمد بأجهزة Fluke ومعايير المصنعين' : 'Certified Fluke testing & manufacturer standards'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <p className="leading-relaxed">
                    {lang === 'ar'
                      ? 'التزام مضمون بالمعايير الدولية لتمديدات الكابلات وبنية الشبكات والامتثال الأمني في كل مشاريع المملكة.'
                      : 'Guaranteed adherence to international cabling, network architecture, and security compliance standards across every Saudi Arabia project.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 08. DIRECT INQUIRY & CONTACT SECTION */}
      <section className="relative py-12 sm:py-20 lg:py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/95 to-slate-950/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {lang === 'ar' ? 'منتجات عالية الجودة!' : 'Quality Products!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                {lang === 'ar'
                  ? 'إذا كانت لديك أي استفسارات تتعلق بمشروعكم المؤسسي، يسعدنا تواصلكم معنا. فريقنا الهندسي في الدمام جاهز للمساعدة الفورية.'
                  : 'If you have any questions, large or small, relating to your project please contact us below. Our Dammam engineering team is ready to assist.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="https://wa.me/966544553670"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <WhatsAppIcon variant="monochrome" className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'دعم واتساب الفوري' : 'WhatsApp Support'}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-6">
              <div className="relative bg-slate-950/85 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/20 shadow-2xl shadow-black/50 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 theme-gradient-bar" />
                <div className="absolute -top-20 -right-20 w-44 h-44 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Card Header & Live Status */}
                <div className="relative z-10 flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                      {lang === 'ar' ? 'مكتب طلبات عروض الأسعار' : 'Technical RFQ Desk'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'ar' ? 'استجابة خلال ساعتين' : '< 2h Response'}</span>
                  </span>
                </div>

                <div className="relative z-10 mb-5 space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {lang === 'ar' ? 'طلب مباشر للمعدات والمشاريع' : 'Direct Equipment & Project Inquiry'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {lang === 'ar'
                      ? 'أرسل جدول الكميات (BOQ) أو أرقام الموديلات المطلوبة للحصول على تسعير فوري معتمد.'
                      : 'Submit your Bill of Materials or required part numbers for quick, authorized pricing.'}
                  </p>
                </div>

                {submitted ? (
                  <div className="relative z-10 p-6 sm:p-8 bg-emerald-500/15 border border-emerald-400/30 rounded-xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-400/30">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      {lang === 'ar' ? 'تم استلام طلبكم بنجاح!' : 'Inquiry Received Successfully!'}
                    </h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                      {lang === 'ar'
                        ? 'شكراً لتواصلكم. استلم فريقنا الهندسي والمبيعات بالدمام رسالتكم وسيتواصل معكم قريباً بتفاصيل عرض الأسعار.'
                        : 'Thank you! Our engineering and technical sales team in Dammam has received your message and will contact you shortly with quotation details.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative z-10 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300">
                          {dict.contact.nameLabel}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            placeholder={dict.contact.namePlaceholder}
                            required
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="w-full ps-9 pe-3 py-2.5 bg-white text-slate-900 text-xs font-medium rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-400 shadow-xs transition-all"
                            dir="auto"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300">
                          {dict.contact.emailLabel}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="email"
                            placeholder={dict.contact.emailPlaceholder}
                            required
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="w-full ps-9 pe-3 py-2.5 bg-white text-slate-900 text-xs font-medium rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-400 shadow-xs transition-all isolate-ltr"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        {dict.contact.phoneLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          placeholder={dict.contact.phonePlaceholder}
                          value={formState.contact}
                          onChange={(e) => setFormState({ ...formState, contact: e.target.value })}
                          className="w-full ps-9 pe-3 py-2.5 bg-white text-slate-900 text-xs font-medium rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-400 shadow-xs transition-all isolate-ltr"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        {dict.contact.messageLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute top-2.5 start-0 ps-3 pointer-events-none text-slate-400">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        <textarea
                          rows={3}
                          placeholder={dict.contact.messagePlaceholder}
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          className="w-full ps-9 pe-3 py-2.5 bg-white text-slate-900 text-xs font-medium rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-400 shadow-xs transition-all resize-none"
                          dir="auto"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-7 py-3 theme-button-primary text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 rtl-flip" />
                        <span>{dict.contact.submitButton}</span>
                      </button>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{lang === 'ar' ? 'سرية تامة ومحمية باتفاقية عدم إفصاح' : 'Confidential • NDA Protected'}</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
