-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "heading" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "desc" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "caseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
