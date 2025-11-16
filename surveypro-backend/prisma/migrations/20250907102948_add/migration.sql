-- CreateTable
CREATE TABLE "public"."EmailList" (
    "id_email" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailList_pkey" PRIMARY KEY ("id_email")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailList_email_key" ON "public"."EmailList"("email");
