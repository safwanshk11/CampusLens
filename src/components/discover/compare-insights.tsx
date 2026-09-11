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
    setResult(null);
    try {
      const response = await fetch(
        `/api/compare/insights?colleges=${encodeURIComponent(slugs.join(","))}`,
        { method: "POST" },
      );
      const body = await response.json();
      if (!response.ok) {
        setError(body.error || "Analysis is unavailable. Please try again.");
        return;
      }
      setResult(body.data);
    } catch {
      setError("Analysis is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <Card surface="quiet" className="mb-8 border border-azure/15 bg-gradient-to-br from-white/80 to-azure/5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-3 text-azure-ink">A closer look</p>
          <h2 className="text-2xl tracking-heading font-medium">Which fits you better?</h2>
          <p className="mt-2 max-w-2xl text-label text-ink-secondary">
            Ask Gemini to explain cost, placement salary and review trade-offs
            using the figures in this comparison.
          </p>
        </div>
        <Button onClick={analyze} disabled={pending}>
          {pending
            ? "Asking Gemini…"
            : result
              ? "Refresh analysis"
              : "Ask Gemini"}
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
            <p className="mb-3 text-label font-medium">
              Gemini analysis · Based on stored college figures
            </p>
            <p className="mb-5 text-label text-azure-ink">{result.notice}</p>
            {result.summary && (
              <p className="mb-6 text-body text-ink-secondary">
                {result.summary}
              </p>
            )}
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
