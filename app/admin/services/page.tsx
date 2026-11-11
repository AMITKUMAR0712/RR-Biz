import { deleteService, saveService } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { requireAdministrator } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type EditableService = {
  id: string; slug: string; groupId: string; name: string; shortDescription: string; benefit: string;
  headline: string; introduction: string; audience: unknown; help: unknown; process: unknown;
  checklist: unknown; status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; sortOrder: number;
  metaTitle: string | null; metaDescription: string | null; ogImage: string | null;
};

function strings(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function helpItems(value: unknown): { title: string; description: string }[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is { title: string; description: string } =>
    typeof item === "object" && item !== null &&
    "title" in item && typeof item.title === "string" &&
    "description" in item && typeof item.description === "string");
}

function ServiceForm({
  service,
  groups,
}: {
  service?: EditableService;
  groups: { id: string; name: string }[];
}) {
  return <form action={saveService}>
    {service && <input type="hidden" name="id" value={service.id} />}
    <div className="admin-form-grid">
      <label className="admin-field">Service name<input name="name" required maxLength={120} defaultValue={service?.name ?? ""} /></label>
      <label className="admin-field">URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={120} defaultValue={service?.slug ?? ""} /></label>
      <label className="admin-field">Service group<select name="groupId" required defaultValue={service?.groupId ?? groups[0]?.id}>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
      <label className="admin-field">Status<select name="status" defaultValue={service?.status ?? "DRAFT"}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
      <label className="admin-field admin-field-wide">Short description<input name="shortDescription" required maxLength={300} defaultValue={service?.shortDescription ?? ""} /></label>
      <label className="admin-field">Benefit<input name="benefit" required maxLength={240} defaultValue={service?.benefit ?? ""} /></label>
      <label className="admin-field">Headline<input name="headline" required maxLength={180} defaultValue={service?.headline ?? ""} /></label>
      <label className="admin-field admin-field-wide">Introduction<textarea name="introduction" required minLength={20} maxLength={5000} defaultValue={service?.introduction ?? ""} /></label>
      <label className="admin-field">Who this is for<small>One item per line.</small><textarea name="audience" defaultValue={strings(service?.audience).join("\n")} /></label>
      <label className="admin-field">Typical process<small>One item per line.</small><textarea name="process" defaultValue={strings(service?.process).join("\n")} /></label>
      <label className="admin-field">Indicative checklist<small>One item per line.</small><textarea name="checklist" defaultValue={strings(service?.checklist).join("\n")} /></label>
      <label className="admin-field">What we help with<small>JSON array of title and description objects.</small><textarea name="help" defaultValue={JSON.stringify(helpItems(service?.help), null, 2)} /></label>
      <label className="admin-field">Image path (optional)<input name="ogImage" maxLength={500} defaultValue={service?.ogImage ?? ""} placeholder="/services/business-setup.webp" /></label>
      <label className="admin-field">SEO title<input name="metaTitle" maxLength={180} defaultValue={service?.metaTitle ?? ""} /></label>
      <label className="admin-field admin-field-wide">SEO description<textarea name="metaDescription" maxLength={320} defaultValue={service?.metaDescription ?? ""} /></label>
      <label className="admin-field">Sort order<input name="sortOrder" type="number" min={0} max={10000} defaultValue={service?.sortOrder ?? 0} /></label>
    </div>
    <div className="admin-form-actions"><button className="admin-primary" type="submit">{service ? "Save service" : "Create service"}</button></div>
  </form>;
}

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; archived?: string }>;
}) {
  await requireAdministrator();
  const prisma = getPrismaClient();
  const [services, groups, query] = await Promise.all([
    prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.serviceGroup.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    searchParams,
  ]);
  return <AdminShell>
    <div className="admin-page-heading"><div><span className="admin-kicker">PUBLIC OFFERING</span><h1>Services</h1><p>Edit service details and publishing state. Archiving removes the service from public listings.</p></div></div>
    {query.saved && <p className="admin-message" role="status">Service saved.</p>}
    {query.archived && <p className="admin-message" role="status">Service archived.</p>}
    <section className="admin-panel"><h2>Create a service</h2><ServiceForm groups={groups} /></section>
    <section className="admin-records" aria-label="Saved services">
      {services.map((service) => <details className="admin-record" key={service.id}>
        <summary>{service.name}<span>{service.status} · /services/{service.slug}</span></summary>
        <div className="admin-record-body">
          <ServiceForm service={service} groups={groups} />
          <form action={deleteService} className="admin-form-actions"><input type="hidden" name="id" value={service.id} /><button className="admin-danger" type="submit">Archive service</button></form>
        </div>
      </details>)}
    </section>
  </AdminShell>;
}
