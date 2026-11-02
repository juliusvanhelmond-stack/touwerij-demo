import { ArrowUpRight } from "lucide-react";
import { Folio, ParallaxPhoto, Reveal } from "./primitives";
import type { WeddingConfig } from "./types";

export function Venue({ config }: { config: WeddingConfig }) {
  const { venue } = config;
  const q = encodeURIComponent(venue.mapsQuery);
  const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;

  return (
    <section id="location" aria-labelledby="location-title" className="relative bg-wed-ivory text-wed-ink outline-none">
      <div className="relative">
        <ParallaxPhoto
          photo={venue.photo}
          sizes="100vw"
          strength={6}
          className="h-[68svh] min-h-[420px] w-full md:h-[92svh]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-wed-ink/45 via-wed-ink/5 to-transparent" />
        <div className="absolute inset-x-0 top-0 px-5 pt-20 md:px-10 md:pt-28">
          <div className="mx-auto max-w-[1240px]">
            <Reveal>
              <Folio tone="light">{venue.label}</Folio>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[17ch] font-wserif [text-wrap:balance] text-[2.05rem] italic leading-[1.08] text-wed-ivory md:text-[3.6rem]">
                “{venue.quote}”
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Details panel overlaps the photograph like a card tucked into its corner. */}
      <div className="relative z-10 px-5 md:px-10">
        <div className="mx-auto -mt-20 max-w-[1240px] md:-mt-48">
          <Reveal y={40} className="wed-paper ml-auto bg-wed-ivory px-6 py-10 md:w-[min(560px,48%)] md:px-12 md:py-14">
            <h2 id="location-title" className="font-wserif text-[2.1rem] leading-[1.05] md:text-[2.7rem]">
              {venue.name}
            </h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-wed-ink/75">{venue.description}</p>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-wed-ink/15 pt-7 sm:grid-cols-2">
              <address className="not-italic">
                <span className="block font-wsans text-[0.62rem] uppercase tracking-[0.3em] text-wed-cocoa/75">Adres</span>
                <span className="mt-2 block font-wserif text-[1.15rem] leading-snug">
                  {venue.address.street}
                  <br />
                  {venue.address.postcode} {venue.address.city}
                </span>
              </address>
              <div>
                <span className="block font-wsans text-[0.62rem] uppercase tracking-[0.3em] text-wed-cocoa/75">Aankomst</span>
                <span className="mt-2 block font-wserif text-[1.15rem] leading-snug">
                  Vanaf {config.programme.moments[0].time}
                  <br />
                  <span className="text-wed-ink/70">ceremonie om {config.programme.moments[1].time}</span>
                </span>
              </div>
            </div>
            <p className="mt-6 text-[0.9rem] leading-relaxed text-wed-ink/65">{venue.travelNote}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-wed-ink px-7 py-4 font-wsans text-[0.7rem] uppercase tracking-[0.28em] text-wed-ivory transition-colors duration-500 hover:bg-wed-cocoa"
              >
                Plan je route
                <ArrowUpRight
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.4}
                />
                <span className="sr-only">(opent Google Maps in een nieuw tabblad)</span>
              </a>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-center border-b border-wed-ink/30 pb-1 font-wsans text-[0.7rem] uppercase tracking-[0.28em] text-wed-ink/80 transition-colors hover:border-wed-ink hover:text-wed-ink sm:self-auto"
              >
                Bekijk op de kaart
                <span className="sr-only">(opent Google Maps in een nieuw tabblad)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
