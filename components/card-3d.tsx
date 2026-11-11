"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  maxAngle?: number;
  scale?: number;
}

export function Card3D({
  children,
  className = "",
  maxAngle = 8,
  scale = 1.02,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const listener = () => setReducedMotion(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxAngle;
    const rotateY = ((x - centerX) / centerX) * maxAngle;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
    });
  };

  return (
    <div
      ref={cardRef}
      className={`card-3d-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      {children}
    </div>
  );
}

