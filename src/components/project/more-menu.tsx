"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, Settings, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { moreSectionsForRole } from "@/lib/nav";
import { isForeman, type RoleId } from "@/lib/roles";
import { Modal } from "@/components/ui/modal";
import { ProjectSettingsForm } from "@/components/forms/project-settings-form";
import type { ProjectSummary } from "@/components/project/project-workspace-shell";

export function MoreMenu({
  projectId,
  project,
  activeRole,
  trigger,
}: {
  projectId: string;
  project: ProjectSummary;
  activeRole: RoleId;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const moreSections = moreSectionsForRole(activeRole);

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
        className={clsx(
          "flex items-center gap-1.5 rounded-md text-[13px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]",
          trigger ? "" : "h-9 w-9 justify-center"
        )}
        title="More project tools"
      >
        {trigger ?? <MoreHorizontal size={18} />}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-1.5 w-60 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white py-1.5 shadow-lg">
          <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Project Tools
          </p>
          {moreSections.map((section) => {
            const href = `/projects/${projectId}/${section.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={section.slug}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-2.5 px-3 py-2 text-[13px]",
                  active
                    ? "bg-[var(--color-primary-tint)] font-medium text-[var(--color-primary)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]"
                )}
              >
                <section.icon size={15} className="shrink-0" />
                {section.label}
              </Link>
            );
          })}
          {isForeman(activeRole) && (
            <>
              <div className="my-1.5 h-px bg-[var(--color-border)]" />
              <button
                onClick={() => {
                  setOpen(false);
                  setSettingsOpen(true);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-[13px] text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]"
              >
                <span className="flex items-center gap-2.5">
                  <Settings size={15} />
                  Project Settings
                </span>
                <ChevronRight size={13} />
              </button>
            </>
          )}
        </div>
      )}
      {settingsOpen && (
        <Modal title="Project Settings" onClose={() => setSettingsOpen(false)}>
          <ProjectSettingsForm project={project} onDone={() => setSettingsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
