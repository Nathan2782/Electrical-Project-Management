"use client";

import { Camera } from "lucide-react";
import { AddButton } from "@/components/ui/add-button";
import { PhotoForm } from "@/components/forms/photo-form";
import { formatShortDate } from "@/lib/format";

export type PhotoData = {
  id: string;
  caption: string;
  color: string;
  uploaderName: string;
  createdAt: string;
};

export function PhotosGrid({ projectId, photos }: { projectId: string; photos: PhotoData[] }) {
  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-semibold text-[var(--color-text)]">Photos</h1>
          <p className="text-[12.5px] text-[var(--color-text-secondary)]">Field photos from the crew</p>
        </div>
        <AddButton
          label="Take Photo"
          modalTitle="Add Photo"
          render={(onDone) => <PhotoForm projectId={projectId} onDone={onDone} />}
        />
      </div>

      {photos.length === 0 ? (
        <p className="mt-8 text-center text-[13px] text-[var(--color-text-muted)]">No photos yet.</p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white"
            >
              <div
                className="flex aspect-square items-center justify-center"
                style={{ backgroundColor: `${photo.color}1a` }}
              >
                <Camera size={26} style={{ color: photo.color }} />
              </div>
              <div className="p-2.5">
                <p className="truncate text-[12px] font-medium text-[var(--color-text)]">{photo.caption}</p>
                <p className="truncate text-[10.5px] text-[var(--color-text-muted)]">
                  {photo.uploaderName} · {formatShortDate(new Date(photo.createdAt))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
