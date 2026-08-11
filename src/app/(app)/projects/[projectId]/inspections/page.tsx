import { db } from "@/lib/db";
import { InspectionsView } from "@/components/tools/inspections-view";

export default async function InspectionsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const inspections = await db.inspection.findMany({
    where: { projectId },
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <InspectionsView
      projectId={projectId}
      inspections={inspections.map((i) => ({
        id: i.id,
        title: i.title,
        inspector: i.inspector,
        scheduledAt: i.scheduledAt ? i.scheduledAt.toISOString() : null,
        status: i.status,
        notes: i.notes,
      }))}
    />
  );
}
