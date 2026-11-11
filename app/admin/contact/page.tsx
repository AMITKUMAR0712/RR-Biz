import { saveContactSettings } from "@/app/admin/actions";
import { requireAdministrator } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

function text(value: unknown, key: string): string {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return "";
  const entry = (value as Record<string, unknown>)[key];
  return typeof entry === "string" ? entry : "";
}

function socialUrl(value: unknown, label: string): string {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return "";
  const links = (value as Record<string, unknown>).socialLinks;
  if (!Array.isArray(links)) return "";
  const link = links.find((item) => typeof item === "object" && item !== null && "label" in item && item.label === label);
  return link && typeof link === "object" && "url" in link && typeof link.url === "string" ? link.url : "";
}

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdministrator();
  const [setting, query] = await Promise.all([
    getPrismaClient().siteSetting.findUnique({ where: { key: "site.contact" }, select: { value: true } }),
    searchParams,
  ]);
  const value = setting?.value;
  return <AdminShell>
    <div className="admin-page-heading"><div><span className="admin-kicker">PUBLIC SITE DETAILS</span><h1>Contact details</h1><p>Only enter contact information approved for public display.</p></div></div>
    {query.saved && <p className="admin-message" role="status">Contact information saved.</p>}
    <section className="admin-panel">
      <form action={saveContactSettings}>
        <div className="admin-form-grid">
          <label className="admin-field">Company legal name<input name="legalName" maxLength={160} defaultValue={text(value, "legalName")} /></label>
          <label className="admin-field">Phone<input name="phone" maxLength={40} defaultValue={text(value, "phone")} /></label>
          <label className="admin-field">WhatsApp number<input name="whatsappNumber" maxLength={30} placeholder="International format, digits preferred" defaultValue={text(value, "whatsappNumber")} /></label>
          <label className="admin-field">Public email<input name="email" type="email" maxLength={254} defaultValue={text(value, "email")} /></label>
          <label className="admin-field admin-field-wide">Verified office address<input name="verifiedOfficeAddress" maxLength={500} defaultValue={text(value, "verifiedOfficeAddress")} /><small>Leave blank if the office address has not been verified.</small></label>
          <label className="admin-field admin-field-wide">Public domain<input name="domain" type="url" maxLength={500} placeholder="https://example.com" defaultValue={text(value, "domain")} /></label>
          <label className="admin-field">Instagram URL<input name="socialInstagram" type="url" maxLength={500} placeholder="https://instagram.com/..." defaultValue={socialUrl(value, "Instagram")} /></label>
          <label className="admin-field">Facebook URL<input name="socialFacebook" type="url" maxLength={500} placeholder="https://facebook.com/..." defaultValue={socialUrl(value, "Facebook")} /></label>
          <label className="admin-field">LinkedIn URL<input name="socialLinkedIn" type="url" maxLength={500} placeholder="https://linkedin.com/..." defaultValue={socialUrl(value, "LinkedIn")} /></label>
          <label className="admin-field">YouTube URL<input name="socialYouTube" type="url" maxLength={500} placeholder="https://youtube.com/..." defaultValue={socialUrl(value, "YouTube")} /></label>
        </div>
        <div className="admin-form-actions"><button className="admin-primary" type="submit">Save contact details</button></div>
      </form>
    </section>
  </AdminShell>;
}
