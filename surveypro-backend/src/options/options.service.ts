import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOptionDTO } from './Dtos/create-option.dto';
import { PrismaService } from "prisma/prisma.service";
import { UpdateOptionDTO } from './Dtos/update-option.dto';

@Injectable()
export class OptionsService {
    constructor (private prisma:PrismaService){}

    /**
     * Create an option 
     * @param createEnqueteDto 
     * @returns 
     */
    async createOption(createEnqueteDto: CreateOptionDTO) {
        const { text_option,id_question } = createEnqueteDto;
        const option = await this.prisma.option.create({
            data:{
                text_option,
                id_question
            }
        })
    return option
    
    }

    /**
     * Find One Option 
     * @param id_option 
     * @returns 
     */
    async findOneOption(id_option: string){

        const option = await this.prisma.option.findUnique({
            where : {id_option:id_option}
        });
        if(!option){
            throw new BadRequestException(`Option with id ${id_option} not found `)
        }
        return option;
    }

    /**
     * Find Option By id question 
     * @param id_question 
     */
    async findAll(id_question: string){
        const question = await this.prisma.question.findUnique({
            where:{id_question}
        })
        if(!question){
            throw new BadRequestException(`Question with id ${id_question} not found`)
        }
        const options = await this.prisma.option.findMany({
            where : {id_question}
        })
        return options
    }

      /**
     * Update option
     * @param id_option 
     */
      async updateOption(id_option: string, data:Partial<UpdateOptionDTO>){
        const option = await this.prisma.option.findUnique({
            where : {id_option}
        });
        if(!option){
            throw new BadRequestException(`Option with id ${id_option} not found `)
        }
        if(data.id_question){
            const question = await this.prisma.question.findUnique({
                where:{ id_question:data.id_question}
            })
            if(!question){
                throw new BadRequestException(`Question with id ${data.id_question} not found`)
            }
        }
        return this.prisma.option.update({
            where : {id_option},
            data : {
                text_option: data.text_option ?? option.text_option,
            }
        })
    }

    /**
     * Delete Option
     * @param id_option 
     * @returns 
     */
    async deleteOption(id_option:string){
        const option = await this.prisma.option.findUnique({
            where : {id_option}
        });
        if(!option){
            throw new BadRequestException(`Option with id ${id_option} not found `)
        }
        return this.prisma.option.delete({ where: { id_option } });

    }
    /**
     * Find Option By id question 
     * 
     */
    async findAllOption(){
        
        const options = await this.prisma.option.findMany({})
        return options
    }
}
