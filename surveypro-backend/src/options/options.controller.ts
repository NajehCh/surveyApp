import { Controller, Post, Body, UseGuards, Get, UsePipes, ValidationPipe, Param, Patch, Delete } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/common.service';
import { AuthService } from 'src/auth/auth.service';
import { AdminService } from 'src/admin/admin.service';
import { OptionsService } from './options.service';
import { AdminGuard } from 'src/common/guards/permissions.guards';
import { CreateOptionDTO } from './Dtos/create-option.dto';
import { UpdateOptionDTO } from './Dtos/update-option.dto';

@Controller('options')
export class OptionsController {
    constructor(private readonly optionService : OptionsService){}

    /**
     * 
     * @param createOptionDTO 
     * @returns 
     */
    @Post('create')
    @UseGuards(JwtAuthGuard,AdminGuard)
    @UsePipes(new ValidationPipe ({whitelist:true, transform:true}))
    async createOptionController(@Body() createOptionDTO:CreateOptionDTO){
        return this.optionService.createOption(createOptionDTO)
    }
    
    @Get("all-options")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async getOptionsController(){
        return this.optionService.findAllOption()
    }

    
    @Get(":id_question")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async getAllOptionsController(@Param('id_question') id_question:string ){
        return this.optionService.findAll(id_question)
    }

    @Patch(":id_option")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async updateOptionController(@Param('id_option') id_option:string,@Body() updateOptionDTO:UpdateOptionDTO ){
        return this.optionService.updateOption(id_option,updateOptionDTO)
    }

    @Delete(":id_option")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async deleteOptionController(@Param('id_option') id_option:string){
        return this.optionService.deleteOption(id_option)
    }
    



}

