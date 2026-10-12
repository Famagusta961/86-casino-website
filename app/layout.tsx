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
    icons: { icon: "/brand/86-casino-logo.png" },
    openGraph: {
      title: s.casinoName,
      description: s.description,
      type: "website",
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
