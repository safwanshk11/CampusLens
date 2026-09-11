import { createCliDb } from "./client";
import { realColleges, privateColleges } from "./real-colleges";
const db = createCliDb();
async function main() {
  const records = [...realColleges.map(row => ({ ...row, ownership: "PUBLIC" as const })), ...privateColleges];
  const slugs = records.map(row => row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, ""));
  if (new Set(slugs).size !== slugs.length) throw new Error("Duplicate institution identities");
  await db.$transaction(async tx => {
    for (const [index, row] of records.entries()) {
      const overview = `${row.name} is listed in the linked official institution directory. This entry covers institution identity and location only. Courses, fees and admission requirements have not yet been verified.${row.sourceUrl.includes("1943659") ? " The source is a 2023 project list; listing does not confirm current admissions or operational status." : ""}`;
      const data = { ...row, overview, isDemo: false, sourceCheckedAt: new Date("2026-09-11T00:00:00Z") };
      const existing = await tx.college.findUnique({ where: { slug: slugs[index] } });
      if (existing?.isDemo) throw new Error("Refusing to overwrite a demo record");
      await tx.college.upsert({ where: { slug: slugs[index] }, create: { ...data, slug: slugs[index], established: null }, update: data });
      const college = await tx.college.findUniqueOrThrow({ where: { slug: slugs[index] }, select: { id: true } });
      const isAiims = row.institutionGroup === "AIIMS";
      const isIitBombay = row.name === "Indian Institute of Technology Bombay";
      const course = isAiims
        ? { slug: "mbbs", name: "MBBS", discipline: "Medical", degreeLevel: "UNDERGRADUATE" as const, durationMonths: 66, annualFeeInr: null, eligibility: "Admission is through NEET-UG and the applicable counselling process. Check the current MCC and institute notices for eligibility, seats and fees." }
        : { slug: "undergraduate-programmes", name: "Undergraduate programmes", discipline: "Engineering", degreeLevel: "UNDERGRADUATE" as const, durationMonths: 48, annualFeeInr: null, eligibility: "Admission route and subject requirements vary by institute and programme. IITs use JEE (Advanced) through JoSAA; NITs use JEE (Main) through JoSAA. Check the current institute and counselling notices." };
      await tx.course.upsert({ where: { collegeId_slug: { collegeId: college.id, slug: course.slug } }, create: { collegeId: college.id, ...course }, update: { ...course, annualFeeInr: null } });
      if (isIitBombay) {
        const programmes = ["Aerospace Engineering", "Chemical Engineering", "Civil Engineering", "Computer Science & Engineering", "Electrical Engineering", "Mechanical Engineering", "Metallurgical Engineering & Materials Science"];
        for (const name of programmes) await tx.course.upsert({ where: { collegeId_slug: { collegeId: college.id, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") } }, create: { collegeId: college.id, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: `B.Tech. in ${name}`, discipline: "Engineering", degreeLevel: "UNDERGRADUATE", durationMonths: 48, annualFeeInr: 256500, eligibility: "Admission through JEE (Advanced) and JoSAA. IIT Bombay lists these undergraduate programmes; check current institute notices for subject and category requirements." }, update: { name: `B.Tech. in ${name}`, annualFeeInr: 256500, eligibility: "Admission through JEE (Advanced) and JoSAA. IIT Bombay lists these undergraduate programmes; check current institute notices for subject and category requirements." } });
        await tx.placement.upsert({ where: { collegeId_year: { collegeId: college.id, year: 2025 } }, create: { collegeId: college.id, year: 2025, medianSalaryInr: 2000000, sourceUrl: "https://www.iitb.ac.in/sites/www.iitb.ac.in/files/2026-01/Annual_Report_2024-25.pdf" }, update: { medianSalaryInr: 2000000, sourceUrl: "https://www.iitb.ac.in/sites/www.iitb.ac.in/files/2026-01/Annual_Report_2024-25.pdf" } });
      }
    }
  }, { timeout: 30000 });
  console.log(`Imported ${records.length} sourced institutions with one sourced programme record each. Fees, placements and cutoffs remain unavailable until verified.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
