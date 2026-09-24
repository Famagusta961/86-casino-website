"use client";
import Link from "next/link";
import { useState } from "react";

const links = [["Casino", "/casino"], ["Promotions", "/promotions"], ["VIP", "/vip"], ["Events", "/events"], ["Gallery", "/gallery"], ["About", "/about"], ["Visit us", "/visit"], ["Contact", "/contact"]];
export function SiteHeader() { const [open, setOpen] = useState(false); return <header className="site-header"><div className="container nav"><Link className="logo" href="/">86 <span>CASINO</span></Link><button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? "×" : "☰"}</button><nav className={`nav-links ${open ? "open" : ""}`}>{links.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} href={href}>{label}</Link>)}<Link className="button button-red" href="/visit">Book a visit</Link></nav></div></header>; }