"use client";

import { useState } from "react";
import { CheckSquare, ShieldQuestion } from "lucide-react";
import clsx from "clsx";
import { AddButton } from "@/components/ui/add-button";
import { TaskForm } from "@/components/forms/task-form";
import { IssueForm } from "@/components/forms/issue-form";
import { TaskRow, type TaskRowData } from "@/components/tasks/task-row";
import { IssueRow, type IssueRowData } from "@/components/tasks/issue-row";

export function TaskBoard({
  projectId,
  tasks,
  issues,
  members,
}: {
  projectId: string;
  tasks: TaskRowData[];
  issues: IssueRowData[];
  members: { id: string; name: string }[];
}) {
  const [tab, setTab] = useState<"tasks" | "issues">("tasks");
  const openIssueCount = issues.filter((i) => i.status !== "COMPLETE").length;

  return (
    <div className="mx-auto flex max-w-4xl flex-col p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-[var(--color-bg-subtle)] p-1">
          <button
            onClick={() => setTab("tasks")}
            className={clsx(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium",
              tab === "tasks" ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-[var(--color-text-secondary)]"
            )}
          >
            <CheckSquare size={14} />
            Tasks
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

        {tab === "tasks" ? (
          <AddButton
            label="Add Task"
            modalTitle="Create Task"
            render={(onDone) => <TaskForm projectId={projectId} members={members} onDone={onDone} />}
          />
        ) : (
          <AddButton
            label="Report Issue"
            modalTitle="Report Issue"
            render={(onDone) => <IssueForm projectId={projectId} onDone={onDone} />}
          />
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
        {tab === "tasks" ? (
          tasks.length === 0 ? (
            <p className="p-6 text-center text-[13px] text-[var(--color-text-muted)]">
              No tasks yet. Add the first one.
            </p>
          ) : (
            tasks.map((task) => <TaskRow key={task.id} task={task} projectId={projectId} />)
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
