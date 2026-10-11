import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, ChevronRight, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { COMPANY_DATA } from "../data/company";
import { useLanguage } from "../context/LanguageContext";

export function PrivacyPolicyPage() {
  const { language, formatPath } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Header */}
      <section className="relative py-14 sm:py-20 bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.18),transparent_75%)] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-4 uppercase tracking-wider">
            <Link to={formatPath("/")} className="hover:text-white transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-3 h-3 rtl-flip" />
            <Link to={formatPath("/about")} className="hover:text-white transition-colors">
              {isAr ? "من نحن" : "About Us"}
            </Link>
            <ChevronRight className="w-3 h-3 rtl-flip" />
            <span className="text-slate-300">
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>
              {isAr
                ? "نظام حماية البيانات الشخصية في المملكة (PDPL) والامتثال الدولي"
                : "KSA Personal Data Protection Law (PDPL) & Global Compliance"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {isAr ? "سياسة الخصوصية وحماية البيانات" : "Privacy Policy"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {isAr
              ? "كيف تحمي شركة ديسلا للحلول التقنية معلوماتكم المؤسسية ومشاريعكم وبياناتكم الشخصية في المملكة العربية السعودية والبحرين والولايات المتحدة."
              : "How DEYSLA IT Solutions protects your corporate, project, and personal information across the Kingdom of Saudi Arabia, Bahrain, and the United States."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>{isAr ? "تاريخ السريان: 1 يناير 2026" : "Effective Date: January 1, 2026"}</span>
            <span>&bull;</span>
            <span>{isAr ? "آخر تحديث: أكتوبر 2026" : "Last Updated: October 2026"}</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-semibold">
              {isAr ? "سرية تامة ومعايير اتفاقيات عدم الإفصاح (NDA)" : "Strict Confidentiality & NDA Standard"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Quick Summary Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-sky-600" />
              <span>
                {isAr ? "التزامنا بالخصوصية لعملائنا المؤسسيين" : "Our Privacy Commitment to Enterprise Clients"}
              </span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "تلتزم شركة ديسلا للحلول التقنية («ديسلا»، أو «نحن») بأعلى معايير الخصوصية والسرية والحماية التقنية. نحن لا نبيع أو نؤجر أو نتربح بأي شكل من استفسارات مشاريعكم، أو جداول المواد والكميات (BOM)، أو بيانات الاتصال، أو البيانات التشغيلية."
                : "DEYSLA IT Solutions (\"DEYSLA\", \"we\", \"our\", or \"us\") is committed to maintaining strict data privacy, confidentiality, and technical protection standards. We do not sell, rent, or monetize your project inquiries, bills of materials (BOM), contact credentials, or telemetry data."}
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "1. المعلومات التي نجمعها" : "1. Information We Collect"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "في سياق تقديم خدمات توريد تقنية المعلومات المؤسسية، وهندسة النظم، وتقديم عروض الأسعار والاستشارات الفنية، نجمع الأنواع التالية من المعلومات:"
                : "In connection with providing enterprise IT distribution, systems engineering, quoting, and technical consultation, we collect the following types of information:"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900">
                  {isAr ? "المعلومات المقدمة مباشرة" : "Directly Provided Information"}
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  <li>{isAr ? "الاسم الكامل، المسمى الوظيفي المؤسسي، واسم الشركة." : "Full name, corporate title, and company name."}</li>
                  <li>{isAr ? "البريد الإلكتروني للعمل، ورقم الهاتف، ومعلومات واتساب." : "Corporate email address, phone number, and WhatsApp contact details."}</li>
                  <li>{isAr ? "جداول الكميات (BOM)، وأرقام القطع، والمواصفات ومتطلبات الموقع." : "Bill of Materials (BOM), part numbers, technical specifications, and site requirements."}</li>
                  <li>{isAr ? "عناوين الفوترة والتسليم للمعدات التجارية الموردة." : "Billing and delivery addresses for commercial equipment fulfillment."}</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900">
                  {isAr ? "المعلومات الفنية وبيانات التصفح" : "Technical & Browsing Information"}
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  <li>{isAr ? "عنوان IP، نوع المتصفح، مواصفات الجهاز ونظام التشغيل." : "IP address, browser type, device specifications, and operating system."}</li>
                  <li>{isAr ? "بيانات التفاعل مع الدليل، استعلامات بحث المنتجات، والتوقيت الزمني للجلسة." : "Catalog interaction data, product search queries, and session timestamps."}</li>
                  <li>{isAr ? "ملفات تعريف الارتباط الضرورية ورموز التخزين المحلي لإدارة طلبات التسعير." : "Essential cookies and local storage tokens for inquiry management."}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "2. كيف نستخدم معلوماتكم" : "2. How We Use Your Information"}
            </h3>
            <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <p>
                {isAr
                  ? "نقوم بمعالجة بيانات العملاء حصرياً للأغراض التجارية المشروعة، بما في ذلك:"
                  : "We process client information solely for lawful, enterprise business operations, including:"}
              </p>
              <div className="space-y-2 pt-1">
                {(isAr
                  ? [
                      "إعداد عروض الأسعار الرسمية والمناقصات والمقترحات الفنية لمنتجات OEM (سيسكو، كومسكوب، فورتينت، بيلدن، وغيرها).",
                      "تنفيذ توريد الأجهزة، وتسجيل الضمانات، ونشر الفرق الهندسية الميدانية في المواقع.",
                      "التواصل بشأن حالات الطلبات، وبلاغات الطوارئ بموجب اتفاقية مستوى الخدمة، وتقارير فحص فلوك (Fluke).",
                      "الامتثال لمتطلبات السجل التجاري والأنظمة المعتمدة من الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).",
                    ]
                  : [
                      "Preparing formal price quotes, tenders, and technical proposals for OEM products (Cisco, CommScope, Fortinet, Belden, etc.).",
                      "Fulfilling hardware distribution, warranty registrations, and on-site engineering deployments.",
                      "Communicating regarding order statuses, SLA emergencies, Fluke certification reports, and technical dispatch.",
                      "Complying with commercial registration requirements and regulations governed by the Saudi Data & AI Authority (SDAIA).",
                    ]
                ).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr
                ? "3. الامتثال لنظام حماية البيانات الشخصية السعودي (PDPL)"
                : "3. Compliance with KSA Personal Data Protection Law (PDPL)"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "وفقاً لنظام حماية البيانات الشخصية الصادر بالمرسوم الملكي رقم (م/19)، تضمن ديسلا التعامل مع كافة البيانات الشخصية للمواطنين والكيانات في المملكة بأعلى درجات الشفافية والمسوغ النظامي وتحديد الغرض. ويتم الاحتفاظ بالبيانات فقط للمدة اللازمة لإتمام المعاملات أو الوفاء بضمانات الشركات المصنعة أو متطلبات المحاسبة النظامية."
                : "In accordance with the Saudi Personal Data Protection Law enacted by Royal Decree No. (M/19), DEYSLA ensures that all personal data of Saudi citizens and corporate entities is handled with paramount transparency, lawful consent, and purpose limitation. Data is retained only for the duration required to complete transactions, fulfill manufacturer warranties, or meet statutory accounting requirements."}
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "4. مشاركة البيانات والإفصاح للأطراف الثالثة" : "4. Data Sharing & Third-Party Disclosures"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "نحن لا نبيع بياناتكم إطلاقاً. نقوم بالإفصاح عن البيانات المؤسسية أو استفسارات الطلبات حصراً إلى:"
                : "We never sell your data. We disclose corporate or inquiry data strictly to:"}
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              <li>
                <strong>{isAr ? "الشركات المصنعة المعتمدة:" : "Authorized Hardware Manufacturers:"}</strong>{" "}
                {isAr
                  ? "لأغراض ترخيص الأرقام التسلسلية الرسمية، وتفعيل عقود الدعم الذكي (Smart Net)، وتسجيل الضمانات (مثل Cisco TAC وFortinet FortiCare)."
                  : "For official serial number licensing, smart-net activations, and warranty registrations (e.g., Cisco TAC, Fortinet FortiCare)."}
              </li>
              <li>
                <strong>{isAr ? "شركاء الخدمات اللوجستية والشحن:" : "Logistics & Freight Partners:"}</strong>{" "}
                {isAr
                  ? "حصرياً لنقل وتسليم المعدات والأجهزة بأمان إلى موقع العميل."
                  : "Exclusively for the secure transportation and delivery of physical equipment to your site."}
              </li>
              <li>
                <strong>{isAr ? "الجهات النظامية والقضائية:" : "Regulatory & Legal Authorities:"}</strong>{" "}
                {isAr
                  ? "عندما يكون ذلك إلزامياً بموجب الأنظمة السعودية أو المعاهدات الدولية السارية."
                  : "Where mandatory under statutory Saudi or international laws."}
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "5. الضمانات الأمنية وحماية البيانات" : "5. Security Safeguards & Data Protection"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "تطبق ديسلا تدابير الأمن السيبراني المعتمدة في القطاع، بما في ذلك التشفير الكامل لنقل البيانات (SSL/TLS)، والتحكم في الوصول القائم على الأدوار، وحماية جدران الحماية، وأنظمة النسخ الاحتياطي المؤسسية. وتُعامل جميع المخططات الهندسية ووثائق المناقصات بموجب اتفاقيات سرية تجارية مشددة (NDAs)."
                : "DEYSLA employs industry-standard cybersecurity measures, including encrypted SSL/TLS transport, role-based access control, firewall protection, and enterprise backup systems. All engineering blueprints and tender documents are treated under strict commercial non-disclosure agreements (NDAs)."}
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "6. حقوقكم والتواصل مع مسؤول الامتثال" : "6. Your Rights & Contacting Our Compliance Officer"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "تحتفظون بحق الوصول إلى سجلات الاتصال الخاصة بكم، أو تصحيحها، أو طلب حذفها في أي وقت. لأي استفسارات تتعلق بالخصوصية، يرجى التواصل مع مسؤول حوكمة البيانات لدينا:"
                : "You maintain the right to access, rectify, or request deletion of your contact records at any time. For privacy inquiries, please contact our Data Governance Officer:"}
            </p>
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300 block">
                      {isAr ? "استفسارات البريد الإلكتروني" : "Email Inquiries"}
                    </span>
                    <a href={`mailto:${COMPANY_DATA.contact.email}`} className="text-white hover:text-sky-300 underline isolate-ltr" dir="ltr">
                      {COMPANY_DATA.contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300 block">
                      {isAr ? "هاتف الإدارة" : "Executive Phone"}
                    </span>
                    <a href={`tel:${COMPANY_DATA.contact.phone}`} className="text-white hover:text-sky-300 isolate-ltr" dir="ltr">
                      {COMPANY_DATA.contact.phoneFormatted}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300 block">
                      {isAr ? "المقر الرئيسي الإقليمي" : "Regional Headquarters"}
                    </span>
                    <span>{isAr ? "الخالدية، الدمام، المملكة العربية السعودية" : "Al Khalidiya, Dammam, KSA"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
