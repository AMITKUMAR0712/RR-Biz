"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function AutoCarousel({
  children,
  label,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const itemCount = Children.count(children);
  const paused = hoverPaused || focusPaused || manualPaused;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setCanScroll(track.scrollWidth > track.clientWidth + 2);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [itemCount]);

  const move = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length < 2) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = cards[0].getBoundingClientRect().width + gap;
    const maxIndex = Math.round((track.scrollWidth - track.clientWidth) / step);
    if (maxIndex < 1) return;
    const nextIndex = activeIndex + direction;
    const wrappedIndex = nextIndex < 0 ? maxIndex : nextIndex > maxIndex ? 0 : nextIndex;
    track.scrollTo({
      left: wrappedIndex * step,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    setActiveIndex(wrappedIndex);
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    if (paused || reducedMotion || !canScroll) return;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [move, paused, reducedMotion, canScroll]);

  return (
    <div
      className={`auto-carousel ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusPaused(false);
      }}
    >
      <div className="auto-carousel-track" ref={trackRef} onScroll={(event) => {
        const track = event.currentTarget;
        const card = track.firstElementChild as HTMLElement | null;
        if (!card) return;
        const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
        setActiveIndex(Math.round(track.scrollLeft / (card.getBoundingClientRect().width + gap)));
      }}>
        {children}
      </div>
      {canScroll && itemCount > 1 && <div className="carousel-controls">
        <button type="button" aria-label={`Previous ${label}`} onClick={() => move(-1)}><ArrowLeft size={17} /></button>
        <span aria-live="off">{activeIndex + 1}</span>
        <button type="button" className="carousel-pause" aria-pressed={manualPaused} aria-label={`${manualPaused ? "Resume" : "Pause"} automatic ${label} movement`} onClick={() => setManualPaused((value) => !value)}>{manualPaused ? "Play" : "Pause"}</button>
        <button type="button" aria-label={`Next ${label}`} onClick={() => move(1)}><ArrowRight size={17} /></button>
      </div>}
    </div>
  );
}
