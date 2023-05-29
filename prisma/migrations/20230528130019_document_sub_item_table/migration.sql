-- CreateTable
CREATE TABLE "DocumentSubItem" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "documentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentSubItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocumentSubItem" ADD CONSTRAINT "DocumentSubItem_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
