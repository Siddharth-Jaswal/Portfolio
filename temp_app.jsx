import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, ExternalLink, Code2, Sun, MoonStar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Appleâ€‘style Portfolio Landing (React + Tailwind + Framer Motion)
 * â€” Clean, airy, large type, soft shadows, subtle motion, glass/blur surfaces
 * â€” Projects are a WIDGET fed by /api/projects (Flask). Has graceful fallback.
 */

const PROFILE = {
  name: "Siddharth Jaswal",
  tag: "Fullâ€‘Stack Developer Â· ML Enthusiast",
  email: "siddy32jaswal@gmail.com",
  github: "https://github.com/Siddharth-Jaswal",
  linkedin: "https://www.linkedin.com/in/your-profile",
  baseUrl: "http://127.0.0.1:5000",
};

function useProjects(baseUrl) {
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/api/projects`);
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        if (mounted) setProjects(data);
      } catch (e) {
        if (mounted)
          setProjects([
            {
              title: "LifeAura AI / SANKALP",
              desc: "Healthâ€‘tech platform: MERN + OCR + Disease Prediction + FHIR",
              tags: ["React", "Node", "MongoDB", "PyTorch", "FHIR"],
              repo: "https://github.com/your/repo",
              demo: "#",
            },
            {
              title: "Portfolio Engine",
              desc: "Dynamic React + Flask widgets, Appleâ€‘like design",
              tags: ["React", "Flask", "Tailwind", "Framer Motion"],
              repo: "https://github.com/your/repo2",
              demo: "#",
            },
            {
              title: "Xâ€‘Sum Visualizer",
              desc: "Algorithms playground for heaps / twoâ€‘pointers",
              tags: ["TypeScript", "Vite", "Algorithms"],
              repo: "#",
              demo: "#",
            },
          ]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [baseUrl]);

  return { projects, loading };
}

function BrandNav() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  }, [dark]);

  return (
    <div className="sticky top-0 z-40 supports-[backdrop-filter]:backdrop-blur-xl bg-white/60 dark:bg-neutral-900/60 border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#home" className="font-semibold tracking-tight text-sm md:text-base">{PROFILE.name}</a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#projects" className="opacity-70 hover:opacity-100">Projects</a>
          <a href="#contact" className="opacity-70 hover:opacity-100">Contact</a>
        </nav>
        <Button onClick={() => setDark((d) => !d)} size="sm" variant="ghost" aria-label="Toggle theme">
          {dark ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(0,0,0,0.06),transparent_60%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center text-center gap-6">
          <Badge className="rounded-full px-3 py-1 text-xs border bg-white/70 backdrop-blur dark:bg-neutral-900/70">Available for internships</Badge>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">Building calm, delightful software</h1>
          <p className="max-w-2xl text-base md:text-lg text-neutral-600 dark:text-neutral-300">I craft fast UIs, scalable APIs, and practical ML featuresâ€” with an eye for detail and a preference for simplicity.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="px-6"><a href="#projects" className="flex items-center gap-2">View Projects <ArrowRight className="h-4 w-4" /></a></Button>
            <Button variant="secondary" asChild className="px-6"><a href={`mailto:${PROFILE.email}`} className="flex items-center gap-2"><Mail className="h-4 w-4" /> Contact</a></Button>
          </div>
          <div className="flex items-center gap-4 pt-2 opacity-80">
            <a href={PROFILE.github} aria-label="GitHub" className="hover:opacity-100"><Github className="h-5 w-5" /></a>
            <a href={PROFILE.linkedin} aria-label="LinkedIn" className="hover:opacity-100"><Linkedin className="h-5 w-5" /></a>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{PROFILE.tag}</span>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="max-w-5xl mx-auto px-4 pb-4">
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.25)] supports-[backdrop-filter]:backdrop-blur-xl overflow-hidden">
          <div className="aspect-[16/8] w-full grid place-items-center">
            <span className="text-sm md:text-base text-neutral-500 dark:text-neutral-400">Landing preview area â€” hero screenshot or product montage</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ProjectCard({ p, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.04 * i }}>
      <Card className="border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/50 supports-[backdrop-filter]:backdrop-blur-xl transition-all hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)]">
        <CardContent>
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
            {p.repo && (<Button asChild size="sm" variant="outline" className="gap-2"><a href={p.repo}><Code2 className="h-4 w-4" /> Code</a></Button>)}
            {p.demo && (<Button asChild size="sm" className="gap-2"><a href={p.demo}><ExternalLink className="h-4 w-4" /> Demo</a></Button>)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProjectsWidget() {
  const { projects, loading } = useProjects(PROFILE.baseUrl);
  return (
    <section id="projects" className="max-w-6xl mx-auto px-4 py-14">
      <div className="flex items-end justify-between pb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Recent Projects</h2>
        <a href={PROFILE.github} className="text-sm opacity-70 hover:opacity-100">View all on GitHub â†’</a>
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-3xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-neutral-900/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => <ProjectCard key={`${p.title}-${i}`} p={p} i={i} />)}
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="max-w-6xl mx-auto px-4 py-10 text-sm">
      <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/50 supports-[backdrop-filter]:backdrop-blur-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-medium">Letâ€™s build something together</h3>
          <p className="text-neutral-600 dark:text-neutral-300">Iâ€™m open to internships and interesting collaborations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="secondary"><a href={`mailto:${PROFILE.email}`} className="flex items-center gap-2"><Mail className="h-4 w-4" /> {PROFILE.email}</a></Button>
          <Button asChild variant="outline"><a href={PROFILE.github} className="flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</a></Button>
          <Button asChild variant="outline"><a href={PROFILE.linkedin} className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn</a></Button>
        </div>
      </div>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 pt-6">Â© {new Date().getFullYear()} {PROFILE.name}</div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white antialiased selection:bg-black/80 selection:text-white">
      <BrandNav />
      <Hero />
      <ProjectsWidget />
      <Footer />
    </div>
  );
}

