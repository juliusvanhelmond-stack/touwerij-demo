# Sophie & Olivier — trouwwebsite demo

Een digitale trouwuitnodiging als one-pager, gemaakt door June Studio als demo
voor Something Borrowed Something New. Het bruidspaar is fictief.

React, Tailwind CSS en Framer Motion, gebouwd met Vite.

```bash
npm install
npm run dev
```

## Een ander bruidspaar

Alles wat bij het bruidspaar hoort, staat in één bestand:
`src/content/weddings/sophie-olivier.ts`. Daarin staan de namen, datum,
locatie, het programma, de kleuren, foto's en alle teksten. De componenten in
`src/components/wedding` lezen alleen uit dat bestand.

Foto's staan in `public/weddings/<slug>/` als `<naam>-<breedte>.webp`
(800, 1600 en 2400 px breed).

## RSVP

Het formulier praat alleen met `src/components/wedding/rsvp-service.ts`. In
deze demo wordt een antwoord alleen in de browser bewaard (localStorage) en
niet echt verzonden; de pagina meldt dat ook. Om live te gaan vervang je de
inhoud van `submitRsvp` door een aanroep naar een database of maildienst en
zet je `IS_DEMO` op `false`.

## Fotografie

De foto's komen van [Unsplash](https://unsplash.com) (Unsplash License).
