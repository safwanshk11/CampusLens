ALTER TABLE "College" ALTER COLUMN "established" DROP NOT NULL;
ALTER TABLE "Course" ALTER COLUMN "annualFeeInr" DROP NOT NULL;
ALTER TABLE "College" ADD COLUMN "sourceUrl" TEXT, ADD COLUMN "sourceCheckedAt" TIMESTAMP(3), ADD COLUMN "institutionGroup" TEXT;
