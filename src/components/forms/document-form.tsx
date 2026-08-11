"use client";

import { useState, useTransition } from "react";
import { addDocumentAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function DocumentForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("PDF");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!name.trim() || pending) return;
    startTransition(async () => {
      await addDocumentAction(projectId, { name, fileType });
      onDone();
    });
  }

  return (
    <div>
      <p className="mb-3 rounded-md bg-[var(--color-bg-subtle)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)]">
        File uploads aren&rsquo;t wired to storage in this build — this adds a document record to the project.
      </p>
      <Field label="Document name">
        <input
          autoFocus
          className={fieldInputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Electrical Spec Section 26"
        />
      </Field>
      <Field label="File type">
        <select className={fieldInputClass} value={fileType} onChange={(e) => setFileType(e.target.value)}>
          <option>PDF</option>
          <option>XLSX</option>
          <option>DOCX</option>
          <option>DWG</option>
        </select>
      </Field>
      <PrimaryButton onClick={submit} disabled={!name.trim() || pending}>
        Add Document
      </PrimaryButton>
    </div>
  );
}
