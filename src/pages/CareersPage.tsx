import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Briefcase, MapPin, Sparkles, CheckCircle2, ShieldCheck, Award, Users, ArrowRight } from "lucide-react";
import { CareersModal } from "../components/careers/CareersModal";
import { COMPANY_DATA } from "../data/company";
import { useLanguage } from "../context/LanguageContext";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
}

const JOB_OPENINGS_EN: JobOpening[] = [
  {
    id: "network-architect",
    title: "Network & Infrastructure Solutions Architect",
    department: "Enterprise Systems",
    location: "Dammam, Eastern Province, KSA",
    type: "Full-Time",
    experience: "5+ Years",
    description: "Design high-availability enterprise networks, campus switching backbones, SD-WAN topologies, and Fortinet/Cisco security perimeters for corporate clients.",
    requirements: [
      "CCNP / CCIE Enterprise or equivalent certification",
      "Hands-on experience with Cisco Catalyst, Aruba CX, and FortiGate NGFWs",
      "Proficiency in structured cabling designs, fiber optic backbones, and rack elevation planning",
      "Excellent communication and technical presentation skills in Saudi Arabia",
    ],
  },
  {
    id: "cybersecurity-engineer",
    title: "Enterprise Cybersecurity & Firewall Specialist",
    department: "Information Security",
    location: "Dammam / Khobar, KSA",
    type: "Full-Time",
    experience: "3-6 Years",
    description: "Implement and audit zero-trust security perimeters, endpoint protection (EDR), next-generation firewalls, and secure remote access gateways.",
    requirements: [
      "Fortinet NSE 4+ or Palo Alto PCNSA certification",
      "Experience with VPN concentrators, IPS/IDS signatures, and micro-segmentation",
      "Familiarity with NCA (National Cybersecurity Authority) ECC-1:2018 compliance standards",
      "Strong incident analysis and log monitoring capabilities",
    ],
  },
  {
    id: "cctv-elv-engineer",
    title: "CCTV, Access Control & ELV Systems Engineer",
    department: "Physical Security & ELV",
    location: "Dammam / Jubail, KSA",
    type: "Full-Time",
    experience: "3+ Years",
    description: "Lead site surveys, camera placement plans, NVR/storage sizing, and biometric access control installations conforming to HCIS and MOI standards.",
    requirements: [
      "Hands-on experience with Hikvision, CP PLUS, Axis, or Dahua commercial systems",
      "Knowledge of HCIS directives, IP network addressing, and PoE power budgets",
      "Ability to oversee physical cabling contractors and on-site testing/commissioning",
      "Valid Saudi Driver's License preferred",
    ],
  },
  {
    id: "it-sales-manager",
    title: "Enterprise IT Account Executive / Technical Sales",
    department: "Commercial & Business Development",
    location: "Dammam / Riyadh, KSA",
    type: "Full-Time",
    experience: "3-7 Years",
    description: "Drive strategic hardware supply contracts, bill of quantities (BOQ) closures, and IT annual maintenance agreements with Tier-1 contractors and enterprise accounts.",
    requirements: [
      "Proven track record in B2B IT hardware / networking / ELV equipment sales in KSA",
      "Strong established relationships with EPC contractors, industrial facilities, and corporate procurement desks",
      "Solid understanding of vendor partner programs (Cisco, Dell, HP, Fortinet)",
      "Bilingual (Arabic & English) fluency is an advantage",
    ],
  },
];

