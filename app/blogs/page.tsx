import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";
import { getPublicBlogs, getPublicServices } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Business Guides & Insights | RRBizTech",
  description:
    "Practical starting points for UAE business setup, bookkeeping, and building a digital presence.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Business Guides & Insights | RRBizTech",
    description: "Practical starting points for business, finance, and digital growth in the UAE.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://rrbiztech.example"}/blogs`,
  },
};

export default async function BlogsPage() {
  const services = await getPublicServices();
  const blogs = await getPublicBlogs(services);
  return (
    <InnerPage context="business and digital insights">
      <main className="insights-page">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights" }]} />
        <section className="insights-hero">
          <div className="container insights-hero-layout">
            <div>
              <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> RRBIZTECH INSIGHTS</div>
              <h1>Useful ideas for<br /><span>your next step.</span></h1>
              <p>Practical starting points for business, finance, and digital growth in the UAE. Clear information to help you prepare your next conversation.</p>
              <Link className="button button-gold" href="#latest-guides">Explore the guides <ArrowRight size={16} /></Link>
            </div>
            <div className="insights-highlight">
              <span>IN THIS COLLECTION</span>
              {blogs.map(({ slug, service }) => (
                <a href={`#${slug}`} key={slug}><span>{service.name}</span><ArrowUpRight size={16} /></a>
              ))}
            </div>
          </div>
        </section>
        <section className="section insights-content" id="latest-guides">
          <div className="container">
            <div className="section-heading insights-heading">
              <div><div className="eyebrow">PRACTICAL STARTING POINTS</div><h2>Ideas for your next step.</h2></div>
              <p>General information only. Requirements, fees, eligibility, and timelines depend on your circumstances and should be verified.</p>
            </div>
            <div className="insights-guides">
              {blogs.map(({ slug, category, title, introduction, prompts, service }) => (
                <article className="insights-guide" id={slug} key={slug}>
                  <div className="insights-guide-image">
                    <Image src={service.image} alt="" fill sizes="(max-width: 760px) 100vw, 460px" />
                    <span>{category}</span>
                  </div>
                  <div className="insights-guide-body">
                    <div className="eyebrow">A PRACTICAL GUIDE</div>
                    <h2>{title}</h2>
                    <p>{introduction}</p>
                    <h3>Questions to consider</h3>
                    <ul>{prompts.map((prompt) => <li key={prompt}><Check size={16} />{prompt}</li>)}</ul>
                    <Link className="text-link" href={`/services/${service.slug}`}>Explore {service.name} <ArrowRight size={15} /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="insights-cta">
          <div className="container insights-cta-inner">
            <div><div className="eyebrow eyebrow-light">NEXT STEPS</div><h2>Have a question about your plans?</h2><p>Tell us what you are working on and we can discuss relevant support.</p></div>
            <Link className="button button-gold" href="/contact">Talk to our team <ArrowUpRight size={16} /></Link>
          </div>
        </section>
      </main>
    </InnerPage>
  );
}
