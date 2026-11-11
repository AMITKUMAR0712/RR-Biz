"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ServiceViewEvent({ service }: { service: string }) {
  useEffect(() => {
    trackEvent("service_view", { service });
  }, [service]);
  return null;
}
