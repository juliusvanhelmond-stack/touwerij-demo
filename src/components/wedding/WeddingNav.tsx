import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, useScrollToSection } from "./primitives";
import type { WeddingConfig } from "./types";

/**
 * Minimal top bar: monogram left, three anchors right. Transparent over the
 * hero, then settles onto ivory paper once the invitation is opened.
 */
export function WeddingNav({ config }: { config: WeddingConfig }) {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const scrollTo = useScrollToSection();
  const reduced = useReducedMotion();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setSolid(window.scrollY > window.innerHeight * 0.82);
      // Active section = the last nav target whose top has passed the middle of the screen.
      const mid = window.innerHeight * 0.5;
      let current: string | null = null;
      for (const item of config.nav) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= mid) current = item.id;
      }
      // Leave "active" once the closing image takes over the screen.
      const closing = document.getElementById("closing");
      const closingTop = closing ? closing.getBoundingClientRect().top : Infinity;
      if (closingTop <= mid) current = null;
      setActive(current);
      // The closing photograph is the back of the card: let it breathe without a bar on top.
      setHidden(closingTop <= window.innerHeight * 0.35);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [config.nav]);

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: hidden ? "-100%" : 0 }}
      transition={{ duration: reduced ? 0 : hasEntered ? 0.7 : 1, ease: EASE, delay: hasEntered ? 0 : 1.6 }}
      onAnimationComplete={() => setHasEntered(true)}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-700",
        solid
          ? "border-b border-wed-ink/10 bg-wed-ivory/95 text-wed-ink backdrop-blur-[2px]"
          : "border-b border-transparent text-wed-ivory",
      )}
    >
      <nav
        aria-label="Hoofdnavigatie"
        className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-5 md:h-16 md:px-10"
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("top");
          }}
          className="font-wserif text-[1.35rem] italic leading-none tracking-tight"
          aria-label={`${config.couple.first} en ${config.couple.second}, terug naar boven`}
        >
          {config.couple.monogram.split("&")[0]}
          <span className="mx-[0.08em] font-light not-italic opacity-70">&amp;</span>
          {config.couple.monogram.split("&")[1]}
        </a>
        <ul className="flex items-center gap-5 sm:gap-8">
          {config.nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.id);
                }}
                aria-current={active === item.id ? "location" : undefined}
                className={cn(
                  "group relative py-2 font-wsans text-[0.68rem] uppercase tracking-[0.26em] transition-opacity",
                  item.id === "rsvp" ? "opacity-100" : "opacity-80 hover:opacity-100",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-500",
                    active === item.id || item.id === "rsvp" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    item.id === "rsvp" && active !== "rsvp" && "opacity-50",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
