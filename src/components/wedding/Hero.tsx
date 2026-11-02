import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASE, srcAt, srcSet, useScrollToSection } from "./primitives";
import type { WeddingConfig } from "./types";

/** One line of display type that rises out of its own mask. */
function MaskLine({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={reduced ? false : { y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.5, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ config }: { config: WeddingConfig }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const scrollTo = useScrollToSection();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const { hero, couple } = config;

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, ease: EASE, delay },
        };

  return (
    <section
      ref={ref}
      id="top"
      aria-label={`Uitnodiging voor de bruiloft van ${couple.first} en ${couple.second}`}
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-wed-ink text-wed-ivory"
    >
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: imageY }}>
        <motion.picture
          className="block h-full w-full"
          initial={reduced ? false : { scale: 1.14, opacity: 0.4 }}
          animate={{ scale: 1.04, opacity: 1 }}
          transition={{ duration: 3.2, ease: EASE }}
        >
          <source media="(max-aspect-ratio: 4/5)" srcSet={srcSet(hero.portrait)} sizes="100vw" />
          <img
            src={srcAt(hero.wide, 1600)}
            srcSet={srcSet(hero.wide)}
            sizes="100vw"
            alt={hero.wide.alt}
            width={1600}
            height={1067}
            decoding="async"
            {...({ fetchpriority: "high" } as Record<string, string>)}
            className="wed-hero-img h-full w-full object-cover"
            style={
              {
                "--focus-wide": hero.wide.focus ?? "50% 50%",
                "--focus-portrait": hero.portrait.focus ?? "50% 50%",
              } as React.CSSProperties
            }
          />
        </motion.picture>
      </motion.div>

      {/* Light falloff for legibility: warm at the top, deeper toward the date line. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--wed-ink)/0.45)_0%,rgb(var(--wed-ink)/0.08)_32%,rgb(var(--wed-ink)/0.18)_58%,rgb(var(--wed-ink)/0.62)_100%)]"
      />

      {/* Deckle: a hairline inset frame, like the edge of a printed card. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-3 border border-wed-ivory/25 md:inset-5"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: EASE, delay: 1.2 }}
      />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-16 pt-20 text-center"
        style={reduced ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.p
          {...fade(0.5)}
          className="mb-6 font-wsans text-[0.66rem] uppercase tracking-[0.42em] text-wed-ivory/85 md:mb-8"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="font-wserif font-normal leading-[0.86] tracking-[-0.02em] text-[clamp(3.9rem,17.5vw,11.5rem)]">
          <MaskLine delay={0.35} className="md:-translate-x-[0.55em]">
            {couple.first}
          </MaskLine>
          <MaskLine delay={0.55} className="md:translate-x-[0.5em]">
            <span className="mr-[0.2em] align-[0.04em] text-[0.62em] font-light italic text-wed-champagne">&amp;</span>
            {couple.second}
          </MaskLine>
        </h1>

        <motion.p
          {...fade(1.25)}
          className="mt-8 font-wsans text-[0.72rem] uppercase tracking-[0.36em] text-wed-ivory md:mt-10 md:text-[0.78rem]"
        >
          <time dateTime={config.ceremonyStart.slice(0, 10)}>{config.dateLong}</time>
          <span aria-hidden className="mx-3 text-wed-champagne">
            ·
          </span>
          {config.region}
        </motion.p>

        <motion.p
          {...fade(1.5)}
          className="mt-5 max-w-[26ch] font-wserif text-[1.2rem] [text-wrap:balance] italic leading-snug text-wed-ivory/90 md:text-[1.45rem]"
        >
          {hero.tagline}
        </motion.p>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollTo("invitation")}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2.2 }}
        className="group absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 font-wsans text-[0.6rem] uppercase tracking-[0.38em] text-wed-ivory/80 hover:text-wed-ivory md:bottom-10"
        aria-label="Scroll naar de uitnodiging"
      >
        <span>Open</span>
        <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-wed-ivory/25">
          <span className="wed-scroll-cue absolute left-0 top-0 block h-1/2 w-px bg-wed-ivory" />
        </span>
      </motion.button>
    </section>
  );
}
