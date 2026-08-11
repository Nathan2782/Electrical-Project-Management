import { db } from "@/lib/db";

export type SearchResult = {
  id: string;
  kind: string;
  projectId: string;
  projectName: string;
  title: string;
  snippet: string;
  href: string;
};

export async function runGlobalSearch(query: string, userId: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const memberships = await db.projectMember.findMany({ where: { userId }, select: { projectId: true } });
  const projectIds = memberships.map((m) => m.projectId);
  if (projectIds.length === 0) return [];

  const contains = { contains: q };
  const inProjects = { in: projectIds };

  const [projects, messages, prints, materials, notes, documents, tasks, photos, measurements, references] =
    await Promise.all([
      db.project.findMany({ where: { id: inProjects, name: contains } }),
      db.message.findMany({
        where: { projectId: inProjects, body: contains },
        include: { project: true, author: true },
        take: 10,
      }),
      db.print.findMany({ where: { projectId: inProjects, OR: [{ name: contains }, { sheetNo: contains }] }, include: { project: true }, take: 10 }),
      db.materialItem.findMany({ where: { projectId: inProjects, name: contains }, include: { project: true }, take: 10 }),
      db.note.findMany({ where: { projectId: inProjects, OR: [{ title: contains }, { body: contains }] }, include: { project: true }, take: 10 }),
      db.document.findMany({ where: { projectId: inProjects, name: contains }, include: { project: true }, take: 10 }),
      db.task.findMany({ where: { projectId: inProjects, title: contains }, include: { project: true }, take: 10 }),
      db.photo.findMany({ where: { projectId: inProjects, caption: contains }, include: { project: true }, take: 10 }),
      db.measurement.findMany({ where: { projectId: inProjects, label: contains }, include: { project: true }, take: 10 }),
      db.referenceItem.findMany({
        where: { projectId: inProjects, OR: [{ code: contains }, { title: contains }, { summary: contains }] },
        include: { project: true },
        take: 10,
      }),
    ]);

  const results: SearchResult[] = [];

  for (const p of projects) {
    results.push({ id: p.id, kind: "Project", projectId: p.id, projectName: p.name, title: p.name, snippet: p.clientName, href: `/projects/${p.id}/conversation` });
  }
  for (const m of messages) {
    results.push({ id: m.id, kind: "Conversation", projectId: m.projectId, projectName: m.project.name, title: `${m.author.name}`, snippet: m.body, href: `/projects/${m.projectId}/conversation` });
  }
  for (const p of prints) {
    results.push({ id: p.id, kind: "Print", projectId: p.projectId, projectName: p.project.name, title: `${p.sheetNo} — ${p.name}`, snippet: `${p.discipline} · ${p.revision}`, href: `/projects/${p.projectId}/prints` });
  }
  for (const m of materials) {
    results.push({ id: m.id, kind: "Material", projectId: m.projectId, projectName: m.project.name, title: m.name, snippet: `Qty: ${m.quantity}`, href: `/projects/${m.projectId}/materials` });
  }
  for (const n of notes) {
    results.push({ id: n.id, kind: "Note", projectId: n.projectId, projectName: n.project.name, title: n.title, snippet: n.body, href: `/projects/${n.projectId}/materials` });
  }
  for (const d of documents) {
    results.push({ id: d.id, kind: "Document", projectId: d.projectId, projectName: d.project.name, title: d.name, snippet: d.fileType, href: `/projects/${d.projectId}/documents` });
  }
  for (const t of tasks) {
    results.push({ id: t.id, kind: "Task", projectId: t.projectId, projectName: t.project.name, title: t.title, snippet: t.description ?? "", href: `/projects/${t.projectId}/tasks` });
  }
  for (const p of photos) {
    results.push({ id: p.id, kind: "Photo", projectId: p.projectId, projectName: p.project.name, title: p.caption, snippet: "Field photo", href: `/projects/${p.projectId}/photos` });
  }
  for (const m of measurements) {
    results.push({ id: m.id, kind: "Measurement", projectId: m.projectId, projectName: m.project.name, title: m.label, snippet: `${m.value}${m.location ? ` · ${m.location}` : ""}`, href: `/projects/${m.projectId}/measurements` });
  }
  for (const r of references) {
    results.push({ id: r.id, kind: "Reference", projectId: r.projectId, projectName: r.project.name, title: `${r.code} — ${r.title}`, snippet: r.summary, href: `/projects/${r.projectId}/references` });
  }

  return results;
}
