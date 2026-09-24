import { prisma } from "./db";

export const fallbackSettings = { casinoName: "86 CASINO", title: "86 Casino | Accra's destination for gaming & entertainment", description: "Luxury gaming, exceptional hospitality and unforgettable nights in Accra.", phone: "+233 30 000 0086", email: "hello@86casino.com", address: "Accra, Ghana", directions: "https://maps.google.com/?q=Accra,Ghana", hours: "Open daily · 12:00 - late", instagram: null, facebook: null, twitter: null, youtube: null, copyright: "© 2026 86 CASINO. All rights reserved.", ageNotice: "18+ only. Please gamble responsibly." };
export const fallbackImages = { hero: "https://images.unsplash.com/photo-1518893883800-45cd0954574b?auto=format&fit=crop&w=1800&q=85", lounge: "https://images.unsplash.com/photo-1548811579-017e9f3a4bbf?auto=format&fit=crop&w=1200&q=80", exterior: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" };

export async function siteSettings() { try { return await prisma.siteSetting.findUnique({ where: { id: "site" } }) ?? fallbackSettings; } catch { return fallbackSettings; } }
export async function games() { try { return await prisma.game.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }); } catch { return []; } }
export async function promotions() { try { return await prisma.promotion.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }); } catch { return []; } }
export async function events() { try { return await prisma.event.findMany({ where: { active: true }, orderBy: { dateTime: "asc" } }); } catch { return []; } }
export async function gallery() { try { return await prisma.galleryItem.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }); } catch { return []; } }
export async function pageBySlug(slug: string) { try { return await prisma.page.findFirst({ where: { slug, published: true } }); } catch { return null; } }