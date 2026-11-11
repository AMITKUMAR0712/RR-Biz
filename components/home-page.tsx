"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Building2,
  ChartNoAxesCombined,
  Clock3,
  FileCheck2,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Globe2,
  Landmark,
  Laptop,
  FileText,
  UsersRound,
} from "lucide-react";
import { faqs } from "@/content/faqs";
import { serviceGroups, services, type Service, type ServiceGroup } from "@/content/services";
import { homeContent, site } from "@/content/site";
import { EnquiryForm as GuidedEnquiryForm } from "@/components/enquiry-form";
import { FloatingContact } from "@/components/floating-contact";
import { ServiceFinder } from "@/components/service-finder";
import { ServiceShowcaseDeck } from "@/components/service-showcase-deck";
import { Card3D } from "@/components/card-3d";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { BlogCards } from "@/components/blog-cards";
import { GoogleReviews } from "@/components/google-reviews";
import { ReviewStars } from "@/components/google-reviews";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { isPlaceholder, phoneUrl, whatsappUrl } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";
import { SupportPopup } from "@/components/support-popup";
import type { BlogGuide } from "@/content/blogs";
import type { PublicFeedback, PublicReview, PublicService, PublicSite } from "@/lib/public-content";

const featureIcons = {
  process: FileCheck2,
  team: Sparkles,
  communication: MessageCircle,
  documents: ShieldCheck,
  support: Clock3,
} as const;

const serviceIcons: Record<string, typeof Building2> = {
  "business-setup": Building2,
  "pro-services": BriefcaseBusiness,
  "bank-account-assistance": Landmark,
  "document-services": FileText,
  "visa-processing-support": Globe2,
  "international-visa-support": Globe2,
  "accounting-bookkeeping": ChartNoAxesCombined,
  recruitment: UsersRound,
  "it-services": Laptop,
  "digital-marketing": ChartNoAxesCombined,
};

function CardPhoto({ src }: { src: string }) {
  return (
    <span className="card-photo" aria-hidden="true">
      <Image src={src} alt="" fill sizes="(max-width: 760px) 50vw, 300px" quality={70} />
    </span>
  );
}

const heroVisualSlides = [
  { src: "/hero/s1.webp", title: "Dubai skyline" },
  { src: "/hero/s2.webp", title: "Downtown Dubai" },
  { src: "/hero/s3.webp", title: "Dubai at night" },
];

