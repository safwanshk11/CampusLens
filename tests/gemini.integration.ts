import test from "node:test";
import assert from "node:assert/strict";
import {
  generateGeminiInsights,
  GeminiError,
} from "../src/server/colleges/gemini";
import { explainComparison } from "../src/lib/comparison-insights";
const facts = explainComparison(
  ["alpha", "beta"].map((slug) => ({
    slug,
    name: slug,
    isDemo: true,
    minFee: 40000,
    rating: null,
    reviewCount: 0,
    medianSalary: null,
    placementYear: null,
  })),
);
const generated = {
  recommendation: "An illustrative tie on cost; outcomes are unavailable.",
  explanations: [
    "Both cost the same.",
    "Salary is unavailable.",
    "Neither is rated.",
  ],
};
const success = () =>
  Response.json({
    candidates: [
      {
        finishReason: "STOP",
        content: { parts: [{ text: JSON.stringify(generated) }] },
      },
    ],
  });

test("server request carries key in header and validates structured prose", async () => {
  const fetcher: typeof fetch = async (url, options) => {
    assert(!String(url).includes("test-secret"));
    assert.equal(
      new Headers(options?.headers).get("x-goog-api-key"),
      "test-secret",
    );
    assert.equal(options?.method, "POST");
    assert(options?.signal);
    const payload = JSON.parse(String(options?.body));
    assert.equal(payload.generationConfig.responseMimeType, "application/json");
    return success();
  };
  const result = await generateGeminiInsights(facts, {
    apiKey: "test-secret",
    fetcher,
  });
  assert.equal(result.provider, "gemini");
  assert.equal(result.summary, generated.recommendation);
  assert.equal(result.notice, facts.notice);
  assert.deepEqual(
    result.insights.map((i) => i.leaders),
    facts.insights.map((i) => i.leaders),
  );
});
test("missing configuration makes no provider call", async () => {
  await assert.rejects(
    generateGeminiInsights(facts, {
      apiKey: "",
      fetcher: async () => {
        throw Error("Must not call");
      },
    }),
    (error: unknown) =>
      error instanceof GeminiError && error.code === "NOT_CONFIGURED",
  );
});
test("rate limits are distinct and raw upstream messages never escape", async () => {
  await assert.rejects(
    generateGeminiInsights(facts, {
      apiKey: "test",
      fetcher: async () => new Response("sensitive", { status: 429 }),
    }),
    (error: unknown) =>
      error instanceof GeminiError && error.code === "RATE_LIMITED",
  );
  await assert.rejects(
    generateGeminiInsights(facts, {
      apiKey: "test",
      fetcher: async () => {
        throw Error("secret-network-detail");
      },
    }),
    { message: "UNAVAILABLE" },
  );
});
test("blocked, truncated and malformed model responses fail closed", async () => {
  for (const body of [
    { candidates: [] },
    { candidates: [{ finishReason: "MAX_TOKENS" }] },
    {
      candidates: [
        { finishReason: "STOP", content: { parts: [{ text: "not-json" }] } },
      ],
    },
    {
      candidates: [
        {
          finishReason: "STOP",
          content: {
            parts: [
              {
                text: JSON.stringify({
                  recommendation: "test",
                  explanations: ["too few"],
                }),
              },
            ],
          },
        },
      ],
    },
  ]) {
    await assert.rejects(
      generateGeminiInsights(facts, {
        apiKey: "test",
        fetcher: async () => Response.json(body),
      }),
      { message: "UNAVAILABLE" },
    );
  }
});
