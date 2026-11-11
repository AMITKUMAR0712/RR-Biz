import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";

export const metadata: Metadata = { title: "Enquiry received | RRBizTech", description: "Your consultation request has been received.", robots: { index: false, follow: false } };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ notification?: string }>;
}) {
  const { notification } = await searchParams;
  return <InnerPage><main><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Thank you" }]} /><section className="thank-you-page container"><span className="thank-you-icon"><Check size={29} /></span><div className="eyebrow">THANK YOU</div><h1>Your enquiry has been received.</h1><p>{notification === "delayed"
    ? "Your request is saved for our team. An email notification could not be sent, but the team can still see your request and will follow up using your preferred contact method."
    : "Our team will follow up using your preferred contact method."} Please do not send sensitive documents by email or through this website.</p><Link className="button button-gold" href="/">Return to the homepage</Link></section></main></InnerPage>;
}
