import { deleteBlogPost, saveBlogPost } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { requireAdministrator } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function strings(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function BlogForm({
  post,
  serviceOptions,
}: {
  post?: {
    id: string; slug: string; category: string; title: string; introduction: string; prompts: unknown;
    serviceSlug: string; image: string | null; status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; sortOrder: number;
  };
  serviceOptions: { slug: string; name: string }[];
}) {
  return <form action={saveBlogPost}>
    {post && <input type="hidden" name="id" value={post.id} />}
    <div className="admin-form-grid">
      <label className="admin-field">Article title<input name="title" required minLength={5} maxLength={180} defaultValue={post?.title ?? ""} /></label>
      <label className="admin-field">URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={120} defaultValue={post?.slug ?? ""} placeholder="clear-article-url" /></label>
      <label className="admin-field">Category<input name="category" required maxLength={100} defaultValue={post?.category ?? ""} /></label>
      <label className="admin-field">Related service<select name="serviceSlug" required defaultValue={post?.serviceSlug ?? serviceOptions[0]?.slug ?? ""}>{serviceOptions.map((service) => <option key={service.slug} value={service.slug}>{service.name}</option>)}</select></label>
      <label className="admin-field admin-field-wide">Introduction<textarea name="introduction" required minLength={20} maxLength={5000} defaultValue={post?.introduction ?? ""} /></label>
      <label className="admin-field admin-field-wide">Questions or prompts<small>One item per line.</small><textarea name="prompts" maxLength={5000} defaultValue={strings(post?.prompts).join("\n")} /></label>
      <label className="admin-field admin-field-wide">Image path (optional)<input name="image" maxLength={500} placeholder="/services/business-setup.webp" defaultValue={post?.image ?? ""} /></label>
      <label className="admin-field">Status<select name="status" defaultValue={post?.status ?? "DRAFT"}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
      <label className="admin-field">Sort order<input name="sortOrder" type="number" min={0} max={10000} defaultValue={post?.sortOrder ?? 0} /></label>
    </div>
    <div className="admin-form-actions"><button className="admin-primary" type="submit">{post ? "Save article" : "Create article"}</button></div>
  </form>;
}

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await requireAdministrator();
  const [posts, serviceOptions, query] = await Promise.all([
    getPrismaClient().blogPost.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
    getPrismaClient().service.findMany({ select: { slug: true, name: true }, orderBy: { sortOrder: "asc" } }),
    searchParams,
  ]);
  return <AdminShell>
    <div className="admin-page-heading"><div><span className="admin-kicker">EDITORIAL</span><h1>Blogs and guides</h1><p>Published posts appear on the Insights page and the home page carousel.</p></div></div>
    {query.saved && <p className="admin-message" role="status">Blog post saved.</p>}
    {query.deleted && <p className="admin-message" role="status">Blog post deleted.</p>}
    <section className="admin-panel"><h2>Create a blog post</h2><BlogForm serviceOptions={serviceOptions} /></section>
    <section className="admin-records" aria-label="Existing blog posts">
      {posts.length === 0 && <p className="admin-empty">No saved posts yet.</p>}
      {posts.map((post) => <details className="admin-record" key={post.id}>
        <summary>{post.title}<span>{post.status} · /blogs#{post.slug}</span></summary>
        <div className="admin-record-body">
          <BlogForm post={post} serviceOptions={serviceOptions} />
          <form action={deleteBlogPost} className="admin-form-actions"><input type="hidden" name="id" value={post.id} /><button className="admin-danger" type="submit">Delete post</button></form>
        </div>
      </details>)}
    </section>
  </AdminShell>;
}
