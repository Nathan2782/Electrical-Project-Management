"use client";

import { useState, useRef, useTransition } from "react";
import { Send, Paperclip, Camera, Mic } from "lucide-react";
import clsx from "clsx";
import { sendMessageAction } from "@/app/(app)/projects/[projectId]/actions";

export function Composer({
  projectId,
  parentId,
  compact,
  onSent,
}: {
  projectId: string;
  parentId?: string;
  compact?: boolean;
  onSent?: () => void;
}) {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const body = value.trim();
    if (!body || pending) return;
    startTransition(async () => {
      await sendMessageAction(projectId, body, parentId);
      setValue("");
      onSent?.();
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className={clsx("shrink-0 px-3 sm:px-5", compact ? "pb-1" : "pb-3 pt-1")}>
      <div
        className={clsx(
          "mx-auto flex max-w-3xl flex-col rounded-lg border border-[var(--color-border-strong)] bg-white focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]",
          compact ? "px-2.5 py-1.5" : "px-3 py-2"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={parentId ? "Reply..." : "Message the project team..."}
          rows={compact ? 1 : 2}
          className="max-h-40 min-h-[24px] w-full resize-none bg-transparent text-[13.5px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
        />
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Attach file"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
            >
              <Paperclip size={15} />
            </button>
            <button
              type="button"
              title="Add photo"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
            >
              <Camera size={15} />
            </button>
            <button
              type="button"
              title="Voice to text"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
            >
              <Mic size={15} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!value.trim() || pending}
            className="flex h-7 items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 text-[12.5px] font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:bg-[var(--color-border-strong)]"
          >
            <Send size={13} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
