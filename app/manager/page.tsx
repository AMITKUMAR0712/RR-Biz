import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireManager } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ManagerDashboard() {
  const user = await requireManager();
  const prisma = getPrismaClient();
  const [enquiries, pendingFeedback] = await Promise.all([
    prisma.lead.count({ where: { status: { in: ["NEW", "CONTACTED", "QUALIFIED"] } } }),
    prisma.customerFeedback.count({ where: { status: "DRAFT" } }),
  ]);
  return <AdminShell role={user.role}>
    <div className="admin-page-heading"><div><span className="admin-kicker">OPERATIONS WORKSPACE</span><h1>Welcome, {user.name}</h1><p>Manage enquiries and review customer feedback before it is published.</p></div></div>
    <div className="admin-stats">
      <article><span>Open enquiries</span><strong>{enquiries}</strong></article>
      <article><span>Feedback awaiting review</span><strong>{pendingFeedback}</strong></article>
    </div>
    <section className="admin-panel"><h2>Manager workspace</h2><div className="admin-quicklinks">
      <Link href="/admin/enquiries"><strong>Customer enquiries</strong><span>Review request details and track follow-up status</span></Link>
      <Link href="/admin/feedback"><strong>Feedback approvals</strong><span>Approve feedback to show it on the public site</span></Link>
      <Link href="/admin/audit-logs"><strong>Audit logs</strong><span>Review staff actions and changes</span></Link>
    </div></section>
  </AdminShell>;
}
