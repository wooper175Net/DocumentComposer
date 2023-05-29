-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_caseId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentSubItem" DROP CONSTRAINT "DocumentSubItem_documentId_fkey";

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentSubItem" ADD CONSTRAINT "DocumentSubItem_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
