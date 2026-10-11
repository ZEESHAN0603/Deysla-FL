import React from "react";
import { Link } from "react-router-dom";
import { FileCheck2, Scale, AlertCircle, ChevronRight, CheckCircle2, ShieldCheck, Mail, MapPin } from "lucide-react";
import { COMPANY_DATA } from "../data/company";
import { useLanguage } from "../context/LanguageContext";

export function TermsConditionsPage() {
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
              {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-4 h-4 text-sky-400" />
            <span>
              {isAr ? "اتفاقية التوريد التجاري والخدمات الهندسية" : "Commercial Supply & Engineering Agreement"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {isAr ? "الشروط والأحكام التجارية" : "Terms & Conditions (T&C)"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {isAr
              ? "الشروط والأحكام القياسية لعمليات الشراء، وتوريد الأجهزة، وعروض الأسعار (RFQ)، وخدمات تكامل النظم المقدمة من شركة ديسلا للحلول التقنية."
              : "Standard terms of procurement, hardware distribution, RFQ quotations, and systems integration services provided by DEYSLA IT Solutions."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>{isAr ? "الإصدار: 3.2" : "Version: 3.2"}</span>
            <span>&bull;</span>
            <span>{isAr ? "سارية في المملكة والبحرين والولايات المتحدة" : "Applicable across KSA, Bahrain, and the USA"}</span>
            <span>&bull;</span>
            <span className="text-sky-400 font-semibold">
              {isAr ? "معايير الشركاء المعتمدين من المستوى الأول" : "Tier-1 Authorized Partner Standards"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Executive Overview Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-sky-600" />
              <span>{isAr ? "ملخص الشروط التجارية" : "Commercial Terms Summary"}</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "تحكم هذه الشروط والأحكام كافة العروض الفنية، وعروض الأسعار، وأوامر الشراء، وتوريدات الأجهزة، والاتفاقيات الهندسية المبرمة بين شركة ديسلا للحلول التقنية والعملاء من الشركات والمؤسسات والجهات الحكومية."
                : "These Terms & Conditions govern all proposals, price quotations, purchase orders, hardware deliveries, and engineering agreements between DEYSLA IT Solutions and corporate, institutional, or enterprise clients."}
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "1. عروض الأسعار وصلاحيتها" : "1. Quotations, Pricing & Validity"}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc list-inside">
              <li>
                {isAr
                  ? "تعتبر كافة عروض الأسعار الصادرة عبر بوابة طلب عروض الأسعار لديسلا أو المراسلات الهندسية المباشرة صالحة لمدة ثلاثين (30) يوماً تقويمياً من تاريخ إصدارها ما لم يُنص على خلاف ذلك كتابةً."
                  : "All quotations generated via the DEYSLA RFQ portal or direct engineering correspondence are valid for thirty (30) calendar days from the date of issue, unless otherwise expressly stated in writing."}
              </li>
              <li>
                {isAr
                  ? "تُعرض الأسعار بالريال السعودي (SAR) أو الدينار البحريني (BHD) أو الدولار الأمريكي (USD) بحسب شروط الفوترة الإقليمية. وتُطبق ضريبة القيمة المضافة (VAT) وفق لوائح هيئة الزكاة والضريبة والجمارك (ZATCA)."
                  : "Prices are quoted in Saudi Riyals (SAR), Bahraini Dinars (BHD), or US Dollars (USD) depending on regional billing terms. Applicable Value Added Tax (VAT) is calculated per the regulations of the relevant tax authority (e.g., ZATCA in Saudi Arabia)."}
              </li>
              <li>
                {isAr
                  ? "نظراً لتقلبات سوق أشباه الموصلات والمواد الخام العالمية، قد تتم إعادة تأكيد أسعار المصنع للأجهزة النشطة (مثل محولات الشبكة، بكرات الألياف الضوئية، والخوادم) قبل القبول النهائي لأمر الشراء."
                  : "Due to global semiconductor and raw material fluctuations, factory pricing for active components (such as enterprise switches, fiber optic bulk drums, and servers) may be revalidated prior to formal Purchase Order acceptance."}
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "2. ضمان أصالة الأجهزة والضمان المصنعي" : "2. Authentic Hardware Guarantee & OEM Warranties"}
            </h3>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                {isAr
                  ? "تضمن شركة ديسلا للحلول التقنية أن 100% من المنتجات الموردة هي أجهزة ومعدات أصلية وجديدة تماماً ومحكمة الإغلاق من المصنع، تم توريدها مباشرة من كبرى الشركات العالمية أو قنوات التوزيع الإقليمية المعتمدة."
                  : "DEYSLA IT Solutions guarantees that 100% of products supplied are genuine, brand-new, factory-sealed hardware sourced directly from authorized tier-1 manufacturers or their certified regional distribution channels."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? "الضمانات المصنعية الرسمية" : "Manufacturer Warranties"}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {isAr
                      ? "تحمل كافة المنتجات ضمانات المصنع الرسمية (مثل Cisco Smart Net وFortinet FortiCare وضمان كومسكوب سيستيماكس لمدة 25 عاماً)."
                      : "All products carry official OEM warranties (e.g., Cisco Smart Net, Fortinet FortiCare, CommScope Systimax 25-Year System Warranty)."}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>{isAr ? "التحقق من الرقم التسلسلي" : "Factory Serial Verification"}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {isAr
                      ? "تحمل كل قطعة رقماً تسلسلياً مصنعياً يمكن التحقق منه عبر بوابات المصنع الرسمية لضمان الأصالة ومنع التداول غير المصرح به."
                      : "Every piece of equipment is serialized, verifiable in official manufacturer portals for authenticity and gray-market prevention."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "3. التوصيل والشحن وتصاريح الموقع" : "3. Delivery, Shipping & Site Access"}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc list-inside">
              <li>
                {isAr
                  ? "تُقدر فترات التسليم بناءً على توفر المخزون في مستودعات الدمام أو الشحن المباشر من المصنع. ويتوفر الشحن السريع في نفس اليوم أو اليوم التالي للمدن الرئيسية."
                  : "Delivery timelines are estimated based on local warehouse availability in Dammam or factory dispatch. Expedited same-day or next-day courier delivery is available across major Saudi provinces."}
              </li>
              <li>
                {isAr
                  ? "في مشاريع التمديدات الهيكلية الميدانية، ولحام الألياف الضوئية، وتركيب رفوف الخوادم، يلتزم العميل بتوفير تصاريح السلامة اللازمة (تصاريح عمل أرامكو، تصاريح الدفاع المدني) وتسهيل الدخول خلال الفترات المحددة."
                  : "For on-site structured cabling, fiber splicing, or server rack installations, the client shall ensure necessary safety permits (Aramco work permits, civil defense clearance, site inductions) and unhindered access during scheduled engineering windows."}
              </li>
              <li>
                {isAr
                  ? "تنتقل مسؤولية المخاطر إلى العميل بمجرد التسليم في مقره أو منشأة التجهيز المحددة."
                  : "Risk of loss transfers upon delivery at client premises or designated staging facility."}
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "4. شروط الدفع والفوترة الإلكترونية" : "4. Payment Terms & Invoicing"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "تخضع شروط الدفع للحسابات المعتمدة لأجل 30 يوماً من تاريخ الفاتورة بعد مراجعة الائتمان. وللطلبات الأولى أو العاجلة قد يُطلب دفع مقدم أو اعتماد مستندي (L/C). وتتوافق جميع الفواتير الإلكترونية مع متطلبات المرحلة الثانية لنظام فاتورة (هيئة الزكاة والضريبة والجمارك ZATCA)."
                : "Standard commercial terms for approved corporate accounts are Net 30 days from date of verified invoice, subject to credit underwriting. First-time buyers and urgent hardware supply may require advance payment or irrevocable Letter of Credit (L/C). All e-invoices are fully compliant with Saudi ZATCA FATOORA Phase 2 requirements."}
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "5. الملكية الفكرية والوثائق الهندسية" : "5. Intellectual Property & Engineering Documentation"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "تظل كافة المخططات الهندسية ونتائج اختبارات فحص الألياف (OTDR) واختبارات فلوك (Fluke Versiv) ملكاً حصرياً لديسلا حتى تسوية الحسابات كاملة. وتظل العلامات التجارية العالمية مملوكة لأصحابها الرسميين."
                : "All architectural network diagrams, optical OTDR test results, Fluke Versiv certification traces, and technical implementation proposals created by DEYSLA remain proprietary until full project settlement. Brand marks (Cisco, Fortinet, CommScope, Belden, Schneider, Panduit, etc.) belong to their respective registered trademark owners."}
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "6. حدود المسؤولية والقوة القاهرة" : "6. Limitation of Liability & Force Majeure"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "لا يتحمل أي من الطرفين مسؤولية الأضرار غير المباشرة أو التبعية الناجمة عن انقطاع الاتصالات غير المتوقع أو حظر التوريد الدولي أو ظروف القوة القاهرة الخارجة عن السيطرة المعقولة."
                : "Neither party shall be liable for indirect, incidental, or consequential damages resulting from unforeseen telecommunication outages, international supply embargoes, or force majeure events beyond reasonable commercial control. DEYSLA's maximum cumulative liability shall not exceed the aggregate contract value paid by the client for the specific hardware or engineering phase giving rise to the claim."}
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "7. القانون الواجب التطبيق وتسوية النزاعات" : "7. Governing Law & Dispute Resolution"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "للعقود المبرمة في المملكة العربية السعودية، تخضع هذه الشروط وتُفسر وفقاً للأنظمة المعمول بها في المملكة العربية السعودية. وتختص المحكمة التجارية بالدمام بالفصل في أي نزاع يتعذر حله ودياً."
                : "For contracts executed in Saudi Arabia, these terms are governed by and construed in accordance with the Laws of the Kingdom of Saudi Arabia. Disputes that cannot be amicably settled shall be referred to the competent Commercial Court in Dammam, Eastern Province."}
            </p>
          </div>

          {/* Contact Box */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-start">
              <h4 className="text-base font-bold text-white">
                {isAr ? "هل لديك استفسارات بشأن شروطنا التجارية؟" : "Have Questions Regarding Our Commercial Terms?"}
              </h4>
              <p className="text-xs text-slate-400">
                {isAr
                  ? "تواصل مع فريق العقود التجارية أو اطلب بنود اتفاقية الخدمات الرئيسية (MSA) المخصصة."
                  : "Contact our commercial contracts team or request custom master service agreement (MSA) clauses."}
              </p>
            </div>
            <Link
              to={formatPath("/contact")}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-md"
            >
              {isAr ? "التواصل مع الإدارة القانونية" : "Contact Legal Desk"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
