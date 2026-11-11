"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { whatsappUrl, isPlaceholder } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  quickReplies?: string[];
  serviceLink?: { title: string; href: string };
  isLeadForm?: boolean;
}

const FAQ_KNOWLEDGE_BASE: { keywords: string[]; title: string; response: string; serviceSlug?: string }[] = [
  {
    keywords: ["business setup", "start business", "company formation", "trade license", "mainland", "free zone", "freezone", "llc", "setup"],
    title: "UAE Business Setup",
    response: "In the UAE, business formation typically falls into Mainland (governed by the Department of Economy and Tourism, offering 100% foreign ownership for most commercial and industrial activities and direct local market access) or Free Zone (offering 100% foreign ownership, customs exemptions, and sector-focused ecosystems like IFZA, DMCC, Meydan, or RAKEZ). We guide you through activity selection, initial approvals, trade name reservation, and trade license issuance.",
    serviceSlug: "business-setup",
  },
  {
    keywords: ["golden visa", "visa", "green visa", "investor visa", "employment visa", "residency", "freelance visa", "family visa"],
    title: "UAE Visa Processing Support",
    response: "The UAE offers various residency visas: the 10-Year Golden Visa (for real estate investors with AED 2M+ property, entrepreneurs, executive leaders, and specialized talents), Green Visas for freelancers and skilled professionals, Investor/Partner Visas, and standard Employment and Family Visas. We provide document guidance, medical clearance coordination, and Emirates ID processing support.",
    serviceSlug: "visa-processing-support",
  },
  {
    keywords: ["pro", "pro services", "government", "tasheel", "amer", "mohre", "immigration", "typing", "clearing"],
    title: "PRO Services",
    response: "Our PRO services coordinate routine and specialized government interactions with MOHRE, General Directorate of Residency and Foreigners Affairs (GDRFA), Dubai Municipality, and economic departments. We manage visa quotas, labor contracts, license renewals, and official document submissions.",
    serviceSlug: "pro-services",
  },
  {
    keywords: ["bank", "bank account", "corporate account", "banking", "finance account", "emirates nbd", "mashreq", "wio"],
    title: "Bank Account Assistance",
    response: "Opening a corporate bank account in the UAE involves thorough KYC (Know Your Customer) and compliance scrutiny. Banks evaluate proof of business activities, client/supplier contracts, shareholder background, and physical/substance presence in the UAE. We assist you in preparing documentation to present an organized profile to partner institutions.",
    serviceSlug: "bank-account-assistance",
  },
  {
    keywords: ["accounting", "bookkeeping", "vat", "tax", "corporate tax", "audit", "payroll"],
    title: "Accounting & Bookkeeping",
    response: "UAE businesses must maintain proper accounting records in accordance with IFRS. The UAE levies a 5% VAT (mandatory registration threshold of AED 375,000) and a 9% Federal Corporate Tax on taxable profits exceeding AED 375,000. We provide transaction recording, bank reconciliations, VAT return filing support, and monthly financial reporting.",
    serviceSlug: "accounting-bookkeeping",
  },
  {
    keywords: ["recruit", "recruitment", "hiring", "talent", "staff", "headhunting", "jobs"],
    title: "Recruitment Support",
    response: "Our recruitment services support employers across the UAE in sourcing qualified professionals, executive search, candidate screening, technical assessments, and interview coordination across finance, technology, operations, and management roles.",
    serviceSlug: "recruitment",
  },
  {
    keywords: ["document", "attestation", "translation", "legal translation", "mofa", "apostille", "notary"],
    title: "Document Services",
    response: "We coordinate official document clearing, legal Arabic/English translations, and Ministry of Foreign Affairs (MOFA) attestation for degrees, marriage certificates, birth certificates, board resolutions, and commercial powers of attorney.",
    serviceSlug: "document-services",
  },
  {
    keywords: ["international visa", "travel visa", "schengen", "uk visa", "us visa", "tourist visa"],
    title: "International Visa Support",
    response: "We provide outbound document coordination and appointment guidance for UAE residents traveling abroad, including Schengen member states, the UK, the US, and Canada. Requirements and issuance depend on destination embassies.",
    serviceSlug: "international-visa-support",
  },
  {
    keywords: ["it", "website", "software", "development", "it services", "app", "tech", "automation"],
    title: "IT Services",
    response: "Our digital solutions team builds high-performance corporate websites, web applications, custom CRM integrations, cloud infrastructure, and business workflow automations tailored for UAE enterprises.",
    serviceSlug: "it-services",
  },
  {
    keywords: ["digital marketing", "marketing", "seo", "social media", "ads", "google ads", "branding"],
    title: "Digital Marketing",
    response: "We help brands establish and expand their market presence in Dubai and the GCC through search engine optimization (SEO), targeted Meta/LinkedIn ads, performance advertising, content creation, and corporate brand identity.",
    serviceSlug: "digital-marketing",
  },
];

