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
    }
  }, { timeout: 30000 });
  console.log(`Imported ${records.length} sourced institutions. No course, fee, placement or admission claims created.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
