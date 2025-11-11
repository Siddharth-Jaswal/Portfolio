import React from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function AnimatedProjectPlaceholder({ className = "", onClick }) {
  const controls = useAnimationControls();

  const bounce = async () => {
    await controls.start({ y: -14, rotate: -2, transition: { type: "spring", stiffness: 620, damping: 16 } });
    await controls.start({ y: 0, rotate: 0, transition: { type: "spring", stiffness: 380, damping: 18 } });
  };

  const handleClick = async (e) => {
    await bounce();
    onClick?.(e);
  };

  return (
    <div className={["relative h-full w-full grid place-items-center bg-neutral-100 dark:bg-neutral-900", className].join(" ")}> 
      {/* ambient gold haze */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[85%] w-[85%] rounded-[32px] blur-3xl bg-[radial-gradient(26rem_12rem_at_50%_45%,rgba(255,184,0,0.14),transparent)]" />
      </div>
      <motion.svg
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(e); } }}
        role="img"
        aria-label="Glowing coder placeholder"
        tabIndex={0}
        className="h-[72%] w-[72%] cursor-pointer select-none"
        viewBox="0 0 360 220"
        initial={{ scale: 1, y: 0, rotate: 0 }}
        whileHover={{ scale: 1.02 }}
        animate={{ y: [0, -4, 0], transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" } }}
      >
        <defs>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe08a"/>
            <stop offset="60%" stopColor="#ffcc66"/>
            <stop offset="100%" stopColor="rgba(255,184,0,0)"/>
          </radialGradient>
          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
        </defs>

        {/* subtle bot outline */}
        <g opacity="0.18" stroke="#ffd34d" strokeWidth="5" fill="none">
          <rect x="110" y="58" width="140" height="96" rx="24" ry="24" />
          <path d="M90 106 Q180 154 270 106" />
        </g>

        {/* eyes */}
        <motion.g filter="url(#soft)" initial={false}>
          <motion.circle cx="150" cy="90" r="10" fill="url(#eyeGlow)" animate={{ r: [10, 12, 10], opacity: [0.9, 1, 0.9] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle cx="210" cy="90" r="10" fill="url(#eyeGlow)" animate={{ r: [10, 12, 10], opacity: [0.9, 1, 0.9] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} />
        </motion.g>

        {/* little feet lights */}
        <motion.g filter="url(#soft)" opacity="0.9">
          <motion.circle cx="168" cy="158" r="6" fill="url(#eyeGlow)" animate={{ r: [5.5, 6.5, 5.5], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.05 }} />
          <motion.circle cx="192" cy="158" r="6" fill="url(#eyeGlow)" animate={{ r: [5.5, 6.5, 5.5], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }} />
        </motion.g>
      </motion.svg>
    </div>
  );
}
