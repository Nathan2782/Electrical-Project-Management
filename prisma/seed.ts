import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Role = {
  FOREMAN: "FOREMAN",
  CONTRACTOR: "CONTRACTOR",
  JOURNEYMAN: "JOURNEYMAN",
  APPRENTICE: "APPRENTICE",
  CREW: "CREW",
} as const;

const ItemStatus = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETE: "COMPLETE",
  NEEDS_ATTENTION: "NEEDS_ATTENTION",
  CRITICAL: "CRITICAL",
} as const;

function daysAgo(n: number, hour = 9, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  await prisma.notification.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.task.deleteMany();
  await prisma.materialItem.deleteMany();
  await prisma.note.deleteMany();
  await prisma.document.deleteMany();
  await prisma.print.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.dailyLog.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.safetyItem.deleteMany();
  await prisma.referenceItem.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: { name: "Voltline Electrical Contractors" },
  });

  const nathan = await prisma.user.create({
    data: { name: "Nathan Garcia", initials: "NG", email: "natg2003.ng@gmail.com", role: Role.FOREMAN, avatarColor: "#1264A3", organizationId: org.id },
  });
  const maria = await prisma.user.create({
    data: { name: "Maria Chen", initials: "MC", email: "maria.chen@voltline.com", role: Role.CONTRACTOR, avatarColor: "#8B5CF6", organizationId: org.id },
  });
  const jt = await prisma.user.create({
    data: { name: "James Turner", initials: "JT", email: "james.turner@voltline.com", role: Role.JOURNEYMAN, avatarColor: "#059669", organizationId: org.id },
  });
  const av = await prisma.user.create({
    data: { name: "Aaliyah Vance", initials: "AV", email: "aaliyah.vance@voltline.com", role: Role.APPRENTICE, avatarColor: "#D97706", organizationId: org.id },
  });
  const ro = await prisma.user.create({
    data: { name: "Ray Ortiz", initials: "RO", email: "ray.ortiz@voltline.com", role: Role.CREW, avatarColor: "#DB2777", organizationId: org.id },
  });

  const allUsers = [nathan, maria, jt, av, ro];

  // ---------- Project 1: Riverside Commercial Tower ----------
  const p1 = await prisma.project.create({
    data: {
      name: "Riverside Commercial Tower",
      clientName: "Commercial Building",
      phase: "Electrical Rough-In",
      status: "ACTIVE",
      address: "412 Riverside Ave, Portland, OR",
      color: "#1264A3",
      organizationId: org.id,
    },
  });

  for (const u of allUsers) {
    await prisma.projectMember.create({ data: { projectId: p1.id, userId: u.id, unreadCount: u.id === nathan.id ? 0 : 0 } });
  }
  await prisma.projectMember.update({ where: { projectId_userId: { projectId: p1.id, userId: nathan.id } }, data: { unreadCount: 3 } });

  const m1 = await prisma.message.create({
    data: { projectId: p1.id, authorId: jt.id, body: "Panel B location doesn't match the field conditions on sheet E-201. Column line is 2ft off from what's on the print.", createdAt: daysAgo(1, 8, 12) },
  });
  await prisma.reaction.create({ data: { emoji: "👍", messageId: m1.id, userId: nathan.id } });
  await prisma.message.create({
    data: { projectId: p1.id, authorId: nathan.id, body: "Good catch. I'll get an RFI out to the architect today. Hold on Panel B rough-in until we hear back.", createdAt: daysAgo(1, 8, 20), parentId: m1.id },
  });
  const issue1 = await prisma.issue.create({
    data: { projectId: p1.id, title: "Panel B location conflict with field conditions", description: "Column line is 2ft off from sheet E-201. RFI submitted to architect, rough-in on hold.", severity: ItemStatus.NEEDS_ATTENTION, status: ItemStatus.IN_PROGRESS, reportedBy: "James Turner", fromMessage: true },
  });
  await prisma.message.update({ where: { id: m1.id }, data: { convertedTo: "issue", convertedRefId: issue1.id } });

  const m2 = await prisma.message.create({
    data: { projectId: p1.id, authorId: av.id, body: "Need another 100 ft of 3/4 EMT for the 3rd floor run, we're short.", createdAt: daysAgo(1, 10, 5) },
  });
  await prisma.message.create({
    data: { projectId: p1.id, authorId: ro.id, body: "Pulled wire for units 301-306, all THHN #12 per spec. Ready for inspection on that section.", createdAt: daysAgo(1, 13, 40) },
  });
  const m3 = await prisma.message.create({
    data: { projectId: p1.id, authorId: maria.id, body: "Reminder: toolbox talk tomorrow 7am on ladder safety before we start the 4th floor.", createdAt: daysAgo(0, 7, 0) },
  });
  await prisma.reaction.create({ data: { emoji: "✅", messageId: m3.id, userId: jt.id } });
  await prisma.reaction.create({ data: { emoji: "✅", messageId: m3.id, userId: av.id } });
  const m4 = await prisma.message.create({
    data: { projectId: p1.id, authorId: jt.id, body: "Finish labeling Panel A. Directory is filled out but breakers aren't labeled yet.", createdAt: daysAgo(0, 9, 15) },
  });
  await prisma.message.create({
    data: { projectId: p1.id, authorId: nathan.id, body: "Photos attached from today's 2nd floor walkthrough — looking good overall, a couple of J-boxes need covers before drywall.", createdAt: daysAgo(0, 15, 2), attachmentType: "photo", attachmentName: "2F-walkthrough.jpg" },
  });

  const [taskLabelPanelA] = await Promise.all([
    prisma.task.create({
      data: { projectId: p1.id, title: "Label Panel A breakers", description: "Directory filled out, breakers need labels per as-built", status: ItemStatus.IN_PROGRESS, assigneeId: jt.id, creatorId: nathan.id, dueDate: daysAgo(-1), official: true, fromMessage: true },
    }),
  ]);
  await prisma.message.update({ where: { id: m4.id }, data: { convertedTo: "task", convertedRefId: taskLabelPanelA.id } });

  await prisma.task.createMany({
    data: [
      { projectId: p1.id, title: "Rough-in 3rd floor units 307-312", status: ItemStatus.NOT_STARTED, assigneeId: ro.id, creatorId: nathan.id, dueDate: daysAgo(-3), official: true },
      { projectId: p1.id, title: "Install covers on 2F junction boxes", status: ItemStatus.NEEDS_ATTENTION, assigneeId: av.id, creatorId: nathan.id, dueDate: daysAgo(-1), official: true },
      { projectId: p1.id, title: "Submit RFI — Panel B location conflict", status: ItemStatus.IN_PROGRESS, assigneeId: nathan.id, creatorId: nathan.id, official: true, fromMessage: true },
      { projectId: p1.id, title: "Pull wire units 301–306", status: ItemStatus.COMPLETE, assigneeId: ro.id, creatorId: nathan.id, official: true },
    ],
  });

  const materialEmt = await prisma.materialItem.create({
    data: { projectId: p1.id, name: "3/4\" EMT conduit", quantity: "100 ft", status: ItemStatus.NEEDS_ATTENTION, requestedBy: "Aaliyah Vance", fromMessage: true, official: true },
  });
  await prisma.message.update({ where: { id: m2.id }, data: { convertedTo: "material", convertedRefId: materialEmt.id } });

  await prisma.materialItem.createMany({
    data: [
      { projectId: p1.id, name: "#12 THHN wire, black", quantity: "1000 ft spool", status: ItemStatus.IN_PROGRESS, requestedBy: "Ray Ortiz", official: true },
      { projectId: p1.id, name: "4\" square junction box covers", quantity: "24 units", status: ItemStatus.NOT_STARTED, requestedBy: "Nathan Garcia", official: true },
      { projectId: p1.id, name: "20A GFCI receptacles", quantity: "36 units", status: ItemStatus.COMPLETE, requestedBy: "Maria Chen", official: true },
    ],
  });

  await prisma.note.createMany({
    data: [
      { projectId: p1.id, title: "Access requirements", body: "Site requires hard hat + high-vis at all times. Sign in at trailer each morning.", official: true, authorName: "Nathan Garcia" },
      { projectId: p1.id, title: "Parking note", body: "Crew parking is on the north lot only, south lot is for deliveries.", official: false, authorName: "James Turner" },
    ],
  });

  await prisma.document.createMany({
    data: [
      { projectId: p1.id, name: "Electrical Spec Section 26", fileType: "PDF", size: "4.2 MB", official: true, uploadedBy: "Nathan Garcia" },
      { projectId: p1.id, name: "Panel Schedule Rev C", fileType: "XLSX", size: "88 KB", official: true, uploadedBy: "Nathan Garcia" },
      { projectId: p1.id, name: "Submittal — LED Fixtures", fileType: "PDF", size: "1.1 MB", official: true, uploadedBy: "Maria Chen" },
    ],
  });

  await prisma.print.createMany({
    data: [
      { projectId: p1.id, name: "Power Plan - Level 2", sheetNo: "E-201", revision: "Rev C", discipline: "Electrical", uploadedBy: "Nathan Garcia" },
      { projectId: p1.id, name: "Power Plan - Level 3", sheetNo: "E-202", revision: "Rev B", discipline: "Electrical", uploadedBy: "Nathan Garcia" },
      { projectId: p1.id, name: "Lighting Plan - Level 2", sheetNo: "E-301", revision: "Rev A", discipline: "Electrical", uploadedBy: "Nathan Garcia" },
      { projectId: p1.id, name: "Panel Schedules", sheetNo: "E-601", revision: "Rev C", discipline: "Electrical", uploadedBy: "Nathan Garcia" },
      { projectId: p1.id, name: "Riser Diagram", sheetNo: "E-701", revision: "Rev A", discipline: "Electrical", uploadedBy: "Nathan Garcia" },
    ],
  });

  await prisma.photo.createMany({
    data: [
      { projectId: p1.id, caption: "2F junction boxes — need covers", color: "#D97706", uploaderId: nathan.id },
      { projectId: p1.id, caption: "Panel A rough-in complete", color: "#059669", uploaderId: jt.id },
      { projectId: p1.id, caption: "3rd floor conduit run", color: "#1264A3", uploaderId: av.id },
      { projectId: p1.id, caption: "Wire pull units 301-306", color: "#1264A3", uploaderId: ro.id },
    ],
  });

  await prisma.checklist.create({
    data: {
      projectId: p1.id,
      title: "Pre-Drywall Rough-In Checklist",
      items: {
        create: [
          { label: "All boxes secured and at correct height", done: true },
          { label: "All homeruns labeled at panel", done: true },
          { label: "Nail plates installed where required", done: false },
          { label: "Grounding continuity verified", done: false },
          { label: "Photos taken of all concealed work", done: false },
        ],
      },
    },
  });

  await prisma.dailyLog.createMany({
    data: [
      { projectId: p1.id, date: daysAgo(1), weather: "Clear, 68°F", crewCount: 5, summary: "Completed wire pull units 301-306. Started 3rd floor conduit rough-in. Identified Panel B location conflict, RFI to follow.", author: "Nathan Garcia" },
      { projectId: p1.id, date: daysAgo(0), weather: "Overcast, 61°F", crewCount: 5, summary: "Continued 3rd floor rough-in. Panel A labeling in progress. Toolbox talk held on ladder safety.", author: "Nathan Garcia" },
    ],
  });

  await prisma.measurement.createMany({
    data: [
      { projectId: p1.id, label: "Panel A to Panel B distance", value: "42 ft", location: "Level 2 electrical room" },
      { projectId: p1.id, label: "Voltage drop, Panel A feeder", value: "1.8%", location: "Main to Panel A" },
      { projectId: p1.id, label: "Ceiling height, Level 3", value: "9 ft 6 in", location: "Level 3 corridor" },
    ],
  });

  await prisma.inspection.createMany({
    data: [
      { projectId: p1.id, title: "Rough-In Inspection — Level 2", inspector: "City of Portland — J. Reyes", scheduledAt: daysAgo(-2), status: ItemStatus.NOT_STARTED, notes: "Confirm all boxes covered and grounding verified before inspector arrives." },
      { projectId: p1.id, title: "Wire Pull Inspection — Units 301-306", inspector: "City of Portland — J. Reyes", scheduledAt: daysAgo(2), status: ItemStatus.COMPLETE, notes: "Passed, no corrections noted." },
    ],
  });

  await prisma.safetyItem.createMany({
    data: [
      { projectId: p1.id, title: "Exposed extension cord across walkway, Level 2", severity: ItemStatus.NEEDS_ATTENTION, reportedBy: "Aaliyah Vance", description: "Cord run across the main walkway near stairwell B, trip hazard.", resolved: false },
      { projectId: p1.id, title: "Missing GFCI on temp power, Level 3", severity: ItemStatus.CRITICAL, reportedBy: "James Turner", description: "Temp power drop on level 3 not GFCI protected.", resolved: false },
    ],
  });

  await prisma.referenceItem.createMany({
    data: [
      { projectId: p1.id, code: "NEC 210.8", title: "GFCI Protection for Personnel", summary: "Requires GFCI protection for receptacles in specified locations including bathrooms, kitchens, garages, and outdoors.", category: "Wiring & Protection" },
      { projectId: p1.id, code: "NEC 300.5", title: "Underground Installations", summary: "Minimum cover requirements and protection for underground conduit and cable installations.", category: "Wiring Methods" },
      { projectId: p1.id, code: "NEC 408.4", title: "Circuit Directory / Panel Labeling", summary: "Every circuit and circuit modification must be legibly identified at the panelboard.", category: "Equipment" },
    ],
  });

  // ---------- Project 2: Maple Grove Elementary Retrofit ----------
  const p2 = await prisma.project.create({
    data: {
      name: "Maple Grove Elementary Retrofit",
      clientName: "School District 4J",
      phase: "Lighting Upgrade",
      status: "ACTIVE",
      address: "1500 Maple Grove Rd, Eugene, OR",
      color: "#059669",
      organizationId: org.id,
    },
  });
  for (const u of [nathan, maria, jt]) {
    await prisma.projectMember.create({ data: { projectId: p2.id, userId: u.id } });
  }
  await prisma.projectMember.update({ where: { projectId_userId: { projectId: p2.id, userId: nathan.id } }, data: { unreadCount: 1 } });

  await prisma.message.create({
    data: { projectId: p2.id, authorId: maria.id, body: "LED retrofit fixtures for wing C arrived, staging them in the gym now.", createdAt: daysAgo(0, 11, 0) },
  });
  await prisma.message.create({
    data: { projectId: p2.id, authorId: jt.id, body: "Old fluorescent ballasts need to go in the hazardous waste bin, not the regular dumpster — they're PCB rated.", createdAt: daysAgo(0, 12, 30) },
  });

  await prisma.task.createMany({
    data: [
      { projectId: p2.id, title: "Remove fluorescent fixtures — Wing C", status: ItemStatus.IN_PROGRESS, assigneeId: jt.id, creatorId: nathan.id, official: true },
      { projectId: p2.id, title: "Install LED fixtures — Wing C classrooms", status: ItemStatus.NOT_STARTED, assigneeId: maria.id, creatorId: nathan.id, official: true },
      { projectId: p2.id, title: "Dispose of PCB ballasts per district policy", status: ItemStatus.NOT_STARTED, assigneeId: jt.id, creatorId: nathan.id, official: true },
    ],
  });

  await prisma.materialItem.createMany({
    data: [
      { projectId: p2.id, name: "LED troffer fixtures, 2x4", quantity: "48 units", status: ItemStatus.COMPLETE, requestedBy: "Maria Chen", official: true },
      { projectId: p2.id, name: "Occupancy sensors", quantity: "18 units", status: ItemStatus.IN_PROGRESS, requestedBy: "Maria Chen", official: true },
    ],
  });

  await prisma.print.createMany({
    data: [
      { projectId: p2.id, name: "Lighting Retrofit Plan - Wing C", sheetNo: "E-101", revision: "Rev A", discipline: "Electrical", uploadedBy: "Nathan Garcia" },
    ],
  });

  await prisma.document.createMany({
    data: [
      { projectId: p2.id, name: "District Hazmat Disposal Policy", fileType: "PDF", size: "560 KB", official: true, uploadedBy: "Nathan Garcia" },
    ],
  });

  await prisma.photo.createMany({
    data: [
      { projectId: p2.id, caption: "LED fixtures staged in gym", color: "#059669", uploaderId: maria.id },
    ],
  });

  await prisma.dailyLog.create({
    data: { projectId: p2.id, date: daysAgo(0), weather: "Sunny, 74°F", crewCount: 3, summary: "Began fixture removal in Wing C. LED stock delivered and staged.", author: "Nathan Garcia" },
  });

  // ---------- Project 3: Harbor View Residence ----------
  const p3 = await prisma.project.create({
    data: {
      name: "Harbor View Residence",
      clientName: "Private Residence",
      phase: "Service Upgrade",
      status: "ON_HOLD",
      address: "88 Harbor View Ct, Astoria, OR",
      color: "#D97706",
      organizationId: org.id,
    },
  });
  for (const u of [nathan, ro]) {
    await prisma.projectMember.create({ data: { projectId: p3.id, userId: u.id } });
  }

  await prisma.message.create({
    data: { projectId: p3.id, authorId: nathan.id, body: "Waiting on utility company to schedule the meter swap before we can finish the 200A service upgrade. On hold until then.", createdAt: daysAgo(4, 10, 0) },
  });

  await prisma.task.create({
    data: { projectId: p3.id, title: "Coordinate meter swap with utility", status: ItemStatus.NEEDS_ATTENTION, assigneeId: nathan.id, creatorId: nathan.id, official: true },
  });

  await prisma.materialItem.create({
    data: { projectId: p3.id, name: "200A meter/main combo panel", quantity: "1 unit", status: ItemStatus.COMPLETE, requestedBy: "Nathan Garcia", official: true },
  });

  // ---------- Notifications ----------
  await prisma.notification.createMany({
    data: [
      { userId: nathan.id, projectId: p1.id, type: "message", title: "James Turner", body: "Panel B location doesn't match the field conditions...", read: false },
      { userId: nathan.id, projectId: p1.id, type: "material", title: "Material request", body: "Aaliyah requested 100 ft of 3/4 EMT", read: false },
      { userId: nathan.id, projectId: p1.id, type: "safety", title: "Safety issue reported", body: "Missing GFCI on temp power, Level 3", read: false },
      { userId: nathan.id, projectId: p2.id, type: "message", title: "Maria Chen", body: "LED retrofit fixtures for wing C arrived...", read: false },
      { userId: nathan.id, projectId: p3.id, type: "update", title: "Project on hold", body: "Harbor View Residence is on hold pending utility scheduling", read: true },
    ],
  });

  console.log("Seed complete:", { org: org.name, users: allUsers.length, projects: 3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
