import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy | RRBizTech",
  description: "How RRBizTech handles website enquiries and analytics preferences.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const companyName = site.legalName.startsWith("[") ? "RRBizTech" : site.legalName;
  const privacyContact = site.email.startsWith("[") ? "Please update the company email in site settings before launch." : site.email;

  return (
    <InnerPage>
      <main className="legal-page">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
        <div className="container">
          <div className="eyebrow">RRBIZTECH</div>
          <h1>Privacy Policy</h1>
          <p>
            This website is operated by {companyName}. This policy explains how personal information is handled when a
            visitor submits an enquiry, uses contact details, or accepts optional analytics preferences.
          </p>

          <h2>Information you provide</h2>
          <p>
            If you submit an enquiry, we may process the information you provide, including your name, email address,
            phone number, service interest, message, contact method, preferred time, and nationality if supplied. Please
            do not share passport copies, identity documents, bank statements, or other sensitive records through this
            website.
          </p>

          <h2>How enquiries are handled</h2>
          <p>
            Enquiries are routed to the configured inbox using the website’s email delivery settings, and the information is
            used to respond to the request and coordinate the relevant service support. The website is designed to avoid
            collecting unnecessary sensitive information and to request only the details relevant to the enquiry.
          </p>

          <h2>Analytics and cookies</h2>
          <p>
            Optional analytics are disabled unless the visitor explicitly accepts analytics consent. If enabled, this may
            help measure site performance and improve user experience. You can reject analytics through the website
            consent banner at any time.
          </p>

          <h2>Retention and your rights</h2>
          <p>
            Information is retained only for the period needed to respond to enquiries and manage the associated service
            request, unless a longer retention period is required by law or an approved business process. If you need to
            request information, corrections, or deletion, please contact the company using the details below.
          </p>

          <h2>Contact</h2>
          <p>
            Company: {companyName}. Privacy contact: {privacyContact}. If the website details are not yet verified, update
            them in the public site settings before launch.
          </p>
        </div>
      </main>
    </InnerPage>
  );
}
