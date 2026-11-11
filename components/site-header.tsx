"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { serviceGroups, services } from "@/content/services";
import { site } from "@/content/site";
import { isPlaceholder, phoneUrl, whatsappUrl } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";
import type { Service } from "@/content/services";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

type HeaderService = Omit<Service, "icon">;

export function SiteHeader({
  serviceList = services,
  contact = site,
}: {
  serviceList?: HeaderService[];
  contact?: { phone: string; whatsapp: string };
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelServicesClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleServicesClose() {
    cancelServicesClose();
    closeTimerRef.current = setTimeout(() => setServicesOpen(false), 1000);
  }

  useEffect(() => {
    if (!mobileOpen && !servicesOpen) return;

    function closeMenus(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setServicesOpen(false);
      }
    }

    window.addEventListener("keydown", closeMenus);
    return () => window.removeEventListener("keydown", closeMenus);
  }, [mobileOpen, servicesOpen]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-navigation-open", mobileOpen);
    return () => document.body.classList.remove("mobile-navigation-open");
  }, [mobileOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="RRBizTech home">
            <Image
              className="brand-logo"
              src="/brand/rrbiztech-logo.jpeg"
              alt="RRBizTech - Business & Digital Solutions"
              width={52}
              height={52}
              priority
            />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <div
              className="nav-menu"
              onMouseEnter={() => {
                cancelServicesClose();
                setServicesOpen(true);
              }}
              onMouseLeave={scheduleServicesClose}
            >
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="services-mega-menu"
                onFocus={() => {
                  cancelServicesClose();
                  setServicesOpen(true);
                }}
                onClick={() => {
                  cancelServicesClose();
                  setServicesOpen(true);
                }}
              >
                Services <ChevronDown size={15} />
              </button>
              {servicesOpen && (
                <div
                  className="mega-menu"
                  id="services-mega-menu"
                  onMouseEnter={cancelServicesClose}
                  onMouseLeave={scheduleServicesClose}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setServicesOpen(false);
                  }}
                >
                  <div className="mega-groups">
                    {serviceGroups.map((group, index) => {
                      const Icon = group.icon;
                      return (
                        <section className="mega-group-card" key={group.name}>
                          <div className="mega-group-heading">
                            <span className="mega-group-icon">
                              <Icon size={17} />
                            </span>
                            <div>
                              <h2>{group.name}</h2>
                              <p>{group.tagline}</p>
                            </div>
                            <span className="mega-group-index">0{index + 1}</span>
                          </div>
                          <div className="mega-service-links">
                            {serviceList
                              .filter((service) => service.group === group.name)
                              .map((service) => (
                                <Link
                                  key={service.slug}
                                  href={`/services/${service.slug}`}
                                  onClick={() => setServicesOpen(false)}
                                >
                                  <span>{service.name}</span>
                                  <ArrowUpRight size={14} />
                                </Link>
                              ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                  <aside className="mega-connect">
                    <span className="mega-connect-kicker">BUSINESS & DIGITAL SERVICES</span>
                    <strong>Support for your next business move.</strong>
                    <p>Find a service that fits, or talk us through what you need.</p>
                    <Link href="/services">
                      Explore all services <ArrowUpRight size={15} />
                    </Link>
                    <Link href="/contact">
                      Request a consultation <ArrowUpRight size={15} />
                    </Link>
                    <a
                      href={whatsappUrl("business services", contact)}
                      target={isPlaceholder(contact.whatsapp) ? undefined : "_blank"}
                      rel="noreferrer"
                      onClick={() => trackEvent("whatsapp_click")}
                    >
                      Chat on WhatsApp <ArrowUpRight size={15} />
                    </a>
                  </aside>
                </div>
              )}
            </div>
            <Link href="/about">About</Link>
            <Link href="/blogs">Blogs</Link>
            <Link href="/testimonials">Testimonials</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <a
              className="header-contact-icon"
              href={phoneUrl(contact)}
              aria-label={`Call ${contact.phone}`}
              onClick={() => trackEvent("call_click")}
            >
              <Phone size={17} />
            </a>
            <a
              className="header-contact-icon"
              href={whatsappUrl("business services", contact)}
              aria-label="Chat on WhatsApp"
              target={isPlaceholder(contact.whatsapp) ? undefined : "_blank"}
              rel="noreferrer"
              onClick={() => trackEvent("whatsapp_click")}
            >
              <WhatsAppIcon size={18} />
            </a>
            <Link className="button button-gold header-cta" href="/contact">
              Request a Consultation <ArrowUpRight size={15} />
            </Link>
          </nav>
          <button
            className="menu-toggle"
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="mobile-drawer" id="mobile-navigation" aria-label="Mobile navigation">
            <details>
              <summary>
                Services <ChevronDown size={16} />
              </summary>
              <Link
                className="mobile-all-services"
                href="/services"
                onClick={() => setMobileOpen(false)}
              >
                Explore all services <ArrowUpRight size={15} />
              </Link>
              {serviceGroups.map((group) => (
                <details className="mobile-service-group" key={group.name}>
                  <summary>{group.name}</summary>
                  {serviceList
                    .filter((service) => service.group === group.name)
                    .map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                </details>
              ))}
            </details>
            <Link href="/about" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link href="/blogs" onClick={() => setMobileOpen(false)}>
              Blogs &amp; Guides
            </Link>
            <Link href="/testimonials" onClick={() => setMobileOpen(false)}>
              Testimonials
            </Link>
            <Link href="/faq" onClick={() => setMobileOpen(false)}>
              FAQ
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
            <Link
              className="button button-gold"
              href="/contact"
              onClick={() => setMobileOpen(false)}
            >
              Request a Consultation
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
