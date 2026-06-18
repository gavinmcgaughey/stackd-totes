import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Stack'd Totes — Eco-Friendly Moving Tote Rental | Cincinnati & Dayton",
    template: "%s | Stack'd Totes",
  },
  description:
    "Skip the cardboard. Clean, reusable moving totes and dollies delivered to your door across Butler, Hamilton, Preble & Warren Counties. Drop-off and pickup included.",
  keywords: [
    "moving tote rental",
    "reusable moving boxes",
    "eco friendly moving boxes",
    "moving box rental Cincinnati",
    "rent moving totes",
    "Butler County",
    "Hamilton County",
    "Warren County",
    "Preble County",
  ],
  openGraph: {
    title: "Stack'd Totes — Eco-Friendly Moving Tote Rental",
    description:
      "Clean, reusable moving totes delivered to your door. No cardboard, no waste, no hassle.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
