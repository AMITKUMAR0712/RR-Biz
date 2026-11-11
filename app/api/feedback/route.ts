import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const feedbackSchema = z.object({
  name: z.string().trim().min(2).max(120),
  message: z.string().trim().min(8).max(1200),
  rating: z.coerce.number().int().min(1).max(5),
  honeypot: z.string().max(200).optional(),
  startedAt: z.coerce.number().int().positive(),
}).strict();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const recentSubmissions = new Map<string, number[]>();

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Feedback is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4_000) {
    return NextResponse.json({ error: "Feedback is too long. Please shorten your message." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please submit valid feedback." }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your name and feedback, then try again." }, { status: 400 });
  }
  const data = parsed.data;
  if (data.honeypot) return NextResponse.json({ ok: true, pendingApproval: true }, { status: 201 });

  const elapsed = Date.now() - data.startedAt;
  if (elapsed < 1500 || elapsed > 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Please refresh the form and try again." }, { status: 400 });
  }

  const now = Date.now();
  const key = getClientKey(request);
  const prior = (recentSubmissions.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (prior.length >= MAX_PER_WINDOW) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }
  prior.push(now);
  recentSubmissions.set(key, prior);

  try {
    await getPrismaClient().customerFeedback.create({
      data: { name: data.name, message: data.message, rating: data.rating, status: "DRAFT" },
    });
    return NextResponse.json({ ok: true, pendingApproval: true }, { status: 201 });
  } catch (error) {
    prior.pop();
    recentSubmissions.set(key, prior);
    console.error("Failed to save customer feedback.", error);
    return NextResponse.json({ error: "We could not save your feedback right now. Please try again." }, { status: 503 });
  }
}
