import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EnquiryForm } from "@/components/enquiry-form";
import { InnerPage } from "@/components/inner-page";
import { ServiceViewEvent } from "@/components/service-view-event";
import { faqs } from "@/content/faqs";
import { services } from "@/content/services";
import { isPlaceholder, phoneUrl, whatsappUrl } from "@/lib/contact";
import { getPublicService, getPublicServices, getPublicSite } from "@/lib/public-content";

type Props = { params: Promise<{ slug: string }> };
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rrbiztech.example";

export const dynamicParams = true;

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicService(slug);
  if (!service) return { title: "Service not found | RRBizTech" };
  return {
    title: service.metaTitle || `${service.name} in the UAE | RRBizTech`,
    description: service.metaDescription || service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: `${service.name} | RRBizTech`, description: service.shortDescription, url: `${siteUrl}/services/${service.slug}`, images: [service.image] },
    twitter: { card: "summary_large_image", title: `${service.name} | RRBizTech`, description: service.shortDescription, images: [service.image] },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, publicServices, siteInfo] = await Promise.all([
    getPublicService(slug),
    getPublicServices(),
    getPublicSite(),
  ]);
  if (!service) notFound();
  const related = service.related.map((relatedSlug) => publicServices.find((item) => item.slug === relatedSlug)).filter((item) => item !== undefined);
  const pageFaqs = faqs.slice(0, 4);
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: service.name, description: service.shortDescription, provider: { "@type": "Organization", name: siteInfo.name, url: siteUrl }, areaServed: { "@type": "Country", name: "United Arab Emirates" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: pageFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];
  const wa = whatsappUrl(service.name, siteInfo);
  return <InnerPage context={service.name}><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <ServiceViewEvent service={service.slug} />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.name }]} />
    <section className="service-hero container"><div><div className="eyebrow">{service.group}</div><h1>{service.headline}</h1><p>{service.introduction}</p><a className="button button-gold" href="#service-enquiry">Book a Free Consultation <ArrowRight size={16} /></a></div><div className="service-hero-card"><span className="eyebrow">HOW WE CAN HELP</span><strong>{service.benefit}</strong><p>Support is based on your needs and subject to review of the applicable requirements.</p></div></section>
    <section className="container content-section"><div className="eyebrow">WHO THIS IS FOR</div><h2>Support shaped around your situation.</h2><ul className="check-list">{service.audience.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></section>
    <section className="content-section soft-section"><div className="container"><div className="eyebrow">WHAT WE HELP WITH</div><h2>Practical support, clearly outlined.</h2><div className="detail-grid">{service.help.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div></section>
    <section className="container content-section"><div className="eyebrow">TYPICAL PROCESS</div><h2>What to expect.</h2><ol className="timeline">{service.process.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></section>
    <section className="container content-section checklist-section"><div><div className="eyebrow">PREPARING TO ENQUIRE</div><h2>Indicative document checklist</h2><p>Indicative only and subject to verification for your situation.</p></div><ul className="check-list">{service.checklist.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></section>
    {related.length > 0 && <section className="content-section soft-section"><div className="container"><div className="eyebrow">YOU MAY ALSO NEED</div><h2>Related services</h2><div className="related-list">{related.map((item) => <Link key={item.slug} href={`/services/${item.slug}`}>{item.name}<ArrowRight size={16} /></Link>)}</div></div></section>}
    <section className="container content-section"><div className="eyebrow">COMMON QUESTIONS</div><div className="faq-list">{pageFaqs.map((faq) => <details className="faq-item" key={faq.question}><summary>{faq.question}<span className="faq-toggle">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
    <section className="service-enquiry-section" id="service-enquiry"><div className="container service-enquiry-layout"><div><div className="eyebrow eyebrow-gold">LET’S DISCUSS YOUR NEEDS</div><h2>Ask us about {service.name.toLowerCase()}.</h2><p>Share a short outline and our team can follow up. Please do not share sensitive documents in this form.</p><div className="service-help-links"><a href={wa} target={isPlaceholder(siteInfo.whatsapp) ? undefined : "_blank"} rel="noreferrer">Chat on WhatsApp</a><a href={phoneUrl(siteInfo)}><Phone size={16} /> {siteInfo.phone}</a>{siteInfo.meetingUrl && <a href={siteInfo.meetingUrl} target="_blank" rel="noreferrer">Book a meeting</a>}</div><p className="service-disclaimer">Support does not guarantee approvals or outcomes. Requirements and decisions are determined by the relevant authorities or service providers.</p></div><div className="cta-form-card"><EnquiryForm source={`service-${service.slug}`} serviceName={service.name} serviceNames={publicServices.map((item) => item.name)} /></div></div></section>
  </main></InnerPage>;
}
