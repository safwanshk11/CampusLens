import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import type { CollegeQuery } from "./query";
import { matchDemoCourse, type StudentProfile } from "@/lib/student-profile";

export type CollegeSearchItem = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  ownership: "PUBLIC" | "PRIVATE" | "DEEMED";
  isDemo: boolean;
  imageUrl: string | null;
  minAnnualFeeInr: number | null;
  maxAnnualFeeInr: number | null;
  matchingCourseCount: number;
  averageRating: number | null;
  reviewCount: number;
  placementYear: number | null;
  medianSalaryInr: number | null;
};

export type CollegeSearchResponse = {
  data: CollegeSearchItem[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean };
  query: CollegeQuery;
  meta: { feeBasis: "annual_tuition_inr_matching_courses"; demoDataNotice: string | null };
};

// LIKE wildcards are treated as literal search characters, not query syntax.
const contains = (value: string) => `%${value.replace(/[\\%_]/g, "\\$&")}%`;

export async function searchColleges(query: CollegeQuery, academic?: StudentProfile): Promise<CollegeSearchResponse> {
  const courseConditions: Prisma.Sql[] = [Prisma.sql`co."collegeId" = c.id`];
  if (query.discipline) courseConditions.push(Prisma.sql`lower(co.discipline) = lower(${query.discipline})`);
  if (query.degreeLevel) courseConditions.push(Prisma.sql`co."degreeLevel"::text = ${query.degreeLevel}`);
  if (query.minFee !== undefined) courseConditions.push(Prisma.sql`co."annualFeeInr" >= ${query.minFee}`);
  if (query.maxFee !== undefined) courseConditions.push(Prisma.sql`co."annualFeeInr" <= ${query.maxFee}`);
  const filters: Prisma.Sql[] = [Prisma.sql`TRUE`];
  if (academic) {
    courseConditions.push(Prisma.sql`co.discipline = ${academic.stream} AND co."degreeLevel"::text = 'UNDERGRADUATE'`);
    const match = matchDemoCourse({ ...academic, budget: null }, { discipline: academic.stream, degreeLevel: "UNDERGRADUATE", annualFeeInr: 0 }, true);
    const groups = academic.stream === "Engineering" ? ["IIT", "NIT"] : academic.stream === "Medical" ? ["AIIMS"] : ["Independent university"];
    const demoMatch = match?.status === "Meets demo criteria" ? Prisma.sql`c."isDemo" = TRUE AND f."matchingCourseCount" > 0` : Prisma.sql`FALSE`;
    filters.push(Prisma.sql`(${demoMatch} OR (c."isDemo" = FALSE AND (c."institutionGroup" IN (${Prisma.join(groups)}) OR f."matchingCourseCount" > 0)))`);
  }
  if (query.city) filters.push(Prisma.sql`lower(c.city) = lower(${query.city})`);
  if (query.state) filters.push(Prisma.sql`lower(c.state) = lower(${query.state})`);
  if (query.ownership) filters.push(Prisma.sql`c.ownership::text = ${query.ownership}`);
  if (query.minRating !== undefined) filters.push(Prisma.sql`r."averageRating" >= ${query.minRating}`);
  if (query.discipline || query.degreeLevel || query.minFee !== undefined || query.maxFee !== undefined) filters.push(Prisma.sql`f."matchingCourseCount" > 0`);
  if (query.q) {
    const pattern = contains(query.q);
    filters.push(Prisma.sql`(c.name ILIKE ${pattern} OR c.city ILIKE ${pattern} OR c."institutionGroup" ILIKE ${pattern} OR EXISTS (
      SELECT 1 FROM "Course" co WHERE ${Prisma.join(courseConditions, " AND ")} AND co.name ILIKE ${pattern}
    ))`);
  }
  // Aggregate in PostgreSQL before sorting/pagination. No full-catalogue JS sorting,
  // no per-result database calls, and no join multiplication of review counts.
  const filtered = Prisma.sql`WITH filtered AS (
    SELECT c.id, c.slug, c.name, c.city, c.state, c.ownership, c."isDemo", c."imageUrl",
      f.*, r.*, p.year AS "placementYear", p."medianSalaryInr"
    FROM "College" c
    CROSS JOIN LATERAL (
      SELECT min(co."annualFeeInr") AS "minAnnualFeeInr", max(co."annualFeeInr") AS "maxAnnualFeeInr", count(*)::int AS "matchingCourseCount"
      FROM "Course" co WHERE ${Prisma.join(courseConditions, " AND ")}
    ) f
    CROSS JOIN LATERAL (
      SELECT avg(rating)::float8 AS "averageRating", count(*)::int AS "reviewCount" FROM "Review" WHERE "collegeId" = c.id
    ) r
    LEFT JOIN LATERAL (
      SELECT year, "medianSalaryInr" FROM "Placement" WHERE "collegeId" = c.id ORDER BY year DESC LIMIT 1
    ) p ON TRUE
    WHERE ${Prisma.join(filters, " AND ")}
  )`;
  // Only trusted SQL fragments are used for ordering; user values are bound parameters.
  const orders = {
    name_asc: Prisma.sql`lower(name) ASC, id ASC`,
    fee_asc: Prisma.sql`"minAnnualFeeInr" ASC NULLS LAST, lower(name) ASC, id ASC`,
    fee_desc: Prisma.sql`"minAnnualFeeInr" DESC NULLS LAST, lower(name) ASC, id ASC`,
    rating_desc: Prisma.sql`"averageRating" DESC NULLS LAST, lower(name) ASC, id ASC`,
  };
  const [counts, data] = await getDb().$transaction([
    getDb().$queryRaw<{ total: number }[]>(Prisma.sql`${filtered} SELECT count(*)::int AS total FROM filtered`),
    getDb().$queryRaw<CollegeSearchItem[]>(Prisma.sql`${filtered} SELECT * FROM filtered ORDER BY "isDemo" ASC, ${orders[query.sort]} LIMIT ${query.pageSize} OFFSET ${(query.page - 1) * query.pageSize}`),
  ], { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
  const total = counts[0].total;
  const totalPages = Math.ceil(total / query.pageSize);
  return {
    data,
    pagination: { page: query.page, pageSize: query.pageSize, total, totalPages, hasNextPage: query.page < totalPages, hasPreviousPage: total > 0 && query.page > 1 },
    query,
    meta: { feeBasis: "annual_tuition_inr_matching_courses", demoDataNotice: data.some((college) => college.isDemo) ? "Illustrative college data; not verified admissions information." : null },
  };
}
