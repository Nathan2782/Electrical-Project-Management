"use client";

import { useState, useTransition } from "react";
import { addPrintAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function PrintForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [name, setName] = useState("");
  const [sheetNo, setSheetNo] = useState("");
  const [discipline, setDiscipline] = useState("Electrical");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!name.trim() || pending) return;
    startTransition(async () => {
      await addPrintAction(projectId, { name, sheetNo, discipline });
      onDone();
    });
  }

  return (
    <div>
      <Field label="Sheet name">
        <input
          autoFocus
          className={fieldInputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Power Plan - Level 2"
        />
      </Field>
      <Field label="Sheet number">
        <input
          className={fieldInputClass}
          value={sheetNo}
          onChange={(e) => setSheetNo(e.target.value)}
          placeholder="e.g. E-201"
        />
      </Field>
      <Field label="Discipline">
        <select className={fieldInputClass} value={discipline} onChange={(e) => setDiscipline(e.target.value)}>
          <option>Electrical</option>
          <option>Mechanical</option>
          <option>Plumbing</option>
          <option>Architectural</option>
          <option>Structural</option>
        </select>
      </Field>
      <PrimaryButton onClick={submit} disabled={!name.trim() || pending}>
        Add Print
      </PrimaryButton>
    </div>
  );
}
