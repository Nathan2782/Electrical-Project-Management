"use client";

import { useState, useTransition } from "react";
import { createSafetyItemAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function SafetyForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("NEEDS_ATTENTION");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!title.trim() || pending) return;
    startTransition(async () => {
      await createSafetyItemAction(projectId, { title, description, severity });
      onDone();
    });
  }

  return (
    <div>
      <Field label="Safety hazard">
        <input
          autoFocus
          className={fieldInputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Missing GFCI on temp power, Level 3"
        />
      </Field>
      <Field label="Details">
        <textarea
          className={fieldInputClass}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>
      <Field label="Severity">
        <select className={fieldInputClass} value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="NEEDS_ATTENTION">Needs Attention</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </Field>
      <PrimaryButton onClick={submit} disabled={!title.trim() || pending}>
        Report Safety Issue
      </PrimaryButton>
    </div>
  );
}
