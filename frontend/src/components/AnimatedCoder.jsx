import React from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function AnimatedCoder({ className = "", onClick }) {
  const controls = useAnimationControls();

  const bounce = async () => {
    await controls.start({ y: -14, rotate: -2, transition: { type: "spring", stiffness: 600, damping: 16 } });
    await controls.start({ y: 0, rotate: 0, transition: { type: "spring", stiffness: 380, damping: 18 } });
  };

  const handleClick = async (e) => {
    await bounce();
    onClick?.(e);
  };

  return (
    <div className={["relative h-full w-full grid place-items-center bg-neutral-100 dark:bg-neutral-900", className].join(" ")}> 
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[85%] w-[85%] rounded-[32px] blur-3xl bg-[radial-gradient(28rem_14rem_at_50%_45%,rgba(255,184,0,0.16),transparent)]" />
      </div>
      <motion.svg
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(e); } }}
        role="img"
        aria-label="Coder placeholder"
        tabIndex={0}
        className="h-[64%] w-[64%] cursor-pointer select-none"
        viewBox="0 0 320 200"
        initial={{ scale: 1, y: 0, rotate: 0 }}
        whileHover={{ scale: 1.02 }}
        animate={controls}
      >
        <defs>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd34d" />
            <stop offset="50%" stopColor="#ffb300" />
            <stop offset="100%" stopColor="#ffcc66" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g fill="none" stroke="url(#goldStroke)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" filter="url(#softGlow)">
          <polyline points="70,100 120,70 120,85 90,100 120,115 120,130 70,100" />
          <line x1="150" y1="60" x2="130" y2="140" />
          <polyline points="200,70 250,100 200,130" />
        </g>
      </motion.svg>
    </div>
  );
}

