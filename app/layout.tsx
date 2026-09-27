import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { weddingConfig as c } from "@/config/wedding";
import { displayDate } from "@/utils/calendar";
import "@/styles/main.scss";
const serif = localFont({
  src: [
    {
      path: "./fonts/cormorant-garamond-latin-normal.woff2",
      weight: "400 600",
      style: "normal",
    },
    {
      path: "./fonts/cormorant-garamond-latin-italic.woff2",
      weight: "400 600",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});
const sans = localFont({
  src: "./fonts/montserrat-latin-normal.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
});
const script = localFont({
  src: "./fonts/great-vibes-latin-normal.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});
const title = `${c.brand.brideFirst} & ${c.brand.groomFirst} | ${c.brand.monogram} Wedding Invitation`;
const description = `Together with their families, ${c.brand.bride} and ${c.brand.groom} invite you to celebrate their wedding on ${displayDate(c.wedding)} in ${c.brand.location}.`;
export const metadata: Metadata = {
  metadataBase: new URL(
    c.siteUrl ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title,
  description,
  ...(c.siteUrl ? { alternates: { canonical: c.siteUrl } } : {}),
  openGraph: {
    title: `${c.brand.brideFirst} & ${c.brand.groomFirst} — ${c.brand.monogram}`,
    description,
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "/images/mm26-social-card.jpg",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/mm26-social-card.jpg"],
  },
  icons: { icon: "/icons/monogram.svg" },
};
export const viewport: Viewport = {
  themeColor: "#f5f2e9",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} ${script.variable}`}>
        {children}
      </body>
    </html>
  );
}
