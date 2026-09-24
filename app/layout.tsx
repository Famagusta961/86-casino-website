import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = { title: "86 CASINO | Accra's destination for gaming & entertainment", description: "Luxury gaming, exceptional hospitality and unforgettable nights in Accra.", openGraph: { title: "86 CASINO", description: "Accra's destination for gaming and entertainment.", type: "website" } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>; }