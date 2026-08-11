"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pin, Reply, Image as ImageIcon, Paperclip, CheckSquare, Boxes, ShieldAlert } from "lucide-react";
import clsx from "clsx";
import { formatMessageTimestamp } from "@/lib/format";
import { roleLabel, isForeman, type RoleId } from "@/lib/roles";
import { ReactionBar } from "@/components/conversation/reaction-bar";
import { ConvertMenu } from "@/components/conversation/convert-menu";
import { Composer } from "@/components/conversation/composer";
import { togglePinMessageAction } from "@/app/(app)/projects/[projectId]/actions";
import type { ConversationMessage, ConversationReply } from "@/components/conversation/types";

const CONVERTED_META: Record<string, { label: string; icon: typeof CheckSquare; href: (id: string) => string }> = {
  task: { label: "Converted to Task", icon: CheckSquare, href: (id) => `/projects/${id}/tasks` },
  material: { label: "Converted to Material Request", icon: Boxes, href: (id) => `/projects/${id}/materials` },
  issue: { label: "Converted to Issue", icon: ShieldAlert, href: (id) => `/projects/${id}/tasks` },
};

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[12px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

function AttachmentChip({ type, name }: { type: string; name: string }) {
  const Icon = type === "photo" ? ImageIcon : Paperclip;
  return (
    <div className="mt-1.5 flex w-fit items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2.5 py-2">
      <Icon size={15} className="text-[var(--color-text-secondary)]" />
      <span className="text-[12.5px] text-[var(--color-text)]">{name}</span>
    </div>
  );
}

export function MessageItem({
  message,
  projectId,
  activeRole,
}: {
  message: ConversationMessage;
  projectId: string;
  activeRole: RoleId;
}) {
  const [showReply, setShowReply] = useState(false);
  const [pending, startTransition] = useTransition();
  const foreman = isForeman(activeRole);
  const converted = message.convertedTo ? CONVERTED_META[message.convertedTo] : null;

  function togglePin() {
    startTransition(() => togglePinMessageAction(message.id, projectId, !message.pinned));
  }

  return (
    <div className="group flex gap-3 rounded-md px-2 py-2 hover:bg-[var(--color-bg-subtle)]/60">
      <Avatar initials={message.author.initials} color={message.author.avatarColor} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-[13.5px] font-semibold text-[var(--color-text)]">{message.author.name}</span>
          <span className="text-[11.5px] text-[var(--color-text-muted)]">· {roleLabel(message.author.role)}</span>
          <span className="text-[11px] text-[var(--color-text-muted)]">
            {formatMessageTimestamp(new Date(message.createdAt))}
          </span>
          {message.pinned && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-primary)]">
              <Pin size={11} /> Pinned
            </span>
          )}
        </div>

        <p className="mt-0.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-[var(--color-text)]">
          {message.body}
        </p>

        {message.attachmentType && message.attachmentName && (
          <AttachmentChip type={message.attachmentType} name={message.attachmentName} />
        )}

        {converted && (
          <Link
            href={converted.href(projectId)}
            className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-status-complete-bg)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--color-status-complete)] hover:underline"
          >
            <converted.icon size={12} />
            {converted.label}
          </Link>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <ReactionBar messageId={message.id} projectId={projectId} reactions={message.reactions} />
          <button
            onClick={() => setShowReply((v) => !v)}
            className="flex items-center gap-1 text-[11.5px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          >
            <Reply size={13} />
            Reply{message.replies.length > 0 && ` (${message.replies.length})`}
          </button>
          {foreman && !converted && <ConvertMenu messageId={message.id} projectId={projectId} />}
          {foreman && (
            <button
              onClick={togglePin}
              disabled={pending}
              className={clsx(
                "flex items-center gap-1 text-[11.5px] font-medium hover:text-[var(--color-primary)] disabled:opacity-50",
                message.pinned ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              <Pin size={13} />
              {message.pinned ? "Unpin" : "Pin"}
            </button>
          )}
        </div>

        {message.replies.length > 0 && (
          <div className="mt-2.5 flex flex-col gap-2.5 border-l-2 border-[var(--color-border)] pl-3">
            {message.replies.map((reply) => (
              <ReplyItem key={reply.id} reply={reply} projectId={projectId} />
            ))}
          </div>
        )}

        {showReply && (
          <div className="mt-2">
            <Composer projectId={projectId} parentId={message.id} compact onSent={() => setShowReply(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyItem({ reply, projectId }: { reply: ConversationReply; projectId: string }) {
  return (
    <div className="flex gap-2.5">
      <Avatar initials={reply.author.initials} color={reply.author.avatarColor} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-[12.5px] font-semibold text-[var(--color-text)]">{reply.author.name}</span>
          <span className="text-[11px] text-[var(--color-text-muted)]">
            {formatMessageTimestamp(new Date(reply.createdAt))}
          </span>
        </div>
        <p className="mt-0.5 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--color-text)]">
          {reply.body}
        </p>
        <div className="mt-1">
          <ReactionBar messageId={reply.id} projectId={projectId} reactions={reply.reactions} />
        </div>
      </div>
    </div>
  );
}
