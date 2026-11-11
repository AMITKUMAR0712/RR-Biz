import { AdminShell } from "@/components/admin-shell";
import { updateLeadStatus } from "@/app/admin/actions";
import { requireManager } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "ARCHIVED"] as const;

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireManager();
  const [leads, query] = await Promise.all([
    getPrismaClient().lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    searchParams,
  ]);
  return <AdminShell role={user.role}>
    <div className="admin-page-heading"><div><span className="admin-kicker">CUSTOMER REQUESTS</span><h1>Enquiries</h1><p>Every enquiry is securely saved here for the team to review and follow up.</p></div></div>
    {query.saved && <p className="admin-message" role="status">Enquiry status updated.</p>}
    <section className="admin-records" aria-label="Customer enquiries">
      {leads.length === 0 && <p className="admin-empty">No enquiries have been received yet.</p>}
      {leads.map((lead) => <details className="admin-record" key={lead.id}>
        <summary>{lead.name}<span>{lead.serviceNameAtSubmit} · {lead.status} · {lead.createdAt.toLocaleString()}</span></summary>
        <div className="admin-record-body enquiry-record-body">
          <dl className="enquiry-details">
            <div><dt>Email</dt><dd>{lead.email || "Not provided"}</dd></div>
            <div><dt>Phone</dt><dd>{lead.phone || "Not provided"}</dd></div>
            <div><dt>Preferred contact</dt><dd>{lead.preferredContact}</dd></div>
            <div><dt>Preferred time</dt><dd>{lead.preferredTime || "Not provided"}</dd></div>
            <div><dt>Nationality</dt><dd>{lead.nationality || "Not provided"}</dd></div>
            <div><dt>Source page</dt><dd>{lead.sourcePath || "Not provided"}</dd></div>
            <div className="enquiry-requirement"><dt>Request</dt><dd>{lead.requirement}</dd></div>
          </dl>
          <form action={updateLeadStatus} className="enquiry-status-form">
            <input type="hidden" name="id" value={lead.id} />
            <label className="admin-field">Update status<select name="status" defaultValue={lead.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            <button className="admin-primary" type="submit">Save status</button>
          </form>
        </div>
      </details>)}
    </section>
  </AdminShell>;
}
