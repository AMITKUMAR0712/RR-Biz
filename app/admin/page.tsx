import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getPrismaClient } from "@/lib/prisma";
import { requireAdministrator } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await requireAdministrator();
  const prisma = getPrismaClient();
  const [blogs, drafts, reviews, services, enquiries, pendingFeedback] = await Promise.all([
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "DRAFT" } }),
    prisma.testimonial.count({ where: { status: "PUBLISHED", approvedAt: { not: null } } }),
    prisma.service.count({ where: { status: "PUBLISHED" } }),
    prisma.lead.count({ where: { status: { in: ["NEW", "CONTACTED", "QUALIFIED"] } } }),
    prisma.customerFeedback.count({ where: { status: "DRAFT" } }),
  ]);
  return <AdminShell>
    <div className="admin-page-heading"><div><span className="admin-kicker">CONTENT WORKSPACE</span><h1>Welcome, {user.name}</h1><p>Manage the content visitors see across the public site.</p></div></div>
    <div className="admin-stats">
      <article><span>Published services</span><strong>{services}</strong></article>
      <article><span>Published guides</span><strong>{blogs}</strong></article>
      <article><span>Draft guides</span><strong>{drafts}</strong></article>
      <article><span>Approved reviews</span><strong>{reviews}</strong></article>
      <article><span>Open enquiries</span><strong>{enquiries}</strong></article>
      <article><span>Feedback awaiting review</span><strong>{pendingFeedback}</strong></article>
    </div>
    <section className="admin-panel"><h2>Manage your website</h2><div className="admin-quicklinks">
      <Link href="/admin/contact"><strong>Contact details</strong><span>Phone, email, WhatsApp, and verified address</span></Link>
      <Link href="/admin/blogs"><strong>Blogs and guides</strong><span>Create, edit, publish, or archive articles</span></Link>
      <Link href="/admin/reviews"><strong>Google reviews</strong><span>Manage verified review quotes and source links</span></Link>
      <Link href="/admin/services"><strong>Services</strong><span>Edit service pages and publication status</span></Link>
      <Link href="/admin/enquiries"><strong>Enquiries</strong><span>Review customer requests and update their status</span></Link>
      <Link href="/admin/feedback"><strong>Feedback approvals</strong><span>Approve or reject customer feedback before publication</span></Link>
      <Link href="/admin/audit-logs"><strong>Audit logs</strong><span>Review administrative and manager actions</span></Link>
      <Link href="/admin/team"><strong>Team and managers</strong><span>Create or disable manager accounts</span></Link>
    </div></section>
  </AdminShell>;
}
