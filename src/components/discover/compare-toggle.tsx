"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, GitCompareArrows } from "lucide-react";

export function CompareToggle({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const selected = (params.get("compare") || "").split(",").filter(Boolean);
  const checked = selected.includes(slug);
  function update(next: boolean) {
    const values = next
      ? [...selected, slug]
      : selected.filter((item) => item !== slug);
    const copy = new URLSearchParams(params.toString());
    if (values.length)
      copy.set("compare", [...new Set(values)].slice(0, 4).join(","));
    else copy.delete("compare");
    router.replace(`/discover?${copy.toString()}`, { scroll: false });
  }
  return (
    <button
      type="button"
      aria-label={`Compare ${name}`}
      aria-pressed={checked}
      disabled={!checked && selected.length >= 4}
      title={
        checked
          ? "Remove from comparison"
          : selected.length >= 4
            ? "Four colleges selected; remove one first"
            : "Add to comparison"
      }
      onClick={() => update(!checked)}
      className={`relative z-float grid size-11 shrink-0 place-items-center rounded-full ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-45 ${checked ? "bg-ink text-white ring-ink" : "bg-surface text-ink-secondary ring-line hover:bg-azure/10 hover:text-azure-ink hover:ring-azure"}`}
    >
      {checked ? (
        <Check aria-hidden className="size-4" />
      ) : (
        <GitCompareArrows aria-hidden className="size-4" />
      )}
    </button>
  );
}

export function CompareTray() {
  const router = useRouter();
  const params = useSearchParams();
  const selected = (params.get("compare") || "")
    .split(",")
    .filter(Boolean)
    .slice(0, 4);
  if (!selected.length) return null;
  const clear = () => {
    const copy = new URLSearchParams(params.toString());
    copy.delete("compare");
    router.replace(`/discover?${copy.toString()}`, { scroll: false });
  };
  return (
    <div className="fixed inset-x-4 bottom-4 z-overlay mx-auto max-w-content rounded-island border border-line bg-white/90 p-3 shadow-floating backdrop-blur-xl sm:inset-x-8 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-label font-medium text-ink">
          <span className="tabular-nums">{selected.length}</span> of 4 colleges
          selected{" "}
          <span className="hidden text-ink-tertiary sm:inline">
            · Select at least two to compare
          </span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="min-h-11 rounded-full px-4 text-label text-ink-secondary hover:bg-ink/5"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={selected.length < 2}
            onClick={() =>
              router.push(
                `/compare?colleges=${encodeURIComponent(selected.join(","))}`,
              )
            }
            className="h-11 rounded-full bg-ink px-5 text-label font-medium text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            Compare now
          </button>
        </div>
      </div>
    </div>
  );
}
