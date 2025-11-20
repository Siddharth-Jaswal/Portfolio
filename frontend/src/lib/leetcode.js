import localData from "@/data/leetcode.json";

/**
 * @typedef {Object} LeetStats
 * @property {string} username
 * @property {string} profileUrl
 * @property {string|number} rank
 * @property {number} [contestRating]
 * @property {number} totalSolved
 * @property {number} [totalQuestions]
 * @property {number} [acceptanceRate]
 * @property {{easy:number, medium:number, hard:number}} solved
 * @property {string[]} [badges]
 */

/**
 * Load LeetCode stats. If VITE_LEETCODE_SOURCE=remote and VITE_API_BASE is set,
 * it will attempt to fetch from `${base}/api/leetcode?user=${username}` and
 * fall back to local JSON on failure.
 *
 * @returns {Promise<LeetStats>}
 */
export async function loadLeetCode() {
  const env = import.meta.env || {};
  const source = env.VITE_LEETCODE_SOURCE || "local";
  const username = env.VITE_LEETCODE_USERNAME || localData.username || "";
  const ttl = Number(env.VITE_LEETCODE_CACHE_TTL_MS) > 0 ? Number(env.VITE_LEETCODE_CACHE_TTL_MS) : 120000; // 2 minutes

  // Prefer a fresh cached profile regardless of source (updates the "fallback")
  const cachedProfile = getCache("lc:profile");
  if (cachedProfile && isFresh(cachedProfile.ts, ttl) && cachedProfile.data) {
    const cachedBadges = getCache("lc:badges");
    if (cachedBadges && isFresh(cachedBadges.ts, ttl) && cachedBadges.data) {
      cachedProfile.data.badges = cachedBadges.data.badges || cachedProfile.data.badges;
      cachedProfile.data.upcomingBadges = cachedBadges.data.upcomingBadges || cachedProfile.data.upcomingBadges;
    }
    return cachedProfile.data;
  }

  // Frontend-only remote fetch to public APIs (no backend required)
  if (source === "remote" && username) {
    const templates = [
      env.VITE_LEETCODE_REMOTE_URL,
      "https://leetcode-stats-api.herokuapp.com/{username}",
      "https://leetcode-stats-api.vercel.app/{username}"
    ].filter(Boolean);

    // Profile cache + throttle
    const profCache = getCache("lc:profile");
    const lastProfAttempt = getLastAttempt("lc:profile:last");
    let base = profCache && isFresh(profCache.ts, ttl) ? profCache.data : null;
    let chosenTpl = null;

    if (!base && !isFresh(lastProfAttempt, ttl)) {
      setLastAttempt("lc:profile:last");
      for (const tpl of templates) {
        const url = tpl.replace("{username}", encodeURIComponent(username));
        try {
          const res = await fetch(url, { method: "GET" });
          if (!res.ok) throw new Error("Network error");
          const profileData = await res.json();
          chosenTpl = tpl;
          base = normalize(profileData, username);
          setCache("lc:profile", base);
          break;
        } catch (_) {
          // try next template
        }
      }

      // Badges cache + throttle
      if (base) {
        const badgeTemplates = [
          env.VITE_LEETCODE_BADGES_URL,
          chosenTpl && chosenTpl.includes("/profile")
            ? chosenTpl.replace("/profile", "/badges")
            : null,
          "https://alfa-leetcode-api.onrender.com/{username}/badges",
        ].filter(Boolean);

        const badgeCache = getCache("lc:badges");
        const lastBadgeAttempt = getLastAttempt("lc:badges:last");
        if (badgeCache && isFresh(badgeCache.ts, ttl)) {
          base.badges = badgeCache.data.badges || [];
          base.upcomingBadges = badgeCache.data.upcomingBadges || [];
        } else if (!isFresh(lastBadgeAttempt, ttl)) {
          setLastAttempt("lc:badges:last");
          for (const btpl of badgeTemplates) {
            const burl = btpl.replace("{username}", encodeURIComponent(username));
            try {
              const bres = await fetch(burl, { method: "GET" });
              if (!bres.ok) throw new Error("Network error");
              const bdata = await bres.json();
              const { badges, upcomingBadges } = extractBadgesDetailed(bdata);
              const packed = { badges: badges || [], upcomingBadges: upcomingBadges || [] };
              if ((packed.badges && packed.badges.length) || (packed.upcomingBadges && packed.upcomingBadges.length)) {
                setCache("lc:badges", packed);
                base.badges = packed.badges;
                base.upcomingBadges = packed.upcomingBadges;
                break;
              }
            } catch (_) {
              // try next badges template
            }
          }
        }
      }
    }

    if (base) return base;
    if (profCache && profCache.data) return profCache.data;
    // else fall back to local
  }

  // Local fallback: use normalized JSON, but enrich with any fresh cached badges
  const local = normalize(localData, username);
  const badgeCache = getCache("lc:badges");
  if (badgeCache && isFresh(badgeCache.ts, ttl) && badgeCache.data) {
    const { badges, upcomingBadges } = badgeCache.data;
    if (Array.isArray(badges) && badges.length) local.badges = badges;
    if (Array.isArray(upcomingBadges) && upcomingBadges.length) local.upcomingBadges = upcomingBadges;
  }
  return local;
}

