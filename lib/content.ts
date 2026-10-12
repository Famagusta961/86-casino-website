import { prisma } from "./db";
export const fallbackSettings = {
  casinoName: "86 CASINO",
  title: "86 Casino | Gaming & entertainment in Accra",
  description: "Discover 86 Casino in Accra, Ghana.",
  phone: "+233 24 500 0005",
  email: "info@86-casino.com",
  address: "Accra, Ghana",
  directions: "https://maps.google.com/?q=Accra,Ghana",
  hours: "Contact us for current opening hours",
  instagram: null,
  facebook: null,
  twitter: null,
  youtube: null,
  copyright: "© 2026 86 CASINO. All rights reserved.",
  ageNotice: "18+ only. Please gamble responsibly.",
};
const casinoAsset = (file: string) => `/assets/casino/${file}.webp`;
export const fallbackGames = [
  {
    id: "fallback-roulette",
    name: "Roulette",
    subtitle: "The timeless classic",
    description: "Feel the energy at the wheel.",
    image: casinoAsset("002"),
  },
  {
    id: "fallback-blackjack",
    name: "Blackjack",
    subtitle: "The game of 21",
    description: "Bring your best hand to the table.",
    image: casinoAsset("003"),
  },
  {
    id: "fallback-baccarat",
    name: "Baccarat",
    subtitle: "Quietly sophisticated",
    description: "A refined classic for considered players.",
    image: casinoAsset("004"),
  },
  {
    id: "fallback-poker",
    name: "Poker",
    subtitle: "Take your seat",
    description: "Explore the games at 86.",
    image: casinoAsset("004"),
  },
  {
    id: "fallback-slots",
    name: "Slots",
    subtitle: "Explore the floor",
    description: "Discover the machines at 86 Casino.",
    image: casinoAsset("005"),
  },
];
const fallbackGallery = Array.from({ length: 14 }, (_, i) => ({
  id: `fallback-gallery-${i}`,
  image: casinoAsset(String(i + 1).padStart(3, "0")),
  altText: "Inside 86 Casino",
  category: "atmosphere",
  caption: null,
}));
export async function siteSettings() {
  try {
    return (
      (await prisma.siteSetting.findUnique({ where: { id: "site" } })) ??
      fallbackSettings
    );
  } catch {
    return fallbackSettings;
  }
}
export async function games() {
  try {
    return await prisma.game.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return fallbackGames;
  }
}
export async function promotions() {
  try {
    const now = new Date();
    return await prisma.promotion.findMany({
      where: {
        active: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}
export async function events() {
  try {
    return await prisma.event.findMany({
      where: { active: true, dateTime: { gte: new Date() } },
      orderBy: { dateTime: "asc" },
    });
  } catch {
    return [];
  }
}
export async function gallery() {
  try {
    return await prisma.galleryItem.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return fallbackGallery;
  }
}
// Undefined means the database is unavailable; null means intentionally absent/unpublished.
export async function pageBySlug(slug: string) {
  try {
    return await prisma.page.findFirst({ where: { slug, published: true } });
  } catch {
    return undefined;
  }
}
