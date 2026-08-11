import { db } from "@/lib/db";

export async function getProjectsForUser(userId: string) {
  const memberships = await db.projectMember.findMany({
    where: { userId },
    include: {
      project: {
        include: { _count: { select: { members: true } } },
      },
    },
    orderBy: { project: { createdAt: "asc" } },
  });
  return memberships.map((m) => ({
    ...m.project,
    memberCount: m.project._count.members,
    unreadCount: m.unreadCount,
  }));
}

export async function getProjectWorkspace(projectId: string) {
  return db.project.findUnique({
    where: { id: projectId },
    include: {
      members: { include: { user: true } },
      _count: {
        select: {
          tasks: true,
          materials: true,
          safetyItems: true,
        },
      },
    },
  });
}

export async function getProjectDetail(projectId: string) {
  const [project, openIssues, materialNeeds, pinnedMessages, todayTasks] = await Promise.all([
    db.project.findUnique({
      where: { id: projectId },
      include: { members: { include: { user: true } } },
    }),
    db.issue.count({ where: { projectId, status: { not: "COMPLETE" } } }),
    db.materialItem.count({ where: { projectId, status: { not: "COMPLETE" } } }),
    db.message.findMany({
      where: { projectId, pinned: true },
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.task.findMany({
      where: { projectId, status: { not: "COMPLETE" } },
      include: { assignee: true },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
  ]);
  return { project, openIssues, materialNeeds, pinnedMessages, todayTasks };
}

export async function getMyOpenTasks(userId: string) {
  return db.task.findMany({
    where: { assigneeId: userId, status: { not: "COMPLETE" } },
    include: { project: true },
    orderBy: { dueDate: "asc" },
    take: 8,
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return db.notification.count({ where: { userId, read: false } });
}

export async function getNotificationsForUser(userId: string) {
  return db.notification.findMany({
    where: { userId },
    include: { project: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getTotalUnreadForUser(userId: string) {
  const memberships = await db.projectMember.findMany({
    where: { userId },
    select: { unreadCount: true },
  });
  return memberships.reduce((sum, m) => sum + m.unreadCount, 0);
}
