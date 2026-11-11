import { moderateCustomerFeedback } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { requireManager } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";
import { ReviewStars } from "@/components/google-reviews";

export const dynamic = "force-dynamic";

export default async function CustomerFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireManager();
  const [feedback, query] = await Promise.all([
    getPrismaClient().customerFeedback.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    searchParams,
  ]);
  return <AdminShell role={user.role}>
    <div className="admin-page-heading"><div><span className="admin-kicker">CUSTOMER VOICE</span><h1>Feedback approvals</h1><p>New submissions stay private until approved. Approved feedback appears on the testimonials and home pages.</p></div></div>
    {query.saved && <p className="admin-message" role="status">Feedback decision saved.</p>}
    <section className="admin-records" aria-label="Submitted customer feedback">
      {feedback.length === 0 && <p className="admin-empty">No customer feedback has been submitted yet.</p>}
      {feedback.map((item) => <article className="admin-record feedback-record" key={item.id}>
        <div className="admin-record-summary"><strong>{item.name}</strong><span>{item.status} · submitted {item.createdAt.toLocaleString()}</span></div>
        {item.rating !== null && <div className="feedback-admin-rating"><ReviewStars rating={item.rating} /></div>}
        <blockquote>{item.message}</blockquote>
        {item.status === "DRAFT" ? <div className="admin-form-actions">
          <form action={moderateCustomerFeedback}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="PUBLISHED" /><button className="admin-primary" type="submit">Approve and publish</button></form>
          <form action={moderateCustomerFeedback}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="ARCHIVED" /><button className="admin-danger" type="submit">Reject</button></form>
        </div> : <form action={moderateCustomerFeedback} className="admin-form-actions">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="status" value={item.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED"} />
          <button className={item.status === "PUBLISHED" ? "admin-danger" : "admin-primary"} type="submit">{item.status === "PUBLISHED" ? "Unpublish feedback" : "Approve and publish"}</button>
        </form>}
      </article>)}
    </section>
  </AdminShell>;
}
