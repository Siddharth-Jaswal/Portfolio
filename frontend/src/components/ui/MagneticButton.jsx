import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function MagneticButton({ children, asChild, intensity = 16, ...props }) {
  const ref = React.useRef(null);
  const [tx, setTx] = React.useState(0);
  const [ty, setTy] = React.useState(0);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const clamp = (n) => Math.max(-1, Math.min(1, n));
    setTx(clamp(dx) * intensity);
    setTy(clamp(dy) * intensity);
  };
  const onLeave = () => { setTx(0); setTy(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform: `translate3d(${tx}px, ${ty}px, 0)` }}
      transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.6 }}
      className="inline-block group"
    >
      <Button asChild={asChild} {...props}>
        {/* allow icon nudge on hover via group */}
        {children}
      </Button>
    </motion.div>
  );
}

