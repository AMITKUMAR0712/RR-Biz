import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InnerPage } from "@/components/inner-page";

export default function NotFound() {
  return <InnerPage><main><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Page not found" }]} /><section className="thank-you-page container"><div className="eyebrow">404 · PAGE NOT FOUND</div><h1>We couldn’t find that page.</h1><p>The page may have moved. Explore our services or return to the homepage.</p><div className="hero-actions"><Link className="button button-gold" href="/services">Explore services</Link><Link className="button button-ghost-dark" href="/">Go home</Link></div></section></main></InnerPage>;
}
