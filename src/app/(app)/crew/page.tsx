import { getCurrentUser, getActiveRole } from "@/lib/session";
import { getCrewRoster } from "@/lib/data";
import { isForeman } from "@/lib/roles";
import { CrewRoster } from "@/components/crew/crew-roster";

export default async function CrewPage() {
  const user = await getCurrentUser();
  const [activeRole, { users, projects }] = await Promise.all([
    getActiveRole(),
    getCrewRoster(user.organizationId),
  ]);

  return (
    <div className="h-full overflow-y-auto">
      <CrewRoster
        canManage={isForeman(activeRole)}
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          initials: u.initials,
          avatarColor: u.avatarColor,
          projectIds: u.memberships.map((m) => m.projectId),
        }))}
        projects={projects}
      />
    </div>
  );
}
