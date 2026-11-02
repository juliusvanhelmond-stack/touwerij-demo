import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        wserif: ['"Bodoni Moda Variable"', '"Bodoni Moda"', "Didot", "Georgia", "serif"],
        wsans: ['"Jost Variable"', "Jost", '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      colors: {
        // Driven by CSS variables set from the couple's content file (theme block).
        wed: {
          ivory: "rgb(var(--wed-ivory) / <alpha-value>)",
          paper: "rgb(var(--wed-paper) / <alpha-value>)",
          champagne: "rgb(var(--wed-champagne) / <alpha-value>)",
          sand: "rgb(var(--wed-sand) / <alpha-value>)",
          olive: "rgb(var(--wed-olive) / <alpha-value>)",
          cocoa: "rgb(var(--wed-cocoa) / <alpha-value>)",
          ink: "rgb(var(--wed-ink) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
