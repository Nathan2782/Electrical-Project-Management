"use client";

import { useTransition } from "react";
import { Zap } from "lucide-react";
import { updateTaskStatusAction } from "@/app/(app)/projects/[projectId]/actions";
import { statusConfig, STATUS_CONFIG, type StatusId } from "@/lib/status";
import { formatShortDate } from "@/lib/format";

export type TaskRowData = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  assigneeName: string | null;
  assigneeInitials: string | null;
  assigneeColor: string | null;
  fromMessage: boolean;
};

export function TaskRow({ task, projectId }: { task: TaskRowData; projectId: string }) {
  const [pending, startTransition] = useTransition();
  const cfg = statusConfig(task.status);

  function handleChange(status: string) {
    startTransition(() => updateTaskStatusAction(task.id, projectId, status));
  }

  return (
    <div className="flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0">
      <cfg.icon size={16} className="mt-0.5 shrink-0" style={{ color: cfg.color }} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-[13.5px] font-medium text-[var(--color-text)]">{task.title}</p>
          {task.fromMessage && (
            <span
              title="Created from a conversation message"
              className="flex items-center gap-0.5 rounded-full bg-[var(--color-bg-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]"
            >
              <Zap size={9} /> from chat
            </span>
          )}
        </div>
        {task.description && (
          <p className="mt-0.5 text-[12.5px] text-[var(--color-text-secondary)]">{task.description}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11.5px] text-[var(--color-text-muted)]">
          {task.assigneeName && (
            <span className="flex items-center gap-1">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-semibold text-white"
                style={{ backgroundColor: task.assigneeColor ?? "#8593a6" }}
              >
                {task.assigneeInitials}
              </span>
              {task.assigneeName}
            </span>
          )}
          {task.dueDate && <span>Due {formatShortDate(new Date(task.dueDate))}</span>}
        </div>
      </div>
      <select
        value={task.status}
        disabled={pending}
        onChange={(e) => handleChange(e.target.value)}
        className="shrink-0 rounded-md border border-[var(--color-border)] bg-white px-2 py-1 text-[11.5px] font-medium text-[var(--color-text)] disabled:opacity-50"
        style={{ color: cfg.color }}
      >
        {(Object.keys(STATUS_CONFIG) as StatusId[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_CONFIG[s].label}
          </option>
        ))}
      </select>
    </div>
  );
}
