import React from "react";
import { motion } from "framer-motion";

export default function SkillRing({ size = 56, level = 0, className = "" }) {
  const radius = (size - 8) / 2; // 4px stroke on both sides
  const c = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, Number(level) || 0));
  const dash = (1 - pct / 100) * c;

  const mid = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={["shrink-0", className].join(" ")}
      aria-label={`Skill level ${pct}%`} role="img">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd34d" />
          <stop offset="60%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="#ffcc66" />
        </linearGradient>
      </defs>
      <circle cx={mid} cy={mid} r={radius} stroke="currentColor" className="opacity-20" strokeWidth="4" fill="none" />
      <motion.circle
        cx={mid}
        cy={mid}
        r={radius}
        stroke="url(#gold)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        transform={`rotate(-90 ${mid} ${mid})`}
        initial={{ strokeDasharray: c, strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: dash }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      />
    </svg>
  );
}

