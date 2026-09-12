import { z } from "zod";

const text = z.string().trim().min(1).max(100).optional();
const integer = (min: number, max: number) => z.string().regex(/^\d+$/, "Use a whole number").transform(Number).pipe(z.number().int().min(min).max(max));
export const collegeQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  city: text,
  state: text,
  ownership: z.enum(["PUBLIC", "PRIVATE", "DEEMED"]).optional(),
  discipline: text,
  degreeLevel: z.enum(["UNDERGRADUATE", "POSTGRADUATE", "DIPLOMA", "DOCTORAL", "CERTIFICATE", "INTEGRATED"]).optional(),
  minFee: integer(0, 2147483647).optional(),
  maxFee: integer(0, 2147483647).optional(),
  minRating: z.string().regex(/^(?:[0-4](?:\.\d{1,2})?|5(?:\.0{1,2})?)$/, "Use a rating from 0 to 5").transform(Number).optional(),
  sort: z.enum(["name_asc", "fee_asc", "fee_desc", "rating_desc"]).default("name_asc"),
  page: integer(1, 10000).default(1),
  pageSize: integer(1, 50).default(12),
}).strict().refine((query) => query.minFee === undefined || query.maxFee === undefined || query.minFee <= query.maxFee, {
  message: "minFee must not exceed maxFee", path: ["minFee"],
});

export type CollegeQuery = z.infer<typeof collegeQuerySchema>;

export function parseCollegeQuery(params: URLSearchParams) {
  // Reject repeated keys instead of silently picking one value.
  const duplicates = [...new Set(params.keys())].filter((key) => params.getAll(key).length > 1);
  if (duplicates.length) return { success: false as const, issues: duplicates.map((field) => ({ field, message: "Supply this parameter only once" })) };
  const parsed = collegeQuerySchema.safeParse(Object.fromEntries(params));
  if (!parsed.success) return { success: false as const, issues: parsed.error.issues.map((issue) => ({ field: issue.path.join(".") || "query", message: issue.message })) };
  return { success: true as const, data: parsed.data };
}
