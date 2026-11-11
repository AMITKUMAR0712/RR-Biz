import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";

export const metadata: Metadata = {
  title: "Disclaimer | RRBizTech",
  description: "Important information about RRBizTech website content and services.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <InnerPage>
      <main className="legal-page">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />
        <div className="container">
          <div className="eyebrow">IMPORTANT INFORMATION</div>
          <h1>Disclaimer</h1>
          <p>
            The content on this website is provided for general information and does not constitute legal, tax,
            immigration, financial, marketing, or other professional advice.
          </p>

          <h2>No guarantees</h2>
          <p>
            RRBizTech does not guarantee a particular outcome, approval, licence, visa result, banking decision,
            recruitment outcome, or marketing performance. Individual results depend on the applicable authority, third-party
            provider, and the facts of each case.
          </p>

          <h2>Verify requirements</h2>
          <p>
            Information may not cover every situation and may change over time. Before acting, please verify the current
            requirements, policies, and procedures relevant to your circumstances.
          </p>

          <h2>Confidential information</h2>
          <p>
            Please do not share sensitive documents or personal information through the contact form. Our team will guide
            users on the secure and appropriate channel for sharing any required materials.
          </p>
        </div>
      </main>
    </InnerPage>
  );
}
