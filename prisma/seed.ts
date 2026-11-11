import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "../lib/password";
import {
  serviceGroups as contentGroups,
  services as contentServices,
  type ServiceGroup,
} from "../content/services";
import { blogGuides } from "../content/blogs";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be configured before running the seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(databaseUrl),
});

const groupKeyByName: Record<ServiceGroup, string> = {
  "Establish & Operate": "establish-operate",
  "Visas & Mobility": "visas-mobility",
  "Finance & People": "finance-people",
  "Digital Growth": "digital-growth",
};

const groups = contentGroups.map((group, index) => ({
  key: groupKeyByName[group.name],
  name: group.name,
  tagline: group.tagline,
  sortOrder: index + 1,
}));

const faqs = [
  {
    question: "What services does RRBizTech provide?",
    answer:
      "We support business setup, PRO and document services, visa guidance, bookkeeping, recruitment, IT, and digital marketing.",
  },
  {
    question: "Can I ask about more than one service?",
    answer:
      "Yes. Tell us what you are working on and we can discuss the relevant services and next steps with you.",
  },
  {
    question: "How do I get started?",
    answer:
      "Send an enquiry with a brief description of what you need. We will follow up to understand your requirements and share a relevant checklist.",
  },
  {
    question: "Do you guarantee approvals or processing times?",
    answer:
      "No. Decisions and timelines depend on the relevant authorities and individual circumstances. We provide guidance and support, not guarantees.",
  },
  {
    question: "What documents should I send with my enquiry?",
    answer:
      "Please do not send passport copies, identity documents, or bank statements through the public enquiry form. We can explain what information may be needed later through an appropriate channel.",
  },
  {
    question: "Where are your fees and eligibility requirements listed?",
    answer:
      "Fees, requirements, and eligibility vary by service and situation. Contact us to discuss your needs; any applicable details can then be confirmed for your case.",
  },
] as const;

async function main() {
  const groupIds = new Map<string, string>();

  for (const group of groups) {
    const saved = await prisma.serviceGroup.upsert({
      where: { key: group.key },
      update: {},
      create: group,
    });
    groupIds.set(group.key, saved.id);
  }

  const serviceIds = new Map<string, string>();
  for (const [sortOrder, service] of contentServices.entries()) {
    const groupId = groupIds.get(groupKeyByName[service.group]);
    if (!groupId) {
      throw new Error(`Missing seeded service group: ${service.group}`);
    }

    const saved = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        groupId,
        slug: service.slug,
        name: service.name,
        shortDescription: service.shortDescription,
        benefit: service.benefit,
        headline: service.headline,
        introduction: service.introduction,
        audience: service.audience,
        help: service.help,
        process: service.process,
        checklist: service.checklist,
        status: "PUBLISHED",
        sortOrder: sortOrder + 1,
        metaTitle: `${service.name} | RRBizTech`,
        metaDescription: service.shortDescription,
      },
    });
    serviceIds.set(service.slug, saved.id);
  }

  for (const service of contentServices) {
    const serviceId = serviceIds.get(service.slug);
    if (!serviceId) {
      throw new Error(`Missing seeded service: ${service.slug}`);
    }

    for (const relatedSlug of service.related) {
      const relatedId = serviceIds.get(relatedSlug);
      if (!relatedId) {
        throw new Error(`Missing related service: ${relatedSlug}`);
      }

      await prisma.serviceRelation.upsert({
        where: {
          serviceId_relatedId: { serviceId, relatedId },
        },
        update: {},
        create: { serviceId, relatedId },
      });
    }
  }

  for (const [sortOrder, faq] of faqs.entries()) {
    const existing = await prisma.faq.findFirst({
      where: { question: faq.question },
      select: { id: true },
    });
    if (!existing) {
      await prisma.faq.create({
        data: { ...faq, sortOrder: sortOrder + 1, status: "DRAFT" },
      });
    }
  }

  await prisma.siteSetting.upsert({
    where: { key: "site.contact" },
    update: {},
    create: {
      key: "site.contact",
      value: {
        legalName: "",
        phone: "",
        whatsappNumber: "",
        email: "",
        verifiedOfficeAddress: "",
        domain: "",
      },
    },
  });

  for (const [sortOrder, blog] of blogGuides.entries()) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: {},
      create: {
        ...blog,
        prompts: blog.prompts,
        image: null,
        status: "PUBLISHED",
        sortOrder: sortOrder + 1,
        metaTitle: `${blog.title} | RRBizTech`,
        metaDescription: blog.introduction.slice(0, 320),
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail || adminPassword) {
    if (!adminEmail || !adminPassword || adminPassword.length < 14) {
      throw new Error("Set both ADMIN_EMAIL and an ADMIN_PASSWORD of at least 14 characters to provision an admin.");
    }
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        name: "RRBizTech Admin",
        passwordHash: hashPassword(adminPassword),
        role: "ADMIN",
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
      },
    });
  }

  for (const [slug, title] of [
    ["privacy-policy", "Privacy Policy"],
    ["terms", "Terms of Use"],
    ["disclaimer", "Disclaimer"],
  ]) {
    await prisma.contentPage.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title,
        content: { draft: true, sections: [] },
        status: "DRAFT",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error("Database seed failed.", error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
