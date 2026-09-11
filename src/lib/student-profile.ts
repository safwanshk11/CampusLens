import { z } from "zod";

const optionalNumber = (max: number) => z.preprocess(value => typeof value === "string" ? (value.trim() === "" ? null : Number(value)) : value, z.number().min(0).max(max).nullable());
export const studentProfileSchema = z.object({
  stream: z.enum(["Engineering", "Medical", "Other"]),
  tenth: optionalNumber(100),
  twelfth: optionalNumber(100),
  jeePercentile: optionalNumber(100),
  neetScore: optionalNumber(720),
  examYear: optionalNumber(2100),
  otherExam: z.string().trim().max(80),
  otherScore: z.string().trim().max(80),
  state: z.string().trim().max(80),
  interests: z.string().trim().max(200),
  budget: optionalNumber(10000000),
}).strict();
export type StudentProfile = z.infer<typeof studentProfileSchema>;

export function matchDemoCourse(profile: StudentProfile, course: { discipline: string; degreeLevel: string; annualFeeInr: number }, isDemo: boolean) {
  if (course.degreeLevel !== "UNDERGRADUATE" || profile.stream !== course.discipline) return null;
  if (profile.budget !== null && course.annualFeeInr > profile.budget) return null;
  if (!isDemo) return { status: "Requirements unavailable", reason: "Verified admission rules have not been added." };
  const exam = profile.stream === "Engineering" ? profile.jeePercentile : profile.stream === "Medical" ? profile.neetScore : null;
  const threshold = profile.stream === "Engineering" ? 70 : 350;
  const rule = profile.stream === "Engineering" ? "Class 12 ≥ 60%; JEE Main percentile ≥ 70" : "Class 12 ≥ 60%; NEET score ≥ 350";
  if (profile.twelfth === null || exam === null) return { status: "More information needed", reason: `Demo rule: ${rule}. Add missing scores in My account.` };
  return { status: profile.twelfth >= 60 && exam >= threshold ? "Meets demo criteria" : "Below demo criteria", reason: `Demo rule: ${rule}. These invented thresholds do not establish real eligibility.` };
}
