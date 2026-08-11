"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { PRIMARY_SECTIONS, MORE_SECTIONS } from "@/lib/nav";
import { MoreMenu } from "@/components/project/more-menu";
import type { RoleId } from "@/lib/roles";

export function SecondaryNav({ projectId, activeRole }: { projectId: string; activeRole: RoleId }) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const activeMoreSection = MORE_SECTIONS.find(
    (s) => pathname === `/projects/${projectId}/${s.slug}`
  );

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [pathname]);

  return (
    <div className="flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-[var(--color-border)] bg-white px-2">
      {PRIMARY_SECTIONS.map((section) => {
        const href = `/projects/${projectId}/${section.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={section.slug}
            href={href}
            ref={active ? activeRef : undefined}
            className={clsx(
              "relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[13px] font-medium transition-colors",
              active
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            )}
          >
            <section.icon size={15} />
            {section.label}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-[var(--color-primary)]" />
            )}
          </Link>
        );
      })}
      <MoreMenu
        projectId={projectId}
        activeRole={activeRole}
        trigger={
          <span
            className={clsx(
              "relative flex items-center gap-1 whitespace-nowrap px-3 py-2.5 text-[13px] font-medium",
              activeMoreSection
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            )}
          >
            {activeMoreSection ? activeMoreSection.label : "More"}
            <ChevronDown size={14} />
            {activeMoreSection && (
              <span className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-[var(--color-primary)]" />
            )}
          </span>
        }
      />
    </div>
  );
}
