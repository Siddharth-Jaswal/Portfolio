import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, ExternalLink, Code2, Sun, MoonStar, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadProjects } from "@/lib/projects";
import { loadProfile } from "@/lib/profile";
import { loadHero } from "@/lib/hero";
import RailCarousel from "@/components/RailCarousel";
import MagneticButton from "@/components/ui/MagneticButton";
import Skills from "@/components/Skills";
import CodingProfile from "@/components/CodingProfile";
import AnimatedCoder from "@/components/AnimatedCoder";
import AnimatedProjectPlaceholder from "@/components/AnimatedProjectPlaceholder";
import ImageProject from "@/components/ImageProject";
import ClickFX from "@/components/ClickFX";
import ContactSlideOver from "@/components/ContactSlideOver";

/**
 * Apple‑style Portfolio Landing (React + Tailwind + Framer Motion)
 * — Clean, airy, large type, soft shadows, subtle motion, glass/blur surfaces
 * — Projects are a WIDGET fed by /api/projects (Flask). Has graceful fallback.
 */

const PROFILE = loadProfile();

function useProjects() {
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await loadProjects();
        if (mounted) setProjects(data);
      } catch (e) {
        // loadProjects already falls back to local JSON
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { projects, loading };
}

function BrandNav() {
  const [dark, setDark] = React.useState(() => true);
  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      try { localStorage.setItem('theme', 'dark'); } catch {}
    } else {
      root.classList.remove("dark");
      try { localStorage.setItem('theme', 'light'); } catch {}
    }
  }, [dark]);

  const triggerThemeAnimation = React.useCallback((ev) => {
    const root = document.documentElement;
    try {
      const x = ev?.clientX ?? (window.innerWidth / 2);
      const y = ev?.clientY ?? (window.innerHeight / 2);
      root.style.setProperty('--theme-x', `${Math.round(x)}px`);
      root.style.setProperty('--theme-y', `${Math.round(y)}px`);
    } catch {}
    root.classList.add('theme-animating');
    try {
      clearTimeout(window.__themeAnimTimeout);
      window.__themeAnimTimeout = setTimeout(() => {
        root.classList.remove('theme-animating');
      }, 650);
    } catch (_) {}
  }, []);

  return (
    <div className="sticky top-0 z-40 supports-[backdrop-filter]:backdrop-blur-xl bg-white/60 dark:bg-neutral-900/60 border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#home" className="font-semibold tracking-tight text-sm md:text-base">{PROFILE.name}</a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#skills" className="opacity-70 hover:opacity-100">Skills</a>
          <a href="#projects" className="opacity-70 hover:opacity-100">Projects</a>
          <a href="#contact" className="opacity-70 hover:opacity-100">Contact</a>
        </nav>
        <Button onClick={(e) => { triggerThemeAnimation(e); setDark((d) => !d); }} size="sm" variant="ghost" aria-label="Toggle theme">
          {dark ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

function Hero() {
  const HERO = loadHero();
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const yMed = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const [spot, setSpot] = React.useState({ x: 0, y: 0, show: false });
  const onMouseMove = (e) => {
    const r = ref.current?.getBoundingClientRect?.();
    if (!r) return;
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, show: true });
  };
  const onMouseLeave = () => setSpot((s) => ({ ...s, show: false }));
  return (
    <section id="home" className="relative overflow-hidden" ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,200,0,0.06),transparent_60%)]" />
      <motion.div style={{ y: ySlow }} className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[42rem] rounded-full blur-3xl opacity-40 bg-[radial-gradient(30rem_12rem_at_50%_50%,rgba(255,184,0,0.16),transparent)]" />
      <motion.div style={{ y: yMed }} className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full blur-2xl opacity-30 bg-[radial-gradient(12rem_12rem_at_50%_50%,rgba(255,220,120,0.18),transparent)]" />
      <motion.div style={{ y: yFast }} className="pointer-events-none absolute top-32 left-16 h-32 w-56 rounded-full blur-2xl opacity-30 bg-[radial-gradient(16rem_10rem_at_50%_50%,rgba(255,170,0,0.16),transparent)]" />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.show ? 1 : 0,
          background: `radial-gradient(180px 140px at ${Math.round(spot.x)}px ${Math.round(spot.y)}px, rgba(255, 214, 0, 0.16), transparent 60%)`
        }}
      />
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center text-center gap-6">
          {HERO.badge && (
            <Badge className="rounded-full px-3 py-1 text-xs border bg-white/10 backdrop-blur border-yellow-500/30 text-yellow-300">{HERO.badge}</Badge>
          )}
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">{HERO.title}</h1>
          {HERO.subtitle && (
            <p className="max-w-2xl text-base md:text-lg text-neutral-600 dark:text-neutral-300">{HERO.subtitle}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton variant="gold" asChild className="px-6">
              <a href={HERO.primaryCta.href} className="flex items-center gap-2 group">
                {HERO.primaryCta.label} <motion.span whileHover={{ x: 4 }} className="inline-flex"><ArrowRight className="h-4 w-4" /></motion.span>
              </a>
            </MagneticButton>
            <MagneticButton variant="secondary" asChild className="px-6">
              <a href={(HERO.secondaryCta.href || '').replace('{email}', PROFILE.email) || `mailto:${PROFILE.email}`} className="flex items-center gap-2 group">
                <motion.span whileHover={{ rotate: 10 }} className="inline-flex"><Mail className="h-4 w-4" /></motion.span> {HERO.secondaryCta.label}
              </a>
            </MagneticButton>
          </div>
          <div className="flex items-center gap-4 pt-2 opacity-80">
            <a href={PROFILE.github} aria-label="GitHub" className="hover:opacity-100"><Github className="h-5 w-5" /></a>
            <a href={PROFILE.linkedin} aria-label="LinkedIn" className="hover:opacity-100"><Linkedin className="h-5 w-5" /></a>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{PROFILE.tag}</span>
          </div>
        </motion.div>
      </div>
      {HERO.showPreview && (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="max-w-5xl mx-auto px-4 pb-4 gold-glow">
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.25)] supports-[backdrop-filter]:backdrop-blur-xl overflow-hidden">
          {HERO.previewImage ? (
            HERO.previewImage.endsWith('/coder-placeholder.svg') ? (
              <div className="aspect-[16/8] w-full">
                <AnimatedCoder />
              </div>
            ) : (
              <div className="aspect-[16/8] w-full">
                <img src={HERO.previewImage} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            )
          ) : (
            <div className="aspect-[16/8] w-full grid place-items-center">
              <span className="text-sm md:text-base text-neutral-500 dark:text-neutral-400">{HERO.previewText}</span>
            </div>
          )}
        </div>
      </motion.div>
      )}
    </section>
  );
}

