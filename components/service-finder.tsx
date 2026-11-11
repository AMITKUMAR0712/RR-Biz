"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { serviceGroups, services, type ServiceGroup } from "@/content/services";
import { homeContent } from "@/content/site";
import type { PublicService } from "@/lib/public-content";

export function ServiceFinder({ serviceList = services }: { serviceList?: PublicService[] }) {
  const [group, setGroup] = useState<ServiceGroup | "">("");
  const [goal, setGoal] = useState("");
  const recommendations = useMemo(() => {
    const filtered = serviceList.filter((service) => !group || service.group === group);
    if (goal.toLowerCase().includes("visa")) return filtered.filter((service) => service.name.toLowerCase().includes("visa"));
    if (goal.toLowerCase().includes("start")) return filtered.filter((service) => ["business-setup", "pro-services"].includes(service.slug));
    if (goal.toLowerCase().includes("hire")) return filtered.filter((service) => service.slug === "recruitment");
    return filtered.slice(0, 3);
  }, [group, goal, serviceList]);
  return <section className="service-finder" aria-labelledby="finder-heading">
    <div className="finder-copy"><div className="eyebrow">{homeContent.serviceFinder.eyebrow}</div><h2 id="finder-heading">{homeContent.serviceFinder.title}</h2><p>{homeContent.serviceFinder.description}</p></div>
    <div className="finder-questions">
      <label><span>{homeContent.serviceFinder.firstQuestion}</span><select value={goal} onChange={(event) => setGoal(event.target.value)}><option value="">Choose a goal</option>{homeContent.serviceFinder.goals.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label><span>{homeContent.serviceFinder.secondQuestion}</span><select value={group} onChange={(event) => setGroup(event.target.value as ServiceGroup | "")}><option value="">Show all service areas</option>{serviceGroups.map((serviceGroup) => <option key={serviceGroup.name}>{serviceGroup.name}</option>)}</select></label>
      {recommendations.length > 0 && <div className="finder-results" aria-live="polite"><strong>Services to explore</strong>{recommendations.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}>{service.name}<ArrowRight size={15} /></Link>)}</div>}
      <Link className="text-link" href={`/contact${recommendations[0] ? `?service=${recommendations[0].slug}` : ""}`}>Ask us for guidance <ArrowRight size={15} /></Link>
    </div>
  </section>;
}
