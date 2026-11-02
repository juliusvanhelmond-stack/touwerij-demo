import { useEffect, useState } from "react";
import { ParallaxPhoto, Reveal } from "./primitives";
import type { WeddingConfig } from "./types";

/** The personal letter. No heading: the salutation is the opening line. */
export function Invitation({ config }: { config: WeddingConfig }) {
  const { invitation: inv, venue } = config;
  return (
    <section
      id="invitation"
      aria-label="Persoonlijke uitnodiging"
      className="wed-paper overflow-hidden bg-wed-ivory px-5 pb-24 pt-24 text-wed-ink outline-none md:px-10 md:pb-36 md:pt-40"
    >
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-8">
        {/* Letter */}
        <div className="md:col-span-6 md:col-start-7 md:row-start-1 md:pt-16">
          <Reveal>
            <p className="font-wserif text-[1.55rem] italic leading-tight text-wed-cocoa md:text-[1.9rem]">
              {inv.salutation}
            </p>
          </Reveal>
          <div className="mt-8 space-y-6 md:mt-10 md:space-y-7">
            {inv.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}>
                <p className="max-w-[30ch] font-wserif text-[1.32rem] font-normal leading-[1.45] text-wed-ink/90 md:text-[1.6rem]">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.35} className="mt-12 md:mt-14">
            <p className="font-wsans text-[0.72rem] uppercase tracking-[0.3em] text-wed-cocoa/80">{inv.closing}</p>
            <p className="mt-3 font-wserif text-[2.6rem] italic leading-none text-wed-cocoa md:text-[3.4rem]">
              {inv.signature}
            </p>
          </Reveal>
        </div>

        {/* Photographs: a tall frame and a smaller, offset detail, like prints laid on a table. */}
        <div className="relative md:col-span-5 md:col-start-1 md:row-start-1">
          <Reveal y={36} className="relative w-[82%] md:w-full">
            <ParallaxPhoto
              photo={inv.photo}
              sizes="(min-width: 768px) 40vw, 82vw"
              className="aspect-[4/5] w-full"
              strength={7}
            />
          </Reveal>
          <Reveal
            y={48}
            delay={0.2}
            className="absolute -bottom-12 right-0 w-[46%] border-[6px] border-wed-ivory md:-bottom-20 md:-right-16 md:w-[52%] md:border-[10px]"
          >
            <ParallaxPhoto photo={inv.detail} sizes="(min-width: 768px) 22vw, 46vw" className="aspect-[3/4] w-full" strength={10} />
          </Reveal>
          <p
            aria-hidden
            className="absolute -left-9 top-0 hidden rotate-180 whitespace-nowrap font-wsans text-[0.6rem] uppercase tracking-[0.4em] text-wed-cocoa/60 [writing-mode:vertical-rl] lg:block"
          >
            {venue.name} · {config.dateShort}
          </p>
        </div>
      </div>

      <Countdown config={config} />
    </section>
  );
}

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    done: diff === 0,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

/** A quiet line of figures, not a ticking widget. */
function Countdown({ config }: { config: WeddingConfig }) {
  const t = useCountdown(config.ceremonyStart);
  const units = [
    { v: t.days, l: t.days === 1 ? "dag" : "dagen" },
    { v: t.hours, l: "uur" },
    { v: t.minutes, l: t.minutes === 1 ? "minuut" : "minuten" },
    { v: t.seconds, l: "sec" },
  ];
  const pad = (n: number, i: number) => (i === 0 ? String(n) : String(n).padStart(2, "0"));

  return (
    <Reveal className="mx-auto mt-32 max-w-[1240px] border-t border-wed-ink/15 pt-8 md:mt-48 md:pt-10">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
        <p className="font-wsans text-[0.68rem] uppercase tracking-[0.32em] text-wed-cocoa/80">{config.countdown.label}</p>
        <p className="sr-only">
          {t.done
            ? "De grote dag is aangebroken."
            : `Nog ${t.days} dagen tot de ceremonie op ${config.dateLong}.`}
        </p>
        <div aria-hidden className="wed-figures flex items-end gap-5 sm:gap-8 md:gap-12">
          {units.map((u, i) => (
            <div key={u.l} className="flex flex-col items-center">
              <span className="font-wserif text-[2.3rem] font-light leading-none text-wed-ink sm:text-[2.8rem] md:text-[3.4rem]">
                {pad(u.v, i)}
              </span>
              <span className="mt-2 font-wsans text-[0.6rem] uppercase tracking-[0.28em] text-wed-cocoa/70">{u.l}</span>
            </div>
          ))}
        </div>
        <p className="font-wserif text-[1.15rem] italic text-wed-cocoa">{config.countdown.after}</p>
      </div>
    </Reveal>
  );
}
