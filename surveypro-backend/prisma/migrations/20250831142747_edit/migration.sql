/*
  Warnings:

  - Made the column `id_question` on table `Option` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Option" ALTER COLUMN "id_question" SET NOT NULL;
