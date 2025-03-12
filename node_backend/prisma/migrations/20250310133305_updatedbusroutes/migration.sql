/*
  Warnings:

  - You are about to drop the column `stops` on the `BusRoute` table. All the data in the column will be lost.
  - Added the required column `departureTimes` to the `BusRoute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mapJsonContent` to the `BusRoute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `BusRoute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusRoute" DROP COLUMN "stops",
ADD COLUMN     "departureTimes" TEXT NOT NULL,
ADD COLUMN     "mapJsonContent" JSONB NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL;
