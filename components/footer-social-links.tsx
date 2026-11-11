"use client";

import { Facebook, Instagram, Linkedin, Youtube, type LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

type SocialIcon = LucideIcon | typeof WhatsAppIcon;

const socialIcons: Record<string, SocialIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: WhatsAppIcon,
};

const shareTargets = [
  { label: "Facebook", icon: Facebook, url: (page: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(page)}` },
  { label: "LinkedIn", icon: Linkedin, url: (page: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(page)}` },
  { label: "WhatsApp", icon: WhatsAppIcon, url: (page: string) => `https://wa.me/?text=${encodeURIComponent(`RRBizTech: ${page}`)}` },
];

export function FooterSocialLinks({ social }: { social: readonly { label: string; url: string }[] }) {
  return (
    <div className="footer-social-links" aria-label="Social media">
      {shareTargets.map(({ label, icon: Icon, url }) => (
        <button
          key={label}
          type="button"
          aria-label={`Share RRBizTech on ${label}`}
          title={`Share on ${label}`}
          onClick={() => window.open(url(window.location.href), "_blank", "noopener,noreferrer")}
        >
          <Icon size={18} aria-hidden="true" />
        </button>
      ))}
      {social.map((link) => {
        const Icon = socialIcons[link.label.toLowerCase()];
        if (!Icon) return null;
        return (
          <a href={link.url} key={`${link.label}-${link.url}`} target="_blank" rel="noreferrer" aria-label={link.label} title={link.label}>
            <Icon size={18} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
