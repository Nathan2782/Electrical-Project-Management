import { getCurrentUser, getActiveRole } from "@/lib/session";
import { getProjectsForUser, getUnreadNotificationCount } from "@/lib/data";
import { AppShell } from "@/components/shell/app-shell";

// Every route in this group reads live DB state and the role-preview cookie
// on each request — never prerender it at build time.
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const [activeRole, projects, unreadNotifCount] = await Promise.all([
    getActiveRole(),
    getProjectsForUser(user.id),
    getUnreadNotificationCount(user.id),
  ]);

  return (
    <AppShell
      currentUser={{
        id: user.id,
        name: user.name,
        initials: user.initials,
        avatarColor: user.avatarColor,
        email: user.email,
      }}
      activeRole={activeRole}
      projects={projects.map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        unreadCount: p.unreadCount,
      }))}
      unreadNotifCount={unreadNotifCount}
    >
      {children}
    </AppShell>
  );
}
