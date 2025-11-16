/*
  Warnings:

  - Added the required column `categorie` to the `Enquete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Enquete" ADD COLUMN     "categorie" TEXT NOT NULL;
