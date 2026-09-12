import "server-only";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { catalogueFacts } from "@/lib/catalogue-facts";

/** Shared by metadata, the page and the API. Never select private user fields. */
export const getCollegeDetail = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 160)
    return null;
  return getDb().$transaction(
    async (tx) => {
      const college = await tx.college.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          name: true,
          city: true,
          state: true,
          ownership: true,
          established: true,
          overview: true,
          isDemo: true,
          sourceUrl: true,
          verifiedAt: true,
          courseCoverage: true,
          catalogueFacts: true,
          externalReviews: { select: { id: true, provider: true, author: true, rating: true, summary: true, sourceUrl: true, publishedLabel: true, observedAt: true }, orderBy: { observedAt: "desc" } },
      websiteUrl: true,
      imageUrl: true,
          courses: {
            orderBy: [{ annualFeeInr: "asc" }, { id: "asc" }],
            select: {
              id: true,
              name: true,
              discipline: true,
              degreeLevel: true,
              durationMonths: true,
              annualFeeInr: true,
              feeBasis: true,
              totalFeeInr: true,
              eligibility: true,
              sourceUrl: true,
              verifiedAt: true,
            },
          },
          placements: {
            orderBy: { year: "desc" },
            select: {
              year: true,
              medianSalaryInr: true,
              averageSalaryInr: true,
              highestSalaryInr: true,
              eligibleStudents: true,
              placedStudents: true,
              sourceUrl: true,
            },
          },
          reviews: {
            take: 20,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            select: {
              id: true,
              title: true,
              body: true,
              rating: true,
              isDemo: true,
              createdAt: true,
            },
          },
        },
      });
      if (!college) return null;
      const ratings = await tx.review.aggregate({
        where: { collegeId: college.id },
        _avg: { rating: true },
        _count: true,
      });
      const facts = catalogueFacts(college.catalogueFacts);
      return {
        ...college,
        averageRating: ratings._avg.rating ?? facts?.rating ?? null,
        reviewCount: ratings._avg.rating === null ? (facts?.ratingCount ?? 0) : ratings._count,
        ratingProvider: ratings._avg.rating === null && facts?.rating != null ? facts.ratingProvider : "CampusLens",
      };
    },
    { isolationLevel: "RepeatableRead" },
  );
});
