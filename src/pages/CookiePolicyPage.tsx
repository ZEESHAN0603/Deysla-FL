import React from "react";
import { Link } from "react-router-dom";
import { Cookie, Shield, Sliders, ChevronRight, CheckCircle2, Lock, Settings2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function CookiePolicyPage() {
  const { language, formatPath } = useLanguage();
  const isAr = language === "ar";

  const handleOpenCookieSettings = () => {
    window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
  };

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
              {isAr ? "سياسة ملفات تعريف الارتباط" : "Cookie Policy"}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cookie className="w-4 h-4 text-sky-400" />
            <span>
              {isAr ? "الشفافية الرقمية وضمانات التتبع" : "Digital Transparency & Tracking Safeguards"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {isAr ? "سياسة ملفات تعريف الارتباط (الكوكيز)" : "Cookie Policy"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {isAr
              ? "تعرّف على كيفية استخدام شركة ديسلا للحلول التقنية لملفات تعريف الارتباط الضرورية، والتخزين المحلي، والتحليلات لتقديم تجارب رقمية مؤسسية عالية الأداء."
              : "Understanding how DEYSLA IT Solutions utilizes essential cookies, session storage, and analytics to deliver high-performance enterprise digital experiences."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>{isAr ? "آخر تحديث: أكتوبر 2026" : "Last Updated: October 2026"}</span>
            <span>&bull;</span>
            <span>{isAr ? "خالٍ تماماً من متتبعات الإعلانات التجارية" : "Zero Third-Party Advertising Trackers"}</span>
            <span>&bull;</span>
            <button
              type="button"
              onClick={handleOpenCookieSettings}
              className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 inline-flex items-center gap-1 cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{isAr ? "إدارة تفضيلات ملفات تعريف الارتباط" : "Manage Cookie Preferences"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Quick Action Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-600" />
                <span>{isAr ? "مركز تفضيلات ملفات تعريف الارتباط المباشر" : "Instant Cookie Preference Center"}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {isAr
                  ? "يمكنك مراجعة أو تخصيص أو إلغاء موافقتك على ملفات تعريف الارتباط في أي وقت."
                  : "You can review, configure, or revoke your cookie preferences at any time."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCookieSettings}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              {isAr ? "فتح مركز التفضيلات" : "Open Preference Center"}
            </button>
          </div>

          {/* Section 1: What Are Cookies */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "1. ما هي ملفات تعريف الارتباط؟" : "1. What Are Cookies?"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "ملفات تعريف الارتباط ورموز التخزين المحلي هي ملفات نصية صغيرة يتم وضعها على متصفحك أو جهازك عند زيارة موقعنا. وهي تتيح للموقع تذكر جلستك (مثل عناصر سلة طلب عروض الأسعار)، والحفاظ على معايير الأمان، وتحسين سرعة تحميل الصفحات أثناء تصفح الدليل."
                : "Cookies and local storage tokens are small text files placed on your browser or device when you visit our website. They enable the website to remember your session (such as product enquiry cart items), preserve security parameters, and optimize page load speeds across catalog navigations."}
            </p>
          </div>

          {/* Section 2: Types of Cookies We Use */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "2. فئات ملفات تعريف الارتباط المستخدمة" : "2. Categories of Cookies Deployed"}
            </h3>

            <div className="space-y-4">
              {/* Category 1 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    {isAr ? "1. ملفات تعريف الارتباط الضرورية للغاية (نشطة دائماً)" : "1. Strictly Necessary Cookies (Always Active)"}
                  </h4>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {isAr ? "إلزامية" : "Mandatory"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isAr
                    ? "تعتبر هذه الملفات ورموز الجلسة ضرورية للغاية للوظائف الأساسية للموقع. فهي تتيح لك إضافة المنتجات إلى سلة جدول الكميات (BOM)، وتذكر عوامل التصفية السريعة، والحفاظ على جلسة التشفير الآمنة SSL. وبدونها، لا يمكن لمحرك عروض الأسعار ودليل المنتجات المؤسسي العمل."
                    : "These cookies and session tokens are strictly required for the core website functionality. They allow you to add items to your RFQ Bill of Materials cart, remember quick filters, and maintain encrypted SSL session state. Without these, our enterprise catalog and quotation engine cannot function."}
                </p>
                <div className="pt-2 text-[11px] text-slate-500 font-mono">
                  {isAr ? "أمثلة:" : "Examples:"} <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 isolate-ltr" dir="ltr">deysla_cart_items</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 isolate-ltr" dir="ltr">deysla_lang</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 isolate-ltr" dir="ltr">deysla_cookie_consent</code>
                </div>
              </div>

              {/* Category 2 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    {isAr ? "2. ملفات تعريف الارتباط للأداء والتحليلات" : "2. Performance & Analytical Cookies"}
                  </h4>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                    {isAr ? "اختيارية" : "Optional"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isAr
                    ? "تجمع هذه الملفات بيانات مجمعة ومجهولة المصدر حول كيفية تصفح الزوار لمنتجاتنا، وأي الفئات تحظى بطلب أعلى (مثل محولات سيسكو كاتاليست مقابل لوحات ألياف كومسكوب)، وسرعة تحميل الصفحات، مما يساعدنا على التحسين المستمر لتجربة الاستخدام."
                    : "These cookies collect aggregated, anonymous data regarding how visitors browse our products, which categories are most in-demand (e.g. Cisco Catalyst switches vs. CommScope fiber optic patch panels), and page load performance. This information helps us continuously improve the platform navigation."}
                </p>
                <div className="pt-2 text-[11px] text-slate-500 font-mono">
                  {isAr ? "الاحتفاظ: 90 يوماً كحد أقصى · مقاييس مجمعة مجهولة المصدر" : "Retention: 90 days maximum · Anonymous aggregate metrics"}
                </div>
              </div>

              {/* Category 3 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    {isAr ? "3. ملفات تعريف الارتباط الوظيفية والتفضيلات" : "3. Functional & Preference Cookies"}
                  </h4>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                    {isAr ? "اختيارية" : "Optional"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isAr
                    ? "تتيح هذه الملفات للموقع تذكر الخيارات التي تحددها، مثل اختيار اللغة المفضلة (العربية / الإنجليزية)، وعرض العملة، أو النشرات الفنية التي تمت معاينتها مؤخراً."
                    : "These allow the website to remember choices you make, such as selected currency display, regional office contact preference, or previously viewed technical datasheets."}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Third Party & Ad Networks */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "3. سياسة خلو الموقع تماماً من الإعلانات التجارية" : "3. Zero Commercial Ad-Tracking Policy"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "على عكس المنصات الاستهلاكية، لا تقوم ديسلا ببيع مساحات إعلانية، أو المشاركة في شبكات التتبع السلوكي، أو مشاركة عادات تصفح المستخدمين مع وسطاء الإعلانات. فمنصتنا مصممة خصيصاً للمشتريات التقنية والاستفسارات الهندسية بين الشركات (B2B)."
                : "Unlike consumer platforms, DEYSLA IT Solutions does not sell ad space, participate in behavioral tracking networks, or share user browsing habits with third-party advertising brokers. Our digital platforms are strictly designed for professional B2B IT procurement and technical engineering inquiries."}
            </p>
          </div>

          {/* Section 4: Browser Management */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "4. إدارة ملفات تعريف الارتباط في متصفحك" : "4. Managing Cookies in Your Browser"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr
                ? "بالإضافة إلى مركز التفضيلات في موقعنا، يمكنك تعديل إعدادات ملفات تعريف الارتباط في متصفحك (كروم، سفاري، إيدج، فايرفوكس). ويُرجى ملاحظة أن التعطيل الكامل للتخزين المحلي قد يمنع درج طلب عروض الأسعار من حفظ قائمة الأجهزة المحددة."
                : "In addition to our on-site Preference Center, you can modify your cookie settings in your browser settings (Chrome, Safari, Edge, Firefox). Please note that completely disabling local storage or essential cookies may prevent the RFQ quotation drawer from storing your selected equipment list."}
            </p>
          </div>

          {/* Section 5: Inquiries */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAr ? "5. الأسئلة والاستفسارات" : "5. Questions Regarding Cookies"}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isAr ? (
                <>
                  إذا كان لديك أي أسئلة حول استخدامنا لملفات تعريف الارتباط أو ممارسات البيانات، يُرجى مراسلة مكتب أمن المعلومات لدينا عبر{" "}
                  <a href="mailto:info@sa.deysla.com" className="text-sky-600 hover:underline font-semibold isolate-ltr" dir="ltr">
                    info@sa.deysla.com
                  </a>{" "}
                  أو الاتصال بمكتبنا الإقليمي بالدمام على{" "}
                  <a href="tel:+966544553670" className="text-sky-600 hover:underline font-semibold isolate-ltr" dir="ltr">
                    +966-544553670
                  </a>.
                </>
              ) : (
                <>
                  If you have questions about our cookie usage or data practices, please email our IT security desk at{" "}
                  <a href="mailto:info@sa.deysla.com" className="text-sky-600 hover:underline font-semibold">
                    info@sa.deysla.com
                  </a>{" "}
                  or call our regional Dammam office at{" "}
                  <a href="tel:+966544553670" className="text-sky-600 hover:underline font-semibold">
                    +966-544553670
                  </a>.
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
