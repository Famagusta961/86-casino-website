import Image from "next/image";
import Link from "next/link";
import {
  events,
  gallery,
  games,
  promotions,
  siteSettings,
} from "@/lib/content";
export const dynamic = "force-dynamic";
const Arrow = () => <span aria-hidden="true">↗</span>;
export default async function Home() {
  const [settings, gameItems, promoItems, eventItems, photos] =
    await Promise.all([
      siteSettings(),
      games(),
      promotions(),
      events(),
      gallery(),
    ]);
  return (
    <main id="main-content">
      <section className="home-hero">
        <div className="container hero-layout">
          <div className="hero-editorial">
            <div className="eyebrow light">
              <span className="red-line" />
              86 Casino · Accra, Ghana
            </div>
            <h1>
              An evening
              <br />
              with <em>possibility.</em>
            </h1>
            <p>
              Classic gaming. A warm welcome.
              <br />
              Discover the atmosphere of 86 Casino.
            </p>
            <div className="hero-actions">
              <Link className="button button-red" href="/visit">
                Plan your visit <Arrow />
              </Link>
              <Link className="text-link text-link-light" href="/casino">
                Explore the casino <Arrow />
              </Link>
            </div>
            <div className="hero-note">
              18+ only <span /> Play responsibly
            </div>
          </div>
          <figure className="hero-photograph">
            <Image
              src="/assets/casino/001.webp"
              alt="Tables and slot machines on the 86 Casino gaming floor"
              fill
              priority
              quality={90}
              sizes="(max-width: 760px) 100vw, 55vw"
            />
            <figcaption>
              <span>Inside 86</span>
              <span>Accra, Ghana ↗</span>
            </figcaption>
          </figure>
        </div>
        <div className="container hero-bottom">
          <span>Gaming &amp; entertainment</span>
          <a href="#discover">
            Discover 86 <span aria-hidden="true">↓</span>
          </a>
          <span>Welcome to your evening.</span>
        </div>
      </section>
      <section className="section intro-section" id="discover">
        <div className="container intro-grid">
          <div className="eyebrow">01 / Welcome to 86</div>
          <div>
            <h2>
              A different rhythm.
              <br />
              The same <em>86 spirit.</em>
            </h2>
            <div className="intro-copy">
              <p>
                A destination for gaming and hospitality in Accra. Explore the
                floor, find your favourite game and make an evening of it.
              </p>
              <Link className="text-link" href="/about">
                Get to know us <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section games-section">
        <div className="container">
          <div className="section-intro">
            <div>
              <div className="eyebrow">02 / The casino</div>
              <h2>Find your game.</h2>
            </div>
            <Link className="text-link" href="/casino">
              Explore all games <Arrow />
            </Link>
          </div>
          <div className="home-games">
            {gameItems.slice(0, 3).map((game, index) => (
              <Link href="/casino" className="home-game" key={game.id}>
                <div className="home-game-photo">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                  />
                </div>
                <div className="home-game-title">
                  <span className="item-number">0{index + 1}</span>
                  <div>
                    <h3>{game.name}</h3>
                    <p>{game.subtitle}</p>
                  </div>
                  <Arrow />
                </div>
              </Link>
            ))}
          </div>
          {!gameItems.length && (
            <p>Contact our team for the latest gaming information.</p>
          )}
        </div>
      </section>
      <section className="vip-feature">
        <div className="vip-photo">
          <Image
            src="/assets/casino/008.webp"
            alt="A quieter gaming room at 86 Casino"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </div>
        <div className="vip-detail">
          <div className="eyebrow light">The 86 experience</div>
          <h2>
            Make the evening
            <br />
            <em>your own.</em>
          </h2>
          <p>
            A closer look at 86. Speak with our team about the VIP experience
            and planning your visit.
          </p>
          <Link className="button button-outline" href="/vip">
            Discover VIP <Arrow />
          </Link>
        </div>
      </section>
      {(promoItems.length > 0 || eventItems.length > 0) && (
        <section className="section">
          <div className="container">
            <div className="section-intro">
              <div>
                <div className="eyebrow">03 / At 86</div>
                <h2>On the calendar.</h2>
              </div>
              <Link href="/events" className="text-link">
                All events <Arrow />
              </Link>
            </div>
            <div className="news-grid">
              {promoItems.slice(0, 2).map((item) => (
                <Link href="/promotions" className="news-item" key={item.id}>
                  <span className="eyebrow">Promotions</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="text-link">
                    View details <Arrow />
                  </span>
                </Link>
              ))}
              {eventItems.slice(0, 2).map((item) => (
                <Link href="/events" className="news-item" key={item.id}>
                  <span className="eyebrow">
                    {new Date(item.dateTime).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "Africa/Accra",
                    })}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="text-link">
                    View event <Arrow />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section gallery-section">
        <div className="container">
          <div className="section-intro">
            <div>
              <div className="eyebrow">A glimpse inside</div>
              <h2>The place. The atmosphere.</h2>
            </div>
            <Link className="text-link" href="/gallery">
              View the gallery <Arrow />
            </Link>
          </div>
          <div className="home-gallery">
            {photos.slice(0, 3).map((item) => (
              <Link href="/gallery" key={item.id}>
                <Image
                  src={item.image}
                  alt={item.altText}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="visit-banner">
        <div className="container">
          <div>
            <div className="eyebrow light">Your evening starts here</div>
            <h2>See you at 86.</h2>
          </div>
          <div>
            <p>{settings.address}</p>
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>
              {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </div>
          <Link className="button button-red" href="/visit">
            Plan your visit <Arrow />
          </Link>
        </div>
      </section>
    </main>
  );
}
