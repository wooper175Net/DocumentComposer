-- CreateTable
CREATE TABLE "TemplateDocument" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "desc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateDocument_pkey" PRIMARY KEY ("id")
);
