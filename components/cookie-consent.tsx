"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    const consent = window.localStorage.getItem("rrbiztech-analytics-consent");
    setAccepted(consent === "accepted");
    setVisible(!consent);
  }, []);
  function choose(value: "accepted" | "rejected") {
    window.localStorage.setItem("rrbiztech-analytics-consent", value);
    setAccepted(value === "accepted");
    setVisible(false);
  }
  return <>
    {site.analytics.ga4Id && accepted && <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.analytics.ga4Id)}`} strategy="afterInteractive" />}
    {site.analytics.ga4Id && accepted && <Script id="ga4-consent-bootstrap" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; window.gtag = function(){dataLayer.push(arguments);}; window.gtag('js', new Date()); window.gtag('config', '${site.analytics.ga4Id}');`}</Script>}
    {visible && site.analytics.ga4Id && <aside className="cookie-banner" aria-label="Analytics preferences"><p>We use optional analytics to understand site visits. You can accept or reject analytics cookies.</p><div><button type="button" onClick={() => choose("rejected")}>Reject</button><button className="button button-gold" type="button" onClick={() => choose("accepted")}>Accept analytics</button></div></aside>}
  </>;
}
