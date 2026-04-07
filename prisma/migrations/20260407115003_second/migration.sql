-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'mandor';

-- CreateTable
CREATE TABLE "lands" (
    "id" SERIAL NOT NULL,
    "landName" TEXT NOT NULL,
    "areaSize" DOUBLE PRECISION NOT NULL,
    "locationAddress" TEXT,
    "coordinates" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mandorId" TEXT NOT NULL,

    CONSTRAINT "lands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plants" (
    "id" SERIAL NOT NULL,
    "variety" TEXT NOT NULL,
    "activeBranches" INTEGER NOT NULL,
    "plantedAt" TIMESTAMP(3),
    "locationCoordinate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "landId" INTEGER NOT NULL,

    CONSTRAINT "plants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatment_logs" (
    "id" SERIAL NOT NULL,
    "activityType" TEXT NOT NULL,
    "description" TEXT,
    "executionDate" TIMESTAMP(3) NOT NULL,
    "landId" INTEGER NOT NULL,
    "mandorId" TEXT NOT NULL,

    CONSTRAINT "treatment_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatment_documentations" (
    "id" SERIAL NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "caption" TEXT,
    "takenAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "treatmentLogId" INTEGER NOT NULL,

    CONSTRAINT "treatment_documentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "harvests" (
    "id" SERIAL NOT NULL,
    "harvestDate" TIMESTAMP(3) NOT NULL,
    "totalWeight" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "landId" INTEGER NOT NULL,
    "mandorId" TEXT NOT NULL,
    "photoEvidenceId" INTEGER,

    CONSTRAINT "harvests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "activityType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "landId" INTEGER NOT NULL,
    "mandorId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lands" ADD CONSTRAINT "lands_mandorId_fkey" FOREIGN KEY ("mandorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plants" ADD CONSTRAINT "plants_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_logs" ADD CONSTRAINT "treatment_logs_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_logs" ADD CONSTRAINT "treatment_logs_mandorId_fkey" FOREIGN KEY ("mandorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_documentations" ADD CONSTRAINT "treatment_documentations_treatmentLogId_fkey" FOREIGN KEY ("treatmentLogId") REFERENCES "treatment_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvests" ADD CONSTRAINT "harvests_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvests" ADD CONSTRAINT "harvests_mandorId_fkey" FOREIGN KEY ("mandorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvests" ADD CONSTRAINT "harvests_photoEvidenceId_fkey" FOREIGN KEY ("photoEvidenceId") REFERENCES "treatment_documentations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_mandorId_fkey" FOREIGN KEY ("mandorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
