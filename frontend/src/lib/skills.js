import localSkills from "@/data/skills.json";

/**
 * @typedef {Object} SkillItem
 * @property {string} name
 * @property {string} [icon]
 */

/**
 * @typedef {Object} SkillGroup
 * @property {string} category
 * @property {SkillItem[]} items
 */

export async function loadSkills() {
  // Keep it simple: local JSON for now, mirrors projects loader shape
  return normalizeSkills(localSkills);
}

/**
 * @param {any[]} groups
 * @returns {SkillGroup[]}
 */
function normalizeSkills(groups) {
  return (groups || []).map((g) => ({
    category: g?.category || "General",
    items: Array.isArray(g?.items)
      ? g.items.map((s) => ({
          name: String(s?.name || "Skill"),
          icon: s?.icon || "", // optional; TechIcon falls back to name
        }))
      : [],
  }));
}
