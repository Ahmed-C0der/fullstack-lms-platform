/*
  Warnings:

  - The `category` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[title]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructorId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Made the column `overview` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "category",
ADD COLUMN     "category" TEXT[];

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "lastLesson" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "instructorId" TEXT NOT NULL,
ALTER COLUMN "overview" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_title_key" ON "Course"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_title_key" ON "Lesson"("title");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