function HeroVisual() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const timer = window.setInterval(() => {
      setSlideIndex((index) => (index + 1) % heroVisualSlides.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-visual" aria-label="Dubai skyline photo carousel in an illustrated 3D model" role="img">
      <span className="hero-visual-orbit" />
      <div className="hero-visual-slides" aria-hidden="true">
        {heroVisualSlides.map((slide, index) => (
          <div className={`hero-visual-slide${index === slideIndex ? " active" : ""}`} key={slide.src}>
            <Image src={slide.src} alt="" fill sizes="(max-width: 760px) 88vw, 480px" quality={70} />
          </div>
        ))}
      </div>
      <svg viewBox="0 0 520 440" fill="none" aria-hidden="true">
        <path d="M28 374h464" stroke="#E3BC5C" strokeOpacity=".45" />
        <path
          d="M50 374v-78h28v78m8 0v-118h28v118m8 0v-62h25v62m8 0V258h23v116m11 0v-92h30v92m10 0V193h25v181m8 0V155h15l10-80 9 80h15v219m10 0V222h31v152m9 0V183h18v-24h9v24h21v191m10 0v-95h25v95m9 0v-133h35v133m10 0v-65h26v65"
          stroke="#E3BC5C"
          strokeOpacity=".84"
          strokeWidth="2"
        />
        <path d="M269 75V34m-8 41h16M267 34h4m-10 121h16m-16 13h16" stroke="#F7E9C4" strokeWidth="2" />
        <path d="M0 399h520" stroke="white" strokeOpacity=".12" />
        <path d="M64 399v-12h94v12m228 0v-12h74v12" fill="#17864A" fillOpacity=".7" />
        <path d="M48 399v-12h16v12m338 0v-12h20v12" fill="#D9443E" fillOpacity=".8" />
        <circle cx="270" cy="214" r="152" stroke="#E3BC5C" strokeOpacity=".15" />
        <circle cx="270" cy="214" r="181" stroke="white" strokeOpacity=".08" />
      </svg>
      <span className="hero-visual-caption">DUBAI · UAE</span>
      <span className="hero-visual-ribbon">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

function EnquiryForm({ compact = false, serviceNames }: { compact?: boolean; serviceNames: string[] }) {
  return <GuidedEnquiryForm compact={compact} serviceNames={serviceNames} source={compact ? "hero-quick" : "cta-band"} />;
}

function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1100 260" fill="none" aria-hidden="true">
      <path
        d="M0 222h70v-38h30v38h35V95h7V62h4v33h8v127h39v-75h15v-21h4v21h20v75h28v-98h22v-36h5v36h18v98h28V83h13V40h4v43h17v139h25V123h20V72h6v51h17v99h27V53h5V0h3v53h8v169h36v-89h23v-27h6v27h22v89h34v-63h19v-26h5v26h18v63h33V111h17V75h5v36h16v111h28v-78h25v-39h5v39h19v78h33v-99h20V94h4v29h18v99h36v-60h20v-24h5v24h17v60h39"
        stroke="currentColor"
        strokeOpacity=".55"
        strokeWidth="1.2"
      />
      <path d="M0 232h1100" stroke="currentColor" strokeOpacity=".28" />
    </svg>
  );
}

export default function HomePage({
  serviceList = services,
  blogList,
  reviews = [],
  customerFeedback = [],
  siteInfo = site,
}: {
  serviceList?: PublicService[];
  blogList?: (BlogGuide & { service: PublicService })[];
  reviews?: PublicReview[];
  customerFeedback?: PublicFeedback[];
  siteInfo?: PublicSite;
}) {
  const whatsappHref = whatsappUrl("business services", siteInfo);
  const phoneHref = phoneUrl(siteInfo);
  const [activeGroup, setActiveGroup] = useState<ServiceGroup | "All">("All");
  const filteredServices = useMemo(
    () => (activeGroup === "All" ? serviceList : serviceList.filter((service) => service.group === activeGroup)),
    [activeGroup, serviceList],
  );

  const chooseGroup = (group: ServiceGroup) => {
    setActiveGroup(group);
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main id="main-content" tabIndex={-1}>
      <span id="top" className="skip-target" tabIndex={-1} />
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>Business &amp; Digital Solutions in the UAE</span>
          <div>
            <a href={phoneHref} onClick={() => trackEvent("call_click")}>
              <Phone size={13} /> {siteInfo.phone}
            </a>
            <a
              href={whatsappHref}
              target={isPlaceholder(siteInfo.whatsapp) ? undefined : "_blank"}
              rel="noreferrer"
              onClick={() => trackEvent("whatsapp_click")}
            >
              <WhatsAppIcon size={15} /> WhatsApp
            </a>
            <span>English · UAE</span>
          </div>
        </div>
      </div>
      <SiteHeader serviceList={serviceList} contact={siteInfo} />

      <section className="hero">
        <div className="hero-blue-wash" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light">
              <span className="eyebrow-dot" /> {homeContent.hero.eyebrow}
            </div>
            <h1>
              {homeContent.hero.title}
              <br />
              <span>{homeContent.hero.accent}</span>
            </h1>
            <p className="hero-lede">{homeContent.hero.description}</p>
            <div className="hero-actions">
              <a className="button button-gold" href="#contact">
                Request a consultation <ArrowRight size={17} />
              </a>
              <a className="button button-ghost" href="#services">
                Explore services <ArrowDown size={16} />
              </a>
            </div>
            <div className="trust-points">
              {homeContent.hero.reassurance.map((point) => (
                <span key={point}>
                  <Check /> {point}
                </span>
              ))}
            </div>
          </div>
          <Card3D maxAngle={10} scale={1.03}>
            <HeroVisual />
          </Card3D>
        </div>
        <Skyline />
        <a className="scroll-cue" href="#services">
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown size={15} />
        </a>
        <div className="uae-ribbon" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </section>

      <section className="coverage-strip" aria-label="Services we cover">
        {siteInfo.stats.length > 0 && (
          <div className="container verified-stats">
            {siteInfo.stats.slice(0, 4).map((stat) => (
              <article key={`${stat.label}-${stat.value}`}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
                <p>{stat.detail}</p>
              </article>
            ))}
          </div>
        )}
        <div className="coverage-track">
          {serviceList.map((service, index) => (
            <span key={service.slug}>
              {service.name}
              {index !== serviceList.length - 1 && <i />}
            </span>
          ))}
        </div>
      </section>

      <section className="section goals-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">A GOOD PLACE TO START</div>
              <h2>
                What do you need
                <br className="desktop-break" /> help with?
              </h2>
            </div>
            <p>Choose a goal to find the services that may fit what you’re working on.</p>
          </div>
          <div className="goal-grid">
            {serviceGroups.map(({ name, tagline, icon: Icon, image }, index) => (
              <ScrollReveal className="goal-reveal" delay={index * 55} key={name}>
                <Card3D maxAngle={8} scale={1.03}>
                  <button className="goal-card" type="button" onClick={() => chooseGroup(name)}>
                    <CardPhoto src={image} />
                    <span className="goal-index">0{index + 1}</span>
                    <span className="icon-box">
                      <Icon size={22} />
                    </span>
                    <strong>{name === "Establish & Operate" ? "Start a business" : name}</strong>
                    <span className="goal-tagline">{tagline}</span>
                    <ArrowUpRight className="goal-arrow" size={19} />
                  </button>
                </Card3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-sliding 3D Featured Showcase Deck */}
      <section className="section showcase-section" aria-label="Featured Services Deck">
        <div className="container">
          <ServiceShowcaseDeck serviceList={serviceList as Service[]} />
        </div>
      </section>

      <section className="container finder-section">
        <ServiceFinder serviceList={serviceList} />
      </section>

      <section className="section services-section" id="services">
        <div className="container">
          <div className="section-heading services-heading">
            <div>
              <div className="eyebrow">HOW WE CAN HELP</div>
              <h2>
                Services for every
                <br className="desktop-break" /> stage of business.
              </h2>
            </div>
            <p>Flexible support across the essentials—from setup and people to finance and digital growth.</p>
          </div>
          <div className="filter-row" aria-label="Filter services">
            {(["All", ...serviceGroups.map((group) => group.name)] as const).map((group) => (
              <button
                type="button"
                key={group}
                className={`filter-chip${activeGroup === group ? " selected" : ""}`}
                aria-pressed={activeGroup === group}
                onClick={() => setActiveGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>
          <div className="service-grid" id="services-list">
            {filteredServices.map((service, index) => {
              const Icon = serviceIcons[service.slug] ?? serviceIcons[service.group] ?? Building2;
              return (
                <ScrollReveal className="service-reveal" delay={(index % 4) * 45} key={service.slug}>
                  <Card3D maxAngle={6} scale={1.02}>
                    <article className={`service-card${index === 0 && activeGroup === "All" ? " service-card-featured" : ""}`}>
                      <CardPhoto src={service.image} />
                      <div className="service-card-top">
                        <span className="icon-box">
                          <Icon size={21} />
                        </span>
                        <span className="service-number">0{index + 1}</span>
                      </div>
                      <span className="service-group">{service.group}</span>
                      <h3>{service.name}</h3>
                      <p>{service.shortDescription}</p>
                      <div className="service-benefit">
                        <Check size={14} /> {service.benefit}
                      </div>
                      <Link href={`/services/${service.slug}`} className="text-link">
                        Learn more <ArrowRight size={15} />
                      </Link>
                    </article>
                  </Card3D>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section home-insights-section" aria-labelledby="home-insights-heading">
        <div className="container">
          <div className="section-heading home-insights-heading">
            <div>
              <div className="eyebrow">RRBIZTECH INSIGHTS</div>
              <h2 id="home-insights-heading">Ideas to help you move forward.</h2>
            </div>
            <Link className="text-link" href="/blogs">
              Browse all guides <ArrowRight size={15} />
            </Link>
          </div>
          <BlogCards preview guides={blogList} />
        </div>
      </section>

      <GoogleReviews reviews={reviews} />
      {customerFeedback.length > 0 && (
        <section className="section home-feedback-section" aria-labelledby="home-feedback-heading">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">APPROVED CUSTOMER FEEDBACK</div>
                <h2 id="home-feedback-heading">Experiences shared by our clients.</h2>
              </div>
              <Link className="text-link" href="/testimonials#share-feedback">Share your experience <ArrowRight size={15} /></Link>
            </div>
            <div className="home-feedback-grid">
              {customerFeedback.slice(0, 3).map((item) => (
                <article className="community-feedback-card" key={item.id}>
                  {item.rating !== null && <ReviewStars rating={item.rating} />}
                  <blockquote>“{item.message}”</blockquote>
                  <div className="review-attribution"><strong>{item.name}</strong><span>{item.createdAt.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="process-background-region">
        <div className="process-background-layer" aria-hidden="true">
          <div className="process-background-frame">
            <Image className="process-background" src="/process/templetebg.webp" alt="" fill sizes="100vw" />
            <span className="process-background-wash" />
          </div>
        </div>

        <section className="section process-section">
          <div className="container process-layout">
            <div className="process-intro">
              <div className="eyebrow">{homeContent.process.eyebrow}</div>
              <h2>{homeContent.process.title}</h2>
              <p>{homeContent.process.description}</p>
              <a className="text-link" href="#contact">
                Talk through your needs <ArrowRight size={16} />
              </a>
            </div>
            <div className="steps-list">
              {homeContent.process.steps.map((step, index) => (
                <div className="step" key={step.title}>
                  <div className="step-marker">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {index < homeContent.process.steps.length - 1 && <i />}
                  </div>
                  <div className="step-copy">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section why-section" id="why-us">
          <div className="container why-layout">
            <div className="why-intro">
              <div className="eyebrow eyebrow-gold">{homeContent.approach.eyebrow}</div>
              <h2>{homeContent.approach.title}</h2>
              <p>{homeContent.approach.description}</p>
              <a className="button button-outline" href="#contact">
                Get in touch <ArrowRight size={16} />
              </a>
            </div>
            <div className="feature-list">
              {homeContent.approach.features.map((feature, index) => {
                const Icon = featureIcons[feature.icon];
                return (
                  <div className="feature-item" key={feature.title}>
                    <span className="feature-icon">
                      <Icon size={19} />
                    </span>
                    <div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                    <span className="feature-index">0{index + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="why-decoration" aria-hidden="true">
              RR
            </div>
          </div>
        </section>

        <section className="section audience-section">
          <div className="container audience-layout">
            <div>
              <div className="eyebrow">BUILT AROUND YOUR GOALS</div>
              <h2>Who we support.</h2>
            </div>
            <div className="audience-chips">
              {homeContent.audiences.map((item, index) => (
                <span key={item}>
                  <i>0{index + 1}</i>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="container faq-layout">
            <div className="faq-intro">
              <div className="eyebrow">{homeContent.faqSection.eyebrow}</div>
              <h2>{homeContent.faqSection.title}</h2>
              <p>{homeContent.faqSection.description}</p>
              <a href="#contact" className="text-link">
                Ask us directly <ArrowRight size={16} />
              </a>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details className="faq-item" key={faq.question} open={index === 0}>
                  <summary>
                    <span>{faq.question}</span>
                    <span className="faq-toggle">
                      <ChevronDown size={16} />
                    </span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="section cta-section" id="contact">
        <div className="container">
          <div className="cta-panel">
            <div className="cta-copy">
              <div className="eyebrow eyebrow-gold">{homeContent.enquiry.eyebrow}</div>
              <h2>{homeContent.enquiry.title}</h2>
              <p>{homeContent.enquiry.description}</p>
              <div className="contact-options">
                <a
                  href={whatsappHref}
                  target={isPlaceholder(siteInfo.whatsapp) ? undefined : "_blank"}
                  rel="noreferrer"
                  onClick={() => trackEvent("whatsapp_click")}
                >
                  <span className="contact-icon whatsapp-contact-icon">
                    <WhatsAppIcon size={19} />
                  </span>
                  <span>
                    <small>WHATSAPP</small>
                    <strong>{siteInfo.whatsapp}</strong>
                  </span>
                  <ArrowUpRight size={15} />
                </a>
                <a href={phoneHref} onClick={() => trackEvent("call_click")}>
                  <span className="contact-icon">
                    <Phone size={18} />
                  </span>
                  <span>
                    <small>CALL US</small>
                    <strong>{siteInfo.phone}</strong>
                  </span>
                  <ArrowUpRight size={15} />
                </a>
                <a href={isPlaceholder(siteInfo.email) ? "/contact" : `mailto:${siteInfo.email}`}>
                  <span className="contact-icon">
                    <Mail size={18} />
                  </span>
                  <span>
                    <small>EMAIL</small>
                    <strong>{siteInfo.email}</strong>
                  </span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="cta-form-card">
              <div className="cta-form-title">
                <div>
                  <span className="eyebrow">SEND AN ENQUIRY</span>
                  <h3>How can we help?</h3>
                </div>
                <span className="form-step">3 STEPS</span>
              </div>
              <EnquiryForm serviceNames={serviceList.map((service) => service.name)} />
            </div>
            <div className="cta-decoration" aria-hidden="true">
              RR
            </div>
            <div className="cta-corner" aria-hidden="true" />
          </div>
        </div>
      </section>

      <SiteFooter serviceList={serviceList} contact={siteInfo} />
      <FloatingContact context="business services" contact={siteInfo} />
      <SupportPopup serviceNames={serviceList.map((service) => service.name)} />
    </main>
  );
}
