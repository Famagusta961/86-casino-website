import Image from "next/image";
import { games } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function CasinoPage() {
  const items = await games();
  return (
    <main id="main-content">
      <section className="page-hero honeycomb-dark">
        <div className="container">
          {items.length === 0 && (
            <div className="empty-state">
              <p>
                There are no current listings to show. Contact our team for the
                latest information.
              </p>
              <a className="text-link" href="/contact">
                Get in touch ↗
              </a>
            </div>
          )}
          <div className="eyebrow light">The 86 casino</div>
          <h1>
            Classic games.
            <br />
            New energy.
          </h1>
          <p>Take your seat, find your rhythm and let the room do the rest.</p>
        </div>
      </section>
      <section className="section light honeycomb">
        <div className="container">
          {items.length === 0 && (
            <div className="empty-state">
              <p>
                There are no current listings to show. Contact our team for the
                latest information.
              </p>
              <a className="text-link" href="/contact">
                Get in touch ↗
              </a>
            </div>
          )}
          <div className="cards">
            {items.map((game) => (
              <article className="game-card" key={game.id}>
                <Image
                  src={game.image}
                  alt={game.name}
                  width={700}
                  height={440}
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
                <div className="game-card-body">
                  <div className="eyebrow">{game.subtitle}</div>
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
