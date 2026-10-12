"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

const links = [
  ["Dashboard", "/admin/dashboard"],
  ["Site Settings", "/admin/settings"],
  ["Content Management", "/admin/content"],
  ["Messages", "/admin/messages"],
];

export function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav className="nav-links" aria-label="Admin navigation">
      {links.map(([name, href]) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
        >
          {name}
        </Link>
      ))}
      <form action={logout}>
        <button className="button admin-sign-out" type="submit">
          Sign out
        </button>
      </form>
    </nav>
  );
}
