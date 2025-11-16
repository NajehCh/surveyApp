-- CreateTable
CREATE TABLE "public"."Question" (
    "id_question" TEXT NOT NULL,
    "text_question" TEXT NOT NULL,
    "id_enquete" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id_question")
);

-- CreateTable
CREATE TABLE "public"."Enquete" (
    "id_enquete" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "enquete_name" TEXT NOT NULL,

    CONSTRAINT "Enquete_pkey" PRIMARY KEY ("id_enquete")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id_admin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_id_enquete_fkey" FOREIGN KEY ("id_enquete") REFERENCES "public"."Enquete"("id_enquete") ON DELETE CASCADE ON UPDATE CASCADE;
