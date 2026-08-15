"use client";

import { useState, useMemo } from "react";
import { CheckSquare, ShieldQuestion } from "lucide-react";
import clsx from "clsx";
import { AddButton } from "@/components/ui/add-button";
import { TaskForm } from "@/components/forms/task-form";
import { IssueForm } from "@/components/forms/issue-form";
import { TaskRow, type TaskRowData } from "@/components/tasks/task-row";
import { IssueRow, type IssueRowData } from "@/components/tasks/issue-row";
import { canCreateTasks, canReportIssues, isFieldRole, type RoleId } from "@/lib/roles";

export function TaskBoard({
  projectId,
  activeRole,
  tasks,
  issues,
  members,
}: {
  projectId: string;
  activeRole: RoleId;
  tasks: TaskRowData[];
  issues: IssueRowData[];
  members: { id: string; name: string }[];
}) {
  const fieldFocused = isFieldRole(activeRole);
  const showIssuesTab = canReportIssues(activeRole);
  const canAddTask = canCreateTasks(activeRole);

  const [tab, setTab] = useState<"tasks" | "issues">("tasks");
  const [openOnly, setOpenOnly] = useState(fieldFocused);
  const openIssueCount = issues.filter((i) => i.status !== "COMPLETE").length;

  // Re-derive the "open only" default when the role itself changes (e.g. the
  // user switches roles without leaving this page) — but leave it alone
  // otherwise so a manual toggle survives task status updates re-rendering.
  const [lastRole, setLastRole] = useState(activeRole);
  if (activeRole !== lastRole) {
    setLastRole(activeRole);
    setOpenOnly(isFieldRole(activeRole));
  }

  const visibleTasks = useMemo(
    () => (openOnly ? tasks.filter((t) => t.status !== "COMPLETE") : tasks),
    [tasks, openOnly]
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {showIssuesTab ? (
            <div className="flex gap-1 rounded-lg bg-[var(--color-bg-subtle)] p-1">
              <button
                onClick={() => setTab("tasks")}
                className={clsx(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium",
                  tab === "tasks" ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-[var(--color-text-secondary)]"
                )}
              >
                <CheckSquare size={14} />
                {fieldFocused ? "Today's Tasks" : "Tasks"}
                <span className="text-[11px] text-[var(--color-text-muted)]">{tasks.length}</span>
              </button>
              <button
                onClick={() => setTab("issues")}
                className={clsx(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium",
                  tab === "issues" ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-[var(--color-text-secondary)]"
                )}
              >
                <ShieldQuestion size={14} />
                Issues
                {openIssueCount > 0 && (
                  <span className="rounded-full bg-[var(--color-status-attention-bg)] px-1.5 text-[10.5px] font-semibold text-[var(--color-status-attention)]">
                    {openIssueCount}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <h1 className="text-[15px] font-semibold text-[var(--color-text)]">
              {fieldFocused ? "Today's Tasks" : "Tasks"}
            </h1>
          )}
          {tab === "tasks" && (
            <label className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-[var(--color-border-strong)] accent-[var(--color-primary)]"
              />
              Open only
            </label>
          )}
        </div>

        {tab === "tasks" && canAddTask && (
          <AddButton
            label="Add Task"
            modalTitle="Create Task"
            render={(onDone) => <TaskForm projectId={projectId} members={members} onDone={onDone} />}
          />
        )}
        {tab === "issues" && showIssuesTab && (
          <AddButton
            label="Report Issue"
            modalTitle="Report Issue"
            render={(onDone) => <IssueForm projectId={projectId} onDone={onDone} />}
          />
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
        {tab === "tasks" || !showIssuesTab ? (
          visibleTasks.length === 0 ? (
            <p className="p-6 text-center text-[13px] text-[var(--color-text-muted)]">
              {tasks.length === 0 ? "No tasks yet." : "No open tasks — nice work."}
            </p>
          ) : (
            visibleTasks.map((task) => <TaskRow key={task.id} task={task} projectId={projectId} />)
          )
        ) : issues.length === 0 ? (
          <p className="p-6 text-center text-[13px] text-[var(--color-text-muted)]">
            No issues reported. Nice work.
          </p>
        ) : (
          issues.map((issue) => <IssueRow key={issue.id} issue={issue} projectId={projectId} />)
        )}
      </div>
    </div>
  );
}
