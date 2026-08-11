import { statusConfig } from "@/lib/status";

export function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig(status);
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon size={12} strokeWidth={2.4} />
      {cfg.label}
    </span>
  );
}
