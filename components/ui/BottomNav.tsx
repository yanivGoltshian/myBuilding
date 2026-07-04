"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1">
        {items.map((it) => {
          const active =
            pathname === it.href ||
            (it.href !== "/app" && pathname.startsWith(it.href));
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                className="tap flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
                style={{ color: active ? "var(--brand)" : "var(--faint)" }}
              >
                <span
                  className="grid h-8 w-12 place-items-center rounded-xl transition-colors"
                  style={{
                    background: active
                      ? "color-mix(in srgb, var(--brand) 13%, transparent)"
                      : "transparent",
                  }}
                >
                  {it.icon}
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
