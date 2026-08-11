"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, Settings, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { MORE_SECTIONS } from "@/lib/nav";
import { isForeman, type RoleId } from "@/lib/roles";

export function MoreMenu({
  projectId,
  activeRole,
  trigger,
}: {
  projectId: string;
  activeRole: RoleId;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
          {MORE_SECTIONS.map((section) => {
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
                disabled
                title="Not available in this demo workspace"
                className="flex w-full cursor-not-allowed items-center justify-between px-3 py-2 text-[13px] text-[var(--color-text-muted)]"
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
    </div>
  );
}
