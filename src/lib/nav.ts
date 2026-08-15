import {
  MessageSquare,
  FileStack,
  Boxes,
  CheckSquare,
  Camera,
  FolderOpen,
  ClipboardList,
  NotebookPen,
  ShieldAlert,
  Ruler,
  BookMarked,
  Megaphone,
  HelpCircle,
  ScanSearch,
  ShieldQuestion,
  type LucideIcon,
} from "lucide-react";
import type { RoleId } from "@/lib/roles";

export type ProjectSection = {
  slug: string;
  label: string;
  icon: LucideIcon;
};

/** Primary tabs shown directly in the project secondary nav (spec section 9). */
export const PRIMARY_SECTIONS: ProjectSection[] = [
  { slug: "conversation", label: "Conversation", icon: MessageSquare },
  { slug: "prints", label: "Prints", icon: FileStack },
  { slug: "materials", label: "Notes & Materials", icon: Boxes },
  { slug: "tasks", label: "Tasks", icon: CheckSquare },
  { slug: "photos", label: "Photos", icon: Camera },
  { slug: "documents", label: "Documents", icon: FolderOpen },
];

/** Secondary tools tucked behind the project's More menu (spec section 9). */
export const MORE_SECTIONS: ProjectSection[] = [
  { slug: "checklists", label: "Checklists", icon: ClipboardList },
  { slug: "daily-logs", label: "Daily Logs", icon: NotebookPen },
  { slug: "inspections", label: "Inspections", icon: FileStack },
  { slug: "safety", label: "Safety", icon: ShieldAlert },
  { slug: "measurements", label: "Measurements", icon: Ruler },
  { slug: "references", label: "References", icon: BookMarked },
];

export const ALL_SECTIONS = [...PRIMARY_SECTIONS, ...MORE_SECTIONS];

/** Sidebar quick-expand items shown under each project (spec section 4). */
export const SIDEBAR_PROJECT_SECTIONS = PRIMARY_SECTIONS.filter((s) =>
  ["conversation", "prints", "materials", "tasks", "photos"].includes(s.slug)
);

export function sectionBySlug(slug: string): ProjectSection | undefined {
  return ALL_SECTIONS.find((s) => s.slug === slug);
}

/**
 * Which project tabs lead the secondary nav for each role, and in what order
 * (spec section 23's "For example" role nav lists). Everything else stays
 * reachable through the More menu — roles change what's prioritized, not
 * what's accessible, since nothing here is a hard access restriction.
 */
export const ROLE_PRIMARY_SECTION_SLUGS: Record<RoleId, string[]> = {
  FOREMAN: ["conversation", "prints", "documents", "materials", "tasks"],
  CONTRACTOR: ["conversation", "tasks", "materials", "photos"],
  JOURNEYMAN: ["conversation", "prints", "materials", "tasks", "photos"],
  APPRENTICE: ["conversation", "tasks", "materials", "prints", "photos"],
  CREW: ["conversation", "tasks", "materials", "photos"],
};

export function primarySectionsForRole(role: RoleId): ProjectSection[] {
  const slugs = ROLE_PRIMARY_SECTION_SLUGS[role];
  return slugs.map((slug) => sectionBySlug(slug)!).filter(Boolean);
}

export function moreSectionsForRole(role: RoleId): ProjectSection[] {
  const primarySlugs = new Set(ROLE_PRIMARY_SECTION_SLUGS[role]);
  return ALL_SECTIONS.filter((s) => !primarySlugs.has(s.slug));
}

/* -------------------- Quick actions -------------------- */

export type QuickActionKey =
  | "update"
  | "question"
  | "task"
  | "material"
  | "identify-material"
  | "photo"
  | "note"
  | "measurement"
  | "issue"
  | "safety";

export type QuickAction = { key: QuickActionKey; label: string; icon: LucideIcon };

export const QUICK_ACTIONS: QuickAction[] = [
  { key: "update", label: "Post Update", icon: Megaphone },
  { key: "question", label: "Ask Question", icon: HelpCircle },
  { key: "task", label: "Create Task", icon: CheckSquare },
  { key: "material", label: "Add Material", icon: Boxes },
  { key: "identify-material", label: "Identify Material", icon: ScanSearch },
  { key: "photo", label: "Take Photo", icon: Camera },
  { key: "note", label: "Add Note", icon: NotebookPen },
  { key: "measurement", label: "Add Measurement", icon: Ruler },
  { key: "issue", label: "Report Issue", icon: ShieldQuestion },
  { key: "safety", label: "Report Safety Issue", icon: ShieldAlert },
];

/**
 * Which quick actions each role gets, per their allowed capabilities in spec
 * section 23. "safety" is deliberately granted to every role regardless of
 * this list — hazard reporting is never something a jobsite app should gate
 * behind role, so it's added back in `quickActionsForRole` below.
 */
const ROLE_QUICK_ACTION_KEYS: Record<RoleId, QuickActionKey[]> = {
  FOREMAN: ["update", "question", "task", "material", "identify-material", "photo", "note", "measurement", "issue", "safety"],
  CONTRACTOR: ["update", "question", "material", "photo", "issue"],
  JOURNEYMAN: ["update", "question", "material", "photo", "measurement", "issue"],
  APPRENTICE: ["question", "update", "material", "photo"],
  CREW: ["update", "question", "material", "photo", "issue"],
};

export function quickActionsForRole(role: RoleId): QuickAction[] {
  const keys = new Set(ROLE_QUICK_ACTION_KEYS[role]);
  keys.add("safety");
  return QUICK_ACTIONS.filter((a) => keys.has(a.key));
}
