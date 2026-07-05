import { redirect } from "next/navigation";
import Link from "next/link";
import { Bell, Home, Users, Wallet, Wrench, LayoutGrid } from "lucide-react";
import { getSession } from "@/lib/session";
import { repo } from "@/lib/repo";
import { BottomNav, type NavItem } from "@/components/ui/BottomNav";
import { SideNav } from "@/components/ui/SideNav";
import { Avatar } from "@/components/ui/base";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const building = await repo.getBuilding(session.buildingId);
  const brand = building?.brandColor ?? "#4f46e5";

  const nav: NavItem[] = [
    { href: "/app", label: "בית", icon: <Home size={20} /> },
    { href: "/app/payments", label: "תשלומים", icon: <Wallet size={20} /> },
    { href: "/app/community", label: "קהילה", icon: <Users size={20} /> },
    { href: "/app/service", label: "קריאות", icon: <Wrench size={20} /> },
    { href: "/app/more", label: "עוד", icon: <LayoutGrid size={20} /> },
  ];

  const sideHeader = (
    <Link href="/app/more" className="tap flex items-center gap-3">
      <Avatar name={session.name} size={40} />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-extrabold">{building?.logoText}</p>
        <p className="truncate text-[11px] text-muted">
          {building?.address}, {building?.city}
        </p>
      </div>
    </Link>
  );

  return (
    <div style={{ ["--brand" as string]: brand }} className="min-h-full lg:ps-60">
      <SideNav items={nav} rootHref="/app" header={sideHeader} />

      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-lg border-b border-border lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <Link href="/app/more" className="tap">
            <Avatar name={session.name} size={38} />
          </Link>
          <div className="text-center leading-tight">
            <p className="text-[15px] font-extrabold">{building?.logoText}</p>
            <p className="text-[11px] text-muted">
              {building?.address}, {building?.city}
            </p>
          </div>
          <Link
            href="/app/community"
            className="tap grid h-9 w-9 place-items-center rounded-full bg-surface-2"
            aria-label="עדכונים"
          >
            <Bell size={18} />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-28 pt-4 lg:max-w-4xl lg:px-8 lg:pb-12 lg:pt-8">{children}</main>

      <div className="lg:hidden">
        <BottomNav items={nav} />
      </div>
    </div>
  );
}
