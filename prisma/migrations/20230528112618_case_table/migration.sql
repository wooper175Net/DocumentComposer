-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
