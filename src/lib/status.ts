import { Circle, CircleDot, CheckCircle2, AlertTriangle, OctagonAlert } from "lucide-react";

export type StatusId =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETE"
  | "NEEDS_ATTENTION"
  | "CRITICAL";

export const STATUS_CONFIG: Record<
  StatusId,
  { label: string; color: string; bg: string; icon: typeof Circle }
> = {
  NOT_STARTED: {
    label: "Not Started",
    color: "var(--color-status-notstarted)",
    bg: "var(--color-status-notstarted-bg)",
    icon: Circle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "var(--color-status-active)",
    bg: "var(--color-status-active-bg)",
    icon: CircleDot,
  },
  COMPLETE: {
    label: "Complete",
    color: "var(--color-status-complete)",
    bg: "var(--color-status-complete-bg)",
    icon: CheckCircle2,
  },
  NEEDS_ATTENTION: {
    label: "Needs Attention",
    color: "var(--color-status-attention)",
    bg: "var(--color-status-attention-bg)",
    icon: AlertTriangle,
  },
  CRITICAL: {
    label: "Critical",
    color: "var(--color-status-critical)",
    bg: "var(--color-status-critical-bg)",
    icon: OctagonAlert,
  },
};

export function statusConfig(status: string) {
  return STATUS_CONFIG[status as StatusId] ?? STATUS_CONFIG.NOT_STARTED;
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETE: "Complete",
};
