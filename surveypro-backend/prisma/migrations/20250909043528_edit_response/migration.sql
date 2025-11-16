/*
  Warnings:

  - You are about to drop the column `id_option` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `id_question` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Response` table. All the data in the column will be lost.
  - Added the required column `answers` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Response_id_enquete_id_question_id_option_email_value_key";

-- AlterTable
ALTER TABLE "public"."Response" DROP COLUMN "id_option",
DROP COLUMN "id_question",
DROP COLUMN "value",
ADD COLUMN     "answers" JSONB NOT NULL;
