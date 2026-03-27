/*
  Warnings:

  - Made the column `overview` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "overview" SET NOT NULL;
