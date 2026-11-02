import { Folio, ParallaxPhoto, Reveal } from "./primitives";
import type { WeddingConfig } from "./types";

export function Dresscode({ config }: { config: WeddingConfig }) {
  const { dresscode: dc } = config;
  return (
    <section
      id="dresscode"
      aria-labelledby="dresscode-title"
      className="wed-paper bg-wed-ivory px-5 pb-24 pt-24 text-wed-ink md:px-10 md:pb-40 md:pt-48"
    >
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-y-12 md:grid-cols-12 md:gap-x-8">
        <Reveal y={36} className="md:col-span-6">
          <ParallaxPhoto photo={dc.photo} sizes="(min-width: 768px) 48vw, 100vw" strength={6} className="aspect-[4/5] w-full md:aspect-[5/6]" />
        </Reveal>

        <div className="md:col-span-5 md:col-start-8">
          <Reveal>
            <Folio>{dc.label}</Folio>
            <h2 id="dresscode-title" className="mt-6 font-wserif text-[3rem] italic leading-[0.95] md:text-[4.2rem]">
              {dc.title}
            </h2>
            <p className="mt-6 max-w-[30ch] font-wserif text-[1.25rem] leading-[1.45] text-wed-ink/85 md:text-[1.4rem]">
              {dc.text}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <ul aria-label="Kleurenpalet" className="flex gap-2.5 sm:gap-3">
              {dc.swatches.map((s, i) => (
                <li key={s.name} className="group flex-1">
                  <span
                    className="block aspect-[3/4] w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1.5"
                    style={{ backgroundColor: s.hex, transitionDelay: `${i * 20}ms` }}
                  />
                  <span className="mt-2.5 block font-wsans text-[0.58rem] uppercase tracking-[0.2em] text-wed-ink/70 sm:text-[0.62rem]">
                    {s.name}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25}>
            <ul className="mt-10 space-y-3 border-t border-wed-ink/15 pt-7">
              {dc.tips.map((tip) => (
                <li key={tip} className="flex gap-4 text-[0.98rem] leading-relaxed text-wed-ink/75">
                  <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-wed-cocoa/60" />
                  {tip}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
