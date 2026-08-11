import { db } from "@/lib/db";
import { getCurrentUser, getActiveRole } from "@/lib/session";
import { ConversationView } from "@/components/conversation/conversation-view";
import type { ConversationMessage } from "@/components/conversation/types";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const user = await getCurrentUser();
  const [activeRole, messages, membership] = await Promise.all([
    getActiveRole(),
    db.message.findMany({
      where: { projectId, parentId: null },
      include: {
        author: true,
        reactions: { include: { user: true } },
        replies: {
          include: { author: true, reactions: { include: { user: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.projectMember.findFirst({ where: { projectId, userId: user.id } }),
  ]);

  function groupReactions(reactions: { emoji: string; userId: string }[]) {
    const map = new Map<string, { emoji: string; count: number; reactedByMe: boolean }>();
    for (const r of reactions) {
      const entry = map.get(r.emoji) ?? { emoji: r.emoji, count: 0, reactedByMe: false };
      entry.count += 1;
      if (r.userId === user.id) entry.reactedByMe = true;
      map.set(r.emoji, entry);
    }
    return Array.from(map.values());
  }

  const formatted: ConversationMessage[] = messages.map((m) => ({
    id: m.id,
    body: m.body,
    author: {
      id: m.author.id,
      name: m.author.name,
      initials: m.author.initials,
      avatarColor: m.author.avatarColor,
      role: m.author.role,
    },
    createdAt: m.createdAt.toISOString(),
    attachmentType: m.attachmentType,
    attachmentName: m.attachmentName,
    convertedTo: m.convertedTo,
    convertedRefId: m.convertedRefId,
    pinned: m.pinned,
    reactions: groupReactions(m.reactions),
    replies: m.replies.map((r) => ({
      id: r.id,
      body: r.body,
      author: {
        id: r.author.id,
        name: r.author.name,
        initials: r.author.initials,
        avatarColor: r.author.avatarColor,
        role: r.author.role,
      },
      createdAt: r.createdAt.toISOString(),
      reactions: groupReactions(r.reactions),
    })),
  }));

  return (
    <ConversationView
      projectId={projectId}
      messages={formatted}
      activeRole={activeRole}
      hasUnread={(membership?.unreadCount ?? 0) > 0}
    />
  );
}
