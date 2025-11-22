import React from "react";
import { motion } from "framer-motion";
import { Trophy, Swords, Award, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { loadLeetCode } from "@/lib/leetcode";

export default function LeetCode({ embed = false } = {}) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showBadges, setShowBadges] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const d = await loadLeetCode();
        if (mounted) setData(d);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const content = loading ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-36 rounded-3xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-neutral-900/40 animate-pulse" />
      ))}
    </div>
  ) : data ? (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card className="border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/50 supports-[backdrop-filter]:backdrop-blur-xl overflow-hidden">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img alt="LeetCode" src="https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo-dark.e99485d9b.svg" className="hidden dark:block h-6 w-auto" />
              <img alt="LeetCode" src="https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo.c36eaf5e6.svg" className="dark:hidden h-6 w-auto" />
              <div className="text-sm text-neutral-600 dark:text-neutral-300">
                <div className="font-medium">{data.username}</div>
                {typeof data.rank !== 'undefined' && String(data.rank) && (
                  <div className="opacity-80">Rank: {data.rank}</div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isFinite(data.contributionPoint) && (
                <Badge className="rounded-full px-3 py-1 text-xs"><Award className="h-3.5 w-3.5 mr-1" /> CP {data.contributionPoint}</Badge>
              )}
              {isFinite(data.reputation) && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">Rep {data.reputation}</Badge>
              )}
              {isFinite(data.contestRating) && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs"><Swords className="h-3.5 w-3.5 mr-1" /> Rating {Math.round(data.contestRating)}</Badge>
              )}
              {Array.isArray(data.badges) && data.badges.slice(0, 2).map((b, i) => {
                const key = (typeof b === 'object' && (b.id ?? b.title ?? b.displayName)) || String(i);
                const icon = (typeof b === 'object' && b.icon) ? b.icon : null;
                const label = typeof b === 'string' ? b : (b.displayName || b.title || '');
                return (
                  <span key={key + '-pill'} className="inline-flex items-center gap-2 h-8 px-3 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/60 text-xs">
                    {icon ? <img src={icon} alt="" className="h-4 w-4 rounded" /> : null}
                    <span className="truncate max-w-[10rem]" title={label}>{label}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Stat title="Total Solved" value={data.totalSolved} icon={<Trophy className="h-4 w-4" />} />
            <RingStat label="Easy" solved={data.solved?.easy} total={data.totals?.easy} color="#10b981" textClass="text-emerald-500" />
            <RingStat label="Medium" solved={data.solved?.medium} total={data.totals?.medium} color="#f59e0b" textClass="text-amber-500" />
            <RingStat label="Hard" solved={data.solved?.hard} total={data.totals?.hard} color="#f43f5e" textClass="text-rose-500" />
          </div>

          <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
            {isFinite(data.totalQuestions) && (
              <span>Out of {data.totalQuestions} total</span>
            )}
          </div>

          {(Array.isArray(data.badges) && data.badges.length) || (Array.isArray(data.upcomingBadges) && data.upcomingBadges.length) ? (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowBadges((v) => !v)}
                className="text-sm inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/60 hover:bg-white/90 dark:hover:bg-neutral-900/80"
                aria-expanded={showBadges}
              >
                {showBadges ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showBadges ? 'Hide Badges' : 'Show All Badges'}
              </button>
              {showBadges && (
                <div className="mt-4 space-y-6">
                  {Array.isArray(data.badges) && data.badges.length > 0 && (
                    <div>
                      <div className="text-xs uppercase tracking-wide opacity-70 mb-2">Badges</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {data.badges.map((b, i) => {
                          const key = (typeof b === 'object' && (b.id ?? b.title ?? b.displayName)) || String(i);
                          const icon = (typeof b === 'object' && b.icon) ? b.icon : null;
                          const label = typeof b === 'string' ? b : (b.displayName || b.title || '');
                          return (
                            <div key={key + '-grid'} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 p-3 flex items-center gap-3">
                              {icon ? <img src={icon} alt="" className="h-8 w-8 rounded" /> : <div className="h-8 w-8 rounded bg-black/10 dark:bg-white/10" />}
                              <div className="text-xs font-medium leading-tight" title={label}>{label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {Array.isArray(data.upcomingBadges) && data.upcomingBadges.length > 0 && (
                    <div>
                      <div className="text-xs uppercase tracking-wide opacity-70 mb-2">Upcoming</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {data.upcomingBadges.map((b, i) => {
                          const key = (typeof b === 'object' && (b.id ?? b.title ?? b.displayName)) || String(i);
                          const icon = (typeof b === 'object' && b.icon) ? b.icon : null;
                          const label = typeof b === 'string' ? b : (b.displayName || b.title || '');
                          return (
                            <div key={key + '-up'} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 p-3 flex items-center gap-3 opacity-80">
                              {icon ? <img src={icon} alt="" className="h-8 w-8 rounded" /> : <div className="h-8 w-8 rounded bg-black/10 dark:bg-white/10" />}
                              <div className="text-xs leading-tight" title={label}>{label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  ) : (
    <div className="text-sm text-neutral-600 dark:text-neutral-300">LeetCode data not available.</div>
  );

  if (embed) return content;

  return (
    <section id="leetcode" className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between pb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">LeetCode</h2>
        {data?.profileUrl && (
          <Button asChild size="sm" variant="outline"><a href={data.profileUrl} target="_blank" rel="noopener noreferrer">View Profile</a></Button>
        )}
      </div>
      {content}
    </section>
  );
}

function Stat({ title, value, color, icon }) {
  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 p-4">
      <div className="text-xs uppercase tracking-wide opacity-70 flex items-center gap-2">
        {icon ? <span>{icon}</span> : null}
        {title}
      </div>
      <div className={["mt-1 text-2xl font-semibold", color || ""].join(" ")}>{isFinite(value) ? value : 0}</div>
    </div>
  );
}

function RingStat({ label, solved = 0, total = 0, color = "#10b981", textClass = "" }) {
  const pct = total > 0 ? Math.max(0, Math.min(1, Number(solved) / Number(total))) : 0;
  const r = 26; // radius
  const c = 2 * Math.PI * r; // circumference
  const dash = c * (1 - pct);
  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 p-4">
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-2 flex items-center gap-3">
        <motion.svg width="64" height="64" viewBox="0 0 64 64" initial={{ rotate: -90 }} className="shrink-0">
          <circle cx="32" cy="32" r={r} strokeWidth="6" stroke="rgba(0,0,0,0.08)" fill="none" />
          <motion.circle
            cx="32"
            cy="32"
            r={r}
            strokeWidth="6"
            stroke={color}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: dash }}
            transition={{ duration: 1.0 }}
          />
        </motion.svg>
        <div>
          <div className={["text-xl font-semibold", textClass].join(" ")}>{isFinite(solved) ? solved : 0}</div>
          <div className="text-xs opacity-70">of {isFinite(total) ? total : 0}</div>
        </div>
      </div>
    </div>
  );
}
