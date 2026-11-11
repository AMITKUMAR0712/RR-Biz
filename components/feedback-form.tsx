"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import type { PublicFeedback } from "@/lib/public-content";
import { ReviewStars } from "@/components/google-reviews";

export function FeedbackForm({ initialFeedback }: { initialFeedback: PublicFeedback[] }) {
  const feedback = initialFeedback;
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [rating, setRating] = useState(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    setSuccess("");
    const form = event.currentTarget;
    if (rating < 1 || rating > 5) {
      setError("Please select a star rating before submitting.");
      setSending(false);
      return;
    }
    const values = new FormData(form);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          message: values.get("message"),
          rating,
          honeypot: values.get("website") ?? "",
          startedAt,
        }),
      });
      const result = await response.json() as { ok?: boolean; pendingApproval?: boolean; error?: string };
      if (!response.ok || !result.ok || !result.pendingApproval) {
        throw new Error(result.error || "We could not save your feedback. Please try again.");
      }
      form.reset();
      setRating(0);
      setSuccess("Thank you — your feedback has been sent to our team for approval.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not save your feedback. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="feedback-content">
      <form className="feedback-form" onSubmit={submit}>
        <label className="honeypot" aria-hidden="true" tabIndex={-1}>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" minLength={2} maxLength={120} placeholder="Your name" required />
        </label>
        <fieldset className="feedback-rating">
          <legend>Your rating</legend>
          <div role="radiogroup" aria-label="Your rating from 1 to 5 stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                className={value <= rating ? "selected" : ""}
                key={value}
                onClick={() => setRating(value)}
              >
                <Star size={24} fill={value <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <span className="sr-only" aria-live="polite">{rating ? `${rating} out of 5 stars selected` : "Select a star rating"}</span>
        </fieldset>
        <label>
          <span>Your feedback</span>
          <textarea name="message" rows={4} minLength={8} maxLength={1200} placeholder="Tell us about your experience" required />
        </label>
        <button className="button button-gold" type="submit" disabled={sending}>
          {sending ? "Submitting..." : "Add your feedback"}
        </button>
        {error && <p className="form-status error" role="alert">{error}</p>}
        {success && <p className="form-status success" role="status">{success}</p>}
      </form>
      <div className="community-feedback-list" aria-live="polite">
        {feedback.length ? feedback.map((item) => (
          <article className="community-feedback-card" key={item.id}>
            {item.rating !== null && <ReviewStars rating={item.rating} />}
            <blockquote>“{item.message}”</blockquote>
            <div className="review-attribution">
              <strong>{item.name}</strong>
              <span>{new Date(item.createdAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </article>
        )) : <p className="testimonials-empty">Be the first to share feedback with us.</p>}
      </div>
    </div>
  );
}
