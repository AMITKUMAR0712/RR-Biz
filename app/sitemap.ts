import type { MetadataRoute } from "next";
import { getPublicServices } from "@/lib/public-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rrbiztech.example";
  const routes = ["/", "/services", "/about", "/blogs", "/testimonials", "/contact", "/faq", "/privacy-policy", "/terms", "/disclaimer"];
  const services = await getPublicServices();
  return [
    ...routes.map((route) => ({ url: new URL(route, siteUrl).toString() })),
    ...services.map((service) => ({ url: new URL(`/services/${service.slug}`, siteUrl).toString() })),
  ];
}
