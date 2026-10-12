import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  width = 150,
  className = "",
}: {
  width?: number;
  className?: string;
}) {
  const height = Math.round((width * 59) / 95);
  return (
    <Link
      className={`brand-logo ${className}`}
      href="/"
      aria-label="86 Casino home"
    >
      <Image
        src="/brand/86-casino-logo-transparent.png"
        alt="86 Casino"
        width={width}
        height={height}
        sizes={`${width}px`}
        unoptimized
        priority
      />
    </Link>
  );
}
