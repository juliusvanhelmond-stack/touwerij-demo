import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, Folio, Photo, Reveal } from "./primitives";
import type { WeddingConfig } from "./types";

/**
 * The day as a timeline. A sticky photograph changes with the moment you are
 * reading (a band on top on phones, a tall frame on the left on desktop), while
 * a hairline fills as the afternoon turns into night.
 */
export function Programme({ config }: { config: WeddingConfig }) {
  const { programme } = config;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-moment]") ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.moment));
        });
      },
      { rootMargin: "-55% 0px -40% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="the-day"
      aria-labelledby="the-day-title"
      className="wed-paper bg-wed-paper px-5 pb-20 pt-24 text-wed-ink outline-none md:px-10 md:pb-32 md:pt-36"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="mb-12 md:mb-20 md:grid md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-6 md:col-start-7">
            <Folio>{programme.label}</Folio>
            <h2 id="the-day-title" className="mt-5 max-w-[16ch] font-wserif [text-wrap:balance] text-[2rem] italic leading-[1.1] text-wed-ink md:text-[2.6rem]">
              {programme.intro}
            </h2>
            <p className="mt-4 font-wsans text-[0.8rem] uppercase tracking-[0.24em] text-wed-cocoa/80">
              Zaterdag {config.dateLong}
            </p>
          </div>
        </Reveal>

        <div className="md:grid md:grid-cols-12 md:gap-x-8">
          {/* Sticky photograph */}
          <div className="sticky top-14 z-10 -mx-5 bg-wed-paper pb-6 md:top-28 md:col-span-5 md:mx-0 md:h-[calc(100svh-9rem)] md:pb-0">
            <div className="relative h-[34svh] min-h-[220px] overflow-hidden md:h-full">
              {programme.moments.map((m, i) => (
                <motion.div
                  key={m.time}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0, scale: i === active || reduced ? 1 : 1.06 }}
                  transition={{ duration: reduced ? 0 : 1.2, ease: EASE }}
                  aria-hidden={i !== active}
                >
                  <Photo photo={m.photo} sizes="(min-width: 768px) 40vw, 100vw" alt={i === active ? m.photo.alt : ""} />
                </motion.div>
              ))}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-wed-ink/55 to-transparent px-5 pb-4 pt-16 text-wed-ivory md:px-6 md:pb-5">
                <span className="wed-figures font-wserif text-[1.6rem] leading-none md:text-[2rem]">
                  {programme.moments[active].time}
                </span>
                <span className="font-wsans text-[0.6rem] uppercase tracking-[0.3em] opacity-85">
                  {String(active + 1).padStart(2, "0")} / {String(programme.moments.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <ol ref={listRef} className="relative md:col-span-6 md:col-start-7">
            <span aria-hidden className="absolute bottom-6 left-[5.15rem] top-3 w-px bg-wed-ink/15 md:left-[7.65rem]" />
            <motion.span
              aria-hidden
              className="absolute bottom-6 left-[5.15rem] top-3 w-px origin-top bg-wed-cocoa md:left-[7.65rem]"
              style={{ scaleY: reduced ? 1 : progress }}
            />
            {programme.moments.map((m, i) => (
              <li
                key={m.time}
                data-moment={i}
                className="relative grid grid-cols-[4.4rem_1fr] gap-x-6 py-9 md:min-h-[42svh] md:grid-cols-[6.4rem_1fr] md:gap-x-10 md:py-14"
              >
                <time
                  dateTime={m.time}
                  className={cn(
                    "wed-figures pt-0.5 text-right font-wserif text-[1.65rem] leading-none transition-colors duration-700 md:text-[2.5rem]",
                    i <= active ? "text-wed-ink" : "text-wed-ink/40",
                  )}
                >
                  {m.time}
                </time>
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[calc(5.15rem-3px)] top-[2.75rem] h-[7px] w-[7px] rotate-45 border transition-colors duration-700 md:left-[calc(7.65rem-3px)] md:top-[4.1rem]",
                    i <= active ? "border-wed-cocoa bg-wed-cocoa" : "border-wed-ink/30 bg-wed-paper",
                  )}
                />
                <Reveal y={14}>
                  <h3 className="font-wserif text-[1.45rem] leading-tight text-wed-ink md:text-[1.9rem]">{m.title}</h3>
                  <p className="mt-2 max-w-[34ch] text-[0.98rem] leading-relaxed text-wed-ink/70 md:text-[1.05rem]">{m.note}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
