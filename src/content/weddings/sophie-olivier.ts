import type { WeddingConfig, WeddingPhoto } from "@/components/wedding/types";

/**
 * Sophie & Olivier: fictional demo couple for June Event Pages.
 * To create a site for another couple, copy this file, change the values and
 * point a route at it. Photos live in /public/weddings/<slug>/ as
 * `<name>-<width>.webp` (see the `photo()` helper below).
 */

const base = "/weddings/sophie-olivier";

const photo = (name: string, ratio: number, alt: string, focus?: string, widths = [800, 1600, 2400]): WeddingPhoto => ({
  src: `${base}/${name}`,
  widths,
  ratio,
  alt,
  focus,
});

export const sophieOlivier: WeddingConfig = {
  slug: "sophie-en-olivier",
  meta: {
    title: "Sophie & Olivier · 19 juni 2027",
    description:
      "Sophie & Olivier trouwen op 19 juni 2027 op Landgoed Rhederoord. Alles over de dag, de locatie, de dresscode en je RSVP.",
    ogImage: `${base}/hero-wide-1600.webp`,
  },
  couple: { first: "Sophie", second: "Olivier", monogram: "S&O" },
  ceremonyStart: "2027-06-19T15:00:00+02:00",
  arrival: "2027-06-19T14:30:00+02:00",
  partyEnd: "2027-06-20T01:00:00+02:00",
  dateLong: "19 juni 2027",
  dateShort: "19.06.2027",
  region: "Nederland",
  theme: {
    ivory: "248 244 236",
    paper: "240 233 220",
    champagne: "227 211 183",
    sand: "201 182 151",
    olive: "122 124 92",
    cocoa: "92 70 55",
    ink: "43 33 27",
  },
  nav: [
    { id: "the-day", label: "The Day" },
    { id: "location", label: "Location" },
    { id: "rsvp", label: "RSVP" },
  ],
  hero: {
    eyebrow: "You are invited",
    tagline: "Some moments are meant to be shared.",
    portrait: photo(
      "hero-portrait",
      2 / 3,
      "Een bruidspaar loopt hand in hand door hoog gras, het laatste zonlicht achter de heuvels",
      "50% 62%",
    ),
    wide: photo(
      "hero-wide",
      3 / 2,
      "Een bruidspaar in elkaars armen op een heuvel tijdens golden hour, met een weids landschap op de achtergrond",
      "50% 45%",
    ),
  },
  invitation: {
    salutation: "Lieve familie en vrienden,",
    paragraphs: [
      "Met heel veel liefde nodigen we jullie uit om samen met ons een bijzondere dag te vieren.",
      "Een dag vol mooie momenten, heerlijk eten, muziek en vooral de mensen die ons het meest dierbaar zijn.",
      "We kunnen niet wachten om deze herinnering met jullie te maken.",
    ],
    closing: "Liefs,",
    signature: "Sophie & Olivier",
    photo: photo("hands", 3 / 2, "Sophie en Olivier hand in hand, hun schaduwen vallen samen op het gras", "38% 50%"),
    detail: photo("bouquet", 3 / 2, "Bruidsboeket van zachte rozen en groen in tegenlicht", "62% 50%"),
  },
  countdown: { label: "Nog even geduld", after: "tot we elkaar zien" },
  programme: {
    label: "The Day",
    intro: "Van het eerste glas tot de laatste dans.",
    moments: [
      {
        time: "14:30",
        title: "Ontvangst & champagne",
        note: "Een eerste glas in de schaduw van de oude beuken.",
        photo: photo("toast", 3 / 2, "Gasten heffen het glas tijdens de ontvangst", "45% 40%"),
      },
      {
        time: "15:00",
        title: "De ceremonie",
        note: "In de tuin, tussen de bloemen. Dit moment wil je niet missen.",
        photo: photo("ceremony", 3 / 2, "Een houten ceremonieboog met linnen doek en een boeket van zomerbloemen", "40% 45%"),
      },
      {
        time: "16:00",
        title: "Toast & borrel",
        note: "Proosten, bijpraten en genieten van het middaglicht.",
        photo: photo("bouquet", 3 / 2, "Bruidsboeket in het warme middaglicht", "62% 50%"),
      },
      {
        time: "18:00",
        title: "Dinner under the stars",
        note: "Aan lange tafels, met kaarslicht, verhalen en gerechten om te delen.",
        photo: photo("long-table", 3 / 2, "Lange gedekte tafel met linnen, glaswerk en losse veldbloemen", "35% 50%"),
      },
      {
        time: "21:00",
        title: "Let's dance",
        note: "Schoenen uit mag. Tot in de kleine uurtjes.",
        photo: photo("table", 2 / 3, "Kaarsen en rozen op een gedekte tafel in de avond", "50% 40%"),
      },
    ],
  },
  venue: {
    label: "Location",
    name: "Landgoed Rhederoord",
    quote: "A little escape, a beautiful place, and all our favourite people.",
    description:
      "Een historisch landhuis aan de voet van de Veluwezoom, omringd door oude bomen, glooiende tuinen en een weids uitzicht over de IJsselvallei. Hier zeggen we ja, dineren we buiten en dansen we tot de sterren verschijnen.",
    address: { street: "Parkweg 19", postcode: "6994 CM", city: "De Steeg" },
    mapsQuery: "Landgoed Rhederoord, Parkweg 19, 6994 CM De Steeg",
    travelNote: "Ongeveer 15 minuten rijden vanaf Arnhem. Gratis parkeren op het landgoed.",
    photo: photo("garden", 3 / 2, "Ceremonieopstelling in een tuin met rozen en een pad naar de bloemenboog", "50% 55%"),
  },
  dresscode: {
    label: "Dresscode",
    title: "Summer Chic",
    text: "Think soft colours, elegant silhouettes and a touch of summer romance.",
    swatches: [
      { name: "Champagne", hex: "#E6D6BB" },
      { name: "Salie", hex: "#AEB293" },
      { name: "Zand", hex: "#D3BE9E" },
      { name: "Blush", hex: "#E7CBBF" },
      { name: "Olijf", hex: "#7A7C5C" },
    ],
    tips: [
      "Wit laten we graag aan de bruid.",
      "De ceremonie is op gras: kies hakken met een brede zool.",
      "Neem iets warms mee voor na zonsondergang.",
    ],
    photo: photo("dresscode", 3 / 2, "Een vrouw in een lichte zomerjurk met bloemenprint en een rieten tasje aan zee", "50% 30%"),
  },
  practical: {
    label: "Goed om te weten",
    intro: "Alles wat je nog wilt weten, rustig op een rij.",
    items: [
      {
        id: "parkeren",
        title: "Parkeren & vervoer",
        body: [
          "Op het landgoed kun je gratis parkeren. Volg bij de ingang de bordjes ‘Sophie & Olivier’.",
          "Kom je met de trein? Om 13:45 vertrekt een shuttle vanaf station Arnhem Centraal, aan de zijde van het busstation. Om 00:30 en 01:15 rijdt hij terug.",
        ],
      },
      {
        id: "overnachten",
        title: "Overnachten",
        body: [
          "Op het landgoed hebben we een aantal kamers voor jullie vastgehouden. Noem ‘Sophie & Olivier’ bij je reservering, het liefst vóór 1 april 2027.",
          "Daarnaast vind je in Rheden, Velp en Arnhem fijne hotels en B&B’s op korte afstand.",
        ],
        link: { label: "Bekijk de omgeving", href: "https://www.google.com/maps/search/?api=1&query=hotel%20Rheden%20Velp%20De%20Steeg" },
      },
      {
        id: "cadeau",
        title: "Cadeautip",
        body: [
          "Jullie aanwezigheid is het mooiste cadeau. Wil je ons toch iets meegeven? Met een bijdrage aan onze huwelijksreis door Puglia maak je ons heel blij.",
          "Op de dag staat er een linnen enveloppendoos bij de champagne.",
        ],
      },
      {
        id: "vragen",
        title: "Vragen of een verrassing?",
        body: [
          "Onze ceremoniemeester Lotte denkt graag met je mee, of je nu een speech, een lied of een andere verrassing in gedachten hebt. Laat het haar uiterlijk 1 juni weten.",
        ],
        link: { label: "Mail Lotte", href: "mailto:ceremoniemeester@sophie-en-olivier.nl?subject=Bruiloft%20Sophie%20%26%20Olivier" },
      },
    ],
  },
  rsvp: {
    title: "Will you celebrate with us?",
    text: "Laat ons weten of je erbij bent. We kijken ernaar uit om samen met jou deze bijzondere dag te vieren.",
    deadline: "Graag vóór 1 mei 2027",
    maxGuests: 4,
    dietOptions: ["Vegetarisch", "Veganistisch", "Glutenvrij", "Lactosevrij", "Notenallergie"],
    thanksYes: "Thank you, we can't wait to celebrate with you!",
    thanksYesSub: "We hebben je antwoord ontvangen. Zet de dag alvast in je agenda.",
    thanksNo: "Wat jammer, we gaan je missen.",
    thanksNoSub: "Dank je wel voor het laten weten. We proosten op 19 juni ook op jou.",
    demoNote: "Dit is een demo: je antwoord wordt alleen in deze browser bewaard en niet echt verzonden.",
  },
  closing: {
    quote: "Here's to love, laughter and a lifetime of memories.",
    photo: photo("closing", 3 / 2, "Sophie en Olivier zitten samen aan het water terwijl de zon ondergaat", "50% 60%"),
  },
  credit: { label: "Een June Event Page", href: "https://www.june-studio.nl/june-event-pages" },
};
