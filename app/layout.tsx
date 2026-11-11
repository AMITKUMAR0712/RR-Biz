import type { Metadata } from "next";
import { CookieConsent } from "@/components/cookie-consent";
import { site } from "@/content/site";
import "react-international-phone/style.css";
import "@/app/admin/admin.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rrbiztech.example";

export const metadata: Metadata = {
  title: "RRBizTech | Business & Digital Solutions in the UAE",
  description: site.description,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "RRBizTech | Business & Digital Solutions in the UAE",
    description: site.description,
    type: "website",
    url: siteUrl,
    images: ["/brand/rrbiztech-logo.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RRBizTech | Business & Digital Solutions in the UAE",
    description: site.description,
    images: ["/brand/rrbiztech-logo.jpeg"],
  },
  icons: { icon: "/brand/rrbiztech-logo.jpeg", apple: "/brand/rrbiztech-logo.jpeg" },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: site.name,
    description: site.description,
    url: siteUrl,
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    ...(site.email.startsWith("[") ? {} : { email: site.email }),
    ...(site.phone.startsWith("[") ? {} : { telephone: site.phone }),
    ...(site.address.startsWith("[") ? {} : { address: site.address }),
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
