import { AdminShell } from "@/components/admin-shell";
import { requireManager } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const user = await requireManager();
  const events = await getPrismaClient().auditEvent.findMany({
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
  return <AdminShell role={user.role}>
    <div className="admin-page-heading"><div><span className="admin-kicker">ACCOUNTABILITY</span><h1>Audit logs</h1><p>Recent sign-ins, content changes, enquiry updates and feedback decisions.</p></div></div>
    <section className="admin-records audit-records" aria-label="Audit events">
      {events.length === 0 && <p className="admin-empty">No staff actions have been recorded yet.</p>}
      {events.map((event) => <article className="admin-record audit-record" key={event.id}>
        <div><strong>{event.action}</strong><span>{event.createdAt.toLocaleString()}</span></div>
        <p>{event.actor?.name ?? "Deleted account"}{event.actor?.email ? ` · ${event.actor.email}` : ""} · {event.entityType}{event.entityId ? ` · ${event.entityId}` : ""}</p>
        {event.changes && <pre>{JSON.stringify(event.changes, null, 2)}</pre>}
      </article>)}
    </section>
  </AdminShell>;
}
