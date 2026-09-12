import { readFileSync } from "node:fs";
import { createCliDb } from "./client";
import { catalogueFacts } from "../src/lib/catalogue-facts";
import type { DegreeLevel, Prisma } from "../src/generated/prisma/client";

type RecordRow = {
  name: string; city: string; state: string; ownership: "PUBLIC" | "PRIVATE" | "DEEMED";
  course: string | null; discipline: string; durationMonths: number | null;
} & NonNullable<ReturnType<typeof catalogueFacts>>;
const rows = JSON.parse(readFileSync(new URL("../data/catalogue/state-colleges.json", import.meta.url), "utf8")) as RecordRow[];
const slugify = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const collegeSlug = (row: RecordRow) => row.name.startsWith("NIT Trichy,") ? "national-institute-of-technology-tiruchirappalli" : slugify(row.name);
const degree = (course: string): DegreeLevel => /Ph\.?D/i.test(course) ? "DOCTORAL" : /Certification|Certificate/.test(course) ? "CERTIFICATE" : /Diploma|Polytechnic/.test(course) ? "DIPLOMA" : /\+|BALLB|IPM|Pharm\.D/.test(course) ? "INTEGRATED" : /^(M\.|MBA|MCA|PG|EPGP|GMP)/.test(course) ? "POSTGRADUATE" : "UNDERGRADUATE";
const db = createCliDb();

async function main() {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!catalogueFacts(row)) throw new Error(`Invalid sourced facts: ${row.name}`);
    if (/Indian Institute of Technology|All India Institute of Medical Sciences|\bAIIMS\b|\bIIT\b/i.test(row.name)) throw new Error("IIT/AIIMS duplicate in state expansion");
    counts.set(row.state, (counts.get(row.state) || 0) + 1);
  }
  if (rows.length !== 280 || counts.size !== 28 || [...counts.values()].some(n => n !== 10) || new Set(rows.map(collegeSlug)).size !== 280) throw new Error("Expected 280 distinct colleges: ten in each of 28 states");
  await db.$transaction(async tx => {
    for (const row of rows) {
      const slug = collegeSlug(row);
      const data = {
        name: row.name, city: row.city, state: row.state, ownership: row.ownership,
        isDemo: false, sourceUrl: row.sourceUrl, verifiedAt: new Date(row.checkedAt),
        catalogueFacts: row as unknown as Prisma.InputJsonObject,
      };
      const college = await tx.college.upsert({ where: { slug },
        create: { slug, ...data, overview: `${row.name} is located in ${row.city}, ${row.state}. Explore its published fee reference${row.course ? ` for ${row.course}` : ""}, placement figures and reader rating below. Costs and outcomes depend on the programme and admission category.`,
          courseCoverage: "A selected programme is shown as a fee reference. This is not the institution's complete course catalogue; follow the source for other programmes and current admissions." },
        // Preserve existing programme coverage and institution descriptions.
        update: data });
      if (row.course) {
        const courseData = { name: row.course, discipline: row.discipline, degreeLevel: degree(row.course), durationMonths: row.durationMonths,
          annualFeeInr: row.annualFeeInr, feeBasis: row.annualFeeBasis || "TOTAL_ONLY", totalFeeInr: row.feeBasis === "Total Fees" ? row.feeInr : null,
          sourceUrl: row.courseSourceUrl || row.sourceUrl, verifiedAt: new Date(row.checkedAt),
          eligibility: "Consult the institution's current admission notice for exam, subject, category and quota requirements. The fee reference does not establish admission eligibility." };
        const courseSlug = slugify(row.course);
        await tx.course.upsert({ where: { collegeId_slug: { collegeId: college.id, slug: courseSlug } }, create: { collegeId: college.id, slug: courseSlug, ...courseData }, update: courseData });
      }
      if (row.medianSalaryInr && row.medianYear && row.medianSourceUrl) {
        await tx.placement.upsert({ where: { collegeId_year: { collegeId: college.id, year: row.medianYear } },
          create: { collegeId: college.id, year: row.medianYear, medianSalaryInr: row.medianSalaryInr, sourceUrl: row.medianSourceUrl },
          update: { medianSalaryInr: row.medianSalaryInr, sourceUrl: row.medianSourceUrl } });
      }
    }
  }, { timeout: 120000 });
  const imported = await db.college.count({ where: { slug: { in: rows.map(collegeSlug) } } });
  if (imported !== 280) throw new Error("Post-import count mismatch");
  console.log(`Imported and verified ${imported} state-catalogue colleges across ${counts.size} states. Existing saves and reviews preserved.`);
}
main().catch(error => { console.error(error instanceof Error ? error.message.replace(/postgres(?:ql)?:\/\/\S+/g, "[redacted]") : "State import failed"); process.exitCode = 1; }).finally(() => db.$disconnect());
