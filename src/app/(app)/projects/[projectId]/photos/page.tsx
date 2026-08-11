import { db } from "@/lib/db";
import { PhotosGrid } from "@/components/photos/photos-grid";

export default async function PhotosPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const photos = await db.photo.findMany({
    where: { projectId },
    include: { uploader: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PhotosGrid
      projectId={projectId}
      photos={photos.map((p) => ({
        id: p.id,
        caption: p.caption,
        color: p.color,
        uploaderName: p.uploader?.name ?? "Unknown",
        createdAt: p.createdAt.toISOString(),
      }))}
    />
  );
}
