export const ROLES = [
  "FOREMAN",
  "CONTRACTOR",
  "JOURNEYMAN",
  "APPRENTICE",
  "CREW",
] as const;

export type RoleId = (typeof ROLES)[number];

export const ROLE_LABELS: Record<RoleId, string> = {
  FOREMAN: "Foreman / Admin",
  CONTRACTOR: "Electrical Contractor",
  JOURNEYMAN: "Journeyman",
  APPRENTICE: "Apprentice",
  CREW: "Crew Member",
};

export const ROLE_SHORT_LABELS: Record<RoleId, string> = {
  FOREMAN: "Foreman",
  CONTRACTOR: "Contractor",
  JOURNEYMAN: "Journeyman",
  APPRENTICE: "Apprentice",
  CREW: "Crew",
};

/** Only the Foreman/Admin manages official project records (spec section 13). */
export function canManageOfficial(role: RoleId): boolean {
  return role === "FOREMAN";
}

export function isForeman(role: RoleId): boolean {
  return role === "FOREMAN";
}

export function roleLabel(role: string): string {
  return ROLE_LABELS[role as RoleId] ?? role;
}
