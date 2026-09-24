import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const casinoAsset = (file: string) => `/assets/casino/${file}.webp`;
const photos = {
  hero: casinoAsset("001"), roulette: casinoAsset("002"), cards: casinoAsset("003"), chips: casinoAsset("004"), lounge: casinoAsset("006"), dj: casinoAsset("012"), champagne: casinoAsset("009"), exterior: casinoAsset("010")
};

async function main() {
  await prisma.siteSetting.upsert({ where: { id: "site" }, update: {}, create: {} });
  const games = [
    ["Roulette", "The timeless classic", "Feel the electricity at the wheel, with elegant tables and an attentive team.", photos.roulette],
    ["Blackjack", "The game of 21", "Bring your best hand to a table where every decision matters.", photos.cards],
    ["Baccarat", "Quietly sophisticated", "A refined classic for considered players and unforgettable evenings.", photos.chips],
    ["Poker", "Take your seat", "A social, high-energy table experience in the heart of Accra.", photos.cards],
    ["Slots", "A little more sparkle", "Discover a handpicked collection of favourite machines and new arrivals.", photos.roulette]
  ];
  for (let i = 0; i < games.length; i++) {
    const [name, subtitle, description, image] = games[i];
    await prisma.game.upsert({ where: { id: `seed-game-${i}` }, update: { image }, create: { id: `seed-game-${i}`, name, subtitle, description, image, sortOrder: i } });
  }
  const promotions = [
    ["The 86 Welcome", "Your first night, elevated", "Join us for a considered welcome with a host of small luxuries to start your 86 experience.", photos.champagne],
    ["Friday After Dark", "The weekend starts here", "Settle in for an electric Friday with live atmosphere, signature cocktails and table-side energy.", photos.dj],
    ["Golden Hour", "Make evenings memorable", "From 6pm, discover a little more at the tables and in the lounge. Ask our hosts for details.", photos.lounge]
  ];
  for (let i = 0; i < promotions.length; i++) { const [title, subtitle, description, image] = promotions[i]; await prisma.promotion.upsert({ where: { id: `seed-promo-${i}` }, update: { image }, create: { id: `seed-promo-${i}`, title, subtitle, description, image, featured: true, sortOrder: i } }); }
  const events = [
    ["Live at 86", "Music · every Friday", "A changing lineup of Accra's finest live performers sets the tone for the weekend.", photos.dj],
    ["Saturday Social", "Every Saturday night", "Good company, a lively room and a reason to stay out a little later.", photos.champagne],
    ["The 86 Lounge", "An evening ritual", "Unwind in our lounge with a considered drinks list and service to match.", photos.lounge]
  ];
  for (let i = 0; i < events.length; i++) { const [title, subtitle, description, image] = events[i]; await prisma.event.upsert({ where: { id: `seed-event-${i}` }, update: { image }, create: { id: `seed-event-${i}`, title, subtitle, description, image, dateTime: new Date(Date.now() + (i + 1) * 86400000), sortOrder: i } }); }
  const pages = [
    ["about", "More than a casino", "A considered destination for gaming, hospitality and entertainment in Accra.", "86 CASINO is a place with its own rhythm. From the first welcome to the last hand, every detail is designed for a memorable night. Our team brings warmth, discretion and a genuine love of hospitality to every visit."],
    ["vip", "The 86 way of doing more", "A closer, more personal experience.", "The VIP experience is about being known, not just noticed. Talk to our team about dedicated hosting, priority access and the details that make your evening feel entirely your own."],
    ["visit", "Plan your visit", "Your evening starts before you arrive.", "Find us in Accra and let our team take care of the rest. We welcome guests daily from midday until late. Dress smart, bring your curiosity and make an evening of it."],
    ["faq", "Frequently asked questions", "A few useful details before your first visit.", "Our team is happy to help with questions about visiting, dress code, games and events. Contact us directly for the latest information."],
    ["responsible-gaming", "Play with perspective", "A considered approach to entertainment.", "This page contains placeholder wording for final legal and compliance review. 86 CASINO is committed to providing clear information and encouraging guests to make choices that remain enjoyable and within their personal limits."],
    ["privacy", "Privacy policy", "Please review this placeholder policy with your legal adviser.", "This is editable placeholder content for the 86 CASINO privacy policy. Final legal wording should be approved before launch."],
    ["terms", "Terms & conditions", "Please review these placeholder terms with your legal adviser.", "This is editable placeholder content for the 86 CASINO terms and conditions. Final legal wording should be approved before launch."]
  ];
  for (const [slug, title, intro, body] of pages) await prisma.page.upsert({ where: { slug }, update: {}, create: { slug, title, intro, body } });
  const gallery = Array.from({ length: 14 }, (_, index) => casinoAsset(String(index + 1).padStart(3, "0")));
  for (let i = 0; i < gallery.length; i++) await prisma.galleryItem.upsert({ where: { id: `seed-gallery-${i}` }, update: { image: gallery[i] }, create: { id: `seed-gallery-${i}`, image: gallery[i], altText: "86 CASINO experience", category: i % 2 ? "gaming" : "atmosphere", sortOrder: i } });
}

main().finally(() => prisma.$disconnect());