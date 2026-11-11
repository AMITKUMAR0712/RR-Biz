import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rrbiztech.example";
  const jsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, ...(item.href ? { item: new URL(item.href, baseUrl).toString() } : {}) })) };
  return <>
    <nav className="breadcrumbs container" aria-label="Breadcrumb">{items.map((item, index) => <span key={`${item.label}-${index}`}>{index > 0 && <span aria-hidden="true"> / </span>}{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </>;
}
