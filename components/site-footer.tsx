import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FooterSocialLinks } from "@/components/footer-social-links";
import { serviceGroups, services } from "@/content/services";
import { site } from "@/content/site";
import { isPlaceholder, phoneUrl, whatsappUrl } from "@/lib/contact";
import type { Service } from "@/content/services";
import type { PublicSite } from "@/lib/public-content";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export function SiteFooter({
  serviceList = services,
  contact = site,
}: {
  serviceList?: Omit<Service, "icon">[];
  contact?: PublicSite;
}) {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-about">
          <Link href="/" aria-label="RRBizTech home" className="footer-logo-link">
            <Image
              src="/brand/rrbiztech-logo.jpeg"
              alt="RRBizTech — Business and Digital Solutions"
              width={56}
              height={56}
              className="footer-logo-img"
            />
          </Link>
          <p className="footer-about-text">{contact.description}</p>
          {/* Brand compliance fallback note */}
          <a
            className="footer-whatsapp"
            href={whatsappUrl("business services", contact)}
            target={isPlaceholder(contact.whatsapp) ? undefined : "_blank"}
            rel="noreferrer"
          >
            <WhatsAppIcon size={17} /> Chat on WhatsApp
          </a>
        </div>

        <div className="footer-column footer-services">
          <h3>Services</h3>
          {serviceGroups.map((group) => (
            <section key={group.name}>
              <h4>{group.name}</h4>
              {serviceList
                .filter((item) => item.group === group.name)
                .map((item) => (
                  <Link key={item.slug} href={`/services/${item.slug}`}>
                    {item.name}
                  </Link>
                ))}
            </section>
          ))}
        </div>

        <div className="footer-column footer-contact">
          <h3>Connect</h3>
          <a href={phoneUrl(contact)}>
            <Phone size={14} /> {contact.phone}
          </a>
          <a href={isPlaceholder(contact.email) ? "/contact" : `mailto:${contact.email}`}>
            <Mail size={14} /> {contact.email}
          </a>
          <Link href="/contact">Contact us</Link>
          <Link href="/about">About RRBizTech</Link>
          <Link href="/blogs">Blogs &amp; Guides</Link>
          <Link href="/testimonials">Testimonials</Link>
          <Link href="/faq">Frequently Asked Questions</Link>
          <FooterSocialLinks social={contact.social} />
        </div>

        <div className="footer-column">
          <h3>Legal</h3>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          Information on this website is general in nature. Requirements, decisions, fees, and timelines may vary. No approvals or outcomes are guaranteed.
        </p>
        <span>© {new Date().getFullYear()} {contact.name}. All rights reserved.</span>
      </div>
    </footer>
  );
}
