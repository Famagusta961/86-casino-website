import Image from "next/image";
import { promotions } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function PromotionsPage() {
  const items = await promotions();
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
          <div className="eyebrow light">At 86</div>
          <h1>
            Make it
            <br />
            memorable.
          </h1>
          <p>
            Discover the latest ways to make an evening at 86 feel even more
            like yours.
          </p>
        </div>
      </section>
      <section className="section red-section honeycomb-dark">
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
          <div className="promo-grid">
            {items.map((item) => (
              <article className="promo-card" key={item.id}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={700}
                  height={440}
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
                <div className="promo-card-body">
                  <div className="eyebrow light">{item.subtitle}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.terms && <p style={{ fontSize: 11 }}>{item.terms}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
