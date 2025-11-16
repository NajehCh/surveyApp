/*
  Warnings:

  - The values [DRAFT,ACTIVE,CLOSED] on the enum `EnqueteStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EnqueteStatus_new" AS ENUM ('draft', 'active', 'closed');
ALTER TABLE "public"."Enquete" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Enquete" ALTER COLUMN "status" TYPE "public"."EnqueteStatus_new" USING ("status"::text::"public"."EnqueteStatus_new");
ALTER TYPE "public"."EnqueteStatus" RENAME TO "EnqueteStatus_old";
ALTER TYPE "public"."EnqueteStatus_new" RENAME TO "EnqueteStatus";
DROP TYPE "public"."EnqueteStatus_old";
ALTER TABLE "public"."Enquete" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Enquete" ALTER COLUMN "status" SET DEFAULT 'draft';
