import { site } from "@/content/site";

type ContactInfo = { phone: string; whatsapp: string };

export function isPlaceholder(value: string) {
  return !value || value.startsWith("[");
}

export function whatsappUrl(context = "your business needs", contact: ContactInfo = site) {
  if (isPlaceholder(contact.whatsapp)) return "/contact";
  const number = contact.whatsapp.replace(/\D/g, "");
  const message = `Hi RRBizTech, I'm interested in ${context}.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function phoneUrl(contact: ContactInfo = site) {
  return isPlaceholder(contact.phone) ? "/contact" : `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
}
