import { prisma } from "./db";

export const fallbackSettings = { casinoName: "86 CASINO", title: "86 Casino | Accra's destination for gaming & entertainment", description: "Luxury gaming, exceptional hospitality and unforgettable nights in Accra.", phone: "+233 30 000 0086", email: "hello@86casino.com", address: "Accra, Ghana", directions: "https://maps.google.com/?q=Accra,Ghana", hours: "Open daily · 12:00 - late", instagram: null, facebook: null, twitter: null, youtube: null, copyright: "© 2026 86 CASINO. All rights reserved.", ageNotice: "18+ only. Please gamble responsibly." };
const casinoAsset = (file: string) => `/assets/casino/${file}.webp`;
export const fallbackImages = { hero: "/assets/casino/hero-optimized.webp", lounge: casinoAsset("006"), exterior: casinoAsset("010") };
export const fallbackGames = [
	{ id: "fallback-roulette", name: "Roulette", subtitle: "The timeless classic", description: "Feel the energy at the wheel.", image: casinoAsset("002") },
	{ id: "fallback-blackjack", name: "Blackjack", subtitle: "The game of 21", description: "Bring your best hand to the table.", image: casinoAsset("003") },
	{ id: "fallback-baccarat", name: "Baccarat", subtitle: "Quietly sophisticated", description: "A refined classic for considered players.", image: casinoAsset("004") },
	{ id: "fallback-poker", name: "Poker", subtitle: "Take your seat", description: "A social, high-energy table experience.", image: casinoAsset("005") },
	{ id: "fallback-slots", name: "Slots", subtitle: "A little more sparkle", description: "Discover a handpicked collection of favourites.", image: casinoAsset("007") }
];
export const fallbackPromotions = [
	{ id: "fallback-welcome", title: "Welcome in Style", subtitle: "Your first night, elevated", description: "Start your 86 experience with a host of small luxuries and a welcome worth remembering.", image: casinoAsset("008"), terms: null },
	{ id: "fallback-reward", title: "Play More. Be Rewarded.", subtitle: "Make evenings memorable", description: "Ask our hosts about the details that make your time at the tables feel even more considered.", image: casinoAsset("009"), terms: null },
	{ id: "fallback-events", title: "Special Event Nights", subtitle: "The weekend starts here", description: "Live atmosphere, signature cocktails and table-side energy in the heart of Accra.", image: casinoAsset("011"), terms: null }
];
export const fallbackEvents = [
	{ id: "fallback-live", title: "Live at 86", subtitle: "Music · every Friday", description: "Accra's finest live performers set the tone for the weekend.", image: casinoAsset("012"), dateTime: new Date("2026-10-02T20:00:00") },
	{ id: "fallback-social", title: "Saturday Social", subtitle: "Every Saturday night", description: "Good company, a lively room and a reason to stay out later.", image: casinoAsset("013"), dateTime: new Date("2026-10-03T20:00:00") },
	{ id: "fallback-lounge", title: "The 86 Lounge", subtitle: "An evening ritual", description: "Unwind with a considered drinks list and service to match.", image: casinoAsset("014"), dateTime: new Date("2026-10-04T18:00:00") }
];
export const fallbackGallery = Array.from({ length: 14 }, (_, index) => casinoAsset(String(index + 1).padStart(3, "0")));

export async function siteSettings() { try { return await prisma.siteSetting.findUnique({ where: { id: "site" } }) ?? fallbackSettings; } catch { return fallbackSettings; } }
export async function games() { try { const items = await prisma.game.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }); return items.length ? items : fallbackGames; } catch { return fallbackGames; } }
export async function promotions() { try { const items = await prisma.promotion.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }); return items.length ? items : fallbackPromotions; } catch { return fallbackPromotions; } }
export async function events() { try { const items = await prisma.event.findMany({ where: { active: true }, orderBy: { dateTime: "asc" } }); return items.length ? items : fallbackEvents; } catch { return fallbackEvents; } }
export async function gallery() { try { const items = await prisma.galleryItem.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }); return items.length ? items : fallbackGallery.map((image, index) => ({ id: `fallback-gallery-${index}`, image, altText: "86 Casino nightlife", category: "atmosphere", caption: null })); } catch { return fallbackGallery.map((image, index) => ({ id: `fallback-gallery-${index}`, image, altText: "86 Casino nightlife", category: "atmosphere", caption: null })); } }
export async function pageBySlug(slug: string) { try { return await prisma.page.findFirst({ where: { slug, published: true } }); } catch { return null; } }