import localProjects from "@/data/projects.json";

/**
 * @typedef {Object} ProjectInput
 * @property {string} [id]
 * @property {string} [slug]
 * @property {string} title
 * @property {string} [desc]
 * @property {string[]} [tags]
 * @property {string} [image]
 * @property {boolean} [featured]
 * @property {string} [date] ISO date like "2024-06-01"
 * @property {{repo?: string, demo?: string}} [links]
 * @property {string} [repo]
 * @property {string} [demo]
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} desc
 * @property {string[]} tags
 * @property {string} repo
 * @property {string} demo
 * @property {string|undefined} image
 * @property {boolean} featured
 * @property {string|undefined} date
 */

export async function loadProjects() {
  const source = import.meta.env.VITE_PROJECTS_SOURCE || "local";

  if (source === "remote") {
    const base = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";
    try {
      const res = await fetch(`${base}/api/projects`);
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      if (Array.isArray(data)) return normalizeProjects(data);
    } catch (_) {
      // fall through to local
    }
  }

  return normalizeProjects(localProjects);
}

/**
 * @param {ProjectInput[]} items
 * @returns {Project[]}
 */
function normalizeProjects(items) {
  const list = (items || []).filter(Boolean).map((p) => {
    const title = p.title || "Untitled Project";
    const slug = (p.slug || slugify(title)).toLowerCase();
    const id = p.id || slug;
    const links = typeof p.links === "object" && p.links ? p.links : {};
    const repo = p.repo || links.repo || "";
    const demo = p.demo || links.demo || "";
    const date = p.date && isFinite(Date.parse(p.date)) ? new Date(p.date).toISOString().slice(0, 10) : undefined;
    return {
      id,
      slug,
      title,
      desc: p.desc || "",
      tags: Array.isArray(p.tags) ? p.tags : [],
      repo,
      demo,
      image: p.image || "/images/coder-placeholder.svg",
      featured: Boolean(p.featured),
      date,
    };
  });

  // Sort: featured first, then by date desc, then title asc
  list.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const ad = a.date ? Date.parse(a.date) : 0;
    const bd = b.date ? Date.parse(b.date) : 0;
    if (ad !== bd) return bd - ad;
    return a.title.localeCompare(b.title);
  });
  return list;
}

function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
