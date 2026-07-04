import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutGrid, Megaphone, Settings, Wallet, Wrench } from "lucide-react";
import { getSession } from "@/lib/session";
import { repo } from "@/lib/repo";
import { BottomNav, type NavItem } from "@/components/ui/BottomNav";
import { Avatar, Badge } from "@/components/ui/base";
import { logoutAction } from "@/app/actions";

export default async function ManageLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "manager" && session.role !== "admin") redirect("/app");

  const [building, company, buildings] = await Promise.all([
    repo.getBuilding(session.buildingId),
    repo.getCompany(session.companyId),
    repo.getBuildingsByCompany(session.companyId),
  ]);

  const nav: NavItem[] = [
    { href: "/manage", label: "לוח", icon: <LayoutGrid size={20} /> },
    { href: "/manage/finance", label: "כספים", icon: <Wallet size={20} /> },
    { href: "/manage/service", label: "קריאות", icon: <Wrench size={20} /> },
    { href: "/manage/announcements", label: "קהילה", icon: <Megaphone size={20} /> },
    { href: "/manage/settings", label: "הגדרות", icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ ["--brand" as string]: building?.brandColor ?? "#4f46e5" }} className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <Link href="/manage/settings" className="tap"><Avatar name={session.name} size={38} /></Link>
          <div className="min-w-0 flex-1 text-center leading-tight">
            <div className="flex items-center justify-center gap-2"><p className="truncate text-[15px] font-extrabold">{company?.name ?? "ניהול"}</p><Badge tone="brand">ניהול</Badge></div>
            <p className="truncate text-[11px] text-muted">{building?.name} · {building?.address}, {building?.city}</p>
            {buildings.length > 1 && <p className="mt-0.5 text-[10px] text-faint">{buildings.length} בניינים בחברה</p>}
          </div>
          <form action={logoutAction}><button className="tap rounded-full bg-surface-2 px-3 py-2 text-xs font-bold text-muted" type="submit">יציאה</button></form>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-28 pt-4">{children}</main>
      <BottomNav items={nav} />
    </div>
  );
}
