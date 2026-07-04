import { Download, FileText } from "lucide-react";
import { Card, EmptyState, IconTile, SectionHeader } from "@/components/ui/base";
import { fmtDate } from "@/lib/format";
import { repo } from "@/lib/repo";
import type { DocItem } from "@/lib/types";
import { DocKindBadge, getTenantContext } from "../../../_components/tenant-ui";

export const metadata = { title: "מסמכים" };

const order: DocItem["kind"][] = ["bylaws", "form", "unit", "general"];
const labels: Record<DocItem["kind"], string> = { bylaws: "תקנון", form: "טפסים", unit: "מסמכים אישיים", general: "כללי" };

export default async function Page() {
  const { session } = await getTenantContext();
  const docs = await repo.getDocsByBuilding(session.buildingId);

  return (
    <div className="space-y-5">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">מסמכים</h1>
        <p className="mt-1 text-sm text-muted">תקנון, טפסים, פוליסות ומסמכים אישיים.</p>
      </section>

      {docs.length ? order.map((kind) => {
        const rows = docs.filter((d) => d.kind === kind);
        if (!rows.length) return null;
        return (
          <section key={kind} className="fade-up">
            <SectionHeader title={labels[kind]} />
            <div className="space-y-2">
              {rows.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <IconTile tone="info"><FileText size={18} /></IconTile>
                    <div className="min-w-0 flex-1"><p className="font-black">{doc.name}</p><p className="text-xs text-muted">{fmtDate(doc.date)}</p></div>
                    <DocKindBadge kind={doc.kind} />
                    <Download className="text-faint" size={18} />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      }) : <Card className="fade-up"><EmptyState icon={<FileText size={24} />} title="אין מסמכים להצגה" sub="כשתועלה פוליסה, תקנון או טופס הם יופיעו כאן." /></Card>}
    </div>
  );
}
