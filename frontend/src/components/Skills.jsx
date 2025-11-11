import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadSkills } from "@/lib/skills";
import TechIcon from "@/components/TechIcon";
import { ChevronDown } from "lucide-react";

export default function Skills() {
  const [groups, setGroups] = React.useState([]);
  React.useEffect(() => { loadSkills().then(setGroups); }, []);
  const [open, setOpen] = React.useState(() => new Set());

  const toggle = (category) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category); else next.add(category);
      return next;
    });
  };

  return (
    <section id="skills" className="max-w-6xl mx-auto px-4 py-14 relative">
      <div className="pointer-events-none absolute -z-10 -top-10 left-0 h-56 w-56 rounded-full blur-3xl opacity-30 bg-[radial-gradient(14rem_10rem_at_50%_50%,rgba(255,184,0,0.16),transparent)]" />
      <div className="flex items-end justify-between pb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Skills</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setOpen(new Set(groups.map((g) => g.category)))}>Expand all</Button>
          <Button size="sm" variant="outline" onClick={() => setOpen(new Set())}>Collapse all</Button>
        </div>
      </div>

      <div className="space-y-8">
        {groups.map((g, gi) => {
          const isOpen = open.has(g.category);
          return (
            <div key={gi}>
              <button
                type="button"
                onClick={() => toggle(g.category)}
                className="w-full flex items-center justify-between mb-2 py-2 px-2 rounded-xl hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors"
                aria-expanded={isOpen}
                aria-controls={`skills-${gi}`}
              >
                <span className="text-sm uppercase tracking-wider text-neutral-600 dark:text-neutral-300">{g.category}</span>
                <ChevronDown className={["h-4 w-4 transition-transform", isOpen ? "rotate-180" : "rotate-0"].join(" ")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`skills-${gi}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-4">
                      {(g.items || []).map((s, si) => (
                        <motion.div
                          key={`${g.category}-${s.name}-${si}`}
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.99 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.6, delay: (si % 6) * 0.04 }}
                        >
                          <Card className="border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/50 supports-[backdrop-filter]:backdrop-blur-xl hover:shadow-[0_14px_40px_-25px_rgba(0,0,0,0.35)] transition-all skill-card-glow">
                            <CardContent className="flex items-center gap-3 p-3">
                              <div className="relative">
                                <div className="icon-chip h-12 w-12 grid place-items-center rounded-full border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-800/60 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.45)]">
                                  <TechIcon name={s.icon || s.name} size={22} className="icon-glow" />
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium leading-tight truncate" title={s.name}>{s.name}</div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
