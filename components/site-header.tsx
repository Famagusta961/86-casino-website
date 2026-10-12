"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "./brand-logo";
const links = [
  ["Home", "/"],
  ["Casino", "/casino"],
  ["Promotions", "/promotions"],
  ["VIP", "/vip"],
  ["Events", "/events"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Contact", "/contact"],
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="container nav">
        <BrandLogo width={120} />
        <button
          ref={toggle}
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "Close ×" : "Menu ☰"}
        </button>
        <nav
          aria-label="Main navigation"
          id="primary-navigation"
          className={`nav-links ${open ? "open" : ""}`}
        >
          {links.map(([label, href]) => (
            <Link
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
          <Link
            onClick={() => setOpen(false)}
            aria-current={pathname === "/visit" ? "page" : undefined}
            className="button button-red"
            href="/visit"
          >
            Plan your visit <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
