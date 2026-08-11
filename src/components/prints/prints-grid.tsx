"use client";

import { FileStack } from "lucide-react";
import { AddButton } from "@/components/ui/add-button";
import { PrintForm } from "@/components/forms/print-form";
import { OfficialBadge } from "@/components/badges/official-badge";
import { formatShortDate } from "@/lib/format";
import { canManageOfficial, type RoleId } from "@/lib/roles";

export type PrintData = {
  id: string;
  name: string;
  sheetNo: string;
  revision: string;
  discipline: string;
  uploadedBy: string;
  createdAt: string;
};

export function PrintsGrid({
  projectId,
  prints,
  activeRole,
}: {
  projectId: string;
  prints: PrintData[];
  activeRole: RoleId;
}) {
  const canManage = canManageOfficial(activeRole);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-semibold text-[var(--color-text)]">Prints</h1>
          <p className="text-[12.5px] text-[var(--color-text-secondary)]">
            Official drawing sheets for this project
          </p>
        </div>
        {canManage && (
          <AddButton
            label="Add Print"
            modalTitle="Add Print"
            render={(onDone) => <PrintForm projectId={projectId} onDone={onDone} />}
          />
        )}
      </div>

      {prints.length === 0 ? (
        <p className="mt-8 text-center text-[13px] text-[var(--color-text-muted)]">
          No prints uploaded yet.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {prints.map((print) => (
            <div
              key={print.id}
              className="flex flex-col gap-2.5 rounded-lg border border-[var(--color-border)] bg-white p-3.5"
            >
              <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-[var(--color-bg-subtle)]">
                <FileStack size={30} className="text-[var(--color-text-muted)]" />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[var(--color-text)]">{print.name}</p>
                  <p className="text-[11.5px] text-[var(--color-text-secondary)]">
                    {print.sheetNo} · {print.revision}
                  </p>
                </div>
                <OfficialBadge compact />
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                {print.discipline} · {print.uploadedBy} · {formatShortDate(new Date(print.createdAt))}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
