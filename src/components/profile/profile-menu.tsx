"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Check, LogOut, UserCog } from "lucide-react";
import clsx from "clsx";
import { switchRoleAction } from "@/app/(app)/actions";
import { ROLES, ROLE_LABELS, ROLE_SHORT_LABELS, type RoleId } from "@/lib/roles";
import type { ShellUser } from "@/components/shell/app-shell";

export function ProfileMenu({
  currentUser,
  activeRole,
  variant,
}: {
  currentUser: ShellUser;
  activeRole: RoleId;
  variant: "sidebar" | "topbar";
}) {
  const [open, setOpen] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowRoles(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSwitchRole(role: RoleId) {
    startTransition(async () => {
      await switchRoleAction(role);
      router.refresh();
    });
    setOpen(false);
    setShowRoles(false);
  }

  const avatar = (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[12px] font-semibold text-white"
      style={{ backgroundColor: currentUser.avatarColor }}
    >
      {currentUser.initials}
    </span>
  );

  return (
    <div className="relative" ref={ref}>
      {variant === "sidebar" ? (
        <button
          onClick={() => {
            setOpen((v) => !v);
            setShowRoles(false);
          }}
          className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left hover:bg-[var(--color-sidebar-bg-hover)]"
        >
          {avatar}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-white">
              {currentUser.name}
            </span>
            <span className="block truncate text-[11px] text-[var(--color-sidebar-text-muted)]">
              {ROLE_LABELS[activeRole]}
            </span>
          </span>
          <ChevronDown size={14} className="shrink-0 text-[var(--color-sidebar-text-muted)]" />
        </button>
      ) : (
        <button
          onClick={() => {
            setOpen((v) => !v);
            setShowRoles(false);
          }}
          className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-[var(--color-bg-subtle)]"
        >
          {avatar}
          <span className="hidden text-left lg:block">
            <span className="block text-[13px] font-medium text-[var(--color-text)] leading-tight">
              {currentUser.name.split(" ")[0]}
            </span>
            <span className="block text-[11px] text-[var(--color-text-secondary)] leading-tight">
              {ROLE_SHORT_LABELS[activeRole]}
            </span>
          </span>
          <ChevronDown size={14} className="hidden text-[var(--color-text-muted)] lg:block" />
        </button>
      )}

      {open && (
        <div
          className={clsx(
            "absolute z-40 w-64 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-lg",
            variant === "sidebar" ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"
          )}
        >
          <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] p-3">
            {avatar}
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-semibold text-[var(--color-text)]">
                {currentUser.name}
              </p>
              <p className="truncate text-[12px] text-[var(--color-text-secondary)]">
                {currentUser.email}
              </p>
            </div>
          </div>

          {!showRoles ? (
            <div className="p-1.5">
              <button
                onClick={() => setShowRoles(true)}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-[13px] text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]"
              >
                <span className="flex items-center gap-2.5">
                  <UserCog size={16} className="text-[var(--color-text-secondary)]" />
                  Switch Role
                </span>
                <span className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                  {ROLE_LABELS[activeRole]}
                  <ChevronRight size={14} />
                </span>
              </button>
              <button
                disabled
                title="Not available in this demo workspace"
                className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-[var(--color-text-muted)]"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="p-1.5">
              <button
                onClick={() => setShowRoles(false)}
                className="mb-1 flex items-center gap-1 px-2 py-1 text-[12px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              >
                ← Switch Role
              </button>
              {ROLES.map((role) => (
                <button
                  key={role}
                  disabled={pending}
                  onClick={() => handleSwitchRole(role)}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-[13px] text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-50"
                >
                  {ROLE_LABELS[role]}
                  {role === activeRole && <Check size={15} className="text-[var(--color-primary)]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
