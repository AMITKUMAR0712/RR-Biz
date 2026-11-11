"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, X } from "lucide-react";
import { enquirySchema } from "@/lib/validators";
import { trackEvent } from "@/lib/analytics";

export function SupportPopup({ serviceNames }: { serviceNames: string[] }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [notificationFailed, setNotificationFailed] = useState(false);
  const startedAt = useRef(Date.now());
  const dialogRef = useRef<HTMLDivElement>(null);
  const reopenTimerRef = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    if (!success) {
      if (reopenTimerRef.current) window.clearTimeout(reopenTimerRef.current);
      reopenTimerRef.current = window.setTimeout(() => {
        startedAt.current = Date.now();
        setError("");
        setOpen(true);
      }, 5 * 60 * 1000);
    }
  }, [success]);

  useEffect(() => {
    const onScroll = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (pageHeight > 0 && window.scrollY / pageHeight >= 0.2) {
        startedAt.current = Date.now();
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (reopenTimerRef.current) window.clearTimeout(reopenTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const values = new FormData(event.currentTarget);
    const payload = {
      name: values.get("name"),
      email: values.get("email") ?? "",
      phone: values.get("phone") ?? "",
      service: values.get("service"),
      message: "I would like help choosing the right service.",
      contactMethod: values.get("contactMethod"),
      consent: values.get("consent") === "on",
      source: "scroll-support",
      pagePath: window.location.pathname,
      honeypot: values.get("website") ?? "",
      startedAt: startedAt.current,
    };
    const checked = enquirySchema.safeParse(payload);
    if (!checked.success) {
      setError(checked.error.issues[0]?.message ?? "Please check your details and try again.");
      setSending(false);
      return;
    }

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checked.data),
      });
      const result = await response.json() as { ok?: boolean; error?: string; notificationFailed?: boolean };
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not send your request. Please try again.");
      trackEvent("enquiry_submit", { service: String(payload.service) });
      setNotificationFailed(result.notificationFailed === true);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not send your request. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="support-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) close();
    }}>
      <div className="support-modal" role="dialog" aria-modal="true" aria-labelledby="support-modal-title" ref={dialogRef} tabIndex={-1}>
        <button className="support-modal-close" type="button" aria-label="Close support form" onClick={close}><X size={19} /></button>
        <span className="eyebrow">PERSONALIZED SUPPORT</span>
        {success ? (
          <div className="support-success">
            <h2 id="support-modal-title">Thanks — we’ll be in touch.</h2>
            <p>{notificationFailed
              ? "Your request is saved for our team. An email notification could not be sent, but the team can still see your request."
              : "Your support request has been sent to our team."}</p>
            <button type="button" className="button button-gold" onClick={close}>Done</button>
          </div>
        ) : (
          <>
            <h2 id="support-modal-title">Need a hand?</h2>
            <p className="support-modal-intro">Share a few details and our team will help you find the right next step.</p>
            <form className="support-form" onSubmit={submit}>
              <label className="honeypot" aria-hidden="true" tabIndex={-1}>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
              <label><span>Your name</span><input name="name" autoComplete="name" minLength={2} maxLength={120} placeholder="Your name" required /></label>
              <div className="support-form-row">
                <label><span>Phone number</span><input name="phone" type="tel" autoComplete="tel" placeholder="+971 50 123 4567" /></label>
                <label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" /></label>
              </div>
              <label><span>What do you need help with?</span>
                <select name="service" defaultValue="" required>
                  <option value="" disabled>Select a service</option>
                  {serviceNames.map((name) => <option key={name}>{name}</option>)}
                </select>
              </label>
              <label><span>Preferred contact</span><select name="contactMethod" defaultValue="WhatsApp"><option>WhatsApp</option><option>Phone</option><option>Email</option></select></label>
              <label className="support-consent"><input name="consent" type="checkbox" required /><span>I agree to be contacted about this request. See our <a href="/privacy-policy">Privacy Policy</a>.</span></label>
              {error && <p className="form-status error" role="alert">{error}</p>}
              <button className="button button-gold support-submit" type="submit" disabled={sending}>
                {sending ? "Sending..." : "Request support"} <ArrowRight size={16} />
              </button>
              <p className="form-note">Please don’t share sensitive documents here.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
