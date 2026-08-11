"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, Boxes, ShieldAlert, Megaphone, CheckSquare, FileStack } from "lucide-react";
import clsx from "clsx";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/(app)/actions";
import { formatRelative } from "@/lib/format";

const TYPE_ICON: Record<string, typeof Bell> = {
  message: MessageSquare,
  material: Boxes,
  safety: ShieldAlert,
  update: Megaphone,
  task: CheckSquare,
  inspection: FileStack,
};

type NotificationData = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  projectId: string | null;
  projectName: string | null;
};

export function NotificationsList({ notifications }: { notifications: NotificationData[] }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAll() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      router.refresh();
    });
  }

  function markOne(id: string) {
    startTransition(async () => {
      await markNotificationReadAction(id);
      router.refresh();
    });
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-[16px] font-semibold text-[var(--color-text)]">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAll}
              disabled={pending}
              className="text-[12.5px] font-medium text-[var(--color-primary)] hover:underline disabled:opacity-50"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center pt-14 text-center text-[var(--color-text-muted)]">
            <Bell size={28} className="mb-2 opacity-40" />
            <p className="text-[13px]">You&rsquo;re all caught up.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
            {notifications.map((n) => {
              const Icon = TYPE_ICON[n.type] ?? Bell;
              return (
                <Link
                  key={n.id}
                  href={n.projectId ? `/projects/${n.projectId}/conversation` : "/notifications"}
                  onClick={() => !n.read && markOne(n.id)}
                  className={clsx(
                    "flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0 hover:bg-[var(--color-bg-subtle)]",
                    !n.read && "bg-[var(--color-primary-tint)]/40"
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-subtle)]">
                    <Icon size={15} className="text-[var(--color-text-secondary)]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-[var(--color-text)]">{n.title}</p>
                    <p className="line-clamp-2 text-[12.5px] text-[var(--color-text-secondary)]">{n.body}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                      {n.projectName ?? "Workspace"} · {formatRelative(new Date(n.createdAt))}
                    </p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
