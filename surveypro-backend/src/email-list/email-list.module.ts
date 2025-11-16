import { Module } from '@nestjs/common';
import { EmailListService } from './email-list.service';
import { EmailListController } from './email-list.controller';

@Module({
  controllers: [EmailListController],
  providers: [EmailListService],
})
export class EmailListModule {}
