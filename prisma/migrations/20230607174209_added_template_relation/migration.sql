-- AlterTable
ALTER TABLE "DocumentSubItem" ADD COLUMN     "documentTemplateId" INTEGER,
ALTER COLUMN "documentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DocumentSubItem" ADD CONSTRAINT "DocumentSubItem_documentTemplateId_fkey" FOREIGN KEY ("documentTemplateId") REFERENCES "TemplateDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
