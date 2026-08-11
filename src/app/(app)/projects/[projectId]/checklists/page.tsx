import { db } from "@/lib/db";
import { ChecklistsView } from "@/components/tools/checklists-view";

export default async function ChecklistsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const checklists = await db.checklist.findMany({
    where: { projectId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ChecklistsView
      projectId={projectId}
      checklists={checklists.map((c) => ({
        id: c.id,
        title: c.title,
        items: c.items.map((i) => ({ id: i.id, label: i.label, done: i.done })),
      }))}
    />
  );
}
