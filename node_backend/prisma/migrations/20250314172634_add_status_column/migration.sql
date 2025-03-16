/*
  Warnings:

  - Added the required column `status` to the `SuggestedRoute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SuggestedRoute" ADD COLUMN     "status" TEXT NOT NULL;
