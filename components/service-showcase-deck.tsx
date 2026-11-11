"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe2,
  Landmark,
  Laptop,
  MessageCircle,
  Pause,
  Play,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { services, serviceGroups, type Service, type ServiceGroup } from "@/content/services";
import { whatsappUrl, isPlaceholder } from "@/lib/contact";
import { site } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

const groupIcons: Record<string, typeof Building2> = {
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

export function ServiceShowcaseDeck({
  serviceList = services,
}: {
  serviceList?: Service[];
}) {
  const [selectedGroup, setSelectedGroup] = useState<ServiceGroup | "All">("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const filtered = selectedGroup === "All"
    ? serviceList
    : serviceList.filter((s) => s.group === selectedGroup);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [selectedGroup]);

  // Auto-slide effect with progress
  useEffect(() => {
    if (!isPlaying || isHovered || filtered.length === 0) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const duration = 5000; // 5 seconds per slide
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % filtered.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, isHovered, filtered.length]);

  const activeService = filtered[currentIndex] || filtered[0] || serviceList[0];
  if (!activeService) return null;
  const Icon = groupIcons[activeService.slug] ?? Building2;

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  };

  const handleSelectService = (idx: number) => {
    setProgress(0);
    setCurrentIndex(idx);
  };

  return (
    <div
      className="showcase-deck"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Interactive Service Showcase"
    >
      {/* Header controls & tabs */}
      <div className="showcase-header">
        <div className="showcase-badge">
          <Sparkles size={14} className="text-gold" />
          <span>FEATURED SERVICES SPOTLIGHT</span>
        </div>

        <div className="showcase-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={selectedGroup === "All"}
            className={`showcase-tab ${selectedGroup === "All" ? "active" : ""}`}
            onClick={() => setSelectedGroup("All")}
          >
            All 10 Services
          </button>
          {serviceGroups.map((g) => (
            <button
              key={g.name}
              type="button"
              role="tab"
              aria-selected={selectedGroup === g.name}
              className={`showcase-tab ${selectedGroup === g.name ? "active" : ""}`}
              onClick={() => setSelectedGroup(g.name)}
            >
              {g.name}
            </button>
          ))}
        </div>

        <div className="showcase-player-controls">
          <button
            type="button"
            className="showcase-nav-btn"
            onClick={handlePrev}
            aria-label="Previous service"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="showcase-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause auto-rotation" : "Play auto-rotation"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            type="button"
            className="showcase-nav-btn"
            onClick={handleNext}
            aria-label="Next service"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="showcase-progress-track">
        <div
          className="showcase-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Card Stage */}
      <div className="showcase-stage">
        <div className="showcase-card">
          <div className="showcase-media">
            <Image
              src={activeService.image}
              alt={activeService.name}
              fill
              className="showcase-image"
              sizes="(max-width: 900px) 100vw, 550px"
            />
            <div className="showcase-media-overlay" />
            <div className="showcase-category-pill">
              <Icon size={16} />
              <span>{activeService.group}</span>
            </div>
            <div className="showcase-slide-count">
              {String(currentIndex + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
            </div>
          </div>

          <div className="showcase-content">
            <span className="showcase-eyebrow">PRACTICAL UAE SUPPORT</span>
            <h3 className="showcase-title">{activeService.name}</h3>
            <p className="showcase-intro">{activeService.headline}</p>

            <div className="showcase-benefit-pill">
              <Check size={16} className="text-gold" />
              <span>{activeService.benefit}</span>
            </div>

            <div className="showcase-points">
              <span className="showcase-points-label">Key assistance includes:</span>
              <div className="showcase-points-grid">
                {activeService.help.slice(0, 3).map((item) => (
                  <div key={item.title} className="showcase-point-item">
                    <span className="point-dot" />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="showcase-actions">
              <Link
                href={`/services/${activeService.slug}`}
                className="button button-gold showcase-cta"
              >
                Explore {activeService.name} <ArrowRight size={16} />
              </Link>
              <a
                href={whatsappUrl(activeService.name, site)}
                target={isPlaceholder(site.whatsapp) ? undefined : "_blank"}
                rel="noreferrer"
                className="button button-outline showcase-wa-cta"
                onClick={() => trackEvent("whatsapp_click", { service: activeService.name })}
              >
                <MessageCircle size={16} /> Quick WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation Strip */}
        <div className="showcase-thumbnails" role="tablist">
          {filtered.map((s, idx) => {
            const Active = idx === currentIndex;
            const ItemIcon = groupIcons[s.slug] ?? Building2;
            return (
              <button
                key={s.slug}
                type="button"
                className={`showcase-thumb-btn ${Active ? "active" : ""}`}
                onClick={() => handleSelectService(idx)}
                aria-label={`Show ${s.name}`}
              >
                <span className="thumb-icon">
                  <ItemIcon size={14} />
                </span>
                <span className="thumb-title">{s.name}</span>
                {Active && <span className="thumb-active-indicator" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
