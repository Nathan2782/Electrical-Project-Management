import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { runGlobalSearch } from "@/lib/search";
import { SearchBox } from "@/components/search/search-box";

const KIND_COLOR: Record<string, string> = {
  Project: "var(--color-primary)",
  Conversation: "#8B5CF6",
  Print: "#0EA5A5",
  Material: "#D97706",
  Note: "#6366F1",
  Document: "#475569",
  Task: "#1D6FE0",
  Photo: "#DB2777",
  Measurement: "#059669",
  Reference: "#B45F06",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const user = await getCurrentUser();
  const results = q ? await runGlobalSearch(q, user.id) : [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <h1 className="mb-4 text-[16px] font-semibold text-[var(--color-text)]">Search</h1>
        <SearchBox initialQuery={q ?? ""} />

        {!q ? (
          <div className="mt-10 flex flex-col items-center text-center text-[var(--color-text-muted)]">
            <SearchIcon size={28} className="mb-2 opacity-40" />
            <p className="text-[13px]">
              Search projects, conversations, prints, materials, notes, documents, tasks, photos,
              measurements, and NEC references.
            </p>
          </div>
        ) : results.length === 0 ? (
          <p className="mt-10 text-center text-[13px] text-[var(--color-text-muted)]">
            No results for &ldquo;{q}&rdquo;.
          </p>
        ) : (
          <div className="mt-5 flex flex-col gap-2">
            <p className="mb-1 text-[12px] text-[var(--color-text-secondary)]">
              {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
            </p>
            {results.map((r) => (
              <Link
                key={`${r.kind}-${r.id}`}
                href={r.href}
                className="rounded-lg border border-[var(--color-border)] bg-white p-3.5 hover:border-[var(--color-primary)]"
              >
                <div className="mb-1 flex items-center gap-2 text-[11.5px] text-[var(--color-text-muted)]">
                  <span
                    className="rounded-full px-2 py-0.5 font-medium text-white"
                    style={{ backgroundColor: KIND_COLOR[r.kind] ?? "#8593a6" }}
                  >
                    {r.kind}
                  </span>
                  <span>{r.projectName}</span>
                </div>
                <p className="truncate text-[13.5px] font-medium text-[var(--color-text)]">{r.title}</p>
                {r.snippet && (
                  <p className="line-clamp-2 text-[12.5px] text-[var(--color-text-secondary)]">{r.snippet}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
