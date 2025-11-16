-- CreateEnum
CREATE TYPE "public"."EnqueteStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');

-- AlterTable
ALTER TABLE "public"."Enquete" ADD COLUMN     "status" "public"."EnqueteStatus" NOT NULL DEFAULT 'DRAFT';
