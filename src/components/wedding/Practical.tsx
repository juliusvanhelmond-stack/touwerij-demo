import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, Folio, Reveal } from "./primitives";
import type { WeddingConfig, WeddingInfoItem } from "./types";

export function Practical({ config }: { config: WeddingConfig }) {
  const { practical } = config;
  const [open, setOpen] = useState<string | null>(practical.items[0]?.id ?? null);

  return (
    <section aria-labelledby="practical-title" className="wed-paper bg-wed-paper px-5 py-24 text-wed-ink md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-8">
        <Reveal className="md:col-span-4">
          <Folio>{practical.label}</Folio>
          <h2 id="practical-title" className="mt-5 max-w-[14ch] font-wserif [text-wrap:balance] text-[1.9rem] italic leading-[1.12] md:text-[2.3rem]">
            {practical.intro}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-7 md:col-start-6">
          <ul className="border-t border-wed-ink/20">
            {practical.items.map((item) => (
              <AccordionRow
                key={item.id}
                item={item}
                open={open === item.id}
                onToggle={() => setOpen((cur) => (cur === item.id ? null : item.id))}
              />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function AccordionRow({ item, open, onToggle }: { item: WeddingInfoItem; open: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion();
  const uid = useId();
  const panelId = `${uid}-panel`;
  const buttonId = `${uid}-button`;

  return (
    <li className="border-b border-wed-ink/20">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
        >
          <span
            className={cn(
              "font-wserif text-[1.35rem] leading-tight transition-[color,transform] duration-500 md:text-[1.6rem]",
              open ? "text-wed-ink" : "text-wed-ink/80 group-hover:translate-x-1 group-hover:text-wed-ink",
            )}
          >
            {item.title}
          </span>
          <span aria-hidden className="relative h-3.5 w-3.5 shrink-0">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-wed-ink/80" />
            <span
              className={cn(
                "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-wed-ink/80 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                open ? "scale-y-0" : "scale-y-100",
              )}
            />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            key="panel"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="max-w-[56ch] space-y-3 pb-8 pr-8 text-[1rem] leading-relaxed text-wed-ink/75">
              {item.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {item.link && (
                <a
                  href={item.link.href}
                  {...(item.link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="mt-2 inline-block border-b border-wed-cocoa/40 pb-0.5 font-wsans text-[0.68rem] uppercase tracking-[0.26em] text-wed-cocoa transition-colors hover:border-wed-cocoa"
                >
                  {item.link.label}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
