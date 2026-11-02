import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "@/lib/lenis-provider";
import { cn } from "@/lib/utils";
import type { WeddingPhoto } from "./types";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const srcSet = (photo: WeddingPhoto) => photo.widths.map((w) => `${photo.src}-${w}.webp ${w}w`).join(", ");
export const srcAt = (photo: WeddingPhoto, width: number) => `${photo.src}-${width}.webp`;

type PhotoProps = {
  photo: WeddingPhoto;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Override the alt text, e.g. "" when the image is purely decorative in that spot. */
  alt?: string;
};

/** Responsive, layout-stable photograph. The parent decides the frame; the image covers it. */
export function Photo({ photo, sizes, className, priority, alt }: PhotoProps) {
  const fallback = photo.widths.includes(1600) ? 1600 : photo.widths[photo.widths.length - 1];
  return (
    <img
      src={srcAt(photo, fallback)}
      srcSet={srcSet(photo)}
      sizes={sizes}
      alt={alt ?? photo.alt}
      width={1600}
      height={Math.round(1600 / photo.ratio)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // React 18 does not know fetchPriority yet; pass it lowercase so it reaches the DOM.
      {...(priority ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
      className={cn("h-full w-full object-cover", className)}
      style={{ objectPosition: photo.focus }}
    />
  );
}

/**
 * Photo that drifts slightly against the scroll direction inside its frame.
 * The frame (this component) clips; the image is scaled up so edges never show.
 */
export function ParallaxPhoto({
  photo,
  sizes,
  className,
  strength = 8,
  priority,
}: PhotoProps & { strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y, scale: 1 + (strength * 2.4) / 100 }}
      >
        <Photo photo={photo} sizes={sizes} priority={priority} />
      </motion.div>
    </div>
  );
}

/** Soft fade-and-rise once the element enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "p" | "li" | "span" | "figure";
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/** Small uppercase folio label, used instead of big section headings. */
export function Folio({ children, className, tone = "dark" }: { children: ReactNode; className?: string; tone?: "dark" | "light" }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-wsans text-[0.68rem] uppercase tracking-[0.32em]",
        tone === "dark" ? "text-wed-cocoa/80" : "text-wed-ivory/80",
        className,
      )}
    >
      <span aria-hidden className={cn("h-px w-8", tone === "dark" ? "bg-wed-cocoa/40" : "bg-wed-ivory/50")} />
      {children}
    </p>
  );
}

/** Smooth scroll to a section, through Lenis when it runs, natively otherwise. */
export function useScrollToSection() {
  const lenis = useLenis();
  const reduced = useReducedMotion();
  return (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { duration: reduced ? 0 : 1.4 });
    } else {
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
    // Move focus for keyboard and screen reader users without a second jump.
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    if (window.location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
  };
}

/** Builds an .ics file so guests can save the date in any calendar app. */
export function downloadIcs(opts: { title: string; start: string; end: string; location: string; description: string; slug: string }) {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//June Studio//Event Pages//NL",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${opts.slug}@june-studio.nl`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(opts.start)}`,
    `DTEND:${fmt(opts.end)}`,
    `SUMMARY:${esc(opts.title)}`,
    `LOCATION:${esc(opts.location)}`,
    `DESCRIPTION:${esc(opts.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${opts.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
