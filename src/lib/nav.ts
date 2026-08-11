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
  type LucideIcon,
} from "lucide-react";

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
