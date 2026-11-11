"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AutoCarousel } from "@/components/auto-carousel";
import { blogGuidesWithServices } from "@/content/blogs";
import type { BlogGuide } from "@/content/blogs";
import type { PublicService } from "@/lib/public-content";

type BlogWithService = BlogGuide & { service: PublicService };

export function BlogCards({
  preview = false,
  guides = blogGuidesWithServices,
}: {
  preview?: boolean;
  guides?: BlogWithService[];
}) {
  const visibleGuides = preview ? guides.slice(0, 9) : guides;

  return (
    <AutoCarousel label="business guides" className={`blog-list${preview ? " blog-list-preview" : ""}`}>
      {visibleGuides.map(({ slug, category, title, introduction, service }) => (
        <article className="blog-card blog-reveal" key={slug}>
          <Link className="blog-card-image" href={`/services/${service.slug}`} aria-label={`Explore ${service.name}`}>
            <Image src={service.image} alt="" fill sizes="(max-width: 560px) 88vw, (max-width: 900px) 48vw, 380px" />
            <span>{category}</span>
          </Link>
          <div className="blog-card-content">
            <span className="blog-category">{category}</span>
            <h3>{title}</h3>
            <p>{introduction}</p>
            <Link className="text-link" href={`/blogs#${slug}`}>Read the guide <ArrowRight size={15} /></Link>
          </div>
        </article>
      ))}
    </AutoCarousel>
  );
}
