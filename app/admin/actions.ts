"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { endAdminSession, requireAdministrator, requireManager, startAdminSession } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

const statusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
const leadStatusSchema = z.enum(["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "ARCHIVED"]);
const socialUrlSchema = z.union([z.literal(""), z.string().trim().url().max(500)]).refine(
  (value) => !value || value.startsWith("https://"),
  "Social links must use HTTPS.",
);
const contactSchema = z.object({
  legalName: z.string().trim().max(160),
  phone: z.string().trim().max(40),
  whatsappNumber: z.string().trim().max(30).regex(/^\+?[\d\s()-]*$/),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]),
  verifiedOfficeAddress: z.string().trim().max(500),
  domain: z.union([z.literal(""), z.string().trim().url().max(500)]),
  socialInstagram: socialUrlSchema,
  socialFacebook: socialUrlSchema,
  socialLinkedIn: socialUrlSchema,
  socialYouTube: socialUrlSchema,
});
const blogSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(2).max(100),
  title: z.string().trim().min(5).max(180),
  introduction: z.string().trim().min(20).max(5000),
  prompts: z.string().max(5000),
  serviceSlug: z.string().trim().min(2).max(120),
  image: z.string().trim().max(500).refine((value) => !value || (value.startsWith("/") && !value.startsWith("//"))),
  status: statusSchema,
  sortOrder: z.coerce.number().int().min(0).max(10000),
});
const reviewSchema = z.object({
  id: z.string().optional(),
  displayName: z.string().trim().min(2).max(120),
  role: z.string().trim().max(160),
  quote: z.string().trim().min(10).max(3000),
  rating: z.coerce.number().min(1).max(5).multipleOf(0.5).optional(),
  sourceUrl: z.string().trim().url().max(500),
  reviewedAt: z.string().trim().refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)),
  status: statusSchema,
  sortOrder: z.coerce.number().int().min(0).max(10000),
}).refine(({ sourceUrl }) => {
  const host = new URL(sourceUrl).hostname.toLowerCase();
  return host === "google.com" || host.endsWith(".google.com") || host === "goo.gl" || host.endsWith(".goo.gl");
}, { path: ["sourceUrl"], message: "Provide a Google review URL." });
const serviceSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  groupId: z.string().min(1).max(30),
  name: z.string().trim().min(2).max(120),
  shortDescription: z.string().trim().min(10).max(300),
  benefit: z.string().trim().min(5).max(240),
  headline: z.string().trim().min(5).max(180),
  introduction: z.string().trim().min(20).max(5000),
  audience: z.string().max(5000),
  help: z.string().max(10000),
  process: z.string().max(5000),
  checklist: z.string().max(5000),
  status: statusSchema,
  sortOrder: z.coerce.number().int().min(0).max(10000),
  metaTitle: z.string().trim().max(180),
  metaDescription: z.string().trim().max(320),
  ogImage: z.string().trim().max(500).refine((value) => !value || (value.startsWith("/") && !value.startsWith("//"))),
});

