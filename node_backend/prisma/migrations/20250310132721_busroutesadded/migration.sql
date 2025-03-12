-- CreateTable
CREATE TABLE "BusRoute" (
    "id" SERIAL NOT NULL,
    "routeNumber" TEXT NOT NULL,
    "routeName" TEXT NOT NULL,
    "stops" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusRoute_routeNumber_key" ON "BusRoute"("routeNumber");
