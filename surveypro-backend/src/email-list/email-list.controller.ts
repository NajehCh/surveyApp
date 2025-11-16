import { Controller, Post, Delete, Get, Body, UseGuards, UsePipes, ValidationPipe, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/common.service';
import { AdminGuard } from 'src/common/guards/permissions.guards';
import { EmailListService } from './email-list.service';
import { CreateEmailListDto } from './dto/create-email-list.dto';
import { UpdateEmailListDto } from './dto/update-email-list.dto';
import { SendEnqueteDto } from './dto/send-enquete.dto';
@Controller('emails')
@UseGuards(JwtAuthGuard, AdminGuard)
export class EmailListController {
  constructor(private readonly emailListService: EmailListService) {}




  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ValidationPipe ({whitelist:true, transform:true}))
  async addEmail(@Body() createEmailListDto: CreateEmailListDto) {
  return this.emailListService.addEmail(createEmailListDto);
  }

  @Post("send-email")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ValidationPipe ({whitelist:true, transform:true}))
  async sendEmail(@Body() sendEnqueteDto: SendEnqueteDto) {
  return this.emailListService.sendEnquete(sendEnqueteDto.emails,sendEnqueteDto.id_enquete);
  }


  @Delete(":id_email")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async removeEmail(@Param('id_email') id_email: string) {
    return this.emailListService.removeEmail(id_email);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAll() {
    return this.emailListService.getAllEmails();
  }

  @Patch(":id_email")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateEmail(
    @Param('id_email') id_email: string,
    @Body() updateEmailListDto: UpdateEmailListDto
  ) {
    return this.emailListService.updateEmail(id_email, updateEmailListDto);
  }
  

}
