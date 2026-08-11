"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";
import { toggleChecklistItemAction } from "@/app/(app)/projects/[projectId]/actions";

type ChecklistData = {
  id: string;
  title: string;
  items: { id: string; label: string; done: boolean }[];
};

export function ChecklistsView({ projectId, checklists }: { projectId: string; checklists: ChecklistData[] }) {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="mb-1 text-[16px] font-semibold text-[var(--color-text)]">Checklists</h1>
      <p className="mb-5 text-[12.5px] text-[var(--color-text-secondary)]">
        Standard rough-in and closeout checklists for this project
      </p>

      {checklists.length === 0 ? (
        <p className="text-center text-[13px] text-[var(--color-text-muted)]">No checklists yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {checklists.map((checklist) => (
            <ChecklistCard key={checklist.id} checklist={checklist} projectId={projectId} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChecklistCard({ checklist, projectId }: { checklist: ChecklistData; projectId: string }) {
  const done = checklist.items.filter((i) => i.done).length;

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <h3 className="text-[13.5px] font-semibold text-[var(--color-text)]">{checklist.title}</h3>
        <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">
          {done}/{checklist.items.length}
        </span>
      </div>
      {checklist.items.map((item) => (
        <ChecklistItemRow key={item.id} item={item} projectId={projectId} />
      ))}
    </div>
  );
}

function ChecklistItemRow({
  item,
  projectId,
}: {
  item: { id: string; label: string; done: boolean };
  projectId: string;
}) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(() => toggleChecklistItemAction(item.id, projectId, !item.done));
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className="flex w-full items-center gap-3 border-b border-[var(--color-border)] px-4 py-2.5 text-left last:border-b-0 hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
    >
      <span
        className={clsx(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
          item.done
            ? "border-[var(--color-status-complete)] bg-[var(--color-status-complete)]"
            : "border-[var(--color-border-strong)]"
        )}
      >
        {item.done && <Check size={13} className="text-white" strokeWidth={3} />}
      </span>
      <span
        className={clsx(
          "text-[13px]",
          item.done ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text)]"
        )}
      >
        {item.label}
      </span>
    </button>
  );
}
