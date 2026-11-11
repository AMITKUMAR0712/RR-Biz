import type { Metadata } from "next";
import { Star } from "lucide-react";
import { AutoCarousel } from "@/components/auto-carousel";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";
import { ReviewStars } from "@/components/google-reviews";
import { demoTestimonials } from "@/content/demo-testimonials";
import { FeedbackForm } from "@/components/feedback-form";
import { getPublicFeedback, getPublicReviews } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Testimonials | RRBizTech",
  description: "Verified client feedback about RRBizTech services.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const publishedReviews = await getPublicReviews();
  const feedback = await getPublicFeedback();
  const isDemoPreview = publishedReviews.length === 0 && process.env.NODE_ENV === "development";
  const reviews = publishedReviews.length > 0 ? publishedReviews : isDemoPreview ? demoTestimonials : [];

  return (
    <InnerPage>
      <main>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Testimonials" }]} />
        <section className="inner-hero container">
          <div className="eyebrow">CLIENT FEEDBACK</div>
          <h1>Testimonials from verified sources.</h1>
          <p>Published reviews are shown with a link to their original source. We do not publish unverified testimonials.</p>
        </section>
        <section className="section reviews-section testimonials-page-section" aria-labelledby="testimonials-title">
          <div className="container">
            <div className="section-heading reviews-heading">
              <div>
                <div className="eyebrow">VERIFIED GOOGLE REVIEWS</div>
                <h2 id="testimonials-title">Feedback from our clients.</h2>
              </div>
              <p>Ratings and review wording are displayed as recorded from the linked source.</p>
            </div>
            {isDemoPreview && (
              <p className="demo-reviews-notice" role="note">
                Demo preview only: these illustrative examples and ratings are fictional, are not customer reviews, and
                are never shown in production.
              </p>
            )}
            {reviews.length > 0 ? (
              <AutoCarousel label="Verified client testimonials" className="reviews-carousel">
                {reviews.map((review) => (
                  <article className="review-card" key={review.id}>
                    {review.rating !== null && <ReviewStars rating={review.rating} />}
                    <blockquote>“{review.quote}”</blockquote>
                    <div className="review-attribution">
                      <div>
                        <strong>{review.displayName}</strong>
                        {review.role && <span>{review.role}</span>}
                        {review.reviewedAt && <span>{review.reviewedAt.toLocaleDateString("en", { year: "numeric", month: "long" })}</span>}
                      </div>
                      {review.sourceUrl && <a href={review.sourceUrl} target="_blank" rel="noreferrer">
                        <Star size={12} aria-hidden="true" /> View source
                      </a>}
                    </div>
                  </article>
                ))}
              </AutoCarousel>
            ) : (
              <p className="testimonials-empty">
                There are no verified testimonials published yet. Approved reviews will appear here when the team adds
                them through the admin panel.
              </p>
            )}
          </div>
        </section>
        <section className="section customer-feedback-section" id="share-feedback" aria-labelledby="share-feedback-title">
          <div className="container customer-feedback-layout">
            <div className="customer-feedback-intro">
              <div className="eyebrow">YOUR EXPERIENCE MATTERS</div>
              <h2 id="share-feedback-title">Add your feedback.</h2>
              <p>Share a short note about your experience. Feedback is published here after our team reviews it.</p>
            </div>
            <FeedbackForm initialFeedback={feedback} />
          </div>
        </section>
      </main>
    </InnerPage>
  );
}