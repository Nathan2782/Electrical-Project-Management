import { db } from "@/lib/db";
import { getActiveRole } from "@/lib/session";
import { MaterialsNotesView } from "@/components/materials/materials-notes-view";

export default async function MaterialsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [materials, notes, activeRole] = await Promise.all([
    db.materialItem.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } }),
    db.note.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } }),
    getActiveRole(),
  ]);

  return (
    <MaterialsNotesView
      projectId={projectId}
      activeRole={activeRole}
      materials={materials.map((m) => ({
        id: m.id,
        name: m.name,
        quantity: m.quantity,
        status: m.status,
        requestedBy: m.requestedBy,
        notes: m.notes,
        fromMessage: m.fromMessage,
      }))}
      notes={notes.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        official: n.official,
        authorName: n.authorName,
        createdAt: n.createdAt.toISOString(),
      }))}
    />
  );
}
