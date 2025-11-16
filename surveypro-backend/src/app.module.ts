import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ← Ajouter
import { AppController } from './app.controller';
import { EnquetesModule } from './enquetes/enquetes.module';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ResponseModule } from './response/response.module';
import { EmailListModule } from './email-list/email-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ← Important pour charger le .env
    PrismaModule,
    EnquetesModule,
    QuestionsModule,
    OptionsModule,
    AuthModule,
    AdminModule,
    ResponseModule,
    EmailListModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
