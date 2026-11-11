import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";
import { aboutContent } from "@/content/site";

export const metadata: Metadata = { title: "About RRBizTech | Business & Digital Solutions", description: "Learn about RRBizTech's mission to help entrepreneurs move forward with practical guidance, technology and effective digital communication.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <InnerPage><main><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
    <section className="inner-hero container"><div className="eyebrow">{aboutContent.hero.eyebrow}</div><h1>{aboutContent.hero.title}</h1><p>{aboutContent.hero.description}</p></section>
    <section className="container content-section about-story"><div className="eyebrow">OUR STORY</div><h2>Helping make the next step clearer.</h2><p className="body-copy">{aboutContent.hero.introduction}</p><p className="body-copy">{aboutContent.hero.focus}</p></section>
    <section className="content-section soft-section"><div className="container"><div className="eyebrow">OUR PURPOSE</div><h2>Mission and vision.</h2><div className="detail-grid about-purpose-grid"><article><h3>Our mission</h3><p>{aboutContent.mission}</p></article><article><h3>Our vision</h3><p>{aboutContent.vision}</p></article></div></div></section>
    <section className="container content-section"><div className="eyebrow">WHY RRBIZTECH?</div><h2>Focused on what helps your business move forward.</h2><div className="detail-grid">{aboutContent.values.map((value) => <article key={value.title}><h3>{value.title}</h3><p>{value.description}</p></article>)}</div></section>
    <section className="content-section soft-section"><div className="container"><div className="eyebrow">{aboutContent.cta.eyebrow}</div><h2>{aboutContent.cta.title}</h2><p className="body-copy">{aboutContent.cta.description}</p><a className="button button-gold" href="/contact">Talk to our team</a></div></section>
  </main></InnerPage>;
}
