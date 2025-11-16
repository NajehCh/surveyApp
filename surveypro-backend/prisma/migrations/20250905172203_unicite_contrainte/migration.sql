/*
  Warnings:

  - A unique constraint covering the columns `[id_enquete,id_question,id_option,email,value]` on the table `Response` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Response_id_enquete_id_question_id_option_email_value_key" ON "public"."Response"("id_enquete", "id_question", "id_option", "email", "value");
