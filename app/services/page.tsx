import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";
import { ServicesOverview } from "@/components/services-overview";
import { serviceGroups } from "@/content/services";
import { getPublicServices } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Business & Digital Services in the UAE | RRBizTech",
  description: "Explore business setup, visa support, finance, recruitment, IT, and digital marketing services from RRBizTech.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const publicServices = await getPublicServices();
  return <InnerPage><main>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
    <section className="inner-hero container"><div className="eyebrow">HOW WE CAN HELP</div><h1>Business and digital services for your next step.</h1><p>Explore practical support across four service areas. Requirements and next steps depend on your situation.</p></section>
    <section className="container group-intro-grid">{serviceGroups.map((group) => <article key={group.name}><h2>{group.name}</h2><p>{group.tagline}</p></article>)}</section>
    <ServicesOverview serviceList={publicServices} />
  </main></InnerPage>;
}