/**
 * @param {any} raw
 * @param {string} username
 * @returns {LeetStats}
 */
function normalize(raw, username) {
  const u = raw?.username || username || "";
  const profileUrl = raw?.profileUrl || (u ? `https://leetcode.com/${u}/` : "");

  // Pull totals from common fields or fallbacks in alfa API shape
  const totalSolved = toNum(
    raw?.totalSolved ?? raw?.matchedUserStats?.acSubmissionNum?.[0]?.count ?? 0
  );
  const totalQuestions = isFinite(raw?.totalQuestions)
    ? Number(raw.totalQuestions)
    : sumIfFinite(raw?.totalEasy, raw?.totalMedium, raw?.totalHard);

  // Totals by difficulty (for progress rings)
  const totalEasy = toNum(raw?.totalEasy);
  const totalMedium = toNum(raw?.totalMedium);
  const totalHard = toNum(raw?.totalHard);

  // Difficulty breakdown
  const easy = toNum(
    raw?.easySolved ?? raw?.solved?.easy ?? raw?.matchedUserStats?.acSubmissionNum?.[1]?.count
  );
  const medium = toNum(
    raw?.mediumSolved ?? raw?.solved?.medium ?? raw?.matchedUserStats?.acSubmissionNum?.[2]?.count
  );
  const hard = toNum(
    raw?.hardSolved ?? raw?.solved?.hard ?? raw?.matchedUserStats?.acSubmissionNum?.[3]?.count
  );

  // Acceptance rate if available, or derive from submission totals
  let acceptanceRate = isFinite(raw?.acceptanceRate) ? Number(raw.acceptanceRate) : undefined;
  if (!isFinite(acceptanceRate)) {
    const allTotal = raw?.totalSubmissions?.find?.((x) => x?.difficulty === "All");
    const allMatch = raw?.matchedUserStats?.totalSubmissionNum?.[0];
    const submissions = toNum(allTotal?.submissions ?? allMatch?.submissions);
    if (submissions > 0) acceptanceRate = (totalSolved / submissions) * 100;
  }

  return {
    username: u,
    profileUrl,
    rank: raw?.rank ?? raw?.ranking ?? "",
    contestRating: isFinite(raw?.contestRating) ? Number(raw.contestRating) : undefined,
    totalSolved,
    totalQuestions: isFinite(totalQuestions) ? Number(totalQuestions) : undefined,
    acceptanceRate: isFinite(acceptanceRate) ? Number(acceptanceRate) : undefined,
    solved: { easy, medium, hard },
    totals: { easy: totalEasy || undefined, medium: totalMedium || undefined, hard: totalHard || undefined },
    contributionPoint: isFinite(raw?.contributionPoint) ? Number(raw.contributionPoint) : undefined,
    reputation: isFinite(raw?.reputation) ? Number(raw.reputation) : undefined,
    ...(() => {
      const { badges, upcomingBadges } = extractBadgesDetailed(
        raw?.badges ? { badges: raw.badges, upcomingBadges: raw?.upcomingBadges } : raw
      );
      return { badges, upcomingBadges };
    })(),
  };
}

function toNum(v) {
  const n = Number(v);
  return isFinite(n) ? n : 0;
}

function sumIfFinite(...vals) {
  const nums = vals.map((v) => Number(v)).filter((n) => isFinite(n));
  return nums.length ? nums.reduce((a, b) => a + b, 0) : undefined;
}

function extractBadgesDetailed(raw) {
  if (!raw) return { badges: [], upcomingBadges: [] };
  const normBadge = (b) => {
    if (!b) return null;
    if (typeof b === "string") return { id: undefined, title: b, displayName: b, icon: undefined, date: undefined };
    if (typeof b === "object") {
      return {
        id: b.id ?? b.badgeId ?? b.slug ?? undefined,
        title: b.title || b.name || b.displayName || b.slug || "",
        displayName: b.displayName || b.title || b.name || b.slug || "",
        icon: b.icon || b.image || b.url || undefined,
        date: b.creationDate || b.date || undefined,
      };
    }
    return null;
  };

  const badgesArr = Array.isArray(raw?.badges) ? raw.badges : Array.isArray(raw) ? raw : [];
  const upcomingArr = Array.isArray(raw?.upcomingBadges) ? raw.upcomingBadges : [];

  return {
    badges: badgesArr.map(normBadge).filter(Boolean),
    upcomingBadges: upcomingArr.map(normBadge).filter(Boolean),
  };
}

// localStorage cache helpers across reloads
function getCache(key) {
  try {
    const s = localStorage.getItem(key);
    if (!s) return null;
    const v = JSON.parse(s);
    return v && typeof v === "object" ? v : null;
  } catch (_) { return null; }
}

function setCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch (_) {}
}

function getLastAttempt(key) {
  try { return Number(localStorage.getItem(key)) || 0; } catch (_) { return 0; }
}

function setLastAttempt(key) {
  try { localStorage.setItem(key, String(Date.now())); } catch (_) {}
}

function isFresh(ts, ttl) {
  return typeof ts === "number" && ts > 0 && (Date.now() - ts) < ttl;
}
