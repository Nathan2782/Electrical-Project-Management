"use client";

import { Users, CloudSun } from "lucide-react";
import { AddButton } from "@/components/ui/add-button";
import { DailyLogForm } from "@/components/forms/daily-log-form";
import { formatFullDate } from "@/lib/format";

type DailyLogData = {
  id: string;
  date: string;
  weather: string | null;
  crewCount: number;
  summary: string;
  author: string;
};

export function DailyLogsView({ projectId, logs }: { projectId: string; logs: DailyLogData[] }) {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-semibold text-[var(--color-text)]">Daily Logs</h1>
          <p className="text-[12.5px] text-[var(--color-text-secondary)]">Field reports from each day on site</p>
        </div>
        <AddButton
          label="Add Log"
          modalTitle="Add Daily Log"
          render={(onDone) => <DailyLogForm projectId={projectId} onDone={onDone} />}
        />
      </div>

      {logs.length === 0 ? (
        <p className="text-center text-[13px] text-[var(--color-text-muted)]">No daily logs yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[13.5px] font-semibold text-[var(--color-text)]">
                  {formatFullDate(new Date(log.date))}
                </h3>
                <div className="flex items-center gap-3 text-[11.5px] text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {log.crewCount} crew
                  </span>
                  {log.weather && (
                    <span className="flex items-center gap-1">
                      <CloudSun size={12} /> {log.weather}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[13px] text-[var(--color-text)]">{log.summary}</p>
              <p className="mt-2 text-[11.5px] text-[var(--color-text-muted)]">Logged by {log.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
