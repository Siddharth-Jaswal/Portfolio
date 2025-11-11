import profile from "@/data/profile.json";

export function loadProfile() {
  const env = import.meta.env || {};
  return {
    name: env.VITE_NAME || profile.name || "",
    tag: env.VITE_TAG || profile.tag || "",
    email: env.VITE_EMAIL || profile.email || "",
    github: env.VITE_GITHUB || profile.github || "",
    linkedin: env.VITE_LINKEDIN || profile.linkedin || "",
  };
}

