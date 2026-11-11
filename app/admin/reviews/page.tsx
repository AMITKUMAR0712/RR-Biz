import { deleteReview, saveReview } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { requireAdministrator } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function ReviewForm({
  review,
}: {
  review?: {
    id: string; displayName: string; role: string | null; quote: string; rating: number | null;
    sourceUrl: string | null; reviewedAt: Date | null; status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    sortOrder: number;
  };
}) {
  return <form action={saveReview}>
    {review && <input type="hidden" name="id" value={review.id} />}
    <div className="admin-form-grid">
      <label className="admin-field">Reviewer display name<input name="displayName" required maxLength={120} defaultValue={review?.displayName ?? ""} /></label>
      <label className="admin-field">Role or context (optional)<input name="role" maxLength={160} defaultValue={review?.role ?? ""} /></label>
      <label className="admin-field admin-field-wide">Review quote<textarea name="quote" required minLength={10} maxLength={3000} defaultValue={review?.quote ?? ""} /><small>Use the review wording faithfully; do not add unverified claims.</small></label>
      <label className="admin-field">Rating (optional)<select name="rating" defaultValue={review?.rating ?? ""}><option value="">Not provided</option>{Array.from({ length: 9 }, (_, index) => (index + 2) / 2).map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select><small>Enter only the rating shown on the verified source.</small></label>
      <label className="admin-field">Review date (optional)<input name="reviewedAt" type="date" defaultValue={review?.reviewedAt?.toISOString().slice(0, 10) ?? ""} /></label>
      <label className="admin-field admin-field-wide">Google review source URL<input name="sourceUrl" type="url" required maxLength={500} placeholder="https://www.google.com/maps/..." defaultValue={review?.sourceUrl ?? ""} /><small>Only google.com or goo.gl source links are accepted.</small></label>
      <label className="admin-field">Publication status<select name="status" defaultValue={review?.status ?? "DRAFT"}><option value="DRAFT">Draft (not public)</option><option value="PUBLISHED">Published and approved</option><option value="ARCHIVED">Archived</option></select></label>
      <label className="admin-field">Sort order<input name="sortOrder" type="number" min={0} max={10000} defaultValue={review?.sortOrder ?? 0} /></label>
    </div>
    <div className="admin-form-actions"><button className="admin-primary" type="submit">{review ? "Save review" : "Add review"}</button></div>
  </form>;
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await requireAdministrator();
  const [reviews, query] = await Promise.all([
    getPrismaClient().testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
    searchParams,
  ]);
  return <AdminShell>
    <div className="admin-page-heading"><div><span className="admin-kicker">CLIENT FEEDBACK</span><h1>Google reviews</h1><p>Add only authentic reviews you have verified. A source link and explicit publication approval are required before display.</p></div></div>
    {query.saved && <p className="admin-message" role="status">Review saved.</p>}
    {query.deleted && <p className="admin-message" role="status">Review deleted.</p>}
    <section className="admin-panel"><h2>Add a verified review</h2><ReviewForm /></section>
    <section className="admin-records" aria-label="Saved reviews">
      {reviews.length === 0 && <p className="admin-empty">No reviews have been added. The public reviews section stays hidden until a review is verified and published.</p>}
      {reviews.map((review) => <details className="admin-record" key={review.id}>
        <summary>{review.displayName}<span>{review.status} · {review.rating ? `${review.rating}/5` : "rating not provided"}</span></summary>
        <div className="admin-record-body">
          <ReviewForm review={review} />
          <form action={deleteReview} className="admin-form-actions"><input type="hidden" name="id" value={review.id} /><button className="admin-danger" type="submit">Delete review</button></form>
        </div>
      </details>)}
    </section>
  </AdminShell>;
}
