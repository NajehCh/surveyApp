import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/common/common.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'prisma/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //@UseGuards(JwtAuthGuard) // si besoin de protéger la route
  @Post('create')
  async createAdmin(@Body() body: { name: string; email: string; password: string }) {
    return this.adminService.createAdmin(body.name, body.email, body.password);
  }


  @Post('login')
  async loginAdmin(@Body() body: { email: string; password: string }) {
   return this.adminService.loginAdmin(body.email,body.password)
}


  // // Route test protégée
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
