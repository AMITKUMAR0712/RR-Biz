"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application page error", error.digest ?? "unreported");
  }, [error]);
  return <main className="thank-you-page container"><div className="eyebrow">SOMETHING WENT WRONG</div><h1>This page could not be loaded.</h1><p>Please try again. If the issue continues, contact RRBizTech directly.</p><button className="button button-gold" type="button" onClick={() => reset()}>Try again</button></main>;
}
