"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

function refresh(projectId: string) {
  revalidatePath(`/projects/${projectId}`, "layout");
  revalidatePath("/home");
  revalidatePath("/notifications");
}

// ---------- Conversation ----------

export async function sendMessageAction(
  projectId: string,
  body: string,
  parentId?: string
) {
  if (!body.trim()) return;
  const user = await getCurrentUser();
  await db.message.create({
    data: { projectId, authorId: user.id, body: body.trim(), parentId: parentId || null },
  });
  await db.projectMember.updateMany({
    where: { projectId, userId: { not: user.id } },
    data: { unreadCount: { increment: 1 } },
  });
  refresh(projectId);
}

export async function toggleReactionAction(messageId: string, projectId: string, emoji: string) {
  const user = await getCurrentUser();
  const existing = await db.reaction.findUnique({
    where: { messageId_userId_emoji: { messageId, userId: user.id, emoji } },
  });
  if (existing) {
    await db.reaction.delete({ where: { id: existing.id } });
  } else {
    await db.reaction.create({ data: { messageId, userId: user.id, emoji } });
  }
  refresh(projectId);
}

export async function togglePinMessageAction(messageId: string, projectId: string, pinned: boolean) {
  await db.message.update({ where: { id: messageId }, data: { pinned } });
  refresh(projectId);
}

export async function markConversationReadAction(projectId: string) {
  const user = await getCurrentUser();
  await db.projectMember.updateMany({
    where: { projectId, userId: user.id },
    data: { unreadCount: 0 },
  });
}

// ---------- Message → Action conversion ----------

export async function convertMessageToTaskAction(messageId: string, projectId: string) {
  const user = await getCurrentUser();
  const message = await db.message.findUnique({ where: { id: messageId }, include: { author: true } });
  if (!message) return;
  const task = await db.task.create({
    data: {
      projectId,
      title: message.body.length > 120 ? message.body.slice(0, 117) + "..." : message.body,
      description: `Converted from a message by ${message.author.name}.`,
      creatorId: user.id,
      fromMessage: true,
      official: true,
    },
  });
  await db.message.update({
    where: { id: messageId },
    data: { convertedTo: "task", convertedRefId: task.id },
  });
  refresh(projectId);
}

export async function convertMessageToMaterialAction(messageId: string, projectId: string) {
  const message = await db.message.findUnique({ where: { id: messageId }, include: { author: true } });
  if (!message) return;
  const material = await db.materialItem.create({
    data: {
      projectId,
      name: message.body.length > 120 ? message.body.slice(0, 117) + "..." : message.body,
      quantity: "See message",
      requestedBy: message.author.name,
      fromMessage: true,
      official: true,
    },
  });
  await db.message.update({
    where: { id: messageId },
    data: { convertedTo: "material", convertedRefId: material.id },
  });
  refresh(projectId);
}

export async function convertMessageToIssueAction(messageId: string, projectId: string) {
  const message = await db.message.findUnique({ where: { id: messageId }, include: { author: true } });
  if (!message) return;
  const issue = await db.issue.create({
    data: {
      projectId,
      title: message.body.length > 120 ? message.body.slice(0, 117) + "..." : message.body,
      reportedBy: message.author.name,
      fromMessage: true,
      official: true,
    },
  });
  await db.message.update({
    where: { id: messageId },
    data: { convertedTo: "issue", convertedRefId: issue.id },
  });
  refresh(projectId);
}

// ---------- Tasks ----------

export async function createTaskAction(
  projectId: string,
  data: { title: string; description?: string; assigneeId?: string; dueDate?: string }
) {
  if (!data.title.trim()) return;
  const user = await getCurrentUser();
  await db.task.create({
    data: {
      projectId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      assigneeId: data.assigneeId || null,
      creatorId: user.id,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      official: true,
    },
  });
  refresh(projectId);
}

export async function updateTaskStatusAction(taskId: string, projectId: string, status: string) {
  await db.task.update({ where: { id: taskId }, data: { status } });
  refresh(projectId);
}

// ---------- Materials ----------

export async function createMaterialAction(
  projectId: string,
  data: { name: string; quantity: string; notes?: string }
) {
  if (!data.name.trim()) return;
  const user = await getCurrentUser();
  await db.materialItem.create({
    data: {
      projectId,
      name: data.name.trim(),
      quantity: data.quantity.trim() || "1",
      notes: data.notes?.trim() || null,
      requestedBy: user.name,
      official: true,
    },
  });
  refresh(projectId);
}

export async function updateMaterialStatusAction(materialId: string, projectId: string, status: string) {
  await db.materialItem.update({ where: { id: materialId }, data: { status } });
  refresh(projectId);
}

// ---------- Notes ----------

