"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { serviceGroups, services, type ServiceGroup } from "@/content/services";
import { ScrollReveal } from "@/components/scroll-reveal";
import { BriefcaseBusiness, Building2, ChartNoAxesCombined, FileText, Globe2, Landmark, Laptop, UsersRound } from "lucide-react";
import type { PublicService } from "@/lib/public-content";

const icons: Record<string, typeof Building2> = {
  "business-setup": Building2,
  "pro-services": BriefcaseBusiness,
  "bank-account-assistance": Landmark,
  "document-services": FileText,
  "visa-processing-support": Globe2,
  "international-visa-support": Globe2,
  "accounting-bookkeeping": ChartNoAxesCombined,
  recruitment: UsersRound,
  "it-services": Laptop,
  "digital-marketing": ChartNoAxesCombined,
};

export function ServicesOverview({ serviceList = services }: { serviceList?: PublicService[] }) {
  const [active, setActive] = useState<ServiceGroup | "All">("All");
  const visible = serviceList.filter((service) => active === "All" || service.group === active);
  return <section className="service-grid-section container">
    <div className="filter-row" aria-label="Filter services"><button className={`filter-chip${active === "All" ? " selected" : ""}`} type="button" aria-pressed={active === "All"} onClick={() => setActive("All")}>All services</button>{serviceGroups.map((group) => <button className={`filter-chip${active === group.name ? " selected" : ""}`} type="button" key={group.name} aria-pressed={active === group.name} onClick={() => setActive(group.name)}>{group.name}</button>)}</div>
    <div className="service-grid">{visible.map((service, index) => { const Icon = icons[service.slug] ?? icons[service.group] ?? Building2; return <ScrollReveal className="service-reveal" delay={(index % 3) * 55} key={service.slug}><article className="service-card overview-card">
      <div className="overview-image"><Image src={service.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
      <div className="service-card-top"><span className="icon-box"><Icon size={21} /></span><span className="service-group">{service.group}</span></div>
      <h2>{service.name}</h2><p>{service.shortDescription}</p><div className="service-benefit">{service.benefit}</div><Link className="text-link" href={`/services/${service.slug}`}>Learn more <ArrowRight size={15} /></Link>
    </article></ScrollReveal>; })}</div>
  </section>;
}