const JOB_OPENINGS_AR: JobOpening[] = [
  {
    id: "network-architect",
    title: "مهندس أول حلول شبكات وبنية تحتية مؤسسية",
    department: "الأنظمة المؤسسية",
    location: "الدمام، المنطقة الشرقية، المملكة العربية السعودية",
    type: "دوام كامل",
    experience: "5+ سنوات",
    description: "تصميم شبكات مؤسسية فائقة التوافر، وهياكل تحويل الحرم الجامعي، وتصاميم SD-WAN، وحواجز أمان فورتينت وسيسكو للعملاء والجهات الحكومية.",
    requirements: [
      "شهادة CCNP / CCIE Enterprise أو ما يعادلها",
      "خبرة عملية في Cisco Catalyst وAruba CX وجدران الحماية FortiGate NGFW",
      "إتقان تصاميم التمديدات الهيكلية، وكابلات الألياف الضوئية، وتخطيط رفوف الخوادم",
      "مهارات تواصل وعرض فني متميزة في بيئة العمل بالمملكة العربية السعودية",
    ],
  },
  {
    id: "cybersecurity-engineer",
    title: "أخصائي أمن سيبراني وجدران حماية مؤسسية",
    department: "أمن المعلومات",
    location: "الدمام / الخبر، المملكة العربية السعودية",
    type: "دوام كامل",
    experience: "3-6 سنوات",
    description: "تنفيذ وتدقيق محيط أمني قائم على الثقة الصفرية (Zero-Trust)، وحماية النقاط الطرفية (EDR)، وجدران الحماية من الجيل التالي، وبوابات الوصول الآمن عن بعد.",
    requirements: [
      "شهادة Fortinet NSE 4+ أو Palo Alto PCNSA",
      "خبرة في بوابات VPN وتواقيع IPS/IDS والتقسيم الشبكي الدقيق",
      "الإلمام بضوابط الهيئة الوطنية للأمن السيبراني NCA ECC-1:2018",
      "قدرة متميزة على تحليل الحوادث ومراقبة سجلات السيرفرات والأجهزة",
    ],
  },
  {
    id: "cctv-elv-engineer",
    title: "مهندس أنظمة أمنية وكاميرات مراقبة وأنظمة التيار الخفيف (ELV)",
    department: "الأمن الفيزيائي وأنظمة ELV",
    location: "الدمام / الجبيل، المملكة العربية السعودية",
    type: "دوام كامل",
    experience: "3+ سنوات",
    description: "إجراء المسوحات الميدانية، ومخططات توزيع الكاميرات، وحساب سعات التخزين وأجهزة NVR، وتركيب أنظمة التحكم بالدخول الحيوية وفق معايير الهيئة العليا للأمن الصناعي (HCIS).",
    requirements: [
      "خبرة عملية بأنظمة هيكفيجن، سي بي بلس، أكسيس، أو داهوا التجارية",
      "معرفة بتوجيهات HCIS وعناوين شبكات IP وميزانيات طاقة PoE",
      "القدرة على الإشراف على مقاولي التمديدات واختبارات التشغيل الميداني",
      "رخصة قيادة سعودية سارية المفعول ميزة إضافية",
    ],
  },
  {
    id: "it-sales-manager",
    title: "مسؤول مبيعات تقنية وحسابات مؤسسية (IT Account Executive)",
    department: "التطوير التجاري والمبيعات",
    location: "الدمام / الرياض، المملكة العربية السعودية",
    type: "دوام كامل",
    experience: "3-7 سنوات",
    description: "قيادة عقود توريد الأجهزة الاستراتيجية، وإغلاق جداول الكميات (BOQ)، وعقود الصيانة السنوية (AMC) مع مقاولي المشاريع الكبرى والحسابات المؤسسية.",
    requirements: [
      "سجل إنجازات مثبت في مبيعات أجهزة تقنية المعلومات والشبكات وأنظمة ELV في المملكة",
      "علاقات قوية مع مقاولي EPC والمنشآت الصناعية ومكاتب المشتريات المؤسسية",
      "فهم عميق لبرامج الشركاء المصنعين (سيسكو، ديل، إتش بي، فورتينت)",
      "إتقان اللغتين العربية والإنجليزية بطلاقة ميزة مفضلة",
    ],
  },
];

