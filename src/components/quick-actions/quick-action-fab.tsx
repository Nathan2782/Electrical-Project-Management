"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  NotebookPen,
  Camera,
  Boxes,
  ScanSearch,
  CheckSquare,
  Ruler,
  ShieldAlert,
  ShieldQuestion,
  HelpCircle,
  Megaphone,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { TaskForm } from "@/components/forms/task-form";
import { MaterialForm } from "@/components/forms/material-form";
import { NoteForm } from "@/components/forms/note-form";
import { PhotoForm } from "@/components/forms/photo-form";
import { MeasurementForm } from "@/components/forms/measurement-form";
import { IssueForm } from "@/components/forms/issue-form";
import { SafetyForm } from "@/components/forms/safety-form";
import { MessageForm } from "@/components/forms/message-form";
import type { ShellProject } from "@/components/shell/app-shell";
import type { RoleId } from "@/lib/roles";

type ActionKey =
  | "note"
  | "photo"
  | "material"
  | "identify-material"
  | "task"
  | "measurement"
  | "issue"
  | "safety"
  | "question"
  | "update";

const ACTIONS: { key: ActionKey; label: string; icon: typeof Plus }[] = [
  { key: "update", label: "Post Update", icon: Megaphone },
  { key: "question", label: "Ask Question", icon: HelpCircle },
  { key: "task", label: "Create Task", icon: CheckSquare },
  { key: "material", label: "Add Material", icon: Boxes },
  { key: "identify-material", label: "Identify Material", icon: ScanSearch },
  { key: "photo", label: "Take Photo", icon: Camera },
  { key: "note", label: "Add Note", icon: NotebookPen },
  { key: "measurement", label: "Add Measurement", icon: Ruler },
  { key: "issue", label: "Report Issue", icon: ShieldQuestion },
  { key: "safety", label: "Report Safety Issue", icon: ShieldAlert },
];

export function QuickActionFab({
  currentProjectId,
  activeRole,
  projects,
}: {
  currentProjectId?: string;
  activeRole: RoleId;
  projects: ShellProject[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const action = ACTIONS.find((a) => a.key === activeAction);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6" ref={ref}>
        {menuOpen && (
          <div className="absolute bottom-14 right-0 w-64 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white py-1.5 shadow-xl">
            {!currentProjectId ? (
              <div className="p-3">
                <p className="mb-2 text-[12.5px] text-[var(--color-text-secondary)]">
                  Open a project to use quick actions.
                </p>
                <div className="flex flex-col gap-1">
                  {projects.slice(0, 4).map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}/conversation`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              ACTIONS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => {
                    setActiveAction(a.key);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13.5px] text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]"
                >
                  <a.icon size={16} className="text-[var(--color-primary)]" />
                  {a.label}
                </button>
              ))
            )}
          </div>
        )}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-13 w-13 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-blue-900/20 transition-transform hover:scale-105 hover:bg-[var(--color-primary-hover)] active:scale-95"
          style={{ height: 52, width: 52 }}
          aria-label="Quick actions"
        >
          {menuOpen ? <X size={22} /> : <Plus size={24} />}
        </button>
      </div>

      {action && currentProjectId && (
        <Modal title={action.label} onClose={() => setActiveAction(null)}>
          <QuickActionForm
            actionKey={action.key}
            projectId={currentProjectId}
            activeRole={activeRole}
            onDone={() => setActiveAction(null)}
          />
        </Modal>
      )}
    </>
  );
}

function QuickActionForm({
  actionKey,
  projectId,
  activeRole,
  onDone,
}: {
  actionKey: ActionKey;
  projectId: string;
  activeRole: RoleId;
  onDone: () => void;
}) {
  switch (actionKey) {
    case "note":
      return <NoteForm projectId={projectId} activeRole={activeRole} onDone={onDone} />;
    case "photo":
      return <PhotoForm projectId={projectId} onDone={onDone} />;
    case "material":
      return <MaterialForm projectId={projectId} onDone={onDone} />;
    case "identify-material":
      return <MaterialForm projectId={projectId} onDone={onDone} />;
    case "task":
      return <TaskForm projectId={projectId} members={[]} onDone={onDone} />;
    case "measurement":
      return <MeasurementForm projectId={projectId} onDone={onDone} />;
    case "issue":
      return <IssueForm projectId={projectId} onDone={onDone} />;
    case "safety":
      return <SafetyForm projectId={projectId} onDone={onDone} />;
    case "question":
      return (
        <MessageForm
          projectId={projectId}
          placeholder="What do you need to ask the team?"
          submitLabel="Post Question"
          onDone={onDone}
        />
      );
    case "update":
      return (
        <MessageForm
          projectId={projectId}
          placeholder="Share a progress update with the team..."
          submitLabel="Post Update"
          onDone={onDone}
        />
      );
  }
}