export function AiChatbot({
  contact = site,
}: {
  contact?: { phone: string; whatsapp: string; name: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptureStep, setLeadCaptureStep] = useState<null | "name" | "phone" | "service">(null);
  const [leadData, setLeadData] = useState({ name: "", phone: "", service: "Business Setup" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-1",
          sender: "bot",
          text: `Hello! I'm the RRBizTech AI Advisory Assistant. How can I assist you with UAE business setup, visas, accounting, or digital solutions today?`,
          quickReplies: [
            "Company Setup in Dubai",
            "Golden Visa Checklist",
            "Bank Account Support",
            "PRO & Document Services",
            "Book a Consultation",
          ],
        },
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Track analytics event
    trackEvent("ai_chat_message", { query: text });

    // Handle lead capture state machine if active
    if (leadCaptureStep) {
      setTimeout(async () => {
        setIsTyping(false);
        if (leadCaptureStep === "name") {
          setLeadData((prev) => ({ ...prev, name: text }));
          setLeadCaptureStep("phone");
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: `Nice to meet you, ${text}! What is your phone number (or WhatsApp number) with country code so our specialist can reach you?`,
            },
          ]);
        } else if (leadCaptureStep === "phone") {
          const updatedLead = { ...leadData, phone: text };
          setLeadData(updatedLead);
          setLeadCaptureStep("service");
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: `Got it. Which service would you like to discuss? (e.g., Business Setup, Golden Visa, Bank Account, Accounting, IT)`,
              quickReplies: [
                "Business Setup",
                "Visa Processing Support",
                "Bank Account Assistance",
                "PRO Services",
                "Accounting & Bookkeeping",
                "IT Services",
              ],
            },
          ]);
        } else if (leadCaptureStep === "service") {
          const finalService = text;
          setLeadData((prev) => ({ ...prev, service: finalService }));
          setLeadCaptureStep(null);

          // Submit to backend enquiry API
          try {
            await fetch("/api/enquiry", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: leadData.name,
                phone: leadData.phone,
                service: finalService,
                message: `Lead generated via AI Chatbot assistant. Customer interest: ${finalService}`,
                contactMethod: "WhatsApp",
                source: "ai-chatbot",
                pagePath: window.location.pathname,
                consent: true,
                startedAt: Date.now() - 3000,
              }),
            });
          } catch (e) {
            console.error("Enquiry submission error:", e);
          }

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: `Thank you, ${leadData.name}! Your request regarding ${finalService} has been forwarded to our Dubai desk. A specialist will reach out to you at ${leadData.phone} shortly.`,
              quickReplies: ["Start Another Question", "Chat on WhatsApp Now"],
            },
          ]);
        }
      }, 700);
      return;
    }

    // Check for consultation/human request
    const lower = text.toLowerCase();
    if (
      lower.includes("consultation") ||
      lower.includes("book") ||
      lower.includes("contact") ||
      lower.includes("call me") ||
      lower.includes("speak to") ||
      lower.includes("talk to") ||
      lower.includes("quote") ||
      lower.includes("apply")
    ) {
      setTimeout(() => {
        setIsTyping(false);
        setLeadCaptureStep("name");
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `I'd be glad to arrange a free consultation with our senior advisory team in Dubai. First, may I know your full name?`,
          },
        ]);
      }, 700);
      return;
    }

    // Match FAQ knowledge base
    const match = FAQ_KNOWLEDGE_BASE.find((item) =>
      item.keywords.some((kw) => lower.includes(kw))
    );

    setTimeout(() => {
      setIsTyping(false);
      if (match) {
        const related = services.find((s) => s.slug === match.serviceSlug);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: match.response,
            serviceLink: related
              ? { title: `View full details on ${related.name}`, href: `/services/${related.slug}` }
              : undefined,
            quickReplies: [
              "Book a Free Consultation",
              "Ask about another service",
              "Chat on WhatsApp",
            ],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `RRBizTech provides 10 corporate services in the UAE across Business Setup, Visa Support, PRO Services, Corporate Banking, Accounting, Recruitment, IT, and Marketing. Would you like to connect with a consultant or explore a specific topic?`,
            quickReplies: [
              "Company Setup in Dubai",
              "Visa Processing Support",
              "Book a Consultation",
              "Chat on WhatsApp",
            ],
          },
        ]);
      }
    }, 800);
  };

  const handleQuickReply = (reply: string) => {
    if (reply === "Chat on WhatsApp" || reply === "Chat on WhatsApp Now") {
      const waUrl = whatsappUrl("consultation enquiry via AI Chatbot", contact);
      window.open(waUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (reply === "Ask about another service" || reply === "Start Another Question") {
      setLeadCaptureStep(null);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "What else would you like to know about UAE business regulations or our corporate services?",
          quickReplies: [
            "Company Setup in Dubai",
            "Golden Visa Checklist",
            "Bank Account Support",
            "VAT & Corporate Tax",
          ],
        },
      ]);
      return;
    }
    handleSend(reply);
  };

  const resetChat = () => {
    setLeadCaptureStep(null);
    setMessages([
      {
        id: "welcome-reset",
        sender: "bot",
        text: `Chat restarted. How can RRBizTech support your business in the UAE today?`,
        quickReplies: [
          "Company Setup in Dubai",
          "Golden Visa Checklist",
          "Bank Account Support",
          "Book a Consultation",
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          type="button"
          className="ai-chat-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open RRBizTech AI Assistant"
        >
          <div className="ai-launcher-icon-wrap">
            <Bot size={24} className="ai-launcher-icon" />
            <span className="ai-pulse-dot" />
          </div>
          <div className="ai-launcher-tooltip">
            <strong>Need UAE Business Advice?</strong>
            <span>Ask our AI Assistant</span>
          </div>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          className="ai-chat-window"
          role="dialog"
          aria-modal="true"
          aria-label="RRBizTech AI Assistant"
        >
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-brand">
              <div className="ai-avatar-badge">
                <Image
                  src="/brand/rrbiztech-logo.jpeg"
                  alt="RRBizTech"
                  width={34}
                  height={34}
                  className="ai-avatar-img"
                />
                <span className="ai-online-indicator" />
              </div>
              <div>
                <h4 className="ai-header-title">RRBizTech AI Assistant</h4>
                <p className="ai-header-status">
                  <span className="status-live-dot" /> Online · UAE Business Guide
                </p>
              </div>
            </div>

            <div className="ai-header-actions">
              <button
                type="button"
                className="ai-header-btn"
                onClick={resetChat}
                title="Restart chat"
                aria-label="Restart chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                className="ai-header-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="ai-disclaimer-strip">
            <Sparkles size={13} className="text-gold" />
            <span>Instant answers for UAE setup, visas &amp; corporate services</span>
          </div>

          {/* Messages Body */}
          <div className="ai-chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-message-row ${msg.sender === "user" ? "user-row" : "bot-row"}`}
              >
                {msg.sender === "bot" && (
                  <div className="ai-msg-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className="ai-msg-content">
                  <div className="ai-bubble">
                    <p>{msg.text}</p>
                    {msg.serviceLink && (
                      <Link
                        href={msg.serviceLink.href}
                        className="ai-bubble-link"
                        onClick={() => setIsOpen(false)}
                      >
                        {msg.serviceLink.title} <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>

                  {/* Quick Reply Pills */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="ai-quick-replies">
                      {msg.quickReplies.map((reply) => (
                        <button
                          key={reply}
                          type="button"
                          className="ai-chip-btn"
                          onClick={() => handleQuickReply(reply)}
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-message-row bot-row">
                <div className="ai-msg-avatar">
                  <Bot size={16} />
                </div>
                <div className="ai-bubble typing-bubble">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick WhatsApp Handoff bar */}
          <div className="ai-whatsapp-handoff">
            <a
              href={whatsappUrl("consultation enquiry via AI Chatbot", contact)}
              target={isPlaceholder(contact.whatsapp) ? undefined : "_blank"}
              rel="noreferrer"
              className="ai-wa-link"
              onClick={() => trackEvent("whatsapp_click", { source: "ai_chatbot" })}
            >
              <MessageCircle size={14} /> Prefer WhatsApp? Chat directly with an advisor <ArrowRight size={12} />
            </a>
          </div>

          {/* Input Form */}
          <form
            className="ai-chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="ai-input"
              placeholder={
                leadCaptureStep === "name"
                  ? "Enter your full name..."
                  : leadCaptureStep === "phone"
                  ? "Enter phone/WhatsApp number..."
                  : "Ask about company setup, visas, banking..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

