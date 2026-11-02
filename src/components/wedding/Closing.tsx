import { ParallaxPhoto, Reveal } from "./primitives";
import type { WeddingConfig } from "./types";

/** The back of the invitation: one photograph, one line, the names and the date. */
export function Closing({ config }: { config: WeddingConfig }) {
  const { closing, couple } = config;
  return (
    <footer id="closing" className="relative overflow-hidden bg-wed-ink text-wed-ivory">
      <ParallaxPhoto photo={closing.photo} sizes="100vw" strength={6} className="h-[100svh] min-h-[600px] w-full" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--wed-ink)/0.25)_0%,rgb(var(--wed-ink)/0.15)_40%,rgb(var(--wed-ink)/0.7)_100%)]" />
      <span aria-hidden className="pointer-events-none absolute inset-3 border border-wed-ivory/25 md:inset-5" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <p className="mx-auto max-w-[18ch] font-wserif [text-wrap:balance] text-[2.2rem] italic leading-[1.1] md:text-[3.8rem]">
            {closing.quote}
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-12 md:mt-16">
          <p className="font-wserif text-[1.5rem] md:text-[1.9rem]">
            {couple.first} <span className="italic text-wed-champagne">&amp;</span> {couple.second}
          </p>
          <p className="wed-figures mt-3 font-wsans text-[0.72rem] uppercase tracking-[0.42em] text-wed-ivory/80">
            {config.dateShort}
          </p>
        </Reveal>
      </div>

      <div className="absolute inset-x-0 bottom-7 flex justify-center md:bottom-10">
        <a
          href={config.credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-wsans text-[0.58rem] uppercase tracking-[0.34em] text-wed-ivory/55 transition-colors hover:text-wed-ivory"
        >
          {config.credit.label}
        </a>
      </div>
    </footer>
  );
}
