import { db } from "@/lib/db";
import { SafetyView } from "@/components/tools/safety-view";

export default async function SafetyPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const items = await db.safetyItem.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } });

  return (
    <SafetyView
      projectId={projectId}
      items={items.map((i) => ({
        id: i.id,
        title: i.title,
        severity: i.severity,
        reportedBy: i.reportedBy,
        description: i.description,
        resolved: i.resolved,
        createdAt: i.createdAt.toISOString(),
      }))}
    />
  );
}
