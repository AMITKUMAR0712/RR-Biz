"use client";

export type AnalyticsEvent =
  | "enquiry_submit"
  | "whatsapp_click"
  | "call_click"
  | "service_view"
  | "ai_chat_message";

export function trackEvent(name: AnalyticsEvent, parameters?: Record<string, string>) {
  if (typeof window === "undefined" || window.localStorage.getItem("rrbiztech-analytics-consent") !== "accepted") return;
  const gtag = (window as Window & { gtag?: (command: string, event: string, data?: Record<string, string>) => void }).gtag;
  gtag?.("event", name, parameters);
}
