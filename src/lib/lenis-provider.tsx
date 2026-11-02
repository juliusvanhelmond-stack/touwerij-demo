import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/** The active Lenis instance, or null when native scrolling is used (touch, reduced motion). */
export const useLenis = () => useContext(LenisContext);

/** Smooth wheel scrolling on desktop; native scrolling on touch devices and with reduced motion. */
export default function LenisProvider({ children }: { children: ReactNode }) {
  const [instance, setInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const lenis = new Lenis({ duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    setInstance(lenis);
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setInstance(null);
    };
  }, []);

  return <LenisContext.Provider value={instance}>{children}</LenisContext.Provider>;
}
