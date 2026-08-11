"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markConversationReadAction } from "@/app/(app)/projects/[projectId]/actions";

export function MarkReadOnMount({ projectId, hasUnread }: { projectId: string; hasUnread: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!hasUnread) return;
    markConversationReadAction(projectId).then(() => router.refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return null;
}
