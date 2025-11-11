import hero from "@/data/hero.json";

export function loadHero() {
  const env = import.meta.env || {};
  const showPreview = env.VITE_HERO_SHOW_PREVIEW
    ? String(env.VITE_HERO_SHOW_PREVIEW).toLowerCase() === "true"
    : hero.showPreview !== undefined
      ? !!hero.showPreview
      : true;

  return {
    badge: env.VITE_HERO_BADGE || hero.badge || "",
    title: env.VITE_HERO_TITLE || hero.title || "",
    subtitle: env.VITE_HERO_SUBTITLE || hero.subtitle || "",
    primaryCta: {
      label: env.VITE_HERO_PRIMARY_LABEL || (hero.primaryCta && hero.primaryCta.label) || "View Projects",
      href: env.VITE_HERO_PRIMARY_HREF || (hero.primaryCta && hero.primaryCta.href) || "#projects",
    },
    secondaryCta: {
      label: env.VITE_HERO_SECONDARY_LABEL || (hero.secondaryCta && hero.secondaryCta.label) || "Contact",
      href: env.VITE_HERO_SECONDARY_HREF || (hero.secondaryCta && hero.secondaryCta.href) || "mailto:{email}",
    },
    showPreview,
    previewImage: env.VITE_HERO_PREVIEW_IMAGE || hero.previewImage || "/images/coder-placeholder.svg",
    previewText: env.VITE_HERO_PREVIEW_TEXT || hero.previewText || "",
  };
}
