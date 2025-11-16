import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from 'src/common/common.service';
import { AdminGuard } from 'src/common/guards/permissions.guards';
import { CreateQuestionDTO } from './Dtos/create-question.dto'; 
import { UpdateQuestionDTO } from './Dtos/update-question.dto'; 

@Controller('questions')
export class QuestionsController {

    constructor(private readonly questionService : QuestionsService){}
    
    @Post('create')
    @UseGuards(JwtAuthGuard,AdminGuard)
    @UsePipes(new ValidationPipe ({whitelist:true, transform:true}))
    async createOptionController(@Body() createQuestionDTO:CreateQuestionDTO){
        return this.questionService.createQuestion(createQuestionDTO)
    }

    @Get(":id_question")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async getQuestionController(@Param('id_question') id_question:string ){
        return this.questionService.findQuestion(id_question)
    }

    @Get("enquete/:id_enquete")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async getQuestionsByEnqueteController(@Param('id_enquete') id_enquete:string ){
        return this.questionService.findQuestionByEnquete(id_enquete)
    }

    @Get("")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async getQuestionsController(){
        return this.questionService.findAll()
    }

    
    @Patch(":id_question")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async updateQuestionController(@Param('id_question') id_question:string,@Body() updateQuestionDTO:UpdateQuestionDTO ){
        return this.questionService.updateQuestion(id_question,updateQuestionDTO)
    }

    @Delete(":id_question")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async deleteQuestionController(@Param('id_question') id_question:string){
        return this.questionService.deleteQuestion(id_question)
    }

}
