import Link from "next/link";
import { siteSettings } from "@/lib/content";
import { BrandLogo } from "./brand-logo";
import { PitCoreRecognition } from "./pitcore-recognition";
export async function SiteFooter() {
  const s = await siteSettings();
  const social = [
    ["Instagram", s.instagram],
    ["Facebook", s.facebook],
    ["X", s.twitter],
    ["YouTube", s.youtube],
  ].filter(([, url]) => url && /^https:\/\//.test(url));
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-intro">
          <div>
            <BrandLogo width={130} className="footer-logo" />
            <p>Gaming, hospitality and the spirit of Accra.</p>
          </div>
          <Link className="button button-outline" href="/contact">
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="footer-grid">
          <div>
            <div className="footer-title">Explore</div>
            <div className="footer-links">
              <Link href="/casino">Casino</Link>
              <Link href="/promotions">Promotions</Link>
              <Link href="/vip">VIP experience</Link>
              <Link href="/events">Events</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Discover</div>
            <div className="footer-links">
              <Link href="/about">About 86</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/visit">Plan your visit</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Contact</div>
            <div className="footer-links">
              <span>{s.address}</span>
              <a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a>
              <a href={`mailto:${s.email}`}>{s.email}</a>
            </div>
          </div>
          <div>
            {social.length > 0 && (
              <>
                <div className="footer-title">Follow</div>
                <div className="social-links">
                  {social.map(([label, url]) => (
                    <a key={label} href={url!}>
                      {label}
                    </a>
                  ))}
                </div>
              </>
            )}
            <div className="footer-title">Useful information</div>
            <div className="footer-links">
              <Link href="/responsible-gaming">Responsible gaming</Link>
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/terms">Terms &amp; conditions</Link>
            </div>
          </div>
        </div>
        <PitCoreRecognition placement="footer" />
        <div className="footer-bottom">
          <span>{s.copyright}</span>
          <span className="age">{s.ageNotice}</span>
        </div>
      </div>
    </footer>
  );
}
