import { z } from "zod";
import { formatInr } from "./college-display";

export const comparisonSlugs = z
  .string()
  .max(650)
  .transform((value) => value.split(","))
  .pipe(
    z
      .array(
        z
          .string()
          .max(160)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      )
      .min(2)
      .max(4)
      .refine(
        (values) => new Set(values).size === values.length,
        "Select distinct colleges",
      ),
  );

type Candidate = {
  slug: string;
  name: string;
  isDemo: boolean;
  minFee: number | null;
  rating: number | null;
  reviewCount: number;
  medianSalary: number | null;
  placementYear: number | null;
};
export type ComparisonInsight = {
  title: string;
  leaders: string[];
  explanation: string;
};
export type ComparisonInsights = {
  notice: string;
  insights: ComparisonInsight[];
};

export function explainComparison(colleges: Candidate[]): ComparisonInsights {
  const metric = (
    title: string,
    key: "minFee" | "rating" | "medianSalary",
    direction: "min" | "max",
    format: (value: number) => string,
    caveat: string,
  ): ComparisonInsight => {
    if (colleges.some((college) => college[key] === null))
      return {
        title,
        leaders: [],
        explanation:
          "Some selected colleges have no data for this measure, so a complete comparison is unavailable.",
      };
    const numbers = colleges.map((college) => college[key]!);
    const best =
      direction === "min" ? Math.min(...numbers) : Math.max(...numbers);
    const leaders = colleges.filter((college) => college[key] === best);
    return {
      title,
      leaders: leaders.map((college) => college.slug),
      explanation: `${leaders.map((college) => college.name).join(" and ")} ${leaders.length === 1 ? "leads" : "tie"} at ${format(best)}. ${caveat}`,
    };
  };
  const years = new Set(colleges.map((college) => college.placementYear));
  const salary =
    years.size !== 1 || years.has(null)
      ? {
          title: "Higher median salary",
          leaders: [],
          explanation:
            "The latest reports do not cover the same year for every college. Comparing them as a winner would be misleading.",
        }
      : metric(
          "Higher median salary",
          "medianSalary",
          "max",
          formatInr,
          `All reports cover ${colleges[0].placementYear}. These are college-wide outcomes, not a guarantee for a specific course.`,
        );
  return {
    notice: colleges.some((college) => college.isDemo)
      ? "Illustrative analysis of fictional college data. This is not a real-world recommendation."
      : "A comparison of the stored figures, not an overall quality ranking. Confirm current fees and outcomes with each institution.",
    insights: [
      metric(
        "Lower starting tuition",
        "minFee",
        "min",
        formatInr,
        "This is each college’s cheapest programme, which may be a different degree. Compare your intended course before choosing.",
      ),
      salary,
      metric(
        "Higher review rating",
        "rating",
        "max",
        (value) => `${value.toFixed(2)} / 5`,
        `Review counts: ${colleges.map((college) => `${college.name}: ${college.reviewCount}`).join("; ")}. Small samples are weak evidence of overall quality.`,
      ),
    ],
  };
}
