"use client";

import Link from "next/link";
import { X, Pin, MapPin } from "lucide-react";
import { PROJECT_STATUS_LABELS, statusConfig } from "@/lib/status";
import { formatRelative } from "@/lib/format";
import type {
  PinnedMessageSummary,
  ProjectMemberSummary,
  ProjectSummary,
  TodayTaskSummary,
} from "@/components/project/project-workspace-shell";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="text-[12.5px] text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-right text-[12.5px] font-medium text-[var(--color-text)]">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--color-border)] px-4 py-3.5">
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function RightPanel({
  project,
  members,
  openIssues,
  materialNeeds,
  pinnedMessages,
  todayTasks,
  onClose,
}: {
  project: ProjectSummary;
  members: ProjectMemberSummary[];
  openIssues: number;
  materialNeeds: number;
  pinnedMessages: PinnedMessageSummary[];
  todayTasks: TodayTaskSummary[];
  onClose: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <h2 className="text-[13px] font-semibold text-[var(--color-text)]">Project Information</h2>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      <Section title="Overview">
        <InfoRow label="Project Status" value={PROJECT_STATUS_LABELS[project.status] ?? project.status} />
        <InfoRow label="Current Phase" value={project.phase} />
        <InfoRow label="Team" value={`${members.length} Members`} />
        {project.address && (
          <div className="mt-1.5 flex items-start gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
            <MapPin size={13} className="mt-0.5 shrink-0" />
            {project.address}
          </div>
        )}
      </Section>

      <Section title="Today's Work">
        {todayTasks.length === 0 ? (
          <p className="text-[12.5px] text-[var(--color-text-muted)]">No open tasks assigned.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todayTasks.map((t) => {
              const cfg = statusConfig(t.status);
              return (
                <li key={t.id} className="flex items-start gap-2">
                  <cfg.icon size={13} className="mt-0.5 shrink-0" style={{ color: cfg.color }} />
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-[var(--color-text)]">
                      {t.title}
                    </p>
                    <p className="truncate text-[11.5px] text-[var(--color-text-secondary)]">
                      {t.assigneeName ?? "Unassigned"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <Link
          href={`/projects/${project.id}/tasks`}
          className="mt-2 inline-block text-[12px] font-medium text-[var(--color-primary)] hover:underline"
        >
          View all tasks →
        </Link>
      </Section>

      <Section title="Open Issues">
        <div className="flex items-center justify-between">
          <span className="text-[24px] font-semibold text-[var(--color-text)]">{openIssues}</span>
          <Link
            href={`/projects/${project.id}/tasks`}
            className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
          >
            Review →
          </Link>
        </div>
      </Section>

      <Section title="Material Needs">
        <div className="flex items-center justify-between">
          <span className="text-[24px] font-semibold text-[var(--color-text)]">{materialNeeds}</span>
          <Link
            href={`/projects/${project.id}/materials`}
            className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
          >
            Review →
          </Link>
        </div>
      </Section>

      <Section title="Important Updates">
        {pinnedMessages.length === 0 ? (
          <p className="text-[12.5px] text-[var(--color-text-muted)]">No pinned updates yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {pinnedMessages.map((m) => (
              <li key={m.id} className="flex gap-2">
                <Pin size={13} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-[12.5px] text-[var(--color-text)]">{m.body}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                    {m.authorName} · {formatRelative(new Date(m.createdAt))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
