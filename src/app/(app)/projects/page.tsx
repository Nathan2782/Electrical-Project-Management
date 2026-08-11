import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getProjectsForUser } from "@/lib/data";
import { PROJECT_STATUS_LABELS } from "@/lib/status";
import { Users } from "lucide-react";

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "var(--color-status-active)",
  ON_HOLD: "var(--color-status-attention)",
  COMPLETE: "var(--color-status-complete)",
};

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  const projects = await getProjectsForUser(user.id);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-[18px] font-semibold text-[var(--color-text)]">Projects</h1>
        </div>
        <p className="mb-5 text-[13px] text-[var(--color-text-secondary)]">
          {projects.length} project{projects.length === 1 ? "" : "s"} you&rsquo;re assigned to
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}/conversation`}
              className="flex flex-col gap-2.5 rounded-lg border border-[var(--color-border)] bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold text-white"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-semibold text-[var(--color-text)]">
                      {project.name}
                    </p>
                    <p className="truncate text-[12px] text-[var(--color-text-secondary)]">
                      {project.clientName}
                    </p>
                  </div>
                </div>
                {!!project.unreadCount && (
                  <span className="flex h-[20px] min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#E0334F] px-1.5 text-[11px] font-semibold text-white">
                    {project.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--color-text-secondary)]">{project.phase}</span>
                <span
                  className="flex items-center gap-1 font-medium"
                  style={{ color: STATUS_DOT[project.status] ?? STATUS_DOT.ACTIVE }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: STATUS_DOT[project.status] ?? STATUS_DOT.ACTIVE }}
                  />
                  {PROJECT_STATUS_LABELS[project.status] ?? project.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-text-muted)]">
                <Users size={12} />
                {project.memberCount} member{project.memberCount === 1 ? "" : "s"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
