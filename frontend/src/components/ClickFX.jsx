import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

function useIsomorphicLayoutEffect(cb, deps) {
  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (isBrowser ? React.useLayoutEffect : React.useEffect)(cb, deps);
}

export default function ClickFX({ max = 10, duration = 700 }) {
  const reduce = useReducedMotion();
  const [events, setEvents] = React.useState([]);
  const idRef = React.useRef(0);
  const timeoutRefs = React.useRef(new Map());

  const add = React.useCallback((x, y) => {
    const id = idRef.current++;
    setEvents((prev) => {
      const next = [...prev, { id, x, y, at: Date.now() }];
      return next.length > max ? next.slice(next.length - max) : next;
    });
    const t = setTimeout(() => {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      timeoutRefs.current.delete(id);
    }, reduce ? 350 : duration);
    timeoutRefs.current.set(id, t);
  }, [duration, max, reduce]);

  useIsomorphicLayoutEffect(() => () => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current.clear();
  }, []);

  React.useEffect(() => {
    const onPointerDown = (e) => {
      // Only primary button for mouse; include touch
      if (e.pointerType === "mouse" && e.button !== 0) return;
      // Avoid when clicking inside inputs to reduce distraction
      const target = e.target;
      if (target && (target.closest?.("input, textarea, select, [contenteditable=true]"))) return;
      add(e.clientX, e.clientY);
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [add]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <AnimatePresence initial={false}>
        {events.map(({ id, x, y }) => (
          <Burst key={id} x={x} y={y} reduce={reduce} duration={duration} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

function Burst({ x, y, reduce, duration }) {
  const size = reduce ? 140 : 200;
  const ring = (
    <motion.span
      initial={{ opacity: 0.35, scale: 0 }}
      animate={{ opacity: 0, scale: 1.4 }}
      exit={{ opacity: 0 }}
      transition={{ duration: (reduce ? 0.35 : duration / 1000), ease: "easeOut" }}
      className="absolute rounded-full"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        background: "radial-gradient(closest-side, rgba(255,210,0,0.25), rgba(255,210,0,0.12) 40%, transparent 70%)",
        filter: "blur(0.2px)",
      }}
    />
  );

  const dots = reduce ? null : (
    Array.from({ length: 10 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
      const dist = 30 + Math.random() * 40;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const size = 4 + Math.random() * 3;
      const hue = 45 + Math.round(Math.random() * 10); // golden hues
      const color = `hsl(${hue} 100% 55% / 0.9)`;
      return (
        <motion.span
          key={i}
          initial={{ x, y, opacity: 1, scale: 0.9 }}
          animate={{ x: x + dx, y: y + dy, opacity: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration / 1000, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{ width: size, height: size, background: color, boxShadow: `0 0 10px ${color}` }}
        />
      );
    })
  );

  return (
    <>
      {ring}
      {dots}
    </>
  );
}

