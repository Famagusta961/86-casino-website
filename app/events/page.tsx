import Image from "next/image";
import { events } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function EventsPage() {
  const items = await events();
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
          <div className="eyebrow light">Events & entertainment</div>
          <h1>
            Stay for
            <br />
            the atmosphere.
          </h1>
          <p>
            Explore upcoming events at 86 Casino. Contact our team for the
            latest information.
          </p>
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
          <div className="event-grid">
            {items.map((item) => (
              <article className="event-card" key={item.id}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={700}
                  height={440}
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
                <div className="event-card-body">
                  <div className="event-date">
                    {new Date(item.dateTime).toLocaleDateString("en-GH", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "Africa/Accra",
                    })}
                  </div>
                  <h3>{item.title}</h3>
                  <div className="eyebrow">{item.subtitle}</div>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
