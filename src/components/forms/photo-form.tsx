"use client";

import { useState, useTransition } from "react";
import { Camera } from "lucide-react";
import { addPhotoAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function PhotoForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [caption, setCaption] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (pending) return;
    startTransition(async () => {
      await addPhotoAction(projectId, { caption });
      onDone();
    });
  }

  return (
    <div>
      <div className="mb-3 flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] py-6">
        <Camera size={22} className="text-[var(--color-text-muted)]" />
        <p className="text-[12px] text-[var(--color-text-secondary)]">
          Camera capture isn&rsquo;t wired to storage in this build.
        </p>
      </div>
      <Field label="Caption">
        <input
          autoFocus
          className={fieldInputClass}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="e.g. 2F junction boxes — need covers"
        />
      </Field>
      <PrimaryButton onClick={submit} disabled={pending}>
        Add Photo
      </PrimaryButton>
    </div>
  );
}