export async function createNoteAction(
  projectId: string,
  data: { title: string; body: string; official: boolean }
) {
  if (!data.title.trim()) return;
  const user = await getCurrentUser();
  await db.note.create({
    data: {
      projectId,
      title: data.title.trim(),
      body: data.body.trim(),
      official: data.official,
      authorName: user.name,
    },
  });
  refresh(projectId);
}

// ---------- Documents / Prints / Photos (metadata only — no file storage configured) ----------

export async function addDocumentAction(
  projectId: string,
  data: { name: string; fileType: string }
) {
  if (!data.name.trim()) return;
  const user = await getCurrentUser();
  await db.document.create({
    data: {
      projectId,
      name: data.name.trim(),
      fileType: data.fileType.trim() || "FILE",
      size: "—",
      official: true,
      uploadedBy: user.name,
    },
  });
  refresh(projectId);
}

export async function addPrintAction(
  projectId: string,
  data: { name: string; sheetNo: string; discipline: string }
) {
  if (!data.name.trim()) return;
  const user = await getCurrentUser();
  await db.print.create({
    data: {
      projectId,
      name: data.name.trim(),
      sheetNo: data.sheetNo.trim() || "—",
      revision: "Rev A",
      discipline: data.discipline.trim() || "Electrical",
      uploadedBy: user.name,
    },
  });
  refresh(projectId);
}

export async function addPhotoAction(projectId: string, data: { caption: string }) {
  const user = await getCurrentUser();
  const colors = ["#1264A3", "#059669", "#D97706", "#8B5CF6", "#DB2777"];
  await db.photo.create({
    data: {
      projectId,
      caption: data.caption.trim() || "Field photo",
      color: colors[Math.floor(Math.random() * colors.length)],
      uploaderId: user.id,
    },
  });
  refresh(projectId);
}

// ---------- Checklists ----------

export async function toggleChecklistItemAction(itemId: string, projectId: string, done: boolean) {
  await db.checklistItem.update({ where: { id: itemId }, data: { done } });
  refresh(projectId);
}

// ---------- Daily Logs ----------

export async function createDailyLogAction(
  projectId: string,
  data: { summary: string; crewCount: number; weather?: string }
) {
  if (!data.summary.trim()) return;
  const user = await getCurrentUser();
  await db.dailyLog.create({
    data: {
      projectId,
      date: new Date(),
      summary: data.summary.trim(),
      crewCount: data.crewCount || 1,
      weather: data.weather?.trim() || null,
      author: user.name,
    },
  });
  refresh(projectId);
}

// ---------- Measurements ----------

export async function createMeasurementAction(
  projectId: string,
  data: { label: string; value: string; location?: string }
) {
  if (!data.label.trim() || !data.value.trim()) return;
  await db.measurement.create({
    data: {
      projectId,
      label: data.label.trim(),
      value: data.value.trim(),
      location: data.location?.trim() || null,
    },
  });
  refresh(projectId);
}

// ---------- Inspections ----------

export async function updateInspectionStatusAction(
  inspectionId: string,
  projectId: string,
  status: string
) {
  await db.inspection.update({ where: { id: inspectionId }, data: { status } });
  refresh(projectId);
}

// ---------- Safety ----------

export async function createSafetyItemAction(
  projectId: string,
  data: { title: string; description: string; severity: string }
) {
  if (!data.title.trim()) return;
  const user = await getCurrentUser();
  await db.safetyItem.create({
    data: {
      projectId,
      title: data.title.trim(),
      description: data.description.trim(),
      severity: data.severity,
      reportedBy: user.name,
    },
  });
  await db.notification.create({
    data: {
      userId: user.id,
      projectId,
      type: "safety",
      title: "Safety issue reported",
      body: data.title.trim(),
    },
  });
  refresh(projectId);
}

export async function resolveSafetyItemAction(itemId: string, projectId: string, resolved: boolean) {
  await db.safetyItem.update({ where: { id: itemId }, data: { resolved } });
  refresh(projectId);
}

// ---------- Project settings (Foreman-only) ----------

export async function updateProjectAction(
  projectId: string,
  data: { name: string; clientName: string; phase: string; status: string; address?: string }
) {
  if (!data.name.trim() || !data.clientName.trim() || !data.phase.trim()) return;
  await db.project.update({
    where: { id: projectId },
    data: {
      name: data.name.trim(),
      clientName: data.clientName.trim(),
      phase: data.phase.trim(),
      status: data.status,
      address: data.address?.trim() || null,
    },
  });
  refresh(projectId);
}

// ---------- Issues ----------

export async function createIssueAction(
  projectId: string,
  data: { title: string; description?: string }
) {
  if (!data.title.trim()) return;
  const user = await getCurrentUser();
  await db.issue.create({
    data: {
      projectId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      reportedBy: user.name,
      official: true,
    },
  });
  refresh(projectId);
}

export async function updateIssueStatusAction(issueId: string, projectId: string, status: string) {
  await db.issue.update({ where: { id: issueId }, data: { status } });
  refresh(projectId);
}
