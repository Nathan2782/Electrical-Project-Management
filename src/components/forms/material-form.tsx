"use client";

import { useState, useTransition } from "react";
import { createMaterialAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function MaterialForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!name.trim() || pending) return;
    startTransition(async () => {
      await createMaterialAction(projectId, { name, quantity, notes });
      onDone();
    });
  }

  return (
    <div>
      <Field label="Material">
        <input
          autoFocus
          className={fieldInputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='e.g. 3/4" EMT conduit'
        />
      </Field>
      <Field label="Quantity">
        <input
          className={fieldInputClass}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 100 ft"
        />
      </Field>
      <Field label="Notes (optional)">
        <textarea
          className={fieldInputClass}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>
      <PrimaryButton onClick={submit} disabled={!name.trim() || pending}>
        Add Material
      </PrimaryButton>
    </div>
  );
}
