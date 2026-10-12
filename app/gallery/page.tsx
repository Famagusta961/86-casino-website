import Image from "next/image";
import { gallery } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function GalleryPage() {
  const items = await gallery();
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
          <div className="eyebrow light">A closer look</div>
          <h1>
            The 86
            <br />
            feeling.
          </h1>
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
          <div className="gallery-grid">
            {items.map((item) => (
              <figure key={item.id}>
                <Image
                  src={item.image}
                  alt={item.altText}
                  width={900}
                  height={700}
                  sizes="(max-width: 760px) 50vw, 33vw"
                />
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
