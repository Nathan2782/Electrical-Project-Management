"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { assignCrewToProjectAction } from "@/app/(app)/crew/actions";
import { AddButton } from "@/components/ui/add-button";
import { CrewMemberForm } from "@/components/forms/crew-member-form";
import { roleLabel } from "@/lib/roles";

export type CrewUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatarColor: string;
  projectIds: string[];
};

export type CrewProject = { id: string; name: string; color: string };

export function CrewRoster({
  users,
  projects,
  canManage,
}: {
  users: CrewUser[];
  projects: CrewProject[];
  canManage: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-semibold text-[var(--color-text)]">Crew</h1>
          <p className="text-[12.5px] text-[var(--color-text-secondary)]">
            {users.length} people in the workspace{canManage ? " · assign them to projects below" : ""}
          </p>
        </div>
        {canManage && (
          <AddButton
            label="Add Team Member"
            modalTitle="Add Team Member"
            render={(onDone) => <CrewMemberForm onDone={onDone} />}
          />
        )}
      </div>

      {!canManage && (
        <p className="mt-3 rounded-md bg-[var(--color-bg-subtle)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)]">
          Only the Foreman/Admin can add crew or change project assignments.
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
        {users.map((u) => {
          const isOpen = expanded === u.id;
          return (
            <div key={u.id} className="border-b border-[var(--color-border)] last:border-b-0">
              <button
                onClick={() => setExpanded(isOpen ? null : u.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-bg-subtle)]"
              >
                {isOpen ? (
                  <ChevronDown size={14} className="shrink-0 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronRight size={14} className="shrink-0 text-[var(--color-text-muted)]" />
                )}
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[12px] font-semibold text-white"
                  style={{ backgroundColor: u.avatarColor }}
                >
                  {u.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-[var(--color-text)]">{u.name}</p>
                  <p className="truncate text-[11.5px] text-[var(--color-text-secondary)]">
                    {roleLabel(u.role)} · {u.email}
                  </p>
                </div>
                <span className="shrink-0 text-[11.5px] text-[var(--color-text-muted)]">
                  {u.projectIds.length} project{u.projectIds.length === 1 ? "" : "s"}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    Project Assignments
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {projects.map((p) => (
                      <AssignmentRow key={p.id} user={u} project={p} canManage={canManage} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssignmentRow({
  user,
  project,
  canManage,
}: {
  user: CrewUser;
  project: CrewProject;
  canManage: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const assigned = user.projectIds.includes(project.id);

  function toggle() {
    if (!canManage || pending) return;
    startTransition(() => assignCrewToProjectAction(user.id, project.id, !assigned));
  }

  return (
    <label
      className={clsx(
        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px]",
        canManage && "cursor-pointer hover:bg-white"
      )}
    >
      <input
        type="checkbox"
        checked={assigned}
        disabled={!canManage || pending}
        onChange={toggle}
        className="h-4 w-4 rounded border-[var(--color-border-strong)] accent-[var(--color-primary)] disabled:opacity-60"
      />
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
      {project.name}
    </label>
  );
}