export const CareersPage: React.FC = () => {
  const { language, formatPath } = useLanguage();
  const isAr = language === "ar";
  const jobList = isAr ? JOB_OPENINGS_AR : JOB_OPENINGS_EN;

  const [selectedPosition, setSelectedPosition] = useState<string>(
    isAr ? "مهندس أول حلول شبكات وبنية تحتية مؤسسية" : "Network & Infrastructure Solutions Architect"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = (position: string) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-xs">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to={formatPath("/")} className="hover:text-sky-700 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl-flip" />
            <span className="font-semibold text-slate-900">
              {isAr ? "الوظائف والمهن" : "Careers"}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative theme-hero-luminous text-slate-900 py-14 sm:py-20 lg:py-24 border-b border-slate-200/80 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bar z-20" />
        <div className="absolute inset-0 theme-grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>
              {isAr
                ? "استقطاب الكفاءات · المقر الرئيسي بالدمام"
                : "TALENT ACQUISITION • DAMMAM HEADQUARTERS"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-3xl leading-tight">
            {isAr ? (
              <>اصنع مستقبلك المهني مع <span className="theme-text-gradient">ديسلا للحلول التقنية</span></>
            ) : (
              <>Engineer Your Future at <span className="theme-text-gradient">DEYSLA IT</span></>
            )}
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {isAr
              ? "انضم إلى كوادرنا الهندسية المعتمدة في المملكة العربية السعودية. نقوم بتصميم وتجهيز وحماية البنى التحتية المؤسسية الحيوية ومراكز البيانات والشبكات الصناعية الذكية في كافة أنحاء المملكة."
              : "Join our certified engineering cadre in Saudi Arabia. We design, deploy, and safeguard mission-critical enterprise infrastructures, data centers, and industrial smart networks across the Kingdom."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              <span>
                {isAr ? "رعاية شهادات الاعتماد العالمية" : "OEM Certification Sponsorships"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {isAr ? "مشاريع مؤسسية من المستوى الأول" : "Tier-1 Enterprise Engagements"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>
                {isAr ? "بيئة عمل هندسية تعاونية" : "Collaborative Engineering Culture"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                {isAr ? "الفرص الوظيفية الحالية" : "Current Opportunities"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {isAr ? "الوظائف الهندسية والتجارية المتاحة" : "Open Engineering & Commercial Roles"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {isAr
                  ? "استكشف الفرص الوظيفية المتاحة حالياً في المنطقة الشرقية. يمنح كل دور مساراً للتطوير المهني والعمل على مشاريع بنى تحتية مؤسسية كبرى."
                  : "Explore our current openings in the Eastern Province. Each role offers direct career development and exposure to large-scale enterprise deployments."}
              </p>
            </div>
            <button
              onClick={() => handleApply(isAr ? "طلب توظيف تقني عام" : "General Technical Application")}
              className="self-start md:self-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-sky-400" />
              <span>{isAr ? "تقديم طلب عام" : "Submit General Application"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobList.map((job) => (
              <div
                key={job.id}
                className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 mb-2">
                        {job.department}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {job.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span>&bull;</span>
                    <span>{job.type}</span>
                    <span>&bull;</span>
                    <span>{isAr ? "الخبرة:" : "Experience:"} {job.experience}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {job.description}
                  </p>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                      {isAr ? "أبرز المؤهلات والمتطلبات:" : "Key Qualifications:"}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {isAr ? "توظيف مباشر للمشاريع" : "Fast-track recruitment"}
                  </span>
                  <button
                    onClick={() => handleApply(job.title)}
                    className="px-5 py-2.5 theme-button-primary text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>{isAr ? "التقديم الآن" : "Apply Now"}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Direct CV Box */}
          <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                {isAr ? "لم تجد مسمى وظيفتك بالتحديد؟" : "Don't See Your Exact Role?"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                {isAr ? "أرسل سيرتك الذاتية وملف أعمالك" : "Send Us Your Resume & Portfolio"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr
                  ? "نبحث دوماً عن مهندسين معتمدين، وفنيي ألياف بصرية، ومقدري تكاليف حلول. أرسل سيرتك الذاتية وسيقوم فريق التوظيف بمراجعتها للمشاريع القادمة."
                  : "We are always seeking certified engineers, fiber technicians, and solutions estimators. Submit your CV and our hiring panel will review your credentials for upcoming project contracts."}
              </p>
            </div>
            <button
              onClick={() => handleApply(isAr ? "طلب توظيف هندسي عام" : "General Engineering Application")}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>{isAr ? "إرسال السيرة الذاتية عبر الموقع" : "Submit Your CV Online"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Careers Modal */}
      <CareersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultPosition={selectedPosition}
      />
    </div>
  );
};
