import Image from "next/image";
import Link from "next/link";
import { events, fallbackImages, gallery, games, promotions, siteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

export default async function Home() {
  const [settings, gameItems, promoItems, eventItems, galleryItems] = await Promise.all([siteSettings(), games(), promotions(), events(), gallery()]);
  const experienceImage = galleryItems[7]?.image ?? fallbackImages.hero;
  const gallerySelection = galleryItems.slice(0, 6);
  return <main>
    <section className="hero hero-home">
      <Image className="hero-image" src={fallbackImages.hero} alt="The 86 Casino gaming floor" fill priority sizes="100vw" />
      <div className="hero-wash" />
      <div className="container hero-content">
        <div className="eyebrow light">86 Casino · Accra</div>
        <h1>Accra&apos;s Destination for<br /><em>Gaming &amp; Entertainment</em></h1>
        <div className="hero-subtitle">Luxury gaming. Exceptional nights.</div>
        <p className="hero-copy">A considered destination for classic games, thoughtful hospitality and the energy of an evening in the city.</p>
        <div className="hero-actions"><Link className="button button-red" href="/visit">Visit 86 Casino <Arrow /></Link><Link className="button button-outline" href="/casino">Explore the casino <Arrow /></Link></div>
      </div>
      <div className="hero-strip"><div className="container hero-strip-inner"><span>Premium gaming</span><span>VIP experience</span><span>Live entertainment</span><span>Open late</span></div></div>
    </section>

    <section className="experience-section section ivory"><div className="container experience-grid"><div className="experience-heading"><div className="eyebrow">The 86 experience</div><h2>More than<br />a casino.</h2></div><div className="experience-copy"><p>86 is where Accra comes to play, gather and stay a little longer. It is a room built around the pleasure of the evening: classic gaming, attentive hospitality and an atmosphere that changes with the hour.</p><Link className="text-link" href="/about">Discover our story <Arrow /></Link></div><div className="experience-image"><Image src={experienceImage} alt="Inside the 86 Casino experience" fill sizes="(max-width: 700px) 100vw, 64vw" /></div></div></section>

  <section className="games-section section ivory honeycomb-soft"><div className="container"><div className="section-intro"><div><div className="eyebrow">The tables are ready</div><h2>Choose your<br />way to play.</h2></div><p>Five classics, each with its own energy. Find your seat and let the room take over.</p></div><div className="games-editorial"><Link className="game-feature" href="/casino"><Image src={gameItems[0].image} alt={gameItems[0].name} fill sizes="(max-width: 800px) 100vw, 50vw" /><span className="image-veil" /><div className="game-overlay"><span className="eyebrow light">01 · The classic</span><h3>{gameItems[0].name}</h3><p>Classic. Elegant. Electric.</p><span className="circle-arrow"><Arrow /></span></div></Link><div className="game-side">{gameItems.slice(1, 3).map((game, index) => <Link className="game-small" href="/casino" key={game.id}><Image src={game.image} alt={game.name} fill sizes="(max-width: 800px) 100vw, 25vw" /><span className="image-veil" /><div className="game-overlay"><span className="eyebrow light">0{index + 2}</span><h3>{game.name}</h3><p>{index === 0 ? "Skill meets thrill." : "Quiet sophistication."}</p></div></Link>)}</div><div className="game-bottom">{gameItems.slice(3, 5).map((game, index) => <Link className="game-wide" href="/casino" key={game.id}><Image src={game.image} alt={game.name} fill sizes="(max-width: 800px) 50vw, 25vw" /><span className="image-veil" /><div className="game-overlay"><span className="eyebrow light">0{index + 4}</span><h3>{game.name}</h3><p>{index === 0 ? "Play with confidence." : "A little more sparkle."}</p></div></Link>)}</div></div></div></section>

  <section className="promotions-section section charcoal honeycomb-dark"><div className="container"><div className="section-intro section-intro-dark"><div><div className="eyebrow">Make the evening yours</div><h2>Promotions</h2></div><Link className="text-link text-link-light" href="/promotions">View all promotions <Arrow /></Link></div><div className="promotion-list">{promoItems.slice(0, 3).map((promo, index) => <article className={`promotion-module ${index % 2 ? "module-reverse" : ""}`} key={promo.id}><div className="promotion-photo"><Image src={promo.image} alt={promo.title} fill sizes="(max-width: 760px) 100vw, 50vw" /></div><div className="promotion-detail"><span className="promo-number">0{index + 1}</span><div className="eyebrow">{promo.subtitle}</div><h3>{promo.title}</h3><p>{promo.description}</p><Link className="text-link text-link-light" href="/promotions">Discover more <Arrow /></Link></div></article>)}</div></div></section>

  <section className="vip-feature"><div className="vip-photo"><Image src={fallbackImages.lounge} alt="The 86 Casino VIP experience" fill sizes="(max-width: 800px) 100vw, 55vw" /></div><div className="vip-detail ivory"><div className="vertical-rule" /><div className="eyebrow">Private · Personal · Elevated</div><h2>VIP<br /><em>Experience</em></h2><p>Privacy, personalized service and the freedom to make the night entirely your own. Talk to our team about the 86 way of doing more.</p><Link className="button button-dark" href="/vip">Discover VIP <Arrow /></Link></div></section>

  <section className="events-section section ivory"><div className="container"><div className="section-intro"><div><div className="eyebrow">The room comes alive</div><h2>Events &amp;<br />entertainment.</h2></div><Link className="text-link" href="/events">See what&apos;s on <Arrow /></Link></div><div className="event-list">{eventItems.slice(0, 3).map((event, index) => <Link className="event-row" href="/events" key={event.id}><div className="event-row-image"><Image src={event.image} alt={event.title} fill sizes="(max-width: 700px) 100vw, 30vw" /></div><div className="event-row-date"><strong>{new Date(event.dateTime).toLocaleDateString("en-GH", { day: "2-digit" })}</strong><span>{new Date(event.dateTime).toLocaleDateString("en-GH", { month: "short" })}</span></div><div className="event-row-detail"><span className="eyebrow">{event.subtitle}</span><h3>{event.title}</h3><p>{event.description}</p></div><span className="event-row-index">0{index + 1}<Arrow /></span></Link>)}</div></div></section>

  <section className="gallery-section section ivory"><div className="container"><div className="section-intro"><div><div className="eyebrow">Inside 86</div><h2>The night,<br />in focus.</h2></div><Link className="button button-outline-dark" href="/gallery">View full gallery <Arrow /></Link></div><div className="gallery-grid-editorial">{gallerySelection.map((item, index) => <Link className={`gallery-shot gallery-shot-${index + 1}`} href="/gallery" key={item.id}><Image src={item.image} alt={item.altText} fill sizes="(max-width: 700px) 50vw, 30vw" /></Link>)}</div></div></section>

  <section className="visit-section section ivory"><div className="container visit-layout"><div className="visit-copy"><div className="eyebrow">Find your way here</div><h2>Visit 86<br />Casino.</h2><p>Come for the games. Stay for the atmosphere.</p><div className="visit-details"><div><span>Address</span><strong>{settings.address}</strong></div><div><span>Opening hours</span><strong>{settings.hours}</strong></div><div><span>Contact</span><strong>{settings.phone}<br />{settings.email}</strong></div></div><a className="button button-red" href={settings.directions}>Get directions <Arrow /></a></div><div className="visit-image-wrap"><Image src={fallbackImages.exterior} alt="86 Casino entrance in Accra" fill sizes="(max-width: 800px) 100vw, 54vw" /></div></div></section>
  </main>;
}
