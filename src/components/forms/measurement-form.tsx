"use client";

import { useState, useTransition } from "react";
import { createMeasurementAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function MeasurementForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [location, setLocation] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!label.trim() || !value.trim() || pending) return;
    startTransition(async () => {
      await createMeasurementAction(projectId, { label, value, location });
      onDone();
    });
  }

  return (
    <div>
      <Field label="What are you measuring">
        <input
          autoFocus
          className={fieldInputClass}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Panel A to Panel B distance"
        />
      </Field>
      <Field label="Measurement">
        <input
          className={fieldInputClass}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 42 ft"
        />
      </Field>
      <Field label="Location (optional)">
        <input
          className={fieldInputClass}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Level 2 electrical room"
        />
      </Field>
      <PrimaryButton onClick={submit} disabled={!label.trim() || !value.trim() || pending}>
        Add Measurement
      </PrimaryButton>
    </div>
  );
}
