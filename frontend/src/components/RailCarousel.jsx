import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function classNames(...xs) { return xs.filter(Boolean).join(" "); }

export default function RailCarousel({ items = [], renderItem, itemWidth = 320, gap = 24, className = "" }) {
  const reduce = useReducedMotion();
  const railRef = React.useRef(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(items.length > 1);

  const scrollByItems = (n) => {
    const el = railRef.current;
    if (!el) return;
    const delta = n * (itemWidth + gap);
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
  };

  const updateNav = React.useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth - 1;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < max);
  }, []);

  React.useEffect(() => {
    updateNav();
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => updateNav();
    el.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => updateNav();
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateNav]);

  return (
    <div className={classNames("relative", className)}>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-white/80 dark:from-neutral-950/80 to-transparent rounded-l-3xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-white/80 dark:from-neutral-950/80 to-transparent rounded-r-3xl" />
      <div
        ref={railRef}
        className="flex overflow-x-auto no-scrollbar scroll-smooth"
        style={{ gap, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", paddingBottom: 4 }}
        role="list"
        aria-label="Projects rail"
      >
        {items.map((it, i) => (
          <motion.div
            key={i}
            role="listitem"
            className="shrink-0"
            style={{ width: itemWidth, scrollSnapAlign: "start" }}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <motion.div
              whileHover={reduce ? {} : { y: -4, scale: 1.02, rotateX: 0.5 }}
              transition={{ type: "spring", stiffness: 240, damping: 20, mass: 0.6 }}
            >
              {renderItem(it, i)}
            </motion.div>
          </motion.div>
        ))}
      </div>
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollByItems(-1)}
            className={classNames(
              "group absolute left-1 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full shadow-md",
              "border border-black/10 dark:border-white/15",
              "bg-white/80 dark:bg-neutral-900/70 backdrop-blur",
              "hover:bg-white/90 dark:hover:bg-neutral-900/80",
              !canPrev && "opacity-40 cursor-not-allowed"
            )}
            aria-label="Previous project"
            disabled={!canPrev}
            title="Previous"
          >
            <ChevronLeft className="mx-auto h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByItems(1)}
            className={classNames(
              "group absolute right-1 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full shadow-md",
              "border border-black/10 dark:border-white/15",
              "bg-white/80 dark:bg-neutral-900/70 backdrop-blur",
              "hover:bg-white/90 dark:hover:bg-neutral-900/80",
              !canNext && "opacity-40 cursor-not-allowed"
            )}
            aria-label="Next project"
            disabled={!canNext}
            title="Next"
          >
            <ChevronRight className="mx-auto h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
