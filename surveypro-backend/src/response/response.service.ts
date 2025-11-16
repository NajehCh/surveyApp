import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResponseDTO } from './Dtos/create-response.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ResponseService {
  constructor(private prisma: PrismaService) {}

  async createResponse(createResponseDTO: CreateResponseDTO) {
    const { id_enquete, email, answers } = createResponseDTO;
console.log(id_enquete)
    // Vérifier si l’enquête existe
    const enquete = await this.prisma.enquete.findUnique({
      where: { id_enquete },
    });
    if (!enquete) {
      throw new NotFoundException(`Enquete with id ${id_enquete} NOT FOUND`);
    }
    if (!enquete.isPublish) {
      throw new NotFoundException(`Enquete n'est pas publiéé`);
    }
    // Vérifier si l’email est connu, sinon l’ajouter
    const emailExists = await this.prisma.emailList.findUnique({ where: { email } });
    if (!emailExists) {
      await this.prisma.emailList.create({ data: { email } });
    }

    // Vérifier si une réponse existe déjà pour ce couple (id_enquete + email)
    const existingResponse = await this.prisma.response.findFirst({
      where: { id_enquete, email },
    });
    if (existingResponse) {
      throw new ConflictException(`Response already exists for this email and enquete`);
    }

    // 🔑 Transformer DTO -> objet JSON simple
    const plainAnswers = instanceToPlain(answers) as Prisma.JsonValue;

    return this.prisma.response.create({
      data: {
        id_enquete,
        email,
        answers: plainAnswers as Prisma.InputJsonValue, 
      },
    });
  }



  async getAllResponses() {
    const responses= await this.prisma.response.findMany({ });
    return responses;
  }
  async getAllResponsesbyEnquete(id_enquete) {
    const responses= await this.prisma.response.findMany({
      where:{id_enquete:id_enquete}
    });
    return responses;
  }

}
