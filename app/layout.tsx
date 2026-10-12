import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteSettings } from "@/lib/content";
import "./globals.css";
export async function generateMetadata(): Promise<Metadata> {
  const s = await siteSettings();
  return {
    title: s.title,
    description: s.description,
    metadataBase: new URL("https://www.86-casino.com"),
    icons: {
      icon: [
        {
          url: "/brand/86-casino-icon-red-32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/brand/86-casino-icon-red-48.png",
          sizes: "48x48",
          type: "image/png",
        },
      ],
      apple: {
        url: "/brand/86-casino-icon-red-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    },
    openGraph: {
      title: s.casinoName,
      description: s.description,
      type: "website",
      images: [
        {
          url: "/brand/86-casino-social-transparent.png",
          width: 1200,
          height: 630,
          alt: "86 Casino",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: s.casinoName,
      description: s.description,
      images: ["/brand/86-casino-social-transparent.png"],
    },
  };
}
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
