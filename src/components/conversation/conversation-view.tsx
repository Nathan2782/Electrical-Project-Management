"use client";

import { useRef, useEffect, useMemo } from "react";
import { MarkReadOnMount } from "@/components/conversation/mark-read-on-mount";
import { MessageItem } from "@/components/conversation/message-item";
import { Composer } from "@/components/conversation/composer";
import { formatDayDivider, sameDay } from "@/lib/format";
import type { ConversationMessage } from "@/components/conversation/types";
import type { RoleId } from "@/lib/roles";
import { MessageSquare } from "lucide-react";

export function ConversationView({
  projectId,
  messages,
  activeRole,
  hasUnread,
}: {
  projectId: string;
  messages: ConversationMessage[];
  activeRole: RoleId;
  hasUnread: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const rows = useMemo(() => {
    return messages.reduce<{ message: ConversationMessage; createdAt: Date; showDivider: boolean }[]>(
      (acc, message) => {
        const createdAt = new Date(message.createdAt);
        const previous = acc[acc.length - 1];
        const showDivider = !previous || !sameDay(previous.createdAt, createdAt);
        return [...acc, { message, createdAt, showDivider }];
      },
      []
    );
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <MarkReadOnMount projectId={projectId} hasUnread={hasUnread} />
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-[var(--color-text-muted)]">
            <MessageSquare size={32} className="mb-2 opacity-40" />
            <p className="text-[13.5px]">No messages yet. Start the conversation.</p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col">
            {rows.map(({ message, createdAt, showDivider }) => (
              <div key={message.id}>
                {showDivider && (
                  <div className="my-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[var(--color-border)]" />
                    <span className="text-[11.5px] font-medium text-[var(--color-text-muted)]">
                      {formatDayDivider(createdAt)}
                    </span>
                    <div className="h-px flex-1 bg-[var(--color-border)]" />
                  </div>
                )}
                <MessageItem message={message} projectId={projectId} activeRole={activeRole} />
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <Composer projectId={projectId} />
    </div>
  );
}
