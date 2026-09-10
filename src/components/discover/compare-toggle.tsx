"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CompareCheck } from "@/components/ui/compare-check";

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
    copy.delete("page");
    router.replace(`/discover?${copy.toString()}`, { scroll: false });
  }
  return (
    <CompareCheck itemName={name} checked={checked} onCheckedChange={update} />
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
