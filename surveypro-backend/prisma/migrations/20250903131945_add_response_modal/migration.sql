-- CreateTable
CREATE TABLE "public"."Response" (
    "id_response" TEXT NOT NULL,
    "id_enquete" TEXT NOT NULL,
    "id_question" TEXT NOT NULL,
    "id_option" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id_response")
);

-- CreateIndex
CREATE UNIQUE INDEX "Response_email_key" ON "public"."Response"("email");
