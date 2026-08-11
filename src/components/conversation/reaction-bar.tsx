"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { SmilePlus } from "lucide-react";
import clsx from "clsx";
import { toggleReactionAction } from "@/app/(app)/projects/[projectId]/actions";
import type { ConversationReaction } from "@/components/conversation/types";

const QUICK_EMOJI = ["👍", "✅", "🔧", "⚠️", "👀"];

export function ReactionBar({
  messageId,
  projectId,
  reactions,
}: {
  messageId: string;
  projectId: string;
  reactions: ConversationReaction[];
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function react(emoji: string) {
    startTransition(() => {
      toggleReactionAction(messageId, projectId, emoji);
    });
    setOpen(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          onClick={() => react(r.emoji)}
          className={clsx(
            "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[12px]",
            r.reactedByMe
              ? "border-[var(--color-primary)] bg-[var(--color-primary-tint)]"
              : "border-[var(--color-border)] bg-white hover:bg-[var(--color-bg-subtle)]"
          )}
        >
          <span>{r.emoji}</span>
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{r.count}</span>
        </button>
      ))}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
          title="Add reaction"
        >
          <SmilePlus size={14} />
        </button>
        {open && (
          <div className="absolute bottom-full left-0 z-30 mb-1 flex gap-0.5 rounded-full border border-[var(--color-border)] bg-white p-1 shadow-lg">
            {QUICK_EMOJI.map((emoji) => (
              <button
                key={emoji}
                onClick={() => react(emoji)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[15px] hover:bg-[var(--color-bg-subtle)]"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
