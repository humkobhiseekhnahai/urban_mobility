/*
  Warnings:

  - The primary key for the `Agency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `lang` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Agency` table. All the data in the column will be lost.
  - Added the required column `agency_id` to the `Agency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agency_name` to the `Agency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agency_timezone` to the `Agency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agency_url` to the `Agency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "lang",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "timezone",
DROP COLUMN "url",
ADD COLUMN     "agency_fare_url" TEXT,
ADD COLUMN     "agency_id" TEXT NOT NULL,
ADD COLUMN     "agency_lang" TEXT,
ADD COLUMN     "agency_name" TEXT NOT NULL,
ADD COLUMN     "agency_phone" TEXT,
ADD COLUMN     "agency_timezone" TEXT NOT NULL,
ADD COLUMN     "agency_url" TEXT NOT NULL,
ADD CONSTRAINT "Agency_pkey" PRIMARY KEY ("agency_id");
