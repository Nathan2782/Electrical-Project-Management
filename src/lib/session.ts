import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { ROLES, type RoleId } from "@/lib/roles";

const ACTIVE_ROLE_COOKIE = "voltline_active_role";

/**
 * Single-tenant demo session: the signed-in person is always the seeded
 * Foreman account, but the profile menu lets them preview the workspace
 * as any role (spec section 12). The cookie stores that preview role.
 */
export async function getCurrentUser() {
  const user = await db.user.findFirst({
    orderBy: { createdAt: "asc" },
    include: { organization: true },
  });
  if (!user) throw new Error("No seeded user found. Run `npm run db:seed`.");
  return user;
}

export async function getActiveRole(): Promise<RoleId> {
  const store = await cookies();
  const value = store.get(ACTIVE_ROLE_COOKIE)?.value;
  if (value && (ROLES as readonly string[]).includes(value)) return value as RoleId;
  const user = await getCurrentUser();
  return (user.role as RoleId) ?? "FOREMAN";
}

export async function setActiveRole(role: RoleId) {
  const store = await cookies();
  store.set(ACTIVE_ROLE_COOKIE, role, { path: "/", maxAge: 60 * 60 * 24 * 365 });
}
