import { db } from "@/lib/db";
import { getActiveRole } from "@/lib/session";
import { PrintsGrid } from "@/components/prints/prints-grid";

export default async function PrintsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [prints, activeRole] = await Promise.all([
    db.print.findMany({ where: { projectId }, orderBy: { sheetNo: "asc" } }),
    getActiveRole(),
  ]);

  return (
    <PrintsGrid
      projectId={projectId}
      activeRole={activeRole}
      prints={prints.map((p) => ({
        id: p.id,
        name: p.name,
        sheetNo: p.sheetNo,
        revision: p.revision,
        discipline: p.discipline,
        uploadedBy: p.uploadedBy,
        createdAt: p.createdAt.toISOString(),
      }))}
    />
  );
}
