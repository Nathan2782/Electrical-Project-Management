"use client";

import { useState, useTransition } from "react";
import { addCrewMemberAction } from "@/app/(app)/crew/actions";
import { Field, fieldInputClass, PrimaryButton } from "@/components/ui/field";
import { ROLES, ROLE_LABELS } from "@/lib/roles";

export function CrewMemberForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CREW");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!name.trim() || !email.trim() || pending) return;
    startTransition(async () => {
      await addCrewMemberAction({ name, email, role });
      onDone();
    });
  }

  return (
    <div>
      <Field label="Full name">
        <input autoFocus className={fieldInputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chris Bell" />
      </Field>
      <Field label="Email">
        <input
          type="email"
          className={fieldInputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="chris.bell@voltline.com"
        />
      </Field>
      <Field label="Role">
        <select className={fieldInputClass} value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </Field>
      <PrimaryButton onClick={submit} disabled={!name.trim() || !email.trim() || pending}>
        Add Team Member
      </PrimaryButton>
    </div>
  );
}
