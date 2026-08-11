"use client";

import { useTransition } from "react";
import { Zap } from "lucide-react";
import { updateMaterialStatusAction } from "@/app/(app)/projects/[projectId]/actions";
import { statusConfig, STATUS_CONFIG, type StatusId } from "@/lib/status";

export type MaterialRowData = {
  id: string;
  name: string;
  quantity: string;
  status: string;
  requestedBy: string | null;
  notes: string | null;
  fromMessage: boolean;
};

export function MaterialRow({ material, projectId }: { material: MaterialRowData; projectId: string }) {
  const [pending, startTransition] = useTransition();
  const cfg = statusConfig(material.status);

  function handleChange(status: string) {
    startTransition(() => updateMaterialStatusAction(material.id, projectId, status));
  }

  return (
    <div className="flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0">
      <cfg.icon size={16} className="mt-0.5 shrink-0" style={{ color: cfg.color }} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-[13.5px] font-medium text-[var(--color-text)]">{material.name}</p>
          {material.fromMessage && (
            <span
              title="Requested from a conversation message"
              className="flex items-center gap-0.5 rounded-full bg-[var(--color-bg-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]"
            >
              <Zap size={9} /> from chat
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[12.5px] text-[var(--color-text-secondary)]">Qty: {material.quantity}</p>
        {material.notes && <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">{material.notes}</p>}
        {material.requestedBy && (
          <p className="mt-1 text-[11.5px] text-[var(--color-text-muted)]">
            Requested by {material.requestedBy}
          </p>
        )}
      </div>
      <select
        value={material.status}
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
