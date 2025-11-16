import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionDTO } from './Dtos/create-question.dto'; 
import { PrismaService } from "prisma/prisma.service";
import { UpdateQuestionDTO } from './Dtos/update-question.dto'; 
import { QuestionType } from '@prisma/client';




@Injectable()
export class QuestionsService {
    constructor (private prisma:PrismaService){}

    /**
     * 
     * @param createQuestionDTO 
     * @returns 
     */
    async createQuestion(createQuestionDTO: CreateQuestionDTO) {

        const { text_question, id_enquete, required, type, options } = createQuestionDTO;
        const question = await this.prisma.question.create({
            data: {
                text_question,
                id_enquete,
                required: required ?? false,
                type: type as QuestionType,
                options: options && options.length > 0
                    ? {
                        create: options.map(text_option => ({ text_option }))
                      }
                    : undefined
            },
            include: { options: true } // <-- nom exact du champ relationnel
        });
    
        return question;
    }
    
    
    

    /**
     *  
     * @param id_question 
     * @returns 
     */
    async findQuestion(id_question: string){
        const question = await this.prisma.question.findUnique({
            where : {id_question}
        });
        if(!question){
            throw new BadRequestException(`Option with id ${id_question} not found `)
        }
        return question;
    }
    /**
     *  
     * @param id_enquete 
     * @returns 
     */
        async findQuestionByEnquete(id_enquete: string) {
            const questions = await this.prisma.question.findMany({
            where: { id_enquete },
            include: {
                options: true, // récupère toutes les options liées à chaque question
            },
            });
            return questions;
        }
  

    /**
     * Find All
     * @param  
     */
    async findAll(){
        const questions = await this.prisma.question.findMany({})
        return questions
    }


    /**
     * 
     * @param id_question
     * @param data
     * @returns 
     */
    async updateQuestion(id_question: string, data:Partial<UpdateQuestionDTO>){
       const question = await this.prisma.question.findUnique({
         where : {id_question}
        });
        if(!question){
            throw new BadRequestException(`Question with id ${id_question} not found `)
        }
        if(data.id_enquete){
            const enquete = await this.prisma.enquete.findUnique({
                where:{ id_enquete:data.id_enquete}
            })
            if(!enquete){
                throw new BadRequestException(`Question with id ${data.id_enquete} not found`)
            }
        }

        return this.prisma.question.update({
            where: { id_question },
            data: {
              text_question: data.text_question ?? question.text_question,
              required: data.required ?? question.required,
              type: data.type ? (data.type as QuestionType) : question.type,
              updatedAt: new Date(),
            },
            include: {
              options: true, // ← ça permet de renvoyer aussi les options
            }
          });
          
    }

    /**
     * Delete Option
     * @param id_question 
     * @returns 
     */
    async deleteQuestion(id_question:string){
        const question = await this.prisma.question.findUnique({
            where : {id_question}
        });
        if(!id_question){
            throw new BadRequestException(`Option with id ${id_question} not found `)
        }
        return this.prisma.question.delete({ where: { id_question } });

    }
}
