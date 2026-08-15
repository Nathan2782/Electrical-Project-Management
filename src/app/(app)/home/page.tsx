import Link from "next/link";
import { getCurrentUser, getActiveRole } from "@/lib/session";
import { getProjectsForUser, getMyOpenTasks, getNotificationsForUser } from "@/lib/data";
import { ROLE_DASHBOARD_QUESTION, isFieldRole } from "@/lib/roles";
import { primarySectionsForRole } from "@/lib/nav";
import { statusConfig } from "@/lib/status";
import { formatRelative, formatShortDate } from "@/lib/format";
import { ArrowRight, Users } from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();
  const [activeRole, projects, myTasks, notifications] = await Promise.all([
    getActiveRole(),
    getProjectsForUser(user.id),
    getMyOpenTasks(user.id),
    getNotificationsForUser(user.id),
  ]);

  const firstName = user.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const recentUpdates = notifications.slice(0, 5);
  const fieldFocused = isFieldRole(activeRole);
  const quickLinks = projects.length > 0 ? primarySectionsForRole(activeRole) : [];

  const tasksSection = (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[12px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          {fieldFocused ? "Today's Tasks" : "Your Open Tasks"}
        </h2>
      </div>
      <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
        {myTasks.length === 0 ? (
          <p className="p-5 text-center text-[13px] text-[var(--color-text-muted)]">
            Nothing assigned to you right now.
          </p>
        ) : (
          myTasks.map((task) => {
            const cfg = statusConfig(task.status);
            return (
              <Link
                key={task.id}
                href={`/projects/${task.projectId}/tasks`}
                className="flex items-start gap-2.5 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0 hover:bg-[var(--color-bg-subtle)]"
              >
                <cfg.icon size={15} className="mt-0.5 shrink-0" style={{ color: cfg.color }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-[var(--color-text)]">{task.title}</p>
                  <p className="truncate text-[11.5px] text-[var(--color-text-secondary)]">
                    {task.project.name}
                    {task.dueDate && ` · Due ${formatShortDate(task.dueDate)}`}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );

  const updatesSection = (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[12px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Recent Updates
        </h2>
        <Link
          href="/notifications"
          className="flex items-center gap-0.5 text-[12px] font-medium text-[var(--color-primary)] hover:underline"
        >
          All <ArrowRight size={12} />
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
        {recentUpdates.length === 0 ? (
          <p className="p-5 text-center text-[13px] text-[var(--color-text-muted)]">
            You&rsquo;re all caught up.
          </p>
        ) : (
          recentUpdates.map((n) => (
            <Link
              key={n.id}
              href={n.projectId ? `/projects/${n.projectId}/conversation` : "/notifications"}
              className="flex items-start gap-2.5 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0 hover:bg-[var(--color-bg-subtle)]"
            >
              {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />}
              <div className={n.read ? "min-w-0 flex-1 pl-3.5" : "min-w-0 flex-1"}>
                <p className="truncate text-[13px] font-medium text-[var(--color-text)]">{n.title}</p>
                <p className="truncate text-[12px] text-[var(--color-text-secondary)]">{n.body}</p>
                <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                  {n.project?.name ?? "Workspace"} · {formatRelative(n.createdAt)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );

  const projectsSection = (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[12px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Your Projects
        </h2>
      </div>
      <div className={fieldFocused ? "flex flex-col gap-2" : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}/conversation`}
            className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-white p-3.5 hover:border-[var(--color-primary)]"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-white"
              style={{ backgroundColor: project.color }}
            >
              {project.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[var(--color-text)]">{project.name}</p>
              <p className="truncate text-[11.5px] text-[var(--color-text-secondary)]">{project.phase}</p>
            </div>
            {!fieldFocused && (
              <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
                <Users size={12} />
                {project.memberCount}
              </span>
            )}
            {!!project.unreadCount && (
              <span className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[#E0334F] px-1 text-[10.5px] font-semibold text-white">
                {project.unreadCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <h1 className="text-[19px] font-semibold text-[var(--color-text)]">
          {greeting}, {firstName}
        </h1>
        <p className="mb-5 text-[13px] text-[var(--color-text-secondary)]">
          {ROLE_DASHBOARD_QUESTION[activeRole]}
        </p>

        {quickLinks.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Jump back in
            </h2>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={`/projects/${projects[0].id}/${link.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {fieldFocused ? (
          <div className="flex flex-col gap-6">
            {tasksSection}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {updatesSection}
              {projectsSection}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {tasksSection}
              {updatesSection}
            </div>
            {projectsSection}
          </div>
        )}
      </div>
    </div>
  );
}
