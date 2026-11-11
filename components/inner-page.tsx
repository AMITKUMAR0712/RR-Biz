import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FloatingContact } from "@/components/floating-contact";
import { getPublicServices, getPublicSite } from "@/lib/public-content";

export async function InnerPage({ children, context = "business services" }: { children: React.ReactNode; context?: string }) {
  const [services, contact] = await Promise.all([getPublicServices(), getPublicSite()]);
  return <>
    <SiteHeader serviceList={services} contact={contact} />
    <div id="main-content" tabIndex={-1}>{children}</div>
    <FloatingContact context={context} contact={contact} />
    <SiteFooter serviceList={services} contact={contact} />
  </>;
}
