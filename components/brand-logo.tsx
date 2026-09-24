"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function BrandLogo() {
  const [hasImage, setHasImage] = useState(true);
  return <Link className={`brand-logo ${hasImage ? "has-image" : ""}`} href="/" aria-label="86 Casino home">
    {hasImage ? <Image src="/brand/86-casino-logo.png" alt="86 Casino" width={150} height={48} onError={() => setHasImage(false)} priority /> : <span className="logo-fallback">86 <strong>CASINO</strong></span>}
  </Link>;
}