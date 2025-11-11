import React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useMotionValueEvent } from "framer-motion";

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

export default function SpiralCarousel({ items = [], renderItem, className = "", height = 460, itemWidth = 320, spacing }) {
  const reduceMotion = useReducedMotion();
  const raw = useMotionValue(0);
  const active = useSpring(raw, { stiffness: 160, damping: 22, mass: 0.6 });
  const count = items.length;
  const maxIndex = Math.max(0, count - 1);
  const gap = 56; // visual gap between cards
  const spacingPx = typeof spacing === "number" ? spacing : itemWidth + gap; // prevent overlap by default

  const [activeRounded, setActiveRounded] = React.useState(0);
  useMotionValueEvent(active, "change", (v) => {
    const clamped = Math.round(Math.max(0, Math.min(maxIndex, v)));
    setActiveRounded(clamped);
  });

  // Drag handling
  const dragRef = React.useRef(null);
  const dragState = React.useRef({ x: 0, dragging: false });

  const isInteractive = (el) => {
    if (!el || el === document.body) return false;
    const selector = 'a,button,input,textarea,select,label,[role="button"],[role="link"],[contenteditable="true"]';
    return !!(el.closest && el.closest(selector));
  };

  const onPointerDown = (e) => {
    // Don't steal pointer from interactive elements like anchors/buttons
    if (isInteractive(e.target)) return;
    dragState.current.dragging = true;
    dragState.current.x = e.clientX;
    dragRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.x;
    raw.set(clamp(raw.get() - dx / spacingPx, 0, maxIndex));
    dragState.current.x = e.clientX;
  };
  const onPointerUp = (e) => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    dragRef.current?.releasePointerCapture(e.pointerId);
    raw.set(Math.round(clamp(raw.get(), 0, maxIndex)));
  };

  // Wheel/trackpad scroll
  const wheelTimeout = React.useRef(null);
  const onWheel = (e) => {
    if (reduceMotion) return; // in reduced motion, let natural scroll handle
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!delta) return;
    raw.set(clamp(raw.get() + delta / spacingPx, 0, maxIndex));
    clearTimeout(wheelTimeout.current);
    wheelTimeout.current = setTimeout(() => {
      raw.set(Math.round(clamp(raw.get(), 0, maxIndex)));
    }, 120);
    e.preventDefault();
  };

  // Keyboard nav
  const containerRef = React.useRef(null);
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      raw.set(clamp(Math.round(raw.get()) + 1, 0, maxIndex));
    } else if (e.key === "ArrowLeft") {
      raw.set(clamp(Math.round(raw.get()) - 1, 0, maxIndex));
    }
  };

  if (reduceMotion) {
    return (
      <div className={["overflow-x-auto", className].join(" ")} style={{ height }}>
        <div className="flex gap-6 pr-6" style={{ height }}>
          {items.map((it, i) => (
            <div key={i} className="shrink-0" style={{ width: 320 }}>
              {renderItem(it, i)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={["relative", className].join(" ")}
      style={{ perspective: 1000, height }}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label="Projects spiral carousel"
      role="listbox"
    >
      <div
        ref={dragRef}
        className="relative h-full select-none"
        style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {items.map((it, i) => (
          <SpiralItem key={i} index={i} active={active} spacing={spacingPx}>
            <div role="option" aria-selected={Math.round(active.get()) === i}>{renderItem(it, i)}</div>
          </SpiralItem>
        ))}
      </div>
      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => raw.set(clamp(activeRounded - 1, 0, maxIndex))}
            className="h-9 px-3 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/60 hover:bg-white/90 dark:hover:bg-neutral-900/80 text-sm"
            aria-label="Previous project"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => raw.set(clamp(activeRounded + 1, 0, maxIndex))}
            className="h-9 px-3 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/60 hover:bg-white/90 dark:hover:bg-neutral-900/80 text-sm"
            aria-label="Next project"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}

function SpiralItem({ index, active, spacing, children }) {
  const offset = useTransform(active, (a) => index - a);
  const x = useTransform(offset, (o) => o * (typeof spacing === "number" ? spacing : 376));
  const y = useTransform(offset, (o) => 24 * Math.sin(o * 0.8));
  const rotateY = useTransform(offset, (o) => `${-12 * o}deg`);
  const scale = useTransform(offset, (o) => 1 - 0.1 * Math.min(2, Math.abs(o)));
  const opacity = useTransform(offset, (o) => 0.25 + 0.75 * Math.exp(-Math.abs(o) / 1.5));
  const zIndexMv = useTransform(offset, (o) => 1000 - Math.round(Math.abs(o) * 10));
  const weight = useTransform(offset, (o) => Math.max(0, 1 - Math.min(1, Math.abs(o))));
  const highlightOpacity = useTransform(weight, (w) => 0.08 + 0.22 * w);
  const highlightScale = useTransform(weight, (w) => 0.9 + 0.2 * w);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div className="will-change-transform" style={{ x, y, opacity, zIndex: zIndexMv, position: "relative" }}>
        <motion.div
          className="relative group cursor-grab active:cursor-grabbing"
          style={{ rotateY, scale }}
          whileHover={{ scale: 1.04, rotateX: 2 }}
          transition={{ type: "spring", stiffness: 240, damping: 22, mass: 0.6 }}
          onFocus={() => active.set(index)}
          tabIndex={0}
        >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-[28px] bg-[radial-gradient(140px_100px_at_50%_40%,rgba(255,200,0,0.18),transparent)]"
          style={{ opacity: highlightOpacity, scale: highlightScale }}
        />
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
