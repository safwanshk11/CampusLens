import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { currentUser } from "@/server/auth/session";
import { getDb } from "@/lib/db";
import { matchDemoCourse, studentProfileSchema } from "@/lib/student-profile";

export const metadata = { title: "Your matches" };
export default async function MatchesPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in?next=%2Fmatches");
  const record = await getDb().user.findUniqueOrThrow({ where: { id: user.id }, select: { studentProfile: true } });
  const profile = studentProfileSchema.safeParse(record.studentProfile);
  if (!profile.success) redirect("/account?onboarding=1");
  const colleges = await getDb().college.findMany({ include: { courses: true }, orderBy: { name: "asc" } });
  const results = colleges.flatMap(college => college.courses.flatMap(course => {
    const match = matchDemoCourse(profile.data, course, college.isDemo);
    return match ? [{ college, course, ...match }] : [];
  })).sort((a, b) => Number(b.status === "Meets demo criteria") - Number(a.status === "Meets demo criteria"));
  return <Container className="pt-36 pb-24 sm:pt-40">
    <p className="eyebrow mb-4 text-azure-ink">CampusLens / Your matches</p>
    <h1 className="text-display-page">Options for your next chapter.</h1>
    <p className="mt-5 max-w-3xl text-body text-ink-secondary">These results use illustrative admission rules for fictional colleges. They are not a list of real colleges you can apply to or a prediction of admission. We match your stream, Class 12 score, relevant entrance result and budget. Other profile details are saved for future matching.</p>
    <div className="my-8 flex gap-3"><ButtonLink href="/account" variant="secondary">Edit your profile</ButtonLink><ButtonLink href="/discover" variant="ghost">Browse all colleges</ButtonLink></div>
    {!results.length && <Card surface="quiet"><h2 className="text-xl font-medium">No matching course data yet</h2><p className="mt-3 text-ink-secondary">The current dataset has no courses matching your stream and budget. Medical admission data has not been added yet. You can keep exploring or update your preferences.</p></Card>}
    <div className="grid gap-5 md:grid-cols-2">{results.map(({ college, course, status, reason }) => <Card key={course.id} surface="solid" interactive className="relative">
      <p className="eyebrow text-azure-ink">{status}</p><h2 className="mt-4 text-xl font-medium">{college.name}</h2><p className="mt-2 text-label">{course.name} · {college.city}</p><p className="mt-2 text-label">₹{course.annualFeeInr.toLocaleString("en-IN")} / year</p><p className="mt-4 text-label text-ink-secondary">{reason}</p><Link href={`/colleges/${college.slug}`} className="absolute inset-0 rounded-card focus-visible:outline-2 focus-visible:outline-focus" aria-label={`View ${college.name}: ${course.name}`} />
    </Card>)}</div>
  </Container>;
}
