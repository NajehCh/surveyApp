/*
  Warnings:

  - Added the required column `type` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('radio', 'select', 'checkbox', 'text', 'rating', 'yes_no');

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "public"."QuestionType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Option" (
    "id_option" TEXT NOT NULL,
    "text_option" TEXT NOT NULL,
    "id_question" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id_option")
);

-- AddForeignKey
ALTER TABLE "public"."Option" ADD CONSTRAINT "Option_id_question_fkey" FOREIGN KEY ("id_question") REFERENCES "public"."Question"("id_question") ON DELETE CASCADE ON UPDATE CASCADE;
