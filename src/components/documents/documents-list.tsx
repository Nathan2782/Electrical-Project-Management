"use client";

import { FileText } from "lucide-react";
import { AddButton } from "@/components/ui/add-button";
import { DocumentForm } from "@/components/forms/document-form";
import { OfficialBadge } from "@/components/badges/official-badge";
import { formatShortDate } from "@/lib/format";
import { canManageOfficial, type RoleId } from "@/lib/roles";

export type DocumentData = {
  id: string;
  name: string;
  fileType: string;
  size: string;
  official: boolean;
  uploadedBy: string;
  createdAt: string;
};

export function DocumentsList({
  projectId,
  documents,
  activeRole,
}: {
  projectId: string;
  documents: DocumentData[];
  activeRole: RoleId;
}) {
  const canManage = canManageOfficial(activeRole);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-semibold text-[var(--color-text)]">Documents</h1>
          <p className="text-[12.5px] text-[var(--color-text-secondary)]">Specs, submittals, and project files</p>
        </div>
        {canManage && (
          <AddButton
            label="Add Document"
            modalTitle="Add Document"
            render={(onDone) => <DocumentForm projectId={projectId} onDone={onDone} />}
          />
        )}
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
        {documents.length === 0 ? (
          <p className="p-6 text-center text-[13px] text-[var(--color-text-muted)]">No documents yet.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-subtle)]">
                <FileText size={17} className="text-[var(--color-text-secondary)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[13.5px] font-medium text-[var(--color-text)]">{doc.name}</p>
                  {doc.official && <OfficialBadge compact />}
                </div>
                <p className="text-[11.5px] text-[var(--color-text-secondary)]">
                  {doc.fileType} · {doc.size} · {doc.uploadedBy} · {formatShortDate(new Date(doc.createdAt))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
