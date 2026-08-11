"use client";

import { useState, useTransition } from "react";
import { createIssueAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function IssueForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!title.trim() || pending) return;
    startTransition(async () => {
      await createIssueAction(projectId, { title, description });
      onDone();
    });
  }

  return (
    <div>
      <Field label="What's the issue">
        <input
          autoFocus
          className={fieldInputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Panel B location doesn't match field conditions"
        />
      </Field>
      <Field label="Details (optional)">
        <textarea
          className={fieldInputClass}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>
      <PrimaryButton onClick={submit} disabled={!title.trim() || pending}>
        Report Issue
      </PrimaryButton>
    </div>
  );
}
