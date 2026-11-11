"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { AutoCarousel } from "@/components/auto-carousel";
import type { PublicReview } from "@/lib/public-content";

export function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, rating - index));
        return (
          <span className="review-star" key={index} aria-hidden="true">
            <Star size={15} />
            {fill > 0 && (
              <span className="review-star-fill" style={{ width: `${fill * 100}%` }}>
                <Star size={15} fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
      <span className="review-rating">{rating.toFixed(1)}</span>
    </span>
  );
}

export function GoogleReviews({ reviews }: { reviews: PublicReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="section reviews-section" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-heading reviews-heading">
          <div>
            <div className="eyebrow">GOOGLE REVIEWS</div>
            <h2 id="reviews-title">Feedback from our clients.</h2>
          </div>
          <div className="reviews-heading-action">
            <p>Reviews shown here are selected and verified by our team. Follow each source link to view the original Google review.</p>
            <Link href="/testimonials#share-feedback">Add your feedback</Link>
            <Link href="/testimonials">View all testimonials</Link>
          </div>
        </div>
        {reviews.some((review) => review.isDemo) && (
          <p className="demo-reviews-notice" role="note">
            Demo preview only: these illustrative examples and ratings are fictional, are not customer reviews, and are
            never shown in production.
          </p>
        )}
        <AutoCarousel label="Google reviews" className="reviews-carousel">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              {review.rating && <ReviewStars rating={review.rating} />}
              <blockquote>“{review.quote}”</blockquote>
              <div className="review-attribution">
                <div><strong>{review.displayName}</strong>{review.role && <span>{review.role}</span>}</div>
                {review.sourceUrl && <a href={review.sourceUrl} target="_blank" rel="noreferrer">View on Google</a>}
              </div>
            </article>
          ))}
        </AutoCarousel>
      </div>
    </section>
  );
}
