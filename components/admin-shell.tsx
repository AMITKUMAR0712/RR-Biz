import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";
import type { UserRole } from "@/generated/prisma/client";

export function AdminShell({
  children,
  role = "ADMIN",
}: {
  children: React.ReactNode;
  role?: UserRole;
}) {
  const isManager = role !== "ADMIN";
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link href={isManager ? "/manager" : "/admin"} className="admin-brand">RRBizTech <span>{isManager ? "Manager" : "Admin"}</span></Link>
        <form action={logoutAdmin}><button className="admin-logout" type="submit">Sign out</button></form>
      </header>
      <nav className="admin-nav" aria-label="Admin sections">
        {isManager ? (
          <>
            <Link href="/manager">Overview</Link>
            <Link href="/admin/enquiries">Enquiries</Link>
            <Link href="/admin/feedback">Feedback approvals</Link>
            <Link href="/admin/audit-logs">Audit logs</Link>
          </>
        ) : (
          <>
            <Link href="/admin">Overview</Link>
            <Link href="/admin/enquiries">Enquiries</Link>
            <Link href="/admin/feedback">Feedback approvals</Link>
            <Link href="/admin/audit-logs">Audit logs</Link>
            <Link href="/admin/team">Team</Link>
            <Link href="/admin/contact">Contact details</Link>
            <Link href="/admin/blogs">Blogs</Link>
            <Link href="/admin/reviews">Google reviews</Link>
            <Link href="/admin/services">Services</Link>
          </>
        )}
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
