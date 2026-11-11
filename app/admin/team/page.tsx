import { createManager, setManagerStatus } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { requireAdministrator } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireAdministrator();
  const [managers, query] = await Promise.all([
    getPrismaClient().user.findMany({
      where: { role: "MANAGER" },
      select: { id: true, name: true, email: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    searchParams,
  ]);
  return <AdminShell role={user.role}>
    <div className="admin-page-heading"><div><span className="admin-kicker">ACCESS CONTROL</span><h1>Team and managers</h1><p>Only administrators can provision or disable manager accounts.</p></div></div>
    {query.saved && <p className="admin-message" role="status">Manager account updated.</p>}
    <section className="admin-panel">
      <h2>Create a manager account</h2>
      <form action={createManager}>
        <div className="admin-form-grid">
          <label className="admin-field">Manager name<input name="name" required minLength={2} maxLength={160} /></label>
          <label className="admin-field">Email address<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
          <label className="admin-field">Temporary password<input name="password" type="password" required minLength={14} maxLength={128} autoComplete="new-password" /><small>Use a unique password with at least 14 characters and share it securely.</small></label>
        </div>
        <div className="admin-form-actions"><button className="admin-primary" type="submit">Create manager</button></div>
      </form>
    </section>
    <section className="admin-records" aria-label="Manager accounts">
      {managers.map((manager) => <article className="admin-record team-record" key={manager.id}>
        <div><strong>{manager.name}</strong><span>{manager.email} · {manager.status}</span></div>
        <form action={setManagerStatus}>
          <input type="hidden" name="id" value={manager.id} />
          <input type="hidden" name="status" value={manager.status === "ACTIVE" ? "DISABLED" : "ACTIVE"} />
          <button className={manager.status === "ACTIVE" ? "admin-danger" : "admin-secondary"} type="submit">{manager.status === "ACTIVE" ? "Disable account" : "Enable account"}</button>
        </form>
      </article>)}
      {managers.length === 0 && <p className="admin-empty">No manager accounts have been created.</p>}
    </section>
  </AdminShell>;
}
