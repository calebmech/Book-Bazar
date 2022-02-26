/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,deptId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[abbreviation]` on the table `Dept` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hashedToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hashedToken]` on the table `VerificationEmail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_BookToCourse` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Book_isbn_key";

-- DropIndex
DROP INDEX "Course_code_deptId_key";

-- DropIndex
DROP INDEX "Dept_abbreviation_key";

-- DropIndex
DROP INDEX "Session_hashedToken_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "VerificationEmail_hashedToken_key";

-- DropIndex
DROP INDEX "_BookToCourse_AB_unique";

-- DropIndex
DROP INDEX "_BookToCourse_B_index";

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE INDEX "Book_isbn_idx" ON "Book" USING HASH ("isbn");

-- CreateIndex
CREATE INDEX "Course_code_idx" ON "Course" USING HASH ("code");

-- CreateIndex
CREATE INDEX "Course_deptId_idx" ON "Course" USING HASH ("deptId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_deptId_key" ON "Course"("code", "deptId");

-- CreateIndex
CREATE UNIQUE INDEX "Dept_abbreviation_key" ON "Dept"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "Session_hashedToken_key" ON "Session"("hashedToken");

-- CreateIndex
CREATE INDEX "Session_hashedToken_idx" ON "Session" USING HASH ("hashedToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User" USING HASH ("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationEmail_hashedToken_key" ON "VerificationEmail"("hashedToken");

-- CreateIndex
CREATE UNIQUE INDEX "_BookToCourse_AB_unique" ON "_BookToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToCourse_B_index" ON "_BookToCourse"("B");
