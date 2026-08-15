"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser, getActiveRole } from "@/lib/session";
import { isForeman, type RoleId } from "@/lib/roles";

const AVATAR_COLORS = ["#1264A3", "#8B5CF6", "#059669", "#D97706", "#DB2777", "#0EA5A5", "#DC2626"];

async function requireForeman(): Promise<RoleId> {
  const role = await getActiveRole();
  if (!isForeman(role)) throw new Error("Only the Foreman/Admin can manage crew.");
  return role;
}

export async function addCrewMemberAction(data: { name: string; email: string; role: string }) {
  if (!data.name.trim() || !data.email.trim()) return;
  await requireForeman();
  const me = await getCurrentUser();
  const initials = data.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  await db.user.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      initials: initials || "?",
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      organizationId: me.organizationId,
    },
  });
  revalidatePath("/crew");
}

export async function assignCrewToProjectAction(userId: string, projectId: string, assign: boolean) {
  await requireForeman();
  if (assign) {
    await db.projectMember.upsert({
      where: { projectId_userId: { projectId, userId } },
      create: { projectId, userId },
      update: {},
    });
  } else {
    await db.projectMember.deleteMany({ where: { projectId, userId } });
  }
  revalidatePath("/crew");
  revalidatePath(`/projects/${projectId}`, "layout");
}
