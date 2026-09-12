CREATE TABLE "ExternalReview" (
  "id" TEXT NOT NULL,
  "collegeId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "summary" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "publishedLabel" TEXT NOT NULL,
  "observedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExternalReview_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ExternalReview_collegeId_provider_author_key" ON "ExternalReview"("collegeId", "provider", "author");
ALTER TABLE "ExternalReview" ADD CONSTRAINT "ExternalReview_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
