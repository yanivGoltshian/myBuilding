"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { NavItem } from "./BottomNav";

export function SideNav({
  items,
  rootHref,
  header,
  footer,
}: {
  items: NavItem[];
  rootHref: string;
  header: ReactNode;
  footer?: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <aside className="side-nav hidden lg:flex">
      <div className="mb-3 border-b border-border pb-4">{header}</div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const active =
            pathname === it.href ||
            (it.href !== rootHref && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              data-active={active}
              className="side-nav-item tap"
            >
              <span className="grid h-5 w-5 place-items-center">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      {footer && <div className="mt-auto pt-4">{footer}</div>}
    </aside>
  );
}
