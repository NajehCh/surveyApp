import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateEnqueteDTO ,EnqueteStatus} from "./Dtos/create-enquete.dto";
import { UpdateEnqueteDTO } from "./Dtos/update-enquete.dto";

@Injectable()
export class EnquetesService {
  constructor(private prisma: PrismaService) {}

  async getAllEnquetes() {
    const enquetes= await this.prisma.enquete.findMany({
      orderBy: { startDate: 'desc' }, 
    });
    return enquetes;
  }
  

  async getEnqueteById(id_enquete: string) {
    const enquete = await this.prisma.enquete.findUnique({
      where: { id_enquete },
    });
    return enquete;
  }
  
  
  async createEnquete(createEnqueteDto: CreateEnqueteDTO) {
    console.log("hello")
    const { questions, ...enqueteData } = createEnqueteDto;
  
    return this.prisma.enquete.create({
      data: {
        ...enqueteData,
      },
    });
  }
  async updateEnquete(id_enquete: string, updateEnqueteDto: UpdateEnqueteDTO) {
    const { questions, ...enqueteData } = updateEnqueteDto;
    const enquete = await this.prisma.enquete.findUnique({
      where : {id_enquete}
    })
    if (!enquete){
      throw new NotFoundException(`Enquete with id ${id_enquete} NOT FOUND`)
    }
    if(enquete.status==="active"){
      await this.changeStatusEnquete(id_enquete,EnqueteStatus.draft)
    }
    // Met à jour l'enquête existante
    return this.prisma.enquete.update({
      where: { id_enquete: id_enquete },
      data: {
        ...enqueteData,
      },
    });
  }



  async deleteEnquete(id_enquete: string) {
    const enquete = await this.prisma.enquete.findUnique({
      where : {id_enquete}
    })
    if (!enquete){
      throw new NotFoundException(`Enquete with id ${id_enquete} NOT FOUND`)
    }

    return await this.prisma.enquete.delete({
      where:{id_enquete}
    })
  }


  async getUserEnqueteById(id_enquete: string) {
    const enquete = await this.prisma.enquete.findUnique({
      where: { id_enquete },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });
    console.log(enquete)
    return enquete;
    
  }

  async changeStatusEnquete(id_enquete:string,status:EnqueteStatus){
    //recupere l'enquete 
    const enquete = await this.prisma.enquete.findUnique({
      where: {id_enquete}
    })
    if (!enquete){
      throw new NotFoundException(`Enquete with id ${id_enquete} NOT FOUND`)
    }
    if (!["draft", "active", "closed"].includes(status)) {
      throw new BadRequestException(`status invalid`);
    }
    if(enquete.status==="closed"){
      throw new BadRequestException("This enquete is closed and cannot change status.");
    }
    // Bloquer la publication si la date de fin est déjà passée
    if (status === "active" && enquete.endDate < new Date()) {
      throw new BadRequestException("Impossible de publier une enquête dont la date de fin est dépassée.");
    }
    return this.prisma.enquete.update({
      where: { id_enquete },
      data: { 
        status,
        isPublish: status === "active" ? true : false        },
    });
  }
  
}
