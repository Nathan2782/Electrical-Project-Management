import { db } from "@/lib/db";
import { TaskBoard } from "@/components/tasks/task-board";

export default async function TasksPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [tasks, issues, members] = await Promise.all([
    db.task.findMany({
      where: { projectId },
      include: { assignee: true },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    }),
    db.issue.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } }),
    db.projectMember.findMany({ where: { projectId }, include: { user: true } }),
  ]);

  return (
    <TaskBoard
      projectId={projectId}
      tasks={tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        assigneeName: t.assignee?.name ?? null,
        assigneeInitials: t.assignee?.initials ?? null,
        assigneeColor: t.assignee?.avatarColor ?? null,
        fromMessage: t.fromMessage,
      }))}
      issues={issues.map((i) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        status: i.status,
        severity: i.severity,
        reportedBy: i.reportedBy,
        fromMessage: i.fromMessage,
      }))}
      members={members.map((m) => ({ id: m.user.id, name: m.user.name }))}
    />
  );
}
