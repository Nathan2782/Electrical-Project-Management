"use client";

import { useState, useTransition } from "react";
import { createNoteAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";
import { canManageOfficial, type RoleId } from "@/lib/roles";

export function NoteForm({
  projectId,
  activeRole,
  onDone,
}: {
  projectId: string;
  activeRole: RoleId;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [official, setOfficial] = useState(false);
  const [pending, startTransition] = useTransition();
  const canOfficial = canManageOfficial(activeRole);

  function submit() {
    if (!title.trim() || pending) return;
    startTransition(async () => {
      await createNoteAction(projectId, { title, body, official: canOfficial && official });
      onDone();
    });
  }

  return (
    <div>
      <Field label="Title">
        <input
          autoFocus
          className={fieldInputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Access requirements"
        />
      </Field>
      <Field label="Note">
        <textarea
          className={fieldInputClass}
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </Field>
      {canOfficial && (
        <label className="mb-3 flex items-center gap-2 text-[13px] text-[var(--color-text)]">
          <input
            type="checkbox"
            checked={official}
            onChange={(e) => setOfficial(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--color-border-strong)] accent-[var(--color-primary)]"
          />
          Publish as official note
        </label>
      )}
      <PrimaryButton onClick={submit} disabled={!title.trim() || pending}>
        Add Note
      </PrimaryButton>
    </div>
  );
}
