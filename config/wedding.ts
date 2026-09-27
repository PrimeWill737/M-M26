export interface Ceremony {
  id: string;
  label: string;
  date: string;
  time: string;
  timezone: string;
  utcOffset: string;
  venue: string;
  address: string;
  mapQuery: string;
  mapUrl?: string;
  timeConfirmed: boolean;
  durationHours: number;
  attire: string[];
}
export interface RSVPContact {
  name: string;
  phone: string;
  international: string;
  whatsappOnly?: boolean;
}
export interface Shade {
  name: string;
  hex: string;
}
export interface WeddingConfig {
  brand: {
    monogram: string;
    bride: string;
    groom: string;
    brideFirst: string;
    groomFirst: string;
    location: string;
  };
  families: { bride: string; groom: string };
  wedding: Ceremony;
  traditional: Ceremony;
  colors: { wedding: Shade[]; traditional: Shade[] };
  rsvpContacts: RSVPContact[];
  music: { src: string };
  guestWish: { submit?: (message: string) => Promise<void> };
  links: { website: string; android: string; ios: string; developer: string };
  siteUrl: string;
}
const configuredMusic = process.env.NEXT_PUBLIC_MUSIC_SRC ?? "";
const musicSrc =
  configuredMusic === "off"
    ? ""
    : configuredMusic.startsWith("/") || configuredMusic.startsWith("http")
      ? configuredMusic
      : "/audio/invitation.mp3";
export const weddingConfig: WeddingConfig = {
  brand: {
    monogram: "M&M26",
    bride: "Meda Bosworth",
    groom: "Marrion Agbakansi",
    brideFirst: "Meda",
    groomFirst: "Marrion",
    location: "Jos, Plateau State",
  },
  families: {
    bride: "Pastor & Mrs Bosworth Onoja",
    groom: "Mr & Mrs Gabriel Agbakansi Chukwujekwu",
  },
  wedding: {
    id: "wedding",
    label: "The Wedding",
    date: "2026-12-19",
    time: "10:00",
    timezone: "Africa/Lagos",
    utcOffset: "+01:00",
    venue: "Basel Event Center",
    address: "Dong, Jos, Plateau State",
    mapQuery: "Basel Event Center, Dong, Jos, Plateau State, Nigeria",
    timeConfirmed: true,
    durationHours: 3,
    attire: ["Any Shade of Green", "Any Shade of Purple"],
  },
  traditional: {
    id: "traditional",
    label: "The Traditional Celebration",
    date: "2026-12-18",
    time: "13:00",
    timezone: "Africa/Lagos",
    utcOffset: "+01:00",
    venue: "Millennium Conference Centre",
    address: "Close to Amusement Park, Jos, Plateau State",
    mapQuery:
      "Millennium Conference Centre, Jos, Plateau State, Nigeria",
    mapUrl: "https://maps.app.goo.gl/c2H9BB2MsQFKBtfY8",
    timeConfirmed: false,
    durationHours: 3,
    attire: ["Burnt Orange", "Beige"],
  },
  colors: {
    wedding: [
      { name: "Forest", hex: "#294a3e" },
      { name: "Emerald", hex: "#326c54" },
      { name: "Olive", hex: "#73774d" },
      { name: "Sage", hex: "#a1ad94" },
      { name: "Plum", hex: "#604561" },
      { name: "Lavender", hex: "#c5b2d2" },
      { name: "Violet", hex: "#796084" },
      { name: "Mauve", hex: "#af8fa2" },
    ],
    traditional: [
      { name: "Burnt Orange", hex: "#ac522f" },
      { name: "Terracotta", hex: "#bf7960" },
      { name: "Beige", hex: "#d7c6a8" },
      { name: "Sand", hex: "#e5d8bd" },
    ],
  },
  rsvpContacts: [
    {
      name: "William",
      phone: "08166072005",
      international: "2348166072005",
      whatsappOnly: true,
    },
    {
      name: "Grace Agbakansi",
      phone: "08038801128",
      international: "2348038801128",
    },
    {
      name: "Joseph Azumara",
      phone: "08133948394",
      international: "2348133948394",
    },
    
  ],
  music: { src: musicSrc },
  guestWish: {},
  links: {
    website: process.env.NEXT_PUBLIC_JOSCITY_WEBSITE_URL || "",
    android: process.env.NEXT_PUBLIC_JOSCITY_ANDROID_URL || "",
    ios: process.env.NEXT_PUBLIC_JOSCITY_IOS_URL || "",
    developer: "https://william-lac.vercel.app",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
};
