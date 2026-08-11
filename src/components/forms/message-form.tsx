"use client";

import { useState, useTransition } from "react";
import { sendMessageAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";

export function MessageForm({
  projectId,
  placeholder,
  submitLabel,
  onDone,
}: {
  projectId: string;
  placeholder: string;
  submitLabel: string;
  onDone: () => void;
}) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!body.trim() || pending) return;
    startTransition(async () => {
      await sendMessageAction(projectId, body);
      onDone();
    });
  }

  return (
    <div>
      <Field label="Message">
        <textarea
          autoFocus
          className={fieldInputClass}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
        />
      </Field>
      <PrimaryButton onClick={submit} disabled={!body.trim() || pending}>
        {submitLabel}
      </PrimaryButton>
    </div>
  );
}
