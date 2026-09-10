-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Ownership" AS ENUM ('PUBLIC', 'PRIVATE', 'DEEMED');

-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA');

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "ownership" "Ownership" NOT NULL,
    "established" INTEGER NOT NULL,
    "overview" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "imageUrl" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "degreeLevel" "DegreeLevel" NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "annualFeeInr" INTEGER NOT NULL,
    "eligibility" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placement" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "medianSalaryInr" INTEGER,
    "averageSalaryInr" INTEGER,
    "highestSalaryInr" INTEGER,
    "eligibleStudents" INTEGER,
    "placedStudents" INTEGER,
    "sourceUrl" TEXT,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCollege" (
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedCollege_pkey" PRIMARY KEY ("userId","collegeId")
);

-- CreateTable
CREATE TABLE "SavedComparison" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedComparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonCollege" (
    "comparisonId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ComparisonCollege_pkey" PRIMARY KEY ("comparisonId","collegeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE INDEX "College_state_city_idx" ON "College"("state", "city");

-- CreateIndex
CREATE INDEX "College_ownership_idx" ON "College"("ownership");

-- CreateIndex
CREATE INDEX "College_name_idx" ON "College"("name");

-- CreateIndex
CREATE INDEX "Course_annualFeeInr_idx" ON "Course"("annualFeeInr");

-- CreateIndex
CREATE INDEX "Course_discipline_degreeLevel_idx" ON "Course"("discipline", "degreeLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Course_collegeId_slug_key" ON "Course"("collegeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Placement_collegeId_year_key" ON "Placement"("collegeId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Review_collegeId_idx" ON "Review"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_collegeId_key" ON "Review"("userId", "collegeId");

-- CreateIndex
CREATE INDEX "SavedCollege_collegeId_idx" ON "SavedCollege"("collegeId");

-- CreateIndex
CREATE INDEX "SavedComparison_userId_createdAt_idx" ON "SavedComparison"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ComparisonCollege_collegeId_idx" ON "ComparisonCollege"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "ComparisonCollege_comparisonId_position_key" ON "ComparisonCollege"("comparisonId", "position");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedComparison" ADD CONSTRAINT "SavedComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonCollege" ADD CONSTRAINT "ComparisonCollege_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "SavedComparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonCollege" ADD CONSTRAINT "ComparisonCollege_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Domain invariants also protect writes made outside Prisma.
ALTER TABLE "College" ADD CONSTRAINT "College_established_check" CHECK ("established" BETWEEN 1000 AND 2100);
ALTER TABLE "Course" ADD CONSTRAINT "Course_values_check" CHECK ("annualFeeInr" >= 0 AND "durationMonths" > 0);
ALTER TABLE "Review" ADD CONSTRAINT "Review_rating_check" CHECK ("rating" BETWEEN 1 AND 5);
ALTER TABLE "User" ADD CONSTRAINT "User_email_normalized_check" CHECK ("email" = lower(trim("email")) AND length("email") > 3);
ALTER TABLE "ComparisonCollege" ADD CONSTRAINT "ComparisonCollege_position_check" CHECK ("position" BETWEEN 0 AND 3);
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_values_check" CHECK (
  "year" BETWEEN 1900 AND 2100
  AND ("medianSalaryInr" IS NULL OR "medianSalaryInr" >= 0)
  AND ("averageSalaryInr" IS NULL OR "averageSalaryInr" >= 0)
  AND ("highestSalaryInr" IS NULL OR "highestSalaryInr" >= 0)
  AND ("eligibleStudents" IS NULL OR "eligibleStudents" >= 0)
  AND ("placedStudents" IS NULL OR "placedStudents" >= 0)
  AND ("placedStudents" IS NULL OR "eligibleStudents" IS NULL OR "placedStudents" <= "eligibleStudents")
  AND ("highestSalaryInr" IS NULL OR "medianSalaryInr" IS NULL OR "highestSalaryInr" >= "medianSalaryInr")
  AND ("highestSalaryInr" IS NULL OR "averageSalaryInr" IS NULL OR "highestSalaryInr" >= "averageSalaryInr")
);
