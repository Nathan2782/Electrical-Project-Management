"use client";

import { useTransition } from "react";
import { updateInspectionStatusAction } from "@/app/(app)/projects/[projectId]/actions";
import { statusConfig, STATUS_CONFIG, type StatusId } from "@/lib/status";
import { formatFullDate } from "@/lib/format";

type InspectionData = {
  id: string;
  title: string;
  inspector: string | null;
  scheduledAt: string | null;
  status: string;
  notes: string | null;
};

export function InspectionsView({ projectId, inspections }: { projectId: string; inspections: InspectionData[] }) {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="mb-1 text-[16px] font-semibold text-[var(--color-text)]">Inspections</h1>
      <p className="mb-5 text-[12.5px] text-[var(--color-text-secondary)]">
        Scheduled and completed inspections for this project
      </p>

      {inspections.length === 0 ? (
        <p className="text-center text-[13px] text-[var(--color-text-muted)]">No inspections scheduled.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
          {inspections.map((inspection) => (
            <InspectionRow key={inspection.id} inspection={inspection} projectId={projectId} />
          ))}
        </div>
      )}
    </div>
  );
}

function InspectionRow({ inspection, projectId }: { inspection: InspectionData; projectId: string }) {
  const [pending, startTransition] = useTransition();
  const cfg = statusConfig(inspection.status);

  function handleChange(status: string) {
    startTransition(() => updateInspectionStatusAction(inspection.id, projectId, status));
  }

  return (
    <div className="flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0">
      <cfg.icon size={16} className="mt-0.5 shrink-0" style={{ color: cfg.color }} />
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium text-[var(--color-text)]">{inspection.title}</p>
        {inspection.inspector && (
          <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">{inspection.inspector}</p>
        )}
        {inspection.scheduledAt && (
          <p className="mt-0.5 text-[11.5px] text-[var(--color-text-muted)]">
            Scheduled {formatFullDate(new Date(inspection.scheduledAt))}
          </p>
        )}
        {inspection.notes && (
          <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">{inspection.notes}</p>
        )}
      </div>
      <select
        value={inspection.status}
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
