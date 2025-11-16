/*
  Warnings:

  - Added the required column `value` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Response_email_key";

-- AlterTable
ALTER TABLE "public"."Response" ADD COLUMN     "value" TEXT NOT NULL,
ALTER COLUMN "id_option" DROP NOT NULL;
