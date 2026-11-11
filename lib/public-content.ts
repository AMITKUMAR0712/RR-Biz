import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { services as fallbackServices, type Service, type ServiceGroup } from "@/content/services";
import { blogGuidesWithServices, type BlogGuide } from "@/content/blogs";
import { site as fallbackSite } from "@/content/site";
import { getPrismaClient } from "@/lib/prisma";

export type PublicSite = {
  name: string;
  legalName: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  url: string;
  stats: typeof fallbackSite.stats;
  testimonials: typeof fallbackSite.testimonials;
  social: typeof fallbackSite.social;
  meetingUrl: string;
  analytics: typeof fallbackSite.analytics;
};

export type PublicReview = {
  id: string;
  quote: string;
  displayName: string;
  role: string | null;
  rating: number | null;
  sourceUrl: string;
  reviewedAt: Date | null;
  isDemo?: boolean;
};

export type PublicFeedback = {
  id: string;
  name: string;
  message: string;
  rating: number | null;
  createdAt: Date;
};

export type PublicService = Omit<Service, "icon"> & {
  metaTitle?: string | null;
  metaDescription?: string | null;
};

function toPublicService(service: Service): PublicService {
  const { icon, ...serializable } = service;
  void icon;
  return serializable;
}
function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) return [];
  return value;
}

function asHelpItems(value: unknown): Service["help"] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is { title: string; description: string } =>
      typeof item === "object" &&
      item !== null &&
      "title" in item &&
      typeof item.title === "string" &&
      "description" in item &&
      typeof item.description === "string",
  );
}

export async function getPublicServices(): Promise<PublicService[]> {
  noStore();
  if (!process.env.DATABASE_URL) return fallbackServices.map(toPublicService);

  const rows = await getPrismaClient().service.findMany({
    where: { status: "PUBLISHED" },
    include: {
      group: true,
      relatedFrom: { include: { related: { select: { slug: true } } } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return rows.map((row) => {
    const groupName = row.group.name as ServiceGroup;
    const original = fallbackServices.find((service) => service.slug === row.slug);
    return {
      slug: row.slug,
      name: row.name,
      group: groupName,
      image: row.ogImage ?? original?.image ?? "/brand/rrbiztech-logo.jpeg",
      shortDescription: row.shortDescription,
      benefit: row.benefit,
      headline: row.headline,
      introduction: row.introduction,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      audience: asStringArray(row.audience),
      help: asHelpItems(row.help),
      process: asStringArray(row.process),
      checklist: asStringArray(row.checklist),
      related: row.relatedFrom.map(({ related }) => related.slug),
    };
  });
}

export async function getPublicService(slug: string): Promise<PublicService | undefined> {
  const published = await getPublicServices();
  return published.find((service) => service.slug === slug);
}

export async function getPublicBlogs(services: PublicService[] = fallbackServices.map(toPublicService)): Promise<(BlogGuide & { service: PublicService })[]> {
  noStore();
  if (!process.env.DATABASE_URL) {
    return blogGuidesWithServices.map((guide) => ({
      ...guide,
      service: toPublicService(guide.service),
    }));
  }

  const rows = await getPrismaClient().blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });
  return rows.flatMap((row) => {
    const service = services.find((item) => item.slug === row.serviceSlug)
      ?? fallbackServices.find((item) => item.slug === row.serviceSlug);
    if (!service) return [];
    return [{
      slug: row.slug,
      category: row.category,
      title: row.title,
      introduction: row.introduction,
      prompts: asStringArray(row.prompts),
      serviceSlug: row.serviceSlug,
      service: { ...service, image: row.image ?? service.image },
    }];
  });
}

export async function getPublicReviews(): Promise<PublicReview[]> {
  noStore();
  if (!process.env.DATABASE_URL) return [];
  const rows = await getPrismaClient().testimonial.findMany({
    where: {
      status: "PUBLISHED",
      approvedAt: { not: null },
      sourceUrl: { not: null },
    },
    orderBy: [{ sortOrder: "asc" }, { reviewedAt: "desc" }],
  });
  return rows.flatMap((row) => row.sourceUrl ? [{
    id: row.id,
    quote: row.quote,
    displayName: row.displayName,
    role: row.role,
    rating: row.rating,
    sourceUrl: row.sourceUrl,
    reviewedAt: row.reviewedAt,
  }] : []);
}

export async function getPublicFeedback(): Promise<PublicFeedback[]> {
  noStore();
  if (!process.env.DATABASE_URL) return [];
  return getPrismaClient().customerFeedback.findMany({
    where: { status: "PUBLISHED", approvedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, name: true, message: true, rating: true, createdAt: true },
  });
}

export async function getPublicSite(): Promise<PublicSite> {
  noStore();
  if (!process.env.DATABASE_URL) return fallbackSite;

  const setting = await getPrismaClient().siteSetting.findUnique({
    where: { key: "site.contact" },
    select: { value: true },
  });
  const value = setting?.value;
  if (typeof value !== "object" || value === null || Array.isArray(value)) return fallbackSite;
  const contact = value as Record<string, unknown>;
  const text = (key: string, fallback: string) => typeof contact[key] === "string" && contact[key] ? contact[key] as string : fallback;
  const socialLinks = Array.isArray(contact.socialLinks)
    ? contact.socialLinks.filter((item): item is { label: string; url: string } =>
        typeof item === "object" &&
        item !== null &&
        "label" in item &&
        typeof item.label === "string" &&
        "url" in item &&
        typeof item.url === "string" &&
        item.url.startsWith("https://"),
      )
    : fallbackSite.social;
  return {
    ...fallbackSite,
    legalName: text("legalName", fallbackSite.legalName),
    phone: text("phone", fallbackSite.phone),
    whatsapp: text("whatsappNumber", fallbackSite.whatsapp),
    email: text("email", fallbackSite.email),
    address: text("verifiedOfficeAddress", fallbackSite.address),
    url: text("domain", fallbackSite.url),
    social: socialLinks,
  };
}
