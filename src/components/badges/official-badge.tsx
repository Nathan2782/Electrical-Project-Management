import { BadgeCheck } from "lucide-react";

export function OfficialBadge({ compact }: { compact?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-tint)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--color-primary)]"
      title="Official project record"
    >
      <BadgeCheck size={12} strokeWidth={2.4} />
      {!compact && "Official"}
    </span>
  );
}
