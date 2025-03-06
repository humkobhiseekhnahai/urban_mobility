/*
  Warnings:

  - The primary key for the `Calendar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `endDate` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the `Routes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stops` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trips` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `end_date` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_id` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Calendar_serviceId_key";

-- AlterTable
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_pkey",
DROP COLUMN "endDate",
DROP COLUMN "id",
DROP COLUMN "serviceId",
DROP COLUMN "startDate",
ADD COLUMN     "end_date" INTEGER NOT NULL,
ADD COLUMN     "service_id" TEXT NOT NULL,
ADD COLUMN     "start_date" INTEGER NOT NULL,
ADD CONSTRAINT "Calendar_pkey" PRIMARY KEY ("service_id");

-- DropTable
DROP TABLE "Routes";

-- DropTable
DROP TABLE "Stops";

-- DropTable
DROP TABLE "Trips";

-- CreateTable
CREATE TABLE "Route" (
    "route_id" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "long_name" TEXT NOT NULL,
    "route_desc" TEXT,
    "text_color" TEXT,
    "type" INTEGER NOT NULL,
    "url" TEXT,
    "agency_id" TEXT NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("route_id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "stop_id" TEXT NOT NULL,
    "stop_name" TEXT NOT NULL,
    "stop_lat" TEXT NOT NULL,
    "stop_lon" TEXT NOT NULL,
    "stop_code" TEXT,
    "stop_desc" TEXT,
    "stop_timezone" TEXT,
    "stop_url" TEXT,
    "wheelchair_boarding" BOOLEAN,
    "zone_id" TEXT,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("stop_id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "trip_id" INTEGER NOT NULL,
    "trip_headsign" TEXT NOT NULL,
    "route_id" TEXT NOT NULL,
    "direction_id" INTEGER NOT NULL,
    "service_id" TEXT NOT NULL,
    "shape_id" TEXT,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("trip_id")
);

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "Agency"("agency_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("route_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Calendar"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;
