"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser, setActiveRole } from "@/lib/session";
import type { RoleId } from "@/lib/roles";

export async function switchRoleAction(role: RoleId) {
  await setActiveRole(role);
  revalidatePath("/", "layout");
}

export async function markAllNotificationsReadAction() {
  const user = await getCurrentUser();
  await db.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/", "layout");
}

export async function markNotificationReadAction(notificationId: string) {
  const user = await getCurrentUser();
  await db.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { read: true },
  });
  revalidatePath("/", "layout");
}
