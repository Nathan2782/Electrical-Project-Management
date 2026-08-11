import { getCurrentUser } from "@/lib/session";
import { getNotificationsForUser } from "@/lib/data";
import { NotificationsList } from "@/components/notifications/notifications-list";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  const notifications = await getNotificationsForUser(user.id);

  return (
    <NotificationsList
      notifications={notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
        projectId: n.projectId,
        projectName: n.project?.name ?? null,
      }))}
    />
  );
}
