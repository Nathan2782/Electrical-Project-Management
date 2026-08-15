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

/** Journeyman/Apprentice/Crew are field-execution roles — their Home and Tasks
 * views lead with "what needs doing" rather than cross-project management. */
export function isFieldRole(role: RoleId): boolean {
  return role === "JOURNEYMAN" || role === "APPRENTICE" || role === "CREW";
}

/** Only the Foreman creates tasks (spec section 23) — everyone else completes
 * what's assigned to them via the status control on each task row. */
export function canCreateTasks(role: RoleId): boolean {
  return isForeman(role);
}

/** Every role except Apprentice can report a project issue (spec section 23) —
 * kept simple for apprentices, who ask questions in conversation instead. */
export function canReportIssues(role: RoleId): boolean {
  return role !== "APPRENTICE";
}

/** The guiding question each role's dashboard answers (spec section 23). */
export const ROLE_DASHBOARD_QUESTION: Record<RoleId, string> = {
  FOREMAN: "What is happening across my projects?",
  CONTRACTOR: "How are my projects and crews progressing?",
  JOURNEYMAN: "What work needs to get done?",
  APPRENTICE: "What am I supposed to do and who can I ask?",
  CREW: "What is my crew working on and what do I need to complete?",
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role as RoleId] ?? role;
}
