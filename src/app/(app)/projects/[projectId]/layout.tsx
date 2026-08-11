import { notFound } from "next/navigation";
import { getProjectDetail } from "@/lib/data";
import { getActiveRole } from "@/lib/session";
import { ProjectWorkspaceShell } from "@/components/project/project-workspace-shell";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [{ project, openIssues, materialNeeds, pinnedMessages, todayTasks }, activeRole] =
    await Promise.all([getProjectDetail(projectId), getActiveRole()]);

  if (!project) notFound();

  return (
    <ProjectWorkspaceShell
      project={{
        id: project.id,
        name: project.name,
        clientName: project.clientName,
        phase: project.phase,
        status: project.status,
        address: project.address,
      }}
      members={project.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        initials: m.user.initials,
        avatarColor: m.user.avatarColor,
        role: m.user.role,
      }))}
      activeRole={activeRole}
      openIssues={openIssues}
      materialNeeds={materialNeeds}
      pinnedMessages={pinnedMessages.map((m) => ({
        id: m.id,
        body: m.body,
        authorName: m.author.name,
        createdAt: m.createdAt.toISOString(),
      }))}
      todayTasks={todayTasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        assigneeName: t.assignee?.name ?? null,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      }))}
    >
      {children}
    </ProjectWorkspaceShell>
  );
}
