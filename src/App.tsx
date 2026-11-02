import type { CSSProperties } from "react";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/jost/wght.css";
import "@/components/wedding/wedding.css";
import { WeddingNav } from "@/components/wedding/WeddingNav";
import { Hero } from "@/components/wedding/Hero";
import { Invitation } from "@/components/wedding/Invitation";
import { Programme } from "@/components/wedding/Programme";
import { Venue } from "@/components/wedding/Venue";
import { Dresscode } from "@/components/wedding/Dresscode";
import { Practical } from "@/components/wedding/Practical";
import { Rsvp } from "@/components/wedding/Rsvp";
import { Closing } from "@/components/wedding/Closing";
import type { WeddingConfig } from "@/components/wedding/types";
import { sophieOlivier } from "@/content/weddings/sophie-olivier";

/**
 * A wedding website rendered entirely from one content object.
 * Pass another couple's config to reuse every component as-is.
 * Page title and social meta tags live in index.html.
 */
export default function App({ config = sophieOlivier }: { config?: WeddingConfig }) {
  const themeVars = Object.fromEntries(
    Object.entries(config.theme).map(([k, v]) => [`--wed-${k}`, v]),
  ) as CSSProperties;

  return (
    <div className="wed-root min-h-screen bg-wed-ivory text-wed-ink" style={themeVars}>

      <a
        href="#invitation"
        className="sr-only z-[70] bg-wed-ivory px-4 py-3 text-wed-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ga naar de inhoud
      </a>
      <WeddingNav config={config} />
      <main>
        <Hero config={config} />
        <Invitation config={config} />
        <Programme config={config} />
        <Venue config={config} />
        <Dresscode config={config} />
        <Practical config={config} />
        <Rsvp config={config} />
      </main>
      <Closing config={config} />
    </div>
  );
}
