import { z } from "zod";

const amount = z.number().int().nonnegative().nullable();
const schema = z.object({
  sourceUrl: z.string().url(),
  checkedAt: z.string(),
  course: z.string().nullable(),
  feeInr: amount,
  feeBasis: z.string().nullable(),
  annualFeeInr: amount,
  annualFeeBasis: z.string().nullable().optional(),
  courseSourceUrl: z.string().url().nullable().optional(),
  rating: z.number().min(0).max(5).nullable(),
  ratingCount: amount,
  ratingProvider: z.string(),
  averageSalaryInr: amount,
  medianSalaryInr: amount,
  medianSourceUrl: z.string().url().nullable(),
  medianCohort: z.string().nullable().optional(),
  medianYear: z.number().int().nullable().optional(),
});

export function catalogueFacts(value: unknown) {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function annualFeeLabel(basis?: string | null) {
  if (basis === "PUBLISHED_FIRST_YEAR") return "First-year course fee";
  if (basis === "ANNUALISED_TOTAL") return "Annualised course fee";
  return "Annual tuition";
}
