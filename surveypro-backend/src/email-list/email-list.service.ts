import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { CreateEmailListDto } from './dto/create-email-list.dto';
import { UpdateEmailListDto } from './dto/update-email-list.dto';
import { Subject } from 'rxjs';

@Injectable()
export class EmailListService {
  private transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
      },
    });
  }


  async sendEnquete(emails: string[], id_enquete: string) {
    if (!emails || emails.length === 0) {
      return { success: false, message: 'Aucun destinataire' };
    }
    const enquete = await this.prisma.enquete.findUnique({
      where : {id_enquete }
    })
    if(!enquete){
      throw new NotFoundException(`Enquete with this id ${id_enquete} NOT FOUND`)
    }
    const link = `${process.env.FRONTOFFICE_URL}/enquetes/${id_enquete}`
   
    try{
      const senPromises = emails.map(email =>{
        this.transporter.sendMail({
          from : `SurveyPro ${process.env.SMTP_USER}`,
          to : email,
          subject : "Answer this survey",
          html:`<a>${link}</a>`
        })
      });
      const results = await Promise.all(senPromises)
      return{
        success: true,
        message: `${results.length} emails envoyés`
      }
    }catch (err) {
      console.error('Email sending error', err);
      throw new InternalServerErrorException('Erreur envoi emails');
  }
}
  

  async addEmail(createEmailListDto : CreateEmailListDto) {
    const email = await this.prisma.emailList.findUnique({
      where :{ email : createEmailListDto.email}
    })
    if(email){
      throw new BadRequestException(`Email exist : ${createEmailListDto.email}`)
    }
    return await this.prisma.emailList.create({
      data: {email: createEmailListDto.email },
    });
  }
  

  async removeEmail(id_email: string) {
    const email = await this.prisma.emailList.findUnique({
      where : {id_email : id_email}
    })
    if(!email){
      throw new BadRequestException(`This email ${id_email} NOT FOUND`)
    }
    return this.prisma.emailList.delete({ where: { id_email : id_email } });
  }



  async updateEmail(id_email : string, updateEmailListDto:UpdateEmailListDto){
    const email = await this.prisma.emailList.findUnique({
      where : {id_email : id_email}
    })
    if(!email){
      throw new BadRequestException(`This ID ${id_email} NOT FOUND`)
    }
    const updated = await this.prisma.emailList.update({
      where : {id_email:id_email},
      data : {
        ...updateEmailListDto
      }
    })
    return updated
  }

  
  async getAllEmails() {
    return this.prisma.emailList.findMany();
  }

 
}
