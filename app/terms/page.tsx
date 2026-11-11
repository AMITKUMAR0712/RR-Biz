import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";

export const metadata: Metadata = {
  title: "Terms | RRBizTech",
  description: "Website terms for RRBizTech.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <InnerPage>
      <main className="legal-page">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
        <div className="container">
          <div className="eyebrow">WEBSITE INFORMATION</div>
          <h1>Terms</h1>
          <p>These terms apply to access and use of this website and the services described within it.</p>

          <h2>General information only</h2>
          <p>
            The information on this website is intended for general guidance and business information. It does not
            replace case-specific advice, official guidance from authorities, or formal review of your individual situation.
          </p>

          <h2>Service availability and decisions</h2>
          <p>
            Requirements, service availability, fees, timelines, and outcomes may vary depending on the situation,
            jurisdiction, product, or third-party provider involved. Decisions about applications, approvals, pricing,
            and processing remain with the relevant authority, financial institution, or service provider.
          </p>

          <h2>Website use</h2>
          <p>
            You agree to use this website responsibly and to avoid submitting inaccurate, abusive, misleading, or
            unlawful information. Any enquiry submitted through the website should reflect your real intent and contact
            details.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this website or your enquiry, please <Link href="/contact">contact RRBizTech</Link>.
            The company may update these terms as business operations or legal requirements change.
          </p>
        </div>
      </main>
    </InnerPage>
  );
}
