import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/common.service';
import { AdminGuard } from 'src/common/guards/permissions.guards';
import { CreateResponseDTO } from './Dtos/create-response.dto';
import { ResponseService } from './response.service';


@Controller('responses')
export class ResponseController {

    constructor (private  readonly responesService :ResponseService){}
    
    
    @Post('create')
    // @UsePipes(new ValidationPipe({whitelist:true,transform:true}))
    async createResponseController(@Body() createResponseDto:CreateResponseDTO){
        return this.responesService.createResponse(createResponseDto)
    }

    @Get("")
    @UseGuards(JwtAuthGuard,AdminGuard)
    async getResponsesController(){
      const responses= await this.responesService.getAllResponses()
      return responses;
    }
    @Get(':id_enquete')
    async getResponseByEnqueteController(@Param("id_enquete") id_enquete : string){
      const responses= await this.responesService.getAllResponsesbyEnquete(id_enquete)
      return responses;
    }
}

