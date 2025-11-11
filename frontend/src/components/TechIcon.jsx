import React from "react";
import {
  Atom,
  Wind,
  Box,
  Route,
  FlaskConical,
  Leaf,
  Ship,
  Triangle,
  GitBranch,
  Package,
  Database,
  Server,
  Wrench,
  Sparkles,
  Braces,
  Code,
  Cloud,
  Terminal,
} from "lucide-react";

const map = {
  react: Atom,
  html: Code,
  css: Braces,
  javascript: Braces,
  js: Braces,
  typescript: Braces,
  ts: Braces,
  vite: Sparkles,
  redux: Route,
  tailwind: Wind,
  node: Box,
  express: Route,
  "express.js": Route,
  flask: FlaskConical,
  mongo: Leaf,
  mongodb: Leaf,
  docker: Ship,
  vercel: Triangle,
  git: GitBranch,
  postman: Package,
  database: Database,
  backend: Server,
  tools: Wrench,
  next: Triangle,
  "next.js": Triangle,
  nextjs: Triangle,
  mysql: Database,
  postgres: Database,
  postgresql: Database,
  sqlite: Database,
  sql: Database,
  aws: Cloud,
  gcp: Cloud,
  azure: Cloud,
  kubernetes: Box,
  k8s: Box,
  nginx: Server,
  linux: Terminal,
  bash: Terminal,
  shell: Terminal,
};

export default function TechIcon({ name = "", className = "", size = 22 }) {
  const key = String(name).toLowerCase();
  const Icon = map[key] || Sparkles;
  const color = pickColor(key);
  return <Icon className={className} size={size} color={color} />;
}

function pickColor(key) {
  if (key.includes("react")) return "#61dafb";
  if (key.includes("tailwind")) return "#38bdf8";
  if (key === "html") return "#e34f26";
  if (key === "css") return "#1572b6";
  if (key.includes("typescript") || key === "ts") return "#3178c6";
  if (key.includes("javascript") || key === "js") return "#f7df1e";
  if (key.includes("node")) return "#68a063";
  if (key.includes("express")) return "#999999";
  if (key.includes("redux")) return "#764abc";
  if (key.includes("mongo")) return "#10a777";
  if (key.includes("docker")) return "#2496ed";
  if (key.includes("vercel")) return "#111111";
  if (key.includes("git")) return "#f34f29";
  if (key.includes("postman")) return "#ff6c37";
  if (key.includes("mysql")) return "#00758f";
  if (key.includes("postgres")) return "#336791";
  if (key.includes("sqlite")) return "#0f80cc";
  if (key.includes("aws")) return "#ff9900";
  if (key.includes("azure")) return "#0078d4";
  if (key.includes("gcp")) return "#4285f4";
  return undefined; // inherit currentColor
}
