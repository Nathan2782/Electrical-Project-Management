"use client";

import { useState } from "react";
import { Boxes, NotebookPen } from "lucide-react";
import clsx from "clsx";
import { AddButton } from "@/components/ui/add-button";
import { MaterialForm } from "@/components/forms/material-form";
import { NoteForm } from "@/components/forms/note-form";
import { MaterialRow, type MaterialRowData } from "@/components/materials/material-row";
import { OfficialBadge } from "@/components/badges/official-badge";
import { formatShortDate } from "@/lib/format";
import { type RoleId } from "@/lib/roles";

type NoteData = {
  id: string;
  title: string;
  body: string;
  official: boolean;
  authorName: string;
  createdAt: string;
};

export function MaterialsNotesView({
  projectId,
  activeRole,
  materials,
  notes,
}: {
  projectId: string;
  activeRole: RoleId;
  materials: MaterialRowData[];
  notes: NoteData[];
}) {
  const [tab, setTab] = useState<"materials" | "notes">("materials");
  const pendingCount = materials.filter((m) => m.status !== "COMPLETE").length;

  return (
    <div className="mx-auto flex max-w-4xl flex-col p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-[var(--color-bg-subtle)] p-1">
          <button
            onClick={() => setTab("materials")}
            className={clsx(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium",
              tab === "materials"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-secondary)]"
            )}
          >
            <Boxes size={14} />
            Materials
            {pendingCount > 0 && (
              <span className="rounded-full bg-[var(--color-status-attention-bg)] px-1.5 text-[10.5px] font-semibold text-[var(--color-status-attention)]">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("notes")}
            className={clsx(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium",
              tab === "notes" ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-[var(--color-text-secondary)]"
            )}
          >
            <NotebookPen size={14} />
            Notes
          </button>
        </div>

        {tab === "materials" ? (
          <AddButton
            label="Add Material"
            modalTitle="Add Material"
            render={(onDone) => <MaterialForm projectId={projectId} onDone={onDone} />}
          />
        ) : (
          <AddButton
            label="Add Note"
            modalTitle="Add Note"
            render={(onDone) => <NoteForm projectId={projectId} activeRole={activeRole} onDone={onDone} />}
          />
        )}
      </div>

      {tab === "materials" ? (
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
          {materials.length === 0 ? (
            <p className="p-6 text-center text-[13px] text-[var(--color-text-muted)]">
              No materials requested yet.
            </p>
          ) : (
            materials.map((m) => <MaterialRow key={m.id} material={m} projectId={projectId} />)
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.length === 0 ? (
            <p className="p-6 text-center text-[13px] text-[var(--color-text-muted)]">No notes yet.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="text-[13.5px] font-semibold text-[var(--color-text)]">{note.title}</h3>
                  {note.official && <OfficialBadge compact />}
                </div>
                <p className="whitespace-pre-wrap text-[13px] text-[var(--color-text-secondary)]">{note.body}</p>
                <p className="mt-2 text-[11.5px] text-[var(--color-text-muted)]">
                  {note.authorName} · {formatShortDate(new Date(note.createdAt))}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
