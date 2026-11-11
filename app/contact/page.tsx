import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EnquiryForm } from "@/components/enquiry-form";
import { InnerPage } from "@/components/inner-page";
import { isPlaceholder, phoneUrl, whatsappUrl } from "@/lib/contact";
import { getPublicServices, getPublicSite } from "@/lib/public-content";

export const metadata: Metadata = { title: "Request a Consultation | Contact RRBizTech", description: "Send RRBizTech a consultation request about business and digital services in the UAE.", alternates: { canonical: "/contact" } };
type Props = { searchParams: Promise<{ service?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { service: slug } = await searchParams;
  const [services, siteInfo] = await Promise.all([getPublicServices(), getPublicSite()]);
  const selected = services.find((item) => item.slug === slug);
  return <InnerPage><main><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
    <section className="inner-hero container"><div className="eyebrow">CONTACT RRBIZTECH</div><h1>Tell us what you need help with.</h1><p>Share a few details to request a consultation. We’ll follow up using your preferred contact method.</p></section>
    <section className="container contact-layout"><div className="cta-form-card" id="contact-form"><h2>Request a consultation</h2><EnquiryForm source="contact" serviceName={selected?.name} serviceNames={services.map((service) => service.name)} /></div><aside className="contact-details"><h2>Prefer to reach us directly?</h2><a href={phoneUrl(siteInfo)}><Phone size={18} /> {siteInfo.phone}</a><a href={whatsappUrl("business services", siteInfo)} target={isPlaceholder(siteInfo.whatsapp) ? undefined : "_blank"} rel="noreferrer">Chat on WhatsApp</a><a href={isPlaceholder(siteInfo.email) ? "#contact-form" : `mailto:${siteInfo.email}`}><Mail size={18} /> {siteInfo.email}</a><p>{siteInfo.address.startsWith("[") ? "Serving enquiries across the UAE" : siteInfo.address}</p><p>Please do not share sensitive documents here. Our team will guide you securely.</p></aside></section>
  </main></InnerPage>;
}
