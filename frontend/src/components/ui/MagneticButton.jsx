import React from "react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({ children, asChild, intensity = 12, radius = 140, ...props }) {
  const ref = React.useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 180, damping: 22, mass: 0.6 });
  const raf = React.useRef(0);

  const setTarget = (nx, ny) => {
    // nx, ny are normalized to [-1, 1]
    const dist = Math.hypot(nx, ny);
    // Falloff so it doesn’t snap: force weak near edges, stronger near center
    const falloff = Math.max(0, 1 - Math.min(1, dist));
    const tx = nx * intensity * falloff;
    const ty = ny * intensity * falloff;
    rawX.set(tx);
    rawY.set(ty);
  };

  const onMove = (e) => {
    // Only respond to mouse to avoid jitter on touch/pen
    if (e.nativeEvent?.pointerType && e.nativeEvent.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Normalize to [-1, 1] by radius (px)
    const nx = Math.max(-1, Math.min(1, dx / radius));
    const ny = Math.max(-1, Math.min(1, dy / radius));

    // Throttle with RAF to avoid oscillation from rapid updates
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setTarget(nx, ny));
  };

  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    rawX.set(0);
    rawY.set(0);
  };

  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y, willChange: "transform" }}
      className="inline-block group"
    >
      <Button asChild={asChild} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
