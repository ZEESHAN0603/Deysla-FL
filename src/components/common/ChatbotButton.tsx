import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  PhoneCall,
  Mail,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY_DATA } from "../../data/company";
import { useLanguage } from "../../context/LanguageContext";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  quickReplies?: { label: string; action: string }[];
  actionLink?: { label: string; url: string; isExternal?: boolean };
}

interface ChatbotButtonProps {
  isHidden?: boolean;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({ isHidden = false }) => {
  const { language, formatPath } = useLanguage();
  const isAr = language === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialBotGreeting: ChatMessage = {
    id: "welcome-1",
    sender: "bot",
    text: isAr
      ? "أهلاً بك في ديسلا لتقنية المعلومات! 🚀 أنا المساعد الذكي، كيف يمكنني مساعدتك اليوم بخصوص الأجهزة، الحلول، أو عروض الأسعار؟"
      : "Welcome to DEYSLA IT Solutions! 🚀 I'm your virtual assistant. How can I assist you today with hardware supply, IT projects, or quote requests?",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    quickReplies: isAr
      ? [
        { label: "📄 طلب تسعيرة (RFQ)", action: "rfq" },
        { label: "🏷️ العلامات التجارية والوكالات", action: "brands" },
        { label: "🛠️ الخدمات والشبكات", action: "services" },
        { label: "📞 التواصل المباشر", action: "contact" },
      ]
      : [
        { label: "📄 Request a Quote (RFQ)", action: "rfq" },
        { label: "🏷️ Partner Brands", action: "brands" },
        { label: "🛠️ Services & Solutions", action: "services" },
        { label: "📞 Contact DEYSLA", action: "contact" },
      ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialBotGreeting]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  if (isHidden) return null;

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const generateBotResponse = (userText: string, actionKey?: string) => {
    const textLower = userText.toLowerCase();
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setIsTyping(true);

    setTimeout(() => {
      let reply: ChatMessage;

      if (actionKey === "rfq" || textLower.includes("quote") || textLower.includes("rfq") || textLower.includes("سع") || textLower.includes("طلب")) {
        reply = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: isAr
            ? "يمكنك تصفح كتالوج الأجهزة وإضافة المنتجات لسلة التسعيرة الرسمية، أو إرسال متطلبات مشروعك مباشرة لفريق المبيعات الفنية."
            : "You can browse our hardware catalog to add items to your official Request for Quote (RFQ) basket, or submit your bill of quantities directly to our engineering team.",
          timestamp: now,
          actionLink: {
            label: isAr ? "تصفح كتالوج المنتجات" : "Browse Products Catalog",
            url: formatPath("/products"),
          },
          quickReplies: isAr
            ? [
              { label: "🏷️ العلامات التجارية", action: "brands" },
              { label: "📞 التواصل مع المبيعات", action: "contact" },
            ]
            : [
              { label: "🏷️ OEM Brands", action: "brands" },
              { label: "📞 Contact Sales Team", action: "contact" },
            ],
        };
      } else if (actionKey === "brands" || textLower.includes("brand") || textLower.includes("مارك") || textLower.includes("cisco") || textLower.includes("dell") || textLower.includes("fortinet")) {
        reply = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: isAr
            ? "نحن وكلاء وموزعون معتمدون لأكثر من 50 علامة تجارية عالمية تشمل: Cisco, Dell, HP Enterprise, Fortinet, Aruba, Belden, Panduit, Schneider Electric وغيرها."
            : "We are authorized distributors for 50+ global technology brands including Cisco, Dell, HP Enterprise, Fortinet, Aruba, Belden, Panduit, Schneider Electric, and more.",
          timestamp: now,
          actionLink: {
            label: isAr ? "استعراض صفحة العلامات التجارية" : "View Brands Showcase",
            url: formatPath("/brands"),
          },
          quickReplies: isAr
            ? [
              { label: "📄 طلب تسعيرة للماركات", action: "rfq" },
              { label: "📞 اتصال مباشر", action: "contact" },
            ]
            : [
              { label: "📄 Request Brand Quote", action: "rfq" },
              { label: "📞 Direct Contact", action: "contact" },
            ],
        };
      } else if (actionKey === "services" || textLower.includes("service") || textLower.includes("خدم") || textLower.includes("شبك") || textLower.includes("cabling")) {
        reply = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: isAr
            ? "نقدم حلول البنية التحتية المتكاملة: التمديدات الهيكلية للألياف والنحاس، تجهيز مراكز البيانات، الشبكات المؤسسية، أنظمة المراقبة CCTV والتحكم في الدخول، والحلول الصوتية."
            : "We offer end-to-end turnkey services: Structured Cabling (Fiber & Copper), Tier-3 Data Center builds, Enterprise Networking, CCTV & Access Control, and Unified Communications.",
          timestamp: now,
          actionLink: {
            label: isAr ? "استكشاف جميع الخدمات" : "Explore IT Services",
            url: formatPath("/services"),
          },
        };
      } else if (actionKey === "contact" || textLower.includes("contact") || textLower.includes("phone") || textLower.includes("اتصال") || textLower.includes("رقم") || textLower.includes("ايميل")) {
        reply = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: isAr
            ? `يسعدنا اتصالك بنا! 
🏢 المقر: ${COMPANY_DATA.contact.primaryLocation}
📞 الهاتف: ${COMPANY_DATA.contact.phone}
✉️ البريد: ${COMPANY_DATA.contact.email}
ساعات العمل: الأحد - الخميس: 8:00 ص - 5:00 م.`
            : `We are ready to assist you!
🏢 Office: ${COMPANY_DATA.contact.primaryLocation}
📞 Phone: ${COMPANY_DATA.contact.phone}
✉️ Email: ${COMPANY_DATA.contact.email}
Hours: Sunday - Thursday: 8:00 AM - 5:00 PM.`,
          timestamp: now,
          actionLink: {
            label: isAr ? "صفحة اتصل بنا" : "Go to Contact Page",
            url: formatPath("/contact"),
          },
        };
      } else {
        reply = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: isAr
            ? "شكراً لتواصلك! يمكنك استعراض الكتالوج أو اختيار أحد الخيارات السريعة أدناه، أو التحدث مباشرة مع مهندسينا عبر صفحة الاتصال."
            : "Thank you for reaching out! You can explore our catalog or pick a quick topic below, or connect directly with our technical advisors.",
          timestamp: now,
          quickReplies: isAr
            ? [
              { label: "📄 طلب تسعيرة (RFQ)", action: "rfq" },
              { label: "🏷️ العلامات التجارية", action: "brands" },
              { label: "📞 التواصل مع المستشار", action: "contact" },
            ]
            : [
              { label: "📄 Request Quote (RFQ)", action: "rfq" },
              { label: "🏷️ Partner Brands", action: "brands" },
              { label: "📞 Talk to Advisor", action: "contact" },
            ],
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    generateBotResponse(trimmed);
  };

  const handleQuickReply = (action: string, label: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: label,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    generateBotResponse(label, action);
  };

  const handleResetChat = () => {
    setMessages([initialBotGreeting]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          aria-label={isAr ? "افتح المساعد الذكي" : "Open DEYSLA Chatbot"}
          className="fixed bottom-4 end-4 sm:bottom-6 sm:end-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#ff5e00] to-[#0052cc] text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-hidden cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-xs" />
            {hasUnread && (
              <span className="absolute -top-1 -end-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            )}
          </div>
          <div className="text-start hidden sm:block">
            <span className="block text-xs font-bold leading-tight tracking-wide">
              {isAr ? "مساعد ديسلا الذكي" : "DEYSLA Assistant"}
            </span>
            <span className="block text-[10px] text-cyan-200/90 font-mono">
              {isAr ? "متصل الآن · 24/7" : "Online · 24/7"}
            </span>
          </div>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-3 end-3 sm:bottom-6 sm:end-6 z-50 w-[calc(100vw-1.5rem)] sm:w-96 max-h-[85vh] sm:max-h-[600px] h-[540px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
          {/* Chat Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#ff5e00] to-[#0052cc] text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight">
                    {isAr ? "المساعد الذكي لديسلا" : "DEYSLA Virtual Assistant"}
                  </h3>
                  <Sparkles className="w-3 h-3 text-cyan-200" />
                </div>
                <p className="text-[10px] text-cyan-100 font-mono">
                  {isAr ? "استفسارات الأسعار والمنتجات والمشاريع" : "Hardware, RFQs & Enterprise Support"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title={isAr ? "إعادة تعيين المحادثة" : "Reset conversation"}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title={isAr ? "إغلاق" : "Close"}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs sm:text-[13px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff5e00] to-[#0052cc] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 shadow-xs space-y-2 ${msg.sender === "user"
                    ? "bg-gradient-to-r from-[#ff5e00] to-[#0052cc] text-white rounded-br-2xs"
                    : "bg-white border border-slate-200/90 text-slate-800 rounded-bl-2xs"
                    }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Optional Action Link */}
                  {msg.actionLink && (
                    <div className="pt-1">
                      {msg.actionLink.isExternal ? (
                        <a
                          href={msg.actionLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-xs border border-sky-200 transition-colors"
                        >
                          <span>{msg.actionLink.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          to={msg.actionLink.url}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-xs border border-sky-200 transition-colors"
                        >
                          <span>{msg.actionLink.label}</span>
                          <ChevronRight className="w-3 h-3 rtl-flip" />
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Optional Quick Reply Pills */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {msg.quickReplies.map((qr) => (
                        <button
                          key={qr.action}
                          onClick={() => handleQuickReply(qr.action, qr.label)}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300/80 text-[11px] font-medium transition-colors text-start cursor-pointer active:scale-95"
                        >
                          {qr.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] font-mono text-end ${msg.sender === "user" ? "text-white/70" : "text-slate-400"
                      }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff5e00] to-[#0052cc] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-2xs flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Contact Bar */}
          <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
            <span className="text-[10px] text-slate-500 font-mono">
              {isAr ? "دعم مباشر:" : "Direct Channels:"}
            </span>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${COMPANY_DATA.contact.phone}`}
                className="flex items-center gap-1 hover:text-sky-700 transition-colors"
                title={COMPANY_DATA.contact.phone}
              >
                <PhoneCall className="w-3 h-3 text-sky-600" />
                <span>{isAr ? "اتصال" : "Call"}</span>
              </a>
              <a
                href={`mailto:${COMPANY_DATA.contact.email}`}
                className="flex items-center gap-1 hover:text-sky-700 transition-colors"
                title={COMPANY_DATA.contact.email}
              >
                <Mail className="w-3 h-3 text-sky-600" />
                <span>{isAr ? "بريد" : "Email"}</span>
              </a>
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isAr ? "اكتب سؤالك هنا أو اطلب مساعدة..." : "Type your question or request..."}
              className="flex-1 bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:bg-white transition-colors"
              dir="auto"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#ff5e00] to-[#0052cc] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4 rtl-flip" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
