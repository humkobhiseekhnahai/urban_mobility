/*
  Warnings:

  - Changed the type of `coordinates` on the `SuggestedRoute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SuggestedRoute" DROP COLUMN "coordinates";
ALTER TABLE "SuggestedRoute" ADD COLUMN "coordinates" JSONB NOT NULL DEFAULT '[]';
