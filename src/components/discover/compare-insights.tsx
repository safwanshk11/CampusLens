"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ComparisonInsights } from "@/lib/comparison-insights";

export function CompareInsights({ slugs }: { slugs: string[] }) {
  const [result, setResult] = useState<ComparisonInsights | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function analyze() {
    setPending(true);
    setError("");
    try {
      const response = await fetch(
        `/api/compare/insights?colleges=${encodeURIComponent(slugs.join(","))}`,
      );
      if (!response.ok)
        throw new Error(
          "Analysis is temporarily unavailable. Please try again.",
        );
      const body = await response.json();
      setResult(body.data);
    } catch {
      setError("Analysis is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <Card surface="quiet" className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium">Which fits you better?</h2>
          <p className="mt-2 max-w-2xl text-label text-ink-secondary">
            See who leads on cost, placement salary and reviews. Your priorities
            decide the trade-off.
          </p>
        </div>
        <Button onClick={analyze} disabled={pending}>
          {pending
            ? "Analyzing…"
            : result
              ? "Refresh analysis"
              : "Explain the trade-offs"}
        </Button>
      </div>
      <div aria-live="polite" aria-busy={pending}>
        {error && (
          <p role="alert" className="mt-4 text-label text-danger-ink">
            {error}
          </p>
        )}
        {result && (
          <div className="mt-6 border-t border-line pt-5">
            <p className="mb-5 text-label text-azure-ink">{result.notice}</p>
            <dl className="grid gap-6 lg:grid-cols-3">
              {result.insights.map((insight) => (
                <div key={insight.title}>
                  <dt className="font-medium">{insight.title}</dt>
                  <dd className="mt-2 text-label leading-relaxed text-ink-secondary">
                    {insight.explanation}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </Card>
  );
}
