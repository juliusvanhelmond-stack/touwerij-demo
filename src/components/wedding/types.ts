/**
 * Shape of one wedding website. Everything couple-specific (names, date,
 * venue, programme, palette, photography and copy) lives in a single object
 * of this type, so a new couple is a new content file, not new components.
 */

export type WeddingPhoto = {
  /** Base path without width suffix, e.g. "/weddings/sophie-olivier/hands". */
  src: string;
  /** Widths that exist on disk as `${src}-${width}.webp`. */
  widths: number[];
  /** Intrinsic aspect ratio (width / height) to reserve space and avoid layout shift. */
  ratio: number;
  alt: string;
  /** CSS object-position for art-directed crops. */
  focus?: string;
};

export type WeddingMoment = {
  time: string;
  title: string;
  /** Optional English flourish shown in italics next to the Dutch title. */
  note: string;
  photo: WeddingPhoto;
};

export type WeddingInfoItem = {
  id: string;
  title: string;
  body: string[];
  link?: { label: string; href: string };
};

export type WeddingSwatch = { name: string; hex: string };

export type WeddingTheme = {
  /** Space separated RGB channels, so Tailwind alpha modifiers keep working. */
  ivory: string;
  paper: string;
  champagne: string;
  sand: string;
  olive: string;
  cocoa: string;
  ink: string;
};

export type WeddingConfig = {
  slug: string;
  meta: { title: string; description: string; ogImage: string };
  couple: { first: string; second: string; monogram: string };
  /** ISO timestamp of the ceremony, with timezone offset. Used for countdown and calendar file. */
  ceremonyStart: string;
  /** Calendar entry window: guest arrival until the end of the party. */
  arrival: string;
  partyEnd: string;
  dateLong: string;
  dateShort: string;
  region: string;
  theme: WeddingTheme;
  nav: { id: string; label: string }[];
  hero: {
    eyebrow: string;
    tagline: string;
    portrait: WeddingPhoto;
    wide: WeddingPhoto;
  };
  invitation: {
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
    photo: WeddingPhoto;
    detail: WeddingPhoto;
  };
  countdown: { label: string; after: string };
  programme: { label: string; intro: string; moments: WeddingMoment[] };
  venue: {
    label: string;
    name: string;
    quote: string;
    description: string;
    address: { street: string; postcode: string; city: string };
    mapsQuery: string;
    travelNote: string;
    photo: WeddingPhoto;
  };
  dresscode: {
    label: string;
    title: string;
    text: string;
    swatches: WeddingSwatch[];
    tips: string[];
    photo: WeddingPhoto;
  };
  practical: { label: string; intro: string; items: WeddingInfoItem[] };
  rsvp: {
    title: string;
    text: string;
    deadline: string;
    maxGuests: number;
    dietOptions: string[];
    thanksYes: string;
    thanksYesSub: string;
    thanksNo: string;
    thanksNoSub: string;
    demoNote: string;
  };
  closing: { quote: string; photo: WeddingPhoto };
  credit: { label: string; href: string };
};
