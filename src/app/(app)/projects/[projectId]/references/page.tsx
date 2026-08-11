import { db } from "@/lib/db";
import { ReferencesView } from "@/components/tools/references-view";

export default async function ReferencesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const references = await db.referenceItem.findMany({ where: { projectId }, orderBy: { code: "asc" } });

  return (
    <ReferencesView
      references={references.map((r) => ({
        id: r.id,
        code: r.code,
        title: r.title,
        summary: r.summary,
        category: r.category,
      }))}
    />
  );
}
