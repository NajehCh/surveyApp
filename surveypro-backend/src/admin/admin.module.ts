import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from 'prisma/prisma.service';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [AdminController],
    providers: [PrismaService, AdminService],
})
export class AdminModule {}
