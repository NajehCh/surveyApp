import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { EnquetesService } from './enquetes.service';
import { CreateEnqueteDTO ,EnqueteStatus} from './Dtos/create-enquete.dto';
import { AdminGuard } from 'src/common/guards/permissions.guards';
import { JwtAuthGuard } from 'src/common/common.service';
import { UpdateEnqueteDTO } from './Dtos/update-enquete.dto';


@Controller('enquetes')
export class EnquetesController {
    constructor (private readonly enquetesServices : EnquetesService){}

    @Post("auth/create")
    @UseGuards(JwtAuthGuard, AdminGuard)
    create(@Body() createEnqueteDTO:CreateEnqueteDTO) {
    return this.enquetesServices.createEnquete(createEnqueteDTO);
  }

  @Get("")
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async getEnqueteController(){
    const enquetes= await this.enquetesServices.getAllEnquetes()
    return enquetes;
  }

  @Get("/:id_enquete")
 @UseGuards(JwtAuthGuard, AdminGuard)
  async getEnqueteByIdController(@Param('id_enquete') id_enquete: string){
    if (!id_enquete || id_enquete.trim() === '') {
      throw new BadRequestException('ID de l’enquête invalide');
    }
    const enquete = await this.enquetesServices.getEnqueteById (id_enquete);
    if (!enquete) {
      throw new NotFoundException(`Enquête avec ID ${id_enquete} introuvable`);
    }
    return {
      statusCode: 200,
      message: 'Enquête récupérée avec succès',
      data: enquete,
    };
  }


  @Get("user/:id_enquete")
  async getUserEnqueteController(@Param('id_enquete') id_enquete: string){
    if (!id_enquete || id_enquete.trim() === '') {
      throw new BadRequestException('ID de l’enquête invalide');
    }
    const enquete = await this.enquetesServices.getUserEnqueteById (id_enquete);
    if (!enquete) {
      throw new NotFoundException(`Enquête avec ID ${id_enquete} introuvable`);
    }
    return {
      statusCode: 200,
      message: 'Enquête récupérée avec succès',
      data: enquete,
    };
  }
  @Patch("auth/edit/enquete/:id_enquete")
  async updateEnqueteController(@Param('id_enquete') id_enquete: string,@Body() updateEnqueteDTO:UpdateEnqueteDTO){
    if (!id_enquete || id_enquete.trim() === '') {
      throw new BadRequestException('ID de l’enquête invalide');
    }
    const enquete = await this.enquetesServices.updateEnquete(id_enquete,updateEnqueteDTO);
    return {
      statusCode: 200,
      message: 'Enquête modifiée avec succès',
      data: enquete,
    };

  }
  @Patch("auth/edit_status/:id_enquete")
  async updateStatusEnqueteController(@Param('id_enquete') id_enquete: string,@Body('status') status:EnqueteStatus){
    if (!id_enquete || id_enquete.trim() === '') {
      throw new BadRequestException('ID de l’enquête invalide');
    }
    const enquete = await this.enquetesServices.changeStatusEnquete(id_enquete,status);
    return {
      statusCode: 200,
      message: 'Enquête récupérée avec succès',
      data: enquete,
    };

  }

  @Delete("auth/delete/:id_enquete")
  async deleteEnqueteController(@Param('id_enquete') id_enquete: string){
    if (!id_enquete || id_enquete.trim() === '') {
      throw new BadRequestException('ID de l’enquête invalide');
    }
    const enquete = await this.enquetesServices.deleteEnquete(id_enquete);
    return {
      statusCode: 200,
      message: 'Enquete supprimer avec succès',
      data: enquete,
    };

  }

  @Get("prerender-ids")
  async getIds(){
    const enquetes= await this.enquetesServices.getAllEnquetes()
    return enquetes.map(e => ({ id_enquete: e.id_enquete }));
  }
}
