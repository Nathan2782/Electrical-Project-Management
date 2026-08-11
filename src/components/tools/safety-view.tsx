"use client";

import { useTransition } from "react";
import clsx from "clsx";
import { AddButton } from "@/components/ui/add-button";
import { SafetyForm } from "@/components/forms/safety-form";
import { resolveSafetyItemAction } from "@/app/(app)/projects/[projectId]/actions";
import { StatusBadge } from "@/components/badges/status-badge";
import { formatRelative } from "@/lib/format";

type SafetyData = {
  id: string;
  title: string;
  severity: string;
  reportedBy: string;
  description: string;
  resolved: boolean;
  createdAt: string;
};

export function SafetyView({ projectId, items }: { projectId: string; items: SafetyData[] }) {
  const open = items.filter((i) => !i.resolved);
  const resolved = items.filter((i) => i.resolved);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-semibold text-[var(--color-text)]">Safety</h1>
          <p className="text-[12.5px] text-[var(--color-text-secondary)]">Jobsite hazards and safety reports</p>
        </div>
        <AddButton
          label="Report Safety Issue"
          modalTitle="Report Safety Issue"
          render={(onDone) => <SafetyForm projectId={projectId} onDone={onDone} />}
        />
      </div>

      {items.length === 0 ? (
        <p className="text-center text-[13px] text-[var(--color-text-muted)]">
          No safety issues reported. Nice work.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {open.length > 0 && (
            <div>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Open
              </h2>
              <div className="flex flex-col gap-2.5">
                {open.map((item) => (
                  <SafetyCard key={item.id} item={item} projectId={projectId} />
                ))}
              </div>
            </div>
          )}
          {resolved.length > 0 && (
            <div>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Resolved
              </h2>
              <div className="flex flex-col gap-2.5">
                {resolved.map((item) => (
                  <SafetyCard key={item.id} item={item} projectId={projectId} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SafetyCard({ item, projectId }: { item: SafetyData; projectId: string }) {
  const [pending, startTransition] = useTransition();

  function toggleResolved() {
    startTransition(() => resolveSafetyItemAction(item.id, projectId, !item.resolved));
  }

  return (
    <div
      className={clsx(
        "rounded-lg border bg-white p-4",
        item.resolved ? "border-[var(--color-border)] opacity-70" : "border-[var(--color-status-critical)]/30"
      )}
    >
      <div className="mb-1.5 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-[13.5px] font-semibold text-[var(--color-text)]">{item.title}</h3>
        <StatusBadge status={item.resolved ? "COMPLETE" : item.severity} />
      </div>
      <p className="text-[13px] text-[var(--color-text-secondary)]">{item.description}</p>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11.5px] text-[var(--color-text-muted)]">
          Reported by {item.reportedBy} · {formatRelative(new Date(item.createdAt))}
        </p>
        <button
          onClick={toggleResolved}
          disabled={pending}
          className="text-[12px] font-medium text-[var(--color-primary)] hover:underline disabled:opacity-50"
        >
          {item.resolved ? "Reopen" : "Mark Resolved"}
        </button>
      </div>
    </div>
  );
}
