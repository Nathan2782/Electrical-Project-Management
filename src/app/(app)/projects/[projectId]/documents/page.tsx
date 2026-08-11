import { db } from "@/lib/db";
import { getActiveRole } from "@/lib/session";
import { DocumentsList } from "@/components/documents/documents-list";

export default async function DocumentsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [documents, activeRole] = await Promise.all([
    db.document.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } }),
    getActiveRole(),
  ]);

  return (
    <DocumentsList
      projectId={projectId}
      activeRole={activeRole}
      documents={documents.map((d) => ({
        id: d.id,
        name: d.name,
        fileType: d.fileType,
        size: d.size,
        official: d.official,
        uploadedBy: d.uploadedBy,
        createdAt: d.createdAt.toISOString(),
      }))}
    />
  );
}
