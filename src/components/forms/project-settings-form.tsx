"use client";

import { useState, useTransition } from "react";
import { updateProjectAction } from "@/app/(app)/projects/[projectId]/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";
import type { ProjectSummary } from "@/components/project/project-workspace-shell";

export function ProjectSettingsForm({ project, onDone }: { project: ProjectSummary; onDone: () => void }) {
  const [name, setName] = useState(project.name);
  const [clientName, setClientName] = useState(project.clientName);
  const [phase, setPhase] = useState(project.phase);
  const [status, setStatus] = useState(project.status);
  const [address, setAddress] = useState(project.address ?? "");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!name.trim() || !clientName.trim() || !phase.trim() || pending) return;
    startTransition(async () => {
      await updateProjectAction(project.id, { name, clientName, phase, status, address });
      onDone();
    });
  }

  return (
    <div>
      <Field label="Project name">
        <input className={fieldInputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Client">
        <input className={fieldInputClass} value={clientName} onChange={(e) => setClientName(e.target.value)} />
      </Field>
      <Field label="Current phase">
        <input className={fieldInputClass} value={phase} onChange={(e) => setPhase(e.target.value)} />
      </Field>
      <Field label="Status">
        <select className={fieldInputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ACTIVE">Active</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETE">Complete</option>
        </select>
      </Field>
      <Field label="Site address (optional)">
        <input className={fieldInputClass} value={address} onChange={(e) => setAddress(e.target.value)} />
      </Field>
      <PrimaryButton onClick={submit} disabled={!name.trim() || !clientName.trim() || !phase.trim() || pending}>
        Save Changes
      </PrimaryButton>
    </div>
  );
}
