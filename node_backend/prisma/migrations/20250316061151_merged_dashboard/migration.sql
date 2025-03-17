/*
  Warnings:

  - Added the required column `status` to the `SuggestedRoute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SuggestedRoute" ADD COLUMN     "status" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CustomRoute" (
    "id" SERIAL NOT NULL,
    "routeNumber" TEXT NOT NULL,
    "routeName" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "departureTimes" JSONB NOT NULL,
    "mapJsonContent" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomRoute_routeNumber_key" ON "CustomRoute"("routeNumber");