function ProjectCard({ p, i }) {
  const wrapRef = React.useRef(null);
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, s: 1 });
  const onMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const ry = (x - 0.5) * 10;
    const rx = -(y - 0.5) * 8;
    setTilt({ rx, ry, s: 1.01 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, s: 1 });
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.04 * i }}>
      <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} className="group relative" style={{ perspective: 1000 }}>
        <motion.div style={{ rotateX: tilt.rx, rotateY: tilt.ry, scale: tilt.s, transformStyle: "preserve-3d" }} transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.6 }}>
          <Card className="border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/50 supports-[backdrop-filter]:backdrop-blur-xl transition-all hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] overflow-hidden">
            <ImageProject src={p.image} alt={p.title || "Project"} />
            <CardContent className="pt-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-base md:text-lg font-semibold tracking-tight">{p.title}</h3>
          </div>
          <p className="text-sm md:text-[15px] text-neutral-600 dark:text-neutral-300 pb-3">{p.desc}</p>
          <div className="flex flex-wrap gap-2 pb-4">
            {(p.tags || []).map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full px-3 py-1 text-xs">{t}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {p.repo && (
              <MagneticButton asChild size="sm" variant="outline" className="gap-2">
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  style={{ pointerEvents: "auto" }}
                >
                  <motion.span whileHover={{ rotate: -10 }} className="inline-flex"><Code2 className="h-4 w-4" /></motion.span> Code
                </a>
              </MagneticButton>
            )}
            {p.demo && (
              <MagneticButton asChild size="sm" className="gap-2">
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  style={{ pointerEvents: "auto" }}
                >
                  <motion.span whileHover={{ x: 3 }} className="inline-flex"><ExternalLink className="h-4 w-4" /></motion.span> Demo
                </a>
              </MagneticButton>
            )}
          </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[30px] bg-[radial-gradient(200px_140px_at_50%_30%,rgba(255,200,0,0.14),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

function ProjectsWidget() {
  const { projects, loading } = useProjects();
  const [layout, setLayout] = React.useState(() => {
    try {
      return localStorage.getItem("projectsLayout") || "carousel";
    } catch (_) {
      return "carousel";
    }
  });
  React.useEffect(() => {
    try { localStorage.setItem("projectsLayout", layout); } catch {}
  }, [layout]);
  return (
    <section id="projects" className="max-w-6xl mx-auto px-4 py-14 relative z-30">
      <div className="pointer-events-none absolute -z-10 -top-10 right-0 h-56 w-56 rounded-full blur-3xl opacity-30 bg-[radial-gradient(14rem_10rem_at_50%_50%,rgba(255,184,0,0.16),transparent)]" />
      <div className="flex items-end justify-between pb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Recent Projects</h2>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/60 p-1">
            <button
              type="button"
              onClick={() => setLayout("carousel")}
              className={[
                "h-8 px-3 rounded-full text-sm flex items-center gap-2",
                layout === "carousel"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              ].join(" ")}
              aria-pressed={layout === "carousel"}
              aria-label="Show as slider"
            >
              <span className="inline-flex"><LayoutGrid className="h-4 w-4" /></span>
              <span className="hidden lg:inline">Slider</span>
            </button>
            <button
              type="button"
              onClick={() => setLayout("list")}
              className={[
                "h-8 px-3 rounded-full text-sm flex items-center gap-2",
                layout === "list"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              ].join(" ")}
              aria-pressed={layout === "list"}
              aria-label="Show as list"
            >
              <span className="inline-flex"><List className="h-4 w-4" /></span>
              <span className="hidden lg:inline">List</span>
            </button>
          </div>
          <a href={PROFILE.github} className="text-sm opacity-70 hover:opacity-100">View all on GitHub →</a>
        </div>
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-3xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-neutral-900/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {layout === "list" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, i) => <ProjectCard key={`${p.title}-${i}`} p={p} i={i} />)}
            </div>
          ) : (
            <>
              <div className="md:hidden grid grid-cols-1 gap-6">
                {projects.map((p, i) => <ProjectCard key={`${p.title}-${i}`} p={p} i={i} />)}
              </div>
              <div className="hidden md:block">
                <RailCarousel
                  items={projects}
                  renderItem={(p, i) => (
                    <div className="w-[320px]">
                      <ProjectCard p={p} i={i} />
                    </div>
                  )}
                />
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

function Footer() {
  const [open, setOpen] = React.useState(false);
  const email = loadProfile().email;
  return (
    <footer id="contact" className="max-w-6xl mx-auto px-4 py-10 text-sm">
      <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/50 supports-[backdrop-filter]:backdrop-blur-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-medium">Let’s build something together</h3>
          <p className="text-neutral-600 dark:text-neutral-300">I’m open to internships and interesting collaborations.</p>
          <div className="pt-2 flex flex-wrap gap-2 opacity-90">
            {['Web App', 'ML/AI', 'UI/UX', 'API/Backend'].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-xs border border-black/10 dark:border-white/15 bg-white/60 dark:bg-neutral-900/50">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpen(true)} className="gap-2"><Mail className="h-4 w-4" /> Let’s Talk</Button>
          <Button asChild variant="outline"><a href={PROFILE.github} className="flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</a></Button>
          <Button asChild variant="outline"><a href={PROFILE.linkedin} className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn</a></Button>
        </div>
      </div>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 pt-6">© {new Date().getFullYear()} {PROFILE.name}</div>
      <ContactSlideOver open={open} onClose={() => setOpen(false)} email={email} github={PROFILE.github} linkedin={PROFILE.linkedin} />
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white antialiased selection:bg-black/80 selection:text-white">
      <ClickFX />
      <BrandNav />
      <Hero />
      <Skills />
      <CodingProfile />
      <ProjectsWidget />
      <Footer />
    </div>
  );
}
