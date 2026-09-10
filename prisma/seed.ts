import { createCliDb } from "./client";
import { courseTemplates, demoColleges, demoSlug } from "./seed-data";

const db = createCliDb();
async function main() {
  // All-or-nothing and repeatable. No deletes; unrelated records stay intact.
  await db.$transaction(async (tx) => {
    for (const [index, [name, city, state]] of demoColleges.entries()) {
      const slug = demoSlug(name);
      const existing = await tx.college.findUnique({ where: { slug } });
      if (existing && !existing.isDemo) throw new Error(`Refusing to overwrite non-demo college: ${slug}`);
      const data = {
        name, city, state, isDemo: true,
        ownership: (["PUBLIC", "PRIVATE", "DEEMED"] as const)[index % 3],
        established: 1960 + index * 4,
        overview: `${name} is a fictional college used to demonstrate CampusLens. All courses, fees, reviews and placement figures are illustrative, not admissions guidance.`,
      };
      const college = await tx.college.upsert({ where: { slug }, create: { slug, ...data }, update: data });
      for (const [courseIndex, template] of courseTemplates.entries()) {
        const course = { ...template, annualFeeInr: 40000 + index * 18000 + courseIndex * 12000, eligibility: "Illustrative: relevant prior qualification; actual admission requirements are not available." };
        await tx.course.upsert({ where: { collegeId_slug: { collegeId: college.id, slug: template.slug } }, create: { collegeId: college.id, ...course }, update: course });
      }
      // Last college intentionally has no placements; another has missing metrics.
      if (index < demoColleges.length - 1) {
        for (const year of [2024, 2025]) {
          const placement = {
            medianSalaryInr: index === 9 ? null : 400000 + index * 45000,
            averageSalaryInr: 500000 + index * 50000,
            highestSalaryInr: 1200000 + index * 100000,
            eligibleStudents: 200, placedStudents: 120 + index * 5,
          };
          await tx.placement.upsert({ where: { collegeId_year: { collegeId: college.id, year } }, create: { collegeId: college.id, year, ...placement }, update: placement });
        }
      }
      // No login credentials or real identities are created.
      if (index < 10) {
        const userId = `demo-reviewer-${index}`;
        await tx.user.upsert({ where: { id: userId }, create: { id: userId, email: `reviewer-${index}@campuslens.example`, name: `Illustrative reviewer ${index + 1}` }, update: {} });
        const review = { rating: 3 + index % 3, title: "Illustrative campus review", body: "Fictional review for testing rating display. This is not a student testimonial.", isDemo: true };
        await tx.review.upsert({ where: { userId_collegeId: { userId, collegeId: college.id } }, create: { userId, collegeId: college.id, ...review }, update: review });
      }
    }
  }, { timeout: 30000 });
  console.log("Seed complete: 12 fictional colleges, 36 courses, 22 placement records, 10 illustrative reviews. No login credentials created.");
}
main().catch(() => { console.error("Seed failed; transaction rolled back. Check connection and migration status."); process.exitCode = 1; }).finally(() => db.$disconnect());
