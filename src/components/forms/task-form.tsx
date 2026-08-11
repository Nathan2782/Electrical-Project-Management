"use client";

import { useState, useTransition } from "react";
import { createTaskAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function TaskForm({
  projectId,
  members,
  onDone,
}: {
  projectId: string;
  members: { id: string; name: string }[];
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!title.trim() || pending) return;
    startTransition(async () => {
      await createTaskAction(projectId, { title, description, assigneeId, dueDate });
      onDone();
    });
  }

  return (
    <div>
      <Field label="Task">
        <input
          autoFocus
          className={fieldInputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Label Panel A breakers"
        />
      </Field>
      <Field label="Details (optional)">
        <textarea
          className={fieldInputClass}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>
      <Field label="Assign to">
        <select
          className={fieldInputClass}
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Due date (optional)">
        <input
          type="date"
          className={fieldInputClass}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </Field>
      <PrimaryButton onClick={submit} disabled={!title.trim() || pending}>
        Create Task
      </PrimaryButton>
    </div>
  );
}
