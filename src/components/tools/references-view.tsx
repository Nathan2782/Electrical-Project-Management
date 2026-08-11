import { BookMarked } from "lucide-react";

type ReferenceData = {
  id: string;
  code: string;
  title: string;
  summary: string;
  category: string;
};

export function ReferencesView({ references }: { references: ReferenceData[] }) {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="mb-1 text-[16px] font-semibold text-[var(--color-text)]">References</h1>
      <p className="mb-5 text-[12.5px] text-[var(--color-text-secondary)]">
        NEC code references relevant to this project
      </p>

      {references.length === 0 ? (
        <p className="text-center text-[13px] text-[var(--color-text-muted)]">No references added yet.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {references.map((ref) => (
            <div key={ref.id} className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-white p-4">
              <BookMarked size={17} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="text-[13px] font-semibold text-[var(--color-primary)]">{ref.code}</span>
                  <span className="text-[13px] font-medium text-[var(--color-text)]">{ref.title}</span>
                </div>
                <p className="mt-0.5 text-[12.5px] text-[var(--color-text-secondary)]">{ref.summary}</p>
                <span className="mt-1.5 inline-block rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[10.5px] text-[var(--color-text-muted)]">
                  {ref.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
