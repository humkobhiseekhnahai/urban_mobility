-- CreateTable
CREATE TABLE "OptimizedRoute" (
    "id" SERIAL NOT NULL,
    "routeNumber" TEXT NOT NULL,
    "routeName" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "transferPoint" TEXT NOT NULL,
    "transferRoute" TEXT NOT NULL,
    "departureTimes" JSONB NOT NULL,
    "mapJsonContent" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptimizedRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OptimizedRoute_routeNumber_key" ON "OptimizedRoute"("routeNumber");
