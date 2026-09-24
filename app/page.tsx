import Image from "next/image";
import Link from "next/link";
import { events, fallbackImages, gallery, games, promotions, siteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

export default async function Home() {
  const [settings, gameItems, promoItems, eventItems, galleryItems] = await Promise.all([siteSettings(), games(), promotions(), events(), gallery()]);
  return <main>
    <section className="hero hero-home">
      <Image className="hero-image" src={fallbackImages.hero} alt="Roulette table and casino chips in an upscale casino" fill priority sizes="100vw" />
      <div className="hero-wash" />
      <div className="container hero-content">
        <div className="eyebrow light">Accra · Ghana</div>
        <h1>Accra&apos;s Destination for<br /><em>Gaming &amp; Entertainment</em></h1>
        <div className="hero-subtitle">Luxury gaming. Unforgettable nights.</div>
        <p className="hero-copy">A considered destination for classic games, thoughtful hospitality and the electric atmosphere of a night well spent.</p>
        <div className="hero-actions"><Link className="button button-red" href="/visit">Visit 86 Casino <Arrow /></Link><Link className="button button-outline" href="/casino">Explore the casino <Arrow /></Link></div>
      </div>
      <div className="hero-strip"><div className="container hero-strip-inner"><span><i />Premium gaming</span><span><i />Exclusive events</span><span><i />VIP experience</span><span><i />Late nights</span></div></div>
    </section>

    <section className="section games-section honeycomb"><div className="container">
      <div className="section-heading editorial-heading"><div><div className="eyebrow">The 86 experience</div><h2>Our Casino Games</h2></div><p>Classic games, considered service and a room that rewards a little curiosity.</p></div>
      <div className="game-rail">{gameItems.slice(0, 5).map((game, index) => <Link className="game-tile" href="/casino" key={game.id}><Image src={game.image} alt={game.name} fill sizes="(max-width: 700px) 90vw, 20vw" /><span className="tile-shade" /><div className="game-tile-copy"><span className="tile-number">0{index + 1}</span><span className="game-name">{game.name}</span><span className="game-subtitle">{game.subtitle}</span></div></Link>)}</div>
    </div></section>

    <section className="promotions-section honeycomb-red"><div className="container">
      <div className="section-heading editorial-heading light-heading"><div><div className="eyebrow light">Make it a night</div><h2>Promotions</h2></div><Link className="text-link light-link" href="/promotions">View all promotions <Arrow /></Link></div>
      <div className="promotion-list">{promoItems.slice(0, 3).map((promo, index) => <article className={`promotion-row ${index % 2 ? "reverse" : ""}`} key={promo.id}><div className="promotion-image"><Image src={promo.image} alt={promo.title} fill sizes="(max-width: 760px) 100vw, 48vw" /></div><div className="promotion-copy"><span className="promo-index">0{index + 1}</span><div className="eyebrow light">{promo.subtitle}</div><h3>{promo.title}</h3><p>{promo.description}</p><Link className="text-link light-link" href="/promotions">Discover more <Arrow /></Link></div></article>)}</div>
    </div></section>

    <section className="vip-feature"><div className="vip-feature-image"><Image src={fallbackImages.lounge} alt="Private lounge at 86 Casino" fill sizes="(max-width: 800px) 100vw, 55vw" /></div><div className="vip-feature-copy honeycomb"><div className="eyebrow">A more personal experience</div><h2>VIP<br /><em>Experience</em></h2><p>Privilege is in the details. Enjoy personalized service, privacy and a host who knows how you like your evening to unfold.</p><Link className="button button-dark" href="/vip">Discover VIP <Arrow /></Link><span className="section-mark">86 / VIP</span></div></section>

    <section className="section events-section honeycomb"><div className="container"><div className="section-heading editorial-heading"><div><div className="eyebrow">The room comes alive</div><h2>Events &amp; Entertainment</h2></div><Link className="text-link" href="/events">See what&apos;s on <Arrow /></Link></div><div className="event-posters">{eventItems.slice(0, 3).map((event, index) => <Link className="event-poster" href="/events" key={event.id}><div className="poster-image"><Image src={event.image} alt={event.title} fill sizes="(max-width: 700px) 100vw, 33vw" /></div><div className="poster-date"><strong>{new Date(event.dateTime).toLocaleDateString("en-GH", { day: "2-digit" })}</strong><span>{new Date(event.dateTime).toLocaleDateString("en-GH", { month: "short" })}</span></div><div className="poster-copy"><span className="event-category">{event.subtitle}</span><h3>{event.title}</h3><p>{event.description}</p><span className="poster-arrow"><Arrow /></span></div><span className="poster-number">0{index + 1}</span></Link>)}</div></div></section>

    <section className="gallery-teaser light"><div className="container"><div className="section-heading editorial-heading"><div><div className="eyebrow">Inside 86</div><h2>The 86 feeling.</h2></div><Link className="button button-outline-dark" href="/gallery">View gallery <Arrow /></Link></div><div className="masonry-gallery">{galleryItems.slice(0, 5).map((item, index) => <Link className={`masonry-item masonry-${index + 1}`} href="/gallery" key={item.id}><Image src={item.image} alt={item.altText} fill sizes="(max-width: 700px) 50vw, 25vw" /></Link>)}</div></div></section>

    <section className="visit-section light"><div className="container visit-layout"><div className="visit-copy"><div className="eyebrow">Find your way here</div><h2>Visit Us</h2><p className="visit-lead">Your evening starts before you arrive. Find us in Accra and let our team take care of the rest.</p><div className="visit-details"><div><span>Location</span><strong>{settings.address}</strong></div><div><span>Open daily</span><strong>{settings.hours}</strong></div><div><span>Contact</span><strong>{settings.phone}<br />{settings.email}</strong></div></div><a className="button button-red" href={settings.directions}>Get directions <Arrow /></a></div><div className="visit-image-wrap"><Image src={fallbackImages.exterior} alt="86 Casino entrance" fill sizes="(max-width: 800px) 100vw, 50vw" /><div className="image-caption">Accra, Ghana <span>86°</span></div></div></div></section>
  </main>;
}
