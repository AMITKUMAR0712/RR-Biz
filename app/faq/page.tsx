import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";
import { faqs } from "@/content/faqs";

export const metadata: Metadata = { title: "Frequently Asked Questions | RRBizTech", description: "Answers to common questions about RRBizTech's UAE business and digital services.", alternates: { canonical: "/faq" } };

export default function FaqPage() {
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <InnerPage><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
    <section className="inner-hero container"><div className="eyebrow">FAQ</div><h1>Questions, answered.</h1><p>Some helpful information before you get in touch.</p></section>
    <section className="container faq-page-list">{faqs.map((faq) => <details className="faq-item" key={faq.question}><summary>{faq.question}<span className="faq-toggle">+</span></summary><p>{faq.answer}</p></details>)}</section>
  </main></InnerPage>;
}
