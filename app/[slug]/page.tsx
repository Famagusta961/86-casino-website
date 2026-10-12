import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { pageBySlug, siteSettings } from "@/lib/content";
export const dynamic = "force-dynamic";
const pageImages: Record<string, string> = {
  about: "/assets/casino/007.webp",
  vip: "/assets/casino/008.webp",
  visit: "/assets/casino/001.webp",
};
const fallbackPages: Record<
  string,
  { title: string; intro: string; body: string }
> = {
  about: {
    title: "The spirit of 86.",
    intro: "A destination for gaming and hospitality in Accra.",
    body: "Get to know 86 Casino. Our team can help you plan your visit and answer your questions.",
  },
  vip: {
    title: "Your evening, elevated.",
    intro: "Discover the VIP experience at 86.",
    body: "Contact our team to discuss the VIP experience and your visit.",
  },
  visit: {
    title: "Your evening starts here.",
    intro: "Plan your visit to 86 Casino in Accra.",
    body: "Contact our team for current opening hours, directions and information before you arrive.",
  },
  faq: {
    title: "Before you visit.",
    intro: "A few useful details.",
    body: "For questions about visiting, games, events and dress code, please contact our team.",
  },
  privacy: {
    title: "Privacy policy",
    intro: "Policy information",
    body: "Please contact info@86-casino.com for current privacy information.",
  },
  terms: {
    title: "Terms & conditions",
    intro: "Visitor information",
    body: "Please contact info@86-casino.com for current terms and conditions.",
  },
  "responsible-gaming": {
    title: "Responsible gaming",
    intro: "18+ only. Please gamble responsibly.",
    body: "Contact our team for information about responsible gaming at 86 Casino.",
  },
};
export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stored = await pageBySlug(slug);
  const page = stored === undefined ? fallbackPages[slug] : stored;
  if (!page) notFound();
  const image =
    ("heroImage" in page ? page.heroImage : null) || pageImages[slug];
  const settings = await siteSettings();
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow light">
            {"eyebrow" in page && page.eyebrow
              ? page.eyebrow
              : "86 Casino · Accra"}
          </div>
          <h1>{page.title}</h1>
          {page.intro && <p>{page.intro}</p>}
          {image && (
            <Image
              className="page-hero-image"
              src={image}
              alt="Inside 86 Casino"
              width={680}
              height={453}
              sizes="(max-width:760px) 100vw, 50vw"
              priority
            />
          )}
        </div>
      </section>
      <section className="section">
        <div className="container rich-copy">
          <div className="eyebrow">The details</div>
          {page.body?.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {slug === "visit" && (
            <div className="detail-list">
              <div className="detail">
                <strong>Location</strong>
                <span>{settings.address}</span>
              </div>
              <div className="detail">
                <strong>Hours</strong>
                <span>{settings.hours}</span>
              </div>
              <div className="detail">
                <strong>Call</strong>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>
                  {settings.phone}
                </a>
              </div>
              <div className="detail">
                <strong>Email</strong>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </div>
              <a className="button button-dark" href={settings.directions}>
                Get directions ↗
              </a>
            </div>
          )}
          {["vip", "about", "faq", "visit"].includes(slug) && (
            <Link className="text-link" href="/contact">
              Speak with our team ↗
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
