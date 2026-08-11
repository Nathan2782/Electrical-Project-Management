import { db } from "@/lib/db";
import { MeasurementsView } from "@/components/tools/measurements-view";

export default async function MeasurementsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const measurements = await db.measurement.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } });

  return (
    <MeasurementsView
      projectId={projectId}
      measurements={measurements.map((m) => ({
        id: m.id,
        label: m.label,
        value: m.value,
        location: m.location,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
