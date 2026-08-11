"use client";

import { Ruler } from "lucide-react";
import { AddButton } from "@/components/ui/add-button";
import { MeasurementForm } from "@/components/forms/measurement-form";
import { formatShortDate } from "@/lib/format";

type MeasurementData = {
  id: string;
  label: string;
  value: string;
  location: string | null;
  createdAt: string;
};

export function MeasurementsView({
  projectId,
  measurements,
}: {
  projectId: string;
  measurements: MeasurementData[];
}) {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-semibold text-[var(--color-text)]">Measurements</h1>
          <p className="text-[12.5px] text-[var(--color-text-secondary)]">Field dimensions and readings</p>
        </div>
        <AddButton
          label="Add Measurement"
          modalTitle="Add Measurement"
          render={(onDone) => <MeasurementForm projectId={projectId} onDone={onDone} />}
        />
      </div>

      {measurements.length === 0 ? (
        <p className="text-center text-[13px] text-[var(--color-text-muted)]">No measurements logged yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
          {measurements.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0"
            >
              <Ruler size={16} className="shrink-0 text-[var(--color-primary)]" />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-[var(--color-text)]">{m.label}</p>
                {m.location && <p className="text-[11.5px] text-[var(--color-text-secondary)]">{m.location}</p>}
              </div>
              <div className="text-right">
                <p className="text-[13.5px] font-semibold text-[var(--color-text)]">{m.value}</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">{formatShortDate(new Date(m.createdAt))}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
