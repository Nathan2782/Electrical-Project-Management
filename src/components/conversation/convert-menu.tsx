"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { CornerUpRight, CheckSquare, Boxes, ShieldAlert } from "lucide-react";
import {
  convertMessageToTaskAction,
  convertMessageToMaterialAction,
  convertMessageToIssueAction,
} from "@/app/(app)/projects/[projectId]/actions";

export function ConvertMenu({ messageId, projectId }: { messageId: string; projectId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function run(action: (messageId: string, projectId: string) => Promise<void>) {
    startTransition(() => action(messageId, projectId));
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-white px-2 py-1 text-[11.5px] font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50"
      >
        <CornerUpRight size={12} />
        Convert
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-lg">
          <button
            onClick={() => run(convertMessageToTaskAction)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]"
          >
            <CheckSquare size={15} className="text-[var(--color-status-active)]" />
            Task
          </button>
          <button
            onClick={() => run(convertMessageToMaterialAction)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]"
          >
            <Boxes size={15} className="text-[var(--color-status-complete)]" />
            Material Request
          </button>
          <button
            onClick={() => run(convertMessageToIssueAction)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]"
          >
            <ShieldAlert size={15} className="text-[var(--color-status-attention)]" />
            Issue
          </button>
        </div>
      )}
    </div>
  );
}
