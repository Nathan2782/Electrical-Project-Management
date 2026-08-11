"use client";

import { useState, useRef, useEffect } from "react";
import { Users } from "lucide-react";
import { roleLabel } from "@/lib/roles";
import type { ProjectMemberSummary } from "@/components/project/project-workspace-shell";

export function MembersPopover({ members }: { members: ProjectMemberSummary[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
        title="Project members"
      >
        <Users size={16} />
        <span className="hidden sm:inline">{members.length}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-1.5 w-64 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white py-1.5 shadow-lg">
          <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {members.length} Members
          </p>
          <div className="max-h-72 overflow-y-auto">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-2.5 px-3 py-1.5">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-white"
                  style={{ backgroundColor: m.avatarColor }}
                >
                  {m.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--color-text)]">{m.name}</p>
                  <p className="truncate text-[11.5px] text-[var(--color-text-secondary)]">
                    {roleLabel(m.role)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
