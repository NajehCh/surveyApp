/*
  Warnings:

  - You are about to drop the column `categorie` on the `Enquete` table. All the data in the column will be lost.
  - Added the required column `category` to the `Enquete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Enquete" DROP COLUMN "categorie",
ADD COLUMN     "category" TEXT NOT NULL;
