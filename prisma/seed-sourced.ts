import { createCliDb } from "./client";
import type { DegreeLevel } from "../src/generated/prisma/client";

const db = createCliDb();
const sourceUrl = "https://www.nitt.edu/home/academics/programmes/";
const verifiedAt = new Date("2026-09-12T00:00:00Z");
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
const engineering = ["Chemical Engineering", "Civil Engineering", "Computer Science and Engineering", "Electrical and Electronics Engineering", "Electronics and Communication Engineering", "Instrumentation and Control Engineering", "Mechanical Engineering", "Metallurgical and Materials Engineering", "Production Engineering"];
const groups: { prefix: string; names: string[]; discipline: string; degreeLevel: DegreeLevel; durationMonths: number | null }[] = [
  { prefix: "B.Tech.", names: engineering, discipline: "Engineering", degreeLevel: "UNDERGRADUATE", durationMonths: 48 },
  { prefix: "B.Arch.", names: ["Architecture"], discipline: "Architecture", degreeLevel: "UNDERGRADUATE", durationMonths: 60 },
  { prefix: "B.Sc. B.Ed.", names: ["Chemistry", "Mathematics", "Physics"], discipline: "Education", degreeLevel: "INTEGRATED", durationMonths: 48 },
  { prefix: "M.Tech.", names: ["Energy Engineering", "Chemical Engineering", "Process Control and Instrumentation", "Industrial Automation", "Transportation Engineering and Management", "Construction Technology and Management", "Structural Engineering", "Environmental Engineering", "Computer Science and Engineering", "Power Electronics", "Power Systems", "Communication Systems", "VLSI System", "Industrial Safety Engineering", "Thermal Power Engineering", "Materials Science and Engineering", "Industrial Metallurgy", "Welding Engineering", "Industrial Engineering and Management", "Manufacturing Technology", "Non-Destructive Testing", "Data Analytics", "Geotechnical Engineering", "Water Resources Engineering and Management", "Engineering Design"], discipline: "Engineering", degreeLevel: "POSTGRADUATE", durationMonths: 24 },
  { prefix: "M.Arch.", names: ["Energy Efficient and Sustainable Architecture"], discipline: "Architecture", degreeLevel: "POSTGRADUATE", durationMonths: 24 },
  { prefix: "M.Plan.", names: ["Urban Planning"], discipline: "Planning", degreeLevel: "POSTGRADUATE", durationMonths: 24 },
  { prefix: "M.Sc.", names: ["Computer Science", "Chemistry", "Physics", "Mathematics"], discipline: "Science", degreeLevel: "POSTGRADUATE", durationMonths: 24 },
  { prefix: "MBA", names: ["Business Administration"], discipline: "Management", degreeLevel: "POSTGRADUATE", durationMonths: 24 },
  { prefix: "MCA", names: ["Computer Applications"], discipline: "Computer Applications", degreeLevel: "POSTGRADUATE", durationMonths: 36 },
  { prefix: "M.A.", names: ["English (Language and Literature)"], discipline: "Arts", degreeLevel: "POSTGRADUATE", durationMonths: 24 },
  { prefix: "M.S. (by Research)", names: ["Engineering departments"], discipline: "Engineering", degreeLevel: "POSTGRADUATE", durationMonths: null },
  { prefix: "Ph.D.", names: [...engineering, "Architecture", "Chemistry", "Computer Applications", "Humanities", "Energy and Environment", "Management Studies", "Mathematics", "Physics"], discipline: "Research", degreeLevel: "DOCTORAL", durationMonths: null },
];
async function main() {
  const courses = groups.flatMap(group => group.names.map(name => ({ name: `${group.prefix} ${name}`, discipline: group.discipline, degreeLevel: group.degreeLevel, durationMonths: group.durationMonths, annualFeeInr: null, eligibility: "Programme-specific admission requirements must be checked in the current official admission notice.", sourceUrl, verifiedAt })));
  await db.$transaction(async tx => {
    const data = { name: "National Institute of Technology Tiruchirappalli", city: "Tiruchirappalli", state: "Tamil Nadu", ownership: "PUBLIC" as const, established: null, websiteUrl: "https://www.nitt.edu/", isDemo: false, sourceUrl, verifiedAt, courseCoverage: "Programmes transcribed from the official Academic Programmes page. Research programmes are listed at the level of detail provided there; admission availability and fees require the current prospectus.", overview: "NIT Tiruchirappalli offers programmes in engineering, architecture, planning, science, education, management and humanities. The programme catalogue below is sourced from the institute's official academic listing. Fees and placement statistics have not yet been verified for this profile." };
    const college = await tx.college.upsert({ where: { slug: "national-institute-of-technology-tiruchirappalli" }, create: { slug: "national-institute-of-technology-tiruchirappalli", ...data }, update: data });
    for (const course of courses) await tx.course.upsert({ where: { collegeId_slug: { collegeId: college.id, slug: slug(course.name) } }, create: { collegeId: college.id, slug: slug(course.name), ...course }, update: course });
    // CID decoded from the Google Maps entity observed during source review.
    const mapsUrl = "https://www.google.com/maps?cid=810109415413428314";
    const reviews = [
      { author: "Supratim Mondal", rating: 4, publishedLabel: "Edited 3 years ago", summary: "The reviewer praises the institution's academic and research reputation and describes the campus as spacious and green." },
      { author: "Utkarsh Sharma", rating: 5, publishedLabel: "4 years ago", summary: "The reviewer values the range of programmes and describes the faculty positively, recommending the institution to prospective students." },
    ];
    for (const review of reviews) await tx.externalReview.upsert({ where: { collegeId_provider_author: { collegeId: college.id, provider: "GOOGLE_MAPS", author: review.author } }, create: { collegeId: college.id, provider: "GOOGLE_MAPS", ...review, sourceUrl: mapsUrl, observedAt: verifiedAt }, update: { ...review, sourceUrl: mapsUrl, observedAt: verifiedAt } });
  }, { timeout: 60000 });
  console.log(`Sourced NIT Trichy profile: ${courses.length} programme entries, 2 attributed Google review summaries. No fees or placements invented.`);
}
main().catch(() => { console.error("Sourced import failed; transaction rolled back."); process.exitCode = 1; }).finally(() => db.$disconnect());
