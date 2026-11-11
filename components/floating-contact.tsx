"use client";

import { Phone } from "lucide-react";
import { site } from "@/content/site";
import { isPlaceholder, phoneUrl, whatsappUrl } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";
import { AiChatbot } from "@/components/ai-chatbot";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export function FloatingContact({
  context,
  contact = site,
}: {
  context: string;
  contact?: { phone: string; whatsapp: string; name?: string };
}) {
  const wa = whatsappUrl(context, contact);
  const siteContact = {
    phone: contact.phone,
    whatsapp: contact.whatsapp,
    name: contact.name ?? site.name,
  };

  return (
    <>
      {/* Floating WhatsApp Quick Button */}
      <a
        className="floating-whatsapp"
        href={wa}
        target={isPlaceholder(contact.whatsapp) ? undefined : "_blank"}
        rel="noreferrer"
        aria-label="Chat with RRBizTech on WhatsApp"
        onClick={() => trackEvent("whatsapp_click", { context })}
      >
        <WhatsAppIcon size={27} />
      </a>

      {/* Persistent AI Chatbot Widget */}
      <AiChatbot contact={siteContact} />

      {/* Mobile Bottom Fixed Action Bar */}
      <nav className="mobile-action-bar" aria-label="Quick contact">
        <a
          href={wa}
          target={isPlaceholder(contact.whatsapp) ? undefined : "_blank"}
          rel="noreferrer"
          onClick={() => trackEvent("whatsapp_click", { context })}
        >
          <span className="mobile-action-icon"><WhatsAppIcon size={18} /></span> WhatsApp
        </a>
        <a href={phoneUrl(contact)} onClick={() => trackEvent("call_click")}>
          <span className="mobile-action-icon"><Phone size={17} /></span> Call
        </a>
        <a href="/contact">Enquire</a>
      </nav>
    </>
  );
}
