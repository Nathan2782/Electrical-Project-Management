"use client";

import { useTransition } from "react";
import { updateIssueStatusAction } from "@/app/(app)/projects/[projectId]/actions";
import { statusConfig, STATUS_CONFIG, type StatusId } from "@/lib/status";

export type IssueRowData = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  severity: string;
  reportedBy: string;
  fromMessage: boolean;
};

export function IssueRow({ issue, projectId }: { issue: IssueRowData; projectId: string }) {
  const [pending, startTransition] = useTransition();
  const cfg = statusConfig(issue.severity);

  function handleChange(status: string) {
    startTransition(() => updateIssueStatusAction(issue.id, projectId, status));
  }

  return (
    <div className="flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0">
      <cfg.icon size={16} className="mt-0.5 shrink-0" style={{ color: cfg.color }} />
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium text-[var(--color-text)]">{issue.title}</p>
        {issue.description && (
          <p className="mt-0.5 text-[12.5px] text-[var(--color-text-secondary)]">{issue.description}</p>
        )}
        <p className="mt-1 text-[11.5px] text-[var(--color-text-muted)]">Reported by {issue.reportedBy}</p>
      </div>
      <select
        value={issue.status}
        disabled={pending}
        onChange={(e) => handleChange(e.target.value)}
        className="shrink-0 rounded-md border border-[var(--color-border)] bg-white px-2 py-1 text-[11.5px] font-medium text-[var(--color-text)] disabled:opacity-50"
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