function read(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function lines(text: string): string[] {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function parseHelp(text: string): { title: string; description: string }[] {
  const value: unknown = JSON.parse(text || "[]");
  if (
    !Array.isArray(value) ||
    !value.every((item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.title === "string" &&
      typeof item.description === "string",
    )
  ) {
    throw new Error("Service help must be a JSON array of title and description objects.");
  }
  return value;
}

async function writeAudit(
  actorId: string,
  action: string,
  entityType: string,
  entityId: string | null,
  changes?: Record<string, string>,
): Promise<void> {
  await getPrismaClient().auditEvent.create({
    data: { actorId, action, entityType, entityId, changes },
  });
}

export async function loginAdmin(formData: FormData): Promise<void> {
  const email = read(formData, "email").trim().toLowerCase();
  const password = read(formData, "password");
  if (!z.string().email().safeParse(email).success || password.length < 1) {
    redirect("/admin/login?error=invalid");
  }

  const prisma = getPrismaClient();
  const windowStart = new Date(Math.floor(Date.now() / 900_000) * 900_000);
  const keyHash = createHash("sha256").update(`admin-login:${email}`).digest("hex");
  const attempts = await prisma.rateLimitEntry.upsert({
    where: { keyHash_windowStart: { keyHash, windowStart } },
    update: { hits: { increment: 1 }, expiresAt: new Date(windowStart.getTime() + 900_000) },
    create: { keyHash, windowStart, expiresAt: new Date(windowStart.getTime() + 900_000) },
    select: { hits: true },
  });
  if (attempts.hits > 10) redirect("/admin/login?error=limited");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== "ACTIVE" || !["ADMIN", "MANAGER", "EDITOR"].includes(user.role) || !verifyPassword(password, user.passwordHash)) {
    redirect("/admin/login?error=invalid");
  }

  await prisma.rateLimitEntry.deleteMany({ where: { keyHash } });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await writeAudit(user.id, "auth.login", "User", user.id);
  await startAdminSession(user.id);
  redirect(user.role === "ADMIN" ? "/admin" : "/manager");
}

export async function logoutAdmin(): Promise<void> {
  const actor = await requireManager();
  await writeAudit(actor.id, "auth.logout", "User", actor.id);
  await endAdminSession();
  redirect("/admin/login");
}

export async function saveContactSettings(formData: FormData): Promise<void> {
  const actor = await requireAdministrator();
  const parsed = contactSchema.safeParse({
    legalName: read(formData, "legalName"),
    phone: read(formData, "phone"),
    whatsappNumber: read(formData, "whatsappNumber"),
    email: read(formData, "email"),
    verifiedOfficeAddress: read(formData, "verifiedOfficeAddress"),
    domain: read(formData, "domain"),
    socialInstagram: read(formData, "socialInstagram"),
    socialFacebook: read(formData, "socialFacebook"),
    socialLinkedIn: read(formData, "socialLinkedIn"),
    socialYouTube: read(formData, "socialYouTube"),
  });
  if (!parsed.success) throw new Error("Contact settings are invalid. Review the fields and try again.");

  const { socialInstagram, socialFacebook, socialLinkedIn, socialYouTube, ...contact } = parsed.data;
  const socialLinks = [
    { label: "Instagram", url: socialInstagram },
    { label: "Facebook", url: socialFacebook },
    { label: "LinkedIn", url: socialLinkedIn },
    { label: "YouTube", url: socialYouTube },
  ].filter((link) => link.url);

  const saved = await getPrismaClient().siteSetting.upsert({
    where: { key: "site.contact" },
    update: { value: { ...contact, socialLinks } },
    create: { key: "site.contact", value: { ...contact, socialLinks } },
  });
  await writeAudit(actor.id, "settings.contact.updated", "SiteSetting", saved.id);
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  redirect("/admin/contact?saved=1");
}

export async function saveBlogPost(formData: FormData): Promise<void> {
  const actor = await requireAdministrator();
  const parsed = blogSchema.safeParse({
    id: read(formData, "id") || undefined,
    slug: read(formData, "slug"),
    category: read(formData, "category"),
    title: read(formData, "title"),
    introduction: read(formData, "introduction"),
    prompts: read(formData, "prompts"),
    serviceSlug: read(formData, "serviceSlug"),
    image: read(formData, "image"),
    status: read(formData, "status"),
    sortOrder: read(formData, "sortOrder"),
  });
  if (!parsed.success) throw new Error("Blog details are invalid. Review the fields and try again.");
  const data = {
    slug: parsed.data.slug,
    category: parsed.data.category,
    title: parsed.data.title,
    introduction: parsed.data.introduction,
    prompts: lines(parsed.data.prompts),
    serviceSlug: parsed.data.serviceSlug,
    image: parsed.data.image || null,
    status: parsed.data.status,
    sortOrder: parsed.data.sortOrder,
  };
  const prisma = getPrismaClient();
  const relatedService = await prisma.service.findUnique({ where: { slug: data.serviceSlug }, select: { id: true } });
  if (!relatedService) throw new Error("Select a service that exists in the service manager.");
  const saved = parsed.data.id
    ? await prisma.blogPost.update({ where: { id: parsed.data.id }, data })
    : await prisma.blogPost.create({ data });
  await writeAudit(actor.id, parsed.data.id ? "blog.updated" : "blog.created", "BlogPost", saved.id);
  revalidatePath("/blogs");
  revalidatePath("/");
  redirect("/admin/blogs?saved=1");
}

export async function deleteBlogPost(formData: FormData): Promise<void> {
  const actor = await requireAdministrator();
  const id = z.string().min(1).parse(read(formData, "id"));
  await getPrismaClient().blogPost.delete({ where: { id } });
  await writeAudit(actor.id, "blog.deleted", "BlogPost", id);
  revalidatePath("/blogs");
  revalidatePath("/");
  redirect("/admin/blogs?deleted=1");
}

export async function saveReview(formData: FormData): Promise<void> {
  const actor = await requireAdministrator();
  const ratingText = read(formData, "rating");
  const parsed = reviewSchema.safeParse({
    id: read(formData, "id") || undefined,
    displayName: read(formData, "displayName"),
    role: read(formData, "role"),
    quote: read(formData, "quote"),
    rating: ratingText ? ratingText : undefined,
    sourceUrl: read(formData, "sourceUrl"),
    reviewedAt: read(formData, "reviewedAt"),
    status: read(formData, "status"),
    sortOrder: read(formData, "sortOrder"),
  });
  if (!parsed.success) throw new Error("Review details are invalid. Verify the Google URL and review text.");
  const data = {
    displayName: parsed.data.displayName,
    role: parsed.data.role || null,
    quote: parsed.data.quote,
    rating: parsed.data.rating ?? null,
    sourceUrl: parsed.data.sourceUrl,
    reviewedAt: parsed.data.reviewedAt ? new Date(parsed.data.reviewedAt) : null,
    status: parsed.data.status,
    approvedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    sortOrder: parsed.data.sortOrder,
  };
  const prisma = getPrismaClient();
  const saved = parsed.data.id
    ? await prisma.testimonial.update({ where: { id: parsed.data.id }, data })
    : await prisma.testimonial.create({ data });
  await writeAudit(actor.id, parsed.data.status === "PUBLISHED" ? "review.approved" : "review.saved", "Testimonial", saved.id);
  revalidatePath("/");
  redirect("/admin/reviews?saved=1");
}

export async function deleteReview(formData: FormData): Promise<void> {
  const actor = await requireAdministrator();
  const id = z.string().min(1).parse(read(formData, "id"));
  await getPrismaClient().testimonial.delete({ where: { id } });
  await writeAudit(actor.id, "review.deleted", "Testimonial", id);
  revalidatePath("/");
  redirect("/admin/reviews?deleted=1");
}

export async function saveService(formData: FormData): Promise<void> {
  const actor = await requireAdministrator();
  const parsed = serviceSchema.safeParse({
    id: read(formData, "id") || undefined,
    slug: read(formData, "slug"),
    groupId: read(formData, "groupId"),
    name: read(formData, "name"),
    shortDescription: read(formData, "shortDescription"),
    benefit: read(formData, "benefit"),
    headline: read(formData, "headline"),
    introduction: read(formData, "introduction"),
    audience: read(formData, "audience"),
    help: read(formData, "help"),
    process: read(formData, "process"),
    checklist: read(formData, "checklist"),
    status: read(formData, "status"),
    sortOrder: read(formData, "sortOrder"),
    metaTitle: read(formData, "metaTitle"),
    metaDescription: read(formData, "metaDescription"),
    ogImage: read(formData, "ogImage"),
  });
  if (!parsed.success) throw new Error("Service details are invalid. Review the fields and try again.");
  const prisma = getPrismaClient();
  const group = await prisma.serviceGroup.findUnique({ where: { id: parsed.data.groupId }, select: { id: true } });
  if (!group) throw new Error("Select a valid service group.");
  const data = {
    slug: parsed.data.slug,
    groupId: group.id,
    name: parsed.data.name,
    shortDescription: parsed.data.shortDescription,
    benefit: parsed.data.benefit,
    headline: parsed.data.headline,
    introduction: parsed.data.introduction,
    audience: lines(parsed.data.audience),
    help: parseHelp(parsed.data.help),
    process: lines(parsed.data.process),
    checklist: lines(parsed.data.checklist),
    status: parsed.data.status,
    sortOrder: parsed.data.sortOrder,
    metaTitle: parsed.data.metaTitle || null,
    metaDescription: parsed.data.metaDescription || null,
    ogImage: parsed.data.ogImage || null,
  };
  const saved = parsed.data.id
    ? await prisma.service.update({ where: { id: parsed.data.id }, data })
    : await prisma.service.create({ data });
  await writeAudit(actor.id, parsed.data.id ? "service.updated" : "service.created", "Service", saved.id);
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath(`/services/${data.slug}`);
  redirect("/admin/services?saved=1");
}

export async function deleteService(formData: FormData): Promise<void> {
  const actor = await requireAdministrator();
  const id = z.string().min(1).parse(read(formData, "id"));
  await getPrismaClient().service.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
  await writeAudit(actor.id, "service.archived", "Service", id);
  revalidatePath("/", "layout");
  revalidatePath("/services");
  redirect("/admin/services?archived=1");
}

export async function moderateCustomerFeedback(formData: FormData): Promise<void> {
  const actor = await requireManager();
  const id = z.string().min(1).max(30).parse(read(formData, "id"));
  const status = z.enum(["PUBLISHED", "ARCHIVED"]).parse(read(formData, "status"));
  const feedback = await getPrismaClient().customerFeedback.update({
    where: { id },
    data: {
      status,
      reviewedAt: new Date(),
      approvedAt: status === "PUBLISHED" ? new Date() : null,
    },
    select: { id: true },
  });
  await writeAudit(actor.id, status === "PUBLISHED" ? "feedback.approved" : "feedback.rejected", "CustomerFeedback", feedback.id);
  revalidatePath("/");
  revalidatePath("/testimonials");
  redirect("/admin/feedback?saved=1");
}

export async function updateLeadStatus(formData: FormData): Promise<void> {
  const actor = await requireManager();
  const id = z.string().min(1).max(30).parse(read(formData, "id"));
  const status = leadStatusSchema.parse(read(formData, "status"));
  const prisma = getPrismaClient();
  const previous = await prisma.lead.findUnique({ where: { id }, select: { status: true } });
  if (!previous) throw new Error("The enquiry could not be found.");
  await prisma.lead.update({
    where: { id },
    data: {
      status,
      contactedAt: status === "CONTACTED" ? new Date() : undefined,
    },
  });
  await writeAudit(actor.id, "lead.status.updated", "Lead", id, { from: previous.status, to: status });
  revalidatePath("/admin/enquiries");
  redirect("/admin/enquiries?saved=1");
}

export async function createManager(formData: FormData): Promise<void> {
  const actor = await requireAdministrator();
  const parsed = z.object({
    name: z.string().trim().min(2).max(160),
    email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
    password: z.string().min(14).max(128),
  }).safeParse({
    name: read(formData, "name"),
    email: read(formData, "email"),
    password: read(formData, "password"),
  });
  if (!parsed.success) throw new Error("Enter a valid name, email, and password with at least 14 characters.");
  const manager = await getPrismaClient().user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: hashPassword(parsed.data.password),
      role: "MANAGER",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
    select: { id: true, email: true },
  });
  await writeAudit(actor.id, "staff.manager.created", "User", manager.id);
  revalidatePath("/admin/team");
  redirect("/admin/team?saved=1");
}

export async function setManagerStatus(formData: FormData): Promise<void> {
  const actor = await requireAdministrator();
  const id = z.string().min(1).max(30).parse(read(formData, "id"));
  const status = z.enum(["ACTIVE", "DISABLED"]).parse(read(formData, "status"));
  const manager = await getPrismaClient().user.findUnique({
    where: { id },
    select: { id: true, role: true, status: true },
  });
  if (!manager || manager.role !== "MANAGER") throw new Error("Only manager accounts can be changed here.");
  await getPrismaClient().user.update({ where: { id }, data: { status } });
  await writeAudit(actor.id, "staff.manager.status.updated", "User", id, { from: manager.status, to: status });
  revalidatePath("/admin/team");
  redirect("/admin/team?saved=1");
}
