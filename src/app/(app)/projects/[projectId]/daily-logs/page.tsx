import { db } from "@/lib/db";
import { DailyLogsView } from "@/components/tools/daily-logs-view";

export default async function DailyLogsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const logs = await db.dailyLog.findMany({ where: { projectId }, orderBy: { date: "desc" } });

  return (
    <DailyLogsView
      projectId={projectId}
      logs={logs.map((l) => ({
        id: l.id,
        date: l.date.toISOString(),
        weather: l.weather,
        crewCount: l.crewCount,
        summary: l.summary,
        author: l.author,
      }))}
    />
  );
}
