"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

const items: [string, string][] = [
  ["Explore", "/"],
  ["Projects", "/projects"],
  ["Technologies", "/technologies"],
  ["Developers", "/developers"],
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-10 border-b border-border-soft bg-bg/85 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-sm font-semibold tracking-tight text-ink">CodeDNA</span>
        </Link>
        <div className="flex items-center gap-5">
          {items.map(([label, href]) => {
            const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm hidden sm:block hover:opacity-100 transition-opacity ${
                  active ? "text-ink" : "text-muted-dim"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link href="/" aria-label="Search" className="text-muted-dim hover:text-ink transition-colors">
            <Search size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
