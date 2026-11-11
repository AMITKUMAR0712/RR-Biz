import { NextRequest, NextResponse } from "next/server";
import { emailLeadService } from "@/lib/lead-service";
import { enquirySchema } from "@/lib/validators";
import { getPublicServices } from "@/lib/public-content";
import { getPrismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recentSubmissions = new Map<string, number[]>();

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Enquiries are temporarily unavailable. Please contact us directly." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_000) {
    return NextResponse.json({ error: "Enquiry is too large. Please shorten your message and try again." }, { status: 413 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please submit a valid enquiry." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
  }

  const data = parsed.data;
  if (data.honeypot) return NextResponse.json({ ok: true });
  const availableServices = await getPublicServices();
  if (!availableServices.some((service) => service.name === data.service)) {
    return NextResponse.json({ error: "Please select one of the listed services." }, { status: 400 });
  }
  const elapsed = Date.now() - data.startedAt;
  if (elapsed < 2500 || elapsed > 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Please refresh the form and try again." }, { status: 400 });
  }

  const now = Date.now();
  const key = getClientKey(request);
  const prior = (recentSubmissions.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (prior.length >= MAX_PER_WINDOW) {
    return NextResponse.json({ error: "Too many enquiries. Please try again later." }, { status: 429 });
  }
  prior.push(now);
  recentSubmissions.set(key, prior);

  let leadId: string;
  try {
    const service = await getPrismaClient().service.findFirst({
      where: { name: data.service, status: "PUBLISHED" },
      select: { id: true },
    });
    const requirement = data.serviceDetail
      ? `${data.message}\n\nService detail: ${data.serviceDetail}`
      : data.message;
    const lead = await getPrismaClient().lead.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        nationality: data.nationality || null,
        requirement,
        preferredContact: data.contactMethod,
        preferredTime: data.preferredTime || null,
        serviceId: service?.id ?? null,
        serviceNameAtSubmit: data.service,
        consentedAt: new Date(),
        sourcePath: data.pagePath || null,
      },
      select: { id: true },
    });
    leadId = lead.id;
  } catch (error) {
    prior.pop();
    recentSubmissions.set(key, prior);
    console.error("Failed to save website enquiry.", error);
    return NextResponse.json({ error: "We could not send your enquiry right now. Please contact us directly." }, { status: 503 });
  }

  try {
    await emailLeadService.submit(data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Enquiry saved, but email notification failed.", error);
    try {
      await getPrismaClient().notification.create({
        data: {
          leadId,
          channel: "EMAIL",
          status: "FAILED",
          template: "lead.admin-notification",
        },
      });
    } catch (notificationError) {
      console.error("Could not record the failed enquiry notification.", notificationError);
    }
    return NextResponse.json({ ok: true, notificationFailed: true });
  }
}
